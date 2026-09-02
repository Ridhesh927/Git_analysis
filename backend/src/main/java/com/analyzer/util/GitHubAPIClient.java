package com.analyzer.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Component
public class GitHubAPIClient {

    private static final Logger log = LoggerFactory.getLogger(GitHubAPIClient.class);
    private static final String BASE_URL = "https://api.github.com";

    private final RestTemplate restTemplate;

    @Value("${github.token:}")
    private String githubToken;

    public GitHubAPIClient() {
        this.restTemplate = new RestTemplate();
    }

    @SuppressWarnings("null")
    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.parseMediaType("application/vnd.github.v3+json")));
        if (githubToken != null && !githubToken.isBlank()) {
            headers.setBearerAuth(githubToken);
        }
        return headers;
    }

    @SuppressWarnings("null")
    public <T> T get(String path, Class<T> responseType) {
        String url = BASE_URL + path;
        HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
        try {
            ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.GET, entity, responseType);
            return response.getBody();
        } catch (HttpClientErrorException.NotFound e) {
            log.warn("GitHub API 404 for {}: {}", url, e.getMessage());
            return null;
        } catch (HttpClientErrorException.Forbidden e) {
            log.error("GitHub API rate limit or forbidden for {}: {}", url, e.getMessage());
            throw new RuntimeException("GitHub API rate limit exceeded. Please add a GITHUB_TOKEN in .env", e);
        } catch (HttpClientErrorException.UnprocessableEntity e) {
            log.warn("GitHub API 422 Unprocessable Entity for {} (usually repo too large for stats): {}", url,
                    e.getMessage());
            return null;
        } catch (org.springframework.http.converter.HttpMessageConversionException e) {
            log.warn("GitHub API conversion error for {} (usually empty 202 response or rate limit object): {}", url,
                    e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("GitHub API error for {}: {}", url, e.getMessage());
            throw new RuntimeException("GitHub API request failed: " + e.getMessage(), e);
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getRepo(String owner, String repo) {
        return get("/repos/" + owner + "/" + repo, Map.class);
    }

    public Object[] getIssues(String owner, String repo, String state, int page) {
        String path = String.format("/repos/%s/%s/issues?state=%s&per_page=100&page=%d", owner, repo, state, page);
        return get(path, Object[].class);
    }

    public Object[] getPullRequests(String owner, String repo, String state, int page) {
        String path = String.format("/repos/%s/%s/pulls?state=%s&per_page=100&page=%d", owner, repo, state, page);
        return get(path, Object[].class);
    }

    public Object[] getContributors(String owner, String repo) {
        return get("/repos/" + owner + "/" + repo + "/contributors?per_page=100", Object[].class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Long> getLanguages(String owner, String repo) {
        Map<String, Object> rawMap = get("/repos/" + owner + "/" + repo + "/languages", Map.class);
        if (rawMap == null)
            return null;
        Map<String, Long> result = new java.util.LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : rawMap.entrySet()) {
            result.put(entry.getKey(), ((Number) entry.getValue()).longValue());
        }
        return result;
    }

    public Object[] getCodeFrequency(String owner, String repo) {
        return get("/repos/" + owner + "/" + repo + "/stats/code_frequency", Object[].class);
    }

    public Object[] getCommits(String owner, String repo, int limit) {
        return get("/repos/" + owner + "/" + repo + "/commits?per_page=" + limit, Object[].class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getCommitDetails(String owner, String repo, String sha) {
        return get("/repos/" + owner + "/" + repo + "/commits/" + sha, Map.class);
    }
}
