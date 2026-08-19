package com.analyzer.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContributorDTO {
    private String login;
    private String avatarUrl;
    private String htmlUrl;
    private Integer contributions;
    private String type;
}
