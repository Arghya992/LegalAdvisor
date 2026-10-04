# AI Legal Advisor — Backend

Python/FastAPI backend for the AI Legal Advisor application.

## Tech Stack

- **FastAPI** — async web framework
- **MongoDB** (via Motor) — document database
- **JWT** — authentication (python-jose)
- **Passlib** — password hashing (bcrypt)
- **Google Gemini** — AI legal response generation
- **Pydantic** — request/response validation

## Quick Start

```bash
cd Backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # on Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY, MONGODB_URI, JWT_SECRET

# Start the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

Interactive docs (Swagger UI) at `http://localhost:8000/docs`.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key | (empty — falls back to demo responses) |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DATABASE_NAME` | MongoDB database name | `LegalAdvisor` |
| `JWT_SECRET` | Secret for JWT signing | (must be changed) |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated | `http://localhost:5173` |

## API Endpoints

### Health
- `GET /api/health` — service status + database connectivity

### Auth (`/api/auth`)
- `POST /api/auth/login` — `{ email, password }` → `{ id, email, name, token }`
- `POST /api/auth/register` — `{ email, password, name }` → `{ id, email, name, token }`

### Consultations (`/api/consultations`)
- `GET /api/consultations` — list user's consultations (requires JWT)
- `POST /api/consultations` — `{ category }` → new consultation
- `POST /api/consultations/{id}/messages` — `{ content }` → `LegalResponseData`

### Resources (`/api/resources`)
- `GET /api/resources?category={cat}&q={search}` — list/filter resources
- `GET /api/resources/categories` — list all categories
- `GET /api/resources/{id}` — single resource

### Student (`/api/student`)
- `GET /api/student/tools`
- `GET /api/student/materials`
- `GET /api/student/cases`
- `GET /api/student/notes`
- `GET /api/student/flashcards`
- `GET /api/student/quiz`

## Architecture

```
Frontend → FastAPI → legal_service → rag_service (retrieval) → ai_service (Gemini) → response
```

- **`app/services/ai_service.py`** — Gemini integration with structured JSON output. Falls back to a deterministic demo response if no API key is set.
- **`app/services/rag_service.py`** — Retrieval-Augmented Generation layer. Keyword-based retrieval from the legal_resources collection. Designed to be replaced by a vector store (Chroma, Pinecone, MongoDB Atlas Vector Search) without changing the interface.
- **`app/services/legal_service.py`** — Orchestrates RAG + AI into the full pipeline.
- **`app/services/auth_service.py`** — User registration, login, JWT token creation.
- **`app/services/student_service.py`** — Student tools, materials, flashcards, quiz data.

## Connecting the Frontend

Set `VITE_API_BASE_URL` in the frontend `.env` to point to the backend:

```
VITE_API_BASE_URL=http://localhost:8000
```

The frontend service layer already checks for this variable and switches between demo data and live API calls automatically.

## Legal Disclaimer

This system provides general legal information and is not a substitute for advice from a qualified legal professional.
