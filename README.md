# Travel Agent AI

AI-powered travel planning assistant.

## Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: Streamlit
- **AI Model**: Google Gemini (free tier)
- **Search Tool**: Tavily Search API
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth

## Database Schema
### users table
- id (uuid, primary key)
- email (text, unique)
- created_at (timestamp)

### conversations table
- id (uuid, primary key)
- user_id (uuid, foreign key -> users.id)
- query (text) - user's travel question
- response (text) - AI's travel plan response
- created_at (timestamp)

## Setup
1. Copy `.env.example` to `.env` and fill in keys
2. Backend: `cd backend && pip install -r requirements.txt && uvicorn main:app --reload`
3. Frontend: `cd frontend && pip install -r requirements.txt && streamlit run app.py`