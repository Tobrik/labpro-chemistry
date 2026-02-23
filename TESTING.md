# 🧪 Тестирование LABPRO с Playwright

## 📋 Обзор

Проект использует **Playwright** для E2E (end-to-end) тестирования. Тесты написаны на TypeScript и покрывают основные функции платформы.

## 🚀 Быстрый старт

### 1. Установите зависимости

```bash
npm install
npx playwright install chromium
```

### 2. Запустите тесты

```bash
# Запустить все тесты
npm test

# Запустить тесты в UI режиме (рекомендуется)
npm run test:ui

# Запустить тесты в headed режиме (видно браузер)
npm run test:headed

# Запустить только Chrome тесты
npm run test:chrome
```

## 📁 Структура тестов

```
tests/
├── periodic-table.spec.ts    # Тесты таблицы Менделеева
├── authentication.spec.ts     # Тесты аутентификации
└── ai-features.spec.ts        # Тесты AI функций
```

## 🧪 Покрытие тестов

### ✅ Periodic Table (periodic-table.spec.ts)

- [x] Отображение заголовка и элементов UI
- [x] Поиск элементов по названию и символу
- [x] Фильтрация по категориям (неметалл, благородный газ и т.д.)
- [x] Фильтрация по периодам
- [x] Открытие/закрытие модального окна с деталями
- [x] Переключение между вкладками (Инфо/История)
- [x] Отображение ошибки при отсутствии аутентификации
- [x] Загрузка состояния для деталей элемента
- [x] Responsive дизайн на мобильных устройствах

### ✅ Authentication (authentication.spec.ts)

- [x] Отображение модального окна входа
- [x] Переключение между входом и регистрацией
- [x] Валидация пустых полей
- [x] Валидация email формата
- [x] Валидация длины пароля
- [x] Состояние загрузки при входе
- [⏭️] Успешный вход (требует тестового пользователя)
- [⏭️] Успешная регистрация (требует тестового пользователя)
- [⏭️] Выход из системы (требует тестового пользователя)

### ✅ AI Features (ai-features.spec.ts)

- [x] Отображение UI для балансировки уравнений
- [x] Отображение UI для решения задач
- [x] Отображение UI для сравнения веществ
- [⏭️] Балансировка химических уравнений (с mock)
- [⏭️] Решение химических задач (с mock)
- [⏭️] Сравнение веществ (с mock)
- [⏭️] Состояние загрузки AI запросов
- [⏭️] Обработка ошибок AI API

## 🎯 Запуск специфических тестов

### Запустить один тест-файл

```bash
npx playwright test periodic-table.spec.ts
```

### Запустить один тест

```bash
npx playwright test -g "should display periodic table heading"
```

### Запустить с отладкой

```bash
npx playwright test --debug
```

### Запустить только на Chrome

```bash
npx playwright test --project=chromium
```

## 📊 Отчёты

После запуска тестов, сгенерируется HTML отчёт:

```bash
npx playwright show-report
```

Отчёт содержит:
- ✅ Пройденные тесты
- ❌ Упавшие тесты
- ⏭️ Пропущенные тесты
- 📸 Скриншоты ошибок
- 🎥 Видео записи упавших тестов
- 📝 Trace файлы для детальной отладки

## 🔧 Конфигурация

Конфигурация Playwright находится в файле [`playwright.config.ts`](playwright.config.ts).

### Основные настройки:

- **Browser**: Chromium (Chrome) - основной, Mobile Chrome - дополнительный
- **Base URL**: `http://localhost:5173` (локальная разработка)
- **Retries**: 2 попытки на CI, 0 локально
- **Screenshots**: Только при ошибках
- **Videos**: Сохраняются при ошибках
- **Trace**: При первой повторной попытке

### Изменение Base URL

Для тестирования деплоя на Vercel:

```bash
PLAYWRIGHT_TEST_BASE_URL=https://your-app.vercel.app npx playwright test
```

## 🧪 Тестирование с Firebase Emulators

Для полного тестирования с аутентификацией и AI функциями:

### 1. Установите Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Запустите эмуляторы

```bash
firebase emulators:start
```

### 3. Обновите конфигурацию

В `playwright.config.ts` измените `baseURL` на URL эмулятора.

### 4. Создайте тестового пользователя

В эмуляторе создайте пользователя:
- Email: `test@labpro.com`
- Password: `testpassword123`

### 5. Раскомментируйте пропущенные тесты

В тест-файлах замените `test.skip` на `test` для тестов, требующих аутентификации.

## 🎭 Mock API для тестирования

Playwright позволяет мокировать API запросы:

```typescript
await page.route('**/api/ai', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      balancedEquation: '2H₂ + O₂ → 2H₂O',
      explanation: 'Сбалансировано'
    })
  });
});
```

Это позволяет тестировать UI без реальных API вызовов.

## 🐛 Отладка тестов

### Trace Viewer

Для детального анализа упавшего теста:

```bash
npx playwright show-trace trace.zip
```

### Inspector

Запустить тесты в режиме отладки:

```bash
npx playwright test --debug
```

### Console Logs

Смотреть console.log из браузера:

```typescript
page.on('console', msg => console.log(msg.text()));
```

## 📝 Рекомендации

### ✅ Best Practices

1. **Используйте роли и селекторы доступности**
   ```typescript
   page.getByRole('button', { name: 'Войти' })
   ```

2. **Избегайте хрупких селекторов**
   ❌ `page.locator('.class-123')`
   ✅ `page.getByText('Водород')`

3. **Ждите элементы перед взаимодействием**
   ```typescript
   await page.waitForSelector('text=Загружено');
   ```

4. **Используйте expect от Playwright**
   ```typescript
   await expect(page.getByText('Успех')).toBeVisible();
   ```

5. **Группируйте тесты с describe**
   ```typescript
   test.describe('Periodic Table', () => {
     // тесты
   });
   ```

### ⚠️ Что избегать

- Не используйте `page.waitForTimeout()` без крайней необходимости
- Не полагайтесь на порядок выполнения тестов
- Не используйте глобальное состояние между тестами
- Не забывайте про cleanup после тестов

## 🚀 CI/CD Integration

### GitHub Actions

Пример `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium
      - name: Run Playwright tests
        run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Vercel

Тесты можно запускать перед деплоем:

1. Добавьте в `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build && npm test"
   }
   ```

2. Или используйте GitHub Actions для тестирования перед мержем

## 📚 Дополнительные ресурсы

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Locators Guide](https://playwright.dev/docs/locators)

## 🆘 Troubleshooting

### Тесты не находят элементы

**Проблема:** `locator.click: Timeout 30000ms exceeded`

**Решение:**
1. Проверьте, что dev сервер запущен
2. Увеличьте timeout: `await page.waitForSelector('text', { timeout: 60000 })`
3. Проверьте селекторы в Playwright Inspector

### Браузер не запускается

**Проблема:** `browserType.launch: Executable doesn't exist`

**Решение:**
```bash
npx playwright install chromium
```

### Скриншоты не сохраняются

**Проблема:** Нет папки со скриншотами

**Решение:** Убедитесь, что в `playwright.config.ts` установлено:
```typescript
screenshot: 'only-on-failure',
```

---

**Готовы тестировать?** 🚀

```bash
npm run test:ui
```
