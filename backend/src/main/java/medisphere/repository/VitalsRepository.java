package medisphere.repository;

import medisphere.model.Vitals;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VitalsRepository extends MongoRepository<Vitals, String> {

    List<Vitals> findByPatientId(String patientId);
}