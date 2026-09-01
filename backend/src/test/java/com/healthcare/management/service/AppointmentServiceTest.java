package com.healthcare.management.service;

import com.healthcare.management.dto.AppointmentDto;
import com.healthcare.management.entity.Appointment;
import com.healthcare.management.entity.Doctor;
import com.healthcare.management.entity.Patient;
import com.healthcare.management.exception.InvalidAppointmentException;
import com.healthcare.management.repository.AppointmentRepository;
import com.healthcare.management.repository.DoctorRepository;
import com.healthcare.management.repository.PatientRepository;
import com.healthcare.management.service.impl.AppointmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private AppointmentServiceImpl appointmentService;

    private Patient patient;
    private Doctor doctor;
    private AppointmentDto appointmentDto;

    @BeforeEach
    public void setup() {
        patient = new Patient();
        patient.setId(1L);
        patient.setFirstName("John");
        patient.setLastName("Doe");

        doctor = new Doctor();
        doctor.setId(1L);

        appointmentDto = AppointmentDto.builder()
                .patientId(1L)
                .doctorId(1L)
                .appointmentDate(LocalDate.now().plusDays(2))
                .appointmentTime(LocalTime.of(10, 0))
                .reason("Routine checkup")
                .build();
    }

    @Test
    public void testBookAppointment_Success() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        when(appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                eq(1L), any(LocalDate.class), any(LocalTime.class), eq("CANCELLED")))
                .thenReturn(false);

        Appointment savedAppointment = new Appointment();
        savedAppointment.setId(10L);
        savedAppointment.setPatient(patient);
        savedAppointment.setDoctor(doctor);
        savedAppointment.setAppointmentDate(appointmentDto.getAppointmentDate());
        savedAppointment.setAppointmentTime(appointmentDto.getAppointmentTime());
        savedAppointment.setReason(appointmentDto.getReason());
        savedAppointment.setStatus("BOOKED");

        when(appointmentRepository.save(any(Appointment.class))).thenReturn(savedAppointment);

        AppointmentDto result = appointmentService.bookAppointment(appointmentDto);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("BOOKED", result.getStatus());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
    }

    @Test
    public void testBookAppointment_DoubleBooking_ThrowsException() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        // Simulate that the doctor is already booked at this date and time
        when(appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                eq(1L), any(LocalDate.class), any(LocalTime.class), eq("CANCELLED")))
                .thenReturn(true);

        assertThrows(InvalidAppointmentException.class, () -> {
            appointmentService.bookAppointment(appointmentDto);
        });

        verify(appointmentRepository, never()).save(any(Appointment.class));
    }
}
