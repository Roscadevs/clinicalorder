import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Añade padding interno por defecto. */
  padded?: boolean;
  /** Resalta la tarjeta al pasar el mouse (para tarjetas clickeables). */
  interactive?: boolean;
}

/**
 * Superficie base (tarjeta) del sistema de diseño. Reemplaza el patrón
 * repetido `bg-white rounded-2xl border border-slate-200 shadow-sm`.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ padded = true, interactive = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-2xl border border-sand-200 shadow-card',
          padded && 'p-4 sm:p-6',
          interactive && 'transition-all hover:shadow-lift hover:border-sand-300 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex items-center justify-between gap-3', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn('font-display text-base sm:text-lg font-bold text-sand-900', className)} {...props}>
    {children}
  </h3>
);
