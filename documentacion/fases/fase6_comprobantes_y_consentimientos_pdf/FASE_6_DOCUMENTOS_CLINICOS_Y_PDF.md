# Documento de Especificación de Comprobantes Médicos y Consentimientos Informados en PDF (Fase 6)

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Cátedra:** Ingeniería del Software II — Entrega I & II / Trabajo Práctico Especial (TPE)  
**Fecha:** 2026-08-22 · **Versión:** 6.0.0  
**Módulos:** `AppointmentReceiptModal.tsx` y `InformedConsentModal.tsx`

---

## 📑 1. Fundamentos Legales y Requerimientos Clínicos

El diseño e implementación de los documentos imprimibles y descargables en formato PDF responde a la normativa médico-legal vigente en la República Argentina:

1. **Ley Nacional N° 26.529 (Derechos del Paciente, Historia Clínica y Consentimiento Informado):**
   - Exige la constancia documental fehaciente de que el paciente recibió información clara, precisa y adecuada sobre el procedimiento, beneficios esperados, riesgos predecibles y alternativas terapéuticas antes de cualquier intervención cutánea o inyectable.
2. **Ley Nacional N° 25.326 (Protección de Datos Personales):**
   - Resguardo de la confidencialidad de los datos de salud e identificación unívoca por DNI y matrícula médica profesional (M.P.).
3. **Transparencia Financiera (Seña vs Saldo):**
   - Emisión de un comprobante formal con código QR de verificación que discrimina con precisión el 50% de seña cancelado online mediante MercadoPago Checkout Pro y el saldo restante del 50% a abonar en mostrador el día del turno.

---

## 🏛️ 2. Componentes Implementados

### 2.1. Comprobante Oficial de Reserva de Turno (`AppointmentReceiptModal.tsx`)
- **Ubicación:** `frontend/src/features/documents/AppointmentReceiptModal.tsx`
- **Características:**
  - **Encabezado Institucional:** Membrete oficial de la Dra. Valeria Gómez con matrícula profesional (M.P. 48.912, M.N. 124.580) y dirección del consultorio.
  - **Identificación del Paciente:** Nombre, DNI, teléfono y correo electrónico.
  - **Detalle de la Cita:** Fecha, hora exacta de inicio, duración estimada y nombre del tratamiento.
  - **Tabla de Liquidación:**
    - Precio Total Acordado (ARS).
    - Seña Online del 50% (Acreditada por MercadoPago).
    - Saldo Pendiente (a liquidar en recepción).
  - **Indicaciones Médicas Previas:** Pautas de cuidado dermatológico (evitar exfoliantes químicos y sol 48 hs antes).
  - **Código QR de Verificación:** Identificador único para validación rápida desde el teléfono en mostrador.
  - **Soporte de Impresión Nativa:** Estilos CSS optimizados con `@media print` para exportar a PDF con calidad vectorial sin elementos de interfaz.

### 2.2. Consentimiento Informado Médico-Legal (`InformedConsentModal.tsx`)
- **Ubicación:** `frontend/src/features/documents/InformedConsentModal.tsx`
- **Características:**
  - **Declaración Jurada de Antecedentes:** El paciente certifica haber informado alergias a anestésicos locales, coagulación, embarazo o patologías previas.
  - **Descripción de Riesgos Normales:** Eritema transitorio, edema, hematomas puntiformes o descamación.
  - **Compromiso de Cuidados Posteriores:** Obligatoriedad de fotoprotección FPS 50+ cada 3 horas.
  - **Campos de Firma:** Firma del paciente con DNI y firma y sello de la médica dermatóloga.

---

## 🖨️ 3. Integración en el Flujo de Usuario

```
    [PACIENTE EN WIZARD (PASO 4)] ────► Hace clic en "Ver Comprobante" ────► Abre AppointmentReceiptModal
                                                                                      │
                                                                                      ▼
                                                                             window.print() / PDF
                                                                                      ▲
                                                                                      │
    [SECRETARIA EN AGENDA] ───────────► Hace clic en ícono de Impresora ───────────────┘

    [MÉDICA EN HISTORIA CLÍNICA] ─────► Hace clic en "Consentimiento Informado" ─► Abre InformedConsentModal
                                                                                      │
                                                                                      ▼
                                                                             window.print() / PDF
```
