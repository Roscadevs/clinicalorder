import React from 'react'; // React hooks
import {
  TrendingUp,
  DollarSign,
  UserCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  PieChart,
  BarChart3
} from 'lucide-react'; // Iconos

export const AnalyticsDashboardView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Encabezado del Dashboard */}
      <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-primary-50 text-primary-700 font-bold">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="font-display text-xl font-bold text-sand-900 tracking-tight">
              Dashboard Analítico & Métricas de Gestión (KPIs)
            </h2>
          </div>
          <p className="text-xs text-sand-500 mt-1">
            Indicadores clínicos, financieros y de impacto operativo · Clínica Dra. Valeria
          </p>
        </div>

        <div className="text-xs text-sand-500 bg-sand-50 border border-sand-200 px-3 py-1.5 rounded-xl font-semibold">
          Período: Agosto 2026 (Tiempo Real)
        </div>
      </div>

      {/* Tarjetas Principales de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Facturación Total */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-card space-y-2">
          <div className="flex justify-between items-center text-sand-400 text-xs font-semibold">
            <span>Facturación Total</span>
            <div className="p-2 rounded-lg bg-success-50 text-success-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-extrabold text-sand-900">$5.840.000 <span className="text-xs font-bold text-sand-400">ARS</span></div>
          <div className="flex items-center text-[11px] text-success-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+24.5% vs mes anterior</span>
          </div>
        </div>

        {/* KPI 2: Tasa de Asistencia */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-card space-y-2">
          <div className="flex justify-between items-center text-sand-400 text-xs font-semibold">
            <span>Tasa de Asistencia</span>
            <div className="p-2 rounded-lg bg-primary-50 text-primary-700">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-extrabold text-sand-900">95.8%</div>
          <div className="text-[11px] text-primary-700 font-bold bg-primary-50 px-2 py-0.5 rounded-md inline-block">
            Absentismo reducido del 35% al 4.2%
          </div>
        </div>

        {/* KPI 3: Turnos Totales */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-card space-y-2">
          <div className="flex justify-between items-center text-sand-400 text-xs font-semibold">
            <span>Turnos Gestionados</span>
            <div className="p-2 rounded-lg bg-info-50 text-info-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-extrabold text-sand-900">142</div>
          <div className="text-[11px] text-sand-500 font-medium">
            136 completados con seña previa
          </div>
        </div>

        {/* KPI 4: Interacciones Asistente IA */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-card space-y-2">
          <div className="flex justify-between items-center text-sand-400 text-xs font-semibold">
            <span>Consultas Chatbot IA</span>
            <div className="p-2 rounded-lg bg-warning-50 text-warning-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-extrabold text-sand-900">389</div>
          <div className="text-[11px] text-warning-700 font-bold">
            64.2% derivadas a reserva directa
          </div>
        </div>
      </div>

      {/* Gráficos y Distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1 y 2: Tratamientos Más Solicitados */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-sand-200 shadow-card space-y-4">
          <div className="flex justify-between items-center border-b border-sand-100 pb-3">
            <h3 className="font-bold text-sand-900 text-sm flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span>Tratamientos Estéticos con Mayor Demanda</span>
            </h3>
            <span className="text-xs text-sand-400">Por volumen de turnos</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {[
              { name: 'Peeling Químico Facial (Ácido Mandélico + Retinol)', count: 48, percentage: 85, revenue: '$2.016.000 ARS' },
              { name: 'Toxina Botulínica (Frente, Entrecejo y Patas de Gallo)', count: 36, percentage: 65, revenue: '$2.340.000 ARS' },
              { name: 'Relleno con Ácido Hialurónico (Labios y Surcos)', count: 28, percentage: 50, revenue: '$2.100.000 ARS' },
              { name: 'Limpieza Facial Profunda + Hidrodermoabrasión', count: 20, percentage: 35, revenue: '$560.000 ARS' },
              { name: 'Mesoterapia Facial con Vitaminas & Antioxidantes', count: 10, percentage: 20, revenue: '$320.000 ARS' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sand-800">{item.name}</span>
                  <div className="text-right">
                    <span className="font-bold text-sand-900">{item.count} turnos</span>
                    <span className="text-[11px] text-primary-600 block">{item.revenue}</span>
                  </div>
                </div>
                <div className="w-full bg-sand-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna 3: Distribución de Ingresos y Señas */}
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-card space-y-4">
          <div className="flex justify-between items-center border-b border-sand-100 pb-3">
            <h3 className="font-bold text-sand-900 text-sm flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-primary-600" />
              <span>Canales de Recaudación</span>
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Señas Online */}
            <div className="p-4 rounded-xl bg-info-50/70 border border-info-100 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-info-700">Señas Online (50%)</span>
                <span className="font-extrabold text-info-700">50.0%</span>
              </div>
              <p className="text-[11px] text-info-600">MercadoPago Checkout Pro</p>
              <div className="text-sm font-black text-info-700 pt-1">$2.920.000 ARS</div>
            </div>

            {/* Saldos en Mostrador */}
            <div className="p-4 rounded-xl bg-success-50/70 border border-success-100 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-success-700">Saldos en Mostrador (50%)</span>
                <span className="font-extrabold text-success-700">50.0%</span>
              </div>
              <p className="text-[11px] text-success-600">Efectivo / Tarjeta POS (Secretaria)</p>
              <div className="text-sm font-black text-success-700 pt-1">$2.920.000 ARS</div>
            </div>

            {/* Retención y Eficiencia */}
            <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 text-[11px] text-sand-600 space-y-1">
              <div className="font-bold text-sand-800 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-primary-600" /> Cero Riesgo Financiero
              </div>
              <p>
                El 100% de los insumos médicos quedaron cubiertos por adelantado antes de abrir la ampolla o vial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
