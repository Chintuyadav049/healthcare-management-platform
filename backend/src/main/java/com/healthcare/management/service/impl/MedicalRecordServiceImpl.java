package com.healthcare.management.service.impl;

import com.healthcare.management.dto.MedicalRecordDto;
import com.healthcare.management.dto.PrescriptionDto;
import com.healthcare.management.entity.*;
import com.healthcare.management.exception.ResourceNotFoundException;
import com.healthcare.management.mapper.Mapper;
import com.healthcare.management.repository.*;
import com.healthcare.management.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private ClinicalOperationRepository clinicalOperationRepository;

    @Override
    @Transactional
    public MedicalRecordDto addMedicalRecord(MedicalRecordDto dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId()));

        Appointment appt = null;
        if (dto.getAppointmentId() != null) {
            appt = appointmentRepository.findById(dto.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + dto.getAppointmentId()));
        }

        MedicalRecord mr = Mapper.toMedicalRecord(dto, patient, doctor, appt);
        if (mr.getRecordDate() == null) {
            mr.setRecordDate(LocalDate.now());
        }

        MedicalRecord savedMr = medicalRecordRepository.save(mr);

        // Process nested prescriptions if present
        List<PrescriptionDto> savedPrescriptions = new ArrayList<>();
        if (dto.getPrescriptions() != null && !dto.getPrescriptions().isEmpty()) {
            for (PrescriptionDto rxDto : dto.getPrescriptions()) {
                Prescription rx = Prescription.builder()
                        .patient(patient)
                        .doctor(doctor)
                        .medicalRecord(savedMr)
                        .medicineName(rxDto.getMedicineName())
                        .dosage(rxDto.getDosage())
                        .frequency(rxDto.getFrequency())
                        .duration(rxDto.getDuration())
                        .instructions(rxDto.getInstructions())
                        .build();
                prescriptionRepository.save(rx);
                savedPrescriptions.add(Mapper.toPrescriptionDto(rx));
            }
        }

        // Auto-complete the patient's active clinical operations queue token if they are checked-in
        clinicalOperationRepository.findByPatientIdAndStatusNot(patient.getId(), "DISCHARGED")
                .ifPresent(op -> {
                    op.setStatus("COMPLETED");
                    clinicalOperationRepository.save(op);
                });

        // Set appointment as completed if it exists
        if (appt != null) {
            appt.setStatus("COMPLETED");
            appointmentRepository.save(appt);
        }

        MedicalRecordDto responseDto = Mapper.toMedicalRecordDto(savedMr);
        responseDto.setPrescriptions(savedPrescriptions);
        return responseDto;
    }

    @Override
    public List<MedicalRecordDto> getMedicalRecordsByPatient(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient not found with ID: " + patientId);
        }

        List<MedicalRecord> list = medicalRecordRepository.findByPatientIdOrderByRecordDateDesc(patientId);
        return list.stream().map(mr -> {
            MedicalRecordDto dto = Mapper.toMedicalRecordDto(mr);
            // Fetch associated prescriptions
            List<Prescription> rxList = prescriptionRepository.findByMedicalRecordId(mr.getId());
            dto.setPrescriptions(rxList.stream().map(Mapper::toPrescriptionDto).collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PrescriptionDto addPrescription(PrescriptionDto dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId()));

        MedicalRecord mr = medicalRecordRepository.findById(dto.getMedicalRecordId())
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with ID: " + dto.getMedicalRecordId()));

        Prescription rx = Prescription.builder()
                .patient(patient)
                .doctor(doctor)
                .medicalRecord(mr)
                .medicineName(dto.getMedicineName())
                .dosage(dto.getDosage())
                .frequency(dto.getFrequency())
                .duration(dto.getDuration())
                .instructions(dto.getInstructions())
                .build();

        Prescription saved = prescriptionRepository.save(rx);
        return Mapper.toPrescriptionDto(saved);
    }

    @Override
    public List<PrescriptionDto> getPrescriptionsByMedicalRecord(Long medicalRecordId) {
        if (!medicalRecordRepository.existsById(medicalRecordId)) {
            throw new ResourceNotFoundException("Medical record not found with ID: " + medicalRecordId);
        }
        List<Prescription> list = prescriptionRepository.findByMedicalRecordId(medicalRecordId);
        return list.stream().map(Mapper::toPrescriptionDto).collect(Collectors.toList());
    }
}
