# Astro Site Redesign

**Date:** 2026-01-23
**Status:** Approved
**Author:** Cris Benge + Claude

## Overview

Replace the existing Pelican-based static site with a modern Astro 5.x site deployed to GitHub Pages. The goal is enhanced presentation with better UX while preserving the academic paper content.

## Goals

- Modern tech aesthetic with dark mode support
- Single-page article with sticky table of contents
- Rebuild all 17 charts using Observable Plot
- Comprehensive test coverage (unit + E2E)
- Deploy to `cbenge509.github.io/typos_field_experiment/`

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Astro | 5.x | Static site generator |
| Tailwind CSS | 4.x | Styling (via `@tailwindcss/vite`) |
| TypeScript | 5.x | Type safety (strict mode, no `any`) |
| Observable Plot | latest | Statistical chart library |
| Vitest | latest | Unit testing (co-located) |
| Playwright | latest | E2E testing (Chromium, Firefox, WebKit) |
| gts | latest | Google TypeScript Style (lint/format) |

## Project Structure

```
pelican-site/                    # New Astro project (replaces old Pelican)
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── charts/              # Observable Plot chart components
│   │   │   ├── ParticipantCount.astro
│   │   │   ├── DivergencePlot.astro
│   │   │   ├── LikertVariance.astro
│   │   │   ├── DemographicChart.astro
│   │   │   └── *.test.ts        # Co-located Vitest tests
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── TableOfContents.astro
│   │   │   ├── ThemeToggle.astro
│   │   │   └── Footer.astro
│   │   └── content/
│   │       ├── Section.astro    # Reusable section wrapper
│   │       ├── Figure.astro     # Image with caption
│   │       └── StatTable.astro  # Styled statistics tables
│   ├── layouts/
│   │   └── BaseLayout.astro     # HTML shell, meta tags, theme script
│   ├── pages/
│   │   └── index.astro          # Single-page article
│   ├── styles/
│   │   └── global.css           # Tailwind directives + custom styles
│   └── data/
│       └── charts.json          # Chart data extracted from CSVs
├── public/
│   └── img/                     # Static images (migrated from content/img)
├── e2e/                         # Playwright E2E tests
│   └── article.spec.ts
├── astro.config.ts
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

## Configuration Details

### Astro Configuration

- Static output mode (`output: 'static'`)
- Base path: `base: '/typos_field_experiment'`
- No SSR — pure static site generation

### Tailwind CSS v4 via Vite

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [tailwindcss()]
}
```

- CSS-first configuration in `src/styles/global.css`
- Dark mode via `class` strategy for toggle support

### TypeScript Strict Mode

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

## Visual Design

### Typography

- Headings: Inter
- Body: System font stack
- Code: JetBrains Mono

### Color Palette

```css
/* Light mode */
--color-bg: #ffffff;
--color-text: #1a1a1a;
--color-text-muted: #6b7280;
--color-accent: #003262;        /* Berkeley blue */
--color-accent-hover: #3b7ea1;  /* Founders rock */
--color-highlight: #fdb515;     /* California gold */

/* Dark mode */
--color-bg: #0f0f0f;
--color-text: #f5f5f5;
--color-text-muted: #9ca3af;
--color-accent: #60a5fa;
--color-highlight: #fbbf24;
```

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Header: Title + Authors + Theme Toggle                 │
├───────────────┬─────────────────────────────────────────┤
│  Sticky TOC   │  Main Content                          │
│  (left side)  │  - Sections with anchors               │
│               │  - Charts                              │
│               │  - Tables                              │
│               │  - Images                              │
├───────────────┴─────────────────────────────────────────┤
│  Footer: Authors, UC Berkeley, GitHub link              │
└─────────────────────────────────────────────────────────┘
```

### Responsive Behavior

- Desktop (≥1024px): Sticky TOC on left, content on right
- Mobile (<1024px): TOC collapses to hamburger/dropdown

## Chart Implementation

### Observable Plot Pattern

```astro
<div id="participant-chart" class="chart-container"></div>

<script>
  import * as Plot from '@observablehq/plot';
  import data from '../../data/charts.json';

  const chart = Plot.plot({
    marks: [
      Plot.barY(data.participants, {
        x: 'treatment',
        y: 'count',
        fill: 'treatment'
      }),
      Plot.ruleY([0])
    ],
    color: {
      domain: ['Control', 'Typographical', 'Phonological'],
      range: ['#46535e', '#003262', '#3b7ea1']
    }
  });

  document.getElementById('participant-chart')?.append(chart);
</script>
```

### Charts to Rebuild (17 total)

| Category | Charts |
|----------|--------|
| Participation | `participant_count_pilot`, `participant_count_live` |
| Demographics | `demographic_gender`, `demographic_country`, `demographic_state`, `demographic_year` |
| Likert Results | `divergence_intelligence`, `divergence_writing`, `divergence_effective`, `likert_variance`, `likert_group_counts` |
| Other | `wpm_by_group`, `missing_demographic_data`, `descriptive_statistics_*` (2) |

## Testing Strategy

### Vitest Unit Tests

Location: Co-located with components (`*.test.ts`)

Coverage:
- Data transformations
- Utility functions
- Component prop validation

### Playwright E2E Tests

```
e2e/
├── article.spec.ts      # Page loads, content renders
├── navigation.spec.ts   # TOC links scroll to sections
├── theme.spec.ts        # Toggle works, persists preference
└── charts.spec.ts       # All 17 charts render without errors
```

Browser matrix: Chromium, Firefox, WebKit

## Deployment

### GitHub Actions Workflow

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  build-deploy:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./pelican-site/dist
      - uses: actions/deploy-pages@v4
```

### NPM Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "gts lint",
    "fix": "gts fix",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

## Content Migration

### Section Structure for TOC

1. Study Overview
2. Experiment Design
   - Participants (Pilot + Live)
3. Methodology
4. Results
   - Main Effects
   - Robustness Checks
   - Heterogeneous Effects
5. Discussion
6. References

### Migration Tasks

| From | To |
|------|-----|
| YAML frontmatter | Metadata in `BaseLayout.astro` |
| Inline Vega-Lite scripts | Observable Plot components |
| Raw HTML tables | `<StatTable>` component |
| Markdown content | MDX or inline in `index.astro` |
| `content/img/*` | `public/img/` |

### Images to Migrate (~40 files)

- `img/social_media/` — 19 social media post screenshots
- `img/bayes/` — 11 Bayesian analysis plots
- `img/*.png` — Study diagrams, author photos

## Implementation Phases

### Phase 1: Project Setup
- Initialize Astro project
- Configure Tailwind v4, TypeScript, gts
- Set up Vitest and Playwright

### Phase 2: Layout & Components
- Create BaseLayout with theme support
- Build Header, Footer, TOC components
- Implement dark mode toggle

### Phase 3: Content Migration
- Migrate images to `public/img/`
- Convert markdown sections to Astro
- Build reusable Section, Figure, StatTable components

### Phase 4: Chart Rebuild
- Extract data from existing charts
- Create Observable Plot components
- Ensure dark mode compatibility

### Phase 5: Testing & Polish
- Write unit tests for utilities
- Write E2E tests for all scenarios
- Cross-browser testing

### Phase 6: Deployment
- Configure GitHub Actions
- Enable GitHub Pages
- Verify production deployment

## Success Criteria

- [ ] All 17 charts render correctly
- [ ] Dark mode works and persists
- [ ] TOC navigation is smooth
- [ ] All tests pass (Vitest + Playwright)
- [ ] Lighthouse performance score ≥90
- [ ] Deploys successfully to GitHub Pages
