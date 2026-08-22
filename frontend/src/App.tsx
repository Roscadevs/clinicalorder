import React, { useState } from 'react'; // React hooks
import { Navbar } from './components/Navbar'; // Barra de navegación
import { BookingWizard } from './features/appointments/BookingWizard'; // Flujo de reserva con seña
import { AgendaView } from './features/agenda/AgendaView'; // Agenda operativa y cobros
import { MedicalRecordView } from './features/clinical/MedicalRecordView'; // Historia clínica exclusiva médica
import { AdminServicesView } from './features/admin/AdminServicesView'; // Panel de administración de tarifas
import { GeminiChatbotWidget } from './components/GeminiChatbotWidget'; // Chatbot con IA Gemini
import { UserRole } from './types'; // Roles

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'booking' | 'agenda' | 'clinical' | 'admin'>('booking');
  const [userRole, setUserRole] = useState<UserRole>('PHYSICIAN'); // Simulación de sesión activa

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Selector de Rol para Demostración RBAC */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-teal-400">Perfil Activo de Demostración:</span>
          <select
            value={userRole}
            onChange={(e) => {
              const newRole = e.target.value as UserRole;
              setUserRole(newRole);
              if (newRole === 'RECEPTIONIST' && (currentTab === 'clinical' || currentTab === 'admin')) {
                setCurrentTab('agenda');
              }
            }}
            className="bg-slate-800 text-white font-semibold rounded px-2 py-1 outline-none border border-slate-700 text-xs"
          >
            <option value="PHYSICIAN">Dra. Valeria Gómez (Médica - Acceso Clínico + Visor + Auditoría)</option>
            <option value="RECEPTIONIST">Sofía Martínez (Secretaria - Agenda Operativa + Cobros)</option>
            <option value="ADMIN">Administrador General (Control Total + Tarifas y Servicios)</option>
          </select>
        </div>
        <div className="text-[11px] text-slate-400 hidden sm:block">
          Supabase PostgreSQL · MercadoPago SDK · Gemini 1.5 Flash
        </div>
      </div>

      {/* Barra de Navegación */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
      />

      {/* Contenido Principal */}
      <main className="flex-1 py-6">
        {currentTab === 'booking' && <BookingWizard />}
        {currentTab === 'agenda' && <AgendaView />}
        {currentTab === 'clinical' && (userRole === 'PHYSICIAN' || userRole === 'ADMIN') && <MedicalRecordView />}
        {currentTab === 'admin' && userRole === 'ADMIN' && <AdminServicesView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>© 2026 Clínica Dermatológica y Estética Dra. Valeria · Todos los derechos reservados.</p>
      </footer>

      {/* Widget Flotante de Asistente Virtual con Google Gemini */}
      <GeminiChatbotWidget />
    </div>
  );
};

export default App;
