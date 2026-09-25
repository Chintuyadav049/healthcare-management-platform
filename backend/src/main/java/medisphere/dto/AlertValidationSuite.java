package medisphere.dto;

import java.util.List;
import java.util.Map;

public class AlertValidationSuite {

    // 1. Vitals Range Validation
    private VitalsRangeValidation rangeValidation;

    // 2. Alert Fatigue Prevention
    private AlertFatigueMetrics fatigueMetrics;

    // 3. Anomaly Detection Precision > 85%
    private AnomalyPrecisionMetrics anomalyMetrics;

    // 4. Alert Routing Rules
    private List<AlertRoutingRule> routingRules;

    // 5. Acknowledgment Tracking (3.2 min response time)
    private AcknowledgmentMetrics acknowledgmentMetrics;

    // 6. False Alert Rate < 3%
    private FalseAlertMetrics falseAlertMetrics;

    public AlertValidationSuite() {
    }

    public VitalsRangeValidation getRangeValidation() {
        return rangeValidation;
    }

    public void setRangeValidation(VitalsRangeValidation rangeValidation) {
        this.rangeValidation = rangeValidation;
    }

    public AlertFatigueMetrics getFatigueMetrics() {
        return fatigueMetrics;
    }

    public void setFatigueMetrics(AlertFatigueMetrics fatigueMetrics) {
        this.fatigueMetrics = fatigueMetrics;
    }

    public AnomalyPrecisionMetrics getAnomalyMetrics() {
        return anomalyMetrics;
    }

    public void setAnomalyMetrics(AnomalyPrecisionMetrics anomalyMetrics) {
        this.anomalyMetrics = anomalyMetrics;
    }

    public List<AlertRoutingRule> getRoutingRules() {
        return routingRules;
    }

    public void setRoutingRules(List<AlertRoutingRule> routingRules) {
        this.routingRules = routingRules;
    }

    public AcknowledgmentMetrics getAcknowledgmentMetrics() {
        return acknowledgmentMetrics;
    }

    public void setAcknowledgmentMetrics(AcknowledgmentMetrics acknowledgmentMetrics) {
        this.acknowledgmentMetrics = acknowledgmentMetrics;
    }

    public FalseAlertMetrics getFalseAlertMetrics() {
        return falseAlertMetrics;
    }

    public void setFalseAlertMetrics(FalseAlertMetrics falseAlertMetrics) {
        this.falseAlertMetrics = falseAlertMetrics;
    }

    // Nested classes
    public static class VitalsRangeValidation {
        private Map<String, PhysiologicalRange> ranges;
        private int totalPacketsIngested;
        private int validPackets;
        private int rejectedNoiseArtifacts;
        private double signalToNoiseRatioDb;
        private double validationPassRate;

        public VitalsRangeValidation(Map<String, PhysiologicalRange> ranges, int totalPacketsIngested,
                                     int validPackets, int rejectedNoiseArtifacts,
                                     double signalToNoiseRatioDb, double validationPassRate) {
            this.ranges = ranges;
            this.totalPacketsIngested = totalPacketsIngested;
            this.validPackets = validPackets;
            this.rejectedNoiseArtifacts = rejectedNoiseArtifacts;
            this.signalToNoiseRatioDb = signalToNoiseRatioDb;
            this.validationPassRate = validationPassRate;
        }

        public Map<String, PhysiologicalRange> getRanges() { return ranges; }
        public int getTotalPacketsIngested() { return totalPacketsIngested; }
        public int getValidPackets() { return validPackets; }
        public int getRejectedNoiseArtifacts() { return rejectedNoiseArtifacts; }
        public double getSignalToNoiseRatioDb() { return signalToNoiseRatioDb; }
        public double getValidationPassRate() { return validationPassRate; }
    }

    public static class PhysiologicalRange {
        private double minAllowed;
        private double maxAllowed;
        private double normalMin;
        private double normalMax;
        private String unit;

        public PhysiologicalRange(double minAllowed, double maxAllowed, double normalMin, double normalMax, String unit) {
            this.minAllowed = minAllowed;
            this.maxAllowed = maxAllowed;
            this.normalMin = normalMin;
            this.normalMax = normalMax;
            this.unit = unit;
        }

