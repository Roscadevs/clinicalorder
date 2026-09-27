import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/ui';
import { Aurora, BlurText, SpotlightCard, SpecularButton } from '../../components/reactbits';
import { whatsappLink, BOOKING_MESSAGE } from '../../config/contact';

const services = [
  {
    title: 'Salud capilar',
    description:
      'Diagnóstico y tratamiento integral de estimulación, fortalecimiento y crecimiento.',
  },
  {
    title: 'Cuidado de la piel',
    description:
      'Bioestimuladores de colágeno, microneedling, tratamientos que trabajan respetando las facciones y potenciando lo propio.',
  },
  {
    title: 'Armonización facial',
    description:
      'Hilos PDO, ácido hialurónico, toxina botulínica, recuperación ante el paso del tiempo.',
  },
];

export const LandingPageView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sand-50 text-sand-900 flex flex-col font-sans">
      {/* Header público */}
      <header className="bg-white/80 backdrop-blur-md border-b border-sand-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="mark" className="w-14 h-14 sm:w-16 sm:h-16 text-primary-500" />
            <div>
              <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-sand-900 block leading-tight">
                Dra. Paula Villa Fuhrmann
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-primary-500 block">
                Especialista en Medicina Estética
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-sand-600 hover:text-primary-600 transition-colors"
          >
            Acceder
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero con Aurora presente y colorida + texto claro encima */}
        <section className="relative overflow-hidden bg-sand-900">
          {/* Fondo Aurora: presente, colorido */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <Aurora
              colorStops={['#C9AB94', '#93654F', '#B39D87']}
              blend={0.4}
              amplitude={1.2}
              speed={0.8}
            />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-sand-100 backdrop-blur-sm mb-6">
              todo lo que necesitas para sentirte y verte mejor
            </span>

            <BlurText
              text="Cuidamos la salud y belleza de tu piel"
              animateBy="words"
              direction="top"
              delay={120}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white justify-center leading-[1.1] mb-6"
            />

            <div className="flex justify-center">
              <SpecularButton
                size="lg"
                radius={16}
                tint="#6C4E40"
                tintOpacity={1}
                baseColor="#C9AB94"
                lineColor="#FBF9F7"
                textColor="#FBF9F7"
                intensity={1.4}
                proximity={320}
                onClick={() =>
                  window.open(whatsappLink(BOOKING_MESSAGE), '_blank', 'noopener,noreferrer')
                }
              >
                <span className="inline-flex items-center gap-2 font-semibold">
                  <CalendarIcon className="w-5 h-5" />
                  Solicitar turno por WhatsApp
                </span>
              </SpecularButton>
            </div>
          </div>
        </section>

        {/* Servicios destacados con SpotlightCard */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <BlurText
              text="Nuestros Servicios Destacados"
              animateBy="words"
              direction="top"
              delay={100}
              className="font-display text-3xl sm:text-4xl font-bold text-sand-900 justify-center mb-3"
            />
            <BlurText
              text="Tratamientos progresivos, personalizados y con criterio médico, pensados para acompañarte en cada etapa"
              animateBy="words"
              direction="top"
              delay={40}
              className="text-sand-600 max-w-2xl justify-center"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc) => {
              return (
                <SpotlightCard key={svc.title} className="h-full">
                  <h3 className="font-display text-xl font-bold text-sand-900 mb-2 text-center">{svc.title}</h3>
                  <p className="text-sand-600 text-sm leading-relaxed text-center">{svc.description}</p>
                </SpotlightCard>
              );
            })}
          </div>

          {/* Pill hacia el catálogo completo de tratamientos */}
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate('/servicios')}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary-300 bg-white text-sm font-semibold text-primary-600 shadow-soft hover:bg-primary-50 hover:border-primary-400 transition-colors"
            >
              Conocé todos nuestros tratamientos y servicios
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-sand-900 text-sand-300 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center gap-3">
          <Logo variant="mark" className="w-16 h-16 text-white/90" />
          <p className="font-display font-semibold text-white">
           Dra. Paula Villa Fuhrmann
          </p>
          <p className="text-xs text-sand-400">© 2026 Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
