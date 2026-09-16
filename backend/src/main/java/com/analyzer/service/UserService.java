package com.analyzer.service;

import com.analyzer.dto.RepoStatsDTO;
import com.analyzer.dto.UserStatsDTO;
import com.analyzer.util.GitHubAPIClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final GitHubAPIClient client;

    public UserService(GitHubAPIClient client) {
        this.client = client;
    }

    public UserStatsDTO getUserStats(String username) {
        Map<String, Object> rawUser = client.getUser(username);
        if (rawUser == null) {
            throw new RuntimeException("User not found: " + username);
        }

        UserStatsDTO dto = new UserStatsDTO();
        dto.setLogin((String) rawUser.get("login"));
        dto.setName((String) rawUser.get("name"));
        dto.setAvatarUrl((String) rawUser.get("avatar_url"));
        dto.setBio((String) rawUser.get("bio"));
        
        dto.setFollowers(rawUser.get("followers") != null ? ((Number) rawUser.get("followers")).intValue() : 0);
        dto.setFollowing(rawUser.get("following") != null ? ((Number) rawUser.get("following")).intValue() : 0);
        dto.setPublicRepos(rawUser.get("public_repos") != null ? ((Number) rawUser.get("public_repos")).intValue() : 0);
        
        dto.setLocation((String) rawUser.get("location"));
        dto.setCompany((String) rawUser.get("company"));
        dto.setBlog((String) rawUser.get("blog"));

        // Fetch top repos
        Object[] rawRepos = client.getUserRepos(username);
        List<RepoStatsDTO> topRepos = new ArrayList<>();
        
        if (rawRepos != null) {
            for (Object obj : rawRepos) {
                @SuppressWarnings("unchecked")
                Map<String, Object> repoMap = (Map<String, Object>) obj;
                
                @SuppressWarnings("unchecked")
                Map<String, Object> ownerMap = (Map<String, Object>) repoMap.get("owner");
                String repoOwner = ownerMap != null ? (String) ownerMap.get("login") : username;
                
                RepoStatsDTO repoDto = RepoStatsDTO.builder()
                        .name((String) repoMap.get("name"))
                        .owner(repoOwner)
                        .fullName((String) repoMap.get("full_name"))
                        .description((String) repoMap.get("description"))
                        .htmlUrl((String) repoMap.get("html_url"))
                        .language((String) repoMap.get("language"))
                        .stars(repoMap.get("stargazers_count") != null ? ((Number) repoMap.get("stargazers_count")).longValue() : 0L)
                        .forks(repoMap.get("forks_count") != null ? ((Number) repoMap.get("forks_count")).longValue() : 0L)
                        .build();
                        
                topRepos.add(repoDto);
            }
        }
        
        dto.setTopRepos(topRepos);
        return dto;
    }
}
