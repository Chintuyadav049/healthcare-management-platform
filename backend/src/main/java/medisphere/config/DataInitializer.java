package medisphere.config;

import medisphere.model.*;
import medisphere.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeData(
            UserRepository userRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            ConsentRepository consentRepository,
            HealthTwinRepository healthTwinRepository,
            VitalsRepository vitalsRepository,
            ModelVersionRepository modelVersionRepository,
            FederatedRoundRepository federatedRoundRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            try {
                // Initialize default system users
                if (userRepository.findByUsername("admin").isEmpty()) {
                    userRepository.save(new User("admin", passwordEncoder.encode("admin123"), "ADMIN"));
                }
                if (userRepository.findByUsername("doctor").isEmpty()) {
                    userRepository.save(new User("doctor", passwordEncoder.encode("doctor123"), "DOCTOR"));
                }
                if (userRepository.findByUsername("patient").isEmpty()) {
                    userRepository.save(new User("patient", passwordEncoder.encode("patient123"), "PATIENT"));
                }

                // Seed initial doctors
                if (doctorRepository.count() == 0) {
                    doctorRepository.save(new Doctor(
                            "Dr. Sarah Jenkins",
                            "Cardiovascular Medicine & Digital Health",
                            "doctor@medisphere.io",
                            "Cardiology & Twin Modeling",
                            "+1 (555) 234-8901",
                            "MD-884920"
                    ));
                    doctorRepository.save(new Doctor(
                            "Dr. Marcus Vance",
                            "Endocrinology & Metabolic Risk",
                            "marcus.vance@hospital-beta.org",
                            "Endocrinology & Diabetes",
                            "+1 (555) 482-1193",
                            "MD-773104"
                    ));
                    doctorRepository.save(new Doctor(
                            "Dr. Elena Rostova",
                            "Critical Care & Clinical AI",
                            "e.rostova@hospital-gamma.org",
                            "Intensive Care & Telemetry",
                            "+1 (555) 791-3042",
                            "MD-991205"
                    ));
                }

                // Seed John Doe
                if (patientRepository.findByPatientId("patient-001").isEmpty()) {
                    patientRepository.save(new Patient("patient-001", "John Doe", 58, "Male"));
                }

                // Seed Consent for John Doe
                if (consentRepository.findByPatientId("patient-001").isEmpty()) {
                    consentRepository.save(new Consent("patient-001", true, "AI_RISK_PREDICTION_AND_FEDERATED_LEARNING", LocalDateTime.now()));
                }

                // Seed Health Twin for John Doe
                if (healthTwinRepository.findByPatientId("patient-001").isEmpty()) {
                    healthTwinRepository.save(new HealthTwin(
                            "patient-001",
                            "John Doe",
                            58,
                            "Male",
                            List.of("Hypertension", "Type 2 Diabetes"),
                            List.of("Amlodipine 5mg", "Metformin 500mg")
                    ));
                }

                // Seed Vitals for John Doe (Stage 2 Hypertension BP 142/88)
                if (vitalsRepository.findByPatientId("patient-001").isEmpty()) {
                    vitalsRepository.save(new Vitals(
                            "patient-001",
                            78.0,
                            142.0,
                            88.0,
                            36.8,
                            97.0,
                            LocalDateTime.now()
                    ));
                }

                // Seed Model Versions
                if (modelVersionRepository.findByVersionId("v2.4.0-fed-cvd").isEmpty()) {
                    modelVersionRepository.save(new ModelVersion(
                            "v2.4.0-fed-cvd",
                            "TensorFlow Federated CVD Neural Network",
                            "Dense Residual MLP (FedAvg + DP-SGD)",
                            47,
                            91.4,
                            0.942,
                            0.908,
                            48500,
                            "ACTIVE",
                            "sha256:7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
                            LocalDateTime.now().minusHours(4)
                    ));

                    modelVersionRepository.save(new ModelVersion(
                            "v2.3.1-fed-cvd",
                            "Federated ASCVD Risk Estimator",
                            "Wide & Deep Neural Network",
                            35,
                            88.7,
                            0.918,
                            0.881,
                            36000,
                            "CANDIDATE",
                            "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            LocalDateTime.now().minusDays(5)
                    ));

                    modelVersionRepository.save(new ModelVersion(
                            "v1.2.0-fed-diabetes",
                            "Multi-Organ Diabetes Complications Net",
                            "Multi-Task Deep Learning",
                            42,
                            89.8,
                            0.925,
                            0.892,
                            42000,
                            "ACTIVE",
                            "sha256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
                            LocalDateTime.now().minusDays(2)
                    ));

                    modelVersionRepository.save(new ModelVersion(
                            "v1.0.0-baseline",
                            "Framingham Baseline Risk Model",
                            "Logistic Regression Classifier",
                            0,
                            78.2,
                            0.812,
                            0.774,
                            12000,
                            "ARCHIVED",
                            "sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
                            LocalDateTime.now().minusDays(20)
                    ));
                }

                // Seed Federated Round 47
                if (federatedRoundRepository.findByRoundNumber(47).isEmpty()) {
                    federatedRoundRepository.save(new FederatedRound(
                            47,
                            0.181,
                            91.4,
                            1.25,
                            1e-5,
                            4,
                            1420L,
                            Map.of(
                                    "Hospital Alpha", 0.179,
                                    "Hospital Beta", 0.184,
                                    "Hospital Gamma", 0.176,
                                    "Hospital Delta", 0.188
                            ),
                            Map.of(
                                    "Hospital Alpha", 91.8,
                                    "Hospital Beta", 91.1,
                                    "Hospital Gamma", 92.0,
                                    "Hospital Delta", 90.7
                            ),
                            LocalDateTime.now().minusMinutes(12)
                    ));
                }

                System.out.println("MediSphere clinical data, users, and federated learning models initialized successfully.");
            } catch (Exception e) {
                System.out.println("DataInitializer: Non-fatal initialization notice (MongoDB might connect lazily): " + e.getMessage());
            }
        };
    }
}