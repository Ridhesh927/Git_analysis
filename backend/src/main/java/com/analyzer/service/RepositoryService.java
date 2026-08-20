package com.analyzer.service;

import com.analyzer.dto.RepoStatsDTO;
import com.analyzer.model.Repository;
import com.analyzer.repository.RepositoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RepositoryService {

    private final RepositoryRepository repoRepo;
    private final GitHubAPIService githubAPIService;

    public RepositoryService(RepositoryRepository repoRepo,
                             GitHubAPIService githubAPIService) {
        this.repoRepo = repoRepo;
        this.githubAPIService = githubAPIService;
    }

    /**
     * Search (or refresh) a repository by owner/name.
     */
    public RepoStatsDTO searchRepository(String owner, String name) {
        Repository repo = githubAPIService.fetchAndSaveRepository(owner, name);
        Map<String, Long> languages = githubAPIService.fetchLanguages(owner, name);
        return toDTO(repo, languages);
    }

    /**
     * Get a stored repository by ID.
     */
    public RepoStatsDTO getById(long id) {
        Repository repo = repoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Repository not found with id: " + id));
        Map<String, Long> languages = githubAPIService.fetchLanguages(repo.getOwner(), repo.getName());
        return toDTO(repo, languages);
    }

    /**
     * Get language breakdown for a repository.
     */
    public Map<String, Long> getLanguages(long id) {
        Repository repo = repoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Repository not found with id: " + id));
        return githubAPIService.fetchLanguages(repo.getOwner(), repo.getName());
    }

    /**
     * Track a repository (save without re-fetching data immediately).
     */
    public RepoStatsDTO trackRepository(String owner, String name) {
        Optional<Repository> existing = repoRepo.findByOwnerAndName(owner, name);
        if (existing.isPresent()) return toDTO(existing.get(), Map.of());
        return searchRepository(owner, name);
    }

    /**
     * List all tracked repositories.
     */
    public List<RepoStatsDTO> listAll() {
        return repoRepo.findAll().stream()
                .map(r -> toDTO(r, Map.of()))
                .toList();
    }

    private RepoStatsDTO toDTO(Repository r, Map<String, Long> languages) {
        return RepoStatsDTO.builder()
                .id(r.getId())
                .owner(r.getOwner())
                .name(r.getName())
                .fullName(r.getFullName())
                .description(r.getDescription())
                .language(r.getLanguage())
                .stars(r.getStars())
                .forks(r.getForks())
                .watchers(r.getWatchers())
                .openIssuesCount(r.getOpenIssuesCount())
                .isPrivate(r.getIsPrivate())
                .htmlUrl(r.getHtmlUrl())
                .avatarUrl(r.getAvatarUrl())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .pushedAt(r.getPushedAt())
                .languages(languages)
                .build();
    }
}
