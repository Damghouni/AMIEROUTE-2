'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {

    const baseStyles =
      `
      inline-flex
      items-center
      justify-center
      font-medium
      rounded-lg
      transition-colors
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      disabled:opacity-50
      disabled:cursor-not-allowed
      `;


    const variantStyles = {

      primary:
        'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',

      secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',

      outline:
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',

      ghost:
        'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',

      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'

    };


    const sizeStyles = {

      sm:
        'px-3 py-1.5 text-sm',

      md:
        'px-4 py-2 text-base',

      lg:
        'px-6 py-3 text-lg'

    };


    const widthStyles =
      fullWidth ? 'w-full' : '';



    return (

      <button

        ref={ref}

        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${widthStyles}
          ${className}
        `}

        disabled={disabled || isLoading}

        {...props}

      >

        {isLoading && (

          <Loader2
            className="
              mr-2
              h-4
              w-4
              animate-spin
            "
          />

        )}


        {children}


      </button>

    );

  }
);


Button.displayName = 'Button';


export default Button;