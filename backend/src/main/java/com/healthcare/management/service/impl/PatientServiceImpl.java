package com.healthcare.management.service.impl;

import com.healthcare.management.dto.PatientDto;
import com.healthcare.management.entity.Patient;
import com.healthcare.management.exception.DuplicateResourceException;
import com.healthcare.management.exception.ResourceNotFoundException;
import com.healthcare.management.mapper.Mapper;
import com.healthcare.management.repository.PatientRepository;
import com.healthcare.management.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public PatientDto createPatient(PatientDto patientDto) {
        if (patientRepository.existsByEmail(patientDto.getEmail())) {
            throw new DuplicateResourceException("Patient email already exists: " + patientDto.getEmail());
        }

        Patient patient = Mapper.toPatient(patientDto);
        Patient savedPatient = patientRepository.save(patient);
        return Mapper.toPatientDto(savedPatient);
    }

    @Override
    public PatientDto updatePatient(Long id, PatientDto patientDto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));

        // Check if email changed and is taken
        if (!patient.getEmail().equalsIgnoreCase(patientDto.getEmail()) &&
                patientRepository.existsByEmail(patientDto.getEmail())) {
            throw new DuplicateResourceException("Patient email already exists: " + patientDto.getEmail());
        }

        patient.setFirstName(patientDto.getFirstName());
        patient.setLastName(patientDto.getLastName());
        patient.setDateOfBirth(patientDto.getDateOfBirth());
        patient.setGender(patientDto.getGender());
        patient.setBloodGroup(patientDto.getBloodGroup());
        patient.setPhone(patientDto.getPhone());
        patient.setEmail(patientDto.getEmail());
        patient.setAddress(patientDto.getAddress());
        patient.setEmergencyContact(patientDto.getEmergencyContact());
        if (patientDto.getStatus() != null) {
            patient.setStatus(patientDto.getStatus());
        }
        patient.setMedicalHistory(patientDto.getMedicalHistory());
        patient.setAllergies(patientDto.getAllergies());

        Patient updatedPatient = patientRepository.save(patient);
        return Mapper.toPatientDto(updatedPatient);
    }

    @Override
    public PatientDto getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));
        return Mapper.toPatientDto(patient);
    }

    @Override
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with ID: " + id);
        }
        patientRepository.deleteById(id);
    }

    @Override
    public Page<PatientDto> getPatients(String query, String status, int page, int size) {
        String searchQuery = (query == null || query.trim().isEmpty()) ? null : query.trim();
        String searchStatus = (status == null || status.trim().isEmpty() || status.equalsIgnoreCase("ALL")) ? null : status.trim();

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Patient> patientPage = patientRepository.searchPatients(searchQuery, searchStatus, pageable);

        return patientPage.map(Mapper::toPatientDto);
    }
}
