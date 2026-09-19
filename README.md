# Career Compass 🧭

An intelligent, deterministic career guidance and personalized roadmap platform designed for high school and university students.

Career Compass analyzes cognitive working styles, trait preferences, and academic strengths across 8 core dimensions to provide grounded career exploration, phased skills roadmaps, weekly progress tracking, and contextual coaching.

---

## Key Features

- **Deterministic Psychometric Assessment**: 20 grounded questions mapped to 8 core cognitive and behavioral traits (Analytical, Technical, Scientific, Business, Creative, Social, Leadership, Exploration).
- **12 Career Curricula**: Comprehensive roadmaps, toolchains, milestone projects, and industry insights across software development, AI/ML, healthcare, law, finance, design, management, engineering, and more.
- **Personalized Roadmap Engine**: Deterministic generation of 6-phase adaptive learning journeys tailored to student trait profiles, aptitudes, and current pace.
- **Adaptive Progress & Readiness Engine**: Tracks completed skills, milestone projects, and job preparation checklists to compute a transparent, multi-pillar Readiness Index.
- **Next-Best-Action Recommendations**: Context-aware recommendation engine prioritizing high-yield milestones, trait gap remedies, and capstone projects.
- **Interactive Career Coach**: Grounded, deterministic guidance grounded in user journey state and domain-aware curricula without generative hallucinations.
- **Zero-Friction Local Persistence**: Stores and hydrates user journey data seamlessly via `localStorage` with automated migration and memory fallback.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide Icons.
- **Backend**: FastAPI, Python 3.11+, Pydantic v2, Uvicorn, Pytest.
- **Testing**: Vitest (Frontend), Pytest (Backend).

---

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- Python 3.11+ and venv

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Unix:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing

### Run Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

---

## Architecture & Principles

1. **Deterministic Over Generative**: High-stakes decisions like academic stream and career planning require transparent, reproducible scoring rather than speculative chatbot hallucinations.
2. **Directional, Not Definitive**: Career recommendations illuminate options and potential pathways rather than boxing learners into rigid career destinies.
3. **Domain-Aware Intelligence**: All roadmap stages, milestones, and coach guidance respect domain-specific terminology across technical and non-technical fields.
