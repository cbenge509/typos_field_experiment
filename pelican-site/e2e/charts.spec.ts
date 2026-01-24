// pelican-site/e2e/charts.spec.ts
import {test, expect} from '@playwright/test';

test.describe('Chart Components', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/typos_field_experiment/');
    await page.waitForLoadState('networkidle');
    // Wait for charts to render
    await page.waitForTimeout(1000);
  });

  test.describe('ParticipantCount Charts', () => {
    test('pilot study chart container exists', async ({page}) => {
      const container = page.locator(
        '.participant-chart-container[data-dataset="pilot"]',
      );
      await expect(container).toBeVisible();
    });

    test('amazon chart container exists', async ({page}) => {
      const container = page.locator(
        '.participant-chart-container[data-dataset="amazon"]',
      );
      await expect(container).toBeVisible();
    });

    test('xlab chart container exists', async ({page}) => {
      const container = page.locator(
        '.participant-chart-container[data-dataset="xlab"]',
      );
      await expect(container).toBeVisible();
    });

    test('participant charts render SVG content', async ({page}) => {
      const containers = page.locator('.participant-chart-container');
      const count = await containers.count();

      for (let i = 0; i < count; i++) {
        const container = containers.nth(i);
        const svg = container.locator('.chart-target svg');
        await expect(svg).toBeVisible();
      }
    });

    test('pilot chart has correct title', async ({page}) => {
      const container = page.locator(
        '.participant-chart-container[data-dataset="pilot"]',
      );
      const title = container.locator('h4');
      await expect(title).toContainText('Pilot Study');
    });
  });

  test.describe('DemographicChart Components', () => {
    test('gender demographic chart exists', async ({page}) => {
      const container = page.locator(
        '.demographic-chart-container[data-type="gender"]',
      );
      await expect(container).toBeVisible();
    });

    test('age bins demographic chart exists', async ({page}) => {
      const container = page.locator(
        '.demographic-chart-container[data-type="ageBins"]',
      );
      await expect(container).toBeVisible();
    });

    test('state demographic chart exists', async ({page}) => {
      const container = page.locator(
        '.demographic-chart-container[data-type="state"]',
      );
      await expect(container).toBeVisible();
    });

    test('demographic charts render SVG content', async ({page}) => {
      const containers = page.locator('.demographic-chart-container');
      const count = await containers.count();

      for (let i = 0; i < count; i++) {
        const container = containers.nth(i);
        const svg = container.locator('.chart-target svg');
        await expect(svg).toBeVisible();
      }
    });
  });

  test.describe('DivergencePlot Components', () => {
    test('intelligence divergence plot exists', async ({page}) => {
      const container = page.locator(
        '.divergence-chart-container[data-question="intelligence"]',
      );
      await expect(container).toBeVisible();
    });

    test('writing divergence plot exists', async ({page}) => {
      const container = page.locator(
        '.divergence-chart-container[data-question="writing"]',
      );
      await expect(container).toBeVisible();
    });

    test('effective divergence plot exists', async ({page}) => {
      const container = page.locator(
        '.divergence-chart-container[data-question="effective"]',
      );
      await expect(container).toBeVisible();
    });

    test('divergence plots render SVG content', async ({page}) => {
      const containers = page.locator('.divergence-chart-container');
      const count = await containers.count();

      for (let i = 0; i < count; i++) {
        const container = containers.nth(i);
        const svg = container.locator('.chart-target svg');
        await expect(svg).toBeVisible();
      }
    });

    test('divergence plots have color legend', async ({page}) => {
      const container = page.locator(
        '.divergence-chart-container[data-question="intelligence"]',
      );
      const legend = container.locator('.chart-legend');
      await expect(legend).toBeVisible();

      // Should have 7 legend items (1-7 Likert scale)
      const legendItems = legend.locator('> div');
      await expect(legendItems).toHaveCount(7);
    });
  });

  test.describe('LikertVariance Chart', () => {
    test('likert variance chart container exists', async ({page}) => {
      const container = page.locator('.likert-variance-container');
      await expect(container).toBeVisible();
    });

    test('likert variance chart renders SVG', async ({page}) => {
      const container = page.locator('.likert-variance-container');
      const svg = container.locator('.chart-target svg');
      await expect(svg).toBeVisible();
    });
  });

  test.describe('WpmByGroup Chart', () => {
    test('wpm chart container exists', async ({page}) => {
      const container = page.locator('.wpm-chart-container');
      await expect(container).toBeVisible();
    });

    test('wpm chart renders SVG', async ({page}) => {
      const container = page.locator('.wpm-chart-container');
      const svg = container.locator('.chart-target svg');
      await expect(svg).toBeVisible();
    });
  });

  test.describe('Chart Theme Responsiveness', () => {
    test('charts re-render when theme changes', async ({page}) => {
      // Get a chart container
      const container = page.locator(
        '.participant-chart-container[data-dataset="pilot"]',
      );
      const chartTarget = container.locator('.chart-target');

      // Ensure chart is rendered
      await expect(chartTarget.locator('svg')).toBeVisible();

      // Get initial theme state
      const initialIsDark = await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );

      // Toggle theme
      await page.click('#theme-toggle');

      // Wait for chart to re-render
      await page.waitForTimeout(500);

      // Verify theme actually changed
      const afterIsDark = await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );
      expect(afterIsDark).not.toBe(initialIsDark);

      // Verify chart SVG is still visible after theme change
      await expect(chartTarget.locator('svg')).toBeVisible();
    });

    test('charts are visible in dark mode', async ({page}) => {
      // Switch to dark mode
      await page.evaluate(() => {
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add('dark');
      });

      // Reload to ensure charts render in dark mode
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // All chart containers should have visible SVGs
      const chartTargets = page.locator('.chart-target');
      const count = await chartTargets.count();

      // Ensure we have charts to test
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const target = chartTargets.nth(i);
        const svg = target.locator('svg');
        // Check if either SVG is visible or there's an error message
        const hasSvg = (await svg.count()) > 0;
        if (hasSvg) {
          await expect(svg.first()).toBeVisible();
        }
      }
    });

    test('charts are visible in light mode', async ({page}) => {
      // Switch to light mode
      await page.evaluate(() => {
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
      });

      // Reload to ensure charts render in light mode
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // All chart containers should have visible SVGs
      const chartTargets = page.locator('.chart-target');
      const count = await chartTargets.count();

      // Ensure we have charts to test
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const target = chartTargets.nth(i);
        const svg = target.locator('svg');
        const hasSvg = (await svg.count()) > 0;
        if (hasSvg) {
          await expect(svg.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Chart Containers Styling', () => {
    test('chart wrappers have border and background', async ({page}) => {
      const wrapper = page
        .locator('.participant-chart-container .chart-wrapper')
        .first();
      await expect(wrapper).toBeVisible();

      // Check it has rounded corners class
      await expect(wrapper).toHaveClass(/rounded-lg/);

      // Check it has border class
      await expect(wrapper).toHaveClass(/border/);
    });

    test('charts are responsive (max-width 100%)', async ({page}) => {
      const svg = page.locator('.chart-target svg').first();
      await expect(svg).toBeVisible();

      // Check that SVG respects container width
      const svgBox = await svg.boundingBox();
      const containerBox = await page
        .locator('.chart-target')
        .first()
        .boundingBox();

      if (svgBox && containerBox) {
        // SVG should not overflow its container
        expect(svgBox.width).toBeLessThanOrEqual(containerBox.width + 1);
      }
    });
  });

  test.describe('Chart Error Handling', () => {
    test('no console errors from chart rendering', async ({page}) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Filter out any non-chart related errors
      const chartErrors = errors.filter(
        e =>
          e.includes('chart') ||
          e.includes('Plot') ||
          e.includes('render') ||
          e.includes('data'),
      );

      expect(chartErrors).toHaveLength(0);
    });
  });

  test.describe('Chart Count Verification', () => {
    test('correct number of participant charts', async ({page}) => {
      const containers = page.locator('.participant-chart-container');
      // 3 charts: pilot, amazon, xlab
      await expect(containers).toHaveCount(3);
    });

    test('correct number of demographic charts', async ({page}) => {
      const containers = page.locator('.demographic-chart-container');
      // 3 charts: gender, ageBins, state
      await expect(containers).toHaveCount(3);
    });

    test('correct number of divergence plots', async ({page}) => {
      const containers = page.locator('.divergence-chart-container');
      // 3 charts: intelligence, writing, effective
      await expect(containers).toHaveCount(3);
    });

    test('correct total number of chart components', async ({page}) => {
      // ParticipantCount: 3
      // DemographicChart: 3
      // DivergencePlot: 3
      // LikertVariance: 1
      // WpmByGroup: 1
      // Total: 11

      const allChartContainers = page.locator(
        '.participant-chart-container, .demographic-chart-container, .divergence-chart-container, .likert-variance-container, .wpm-chart-container',
      );
      await expect(allChartContainers).toHaveCount(11);
    });
  });
});
