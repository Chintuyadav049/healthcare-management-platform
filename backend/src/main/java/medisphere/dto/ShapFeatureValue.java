package medisphere.dto;

public class ShapFeatureValue {

    private String feature;
    private String displayName;
    private String rawValue;
    private double shapValue; // attribution in percentage points (e.g. +8.0, +6.0)
    private boolean riskElevating; // true = increases risk (red), false = protective (green)
    private String clinicalImpact;

    public ShapFeatureValue() {
    }

    public ShapFeatureValue(String feature, String displayName, String rawValue,
                            double shapValue, boolean riskElevating, String clinicalImpact) {
        this.feature = feature;
        this.displayName = displayName;
        this.rawValue = rawValue;
        this.shapValue = shapValue;
        this.riskElevating = riskElevating;
        this.clinicalImpact = clinicalImpact;
    }

    public String getFeature() {
        return feature;
    }

    public void setFeature(String feature) {
        this.feature = feature;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getRawValue() {
        return rawValue;
    }

    public void setRawValue(String rawValue) {
        this.rawValue = rawValue;
    }

    public double getShapValue() {
        return shapValue;
    }

    public void setShapValue(double shapValue) {
        this.shapValue = shapValue;
    }

    public boolean isRiskElevating() {
        return riskElevating;
    }

    public void setRiskElevating(boolean riskElevating) {
        this.riskElevating = riskElevating;
    }

    public String getClinicalImpact() {
        return clinicalImpact;
    }

    public void setClinicalImpact(String clinicalImpact) {
        this.clinicalImpact = clinicalImpact;
    }
}
