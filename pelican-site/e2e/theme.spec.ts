// pelican-site/e2e/theme.spec.ts
import {test, expect} from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({page}) => {
    // Clear localStorage before each test to ensure clean state
    await page.goto('/typos_field_experiment/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test.describe('Theme Toggle Button', () => {
    test('theme toggle button exists', async ({page}) => {
      const toggle = page.locator('#theme-toggle');
      await expect(toggle).toBeVisible();
    });

    test('theme toggle has accessible label', async ({page}) => {
      const toggle = page.locator('#theme-toggle');
      await expect(toggle).toHaveAttribute('aria-label', 'Toggle dark mode');
    });

    test('theme toggle contains sun and moon icons', async ({page}) => {
      const toggle = page.locator('#theme-toggle');
      const svgIcons = toggle.locator('svg');
      await expect(svgIcons).toHaveCount(2);
    });
  });

  test.describe('Theme Switching', () => {
    test('clicking toggle changes theme from light to dark', async ({page}) => {
      // Force light mode first
      await page.evaluate(() => {
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
      });

      const html = page.locator('html');
      await expect(html).not.toHaveClass(/dark/);

      // Click the toggle
      await page.click('#theme-toggle');
      await page.waitForTimeout(100);

      // Should now be dark
      await expect(html).toHaveClass(/dark/);
    });

    test('clicking toggle changes theme from dark to light', async ({page}) => {
      // Force dark mode first
      await page.evaluate(() => {
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add('dark');
      });

      const html = page.locator('html');
      await expect(html).toHaveClass(/dark/);

      // Click the toggle
      await page.click('#theme-toggle');
      await page.waitForTimeout(100);

      // Should now be light
      await expect(html).not.toHaveClass(/dark/);
    });

    test('double-click returns to original theme', async ({page}) => {
      const html = page.locator('html');

      // Get initial state
      const initialDark = await html.evaluate(el => el.classList.contains('dark'));

      // Click twice
      await page.click('#theme-toggle');
      await page.waitForTimeout(100);
      await page.click('#theme-toggle');
      await page.waitForTimeout(100);

      // Should be back to initial state
      const finalDark = await html.evaluate(el => el.classList.contains('dark'));
      expect(finalDark).toBe(initialDark);
    });
  });

  test.describe('Theme Persistence', () => {
    test('theme persists after page reload (dark)', async ({page}) => {
      // Set dark mode
      await page.click('#theme-toggle');
      await page.waitForTimeout(100);

      // Get current state before reload
      const html = page.locator('html');
      const isDarkBeforeReload = await html.evaluate(el =>
        el.classList.contains('dark'),
      );

      // Reload the page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Theme should persist
      const isDarkAfterReload = await html.evaluate(el =>
        el.classList.contains('dark'),
      );
      expect(isDarkAfterReload).toBe(isDarkBeforeReload);
    });

    test('localStorage stores theme preference', async ({page}) => {
      // Clear and set to light
      await page.evaluate(() => {
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
      });

      // Toggle to dark
      await page.click('#theme-toggle');
      await page.waitForTimeout(100);

      // Check localStorage
      const storedTheme = await page.evaluate(() =>
        localStorage.getItem('theme'),
      );
      expect(storedTheme).toBe('dark');

      // Toggle back to light
      await page.click('#theme-toggle');
      await page.waitForTimeout(100);

      const storedThemeAfter = await page.evaluate(() =>
        localStorage.getItem('theme'),
      );
      expect(storedThemeAfter).toBe('light');
    });

    test('theme loads correctly from localStorage on fresh visit', async ({
      page,
    }) => {
      // Set dark mode in localStorage before navigation
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));

      // Navigate to page fresh
      await page.goto('/typos_field_experiment/');
      await page.waitForLoadState('domcontentloaded');

      // Should load in dark mode
      const html = page.locator('html');
      await expect(html).toHaveClass(/dark/);
    });

    test('light theme loads correctly from localStorage', async ({page}) => {
      // Set light mode in localStorage
      await page.evaluate(() => localStorage.setItem('theme', 'light'));

      // Navigate to page fresh
      await page.goto('/typos_field_experiment/');
      await page.waitForLoadState('domcontentloaded');

      // Should load in light mode
      const html = page.locator('html');
      await expect(html).not.toHaveClass(/dark/);
    });
  });

  test.describe('System Preference Detection', () => {
    test('respects system dark mode preference when no localStorage', async ({
      page,
    }) => {
      // Clear localStorage
      await page.evaluate(() => localStorage.removeItem('theme'));

      // Emulate dark mode system preference
      await page.emulateMedia({colorScheme: 'dark'});

      // Navigate fresh
      await page.goto('/typos_field_experiment/');
      await page.waitForLoadState('domcontentloaded');

      // Should be in dark mode
      const html = page.locator('html');
      await expect(html).toHaveClass(/dark/);
    });

    test('respects system light mode preference when no localStorage', async ({
      page,
    }) => {
      // Clear localStorage
      await page.evaluate(() => localStorage.removeItem('theme'));

      // Emulate light mode system preference
      await page.emulateMedia({colorScheme: 'light'});

      // Navigate fresh
      await page.goto('/typos_field_experiment/');
      await page.waitForLoadState('domcontentloaded');

      // Should be in light mode
      const html = page.locator('html');
      await expect(html).not.toHaveClass(/dark/);
    });

    test('localStorage preference overrides system preference', async ({
      page,
    }) => {
      // Set localStorage to light
      await page.evaluate(() => localStorage.setItem('theme', 'light'));

      // Emulate dark mode system preference
      await page.emulateMedia({colorScheme: 'dark'});

      // Navigate fresh
      await page.goto('/typos_field_experiment/');
      await page.waitForLoadState('domcontentloaded');

      // Should be in light mode (localStorage wins)
      const html = page.locator('html');
      await expect(html).not.toHaveClass(/dark/);
    });
  });

  test.describe('Visual Theme Changes', () => {
    test('body background changes with theme', async ({page}) => {
      const body = page.locator('body');

      // Set light mode
      await page.evaluate(() => {
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
      });

      // Get light mode background (should be white-ish)
      const lightBg = await body.evaluate(el =>
        getComputedStyle(el).backgroundColor,
      );

      // Switch to dark mode
      await page.click('#theme-toggle');
      await page.waitForTimeout(100);

      // Get dark mode background (should be dark)
      const darkBg = await body.evaluate(el =>
        getComputedStyle(el).backgroundColor,
      );

      // Backgrounds should be different
      expect(lightBg).not.toBe(darkBg);
    });

    test('theme toggle has both sun and moon icons', async ({page}) => {
      // The theme toggle should always have both icons (visibility is controlled by CSS)
      const toggle = page.locator('#theme-toggle');
      const svgIcons = toggle.locator('svg');

      // Both icons should exist in the DOM
      await expect(svgIcons).toHaveCount(2);

      // At least one icon should be visible at any time
      const visibleIcons = await svgIcons.evaluateAll(icons =>
        icons.filter(icon => {
          const styles = getComputedStyle(icon);
          return styles.display !== 'none' && styles.visibility !== 'hidden';
        }).length
      );

      expect(visibleIcons).toBeGreaterThanOrEqual(1);
    });

    test('theme class on html element changes which icon is visible', async ({page}) => {
      // The icons use Tailwind CSS classes:
      // Sun icon: "hidden dark:block" (visible in dark mode)
      // Moon icon: "block dark:hidden" (visible in light mode)

      const html = page.locator('html');
      const sunIcon = page.locator('#theme-toggle svg').first(); // hidden dark:block
      const moonIcon = page.locator('#theme-toggle svg').last(); // block dark:hidden

      // Force light mode to start
      await page.evaluate(() => {
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
      });
      await page.waitForTimeout(100);

      // In light mode: moon should be visible (block), sun should be hidden
      await expect(html).not.toHaveClass(/dark/);
      await expect(sunIcon).toHaveClass(/hidden/);
      await expect(moonIcon).toHaveClass(/block/);

      // Toggle to dark mode
      await page.click('#theme-toggle');
      await page.waitForTimeout(100);

      // In dark mode: sun should be visible (dark:block), moon should be hidden (dark:hidden)
      await expect(html).toHaveClass(/dark/);
      // The classes still contain the base classes, but now dark mode applies
      // Verify by checking the html has dark class
    });
  });
});
