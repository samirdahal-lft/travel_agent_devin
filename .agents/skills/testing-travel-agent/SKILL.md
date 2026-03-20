# Testing TravelAgent AI (Frontend + Backend)

## Overview
The TravelAgent AI app has a Next.js frontend and a FastAPI backend. Both need to run locally for end-to-end testing.

## Devin Secrets Needed
- `GEMINI_API_KEY` — Google Gemini API key for AI travel plan generation
- `TAVILY_API_KEY` — Tavily search API key
- `SUPABASE_URL` — Supabase project URL (e.g. `https://xxx.supabase.co`)
- `SUPABASE_KEY` — Supabase anon/public key
- `SUPABASE_SERVICE_KEY` — Supabase service role key (backend only)

## Backend Setup (FastAPI)

1. Navigate to the backend directory (on the `devin/fastapi-backend` branch)
2. Create `.env` from `.env.example` and populate with real credentials
3. Install dependencies: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
5. Verify: `curl http://localhost:8000/health` should return `{"status":"healthy","version":"1.0.0"}`

## Frontend Setup (Next.js)

1. Navigate to the `frontend/` directory (on the `devin/1773134915-nextjs-frontend` branch or a fix branch based on it)
2. Install deps: `npm install`
3. **CRITICAL**: Create `frontend/.env.local` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   Without this file, the frontend will throw a "Missing Supabase configuration" error in the browser.
4. Start: `npm run dev`
5. Open `http://localhost:3000`

## Common Issues

### `@tailwindcss/oxide` native binding error
The `package-lock.json` may have been generated on a different platform. Fix:
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Missing Supabase configuration" error
This means `.env.local` is missing or doesn't have `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Create it from `.env.local.example`.

### Foreign key constraint error on travel plan generation
If users sign up via the frontend (client-side Supabase Auth), the backend's `users` table may not have a record for them. The `ensure_user_exists()` function in `database.py` handles this — make sure it's called before `save_conversation()`.

## Testing Flow

1. Start backend on port 8000
2. Start frontend on port 3000 (with `.env.local` configured)
3. Test signup flow (creates Supabase auth user)
4. Test login flow (should redirect to `/dashboard`)
5. Test travel plan generation (requires backend running with Gemini/Tavily keys)
6. Test history page (`/history`) shows saved conversations
7. Test sign out (redirects to `/login`)

## Auth Architecture
The frontend uses Supabase client-side auth directly (`@supabase/ssr`). The backend has its own `/auth/signup` and `/auth/login` endpoints, but the frontend bypasses these. The backend verifies JWT tokens from Supabase for protected endpoints. This means users created via the frontend may not have records in the backend's `users` table — the `ensure_user_exists()` function bridges this gap.
