package medisphere.dto;

import java.util.List;

public class NewPatientAssessmentRequest {

    private String name;
    private int age;
    private String gender;

    private double systolicBP;
    private double diastolicBP;
    private double heartRate;
    private double oxygenSaturation;
    private double hba1c;
    private double totalCholesterol;

    private List<String> conditions;
    private List<String> medications;
    private String smokingStatus;

    public NewPatientAssessmentRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public double getSystolicBP() {
        return systolicBP;
    }

    public void setSystolicBP(double systolicBP) {
        this.systolicBP = systolicBP;
    }

    public double getDiastolicBP() {
        return diastolicBP;
    }

    public void setDiastolicBP(double diastolicBP) {
        this.diastolicBP = diastolicBP;
    }

    public double getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(double heartRate) {
        this.heartRate = heartRate;
    }

    public double getOxygenSaturation() {
        return oxygenSaturation;
    }

    public void setOxygenSaturation(double oxygenSaturation) {
        this.oxygenSaturation = oxygenSaturation;
    }

    public double getHba1c() {
        return hba1c;
    }

    public void setHba1c(double hba1c) {
        this.hba1c = hba1c;
    }

    public double getTotalCholesterol() {
        return totalCholesterol;
    }

    public void setTotalCholesterol(double totalCholesterol) {
        this.totalCholesterol = totalCholesterol;
    }

    public List<String> getConditions() {
        return conditions;
    }

    public void setConditions(List<String> conditions) {
        this.conditions = conditions;
    }

    public List<String> getMedications() {
        return medications;
    }

    public void setMedications(List<String> medications) {
        this.medications = medications;
    }

    public String getSmokingStatus() {
        return smokingStatus;
    }

    public void setSmokingStatus(String smokingStatus) {
        this.smokingStatus = smokingStatus;
    }
}
