// pelican-site/e2e/smoke.spec.ts
import {test, expect} from '@playwright/test';

test.describe('smoke tests', () => {
  test('page loads successfully', async ({page}) => {
    await page.goto('/typos_field_experiment/');
    await expect(page).toHaveTitle(/Typos/i);
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
});
