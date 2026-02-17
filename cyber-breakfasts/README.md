# Cyber Breakfasts Koh Phangan

A modular static site for the Ethical Hacking & AI Retreat on Koh Phangan.

## Structure

```
cyber-breakfasts/
├── index.html
├── assets/
│   ├── images/
│   └── styles.css
├── sections/
│   ├── hero.html
│   ├── program.html
│   ├── pricing.html
│   └── apply.html
└── README.md
```

## How it works

- `index.html` loads section partials via fetch and injects them into the main page.
- Sections are standalone HTML fragments for easy editing.
- Add images to `assets/images/` as needed.

## Local preview

Open `index.html` in a browser. For section loading to work, use a local server (e.g. `npx serve .` or Live Server) to avoid CORS issues with `file://`.
