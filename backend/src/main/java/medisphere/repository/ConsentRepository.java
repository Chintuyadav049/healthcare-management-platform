package medisphere.repository;

import medisphere.model.Consent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ConsentRepository extends MongoRepository<Consent, String> {

    Optional<Consent> findByPatientId(String patientId);
}