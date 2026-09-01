package com.healthcare.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDto {
    private Long id;

    @NotNull(message = "Patient ID is required")
    private Long patientId;
    private String patientName;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    private String doctorName;

    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;

    @NotNull(message = "Appointment time is required")
    private LocalTime appointmentTime;

    @NotBlank(message = "Reason for appointment is required")
    private String reason;

    private String notes;
    private String status; // "BOOKED", "CONFIRMED", "COMPLETED", "CANCELLED", "RESCHEDULED", "NO_SHOW"
    private LocalDateTime createdAt;
}
