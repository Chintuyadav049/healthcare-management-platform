package com.healthcare.management.service.impl;

import com.healthcare.management.dto.ClinicalOperationDto;
import com.healthcare.management.entity.*;
import com.healthcare.management.exception.ResourceNotFoundException;
import com.healthcare.management.mapper.Mapper;
import com.healthcare.management.repository.*;
import com.healthcare.management.service.ClinicalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClinicalServiceImpl implements ClinicalService {

    @Autowired
    private ClinicalOperationRepository clinicalOperationRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public ClinicalOperationDto checkInPatient(Long patientId, Long doctorId, Long appointmentId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + patientId));

        Doctor doctor = null;
        if (doctorId != null) {
            doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));
        }

        Appointment appointment = null;
        if (appointmentId != null) {
            appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));
        }

        // Check if already in active clinical queue (not discharged)
        clinicalOperationRepository.findByPatientIdAndStatusNot(patientId, "DISCHARGED")
                .ifPresent(op -> {
                    throw new IllegalStateException("Patient is already checked in and in the clinical queue.");
                });

        // Token generation
        long totalCount = clinicalOperationRepository.count();
        String tokenNumber = "T-" + String.format("%03d", totalCount + 1);

        ClinicalOperation queueItem = ClinicalOperation.builder()
                .patient(patient)
                .doctor(doctor)
                .appointment(appointment)
                .tokenNumber(tokenNumber)
                .status("WAITING")
                .checkInTime(LocalDateTime.now())
                .build();

        ClinicalOperation saved = clinicalOperationRepository.save(queueItem);
        
        // Update appointment status to checked in/confirmed if exists
        if (appointment != null) {
            appointment.setStatus("CONFIRMED");
            appointmentRepository.save(appointment);
        }

        return Mapper.toClinicalOperationDto(saved);
    }

    @Override
    @Transactional
    public ClinicalOperationDto updateStatus(Long id, String status) {
        ClinicalOperation op = clinicalOperationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clinical operation entry not found with ID: " + id));

        op.setStatus(status.toUpperCase());
        if ("DISCHARGED".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status)) {
            op.setDischargeTime(LocalDateTime.now());
        }

        // If completed or discharged, and has appointment, complete appointment
        if (op.getAppointment() != null && ("COMPLETED".equalsIgnoreCase(status) || "DISCHARGED".equalsIgnoreCase(status))) {
            op.getAppointment().setStatus("COMPLETED");
            appointmentRepository.save(op.getAppointment());
        }

        ClinicalOperation updated = clinicalOperationRepository.save(op);
        return Mapper.toClinicalOperationDto(updated);
    }

    @Override
    public List<ClinicalOperationDto> getActiveQueue() {
        // Fetch items that are NOT discharged
        List<ClinicalOperation> active = clinicalOperationRepository.findByStatusNot("DISCHARGED");
        return active.stream().map(Mapper::toClinicalOperationDto).collect(Collectors.toList());
    }

    @Override
    public List<ClinicalOperationDto> getQueueByStatus(String status) {
        List<ClinicalOperation> items = clinicalOperationRepository.findByStatus(status.toUpperCase());
        return items.stream().map(Mapper::toClinicalOperationDto).collect(Collectors.toList());
    }
}
