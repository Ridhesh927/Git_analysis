package com.analyzer.service;

import com.analyzer.dto.AnalyticsResponseDTO;
import com.analyzer.dto.ContributorDTO;
import com.analyzer.model.Repository;
import com.analyzer.repository.ContributorRepository;
import com.analyzer.repository.RepositoryRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ContributorRepository contributorRepo;
    private final RepositoryRepository repoRepo;
    private final GitHubAPIService githubAPIService;
    private final RepositoryService repositoryService;
    private final IssueService issueService;

    public AnalyticsService(ContributorRepository contributorRepo, RepositoryRepository repoRepo,
                            GitHubAPIService githubAPIService, RepositoryService repositoryService,
                            IssueService issueService) {
        this.contributorRepo = contributorRepo;
        this.repoRepo = repoRepo;
        this.githubAPIService = githubAPIService;
        this.repositoryService = repositoryService;
        this.issueService = issueService;
    }

    /**
     * Full analytics for a repository: repo stats + issue stats + contributors + language.
     */
    public AnalyticsResponseDTO getFullAnalytics(@NonNull Long repoId) {
        Repository repo = repoRepo.findById(repoId)
                .orElseThrow(() -> new RuntimeException("Repository not found: " + repoId));

        var repoStats = repositoryService.getById(repoId);
        var issueStats = issueService.getIssueStats(repoId);
        var contributors = getTopContributors(repoId, 10);
        var languages = githubAPIService.fetchLanguages(repo.getOwner(), repo.getName());
        var prTrends = getPRTrends(repoId, 30);
        var activityTimeline = getActivityTimeline(repo.getOwner(), repo.getName());

        return AnalyticsResponseDTO.builder()
                .repoStats(repoStats)
                .issueStats(issueStats)
                .topContributors(contributors)
                .languageBreakdown(languages)
                .prTrends(prTrends)
                .activityTimeline(activityTimeline)
                .build();
    }

    /**
     * Top N contributors by commit count.
     */
    public List<ContributorDTO> getTopContributors(@NonNull Long repoId, int limit) {
        Set<String> seenLogins = new HashSet<>();
        return contributorRepo.findByRepoIdOrderByContributionsDesc(repoId).stream()
                .filter(c -> seenLogins.add(c.getLogin())) // Keep only the first occurrence of each login
                .limit(limit)
                .map(c -> ContributorDTO.builder()
                        .login(c.getLogin())
                        .avatarUrl(c.getAvatarUrl())
                        .htmlUrl(c.getHtmlUrl())
                        .contributions(c.getContributions())
                        .type(c.getType())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * PR merge trends over the last N days (count per week).
     */
    public List<Map<String, Object>> getPRTrends(@NonNull Long repoId, int days) {
        // Placeholder — real implementation queries issueRepo by date buckets
        return Collections.emptyList();
    }

    /**
     * Activity timeline from GitHub code frequency stats.
     */
    public List<Map<String, Object>> getActivityTimeline(String owner, String repo) {
        Object[] raw = githubAPIService.fetchCodeFrequency(owner, repo);
        if (raw == null) return Collections.emptyList();

        List<Map<String, Object>> timeline = new ArrayList<>();
        for (Object entry : raw) {
            if (entry instanceof List<?> week) {
                if (week.size() >= 3) {
                    Map<String, Object> point = new LinkedHashMap<>();
                    long timestamp = ((Number) week.get(0)).longValue() * 1000L;
                    point.put("timestamp", timestamp);
                    point.put("additions", ((Number) week.get(1)).longValue());
                    point.put("deletions", Math.abs(((Number) week.get(2)).longValue()));
                    timeline.add(point);
                }
            }
        }
        return timeline;
    }
}
