import React, { useState } from 'react'; // React
import { Navbar } from './components/Navbar'; // Navbar
import { BookingWizard } from './features/appointments/BookingWizard'; // Wizard de turnos
import { AgendaView } from './features/agenda/AgendaView'; // Agenda
import { MedicalRecordView } from './features/clinical/MedicalRecordView'; // Historia clínica
import { AdminServicesView } from './features/admin/AdminServicesView'; // Admin tarifas
import { AnalyticsDashboardView } from './features/analytics/AnalyticsDashboardView'; // Métricas y KPIs
import { GeminiChatbotWidget } from './components/GeminiChatbotWidget'; // Chatbot con Gemini AI

export function App() {
  const [currentTab, setCurrentTab] = useState<'booking' | 'agenda' | 'clinical' | 'admin' | 'analytics'>('booking');
  // Rol simulado para testeo visual e interacción de roles (RBAC)
  const [activeRole, setActiveRole] = useState<'PUBLIC' | 'RECEPTIONIST' | 'PHYSICIAN' | 'ADMIN'>('PHYSICIAN');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      <div>
        {/* Banner de Simulación de Roles (Para Defensa Académica y Testeo) */}
        <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-teal-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px]">RBAC ACTIVO</span>
            <span className="text-slate-300">Simulador de Rol Académico:</span>
            <select
              value={activeRole}
              onChange={(e) => {
                const role = e.target.value as any;
                setActiveRole(role);
                if (role === 'PUBLIC') setCurrentTab('booking');
                if (role === 'RECEPTIONIST') setCurrentTab('agenda');
                if (role === 'PHYSICIAN') setCurrentTab('clinical');
                if (role === 'ADMIN') setCurrentTab('admin');
              }}
              className="bg-slate-800 text-teal-300 font-bold px-2 py-0.5 rounded outline-none border border-slate-700 text-xs"
            >
              <option value="PUBLIC">Paciente / Público General</option>
              <option value="RECEPTIONIST">Secretaria (Sofía)</option>
              <option value="PHYSICIAN">Médica (Dra. Valeria)</option>
              <option value="ADMIN">Administrador General</option>
            </select>
          </div>
          <span className="text-slate-400 hidden sm:inline">
            PostgreSQL 15 (Supabase) + Spring Boot 3.2 + Gemini AI
          </span>
        </div>

        {/* Barra de Navegación Principal */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          userRole={activeRole}
        />

        {/* Contenido Principal según Pestaña */}
        <main className="py-6">
          {currentTab === 'booking' && <BookingWizard />}
          {currentTab === 'agenda' && <AgendaView />}
          {currentTab === 'clinical' && <MedicalRecordView />}
          {currentTab === 'admin' && <AdminServicesView />}
          {currentTab === 'analytics' && <AnalyticsDashboardView />}
        </main>
      </div>

      {/* Widget Flotante del Asistente Virtual Gemini AI */}
      <GeminiChatbotWidget />

      {/* Pie de Página */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">Clínica Médica Dermatológica & Estética Dra. Valeria Gómez</p>
        <p className="text-[11px] mt-0.5">Trabajo Práctico Especial · Asignatura: Ingeniería del Software II · 2026</p>
      </footer>
    </div>
  );
}

export default App;
