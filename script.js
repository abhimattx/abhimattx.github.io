/* abhimattx.github.io
   builds the work, method and kit sections from data/systems.json.

   one rule that matters: nothing from the network is ever assigned to
   innerHTML. every string from outside this file goes in via textContent. */

'use strict';

const SVG_NS = 'http://www.w3.org/2000/svg';
const ICONS = ['plus', 'clock', 'ticket', 'photo', 'plan', 'doc', 'answer', 'bolt', 'table'];
const ROW_TONES = ['blue', 'ochre', 'green'];
const GRID_CELLS = 100;
const GRID_STEP_MS = 1100;
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/** One flat pictogram from the sprite in index.html. Unknown names fall back to a document. */
function pictogram(icon, tone, isHalf) {
  const name = ICONS.includes(icon) ? icon : 'doc';
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'pg pg--' + tone + (isHalf ? ' pg--half' : ''));
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', '#i-' + name);
  svg.appendChild(use);
  return svg;
}

/* ---------------------------------------------------------------- charts */

/** A labelled row of identical pictograms; count may end in .5. */
function isoRow(label, count, icon, tone, total, slots) {
  const row = el('div', 'iso-row');
  row.setAttribute('role', 'img');
  row.setAttribute('aria-label', label + ': ' + total);

  const icons = el('span', 'iso-icons count');
  icons.style.setProperty('--n', String(slots));
  const whole = Math.floor(count);
  for (let i = 0; i < whole; i++) icons.appendChild(pictogram(icon, tone, false));
  if (count - whole >= 0.5) icons.appendChild(pictogram(icon, tone, true));
  [...icons.children].forEach((node, i) => node.style.setProperty('--i', String(i)));

  return appendAll(row, [
    el('span', 'iso-label', label),
    icons,
    el('span', 'iso-total' + (tone === 'red' ? ' iso-total--hi' : ''), total),
  ]);
}

function chartFrame(title, key) {
  const fig = el('figure', 'iso');
  fig.appendChild(el('h4', 'iso-title', title));
  return { fig, caption: key ? el('figcaption', 'iso-key', key) : null };
}

/** Category rows, one pictogram per `per` units. */
function rowsChart(spec) {
  const per = Number(spec.per) > 0 ? Number(spec.per) : 1;
  const rows = Array.isArray(spec.rows) ? spec.rows : [];
  const slots = Math.max(...rows.map(r => Math.ceil(Number(r.value) / per)), 1);
  const suffix = String(spec.unit || '').startsWith('%') ? '%' : '';
  const { fig, caption } = chartFrame(spec.title, spec.key);

  let toneIndex = 0;
  rows.forEach(row => {
    const tone = row.hi ? 'red' : ROW_TONES[toneIndex++ % ROW_TONES.length];
    const count = Math.round((Number(row.value) / per) * 2) / 2;
    fig.appendChild(isoRow(row.label, count, row.icon || spec.icon, tone, row.value + suffix, slots));
  });
  return appendAll(fig, [caption]);
}

