import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

/**
 * Página 404 — Ruta no encontrada.
 *
 * Mensaje neutro y deliberadamente genérico: no revela rutas internas, versiones,
 * nombres de framework ni ninguna información que pueda orientar a un atacante.
 * Ofrece simplemente un camino de regreso a una página válida.
 */
export const NotFoundView: React.FC = () => {
  return (
    <main
      role="main"
      className="flex min-h-screen w-full flex-col items-center justify-center bg-sand-50 px-6 text-center text-sand-900"
    >
      <div className="w-full max-w-md rounded-3xl border border-sand-300 bg-white/80 p-8 shadow-card">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-700">
          <Compass className="h-7 w-7" />
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight">Página no encontrada</h1>

        <p className="mt-3 text-sm leading-relaxed text-sand-600">
          La página que buscás no existe o fue movida. Verificá la dirección o volvé al inicio para
          continuar.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-600 active:scale-95"
        >
          <Home className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>
    </main>
  );
};

export default NotFoundView;
