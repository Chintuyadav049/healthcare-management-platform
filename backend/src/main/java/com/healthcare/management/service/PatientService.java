package com.healthcare.management.service;

import com.healthcare.management.dto.PatientDto;
import org.springframework.data.domain.Page;

public interface PatientService {
    PatientDto createPatient(PatientDto patientDto);
    PatientDto updatePatient(Long id, PatientDto patientDto);
    PatientDto getPatientById(Long id);
    void deletePatient(Long id);
    Page<PatientDto> getPatients(String query, String status, int page, int size);
}