/** Indexed 10x10 grid with a control per row: the signature recount. */
function gridChart(spec) {
  const rows = Array.isArray(spec.rows) ? spec.rows : [];
  const { fig, caption } = chartFrame(spec.title, spec.key);
  fig.classList.add('iso--grid');

  const controls = el('div', 'grid-controls');
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Show ' + spec.title);

  const grid = el('div', 'grid count');
  grid.setAttribute('role', 'img');
  for (let i = 0; i < GRID_CELLS; i++) {
    const cell = el('span', 'grid-cell');
    cell.style.setProperty('--i', String(i));
    grid.appendChild(cell);
  }
  const readout = el('p', 'grid-readout');
  readout.setAttribute('aria-live', 'polite');

  const buttons = rows.map((row, index) => {
    const button = el('button', 'grid-btn', row.label);
    button.type = 'button';
    button.addEventListener('click', () => {
      fig.dataset.touched = 'true';
      show(index);
    });
    controls.appendChild(button);
    return button;
  });

  function show(index) {
    const row = rows[index];
    const value = Math.max(0, Math.min(GRID_CELLS, Number(row.value)));
    [...grid.children].forEach((cell, i) => {
      cell.classList.toggle('is-on', i < value);
      cell.classList.toggle('is-hi', i < value && Boolean(row.hi));
    });
    buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
    grid.setAttribute('aria-label', row.label + ': ' + value + ' of ' + GRID_CELLS);
    readout.textContent = '';
    appendAll(readout, [el('b', null, String(value)), document.createTextNode(' ' + row.label)]);
  }

  // Start on the baseline; once the grid scrolls into view, step through to the last row.
  show(0);
  fig.addEventListener('iso:in', () => {
    if (REDUCED_MOTION) { show(rows.length - 1); return; }
    rows.forEach((_, i) => {
      if (i === 0) return;
      setTimeout(() => { if (!fig.dataset.touched) show(i); }, i * GRID_STEP_MS);
    });
  }, { once: true });

  return appendAll(fig, [controls, grid, readout, caption]);
}

/** Pipeline: counted rows when it has an icon, otherwise a numbered strip. */
function pipelineChart(spec) {
  const steps = Array.isArray(spec.steps) ? spec.steps : [];
  if (spec.icon) {
    const slots = Math.max(...steps.map(s => Number(s.value)), 1);
    const { fig, caption } = chartFrame(spec.title, spec.key);
    fig.classList.add('iso--funnel');
    steps.forEach((step, i) => {
      const tone = i === steps.length - 1 ? 'red' : 'blue';
      fig.appendChild(isoRow(step.label, Number(step.value), spec.icon, tone, String(step.value), slots));
    });
    return appendAll(fig, [caption]);
  }

  const { fig } = chartFrame(spec.title, null);
  const list = el('ol', 'strip');
  steps.forEach((step, i) => {
    const item = el('li', 'strip-step' + (i === steps.length - 1 ? ' strip-step--hi' : ''));
    appendAll(item, [el('span', 'strip-val', step.value), el('span', 'strip-label', step.label)]);
    list.appendChild(item);
  });
  return appendAll(fig, [list]);
}

/* ------------------------------------------------------------- tables */

function dataTable(spec) {
  const wrap = el('div', 'table-wrap');
  const table = el('table', 'data');
  table.appendChild(el('caption', null, spec.title));
  const head = el('tr');
  (spec.cols || []).forEach(col => head.appendChild(el('th', null, col)));
  appendAll(table, [appendAll(el('thead'), [head])]);
  const body = el('tbody');
  (spec.rows || []).forEach(row => {
    const tr = el('tr');
    row.forEach((cell, i) => tr.appendChild(el(i === 0 ? 'th' : 'td', null, cell)));
    if (tr.firstChild) tr.firstChild.setAttribute('scope', 'row');
    body.appendChild(tr);
  });
  table.appendChild(body);
  wrap.appendChild(table);
  return wrap;
}

function stackRows(stack) {
  const list = el('dl', 'kit kit--small');
  Object.entries(stack || {}).forEach(([group, items]) => {
    appendAll(list, [appendAll(el('div', 'kit-row'), [el('dt', null, group), el('dd', null, items.join(' · '))])]);
  });
  return list;
}

/* --------------------------------------------------------------- systems */

function systemHead(system) {
  const head = el('header', 'sys-head');
  const meta = [system.year, system.status].filter(Boolean).join(' · ');
  return appendAll(head, [
    el('h3', 'sys-title', system.title),
    system.subtitle ? el('p', 'sys-sub', system.subtitle) : null,
    meta ? el('p', 'sys-meta', meta) : null,
    system.summary ? el('p', 'sys-summary', system.summary) : null,
  ]);
}

