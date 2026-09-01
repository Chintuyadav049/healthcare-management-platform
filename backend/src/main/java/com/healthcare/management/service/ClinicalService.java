package com.healthcare.management.service;

import com.healthcare.management.dto.ClinicalOperationDto;
import java.util.List;

public interface ClinicalService {
    ClinicalOperationDto checkInPatient(Long patientId, Long doctorId, Long appointmentId);
    ClinicalOperationDto updateStatus(Long id, String status);
    List<ClinicalOperationDto> getActiveQueue();
    List<ClinicalOperationDto> getQueueByStatus(String status);
}
