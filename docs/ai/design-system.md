# Design System

## Fonts
- **Primary:** JetBrains Mono (Google Fonts) — code, UI, body
- **Arabic:** Amiri or Scheherazade New — Arabic text only

## Colors (CSS Variables)
| Variable | Value | Usage |
|----------|-------|-------|
| `--accent-green` | #00FF41 | Primary — terminal glow, interactive |
| `--accent-blue` | #00BFFF | Secondary |
| `--accent-purple` | #BF5FFF | Secondary |
| `--accent-gold` | #FFB000 | Secondary (Arabic, highlights) |
| `--bg-primary` | #0a0a0a | Main background |
| `--bg-secondary` | #0f0f0f | Section backgrounds |
| `--bg-card` | #111111 | Card backgrounds |
| `--border-subtle` | #1a1a1a | Borders |
| `--text-primary` | #e8e8e8 | Main text |
| `--text-secondary` | #888888 | Muted text |
| `--text-muted` | #444444 | Very muted |

## UI Rules
- **Glowing borders:** `box-shadow: 0 0 8px var(--accent-green)`
- **Rounded cards:** `border-radius: 8px`
- **Transitions:** `transition: all 0.3s ease`
- **Hover states:** Required on all interactive elements
- **Blinking cursor:** `animation: blink 1s step-end infinite`

## Background Effects
- Scanline overlay: `repeating-linear-gradient`
- Subtle noise texture (SVG filter or CSS)
- Low-opacity particle system (CSS or lightweight canvas)

## Component Patterns
- Cards: `GlowCard`, `TerminalWindow`
- Buttons: `Button` with variants (primary, secondary, outline)
- Badges: `Badge` for tech tags, status labels
