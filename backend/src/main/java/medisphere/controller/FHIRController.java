package medisphere.controller;

import medisphere.model.FHIRResource;
import medisphere.repository.FHIRResourceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fhir")
public class FHIRController {

    private final FHIRResourceRepository fhirResourceRepository;

    public FHIRController(FHIRResourceRepository fhirResourceRepository) {
        this.fhirResourceRepository = fhirResourceRepository;
    }

    @PostMapping
    public FHIRResource saveFHIRResource(
            @RequestBody Map<String, Object> fhirData) {

        // Validate resourceType
        if (fhirData.get("resourceType") == null ||
                fhirData.get("resourceType").toString().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "FHIR resourceType is required"
            );
        }

        // Validate id
        if (fhirData.get("id") == null ||
                fhirData.get("id").toString().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "FHIR resource id is required"
            );
        }

        String resourceType =
                fhirData.get("resourceType").toString();

        Map<String, Object> resourceIdData = fhirData;

        String resourceId =
                fhirData.get("id").toString();

        FHIRResource resource = new FHIRResource(
                resourceType,
                resourceId,
                resourceIdData
        );

        return fhirResourceRepository.save(resource);
    }

    @GetMapping
    public List<FHIRResource> getAllFHIRResources() {
        return fhirResourceRepository.findAll();
    }
}