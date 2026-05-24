# Deploying Appitat on Render

Appitat is a **monorepo** with two separate deployable units:

| Unit | Tech | Deploy as |
|------|------|-----------|
| `server/` | Node.js + Express | **Web Service** |
| `frontend/` | Vite + React | **Static Site** |

---

## Prerequisites

- A [Render account](https://render.com) (free tier works)
- Your project pushed to a **GitHub** repository

> [!IMPORTANT]
> Make sure your `.env` files are **not** committed to Git (your `.gitignore` already handles this). You'll enter all secrets directly in Render's dashboard.

---

## Phase 1 — Prepare the Code

### Step 1 — Verify `.gitignore` is correct

Your root `.gitignore` already ignores `.env` and `node_modules`. Double-check that `server/.env` is never committed.

### Step 2 — Ensure the server `start` script exists

Open `server/package.json` and confirm this exists (it already does):

```json
"scripts": {
  "start": "node index.js"
}
```

### Step 3 — Commit and push everything to GitHub

```powershell
cd d:\projects\Appitat
git add .
git commit -m "chore: prepare for Render deployment"
git push
```

---

## Phase 2 — Deploy the Backend (Web Service)

### Step 4 — Create a new Web Service on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → click **New +** → **Web Service**
2. Connect your GitHub account and select the **Appitat** repository
3. Fill in the settings:

| Field | Value |
|-------|-------|
| **Name** | `appitat-backend` |
| **Region** | Choose closest to your users |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

4. Click **Advanced** → scroll down to **Environment Variables** — add all of these:

| Key | Value |
|-----|-------|
| `PORT` | `10000` *(Render assigns this automatically — leave it or omit)* |
| `MONGO_URI` | *(your MongoDB Atlas connection string)* |
| `GOOGLE_API_KEY` | *(your Gemini API key)* |
| `JWT_SECRET` | *(your JWT secret)* |
| `GROQ_API_KEY` | *(your Groq API key)* |
| `FRONTEND_URL` | *(leave blank for now — fill after Step 8)* |

> [!NOTE]
> Do **not** add `OLLAMA_HOST` / `OLLAMA_API_KEY` — Ollama is a local model and cannot run on Render's cloud infrastructure. The Groq-based recipe generation will work fine.

5. Click **Create Web Service**. Render will build and deploy. Watch the **Logs** tab.

### Step 5 — Note your backend URL

Once deployed, Render gives you a URL like:
```
https://appitat-backend.onrender.com
```
Copy this — you'll need it for the frontend.

---

## Phase 3 — Deploy the Frontend (Static Site)

### Step 6 — Create a new Static Site on Render

1. Go to dashboard → **New +** → **Static Site**
2. Select the same **Appitat** repository
3. Fill in the settings:

| Field | Value |
|-------|-------|
| **Name** | `appitat-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

4. Under **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://appitat-backend.onrender.com/api` |

5. Click **Create Static Site**. Render builds the Vite app and serves the `dist/` folder.

### Step 7 — Note your frontend URL

Once deployed, you'll get a URL like:
```
https://appitat-frontend.onrender.com
```

---

## Phase 4 — Wire Everything Together

### Step 8 — Update CORS on the backend

Go back to the **appitat-backend** Web Service → **Environment** tab → add/update:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://appitat-frontend.onrender.com` |

Click **Save Changes** — Render will automatically redeploy the backend. Your `server/index.js` already reads `process.env.FRONTEND_URL` and adds it to the `allowedOrigins` array, so no code changes needed.

### Step 9 — Handle React Router (SPA Routing)

Vite's React app uses client-side routing. Without extra config, refreshing any page other than `/` will return a 404. Add a rewrite rule:

Create the file `frontend/public/_redirects` with this content:

```
/*  /index.html  200
```

Commit and push:

```powershell
# Create the file
New-Item -Path "d:\projects\Appitat\frontend\public\_redirects" -ItemType File -Value "/*  /index.html  200"

git add frontend/public/_redirects
git commit -m "fix: add Render SPA redirect rule"
git push
```

Render will auto-redeploy the Static Site.

---

## Phase 5 — Verify the Deployment

### Step 10 — Check the backend is healthy

Visit your backend URL in the browser:
```
https://appitat-backend.onrender.com/
```
You should see: **"Welcome to the AI Recipe Recommender API"**

### Step 11 — Check the frontend loads

Visit:
```
https://appitat-frontend.onrender.com
```
You should see the Appitat login page. Try signing up / signing in.

### Step 12 — Test the full flow

- Sign in with Google OAuth
- Upload ingredients / detect from image
- Generate a recipe

> [!WARNING]
> **Free tier cold starts**: Render's free Web Services spin down after 15 minutes of inactivity. The first request after a sleep can take **30–60 seconds**. To avoid this, upgrade to the Starter plan ($7/month) or add an uptime monitoring service like [UptimeRobot](https://uptimerobot.com) to ping the backend every 14 minutes.

---

## Environment Variables Summary

### Backend (`server/`) — Render Web Service

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWTs |
| `GOOGLE_API_KEY` | ✅ | Gemini API key (for image ingredient detection) |
| `GROQ_API_KEY` | ✅ | Groq API key (for recipe generation) |
| `FRONTEND_URL` | ✅ | Your Render frontend URL (for CORS) |
| `PORT` | ➖ | Set automatically by Render |

### Frontend (`frontend/`) — Render Static Site

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Full URL to backend API, e.g. `https://appitat-backend.onrender.com/api` |

---

## Common Issues & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| `CORS error` in browser console | `FRONTEND_URL` not set on backend | Add `FRONTEND_URL` env var on backend service |
| `Cannot GET /dashboard` on refresh | No SPA redirect rule | Add `frontend/public/_redirects` file (Step 9) |
| Build fails — `vite: not found` | Root directory not set to `frontend` | Set **Root Directory** to `frontend` in Render |
| API calls return 404 | `VITE_API_URL` wrong or missing | Check env var on Static Site; ensure it ends in `/api` |
| Server crashes on start | Missing env vars | Check Render logs; ensure all required env vars are set |
