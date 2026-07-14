'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface CategoryFormData {
  name: string;
  description: string;
  image?: string;
}

interface CategoryFormProps {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function CategoryForm({ initialData, onSubmit, isLoading }: CategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CategoryFormData>(
    initialData || {
      name: '',
      description: '',
      image: '',
    }
  );
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop grande. Taille max: 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        
        // Compresser l'image
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensionner si nécessaire (max 800px)
          if (width > 800 || height > 800) {
            const ratio = Math.min(800 / width, 800 / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedResult = canvas.toDataURL('image/jpeg', 0.8);
            setPreviewImage(compressedResult);
            setFormData((prev) => ({ ...prev, image: compressedResult }));
          }
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <Input
            label="Nom de la catégorie"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Pizza, Burgers, Sushi..."
            required
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Décrivez cette catégorie..."
          />
        </div>

        {/* Image */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image de la catégorie
            <span className="block text-xs text-gray-500 font-normal mt-0.5">
              Format: JPG, PNG (max 5MB) - Sera automatiquement compressée
            </span>
          </label>
          {previewImage ? (
            <div className="relative w-48 h-48">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <span className="text-lg">×</span>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-10 h-10 text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  Cliquez pour uploader une image
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Mettre à jour' : 'Créer la catégorie'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
