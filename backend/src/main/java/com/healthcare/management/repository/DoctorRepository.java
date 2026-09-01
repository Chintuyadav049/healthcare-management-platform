package com.healthcare.management.repository;

import com.healthcare.management.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserEmail(String email);
    Optional<Doctor> findByUserId(Long userId);
    boolean existsByLicenseNumber(String licenseNumber);

    @Query("SELECT d FROM Doctor d WHERE " +
           "(:query IS NULL OR d.user.firstName LIKE %:query% OR d.user.lastName LIKE %:query% " +
           "OR d.specialization.name LIKE %:query% OR d.department.name LIKE %:query%)")
    List<Doctor> searchDoctors(@Param("query") String query);
}
