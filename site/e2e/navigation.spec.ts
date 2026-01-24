// pelican-site/e2e/navigation.spec.ts
import {test, expect} from '@playwright/test';

test.describe('Navigation and Table of Contents', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/typos_field_experiment/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Section IDs', () => {
    const expectedSections = [
      'abstract',
      'introduction',
      'related-work',
      'methods',
      'results',
      'discussion',
      'conclusion',
      'references',
    ];

    for (const sectionId of expectedSections) {
      test(`section "${sectionId}" exists`, async ({page}) => {
        const section = page.locator(`section#${sectionId}`);
        await expect(section).toBeVisible();
      });
    }
  });

  test.describe('Table of Contents', () => {
    test('TOC navigation element exists', async ({page}) => {
      const toc = page.locator('nav#toc');
      // TOC is hidden on mobile, visible on desktop (lg breakpoint)
      // Check it exists in DOM
      await expect(toc).toHaveCount(1);
    });

    test('TOC contains all section links', async ({page}) => {
      const tocLinks = page.locator('nav#toc .toc-link');
      // There should be 8 main sections
      await expect(tocLinks).toHaveCount(8);
    });

    test('TOC links have correct href attributes', async ({page}) => {
      const expectedLinks = [
        '#abstract',
        '#introduction',
        '#related-work',
        '#methods',
        '#results',
        '#discussion',
        '#conclusion',
        '#references',
      ];

      for (const href of expectedLinks) {
        const link = page.locator(`nav#toc a[href="${href}"]`);
        await expect(link).toHaveCount(1);
      }
    });

    test('clicking TOC link scrolls to section', async ({page}) => {
      // Set viewport to desktop size so TOC is visible
      await page.setViewportSize({width: 1280, height: 800});

      // Click on the "Methods" TOC link
      const methodsLink = page.locator('nav#toc a[href="#methods"]');
      await methodsLink.click();

      // Wait for scroll animation
      await page.waitForTimeout(500);

      // Check that the methods section is now in view
      const methodsSection = page.locator('section#methods');
      await expect(methodsSection).toBeInViewport();
    });

    test('TOC link highlights when section is visible', async ({page}) => {
      // Set viewport to desktop size
      await page.setViewportSize({width: 1280, height: 800});

      // Navigate to introduction section
      await page.locator('section#introduction').scrollIntoViewIfNeeded();

      // Wait for intersection observer to trigger
      await page.waitForTimeout(500);

      // Check that the introduction TOC link has the active style
      const introLink = page.locator('nav#toc a[data-id="introduction"]');
      // Active links should have the accent color class
      await expect(introLink).toHaveClass(/font-medium/);
    });
  });

  test.describe('Sticky Header', () => {
    test('header exists and is sticky', async ({page}) => {
      const header = page.locator('header.sticky');
      await expect(header).toBeVisible();
      await expect(header).toHaveCSS('position', 'sticky');
    });

    test('header contains site title', async ({page}) => {
      const title = page.locator('header h1');
      await expect(title).toContainText(
        'Study: How Typos Affect Perception of Intelligence',
      );
    });

    test('header contains theme toggle', async ({page}) => {
      const themeToggle = page.locator('header #theme-toggle');
      await expect(themeToggle).toBeVisible();
    });

    test('header remains visible when scrolling', async ({page}) => {
      // Scroll down the page
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(100);

      // Header should still be visible
      const header = page.locator('header.sticky');
      await expect(header).toBeVisible();
      await expect(header).toBeInViewport();
    });
  });

  test.describe('Smooth Scrolling', () => {
    test('html element has smooth scroll class', async ({page}) => {
      const html = page.locator('html');
      await expect(html).toHaveClass(/scroll-smooth/);
    });

    test('sections have scroll margin for sticky header', async ({page}) => {
      // Check that sections have scroll-mt class for offset
      const section = page.locator('section#abstract');
      await expect(section).toHaveClass(/scroll-mt-20/);
    });
  });

  test.describe('Footer', () => {
    test('footer exists', async ({page}) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('footer contains author information', async ({page}) => {
      const footer = page.locator('footer');
      await expect(footer).toContainText('Cristopher Benge');
    });

    test('footer contains GitHub link', async ({page}) => {
      const githubLink = page.locator(
        'footer a[href*="github.com/cbenge509/typos_field_experiment"]',
      );
      await expect(githubLink).toBeVisible();
    });
  });
});
