package com.analyzer.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueStatsDTO {
    private Long totalIssues;
    private Long openIssues;
    private Long closedIssues;
    private Double avgCloseTimeDays;
    private Long totalPRs;
    private Long openPRs;
    private Long mergedPRs;
    private Double avgMergeTimeDays;
}
