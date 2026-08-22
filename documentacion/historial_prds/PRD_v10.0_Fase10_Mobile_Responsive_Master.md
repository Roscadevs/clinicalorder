# PRD v10.0 (Master Final Consolidado): Sistema Integral Dermatológico, Estética y Asistente IA — Especificación de Arquitectura Mobile-First & Responsive UX

**Autor:** Equipo de Arquitectura & Desarrollo  
**Fecha:** 2026-08-22 · **Versión:** 10.0 (Master Final / Vigente)  
**Estado:** VIGENTE & CONSOLIDADO · **Metodología:** *How I Spec* (Rivera)  
**Cátedra:** Ingeniería del Software II — Entrega I & II / Trabajo Práctico Especial (TPE)

---

## 0. Encabezado & Novedades de la Versión 10.0 (Master Final)
Esta versión culmina la optimización de la experiencia de usuario incorporando **Diseño Mobile-First, Ergonomía Táctil y Arquitectura Responsive Multidispositivo**:
1. **Navegación Móvil Nativa (`BottomNav.tsx`):**
   - Barra de navegación fija inferior (*Bottom Tab Bar*) para celulares con zonas táctiles de **48x48 px** ubicadas en la zona natural del pulgar.
2. **Modales Deslizables Estilo *Bottom Sheet*:**
   - Transformación de los modales de Comprobante QR, Consentimiento Ley 26.529, Recordatorio y Cobro de Saldo en paneles inferiores con tiradores táctiles.
3. **Calendario y Agenda Adaptativos:**
   - Carrusel de días horizontal táctil (*Day Pills Carousel*) + lista de tarjetas de citas para celulares, y grilla semanal completa de 7 columnas para escritorio.
4. **Visor Comparativo Táctil Multitouch (`BeforeAfterSlider.tsx`):**
   - Controlador nativo de gestos táctiles (`onTouchStart`, `onTouchMove`, `touch-none`) con tirador de 44px.
5. **Consolidación de Fases Anteriores:**
   - Backend Java 17 / Spring Boot 3.2, PostgreSQL 15, MercadoPago Checkout Pro (50% seña), Google Gemini AI, Google/Apple Calendar (.ics), Docker Compose y GitHub Actions CI/CD.

---

## 1. El Resumen: Hoy vs Después

| Dimensión | Hoy (Proceso Manual / Fragmentado) | Después (Con el Sistema Integrado) |
| :--- | :--- | :--- |
| **Experiencia en Celulares** | Páginas rígidas no adaptadas que requieren zoom manual. | Interfaz *Mobile-First* con barra inferior táctil y *Bottom Sheets*. |
| **Reserva de Citas** | WhatsApp informal sin horario exacto ni cobro de seña. | Wizard público con cálculo de disponibilidad real y retención de 10 min. |
| **Garantía Financiera** | No-shows de más del 30% con pérdida económica de insumos. | Seña del 50% requerida vía MercadoPago Checkout Pro. |
| **Calendario del Paciente** | El paciente debe anotar la fecha manualmente arriesgando olvidos. | Agendado en 1 clic en Google Calendar o Apple Calendar con alarmas -24h y -2h. |
| **Recordatorios** | La secretaria debe enviar mensajes uno por uno manualmente. | Simulador y generador automático de avisos WhatsApp / Push con confirmación. |
| **Métricas de Gestión** | Sin estadísticas de tratamientos ni control de absentismo. | Dashboard de KPIs en tiempo real con tasa de asistencia del 95.8%. |
| **Comprobantes de Pago** | Mensajes de chat desordenados sin validez formal. | Comprobante oficial imprimible en PDF con código QR y desglose de saldo. |
| **Consentimiento Legal** | Hojas sueltas de papel que se extravían en carpetas físicas. | Consentimiento estructurado digital conforme a la Ley 26.529 exportable en PDF. |
| **Historia Clínica** | Fichas en papel sin registro de modificaciones ni fotos seguras. | Ficha estructurada 1:1 en Supabase con auditoría inmutable e imágenes seguras. |
| **Comparativa de Resultados** | Fotos en el celular de la médica sin fecha ni control. | Visor interactivo "Antes y Después" con slider táctil deslizante con el dedo. |
| **Atención al Paciente** | Mensajes de WhatsApp sin responder fuera de horario. | Chatbot 24/7 con Google Gemini para resolver dudas y tarifas. |
| **Aseguramiento de Calidad** | Pruebas manuales propensas a errores y regresiones. | Pipelines de CI/CD automáticos con GitHub Actions en cada commit. |

---

## 2. Historias de Usuario Principales

1. **Paciente Móvil (Lucía):** Desde su smartphone, consulta dudas con el Chatbot Gemini, reserva su turno de Peeling en el Wizard, paga la seña del 50% en MercadoPago, agenda en su Google Calendar y visualiza su comprobante en un cómodo *Bottom Sheet*.
2. **Secretaria (Sofía):** Gestiona la recepción de pacientes desde la tablet o monitor, navega entre días mediante el carrusel táctil, envía recordatorios por WhatsApp con 1 clic y liquida saldos en mostrador.
3. **Médica (Dra. Valeria):** Revisa el calendario de citas, abre la historia clínica 1:1, utiliza el visor táctil *Antes/Después* deslizando con el dedo sobre la pantalla táctil y emite consentimientos informados.
4. **Administrador General:** Supervisa el Dashboard de KPIs en cualquier pantalla y administra los pipelines de CI/CD en GitHub.
