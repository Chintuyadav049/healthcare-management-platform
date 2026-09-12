package medisphere.service;

import medisphere.model.AuditLog;
import medisphere.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String username, String action, String patientId) {

        AuditLog auditLog = new AuditLog(
                username,
                action,
                patientId,
                LocalDateTime.now()
        );

        auditLogRepository.save(auditLog);
    }
}