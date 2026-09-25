package medisphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "alerts")
public class Alert {

    @Id
    private String id;

    private String patientId;
    private String patientName;
    private String type;
    private String message;
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW
    private String vitalType; // HEART_RATE, BLOOD_PRESSURE, SPO2, TEMPERATURE
    private String vitalValue;
    private double confidenceScore;
    private String aiAnalysis;
    private String clinicalRuleTriggered;
    private String notifiedRole;
    private String notifiedPerson;
    private String notificationChannel;
    private String notificationStatus; // DELIVERED, PENDING
    private String status; // ACTIVE, ACKNOWLEDGED, RESOLVED
    private String acknowledgedBy;
    private LocalDateTime acknowledgedAt;
    private double responseTimeMinutes;
    private String wearableDevice;
    private LocalDateTime createdAt;

    public Alert() {
        this.createdAt = LocalDateTime.now();
        this.status = "ACTIVE";
        this.notificationStatus = "DELIVERED";
    }

    public Alert(String patientId, String patientName, String type, String message, String severity,
                 String vitalType, String vitalValue, double confidenceScore, String aiAnalysis,
                 String clinicalRuleTriggered, String notifiedRole, String notifiedPerson,
                 String notificationChannel, double responseTimeMinutes, String wearableDevice) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.type = type;
        this.message = message;
        this.severity = severity;
        this.vitalType = vitalType;
        this.vitalValue = vitalValue;
        this.confidenceScore = confidenceScore;
        this.aiAnalysis = aiAnalysis;
        this.clinicalRuleTriggered = clinicalRuleTriggered;
        this.notifiedRole = notifiedRole;
        this.notifiedPerson = notifiedPerson;
        this.notificationChannel = notificationChannel;
        this.notificationStatus = "DELIVERED";
        this.status = "ACTIVE";
        this.responseTimeMinutes = responseTimeMinutes;
        this.wearableDevice = wearableDevice;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getVitalType() {
        return vitalType;
    }

    public void setVitalType(String vitalType) {
        this.vitalType = vitalType;
    }

    public String getVitalValue() {
        return vitalValue;
    }

    public void setVitalValue(String vitalValue) {
        this.vitalValue = vitalValue;
    }

    public double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getAiAnalysis() {
        return aiAnalysis;
    }

    public void setAiAnalysis(String aiAnalysis) {
        this.aiAnalysis = aiAnalysis;
    }

    public String getClinicalRuleTriggered() {
        return clinicalRuleTriggered;
    }

    public void setClinicalRuleTriggered(String clinicalRuleTriggered) {
        this.clinicalRuleTriggered = clinicalRuleTriggered;
    }

    public String getNotifiedRole() {
        return notifiedRole;
    }

    public void setNotifiedRole(String notifiedRole) {
        this.notifiedRole = notifiedRole;
    }

    public String getNotifiedPerson() {
        return notifiedPerson;
    }

    public void setNotifiedPerson(String notifiedPerson) {
        this.notifiedPerson = notifiedPerson;
    }

    public String getNotificationChannel() {
        return notificationChannel;
    }

    public void setNotificationChannel(String notificationChannel) {
        this.notificationChannel = notificationChannel;
    }

    public String getNotificationStatus() {
        return notificationStatus;
    }

    public void setNotificationStatus(String notificationStatus) {
        this.notificationStatus = notificationStatus;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAcknowledgedBy() {
        return acknowledgedBy;
    }

    public void setAcknowledgedBy(String acknowledgedBy) {
        this.acknowledgedBy = acknowledgedBy;
    }

    public LocalDateTime getAcknowledgedAt() {
        return acknowledgedAt;
    }

    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) {
        this.acknowledgedAt = acknowledgedAt;
    }

    public double getResponseTimeMinutes() {
        return responseTimeMinutes;
    }

    public void setResponseTimeMinutes(double responseTimeMinutes) {
        this.responseTimeMinutes = responseTimeMinutes;
    }

    public String getWearableDevice() {
        return wearableDevice;
    }

    public void setWearableDevice(String wearableDevice) {
        this.wearableDevice = wearableDevice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
