# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users: 10th standard (Grade 10) students navigating the critical educational transition of selecting high school academic streams (Science, Commerce, Arts) and exploring foundational career directions with their parents and educators.

## Product Purpose

Career Compass exists to demystify stream and career choices for 10th standard students by analyzing their natural interests, cognitive strengths, and working styles. Success means a student gains clarity on suited pathways, understands required foundational skills, and builds confidence without feeling pressured or pigeonholed.

## Positioning

Deterministic, transparent trait scoring across 8 psychological dimensions (Analytical, Technical, Scientific, Business, Creative, Social, Leadership, Exploration) coupled with structured, actionable roadmaps. Unlike opaque generative AI chatbots that hallucinate speculative career advice, Career Compass provides verifiable, non-prescriptive directional guidance anchored in grounded curriculum milestones.

## Operating Context

Web application accessible on desktop, tablet, and mobile. Students typically engage in a guided 5-minute assessment (20 questions), review directional alignment and academic stream suitability (Science/Commerce/Arts), inspect phased skill roadmaps and project ideas, track adaptive weekly milestones on a personal dashboard, and consult a context-grounded AI Career Coach.

## Capabilities and Constraints

- Next.js 16 (App Router) + React 19 + Tailwind CSS 4 frontend; FastAPI Python backend.
- Pure deterministic scoring engine: 20 validated questions, 8 traits, 3 academic streams, 12 career domains.
- Local journey persistence (`localStorage` with in-memory fallback) preserving student progress across sessions without forced authentication.
- Strict rate-limiting and payload validation at all API boundaries.
- Non-prescriptive framing: Results are exploratory directions, not rigid career destinies.

## Brand Commitments

- Aesthetic: Editorial, calm, sophisticated, intelligent, warm, and premium.
- Color Identity: Deep Navy (`#0B1220`), Electric Blue (`#3B82F6`), Slate (`#F8FAFC`), Card Dark (`#111827`).
- Tone: Encouraging, supportive, clear, mature, and intellectually honest.
- Absolute Ban: No noisy "AI startup" neon glows, crypto/web3 visual clichés, or jittery chatbot animations.

## Evidence on Hand

- 12 comprehensive career intelligence curricula and roadmaps in `frontend/src/lib/career-intelligence/`.
- 20-question psychological trait assessment instrument in `frontend/src/lib/assessment-data.ts` and `backend/app/scoring/traits.py`.
- 98 automated backend tests verifying deterministic scoring and input validation.
- Complete responsive web interface across all 11 routes.

## Product Principles

1. **Deterministic Over Generative**: High-stakes decisions like stream selection require transparent, explainable scoring rules rather than unpredictable LLM hallucinations.
2. **Directional, Not Definitive**: No single test defines a 15-year-old student. Guidance should expand horizons, illuminate options, and encourage self-exploration.
3. **Calm & Dignified**: Respect the student's cognitive focus with an editorial, minimal aesthetic and zero manipulative dark patterns or gamified noise.
4. **Actionable Progression**: Every career direction must connect immediately to concrete next steps: core skills to learn, beginner projects to build, and weekly sprints.

## Accessibility & Inclusion

- Responsive layout across mobile and desktop.
- High contrast typography adhering to WCAG AA guidelines.
- Full support for `prefers-reduced-motion` across all interactive animations.