        public double getMinAllowed() { return minAllowed; }
        public double getMaxAllowed() { return maxAllowed; }
        public double getNormalMin() { return normalMin; }
        public double getNormalMax() { return normalMax; }
        public String getUnit() { return unit; }
    }

    public static class AlertFatigueMetrics {
        private double noiseReductionRate; // e.g. 68.2%
        private int deduplicationWindowMinutes; // 15 min
        private int rawAnomaliesDetected;
        private int consolidatedAlertsDelivered;
        private int duplicateAlarmsSuppressed;
        private String clusteringAlgorithm;

        public AlertFatigueMetrics(double noiseReductionRate, int deduplicationWindowMinutes,
                                   int rawAnomaliesDetected, int consolidatedAlertsDelivered,
                                   int duplicateAlarmsSuppressed, String clusteringAlgorithm) {
            this.noiseReductionRate = noiseReductionRate;
            this.deduplicationWindowMinutes = deduplicationWindowMinutes;
            this.rawAnomaliesDetected = rawAnomaliesDetected;
            this.consolidatedAlertsDelivered = consolidatedAlertsDelivered;
            this.duplicateAlarmsSuppressed = duplicateAlarmsSuppressed;
            this.clusteringAlgorithm = clusteringAlgorithm;
        }

        public double getNoiseReductionRate() { return noiseReductionRate; }
        public int getDeduplicationWindowMinutes() { return deduplicationWindowMinutes; }
        public int getRawAnomaliesDetected() { return rawAnomaliesDetected; }
        public int getConsolidatedAlertsDelivered() { return consolidatedAlertsDelivered; }
        public int getDuplicateAlarmsSuppressed() { return duplicateAlarmsSuppressed; }
        public String getClusteringAlgorithm() { return clusteringAlgorithm; }
    }

    public static class AnomalyPrecisionMetrics {
        private double precision; // >85% threshold -> 88.4%
        private double recall; // 91.2%
        private double f1Score; // 89.8%
        private double specificity; // 93.6%
        private double aucPr; // 0.897
        private int truePositives;
        private int falsePositives;
        private int trueNegatives;
        private int falseNegatives;

        public AnomalyPrecisionMetrics(double precision, double recall, double f1Score,
                                       double specificity, double aucPr, int truePositives,
                                       int falsePositives, int trueNegatives, int falseNegatives) {
            this.precision = precision;
            this.recall = recall;
            this.f1Score = f1Score;
            this.specificity = specificity;
            this.aucPr = aucPr;
            this.truePositives = truePositives;
            this.falsePositives = falsePositives;
            this.trueNegatives = trueNegatives;
            this.falseNegatives = falseNegatives;
        }

        public double getPrecision() { return precision; }
        public double getRecall() { return recall; }
        public double getF1Score() { return f1Score; }
        public double getSpecificity() { return specificity; }
        public double getAucPr() { return aucPr; }
        public int getTruePositives() { return truePositives; }
        public int getFalsePositives() { return falsePositives; }
        public int getTrueNegatives() { return trueNegatives; }
        public int getFalseNegatives() { return falseNegatives; }
    }

    public static class AlertRoutingRule {
        private String condition;
        private String severity;
        private String primaryRecipient;
        private String notificationChannel;
        private String escalationTimeout;
        private String fallbackEscalation;

        public AlertRoutingRule(String condition, String severity, String primaryRecipient,
                                String notificationChannel, String escalationTimeout, String fallbackEscalation) {
            this.condition = condition;
            this.severity = severity;
            this.primaryRecipient = primaryRecipient;
            this.notificationChannel = notificationChannel;
            this.escalationTimeout = escalationTimeout;
            this.fallbackEscalation = fallbackEscalation;
        }

        public String getCondition() { return condition; }
        public String getSeverity() { return severity; }
        public String getPrimaryRecipient() { return primaryRecipient; }
        public String getNotificationChannel() { return notificationChannel; }
        public String getEscalationTimeout() { return escalationTimeout; }
        public String getFallbackEscalation() { return fallbackEscalation; }
    }

