package medisphere.controller;

import medisphere.dto.FederatedNodeStatus;
import medisphere.model.FederatedRound;
import medisphere.service.FederatedLearningService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/federated")
public class FederatedController {

    private final FederatedLearningService federatedLearningService;

    public FederatedController(FederatedLearningService federatedLearningService) {
        this.federatedLearningService = federatedLearningService;
    }

    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        return federatedLearningService.getFederatedStatus();
    }

    @PostMapping("/train-round")
    public FederatedRound trainNextRound() {
        return federatedLearningService.trainNextRound();
    }

    @GetMapping("/nodes")
    public List<FederatedNodeStatus> getHospitalNodes() {
        return federatedLearningService.getHospitalNodes();
    }

    @GetMapping("/history")
    public List<Map<String, Object>> getConvergenceHistory() {
        return federatedLearningService.getConvergenceHistory();
    }
}
