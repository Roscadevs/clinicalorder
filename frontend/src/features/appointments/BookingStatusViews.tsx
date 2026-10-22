import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Calendar, Home, RefreshCw, Loader2 } from 'lucide-react';
import { appointmentsApi } from '../../services/api';

/**
 * Vista mostrada cuando Mercado Pago redirige tras un pago de seña.
 * Realiza sondeo asíncrono (polling) hacia el backend para verificar que el turno
 * esté efectivamente CONFIRMED en la base de datos antes de dar por cerrada la operación.
 */
export const BookingSuccessView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
  const externalRef = searchParams.get('external_reference');

  const [verificationState, setVerificationState] = useState<'verifying' | 'confirmed' | 'pending_delayed' | 'failed'>('verifying');
  const [serviceName, setServiceName] = useState<string>('Consulta Dermatológica');

  useEffect(() => {
    if (!externalRef || isNaN(Number(externalRef))) {
      // Si no hay referencia de turno en la URL, asumir confirmado si el status de MP fue approved
      const statusParam = searchParams.get('status');
      setVerificationState(statusParam === 'approved' ? 'confirmed' : 'pending_delayed');
      return;
    }

    const apptId = Number(externalRef);
    let attempts = 0;
    const maxAttempts = 7; // ~14 segundos de sondeo total (2s por intervalo)
    let isCancelled = false;

    const checkStatus = async () => {
      try {
        const data = await appointmentsApi.getPublicStatus(apptId);
        if (isCancelled) return;

        if (data.serviceName) {
          setServiceName(data.serviceName);
        }

        if (data.status === 'CONFIRMED' || data.status === 'COMPLETED') {
          setVerificationState('confirmed');
          return;
        }

        if (data.status === 'PAYMENT_FAILED' || data.status === 'CANCELED') {
          setVerificationState('failed');
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          // Si el webhook tarda más de 14s, mostrar estado de espera amigable sin alarmar al paciente
          setVerificationState('pending_delayed');
        } else {
          setTimeout(checkStatus, 2000);
        }
      } catch {
        attempts++;
        if (attempts >= maxAttempts) {
          setVerificationState('pending_delayed');
        } else {
          setTimeout(checkStatus, 2000);
        }
      }
    };

    checkStatus();

    return () => {
      isCancelled = true;
    };
  }, [externalRef, searchParams]);

  if (verificationState === 'verifying') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-teal-50/50">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Verificando tu pago...</h1>
            <p className="text-sm text-slate-600 mt-2">
              Estamos confirmando la acreditación con Mercado Pago. Esto solo tomará unos segundos.
            </p>
          </div>
          {externalRef && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
              Reserva Turno #{externalRef}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (verificationState === 'failed') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50">
            <XCircle className="w-10 h-10" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
              Pago No Acreditado
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">No pudimos confirmar tu reserva</h1>
            <p className="text-sm text-slate-600 mt-2">
              El pago fue rechazado o cancelado. Por favor, revisa tus medios de pago o contacta a la clínica.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/servicios"
              className="inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Ver Servicios Disponibles</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
            {verificationState === 'confirmed' ? 'Pago Acreditado' : 'Pago Procesado'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {verificationState === 'confirmed' ? '¡Tu Turno está Confirmado!' : '¡Pago Recibido en Proceso!'}
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            {verificationState === 'confirmed'
              ? `Hemos acreditado la seña del 50% para tu atención de ${serviceName}. Los detalles han sido enviados a tu correo electrónico.`
              : 'Mercado Pago ha procesado el pago. En breves instantes se completará la conciliación y recibirás la confirmación por correo.'}
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-2 text-sm">
          {externalRef && (
            <div className="flex justify-between">
              <span className="text-slate-500">N° de Turno:</span>
              <span className="font-bold text-slate-800">#{externalRef}</span>
            </div>
          )}
          {paymentId && (
            <div className="flex justify-between">
              <span className="text-slate-500">ID de Pago MP:</span>
              <span className="font-mono text-xs text-slate-700 bg-slate-200 px-2 py-0.5 rounded">{paymentId}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-2">
            <span className="text-slate-500">Estado del Turno:</span>
            <span className="font-bold text-emerald-600">
              {verificationState === 'confirmed' ? 'Confirmado' : 'Acreditando...'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>
          <Link
            to="/servicios"
            className="flex-1 inline-flex items-center justify-center space-x-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold py-3.5 px-6 rounded-xl transition-all border border-teal-200"
          >
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Ver Más Servicios</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * Vista mostrada cuando Mercado Pago redirige tras un pago RECHAZADO o CANCELADO.
 */
export const BookingFailureView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50">
          <XCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
            Pago No Completado
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">No pudimos procesar tu pago</h1>
          <p className="text-sm text-slate-600 mt-2">
            El pago de la seña no se completó o fue rechazado por la entidad emisora. La reserva temporal ha sido liberada.
          </p>
        </div>

        {paymentId && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
            Referencia de transacción: {paymentId}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/book"
            className="flex-1 inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar Reserva</span>
          </Link>
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-xl transition-all border border-slate-300"
          >
            <span>Ir al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * Vista mostrada cuando el pago está PENDIENTE (ej. pago en efectivo o acreditación diferida).
 */
export const BookingPendingView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50">
          <Clock className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
            Pago Pendiente
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Tu pago está en revisión</h1>
          <p className="text-sm text-slate-600 mt-2">
            Mercado Pago está procesando la transacción. Tan pronto como se acredite el monto, tu turno quedará automáticamente confirmado y te notificaremos por correo.
          </p>
        </div>

        {paymentId && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
            ID de Referencia: {paymentId}
          </div>
        )}

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
