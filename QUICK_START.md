# ⚡ Быстрый старт - Деплой на Vercel

## 🎯 За 10 минут от кода до продакшена!

### Шаг 1: Установите зависимости (1 мин)

```bash
cd C:\Users\user\Documents\labpro
npm install
```

### Шаг 2: Получите ключи (3 мин)

#### Gemini API Key
1. Перейдите на [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Нажмите "Create API Key"
3. Скопируйте ключ

#### Firebase Service Account
1. Откройте [Firebase Console](https://console.firebase.google.com/project/labpro1234/settings/serviceaccounts/adminsdk)
2. Нажмите "Generate New Private Key"
3. Скачайте JSON файл
4. Откройте его и скопируйте:
   - `project_id`
   - `client_email`
   - `private_key` (весь ключ с BEGIN и END)

### Шаг 3: Загрузите на GitHub (2 мин)

```bash
# Инициализация Git
git init
git add .
git commit -m "Initial commit with Vercel support"

# Создайте репозиторий на github.com/new
# Затем:
git remote add origin https://github.com/YOUR_USERNAME/labpro-chemistry.git
git branch -M main
git push -u origin main
```

### Шаг 4: Деплой на Vercel (4 мин)

1. **Зарегистрируйтесь на Vercel**
   - Перейдите на [vercel.com](https://vercel.com)
   - Нажмите "Sign Up" → выберите GitHub

2. **Импортируйте проект**
   - Нажмите "New Project"
   - Выберите `labpro-chemistry`
   - Нажмите "Import"

3. **Добавьте Environment Variables**

   Нажмите "Environment Variables" и добавьте:

   ```
   GEMINI_API_KEY = ваш_ключ_gemini
   FIREBASE_PROJECT_ID = labpro1234
   FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxxxx@labpro1234.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
   ```

   **ВАЖНО для FIREBASE_PRIVATE_KEY:**
   - Скопируйте ВЕСЬ ключ включая `-----BEGIN` и `-----END`
   - Ключ должен содержать символы `\n` (два символа: обратный слэш и n)
   - Пример: `-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n`

4. **Deploy**
   - Нажмите "Deploy"
   - Подождите 1-2 минуты
   - Готово! 🎉

### Шаг 5: Настройте Firebase Auth (1 мин)

1. Откройте [Firebase Console](https://console.firebase.google.com/project/labpro1234/authentication/settings)
2. Перейдите в "Authorized domains"
3. Нажмите "Add domain"
4. Добавьте ваш домен Vercel (например: `labpro-chemistry.vercel.app`)

### Шаг 6: Создайте админа (1 мин)

1. Откройте ваш сайт
2. Зарегистрируйтесь
3. Откройте [Firestore](https://console.firebase.google.com/project/labpro1234/firestore)
4. Найдите коллекцию `users` → ваш документ
5. Измените `role: "user"` → `role: "admin"`
6. Перезайдите на сайт

## ✅ Готово!

Ваш сайт работает на `https://ваш-проект.vercel.app`

### Автоматический деплой

Теперь при каждом `git push` Vercel автоматически обновит сайт!

```bash
# Внесли изменения
git add .
git commit -m "Added new feature"
git push

# Vercel автоматически задеплоит! 🚀
```

## 🆘 Проблемы?

См. подробную документацию: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
