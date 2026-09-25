package medisphere.service;

import medisphere.dto.LoginResponse;
import medisphere.dto.RegisterRequest;
import medisphere.dto.RegisterResponse;
import medisphere.model.*;
import medisphere.repository.*;
import medisphere.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final HealthTwinRepository healthTwinRepository;
    private final ConsentRepository consentRepository;
    private final VitalsRepository vitalsRepository;
    private final DoctorRepository doctorRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PatientRepository patientRepository,
            HealthTwinRepository healthTwinRepository,
            ConsentRepository consentRepository,
            VitalsRepository vitalsRepository,
            DoctorRepository doctorRepository,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.healthTwinRepository = healthTwinRepository;
        this.consentRepository = consentRepository;
        this.vitalsRepository = vitalsRepository;
        this.doctorRepository = doctorRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(String username, String password) {
        if (username == null || username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        User user = userRepository.findByUsername(username.trim().toLowerCase())
                .or(() -> userRepository.findByUsername(username.trim()))
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "User '" + username + "' is not registered. Please register your account before logging in."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password for user '" + username + "'.");
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole()
        );

        String patientId = user.getPatientId();
        String fullName = user.getFullName();

        // Resolve patient ID for Patients if unassigned
        if ("PATIENT".equalsIgnoreCase(user.getRole())) {
            if (patientId == null || patientId.isBlank()) {
                if ("sarahm".equalsIgnoreCase(user.getUsername())) {
                    patientId = "patient-002";
                    fullName = "Sarah M.";
                } else if ("patient".equalsIgnoreCase(user.getUsername())) {
                    patientId = "patient-001";
                    fullName = "John Doe";
                } else {
                    // Try looking up patient by ID or match
                    Patient p = patientRepository.findByPatientId(user.getUsername())
                            .orElse(null);
                    if (p != null) {
                        patientId = p.getPatientId();
                        fullName = p.getName();
                    } else {
                        patientId = "patient-001";
                        fullName = user.getUsername();
                    }
                }
            }
        } else if ("DOCTOR".equalsIgnoreCase(user.getRole())) {
            if (fullName == null || fullName.isBlank()) {
                fullName = "Dr. " + user.getUsername().substring(0, 1).toUpperCase() + user.getUsername().substring(1);
            }
        } else if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            if (fullName == null || fullName.isBlank()) {
                fullName = "System Administrator";
            }
        }

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getRole(),
                patientId,
                fullName
        );
    }

    public RegisterResponse register(RegisterRequest req) {
        if (req == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration payload is missing");
        }

        String username = req.getUsername() != null ? req.getUsername().trim().toLowerCase() : "";
        String password = req.getPassword() != null ? req.getPassword().trim() : "";
        String role = req.getRole() != null && !req.getRole().isBlank() ? req.getRole().trim().toUpperCase() : "PATIENT";

        if (username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }

        if (password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        if (userRepository.findByUsername(username).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username '" + username + "' is already registered. Please sign in or use a different username.");
        }

        if (!role.equals("PATIENT") && !role.equals("DOCTOR")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration is only permitted for PATIENT or DOCTOR roles.");
        }

        String encodedPassword = passwordEncoder.encode(password);
        String assignedPatientId = null;
        String resolvedFullName = req.getFullName() != null && !req.getFullName().isBlank()
                ? req.getFullName().trim()
                : username;

        if ("PATIENT".equals(role)) {
            // Determine unique patient ID
            long count = patientRepository.count() + 1;
            assignedPatientId = String.format("patient-%03d", count);
            if (patientRepository.findByPatientId(assignedPatientId).isPresent()) {
                assignedPatientId = "patient-" + (System.currentTimeMillis() % 100000);
            }

            int age = req.getAge() > 0 ? req.getAge() : 45;
            String gender = req.getGender() != null && !req.getGender().isBlank() ? req.getGender().trim() : "Other";

            // 1. Create Patient
            Patient patient = new Patient(assignedPatientId, resolvedFullName, age, gender);
            patientRepository.save(patient);

            // 2. Create Consent
            consentRepository.save(new Consent(
                    assignedPatientId,
                    true,
                    "AI_PREDICTIVE_RISK_AND_DIGITAL_TWIN",
                    LocalDateTime.now()
            ));

            // 3. Create Health Twin
            List<String> conditions = (req.getCondition() != null && !req.getCondition().isBlank())
                    ? List.of(req.getCondition().trim())
                    : List.of("General Health Baseline");

            List<String> medications = (req.getMedication() != null && !req.getMedication().isBlank())
                    ? List.of(req.getMedication().trim())
                    : List.of("None");

            healthTwinRepository.save(new HealthTwin(
                    assignedPatientId,
                    resolvedFullName,
                    age,
                    gender,
                    conditions,
                    medications
            ));

            // 4. Create baseline Vitals
            vitalsRepository.save(new Vitals(
                    assignedPatientId,
                    72.0,
                    120.0,
                    80.0,
                    36.6,
                    98.0,
                    LocalDateTime.now()
            ));

        } else if ("DOCTOR".equals(role)) {
            String doctorName = resolvedFullName;
            if (!doctorName.toLowerCase().startsWith("dr.") && !doctorName.toLowerCase().startsWith("dr ")) {
                doctorName = "Dr. " + doctorName;
            }
            resolvedFullName = doctorName;

            String spec = req.getSpecialization() != null && !req.getSpecialization().isBlank()
                    ? req.getSpecialization().trim()
                    : "Cardiovascular Medicine & Digital Health";

            String dept = req.getDepartment() != null && !req.getDepartment().isBlank()
                    ? req.getDepartment().trim()
                    : "Cardiology & Twin Modeling";

            String email = req.getEmail() != null && !req.getEmail().isBlank()
                    ? req.getEmail().trim()
                    : username + "@medisphere.io";

            String phone = req.getPhone() != null && !req.getPhone().isBlank()
                    ? req.getPhone().trim()
                    : "+1 (555) 234-8901";

            String license = req.getLicenseNumber() != null && !req.getLicenseNumber().isBlank()
                    ? req.getLicenseNumber().trim()
                    : "MD-" + (100000 + (System.currentTimeMillis() % 900000));

            // Create Doctor record
            doctorRepository.save(new Doctor(
                    doctorName,
                    spec,
                    email,
                    dept,
                    phone,
                    license
            ));
        }

        // Save User
        User user = new User(
                username,
                encodedPassword,
                role,
                assignedPatientId,
                resolvedFullName
        );
        userRepository.save(user);

        return new RegisterResponse(
                "Account registered successfully! You may now sign in.",
                username,
                role
        );
    }
}