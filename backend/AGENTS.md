# AGENTS.md

## Project Overview

Product Analyzer: a multi-agent system that researches products, extracts data, enriches it, validates it, and scores quality. FastAPI backend with React (Vite) frontend.

## Agents

| Agent | File | Responsibility |
|---|---|---|
| Research | `agents/research_agent.py` | Gather raw product info from sources |
| Extraction | `agents/extraction_agent.py` | Parse structured fields from raw data |
| Enrichment | `agents/enrichment_agent.py` | Add missing details (brand, category, tags) |
| Validation | `agents/validation_agent.py` | Check completeness and correctness |
| Quality | `agents/quality_agent.py` | Score overall data quality |

## Conventions

- Python 3.11+, each agent exposes a class with a `run()` method returning a dict
- API endpoints live in `api/routes.py`; keep handlers thin, delegate to agents
- Models use dataclasses in `models/`
- Tests use pytest; run with `pytest` from `backend/`
- Frontend components go in `frontend/src/components/`

## Commands

```bash
# Backend
pip install -r requirements.txt
uvicorn api.main:app --reload

# Tests
pytest

# Frontend
cd ../frontend && npm run dev
```
