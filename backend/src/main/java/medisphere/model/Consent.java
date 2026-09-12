package medisphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "consents")
public class Consent {

    @Id
    private String id;

    private String patientId;
    private boolean granted;
    private String purpose;
    private LocalDateTime grantedAt;

    public Consent() {
    }

    public Consent(String patientId, boolean granted,
                   String purpose, LocalDateTime grantedAt) {
        this.patientId = patientId;
        this.granted = granted;
        this.purpose = purpose;
        this.grantedAt = grantedAt;
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

    public boolean isGranted() {
        return granted;
    }

    public void setGranted(boolean granted) {
        this.granted = granted;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public LocalDateTime getGrantedAt() {
        return grantedAt;
    }

    public void setGrantedAt(LocalDateTime grantedAt) {
        this.grantedAt = grantedAt;
    }
}