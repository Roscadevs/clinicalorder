import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { GeminiChatbotWidget } from './GeminiChatbotWidget';
import { PageTransition } from './PageTransition';
import { NAV_TABS, type TabType, type RoleType } from './navConfig';

const pathToTab = (path: string): TabType => {
  const match = NAV_TABS.find((t) => path.includes(t.path));
  return match?.id ?? 'agenda';
};

const tabToPath = (tab: TabType): string =>
  NAV_TABS.find((t) => t.id === tab)?.path ?? '/app/agenda';

/** Rol por defecto para cada rol al iniciar / cambiar en el simulador. */
const roleLanding: Record<RoleType, TabType> = {
  PUBLIC: 'booking',
  SECRETARIA: 'agenda',
  DOCTORA: 'clinical',
  ADMIN: 'admin',
};

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState<TabType>(pathToTab(location.pathname));
  const initialRole = (localStorage.getItem('role') as RoleType) || 'SECRETARIA';
  const [activeRole, setActiveRole] = useState<RoleType>(initialRole);
  const fullName = localStorage.getItem('fullName') || undefined;

  useEffect(() => {
    setCurrentTab(pathToTab(location.pathname));
  }, [location.pathname]);

  const handleSetTab = (tab: TabType) => {
    setCurrentTab(tab);
    navigate(tabToPath(tab));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-sand-50 text-sand-900 flex flex-col justify-between selection:bg-primary-500 selection:text-white">
      <div>
        {/* Barra de simulación de rol (modo demo). Se quita al integrar auth real. */}
        <div className="bg-sand-900 text-white text-[11px] py-1.5 px-3 sm:px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="bg-primary-400 text-sand-900 font-bold px-1.5 py-0.5 rounded text-[9px] sm:text-[10px]">
              RBAC (Modo Demo)
            </span>
            <span className="text-sand-300 text-[10px] sm:text-xs">Simular rol:</span>
            <select
              value={activeRole}
              onChange={(e) => {
                const role = e.target.value as RoleType;
                setActiveRole(role);
                handleSetTab(roleLanding[role]);
              }}
              className="bg-sand-800 text-primary-200 font-bold px-2 py-0.5 rounded outline-none border border-sand-700 text-[11px] sm:text-xs cursor-pointer"
            >
              <option value="SECRETARIA">Secretaria</option>
              <option value="DOCTORA">Doctora (Dra. Paula)</option>
              <option value="ADMIN">Administrador General</option>
            </select>
          </div>
        </div>

        <Navbar
          currentTab={currentTab}
          setCurrentTab={handleSetTab}
          userRole={activeRole}
          fullName={fullName}
          onLogout={handleLogout}
        />

        <main className="py-4 sm:py-6 pb-24 sm:pb-8">
          {/* Fundido entre vistas internas al cambiar de pestaña */}
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      <GeminiChatbotWidget />

      <BottomNav currentTab={currentTab} setCurrentTab={handleSetTab} userRole={activeRole} />
    </div>
  );
};
