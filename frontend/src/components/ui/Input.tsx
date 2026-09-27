import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Ícono opcional a la izquierda del campo. */
  leftIcon?: React.ReactNode;
}

/**
 * Campo de texto del sistema de diseño. Incluye label, ícono y error.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-sand-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sand-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-sand-50 border border-sand-300 rounded-xl px-4 py-2.5 text-sm',
              'placeholder:text-sand-400 outline-none transition-colors',
              'focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
              leftIcon && 'pl-10',
              error && 'border-danger-500 focus:ring-danger-500/40 focus:border-danger-500',
              className
            )}
            aria-invalid={error ? true : undefined}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-danger-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
