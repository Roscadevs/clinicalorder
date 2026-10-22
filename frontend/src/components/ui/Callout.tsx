import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export type CalloutIntent = 'error' | 'warning' | 'success' | 'info' | 'neutral';

interface CalloutProps {
  intent?: CalloutIntent;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  className?: string;
}

const intentStyles: Record<
  CalloutIntent,
  { container: string; icon: string; defaultIcon: React.ReactNode }
> = {
  error: {
    container: 'bg-danger-50 border-danger-200 text-danger-700',
    icon: 'text-danger',
    defaultIcon: <AlertCircle className="w-5 h-5 shrink-0" />,
  },
  warning: {
    container: 'bg-warning-50 border-warning-200 text-warning-700',
    icon: 'text-warning',
    defaultIcon: <AlertTriangle className="w-5 h-5 shrink-0" />,
  },
  success: {
    container: 'bg-success-50 border-success-200 text-success-700',
    icon: 'text-success',
    defaultIcon: <CheckCircle2 className="w-5 h-5 shrink-0" />,
  },
  info: {
    container: 'bg-info-50 border-info-200 text-info-700',
    icon: 'text-info',
    defaultIcon: <Info className="w-5 h-5 shrink-0" />,
  },
  neutral: {
    container: 'bg-sand-100 border-sand-300 text-sand-800',
    icon: 'text-sand-600',
    defaultIcon: <Info className="w-5 h-5 shrink-0" />,
  },
};

/**
 * Callout in-page accesible y amable para reportar avisos y estados
 * sin recurrir a colores estridentes o diálogos bloqueantes.
 */
export const Callout: React.FC<CalloutProps> = ({
  intent = 'error',
  title,
  children,
  icon,
  action,
  onClose,
  className = '',
}) => {
  const current = intentStyles[intent];

  return (
    <div
      role="alert"
      className={`relative w-full rounded-2xl border p-4 flex items-start gap-3.5 text-sm transition-all shadow-soft ${current.container} ${className}`}
    >
      <div className={`mt-0.5 ${current.icon}`}>
        {icon ?? current.defaultIcon}
      </div>

      <div className="flex-1 min-w-0">
        {title && <h5 className="font-semibold text-sm leading-tight mb-1">{title}</h5>}
        <div className="text-xs sm:text-sm leading-relaxed opacity-95">{children}</div>

        {action && (
          <div className="mt-3">
            <button
              type="button"
              onClick={action.onClick}
              className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