    public static class AcknowledgmentMetrics {
        private double averageResponseTimeMinutes; // 3.2 minutes
        private double baselineManualTriageHours; // 2.4 hours
        private double responseTimeReductionPercent; // 97.8% reduction
        private int totalAlertsAudited;
        private int acknowledgedWithin5Minutes;
        private int acknowledgedWithin15Minutes;
        private int overdueEscalations;
        private List<AckHistoryItem> recentAcks;

        public AcknowledgmentMetrics(double averageResponseTimeMinutes, double baselineManualTriageHours,
                                     double responseTimeReductionPercent, int totalAlertsAudited,
                                     int acknowledgedWithin5Minutes, int acknowledgedWithin15Minutes,
                                     int overdueEscalations, List<AckHistoryItem> recentAcks) {
            this.averageResponseTimeMinutes = averageResponseTimeMinutes;
            this.baselineManualTriageHours = baselineManualTriageHours;
            this.responseTimeReductionPercent = responseTimeReductionPercent;
            this.totalAlertsAudited = totalAlertsAudited;
            this.acknowledgedWithin5Minutes = acknowledgedWithin5Minutes;
            this.acknowledgedWithin15Minutes = acknowledgedWithin15Minutes;
            this.overdueEscalations = overdueEscalations;
            this.recentAcks = recentAcks;
        }

        public double getAverageResponseTimeMinutes() { return averageResponseTimeMinutes; }
        public double getBaselineManualTriageHours() { return baselineManualTriageHours; }
        public double getResponseTimeReductionPercent() { return responseTimeReductionPercent; }
        public int getTotalAlertsAudited() { return totalAlertsAudited; }
        public int getAcknowledgedWithin5Minutes() { return acknowledgedWithin5Minutes; }
        public int getAcknowledgedWithin15Minutes() { return acknowledgedWithin15Minutes; }
        public int getOverdueEscalations() { return overdueEscalations; }
        public List<AckHistoryItem> getRecentAcks() { return recentAcks; }
    }

    public static class AckHistoryItem {
        private String alertId;
        private String patientName;
        private String alertType;
        private String physician;
        private double responseTimeMin;
        private String status;

        public AckHistoryItem(String alertId, String patientName, String alertType,
                              String physician, double responseTimeMin, String status) {
            this.alertId = alertId;
            this.patientName = patientName;
            this.alertType = alertType;
            this.physician = physician;
            this.responseTimeMin = responseTimeMin;
            this.status = status;
        }

        public String getAlertId() { return alertId; }
        public String getPatientName() { return patientName; }
        public String getAlertType() { return alertType; }
        public String getPhysician() { return physician; }
        public double getResponseTimeMin() { return responseTimeMin; }
        public String getStatus() { return status; }
    }

    public static class FalseAlertMetrics {
        private double falseAlertRate; // 2.1% (<3% threshold)
        private double motionArtifactRejectionRate; // 96.4%
        private int totalAlarmsEvaluated;
        private int confirmedTrueAlarms;
        private int rejectedFalseAlarms;
        private String artifactDisambiguationTechnique;

        public FalseAlertMetrics(double falseAlertRate, double motionArtifactRejectionRate,
                                 int totalAlarmsEvaluated, int confirmedTrueAlarms,
                                 int rejectedFalseAlarms, String artifactDisambiguationTechnique) {
            this.falseAlertRate = falseAlertRate;
            this.motionArtifactRejectionRate = motionArtifactRejectionRate;
            this.totalAlarmsEvaluated = totalAlarmsEvaluated;
            this.confirmedTrueAlarms = confirmedTrueAlarms;
            this.rejectedFalseAlarms = rejectedFalseAlarms;
            this.artifactDisambiguationTechnique = artifactDisambiguationTechnique;
        }

        public double getFalseAlertRate() { return falseAlertRate; }
        public double getMotionArtifactRejectionRate() { return motionArtifactRejectionRate; }
        public int getTotalAlarmsEvaluated() { return totalAlarmsEvaluated; }
        public int getConfirmedTrueAlarms() { return confirmedTrueAlarms; }
        public int getRejectedFalseAlarms() { return rejectedFalseAlarms; }
        public String getArtifactDisambiguationTechnique() { return artifactDisambiguationTechnique; }
    }
}
