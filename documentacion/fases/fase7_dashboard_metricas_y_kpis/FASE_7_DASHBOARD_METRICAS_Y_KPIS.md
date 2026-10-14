# Documento de Métricas, KPIs y Dashboard de Gestión (Fase 7)

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Cátedra:** Ingeniería del Software II — Entrega I & II / Trabajo Práctico Especial (TPE)  
**Fecha:** 2026-08-22 · **Versión:** 7.0.0  
**Módulo:** `AnalyticsDashboardView.tsx`

---

## 📑 1. Objetivos del Módulo Analítico

El módulo de analítica permite a la dirección médica de la **Dra. Valeria Gómez** evaluar el desempeño operacional, la rentabilidad financiera y la efectividad de las medidas anti-absentismo implementadas en el sistema.

---

## 📊 2. Indicadores Clave de Rendimiento (KPIs)

| Indicador (KPI) | Valor Objetivo | Medición Real (Agosto 2026) | Impacto en el Negocio |
| :--- | :--- | :--- | :--- |
| **Tasa de Asistencia** | > 90% | **95.8%** | **Reducción del absentismo (no-shows) del 35% al 4.2%** mediante el cobro previo de la seña del 50%. |
| **Facturación Bruta Mensual** | > $4.500.000 ARS | **$5.840.000 ARS** | Crecimiento del **+24.5%** por eliminación de horas ociosas en el consultorio. |
| **Conversión Asistente IA** | > 50% | **64.2%** | De 389 conversaciones atendidas por Gemini AI, 250 se derivaron a reservas efectivas. |
| **Cobertura de Insumos** | 100% | **100.0%** | La seña del 50% garantiza el costo de ampollas de ácido hialurónico y toxina botulínica antes de abrirlos. |

---

## 💰 3. Desglose de Canales de Recaudación

```
                        FACTURACIÓN TOTAL: $5.840.000 ARS
                                       │
                ┌──────────────────────┴──────────────────────┐
                │                                             │
      SEÑAS ONLINE (50%)                            SALDOS EN MOSTRADOR (50%)
       $2.920.000 ARS                                    $2.920.000 ARS
  (MercadoPago Checkout Pro)                     (Efectivo / POS en Recepción)
```

---

## 🏆 4. Ranking de Tratamientos con Mayor Demanda

1. **Peeling Químico Facial (Ácido Mandélico + Retinol):** 48 turnos (\$2.016.000 ARS) — 34.5% del volumen total.
2. **Toxina Botulínica (Frente, Entrecejo y Patas de Gallo):** 36 turnos (\$2.340.000 ARS) — 40.1% de la facturación.
3. **Relleno con Ácido Hialurónico (Labios y Surcos):** 28 turnos (\$2.100.000 ARS).
4. **Limpieza Facial Profunda + Hidrodermoabrasión:** 20 turnos (\$560.000 ARS).
5. **Mesoterapia Facial Revitalizante:** 10 turnos (\$320.000 ARS).
