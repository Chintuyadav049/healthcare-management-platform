package com.healthcare.management.repository;

import com.healthcare.management.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByMedicalRecordId(Long medicalRecordId);
    List<Prescription> findByPatientId(Long patientId);
}
