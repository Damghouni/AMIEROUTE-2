#!/usr/bin/env node

/**
 * Script to create an admin user
 * Run: node createAdmin.js
 */

const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connexion MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ Connecté à MongoDB');

    // Données de l'admin
    const adminData = {
      name: 'Administrateur',
      email: 'admin@amiroute.fr',
      password: 'Admin@123456', // À changer après création
      phone: '+33 1 00 00 00 00',
      role: 'admin',
      isVerified: true,
      isActive: true,
    };

    // Vérifier si l'admin existe déjà
    const adminExists = await User.findOne({ email: adminData.email });
    if (adminExists) {
      console.log('⚠️  Un admin avec cet email existe déjà!');
      console.log('Email:', adminExists.email);
      console.log('ID:', adminExists._id);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Créer l'admin
    const admin = await User.create(adminData);

    console.log('\n✓ Administrateur créé avec succès!');
    console.log('\n📧 Identifiants de connexion:');
    console.log('   Email: ' + adminData.email);
    console.log('   Mot de passe: ' + adminData.password);
    console.log('   Rôle: ' + admin.role);
    console.log('\n⚠️  IMPORTANT: Changez le mot de passe après votre première connexion!');

    await mongoose.connection.close();
    console.log('\n✓ Script terminé');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

createAdmin();
