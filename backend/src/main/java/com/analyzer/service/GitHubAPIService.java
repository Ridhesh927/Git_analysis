package com.analyzer.service;

import com.analyzer.model.*;
import com.analyzer.repository.*;
import com.analyzer.util.DataProcessor;
import com.analyzer.util.GitHubAPIClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class GitHubAPIService {

    private static final Logger log = LoggerFactory.getLogger(GitHubAPIService.class);

    private final GitHubAPIClient client;
    private final DataProcessor processor;
    private final RepositoryRepository repoRepo;
    private final IssueRepository issueRepo;
    private final ContributorRepository contributorRepo;

    public GitHubAPIService(GitHubAPIClient client, DataProcessor processor,
                            RepositoryRepository repoRepo, IssueRepository issueRepo,
                            ContributorRepository contributorRepo) {
        this.client = client;
        this.processor = processor;
        this.repoRepo = repoRepo;
        this.issueRepo = issueRepo;
        this.contributorRepo = contributorRepo;
    }

    /**
     * Fetch repository from GitHub API, persist it, and return the entity.
     */
    @Transactional
    public Repository fetchAndSaveRepository(String owner, String repo) {
        log.info("Fetching repository: {}/{}", owner, repo);
        Map<String, Object> raw = client.getRepo(owner, repo);
        if (raw == null) throw new RuntimeException("Repository not found: " + owner + "/" + repo);

        Repository entity = processor.mapToRepository(raw);
        if (entity == null) throw new RuntimeException("Failed to map repository data for: " + owner + "/" + repo);

        Optional<Repository> existing = repoRepo.findByOwnerAndName(owner, repo);
        if (existing.isPresent()) {
            log.info("Updating existing repository id={}", existing.get().getId());
            entity.setId(existing.get().getId());
        }
        return repoRepo.save(entity);
    }

    /**
     * Fetch all issues (open + closed) and persist them.
     */
    @Transactional
    public List<Issue> fetchAndSaveIssues(String owner, String repo, Long repoId) {
        log.info("Fetching issues for {}/{} (repoId={})", owner, repo, repoId);
        List<Issue> all = new ArrayList<>();
        for (String state : List.of("open", "closed")) {
            int page = 1;
            while (true) {
                Object[] raw = client.getIssues(owner, repo, state, page);
                if (raw == null || raw.length == 0) break;
                for (Object obj : raw) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> map = (Map<String, Object>) obj;
                    all.add(processor.mapToIssue(map, repoId));
                }
                if (raw.length < 100) break;
                page++;
            }
        }
        log.info("Saving {} issues for repoId={}", all.size(), repoId);
        // Delete old, save fresh
        List<Issue> existing = issueRepo.findByRepoId(repoId);
        List<Issue> toDelete = (existing != null) ? existing : Collections.emptyList();
        issueRepo.deleteAll(new java.util.ArrayList<>(toDelete));
        return issueRepo.saveAll(all);
    }

    /**
     * Fetch contributors and persist them.
     */
    @Transactional
    public List<Contributor> fetchAndSaveContributors(String owner, String repo, Long repoId) {
        log.info("Fetching contributors for {}/{} (repoId={})", owner, repo, repoId);
        Object[] raw = client.getContributors(owner, repo);
        if (raw == null) {
            log.warn("No contributors found for {}/{}", owner, repo);
            return Collections.emptyList();
        }

        List<Contributor> contributors = new ArrayList<>();
        for (Object obj : raw) {
            @SuppressWarnings("unchecked")
            Map<String, Object> map = (Map<String, Object>) obj;
            contributors.add(processor.mapToContributor(map, repoId));
        }
        log.info("Saving {} contributors for repoId={}", contributors.size(), repoId);
        contributorRepo.deleteByRepoId(repoId);
        return contributorRepo.saveAll(contributors);
    }

    /**
     * Fetch language breakdown (raw map, not persisted).
     */
    public Map<String, Long> fetchLanguages(String owner, String repo) {
        log.info("Fetching languages for {}/{}", owner, repo);
        Map<String, Long> langs = client.getLanguages(owner, repo);
        return langs != null ? langs : Collections.emptyMap();
    }

    /**
     * Fetch code frequency stats for trend charts.
     */
    public Object[] fetchCodeFrequency(String owner, String repo) {
        log.info("Fetching code frequency for {}/{}", owner, repo);
        return client.getCodeFrequency(owner, repo);
    }
}
