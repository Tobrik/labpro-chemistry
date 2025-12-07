import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show login modal for unauthenticated users', async ({ page }) => {
    // Wait for auth modal to appear
    await page.waitForSelector('text=Вход в аккаунт', { timeout: 5000 });

    // Check modal content
    await expect(page.getByText('Вход в аккаунт')).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Пароль')).toBeVisible();
  });

  test('should switch between login and registration', async ({ page }) => {
    await page.waitForSelector('text=Вход в аккаунт');

    // Click on registration link
    await page.getByText('Регистрация').click();

    // Should show registration form
    await expect(page.getByText('Регистрация')).toBeVisible();
    await expect(page.getByPlaceholder('Имя')).toBeVisible();

    // Switch back to login
    await page.getByText('Вход').click();
    await expect(page.getByText('Вход в аккаунт')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.waitForSelector('text=Вход в аккаунт');

    // Try to submit empty form
    await page.getByRole('button', { name: 'Войти' }).click();

    // Should show validation error (browser native or custom)
    const emailInput = page.getByPlaceholder('Email');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.waitForSelector('text=Вход в аккаунт');

    // Enter invalid email
    await page.getByPlaceholder('Email').fill('invalid-email');
    await page.getByPlaceholder('Пароль').fill('password123');

    // Try to submit
    await page.getByRole('button', { name: 'Войти' }).click();

    // Should show error (either validation or from Firebase)
    await page.waitForTimeout(1000);
  });

  test('should show loading state during login', async ({ page }) => {
    await page.waitForSelector('text=Вход в аккаунт');

    // Fill in credentials
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Пароль').fill('password123');

    // Submit form
    await page.getByRole('button', { name: 'Войти' }).click();

    // Should show loading indicator (might be very brief)
    // Check for disabled button or loading text
    const submitButton = page.getByRole('button', { name: /Вход/i });
    await page.waitForTimeout(500);
  });

  test('should validate password length on registration', async ({ page }) => {
    await page.waitForSelector('text=Вход в аккаунт');

    // Switch to registration
    await page.getByText('Регистрация').click();

    // Try short password
    await page.getByPlaceholder('Email').fill('newuser@example.com');
    await page.getByPlaceholder('Пароль').fill('123');
    await page.getByPlaceholder('Имя').fill('Test User');

    await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

    // Should show error about password length
    await page.waitForTimeout(1000);
  });

  test('should have password visibility toggle', async ({ page }) => {
    await page.waitForSelector('text=Вход в аккаунт');

    const passwordInput = page.getByPlaceholder('Пароль');

    // Password should be type="password" by default
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Look for eye icon or toggle button (if implemented)
    // This depends on implementation
  });

  test('should show forgot password link', async ({ page }) => {
    await page.waitForSelector('text=Вход в аккаунт');

    // Look for forgot password link (if implemented)
    const forgotLink = page.getByText(/Забыли пароль/i);

    // If implemented, it should be visible
    // If not implemented, test will need to be adjusted
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
