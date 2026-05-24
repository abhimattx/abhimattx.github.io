// Mark document as JS-active so CSS reveal animations scope safely (no flash of hidden content without JS)
document.documentElement.classList.add('js');

// ─── Utilities ───────────────────────────────────────────────────────────────

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Escape HTML first, then apply safe markdown transforms.
// Order matters: escaping prevents injected HTML in the source text.
function parseMarkdown(text) {
  return escapeHTML(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

// ─── State ───────────────────────────────────────────────────────────────────

const chartInstances = {};
let systemsData = null;

// ─── API ─────────────────────────────────────────────────────────────────────

const API_URL = 'https://backendmatrix.up.railway.app/ask';

async function askAPI(question, type) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, type })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Something went wrong. Please try again.');
  }

  const data = await response.json();
  return data.answer;
}

// ─── Systems ─────────────────────────────────────────────────────────────────

async function loadSystems() {
  try {
    const response = await fetch('./data/systems.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    systemsData = data;
    renderSystems(data.systems);
  } catch (error) {
    console.error('Failed to load systems data:', error);
  }
}

function renderSystems(systems) {
  const grid = document.getElementById('systems-grid');
  if (!grid) return;

  grid.innerHTML = systems.map(system => {
    const techTagsHTML = system.techStack && typeof system.techStack === 'object' && !Array.isArray(system.techStack)
      ? `<div class="tech-stack-tags">${
          Object.values(system.techStack).flat().slice(0, 6)
            .map(t => `<span class="tech-tag">${escapeHTML(t)}</span>`)
            .join('')
        }</div>`
      : '';

    return `
      <div class="system-card ${system.featured ? 'featured' : ''}" data-id="${escapeHTML(system.id)}" data-category="${escapeHTML(system.category)}">
        ${system.featured ? `<div class="live-indicator"><span class="live-dot"></span>PRODUCTION</div>` : ''}
        <div class="system-card-header">
          <h3 class="system-title">${escapeHTML(system.title)}</h3>
          <span class="category-tag ${escapeHTML(system.category)}">${escapeHTML(system.category.toUpperCase())}</span>
        </div>
        <ul class="system-metrics">
          ${system.metrics.map(m => `<li>${escapeHTML(m)}</li>`).join('')}
        </ul>
        ${techTagsHTML}
        <span class="view-project-hint">Click to view case study</span>
      </div>
    `;
  }).join('');

  initReveal();
}

function initReveal() {
  const cards = document.querySelectorAll('.system-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        entry.target.style.transitionDelay = '';
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
  );

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
    observer.observe(card);
  });
}

// ─── Modal HTML builders ──────────────────────────────────────────────────────

