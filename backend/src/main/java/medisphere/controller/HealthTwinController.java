package medisphere.controller;

import medisphere.model.HealthTwin;
import medisphere.repository.HealthTwinRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/health-twins")
public class HealthTwinController {

    private final HealthTwinRepository healthTwinRepository;

    public HealthTwinController(HealthTwinRepository healthTwinRepository) {
        this.healthTwinRepository = healthTwinRepository;
    }

    @PostMapping
    public HealthTwin createHealthTwin(@RequestBody HealthTwin healthTwin) {

        // Validate patient ID
        if (healthTwin.getPatientId() == null ||
                healthTwin.getPatientId().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Patient ID is required"
            );
        }

        // Validate patient name
        if (healthTwin.getPatientName() == null ||
                healthTwin.getPatientName().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Patient name is required"
            );
        }

        // Validate age
        if (healthTwin.getAge() <= 0 ||
                healthTwin.getAge() > 120) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Patient age must be between 1 and 120"
            );
        }

        // Validate gender
        if (healthTwin.getGender() == null ||
                healthTwin.getGender().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Patient gender is required"
            );
        }

        // Validate conditions
        if (healthTwin.getConditions() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Conditions information is required"
            );
        }

        // Validate medications
        if (healthTwin.getMedications() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Medications information is required"
            );
        }

        // Save complete Health Twin
        return healthTwinRepository.save(healthTwin);
    }

    @GetMapping
    public List<HealthTwin> getAllHealthTwins() {
        return healthTwinRepository.findAll();
    }

    @GetMapping("/{patientId}")
    public HealthTwin getHealthTwinByPatientId(
            @PathVariable String patientId) {

        return healthTwinRepository.findByPatientId(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Health Twin not found for patient: " + patientId));
    }
}