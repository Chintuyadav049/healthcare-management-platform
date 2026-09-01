package com.healthcare.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordDto {
    private Long id;

    @NotNull(message = "Patient ID is required")
    private Long patientId;
    private String patientName;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    private String doctorName;

    private Long appointmentId;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    @NotBlank(message = "Symptoms description is required")
    private String symptoms;

    @NotBlank(message = "Treatment details are required")
    private String treatment;

    private String notes;
    private LocalDate recordDate;
    private List<PrescriptionDto> prescriptions;
}
