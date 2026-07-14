# Guide de connexion en tant qu'administrateur

## 📋 Prérequis

L'application supporte maintenant **4 rôles**:
- `client` - Client standard
- `merchant` - Commerçant/Propriétaire de magasin
- `driver` - Livreur
- `admin` - Administrateur

## 🔧 Création d'un compte administrateur

### Option 1: Utiliser le script Node.js (Recommandé)

1. **Ouvrez un terminal** dans le dossier `backend`

2. **Exécutez le script de création d'admin:**
```bash
node createAdmin.js
```

3. **Le script affichera:**
```
✓ Administrateur créé avec succès!

📧 Identifiants de connexion:
   Email: admin@amiroute.fr
   Mot de passe: Admin@123456
   Rôle: admin

⚠️  IMPORTANT: Changez le mot de passe après votre première connexion!
```

### Option 2: Créer manuellement via MongoDB

1. Connectez-vous à votre base de données MongoDB
2. Insérez un document dans la collection `users`:

```javascript
{
  "name": "Administrateur",
  "email": "admin@amiroute.fr",
  "password": "$2a$10$...", // Hash bcrypt d'un mot de passe
  "phone": "+33 1 00 00 00 00",
  "role": "admin",
  "isVerified": true,
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

**Note:** Le mot de passe doit être hashé avec bcrypt. Utilisez le script plutôt.

## 🔐 Connexion à l'interface administrateur

1. **Allez à:** `http://localhost:3000/login`

2. **Entrez vos identifiants:**
   - Email: `admin@amiroute.fr`
   - Mot de passe: `Admin@123456`

3. **Cliquez sur "Connexion"**

4. **Redirection:** Vous serez redirigé automatiquement vers `/admin/dashboard`

## 📊 Accès administrateur

Une fois connecté en tant qu'admin, vous avez accès à:

- **Dashboard** - Aperçu global
- **Utilisateurs** - Gestion des utilisateurs
- **Magasins** - Gestion des magasins
- **Catégories** - Gestion des catégories de produits
- **Commandes** - Suivi des commandes
- **Mon Profil** - Paramètres de compte

## 🔑 Changer votre mot de passe

1. Allez à `/admin/profile`
2. Cliquez sur "Changer le mot de passe"
3. Entrez:
   - Mot de passe actuel
   - Nouveau mot de passe (min 6 caractères)
   - Confirmation du nouveau mot de passe
4. Cliquez sur "Changer le mot de passe"

⚠️ **IMPORTANT:** Changez le mot de passe par défaut au première connexion!

## 🚨 Dépannage

### Problème: "Invalid credentials"
- Vérifiez que vous utilisez le bon email et mot de passe
- Assurez-vous que le compte admin existe dans la base de données
- Réexécutez le script `createAdmin.js`

### Problème: Script MongoDB ne se connecte pas
- Vérifiez la variable `MONGODB_URI` dans `.env`
- Assurez-vous que MongoDB est en cours d'exécution
- Vérifiez votre connexion internet

### Problème: Accès refusé après connexion
- Le rôle doit être exactement `admin`
- L'account doit avoir `isActive: true`
- Vérifiez les middleware d'authentification

## 📚 Structure des rôles dans le code

### Model User (`backend/src/models/User.js`)
```javascript
role: {
  type: String,
  enum: ['client', 'merchant', 'driver', 'admin'],
  default: 'client'
}
```

### Middleware de protection (`backend/src/middleware/roleCheck.js`)
```javascript
const authorize = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  next();
};
```

### Utilisation dans les routes
```javascript
router.get('/admin-only', protect, authorize('admin'), controller);
```

## ✅ Checklist de sécurité

- [x] Créer un compte admin avec un mot de passe fort
- [x] Changer le mot de passe par défaut
- [x] Vérifier que seuls les admins ont accès aux routes `/admin`
- [x] Utiliser HTTPS en production
- [x] Garder les identifiants admin confidentiels
- [x] Implémenter 2FA si nécessaire (futur)

## 📞 Support

Pour plus d'informations, consultez:
- `backend/.env` - Variables d'environnement
- `backend/src/models/User.js` - Schéma utilisateur
- `backend/src/controllers/authController.js` - Logique d'authentification
- `src/app/admin/` - Pages d'administration (frontend)
