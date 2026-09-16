package medisphere.dto;

import java.util.List;
import java.util.Map;

public class ValidationSuiteData {

    // 1. Model Accuracy > 90%
    private AccuracyMetrics accuracyMetrics;

    // 2. Federated Round Convergence
    private List<ConvergencePoint> convergenceHistory;

    // 3. SHAP Explanation Validity
    private ShapValidationMetrics shapValidation;

    // 4. Prediction Calibration
    private CalibrationMetrics calibrationMetrics;

    // 5. Bias Audit Across Demographics
    private BiasAuditMetrics biasAuditMetrics;

    // 6. Clinical Guideline Compliance
    private List<GuidelineCheck> guidelineChecks;

    public ValidationSuiteData() {
    }

    public static class AccuracyMetrics {
        private double testAccuracy; // 91.4
        private double aucRoc;       // 0.942
        private double precision;    // 90.2
        private double recall;       // 89.6
        private double specificity;  // 92.8
        private double f1Score;      // 90.8
        private int truePositives;   // 3584
        private int falsePositives;  // 432
        private int trueNegatives;   // 5568
        private int falseNegatives;  // 416
        private int totalEvaluated;  // 10000

        public AccuracyMetrics() {}

        public AccuracyMetrics(double testAccuracy, double aucRoc, double precision,
                               double recall, double specificity, double f1Score,
                               int truePositives, int falsePositives, int trueNegatives,
                               int falseNegatives, int totalEvaluated) {
            this.testAccuracy = testAccuracy;
            this.aucRoc = aucRoc;
            this.precision = precision;
            this.recall = recall;
            this.specificity = specificity;
            this.f1Score = f1Score;
            this.truePositives = truePositives;
            this.falsePositives = falsePositives;
            this.trueNegatives = trueNegatives;
            this.falseNegatives = falseNegatives;
            this.totalEvaluated = totalEvaluated;
        }

        public double getTestAccuracy() { return testAccuracy; }
        public void setTestAccuracy(double testAccuracy) { this.testAccuracy = testAccuracy; }
        public double getAucRoc() { return aucRoc; }
        public void setAucRoc(double aucRoc) { this.aucRoc = aucRoc; }
        public double getPrecision() { return precision; }
        public void setPrecision(double precision) { this.precision = precision; }
        public double getRecall() { return recall; }
        public void setRecall(double recall) { this.recall = recall; }
        public double getSpecificity() { return specificity; }
        public void setSpecificity(double specificity) { this.specificity = specificity; }
        public double getF1Score() { return f1Score; }
        public void setF1Score(double f1Score) { this.f1Score = f1Score; }
        public int getTruePositives() { return truePositives; }
        public void setTruePositives(int truePositives) { this.truePositives = truePositives; }
        public int getFalsePositives() { return falsePositives; }
        public void setFalsePositives(int falsePositives) { this.falsePositives = falsePositives; }
        public int getTrueNegatives() { return trueNegatives; }
        public void setTrueNegatives(int trueNegatives) { this.trueNegatives = trueNegatives; }
        public int getFalseNegatives() { return falseNegatives; }
        public void setFalseNegatives(int falseNegatives) { this.falseNegatives = falseNegatives; }
        public int getTotalEvaluated() { return totalEvaluated; }
        public void setTotalEvaluated(int totalEvaluated) { this.totalEvaluated = totalEvaluated; }
    }

    public static class ConvergencePoint {
        private int round;
        private double globalLoss;
        private double globalAccuracy;
        private double alphaAccuracy;
        private double betaAccuracy;
        private double gammaAccuracy;
        private double deltaAccuracy;

        public ConvergencePoint() {}

        public ConvergencePoint(int round, double globalLoss, double globalAccuracy,
                                double alphaAccuracy, double betaAccuracy,
                                double gammaAccuracy, double deltaAccuracy) {
            this.round = round;
            this.globalLoss = globalLoss;
            this.globalAccuracy = globalAccuracy;
            this.alphaAccuracy = alphaAccuracy;
            this.betaAccuracy = betaAccuracy;
            this.gammaAccuracy = gammaAccuracy;
            this.deltaAccuracy = deltaAccuracy;
        }

        public int getRound() { return round; }
        public void setRound(int round) { this.round = round; }
        public double getGlobalLoss() { return globalLoss; }
        public void setGlobalLoss(double globalLoss) { this.globalLoss = globalLoss; }
        public double getGlobalAccuracy() { return globalAccuracy; }
        public void setGlobalAccuracy(double globalAccuracy) { this.globalAccuracy = globalAccuracy; }
        public double getAlphaAccuracy() { return alphaAccuracy; }
        public void setAlphaAccuracy(double alphaAccuracy) { this.alphaAccuracy = alphaAccuracy; }
        public double getBetaAccuracy() { return betaAccuracy; }
        public void setBetaAccuracy(double betaAccuracy) { this.betaAccuracy = betaAccuracy; }
        public double getGammaAccuracy() { return gammaAccuracy; }
        public void setGammaAccuracy(double gammaAccuracy) { this.gammaAccuracy = gammaAccuracy; }
        public double getDeltaAccuracy() { return deltaAccuracy; }
        public void setDeltaAccuracy(double deltaAccuracy) { this.deltaAccuracy = deltaAccuracy; }
    }

