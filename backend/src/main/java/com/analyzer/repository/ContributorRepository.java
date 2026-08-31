package com.analyzer.repository;

import com.analyzer.model.Contributor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ContributorRepository extends JpaRepository<Contributor, Long> {
    List<Contributor> findByRepoIdOrderByContributionsDesc(Long repoId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Contributor c WHERE c.repoId = :repoId")
    void deleteByRepoId(Long repoId);
}
