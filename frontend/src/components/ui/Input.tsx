import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Campo de texto base del sistema de diseño (UI Kit).
 * Incluye soporte para etiquetas (labels), íconos a izquierda/derecha,
 * mensajes de ayuda y estados de validación/error accesibles.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || props.name || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={cn(fullWidth ? 'w-full' : 'inline-block')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-sand-700 mb-1.5 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sand-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              'w-full bg-sand-50/70 border border-sand-300 rounded-xl px-4 py-2.5 text-sm text-sand-900',
              'placeholder:text-sand-400 transition-colors',
              'focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
              'disabled:bg-sand-100 disabled:text-sand-400 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error &&
                'border-danger-500 focus:ring-danger-500/30 focus:border-danger-500 text-danger-900',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sand-400 pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <p id={errorId} className="mt-1.5 text-xs text-danger-600 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1.5 text-xs text-sand-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
