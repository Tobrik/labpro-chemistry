# LABPRO - Chemistry Education Platform

Интерактивная образовательная платформа по химии с AI-поддержкой.

## Возможности

- Интерактивная таблица Менделеева с подробной информацией о элементах
- AI-ассистент (Llama 3.3 через Groq) для решения задач и объяснений
- Балансировка уравнений с автоматической проверкой
- Тренажер элементов с системой XP и уровней
- Отслеживание прогресса пользователей
- Аутентификация с ролями (пользователь/администратор)
- Админ-панель с управлением данными в реальном времени
- Мультиязычность (русский, английский, казахский)

## Технологии

### Frontend
- React 19 + TypeScript + Vite
- Tailwind CSS + Lucide Icons
- i18next (мультиязычность)

### Backend
- Vercel Serverless Functions (основной)
- Firebase Cloud Functions (альтернативный)
- Firebase Authentication + Firestore Database
- Groq API (Llama 3.3 70B)

### Безопасность
- JWT аутентификация + Rate limiting
- CORS + Helmet.js + Firestore Security Rules

## Установка

### Предварительные требования
- Node.js 20+
- Firebase CLI
- Groq API ключ (бесплатно: https://console.groq.com)

### Шаги

```bash
# 1. Установите зависимости
npm install
cd functions && npm install && cd ..

# 2. Скопируйте файл конфигурации Firebase
cp src/config/firebase.example.ts src/config/firebase.ts
# Заполните данные Firebase проекта

# 3. Создайте .env файл
cp .env.example .env
# Заполните GROQ_API_KEY и Firebase credentials

# 4. Запустите локально
npm run dev
```

### Заполнение Firestore данными

```bash
# Запустите seed-скрипт для загрузки элементов и формул в Firestore
npx ts-node scripts/seed-firestore.ts
```

## Деплой

### Vercel (Рекомендуется)

```bash
# 1. Загрузите на GitHub
git push origin main

# 2. Импортируйте в Vercel через UI
# Перейдите на vercel.com/new и выберите репозиторий

# 3. Настройте environment variables в Vercel Dashboard:
#    - GROQ_API_KEY
#    - FIREBASE_PROJECT_ID
#    - FIREBASE_CLIENT_EMAIL
#    - FIREBASE_PRIVATE_KEY
```

Подробная инструкция: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

### Firebase (Требуется Blaze Plan)

```bash
npm run build
firebase deploy
```

## Админ-панель

Доступна для пользователей с ролью `admin`. Включает:

- **Пользователи**: управление ролями, бан/разбан
- **Формулы**: CRUD операции в реальном времени (через Firestore)
- **Элементы**: просмотр данных таблицы Менделеева
- **Логи**: ссылка на Firebase Console

## Безопасность

API ключи защищены `.gitignore`. Никогда не коммитьте секретные данные!

## Тестирование

```bash
npx playwright install chromium
npm test            # все тесты
npm run test:ui     # UI режим
npm run test:headed # с видимым браузером
```

Подробная документация: [TESTING.md](TESTING.md)

## Структура

```
labpro/
├── src/              # Frontend React app
│   ├── config/       # Firebase конфигурация
│   ├── contexts/     # React контексты (Theme, Language, Elements)
│   └── i18n/         # Переводы (ru, en, kk)
├── components/       # React компоненты
├── services/         # Сервисы (Firestore, AI)
├── api/              # Vercel Serverless API
│   └── _lib/         # LLM интеграция, авторизация
├── functions/        # Firebase Cloud Functions (альтернативный backend)
├── scripts/          # Утилиты (seed-firestore)
├── tests/            # Playwright E2E тесты
├── firestore.rules   # Правила безопасности Firestore
├── vercel.json       # Vercel конфигурация
└── firebase.json     # Firebase конфигурация
```
