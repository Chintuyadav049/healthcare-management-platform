package com.healthcare.management.service.impl;

import com.healthcare.management.dto.AppointmentDto;
import com.healthcare.management.entity.Appointment;
import com.healthcare.management.entity.Doctor;
import com.healthcare.management.entity.Patient;
import com.healthcare.management.exception.InvalidAppointmentException;
import com.healthcare.management.exception.ResourceNotFoundException;
import com.healthcare.management.mapper.Mapper;
import com.healthcare.management.repository.AppointmentRepository;
import com.healthcare.management.repository.DoctorRepository;
import com.healthcare.management.repository.PatientRepository;
import com.healthcare.management.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public AppointmentDto bookAppointment(AppointmentDto dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId()));

        // Double booking check: same doctor, same date, same time, status != CANCELLED
        boolean hasOverlap = appointmentRepository
                .existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                        doctor.getId(), dto.getAppointmentDate(), dto.getAppointmentTime(), "CANCELLED"
                );

        if (hasOverlap) {
            throw new InvalidAppointmentException("The doctor is already booked at " + dto.getAppointmentTime() + " on " + dto.getAppointmentDate());
        }

        Appointment appt = Mapper.toAppointment(dto, patient, doctor);
        appt.setStatus("BOOKED");
        Appointment savedAppt = appointmentRepository.save(appt);

        return Mapper.toAppointmentDto(savedAppt);
    }

    @Override
    public AppointmentDto updateAppointment(Long id, AppointmentDto dto) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId()));

        // If rescheduling, check for double booking on new date/time
        if (!appt.getAppointmentDate().equals(dto.getAppointmentDate()) || !appt.getAppointmentTime().equals(dto.getAppointmentTime())) {
            boolean hasOverlap = appointmentRepository
                    .existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                            doctor.getId(), dto.getAppointmentDate(), dto.getAppointmentTime(), "CANCELLED"
                    );

            if (hasOverlap) {
                throw new InvalidAppointmentException("The doctor is already booked at " + dto.getAppointmentTime() + " on " + dto.getAppointmentDate());
            }
            appt.setStatus("RESCHEDULED");
        }

        appt.setPatient(patient);
        appt.setDoctor(doctor);
        appt.setAppointmentDate(dto.getAppointmentDate());
        appt.setAppointmentTime(dto.getAppointmentTime());
        appt.setReason(dto.getReason());
        appt.setNotes(dto.getNotes());
        if (dto.getStatus() != null) {
            appt.setStatus(dto.getStatus());
        }

        Appointment updated = appointmentRepository.save(appt);
        return Mapper.toAppointmentDto(updated);
    }

    @Override
    public AppointmentDto getAppointmentById(Long id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        return Mapper.toAppointmentDto(appt);
    }

    @Override
    public List<AppointmentDto> getFilteredAppointments(Long doctorId, Long patientId, LocalDate date, String status) {
        String filterStatus = (status == null || status.trim().isEmpty() || status.equalsIgnoreCase("ALL")) ? null : status.trim();
        List<Appointment> list = appointmentRepository.filterAppointments(doctorId, patientId, date, filterStatus);
        return list.stream().map(Mapper::toAppointmentDto).collect(Collectors.toList());
    }

    @Override
    public AppointmentDto updateAppointmentStatus(Long id, String status) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        String oldStatus = appt.getStatus();
        // Business Rule: Cancelled appointments cannot be completed.
        if ("CANCELLED".equalsIgnoreCase(oldStatus) && "COMPLETED".equalsIgnoreCase(status)) {
            throw new InvalidAppointmentException("Cannot complete an appointment that has been cancelled.");
        }

        appt.setStatus(status.toUpperCase());
        Appointment saved = appointmentRepository.save(appt);
        return Mapper.toAppointmentDto(saved);
    }

    @Override
    public List<LocalTime> getDoctorBookedSlots(Long doctorId, LocalDate date) {
        List<Appointment> appts = appointmentRepository.filterAppointments(doctorId, null, date, null);
        return appts.stream()
                .filter(a -> !"CANCELLED".equalsIgnoreCase(a.getStatus()))
                .map(Appointment::getAppointmentTime)
                .collect(Collectors.toList());
    }
}
