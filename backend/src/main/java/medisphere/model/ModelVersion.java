package medisphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "model_versions")
public class ModelVersion {

    @Id
    private String id;

    private String versionId;
    private String modelName;
    private String architecture;
    private int federatedRound;
    private double testAccuracy;
    private double aucRoc;
    private double f1Score;
    private int totalTrainingRecords;
    private String status; // ACTIVE, CANDIDATE, ARCHIVED
    private String sha256Checksum;
    private LocalDateTime trainedAt;

    public ModelVersion() {
    }

    public ModelVersion(String versionId, String modelName, String architecture,
                        int federatedRound, double testAccuracy, double aucRoc,
                        double f1Score, int totalTrainingRecords, String status,
                        String sha256Checksum, LocalDateTime trainedAt) {
        this.versionId = versionId;
        this.modelName = modelName;
        this.architecture = architecture;
        this.federatedRound = federatedRound;
        this.testAccuracy = testAccuracy;
        this.aucRoc = aucRoc;
        this.f1Score = f1Score;
        this.totalTrainingRecords = totalTrainingRecords;
        this.status = status;
        this.sha256Checksum = sha256Checksum;
        this.trainedAt = trainedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVersionId() {
        return versionId;
    }

    public void setVersionId(String versionId) {
        this.versionId = versionId;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getArchitecture() {
        return architecture;
    }

    public void setArchitecture(String architecture) {
        this.architecture = architecture;
    }

    public int getFederatedRound() {
        return federatedRound;
    }

    public void setFederatedRound(int federatedRound) {
        this.federatedRound = federatedRound;
    }

    public double getTestAccuracy() {
        return testAccuracy;
    }

    public void setTestAccuracy(double testAccuracy) {
        this.testAccuracy = testAccuracy;
    }

    public double getAucRoc() {
        return aucRoc;
    }

    public void setAucRoc(double aucRoc) {
        this.aucRoc = aucRoc;
    }

    public double getF1Score() {
        return f1Score;
    }

    public void setF1Score(double f1Score) {
        this.f1Score = f1Score;
    }

    public int getTotalTrainingRecords() {
        return totalTrainingRecords;
    }

    public void setTotalTrainingRecords(int totalTrainingRecords) {
        this.totalTrainingRecords = totalTrainingRecords;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSha256Checksum() {
        return sha256Checksum;
    }

    public void setSha256Checksum(String sha256Checksum) {
        this.sha256Checksum = sha256Checksum;
    }

    public LocalDateTime getTrainedAt() {
        return trainedAt;
    }

    public void setTrainedAt(LocalDateTime trainedAt) {
        this.trainedAt = trainedAt;
    }
}
