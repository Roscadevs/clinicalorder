import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'destructive'
  | 'success';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-soft focus-visible:ring-primary-500/50',
  secondary:
    'bg-sand-100 text-sand-800 hover:bg-sand-200 active:bg-sand-300 border border-sand-200 focus-visible:ring-sand-400/50',
  outline:
    'bg-transparent text-primary-600 border border-primary-300 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500/50',
  ghost:
    'bg-transparent text-sand-600 hover:bg-sand-100 hover:text-sand-900 focus-visible:ring-sand-400/50',
  danger:
    'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 shadow-soft focus-visible:ring-danger-500/50',
  destructive:
    'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 shadow-soft focus-visible:ring-danger-500/50',
  success:
    'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-soft focus-visible:ring-success-500/50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg min-h-[36px]',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl min-h-[42px]',
  lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5 rounded-xl min-h-[48px]',
  icon: 'p-2.5 rounded-xl min-h-[40px] min-w-[40px]',
};

/**
 * Botón base del sistema de diseño (UI Kit).
 * Soporta variantes, tamaños, estado de carga reactivo e íconos laterales.
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
          'inline-flex items-center justify-center font-semibold transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]',
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
