package medisphere.dto;

public class FederatedNodeStatus {

    private String nodeId;
    private String hospitalName;
    private String institutionType;
    private int localSampleCount;
    private String status; // ONLINE, SYNCING, IDLE
    private double localLoss;
    private double localAccuracy;
    private String differentialPrivacyState;
    private String lastSyncTimestamp;

    public FederatedNodeStatus() {
    }

    public FederatedNodeStatus(String nodeId, String hospitalName, String institutionType,
                               int localSampleCount, String status, double localLoss,
                               double localAccuracy, String differentialPrivacyState,
                               String lastSyncTimestamp) {
        this.nodeId = nodeId;
        this.hospitalName = hospitalName;
        this.institutionType = institutionType;
        this.localSampleCount = localSampleCount;
        this.status = status;
        this.localLoss = localLoss;
        this.localAccuracy = localAccuracy;
        this.differentialPrivacyState = differentialPrivacyState;
        this.lastSyncTimestamp = lastSyncTimestamp;
    }

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getInstitutionType() {
        return institutionType;
    }

    public void setInstitutionType(String institutionType) {
        this.institutionType = institutionType;
    }

    public int getLocalSampleCount() {
        return localSampleCount;
    }

    public void setLocalSampleCount(int localSampleCount) {
        this.localSampleCount = localSampleCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getLocalLoss() {
        return localLoss;
    }

    public void setLocalLoss(double localLoss) {
        this.localLoss = localLoss;
    }

    public double getLocalAccuracy() {
        return localAccuracy;
    }

    public void setLocalAccuracy(double localAccuracy) {
        this.localAccuracy = localAccuracy;
    }

    public String getDifferentialPrivacyState() {
        return differentialPrivacyState;
    }

    public void setDifferentialPrivacyState(String differentialPrivacyState) {
        this.differentialPrivacyState = differentialPrivacyState;
    }

    public String getLastSyncTimestamp() {
        return lastSyncTimestamp;
    }

    public void setLastSyncTimestamp(String lastSyncTimestamp) {
        this.lastSyncTimestamp = lastSyncTimestamp;
    }
}
