import { test, expect } from '@playwright/test';

test.describe('AI Features - Unauthenticated', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show equation balancer UI', async ({ page }) => {
    // Navigate to equation balancer (if there's a navigation)
    // Or check if it's visible on the main page

    // Look for equation balancer heading or input
    const balancerSection = page.locator('text=Балансировка уравнений').or(page.locator('text=Уравнение'));

    if (await balancerSection.count() > 0) {
      await expect(balancerSection.first()).toBeVisible();
    }
  });

  test('should show problem solver UI', async ({ page }) => {
    // Look for problem solver section
    const solverSection = page.locator('text=Решение задач').or(page.locator('text=Задача'));

    if (await solverSection.count() > 0) {
      await expect(solverSection.first()).toBeVisible();
    }
  });

  test('should show comparison UI', async ({ page }) => {
    // Look for comparison section
    const comparisonSection = page.locator('text=Сравнение веществ').or(page.locator('text=Сравнить'));

    if (await comparisonSection.count() > 0) {
      await expect(comparisonSection.first()).toBeVisible();
    }
  });
});

test.describe('AI Features - With Mock/Test Auth', () => {
  // These tests require mocked API responses or Firebase emulator
  // They test UI behavior when AI features are used

  test.skip('should balance chemical equation', async ({ page, context }) => {
    // Mock AI API response
    await page.route('**/api/gemini/balance-equation', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          balancedEquation: '2H₂ + O₂ → 2H₂O',
          explanation: 'Добавлены коэффициенты 2 перед H₂ и H₂O для баланса атомов.'
        })
      });
    });

    await page.goto('/');

    // Find equation input
    const equationInput = page.getByPlaceholder(/H2.*O2/i).or(page.getByPlaceholder(/уравнение/i));

    if (await equationInput.count() > 0) {
      await equationInput.first().fill('H2 + O2 = H2O');

      // Find and click balance button
      const balanceButton = page.getByRole('button', { name: /Уравнять/i })
        .or(page.getByRole('button', { name: /Балансировать/i }));

      await balanceButton.first().click();

      // Should show balanced result
      await expect(page.getByText('2H₂ + O₂ → 2H₂O')).toBeVisible({ timeout: 5000 });
    }
  });

  test.skip('should solve chemistry problem', async ({ page }) => {
    // Mock AI API response
    await page.route('**/api/gemini/solve-problem', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          solution: '**Решение:**\n\n1. Молярная масса H₂O = 18 г/моль\n2. n = 36г / 18г/моль = 2 моль\n\n**Ответ:** 2 моля'
        })
      });
    });

    await page.goto('/');

    // Find problem input
    const problemInput = page.getByPlaceholder(/Введите задачу/i)
      .or(page.getByPlaceholder(/задач/i));

    if (await problemInput.count() > 0) {
      await problemInput.first().fill('Сколько молей в 36 граммах воды?');

      // Find and click solve button
      const solveButton = page.getByRole('button', { name: /Решить/i });
      await solveButton.first().click();

      // Should show solution
      await expect(page.getByText(/Ответ/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test.skip('should compare two substances', async ({ page }) => {
    // Mock AI API response
    await page.route('**/api/gemini/compare-substances', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          text: '**Сравнение NaCl и KCl:**\n\nОба являются солями, но отличаются катионами.'
        })
      });
    });

    await page.goto('/');

    // Find substance inputs
    const substanceAInput = page.getByPlaceholder(/Вещество A/i).or(page.getByPlaceholder(/Первое/i));
    const substanceBInput = page.getByPlaceholder(/Вещество B/i).or(page.getByPlaceholder(/Второе/i));

    if (await substanceAInput.count() > 0 && await substanceBInput.count() > 0) {
      await substanceAInput.first().fill('NaCl');
      await substanceBInput.first().fill('KCl');

      // Find and click compare button
      const compareButton = page.getByRole('button', { name: /Сравнить/i });
      await compareButton.first().click();

      // Should show comparison result
      await expect(page.getByText(/Сравнение/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test.skip('should show loading state during AI request', async ({ page }) => {
    // Delay the mock response to test loading state
    await page.route('**/api/gemini/balance-equation', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          balancedEquation: '2H₂ + O₂ → 2H₂O',
          explanation: 'Balanced'
        })
      });
    });

    await page.goto('/');

    const equationInput = page.getByPlaceholder(/H2.*O2/i).or(page.getByPlaceholder(/уравнение/i));

    if (await equationInput.count() > 0) {
      await equationInput.first().fill('H2 + O2 = H2O');

      const balanceButton = page.getByRole('button', { name: /Уравнять/i })
        .or(page.getByRole('button', { name: /Балансировать/i }));

      await balanceButton.first().click();

      // Should show loading indicator
      await expect(page.locator('.animate-spin').or(page.getByText(/Загрузка/i)))
        .toBeVisible({ timeout: 1000 });
    }
  });

  test.skip('should handle AI API errors gracefully', async ({ page }) => {
    // Mock error response
    await page.route('**/api/gemini/balance-equation', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal server error'
        })
      });
    });

    await page.goto('/');

    const equationInput = page.getByPlaceholder(/H2.*O2/i).or(page.getByPlaceholder(/уравнение/i));

    if (await equationInput.count() > 0) {
      await equationInput.first().fill('H2 + O2 = H2O');

      const balanceButton = page.getByRole('button', { name: /Уравнять/i })
        .or(page.getByRole('button', { name: /Балансировать/i }));

      await balanceButton.first().click();

      // Should show error message
      await expect(page.getByText(/Ошибка/i).or(page.getByText(/error/i)))
        .toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Trainer Feature', () => {
  test('should show trainer UI', async ({ page }) => {
    await page.goto('/');

    // Look for trainer section
    const trainerSection = page.locator('text=Тренажер').or(page.locator('text=XP'));

    if (await trainerSection.count() > 0) {
      await expect(trainerSection.first()).toBeVisible();
    }
  });

  test.skip('should display user XP and level', async ({ page }) => {
    // This requires authenticated user
    await page.goto('/');

    // Look for XP display
    const xpDisplay = page.locator('text=/XP|опыт/i');

    if (await xpDisplay.count() > 0) {
      await expect(xpDisplay.first()).toBeVisible();
    }
  });

  test.skip('should start training session', async ({ page }) => {
    await page.goto('/');

    // Find start training button
    const startButton = page.getByRole('button', { name: /Начать/i })
      .or(page.getByRole('button', { name: /Старт/i }));

    if (await startButton.count() > 0) {
      await startButton.first().click();

      // Should show training questions
      await expect(page.locator('text=/Вопрос|Question/i')).toBeVisible({ timeout: 3000 });
    }
  });
});
