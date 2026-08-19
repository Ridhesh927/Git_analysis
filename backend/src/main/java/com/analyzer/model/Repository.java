package com.analyzer.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "repositories")
public class Repository {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String owner;

    @Column(nullable = false)
    private String name;

    private String fullName;
    private String description;
    private String language;
    private Long stars;
    private Long forks;
    private Long watchers;
    private Long openIssuesCount;
    private Boolean isPrivate;
    private String htmlUrl;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime pushedAt;
    private LocalDateTime lastFetchedAt;

    @Column(columnDefinition = "TEXT")
    private String topics;
}
