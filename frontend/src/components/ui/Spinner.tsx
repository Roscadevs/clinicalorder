import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SpinnerProps {
  className?: string;
  label?: string;
}

/** Indicador de carga accesible. */
export const Spinner: React.FC<SpinnerProps> = ({ className, label = 'Cargando' }) => (
  <span role="status" aria-live="polite" className="inline-flex items-center gap-2 text-sand-500">
    <Loader2 className={cn('w-5 h-5 animate-spin text-primary-500', className)} aria-hidden="true" />
    <span className="sr-only">{label}</span>
  </span>
);
