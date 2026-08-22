import React from 'react'; // React
import { Sparkles, Calendar, UserCheck, ShieldCheck, Settings, BarChart3, LogOut } from 'lucide-react'; // Iconos

interface NavbarProps {
  currentTab: 'booking' | 'agenda' | 'clinical' | 'admin' | 'analytics';
  setCurrentTab: (tab: 'booking' | 'agenda' | 'clinical' | 'admin' | 'analytics') => void;
  userRole?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, userRole, onLogout }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logotipo & Título Médico */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setCurrentTab('booking')}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
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

        {/* Controles de la derecha (Nav + Logout) */}
        <div className="flex items-center space-x-4">
          {/* Navegación de Escritorio (Oculta en Celular porque se usa BottomNav) */}
          <nav className="hidden sm:flex items-center space-x-1.5 sm:space-x-2">
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
                <span>Métricas</span>
              </button>
            )}
          </nav>
          
          {/* Botón de Cerrar Sesión */}
          {userRole !== 'PUBLIC' && (
            <div className="pl-4 border-l border-slate-200">
              <button
                onClick={onLogout}
                className="p-2 sm:px-3 sm:py-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors flex items-center space-x-1.5 font-semibold text-xs sm:text-sm group"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
