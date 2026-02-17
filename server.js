/**
 * SWABIRD - Local dev server
 * Serves: Vault-Tec site, Business Breakfasts, Claude API
 * Run: npm install && node server.js
 * Windows API key: set ANTHROPIC_API_KEY=your_key
 */
const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS for GitHub Pages (static frontend) calling Render backend
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (origin.includes('github.io') || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Claude API endpoint
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY not set. Add it to your environment.',
    });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing message' });
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const sysPrompt = `You are a VAULT-TEC AI security consultant. You help users with cybersecurity questions in a Fallout-themed, professional tone. Keep responses concise and useful. Reference vault, security, and wasteland metaphors occasionally.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: sysPrompt,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const text =
      response.content
        ?.filter((c) => c.type === 'text')
        ?.map((c) => c.text)
        ?.join('') || 'No response.';

    res.json({ reply: text });
  } catch (err) {
    console.error('Claude API error:', err);
    res.status(500).json({
      error: err.message || 'Failed to get response from Claude',
    });
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/cyber-breakfasts', (req, res) => {
  res.sendFile(path.join(__dirname, 'cyber-breakfasts', 'index.html'));
});

app.get('/index.hml', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.hml'));
});

app.listen(PORT, () => {
  const base = `http://localhost:${PORT}`;
  console.log(`
============================================================
  SWABIRD - Server online at ${base}
============================================================
  Pages:
    /                     → Vault-Tec (cybersecurity)
    /cyber-breakfasts     → Business Breakfasts
    /index.hml            → Original Cyber Breakfasts

  API:  POST /api/chat    → Claude Pip-Boy Assistant
------------------------------------------------------------`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('  [ WARNING ] ANTHROPIC_API_KEY not set.');
    console.log('  Pip-Boy Assistant will not work.');
    console.log('  Windows: set ANTHROPIC_API_KEY=sk-ant-...');
  } else {
    console.log('  [ OK ] Claude API connected. Pip-Boy ready.');
  }
  console.log('============================================================\n');
});
