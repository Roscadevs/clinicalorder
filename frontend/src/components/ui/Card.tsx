import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Añade padding interno por defecto (p-4 sm:p-6). */
  padded?: boolean;
  /** Resalta la tarjeta al pasar el cursor (para elementos interactivos/clickeables). */
  interactive?: boolean;
}

/**
 * Contenedor de superficie base (Card) del sistema de diseño (UI Kit).
 * Provee estructura consistente con sombras suaves, bordes cálidos y bordes redondeados.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ padded = true, interactive = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-2xl border border-sand-200 shadow-card transition-all',
          padded && 'p-4 sm:p-6',
          interactive && 'hover:shadow-lift hover:border-sand-300 cursor-pointer active:scale-[0.99]',
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

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between gap-3 mb-2', className)}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-display text-base sm:text-lg font-bold text-sand-900 tracking-tight',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs sm:text-sm text-sand-500', className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-3', className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-end gap-2 pt-4 border-t border-sand-100 mt-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';
