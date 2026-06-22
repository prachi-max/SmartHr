# SmartHire — Job Application Tracker

Full-stack job search tracker with AI resume analysis.

## Project Structure

```
smarthire/
├── backend/           ← FastAPI + SQLite/PostgreSQL
│   ├── main.py        ← Entry point
│   ├── routes/ai.py   ← Gemini resume analysis
│   ├── routes/jobs.py ← CRUD job applications
│   ├── routes/users.py← Auth endpoints
│   ├── .env           ← API keys (never commit!)
│   └── requirements.txt
└── frontend/          ← Angular 18 SPA
    ├── src/app/
    │   ├── components/
    │   │   ├── auth/              ← Login & Register page
    │   │   ├── dashboard/         ← Stats + pipeline chart
    │   │   ├── kanban/            ← Kanban board view
    │   │   ├── applications/      ← Table with search/filter
    │   │   ├── resume-analyzer/   ← PDF upload + AI analysis
    │   │   ├── navbar/            ← Top navigation
    │   │   ├── sidebar/           ← Left navigation
    │   │   ├── add-job-modal/     ← Add/Edit job modal
    │   │   └── toast/             ← Notifications
    │   ├── services/
    │   │   ├── auth.service.ts    ← Login/register/token
    │   │   ├── job.service.ts     ← Job CRUD + AI analyze
    │   │   └── toast.service.ts   ← Toast notifications
    │   ├── models/job.model.ts    ← TypeScript interfaces
    │   ├── guards/auth.guard.ts   ← Route protection
    │   └── auth.interceptor.ts    ← Auto-attach JWT token
    └── package.json
```

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Edit .env — add your GEMINI_API_KEY
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
ng serve   # Runs on http://localhost:4200
```

## Features

- **Auth** — Register / Login with JWT tokens
- **Dashboard** — Stats cards + pipeline bar chart
- **Kanban** — Visual board across 5 status columns
- **Applications** — Searchable, filterable table
- **Resume Analyzer** — Upload PDF or paste text → Gemini AI gives match score, missing keywords, suggestions
- **URL Scraper** — Auto-fill job details from any URL
- **Toast notifications** — Success/error feedback everywhere

## Resume Analyzer PDF Upload

The PDF analyzer uses **pdf.js** (loaded from CDN) to extract text client-side — no file is uploaded to the server. The extracted text is sent to your Gemini AI backend for analysis.

Supported: Any text-based PDF. Scanned image PDFs won't work (use Paste Text mode instead).
