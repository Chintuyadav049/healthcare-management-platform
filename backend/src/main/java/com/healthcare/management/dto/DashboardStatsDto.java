package com.healthcare.management.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private long totalPatients;
    private long totalDoctors;
    private long todayAppointments;
    private long pendingPatients;
    private long completedAppointments;
    private long cancelledAppointments;
    private long patientsCheckedIn;
    private long patientsUnderTreatment;

    // Charts
    private List<ChartItemDto> appointmentsPerDay;
    private List<ChartItemDto> patientsRegisteredPerMonth;
    private List<ChartItemDto> appointmentsByStatus;
    private List<ChartItemDto> patientsByGender;
    private List<ChartItemDto> doctorsBySpecialization;
}
