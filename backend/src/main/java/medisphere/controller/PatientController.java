package medisphere.controller;

import medisphere.model.Patient;
import medisphere.model.Consent;
import medisphere.repository.PatientRepository;
import medisphere.repository.ConsentRepository;
import medisphere.service.AuditLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;
    private final ConsentRepository consentRepository;
    private final AuditLogService auditLogService;

    public PatientController(
            PatientRepository patientRepository,
            ConsentRepository consentRepository,
            AuditLogService auditLogService) {

        this.patientRepository = patientRepository;
        this.consentRepository = consentRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }

    @GetMapping("/{patientId}")
    public Patient getPatientById(@PathVariable String patientId) {

        Consent consent = consentRepository.findByPatientId(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient consent not found"));

        if (!consent.isGranted()) {
            throw new RuntimeException(
                    "Patient consent has not been granted");
        }

        Patient patient = patientRepository.findByPatientId(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found"));

        // Record successful patient access
        auditLogService.log(
                "admin",
                "GET_PATIENT",
                patientId
        );

        return patient;
    }
}