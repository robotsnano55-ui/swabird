# VAULT-TEC SECURITY | Cybersecurity Specialist

A Fallout 2–style cybersecurity specialist site with a Pip-Boy-style Claude AI assistant.

## Features

- **Fallout 2 aesthetic**: CRT overlay, scanlines, green/amber terminal palette, Pip-Boy vibes
- **Claude AI chat**: Pip-Boy Assistant widget powered by Anthropic's Claude API
- **Responsive layout**: Works on desktop and mobile

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Set your Anthropic API key

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-your-key-here"
```

**Mac/Linux:**
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

### 3. Start the server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

> Without `ANTHROPIC_API_KEY`, the site still works; the Pip-Boy Assistant will show an error when you send a message.

## Deploy to Vercel

1. Push to GitHub and connect the repo to [Vercel](https://vercel.com).
2. In Vercel project settings → Environment Variables, add `ANTHROPIC_API_KEY`.
3. Deploy. The `/api/chat` route is handled by `api/chat.js`.

## File structure

- `index.html` – main page
- `styles.css` – Fallout 2 styling
- `main.js` – clock, chat widget, form handling
- `server.js` – local Express server with Claude proxy
- `api/chat.js` – Vercel serverless function for Claude
- `package.json` – dependencies

## API key

Create an API key at [console.anthropic.com](https://console.anthropic.com/). Do not commit keys or expose them in client-side code.
