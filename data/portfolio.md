# Abhishek Singh

**AI Engineer** at a fiber and telecom network engineering company · July 2025 – present · Prague, Czech Republic

- Email: abhimattx@gmail.com
- GitHub: https://github.com/abhimattx
- LinkedIn: https://www.linkedin.com/in/abhimattx/
- Portfolio: https://abhimattx.github.io/
- Education: BSc Intelligent Systems with Robotics, Tomas Bata University, Czech Republic
- Open to full-time roles.

> Employer, customer and partner names are deliberately left out of this file. If someone asks for
> them, say they are not public and suggest emailing Abhishek.

---

## 1. At a glance

I build AI systems that run in production on our own hardware: one RTX 4090, local LLMs through
Ollama, and no paid cloud AI. I also built the agent tooling I use to develop them safely.

|                                                          |                                                                                                                                                                                                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RAG assistant** (sole developer)                 | **1,386** logged questions in **339** sessions from **11+** named users (Sep 2025 – Jul 2026 log export). **73 %** of rated answers were thumbs-up. Retrieval baseline: **recall@10 0.976, MRR 0.953** |
| **Ticket automation** (main developer, 87 commits) | **7,300+ tickets** handled and **48,500+ ticket changes** tracked (Apr – Nov 2026). **2,187** attachment photos classified by YOLO. 14,500+ scheduled runs                                                         |
| **Construction-photo AI**                          | My YOLO models run in production. Best validation mAP@50:**0.985** ruler, **0.970** marker ball, **0.919** trench                                                                                                   |
| **Agent orchestration** (my own tooling)           | 2 tools,**184** passing tests. An AI worker/driver loop fixed a 39-finding UI audit in **1 round for $1.96**                                                                                                              |

**Core skills:** RAG and retrieval · LLM agents (LangGraph, tool calling, text-to-SQL) · computer vision
(YOLO, segmentation, classification, auto-labelling) · Python backends (FastAPI, Django, Celery) ·
Playwright automation · Docker and CI/CD · agentic developer tooling (Claude Code, multi-agent loops).

---

## 2. Skills matrix

**Level:** **Production** = shipped and in daily use · **Prototype** = built and working, but not in
production · **Gap** = a known weakness I'm working on.

