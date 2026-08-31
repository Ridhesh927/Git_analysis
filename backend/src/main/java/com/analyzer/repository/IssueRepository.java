package com.analyzer.repository;

import com.analyzer.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByRepoIdAndIsPullRequest(Long repoId, Boolean isPullRequest);
    List<Issue> findByRepoIdAndState(Long repoId, String state);
    List<Issue> findByRepoId(Long repoId);
    long countByRepoIdAndState(Long repoId, String state);

    @Modifying
    @Transactional
    @Query("DELETE FROM Issue i WHERE i.repoId = :repoId")
    void deleteByRepoId(Long repoId);
}
