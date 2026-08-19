package com.analyzer.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "repo_metrics")
public class RepoMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long repoId;

    private Long totalCommits;
    private Long totalIssues;
    private Long openIssues;
    private Long closedIssues;
    private Long totalPRs;
    private Long openPRs;
    private Long mergedPRs;
    private Long totalContributors;
    private Double avgIssueCloseTimeDays;
    private Double avgPRMergeTimeDays;

    @Column(columnDefinition = "TEXT")
    private String languageBreakdown;   // JSON string: {"Java":12345,"Python":6789}

    private LocalDateTime cachedAt;
}