| Area                                | Level                   | Tools and techniques                                                                                                                                                            | Evidence                                                                              |
| ----------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **RAG and retrieval**         | Production              | ChromaDB, BM25, Neo4j graph search, Reciprocal Rank Fusion, cross-encoder reranking, semantic chunking, embedding migration (BGE → nomic, L2 → cosine)                        | RAG assistant: 1,386 questions; recall@10 0.976, MRR 0.953                            |
| **Retrieval evaluation**      | Production              | recall@k and MRR keyed suite, query-log replay suite, latency audits with evidence labels                                                                                       | RAG eval harness; three written audits                                                |
| **Answer-quality evaluation** | Gap                     | No faithfulness or LLM-as-judge eval yet; only user thumbs up/down                                                                                                              | Next step: a labelled set built from the 73 thumbs-down answers                       |
| **LLM agents**                | Production + prototypes | LangGraph ReAct, tool calling, read-only text-to-SQL with table allowlist, intent routing, per-mode toolsets, approval-gated writes, fallback chains                            | RAG SQL tools agent (production); allocation agent, QGIS copilot (prototypes)         |
| **LLM guardrails**            | Production              | Relevance floor, grounding check with strict retry, cited and code-verified summaries, AI-code denylist with human review and rollback                                          | RAG assistant, CRM reminders, QGIS copilot                                            |
| **Local LLM serving**         | Production              | Ollama (Qwen 2.5/3.x, Gemma, Llama 3.1, Llama 3.2 Vision, Llama 3.3 70B),`num_ctx`/`num_predict` budgets on one 24 GB GPU, keep-alive tuning, JSON-schema structured output | Every LLM project runs on our own hardware                                            |
| **Hosted LLM APIs**           | Prototype               | Anthropic Claude: Haiku for routing with forced tool choice, Opus for generation, structured output                                                                             | QGIS AI Copilot                                                                       |
| **Computer vision**           | Production              | YOLO11 / YOLO26 / YOLOv12 (detection, segmentation, classification), RT-DETR, Detectron2, vision LLMs; mAP, PR/ROC curves, threshold tuning                                     | Construction-photo models (mAP@50 0.985 / 0.970 / 0.919); ticket-automation YOLO11 classifier (2,187 photos) |
| **ML data work**              | Production              | Auto-labelling, deduplication, hard-negative mining, Roboflow, per-image error analysis, annotation manual, class-imbalance detection                                           | Construction-photo training data; CV pipeline report                                              |
| **MLOps**                     | Prototype / gap         | Retraining triggered when new labels arrive, config chosen from dataset stats, auto-generated reports. Missing: experiment tracking, model registry, data versioning            | CV Pipeline                                                                           |
| **Python backends**           | Production              | FastAPI (async, SSE, WebSockets), Django 5 + DRF, Celery + Redis, PostgreSQL, SQLite (WAL), DuckDB                                                                              | RAG, ticket automation, construction-photo app, portal                                                           |
| **Frontend**                  | Production              | Next.js 16 / React 19 (backend-for-frontend + NextAuth), React 18 + Vite, MUI, Tailwind, TanStack Query, Recharts, Chrome extension (Manifest V3)                               | RAG UI, ops dashboard, portal gallery, ticket-automation extension                               |
| **Browser automation**        | Production              | Playwright, cross-process locks, circuit breaker                                                                            | Ticket automation: 7,364 tickets handled                                                         |
| **Geo / GIS**                 | Production + prototype  | GeoPandas, Shapely, Nominatim geocoding, QGIS/PyQGIS, NetworkX graph algorithms                                                                                                 | Construction-photo address matching; QGIS copilot                                                 |
| **DevOps**                    | Production              | Docker Compose, CUDA containers, nginx, systemd services and timers, Azure DevOps pipelines on a self-hosted agent, GitLab MRs, health-checked deploys, rsync guard tests       | All core projects                                                                     |
| **Testing and CI**            | Mixed                   | pytest with fake-LLM fixtures (184 tests in my tooling), Django TestCase, CI import checks.**Gap:** the RAG repo has no CI and no committed tests                         | agent-hub, loop engine, ticket-automation CI                                                     |
| **Observability**             | Gap                     | Prometheus, Grafana and Alertmanager are designed but not wired in; no p95 latency tracking                                                                                     | Infrastructure design doc                                                             |
| **Agentic dev tooling**       | Production (own use)    | Claude Code (skills, hooks, plugins, subagents, memory), headless`claude -p`, worker/driver loops, git worktrees and hidden-ref checkpoints, Codex, pi                        | agent-hub (148 tests), loop engine (36 tests), real runs at $1.96 and $0.73           |
| **Communication**             | Production              | Technical audits, a management report for non-technical readers, an operator manual, an annotation manual, AGENTS.md per project                                                | RAG audit and management report, annotation manual                                    |

---

## 3. Timeline

| When            | What                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Jul 2025        | Started at my current employer. First RAG prototype; LLM fine-tuning experiments                                                                                             |
| Aug – Sep 2025 | RAG: separate retrievers for tools, policies and company structure; SQLite tool aggregation; synthetic intent and NER data for text-to-SQL routing             |
| Oct – Dec 2025 | Ticket bot prototypes: AI login, a 2-step vision classifier, then a trained YOLO image classifier                                                              |
| Jan – Feb 2026 | Ticket bot to production: JSON → SQLite → PostgreSQL, three scheduler services, Celery workers. RAG gets a Next.js frontend                                      |
| Feb – Oct 2026 | CV model training for a fiber contractor (ball, ruler, trench, FTU); classification rules and config in the construction-photo app; CV retraining pipeline                             |
| Jun – Sep 2026 | RAG bottleneck analysis, end-to-end audit and fixes, eval harness. Ticket bot scheduler collision fixes. Prototypes: allocation agent, QGIS copilot, CRM reminders |
| Oct 2026        | agent-hub (knowledge and git manager for coding agents). Portal annotation gallery. CV model literature review             |
| Nov 2026        | Worker/driver agent loop engine. RAG SQL tools agent. Agent-driven RAG frontend audit fixes                                                                    |

