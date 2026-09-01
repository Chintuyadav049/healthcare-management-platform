package com.healthcare.management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDto {
    private Long id;
    private Long userId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Specialization ID is required")
    private Long specializationId;
    private String specializationName;

    @NotNull(message = "Department ID is required")
    private Long departmentId;
    private String departmentName;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    @NotBlank(message = "Qualification is required")
    private String qualification;

    @NotNull(message = "Experience is required")
    private Integer experience;

    @NotNull(message = "Consultation fee is required")
    private BigDecimal consultationFee;

    private String availabilityStatus; // "AVAILABLE", "UNAVAILABLE", "ON_LEAVE"
    private String password; // optional, used to initialize credentials when creating doctor
}
