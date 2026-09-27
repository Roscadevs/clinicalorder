import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MessageCircle, Search } from 'lucide-react';
import { servicesApi } from '../../services/api';
import { DermatologicService } from '../../types';
import { Logo, Spinner } from '../../components/ui';
import { BlurText } from '../../components/reactbits';
import { whatsappLink, serviceInquiryMessage, BOOKING_MESSAGE } from '../../config/contact';

/**
 * Catálogo público de tratamientos. El paciente no reserva desde acá:
 * cada tratamiento ofrece consultar por WhatsApp, donde el staff agenda el turno.
 */
export const ServicesCatalogView: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<DermatologicService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    servicesApi
      .getActiveServices()
      .then(setServices)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...services]
      .filter((s) => s.active)
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }, [services, query]);

  return (
    <div className="min-h-screen bg-sand-50 text-sand-900 flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-sand-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-left">
            <Logo variant="mark" className="w-12 h-12 sm:w-14 sm:h-14 text-primary-500" />
            <div>
              <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-sand-900 block leading-tight">
                Dra. Paula Villa Fuhrmann
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-primary-500 block">
                Especialista en Medicina Estética
              </span>
            </div>
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sand-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver al inicio</span>
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col items-center text-center mb-10">
          <BlurText
            text="Tratamientos y servicios"
            animateBy="words"
            direction="top"
            delay={100}
            className="font-display text-3xl sm:text-4xl font-bold text-sand-900 justify-center mb-3"
          />
          <p className="text-sand-600 max-w-2xl">
            Conocé cada tratamiento en detalle. Para reservar, escribinos por WhatsApp y coordinamos tu turno.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tratamiento…"
            aria-label="Buscar tratamiento"
            className="w-full bg-white border border-sand-300 rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner label="Cargando tratamientos" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sand-500 py-16">No encontramos tratamientos que coincidan con tu búsqueda.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((svc) => (
              <li
                key={svc.id}
                className="bg-white rounded-2xl border border-sand-200 shadow-card p-6 flex flex-col"
              >
                <h2 className="font-display text-xl font-bold text-sand-900 mb-2">{svc.name}</h2>
                <p className="text-sm text-sand-600 leading-relaxed mb-5 flex-grow">{svc.description}</p>
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-sand-100">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sand-500">
                    <Clock className="w-3.5 h-3.5" />
                    {svc.durationMinutes} min
                  </span>
                  <a
                    href={whatsappLink(serviceInquiryMessage(svc.name))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Consultar
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center mt-14">
          <a
            href={whatsappLink(BOOKING_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-soft transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Solicitar turno por WhatsApp
          </a>
        </div>
      </main>

      <footer className="bg-sand-900 text-sand-300 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center gap-3">
          <Logo variant="mark" className="w-16 h-16 text-white/90" />
          <p className="font-display font-semibold text-white">Dra. Paula Villa Fuhrmann</p>
          <p className="text-xs text-sand-400">© 2026 Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
