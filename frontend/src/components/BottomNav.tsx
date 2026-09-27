import React from 'react';
import { Calendar, UserCheck, ShieldCheck, Settings, BarChart3 } from 'lucide-react';
import { cn } from '../utils/cn';
import { NAV_TABS, type TabType, type RoleType } from './navConfig';

const ICONS = { Calendar, UserCheck, ShieldCheck, Settings, BarChart3 } as const;

interface BottomNavProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  userRole?: RoleType;
}

/**
 * Barra de navegación inferior táctil para móviles (oculta en escritorio).
 * Zonas de toque de al menos 48px, filtrada por rol.
 */
export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab, userRole }) => {
  const visibleTabs = NAV_TABS.filter((tab) => !userRole || tab.roles.includes(userRole));

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-sand-200 z-40 px-2 py-1 shadow-lift flex justify-around items-center">
      {visibleTabs.map((tab) => {
        const Icon = ICONS[tab.icon];
        const active = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] rounded-xl transition-colors',
              active ? 'text-primary-600 font-bold' : 'text-sand-500 hover:text-sand-900'
            )}
          >
            <span className={cn('p-1 rounded-xl', active && 'bg-primary-50 text-primary-600')}>
              <Icon className="w-5 h-5" />
            </span>
            <span className="text-[10px] mt-0.5">{tab.shortLabel}</span>
          </button>
        );
      })}
    </nav>
  );
};
