package medisphere.dto;

public class LoginResponse {

    private String token;
    private String username;
    private String role;
    private String patientId;
    private String fullName;

    public LoginResponse() {
    }

    public LoginResponse(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }

    public LoginResponse(String token, String username, String role, String patientId, String fullName) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.patientId = patientId;
        this.fullName = fullName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}