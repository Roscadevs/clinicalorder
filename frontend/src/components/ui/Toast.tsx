import React from 'react';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

/**
 * Toaster con la paleta cálida de la clínica (sand, toffee, terracota, oliva).
 * Se monta una sola vez en el componente raíz (App.tsx o main.tsx).
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex items-center gap-3 w-full p-4 rounded-2xl border shadow-card font-sans text-sm transition-all duration-200 select-none',
          default: 'bg-white border-sand-300 text-sand-900',
          error:
            'bg-danger-50 border-danger-200 text-danger-700 font-medium [&_[data-icon]]:text-danger',
          warning:
            'bg-warning-50 border-warning-200 text-warning-700 font-medium [&_[data-icon]]:text-warning',
          success:
            'bg-success-50 border-success-200 text-success-700 font-medium [&_[data-icon]]:text-success',
          info:
            'bg-info-50 border-info-200 text-info-700 font-medium [&_[data-icon]]:text-info',
          actionButton:
            'bg-primary text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-primary-600 transition-colors shadow-soft',
          cancelButton:
            'bg-sand-200 text-sand-800 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-sand-300 transition-colors',
          closeButton:
            'bg-transparent hover:bg-sand-200/60 text-sand-600 rounded-lg p-1 transition-colors',
        },
      }}
    />
  );
}

/**
 * Notificación amable de error que evita pánico visual y ofrece opción de reintento.
 */
export const notifyFriendlyError = (
  message: string,
  options?: {
    description?: string;
    onRetry?: () => void;
    duration?: number;
  }
) => {
  return sonnerToast.error(message, {
    description: options?.description,
    duration: options?.duration ?? 6000,
    action: options?.onRetry
      ? {
          label: 'Reintentar',
          onClick: options.onRetry,
        }
      : undefined,
  });
};

export const toast = {
  ...sonnerToast,
  friendlyError: notifyFriendlyError,
};
