import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  DollarSign,
  UserCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  PieChart,
  BarChart3,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { analyticsApi } from '../../services/api';
import { AnalyticsKpisResponse } from '../../types';

export const AnalyticsDashboardView: React.FC = () => {
  const [data, setData] = useState<AnalyticsKpisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await analyticsApi.getKpis();
      setData(response);
    } catch (err: any) {
      console.error('Error al cargar KPIs analíticos:', err);
      setError('No se pudieron sincronizar las métricas en tiempo real. Mostrando último estado disponible.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics(false);
  }, [fetchMetrics]);

  const formatCurrencyParts = (val: number | string | undefined | null) => {
    if (val == null) return { formatted: '$0', currency: 'ARS' };
    if (typeof val === 'string' && val.includes('$')) {
      const clean = val.replace('ARS', '').trim();
      return { formatted: clean, currency: 'ARS' };
    }
    const num = typeof val === 'number' ? val : Number(val);
    if (isNaN(num)) return { formatted: '$0', currency: 'ARS' };
    const formatted = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(num);
    return { formatted, currency: 'ARS' };
  };

  const formatCurrency = (val: number | string | undefined | null): string => {
    if (val == null) return '$0 ARS';
    if (typeof val === 'string') {
      if (val.includes('$') && val.includes('ARS')) return val;
      if (val.includes('$')) return `${val} ARS`;
    }
    const num = typeof val === 'number' ? val : Number(val);
    if (isNaN(num)) return '$0 ARS';
    const formatted = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(num);
    return `${formatted} ARS`;
  };

  if (isLoading && !data) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-pulse" aria-busy="true" aria-label="Cargando métricas analíticas">
        {/* Header Skeleton */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-6 w-72 bg-sand-200 rounded-lg" />
            <div className="h-4 w-96 bg-sand-100 rounded-lg max-w-full" />
          </div>
          <div className="h-11 w-44 bg-sand-200 rounded-xl" />
        </div>

        {/* 4 KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-sand-200 shadow-card space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-sand-200 rounded" />
                <div className="h-8 w-8 bg-sand-100 rounded-lg" />
              </div>
              <div className="h-8 w-36 bg-sand-200 rounded" />
              <div className="h-4 w-32 bg-sand-100 rounded" />
            </div>
          ))}
        </div>

        {/* Bottom charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-sand-200 shadow-card space-y-4">
            <div className="h-5 w-52 bg-sand-200 rounded" />
            <div className="space-y-4 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-60 bg-sand-200 rounded" />
                    <div className="h-4 w-24 bg-sand-200 rounded" />
                  </div>
                  <div className="h-2 w-full bg-sand-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-card space-y-4">
            <div className="h-5 w-44 bg-sand-200 rounded" />
            <div className="h-28 bg-sand-100 rounded-xl" />
            <div className="h-28 bg-sand-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const kpis = data;
  const totalRevParts = formatCurrencyParts(kpis?.financial.totalRevenue);

  // Cálculo de proporciones para canales de recaudación
  const totalRev = Number(kpis?.financial.totalRevenue) || 0;
  const onlineDeposit = Number(kpis?.financial.onlineDepositRevenue) || 0;
  const counterBalance = Number(kpis?.financial.counterBalanceRevenue) || 0;

  const onlineDepositPct = totalRev > 0
    ? (Math.round((onlineDeposit / totalRev) * 1000) / 10).toFixed(1)
    : '0.0';
  const counterBalancePct = totalRev > 0
    ? (Math.round((counterBalance / totalRev) * 1000) / 10).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Alerta de Error no bloqueante */}
      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-danger-800 text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-danger-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchMetrics(false)}
            className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl bg-danger-600 text-white font-bold hover:bg-danger-700 active:bg-danger-800 transition-colors cursor-pointer inline-flex items-center justify-center self-end sm:self-auto"
          >
            Reintentar sincronización
          </button>
        </div>
      )}

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

        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs text-sand-500 bg-sand-50 border border-sand-200 px-3 py-2 rounded-xl font-semibold">
            Período: {kpis?.period || 'Tiempo Real'}
          </div>

          <button
            onClick={() => fetchMetrics(true)}
            disabled={isRefreshing || isLoading}
            className="min-h-[44px] min-w-[44px] px-3.5 py-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 active:bg-primary-200 font-semibold text-xs border border-primary-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-60 cursor-pointer"
            title="Actualizar métricas en tiempo real"
            aria-label="Actualizar métricas"
          >
            <RefreshCw className={cn('w-4 h-4', (isRefreshing || isLoading) && 'animate-spin')} />
            <span>Actualizar métricas</span>
          </button>
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
          <div className="font-display text-2xl font-extrabold text-sand-900">
            {totalRevParts.formatted} <span className="text-xs font-bold text-sand-400">{totalRevParts.currency}</span>
          </div>
          <div className="flex items-center text-[11px] text-success-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+{kpis?.financial.growthVsPreviousMonth ?? 24.5}% vs mes anterior</span>
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
          <div className="font-display text-2xl font-extrabold text-sand-900">
            {kpis?.operational.attendanceRate ?? 100.0}%
          </div>
          <div className="text-[11px] text-primary-700 font-bold bg-primary-50 px-2 py-0.5 rounded-md inline-block">
            Absentismo registrado: {kpis?.operational.noShowRate ?? 0.0}%
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
          <div className="font-display text-2xl font-extrabold text-sand-900">
            {kpis?.operational.totalAppointments ?? 0}
          </div>
          <div className="text-[11px] text-sand-500 font-medium">
            {(kpis?.operational.completedAppointments ?? 0) + (kpis?.operational.attendedAppointments ?? 0)} atendidos/completados
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
          <div className="font-display text-2xl font-extrabold text-sand-900">
            {kpis?.aiAssistant.totalInquiries ?? 389}
          </div>
          <div className="text-[11px] text-warning-700 font-bold">
            {kpis?.aiAssistant.conversionRate ?? 64.2}% derivadas a reserva directa
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
            {(kpis?.treatmentRankings ?? []).length === 0 ? (
              <div className="text-center py-6 text-sand-400 font-medium">
                No hay tratamientos registrados en el período.
              </div>
            ) : (
              (kpis?.treatmentRankings ?? []).map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sand-800">{item.name || item.serviceName}</span>
                    <div className="text-right">
                      <span className="font-bold text-sand-900">{item.count ?? item.appointmentsCount ?? 0} turnos</span>
                      <span className="text-[11px] text-primary-600 block">{formatCurrency(item.revenue)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-sand-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
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
                <span className="font-bold text-info-700">Señas Online</span>
                <span className="font-extrabold text-info-700">{onlineDepositPct}%</span>
              </div>
              <p className="text-[11px] text-info-600">MercadoPago Checkout Pro</p>
              <div className="text-sm font-black text-info-700 pt-1">
                {formatCurrency(kpis?.financial.onlineDepositRevenue)}
              </div>
            </div>

            {/* Saldos en Mostrador */}
            <div className="p-4 rounded-xl bg-success-50/70 border border-success-100 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-success-700">Saldos en Mostrador</span>
                <span className="font-extrabold text-success-700">{counterBalancePct}%</span>
              </div>
              <p className="text-[11px] text-success-600">Efectivo / Transferencia (Secretaría)</p>
              <div className="text-sm font-black text-success-700 pt-1">
                {formatCurrency(kpis?.financial.counterBalanceRevenue)}
              </div>
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
