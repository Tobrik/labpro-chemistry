# ✅ Чек-лист перед деплоем

## 📋 Проверьте эти пункты перед деплоем

### 1. Зависимости установлены?

```bash
cd C:\Users\user\Documents\labpro
npm install
```

**Ожидаемый результат:** Все пакеты установлены без ошибок

---

### 2. Проект собирается?

```bash
npm run build
```

**Ожидаемый результат:**
- ✅ Build completed успешно
- ✅ Создана папка `dist/`
- ✅ Нет ошибок TypeScript

---

### 3. Firebase конфигурация настроена?

**Проверьте файл:** `src/config/firebase.ts`

Должен содержать:
```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "labpro1234.firebaseapp.com",
  projectId: "labpro1234",
  // ...
};
```

**Важно:** Этот файл НЕ коммитится в Git (защищён `.gitignore`)

---

### 4. Firebase Authentication включена?

1. Откройте [Firebase Console](https://console.firebase.google.com/project/labpro1234/authentication)
2. Проверьте, что включен провайдер **"Email/Password"**
3. Если нет - включите его

---

### 5. Firestore Database создана?

1. Откройте [Firestore](https://console.firebase.google.com/project/labpro1234/firestore)
2. Если база не создана - нажмите **"Create database"**
3. Выберите регион (например, `europe-west`)
4. Выберите **"Start in production mode"**

---

### 6. Firestore Security Rules настроены?

**Файл:** `firestore.rules`

Если деплоите на Firebase, выполните:
```bash
firebase deploy --only firestore:rules
```

Если деплоите на Vercel - настройте вручную в Firebase Console.

---

### 7. У вас есть необходимые ключи?

#### ✅ Gemini API Key
Получите на: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

#### ✅ Firebase Service Account (для Vercel)
1. [Firebase Console](https://console.firebase.google.com/project/labpro1234/settings/serviceaccounts/adminsdk)
2. Generate New Private Key
3. Скачайте JSON

---

### 8. Проект на GitHub?

```bash
# Проверьте remote
git remote -v

# Должно показать:
# origin  https://github.com/YOUR_USERNAME/labpro-chemistry.git (fetch)
# origin  https://github.com/YOUR_USERNAME/labpro-chemistry.git (push)
```

Если remote нет:
```bash
git remote add origin https://github.com/YOUR_USERNAME/labpro-chemistry.git
```

---

### 9. Последний коммит?

```bash
git status
```

Если есть незакоммиченные изменения:
```bash
git add .
git commit -m "Ready for deployment"
git push
```

---

### 10. Vercel аккаунт создан?

1. Перейдите на [vercel.com](https://vercel.com)
2. Sign up через GitHub
3. Авторизуйте доступ к репозиториям

---

## ✅ Всё готово?

Если все пункты выполнены, переходите к деплою:

### Для Vercel:
См. [QUICK_START.md](QUICK_START.md)

### Для Firebase:
См. [FINAL_STEPS.md](FINAL_STEPS.md)

---

## 🆘 Проблемы?

### Build ошибка "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Firebase ошибка "Project not found"
Проверьте файл `.firebaserc` - должен содержать `"default": "labpro1234"`

### Vercel ошибка "FIREBASE_PRIVATE_KEY not set"
Убедитесь, что в Environment Variables добавлен полный ключ с `-----BEGIN` и `-----END`

---

**Готовы к деплою?** 🚀
