package com.healthcare.management.controller;

import com.healthcare.management.dto.DashboardStatsDto;
import com.healthcare.management.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<DashboardStatsDto> getStatistics() {
        DashboardStatsDto stats = dashboardService.getDashboardStatistics();
        return ResponseEntity.ok(stats);
    }
}
