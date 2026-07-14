'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2, Check } from 'lucide-react';

interface StatusButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  status: 'pending' | 'active' | 'completed';
  isLoading?: boolean;
}

const StatusButton = forwardRef<HTMLButtonElement, StatusButtonProps>(
  ({ children, className = '', status, isLoading = false, disabled, ...props }, ref) => {
    const baseStyles =
      'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all text-sm';

    const statusStyles = {
      pending: 'bg-gray-100 text-gray-500 border border-gray-200',
      active: 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 active:scale-[0.98]',
      completed: 'bg-green-100 text-green-700 border border-green-200',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${statusStyles[status]} ${className}`}
        disabled={disabled || isLoading || status === 'completed'}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === 'completed' && <Check className="h-4 w-4" />}
        {children}
      </button>
    );
  }
);

StatusButton.displayName = 'StatusButton';

export default StatusButton;