function buildFunnelHTML(funnelData) {
  const maxVal = Math.max(...funnelData.steps.map(s => s.value));
  const stepsHTML = funnelData.steps.map(step => {
    const pct = (step.value / maxVal) * 100;
    return `
      <div class="funnel-step">
        <div class="funnel-bar" style="width: ${pct}%">
          <span class="funnel-value">${escapeHTML(String(step.value))}</span>
        </div>
        <span class="funnel-label">${escapeHTML(step.label)}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="chart-container funnel-container">
      <h4 class="chart-title">${escapeHTML(funnelData.title)}</h4>
      <div class="funnel-chart">${stepsHTML}</div>
    </div>
  `;
}

function buildModalBody(system) {
  const charts     = system.charts || {};
  const barChart   = charts.queryTime || charts.timeSavings;
  const doughnut1  = charts.responseSource || charts.cachePerformance;
  const funnelData = charts.retrievalFunnel || charts.aiPipeline;

  const chartsHTML = system.charts ? `
    <div class="case-study-charts">
      <div class="charts-row">
        ${barChart ? `
          <div class="chart-container">
            <h4 class="chart-title">${escapeHTML(barChart.title)}</h4>
            <canvas id="modal-chart-bar"></canvas>
          </div>
        ` : ''}
        ${doughnut1 ? `
          <div class="chart-container">
            <h4 class="chart-title">${escapeHTML(doughnut1.title)}</h4>
            <canvas id="modal-chart-doughnut1"></canvas>
          </div>
        ` : ''}
        ${charts.imageClassification ? `
          <div class="chart-container">
            <h4 class="chart-title">${escapeHTML(charts.imageClassification.title)}</h4>
            <canvas id="modal-chart-doughnut2"></canvas>
          </div>
        ` : ''}
        ${charts.performance ? `
          <div class="chart-container metrics-container">
            <h4 class="chart-title">${escapeHTML(charts.performance.title)}</h4>
            <div class="metrics-grid">
              ${charts.performance.items.map(item => `
                <div class="metric-item">
                  <span class="metric-value">${escapeHTML(item.value)}</span>
                  <span class="metric-label">${escapeHTML(item.label)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
      ${funnelData ? buildFunnelHTML(funnelData) : ''}
    </div>
  ` : '';

  const challengesHTML = system.challenges ? `
    <div class="case-study-section">
      <h4 class="case-study-section-title">Engineering Challenges</h4>
      <div class="challenges-grid">
        ${system.challenges.map(c => `
          <div class="challenge-card">
            <h5 class="challenge-title">${escapeHTML(c.title)}</h5>
            <p class="challenge-problem">${escapeHTML(c.problem)}</p>
            <p class="challenge-solution">${escapeHTML(c.solution)}</p>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const techStackHTML = system.techStack && typeof system.techStack === 'object' && !Array.isArray(system.techStack) ? `
    <div class="case-study-section">
      <h4 class="case-study-section-title">Tech Stack</h4>
      <div class="tech-stack-detailed">
        ${Object.entries(system.techStack).map(([category, tools]) => `
          <div class="tech-category">
            <span class="tech-category-label">${escapeHTML(category)}</span>
            <span class="tech-category-tools">${escapeHTML(tools.join(', '))}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const apiLatencyHTML = system.apiLatency ? `
    <div class="case-study-section">
      <h4 class="case-study-section-title">API Response Times</h4>
      <div class="api-latency-grid">
        ${system.apiLatency.map(item => `
          <div class="latency-item">
            <span class="latency-endpoint">${escapeHTML(item.endpoint)}</span>
            <span class="latency-value">${escapeHTML(item.latency)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const scalabilityHTML = system.scalability ? `
    <div class="case-study-section">
      <h4 class="case-study-section-title">Scalability</h4>
      <div class="scalability-grid">
        ${system.scalability.map(item => `
          <div class="scalability-item">
            <span class="scalability-dimension">${escapeHTML(item.dimension)}</span>
            <span class="scalability-current">${escapeHTML(item.current)}</span>
            <span class="scalability-path">${escapeHTML(item.path)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  return `
    ${system.subtitle ? `<p class="modal-subtitle">${escapeHTML(system.subtitle)}</p>` : ''}
    ${chartsHTML}
    <div class="case-study-section">
      <h4 class="case-study-section-title">The Problem</h4>
      <p class="case-study-text">${escapeHTML(system.caseStudy.problem)}</p>
    </div>
    <div class="case-study-grid">
      <div class="case-study-column">
        <h4>Constraints</h4>
        <ul>${system.caseStudy.constraints.map(c => `<li>${escapeHTML(c)}</li>`).join('')}</ul>
      </div>
      <div class="case-study-column">
        <h4>Approach</h4>
        <p>${escapeHTML(system.caseStudy.approach)}</p>
      </div>
    </div>
    ${challengesHTML}
    ${techStackHTML}
    ${apiLatencyHTML}
    ${scalabilityHTML}
    <div class="case-study-outcomes">
      <h4>Outcomes</h4>
      <div class="outcomes-list">
        ${system.caseStudy.outcomes.map(o => `
          <div class="outcome-item">
            <span class="outcome-check">&#10003;</span>
            <span>${escapeHTML(o)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function openProjectModal(systemId) {
  if (!systemsData) return;
  const system = systemsData.systems.find(s => s.id === systemId);
  if (!system) return;

  const modal = document.getElementById('project-modal');
  modal.querySelector('.modal-title').textContent = system.title;

  const tag = modal.querySelector('.modal-tag');
  tag.textContent = system.category.toUpperCase();
  tag.className = `modal-tag ${system.category}`;

  modal.querySelector('.modal-body').innerHTML = buildModalBody(system);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  // rAF ensures canvas elements are laid out before Chart.js reads dimensions
  requestAnimationFrame(() => renderModalCharts(system));
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  modal.hidden = true;
  document.body.style.overflow = '';

  Object.keys(chartInstances).forEach(key => {
    if (key.startsWith('modal-') && chartInstances[key]) {
      chartInstances[key].destroy();
      delete chartInstances[key];
    }
  });
}

function initModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  // Event delegation: one listener handles all card clicks, including cards rendered after init
  const grid = document.getElementById('systems-grid');
  if (grid) {
    grid.addEventListener('click', function(e) {
      const card = e.target.closest('.system-card');
      if (card && card.dataset.id) openProjectModal(card.dataset.id);
    });
  }

  modal.querySelector('.modal-backdrop').addEventListener('click', closeProjectModal);
  modal.querySelector('.modal-close').addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.hidden) closeProjectModal();
  });
}

// ─── Charts ──────────────────────────────────────────────────────────────────

function renderModalCharts(system) {
  if (!system.charts) return;

  Chart.defaults.color = '#a3a3a3';
  Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 15, 0.95)',
        titleColor: '#f5f5f5',
        bodyColor: '#a3a3a3',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 6
      }
    }
  };

  const doughnutOptions = {
    ...baseOptions,
    cutout: '65%',
    plugins: {
      ...baseOptions.plugins,
      legend: {
        display: true,
        position: 'bottom',
        labels: { boxWidth: 12, padding: 16, font: { size: 11 } }
      }
    }
  };

  const charts = system.charts;
  const barData = charts.queryTime || charts.timeSavings;

  if (barData) {
    const ctx = document.getElementById('modal-chart-bar');
    if (ctx) {
      const isLogScale = barData === charts.queryTime;
      const colors = barData === charts.timeSavings
        ? ['#525252', '#22c55e']
        : ['#525252', '#3b82f6', '#22c55e'];

      chartInstances['modal-bar'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: barData.labels,
          datasets: [{ data: barData.data, backgroundColor: colors, borderRadius: 4, borderSkipped: false }]
        },
        options: {
          ...baseOptions,
          indexAxis: 'y',
          scales: {
            x: {
              type: isLogScale ? 'logarithmic' : 'linear',
              grid: { color: 'rgba(255, 255, 255, 0.04)' },
              ticks: {
                callback(value) {
                  if (barData.unit === 'minutes') return value + ' min';
                  if (value >= 60) return (value / 60) + 'm';
                  return value + 's';
                }
              }
            },
            y: { grid: { display: false } }
          },
          plugins: {
            ...baseOptions.plugins,
            tooltip: {
              ...baseOptions.plugins.tooltip,
              callbacks: {
                label(context) {
                  const val = context.raw;
                  if (barData.unit === 'minutes') return `${val} minutes`;
                  if (val >= 60) return `${(val / 60).toFixed(0)} minutes`;
                  if (val < 1) return `${(val * 1000).toFixed(0)} ms`;
                  return `${val} seconds`;
                }
              }
            }
          }
        }
      });
    }
  }

  const doughnut1Data = charts.responseSource || charts.cachePerformance;
  if (doughnut1Data) {
    const ctx = document.getElementById('modal-chart-doughnut1');
    if (ctx) {
      chartInstances['modal-doughnut1'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: doughnut1Data.labels,
          datasets: [{ data: doughnut1Data.data, backgroundColor: doughnut1Data.colors, borderWidth: 0, spacing: 2 }]
        },
        options: doughnutOptions
      });
    }
  }

  if (charts.imageClassification) {
    const ctx = document.getElementById('modal-chart-doughnut2');
    if (ctx) {
      chartInstances['modal-doughnut2'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: charts.imageClassification.labels,
          datasets: [{ data: charts.imageClassification.data, backgroundColor: charts.imageClassification.colors, borderWidth: 0, spacing: 2 }]
        },
        options: doughnutOptions
      });
    }
  }
}

