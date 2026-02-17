/**
 * VAULT-TEC SECURITY - Local dev server with Claude API
 * Run: npm install && ANTHROPIC_API_KEY=your_key node server.js
 * Then open http://localhost:3000
 */
const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n[ VAULT-TEC SECURITY ] Server online at http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('[ WARNING ] ANTHROPIC_API_KEY not set. Pip-Boy Assistant will not work.');
    console.warn('Set it with: set ANTHROPIC_API_KEY=your_key (Windows) or export ANTHROPIC_API_KEY=your_key (Mac/Linux)\n');
  } else {
    console.log('[ OK ] Claude API connected. Pip-Boy Assistant ready.\n');
  }
});
