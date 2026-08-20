package com.analyzer.util;

import com.analyzer.model.*;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@SuppressWarnings("unchecked")
@Component
public class DataProcessor {

    private static final Gson GSON = new Gson();
    private static final DateTimeFormatter GH_FMT = DateTimeFormatter.ISO_DATE_TIME;

    // ── Repository ──────────────────────────────────────────────

    public Repository mapToRepository(Map<String, Object> raw) {
        Repository r = new Repository();
        r.setOwner(str(raw, "login", map(raw, "owner")));
        r.setName(str(raw, "name"));
        r.setFullName(str(raw, "full_name"));
        r.setDescription(str(raw, "description"));
        r.setLanguage(str(raw, "language"));
        r.setStars(longVal(raw, "stargazers_count"));
        r.setForks(longVal(raw, "forks_count"));
        r.setWatchers(longVal(raw, "watchers_count"));
        r.setOpenIssuesCount(longVal(raw, "open_issues_count"));
        r.setIsPrivate((Boolean) raw.getOrDefault("private", false));
        r.setHtmlUrl(str(raw, "html_url"));
        Map<String, Object> ownerMap = map(raw, "owner");
        if (ownerMap != null) r.setAvatarUrl(str(ownerMap, "avatar_url"));
        r.setCreatedAt(parseDate(str(raw, "created_at")));
        r.setUpdatedAt(parseDate(str(raw, "updated_at")));
        r.setPushedAt(parseDate(str(raw, "pushed_at")));
        r.setLastFetchedAt(LocalDateTime.now());
        List<?> topics = (List<?>) raw.get("topics");
        if (topics != null) r.setTopics(GSON.toJson(topics));
        return r;
    }

    // ── Issue ────────────────────────────────────────────────────

    public Issue mapToIssue(Map<String, Object> raw, Long repoId) {
        Issue i = new Issue();
        i.setRepoId(repoId);
        i.setNumber(intVal(raw, "number"));
        i.setTitle(str(raw, "title"));
        i.setBody(str(raw, "body"));
        i.setState(str(raw, "state"));
        Map<String, Object> user = map(raw, "user");
        if (user != null) i.setAuthorLogin(str(user, "login"));
        Map<String, Object> assignee = map(raw, "assignee");
        if (assignee != null) i.setAssigneeLogin(str(assignee, "login"));
        List<?> labels = (List<?>) raw.get("labels");
        if (labels != null) i.setLabels(GSON.toJson(labels));
        i.setIsPullRequest(raw.containsKey("pull_request"));
        i.setCreatedAt(parseDate(str(raw, "created_at")));
        i.setUpdatedAt(parseDate(str(raw, "updated_at")));
        i.setClosedAt(parseDate(str(raw, "closed_at")));
        i.setHtmlUrl(str(raw, "html_url"));
        return i;
    }

    // ── Contributor ──────────────────────────────────────────────

    public com.analyzer.model.Contributor mapToContributor(Map<String, Object> raw, Long repoId) {
        com.analyzer.model.Contributor c = new com.analyzer.model.Contributor();
        c.setRepoId(repoId);
        c.setLogin(str(raw, "login"));
        c.setAvatarUrl(str(raw, "avatar_url"));
        c.setHtmlUrl(str(raw, "html_url"));
        c.setContributions(intVal(raw, "contributions"));
        c.setType(str(raw, "type"));
        return c;
    }

    // ── Language breakdown to JSON ────────────────────────────────

    public String languagesToJson(Map<String, Long> languages) {
        return GSON.toJson(languages);
    }

    public Map<String, Long> jsonToLanguages(String json) {
        if (json == null || json.isBlank()) return Collections.emptyMap();
        return GSON.fromJson(json, new TypeToken<Map<String, Long>>() {}.getType());
    }

    // ── Helpers ──────────────────────────────────────────────────

    private String str(Map<String, Object> map, String key) {
        Object val = map == null ? null : map.get(key);
        return val == null ? null : val.toString();
    }

    private String str(Map<String, Object> map, String key, Map<String, Object> fallbackMap) {
        String v = str(map, key);
        return (v == null && fallbackMap != null) ? str(fallbackMap, key) : v;
    }

    private Long longVal(Map<String, Object> map, String key) {
        Object val = map == null ? null : map.get(key);
        if (val == null) return 0L;
        return ((Number) val).longValue();
    }

    private Integer intVal(Map<String, Object> map, String key) {
        Object val = map == null ? null : map.get(key);
        if (val == null) return 0;
        return ((Number) val).intValue();
    }

    private Map<String, Object> map(Map<String, Object> map, String key) {
        Object val = map == null ? null : map.get(key);
        return val instanceof Map ? (Map<String, Object>) val : null;
    }

    private LocalDateTime parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            return LocalDateTime.parse(dateStr.replace("Z", ""), GH_FMT);
        } catch (Exception e) {
            return null;
        }
    }
}
