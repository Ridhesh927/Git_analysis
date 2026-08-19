# GitHub Analyzer - Project Structure

```
github-analyzer/
├── backend/                          # Java Spring Boot backend
│   ├── src/main/java/com/analyzer/
│   │   ├── controller/
│   │   │   ├── GitHubController.java
│   │   │   ├── RepositoryController.java
│   │   │   └── AnalyticsController.java
│   │   ├── service/
│   │   │   ├── GitHubAPIService.java      # GitHub API integration
│   │   │   ├── RepositoryService.java     # Repo metrics logic
│   │   │   ├── IssueService.java          # Issue/PR handling
│   │   │   └── AnalyticsService.java      # Data aggregation
│   │   ├── model/
│   │   │   ├── Repository.java
│   │   │   ├── Issue.java
│   │   │   ├── PullRequest.java
│   │   │   ├── Contributor.java
│   │   │   └── RepoMetrics.java
│   │   ├── repository/                    # JPA repositories
│   │   │   ├── RepositoryRepository.java
│   │   │   ├── IssueRepository.java
│   │   │   └── ContributorRepository.java
│   │   ├── dto/
│   │   │   ├── RepoStatsDTO.java
│   │   │   ├── IssueStatsDTO.java
│   │   │   ├── ContributorDTO.java
│   │   │   └── AnalyticsResponseDTO.java
│   │   ├── util/
│   │   │   ├── GitHubAPIClient.java       # REST client for GitHub API
│   │   │   └── DataProcessor.java
│   │   └── AnalyzerApplication.java       # Main application class
│   ├── src/main/resources/
│   │   ├── application.properties         # Configuration
│   │   └── application-dev.properties
│   ├── src/test/java/                     # Unit & integration tests
│   ├── pom.xml                            # Maven dependencies
│   └── README.md                          # Backend setup guide
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── RepositoryCard.jsx
│   │   │   ├── MetricsDisplay.jsx         # Stats visualization
│   │   │   ├── IssueTracker.jsx           # Issue/PR list
│   │   │   ├── ContributorChart.jsx       # Contributor insights
│   │   │   ├── PullRequestBoard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx              # Main analytics view
│   │   │   ├── RepositoryDetail.jsx
│   │   │   └── Trends.jsx                 # Historical trends
│   │   ├── services/
│   │   │   ├── api.js                     # Backend API calls
│   │   │   └── githubService.js           # API service layer
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── components.css
│   │   │   └── dashboard.css
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── constants.js
│   ├── public/
│   ├── package.json
│   ├── vite.config.js                    # Vite config
│   └── README.md                          # Frontend setup guide
│
├── docs/                             # Project documentation
│   ├── API.md                             # API endpoints & usage
│   ├── ARCHITECTURE.md                    # Design decisions
│   ├── SETUP.md                           # Full setup guide
│   └── FEATURES.md
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                      # GitHub Actions CI/CD
│
├── docker-compose.yml                # Local dev environment
├── .gitignore
├── README.md                          # Main project README
└── CONTRIBUTING.md

```

## Directory Descriptions

**Backend (Spring Boot)**
- Controllers handle HTTP requests and routing
- Services contain business logic (metrics calculation, data fetching)
- Models represent database entities
- DTOs format responses for frontend
- Utilities handle GitHub API communication & data processing

**Frontend (React)**
- Components are reusable UI pieces
- Pages combine components for full views
- Services handle API communication (abstraction layer)
- Utils provide helper functions (formatting, validation)

**Data Layer**
- Uses JPA/Hibernate for database ORM
- Repositories provide database query methods
- Models persist repo, issue, PR, and contributor data

## Key Features Structure
- **Repo Metrics**: Stars, forks, watchers, language breakdown
- **Issue Tracking**: Filter by status, labels, assignees
- **PR Analytics**: Review trends, merge times, contributor activity
- **Trending**: Historical data & pattern analysis
