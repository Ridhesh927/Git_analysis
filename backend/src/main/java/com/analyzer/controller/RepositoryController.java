package com.analyzer.controller;

import com.analyzer.model.Issue;
import com.analyzer.service.IssueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RepositoryController {

    private final IssueService issueService;

    public RepositoryController(IssueService issueService) {
        this.issueService = issueService;
    }

    /**
     * GET /api/issues?repo_id=1&status=open
     */
    @GetMapping("/issues")
    public ResponseEntity<List<Issue>> getIssues(
            @RequestParam("repo_id") Long repoId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(issueService.getIssues(repoId, status));
    }

    /**
     * GET /api/prs?repo_id=1&sort=created
     */
    @GetMapping("/prs")
    public ResponseEntity<List<Issue>> getPRs(
            @RequestParam("repo_id") Long repoId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(issueService.getPullRequests(repoId, status));
    }
}
