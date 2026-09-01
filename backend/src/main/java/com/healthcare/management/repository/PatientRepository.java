package com.healthcare.management.repository;

import com.healthcare.management.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Patient> findByUserId(Long userId);

    @Query("SELECT p FROM Patient p WHERE " +
           "(:query IS NULL OR LOWER(p.firstName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR p.phone LIKE %:query% OR LOWER(p.email) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR CAST(p.id AS string) LIKE %:query%) AND " +
           "(:status IS NULL OR p.status = :status)")
    Page<Patient> searchPatients(@Param("query") String query, @Param("status") String status, Pageable pageable);
}
