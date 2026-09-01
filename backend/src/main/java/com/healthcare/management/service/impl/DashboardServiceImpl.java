package com.healthcare.management.service.impl;

import com.healthcare.management.dto.ChartItemDto;
import com.healthcare.management.dto.DashboardStatsDto;
import com.healthcare.management.entity.*;
import com.healthcare.management.repository.*;
import com.healthcare.management.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ClinicalOperationRepository clinicalOperationRepository;

    @Override
    public DashboardStatsDto getDashboardStatistics() {
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long todayAppointments = appointmentRepository.countByAppointmentDate(LocalDate.now());
        long completedAppointments = appointmentRepository.countByStatus("COMPLETED");
        long cancelledAppointments = appointmentRepository.countByStatus("CANCELLED");

        long pendingPatients = clinicalOperationRepository.countByStatus("WAITING") 
                + clinicalOperationRepository.countByStatus("CHECKED_IN");
        long patientsCheckedIn = clinicalOperationRepository.countByStatus("CHECKED_IN") 
                + clinicalOperationRepository.countByStatus("WAITING");
        long patientsUnderTreatment = clinicalOperationRepository.countByStatus("UNDER_TREATMENT") 
                + clinicalOperationRepository.countByStatus("WITH_DOCTOR");

        // 1. Appointments per day (last 7 days)
        List<ChartItemDto> appointmentsPerDay = new ArrayList<>();
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("MM-dd");
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            long count = appointmentRepository.countByAppointmentDate(date);
            appointmentsPerDay.add(new ChartItemDto(date.format(dayFormatter), count));
        }

        // 2. Patients registered per month (current year)
        List<ChartItemDto> patientsRegisteredPerMonth = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        Map<Integer, Long> patientMonthlyCount = patientRepository.findAll().stream()
                .filter(p -> p.getRegistrationDate() != null && p.getRegistrationDate().getYear() == LocalDate.now().getYear())
                .collect(Collectors.groupingBy(p -> p.getRegistrationDate().getMonthValue(), Collectors.counting()));
        for (int m = 1; m <= 12; m++) {
            patientsRegisteredPerMonth.add(new ChartItemDto(months[m - 1], patientMonthlyCount.getOrDefault(m, 0L)));
        }

        // 3. Appointments by status
        Map<String, Long> apptStatusCounts = appointmentRepository.findAll().stream()
                .collect(Collectors.groupingBy(Appointment::getStatus, Collectors.counting()));
        List<ChartItemDto> appointmentsByStatus = apptStatusCounts.entrySet().stream()
                .map(entry -> new ChartItemDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        // 4. Patients by gender
        Map<String, Long> patientGenderCounts = patientRepository.findAll().stream()
                .collect(Collectors.groupingBy(Patient::getGender, Collectors.counting()));
        List<ChartItemDto> patientsByGender = patientGenderCounts.entrySet().stream()
                .map(entry -> new ChartItemDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        // 5. Doctors by specialization
        Map<String, Long> doctorSpecCounts = doctorRepository.findAll().stream()
                .collect(Collectors.groupingBy(d -> d.getSpecialization().getName(), Collectors.counting()));
        List<ChartItemDto> doctorsBySpecialization = doctorSpecCounts.entrySet().stream()
                .map(entry -> new ChartItemDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalPatients(totalPatients)
                .totalDoctors(totalDoctors)
                .todayAppointments(todayAppointments)
                .pendingPatients(pendingPatients)
                .completedAppointments(completedAppointments)
                .cancelledAppointments(cancelledAppointments)
                .patientsCheckedIn(patientsCheckedIn)
                .patientsUnderTreatment(patientsUnderTreatment)
                .appointmentsPerDay(appointmentsPerDay)
                .patientsRegisteredPerMonth(patientsRegisteredPerMonth)
                .appointmentsByStatus(appointmentsByStatus)
                .patientsByGender(patientsByGender)
                .doctorsBySpecialization(doctorsBySpecialization)
                .build();
    }
}
