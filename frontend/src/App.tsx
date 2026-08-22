import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Views
import { LandingPageView } from './features/public/LandingPageView';
import { LoginView } from './features/auth/LoginView';
import { PasswordRecoveryView } from './features/auth/PasswordRecoveryView';

// Internal Views
import { DashboardLayout } from './components/DashboardLayout';
import { BookingWizard } from './features/appointments/BookingWizard';
import { AgendaView } from './features/agenda/AgendaView';
import { MedicalRecordView } from './features/clinical/MedicalRecordView';
import { AdminServicesView } from './features/admin/AdminServicesView';
import { AnalyticsDashboardView } from './features/analytics/AnalyticsDashboardView';

export function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPageView />} />
      <Route path="/book" element={
        <div className="min-h-screen bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
             <button onClick={() => window.history.back()} className="mb-4 text-slate-500 hover:text-slate-800 text-sm font-medium">
               &larr; Volver
             </button>
             <BookingWizard />
          </div>
        </div>
      } />
      <Route path="/login" element={<LoginView />} />
      <Route path="/recover-password" element={<PasswordRecoveryView />} />

      {/* Internal Dashboard Routes */}
      <Route path="/app" element={<DashboardLayout />}>
        {/* Default redirect to booking or agenda depending on role, for now just redirect to agenda */}
        <Route index element={<Navigate to="/app/agenda" replace />} />
        
        <Route path="booking" element={<BookingWizard />} />
        <Route path="agenda" element={<AgendaView />} />
        <Route path="clinical" element={<MedicalRecordView />} />
        <Route path="admin" element={<AdminServicesView />} />
        <Route path="analytics" element={<AnalyticsDashboardView />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
