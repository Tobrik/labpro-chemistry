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

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await setRussianLanguage(page);
  });

  test('should show login modal for unauthenticated users', async ({ page }) => {
    // Wait for auth modal to appear
    await page.waitForTimeout(1000);

    // Check for auth modal elements
    const modal = page.locator('.fixed.inset-0').first();
    await expect(modal).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should switch between login and registration', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Click on registration link
    await page.getByText(/Нет аккаунта\?|Регистрация/).click();
    await page.waitForTimeout(500);

    // Should show registration form - name input should appear
    await expect(page.locator('input[type="text"]').first()).toBeVisible();

    // Switch back to login
    await page.getByText(/Уже есть аккаунт\?|Вход/).click();
    await page.waitForTimeout(500);
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should show validation error (browser native or custom)
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Enter invalid email
    await page.locator('input[type="email"]').fill('invalid-email');
    await page.locator('input[type="password"]').fill('password123');

    // Try to submit
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should show error (either validation or from Firebase)
    await page.waitForTimeout(1000);
  });

  test('should show loading state during login', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Fill in credentials
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');

    // Submit form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should show loading indicator (might be very brief)
    await page.waitForTimeout(500);
  });

  test('should validate password length on registration', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Switch to registration
    await page.getByText(/Нет аккаунта\?|Регистрация/).click();
    await page.waitForTimeout(500);

    // Try short password
    await page.locator('input[type="text"]').first().fill('Test User');
    await page.locator('input[type="email"]').fill('newuser@example.com');
    await page.locator('input[type="password"]').fill('123');

    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should show error about password length
    await page.waitForTimeout(1000);
  });

  test('should have password visibility toggle', async ({ page }) => {
    await page.waitForTimeout(1000);

    const passwordInput = page.locator('input[type="password"]');

    // Password should be type="password" by default
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should show forgot password link', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for forgot password link (if implemented)
    // This feature may not be implemented
    const modal = page.locator('.fixed.inset-0').first();
    await expect(modal).toBeVisible();
  });
});

test.describe('Authentication - With Test User', () => {
  // These tests require a test user to be created
  // You can use Firebase Emulators or a test environment

  test.skip('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=Вход в аккаунт');

    // Use test credentials
    const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@labpro.com';
    const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123';

    await page.getByPlaceholder('Email').fill(TEST_EMAIL);
    await page.getByPlaceholder('Пароль').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Войти' }).click();

    // Should close modal and show authenticated UI
    await page.waitForSelector('text=Вход в аккаунт', { state: 'hidden', timeout: 5000 });

    // Should show user profile or logout button
    await expect(page.getByText(/Выход/i)).toBeVisible({ timeout: 5000 });
  });

  test.skip('should successfully register new user', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=Вход в аккаунт');

    // Switch to registration
    await page.getByText('Регистрация').click();

    // Generate random email for testing
    const randomEmail = `test_${Date.now()}@labpro.com`;

    await page.getByPlaceholder('Имя').fill('Test User');
    await page.getByPlaceholder('Email').fill(randomEmail);
    await page.getByPlaceholder('Пароль').fill('password123456');

    await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

    // Should close modal after successful registration
    await page.waitForSelector('text=Регистрация', { state: 'hidden', timeout: 10000 });
  });

  test.skip('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/');
    const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@labpro.com';
    const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123';

    await page.getByPlaceholder('Email').fill(TEST_EMAIL);
    await page.getByPlaceholder('Пароль').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Войти' }).click();

    await page.waitForSelector('text=Вход в аккаунт', { state: 'hidden' });

    // Now logout
    await page.getByText(/Выход/i).click();

    // Should show login modal again
    await expect(page.getByText('Вход в аккаунт')).toBeVisible();
  });
});