    public static class ShapValidationMetrics {
        private boolean localAccuracyAxiomSatisfied; // true: f(x) = E[f(x)] + sum(phi_i)
        private double additivityResidual;           // 0.000000
        private boolean missingnessAxiomSatisfied;   // true
        private boolean consistencyAxiomSatisfied;   // true
        private double perturbationStabilityVariance; // 0.011 (< 1.2%)
        private List<Map<String, Object>> globalImportanceRankings;

        public ShapValidationMetrics() {}

        public boolean isLocalAccuracyAxiomSatisfied() { return localAccuracyAxiomSatisfied; }
        public void setLocalAccuracyAxiomSatisfied(boolean localAccuracyAxiomSatisfied) {
            this.localAccuracyAxiomSatisfied = localAccuracyAxiomSatisfied;
        }
        public double getAdditivityResidual() { return additivityResidual; }
        public void setAdditivityResidual(double additivityResidual) {
            this.additivityResidual = additivityResidual;
        }
        public boolean isMissingnessAxiomSatisfied() { return missingnessAxiomSatisfied; }
        public void setMissingnessAxiomSatisfied(boolean missingnessAxiomSatisfied) {
            this.missingnessAxiomSatisfied = missingnessAxiomSatisfied;
        }
        public boolean isConsistencyAxiomSatisfied() { return consistencyAxiomSatisfied; }
        public void setConsistencyAxiomSatisfied(boolean consistencyAxiomSatisfied) {
            this.consistencyAxiomSatisfied = consistencyAxiomSatisfied;
        }
        public double getPerturbationStabilityVariance() { return perturbationStabilityVariance; }
        public void setPerturbationStabilityVariance(double perturbationStabilityVariance) {
            this.perturbationStabilityVariance = perturbationStabilityVariance;
        }
        public List<Map<String, Object>> getGlobalImportanceRankings() {
            return globalImportanceRankings;
        }
        public void setGlobalImportanceRankings(List<Map<String, Object>> globalImportanceRankings) {
            this.globalImportanceRankings = globalImportanceRankings;
        }
    }

    public static class CalibrationMetrics {
        private double brierScore; // 0.082
        private double hosmerLemeshowPValue; // 0.42 (>0.05 well-calibrated)
        private String calibrationStatus; // "Well-Calibrated"
        private List<DecileCalibration> deciles;

        public CalibrationMetrics() {}

        public double getBrierScore() { return brierScore; }
        public void setBrierScore(double brierScore) { this.brierScore = brierScore; }
        public double getHosmerLemeshowPValue() { return hosmerLemeshowPValue; }
        public void setHosmerLemeshowPValue(double hosmerLemeshowPValue) {
            this.hosmerLemeshowPValue = hosmerLemeshowPValue;
        }
        public String getCalibrationStatus() { return calibrationStatus; }
        public void setCalibrationStatus(String calibrationStatus) {
            this.calibrationStatus = calibrationStatus;
        }
        public List<DecileCalibration> getDeciles() { return deciles; }
        public void setDeciles(List<DecileCalibration> deciles) { this.deciles = deciles; }
    }

    public static class DecileCalibration {
        private int decile;
        private double predictedRisk; // e.g. 0.05, 0.15, ...
        private double observedRisk;  // e.g. 0.048, 0.152, ...
        private int sampleSize;

        public DecileCalibration() {}

        public DecileCalibration(int decile, double predictedRisk, double observedRisk, int sampleSize) {
            this.decile = decile;
            this.predictedRisk = predictedRisk;
            this.observedRisk = observedRisk;
            this.sampleSize = sampleSize;
        }

        public int getDecile() { return decile; }
        public void setDecile(int decile) { this.decile = decile; }
        public double getPredictedRisk() { return predictedRisk; }
        public void setPredictedRisk(double predictedRisk) { this.predictedRisk = predictedRisk; }
        public double getObservedRisk() { return observedRisk; }
        public void setObservedRisk(double observedRisk) { this.observedRisk = observedRisk; }
        public int getSampleSize() { return sampleSize; }
        public void setSampleSize(int sampleSize) { this.sampleSize = sampleSize; }
    }

