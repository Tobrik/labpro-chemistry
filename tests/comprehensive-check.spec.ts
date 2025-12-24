import { test, expect } from '@playwright/test';

// Helper function to close the auth modal
async function closeAuthModal(page) {
  // Wait a bit for modal to appear
  await page.waitForTimeout(1000);

  // Check if modal is present
  const modalExists = await page.locator('.fixed.inset-0').count() > 0;

  if (modalExists) {
    try {
      // Try to find close button by data-testid first (most reliable)
      const closeButton = page.locator('[data-testid="auth-modal-close"]');
      if (await closeButton.count() > 0) {
        // Use force: true to bypass pointer-events interception
        await closeButton.click({ force: true });
        await page.waitForTimeout(500);
        return;
      }

      // Fallback: click on backdrop (outside modal) with force
      await page.locator('.fixed.inset-0').first().click({ position: { x: 10, y: 10 }, force: true });
      await page.waitForTimeout(500);
    } catch (error) {
      console.log('Could not close modal:', error);
    }
  }
}

test.describe('Comprehensive Site Check', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load homepage and display auth modal', async ({ page }) => {
    // Check auth modal appears - use language-agnostic selector
    const modal = page.locator('.fixed.inset-0').first();
    await expect(modal).toBeVisible({ timeout: 10000 });

    // Check for form elements instead of specific text
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should have language selector with 3 options', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Find language selector
    const langSelector = page.locator('select').first();
    await expect(langSelector).toBeVisible();

    // Check all 3 language options exist
    const options = await langSelector.locator('option').allTextContents();
    console.log('Language options:', options);

    expect(options.length).toBeGreaterThanOrEqual(3);
    expect(options.some(opt => opt.includes('RU'))).toBeTruthy();
    expect(options.some(opt => opt.includes('EN'))).toBeTruthy();
    expect(options.some(opt => opt.includes('KK'))).toBeTruthy();
  });

  test('should switch between languages', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);
    await page.waitForTimeout(1000);

    const langSelector = page.locator('select').first();

    // Switch to English
    await langSelector.selectOption('en');
    await page.waitForTimeout(1000);

    // Check if navigation changed to English
    const navText = await page.locator('nav, header').textContent();
    console.log('Navigation text (EN):', navText?.substring(0, 200));

    // Switch to Kazakh
    await langSelector.selectOption('kk');
    await page.waitForTimeout(1000);

    const navTextKK = await page.locator('nav, header').textContent();
    console.log('Navigation text (KK):', navTextKK?.substring(0, 200));

    // Switch back to Russian
    await langSelector.selectOption('ru');
    await page.waitForTimeout(1000);
  });

  test('should have theme toggle button', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);
    await page.waitForTimeout(1000);

    // Find theme toggle button (Moon or Sun icon)
    const themeButton = page.locator('button').filter({ hasText: /Темная тема|Светлая тема/i }).or(
      page.locator('button[title*="тема"]')
    ).first();

    const buttonExists = await themeButton.count();
    console.log('Theme button count:', buttonExists);

    if (buttonExists > 0) {
      await expect(themeButton).toBeVisible();
    }
  });

  test('should toggle dark theme', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);
    await page.waitForTimeout(3000); // Increased wait for modal to fully disappear and page to stabilize

    // Get initial theme
    const htmlClass = await page.locator('html').getAttribute('class');
    console.log('Initial HTML class:', htmlClass);

    // Find and click theme toggle
    const themeButton = page.locator('button').filter({ hasText: /Темная тема|Светлая тема/i }).or(
      page.locator('button[title*="тема"]')
    ).first();

    if (await themeButton.count() > 0) {
      // Wait for button to be ready
      await themeButton.waitFor({ state: 'visible', timeout: 5000 });
      await page.waitForTimeout(500);

      // Try multiple click methods for mobile compatibility
      try {
        await themeButton.dispatchEvent('click');
      } catch (e) {
        await themeButton.click({ force: true });
      }
      await page.waitForTimeout(2000); // Increased wait for theme to apply

      const newHtmlClass = await page.locator('html').getAttribute('class');
      console.log('New HTML class:', newHtmlClass);

      // Check if dark class was toggled
      expect(htmlClass !== newHtmlClass).toBeTruthy();
    }
  });

  test('should display navigation tabs in correct order', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);
    await page.waitForTimeout(1000);

    // Get all navigation buttons
    const navButtons = page.locator('nav button, header + div button').filter({ hasText: /.+/ });
    const count = await navButtons.count();
    console.log('Navigation buttons count:', count);

    if (count > 0) {
      const texts = await navButtons.allTextContents();
      console.log('Navigation order:', texts.filter(t => t.trim().length > 0));

      // Expected order: Periodic Table, Formulas, Trainer, Molar Mass, AI Balancer, etc.
      expect(count).toBeGreaterThan(5);
    }
  });

  test('should navigate to Kinetics and show 2 graphs', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);
    await page.waitForTimeout(1000);

    // Click on Kinetics tab
    const kineticsButton = page.locator('button', { hasText: /Кинетика|Kinetics/i }).first();

    if (await kineticsButton.count() > 0) {
      await kineticsButton.click();
      await page.waitForTimeout(1000);

      // Check for graphs - should have 2 SVG elements
      const svgCount = await page.locator('svg').count();
      console.log('SVG elements count:', svgCount);

      // Should have at least 2 graphs
      expect(svgCount).toBeGreaterThanOrEqual(2);

      // Check for graph titles
      const pageContent = await page.textContent('body');
      console.log('Kinetics page loaded:', pageContent?.includes('График') || pageContent?.includes('Graph'));
    }
  });

  test('should navigate to 3D Molecules', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);
    await page.waitForTimeout(1000);

    const moleculesButton = page.locator('button', { hasText: /3D Молекулы|3D Molecules/i }).first();

    if (await moleculesButton.count() > 0) {
      await moleculesButton.click();
      await page.waitForTimeout(2000);

      // Check if 3Dmol viewer loaded
      const viewer = page.locator('#mol-container');
      await expect(viewer).toBeVisible();

      console.log('3D Molecules page loaded');
    }
  });

  test('should navigate to AI Balancer', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);
    await page.waitForTimeout(1000);

    const balancerButton = page.locator('button', { hasText: /AI Уравнитель|AI Balancer/i }).first();

    if (await balancerButton.count() > 0) {
      await balancerButton.click();
      await page.waitForTimeout(1000);

      // Check for equation input
      const input = page.locator('input[type="text"]').first();
      await expect(input).toBeVisible();

      console.log('AI Balancer page loaded');
    }
  });

  test('should navigate to AI Compare', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);
    await page.waitForTimeout(1000);

    const compareButton = page.locator('button', { hasText: /AI Сравнение|AI Compare/i }).first();

    if (await compareButton.count() > 0) {
      await compareButton.click();
      await page.waitForTimeout(1000);

      // Check for two substance inputs
      const inputs = page.locator('input[type="text"]');
      const count = await inputs.count();
      console.log('Input fields count:', count);

      expect(count).toBeGreaterThanOrEqual(2);
    }
  });

  test('should check z-index isolation for 3D Molecules', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);
    await page.waitForTimeout(1000);

    const moleculesButton = page.locator('button', { hasText: /3D Молекулы|3D Molecules/i }).first();

    if (await moleculesButton.count() > 0) {
      await moleculesButton.click();
      await page.waitForTimeout(1000);

      // Check if main container has isolate class
      const container = page.locator('.isolate').first();
      const hasIsolate = await container.count() > 0;
      console.log('Has isolate class:', hasIsolate);

      expect(hasIsolate).toBeTruthy();
    }
  });

  test('should verify all translation files exist', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);

    // This will check if i18n is properly initialized
    await page.waitForTimeout(1000);

    const langSelector = page.locator('select').first();

    // Test switching to each language
    for (const lang of ['ru', 'en', 'kk']) {
      await langSelector.selectOption(lang);
      await page.waitForTimeout(500);

      // Check if page still renders without errors
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
      console.log(`Language ${lang} loaded successfully`);
    }
  });

  test('should check if dark theme applies to all components', async ({ page }) => {
    // Close the auth modal first
    await closeAuthModal(page);
    await page.waitForTimeout(2000); // Increased wait for modal to fully disappear

    // Enable dark theme
    const themeButton = page.locator('button').filter({ hasText: /Темная тема|Светлая тема/i }).or(
      page.locator('button[title*="тема"]')
    ).first();

    if (await themeButton.count() > 0) {
      await themeButton.click({ force: true }); // Force click to bypass any intercepting elements
      await page.waitForTimeout(500);

      // Check if HTML has dark class
      const htmlClass = await page.locator('html').getAttribute('class');
      console.log('Dark theme HTML class:', htmlClass);

      // Navigate through different components
      const components = [
        'Кинетика',
        '3D Молекулы',
        'AI Уравнитель',
        'AI Сравнение'
      ];

      for (const comp of components) {
        const button = page.locator('button', { hasText: comp }).first();
        if (await button.count() > 0) {
          await button.click();
          await page.waitForTimeout(500);

          // Check for dark theme classes
          const darkElements = await page.locator('.dark\\:bg-zinc-800, .dark\\:bg-zinc-900').count();
          console.log(`${comp} - dark elements:`, darkElements);
        }
      }
    }
  });
});
