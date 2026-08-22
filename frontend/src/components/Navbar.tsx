import React from 'react'; // React
import { Sparkles, Calendar, UserCheck, ShieldCheck, Settings, BarChart3 } from 'lucide-react'; // Iconos

interface NavbarProps {
  currentTab: 'booking' | 'agenda' | 'clinical' | 'admin' | 'analytics';
  setCurrentTab: (tab: 'booking' | 'agenda' | 'clinical' | 'admin' | 'analytics') => void;
  userRole?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, userRole }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('booking')}>
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-800">Dra. Valeria Gómez</span>
            <span className="block text-xs font-medium text-teal-600">Dermatología & Estética Médica</span>
          </div>
        </div>

        <nav className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => setCurrentTab('booking')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
              currentTab === 'booking'
                ? 'bg-teal-50 text-teal-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Reservar</span>
          </button>

          {(userRole === 'RECEPTIONIST' || userRole === 'PHYSICIAN' || userRole === 'ADMIN') && (
            <button
              onClick={() => setCurrentTab('agenda')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === 'agenda'
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Agenda</span>
            </button>
          )}

          {(userRole === 'PHYSICIAN' || userRole === 'ADMIN') && (
            <button
              onClick={() => setCurrentTab('clinical')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === 'clinical'
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Historia Clínica</span>
            </button>
          )}

          {userRole === 'ADMIN' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === 'admin'
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-700" />
              <span>Tarifas</span>
            </button>
          )}

          {(userRole === 'ADMIN' || userRole === 'PHYSICIAN') && (
            <button
              onClick={() => setCurrentTab('analytics')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === 'analytics'
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <span>Métricas (KPIs)</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
