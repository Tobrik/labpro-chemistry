# 🚀 Деплой LABPRO на Vercel (100% бесплатно)

## ✨ Преимущества Vercel

- ✅ **Полностью бесплатно** - без кредитной карты
- ✅ **Serverless Functions** - аналог Firebase Cloud Functions
- ✅ **Автоматический CI/CD** - деплой при push в GitHub
- ✅ **SSL сертификаты** - автоматически
- ✅ **CDN** - быстрая загрузка по всему миру

## 📋 Предварительные требования

1. **GitHub аккаунт** - для размещения кода
2. **Vercel аккаунт** - зарегистрируйтесь на [vercel.com](https://vercel.com) через GitHub
3. **Firebase проект** - для Authentication и Firestore (бесплатный Spark план)
4. **Groq API ключ** - получите на [console.groq.com](https://console.groq.com) (бесплатно)

## 🔧 Шаг 1: Подготовка Firebase Service Account

Для работы Vercel serverless functions с Firebase нужен Service Account ключ:

### 1.1. Создайте Service Account

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите проект `labpro1234`
3. Перейдите в **Project Settings** (⚙️) → **Service Accounts**
4. Нажмите **"Generate New Private Key"**
5. Подтвердите и скачайте JSON файл
6. **НЕ КОММИТЬТЕ** этот файл в Git!

### 1.2. Извлеките данные из JSON

Откройте скачанный JSON файл. Вам понадобятся:
- `project_id`
- `client_email`
- `private_key`

## 🚀 Шаг 2: Деплой на Vercel

### 2.1. Загрузите проект на GitHub

```bash
cd C:\Users\user\Documents\labpro

# Инициализируйте Git (если еще не сделано)
git init

# Добавьте все файлы
git add .

# Создайте коммит
git commit -m "Initial commit: LABPRO with Vercel support"

# Подключите GitHub (замените YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/labpro-chemistry.git

# Загрузите на GitHub
git branch -M main
git push -u origin main
```

### 2.2. Импортируйте проект в Vercel

1. Перейдите на [vercel.com/new](https://vercel.com/new)
2. Нажмите **"Import Git Repository"**
3. Выберите `labpro-chemistry` из списка
4. Нажмите **"Import"**

### 2.3. Настройте Environment Variables

В настройках проекта Vercel добавьте эти переменные:

#### **GROQ_API_KEY**
```
your_groq_api_key_here
```

#### **FIREBASE_PROJECT_ID**
```
labpro1234
```

#### **FIREBASE_CLIENT_EMAIL**
```
firebase-adminsdk-xxxxx@labpro1234.iam.gserviceaccount.com
```
*(Скопируйте из JSON файла Service Account)*

#### **FIREBASE_PRIVATE_KEY**
```
-----BEGIN PRIVATE KEY-----
...ваш приватный ключ...
-----END PRIVATE KEY-----
```
**ВАЖНО:** Скопируйте ВЕСЬ ключ целиком, включая `-----BEGIN` и `-----END`

### 2.4. Задеплойте проект

1. Нажмите **"Deploy"**
2. Подождите 1-2 минуты
3. Получите URL вашего сайта (например, `labpro-chemistry.vercel.app`)

## ✅ Шаг 3: Настройте Firebase Authentication

Добавьте домен Vercel в список авторизованных доменов:

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Перейдите в **Authentication** → **Settings** → **Authorized domains**
3. Нажмите **"Add domain"**
4. Добавьте: `labpro-chemistry.vercel.app` (ваш домен Vercel)
5. Нажмите **"Add"**

## 🎯 Шаг 4: Создайте первого администратора

1. Откройте ваш сайт: `https://labpro-chemistry.vercel.app`
2. Зарегистрируйтесь с email/password
3. Откройте [Firebase Console](https://console.firebase.google.com/) → **Authentication**
4. Скопируйте **UID** вашего пользователя
5. Перейдите в **Firestore Database**
6. Откройте коллекцию `users` → документ с вашим UID
7. Измените поле `role` с `"user"` на `"admin"`
8. Сохраните
9. Перезайдите на сайт

## 🔄 Автоматический деплой

Теперь при каждом `git push` в main ветку, Vercel автоматически:
1. Соберет проект
2. Задеплоит новую версию
3. Обновит сайт за ~1 минуту

```bash
# Внесите изменения в код
git add .
git commit -m "Update feature"
git push

# Vercel автоматически задеплоит! 🚀
```

## 📊 Мониторинг

### Логи функций

1. Перейдите на [vercel.com](https://vercel.com)
2. Выберите проект
3. Перейдите в **Functions** → выберите функцию
4. Смотрите логи в реальном времени

### Аналитика

Бесплатно доступна:
- Количество запросов
- Время выполнения функций
- Использование bandwidth
- Ошибки

## ⚡ Лимиты бесплатного плана

- **100 GB bandwidth/месяц**
- **100 GB-Hours serverless execution/месяц**
- **12M+ function invocations/месяц**

Для образовательного проекта это более чем достаточно!

## 🆘 Troubleshooting

### Ошибка "FIREBASE_PRIVATE_KEY is not set"

**Решение:** Убедитесь, что в Environment Variables добавлен `FIREBASE_PRIVATE_KEY` со ВСЕМ ключом, включая `-----BEGIN PRIVATE KEY-----` и `-----END PRIVATE KEY-----`

### Ошибка "User not found" при логине

**Решение:** Проверьте, что домен Vercel добавлен в Firebase Authorized domains

### API возвращает 401 Unauthorized

**Решение:**
1. Проверьте, что пользователь залогинен
2. Проверьте, что Firebase Auth настроена правильно
3. Проверьте Environment Variables в Vercel

## 🎉 Готово!

Ваш проект теперь работает на Vercel абсолютно бесплатно с полной функциональностью:
- ✅ AI функции (Groq/Llama 3.3)
- ✅ Аутентификация пользователей
- ✅ Отслеживание прогресса
- ✅ Админ панель
- ✅ Аналитика

**URL вашего проекта:** `https://labpro-chemistry.vercel.app` 🚀
