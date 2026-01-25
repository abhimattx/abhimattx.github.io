// Portfolio Script - Glass + Black + Liquid

// Hamburger menu toggle
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Chart instances storage
const chartInstances = {};

// Data store
let systemsData = null;

// Project data files
const PROJECT_FILES = [
  './data/systems.json',
  './data/gridsz.json'
];

// Fetch data and initialize
async function init() {
  try {
    const responses = await Promise.all(
      PROJECT_FILES.map(file => fetch(file).then(r => r.json()))
    );

    // Merge all systems from different files
    const allSystems = responses.flatMap(data => data.systems || []);
    systemsData = { systems: allSystems };

    renderSystems(systemsData.systems);
  } catch (error) {
    console.error('Failed to load systems data:', error);
  }
}

// Render system cards
function renderSystems(systems) {
  const grid = document.getElementById('systems-grid');
  if (!grid) return;

  grid.innerHTML = systems.map(system => `
    <div class="system-card ${system.featured ? 'featured' : ''}" data-category="${system.category}" data-id="${system.id}" onclick="openProjectModal('${system.id}')">
      <div class="system-card-header">
        <h3 class="system-title">${system.title}</h3>
        <span class="category-tag ${system.category}">${system.category.toUpperCase()}</span>
      </div>
      <ul class="system-metrics">
        ${system.metrics.map(m => `<li>${m}</li>`).join('')}
      </ul>
      ${system.techStack && typeof system.techStack === 'object' && !Array.isArray(system.techStack) ? `
        <div class="tech-stack-tags">
          ${Object.values(system.techStack).flat().slice(0, 6).map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      ` : ''}
      <span class="view-project-hint">Click to view case study</span>
    </div>
  `).join('');
}

// Helper to render funnel chart HTML
function renderFunnelHTML(funnelData) {
  const maxVal = Math.max(...funnelData.steps.map(s => s.value));
  return `
    <div class="chart-container funnel-container">
      <h4 class="chart-title">${funnelData.title}</h4>
      <div class="funnel-chart">
        ${funnelData.steps.map(step => `
          <div class="funnel-step">
            <div class="funnel-bar" style="width: ${(step.value / maxVal) * 100}%">
              <span class="funnel-value">${typeof step.value === 'number' && step.value >= 1 ? step.value : step.value + 'KB'}</span>
            </div>
            <span class="funnel-label">${step.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Open project modal
function openProjectModal(systemId) {
  if (!systemsData) return;

  const system = systemsData.systems.find(s => s.id === systemId);
  if (!system) return;

  const modal = document.getElementById('project-modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalTag = modal.querySelector('.modal-tag');
  const modalBody = modal.querySelector('.modal-body');

  // Set title and tag
  modalTitle.textContent = system.title;
  modalTag.textContent = system.category.toUpperCase();
  modalTag.className = `modal-tag ${system.category}`;

  // Determine which charts to render based on available data
  const charts = system.charts || {};
  const hasBarChart = charts.queryTime || charts.timeSavings;
  const barChart = charts.queryTime || charts.timeSavings;
  const hasDoughnut1 = charts.responseSource || charts.cachePerformance;
  const doughnut1 = charts.responseSource || charts.cachePerformance;
  const hasDoughnut2 = charts.imageClassification;
  const hasFunnel = charts.retrievalFunnel || charts.aiPipeline;
  const funnelData = charts.retrievalFunnel || charts.aiPipeline;

  // Build modal content
  modalBody.innerHTML = `
    ${system.subtitle ? `<p class="modal-subtitle">${system.subtitle}</p>` : ''}

    ${system.charts ? `
      <div class="case-study-charts">
        <div class="charts-row">
          ${hasBarChart ? `
            <div class="chart-container">
              <h4 class="chart-title">${barChart.title}</h4>
              <canvas id="modal-chart-bar"></canvas>
            </div>
          ` : ''}
          ${hasDoughnut1 ? `
            <div class="chart-container">
              <h4 class="chart-title">${doughnut1.title}</h4>
              <canvas id="modal-chart-doughnut1"></canvas>
            </div>
          ` : ''}
          ${hasDoughnut2 ? `
            <div class="chart-container">
              <h4 class="chart-title">${charts.imageClassification.title}</h4>
              <canvas id="modal-chart-doughnut2"></canvas>
            </div>
          ` : ''}
          ${charts.performance ? `
            <div class="chart-container metrics-container">
              <h4 class="chart-title">${charts.performance.title}</h4>
              <div class="metrics-grid">
                ${charts.performance.items.map(item => `
                  <div class="metric-item">
                    <span class="metric-value">${item.value}</span>
                    <span class="metric-label">${item.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        ${hasFunnel ? renderFunnelHTML(funnelData) : ''}
      </div>
    ` : ''}

    <div class="case-study-section">
      <h4 class="case-study-section-title">The Problem</h4>
      <p class="case-study-text">${system.caseStudy.problem}</p>
    </div>

    <div class="case-study-grid">
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

    ${system.challenges ? `
      <div class="case-study-section">
        <h4 class="case-study-section-title">Engineering Challenges</h4>
        <div class="challenges-grid">
          ${system.challenges.map(c => `
            <div class="challenge-card">
              <h5 class="challenge-title">${c.title}</h5>
              <p class="challenge-problem">${c.problem}</p>
              <p class="challenge-solution">${c.solution}</p>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${system.techStack && typeof system.techStack === 'object' && !Array.isArray(system.techStack) ? `
      <div class="case-study-section">
        <h4 class="case-study-section-title">Tech Stack</h4>
        <div class="tech-stack-detailed">
          ${Object.entries(system.techStack).map(([category, tools]) => `
            <div class="tech-category">
              <span class="tech-category-label">${category}</span>
              <span class="tech-category-tools">${tools.join(', ')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${system.apiLatency ? `
      <div class="case-study-section">
        <h4 class="case-study-section-title">API Response Times</h4>
        <div class="api-latency-grid">
          ${system.apiLatency.map(item => `
            <div class="latency-item">
              <span class="latency-endpoint">${item.endpoint}</span>
              <span class="latency-value">${item.latency}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${system.scalability ? `
      <div class="case-study-section">
        <h4 class="case-study-section-title">Scalability</h4>
        <div class="scalability-grid">
          ${system.scalability.map(item => `
            <div class="scalability-item">
              <span class="scalability-dimension">${item.dimension}</span>
              <span class="scalability-current">${item.current}</span>
              <span class="scalability-path">${item.path}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

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
  `;

  // Show modal
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  // Render charts after modal is visible
  setTimeout(() => renderModalCharts(system), 50);
}

// Close project modal
function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  modal.hidden = true;
  document.body.style.overflow = '';

  // Destroy modal charts
  Object.keys(chartInstances).forEach(key => {
    if (key.startsWith('modal-') && chartInstances[key]) {
      chartInstances[key].destroy();
      delete chartInstances[key];
    }
  });
}

// Render charts in modal
function renderModalCharts(system) {
  if (!system.charts) return;

  Chart.defaults.color = '#a3a3a3';
  Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';

  const chartOptions = {
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

  const charts = system.charts;

  // Bar Chart (queryTime or timeSavings)
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
          datasets: [{
            data: barData.data,
            backgroundColor: colors,
            borderRadius: 4,
            borderSkipped: false
          }]
        },
        options: {
          ...chartOptions,
          indexAxis: 'y',
          scales: {
            x: {
              type: isLogScale ? 'logarithmic' : 'linear',
              grid: { color: 'rgba(255, 255, 255, 0.04)' },
              ticks: {
                callback: function(value) {
                  if (barData.unit === 'minutes') return value + ' min';
                  if (value >= 60) return (value / 60) + 'm';
                  return value + 's';
                }
              }
            },
            y: { grid: { display: false } }
          },
          plugins: {
            ...chartOptions.plugins,
            tooltip: {
              ...chartOptions.plugins.tooltip,
              callbacks: {
                label: function(context) {
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

  // Primary Doughnut Chart (responseSource or cachePerformance)
  const doughnut1Data = charts.responseSource || charts.cachePerformance;
  if (doughnut1Data) {
    const ctx = document.getElementById('modal-chart-doughnut1');
    if (ctx) {
      chartInstances['modal-doughnut1'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: doughnut1Data.labels,
          datasets: [{
            data: doughnut1Data.data,
            backgroundColor: doughnut1Data.colors,
            borderWidth: 0,
            spacing: 2
          }]
        },
        options: {
          ...chartOptions,
          cutout: '65%',
          plugins: {
            ...chartOptions.plugins,
            legend: {
              display: true,
              position: 'bottom',
              labels: { boxWidth: 12, padding: 16, font: { size: 11 } }
            }
          }
        }
      });
    }
  }

  // Secondary Doughnut Chart (imageClassification)
  if (charts.imageClassification) {
    const ctx = document.getElementById('modal-chart-doughnut2');
    if (ctx) {
      chartInstances['modal-doughnut2'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: charts.imageClassification.labels,
          datasets: [{
            data: charts.imageClassification.data,
            backgroundColor: charts.imageClassification.colors,
            borderWidth: 0,
            spacing: 2
          }]
        },
        options: {
          ...chartOptions,
          cutout: '65%',
          plugins: {
            ...chartOptions.plugins,
            legend: {
              display: true,
              position: 'bottom',
              labels: { boxWidth: 12, padding: 16, font: { size: 11 } }
            }
          }
        }
      });
    }
  }
}

// Modal event listeners
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  // Close on backdrop click
  modal.querySelector('.modal-backdrop').addEventListener('click', closeProjectModal);

  // Close on X button
  modal.querySelector('.modal-close').addEventListener('click', closeProjectModal);

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.hidden) {
      closeProjectModal();
    }
  });
});

// Ask AI functionality
(function () {
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
      body: JSON.stringify({ question, type: 'general' })
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

  form.addEventListener('submit', async function (e) {
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

// ========================================
// Floating Ask Button & Chat Panel
// ========================================
(function() {
  // DOM elements
  const floatingBtn = document.getElementById('floating-ask-btn');
  const chatPanel = document.getElementById('project-chat-panel');
  const chatBackdrop = document.getElementById('chat-panel-backdrop');
  const chatClose = document.getElementById('chat-panel-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const heroSection = document.getElementById('hero');

  if (!floatingBtn || !chatPanel || !heroSection) return;

  // Track scroll position to show/hide floating button
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Show button when hero is NOT intersecting (scrolled past)
      if (!entry.isIntersecting) {
        floatingBtn.hidden = false;
      } else {
        floatingBtn.hidden = true;
      }
    });
  }, {
    threshold: 0,
    rootMargin: '-100px 0px 0px 0px'
  });

  heroObserver.observe(heroSection);

  // Open chat panel
  function openChatPanel() {
    chatPanel.hidden = false;
    chatBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    chatInput.focus();
  }

  // Close chat panel
  function closeChatPanel() {
    chatPanel.hidden = true;
    chatBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  // Simple markdown parser for chat responses
  function parseMarkdown(text) {
    return text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Line breaks
      .replace(/\n/g, '<br>');
  }

  // Add message to chat with optional typewriter effect
  function addMessage(content, isUser = false, animate = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'assistant'}`;

    const parsedContent = isUser ? content : parseMarkdown(content);

    if (isUser) {
      messageDiv.innerHTML = `
        <span class="chat-message-label">You</span>
        <div class="chat-message-content">${parsedContent}</div>
      `;
      chatMessages.appendChild(messageDiv);
    } else {
      messageDiv.innerHTML = `
        <div class="chat-message-row">
          <div class="chat-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div class="chat-message-body">
            <span class="chat-message-label">matrix</span>
            <div class="chat-message-content"></div>
          </div>
        </div>
      `;
      chatMessages.appendChild(messageDiv);

      const contentDiv = messageDiv.querySelector('.chat-message-content');

      if (animate && parsedContent.length < 500) {
        // Typewriter effect for shorter responses
        let i = 0;
        const chars = parsedContent;
        const speed = Math.max(5, Math.min(20, 1000 / chars.length));

        function typeWriter() {
          if (i < chars.length) {
            // Handle HTML tags - add them all at once
            if (chars[i] === '<') {
              const tagEnd = chars.indexOf('>', i);
              if (tagEnd !== -1) {
                contentDiv.innerHTML += chars.substring(i, tagEnd + 1);
                i = tagEnd + 1;
              } else {
                contentDiv.innerHTML += chars[i];
                i++;
              }
            } else {
              contentDiv.innerHTML += chars[i];
              i++;
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
            setTimeout(typeWriter, speed);
          }
        }
        typeWriter();
      } else {
        // Instant display for longer responses
        contentDiv.innerHTML = parsedContent;
        contentDiv.classList.add('fade-in');
      }
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
  }

  // Show typing indicator
  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-typing';
    typingDiv.id = 'chat-typing-indicator';
    typingDiv.innerHTML = `
      <div class="chat-avatar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      </div>
      <div class="chat-typing-dots">
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Hide typing indicator
  function hideTyping() {
    const typingIndicator = document.getElementById('chat-typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Send message to API
  async function sendMessage(question) {
    const response = await fetch('https://backendmatrix.up.railway.app/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, type: 'project' })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Something went wrong. Please try again.');
    }

    const data = await response.json();
    return data.answer;
  }

  // Handle form submission
  chatForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const question = chatInput.value.trim();
    if (!question) return;

    // Add user message
    addMessage(question, true);
    chatInput.value = '';
    chatInput.disabled = true;
    chatForm.querySelector('.chat-submit').disabled = true;

    // Show typing
    showTyping();

    try {
      const answer = await sendMessage(question);
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

  // Event listeners
  floatingBtn.addEventListener('click', openChatPanel);
  chatClose.addEventListener('click', closeChatPanel);
  chatBackdrop.addEventListener('click', closeChatPanel);

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !chatPanel.hidden) {
      closeChatPanel();
    }
  });
})();