# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers, first. They skim many portfolios fast, and their job is to decide in seconds whether Abhishek is worth contacting for a full-time AI engineering role. Potential freelance clients are a secondary audience.

## Product Purpose

A personal portfolio for Abhishek Singh, an AI systems engineer in Prague. Success means a recruiter or hiring manager gets impressed by how the work is presented within the first few seconds and wants to get in touch about a full-time role.

## Positioning

He builds AI systems that run in production, not just demos: retrieval and answer engines, automation that keeps working when the platform it targets changes, and computer vision. The proof is measured results from real deployed systems (for example, daily admin time cut from 150 to 15 minutes, 50+ tickets per hour).

## Operating Context

Visitors arrive from a CV, LinkedIn, GitHub or a job application, often on a laptop between other candidates, sometimes on a phone. Attention is short: the site has to be visual-first and skimmable, not long reading. Contact goes by email or LinkedIn.

## Capabilities and Constraints

- Static site on GitHub Pages: plain HTML, CSS and JS, no framework and no build step. Content comes from `data/systems.json`.
- Must be served over HTTP (it uses `fetch()`), not opened as `file://`.
- Matrix, the corner guide, asks the Railway backend, which answers from `data/portfolio.md` (a public-safe copy of `profile.md`).
- Case study copy is provisional. The user will rewrite the writeups once the design is final. The design must work with the current entries in `data/systems.json` and with rewritten ones.

## Brand Commitments

- Name: Abhishek Singh. Role line: AI engineer, Prague, CZ.
- Honest voice: numbers are real and measured, or labelled as indexed against a baseline when the system belongs to an employer. Never round up or invent figures.
- The user rejected the existing plain terminal/text-heavy look, and also generic bento, magazine-editorial and glowing "AI" dark looks, as AI slop.

## Evidence on Hand

- Content source: `profile.md` (local only, not committed: it holds real customer names and private notes). The public site and `data/portfolio.md` use generic names for the employer, customers and partners, with the real measured numbers.
- Two case studies in `data/systems.json`:
  - Ticket intake with computer vision (running around the clock). Counted, April to November 2026: 7,364 unique tickets (5,018 DFN, 1,078 ODF, 412 cable damage), 48,558 ticket changes, 2,187 photos classified by YOLO11 (603 FTU, 1,584 other), 14,500+ scheduled runs.
  - On-premise RAG assistant (in production, sole developer). 1,386 questions in 339 sessions from 11+ named users, 73% of 269 rated answers thumbs-up, recall@10 0.976, MRR 0.953, 61% of questions about internal tools.
- Six shorter entries in `others[]` (construction-photo AI, agent orchestration, retraining pipeline, three prototypes).
- Principles, stack and changelog entries in `data/systems.json`.
- Photos: `assets/proPic.png` (3072x3072, cut out on a terracotta circle) and `pic/profile_pic.png` (1024x1536, dark blue studio background).
- Education: BSc Intelligent Systems with Robotics, Tomas Bata University, Czech Republic.
- Contact: abhimattx@gmail.com, github.com/abhimattx, linkedin.com/in/abhimattx.
- There are no testimonials, client logos or press. Do not invent any.

## Product Principles

1. Proof beats claims. Lead with measured outcomes from real systems.
2. Understood in seconds. Every section should land at a glance; depth is optional and comes after.
3. Honest numbers. Label indexed or estimated figures as such.
4. Every path ends at contact. A full-time hiring conversation is the goal.

## Accessibility & Inclusion

No product-specific requirement established. Standard WCAG AA, keyboard access and reduced-motion support apply.