---

## 4. On-premise RAG assistant (sole developer)

**Problem:** Employees needed answers about company policies, org structure, the glossary and hundreds
of internal FME/GIS tools. That knowledge was spread across documents and databases. I kept the whole system on-premise with
local LLMs, so no company data leaves our server.

**Result:** An on-premise assistant with **1,386 logged questions** in 339 sessions from 11+ named
users. **73 %** of rated answers were thumbs-up (196 up, 73 down). The most-used knowledge base is
**internal tools (61 % of questions)**. Counting and listing questions about tools are what vector
search handles worst, and the SQL agent below covers them.

**Architecture**

```
User ──► Next.js UI (backend-for-frontend + NextAuth login)
            │
            ▼
       FastAPI ── 8-step pipeline: session → LLM classifier → cache → context
            │                      → retrieval → cache → session → audit log
            │
            ├── tool questions ──► LangGraph SQL agent (read-only, table allowlist)
            │                          └─ no answer ──► fall back to RAG
            │
            └── RAG: Neo4j graph ∥ Chroma vectors ∥ BM25
                     → RRF fusion → cross-encoder rerank → token budget
                     → Ollama LLM → grounding check → streamed (SSE) or JSON answer

Celery workers (embedding / retrieval queues) · Redis · PostgreSQL query log
Scheduled sync: tool data → SQLite → Neo4j + Chroma
```

**What I built**

- **Hybrid retrieval.** Vector search (ChromaDB), keyword search (BM25) and graph search (Neo4j) run in
  parallel. Results are fused with Reciprocal Rank Fusion using per-intent weights, then re-sorted by a
  cross-encoder (`ms-marco-MiniLM-L-6-v2`).
- **Separate retrievers per knowledge type** (tools, policies, company/people, glossary). Each has its
  own chunking: structured ~800-token chunks for tools, dedicated processors for policies and company
  JSON, semantic windowing for everything else. I also curated the company, people and policy sources
  into structured JSON for ingestion.
- **One-call query classifier.** A small model (Qwen 2.5 3B) returns intent, entities and a rewritten
  query in one call. Team-name aliases are expanded, and glossary lookups skip the LLM through a regex
  fast path.
- **SQL tools agent.** A LangGraph ReAct agent answers questions like "how many tools does a given team
  use?" with SQL. Safety: read-only session, 10 s statement timeout, table allowlist, forbidden-pattern
  check, PII tables excluded. If it fails or times out, normal RAG answers instead.
- **Anti-hallucination guardrails.** A relevance floor returns "no info" instead of guessing. An
  ungrounded answer gets one strict retry, then a fixed fallback answer. Streaming and JSON answers use
  the same checks.
- **Ingestion.** Loader → text extraction → semantic chunker → embedder → vector store, with heavy
  jobs on Celery. An admin UI handles knowledge updates. Embeddings moved between models (BGE-large
  1024-D and nomic-embed 768-D) with dual-embedding support, and collections moved from L2 to cosine
  distance.
- **Frontend.** Next.js 16 / React 19 with login, streaming chat, feedback, and admin pages (roles,
  ingestion, tools sync). It replaced the original Streamlit UI.
- **Ops dashboard.** React + TanStack Query + Recharts + WebSockets: live CPU and memory per container,
  log streaming, alerts, and a restart button with a confirmation step.

**Audit → fix → measure.** I reviewed my own system three times and wrote up each review:

