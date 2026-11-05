# Matrix: AI avatar guide for the portfolio

Date: 2026-11-05. Status: approved in conversation; builder check skipped at the user's request ("write the doc and start the loop").

## Intent

The portfolio (Isotype / pictorial-statistics redesign, see `PRODUCT.md`, `DESIGN.md`, `.impeccable/surfaces/index-html.md`) lost its "ask my AI" box during the redesign. Matrix brings it back as a small, cute character instead of a generic chat popup. A recruiter or hiring manager should notice it, smile, and be able to ask it about Abhishek and his work, without it ever getting in the way of the page itself.

## Goals

- A small animated character named **Matrix**, fixed in the **bottom-right corner**.
- Entrance: it **walks in** from the right edge, stops in the corner, **waves**, and a speech bubble says **"Hey, you want some help?"**.
- It walks in **once per visit**, after the visitor scrolls past the hero (`#top`). Before that it is not shown.
- After the wave it stands **idle** (small blink or bob). The bubble hides after a few seconds or when dismissed.
- Clicking Matrix or the bubble opens a **small chat panel anchored to the corner** (not full screen on desktop, not a modal that blocks the page).
- The chat sends the visitor's question to the existing backend and shows the answer:
  - `POST https://backendmatrix.up.railway.app/ask` with JSON `{ "question": "<text>", "type": "general" }`
  - Response JSON `{ "answer": "<text>" }`
  - The backend's knowledge will be rewritten later by the user; the site only sends and displays.

## Look

- Drawn in the site's own world: a flat Isotype/Gerd-Arntz-style pictogram person, using the `DESIGN.md` palette (ink #141414, blue #2c5da8, red #c8352a, paper #fff). Flat fills, no outlines, no gradients, no glow, no shadows, no 3D, no anime.
- Cute: round head, friendly face (simple eyes), optional small antenna as the "AI" cue.
- Poses needed: walk cycle, wave, idle. Authored inline SVG (icon-scale, a few parts animated with CSS transforms) is acceptable for a pictogram character.
- Size: about 64px tall on desktop, about 52px on phones. The chat panel uses the site's type (Jost), caps labels, ruled lines, square corners, per `DESIGN.md`.

## Non-goals

- No voice, no speech synthesis, no 3D, no Lottie or other new dependency.
- No chat history persistence across visits.
- No change to backend code or its knowledge documents.
- No changes to the rest of the page's design.

## Anti-goals (failure even if it technically works)

- Covers the charts, body text, or any "Hire me" button at any viewport (1440, 1024, 768, 390 wide).
- Looks like a generic chatbot widget (round blue bubble with a chat icon) or a glossy mascot that clashes with the flat Isotype style.
- Animates for visitors with `prefers-reduced-motion: reduce`.
- Walks in again every scroll, or nags.

## Constraints

- Static site: plain HTML, CSS, JS. No framework, no build step, no new dependencies.
- Strings from the backend go in via `textContent`, never `innerHTML` (existing rule in `script.js`).
- Keep JS small and readable; it may live in a new `matrix.js` loaded with `defer`, plus styles in `style.css` (or a `matrix.css`), cache-busted like the existing files (`?v=`).
- Accessibility: Matrix is a real `<button>` with accessible name containing "Matrix"; panel has a heading, a labelled input, and a close button; Escape closes the panel and returns focus to Matrix; answers announced via `aria-live="polite"`.
- Reduced motion: Matrix appears already standing in the corner (no walk, no wave motion); the bubble still shows.
- Dismiss: a close control hides Matrix for the rest of the visit (`sessionStorage`).
- Errors: request timeout ~30s; on failure show a friendly message that names the recovery, e.g. "Matrix can't reach the server right now. Email abhimattx@gmail.com instead." Empty input does not send. Input max 500 chars. Very long answers are capped (8000 chars).

## Decided by the user

- Name Matrix; walking + waving entrance; bubble text "Hey, you want some help?"; small; corner; chat about Abhishek and his work through the backend; built with the worker/driver loop using the impeccable skill for design.

## My calls (assistant), not explicitly confirmed

- Bottom-right corner; appears after scrolling past the hero; walks in once per visit.
- Flat pictogram look with antenna; ~64px / ~52px sizes.
- `type: "general"` in the request body.
- Panel anchored to the corner (on phones it may take the bottom of the screen width, but not cover the whole page).

## Left to the builder

- Exact SVG drawing, animation timing, idle motion, bubble timing.
- Panel layout and copy beyond the fixed strings above (suggested starter prompts are optional).
- File split (`matrix.js` vs `script.js`).

## Acceptance criteria (used by the loop's driver)

1. A `<button id="matrix">` (accessible name contains "Matrix") is fixed in the bottom-right corner and is hidden until the visitor scrolls past `#top`; then it walks in once, waves, and shows a bubble with the exact text "Hey, you want some help?".
2. With reduced motion it appears without walk/wave animation (no running CSS animations on Matrix elements).
3. Clicking Matrix opens a panel `#matrix-panel` with a heading, a labelled text input, a send button and a close button; Escape and the close button close it and focus returns to `#matrix`.
4. Submitting a question POSTs `{question, type: "general"}` to `https://backendmatrix.up.railway.app/ask`, shows a loading state, then shows the answer text inserted via `textContent`.
5. A failed or timed-out request shows a friendly error naming the email fallback; empty input does not send.
6. Matrix and its bubble never overlap the hero "Hire me" button, the header, or chart content at 1440x900, 768x1024 and 390x844 (closed state).
7. A dismiss control hides Matrix for the session.
8. Visual style follows `DESIGN.md`: flat fills from the palette, Jost, square corners, no gradients/glow/shadows; the impeccable design detector reports no new findings on the changed files.
9. No console errors; `node --check` passes on all JS files; no new dependencies.
