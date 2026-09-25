package medisphere.repository;

import medisphere.model.Alert;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AlertRepository extends MongoRepository<Alert, String> {

    List<Alert> findByPatientIdOrderByCreatedAtDesc(String patientId);

    List<Alert> findByStatusOrderByCreatedAtDesc(String status);

    List<Alert> findBySeverityOrderByCreatedAtDesc(String severity);

    List<Alert> findAllByOrderByCreatedAtDesc();
}