1. **Bottleneck analysis (Jun 2026).** A review of chunking, embeddings and ranking that led to better
   retrieval of short glossary entries and a move from L2 to cosine distance.
2. **End-to-end audit (Jul 2026).** Live latency measurements, with every finding labelled
   measured / from source / estimated.
3. **Management report.** The same findings in plain language for non-technical stakeholders.

Improvements, each logged with what changed and why:

- Cross-encoder reranking on every answer, with a 30-candidate pool.
- Vector and BM25 search run in parallel (30–100 ms saved per query).
- **~100× faster cache hits.**
- Generation length capped, so long answers no longer time out.
- Pooled database connections and a longer model keep-alive, which avoids ~30 s cold starts.

**Evaluation harness:**

- A keyed suite (recall@k and MRR) and a replay suite built from real query logs.
- Baseline captured *before* the reranker change, so its effect could be compared fairly:
  **recall@10 0.976, MRR 0.953**.

**Stack:** Python 3.12, FastAPI, LangChain, LangGraph, Ollama (Qwen 2.5, Gemma), ChromaDB, BM25, Neo4j,
sentence-transformers, Celery, Redis, PostgreSQL, Next.js 16, React 19, NextAuth, Tailwind, Docker
Compose, nginx.

---

## 5. Ticket automation: ticket intake with computer vision (main developer)

**Problem:** The team handled fiber and DFN trouble tickets by hand in an external portal. They had to
open each ticket, download its attachments and check the photos.

**Result:** A bot running around the clock. Between Apr and Nov 2026 it handled **7,364 unique
tickets** (5,018 DFN, 1,078 ODF, 412 cable damage) and tracked **48,558 ticket changes** (status,
assignee and other fields). It classified **2,187 attachment photos** with YOLO (603 FTU, 1,584 other).
All of it comes from **14,500+ scheduled runs** (~80 a day across three services) and is stored in
PostgreSQL. The team works from a dashboard and a Chrome extension. **87 of ~120 commits are mine**, from the first prototype to
the production system.

**How the image AI evolved** (my favourite engineering story):

1. **Keyword rules on vision-model captions.** Too brittle: "a small opening" was read as "open box".
2. **2-step LLM.** A vision model (Llama 3.2 Vision 11B) describes the photo, then a text model
   (Llama 3.3 70B) classifies the description. More accurate, but slow and heavy.
3. **A trained YOLO11 classifier** (FTU / drawing / other) with a filename-based fallback if the model
   is unavailable. Fast, deterministic and cheap to run. This is what runs in production.

**What I built**

- **Three scheduler services** (one per ticket filter) that run without colliding: a cross-process
  lock, staggered start times, and exclusive label ownership per phase.
- **Two-phase download** with retries.
- **Data migration in phases behind feature flags:** a fragile JSON file → SQLite (WAL, atomic
  repository) → PostgreSQL as the single source of truth.
- **Celery + Redis workers** process tickets in parallel.
- **FastAPI with WebSocket live updates, a React dashboard and a Chrome extension (Manifest V3)** that
  shows ticket state inside the portal, including tracking when a ticket's type changes.
- **Reliability:**
  - circuit breaker;
  - status-transition fixes;
  - filter for invalid assignees;
  - cleanup scripts for stale flags.
- **CI:** an import check that needs no database, plus a test that keeps the deploy rsync from
  overwriting live data.

**Stack:** Python, Playwright, FastAPI, WebSockets, Celery, Redis, PostgreSQL, Ultralytics YOLO, Ollama,
React + Vite + Tailwind, Chrome Extension, systemd, Azure DevOps CI/CD.

---

## 6. Construction-photo AI for a fiber contractor (ML engineer on a shared app)

**Problem:** Field engineers upload large batches of construction-site photos. Each one must be filed under
the right address and network area and checked for required evidence: a marker ball in the trench, a
measuring ruler, a correctly installed FTU. Doing this by hand is slow and error-prone.

