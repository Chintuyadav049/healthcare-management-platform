package com.healthcare.management.service;

import com.healthcare.management.dto.AppointmentDto;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentService {
    AppointmentDto bookAppointment(AppointmentDto appointmentDto);
    AppointmentDto updateAppointment(Long id, AppointmentDto appointmentDto);
    AppointmentDto getAppointmentById(Long id);
    List<AppointmentDto> getFilteredAppointments(Long doctorId, Long patientId, LocalDate date, String status);
    AppointmentDto updateAppointmentStatus(Long id, String status);
    List<LocalTime> getDoctorBookedSlots(Long doctorId, LocalDate date);
}
