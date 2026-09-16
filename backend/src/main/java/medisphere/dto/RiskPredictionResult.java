package medisphere.dto;

import java.util.List;
import java.util.Map;

public class RiskPredictionResult {

    private String patientId;
    private String patientName;
    private int age;
    private String gender;

    // 10-year CVD Risk
    private double cvdRiskPercentage; // e.g. 24.3
    private String cvdRiskCategory;   // e.g. "High Risk"
    private double baselineRisk;      // e.g. 14.1
    private double optimalComparisonRisk; // e.g. 5.2

    // Diabetes Complications
    private Map<String, Double> diabetesComplications; // e.g. Nephropathy: 31.2, Retinopathy: 22.8, etc.

    // SHAP Explainability
    private List<ShapFeatureValue> shapAttributions;
    private double shapSumVerification; // sum of baseline + attributions

    // Federated Model Context
    private int federatedRound;
    private String modelVersion;
    private double modelAccuracy; // e.g. 91.4%
    private String outputScreenBanner;

    // Clinical Recommendations
    private List<String> clinicalRecommendations;

    public RiskPredictionResult() {
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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public double getCvdRiskPercentage() {
        return cvdRiskPercentage;
    }

    public void setCvdRiskPercentage(double cvdRiskPercentage) {
        this.cvdRiskPercentage = cvdRiskPercentage;
    }

    public String getCvdRiskCategory() {
        return cvdRiskCategory;
    }

    public void setCvdRiskCategory(String cvdRiskCategory) {
        this.cvdRiskCategory = cvdRiskCategory;
    }

    public double getBaselineRisk() {
        return baselineRisk;
    }

    public void setBaselineRisk(double baselineRisk) {
        this.baselineRisk = baselineRisk;
    }

    public double getOptimalComparisonRisk() {
        return optimalComparisonRisk;
    }

    public void setOptimalComparisonRisk(double optimalComparisonRisk) {
        this.optimalComparisonRisk = optimalComparisonRisk;
    }

    public Map<String, Double> getDiabetesComplications() {
        return diabetesComplications;
    }

    public void setDiabetesComplications(Map<String, Double> diabetesComplications) {
        this.diabetesComplications = diabetesComplications;
    }

    public List<ShapFeatureValue> getShapAttributions() {
        return shapAttributions;
    }

    public void setShapAttributions(List<ShapFeatureValue> shapAttributions) {
        this.shapAttributions = shapAttributions;
    }

    public double getShapSumVerification() {
        return shapSumVerification;
    }

    public void setShapSumVerification(double shapSumVerification) {
        this.shapSumVerification = shapSumVerification;
    }

    public int getFederatedRound() {
        return federatedRound;
    }

    public void setFederatedRound(int federatedRound) {
        this.federatedRound = federatedRound;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public double getModelAccuracy() {
        return modelAccuracy;
    }

    public void setModelAccuracy(double modelAccuracy) {
        this.modelAccuracy = modelAccuracy;
    }

    public String getOutputScreenBanner() {
        return outputScreenBanner;
    }

    public void setOutputScreenBanner(String outputScreenBanner) {
        this.outputScreenBanner = outputScreenBanner;
    }

    public List<String> getClinicalRecommendations() {
        return clinicalRecommendations;
    }

    public void setClinicalRecommendations(List<String> clinicalRecommendations) {
        this.clinicalRecommendations = clinicalRecommendations;
    }
}
