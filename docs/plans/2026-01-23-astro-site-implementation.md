# Astro Site Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Pelican static site with modern Astro 5.x site featuring Observable Plot charts, dark mode, and sticky TOC.

**Architecture:** Single-page academic article with client-side Observable Plot charts. Astro generates static HTML, Tailwind v4 handles styling via Vite plugin, theme toggle persists to localStorage.

**Tech Stack:** Astro 5.x, Tailwind CSS v4 (@tailwindcss/vite), TypeScript strict, Observable Plot, Vitest, Playwright, gts

---

## Task 1: Initialize Astro Project

**Files:**
- Create: `pelican-site/package.json`
- Create: `pelican-site/astro.config.ts`
- Create: `pelican-site/tsconfig.json`
- Create: `pelican-site/src/pages/index.astro`

**Step 1: Backup and remove old pelican-site**

```bash
cd /home/cbenge/github/typos_field_experiment/.worktrees/astro-site
mv pelican-site pelican-site-backup
```

**Step 2: Create new Astro project**

```bash
npm create astro@latest pelican-site -- --template minimal --no-git --install --typescript strict
```

When prompted, accept defaults.

**Step 3: Verify project created**

```bash
ls pelican-site/
```

Expected: `astro.config.mjs`, `package.json`, `src/`, `tsconfig.json`, `public/`

**Step 4: Rename config to TypeScript**

```bash
mv pelican-site/astro.config.mjs pelican-site/astro.config.ts
```

**Step 5: Update astro.config.ts for GitHub Pages**

```typescript
// pelican-site/astro.config.ts
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cbenge509.github.io',
  base: '/typos_field_experiment',
  output: 'static',
  trailingSlash: 'never',
});
```

**Step 6: Run dev server to verify**

```bash
cd pelican-site && npm run dev
```

Expected: Server starts at http://localhost:4321

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: initialize Astro 5.x project for GitHub Pages"
```

---

## Task 2: Configure Tailwind CSS v4 with Vite

**Files:**
- Modify: `pelican-site/package.json`
- Create: `pelican-site/vite.config.ts`
- Create: `pelican-site/src/styles/global.css`
- Modify: `pelican-site/astro.config.ts`

**Step 1: Install Tailwind CSS v4 and Vite plugin**

```bash
cd pelican-site && npm install tailwindcss @tailwindcss/vite
```

**Step 2: Create vite.config.ts**

```typescript
// pelican-site/vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

**Step 3: Update astro.config.ts to use Vite config**

```typescript
// pelican-site/astro.config.ts
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://cbenge509.github.io',
  base: '/typos_field_experiment',
  output: 'static',
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**Step 4: Create global.css with Tailwind directives and theme**

```css
/* pelican-site/src/styles/global.css */
@import 'tailwindcss';

/* Custom theme tokens */
@theme {
  /* Light mode colors */
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;
  --color-accent: #003262;
  --color-accent-hover: #3b7ea1;
  --color-highlight: #fdb515;
  --color-border: #e5e7eb;

  /* Berkeley palette */
  --color-berkeley-blue: #003262;
  --color-california-gold: #fdb515;
  --color-founders-rock: #3b7ea1;
  --color-medalist: #c4820e;
  --color-bay-fog: #ddd5c7;

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

/* Dark mode overrides */
.dark {
  --color-bg: #0f0f0f;
  --color-text: #f5f5f5;
  --color-text-muted: #9ca3af;
  --color-accent: #60a5fa;
  --color-accent-hover: #93c5fd;
  --color-highlight: #fbbf24;
  --color-border: #374151;
}

/* Base styles */
body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}
```

**Step 5: Create test page to verify Tailwind**

```astro
---
// pelican-site/src/pages/index.astro
import '../styles/global.css';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Typos Field Experiment</title>
  </head>
  <body class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
    <main class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-[var(--color-accent)]">
        Tailwind v4 Working
      </h1>
      <p class="mt-4 text-[var(--color-text-muted)]">
        If you see this styled, Tailwind is configured correctly.
      </p>
    </main>
  </body>
</html>
```

**Step 6: Run dev server and verify styling**

```bash
npm run dev
```

Expected: Blue heading, gray paragraph text, white background

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: configure Tailwind CSS v4 with Vite plugin"
```

---

## Task 3: Configure gts (Google TypeScript Style)

**Files:**
- Modify: `pelican-site/package.json`
- Create: `pelican-site/.eslintrc.json`
- Create: `pelican-site/.prettierrc.js`

**Step 1: Install gts**

```bash
cd pelican-site && npm install --save-dev gts typescript
```

**Step 2: Initialize gts**

```bash
npx gts init --yes
```

**Step 3: Update package.json scripts**

Add to `scripts` in package.json:

```json
{
  "scripts": {
    "lint": "gts lint",
    "fix": "gts fix",
    "clean": "gts clean"
  }
}
```

**Step 4: Update tsconfig.json to extend gts and Astro**