// ─── Hamburger ───────────────────────────────────────────────────────────────

function initHamburger() {
  const btn  = document.querySelector('.hamburger-icon');
  const menu = document.querySelector('.menu-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', function() {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ─── Ask Form ────────────────────────────────────────────────────────────────

function initAskForm() {
  const form = document.getElementById('ask-form');
  if (!form) return;

  const input         = document.getElementById('ask-input');
  const responseEl    = document.getElementById('ask-response');
  const errorEl       = document.getElementById('ask-error');
  const submitBtn     = form.querySelector('.ask-submit');
  const submitText    = submitBtn.querySelector('.ask-submit-text');
  const submitLoading = submitBtn.querySelector('.ask-submit-loading');

  function setLoading(loading) {
    submitBtn.disabled   = loading;
    input.disabled       = loading;
    submitText.hidden    = loading;
    submitLoading.hidden = !loading;
  }

  function showResponse(text) {
    errorEl.hidden = true;
    responseEl.hidden = false;
    responseEl.style.animation = 'none';
    responseEl.offsetHeight; // trigger reflow to restart CSS animation
    responseEl.style.animation = '';
    responseEl.textContent = text;
  }

  function showError(message) {
    responseEl.hidden = true;
    errorEl.hidden = false;
    errorEl.style.animation = 'none';
    errorEl.offsetHeight;
    errorEl.style.animation = '';
    errorEl.textContent = message;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    responseEl.hidden = true;
    errorEl.hidden = true;
    setLoading(true);

    try {
      const answer = await askAPI(question, 'general');
      showResponse(answer);
    } catch (err) {
      showError(err.message || 'Unable to get a response. Please try again.');
    } finally {
      setLoading(false);
    }
  });
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

function initChat() {
  const floatingBtn  = document.getElementById('floating-ask-btn');
  const chatPanel    = document.getElementById('project-chat-panel');
  const chatBackdrop = document.getElementById('chat-panel-backdrop');
  const chatClose    = document.getElementById('chat-panel-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm     = document.getElementById('chat-form');
  const chatInput    = document.getElementById('chat-input');
  const heroSection  = document.getElementById('hero');

  if (!floatingBtn || !chatPanel || !heroSection) return;

  const heroObserver = new IntersectionObserver(
    entries => { floatingBtn.hidden = entries[0].isIntersecting; },
    { threshold: 0, rootMargin: '-100px 0px 0px 0px' }
  );
  heroObserver.observe(heroSection);

  function openChatPanel() {
    chatPanel.hidden = false;
    chatBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    chatInput.focus();
  }

  function closeChatPanel() {
    chatPanel.hidden = true;
    chatBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  const AVATAR_SVG = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
    </svg>
  `;

  function typewrite(el, html, scrollTarget) {
    let i = 0;
    const speed = Math.max(5, Math.min(20, 1000 / html.length));

    function tick() {
      if (i >= html.length) return;
      if (html[i] === '<') {
        const end = html.indexOf('>', i);
        if (end !== -1) {
          el.innerHTML += html.substring(i, end + 1);
          i = end + 1;
        } else {
          el.innerHTML += html[i++];
        }
      } else {
        el.innerHTML += html[i++];
      }
      scrollTarget.scrollTop = scrollTarget.scrollHeight;
      setTimeout(tick, speed);
    }
    tick();
  }

  function addMessage(content, isUser = false, animate = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'assistant'}`;

    if (isUser) {
      messageDiv.innerHTML = `
        <span class="chat-message-label">You</span>
        <div class="chat-message-content">${escapeHTML(content)}</div>
      `;
    } else {
      const parsedContent = parseMarkdown(content);
      messageDiv.innerHTML = `
        <div class="chat-message-row">
          <div class="chat-avatar">${AVATAR_SVG}</div>
          <div class="chat-message-body">
            <span class="chat-message-label">matrix</span>
            <div class="chat-message-content"></div>
          </div>
        </div>
      `;

      const contentDiv = messageDiv.querySelector('.chat-message-content');
      if (animate && parsedContent.length < 500) {
        typewrite(contentDiv, parsedContent, chatMessages);
      } else {
        contentDiv.innerHTML = parsedContent;
        contentDiv.classList.add('fade-in');
      }
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
  }

  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-typing';
    typingDiv.id = 'chat-typing-indicator';
    typingDiv.innerHTML = `
      <div class="chat-avatar">${AVATAR_SVG}</div>
      <div class="chat-typing-dots">
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTyping() {
    document.getElementById('chat-typing-indicator')?.remove();
  }

  chatForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;

    addMessage(question, true);
    chatInput.value = '';
    chatInput.disabled = true;
    chatForm.querySelector('.chat-submit').disabled = true;
    showTyping();

    try {
      const answer = await askAPI(question, 'project');
      hideTyping();
      addMessage(answer, false);
    } catch (err) {
      hideTyping();
      addMessage(`Sorry, I couldn't get a response. ${err.message}`, false);
    } finally {
      chatInput.disabled = false;
      chatForm.querySelector('.chat-submit').disabled = false;
      chatInput.focus();
    }
  });

  floatingBtn.addEventListener('click', openChatPanel);
  chatClose.addEventListener('click', closeChatPanel);
  chatBackdrop.addEventListener('click', closeChatPanel);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !chatPanel.hidden) closeChatPanel();
  });
}

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  loadSystems();
  initModal();
  initHamburger();
  initAskForm();
  initChat();
});
