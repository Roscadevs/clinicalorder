import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

// Public Views (Carga inmediata para First Contentful Paint veloz)
import { LandingPageView } from './features/public/LandingPageView';
import { LoginView } from './features/auth/LoginView';
import { PasswordRecoveryView } from './features/auth/PasswordRecoveryView';
import { AuthCallbackView } from './features/auth/AuthCallbackView';
import { UpdatePasswordView } from './features/auth/UpdatePasswordView';
import { ServicesCatalogView } from './features/public/ServicesCatalogView';
import { BookingSuccessView, BookingFailureView, BookingPendingView } from './features/appointments/BookingStatusViews';

// Internal Views Layout & Security Guard
import { DashboardLayout } from './components/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PageTransition } from './components/PageTransition';
import { Toaster } from './components/ui';

// Lazy Loading / Code Splitting: Aislamiento estricto de módulos confidenciales (Historias Clínicas, Admin, Agenda)
const BookingWizard = React.lazy(() => import('./features/appointments/BookingWizard').then(m => ({ default: m.BookingWizard })));
const AgendaView = React.lazy(() => import('./features/agenda/AgendaView').then(m => ({ default: m.AgendaView })));
const EditAppointmentView = React.lazy(() => import('./features/agenda/EditAppointmentView').then(m => ({ default: m.EditAppointmentView })));
const MedicalRecordView = React.lazy(() => import('./features/clinical/MedicalRecordView').then(m => ({ default: m.MedicalRecordView })));
const AdminServicesView = React.lazy(() => import('./features/admin/AdminServicesView').then(m => ({ default: m.AdminServicesView })));
const AnalyticsDashboardView = React.lazy(() => import('./features/analytics/AnalyticsDashboardView').then(m => ({ default: m.AnalyticsDashboardView })));

const FallbackLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-sand-50">
    <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

export function App() {
  const location = useLocation();

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        <Suspense fallback={<FallbackLoader />}>
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
            {/* Catálogo público de tratamientos */}
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
            <Route
              path="/forgot-password"
              element={
                <PageTransition>
                  <PasswordRecoveryView />
                </PageTransition>
              }
            />
            <Route
              path="/auth/callback"
              element={
                <PageTransition>
                  <AuthCallbackView />
                </PageTransition>
              }
            />
            <Route
              path="/update-password"
              element={
                <PageTransition>
                  <UpdatePasswordView />
                </PageTransition>
              }
            />

            {/* Rutas de retorno de Mercado Pago (públicas tras checkout) */}
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

            {/* Internal Dashboard Routes protegidas perimetralmente por rol y autenticación */}
            <Route
              path="/app"
              element={
                <ProtectedRoute allowedRoles={['SECRETARIA', 'DOCTORA', 'ADMIN']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/agenda" replace />} />
              <Route path="booking" element={<BookingWizard />} />
              <Route path="agenda" element={<AgendaView />} />
              <Route path="agenda/:id/editar" element={<EditAppointmentView />} />
              <Route
                path="clinical"
                element={
                  <ProtectedRoute allowedRoles={['DOCTORA']}>
                    <MedicalRecordView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminServicesView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="analytics"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'DOCTORA']}>
                    <AnalyticsDashboardView />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
}

export default App;
