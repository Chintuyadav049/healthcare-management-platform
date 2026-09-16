package medisphere.repository;

import medisphere.model.FederatedRound;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FederatedRoundRepository extends MongoRepository<FederatedRound, String> {

    Optional<FederatedRound> findByRoundNumber(int roundNumber);

    List<FederatedRound> findAllByOrderByRoundNumberAsc();

    Optional<FederatedRound> findTopByOrderByRoundNumberDesc();
}
