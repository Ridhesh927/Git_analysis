# GitHub Analyzer — Setup Guide

## Prerequisites
| Tool | Version | Notes |
|------|---------|-------|
| Java | 17+ | `java --version` |
| Maven | 3.8+ | `mvn --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |

---

## Step 1 — Get a GitHub Personal Access Token

> **Why?** Without a token, GitHub limits you to 60 API requests/hour.
> With one, you get 5,000/hour.

1. Go to **[github.com/settings/tokens](https://github.com/settings/tokens)**
2. Click **"Generate new token (classic)"**
3. Name it `github-analyzer`, set expiry (90 days recommended)
4. Tick **`public_repo`** scope (add `repo` for private repos too)
5. Click **"Generate token"** → copy it immediately (shown only once!)

---

## Step 2 — Get Neon DB Connection String

1. Sign up / log in at **[console.neon.tech](https://console.neon.tech)**
2. Click **"New Project"** → name it `github-analyzer`
3. After creation, click **"Connection Details"**
4. Switch format to **"JDBC"** — copy the string:
   ```
   jdbc:postgresql://ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Also note the **Username** and **Password** shown there.

---

## Step 3 — Configure Environment

Copy the example `.env` file:
```bash
# From project root:
copy .env.example .env      # Windows
cp .env.example .env        # Mac/Linux
```

Open `.env` and fill in:
```env
GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
NEON_DATABASE_URL=jdbc:postgresql://YOUR_HOST/YOUR_DB?sslmode=require
NEON_DB_USER=YOUR_USERNAME
NEON_DB_PASSWORD=YOUR_PASSWORD
```

> ⚠️ **Never commit `.env` to Git.** It's already in `.gitignore`.

---

## Step 4 — Start the Backend

```bash
cd backend

# Windows — set env vars and run:
set GITHUB_TOKEN=ghp_xxx
set NEON_DATABASE_URL=jdbc:postgresql://...
set NEON_DB_USER=xxx
set NEON_DB_PASSWORD=xxx
mvn spring-boot:run

# Or use a .env loader like 'dotenv-run' or IntelliJ's env file support
```

The backend starts on **http://localhost:8080**

Verify:
```
GET http://localhost:8080/api/analytics/health
→ {"status":"UP","service":"github-analyzer"}
```

---

## Step 5 — Start the Frontend

```bash
cd frontend
npm run dev
```

Opens on **http://localhost:5173**

> API calls are proxied to `localhost:8080` automatically via `vite.config.js`.

---

## Step 6 — Try it!

1. In the search bar type `facebook/react` (or any public repo)
2. Click **Analyze**
3. The dashboard shows stars, forks, contributors chart, issues, PRs, and language breakdown

---

## Development Tips

- **Re-fetch data**: Searching again re-fetches fresh data from GitHub
- **IntelliJ**: Set env vars in Run Configuration → Environment Variables
- **VS Code**: Install "dotenv" extension and point Spring Boot to `.env`
- **Rate limits**: If you see "rate limit exceeded", check your `GITHUB_TOKEN` in `.env`
