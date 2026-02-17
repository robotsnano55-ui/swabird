/**
 * Vercel Serverless Function - Claude API proxy
 * Deploy to Vercel and set ANTHROPIC_API_KEY in project env vars
 */
const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY not configured. Add it in Vercel project settings.',
    });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing message' });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const sysPrompt = `You are a VAULT-TEC AI security consultant. Help users with cybersecurity questions in a Fallout-themed, professional tone. Keep responses concise and useful. Reference vault, security, and wasteland metaphors occasionally.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: sysPrompt,
      messages: [{ role: 'user', content: message }],
    });

    const text =
      response.content
        ?.filter((c) => c.type === 'text')
        ?.map((c) => c.text)
        ?.join('') || 'No response.';

    return res.json({ reply: text });
  } catch (err) {
    console.error('Claude API error:', err);
    return res.status(500).json({
      error: err.message || 'Failed to get response from Claude',
    });
  }
};
