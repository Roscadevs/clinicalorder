import React from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-sand-100 text-sand-700',
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  danger: 'bg-danger-100 text-danger-700',
  info: 'bg-info-100 text-info-700',
};

/**
 * Etiqueta de estado. Reemplaza las píldoras de estado repetidas
 * (confirmado / pendiente / cancelado / atendido).
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  className,
  children,
  ...props
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold',
      variantStyles[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
);
