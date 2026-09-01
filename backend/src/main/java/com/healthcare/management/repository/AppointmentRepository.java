package com.healthcare.management.repository;

import com.healthcare.management.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
        Long doctorId, LocalDate appointmentDate, LocalTime appointmentTime, String status
    );

    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByAppointmentDate(LocalDate appointmentDate);

    @Query("SELECT a FROM Appointment a WHERE " +
           "(:doctorId IS NULL OR a.doctor.id = :doctorId) AND " +
           "(:patientId IS NULL OR a.patient.id = :patientId) AND " +
           "(:date IS NULL OR a.appointmentDate = :date) AND " +
           "(:status IS NULL OR a.status = :status) " +
           "ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> filterAppointments(
        @Param("doctorId") Long doctorId,
        @Param("patientId") Long patientId,
        @Param("date") LocalDate date,
        @Param("status") String status
    );

    long countByAppointmentDate(LocalDate date);
    long countByStatus(String status);
}
