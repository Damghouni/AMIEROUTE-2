'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { Button, Input, Card } from '@/components/ui';
import { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
   const redirect = searchParams.get('redirect') || '/stores';
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const user = await login(email, password);
      toast.success('Connexion réussie');

      if (redirect) {
        router.push(redirect);
      } else {
        let redirectPath = '/';
        switch (user?.role) {
          case 'merchant':
            redirectPath = '/merchant/dashboard';
            break;
          case 'driver':
            redirectPath = '/available';
            break;
          case 'admin':
            redirectPath = '/admin/dashboard';
            break;
        }
        router.push(redirectPath);
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Erreur de connexion';
      toast.error(message);
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Connexion</CardTitle>
        <p className="text-center text-gray-500 mt-2">
          Bienvenue sur AmieRoute
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isLoading}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={isLoading}
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Se connecter
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-center">
        <p className="text-gray-600">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            S'inscrire
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}