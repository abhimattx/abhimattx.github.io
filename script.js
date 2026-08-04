/* abhimattx.github.io
   builds the page from data/systems.json.

   two rules that matter here:
   1. nothing from the network is ever assigned to innerHTML. every string
      that came from outside this file goes in via textContent. that's the
      whole xss story, and it's why there's no markdown parser anymore.
   2. bars are real block characters, not divs pretending to be bars. the
      widths line up because the font is fixed-width, which is the point. */

'use strict';

const API_URL = 'https://backendmatrix.up.railway.app/ask';
const REQUEST_TIMEOUT_MS = 30000;
const MAX_ANSWER_CHARS = 8000;
const BAR_CELLS_WIDE = 24;
const BAR_CELLS_NARROW = 15;
const NARROW_QUERY = '(max-width: 620px)';

/* ------------------------------------------------------------ dom helpers */

/** Make an element. Text always goes in as a text node, never as markup. */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function appendAll(parent, children) {
  children.filter(Boolean).forEach(child => parent.appendChild(child));
  return parent;
}

/* ------------------------------------------------------------------ bars */

const EIGHTHS = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉'];
const FULL = '█';

/** Render a value as block characters, to one-eighth-cell resolution. */
function barString(value, max, cells) {
  if (!(max > 0) || !(value > 0)) return '';
  const eighths = Math.round((value / max) * cells * 8);
  const full = Math.floor(eighths / 8);
  const rest = eighths % 8;
  const out = FULL.repeat(full) + EIGHTHS[rest];
  // a real but tiny value should still be visible as something.
  return out === '' ? EIGHTHS[1] : out;
}

function barCells() {
  return window.matchMedia(NARROW_QUERY).matches ? BAR_CELLS_NARROW : BAR_CELLS_WIDE;
}

/** Repaint every bar on the page from its own data attributes. */
function layoutBars() {
  const cells = barCells();
  document.querySelectorAll('.bar-fill[data-v]').forEach(fill => {
    fill.textContent = barString(Number(fill.dataset.v), Number(fill.dataset.max), cells);
  });
}

/** One labelled bar row. */
function barRow(label, value, max, isHighlight) {
  const row = el('div', 'bar' + (isHighlight ? ' bar--hi' : ''));
  const fill = el('span', 'bar-fill');
  fill.dataset.v = value;
  fill.dataset.max = max;
  fill.textContent = barString(value, max, barCells());
  return appendAll(row, [
    el('span', 'bar-label', label),
    fill,
    el('span', 'bar-val', value)
  ]);
}

/* ---------------------------------------------------------------- blocks */

function blockCaption(title, unit) {
  return appendAll(el('figcaption', 'block-cap'), [
    el('span', 'block-title', title),
    unit ? el('span', 'block-unit', unit) : null
  ]);
}

function barBlock(spec) {
  const max = Math.max.apply(null, spec.rows.map(r => Number(r.value) || 0));

  const bars = el('div', 'bars');
  bars.setAttribute('role', 'img');
  bars.setAttribute('aria-label', spec.title + '. ' + spec.rows
    .map(r => r.label + ': ' + r.value + ' ' + (spec.unit || ''))
    .join('; '));

  // which row matters is a judgement about the data, so the data says so.
  // guessing (smallest wins? largest?) gets it wrong on distributions.
  spec.rows.forEach(r => {
    bars.appendChild(barRow(r.label, Number(r.value) || 0, max, r.hi === true));
  });

  return appendAll(el('figure', 'block'), [blockCaption(spec.title, spec.unit), bars]);
}

/** A pipeline prints like `tree`: each stage hangs off the one above it. */
function pipeBlock(spec) {
  const pipe = el('div', 'pipe');
  const last = spec.steps.length - 1;

  spec.steps.forEach((step, i) => {
    pipe.appendChild(appendAll(el('div', 'pipe-row'), [
      el('span', 'pipe-tree', i === last ? '└─' : '├─'),
      el('span', 'pipe-label', step.label),
      el('span', 'pipe-val', step.value)
    ]));
  });

  return appendAll(el('figure', 'block'), [blockCaption(spec.title, spec.unit), pipe]);
}

