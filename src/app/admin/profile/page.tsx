'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { User, Lock, Mail, Phone } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Charger le profil
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingProfile(true);

    try {
      const response = await api.put('/auth/profile', {
        name: profileData.name,
        phone: profileData.phone,
      });

      if (response.data?.success) {
        toast.success('Profil mis à jour avec succès!');
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
      toast.error(message);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoadingPassword(true);

    try {
      const response = await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data?.success) {
        toast.success('Mot de passe changé avec succès!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordForm(false);
      } else {
        throw new Error(response.data?.message || 'Erreur lors du changement');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors du changement';
      toast.error(message);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-8 h-8" />
          Mon Profil
        </h1>
        <p className="text-gray-500">Gérez vos informations personnelles</p>
      </div>

      {/* Informations de l'utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'administrateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {user?.role === 'admin' ? 'Administrateur' : user?.role}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Informations personnelles
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de mise à jour du profil */}
      <Card>
        <CardHeader>
          <CardTitle>Mettre à jour mon profil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Nom"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              placeholder="Votre nom"
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              placeholder="Votre email"
              disabled
            />

            <Input
              label="Téléphone"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={handlePasswordChange}
              placeholder="Votre téléphone"
            />

            <Button type="submit" isLoading={isLoadingProfile}>
              Mettre à jour le profil
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Formulaire de changement de mot de passe */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Sécurité
            </CardTitle>
            {!showPasswordForm && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordForm(true)}
              >
                Changer le mot de passe
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showPasswordForm ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Mot de passe actuel"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Entrez votre mot de passe actuel"
                required
              />

              <Input
                label="Nouveau mot de passe"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Entrez votre nouveau mot de passe"
                required
              />

              <Input
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirmez votre nouveau mot de passe"
                required
              />

              <div className="flex gap-3">
                <Button type="submit" isLoading={isLoadingPassword}>
                  Changer le mot de passe
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-gray-600">
              <p className="mb-2">✓ Vous pouvez changer votre mot de passe à tout moment</p>
              <p>Pour des raisons de sécurité, changez régulièrement votre mot de passe</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Changez régulièrement votre mot de passe</li>
            <li>✓ Utilisez un mot de passe fort et unique</li>
            <li>✓ Ne partagez jamais vos identifiants avec quiconque</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
