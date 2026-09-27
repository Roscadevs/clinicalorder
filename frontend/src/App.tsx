import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

// Public Views
import { LandingPageView } from './features/public/LandingPageView';
import { LoginView } from './features/auth/LoginView';
import { PasswordRecoveryView } from './features/auth/PasswordRecoveryView';
import { ServicesCatalogView } from './features/public/ServicesCatalogView';

// Internal Views
import { DashboardLayout } from './components/DashboardLayout';
import { BookingWizard } from './features/appointments/BookingWizard';
import { AgendaView } from './features/agenda/AgendaView';
import { MedicalRecordView } from './features/clinical/MedicalRecordView';
import { AdminServicesView } from './features/admin/AdminServicesView';
import { AnalyticsDashboardView } from './features/analytics/AnalyticsDashboardView';

import { PageTransition } from './components/PageTransition';

export function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PageTransition>
              <LandingPageView />
            </PageTransition>
          }
        />
        {/* Catálogo público. La reserva de turnos es sólo para el staff (/app/booking);
            los pacientes solicitan turno por WhatsApp. */}
        <Route
          path="/servicios"
          element={
            <PageTransition>
              <ServicesCatalogView />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginView />
            </PageTransition>
          }
        />
        <Route
          path="/recover-password"
          element={
            <PageTransition>
              <PasswordRecoveryView />
            </PageTransition>
          }
        />

        {/* Internal Dashboard Routes */}
        <Route path="/app" element={<DashboardLayout />}>
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
    </AnimatePresence>
  );
}

export default App;
