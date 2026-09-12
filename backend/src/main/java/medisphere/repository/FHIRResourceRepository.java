package medisphere.repository;

import medisphere.model.FHIRResource;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FHIRResourceRepository
        extends MongoRepository<FHIRResource, String> {

}