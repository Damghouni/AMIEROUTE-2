# AmieRoute - Plateforme de Livraison

Une plateforme web moderne permettant la commande et la livraison de produits auprès de magasins et restaurants partenaires.

## 🚀 Technologies

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utilitaire
- **Zustand** - Gestion d'état
- **Socket.io Client** - Temps réel

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework backend
- **MongoDB** - Base de données
- **Mongoose** - ODM MongoDB
- **JWT** - Authentification
- **Socket.io** - WebSockets temps réel

## 📁 Structure du projet

```
AmieRoute/
├── src/                      # Frontend Next.js
│   ├── app/
│   │   ├── (auth)/          # Pages authentification
│   │   ├── (client)/        # Interface client
│   │   ├── (driver)/        # Interface livreur
│   │   ├── admin/           # Interface admin
│   │   └── merchant/        # Interface commerçant
│   ├── components/
│   │   ├── ui/              # Composants réutilisables
│   │   ├── client/          # Composants client
│   │   ├── merchant/        # Composants commerçant
│   │   ├── driver/          # Composants livreur
│   │   └── admin/           # Composants admin
│   ├── hooks/               # Hooks personnalisés
│   ├── lib/                 # Utilitaires (API, Socket)
│   ├── stores/              # Stores Zustand
│   └── types/               # Types TypeScript
├── backend/
│   └── src/
│       ├── config/          # Configuration DB
│       ├── controllers/     # Contrôleurs
│       ├── middleware/      # Middlewares
│       ├── models/          # Modèles Mongoose
│       ├── routes/          # Routes API
│       └── utils/           # Utilitaires
└── README.md
```

## 🛠️ Installation

### Prérequis
- Node.js 18+
- MongoDB
- npm ou yarn

### Frontend

```bash
# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Démarrer le serveur de développement
npm run dev
```

### Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env
# Configurer MONGODB_URI et JWT_SECRET dans .env

# Démarrer le serveur
npm run dev
```

## 👥 Rôles utilisateurs

| Rôle | Description | Accès |
|------|-------------|-------|
| **Client** | Commande des produits | `/stores`, `/cart`, `/orders` |
| **Commerçant** | Gère son magasin | `/merchant/*` |
| **Livreur** | Effectue les livraisons | `/available`, `/current`, `/history` |
| **Admin** | Supervise la plateforme | `/admin/*` |

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Magasins
- `GET /api/stores` - Liste des magasins
- `GET /api/stores/:id` - Détail d'un magasin
- `POST /api/stores` - Créer un magasin (commerçant)
- `PUT /api/stores/:id` - Modifier un magasin

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détail d'un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Commandes
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détail d'une commande
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id/status` - Mettre à jour le statut

### Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie (admin)

## 📡 Événements Socket.io

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `order:new` | Server → Client | Nouvelle commande |
| `order:status` | Server → Client | Mise à jour du statut |
| `order:update` | Client → Server | Changer le statut |
| `order:assigned` | Server → Client | Livreur assigné |

## 🔒 Sécurité

- Authentification JWT
- Mots de passe hashés (bcrypt)
- Middleware de vérification des rôles
- Validation des données (express-validator)
- Protection CORS

## 📱 Responsive Design

L'interface est optimisée pour :
- 📱 Mobile (livreurs)
- 💻 Desktop (commerçants, admin)
- 📲 Tablette (tous les rôles)

## 🚧 Évolutions futures

- [ ] Application mobile React Native
- [ ] Paiement en ligne (Stripe)
- [ ] Géolocalisation des livreurs
- [ ] Système de notation et avis
- [ ] Notifications push

## 📄 License



