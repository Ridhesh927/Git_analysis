package com.analyzer.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponseDTO {
    private RepoStatsDTO repoStats;
    private IssueStatsDTO issueStats;
    private List<ContributorDTO> topContributors;
    private Map<String, Long> languageBreakdown;
    private List<Map<String, Object>> activityTimeline;
    private List<Map<String, Object>> prTrends;
    private String repoRoast;
}
