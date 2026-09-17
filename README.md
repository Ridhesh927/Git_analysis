# GitFlow Analysis

This is a Spring Boot application designed to analyze Git repositories, identify contributors, and measure development metrics such as code churn and task distribution.

## Prerequisites

- Java 21 or higher
- Maven 3.6.3 or higher

## Getting Started

### 1. Run the Backend (Spring Boot)

Open a terminal in the `backend` directory.

If Maven is correctly added to your system PATH:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**If you get a "mvn is not recognized" error**, you can bypass it by using the absolute path to your Maven installation (update the path if yours is different):
```bash
cd backend
& "C:\Program Files\Apache\apache-maven-3.9.16\bin\mvn.cmd" clean install
& "C:\Program Files\Apache\apache-maven-3.9.16\bin\mvn.cmd" spring-boot:run
```

### 2. Run the Frontend (React + Vite)

Open a **new** terminal in the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

### 3. Access the API

Once the application starts, you can access the Swagger UI at:

```
http://localhost:8080/swagger-ui.html
```

## API Endpoints

### Repository Analysis

**POST `/api/v1/repo/analyze`**
Analyzes a Git repository by cloning it locally and processing its commit history.

**Request Body:**
```json
{
  "repoUrl": "https://github.com/your-org/your-repo.git",
  "branch": "main"
}
```

**Response Body:**
```json
{
  "repositoryUrl": "https://github.com/your-org/your-repo.git",
  "baseBranch": "main",
  "analysisDate": "2023-10-27T10:00:00Z",
  "totalCommits": 150,
  "contributors": [
    {
      "contributorId": "user1",
      "totalCommits": 80,
      "commitsPercent": 53.33,
      "firstCommitDate": "2023-01-15T10:00:00Z",
      "lastCommitDate": "2023-10-25T10:00:00Z",
      "tasks": 4
    }
  ],
  "tasks": [
    {
      "taskId": "TASK-123",
      "title": "Implement feature X",
      "branchNames": ["feat/feature-x", "task/task-123"],
      "totalCommits": 45,
      "totalDevelopers": 3,
      "developerIds": ["user1", "user2", "user3"]
    }
  ],
  "metrics": {
    "averageCommitsPerDeveloper": 50,
    "averageTasksPerDeveloper": 1.33
  }
}
```

### Health Check

**GET `/actuator/health`**
Checks the health of the application.

### Git Configuration

**GET `/api/v1/gitconfig`**
Retrieves current Git configuration (username, email).

**POST `/api/v1/gitconfig`**
Updates Git configuration.

### Local Git Status

**GET `/api/v1/git/status`**
Checks the status of the currently cloned repository.

## Configuration

Application properties can be configured in `src/main/resources/application.properties`.

```properties
# Server Port
server.port=8080

# Git Analysis Settings
git.local-path=E:/Project/On-Going/temp
git.temp-dir-name=temp-git-repo
git.delete-temp-repo=true
git.timeout-seconds=300
```

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/bhr/gitflow/
│   │       ├── GitFlowAnalysisApplication.java  # Application entry point
│   │       ├── config/                          # Configuration (e.g., GitProperties)
│   │       ├── model/                           # Data models (GitRepoAnalysis, Contributor, Task)
│   │       ├── controller/                      # REST API Controllers
│   │       └── service/                         # Business logic and Git analysis
│   └── resources/
│       └── application.properties             # Application configuration
└── test/
    └── java/
        └── com/bhr/gitflow/
            └── service/                         # Test classes
```

## Development

### Testing

Run tests with:

```bash
./mvnw test
```

### Troubleshooting

If you encounter issues with Git cloning, ensure:
1. You have Git installed on your system
2. The repository URL is correct and accessible
3. SSH keys are configured if using private repositories

## License

This project is licensed under the  License.
