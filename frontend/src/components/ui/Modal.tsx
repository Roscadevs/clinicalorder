import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  /** Oculta el botón X de cierre. */
  hideCloseButton?: boolean;
  className?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * Diálogo modal accesible del sistema de diseño. Reemplaza los overlays
 * `fixed inset-0 bg-black/40 ...` repetidos en las vistas.
 * Cierra con Escape y click en el backdrop. Bloquea el scroll del body.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  hideCloseButton = false,
  className,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sand-900/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'bg-white rounded-2xl shadow-lift w-full max-h-[90vh] overflow-y-auto',
          sizeStyles[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between gap-4 p-5 border-b border-sand-100">
            {title && (
              <h3 className="font-display text-base sm:text-lg font-bold text-sand-900">{title}</h3>
            )}
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-sand-400 hover:bg-sand-100 hover:text-sand-700 transition-colors ml-auto"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 p-5 border-t border-sand-100 bg-sand-50/60 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
