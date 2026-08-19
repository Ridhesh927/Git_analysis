package com.analyzer.repository;

import com.analyzer.model.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositoryRepository extends JpaRepository<Repository, Long> {
    Optional<Repository> findByOwnerAndName(String owner, String name);
    boolean existsByOwnerAndName(String owner, String name);
}
