# Product-Analyzer

Multi-agent product research and analysis system with a React frontend.

## Structure

```
backend/
├── agents/          # Research, extraction, enrichment, validation, quality agents
├── api/             # FastAPI app and routes
├── data/
│   ├── products/    # Product data storage
│   └── documents/   # Source documents (PDFs, images)
├── document/        # PDF processing and OCR
├── models/          # Data models
├── rag/             # Ingestion, embeddings, retrieval
├── tests/           # Pytest tests
├── docker-compose.yml
└── requirements.txt

frontend/            # React + Vite app
```

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn api.main:app --reload
```

API available at http://localhost:8000 (docs at /docs).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at http://localhost:5173.

## Docker

```bash
cd backend
docker compose up
```
