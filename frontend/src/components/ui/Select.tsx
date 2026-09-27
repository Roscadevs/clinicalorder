import React from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

/**
 * Menú desplegable del sistema de diseño.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, children, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold text-sand-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2.5 text-sm font-medium',
            'outline-none transition-colors cursor-pointer',
            'focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
            error && 'border-danger-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-xs text-danger-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
