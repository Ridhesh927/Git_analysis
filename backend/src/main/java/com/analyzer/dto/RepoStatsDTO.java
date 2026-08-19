package com.analyzer.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepoStatsDTO {
    private Long id;
    private String owner;
    private String name;
    private String fullName;
    private String description;
    private String language;
    private Long stars;
    private Long forks;
    private Long watchers;
    private Long openIssuesCount;
    private Boolean isPrivate;
    private String htmlUrl;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime pushedAt;
    private Map<String, Long> languages;
}
