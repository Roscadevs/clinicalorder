import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { GeminiChatbotWidget } from './GeminiChatbotWidget';

type TabType = 'booking' | 'agenda' | 'clinical' | 'admin' | 'analytics';
type RoleType = 'PUBLIC' | 'RECEPTIONIST' | 'PHYSICIAN' | 'ADMIN';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getTabFromPath = (path: string): TabType => {
    if (path.includes('/app/agenda')) return 'agenda';
    if (path.includes('/app/clinical')) return 'clinical';
    if (path.includes('/app/admin')) return 'admin';
    if (path.includes('/app/analytics')) return 'analytics';
    return 'booking';
  };

  const [currentTab, setCurrentTab] = useState<TabType>(getTabFromPath(location.pathname));
  const [activeRole, setActiveRole] = useState<RoleType>('PHYSICIAN');

  useEffect(() => {
    setCurrentTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleSetTab = (tab: TabType) => {
    setCurrentTab(tab);
    if (tab === 'booking') navigate('/app/booking');
    if (tab === 'agenda') navigate('/app/agenda');
    if (tab === 'clinical') navigate('/app/clinical');
    if (tab === 'admin') navigate('/app/admin');
    if (tab === 'analytics') navigate('/app/analytics');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      <div>
        <div className="bg-slate-900 text-white text-[11px] py-1.5 px-3 sm:px-4 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="bg-teal-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[9px] sm:text-[10px]">
              RBAC
            </span>
            <span className="text-slate-300 text-[10px] sm:text-xs">Rol:</span>
            <select
              value={activeRole}
              onChange={(e) => {
                const role = e.target.value as RoleType;
                setActiveRole(role);
                if (role === 'PUBLIC') handleSetTab('booking');
                if (role === 'RECEPTIONIST') handleSetTab('agenda');
                if (role === 'PHYSICIAN') handleSetTab('clinical');
                if (role === 'ADMIN') handleSetTab('admin');
              }}
              className="bg-slate-800 text-teal-300 font-bold px-2 py-0.5 rounded outline-none border border-slate-700 text-[11px] sm:text-xs cursor-pointer"
            >
              <option value="PUBLIC">Paciente / Público</option>
              <option value="RECEPTIONIST">Secretaria (Sofía)</option>
              <option value="PHYSICIAN">Médica (Dra. Valeria)</option>
              <option value="ADMIN">Administrador General</option>
            </select>
          </div>
          <span className="text-slate-400 hidden md:inline text-[11px]">
            PostgreSQL 15 (Supabase) + Spring Boot 3.2 + Gemini AI
          </span>
        </div>

        <Navbar
          currentTab={currentTab}
          setCurrentTab={handleSetTab}
          userRole={activeRole}
        />

        <main className="py-4 sm:py-6 pb-24 sm:pb-8">
          <Outlet />
        </main>
      </div>

      <GeminiChatbotWidget />

      <BottomNav
        currentTab={currentTab}
        setCurrentTab={handleSetTab}
        userRole={activeRole}
      />
    </div>
  );
};
