package com.healthcare.management.controller;

import com.healthcare.management.dto.ClinicalOperationDto;
import com.healthcare.management.service.ClinicalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clinical")
public class ClinicalController {

    @Autowired
    private ClinicalService clinicalService;

    @GetMapping("/queue")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<List<ClinicalOperationDto>> getActiveQueue() {
        List<ClinicalOperationDto> queue = clinicalService.getActiveQueue();
        return ResponseEntity.ok(queue);
    }

    @PostMapping("/check-in")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<ClinicalOperationDto> checkInPatient(
            @RequestParam("patientId") Long patientId,
            @RequestParam(value = "doctorId", required = false) Long doctorId,
            @RequestParam(value = "appointmentId", required = false) Long appointmentId) {
        ClinicalOperationDto created = clinicalService.checkInPatient(patientId, doctorId, appointmentId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<ClinicalOperationDto> updateStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        ClinicalOperationDto updated = clinicalService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