    public static class BiasAuditMetrics {
        private double overallDisparateImpactRatio; // 0.94 (within 0.80 - 1.25)
        private String fairnessConclusion;          // "Demographic Parity & Equalized Odds Verified"
        private List<DemographicGroupScore> ageGroups;
        private List<DemographicGroupScore> sexGroups;
        private List<DemographicGroupScore> raceGroups;

        public BiasAuditMetrics() {}

        public double getOverallDisparateImpactRatio() { return overallDisparateImpactRatio; }
        public void setOverallDisparateImpactRatio(double overallDisparateImpactRatio) {
            this.overallDisparateImpactRatio = overallDisparateImpactRatio;
        }
        public String getFairnessConclusion() { return fairnessConclusion; }
        public void setFairnessConclusion(String fairnessConclusion) {
            this.fairnessConclusion = fairnessConclusion;
        }
        public List<DemographicGroupScore> getAgeGroups() { return ageGroups; }
        public void setAgeGroups(List<DemographicGroupScore> ageGroups) { this.ageGroups = ageGroups; }
        public List<DemographicGroupScore> getSexGroups() { return sexGroups; }
        public void setSexGroups(List<DemographicGroupScore> sexGroups) { this.sexGroups = sexGroups; }
        public List<DemographicGroupScore> getRaceGroups() { return raceGroups; }
        public void setRaceGroups(List<DemographicGroupScore> raceGroups) { this.raceGroups = raceGroups; }
    }

    public static class DemographicGroupScore {
        private String group;
        private int sampleCount;
        private double accuracy;
        private double falsePositiveRate;
        private double falseNegativeRate;

        public DemographicGroupScore() {}

        public DemographicGroupScore(String group, int sampleCount, double accuracy,
                                     double falsePositiveRate, double falseNegativeRate) {
            this.group = group;
            this.sampleCount = sampleCount;
            this.accuracy = accuracy;
            this.falsePositiveRate = falsePositiveRate;
            this.falseNegativeRate = falseNegativeRate;
        }

        public String getGroup() { return group; }
        public void setGroup(String group) { this.group = group; }
        public int getSampleCount() { return sampleCount; }
        public void setSampleCount(int sampleCount) { this.sampleCount = sampleCount; }
        public double getAccuracy() { return accuracy; }
        public void setAccuracy(double accuracy) { this.accuracy = accuracy; }
        public double getFalsePositiveRate() { return falsePositiveRate; }
        public void setFalsePositiveRate(double falsePositiveRate) { this.falsePositiveRate = falsePositiveRate; }
        public double getFalseNegativeRate() { return falseNegativeRate; }
        public void setFalseNegativeRate(double falseNegativeRate) { this.falseNegativeRate = falseNegativeRate; }
    }

    public static class GuidelineCheck {
        private String guideline;
        private String standard;
        private String status; // "COMPLIANT", "VERIFIED"
        private String description;
        private String referenceUrl;

        public GuidelineCheck() {}

        public GuidelineCheck(String guideline, String standard, String status,
                              String description, String referenceUrl) {
            this.guideline = guideline;
            this.standard = standard;
            this.status = status;
            this.description = description;
            this.referenceUrl = referenceUrl;
        }

        public String getGuideline() { return guideline; }
        public void setGuideline(String guideline) { this.guideline = guideline; }
        public String getStandard() { return standard; }
        public void setStandard(String standard) { this.standard = standard; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getReferenceUrl() { return referenceUrl; }
        public void setReferenceUrl(String referenceUrl) { this.referenceUrl = referenceUrl; }
    }

    // Getters and Setters for ValidationSuiteData
    public AccuracyMetrics getAccuracyMetrics() { return accuracyMetrics; }
    public void setAccuracyMetrics(AccuracyMetrics accuracyMetrics) { this.accuracyMetrics = accuracyMetrics; }
    public List<ConvergencePoint> getConvergenceHistory() { return convergenceHistory; }
    public void setConvergenceHistory(List<ConvergencePoint> convergenceHistory) {
        this.convergenceHistory = convergenceHistory;
    }
    public ShapValidationMetrics getShapValidation() { return shapValidation; }
    public void setShapValidation(ShapValidationMetrics shapValidation) {
        this.shapValidation = shapValidation;
    }
    public CalibrationMetrics getCalibrationMetrics() { return calibrationMetrics; }
    public void setCalibrationMetrics(CalibrationMetrics calibrationMetrics) {
        this.calibrationMetrics = calibrationMetrics;
    }
    public BiasAuditMetrics getBiasAuditMetrics() { return biasAuditMetrics; }
    public void setBiasAuditMetrics(BiasAuditMetrics biasAuditMetrics) {
        this.biasAuditMetrics = biasAuditMetrics;
    }
    public List<GuidelineCheck> getGuidelineChecks() { return guidelineChecks; }
    public void setGuidelineChecks(List<GuidelineCheck> guidelineChecks) {
        this.guidelineChecks = guidelineChecks;
    }
}
