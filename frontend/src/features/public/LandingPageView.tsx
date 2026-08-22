import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar as CalendarIcon, ShieldCheck, HeartPulse } from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Public Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-800 block leading-tight">
                Dra. Valeria Gómez
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-teal-600 block">
                Dermatología & Estética Médica
              </span>
            </div>
          </div>
          <div>
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors"
            >
              Staff Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-teal-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Cuidamos la salud <span className="text-teal-600">y belleza</span> de tu piel
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Tratamientos dermatológicos y estéticos personalizados con la última tecnología y el respaldo de profesionales médicos expertos.
            </p>
            <button
              onClick={() => navigate('/book')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 inline-flex items-center space-x-2"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Agendar Turno Online</span>
            </button>
          </div>
        </section>

        {/* Services Summary */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Nuestros Servicios Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Dermatología Clínica</h3>
              <p className="text-slate-600 text-sm">
                Diagnóstico y tratamiento integral de enfermedades de la piel, cabello y uñas. Prevención de cáncer de piel.
              </p>
            </div>
            
            {/* Service 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Estética Médica Avanzada</h3>
              <p className="text-slate-600 text-sm">
                Armonización facial, toxina botulínica, ácido hialurónico, bioestimuladores y peelings médicos.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tecnología Láser</h3>
              <p className="text-slate-600 text-sm">
                Tratamientos de vanguardia para rosácea, manchas, cicatrices, rejuvenecimiento y depilación médica definitiva.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p className="font-semibold text-slate-200">Clínica Médica Dermatológica & Estética Dra. Valeria Gómez</p>
        <p className="mt-1 text-xs">© 2026 Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};
