# Prompting Guide

Use this when asking AI to modify or extend the portfolio.

## Context to Provide
- Reference `docs/ai/` for project structure, design system, content sources
- Specify which section or component to change
- Mention if you're editing `src/data/` files vs components

## Common Tasks

### Add a new project
1. Edit `src/data/projects.js`
2. Add object with: `id`, `name`, `description`, `whatIDid[]`, `tech[]`, `github`, `featured`
3. No component changes needed

### Add a new skill category
1. Edit `src/data/skills.js`
2. Add key to `categories` or item to `coreStrengths`
3. Skills.jsx renders dynamically

### Change colors
1. Edit `src/styles/global.css` — `:root` variables
2. All components use CSS variables

### Add a new section
1. Create `src/components/sections/NewSection/NewSection.jsx` + `.module.css`
2. Add section to `App.jsx`
3. Add nav link in Sidebar.jsx and MobileNav.jsx
4. Add section id to `useActiveSection` in App.jsx

### Modify boot screen
- Edit `src/components/terminal/BootScreen.jsx`
- Lines array and timing in component

### Deploy to different repo
- Edit `vite.config.js` → `base: '/your-repo-name/'`
- Run `npm run deploy`
