package com.analyzer.service;

import com.analyzer.dto.IssueStatsDTO;
import com.analyzer.model.Issue;
import com.analyzer.model.Repository;
import com.analyzer.repository.IssueRepository;
import com.analyzer.repository.RepositoryRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class IssueService {

    private final IssueRepository issueRepo;
    private final RepositoryRepository repoRepo;
    private final GitHubAPIService githubAPIService;

    public IssueService(IssueRepository issueRepo, RepositoryRepository repoRepo,
                        GitHubAPIService githubAPIService) {
        this.issueRepo = issueRepo;
        this.repoRepo = repoRepo;
        this.githubAPIService = githubAPIService;
    }

    /**
     * Fetch + refresh issues for a repository, return filtered list.
     */
    public List<Issue> getIssues(@NonNull Long repoId, String state) {
        Repository repo = getRepo(repoId);
        githubAPIService.fetchAndSaveIssues(repo.getOwner(), repo.getName(), repoId);
        if (state != null && !state.isBlank()) {
            return issueRepo.findByRepoIdAndState(repoId, state);
        }
        return issueRepo.findByRepoIdAndIsPullRequest(repoId, false);
    }

    /**
     * Fetch + refresh PRs for a repository.
     */
    public List<Issue> getPullRequests(@NonNull Long repoId, String state) {
        Repository repo = getRepo(repoId);
        githubAPIService.fetchAndSaveIssues(repo.getOwner(), repo.getName(), repoId);
        List<Issue> prs = issueRepo.findByRepoIdAndIsPullRequest(repoId, true);
        if (state != null && !state.isBlank()) {
            return prs.stream().filter(pr -> pr.getState().equals(state)).toList();
        }
        return prs;
    }

    /**
     * Calculate issue stats (open/closed counts, avg close time).
     */
    public IssueStatsDTO getIssueStats(@NonNull Long repoId) {
        List<Issue> allIssues = issueRepo.findByRepoIdAndIsPullRequest(repoId, false);
        List<Issue> allPRs = issueRepo.findByRepoIdAndIsPullRequest(repoId, true);

        long openIssues = allIssues.stream().filter(i -> "open".equals(i.getState())).count();
        long closedIssues = allIssues.stream().filter(i -> "closed".equals(i.getState())).count();

        double avgIssueClose = allIssues.stream()
                .filter(i -> "closed".equals(i.getState()) && i.getClosedAt() != null && i.getCreatedAt() != null)
                .mapToLong(i -> Duration.between(i.getCreatedAt(), i.getClosedAt()).toDays())
                .average().orElse(0.0);

        long openPRs = allPRs.stream().filter(p -> "open".equals(p.getState())).count();
        long mergedPRs = allPRs.stream().filter(p -> "closed".equals(p.getState())).count();

        double avgPRMerge = allPRs.stream()
                .filter(p -> "closed".equals(p.getState()) && p.getClosedAt() != null && p.getCreatedAt() != null)
                .mapToLong(p -> Duration.between(p.getCreatedAt(), p.getClosedAt()).toDays())
                .average().orElse(0.0);

        return IssueStatsDTO.builder()
                .totalIssues((long) allIssues.size())
                .openIssues(openIssues)
                .closedIssues(closedIssues)
                .avgCloseTimeDays(avgIssueClose)
                .totalPRs((long) allPRs.size())
                .openPRs(openPRs)
                .mergedPRs(mergedPRs)
                .avgMergeTimeDays(avgPRMerge)
                .build();
    }

    private Repository getRepo(@NonNull Long repoId) {
        return repoRepo.findById(repoId)
                .orElseThrow(() -> new RuntimeException("Repository not found with id: " + repoId));
    }
}
