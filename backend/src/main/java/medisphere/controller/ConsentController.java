package medisphere.controller;

import medisphere.model.Consent;
import medisphere.repository.ConsentRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/consents")
public class ConsentController {

    private final ConsentRepository consentRepository;

    public ConsentController(ConsentRepository consentRepository) {
        this.consentRepository = consentRepository;
    }

    @PostMapping
    public Consent createConsent(@RequestBody Consent consent) {

        if (consent.getGrantedAt() == null) {
            consent.setGrantedAt(LocalDateTime.now());
        }

        return consentRepository.save(consent);
    }

    @GetMapping
    public List<Consent> getAllConsents() {
        return consentRepository.findAll();
    }

    @GetMapping("/patient/{patientId}")
    public Consent getConsentByPatientId(
            @PathVariable String patientId) {

        return consentRepository.findByPatientId(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Consent not found for patient: " + patientId));
    }
}