**The app** (team-built): upload ZIPs of up to 20 GiB → address parsing → geocoding and shapefile
matching → **AI checks** → Excel QA report → ZIP of sorted photos. A PostgreSQL job queue feeds a
separate runner.

**My part: the AI.** I wrote 12 of ~90 commits in the shared repo. My work sits in the models and the
classification logic.

- **Trained the detection and classification models. My weight files are the ones deployed in the
  app** (verified byte-identical). Best validation runs:

  | Model           | Architecture | Precision | Recall | mAP@50          | mAP@50-95 |
  | --------------- | ------------ | --------- | ------ | --------------- | --------- |
  | Measuring ruler | YOLO26s      | 0.938     | 0.981  | **0.985** | 0.845     |
  | Marker ball     | YOLO26s      | 0.950     | 0.959  | **0.970** | 0.874     |
  | Trench          | YOLO26m      | 0.896     | 0.880  | **0.919** | 0.497     |

  Also an **FTU classifier** (YOLO26s-cls) with ROC/PR curves and threshold optimisation. I compared
  these against RT-DETR, Detectron2 instance segmentation and a QR-code detector.
- **Data pipeline:**

  - auto-labelling, deduplication and hard-negative mining;
  - per-image error analysis;
  - merging several Roboflow datasets;
  - a written **annotation manual** (also generated as a PDF) so annotators label consistently.
- **Classification logic:**

  - confidence routing to CORRECT / REVIEW / WRONG;
  - rules and thresholds for the "trench stick" check;
  - low-confidence detections **shown for human review instead of silently dropped**;
  - atomic model calls.
- **Production fixes:**

  - schema-validated config driven by pipeline variables;
  - a fix for a runner segfault (pinned torch/ultralytics, release of orphaned jobs);
  - a deploy health check that retries while the app starts;
  - custom job names in the UI.

**Stack:** Ultralytics YOLO26 / YOLOv12, RT-DETR, Detectron2, Roboflow, FastAPI, PostgreSQL, GeoPandas,
Shapely, Docker, Azure DevOps.

---

## 7. ML infrastructure and research

- **Automated retraining pipeline (CV Pipeline).**
  - Watches the portal's annotation store, validates YOLO segmentation labels, splits the data, and
    **starts YOLOv12 training once 500 new images arrive**.
  - A decision engine sets the training config from dataset statistics. The pipeline then evaluates the
    model and writes a report.
  - **Training is deterministic code; the LLM only writes the report.**
  - First real run on production annotations (Oct 2026): mAP@50 0.786. The report automatically flagged
    a **100:1 class imbalance** as the next thing to fix.
  - Stack: FastAPI status API, watchdog, supervisord, Docker with CUDA.
- **Annotation dataset gallery** in the company's internal portal (Django 5 + React, team-owned). I
  built it across backend and frontend: per-category image and shape counts, paged and filtered
  browsing, cached OpenCV thumbnails, keyboard access.
- **Literature review on CV for construction photos.**
  - Topics: small and thin objects in smartphone photos, edge vs cloud inference, and ways to need less
    annotation (SAM, auto-labelling, active learning).
  - Run with parallel research agents, one per topic.
  - Output: **76 BibTeX references**, a comparison table, a list of research gaps the company can fill, and an
    ablation plan (CEASC, QueryDet, DeepLabV3, MobileNetV2).

---

## 8. Agent orchestration: how I develop with AI agents

**Problem:** I use AI coding agents (Claude Code, Codex, pi) on real projects. An agent with no
guardrails can run a destructive command, and each agent starts a session without knowing the project.

**Solution:** Two tools that give every agent the same project knowledge and the same safety rules,
plus a reviewed, test-gated way to deliver work.

```
  Global safety rules ── loaded by Claude Code, Codex, pi
        │
 hub CLI ── registry of 17 projects ── knowledge vault (AGENTS.md + changelog per project)
        │        ▲ post-commit hook: LLM reindex in the background
        │        ▲ systemd timers: sync every 45 min, reindex weekly
        │
 hub feature start ──► git worktree (live checkout never touched)
        │
 loop engine: WORKER ⇄ DRIVER  + test checks + budget + rollback
        │
 hub feature pr ──► only after a human says yes
```

