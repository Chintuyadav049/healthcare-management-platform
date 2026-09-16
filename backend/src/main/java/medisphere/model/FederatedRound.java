package medisphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "federated_rounds")
public class FederatedRound {

    @Id
    private String id;

    private int roundNumber;
    private double globalLoss;
    private double globalAccuracy;
    private double epsilonBudget;
    private double deltaBudget;
    private int participatingClients;
    private long roundDurationMs;
    private Map<String, Double> clientLosses;
    private Map<String, Double> clientAccuracies;
    private LocalDateTime completedAt;

    public FederatedRound() {
    }

    public FederatedRound(int roundNumber, double globalLoss, double globalAccuracy,
                          double epsilonBudget, double deltaBudget, int participatingClients,
                          long roundDurationMs, Map<String, Double> clientLosses,
                          Map<String, Double> clientAccuracies, LocalDateTime completedAt) {
        this.roundNumber = roundNumber;
        this.globalLoss = globalLoss;
        this.globalAccuracy = globalAccuracy;
        this.epsilonBudget = epsilonBudget;
        this.deltaBudget = deltaBudget;
        this.participatingClients = participatingClients;
        this.roundDurationMs = roundDurationMs;
        this.clientLosses = clientLosses;
        this.clientAccuracies = clientAccuracies;
        this.completedAt = completedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getRoundNumber() {
        return roundNumber;
    }

    public void setRoundNumber(int roundNumber) {
        this.roundNumber = roundNumber;
    }

    public double getGlobalLoss() {
        return globalLoss;
    }

    public void setGlobalLoss(double globalLoss) {
        this.globalLoss = globalLoss;
    }

    public double getGlobalAccuracy() {
        return globalAccuracy;
    }

    public void setGlobalAccuracy(double globalAccuracy) {
        this.globalAccuracy = globalAccuracy;
    }

    public double getEpsilonBudget() {
        return epsilonBudget;
    }

    public void setEpsilonBudget(double epsilonBudget) {
        this.epsilonBudget = epsilonBudget;
    }

    public double getDeltaBudget() {
        return deltaBudget;
    }

    public void setDeltaBudget(double deltaBudget) {
        this.deltaBudget = deltaBudget;
    }

    public int getParticipatingClients() {
        return participatingClients;
    }

    public void setParticipatingClients(int participatingClients) {
        this.participatingClients = participatingClients;
    }

    public long getRoundDurationMs() {
        return roundDurationMs;
    }

    public void setRoundDurationMs(long roundDurationMs) {
        this.roundDurationMs = roundDurationMs;
    }

    public Map<String, Double> getClientLosses() {
        return clientLosses;
    }

    public void setClientLosses(Map<String, Double> clientLosses) {
        this.clientLosses = clientLosses;
    }

    public Map<String, Double> getClientAccuracies() {
        return clientAccuracies;
    }

    public void setClientAccuracies(Map<String, Double> clientAccuracies) {
        this.clientAccuracies = clientAccuracies;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
