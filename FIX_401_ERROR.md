# ❌ Erreur 401 - Unauthorized (Non autorisé)

## Signification

L'erreur **401 Unauthorized** signifie que la requête n'a pas d'authentification valide. Le serveur refuse d'accéder à la ressource sans identification correcte.

---

## 🔍 Causes possibles

### 1. **Vous n'êtes pas connecté**
```
❌ Pas de session active
❌ Le token d'authentification n'existe pas
```

### 2. **Token expiré**
```
❌ Vous étiez connecté mais la session a expiré
❌ Le token a plus de 24h
```

### 3. **Vous n'êtes pas administrateur**
```
❌ Votre rôle est 'client', 'merchant' ou 'driver'
❌ Seul les 'admin' peuvent créer des catégories
```

### 4. **Token non envoyé**
```
❌ Le header Authorization est vide
❌ Le localStorage a été vidé
```

---

## ✅ Solutions

### **Solution 1: Vérifiez votre connexion**

1. **Allez à:** `http://localhost:3000/login`

2. **Connectez-vous en tant qu'admin:**
   ```
   Email: admin@amiroute.fr
   Mot de passe: (votre mot de passe)
   ```

3. **Vérifiez que vous êtes redirigé vers** `/admin/dashboard`

4. **Vérifiez dans DevTools (F12):**
   - Onglet **Application** → **Local Storage**
   - Cherchez la clé **`auth_token`**
   - Elle doit contenir un token JWT

### **Solution 2: Vérifiez votre rôle**

1. **Ouvrez DevTools** (F12)

2. **Onglet** → **Console**

3. **Exécutez:**
   ```javascript
   localStorage.getItem('auth_token')
   // Doit afficher quelque chose comme: eyJhbGciOiJIUzI1NiIs...
   ```

4. **Si vide → Reconnectez-vous**

5. **Vérifiez votre rôle dans le backend:**
   ```bash
   # Dans MongoDB Compass
   db.users.find({ email: "admin@amiroute.fr" })
   
   # Vous devez voir:
   "role": "admin"
   "isActive": true
   ```

### **Solution 3: Videz le cache et reconnectez-vous**

```bash
# 1. Ouvrez DevTools (F12)
# 2. Appuyez sur Ctrl + Shift + Suppr
# 3. Sélectionnez "Tous les fichiers"
# 4. Cliquez "Effacer"
# 5. Rechargez la page (F5)
# 6. Reconnectez-vous
```

### **Solution 4: Vérifiez les headers d'authentification**

1. **Ouvrez DevTools** (F12)

2. **Onglet Network**

3. **Allez à** `/admin/categories/new`

4. **Cliquez sur "Créer la catégorie"**

5. **Dans Network, cherchez la requête POST** `/api/categories`

6. **Vérifiez les headers:**
   ```
   ✅ Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ✅ Content-Type: application/json
   ```

7. **Si pas de header Authorization → Problème d'authentification**

---

## 🛠️ Récapitulatif des vérifications

| Vérification | Status |
|--------------|--------|
| Êtes-vous connecté? | ✅ /login → redirigé à /admin/dashboard? |
| Token dans localStorage? | ✅ DevTools → Application → auth_token? |
| Rôle = admin? | ✅ MongoDB: role === 'admin'? |
| Header Authorization? | ✅ Network tab → Authorization header? |
| Compte actif? | ✅ MongoDB: isActive === true? |

---

## 📝 Étapes complètes pour corriger

### **Étape 1: Créer un compte admin** (si nécessaire)

```bash
cd backend
node createAdmin.js
```

### **Étape 2: Se connecter**

1. Allez à `http://localhost:3000/login`
2. Email: `admin@amiroute.fr`
3. Mot de passe: `Admin@123456` (ou celui que vous avez défini)
4. Appuyez sur **Connexion**

### **Étape 3: Vérifier l'authentification**

1. Appuyez sur **F12** pour ouvrir DevTools
2. Onglet **Application** → **Local Storage**
3. Vérifiez que **`auth_token`** existe

### **Étape 4: Tester la création**

1. Allez à `/admin/categories/new`
2. Remplissez le formulaire
3. Cliquez **"Créer la catégorie"**

---

## 🚨 Erreur persiste?

### **Vérifiez le serveur backend:**

```bash
# Terminal backend
ps aux | grep node  # Linux/Mac
# ou
tasklist | find "node"  # Windows

# Le serveur doit tourner sur le port 4000
```

### **Redémarrez le serveur:**

```bash
# Terminal backend
Ctrl + C  (arrêter)
npm start (redémarrer)

# Vous devez voir:
# ✓ Server running on port 4000
# ✓ MongoDB connected
```

### **Vérifiez les logs:**

```bash
# Dans le terminal backend, vous devez voir:
POST /api/categories 401  # Erreur d'authentification
# ou
POST /api/categories 201  # Succès!
```

---

## 🔐 Sécurité

- Le token JWT est valide **24h** par défaut
- Après 24h, reconnectez-vous
- Ne partagez jamais votre token
- Utilisez toujours HTTPS en production

---

## 📞 Dépannage avancé

### **Le token est envoyé mais 401 persiste?**

Vérifiez dans `src/lib/api.ts`:

```typescript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

C'est correct si ce code est présent.

### **Le serveur envoie 401 sur toutes les requêtes?**

Vérifiez `backend/src/middleware/auth.js`:

```javascript
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  // ... suite
};
```

---

## ✨ Vous êtes connecté? Mais toujours 401?

Essayez une **reconnexion complète:**

1. **Déconnectez-vous:**
   - Ouvrez DevTools (F12)
   - Console
   - Exécutez: `localStorage.clear()`

2. **Rechargez:** `F5`

3. **Reconnectez-vous:** Allez à `/login`

4. **Testez:** Allez à `/admin/categories/new`

---

**L'erreur 401 devrait être résolue!** 🎉
