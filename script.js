function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
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
