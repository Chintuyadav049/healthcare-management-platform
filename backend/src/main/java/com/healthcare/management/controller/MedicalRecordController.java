package com.healthcare.management.controller;

import com.healthcare.management.dto.MedicalRecordDto;
import com.healthcare.management.dto.PrescriptionDto;
import com.healthcare.management.service.MedicalRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @PostMapping("/medical-records")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<MedicalRecordDto> createMedicalRecord(@Valid @RequestBody MedicalRecordDto dto) {
        MedicalRecordDto created = medicalRecordService.addMedicalRecord(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/medical-records/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<List<MedicalRecordDto>> getPatientMedicalRecords(@PathVariable Long patientId) {
        List<MedicalRecordDto> records = medicalRecordService.getMedicalRecordsByPatient(patientId);
        return ResponseEntity.ok(records);
    }

    @PostMapping("/prescriptions")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<PrescriptionDto> createPrescription(@Valid @RequestBody PrescriptionDto dto) {
        PrescriptionDto created = medicalRecordService.addPrescription(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
