import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  fullWidth?: boolean;
}

/**
 * Menú desplegable estilizado del sistema de diseño (UI Kit).
 * Incluye flecha decorativa consistente, compatibilidad con array `options`
 * o hijos `<option>`, estados de error y textos de ayuda.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      fullWidth = true,
      className,
      id,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || props.name || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className={cn(fullWidth ? 'w-full' : 'inline-block')}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-bold text-sand-700 mb-1.5 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              'w-full appearance-none bg-sand-50/70 border border-sand-300 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-sand-900',
              'outline-none transition-colors cursor-pointer',
              'focus:bg-white focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
              'disabled:bg-sand-100 disabled:text-sand-400 disabled:cursor-not-allowed',
              error && 'border-danger-500 focus:ring-danger-500/30 focus:border-danger-500',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-sand-500">
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </span>
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

Select.displayName = 'Select';
