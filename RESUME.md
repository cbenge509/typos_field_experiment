# Astro Site Implementation - Resume Point

**Last Updated:** 2026-01-23
**Branch:** `feature/astro-site-redesign`
**Worktree:** `/home/cbenge/github/typos_field_experiment/.worktrees/astro-site`

## Current Status

**Phase:** Implementation (about to start Task 1)

**Completed:**
- [x] Brainstorming/design session (superpowers:brainstorming)
- [x] Design document: `docs/plans/2026-01-23-astro-site-redesign.md`
- [x] Implementation plan: `docs/plans/2026-01-23-astro-site-implementation.md`
- [x] Git worktree created at `.worktrees/astro-site`
- [x] Branch created: `feature/astro-site-redesign`

**Next Step:** Execute Task 1 of 15 - Initialize Astro Project

## How to Resume

```bash
cd /home/cbenge/github/typos_field_experiment/.worktrees/astro-site
```

Then tell Claude:

> Resume the Astro site implementation. Use `superpowers:subagent-driven-development` to execute the plan at `docs/plans/2026-01-23-astro-site-implementation.md`. Start with Task 1.

## Task Summary (15 total)

1. **Initialize Astro Project** - backup pelican-site, create Astro 5.x project
2. **Configure Tailwind CSS v4** - @tailwindcss/vite plugin, Berkeley colors
3. **Configure gts** - Google TypeScript Style linting
4. **Configure Vitest** - unit testing with co-located tests
5. **Configure Playwright** - E2E tests for 3 browsers
6. **Create Base Layout** - theme support, dark mode toggle
7. **Create Sticky TOC** - table of contents with section highlighting
8. **Migrate Images** - copy from pelican-site-backup
9. **Install Observable Plot** - first chart component
10. **Create Remaining Charts** - 17 total chart components
11. **Migrate Article Content** - Section, Figure, StatTable components
12. **Add Footer** - author links, GitHub link
13. **Write E2E Tests** - navigation, theme, charts
14. **Create GitHub Actions** - CI/CD pipeline
15. **Final Cleanup and PR** - remove backup, create PR

## Key Files

- Design: `docs/plans/2026-01-23-astro-site-redesign.md`
- Implementation Plan: `docs/plans/2026-01-23-astro-site-implementation.md`
- Old site backup will be at: `pelican-site-backup/`
- New site will be at: `pelican-site/`

## Tech Stack

- Astro 5.x (static site generator)
- Tailwind CSS v4 (@tailwindcss/vite)
- TypeScript strict mode
- Observable Plot (charts)
- Vitest (unit tests)
- Playwright (E2E tests - Chromium, Firefox, WebKit)
- gts (Google TypeScript Style)
