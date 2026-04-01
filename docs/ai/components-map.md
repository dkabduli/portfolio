# Components Map

## Layout
- **Sidebar** — Desktop fixed left nav (~220px), ARB logo, nav links, social icons
- **MobileNav** — Hamburger, full-screen/slide overlay, same links

## UI
- **Button** — CTA buttons, variants: primary, secondary, outline; supports href for links
- **Badge** — Tech tags, "Featured", "Coming Soon"
- **GlowCard** — Generic card with glow border
- **TerminalWindow** — Terminal-style container for sections

## Terminal
- **BootScreen** — First-load boot sequence, sessionStorage
- **TypewriterText** — Animated typewriter reveal (single-line or multi-line with stagger)
- **BlinkingCursor** — Blinking cursor component

## Sections
- **Hero** — Arabic greeting, terminal block, summary, CTAs
- **Experience** — ExperienceCard list, resume button
- **Skills** — SkillBadge categories, SkillBar core strengths
- **Projects** — ProjectCard grid, featured card prominent
- **Contact** — ContactForm, contact method cards
- **Footer** — Copyright, nav links, social, personal line

## Data Flow
- Sections import from `src/data/*.js`
- Hooks: `useActiveSection` (Sidebar, MobileNav), `useInView` (section animations)
- `scrollTo` util for smooth scroll to section IDs
