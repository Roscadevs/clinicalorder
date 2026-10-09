import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'destructive'
  | 'info';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Muestra un punto indicador de estado a la izquierda. */
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-sand-100 text-sand-700 border-sand-200',
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  success: 'bg-success-100 text-success-700 border-success-200',
  warning: 'bg-warning-100 text-warning-700 border-warning-200',
  danger: 'bg-danger-100 text-danger-700 border-danger-200',
  destructive: 'bg-danger-100 text-danger-700 border-danger-200',
  info: 'bg-info-100 text-info-700 border-info-200',
};

const dotStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-sand-400',
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  destructive: 'bg-danger-500',
  info: 'bg-info-500',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
};

/**
 * Etiqueta de estado (Badge/Pill) del sistema de diseño (UI Kit).
 * Ideal para representar estados de tickets, turnos y citas médicas
 * (Pendiente, Resuelto, Confirmado, Cancelado).
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'neutral',
      size = 'md',
      dot = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-bold border select-none transition-colors',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotStyles[variant])}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
