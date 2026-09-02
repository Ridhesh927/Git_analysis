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
    public IssueService(IssueRepository issueRepo, RepositoryRepository repoRepo) {
        this.issueRepo = issueRepo;
        this.repoRepo = repoRepo;
    }

    /**
     * Fetch + refresh issues for a repository, return filtered list.
     */
    public List<Issue> getIssues(@NonNull Long repoId, String state) {
        getRepo(repoId); // ensure repo exists
        if (state != null && !state.isBlank()) {
            return issueRepo.findByRepoIdAndState(repoId, state);
        }
        return issueRepo.findByRepoIdAndIsPullRequest(repoId, false);
    }

    /**
     * Fetch + refresh PRs for a repository.
     */
    public List<Issue> getPullRequests(@NonNull Long repoId, String state) {
        getRepo(repoId); // ensure repo exists
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

        // Advanced Metrics Calculation
        long bugCount = 0;
        long enhancementCount = 0;
        
        double totalSentimentScore = 0;
        int sentimentCount = 0;
        
        List<String> positiveWords = List.of("thanks", "great", "awesome", "lgtm", "appreciate", "good", "excellent", "fix");
        List<String> negativeWords = List.of("broken", "terrible", "frustrating", "annoying", "hate", "worst", "shit", "stupid", "critical", "fail", "bug");

        for (Issue issue : allIssues) {
            if (issue.getLabels() != null) {
                String labels = issue.getLabels().toLowerCase();
                if (labels.contains("bug") || labels.contains("defect") || labels.contains("error")) {
                    bugCount++;
                }
                if (labels.contains("enhancement") || labels.contains("feature") || labels.contains("improvement")) {
                    enhancementCount++;
                }
            }
            
            String text = (issue.getTitle() + " " + (issue.getBody() != null ? issue.getBody() : "")).toLowerCase();
            int pos = 0, neg = 0;
            for (String pw : positiveWords) if (text.contains(pw)) pos++;
            for (String nw : negativeWords) if (text.contains(nw)) neg++;
            
            if (pos > 0 || neg > 0) {
                totalSentimentScore += (double) pos / (pos + neg) * 100;
                sentimentCount++;
            }
        }

        for (Issue pr : allPRs) {
            String text = (pr.getTitle() + " " + (pr.getBody() != null ? pr.getBody() : "")).toLowerCase();
            int pos = 0, neg = 0;
            for (String pw : positiveWords) if (text.contains(pw)) pos++;
            for (String nw : negativeWords) if (text.contains(nw)) neg++;
            
            if (pos > 0 || neg > 0) {
                totalSentimentScore += (double) pos / (pos + neg) * 100;
                sentimentCount++;
            }
        }

        double healthScore = sentimentCount > 0 ? totalSentimentScore / sentimentCount : 50.0;
        double techDebtRatio = enhancementCount > 0 ? (double) bugCount / enhancementCount : bugCount;

        long lateNightMerges = 0;
        for (Issue pr : allPRs) {
            if ("closed".equals(pr.getState()) && pr.getClosedAt() != null) {
                int hour = pr.getClosedAt().getHour();
                if (hour >= 0 && hour <= 5) {
                    lateNightMerges++;
                }
            }
        }
        
        double burnoutMeter = mergedPRs > 0 ? ((double) lateNightMerges / mergedPRs) * 100 : 0.0;

        return IssueStatsDTO.builder()
                .totalIssues((long) allIssues.size())
                .openIssues(openIssues)
                .closedIssues(closedIssues)
                .avgCloseTimeDays(avgIssueClose)
                .totalPRs((long) allPRs.size())
                .openPRs(openPRs)
                .mergedPRs(mergedPRs)
                .avgMergeTimeDays(avgPRMerge)
                .healthScore(healthScore)
                .burnoutMeter(burnoutMeter)
                .bugCount(bugCount)
                .enhancementCount(enhancementCount)
                .techDebtRatio(techDebtRatio)
                .build();
    }

    private Repository getRepo(@NonNull Long repoId) {
        return repoRepo.findById(repoId)
                .orElseThrow(() -> new RuntimeException("Repository not found with id: " + repoId));
    }
}
