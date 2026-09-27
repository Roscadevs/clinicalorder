import React from 'react';
import { Calendar, UserCheck, ShieldCheck, Settings, BarChart3, LogOut } from 'lucide-react';
import { Logo } from './ui';
import { cn } from '../utils/cn';
import { NAV_TABS, type TabType, type RoleType } from './navConfig';

const ICONS = { Calendar, UserCheck, ShieldCheck, Settings, BarChart3 } as const;

interface NavbarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  userRole?: RoleType;
  fullName?: string;
  onLogout?: () => void;
}

/**
 * Barra superior del panel interno. Navegación de escritorio (en móvil se usa
 * BottomNav) filtrada por rol, logo de marca y cierre de sesión.
 */
export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, userRole, fullName, onLogout }) => {
  const visibleTabs = NAV_TABS.filter((tab) => !userRole || tab.roles.includes(userRole));

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-sand-200 sticky top-0 z-40 shadow-soft">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo y título */}
        <button
          onClick={() => setCurrentTab(visibleTabs[0]?.id ?? 'agenda')}
          className="flex items-center gap-2.5 flex-shrink-0 text-left"
        >
          <Logo variant="mark" className="w-9 h-9 sm:w-10 sm:h-10 text-primary-500" />
          <div className="hidden xs:block sm:block">
            <span className="font-display text-sm sm:text-base font-bold tracking-tight text-sand-900 block leading-tight">
              Dra. Paula Villa Fuhrmann
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-primary-500 block">
              Especialista en Medicina Estética
            </span>
          </div>
        </button>

        <div className="flex items-center gap-3">
          {/* Navegación de escritorio */}
          <nav className="hidden sm:flex items-center gap-1.5">
            {visibleTabs.map((tab) => {
              const Icon = ICONS[tab.icon];
              const active = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5',
                    active
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-sand-600 hover:text-sand-900 hover:bg-sand-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Cierre de sesión */}
          {onLogout && (
            <div className="pl-3 border-l border-sand-200 flex items-center gap-2">
              {fullName && <span className="hidden lg:inline text-xs font-semibold text-sand-500">{fullName}</span>}
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="p-2 sm:px-3 sm:py-2 text-danger-500 hover:bg-danger-50 hover:text-danger-600 rounded-lg transition-colors flex items-center gap-1.5 font-semibold text-xs sm:text-sm"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
