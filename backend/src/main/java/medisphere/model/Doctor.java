package medisphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "doctors")
public class Doctor {

    @Id
    private String id;

    private String name;
    private String specialization;
    private String email;

    private String department;
    private String phone;
    private String licenseNumber;
    private String status = "ACTIVE";

    public Doctor() {
    }

    public Doctor(String name, String specialization, String email) {
        this.name = name;
        this.specialization = specialization;
        this.email = email;
        this.status = "ACTIVE";
    }

    public Doctor(String name, String specialization, String email, String department, String phone, String licenseNumber) {
        this.name = name;
        this.specialization = specialization;
        this.email = email;
        this.department = department;
        this.phone = phone;
        this.licenseNumber = licenseNumber;
        this.status = "ACTIVE";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}