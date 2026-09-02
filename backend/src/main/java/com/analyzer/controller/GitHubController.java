package com.analyzer.controller;

import com.analyzer.dto.RepoStatsDTO;
import com.analyzer.service.RepositoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/repos")
@CrossOrigin(origins = "*")
public class GitHubController {

    private final RepositoryService repositoryService;

    public GitHubController(RepositoryService repositoryService) {
        this.repositoryService = repositoryService;
    }

    /**
     * GET /api/repos/search?username=torvalds&repo=linux
     * Searches GitHub and persists the repo.
     */
    @GetMapping("/search")
    public ResponseEntity<RepoStatsDTO> search(
            @RequestParam String username,
            @RequestParam String repo) {
        return ResponseEntity.ok(repositoryService.searchRepository(username, repo));
    }

    /**
     * GET /api/repos — list all tracked repositories
     */
    @GetMapping
    public ResponseEntity<List<RepoStatsDTO>> listAll() {
        return ResponseEntity.ok(repositoryService.listAll());
    }

    /**
     * GET /api/repos/{id}/metrics
     */
    @GetMapping("/{id}/metrics")
    public ResponseEntity<RepoStatsDTO> getMetrics(@PathVariable Long id) {
        return ResponseEntity.ok(repositoryService.getById(id));
    }

    /**
     * GET /api/repos/{id}/languages
     */
    @GetMapping("/{id}/languages")
    public ResponseEntity<Map<String, Long>> getLanguages(@PathVariable Long id) {
        return ResponseEntity.ok(repositoryService.getLanguages(id));
    }

    /**
     * POST /api/repos/track
     * Body: { "owner": "facebook", "repo": "react" }
     */
    @PostMapping("/track")
    public ResponseEntity<RepoStatsDTO> trackRepo(@RequestBody Map<String, String> body) {
        String owner = body.get("owner");
        String repo = body.get("repo");
        return ResponseEntity.ok(repositoryService.trackRepository(owner, repo));
    }

    /**
     * GET /api/repos/{id}/commits
     * Fetch recent commits with details
     */
    @GetMapping("/{id}/commits")
    public ResponseEntity<List<Map<String, Object>>> getCommits(
            @PathVariable Long id,
            @RequestParam(defaultValue = "30") int limit) {
        return ResponseEntity.ok(repositoryService.getCommits(id, limit));
    }
}
