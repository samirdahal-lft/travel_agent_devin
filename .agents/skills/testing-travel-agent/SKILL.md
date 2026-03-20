# Testing Travel Agent App

This skill covers local end-to-end testing of the Travel Agent application (Next.js frontend + FastAPI backend).

## Architecture
- **Frontend**: Next.js app at `frontend/` — uses Supabase client-side auth directly (NOT the backend's auth endpoints)
- **Backend**: FastAPI app at `backend/` — uses Gemini AI + Tavily search for travel plan generation, Supabase for DB
- Auth flow: Frontend signs up/logs in via Supabase JS client. Backend validates JWT tokens from Supabase to identify users.

## Devin Secrets Needed
- `GEMINI_API_KEY` — Google Gemini API key for AI generation
- `TAVILY_API_KEY` — Tavily API key for web search
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_KEY` — Supabase anon/public key
- `SUPABASE_SERVICE_KEY` — Supabase service role key (admin access)

## Local Setup

### Backend
```bash
cd backend/
cp .env.example .env
# Fill in the 5 env vars above in .env
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd frontend/
cp .env.local.example .env.local
# Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

Frontend runs on http://localhost:3000, backend on http://localhost:8000.

## Key Testing Flow
1. Landing page (http://localhost:3000) — verify Tailwind CSS renders correctly
2. Signup (/signup) — creates user via Supabase client-side auth
3. Login (/login) — authenticates via Supabase, redirects to /dashboard
4. Dashboard (/dashboard) — submit travel query, verify AI-generated plan appears
5. History (/history) — verify saved conversations appear
6. Sign Out — verify redirect to login page

## Known Issues & Gotchas

### Tailwind CSS v4 Native Binding Error
The `@tailwindcss/oxide` package requires platform-specific native binaries. If `package-lock.json` was generated on a different OS (e.g., macOS), Linux users might see:
```
Cannot find module '@tailwindcss/oxide-linux-x64-gnu'
```
**Fix**: Delete `node_modules/` and `package-lock.json`, then run `npm install` to regenerate.

### Frontend/Backend Auth Integration
The frontend uses Supabase client-side auth (signUp/signInWithPassword) which does NOT call the backend's `/auth/signup` endpoint. This means users created via the frontend might not have a record in the backend's `users` table. The backend's `ensure_user_exists()` function handles this by creating the user record on-demand before saving conversations.

### Travel Plan Generation Time
The `/travel/plan` endpoint calls both Tavily (web search) and Gemini (AI generation), which can take 20-40 seconds. Set appropriate timeouts when testing.

## Backend Health Check
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy","version":"1.0.0"}
```

## Branches
- Frontend code: `devin/1773134915-nextjs-frontend`
- Backend code: `devin/fastapi-backend`
- These are on separate branches and may need to be combined for full-stack testing
