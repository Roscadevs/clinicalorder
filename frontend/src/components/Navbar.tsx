import React from 'react'; // React
import { Sparkles, Calendar, UserCheck, ShieldCheck, Settings, LogOut } from 'lucide-react'; // Iconos

interface NavbarProps {
  currentTab: 'booking' | 'agenda' | 'clinical' | 'admin';
  setCurrentTab: (tab: 'booking' | 'agenda' | 'clinical' | 'admin') => void;
  userRole?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, userRole, onLogout }) => {
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

        <nav className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setCurrentTab('booking')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
              currentTab === 'booking'
                ? 'bg-teal-50 text-teal-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Reservar Turno</span>
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
              <span>Agenda & Cobros</span>
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
              <span>Tarifas (Admin)</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
