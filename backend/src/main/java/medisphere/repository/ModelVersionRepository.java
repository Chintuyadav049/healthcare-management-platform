package medisphere.repository;

import medisphere.model.ModelVersion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelVersionRepository extends MongoRepository<ModelVersion, String> {

    Optional<ModelVersion> findByVersionId(String versionId);

    List<ModelVersion> findByStatus(String status);

    Optional<ModelVersion> findFirstByStatusOrderByTrainedAtDesc(String status);
}
