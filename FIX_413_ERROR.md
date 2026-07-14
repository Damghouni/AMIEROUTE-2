# 📦 Résolution de l'erreur 413 - Payload Too Large

## ❌ Problème

Vous recevez l'erreur **"Request failed with status code 413"** lors de la création d'une catégorie avec une image.

**Cause:** La taille de la requête dépasse la limite configurée sur le serveur.

---

## ✅ Solutions appliquées

### 1. **Augmentation de la limite du serveur** (Backend)

Le fichier `backend/src/index.js` a été mis à jour:

```javascript
// Avant (limite par défaut: 100kb)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Après (nouvelle limite: 50mb)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

### 2. **Compression automatique des images** (Frontend)

Le `CategoryForm.tsx` compresse maintenant automatiquement les images:

- ✅ Redimensionne les images > 800px
- ✅ Réduit la qualité JPEG à 80%
- ✅ Vérifie la taille max (5MB)
- ✅ Affiche un message d'erreur si trop grande

### 3. **Validations côté utilisateur**

- Affichage des formats acceptés: JPG, PNG
- Message indiquant la compression automatique
- Validation de taille avant upload

---

## 🔧 Comment utiliser maintenant

### Création d'une catégorie:

1. **Allez à:** `/admin/categories/new`

2. **Remplissez le formulaire:**
   - ✅ Nom de la catégorie
   - ✅ Description
   - ✅ Image (sera compressée automatiquement)

3. **L'image sera:**
   - Redimensionnée si nécessaire (max 800px)
   - Compressée en JPEG 80%
   - Réduite de ~70-80%

4. **Cliquez "Créer la catégorie"**

---

## 📊 Limites actuelles

| Élément | Limite |
|---------|--------|
| Taille totale de la requête | **50 MB** |
| Taille image (avant compression) | **5 MB** |
| Dimensions image max | **800 x 800 px** |
| Qualité JPEG | **80%** |

---

## 🚀 Redémarrez le serveur

Pour appliquer les changements, redémarrez le serveur backend:

```bash
# Terminal backend
cd backend
npm start
```

Vous verrez:
```
✓ Server running on port 4000
✓ MongoDB connected
```

---

## ✨ Exemple de taille

**Avant compression:**
- Image originale: 5000 x 3000 px, 8MB

**Après compression:**
- Image: 800 x 480 px, ~200KB (98% plus petite!)

---

## 🐛 Dépannage

### L'erreur persiste?

1. **Vérifiez que le serveur a redémarré:**
   ```bash
   # Dans le terminal backend
   Ctrl + C (arrêter)
   npm start (redémarrer)
   ```

2. **Videz le cache du navigateur:**
   - Appuyez sur `Ctrl + Shift + Delete`
   - Cochez "Tous les fichiers"
   - Cliquez "Effacer"

3. **Réessayez avec une image plus petite:**
   - JPG de ~2MB max
   - Dimensions: 600x600 px

### Erreur "L'image est trop grande"?

- Sélectionnez une image < 5MB
- Ou utilisez un outil de compression (TinyPNG, etc.)

---

## 📝 Notes

- Les images sont compressées **automatiquement** côté client
- La compression réduit la taille sans perte visible de qualité
- Aucun changement nécessaire dans les autres formulaires

---

## 📞 Support

Si le problème persiste, vérifiez:
- `backend/src/index.js` - Ligne 38-39
- Network tab du DevTools (F12) - Vérifiez la taille du payload
- Console backend - Cherchez les erreurs
