package com.analyzer.repository;

import com.analyzer.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByRepoIdAndIsPullRequest(Long repoId, Boolean isPullRequest);
    List<Issue> findByRepoIdAndState(Long repoId, String state);
    List<Issue> findByRepoId(Long repoId);
    long countByRepoIdAndState(Long repoId, String state);
}
