package com.analyzer.controller;

import com.analyzer.dto.AnalyticsResponseDTO;
import com.analyzer.dto.ContributorDTO;
import com.analyzer.dto.IssueStatsDTO;
import com.analyzer.service.AnalyticsService;
import com.analyzer.service.IssueService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final IssueService issueService;

    public AnalyticsController(AnalyticsService analyticsService, IssueService issueService) {
        this.analyticsService = analyticsService;
        this.issueService = issueService;
    }

    /**
     * GET /api/analytics/full?repo_id=1
     * Full analytics bundle (repo + issues + contributors + languages + timeline).
     */
    @GetMapping("/full")
    public ResponseEntity<AnalyticsResponseDTO> getFullAnalytics(@RequestParam("repo_id") @NonNull Long repoId) {
        return ResponseEntity.ok(analyticsService.getFullAnalytics(repoId));
    }

    /**
     * GET /api/analytics/contributors?repo_id=1
     */
    @GetMapping("/contributors")
    public ResponseEntity<List<ContributorDTO>> getContributors(@RequestParam("repo_id") @NonNull Long repoId) {
        return ResponseEntity.ok(analyticsService.getTopContributors(repoId, 20));
    }

    /**
     * GET /api/analytics/pr-trends?repo_id=1&days=30
     */
    @GetMapping("/pr-trends")
    public ResponseEntity<List<Map<String, Object>>> getPRTrends(
            @RequestParam("repo_id") @NonNull Long repoId,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.getPRTrends(repoId, days));
    }

    /**
     * GET /api/analytics/issue-stats?repo_id=1
     */
    @GetMapping("/issue-stats")
    public ResponseEntity<IssueStatsDTO> getIssueStats(@RequestParam("repo_id") @NonNull Long repoId) {
        return ResponseEntity.ok(issueService.getIssueStats(repoId));
    }

    /**
     * GET /api/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "github-analyzer"));
    }
}
