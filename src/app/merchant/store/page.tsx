'use client';

import { useState } from 'react';
import { Store, MapPin, Phone, Clock } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface StoreInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  openingHours: string;
  status: 'active' | 'closed' | 'temporarily_closed';
}

const mockStore: StoreInfo = {
  id: '1',
  name: 'Ma Boutique',
  address: '123 Rue de la Paix, Paris 75001',
  phone: '+33 1 23 45 67 89',
  email: 'contact@maboutique.fr',
  description: 'Une boutique moderne avec une large sélection de produits de qualité.',
  openingHours: 'Lun-Ven: 09:00 - 19:00, Sam: 10:00 - 18:00, Dim: Fermé',
  status: 'active',
};

export default function MerchantStorePage() {
  const [store, setStore] = useState<StoreInfo>(mockStore);
  const [editedStore, setEditedStore] = useState<StoreInfo>(mockStore);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditedStore(store);
    setIsEditing(true);
  };

  const handleInputChange = (field: keyof StoreInfo, value: string) => {
    setEditedStore((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatusChange = (status: 'active' | 'closed' | 'temporarily_closed') => {
    setEditedStore((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Call API to save store information
      // const response = await api.patch(`/stores/${store.id}`, editedStore);
      setStore(editedStore);
      setIsEditing(false);
      console.log('Store updated:', editedStore);
    } catch (error) {
      console.error('Error saving store:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedStore(store);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'temporarily_closed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ouvert';
      case 'closed':
        return 'Fermé';
      case 'temporarily_closed':
        return 'Temporairement fermé';
      default:
        return status;
    }
  };

  const displayStore = isEditing ? editedStore : store;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Store className="w-8 h-8" />
          {displayStore.name}
        </h1>
        <Button
          onClick={() => (isEditing ? handleCancel() : handleEdit())}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </Button>
      </div>

      {/* Store Status */}
      <Card>
        <CardHeader>
          <CardTitle>Statut du magasin</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              <select
                value={editedStore.status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Ouvert</option>
                <option value="closed">Fermé</option>
                <option value="temporarily_closed">Temporairement fermé</option>
              </select>
            </div>
          ) : (
            <div className={`inline-block px-4 py-2 rounded-full font-medium ${getStatusColor(displayStore.status)}`}>
              {getStatusLabel(displayStore.status)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du magasin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du magasin</label>
                <Input
                  type="text"
                  value={editedStore.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nom du magasin"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Adresse
                </label>
                <Input
                  type="text"
                  value={editedStore.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Adresse complète"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Téléphone
                </label>
                <Input
                  type="tel"
                  value={editedStore.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Numéro de téléphone"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={editedStore.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Adresse email"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editedStore.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description du magasin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horaires d'ouverture
                </label>
                <textarea
                  value={editedStore.openingHours}
                  onChange={(e) => handleInputChange('openingHours', e.target.value)}
                  placeholder="Lun-Ven: 09:00 - 19:00..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du magasin</label>
                <div className="text-lg font-semibold text-gray-900">{displayStore.name}</div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <div className="text-gray-900">{displayStore.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <div className="text-gray-900">{displayStore.phone}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="text-gray-900">{displayStore.email}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="text-gray-900">{displayStore.description}</div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horaires d'ouverture</label>
                  <div className="text-gray-900 whitespace-pre-line">{displayStore.openingHours}</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex gap-3 justify-end">
          <Button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700 text-white">
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      )}
    </div>
  );
}
