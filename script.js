// Living AI Lab - Portfolio Script

// Hamburger menu toggle
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Icon mappings for principles
const iconMap = {
  data: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>',
  reliable: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>',
  measure: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
  maintain: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
};

// Stack category display names
const stackLabels = {
  retrieval: 'Retrieval',
  llms: 'LLMs',
  infra: 'Infrastructure',
  vision: 'Vision'
};

// Data store
let systemsData = null;

// Fetch data and initialize
async function init() {
  try {
    const response = await fetch('./data/systems.json');
    systemsData = await response.json();
    renderSystems(systemsData.systems);
    renderPrinciples(systemsData.principles);
    renderStack(systemsData.stack);
    initFilters();
  } catch (error) {
    console.error('Failed to load systems data:', error);
  }
}

// Render system cards
function renderSystems(systems, filter = 'all') {
  const grid = document.getElementById('systems-grid');
  if (!grid) return;

  const filteredSystems = filter === 'all'
    ? systems
    : systems.filter(s => s.category === filter);

  grid.innerHTML = filteredSystems.map(system => `
    <div class="system-card" data-category="${system.category}">
      <div class="system-card-header">
        <h3 class="system-title">${system.title}</h3>
        <span class="category-tag ${system.category}">${system.category.toUpperCase()}</span>
      </div>
      <ul class="system-metrics">
        ${system.metrics.map(m => `<li>${m}</li>`).join('')}
      </ul>
      <button class="expand-btn" onclick="toggleCaseStudy(this)" aria-expanded="false">
        <span>View Case Study</span>
        <span class="arrow">&#9660;</span>
      </button>
      <div class="case-study">
        <div class="case-study-grid">
          <div class="case-study-column">
            <h4>Problem</h4>
            <p>${system.caseStudy.problem}</p>
          </div>
          <div class="case-study-column">
            <h4>Constraints</h4>
            <ul>
              ${system.caseStudy.constraints.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
          <div class="case-study-column">
            <h4>Approach</h4>
            <p>${system.caseStudy.approach}</p>
          </div>
        </div>
        <div class="case-study-outcomes">
          <h4>Outcomes</h4>
          <div class="outcomes-list">
            ${system.caseStudy.outcomes.map(o => `
              <div class="outcome-item">
                <span class="outcome-check">&#10003;</span>
                <span>${o}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Toggle case study expansion
function toggleCaseStudy(button) {
  const caseStudy = button.nextElementSibling;
  const isExpanded = caseStudy.classList.contains('expanded');

  // Close all other case studies
  document.querySelectorAll('.case-study.expanded').forEach(cs => {
    cs.classList.remove('expanded');
    cs.previousElementSibling.classList.remove('expanded');
    cs.previousElementSibling.setAttribute('aria-expanded', 'false');
    cs.previousElementSibling.querySelector('span:first-child').textContent = 'View Case Study';
  });

  // Toggle current
  if (!isExpanded) {
    caseStudy.classList.add('expanded');
    button.classList.add('expanded');
    button.setAttribute('aria-expanded', 'true');
    button.querySelector('span:first-child').textContent = 'Collapse';
  }
}

// Initialize filter buttons
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Re-render with filter
      const filter = btn.dataset.filter;
      renderSystems(systemsData.systems, filter);
    });
  });
}

// Render principles
function renderPrinciples(principles) {
  const grid = document.getElementById('principles-grid');
  if (!grid) return;

  grid.innerHTML = principles.map(p => `
    <div class="principle-card">
      <div class="principle-icon">${iconMap[p.icon] || ''}</div>
      <h3 class="principle-title">${p.title}</h3>
      <p class="principle-desc">${p.description}</p>
    </div>
  `).join('');
}

// Render stack
function renderStack(stack) {
  const grid = document.getElementById('stack-grid');
  if (!grid) return;

  grid.innerHTML = Object.entries(stack).map(([category, tools]) => `
    <div class="stack-category">
      <h4 class="stack-category-title">${stackLabels[category] || category}</h4>
      <ul class="stack-list">
        ${tools.map(t => `<li>${t}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// Ask AI functionality
(function() {
  const form = document.getElementById('ask-form');
  const input = document.getElementById('ask-input');
  const responseEl = document.getElementById('ask-response');
  const errorEl = document.getElementById('ask-error');
  const submitBtn = form?.querySelector('.ask-submit');
  const submitText = submitBtn?.querySelector('.ask-submit-text');
  const submitLoading = submitBtn?.querySelector('.ask-submit-loading');

  if (!form) return;

  async function askAI(question) {
    const response = await fetch('https://backendmatrix.up.railway.app/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Something went wrong. Please try again.');
    }

    const data = await response.json();
    return data.answer;
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    input.disabled = loading;
    submitText.hidden = loading;
    submitLoading.hidden = !loading;
  }

  function showResponse(text) {
    errorEl.hidden = true;
    responseEl.hidden = false;
    responseEl.style.animation = 'none';
    responseEl.offsetHeight; // trigger reflow
    responseEl.style.animation = '';
    responseEl.textContent = text;
  }

  function showError(message) {
    responseEl.hidden = true;
    errorEl.hidden = false;
    errorEl.style.animation = 'none';
    errorEl.offsetHeight; // trigger reflow
    errorEl.style.animation = '';
    errorEl.textContent = message;
  }

  function clearMessages() {
    responseEl.hidden = true;
    errorEl.hidden = true;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const question = input.value.trim();
    if (!question) return;

    clearMessages();
    setLoading(true);

    try {
      const answer = await askAI(question);
      showResponse(answer);
    } catch (err) {
      showError(err.message || 'Unable to get a response. Please try again.');
    } finally {
      setLoading(false);
    }
  });
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
