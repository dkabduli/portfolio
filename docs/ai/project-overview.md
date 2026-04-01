# Project Overview

## Purpose
Personal developer portfolio for **Abdul Rehman Baseem** — a NetDevOps / infrastructure / automation-focused developer. The site targets recruiters, LinkedIn viewers, and technical hiring managers.

## Tech Stack
- **Framework:** React 18 + Vite
- **Styling:** CSS Modules (.module.css)
- **Animations:** Framer Motion
- **Deployment:** GitHub Pages (static)
- **Contact Form:** EmailJS (stubbed, user configures)

## Architecture
- Single-page application with scroll-based navigation
- No React Router — sections identified by `id` attributes
- Data-driven: all content in `src/data/*.js`
- Hooks: `useActiveSection` (nav highlight), `useInView` (scroll animations)

## Key Features
- Terminal boot screen on first load (sessionStorage)
- Dark, hacker/terminal aesthetic
- Arabic greeting (Amiri font)
- Responsive: desktop sidebar + mobile hamburger
- Resume PDF download, project links, contact form

## Repo Structure
```
/
  public/          → static assets (images, resume PDF)
  src/
    components/     → layout, ui, terminal, sections
    data/          → experience, skills, projects, contact, hero
    hooks/         → useActiveSection, useInView
    styles/        → global.css, animations.css
  docs/ai/         → AI context files (this folder)
```
