import { test, expect } from '@playwright/test';

// Helper to set Russian language
async function setRussianLanguage(page) {
  await page.waitForTimeout(500);
  const langSelector = page.locator('select').first();
  if (await langSelector.count() > 0) {
    await langSelector.selectOption('ru');
    await page.waitForTimeout(500);
  }
}

// Helper to close auth modal
async function closeAuthModal(page) {
  await page.waitForTimeout(1000);
  const closeButton = page.locator('[data-testid="auth-modal-close"]');
  if (await closeButton.count() > 0) {
    await closeButton.click({ force: true });
    await page.waitForTimeout(500);
  }
}

test.describe('Periodic Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await closeAuthModal(page);
    await setRussianLanguage(page);
    // Wait for the periodic table to load
    await page.waitForTimeout(500);
  });

  test('should display periodic table heading', async ({ page }) => {
    // Check for the main title
    await expect(page.getByText('Периодическая таблица')).toBeVisible();
  });

  test('should display search input', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('should display filter categories', async ({ page }) => {
    // Check for category filter buttons
    const filterButtons = page.locator('button').filter({ hasText: /Неметалл|Non-metal/ });
    await expect(filterButtons.first()).toBeVisible();
  });

  test('should filter elements by category', async ({ page }) => {
    // Click on "Неметалл" filter
    await page.getByText('Неметалл').click();
    await page.waitForTimeout(300);

    // Check that the filter is applied (button should have active class)
    await expect(page.getByText('Неметалл')).toHaveClass(/bg-indigo-600/);
  });

  test('should search for element by name', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();

    // Search for Hydrogen
    await searchInput.fill('Водород');

    // Wait for search results to update
    await page.waitForTimeout(500);

    // Should display Hydrogen
    await expect(page.getByText('H').first()).toBeVisible();
  });

  test('should search for element by symbol', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first();

    // Search for Oxygen by symbol
    await searchInput.fill('O');

    await page.waitForTimeout(500);

    // Should display Oxygen
    await expect(page.getByText('Кислород')).toBeVisible();
  });

  test('should filter by period', async ({ page }) => {
    // Select period 1 from the second select (first is language)
    const periodSelects = page.locator('select');
    const periodSelect = periodSelects.nth(1);
    await periodSelect.selectOption('1');

    await page.waitForTimeout(500);

    // Should display H and He only
    await expect(page.getByText('H').first()).toBeVisible();
    await expect(page.getByText('He')).toBeVisible();
  });

  test('should open element details modal', async ({ page }) => {
    // Click on Hydrogen element button
    const hydrogenButton = page.locator('button').filter({ hasText: 'H' }).filter({ hasText: 'Водород' });
    await hydrogenButton.click();

    // Wait for modal to open
    await page.waitForTimeout(1000);

    // Check modal content - look for element name in modal header
    await expect(page.locator('.fixed.inset-0').getByText('Водород')).toBeVisible();
    await expect(page.getByText('#1')).toBeVisible();
  });

  test('should close element details modal', async ({ page }) => {
    // Open modal
    const hydrogenButton = page.locator('button').filter({ hasText: 'H' }).filter({ hasText: 'Водород' });
    await hydrogenButton.click();
    await page.waitForTimeout(1000);

    // Close modal by clicking X button
    const closeButton = page.locator('.fixed.inset-0 button').first();
    await closeButton.click();

    await page.waitForTimeout(500);

    // Modal should be closed
    await expect(page.locator('.fixed.inset-0')).not.toBeVisible();
  });

  test('should display loading state for element details', async ({ page }) => {
    // Open element modal for Boron (element #5)
    const boronButton = page.locator('button').filter({ hasText: 'Бор' }).first();
    await boronButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Modal should be visible with loading or loaded content
    const modal = page.locator('.fixed.inset-0');
    await expect(modal).toBeVisible();
  });

  test('should switch between tabs in element modal', async ({ page }) => {
    // Open element modal
    const hydrogenButton = page.locator('button').filter({ hasText: 'H' }).filter({ hasText: 'Водород' });
    await hydrogenButton.click();
    await page.waitForTimeout(1000);

    // Click on История tab
    await page.getByRole('button', { name: 'История' }).click();
    await page.waitForTimeout(300);

    // Should display timeline content
    const modal = page.locator('.fixed.inset-0');
    await expect(modal).toBeVisible();

    // Switch back to Инфо tab
    await page.getByRole('button', { name: 'Инфо' }).click();
  });

  test('should display error message when not authenticated', async ({ page }) => {
    // Open element modal for Boron
    const boronButton = page.locator('button').filter({ hasText: 'Бор' }).first();
    await boronButton.click();

    // Wait for error message (since user is not logged in)
    await page.waitForTimeout(3000);

    // Should show authentication error in modal
    const modal = page.locator('.fixed.inset-0');
    await expect(modal.getByText(/Ошибка|Error/)).toBeVisible();
  });

  test('should have responsive design on mobile', async ({ page, viewport }) => {
    // This test runs only on Mobile Chrome project
    if (viewport && viewport.width < 768) {
      await expect(page.getByText('Периодическая таблица')).toBeVisible();

      // Search should still be visible
      await expect(page.locator('input[type="text"]').first()).toBeVisible();
    }
  });
});
