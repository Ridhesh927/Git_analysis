package com.analyzer.dto;

import java.util.List;

public class UserStatsDTO {
    private String login;
    private String name;
    private String avatarUrl;
    private String bio;
    private int followers;
    private int following;
    private int publicRepos;
    private String location;
    private String company;
    private String blog;
    private List<RepoStatsDTO> topRepos;

    // Getters and Setters

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public int getFollowers() { return followers; }
    public void setFollowers(int followers) { this.followers = followers; }

    public int getFollowing() { return following; }
    public void setFollowing(int following) { this.following = following; }

    public int getPublicRepos() { return publicRepos; }
    public void setPublicRepos(int publicRepos) { this.publicRepos = publicRepos; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getBlog() { return blog; }
    public void setBlog(String blog) { this.blog = blog; }

    public List<RepoStatsDTO> getTopRepos() { return topRepos; }
    public void setTopRepos(List<RepoStatsDTO> topRepos) { this.topRepos = topRepos; }
}
