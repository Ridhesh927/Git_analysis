package com.analyzer.repository;

import com.analyzer.model.Contributor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContributorRepository extends JpaRepository<Contributor, Long> {
    List<Contributor> findByRepoIdOrderByContributionsDesc(Long repoId);
    void deleteByRepoId(Long repoId);
}