function systemCharts(system) {
  const charts = el('div', 'sys-charts');
  (system.bars || []).filter(b => !b.hero).forEach(bar => {
    charts.appendChild(bar.type === 'grid' ? gridChart(bar) : rowsChart(bar));
  });
  (system.pipeline || []).filter(p => p.icon).forEach(p => charts.appendChild(pipelineChart(p)));
  return charts;
}

function systemDrawer(system) {
  const drawer = el('details', 'drawer');
  const summary = el('summary', null, 'How it works, and what broke');
  summary.appendChild(pictogram('plus', 'ink', false));
  drawer.appendChild(summary);
  const body = el('div', 'drawer-body');

  if (system.problem) appendAll(body, [el('h4', null, 'The problem'), el('p', null, system.problem)]);
  if (Array.isArray(system.constraints) && system.constraints.length) {
    const list = el('ul', 'ticks');
    system.constraints.forEach(c => list.appendChild(el('li', null, c)));
    appendAll(body, [el('h4', null, 'Constraints'), list]);
  }
  if (system.approach) appendAll(body, [el('h4', null, 'Approach'), el('p', null, system.approach)]);
  (system.pipeline || []).filter(p => !p.icon).forEach(p => body.appendChild(pipelineChart(p)));
  if (Array.isArray(system.challenges) && system.challenges.length) {
    body.appendChild(el('h4', null, 'What broke, and the fix'));
    const list = el('dl', 'fixes');
    system.challenges.forEach(c => appendAll(list, [
      el('dt', null, c.title),
      appendAll(el('dd'), [el('p', null, c.problem), el('p', 'fix', c.solution)]),
    ]));
    body.appendChild(list);
  }
  (system.tables || []).forEach(t => body.appendChild(dataTable(t)));
  if (system.stack) appendAll(body, [el('h4', null, 'Built with'), stackRows(system.stack)]);

  drawer.appendChild(body);
  return drawer;
}

function renderSystems(systems) {
  const mount = document.getElementById('systems');
  mount.textContent = '';
  systems.forEach(system => {
    const article = el('article', 'sys');
    article.id = system.id;
    appendAll(article, [
      systemHead(system),
      system.disclosure ? el('p', 'sys-note', system.disclosure) : null,
      systemCharts(system),
      systemDrawer(system),
    ]);
    mount.appendChild(article);
  });
}

/* ------------------------------------------------------- method and kit */

function renderPrinciples(principles) {
  const mount = document.getElementById('principles');
  principles.forEach(p => {
    const item = el('li', 'principle');
    appendAll(item, [el('h3', 'principle-h', p.title), el('p', null, p.body)]);
    mount.appendChild(item);
  });
}

function renderStack(stack) {
  const mount = document.getElementById('stack-list');
  Object.entries(stack).forEach(([group, items]) => {
    appendAll(mount, [appendAll(el('div', 'kit-row'), [el('dt', null, group), el('dd', null, items.join(' · '))])]);
  });
}

/* ---------------------------------------------------------------- motion */

/** Count each pictogram row in once, as it reaches the viewport. */
function countIn() {
  const targets = document.querySelectorAll('.count, .iso');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(t => t.dispatchEvent(new Event('iso:in')));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      entry.target.dispatchEvent(new Event('iso:in'));
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  targets.forEach(t => observer.observe(t));
}

/* ------------------------------------------------------------------ data */

async function loadPage() {
  let data;
  try {
    const response = await fetch('./data/systems.json');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    data = await response.json();
  } catch (error) {
    const state = document.getElementById('systems-state');
    if (state) {
      state.textContent = "Couldn't load the work section. Reload the page, or read data/systems.json directly.";
      state.classList.add('state--err');
    }
    console.error('systems.json failed to load:', error);
    return;
  }

  if (Array.isArray(data.systems)) renderSystems(data.systems);
  if (Array.isArray(data.principles)) renderPrinciples(data.principles);
  if (data.stack) renderStack(data.stack);
  countIn();
}

document.addEventListener('DOMContentLoaded', loadPage);
