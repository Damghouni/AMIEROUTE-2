'use client';

type StatusType =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'validated'
  | 'suspended'
  | 'completed'
  | 'cancelled'
  | 'processing'
  | 'delivered'
  | 'default';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusStyles: Record<StatusType, { bg: string; text: string; dot: string }> = {
  active: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  inactive: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    dot: 'bg-gray-500',
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'bg-yellow-500',
  },
  validated: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  suspended: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
  completed: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
  processing: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    dot: 'bg-orange-500',
  },
  delivered: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  default: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    dot: 'bg-gray-500',
  },
};

const statusLabels: Record<StatusType, string> = {
  active: 'Actif',
  inactive: 'Inactif',
  pending: 'En attente',
  validated: 'Validé',
  suspended: 'Suspendu',
  completed: 'Terminé',
  cancelled: 'Annulé',
  processing: 'En cours',
  delivered: 'Livré',
  default: 'Inconnu',
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.default;
  const displayLabel = label || statusLabels[status] || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {displayLabel}
    </span>
  );
}