function tableBlock(spec) {
  const table = el('table', 'tbl' + (spec.cols.length > 2 ? ' tbl--wide' : ''));

  const headRow = el('tr');
  spec.cols.forEach(c => headRow.appendChild(el('th', null, c)));
  table.appendChild(appendAll(el('thead'), [headRow]));

  const body = el('tbody');
  spec.rows.forEach(cells => {
    const tr = el('tr');
    cells.forEach(c => tr.appendChild(el('td', null, c)));
    body.appendChild(tr);
  });
  table.appendChild(body);

  return appendAll(el('figure', 'block'), [blockCaption(spec.title), table]);
}

/* ----------------------------------------------------------------- entry */

function fieldLabel(text) { return el('p', 'field', text); }

function bulletList(items, modifier) {
  const ul = el('ul', 'list' + (modifier ? ' ' + modifier : ''));
  items.forEach(item => ul.appendChild(el('li', null, item)));
  return ul;
}

function challengeBlock(challenge) {
  return appendAll(el('div', 'broke'), [
    el('h4', 'broke-t', challenge.title),
    el('p', 'broke-p', challenge.problem),
    el('p', 'broke-s', challenge.solution)
  ]);
}

function stackRows(stack, keyTag, valueTag) {
  const rows = [];
  Object.keys(stack).forEach(group => {
    const chips = el('ul', 'chips');
    stack[group].forEach(item => chips.appendChild(el('li', null, item)));
    rows.push(appendAll(el('div', 'stack-row'), [
      el(keyTag, 'stack-k', group),
      appendAll(el(valueTag, 'stack-v'), [chips])
    ]));
  });
  return rows;
}

function entryHead(system) {
  const when = appendAll(el('span', 'entry-when'), [
    el('span', null, system.year),
    el('span', 'sep', '·'),
    el('span', 'entry-status', system.status)
  ]);

  return appendAll(el('summary', 'entry-head'), [
    el('span', 'entry-marker', '▸'),
    el('span', 'entry-title', system.title),
    when,
    el('span', 'entry-sub', system.subtitle)
  ]);
}

function entryBody(system) {
  const parts = [];

  parts.push(fieldLabel('the situation'));
  parts.push(el('p', null, system.problem));

  parts.push(fieldLabel('constraints'));
  parts.push(bulletList(system.constraints));

  parts.push(fieldLabel('what I did'));
  parts.push(el('p', null, system.approach));

  if (system.disclosure) parts.push(el('p', 'disclosure', system.disclosure));

  (system.bars || []).forEach(spec => parts.push(barBlock(spec)));
  (system.pipeline || []).forEach(spec => parts.push(pipeBlock(spec)));
  (system.tables || []).forEach(spec => parts.push(tableBlock(spec)));

  parts.push(fieldLabel('what changed'));
  parts.push(bulletList(system.outcomes, 'list--ok'));

  if (system.challenges && system.challenges.length) {
    parts.push(fieldLabel('what broke on the way'));
    system.challenges.forEach(c => parts.push(challengeBlock(c)));
  }

  if (system.stack) {
    parts.push(fieldLabel('built with'));
    stackRows(system.stack, 'span', 'div').forEach(row => parts.push(row));
  }

  return appendAll(el('div', 'entry-body'), parts);
}

function renderSystems(systems) {
  const mount = document.getElementById('systems');
  if (!mount) return;

  systems.forEach((system, i) => {
    const entry = el('details', 'entry');
    entry.id = system.id;
    if (i === 0) entry.open = true;   // the first one is already unfolded.

    const head = entryHead(system);
    const marker = head.querySelector('.entry-marker');

    entry.appendChild(head);
    entry.appendChild(entryBody(system));

    // the marker is a tree glyph, so it has to flip by hand.
    entry.addEventListener('toggle', () => {
      marker.textContent = entry.open ? '▾' : '▸';
    });
    if (entry.open) marker.textContent = '▾';

    mount.appendChild(entry);
  });

  const count = document.getElementById('work-count');
  if (count) {
    count.textContent = systems.length + (systems.length === 1 ? ' system' : ' systems');
  }
}

