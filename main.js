/**
 * VAULT-TEC SECURITY - Fallout 2 Style Site
 * Main script: clock, Pip-Boy chat, form handling
 */

// === VAULT-TEC CLOCK ===
function updateVaultTime() {
  const el = document.getElementById('vault-time');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  el.textContent = `${h}:${m}:${s}`;
}

setInterval(updateVaultTime, 1000);
updateVaultTime();

// === PIP-BOY CHAT WIDGET ===
const pipboyWidget = document.getElementById('pipboy-widget');
const pipboyOpenBtn = document.getElementById('open-pipboy');
const pipboyCloseBtn = document.getElementById('close-pipboy');
const pipboyForm = document.getElementById('pipboy-form');
const pipboyInput = document.getElementById('pipboy-input');
const pipboyMessages = document.getElementById('pipboy-messages');

if (pipboyOpenBtn) {
  pipboyOpenBtn.addEventListener('click', () => {
    if (pipboyWidget) pipboyWidget.classList.add('open');
    pipboyInput?.focus();
  });
}

if (pipboyCloseBtn) {
  pipboyCloseBtn.addEventListener('click', () => {
    if (pipboyWidget) pipboyWidget.classList.remove('open');
  });
}

function addMessage(text, role = 'assistant', label = '') {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  if (label) {
    const lbl = document.createElement('span');
    lbl.className = 'msg-label';
    lbl.textContent = label;
    div.appendChild(lbl);
  }
  const content = document.createElement('span');
  content.textContent = text;
  div.appendChild(content);
  pipboyMessages?.appendChild(div);
  pipboyMessages?.scrollTo({ top: pipboyMessages.scrollHeight, behavior: 'smooth' });
}

function addLoadingMessage() {
  const div = document.createElement('div');
  div.className = 'msg assistant loading';
  div.id = 'msg-loading';
  const lbl = document.createElement('span');
  lbl.className = 'msg-label';
  lbl.textContent = '[ ASSISTANT ]';
  div.appendChild(lbl);
  const span = document.createElement('span');
  span.textContent = 'Processing';
  div.appendChild(span);
  pipboyMessages?.appendChild(div);
  pipboyMessages?.scrollTo({ top: pipboyMessages.scrollHeight, behavior: 'smooth' });
}

function removeLoadingMessage() {
  document.getElementById('msg-loading')?.remove();
}

async function sendToClaude(message) {
  const apiUrl = '/api/chat';
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `API error ${res.status}`);
    }

    const data = await res.json();
    return data.reply || data.text || 'No response.';
  } catch (err) {
    console.error('Claude API error:', err);
    return `[ SYSTEM ERROR ] Could not reach Vault AI. ${err.message}. Ensure ANTHROPIC_API_KEY is set and the API server is running.`;
  }
}

if (pipboyForm) {
  pipboyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = pipboyInput?.value?.trim();
    if (!text) return;

    addMessage(text, 'user', '[ YOU ]');
    pipboyInput.value = '';
    addLoadingMessage();

    const reply = await sendToClaude(text);
    removeLoadingMessage();
    addMessage(reply, 'assistant', '[ ASSISTANT ]');
  });
}

// === CONTACT FORM ===
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // In production, send to your backend
    alert('[ TRANSMISSION RECEIVED ]\nYour briefing request has been logged. VAULT-TEC will make contact via secure channel.');
    contactForm.reset();
  });
}
