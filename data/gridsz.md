# Gridsz Automation: AI-Powered Ticket Management System

**Also known as:** gridsz, ticket automation, field service automation, fiber automation, ticket management

---

## Summary

**Gridsz Automation** is a production-grade AI system that fully automates ticket management for field service operations. By replacing brittle CSS selectors with **intent-based AI detection** using local LLMs (Ollama) and **YOLO11 image classification**, it achieves **98.5% automation success** and reduces administrative work by **85%** (from 2-3 hours to 15 minutes daily).

---

## 1. Project Overview

**Gridsz Automation** is an intelligent end-to-end automation system that autonomously downloads, classifies, and manages service tickets from a web-based task management platform. Unlike traditional web scrapers that rely on brittle CSS selectors or XPath, this system leverages **local Large Language Models (LLMs)** to dynamically identify and interact with UI elements, making it resilient to frequent UI changes.

### Real-World Problem Solved

Field technicians working on fiber network installations receive dozens of daily work orders through the Gridsz platform. Manually downloading tickets, organizing attachments (photos, diagrams, documents), and tracking status changes consumed **2–3 hours of administrative work per day**.

This system fully automates that workflow, ensuring technicians have all required documentation **downloaded, classified, and organized** before arriving on-site.

---

## 2. Organizational Impact

| Impact Area | Before Automation | After Automation |
|-----------|------------------|------------------|
| Daily Admin Time | 2–3 hours manual work | ~15 min oversight |
| Ticket Processing | 10–15 tickets/day | 50+ tickets/hour |
| File Organization | Inconsistent, error-prone | Standardized folder structure |
| Status Tracking | Manual checking | Automatic refresh & alerts |
| Data Freshness | Checked 1–2× daily | Hourly sync during work hours |

### Key Benefits

- **85% reduction** in manual ticket management time
- **Zero missed attachments** – every file captured and classified
- **Consistent folder structure** – address-based organization
- **Proactive cleanup** – completed tickets auto-archived after 7 days
- **Real-time visibility** – live dashboard with progress and status

---

## 3. AI & Intelligence

### 3.1 AI-Powered Element Detection (Local LLM)

#### Why AI Instead of Traditional Selectors?

Traditional automation relies on hardcoded CSS selectors or XPath expressions. Any UI change (renamed class, moved button, added wrapper) breaks automation—creating a high maintenance burden.

#### The AI Approach

```
User Intent → DOM Snapshot → LLM Analysis → Selector Proposals → Validation
```

| Component | Technology | Purpose |
|---------|-----------|---------|
| LLM Engine | Ollama (llama3.2) | Local inference, no API costs |
| DOM Snapshot | Custom extractor | Reduces page to ~20 candidates |
| Intent System | 48 intent templates | login_button, status_dropdown, download_button |
| Selector Cache | In-memory + TTL | 70–80% hit rate, fewer LLM calls |

#### How It Works

1. System identifies the intent (e.g., *find status dropdown*)
2. DOM snapshot extracts relevant elements only
3. LLM receives ~2KB of context (instead of 200KB DOM)
4. LLM proposes 1–4 selector candidates with confidence scores
5. Validator tests selectors against live page
6. Successful selectors cached for 60 minutes

#### Example LLM Output

```json
{
  "selector_proposals": [
    "[data-testid='status-btn']",
    "button.status-update-trigger",
    "//button[contains(text(),'Status')]"
  ],
  "confidence": 0.92,
  "reasoning_short": "Found button with status-related text"
}
```

---

### 3.2 AI Image Classification (YOLO11)

Downloaded tickets often contain mixed attachments. A **custom-trained YOLO11 model** automatically classifies images.

| Category | Description | Action |
|--------|------------|--------|
| FTU | Fiber Terminal Unit photos | Prioritized for field techs |
| Drawing | Floor plans, diagrams | Stored in /drawings |
| Other | Misc images | Archived |

**Location Detection:** For FTU images, installation location (garage, closet, living room, outside) is detected with a **60%+ confidence threshold**.

---

### 3.3 Why AI Was Necessary

| Requirement | Traditional Approach | AI-Powered Approach |
|------------|---------------------|--------------------|
| UI Changes | Breaks automation | Self-adapts via LLM |
| New Elements | Manual selectors | Intent-based discovery |
| Image Sorting | Manual | Automatic classification |
| Maintenance | High | Low |

---

## 4. Technology Stack

### Backend

| Technology | Purpose |
|----------|--------|
| Python 3.11+ | Core automation |
| FastAPI | REST + WebSocket server |
| Playwright | Async browser automation |
| SQLite (WAL) | Ticket persistence & dedup |
| Ollama | Local LLM inference |
| YOLO11 | Image classification |

### Frontend

| Technology | Purpose |
|----------|--------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Vite | Build tooling |
| WebSocket | Real-time updates |

### Infrastructure

| Technology | Purpose |
|----------|--------|
| Systemd | Scheduling & restarts |
| Chrome Extension | Optional integration |
| Linux Server | Production deployment |

---

## 5. Metrics & Quantitative Results

### Performance Metrics

| Metric | Value | Notes |
|------|------|------|
| Selector Cache Hit Rate | 70–80% | Fewer LLM calls |
| LLM Latency | 1–2s/element | Local inference |
| Image Accuracy | 87% | FTU vs Drawing |
| Ticket Rate | 50–100/hour | Attachment dependent |
| Automation Success | 98.5% | Auto-retry logic |
| System Uptime | 99.9% | Systemd restarts |

### Business Metrics

| Metric | Value |
|------|------|
| Admin Time Saved | 2+ hours/day/user |
| Tickets / Month | 1,500+ |
| Manual Interventions | <5/week |
| Cost Savings | No cloud AI costs |

---

## 6. Engineering Challenges & Solutions

### Dynamic UI Element Detection

**Problem:** Frequent UI changes break selectors.

**Solution:** Intent-based AI selector generation using local LLMs.

**Key Innovation:** DOM snapshot compression from 200KB → ~2KB.

---

### LLM Latency in Automation Loops

**Solution:** Multi-layer selector caching using URL + intent + DOM hash.

**Result:** Element lookup time reduced from **1.5s → 0.3s**.

---

### Unreliable File Downloads

**Solution:**
- Transactional downloads
- SHA256 deduplication
- SQLite persistence
- Exponential backoff retries

---

### Mixed Image Types

**Solution:** Custom YOLO11 model
- 3 main classes
- FTU location detection
- 87% accuracy
- 11MB model size

---

### Real-Time Progress Visibility

**Solution:** WebSocket streaming
- Live progress
- Logs
- Ticket notifications
- Auto-reconnect

---

## 7. Scalability

| Dimension | Current Capacity | Scaling Path |
|---------|------------------|-------------|
| Tickets / Run | 100+ | Parallel browsers |
| Concurrent Users | 10 | Redis sessions |
| Database | 10K+ tickets | PostgreSQL migration |
| LLM Inference | Single GPU | Multi-GPU Ollama |

