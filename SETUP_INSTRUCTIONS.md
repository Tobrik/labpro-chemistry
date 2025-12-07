# LABPRO - Инструкции по настройке и деплою

Этот документ содержит пошаговые инструкции для завершения настройки проекта LABPRO с кибербезопасностью, тестированием и деплоем на Firebase.

## 📋 Оглавление

1. [Предварительные требования](#предварительные-требования)
2. [Настройка Firebase](#настройка-firebase)
3. [Установка зависимостей](#установка-зависимостей)
4. [Настройка конфигурации](#настройка-конфигурации)
5. [Тестирование локально](#тестирование-локально)
6. [Деплой на Firebase](#деплой-на-firebase)
7. [Post-Deploy настройка](#post-deploy-настройка)
8. [Следующие шаги](#следующие-шаги)

---

## Предварительные требования

Убедитесь, что у вас установлено:

- **Node.js** версии 20 или выше
- **npm** или **yarn**
- Аккаунт **Google** для Firebase
- **Git** (опционально)

---

## Настройка Firebase

### Шаг 1: Создание Firebase проекта

1. Перейдите на [Firebase Console](https://console.firebase.google.com)
2. Нажмите "Add project" (Добавить проект)
3. Введите название: `labpro-chemistry` (или свое)
4. Отключите Google Analytics (опционально)
5. Нажмите "Create project"

### Шаг 2: Включение Firebase Authentication

1. В Firebase Console, выберите ваш проект
2. Перейдите в **Authentication** → **Sign-in method**
3. Включите **Email/Password** provider
4. Нажмите "Save"

### Шаг 3: Создание Firestore Database

1. В Firebase Console, перейдите в **Firestore Database**
2. Нажмите "Create database"
3. Выберите режим: **Start in production mode**
4. Выберите регион (например, `europe-west1`)
5. Нажмите "Enable"

### Шаг 4: Получение Firebase конфигурации

1. В Firebase Console, перейдите в **Project settings** (иконка шестеренки)
2. Прокрутите вниз до раздела "Your apps"
3. Нажмите на иконку **Web** (</>)
4. Зарегистрируйте приложение с именем "LABPRO Web"
5. Скопируйте конфигурацию `firebaseConfig`

### Шаг 5: Обновление конфигурации в коде

Откройте файл `src/config/firebase.ts` и замените значения:

```typescript
const firebaseConfig = {
  apiKey: "ВАШ_API_KEY",
  authDomain: "ваш-проект.firebaseapp.com",
  projectId: "ваш-проект",
  storageBucket: "ваш-проект.appspot.com",
  messagingSenderId: "ВАШ_MESSAGING_ID",
  appId: "ВАШ_APP_ID"
};
```

---

## Установка зависимостей

### Установка зависимостей для фронтенда

```bash
cd C:\Users\user\Documents\labpro
npm install
```

### Установка зависимостей для Cloud Functions

```bash
cd functions
npm install
cd ..
```

### Установка Firebase CLI

```bash
npm install -g firebase-tools
```

### Вход в Firebase

```bash
firebase login
```

Следуйте инструкциям для входа в ваш Google аккаунт.

---

## Настройка конфигурации

### Шаг 1: Инициализация Firebase (если еще не сделано)

```bash
firebase init
```

**Выберите:**
- ☑ Firestore
- ☑ Functions
- ☑ Hosting

**Ответьте на вопросы:**
- Existing project: выберите ваш проект
- Firestore rules file: `firestore.rules`
- Firestore indexes file: `firestore.indexes.json`
- Functions language: **TypeScript**
- Use ESLint: No
- Install dependencies: Yes
- Public directory: `dist`
- Single-page app: **Yes**
- GitHub deploys: No (опционально)

### Шаг 2: Настройка Gemini API ключа

Получите Gemini API ключ:
1. Перейдите на [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Создайте новый API ключ
3. Скопируйте ключ

Настройте ключ в Firebase Functions:

```bash
firebase functions:config:set gemini.api_key="ВАШ_GEMINI_API_KEY"
```

Проверьте конфигурацию:

```bash
firebase functions:config:get
```

### Шаг 3: Обновление .firebaserc

Откройте `.firebaserc` и убедитесь, что там указан ваш проект:

```json
{
  "projects": {
    "default": "ваш-project-id"
  }
}
```

---

## Тестирование локально

### Запуск локального сервера разработки (фронтенд)

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:3000` (или `5173`).

### Запуск Firebase Emulators (опционально)

Для тестирования Cloud Functions локально:

```bash
firebase emulators:start
```

---

## Деплой на Firebase

### Шаг 1: Сборка фронтенда

```bash
npm run build
```

Проверьте, что папка `dist` создана.

### Шаг 2: Деплой Firestore Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Шаг 3: Деплой Cloud Functions

```bash
firebase deploy --only functions
```

**Примечание:** Первый деплой может занять 5-10 минут.

### Шаг 4: Деплой Hosting

```bash
firebase deploy --only hosting
```

### Шаг 5: Полный деплой (все сразу)

```bash
firebase deploy
```

---

## Post-Deploy настройка

### Шаг 1: Создание первого администратора

1. Перейдите на ваш сайт (например, `https://labpro-chemistry.web.app`)
2. Зарегистрируйтесь с email/password
3. В Firebase Console, перейдите в **Authentication**
4. Скопируйте **UID** вашего пользователя
5. Перейдите в **Firestore Database**
6. Найдите коллекцию `users` → ваш документ (UID)
7. Измените поле `role` с `"user"` на `"admin"`

### Шаг 2: Проверка работоспособности

1. Войдите на сайт
2. Попробуйте использовать функции:
   - Периодическая таблица с AI деталями элементов
   - Уравнитель
   - Тренажер
3. Откройте админ панель (иконка в header)
4. Проверьте, что видите дашборд с данными

### Шаг 3: Настройка мониторинга

1. В Firebase Console, перейдите в **Functions**
2. Проверьте логи функций (Cloud Logs)
3. Настройте budget alerts:
   - Google Cloud Console → Billing → Budgets & alerts
   - Установите лимит (например, $10/месяц)

---

## Следующие шаги

### 1. Оставшиеся файлы фронтенда для обновления

Следующие файлы нужно обновить вручную (частично уже реализовано):

#### ❌ **src/services/gemini.ts** - КРИТИЧНО
Нужно заменить прямые вызовы Gemini API на вызовы backend endpoints.

**Текущий код (удалить):**
```typescript
const genAI = new GoogleGenAI(API_KEY);
const response = await genAI.models.generateContent(...);
```

**Новый код (добавить):**
```typescript
const token = await auth.currentUser?.getIdToken();
const response = await fetch('/api/gemini/element-details', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ elementName })
});
const data = await response.json();
```

#### ❌ **src/components/Trainer.tsx** - КРИТИЧНО
Заменить localStorage на backend API.

**Удалить (строки 24, 36):**
```typescript
const savedXp = localStorage.getItem('chem_xp');
localStorage.setItem('chem_xp', newScore.toString());
```

**Добавить:**
```typescript
// В начале компонента
const { token } = useAuth();

// Для загрузки прогресса
const loadProgress = async () => {
  const response = await fetch('/api/progress', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  setScore(data.xp);
  setLevel(data.level);
};

// Для обновления XP
const updateProgress = async (xpGained, mode, correct) => {
  const response = await fetch('/api/progress/xp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      xpGained,
      mode,
      correctAnswers: correct ? 1 : 0,
      totalQuestions: 1
    })
  });
  const data = await response.json();
  setScore(data.newXp);
  setLevel(data.newLevel);
};
```

#### ❌ **vite.config.ts** - КРИТИЧНО (безопасность)
Удалить экспорт API ключа.

**Удалить строки 14-15:**
```typescript
'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
```

#### ❌ **src/App.tsx** - КРИТИЧНО
Добавить AuthProvider.

**Обернуть приложение:**
```typescript
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Загрузка...</div>
    </div>;
  }

  return (
    <>
      {!user && <AuthModal isOpen={!user} onClose={() => {}} />}
      {/* existing app content */}
    </>
  );
}
```

#### 🔄 **src/components/AdminPanel.tsx** - Желательно
Заменить мок-данные на реальные API вызовы (уже частично реализовано в плане).

### 2. Установка и настройка Playwright (тестирование)

#### Установка:
```bash
npm install -D @playwright/test
npx playwright install chromium
```

#### Создание playwright.config.ts:
```bash
# Скопировать из плана или создать вручную
```

#### Запуск тестов:
```bash
npm run test:e2e
```

### 3. Миграция localStorage

При первом входе пользователя создайте сервис для миграции:

```typescript
// src/services/migration.ts
export const migrateLocalStorageToBackend = async (token: string) => {
  const localXP = localStorage.getItem('chem_xp');
  if (!localXP) return;

  const response = await fetch('/api/progress/migrate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ xp: parseInt(localXP) })
  });

  if (response.ok) {
    localStorage.removeItem('chem_xp');
    alert('Ваш прогресс сохранен в облаке!');
  }
};
```

Вызовите эту функцию в AuthContext после успешного входа.

---

## Полезные команды

### Firebase
```bash
# Просмотр логов
firebase functions:log

# Просмотр конфигурации
firebase functions:config:get

# Удаление функций
firebase functions:delete FUNCTION_NAME

# Открыть Firebase Console
firebase open
```

### Разработка
```bash
# Локальный dev сервер
npm run dev

# Сборка для production
npm run build

# Предпросмотр production build
npm run preview
```

### Тестирование
```bash
# Запуск E2E тестов
npm run test:e2e

# UI режим Playwright
npm run test:e2e:ui

# Debug режим
npm run test:e2e:debug
```

---

## Troubleshooting

### Проблема: CORS ошибки
**Решение:** Убедитесь, что ваш домен добавлен в `allowedOrigins` в `functions/src/index.ts`.

### Проблема: API ключ не работает
**Решение:** Проверьте конфигурацию: `firebase functions:config:get`

### Проблема: Firestore permission denied
**Решение:** Проверьте `firestore.rules` и убедитесь, что правила задеплоены.

### Проблема: Functions деплой failed
**Решение:**
1. Проверьте логи: `firebase functions:log`
2. Убедитесь, что Node.js версии 20
3. Проверьте, что все зависимости установлены в `functions/`

---

## Оценка стоимости

При 100-1000 пользователей/месяц:

- **Firestore:** $0-25/мес
- **Cloud Functions:** $0-50/мес
- **Hosting:** $0 (в пределах free tier)
- **Gemini API:** $0-100/мес (зависит от использования)

**Итого:** ~$0-175/мес

Firebase Free Tier покрывает большинство потребностей для малых проектов.

---

## Контакты и поддержка

- **Firebase Documentation:** https://firebase.google.com/docs
- **Gemini API Documentation:** https://ai.google.dev/docs
- **Playwright Documentation:** https://playwright.dev

---

**Удачного деплоя! 🚀**
