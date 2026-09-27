import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Calendar, ArrowRight, Home, RefreshCw } from 'lucide-react';

/**
 * Vista mostrada cuando Mercado Pago redirige tras un pago de seña APROBADO.
 */
export const BookingSuccessView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
  const externalRef = searchParams.get('external_reference');
  const paymentStatus = searchParams.get('status') || 'approved';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
            Pago Aprobado
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">¡Tu Turno está Confirmado!</h1>
          <p className="text-sm text-slate-600 mt-2">
            Hemos recibido el pago del 50% de la seña a través de Mercado Pago. Te hemos enviado los detalles de tu cita por correo electrónico.
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
            <span className="font-bold text-emerald-600 capitalize">{paymentStatus === 'approved' ? 'Confirmado' : paymentStatus}</span>
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
            to="/book"
            className="flex-1 inline-flex items-center justify-center space-x-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold py-3.5 px-6 rounded-xl transition-all border border-teal-200"
          >
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Reservar Otro</span>
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
