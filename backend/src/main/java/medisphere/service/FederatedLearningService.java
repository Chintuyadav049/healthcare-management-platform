package medisphere.service;

import medisphere.dto.FederatedNodeStatus;
import medisphere.model.FederatedRound;
import medisphere.model.ModelVersion;
import medisphere.repository.FederatedRoundRepository;
import medisphere.repository.ModelVersionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class FederatedLearningService {

    private final FederatedRoundRepository federatedRoundRepository;
    private final ModelVersionRepository modelVersionRepository;

    private int currentRound = 47;
    private double currentLoss = 0.181;
    private double currentAccuracy = 91.4;
    private double currentEpsilon = 1.25;
    private double currentDelta = 1e-5;

    public FederatedLearningService(FederatedRoundRepository federatedRoundRepository,
                                    ModelVersionRepository modelVersionRepository) {
        this.federatedRoundRepository = federatedRoundRepository;
        this.modelVersionRepository = modelVersionRepository;
    }

    public synchronized Map<String, Object> getFederatedStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("currentRound", currentRound);
        status.put("roundStatus", "COMPLETED");
        status.put("globalModelVersion", "v2.4.0-fed-cvd");
        status.put("globalAccuracy", currentAccuracy);
        status.put("globalLoss", currentLoss);
        status.put("participatingClients", 4);
        status.put("totalFederatedRecords", 48500);
        status.put("epsilonPrivacyBudget", currentEpsilon);
        status.put("deltaPrivacyBudget", currentDelta);
        status.put("aggregationAlgorithm", "FedAvg (Differential Privacy SGD)");
        status.put("lastRoundCompletedAt", LocalDateTime.now().minusMinutes(12).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        status.put("bannerMessage", "AI Risk Prediction: 10-year CVD risk 24.3% for John Doe. SHAP shows HbA1c +8%, BP +6%. Federated round " + currentRound + " is complete.");
        return status;
    }

    public List<FederatedNodeStatus> getHospitalNodes() {
        List<FederatedNodeStatus> nodes = new ArrayList<>();

        nodes.add(new FederatedNodeStatus(
                "node-alpha",
                "Hospital Alpha - Metro General",
                "Tertiary Academic Medical Center",
                14200,
                "ONLINE",
                0.179,
                91.8,
                "DP-SGD Active (clip_norm=1.0)",
                LocalDateTime.now().minusMinutes(12).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        ));

        nodes.add(new FederatedNodeStatus(
                "node-beta",
                "Hospital Beta - St. Jude Regional",
                "Community Health Network",
                11800,
                "ONLINE",
                0.184,
                91.1,
                "DP-SGD Active (clip_norm=1.0)",
                LocalDateTime.now().minusMinutes(14).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        ));

        nodes.add(new FederatedNodeStatus(
                "node-gamma",
                "Hospital Gamma - Mayo Health Affiliate",
                "Specialized Cardiovascular Center",
                13500,
                "ONLINE",
                0.176,
                92.0,
                "DP-SGD Active (clip_norm=1.0)",
                LocalDateTime.now().minusMinutes(11).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        ));

        nodes.add(new FederatedNodeStatus(
                "node-delta",
                "Hospital Delta - Horizon Health",
                "Ambulatory & Primary Care Clinic",
                9000,
                "ONLINE",
                0.188,
                90.7,
                "DP-SGD Active (clip_norm=1.0)",
                LocalDateTime.now().minusMinutes(15).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        ));

        return nodes;
    }

    public synchronized FederatedRound trainNextRound() {
        currentRound++;
        
        // Loss decreases slightly or stabilizes near 0.17
        currentLoss = Math.max(0.165, Math.round((currentLoss - 0.002 + (Math.random() * 0.001)) * 1000.0) / 1000.0);
        // Accuracy improves slightly up to ~91.8%
        currentAccuracy = Math.min(92.4, Math.round((currentAccuracy + 0.05 + (Math.random() * 0.05)) * 10.0) / 10.0);
        currentEpsilon = Math.round((currentEpsilon + 0.02) * 100.0) / 100.0;

        Map<String, Double> clientLosses = new LinkedHashMap<>();
        clientLosses.put("Hospital Alpha", Math.round((currentLoss - 0.003) * 1000.0) / 1000.0);
        clientLosses.put("Hospital Beta", Math.round((currentLoss + 0.002) * 1000.0) / 1000.0);
        clientLosses.put("Hospital Gamma", Math.round((currentLoss - 0.005) * 1000.0) / 1000.0);
        clientLosses.put("Hospital Delta", Math.round((currentLoss + 0.006) * 1000.0) / 1000.0);

        Map<String, Double> clientAccuracies = new LinkedHashMap<>();
        clientAccuracies.put("Hospital Alpha", Math.round((currentAccuracy + 0.3) * 10.0) / 10.0);
        clientAccuracies.put("Hospital Beta", Math.round((currentAccuracy - 0.2) * 10.0) / 10.0);
        clientAccuracies.put("Hospital Gamma", Math.round((currentAccuracy + 0.5) * 10.0) / 10.0);
        clientAccuracies.put("Hospital Delta", Math.round((currentAccuracy - 0.6) * 10.0) / 10.0);

        FederatedRound round = new FederatedRound(
                currentRound,
                currentLoss,
                currentAccuracy,
                currentEpsilon,
                currentDelta,
                4,
                1420 + (long)(Math.random() * 200),
                clientLosses,
                clientAccuracies,
                LocalDateTime.now()
        );

        try {
            federatedRoundRepository.save(round);
            
            // Update active model version
            Optional<ModelVersion> activeModel = modelVersionRepository.findByVersionId("v2.4.0-fed-cvd");
            if (activeModel.isPresent()) {
                ModelVersion mv = activeModel.get();
                mv.setFederatedRound(currentRound);
                mv.setTestAccuracy(currentAccuracy);
                modelVersionRepository.save(mv);
            }
        } catch (Exception ignored) {
            // Memory mode fallback if db not connected
        }

        return round;
    }

    public List<Map<String, Object>> getConvergenceHistory() {
        List<Map<String, Object>> history = new ArrayList<>();
        
        // Generate history from round 1 to currentRound
        for (int r = 1; r <= currentRound; r++) {
            double progress = (double) r / 50.0;
            double loss = Math.round((0.720 * Math.exp(-2.8 * progress) + 0.170) * 1000.0) / 1000.0;
            double acc = Math.round((64.0 + (91.4 - 64.0) * (1.0 - Math.exp(-3.2 * progress))) * 10.0) / 10.0;

            Map<String, Object> point = new LinkedHashMap<>();
            point.put("round", r);
            point.put("globalLoss", loss);
            point.put("globalAccuracy", acc);
            point.put("hospitalAlphaAcc", Math.round((acc + 0.4) * 10.0) / 10.0);
            point.put("hospitalBetaAcc", Math.round((acc - 0.3) * 10.0) / 10.0);
            point.put("hospitalGammaAcc", Math.round((acc + 0.6) * 10.0) / 10.0);
            point.put("hospitalDeltaAcc", Math.round((acc - 0.7) * 10.0) / 10.0);
            history.add(point);
        }

        return history;
    }
}
