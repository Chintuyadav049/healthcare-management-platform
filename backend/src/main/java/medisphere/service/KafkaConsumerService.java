package medisphere.service;

import medisphere.model.Vitals;
import medisphere.repository.VitalsRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    private final VitalsRepository vitalsRepository;
    private final AlertEngineService alertEngineService;

    public KafkaConsumerService(VitalsRepository vitalsRepository, AlertEngineService alertEngineService) {
        this.vitalsRepository = vitalsRepository;
        this.alertEngineService = alertEngineService;
    }

    @KafkaListener(topics = "vitals", groupId = "medisphere-group")
    public void consumeVitals(String message) {

        try {
            System.out.println("Received Vitals from Kafka:");
            System.out.println(message);

            String patientId = extractValue(message, "patientId");
            double heartRate = Double.parseDouble(extractValue(message, "heartRate"));
            double systolicBP = Double.parseDouble(extractValue(message, "systolicBP"));
            double diastolicBP = Double.parseDouble(extractValue(message, "diastolicBP"));
            double temperature = Double.parseDouble(extractValue(message, "temperature"));
            double oxygenSaturation = Double.parseDouble(extractValue(message, "oxygenSaturation"));

            Vitals vitals = new Vitals(
                    patientId,
                    heartRate,
                    systolicBP,
                    diastolicBP,
                    temperature,
                    oxygenSaturation,
                    null
            );

            vitalsRepository.save(vitals);
            System.out.println("Vitals saved to MongoDB successfully.");

            // Evaluate through Real-Time AI Anomaly Detection & Clinical Rule Engine
            alertEngineService.processVitalsPacket(patientId, heartRate, systolicBP, diastolicBP, temperature, oxygenSaturation);

        } catch (Exception e) {
            System.out.println("Error processing Kafka vitals:");
            e.printStackTrace();
        }
    }

    private String extractValue(String json, String key) {

        String search = "\"" + key + "\":";
        int start = json.indexOf(search);

        if (start == -1) {
            throw new RuntimeException("Field not found: " + key);
        }

        start += search.length();

        while (start < json.length() && json.charAt(start) == ' ') {
            start++;
        }

        if (json.charAt(start) == '"') {
            start++;
            int end = json.indexOf('"', start);
            return json.substring(start, end);
        }

        int end = json.indexOf(',', start);

        if (end == -1) {
            end = json.indexOf('}', start);
        }

        return json.substring(start, end).trim();
    }
}