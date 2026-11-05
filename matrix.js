// Matrix: a small pictogram guide that walks in once per visit and answers questions
// through the portfolio backend. Backend strings only ever go in via textContent.
(() => {
  'use strict';

  const API = 'https://backendmatrix.up.railway.app/ask';
  const EMAIL = 'abhimattx@gmail.com';
  const MAX_QUESTION = 500;
  const MAX_ANSWER = 8000;
  const TIMEOUT_MS = 30000;
  const BUBBLE_MS = 7000;
  const KEY_HIDDEN = 'matrix-hidden';
  const KEY_ARRIVED = 'matrix-arrived';

  const dock = document.getElementById('matrix-dock');
  const hero = document.getElementById('top');
  if (!dock || !hero) return;

  // sessionStorage throws in some privacy modes; Matrix still works, it just forgets.
  const session = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* not persisted */ } },
  };
  if (session.get(KEY_HIDDEN)) return;

  const btn = document.getElementById('matrix');
  const fig = dock.querySelector('.mx-fig');
  const bubble = dock.querySelector('.matrix-bubble');
  const panel = document.getElementById('matrix-panel');
  const log = panel.querySelector('.matrix-log');
  const form = panel.querySelector('.matrix-form');
  const input = form.querySelector('input');
  const send = form.querySelector('.matrix-send');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let bubbleTimer = 0;
  let busy = false;

  // ------------------------------------------------------------ entrance

  function arrive() {
    const first = !session.get(KEY_ARRIVED);
    session.set(KEY_ARRIVED, '1');
    if (first && !reduced) {
      dock.classList.add('is-walking');
      fig.addEventListener('animationend', function done(e) {
        if (e.target !== fig) return;
        fig.removeEventListener('animationend', done);
        dock.classList.replace('is-walking', 'is-here');
        dock.classList.add('is-waving');
        showBubble();
      });
    } else {
      dock.classList.add('is-here');
      if (first) showBubble();
    }
    dock.hidden = false;
    avoid();
  }

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting || entry.boundingClientRect.top > 0) return;
    io.disconnect();
    arrive();
  });
  io.observe(hero);

  function showBubble() {
    bubble.hidden = false;
    bubbleTimer = setTimeout(hideBubble, BUBBLE_MS);
    avoid();
  }

  function hideBubble() {
    clearTimeout(bubbleTimer);
    bubble.hidden = true;
  }

  // ------------------------------------------- keep clear of header and CTAs

  const overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  const hitsCta = (el) => {
    const r = el.getBoundingClientRect();
    return [...document.querySelectorAll('.mast, a.btn')].some((t) => overlaps(r, t.getBoundingClientRect()));
  };

  function avoid() {
    if (dock.hidden || !panel.hidden) return;
    if (!bubble.hidden && hitsCta(bubble)) hideBubble();
    dock.classList.toggle('is-away', hitsCta(btn));
  }

  let frame = 0;
  const scheduleAvoid = () => {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; avoid(); });
  };
  addEventListener('scroll', scheduleAvoid, { passive: true });
  addEventListener('resize', scheduleAvoid);

  // --------------------------------------------------------------- panel

  function openPanel() {
    hideBubble();
    dock.classList.remove('is-away');
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function closePanel() {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
    avoid();
  }

  btn.addEventListener('click', () => (panel.hidden ? openPanel() : closePanel()));
  bubble.addEventListener('click', openPanel);
  panel.querySelector('.matrix-close').addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
  });

  dock.querySelector('.matrix-hide').addEventListener('click', () => {
    session.set(KEY_HIDDEN, '1');
    hideBubble();
    dock.hidden = true;
  });

  // ----------------------------------------------------------------- chat

  function entry(who, cls) {
    const li = document.createElement('li');
    li.className = cls;
    const label = document.createElement('span');
    label.className = 'matrix-who';
    label.textContent = who;
    li.append(label);
    log.append(li);
    return li;
  }

  function say(who, cls, text) {
    const p = document.createElement('p');
    p.textContent = text;
    entry(who, cls).append(p);
    log.scrollTop = log.scrollHeight;
  }

  function sayError() {
    const p = document.createElement('p');
    const mail = document.createElement('a');
    mail.href = `mailto:${EMAIL}`;
    mail.textContent = EMAIL;
    p.append("Matrix can't reach the server right now. Email ", mail, ' instead.');
    entry('Matrix', 'matrix-a').append(p);
    log.scrollTop = log.scrollHeight;
  }

  function showWaiting() {
    const li = entry('Matrix', 'matrix-a matrix-wait');
    const slots = document.createElement('span');
    slots.className = 'matrix-slots';
    slots.setAttribute('aria-hidden', 'true');
    slots.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
    const text = document.createElement('span');
    text.textContent = 'Looking it up';
    li.append(slots, text);
    log.scrollTop = log.scrollHeight;
    return li;
  }

  async function ask(question) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, type: 'general' }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const answer = typeof data?.answer === 'string' ? data.answer.trim() : '';
      if (!answer) throw new Error('empty answer');
      return answer.slice(0, MAX_ANSWER);
    } finally {
      clearTimeout(timer);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = input.value.trim().slice(0, MAX_QUESTION);
    if (!question || busy) return;
    busy = true;
    send.disabled = true;
    input.value = '';
    say('You', 'matrix-q', question);
    const waiting = showWaiting();
    log.setAttribute('aria-busy', 'true');
    let answer = null;
    try {
      answer = await ask(question);
    } catch {
      answer = null; // shown to the visitor as the email fallback below
    }
    waiting.remove();
    log.setAttribute('aria-busy', 'false');
    busy = false;
    send.disabled = false;
    if (answer) say('Matrix', 'matrix-a', answer);
    else sayError();
  });
})();
