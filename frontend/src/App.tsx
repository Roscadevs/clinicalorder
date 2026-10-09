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
import { BookingSuccessView, BookingFailureView, BookingPendingView } from './features/appointments/BookingStatusViews';
import { AgendaView } from './features/agenda/AgendaView';
import { MedicalRecordView } from './features/clinical/MedicalRecordView';
import { AdminServicesView } from './features/admin/AdminServicesView';
import { AnalyticsDashboardView } from './features/analytics/AnalyticsDashboardView';

// Auth / Role guards
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleGuard } from './components/RoleGuard';

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

        {/* Rutas de retorno de Mercado Pago (configuradas en back-urls del backend).
            Deben ser públicas: el paciente vuelve acá desde el checkout. */}
        <Route
          path="/turnos/confirmado"
          element={
            <PageTransition>
              <BookingSuccessView />
            </PageTransition>
          }
        />
        <Route
          path="/turnos/fallido"
          element={
            <PageTransition>
              <BookingFailureView />
            </PageTransition>
          }
        />
        <Route
          path="/turnos/pendiente"
          element={
            <PageTransition>
              <BookingPendingView />
            </PageTransition>
          }
        />

        {/* Internal Dashboard Routes — require valid auth token */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/app/agenda" replace />} />
            <Route path="booking" element={<BookingWizard />} />
            <Route path="agenda" element={<AgendaView />} />
            <Route path="analytics" element={<AnalyticsDashboardView />} />

            {/* Clinical module — DOCTORA only */}
            <Route element={<RoleGuard allowedRoles={['DOCTORA']} />}>
              <Route path="clinical" element={<MedicalRecordView />} />
            </Route>

            {/* Admin panel — ADMIN only */}
            <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
              <Route path="admin" element={<AdminServicesView />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
