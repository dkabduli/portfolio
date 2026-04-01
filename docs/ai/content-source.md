# Content Source

All section content is stored in `src/data/` files. Components import from these — no hardcoded content in JSX.

## Files

### hero.js
- `arabicGreeting`, `englishGreeting`, `terminalLines[]`, `summary`

### experience.js
Array of job objects:
- `id`, `title`, `company`, `location`, `duration`, `bullets[]`

### skills.js
- `categories`: `{ [categoryName]: string[] }` — badge pills
- `coreStrengths`: `{ name, percent }[]` — animated skill bars

### projects.js
Array of project objects:
- `id`, `name`, `description`, `whatIDid[]`, `tech[]`, `github`, `featured` (boolean)

### contact.js
Array of contact method objects:
- `id`, `label`, `value`, `href`, `external`, `icon` (emoji or symbol)

## Updating Content
1. Edit the appropriate file in `src/data/`
2. Ensure structure matches existing objects
3. Rebuild: `npm run build`

## Arabic Content
- Arabic greeting in Hero: stored in `hero.js`
- Uses Amiri font via `font-family: 'Amiri', serif`
