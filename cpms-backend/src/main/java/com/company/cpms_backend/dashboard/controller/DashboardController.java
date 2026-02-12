package com.company.cpms_backend.dashboard.controller;

import com.company.cpms_backend.dashboard.dashboarddto.DashboardSummeryDTO;
import com.company.cpms_backend.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummeryDTO> getDashboardSummary(@RequestParam Long userId) {
        DashboardSummeryDTO summary = dashboardService.getDashboardSummary(userId);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(@RequestParam Long userId) {
        DashboardSummeryDTO summary = dashboardService.getDashboardSummary(userId);
        return ResponseEntity.ok(summary.getStats());
    }

    @GetMapping("/my-projects")
    public ResponseEntity<?> getUserProjects(@RequestParam Long userId) {
        DashboardSummeryDTO summary = dashboardService.getDashboardSummary(userId);
        return ResponseEntity.ok(summary.getMyProjects());
    }

    @GetMapping("/todays-tasks")
    public ResponseEntity<?> getTodaysTasks(@RequestParam Long userId) {
        DashboardSummeryDTO summary = dashboardService.getDashboardSummary(userId);
        return ResponseEntity.ok(summary.getTodaysTasks());
    }
}