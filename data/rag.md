# RAG Yungo: Enterprise Knowledge Intelligence Platform

**Also known as:** rag, rag platform, enterprise rag, knowledge base, yungo, search system, knowledge intelligence

---

## Summary

**RAG Yungo** is a production-grade Retrieval-Augmented Generation system that transforms organizational knowledge access. It consolidates scattered documents, wikis, and databases into a single intelligent interface, reducing query resolution from **15+ minutes to under 30 seconds**. Features hybrid search (vector + BM25), cross-encoder reranking achieving **85% precision**, and supports **100 concurrent sessions**.

---

## 1. Project Overview

**RAG Yungo** is a production-grade **Retrieval-Augmented Generation (RAG)** system that transforms how employees access organizational knowledge. Instead of searching through scattered documents, wikis, and databases, users interact with a conversational AI that understands context, retrieves relevant information from multiple knowledge bases, and generates accurate, grounded answers.

### The Problem Solved

Organizations accumulate vast amounts of institutional knowledge across tool documentation, company policies, glossaries, and structured databases. Employees waste significant time:

- Searching across multiple systems
- Receiving outdated or inconsistent information
- Asking colleagues questions that already have documented answers
- Manually querying databases for structured data

**RAG Yungo** consolidates these disparate sources into a single intelligent interface that delivers **instant, contextual, and reliable responses**.

---

## 2. Organizational Impact

| Impact Area | Benefit |
|------------|--------|
| Time Savings | Reduces query resolution from 15+ minutes to under 30 seconds |
| Knowledge Accessibility | Enables non-experts to query complex technical information |
| Consistency | Single source of truth eliminates conflicting answers |
| Onboarding | New employees self-serve answers without constant interruptions |
| Decision Support | Real-time analytics queries without SQL knowledge |
| Institutional Memory | Preserves and surfaces tribal knowledge |

---

## 3. AI & Intelligence Architecture

### Why AI / RAG Was Necessary

Traditional enterprise search fails because:

- Keyword search misses semantic intent
- Knowledge spans structured and unstructured data
- Conversational follow-ups require memory
- Users need synthesized answers, not document links

---

### Intelligence Components

```
User Query
   ↓
Query Rewriter (LLM)
   ↓
Intent Classifier
   ↓
Hybrid Retrieval Engine
   ├─ Vector Search (Semantic)
   ├─ BM25 (Lexical)
   └─ RRF Score Fusion
   ↓
Cross-Encoder Reranker
   ↓
LLM Response Generation
```

---

### Key AI Techniques

| Technique | Implementation | Purpose |
|---------|---------------|---------|
| Semantic Embeddings | BAAI/bge-large-en-v1.5 (1024-d) | Capture semantic meaning |
| Two-Pass Retrieval | Probe → Score → Deep Retrieve | Efficient multi-collection search |
| Hybrid Search | Vector + BM25 + RRF | Balance recall and precision |
| Cross-Encoder Reranking | ms-marco-MiniLM-L-6-v2 | Improve ranking precision |
| Query Rewriting | LLM-based | Optimize retrieval queries |
| Topic Detection | Confidence-based | Maintain conversation coherence |
| SQL Intent Routing | Pattern-based routing | Direct analytical answers |

---

## 4. Technology Stack

### Backend Architecture

| Layer | Technology | Purpose |
|------|-----------|---------|
| API | FastAPI + Uvicorn | Async API + streaming |
| Vector DB | ChromaDB (persistent) | Semantic indexing |
| Relational DB | PostgreSQL | Logs, analytics, feedback |
| Structured Data | SQLite | Direct analytical queries |
| Cache | In-memory / Redis | Response caching |

### AI / ML Stack

| Component | Technology |
|---------|------------|
| Embeddings | BAAI/bge-large-en-v1.5 |
| Reranker | cross-encoder/ms-marco-MiniLM-L-6-v2 |
| LLM | Ollama (gemma3:27b) / OpenAI |
| Lexical Search | BM25 |
| NLP | spaCy (hallucination checks) |

### Frontend & Infrastructure

| Component | Technology |
|---------|------------|
| UI | Streamlit |
| Deployment | Systemd (Linux) |
| Orchestration | asyncio + threading |

---

## 5. Metrics & Quantitative Results

### Performance Metrics

| Metric | Value | Context |
|------|------|--------|
| Cached Latency | < 100ms | Similarity ≥ 0.8 |
| Uncached Latency | 5–15s | Full pipeline |
| Time-to-First-Token | < 2s | Streaming |
| Precision@15 | ~85% | After reranking |
| Cache Hit Rate | 30–40% | Repetitive queries |

### System Capacity

| Metric | Value |
|------|------|
| Concurrent Sessions | 100 |
| Session Timeout | 24 hours |
| Conversation History | 50 turns/topic |
| Document Cache | 20 docs/topic |
| Response Cache | 1000 entries (1h TTL) |

### Retrieval Configuration

| Parameter | Value | Impact |
|---------|------|--------|
| Initial Retrieval | 30 docs | Recall |
| Final Reranked | 15 docs | Precision |
| Hybrid Alpha | 0.5 | Semantic/lexical balance |
| RRF K | 60 | Score smoothing |

---

## 6. Engineering Challenges & Solutions

### Multi-Collection Retrieval Efficiency

**Problem:** Querying all collections was slow and noisy.

**Solution:** Two-pass adaptive retrieval.

**Result:** 60% reduction in retrieval time.

---

### Semantic vs Keyword Trade-off

**Solution:** Hybrid vector + BM25 with Reciprocal Rank Fusion.

**Result:** 25% improvement in relevance.

---

### Structured Data Queries

**Solution:** Intent-based routing to SQL engine.

**Result:** Instant, hallucination-free analytical answers.

---

### Pipeline Complexity

**Problem:** 500+ line monolithic handler.

**Solution:** Command-pattern refactor into 77 modular files.

---

### Conversation Context Management

**Solution:** Multi-topic session manager with confidence-based topic shifts.

**Result:** Natural, context-aware conversations.

---

## 7. Scalability

| Dimension | Current Capacity | Scaling Path |
|---------|------------------|--------------|
| Concurrent Users | 100 sessions | Redis-backed sessions |
| Knowledge Collections | 4 | Horizontal sharding |
| Documents | Thousands | ChromaDB scaling |
| LLM Inference | Single instance | Load-balanced pool |
| Cache | In-memory | Redis cluster |