```json
{
  "extends": ["astro/tsconfigs/strict", "./node_modules/gts/tsconfig-google.json"],
  "compilerOptions": {
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "strictNullChecks": true
  },
  "include": ["src/**/*", "e2e/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 5: Run lint to verify**

```bash
npm run lint
```

Expected: No errors (or only Astro-specific warnings we'll address)

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: configure gts for linting and formatting"
```

---

## Task 4: Configure Vitest

**Files:**
- Modify: `pelican-site/package.json`
- Create: `pelican-site/vitest.config.ts`
- Create: `pelican-site/src/utils/theme.ts`
- Create: `pelican-site/src/utils/theme.test.ts`

**Step 1: Install Vitest**

```bash
cd pelican-site && npm install --save-dev vitest @vitest/coverage-v8
```

**Step 2: Create vitest.config.ts**

```typescript
// pelican-site/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'dist/', 'e2e/'],
    },
  },
});
```

**Step 3: Update package.json scripts**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Step 4: Create theme utility for testing**

```typescript
// pelican-site/src/utils/theme.ts
export type Theme = 'light' | 'dark';

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function getStoredTheme(): Theme | null {
  if (typeof localStorage === 'undefined') return null;
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return null;
}

export function getEffectiveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function setTheme(theme: Theme): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}

export function toggleTheme(): Theme {
  const current = getEffectiveTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
```

**Step 5: Create test file (co-located)**

```typescript
// pelican-site/src/utils/theme.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStoredTheme, getEffectiveTheme, type Theme } from './theme';

describe('theme utilities', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  describe('getStoredTheme', () => {
    it('returns null when no theme stored', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      expect(getStoredTheme()).toBeNull();
    });

    it('returns "dark" when dark theme stored', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('returns "light" when light theme stored', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light');
      expect(getStoredTheme()).toBe('light');
    });

    it('returns null for invalid stored value', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid');
      expect(getStoredTheme()).toBeNull();
    });
  });
});
```

**Step 6: Run tests**

```bash
npm test
```

