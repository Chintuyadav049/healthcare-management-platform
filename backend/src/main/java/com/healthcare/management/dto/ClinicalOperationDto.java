package com.healthcare.management.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalOperationDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private String patientGender;
    private String patientDob;
    private Long doctorId;
    private String doctorName;
    private Long appointmentId;
    private String tokenNumber;
    private String status; // "WAITING", "CHECKED_IN", "WITH_DOCTOR", "UNDER_TREATMENT", "COMPLETED", "DISCHARGED"
    private LocalDateTime checkInTime;
    private LocalDateTime dischargeTime;
}
