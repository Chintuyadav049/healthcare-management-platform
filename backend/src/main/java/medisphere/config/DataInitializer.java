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

@Configuration(proxyBeanMethods = false)
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
            AlertRepository alertRepository,
            WearableDeviceRepository wearableDeviceRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            try {
                // Initialize default system users
                if (userRepository.findByUsername("admin").isEmpty()) {
                    userRepository.save(new User("admin", passwordEncoder.encode("admin123"), "ADMIN", null, "System Administrator"));
                }
                if (userRepository.findByUsername("doctor").isEmpty()) {
                    userRepository.save(new User("doctor", passwordEncoder.encode("doctor123"), "DOCTOR", null, "Dr. Sarah Jenkins"));
                }
                if (userRepository.findByUsername("patient").isEmpty()) {
                    userRepository.save(new User("patient", passwordEncoder.encode("patient123"), "PATIENT", "patient-001", "John Doe"));
                }
                if (userRepository.findByUsername("sarahm").isEmpty()) {
                    userRepository.save(new User("sarahm", passwordEncoder.encode("patient123"), "PATIENT", "patient-002", "Sarah M."));
                }
                if (userRepository.findByUsername("patient-002").isEmpty()) {
                    userRepository.save(new User("patient-002", passwordEncoder.encode("patient123"), "PATIENT", "patient-002", "Sarah M."));
                }
                if (userRepository.findByUsername("robertsmith").isEmpty()) {
                    userRepository.save(new User("robertsmith", passwordEncoder.encode("patient123"), "PATIENT", "patient-003", "Robert Smith"));
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

                // Seed Sarah M. for Milestone 3 (Sarah M. AFib deliverable)
                if (patientRepository.findByPatientId("patient-002").isEmpty()) {
                    patientRepository.save(new Patient("patient-002", "Sarah M.", 48, "Female"));
                }
                if (consentRepository.findByPatientId("patient-002").isEmpty()) {
                    consentRepository.save(new Consent("patient-002", true, "AI_RISK_PREDICTION_AND_CONTINUOUS_MONITORING", LocalDateTime.now()));
                }
                if (healthTwinRepository.findByPatientId("patient-002").isEmpty()) {
                    healthTwinRepository.save(new HealthTwin(
                            "patient-002",
                            "Sarah M.",
                            48,
                            "Female",
                            List.of("Paroxysmal Atrial Fibrillation", "Hypertension"),
                            List.of("Metoprolol 25mg BID", "Apixaban 5mg BID")
                    ));
                }
                if (vitalsRepository.findByPatientId("patient-002").isEmpty()) {
                    vitalsRepository.save(new Vitals(
                            "patient-002",
                            145.0,
                            135.0,
                            85.0,
                            36.9,
                            98.0,
                            LocalDateTime.now().minusMinutes(3)
                    ));
                }

                // Seed Robert Smith (patient-003)
                if (patientRepository.findByPatientId("patient-003").isEmpty()) {
                    patientRepository.save(new Patient("patient-003", "Robert Smith", 62, "Male"));
                }
                if (consentRepository.findByPatientId("patient-003").isEmpty()) {
                    consentRepository.save(new Consent("patient-003", true, "AI_RISK_PREDICTION_AND_CONTINUOUS_MONITORING", LocalDateTime.now()));
                }
                if (healthTwinRepository.findByPatientId("patient-003").isEmpty()) {
                    healthTwinRepository.save(new HealthTwin(
                            "patient-003",
                            "Robert Smith",
                            62,
                            "Male",
                            List.of("Chronic Obstructive Pulmonary Disease", "Coronary Artery Disease"),
                            List.of("Tiotropium Inhaler 18mcg", "Atorvastatin 40mg", "Aspirin 81mg")
                    ));
                }
                if (vitalsRepository.findByPatientId("patient-003").isEmpty()) {
                    vitalsRepository.save(new Vitals(
                            "patient-003",
                            74.0,
                            128.0,
                            82.0,
                            36.7,
                            88.0,
                            LocalDateTime.now().minusMinutes(8)
                    ));
                }

                // Seed Wearable Devices
                if (wearableDeviceRepository.count() == 0) {
                    wearableDeviceRepository.save(new WearableDevice(
                            "DEV-AW-9021",
                            "patient-002",
                            "Sarah M.",
                            "Apple Watch Ultra 2",
                            "ECG / PPG / Accelerometer (BLE -> Kafka)",
                            84,
                            "CONNECTED_STREAMING",
                            100,
                            145.0,
                            98.0,
                            "Irregular / AFib Suspect"
                    ));

                    wearableDeviceRepository.save(new WearableDevice(
                            "DEV-WP-4412",
                            "patient-001",
                            "John Doe",
                            "Whoop 4.0 Strap",
                            "Continuous PPG / Temperature (BLE 5.2)",
                            92,
                            "CONNECTED_STREAMING",
                            50,
                            78.0,
                            97.0,
                            "Normal Sinus Rhythm"
                    ));

                    wearableDeviceRepository.save(new WearableDevice(
                            "DEV-BT-7721",
                            "patient-003",
                            "Robert Smith",
                            "BioTel Mobile Cardiac Telemetry",
                            "3-Lead Continuous ECG Patch (Cellular LTE-M)",
                            71,
                            "CONNECTED_STREAMING",
                            100,
                            74.0,
                            88.0,
                            "Hypoxemia / Nocturnal Desaturation"
                    ));
                }

                // Seed Multi-Patient Clinical Alerts (Milestone 3 Deliverables)
                if (alertRepository.count() <= 1) {
                    // Check if Sarah M. exists
                    if (alertRepository.findByPatientIdOrderByCreatedAtDesc("patient-002").isEmpty()) {
                        Alert sarahAlert = new Alert(
                                "patient-002",
                                "Sarah M.",
                                "Acute Cardiac Tachyarrhythmia",
                                "Alert for Sarah M. - HR spike 145 bpm. AI analysis: Possible AFib with 89% confidence. Auto-notified cardiologist.",
                                "CRITICAL",
                                "HEART_RATE",
                                "145 bpm",
                                89.0,
                                "Possible AFib with 89% confidence",
                                "ACC/AHA Class I: Resting HR > 140 bpm with irregular RR intervals",
                                "On-Call Cardiologist",
                                "Dr. Marcus Vance (Chief of Cardiology)",
                                "Mobile Push & Hospital Critical Pager",
                                3.2,
                                "Apple Watch Ultra 2 (Continuous ECG/PPG)"
                        );
                        alertRepository.save(sarahAlert);
                    }

                    // Seed John Doe Hypertensive Crisis Alert
                    if (alertRepository.findByPatientIdOrderByCreatedAtDesc("patient-001").isEmpty()) {
                        Alert johnAlert = new Alert(
                                "patient-001",
                                "John Doe",
                                "Stage 2 Hypertensive Crisis",
                                "Alert for John Doe - Severe arterial BP spike 154/96 mmHg. AI analysis: Accelerated vascular strain with 86.5% confidence. Auto-notified cardiovascular team.",
                                "HIGH",
                                "BLOOD_PRESSURE",
                                "154/96 mmHg",
                                86.5,
                                "Hypertensive surge confirmed with 86.5% confidence",
                                "AHA/ACC 2024 Stage 2 Hypertension Emergency Protocol",
                                "Attending Cardiologist",
                                "Dr. Sarah Jenkins (Cardiovascular Medicine)",
                                "Mobile Push Notification",
                                2.5,
                                "Whoop 4.0 Continuous Sensor"
                        );
                        alertRepository.save(johnAlert);
                    }

                    // Seed Robert Smith Nocturnal Oxygen Desaturation Alert
                    if (alertRepository.findByPatientIdOrderByCreatedAtDesc("patient-003").isEmpty()) {
                        Alert robertAlert = new Alert(
                                "patient-003",
                                "Robert Smith",
                                "Acute Hypoxemia / Oxygen Desaturation",
                                "Alert for Robert Smith - SpO2 desaturation dropped to 88%. AI analysis: Acute nocturnal hypoxemia with 92.4% confidence. Auto-notified pulmonologist.",
                                "CRITICAL",
                                "SPO2",
                                "88%",
                                92.4,
                                "Severe oxygen desaturation detected with 92.4% confidence",
                                "ATS Guideline: Sustained SpO2 < 90% in COPD patient",
                                "Critical Care & Pulmonology",
                                "Dr. Elena Rostova (Intensive Care & Telemetry)",
                                "Hospital Rapid Response Pager & Mobile Push",
                                2.8,
                                "BioTel Mobile Cardiac Telemetry LTE"
                        );
                        alertRepository.save(robertAlert);
                    }
                }

                System.out.println("MediSphere clinical data, users, federated models, and continuous monitoring alerts initialized successfully.");
            } catch (Exception e) {
                System.out.println("DataInitializer: Non-fatal initialization notice (MongoDB might connect lazily): " + e.getMessage());
            }
        };
    }
}