Expected: 4 tests pass

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: configure Vitest with co-located tests"
```

---

## Task 5: Configure Playwright

**Files:**
- Modify: `pelican-site/package.json`
- Create: `pelican-site/playwright.config.ts`
- Create: `pelican-site/e2e/smoke.spec.ts`

**Step 1: Install Playwright**

```bash
cd pelican-site && npm install --save-dev @playwright/test
```

**Step 2: Install browsers**

```bash
npx playwright install chromium firefox webkit
```

**Step 3: Create playwright.config.ts**

```typescript
// pelican-site/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: 'html',
  timeout: 30000,

  use: {
    baseURL: 'http://localhost:4321/typos_field_experiment',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321/typos_field_experiment',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

**Step 4: Create e2e directory and smoke test**

```typescript
// pelican-site/e2e/smoke.spec.ts
import { test, expect } from '@playwright/test';

test.describe('smoke tests', () => {
  test('page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Typos/i);
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });
});
```

**Step 5: Update package.json scripts**

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

**Step 6: Build and run E2E tests**

```bash
npm run build && npm run test:e2e
```

Expected: 2 tests pass across 3 browsers (6 total)

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: configure Playwright E2E tests for 3 browsers"
```

---

## Task 6: Create Base Layout with Theme Support

**Files:**
- Create: `pelican-site/src/layouts/BaseLayout.astro`
- Create: `pelican-site/src/components/layout/ThemeToggle.astro`
- Modify: `pelican-site/src/pages/index.astro`

**Step 1: Create BaseLayout.astro**

```astro
---
// pelican-site/src/layouts/BaseLayout.astro
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Academic research on grammatical errors and perceived intelligence' } = Astro.props;
const baseUrl = import.meta.env.BASE_URL;
---

<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href={`${baseUrl}/favicon.svg`} />
    <title>{title}</title>

    <!-- Prevent flash of wrong theme -->
    <script is:inline>
      const theme = localStorage.getItem('theme') ??
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    </script>

    <!-- Inter font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
    <slot />
  </body>
</html>
```

**Step 2: Create ThemeToggle.astro**

```astro
---
// pelican-site/src/components/layout/ThemeToggle.astro
---

<button
  id="theme-toggle"
  type="button"
  aria-label="Toggle dark mode"
  class="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors"
>
  <!-- Sun icon (shown in dark mode) -->
  <svg
    class="w-5 h-5 hidden dark:block"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
  <!-- Moon icon (shown in light mode) -->
  <svg
    class="w-5 h-5 block dark:hidden"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
</button>

<script>
  const toggle = document.getElementById('theme-toggle');

  toggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
</script>
```

**Step 3: Update index.astro to use layout**

```astro
---
// pelican-site/src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import ThemeToggle from '../components/layout/ThemeToggle.astro';
---

<BaseLayout title="Do Grammatical Errors Affect Perceived Intelligence?">
  <header class="sticky top-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-sm border-b border-[var(--color-border)]">
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-lg font-semibold text-[var(--color-accent)]">Typos Study</h1>
      <ThemeToggle />
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold mb-4">
      Do Grammatical Errors in Social Media Posts Affect the Perception of Authors' Intelligence?
    </h2>
    <p class="text-[var(--color-text-muted)]">
      Layout and theme toggle working. Content migration next.
    </p>
  </main>
</BaseLayout>
```

**Step 4: Test theme toggle**

```bash
npm run dev
```

Expected: Click toggle, page switches between light/dark mode

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add BaseLayout and ThemeToggle components"
```

---

## Task 7: Create Sticky Table of Contents

**Files:**
- Create: `pelican-site/src/components/layout/TableOfContents.astro`
- Modify: `pelican-site/src/pages/index.astro`

**Step 1: Create TableOfContents.astro**

See full component code in design document. The component:
- Renders a nested list of TOC items
- Uses IntersectionObserver to highlight active section
- Is hidden on mobile via CSS

**Step 2: Update index.astro with TOC and sections**

Add section structure with proper IDs matching TOC items.

**Step 3: Test TOC navigation**

```bash
npm run dev
```

Expected: TOC visible on left, clicking links scrolls to sections, active section highlighted

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add sticky Table of Contents with section highlighting"
```

---

## Task 8: Migrate Static Images

**Files:**
- Copy: `pelican-site-backup/content/img/*` to `pelican-site/public/img/`

**Step 1: Create public/img directory**

```bash
mkdir -p pelican-site/public/img
```

**Step 2: Copy images from backup**

```bash
cp -r pelican-site-backup/content/img/* pelican-site/public/img/
```

**Step 3: Verify images copied**

```bash
ls pelican-site/public/img/
```

Expected: `social_media/`, `bayes/`, `*.png` files

**Step 4: Remove .DS_Store files**

```bash
find pelican-site/public/img -name '.DS_Store' -delete
```

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: migrate static images from Pelican site"
```

---

## Task 9: Install Observable Plot and Create First Chart

**Files:**
- Modify: `pelican-site/package.json`
- Create: `pelican-site/src/data/participants.json`
- Create: `pelican-site/src/components/charts/ParticipantCount.astro`

**Step 1: Install Observable Plot and D3**

```bash
cd pelican-site && npm install @observablehq/plot d3
```

**Step 2: Create chart data file**

```json
{
  "pilot": [
    { "treatment": "Control", "count": 12 },
    { "treatment": "Typographical", "count": 13 },
    { "treatment": "Phonological", "count": 6 }
  ],
  "live": {
    "amazon": [
      { "treatment": "Control", "count": 20 },
      { "treatment": "Typographical", "count": 18 },
      { "treatment": "Phonological", "count": 18 }
    ],
    "xlab": [
      { "treatment": "Control", "count": 73 },
      { "treatment": "Typographical", "count": 71 },
      { "treatment": "Phonological", "count": 65 }
    ]
  }
}
```

**Step 3: Create ParticipantCount chart component**

The component uses Observable Plot to render bar charts with Berkeley colors.

**Step 4: Add chart to index.astro pilot section**

**Step 5: Test chart renders**

```bash
npm run dev
```

Expected: Bar chart displays with Berkeley colors, tooltip on hover

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add Observable Plot ParticipantCount chart"
```

---

## Task 10: Create Remaining Chart Components

Create chart components for:
- DivergencePlot (Likert scale divergence)
- DemographicChart (gender, country, state, etc.)
- LikertVariance
- WpmByGroup

Each follows the same pattern as ParticipantCount.

---

## Task 11: Migrate Article Content

**Files:**
- Create: `pelican-site/src/components/content/Section.astro`
- Create: `pelican-site/src/components/content/Figure.astro`
- Create: `pelican-site/src/components/content/StatTable.astro`

Create reusable content components and migrate the article text from final_project.md.

---

## Task 12: Add Footer and Author Section

Create Footer.astro with author links and GitHub repository link.

---

## Task 13: Write E2E Tests for All Features

**Files:**
- Create: `pelican-site/e2e/navigation.spec.ts`
- Create: `pelican-site/e2e/theme.spec.ts`
- Create: `pelican-site/e2e/charts.spec.ts`

Test navigation, theme toggle persistence, and chart rendering.

---

## Task 14: Create GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

CI/CD pipeline that runs lint, unit tests, builds, runs E2E tests, and deploys to GitHub Pages.

---

## Task 15: Final Cleanup and PR

- Remove pelican-site-backup
- Update CLAUDE.md
- Run full test suite
- Create PR

---

## Success Criteria

- [ ] Astro project builds without errors
- [ ] All 17 charts render correctly
- [ ] Dark mode toggle works and persists
- [ ] TOC navigation highlights active section
- [ ] All unit tests pass (Vitest)
- [ ] All E2E tests pass across 3 browsers (Playwright)
- [ ] gts linting passes
- [ ] GitHub Actions workflow succeeds
- [ ] Site deploys to GitHub Pages