function renderPrinciples(principles) {
  const mount = document.getElementById('principles');
  if (!mount) return;
  principles.forEach(p => {
    mount.appendChild(appendAll(el('li', 'principle'), [
      el('h3', 'principle-t', p.title),
      el('p', 'principle-b', p.body)
    ]));
  });
}

function renderStack(stack) {
  const mount = document.getElementById('stack-list');
  if (!mount) return;
  stackRows(stack, 'dt', 'dd').forEach(row => mount.appendChild(row));
}

function renderChangelog(entries) {
  const mount = document.getElementById('changelog');
  if (!mount) return;
  entries.forEach(entry => {
    const time = el('time', null, entry.date);
    time.setAttribute('datetime', entry.date);
    mount.appendChild(appendAll(el('li'), [time, el('span', null, entry.note)]));
  });
}

/* ------------------------------------------------------------------ data */

async function loadPage() {
  let data;

  try {
    const response = await fetch('./data/systems.json');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    data = await response.json();
  } catch (error) {
    const mount = document.getElementById('systems');
    if (mount) {
      mount.appendChild(el('p', 'err',
        "Couldn't load data/systems.json, so the writeups are missing. " +
        'Everything in them is in that file if you want to read it directly.'));
    }
    console.error('systems.json failed to load:', error);
    return;
  }

  if (Array.isArray(data.systems)) renderSystems(data.systems);
  if (Array.isArray(data.principles)) renderPrinciples(data.principles);
  if (data.stack) renderStack(data.stack);
  if (Array.isArray(data.changelog)) renderChangelog(data.changelog);

  layoutBars();
}

/* ------------------------------------------------------------------- ask */

async function askAPI(question) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question, type: 'general' }),
      signal: controller.signal
    });

    if (!response.ok) throw new Error('HTTP ' + response.status);

    const payload = await response.json();
    if (typeof payload.answer !== 'string') throw new Error('no answer field in response');
    return payload.answer.slice(0, MAX_ANSWER_CHARS);
  } finally {
    clearTimeout(timer);
  }
}

function initAsk() {
  const form = document.getElementById('ask-form');
  const input = document.getElementById('ask-input');
  const out = document.getElementById('ask-out');
  if (!form || !input || !out) return;

  const button = form.querySelector('.repl-go');
  let pending = false;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;

    const question = input.value.trim();
    if (!question) return;

    pending = true;
    button.disabled = true;

    out.textContent = '';
    out.appendChild(el('p', 'echo', question));
    const status = el('p', 'wait', 'thinking…');
    out.appendChild(status);

    try {
      const answer = await askAPI(question);
      // textContent, deliberately. this string is untrusted input.
      status.replaceWith(el('p', 'answer', answer));
      input.value = '';
    } catch (error) {
      const timedOut = error && error.name === 'AbortError';
      status.replaceWith(el('p', 'err', timedOut
        ? 'That took over 30 seconds, so I gave up on it. The service sleeps when idle — try once more.'
        : "The service didn't answer. It's a free Railway box, so this happens. Email me instead: abhimattx@gmail.com"));
      console.error('ask failed:', error);
    } finally {
      pending = false;
      button.disabled = false;
    }
  });
}

/* ------------------------------------------------------------------ init */

document.addEventListener('DOMContentLoaded', () => {
  // the hero bars are in the HTML, not fetched. paint them before anything
  // that can fail on the network, so the lede still makes its argument.
  layoutBars();
  loadPage();
  initAsk();

  // repaint bars when the breakpoint flips, without collapsing open entries.
  const narrow = window.matchMedia(NARROW_QUERY);
  if (narrow.addEventListener) narrow.addEventListener('change', layoutBars);
  else if (narrow.addListener) narrow.addListener(layoutBars);
});