### 8.1 agent-hub: knowledge and git manager (~2,000 lines, 148 tests)

- **Registry.** Scans my code folders and records each repo's remotes, host (GitLab, Azure DevOps),
  auth method and stack. Hand-written fields (purpose, tier, deploy branch) are never
  overwritten.
- **Knowledge vault.** One `AGENTS.md` per project: architecture, commands, conventions, env var
  *names only*, gotchas. It is symlinked into each repo as `AGENTS.md` and `CLAUDE.md` and excluded
  from git. I tested how Claude Code loads these files and found it ignores out-of-project `@imports`
  in headless mode, so the tool symlinks the files directly.
- **Docs that keep themselves current.** An LLM drafts AGENTS.md from a bounded repo summary. After
  each commit, a global git hook updates the changelog in the background. AGENTS.md is rewritten only
  when something meaningful changed. Every rewrite is committed, so it can be reviewed and reverted.
  The hook chains to each repo's own hooks, so team hooks keep working.
- **Safe git:**
  - status shows ahead/behind, dirty files, stashes and merged branches;
  - sync only fast-forwards clean branches and never pushes;
  - live checkouts are fetch-only.
- **Feature flow:**
  - `start` creates a branch, or a worktree for a live checkout;
  - `pr` writes an LLM description, asks for confirmation, then pushes and opens the PR (Azure DevOps
    API / GitLab);
  - `done` cleans up.
- **Other commands:**
  - a dependency graph ("if X changes, what is affected?");
  - `doctor` health checks that never print token output.
- **Safety:**
  - every command that changes anything outside the hub prints a plan unless you pass `--apply`;
  - no secrets are stored or read;
  - tests run against temporary repos and a fake LLM.

### 8.2 Worker/driver loop engine (~1,070 lines, 36 tests)

Two separate Claude sessions:

- the **worker** writes code;
- the **driver** (a stronger model by default) reviews each round's diff against the acceptance
  criteria and replies `done`, `continue`, `answer` or `escalate` (to a human).

What's enforced **in code, not in prompts:**

- **Checks gate "done".** Tests, lint and type checks run after every worker turn. The driver cannot
  accept the work while any check fails.
- **Protected files.** If the worker edits the tests it is graded by, the engine restores them and tells
  both agents.
- **Checkpoints.** The working tree is snapshotted into hidden git refs every round. The driver reviews
  exact diffs, and a human can roll back to any round and steer the retry.
- **Limits:**
  - budget in USD and a maximum number of iterations;
  - a no-progress detector that escalates to a human;
  - a hard deny list (no push, rebase, reset, docker, systemctl, sudo, or opening PRs).
- **Milestone plans for larger builds.** Fresh sessions per milestone, a `PROGRESS.md` hand-off, and
  automatic commits.
- **Context cost control.** An isolated driver configuration uses ~7× less context per call.

**Real runs on my RAG frontend:**

| Task                                                | Rounds | Cost            | Result                                                           |
| --------------------------------------------------- | ------ | --------------- | ---------------------------------------------------------------- |
| Fix all 39 findings of a UI and accessibility audit | 1      | **$1.96** | `tsc` and `eslint` at 0 errors; every criterion has evidence |
| Close the gaps from the follow-up review            | 2      | **$0.73** | Done, merged                                                     |

### 8.3 Claude Code setup

- **Global rules** in every session:
  - treat every machine as if it runs live services;
  - never restart services, push or rewrite history without asking;
  - never read secrets;
  - ask before spending on LLM calls across several projects.
- **Plugins I combine:**
  - Superpowers (brainstorm → plan → execute → verify);
  - Everything-Claude-Code (specialist reviewer agents);
  - Impeccable (UI audits wired into hooks);
  - Graphify (code knowledge graphs);
  - Ponytail (minimal code);
  - Caveman (token-saving output).
