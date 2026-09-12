package medisphere.controller;

import medisphere.model.Vitals;
import medisphere.repository.VitalsRepository;
import medisphere.service.KafkaProducerService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/vitals")
public class VitalsController {

    private final VitalsRepository vitalsRepository;
    private final KafkaProducerService kafkaProducerService;

    public VitalsController(
            VitalsRepository vitalsRepository,
            KafkaProducerService kafkaProducerService) {

        this.vitalsRepository = vitalsRepository;
        this.kafkaProducerService = kafkaProducerService;
    }

    @PostMapping
    public Vitals createVitals(@RequestBody Vitals vitals) {

        // Validate patient ID
        if (vitals.getPatientId() == null ||
                vitals.getPatientId().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Patient ID is required"
            );
        }

        // Validate heart rate
        if (vitals.getHeartRate() <= 0 ||
                vitals.getHeartRate() > 250) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Heart rate must be between 1 and 250"
            );
        }

        // Validate systolic blood pressure
        if (vitals.getSystolicBP() <= 0 ||
                vitals.getSystolicBP() > 300) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Systolic BP must be between 1 and 300"
            );
        }

        // Validate diastolic blood pressure
        if (vitals.getDiastolicBP() <= 0 ||
                vitals.getDiastolicBP() > 200) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Diastolic BP must be between 1 and 200"
            );
        }

        // Validate temperature
        if (vitals.getTemperature() < 25 ||
                vitals.getTemperature() > 45) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Temperature must be between 25 and 45 Celsius"
            );
        }

        // Validate oxygen saturation
        if (vitals.getOxygenSaturation() < 0 ||
                vitals.getOxygenSaturation() > 100) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Oxygen saturation must be between 0 and 100"
            );
        }

        // Save valid vitals to MongoDB
        Vitals savedVitals = vitalsRepository.save(vitals);

        // Send valid vital data to Kafka
        String message = String.format(
                "{\"patientId\":\"%s\",\"heartRate\":%.1f,\"systolicBP\":%.1f,\"diastolicBP\":%.1f,\"temperature\":%.1f,\"oxygenSaturation\":%.1f}",
                savedVitals.getPatientId(),
                savedVitals.getHeartRate(),
                savedVitals.getSystolicBP(),
                savedVitals.getDiastolicBP(),
                savedVitals.getTemperature(),
                savedVitals.getOxygenSaturation()
        );

        kafkaProducerService.sendVitals(message);

        return savedVitals;
    }

    @GetMapping
    public List<Vitals> getAllVitals() {
        return vitalsRepository.findAll();
    }

    @GetMapping("/patient/{patientId}")
    public List<Vitals> getVitalsByPatientId(
            @PathVariable String patientId) {

        return vitalsRepository.findByPatientId(patientId);
    }
}