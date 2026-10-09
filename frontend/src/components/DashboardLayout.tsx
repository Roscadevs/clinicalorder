import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, LogIn } from 'lucide-react';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { GeminiChatbotWidget } from './GeminiChatbotWidget';
import { PageTransition } from './PageTransition';
import { ErrorBoundary } from './ErrorBoundary';
import { Modal, Button } from './ui';
import { NAV_TABS, type TabType, type RoleType } from './navConfig';
import { ROLE_TO_USER_ID } from '../utils/session';
import { isDemoSession } from '../services/api';

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
    sessionStorage.clear();
    navigate('/login');
  };

  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);

  useEffect(() => {
    if (isDemoSession()) {
      const dismissed = sessionStorage.getItem('demo_session_modal_dismissed');
      if (!dismissed) {
        setShowDemoModal(true);
      }
    }
  }, []);

  const handleDismissDemoModal = () => {
    sessionStorage.setItem('demo_session_modal_dismissed', 'true');
    setShowDemoModal(false);
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
                localStorage.setItem('role', role);
                localStorage.setItem('userId', String(ROLE_TO_USER_ID[role] ?? 1));
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
          <ErrorBoundary moduleTitle="el panel de gestión clínica">
            {/* Fundido entre vistas internas al cambiar de pestaña */}
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </ErrorBoundary>
        </main>
      </div>

      <GeminiChatbotWidget />

      <BottomNav currentTab={currentTab} setCurrentTab={handleSetTab} userRole={activeRole} />

      {/* Modal alert al ingresar en Modo Demo */}
      <Modal
        isOpen={showDemoModal}
        onClose={handleDismissDemoModal}
        title={
          <span className="flex items-center gap-2 text-warning-700 font-bold">
            <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0" />
            Atención: Sesión en Modo Demostración
          </span>
        }
        footer={
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full">
            <Button variant="secondary" onClick={handleDismissDemoModal}>
              Continuar en Modo Demo
            </Button>
            <Button
              variant="primary"
              onClick={handleLogout}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Cambiar a cuenta oficial
            </Button>
          </div>
        }
      >
        <div className="space-y-3.5 text-sm text-sand-700">
          <p>
            Has ingresado al sistema con el <strong className="text-sand-900 font-semibold">Usuario Demo</strong> (simulación local).
          </p>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-2">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <span>¿Cuándo debes cambiar a una cuenta oficial?</span>
            </div>
            <ul className="list-disc pl-4 space-y-1.5 text-amber-900">
              <li>
                <strong>Para confirmar turnos reales en el servidor:</strong> Si necesitas que las reservas y cobros impacten directamente en la base de datos de producción (Supabase) y no queden como reservas temporales pendientes, debes ingresar con tus credenciales de staff.
              </li>
              <li>
                <strong>Si solo estás realizando pruebas:</strong> Puedes continuar; el simulador confirmará las reservas y pagos localmente con comprobantes válidos para testear la interfaz sin generar bloqueos pendientes.
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};
