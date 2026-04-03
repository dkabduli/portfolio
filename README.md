# Abdul Rehman Baseem — Portfolio

A dark, terminal-inspired personal developer portfolio built with React and Vite. Optimized for GitHub Pages deployment.

## Tech Stack

- **React 18** + **Vite 5**
- **Framer Motion** — animations
- **CSS Modules** — scoped styling
- **EmailJS** — contact form (user-configured)
- **gh-pages** — deployment

## Prerequisites

- Node.js 18+
- npm

## Local Setup

```bash
git clone <your-repo-url>
cd portfolio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to GitHub Pages

```bash
npm run deploy
```

This builds the project and pushes the `dist/` folder to the `gh-pages` branch.

### Base Path Configuration

The site uses a base path for GitHub Pages. Edit `vite.config.js`:

```js
base: '/portfolio/',  // Use this if your repo is named "portfolio"
// base: '/dkabduli.github.io/',  // Use this if repo is "dkabduli.github.io" (user pages)
```

Change `base` to match your repository name. For user/organization pages (`username.github.io`), use `base: '/'`.

## Replacing Assets

### Hero Image

Place your profile/hero image at:

```
public/images/profile-hero.jpg
```

Replace the existing file. The image is used as the Hero section background.

### Resume PDF

Place your resume at:

```
public/resume/Resume.pdf
```

The "View Resume" / download buttons link to this file (`RESUME_URL` in `src/App.jsx`).

### Favicon

Add `public/favicon.ico` to replace the default favicon. The site uses an inline SVG fallback if no favicon is present.

## EmailJS Contact Form

The contact form uses [EmailJS](https://www.emailjs.com/) for serverless email delivery.

1. Create an EmailJS account and set up a service, template, and get your Public Key.
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Add your credentials to `.env`:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```
4. See `src/components/sections/Contact/ContactForm.jsx` for the integration and TODO comments.

## Project Structure

```
/
  public/           → Static assets (images, resume, favicon)
  src/
    components/     → Layout, UI, terminal, sections
    data/           → experience, skills, projects, contact, hero
    hooks/          → useActiveSection, useInView
    styles/         → global.css, animations.css
    utils/          → scrollTo
  docs/ai/          → AI context files for maintenance
```

## AI Context Files

The `docs/ai/` folder contains reference documents for AI-assisted editing:

- `project-overview.md` — Architecture and tech stack
- `design-system.md` — Colors, fonts, UI rules
- `content-source.md` — Where content lives (data files)
- `components-map.md` — Component hierarchy
- `future-improvements.md` — Ideas for enhancements
- `prompting-guide.md` — How to prompt for common changes

## License

Private. All rights reserved.
