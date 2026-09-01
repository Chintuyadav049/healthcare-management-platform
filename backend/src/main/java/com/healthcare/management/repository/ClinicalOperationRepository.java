package com.healthcare.management.repository;

import com.healthcare.management.entity.ClinicalOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ClinicalOperationRepository extends JpaRepository<ClinicalOperation, Long> {
    List<ClinicalOperation> findByStatus(String status);
    List<ClinicalOperation> findByStatusNot(String status);
    long countByStatus(String status);
    Optional<ClinicalOperation> findByPatientIdAndStatusNot(Long patientId, String status);
}