- **My own `agent-loop` skill**, which lets any session set up and run the loop engine.
- **Persistent memory** across sessions.

---

## 9. Other projects and prototypes

| Project                             | What it does                                                                                                                     | What's notable                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Resource allocation agent** | Chat over Excel data on engineers' skills, certifications and assignments. Plans reallocations and forms project teams.          | LangGraph router with 4 modes, each with its own toolset.**All numbers come from a deterministic scoring engine** (weighted skill, cert, experience and availability scores; hard filters; set-cover team forming). The LLM only orchestrates and explains. The only write needs UI approval and runs as one transaction. DuckDB. I also wrote an Azure migration cost estimate. |
| **QGIS AI Copilot**           | "Talk to your map" plugin for GIS network design.                                                                                | Claude Haiku routes intents with a strict schema. NetworkX computes shortest paths, MSTs and connectivity without an LLM. Claude Opus writes design documents and PyQGIS code. Generated code is checked against a denylist, reviewed by a human, and run in a transaction with rollback. Can run offline on Ollama.                                                                   |
| **CRM follow-up reminders**   | Reminders for overdue sales follow-ups with an LLM summary of the deal notes.                                                    | Every summary bullet must cite its source note with a verbatim quote, and code checks both. Unverifiable bullets are dropped ("wrong information is worse than missing information").                                                                                                                                                                                                  |
| **Pi agent web chat**         | Next.js chat UI that streams a headless coding agent CLI.                                                                        | Server-side model allowlist, streamed output.                                                                                                                                                                                                                                                                                                                                          |
| **Vision inference demos**    | Image → structured JSON with a vision LLM; LocateAnything-3B visual grounding; VideoMAE action recognition.                     | Upload validation, size limits; fixed CUDA memory fragmentation.                                                                                                                                                                                                                                                                                                                       |
| **Team skills dashboard**     | Team profiles, skills heatmap, team assembly views.                                                                              | Raw HR data never reaches the browser, only aggregates. Password-protected upload, automatic backups.                                                                                                                                                                                                                                                                                  |
| **Infrastructure design**     | Network, container and monitoring architecture for self-hosted services.                                                         | Reverse proxy, firewall, shared Postgres/Redis/Ollama, Prometheus + Grafana + Alertmanager design.                                                                                                                                                                                                                                                                                     |
| **Early NLP work**            | Synthetic intent and NER data for text-to-SQL routing; LLM fine-tuning experiments.                                              | The first step toward the RAG SQL agent.                                                                                                                                                                                                                                                                                                                                               |
| **Platform prototype**        | Worked on a Flask tool portal serving Docker-packaged Python tools for three customer projects, plus a multi-team redesign plan. | Came before the team's internal portal.                                                                                                                                                                                                                                                                                                                                              |
| **3D reconstruction test**    | COLMAP structure-from-motion on frames from site video.                                                                          | Feasibility test.                                                                                                                                                                                                                                                                                                                                                                      |

---

## 10. How I work

1. **Deterministic core, LLM at the edges.** Scores, training configs, graph algorithms and SQL safety
   are plain, testable code. The LLM routes, explains and writes.
2. **Use the simplest model that works.** The ticket bot went from LLM captions to a 70B pipeline to a small
   trained YOLO model. Allocation uses a scoring engine, not LLM math.
3. **Fall back, don't fail.** SQL agent → RAG. Ungrounded answer → strict retry → fixed answer.
   Low-confidence detection → human review.
4. **Measure before claiming.** Findings are labelled measured or estimated. Baselines are captured
   before changes.
5. **Engineer the safety in.** Read-only DB sessions, allowlists, deny lists, protected tests, worktrees,
   `--apply` gates.
6. **Self-hosted and cost-aware.** One 24 GB GPU with explicit context and generation budgets. Agent
   runs are capped in dollars.
