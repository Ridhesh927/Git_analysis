# GitHub Analyzer - Tech Stack & Architecture

## Backend Stack

### Framework & Runtime
- **Java 17+** - Core language
- **Spring Boot 3.x** - REST API framework & application server
- **Maven** - Dependency management & build tool

### Key Dependencies
```xml
<!-- Core -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Database -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
<!-- OR MySQL/H2 for development -->

<!-- GitHub API Client -->
<dependency>
    <groupId>org.kohsuke</groupId>
    <artifactId>github-api</artifactId>
</dependency>
<!-- OR: RestTemplate + okhttp3 for custom API calls -->

<!-- Utilities -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
</dependency>

<!-- Testing -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
```

### Architecture Patterns
- **MVC (Model-View-Controller)** - Spring MVC for request handling
- **Service Layer** - Business logic separated from controllers
- **Repository Pattern** - Data access abstraction via JPA
- **DTO Pattern** - Data transfer objects for API responses
- **REST API** - RESTful endpoints following HTTP standards

### Database
- **PostgreSQL** (recommended for production) or **MySQL** / **H2** (for dev)
- **Tables**: repositories, issues, pull_requests, contributors, metrics_cache
- **Caching**: Redis optional for frequently accessed data

---

## Frontend Stack

### Framework & Tooling
- **React 18+** - UI library
- **Vite** - Build tool & dev server (fast bundling)
- **JavaScript (ES6+)** or **TypeScript** (recommended)
- **npm** - Package manager

### Key Dependencies
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "axios": "^1.x",
    "react-router-dom": "^6.x",
    "recharts": "^2.x",
    "date-fns": "^2.x",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "eslint": "^8.x"
  }
}
```

### Libraries & Tools
- **axios** - HTTP client for backend communication
- **react-router-dom** - Client-side routing & navigation
- **recharts** - Data visualization (charts for metrics)
- **date-fns** - Date formatting & manipulation
- **lucide-react** - Icon library

### UI/Styling
- **CSS Modules** or **Tailwind CSS** (optional)
- **Responsive design** - Mobile-first approach
- **Color scheme** - Dark/light mode ready

---

## GitHub API Integration

### API Layer Strategy
```java
// Example: RestTemplate + GitHub REST API v3
@Service
public class GitHubAPIService {
    private final RestTemplate restTemplate;
    
    public Repository getRepository(String owner, String repo) {
        // Fetch repo data from GitHub API
        // Cache results to avoid rate limits
    }
    
    public List<Issue> getIssues(String owner, String repo) {
        // Paginated issue fetching
    }
    
    public List<Contributor> getContributors(String owner, String repo) {
        // Contributor stats
    }
}
```

### Rate Limiting Handling
- GitHub API: 60 requests/hour (unauthenticated), 5000/hour (authenticated)
- Implement caching (Redis or in-memory)
- Use conditional requests with ETags

### GitHub API Endpoints Used
- `GET /repos/{owner}/{repo}` - Repository metadata
- `GET /repos/{owner}/{repo}/issues` - Issues & PRs
- `GET /repos/{owner}/{repo}/pulls` - Pull requests specifically
- `GET /repos/{owner}/{repo}/contributors` - Contributor stats
- `GET /repos/{owner}/{repo}/languages` - Language breakdown
- `GET /repos/{owner}/{repo}/stats/code_frequency` - Historical data

---

## API Endpoints (Backend)

### Repository Endpoints
```
GET    /api/repos/search?username=user&repo=name
GET    /api/repos/{id}/metrics
GET    /api/repos/{id}/languages
POST   /api/repos/track - Add repo to tracking
```

### Issue & PR Endpoints
```
GET    /api/issues?repo_id={id}&status=open
GET    /api/prs?repo_id={id}&sort=created
GET    /api/analytics/pr-trends?repo_id={id}&days=30
```

### Analytics Endpoints
```
GET    /api/analytics/contributors?repo_id={id}
GET    /api/analytics/activity-timeline?repo_id={id}
GET    /api/health - Server status
```

---

## Deployment Architecture

### Local Development
- **Docker Compose** - PostgreSQL + backend + frontend
- Hot reload enabled for both backend & frontend
- Environment: `.env.dev`

### Production Deployment Options
1. **Cloud Platforms**
   - **Backend**: AWS EC2, Heroku, Railway, or DigitalOcean
   - **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
   - **Database**: AWS RDS, managed PostgreSQL service

2. **Docker Containers**
   - Build backend Docker image from pom.xml
   - Build frontend static assets with Vite
   - Run both containers with docker-compose

3. **CI/CD Pipeline** (GitHub Actions)
   - Run tests on every push
   - Build Docker images
   - Deploy to staging/production

---

## Development Workflow

### Backend Development
```bash
# Install dependencies
mvn clean install

# Run in dev mode (live reload with dev-tools)
mvn spring-boot:run

# Run tests
mvn test

# Build production JAR
mvn clean package
```

### Frontend Development
```bash
# Install dependencies
npm install

# Dev server with hot reload
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## Performance Considerations

### Backend
- **Connection Pooling**: HikariCP (default in Spring Boot)
- **Caching Strategy**: Cache repo metrics for 1 hour, issues for 30 mins
- **Pagination**: Use limit/offset for large result sets
- **Database Indexing**: Indexes on repo_id, owner, created_at

### Frontend
- **Code Splitting**: React Router lazy loading for pages
- **Image Optimization**: Vite handles assets efficiently
- **State Management**: React hooks (Context API) for global state
- **API Debouncing**: Debounce search queries to backend

### Network
- **CORS Configuration**: Allow frontend domain only
- **Request Compression**: Enable gzip compression
- **CDN for Static Assets**: Serve JS/CSS from CDN in production

---

## Security

### Backend
- **Input Validation**: Sanitize repo/owner names
- **Rate Limiting**: Implement request throttling
- **GitHub Token**: Store securely as environment variable
- **CORS**: Configure for frontend domain only
- **HTTPS**: Use in production

### Frontend
- **API Key Protection**: Never expose GitHub token on client
- **XSS Prevention**: React auto-escapes by default
- **HTTPS**: Enforce in production

---

## Testing Strategy

### Backend
- **Unit Tests**: Service layer logic with JUnit 5 & Mockito
- **Integration Tests**: Controller + repository tests
- **Example Coverage**: 70%+ code coverage target

### Frontend
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright or Cypress (optional)
- **Manual Testing**: Browser dev tools

---

## Monitoring & Logging

### Backend
- **Logging**: SLF4J with Logback
- **Metrics**: Spring Actuator for health checks
- **Error Tracking**: Optional - Sentry integration

### Frontend
- **Console Logging**: Dev tools
- **Error Boundary**: Catch React component errors
- **API Response Monitoring**: Log failed requests

---

## Tech Rationale

| Choice | Why |
|--------|-----|
| Java + Spring Boot | Strong backend framework, production-ready, widely used in industry |
| React | Modern UI framework, component-based, great for dashboards |
| PostgreSQL | Reliable RDBMS, good for structured data (repos, issues, PRs) |
| REST API | Standard approach, easier than GraphQL for this use case |
| Vite | Much faster than Webpack, modern tooling |
| GitHub API v3 | Well-documented, stable, covers all needed functionality |
| Docker | Easy deployment, reproducible environments |

---

## Future Enhancements
- GraphQL API as alternative to REST
- Real-time updates with WebSockets
- Advanced ML-based analytics (code quality predictions)
- GitHub Actions integration
- Browser extension for GitHub.com
- Mobile app (React Native)
