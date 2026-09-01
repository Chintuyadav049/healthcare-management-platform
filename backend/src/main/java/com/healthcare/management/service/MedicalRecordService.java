package com.healthcare.management.service;

import com.healthcare.management.dto.MedicalRecordDto;
import com.healthcare.management.dto.PrescriptionDto;
import java.util.List;

public interface MedicalRecordService {
    MedicalRecordDto addMedicalRecord(MedicalRecordDto dto);
    List<MedicalRecordDto> getMedicalRecordsByPatient(Long patientId);
    PrescriptionDto addPrescription(PrescriptionDto dto);
    List<PrescriptionDto> getPrescriptionsByMedicalRecord(Long medicalRecordId);
}
