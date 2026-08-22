# Documento de Arquitectura de Diseño Mobile-First, UI/UX Responsive y Accesibilidad Táctil (Fase 10)

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Cátedra:** Ingeniería del Software II — Entrega I & II / Trabajo Práctico Especial (TPE)  
**Fecha:** 2026-08-22 · **Versión:** 10.0.0 (Master)  
**Módulos:** `BottomNav.tsx`, `Navbar.tsx`, `AgendaView.tsx`, `BeforeAfterSlider.tsx`, `InformedConsentModal.tsx`, `AppointmentReceiptModal.tsx`, `ReminderNotificationModal.tsx`

---

## 📱 1. Propósito y Estrategia Mobile-First

La **Fase 10** optimiza integralmente la experiencia de usuario (UX) para dispositivos móviles (smartphones de 360px a 430px de ancho) y tablets, aplicando los estándares modernos de accesibilidad y ergonomía táctil (W3C/WCAG 2.1 AA):

1. **Barra de Navegación Inferior (*Bottom Tab Bar*):**
   - En pantallas pequeñas (`sm:hidden`), la navegación se traslada al borde inferior de la pantalla (`fixed bottom-0 inset-x-0`), ubicando las acciones críticas en la **zona natural de alcance del pulgar (*Thumb Zone*)**.
   - Zonas de pulsación con dimensiones mínimas de **48x48 px** según las pautas de diseño de iOS Human Interface Guidelines y Android Material You.

2. **Modales con Comportamiento *Bottom Sheet* Deslizable:**
   - En celulares, los modales (Comprobante Oficial con QR, Consentimiento Ley 26.529, Recordatorio WhatsApp y Cobro de Saldo) se transforman automáticamente en paneles que se deslizan desde la parte inferior (`rounded-t-3xl`, `max-h-[92dvh]`), incorporando un tirador táctil visual (*drag handle*) y botones de acción accesibles en la parte inferior.

3. **Adaptación Responsive del Calendario de Turnos:**
   - **En Móviles:** Implementa un **Carrusel Horizontal de Días (*Day Pills Carousel*)** con desplazamiento táctil fluido para seleccionar el día de la semana con un toque, desplegando debajo las tarjetas de turnos confirmados con botones táctiles de 44px de altura.
   - **En Escritorio:** Mantiene la **Grilla Semanal completa de 7 columnas** con franjas horarias de 09:00 a 19:00 hs.

4. **Soporte Táctil Nativo en el Visor *Antes / Después*:**
   - Implementación de controladores nativos de eventos táctiles (`onTouchStart`, `onTouchMove`, `touch-none`) con un tirador central ensanchado de 44px con retroalimentación visual táctil (`active:scale-110`).

---

## 📐 2. Matriz de Breakpoints y Comportamiento Responsive

| Componente | Pantalla Móvil (`< 640px` / Celular) | Pantalla Tablet / Desktop (`≥ 640px`) |
| :--- | :--- | :--- |
| **Navegación Principal** | `BottomNav` fijo en la parte inferior con 5 accesos táctiles. | `Navbar` superior con menú horizontal y enlaces de texto. |
| **Agenda y Calendario** | Carrusel táctil horizontal de días + tarjetas de pacientes con botones de cobro y comprobante. | Grilla semanal de 7 columnas x 9 franjas horarias (09 a 19h). |
| **Modales Clínicos** | *Bottom Sheet* con esquinas superiores redondeadas (`rounded-t-3xl`) pegado al borde inferior. | Modal centrado en pantalla con efecto `backdrop-blur-sm`. |
| **Visor Antes/Después** | Control táctil `touch-none` con tirador de 44px para dedos. | Control con ratón `cursor-ew-resize` y hover interactivo. |
| **Selector de Roles RBAC** | Selector compacto con texto abreviado en barra superior. | Barra informativa completa con detalles de base de datos e IA. |
| **Padding Global** | `pb-24` para garantizar que la barra inferior no tape botones ni formularios. | `pb-8` espaciado estándar. |

---

## 🧪 3. Verificación de Compilación y Calidad Estática

El código fue validado mediante análisis estático estricto:
```bash
> tsc && vite build
✓ 1539 modules transformed.
✓ built in 1.32s
```
- 0 errores de tipado TypeScript (`TS2322`, `TS6133`).
- 100% de compatibilidad con motores WebKit (Safari iOS), Blink (Chrome Android) y Gecko (Firefox).
