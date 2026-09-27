import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-soft',
  secondary:
    'bg-sand-100 text-sand-800 hover:bg-sand-200 active:bg-sand-300 border border-sand-200',
  outline:
    'bg-transparent text-primary-600 border border-primary-300 hover:bg-primary-50 active:bg-primary-100',
  ghost:
    'bg-transparent text-sand-600 hover:bg-sand-100 hover:text-sand-900',
  danger:
    'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 shadow-soft',
  success:
    'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-soft',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-2 gap-1.5 rounded-lg min-h-[36px]',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl min-h-[42px]',
  lg: 'text-sm sm:text-base px-6 py-3.5 gap-2 rounded-xl min-h-[48px]',
  icon: 'p-2 rounded-lg',
};

/**
 * Botón base del sistema de diseño. Reemplaza los <button> con clases
 * repetidas por todo el proyecto. Soporta variantes, tamaños, estado de
 * carga e íconos a izquierda/derecha.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-colors',
          'focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
