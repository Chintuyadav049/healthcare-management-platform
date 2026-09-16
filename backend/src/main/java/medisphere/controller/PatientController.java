package medisphere.controller;

import medisphere.dto.DoctorPatientCreateRequest;
import medisphere.model.Patient;
import medisphere.model.Consent;
import medisphere.model.HealthTwin;
import medisphere.model.User;
import medisphere.model.Vitals;
import medisphere.repository.PatientRepository;
import medisphere.repository.ConsentRepository;
import medisphere.repository.HealthTwinRepository;
import medisphere.repository.UserRepository;
import medisphere.repository.VitalsRepository;
import medisphere.service.AuditLogService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;
    private final ConsentRepository consentRepository;
    private final HealthTwinRepository healthTwinRepository;
    private final VitalsRepository vitalsRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public PatientController(
            PatientRepository patientRepository,
            ConsentRepository consentRepository,
            HealthTwinRepository healthTwinRepository,
            VitalsRepository vitalsRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuditLogService auditLogService) {

        this.patientRepository = patientRepository;
        this.consentRepository = consentRepository;
        this.healthTwinRepository = healthTwinRepository;
        this.vitalsRepository = vitalsRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        if (patient.getPatientId() == null || patient.getPatientId().isBlank()) {
            patient.setPatientId("patient-" + (System.currentTimeMillis() % 1000000));
        }

        Patient saved = patientRepository.save(patient);

        // Auto-provision HIPAA research consent
        if (consentRepository.findByPatientId(saved.getPatientId()).isEmpty()) {
            consentRepository.save(new Consent(
                    saved.getPatientId(),
                    true,
                    "AI_PREDICTIVE_RISK_AND_DIGITAL_TWIN",
                    LocalDateTime.now()
            ));
        }

        // Auto-provision base Health Twin if not existing
        if (healthTwinRepository.findByPatientId(saved.getPatientId()).isEmpty()) {
            healthTwinRepository.save(new HealthTwin(
                    saved.getPatientId(),
                    saved.getName(),
                    saved.getAge(),
                    saved.getGender(),
                    Collections.emptyList(),
                    Collections.emptyList()
            ));
        }

        // Auto-provision user account for the patient
        String username = saved.getPatientId().toLowerCase();
        if (userRepository.findByUsername(username).isEmpty()) {
            userRepository.save(new User(username, passwordEncoder.encode("patient123"), "PATIENT"));
        }

        auditLogService.log("doctor", "CREATE_PATIENT", saved.getPatientId());
        return saved;
    }

    @PostMapping("/register")
    public Patient registerPatientByDoctor(@RequestBody DoctorPatientCreateRequest req) {
        if (req.getName() == null || req.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient name is required");
        }

        String pId = req.getPatientId();
        if (pId == null || pId.isBlank()) {
            long count = patientRepository.count() + 1;
            pId = String.format("patient-%03d", count);
            if (patientRepository.findByPatientId(pId).isPresent()) {
                pId = "patient-" + (System.currentTimeMillis() % 100000);
            }
        }

        int age = req.getAge() > 0 ? req.getAge() : 45;
        String gender = req.getGender() != null && !req.getGender().isBlank() ? req.getGender() : "Other";

        Patient patient = new Patient(pId, req.getName(), age, gender);
        Patient saved = patientRepository.save(patient);

        // Save Consent
        if (consentRepository.findByPatientId(pId).isEmpty()) {
            consentRepository.save(new Consent(
                    pId,
                    true,
                    "AI_PREDICTIVE_RISK_AND_DIGITAL_TWIN",
                    LocalDateTime.now()
            ));
        }

        // Save Health Twin
        List<String> conditions = req.getConditions() != null ? req.getConditions() : Collections.emptyList();
        List<String> medications = req.getMedications() != null ? req.getMedications() : Collections.emptyList();
        healthTwinRepository.save(new HealthTwin(
                pId,
                saved.getName(),
                saved.getAge(),
                saved.getGender(),
                conditions,
                medications
        ));

        // Save initial Vitals
        double hr = req.getHeartRate() != null && req.getHeartRate() > 0 ? req.getHeartRate() : 75.0;
        double sbp = req.getSystolicBP() != null && req.getSystolicBP() > 0 ? req.getSystolicBP() : 125.0;
        double dbp = req.getDiastolicBP() != null && req.getDiastolicBP() > 0 ? req.getDiastolicBP() : 82.0;
        double temp = req.getTemperature() != null && req.getTemperature() > 0 ? req.getTemperature() : 36.6;
        double spo2 = req.getOxygenSaturation() != null && req.getOxygenSaturation() > 0 ? req.getOxygenSaturation() : 98.0;

        vitalsRepository.save(new Vitals(pId, hr, sbp, dbp, temp, spo2, LocalDateTime.now()));

        // Provision user account for patient login
        String username = pId.toLowerCase();
        if (userRepository.findByUsername(username).isEmpty()) {
            userRepository.save(new User(username, passwordEncoder.encode("patient123"), "PATIENT"));
        }

        if (saved.getName() != null && !saved.getName().isBlank()) {
            String friendly = saved.getName().toLowerCase().replaceAll("\\s+", "").replaceAll("[^a-z0-9]", "");
            if (!friendly.isBlank() && userRepository.findByUsername(friendly).isEmpty()) {
                userRepository.save(new User(friendly, passwordEncoder.encode("patient123"), "PATIENT"));
            }
        }

        auditLogService.log("doctor", "REGISTER_PATIENT", pId);
        return saved;
    }

    @GetMapping("/{patientId}")
    public Patient getPatientById(@PathVariable String patientId) {

        Consent consent = consentRepository.findByPatientId(patientId).orElse(null);
        if (consent == null) {
            consent = consentRepository.save(new Consent(
                    patientId,
                    true,
                    "AUTO_CONSENT_CLINICAL_CARE",
                    LocalDateTime.now()
            ));
        }

        if (!consent.isGranted()) {
            throw new RuntimeException("Patient consent has not been granted");
        }

        Patient patient = patientRepository.findByPatientId(patientId)
                .or(() -> patientRepository.findById(patientId))
                .orElseThrow(() -> new RuntimeException("Patient not found: " + patientId));

        // Record successful patient access
        auditLogService.log("clinical_user", "GET_PATIENT", patientId);

        return patient;
    }

    @DeleteMapping("/{patientId}")
    public void deletePatient(@PathVariable String patientId) {
        patientRepository.findByPatientId(patientId)
                .ifPresent(patientRepository::delete);
    }
}