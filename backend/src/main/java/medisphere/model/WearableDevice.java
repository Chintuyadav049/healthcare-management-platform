package medisphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "wearable_devices")
public class WearableDevice {

    @Id
    private String id;

    private String deviceId;
    private String patientId;
    private String patientName;
    private String deviceModel; // e.g. "Apple Watch Ultra 2", "Whoop 4.0", "Fitbit Sense 2", "BioTelemetry Patch"
    private String sensorType;  // "ECG / PPG / Accelerometer"
    private int batteryLevel;   // 0-100%
    private String connectionStatus; // "CONNECTED_STREAMING", "STANDBY", "SYNCING"
    private int sampleRateHz;   // e.g. 50 Hz, 100 Hz
    private double currentHeartRate;
    private double currentSpO2;
    private String currentRhythm; // "Sinus Rhythm", "Irregular / AFib Suspect"
    private LocalDateTime lastSyncTime;

    public WearableDevice() {
        this.lastSyncTime = LocalDateTime.now();
        this.connectionStatus = "CONNECTED_STREAMING";
    }

    public WearableDevice(String deviceId, String patientId, String patientName, String deviceModel,
                          String sensorType, int batteryLevel, String connectionStatus, int sampleRateHz,
                          double currentHeartRate, double currentSpO2, String currentRhythm) {
        this.deviceId = deviceId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.deviceModel = deviceModel;
        this.sensorType = sensorType;
        this.batteryLevel = batteryLevel;
        this.connectionStatus = connectionStatus;
        this.sampleRateHz = sampleRateHz;
        this.currentHeartRate = currentHeartRate;
        this.currentSpO2 = currentSpO2;
        this.currentRhythm = currentRhythm;
        this.lastSyncTime = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDeviceModel() {
        return deviceModel;
    }

    public void setDeviceModel(String deviceModel) {
        this.deviceModel = deviceModel;
    }

    public String getSensorType() {
        return sensorType;
    }

    public void setSensorType(String sensorType) {
        this.sensorType = sensorType;
    }

    public int getBatteryLevel() {
        return batteryLevel;
    }

    public void setBatteryLevel(int batteryLevel) {
        this.batteryLevel = batteryLevel;
    }

    public String getConnectionStatus() {
        return connectionStatus;
    }

    public void setConnectionStatus(String connectionStatus) {
        this.connectionStatus = connectionStatus;
    }

    public int getSampleRateHz() {
        return sampleRateHz;
    }

    public void setSampleRateHz(int sampleRateHz) {
        this.sampleRateHz = sampleRateHz;
    }

    public double getCurrentHeartRate() {
        return currentHeartRate;
    }

    public void setCurrentHeartRate(double currentHeartRate) {
        this.currentHeartRate = currentHeartRate;
    }

    public double getCurrentSpO2() {
        return currentSpO2;
    }

    public void setCurrentSpO2(double currentSpO2) {
        this.currentSpO2 = currentSpO2;
    }

    public String getCurrentRhythm() {
        return currentRhythm;
    }

    public void setCurrentRhythm(String currentRhythm) {
        this.currentRhythm = currentRhythm;
    }

    public LocalDateTime getLastSyncTime() {
        return lastSyncTime;
    }

    public void setLastSyncTime(LocalDateTime lastSyncTime) {
        this.lastSyncTime = lastSyncTime;
    }
}
