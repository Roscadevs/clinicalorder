import React from 'react'; // React
import { Calendar, UserCheck, ShieldCheck, Settings, BarChart3 } from 'lucide-react'; // Iconos

interface BottomNavProps {
  currentTab: 'booking' | 'agenda' | 'clinical' | 'admin' | 'analytics';
  setCurrentTab: (tab: 'booking' | 'agenda' | 'clinical' | 'admin' | 'analytics') => void;
  userRole?: string;
}

/**
 * Barra de Navegación Inferior Táctil (Bottom Tab Bar) para Celulares (Estilo iOS / Android).
 * Optimizada para interacción con el pulgar con zonas de toque mínimas de 48x48px.
 */
export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab, userRole }) => {
  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 py-1 shadow-lg flex justify-around items-center">
      {/* Botón Reservar */}
      <button
        onClick={() => setCurrentTab('booking')}
        className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] rounded-xl transition-colors ${
          currentTab === 'booking' ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <div className={`p-1 rounded-xl ${currentTab === 'booking' ? 'bg-teal-50 text-teal-600' : ''}`}>
          <Calendar className="w-5 h-5" />
        </div>
        <span className="text-[10px] mt-0.5">Reservar</span>
      </button>

      {/* Botón Agenda (Secretaria / Médica / Admin) */}
      {(userRole === 'RECEPTIONIST' || userRole === 'PHYSICIAN' || userRole === 'ADMIN') && (
        <button
          onClick={() => setCurrentTab('agenda')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] rounded-xl transition-colors ${
            currentTab === 'agenda' ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className={`p-1 rounded-xl ${currentTab === 'agenda' ? 'bg-teal-50 text-teal-600' : ''}`}>
            <UserCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Agenda</span>
        </button>
      )}

      {/* Botón Historia Clínica (Médica / Admin) */}
      {(userRole === 'PHYSICIAN' || userRole === 'ADMIN') && (
        <button
          onClick={() => setCurrentTab('clinical')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] rounded-xl transition-colors ${
            currentTab === 'clinical' ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className={`p-1 rounded-xl ${currentTab === 'clinical' ? 'bg-teal-50 text-teal-600' : ''}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Clínica</span>
        </button>
      )}

      {/* Botón Tarifas (Admin) */}
      {userRole === 'ADMIN' && (
        <button
          onClick={() => setCurrentTab('admin')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] rounded-xl transition-colors ${
            currentTab === 'admin' ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className={`p-1 rounded-xl ${currentTab === 'admin' ? 'bg-teal-50 text-teal-600' : ''}`}>
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Tarifas</span>
        </button>
      )}

      {/* Botón Métricas KPIs (Admin / Médica) */}
      {(userRole === 'ADMIN' || userRole === 'PHYSICIAN') && (
        <button
          onClick={() => setCurrentTab('analytics')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] rounded-xl transition-colors ${
            currentTab === 'analytics' ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className={`p-1 rounded-xl ${currentTab === 'analytics' ? 'bg-teal-50 text-teal-600' : ''}`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Métricas</span>
        </button>
      )}
    </nav>
  );
};
