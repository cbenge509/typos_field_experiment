// pelican-site/e2e/smoke.spec.ts
import {test, expect} from '@playwright/test';

test.describe('smoke tests', () => {
  test('page loads successfully', async ({page}) => {
    await page.goto('/typos_field_experiment/');
    await expect(page).toHaveTitle(/Grammatical Errors|Intelligence/i);
  });

  test('no console errors on load', async ({page}) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/typos_field_experiment/');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });

  test('theme toggle switches between light and dark mode', async ({page}) => {
    await page.goto('/typos_field_experiment/');

    // Get the html element to check for dark class
    const html = page.locator('html');

    // Check initial state (depends on system preference, but toggle should work)
    const initialHasDark = await html.evaluate(el =>
      el.classList.contains('dark'),
    );

    // Click the theme toggle button
    await page.click('#theme-toggle');

    // Wait for the class to change
    await page.waitForTimeout(100);

    // Verify the dark class toggled
    const afterClickHasDark = await html.evaluate(el =>
      el.classList.contains('dark'),
    );
    expect(afterClickHasDark).toBe(!initialHasDark);

    // Click again to toggle back
    await page.click('#theme-toggle');
    await page.waitForTimeout(100);

    // Verify we're back to initial state
    const afterSecondClickHasDark = await html.evaluate(el =>
      el.classList.contains('dark'),
    );
    expect(afterSecondClickHasDark).toBe(initialHasDark);
  });
});
