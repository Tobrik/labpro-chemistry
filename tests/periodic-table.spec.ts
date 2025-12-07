import { test, expect } from '@playwright/test';

test.describe('Periodic Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the periodic table to load
    await page.waitForSelector('text=Интерактивная таблица Менделеева');
  });

  test('should display periodic table heading', async ({ page }) => {
    await expect(page.getByText('Интерактивная таблица Менделеева')).toBeVisible();
  });

  test('should display search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Поиск по названию или символу...');
    await expect(searchInput).toBeVisible();
  });

  test('should display filter categories', async ({ page }) => {
    await expect(page.getByText('Все элементы')).toBeVisible();
    await expect(page.getByText('Неметалл')).toBeVisible();
    await expect(page.getByText('Благородный газ')).toBeVisible();
  });

  test('should filter elements by category', async ({ page }) => {
    // Click on "Неметалл" filter
    await page.getByText('Неметалл').click();

    // Check that the filter is applied
    await expect(page.getByText('Неметалл')).toHaveClass(/bg-blue-600/);
  });

  test('should search for element by name', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Поиск по названию или символу...');

    // Search for Hydrogen
    await searchInput.fill('Водород');

    // Wait for search results to update
    await page.waitForTimeout(500);

    // Should display Hydrogen
    await expect(page.getByText('H')).toBeVisible();
  });

  test('should search for element by symbol', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Поиск по названию или символу...');

    // Search for Oxygen by symbol
    await searchInput.fill('O');

    await page.waitForTimeout(500);

    // Should display Oxygen
    await expect(page.getByText('Кислород')).toBeVisible();
  });

  test('should filter by period', async ({ page }) => {
    // Select period 1
    await page.selectOption('select', '1');

    await page.waitForTimeout(500);

    // Should display H and He only
    await expect(page.getByText('H')).toBeVisible();
    await expect(page.getByText('He')).toBeVisible();
  });

  test('should open element details modal', async ({ page }) => {
    // Click on Hydrogen element
    await page.getByRole('button', { name: /H/i }).first().click();

    // Wait for modal to open
    await page.waitForSelector('text=Водород');

    // Check modal content
    await expect(page.getByText('Водород')).toBeVisible();
    await expect(page.getByText('#1')).toBeVisible();
  });

  test('should close element details modal', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: /H/i }).first().click();
    await page.waitForSelector('text=Водород');

    // Close modal by clicking X button
    await page.getByRole('button').filter({ has: page.locator('svg') }).first().click();

    // Modal should be closed
    await expect(page.getByText('Водород')).not.toBeVisible();
  });

  test('should display loading state for element details', async ({ page }) => {
    // Open element modal
    await page.getByRole('button', { name: /B/i }).first().click();

    // Should show loading indicator
    await expect(page.getByText('Загрузка подробной информации...')).toBeVisible();
  });

  test('should switch between tabs in element modal', async ({ page }) => {
    // Open element modal
    await page.getByRole('button', { name: /H/i }).first().click();
    await page.waitForSelector('text=Водород');

    // Click on История tab
    await page.getByRole('button', { name: 'История' }).click();

    // Should display timeline
    await expect(page.getByText('Открытие элемента')).toBeVisible();

    // Switch back to Инфо tab
    await page.getByRole('button', { name: 'Инфо' }).click();
  });

  test('should display error message when not authenticated', async ({ page }) => {
    // Open element modal
    await page.getByRole('button', { name: /B/i }).first().click();

    // Wait for error message (since user is not logged in)
    await page.waitForSelector('text=Ошибка загрузки', { timeout: 10000 });

    // Should show authentication error
    await expect(page.getByText(/Войдите в аккаунт/i)).toBeVisible();
  });

  test('should have responsive design on mobile', async ({ page, viewport }) => {
    // This test runs only on Mobile Chrome project
    if (viewport && viewport.width < 768) {
      await expect(page.getByText('Интерактивная таблица Менделеева')).toBeVisible();

      // Search should still be visible
      await expect(page.getByPlaceholder('Поиск по названию или символу...')).toBeVisible();
    }
  });
});
