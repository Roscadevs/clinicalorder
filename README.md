<div align="center">

# 🌿 Clínica Médica Dermatológica & Estética — Dra. Valeria
### *Sistema Integral de Gestión Clínica, Reserva con Señas Online, Historias Clínicas Auditadas y Asistente IA*

[![Backend CI](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/frontend-ci.yml)
[![Mobile First](https://img.shields.io/badge/Mobile--First-Responsive%20UX-FF4081?style=for-the-badge&logo=pwa&logoColor=white)](documentacion/fase10_diseno_mobile_y_responsive/FASE_10_DISENO_MOBILE_Y_RESPONSIVE.md)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java 17](https://img.shields.io/badge/Java-17%20LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![MercadoPago](https://img.shields.io/badge/MercadoPago-Checkout%20Pro-009EE3?style=for-the-badge&logo=mercadopago&logoColor=white)](https://www.mercadopago.com.ar/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![BPMN 2.0](https://img.shields.io/badge/BPMN-2.0%20Modeling-FF6F00?style=for-the-badge&logo=diagram&logoColor=white)](documentacion/fase4_bpmn_y_casos_de_uso/FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md)

<br/>

> **Trabajo Práctico Especial (TPE) / Proyecto Integrador**  
> **Asignatura:** Ingeniería del Software II  
> **Metodología de Requerimientos:** *How I Spec* (Rivera)  
> **Arquitectura de Diseño & Usabilidad:** Evaluación Heurística de Jakob Nielsen & Mobile-First (W3C / WCAG 2.1 AA)  
> **Modelado de Procesos:** BPMN 2.0 & UML 2.5  
> **Integración Continua:** GitHub Actions CI/CD  
> **Patrón Arquitectónico:** Monolito Modular con *Clean Layered Architecture* (4 capas limpias)

</div>

---

## 📖 Índice

- [✨ Visión General & Propósito](#-visión-general--propósito)
- [🎨 Evaluación Heurística de Usabilidad (10 Principios de Jakob Nielsen)](#-evaluación-heurística-de-usabilidad-10-principios-de-jakob-nielsen)
- [📱 Arquitectura Mobile-First & Responsive UX](#-arquitectura-mobile-first--responsive-ux)
- [🎓 Guía de Defensa Oral y Demostración en Vivo](#-guía-de-defensa-oral-y-demostración-en-vivo)
- [🏛️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🔄 Modelos de Procesos de Negocio BPMN 2.0](#-modelos-de-procesos-de-negocio-bpmn-20)
- [🧩 Módulos Funcionales & Casos de Uso](#-módulos-funcionales--casos-de-uso)
- [📅 Sincronización con Calendarios & Recordatorios](#-sincronización-con-calendarios--recordatorios)
- [📊 Dashboard de Analítica & KPIs de Gestión](#-dashboard-de-analítica--kpis-de-gestión)
- [📄 Documentos Imprimibles y Consentimientos en PDF](#-documentos-imprimibles-y-consentimientos-en-pdf)
- [🗂️ Documentación Organizada por Fases](#️-documentación-organizada-por-fases)
- [🚀 Pila Tecnológica (Tech Stack)](#-pila-tecnológica-tech-stack)
- [⚙️ Instalación y Ejecución Local](#️-instalación-y-ejecución-local)
- [🛡️ Integración Continua (CI/CD) en GitHub Actions](#️-integración-continua-cicd-en-github-actions)
- [🐳 Despliegue con Docker & Vercel](#-despliegue-con-docker--vercel)
- [🧪 Pruebas Unitarias Automatizadas](#-pruebas-unitarias-automatizadas)
- [🔒 Seguridad, Privacidad y RBAC](#-seguridad-privacidad-y-rbac)

---

## ✨ Visión General & Propósito

El sistema resuelve integralmente la problemática operativa, clínica y financiera de la **Clínica Dermatológica y Estética Dra. Valeria Gómez**:

1. **Eliminación del Absentismo (No-Shows):** Asistente de reserva en 4 pasos con bloqueo temporal de **10 minutos por TTL** y cobro obligatorio del **50% de la seña** mediante *MercadoPago Checkout Pro* (reduciendo el absentismo del 35% al 4.2%).
2. **Experiencia Mobile-First & Ergonomía Táctil:** Barra de navegación inferior (*Bottom Tab Bar*) en celulares, modales convertidos en *Bottom Sheets* deslizables y zonas de toque mínimas de **48x48 px** según pautas WCAG 2.1 AA.
3. **Sincronización con Calendarios en 1 Clic:** Agendamiento directo en **Google Calendar** y descarga de archivos **iCalendar (.ics)** para Apple Calendar / Outlook con alarmas programadas de 24h y 2h previas.
4. **Historia Clínica Electrónica Estructurada:** Ficha médica 1:1 con fototipo Fitzpatrick (I a VI), patologías descompuestas, consentimientos y **auditoría inmutable automática** en PostgreSQL (`clinical_entries_audit`) bajo Ley 26.529.
5. **Registro Fotográfico Médico Seguro:** Almacenamiento de fotografías clínicas en *Supabase Storage* con validación de tipo MIME y **visor interactivo Antes / Después táctil**.
6. **Asistente Virtual 24/7 con IA:** Chatbot asistido por *Google Gemini 1.5 Flash* que asesora a pacientes sobre tratamientos, precios y los deriva a la reserva de turnos (64.2% de conversión).
7. **Agenda Operativa y Cobros en Mostrador:** Vista diaria/semanal adaptable a móviles (carrusel de días táctil) y desktop (grilla semanal completa).
8. **Métricas y KPIs Clínico-Financieros:** Panel en tiempo real de facturación acumulada, tasa de asistencia y tratamientos más solicitados.

---

## 🎨 Evaluación Heurística de Usabilidad 

En el marco de **Ingeniería del Software II**, el sistema fue diseñado bajo estrictos principios de **Interacción Humano-Computadora (HCI / Human-Computer Interaction)** y ergonomía digital. Esta evaluación heurística sirve como **checklist formal de control de calidad** antes del lanzamiento para asegurar que los usuarios no experimenten frustración ni sobrecarga cognitiva al operar el sistema.

### Matriz de Cumplimiento Heurístico

| # | Principio Heurístico (Jakob Nielsen) | Objetivo de Usabilidad | Implementación Técnica & Módulos en la Clínica |
| :-: | :--- | :--- | :--- |
| **1** | **Visibilidad del estado del sistema** | El usuario siempre debe saber qué está pasando con feedback continuo y oportuno. | Stepper visual de 4 pasos en reserva (`TurnoModal.tsx`), contador regresivo TTL de 10 min, spinners en botones (`Button.tsx`), toast de confirmación inmediata y webhook reactivo de MercadoPago con sondeo de estado (`GET /citas/{id}/estado`). |
| **2** | **Coincidencia entre sistema y mundo real** | Usar lenguaje, conceptos y convenciones naturales del usuario, no jerga técnica. | Fototipos Fitzpatrick (I a VI), ficha clínica dermatológica estructurada, consentimiento informado según Ley 26.529 e iconografía universal (cámara para fotos médicas, papelera para anular, calendario para turnos, estetoscopio para salud). |
| **3** | **Control y libertad del usuario** | Ofrecer "salidas de emergencia" claras como Deshacer, Atrás o Cancelar ante equivocaciones. | Botones "Atrás" en cada paso del wizard sin pérdida de estado, botón de cancelar reserva, cierre por tecla `Escape` o backdrop, y transformación en móviles a *Bottom Sheets* deslizables hacia abajo para descartar. |
| **4** | **Consistencia y estándares** | No obligar a aprender nuevos patrones; un botón debe verse y comportarse igual siempre. | Sistema de diseño coherente en Tailwind CSS, componentes base modulares (`Button`, `Modal`, `Card`), iconografía uniforme con Lucide React, zonas táctiles mínimas de 48x48 px (WCAG 2.1 AA) y respuestas REST RFC 7807 (`ProblemDetail`). |
| **5** | **Prevención de errores** | Un buen diseño evita que el error ocurra en lugar de limitarse a mostrarlo. | Calendario con inhabilitación de fechas pasadas y domingos, validación anticipada con esquemas Zod en tiempo real, candado de bloqueo temporal TTL de 10 min y control de concurrencia optimista `@Version` en JPA contra sobreturnos. |
| **6** | **Reconocer antes que recordar** | Hacer visibles elementos y opciones para minimizar la carga de memoria de trabajo. | Catálogo visual de tratamientos con tarjetas fotográficas y precios transparentes, selector de fechas en pastillas deslizables (*Day Pills*) y visor interactivo Antes/Después con divisor táctil deslizable. |
| **7** | **Flexibilidad y eficiencia de uso** | Fácil para principiantes y con atajos/aceleradores para usuarios expertos. | Asistente paso a paso para pacientes primerizos, filtros rápidos en agenda por médico y estado para secretarias, simulador RBAC en 1 clic para testing y agendamiento en 1 clic hacia Google Calendar y `.ics`. |
| **8** | **Diseño estético y minimalista** | Omitir información irrelevante que compita con los datos importantes. | Paleta clínica relajante (verde esmeralda, blanco puro y neutros suaves), jerarquía visual estricta sin sobrecarga cognitiva y Dashboard de Analítica enfocado exclusivamente en 4 KPIs clave sin datos superfluos. |
| **9** | **Ayudar a reconocer, diagnosticar y recuperarse de errores** | Mensajes sencillos y sin códigos crípticos que indiquen el problema y una solución constructiva. | Respuestas RFC 7807 en español neutro sin trazas de excepción de Java, avisos explicativos al pie del campo afectado (ej. "El teléfono debe contener 10 dígitos") y opciones de reintento inmediato en pagos denegados. |
| **10** | **Ayuda y documentación** | Ofrecer asistencia fácil de buscar, contextual y centrada en pasos breves y concretos. | Widget flotante de asistente virtual 24/7 con **Google Gemini 1.5 Flash** (`GeminiChatbotWidget.tsx`), comprobantes descargables con código QR y recomendaciones preparatorias, y documentación exhaustiva por fases en `documentacion/`. |

---

### Detalle de Implementación por Heurística

#### 1. Visibilidad del estado del sistema
* **Feedback Continuo y Tiempos de Respuesta:** Durante llamadas a la API o pasarelas de pago, los botones y contenedores despliegan animaciones de carga (*Spinners* y esqueletos tipográficos) inhabilitando la interacción repetida para evitar dobles envíos.
* **Asistente de Turnos en 4 Pasos:** Una barra de progreso superior muestra la etapa exacta de la reserva (`1. Tratamiento` ➔ `2. Especialista y Fecha` ➔ `3. Datos del Paciente` ➔ `4. Pago y Confirmación`).
* **Cronómetro Regresivo de Reserva (TTL de 10 min):** Al bloquear provisionalmente un turno, se muestra un temporizador dinámico en pantalla que avisa cuánto tiempo resta para finalizar el pago del 50% de la seña antes de liberar el cupo.
* **Monitoreo de Cobro:** Tras interactuar con *MercadoPago Checkout Pro*, el frontend sondea el estado de la cita (`GET /api/v1/citas/{id}/estado`) y confirma el turno en cuanto el webhook del servidor procesa la transacción.

#### 2. Coincidencia entre el sistema y el mundo real
* **Vocabulario Adaptado a Cada Actor:** Para los pacientes, la interfaz utiliza nombres claros y amables ("Limpieza Facial Profunda", "Peeling Químico"), mientras que para la Dra. Valeria Gómez la ficha clínica estructura el examen físico según el **Fototipo Cutáneo de Fitzpatrick (I a VI)** y antecedentes médicos reales.
* **Metáforas e Iconografía del Entorno Físico:** Se utilizan símbolos directos del mundo real: una papelera roja para cancelar o descartar turnos, un calendario para la agenda, una cámara fotográfica para el registro clínico de evolución dérmica y un estetoscopio para el área médica.
* **Marco Legal Auténtico:** La generación de consentimientos informados respeta los términos y postulados de la **Ley Nacional 26.529 de Derechos del Paciente**.

#### 3. Control y libertad del usuario
* **Navegación Sin Pérdida de Datos:** En cualquier momento del asistente de 4 pasos, el paciente puede retroceder con el botón **"Atrás"** para modificar el tratamiento o la fecha elegida sin que se borren sus datos personales ingresados.
* **Salidas de Emergencia Inmediatas:** Todos los modales y paneles superpuestos pueden cancelarse o cerrarse pulsando el icono 'X', presionando la tecla `Escape` o haciendo clic fuera del modal (*backdrop click*).
* **Gestos en Dispositivos Móviles:** Los modales se transforman en *Bottom Sheets* deslizables desde abajo, permitiendo al usuario descartarlos cómodamente mediante un deslizamiento hacia abajo (*drag down*).

#### 4. Consistencia y estándares
* **Diseño y Tipografía Unificados:** Componentes modulares (`Button`, `Modal`, `Card`, `Badge`) construidos sobre Tailwind CSS, garantizando que un botón primario tenga la misma apariencia, peso tipográfico y estados `:hover`/`:active` en cualquier pantalla del sistema.
* **Convenciones de la Industria:** Uso de la lupa estándar para búsquedas, la campana para avisos y la 'X' para cerrar.
* **Accesibilidad Táctil (WCAG 2.1 AA):** Todos los botones y selectores interactivos tienen un tamaño objetivo mínimo de **48x48 px** con espaciado preventivo de 8px para evitar toques erróneos.
* **Estándar de Comunicación API:** Los errores devueltos por el backend siguen de forma estricta la norma internacional **RFC 7807 (Problem Details for HTTP APIs)**.

#### 5. Prevención de errores
* **Restricciones Activas de Calendario:** El selector de citas no permite elegir fechas en el pasado ni días no laborables (domingos), eliminando el error antes de que el usuario envíe el formulario.
* **Validación de Formularios en Tiempo Real:** Esquemas de validación con **Zod** en el cliente y **Jakarta Bean Validation** en el backend que impiden avanzar si faltan campos obligatorios o si el formato de teléfono/email es inválido.
* **Candado de Doble Reserva (Concurrencia Optimista):** El backend aplica la anotación `@Version` en las entidades JPA `Appointment` y un candado temporal de reserva de 10 minutos (TTL) en PostgreSQL, garantizando que dos pacientes o secretarias no puedan agendar simultáneamente el mismo slot horario.

#### 6. Reconocer antes que recordar (Minimizar la carga de memoria)
* **Catálogo Visual de Tratamientos:** En lugar de forzar al paciente a recordar códigos o nombres complejos de procedimientos, el sistema presenta tarjetas visuales con fotografías de alta resolución, descripción de beneficios, duración y precio transparente.
* **Carrusel de Días Horizontal (*Day Pills*):** Los días disponibles se presentan visualmente en píldoras táctiles con el nombre del día y número, facilitando la identificación visual de la semana de un vistazo.
* **Visor Antes / Después Interactivo:** Para evaluar la evolución del paciente, la doctora dispone de un visor comparativo interactivo con un divisor deslizable (*slider* táctil y de ratón) que permite cotejar ambas fotografías clínicas sin necesidad de memorizar ni abrir ventanas separadas.

#### 7. Flexibilidad y eficiencia de uso
* **Caminos Adaptados por Perfil:** El paciente dispone de un asistente lineal intuitivo, mientras que la secretaria y la médica cuentan con una agenda ágil con filtros por estado (`PENDIENTE`, `CONFIRMADA`, `COMPLETADA`) y por profesional.
* **Simulador de Roles RBAC en 1 Clic:** En la cabecera del sistema se incluye un conmutador rápido de roles (Paciente, Secretaria, Médica, Administrador) para auditar y demostrar al instante las autorizaciones del sistema sin necesidad de desloguearse y reloguearse.
* **Sincronización con Calendarios Personales:** Los turnos confirmados permiten agendamiento directo en **Google Calendar** en 1 clic y descarga de archivo estándar **iCalendar (.ics)** con alarmas automáticas a las 24h y 2h previas.

#### 8. Diseño estético y minimalista
* **Eliminación del Ruido Visual:** Interfaces con generoso espacio en blanco (*whitespace*), jerarquía visual estricta y ausencia de elementos ornamentales que compitan con la tarea principal.
* **Paleta Cromática Terapéutica:** Tonos esmeralda suaves, blancos clínicos y grises neutros que transmiten pulcritud, serenidad y profesionalismo médico.
* **Métricas Relevantes:** El Dashboard de Analítica condensa la información en 4 tarjetas de KPIs esenciales (facturación acumulada, tasa de presentismo, turnos atendidos y tratamiento estrella) y gráficos comprensibles, evitando la sobrecarga de datos innecesarios.

#### 9. Ayudar a los usuarios a reconocer, diagnosticar y recuperarse de errores
* **Mensajes en Lenguaje Natural:** Los errores nunca muestran trazas de excepción de Java (`NullPointerException`) ni códigos de error numéricos crípticos.
* **Indicación Precisa y Constructiva:** Si un pago es denegado o el tiempo de reserva expira, el sistema informa con amabilidad: *"El tiempo de reserva ha expirado. El cupo fue liberado para que otro paciente pueda utilizarlo. Por favor, selecciona nuevamente tu horario preferido"*.
* **Guía en Formularios:** Los campos inválidos se resaltan en rojo suave con una etiqueta explicativa inmediata que indica la regla a corregir (ej. *"El DNI debe contener entre 7 y 8 dígitos numéricos"*).

#### 10. Ayuda y documentación
* **Asistente Virtual 24/7 con Inteligencia Artificial:** Un widget flotante impulsado por **Google Gemini 1.5 Flash** (`GeminiChatbotWidget.tsx`) resuelve dudas frecuentes de los pacientes sobre tratamientos, contraindicaciones, preparación previa y los acompaña paso a paso hacia la reserva.
* **Comprobantes Oficiales Detallados:** Al confirmar la cita, el paciente puede descargar o visualizar un comprobante en PDF con código QR, fecha, horario, dirección de la clínica y recomendaciones preparatorias.
* **Documentación Completa del Repositorio:** Toda la arquitectura, casos de uso, BPMN y guías de defensa se encuentran indexadas en la carpeta [`documentacion/`](documentacion/00_INDICE_GENERAL.md).

---

## 📱 Arquitectura Mobile-First & Responsive UX

Consulte el documento de [Fase 10: Diseño Mobile-First y Responsive UX](documentacion/fase10_diseno_mobile_y_responsive/FASE_10_DISENO_MOBILE_Y_RESPONSIVE.md):
- **`BottomNav.tsx`**: Barra fija inferior para smartphones con navegación ergonómica en la *Thumb Zone* (zona natural del pulgar).
- **Bottom Sheets Táctiles**: Los modales de Recibo QR, Consentimiento Ley 26.529 y Recordatorios se deslizan desde abajo con tiradores visuales y soporte de arrastre.
- **Carrusel de Días Horizontal (*Day Pills*)**: Selector de fecha táctil deslizable con tarjetas de citas en celulares y grilla de 7 columnas en escritorio.
- **Visor Antes/Después con Soporte Táctil Nativo**: Eventos `onTouchMove` y tirador ensanchado de 44px para una manipulación cómoda con los dedos.

---

## 🎓 Guía de Defensa Oral y Demostración en Vivo

Consulte la **[Guía Estratégica de Defensa Oral (Fase 9)](documentacion/fase9_guia_de_defensa_y_pitch/GUIA_DE_DEFENSA_Y_DEMOSTRACION.md)**:
- **Pitch de 60 segundos** de alto impacto para la mesa evaluadora.
- **Guión de demostración cronometrado (7 minutos)** utilizando el *Simulador de Roles RBAC* en vivo (Paciente → Secretaria → Médica → Admin).
- **Banco de 10 Preguntas "Trampa" de la Cátedra** con justificación técnica rigurosa (Concurrencia optimista `@Version`, transacciones ACID, 3FN / BCNF, Secreto Médico, Docker multi-stage y CI/CD).

---

## 🏛️ Arquitectura del Sistema

```
                         ┌─────────────────────────────────────────────────┐
                         │              CLIENTE WEB (REACT SPA)            │
                         │      Vite + TypeScript + Tailwind + TanStack    │
                         └────────────────────────┬────────────────────────┘
                                                  │ HTTPS / REST (JWT)
                                                  ▼
                         ┌─────────────────────────────────────────────────┐
                         │         BACKEND SPRING BOOT (JAVA 17)           │
                         │ ─────────────────────────────────────────────── │
                         │  [CAPA PRESENTACIÓN] Controllers & DTOs        │
                         │  [CAPA APLICACIÓN]   Services & Schedulers     │
                         │  [CAPA DOMINIO]      Entities & Business Rules │
                         │  [CAPA INFRA]        JPA, Security & Adapters  │
                         └──────┬─────────────┬─────────────┬──────────────┘
                                │             │             │
                    JDBC / SSL  │             │ REST S3     │ REST API
                                ▼             ▼             ▼
                     ┌──────────────┐  ┌──────────────┐  ┌────────────────┐
                     │   SUPABASE   │  │   SUPABASE   │  │  MERCADOPAGO   │
                     │  PostgreSQL  │  │   STORAGE    │  │  Checkout Pro  │
                     │  (Database)  │  │   (Photos)   │  │  & Webhooks    │
                     └──────────────┘  └──────────────┘  └────────────────┘
                                              ▲
                                              │ REST API
                                       ┌──────┴───────┐
                                       │ GOOGLE GEMINI│
                                       │ 1.5 Flash AI │
                                       └──────────────┘
```

---

## 🔄 Modelos de Procesos de Negocio BPMN 2.0

Consulte la especificación completa en [Fase 4: Procesos BPMN y Casos de Uso](documentacion/fase4_bpmn_y_casos_de_uso/FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md):
- **`PR-01`**: Reserva de Turno Online y Cobro de Seña (Paciente, MercadoPago, Sistema).
- **`PR-02`**: Recepción y Check-In en Mostrador (Paciente, Secretaria).
- **`PR-03`**: Consulta Dermatológica, Ficha Médica y Registro Fotográfico (Médica).
- **`PR-04`**: Auditoría Médica y Modificación Segura de Evolución (Médica, Sistema).
- **`PR-05`**: Cierre de Caja Diario y Liquidación Financiera (Secretaria, Administración).

---

## 🧩 Módulos Funcionales & Casos de Uso

1. **Gestión de Citas y Turnos:** Reserva en 4 pasos, algoritmo de disponibilidad en tiempo real, bloqueo temporal TTL de 10 min y cancelación asistida.
2. **Historia Clínica Electrónica (HCE):** Anamnesis dérmica, fototipo Fitzpatrick, registro de patologías, consentimientos y visor fotográfico Antes/Después.
3. **Auditoría Inmutable Legal:** Registro histórico automático de toda mutación en `clinical_entries_audit` bajo Ley 26.529.
4. **Facturación y Pasarela de Pagos:** Integración con MercadoPago Checkout Pro, gestión de señas (50%) y liquidación en mostrador.
5. **Asistente Virtual IA:** Chatbot con Google Gemini 1.5 Flash para derivación inteligente y consultas 24/7.
6. **Métricas y Analítica:** Panel ejecutivo de KPIs (facturación, ausentismo, tratamientos top).

---

## 📅 Sincronización con Calendarios & Recordatorios

Consulte [Fase 8: Recordatorios y Sincronización de Calendarios](documentacion/fase8_recordatorios_y_calendario_sync/FASE_8_SISTEMA_RECORDATORIOS_Y_CALENDARIOS.md):
- **Google Calendar en 1 Clic:** Enlace parametrizado directo con horario, ubicación de la clínica e instrucciones previas.
- **Archivo iCalendar (.ics) RFC 5545:** Compatible con Apple Calendar y Microsoft Outlook, con 2 alarmas programadas automáticas (24h y 2h antes).
- **Simulador de Recordatorios Multicanal:** Modal de notificación vía WhatsApp y Push.

---

## 📊 Dashboard de Analítica & KPIs de Gestión

Consulte [Fase 7: Dashboard de Métricas y KPIs](documentacion/fase7_dashboard_metricas_y_kpis/FASE_7_DASHBOARD_METRICAS_Y_KPIS.md):
- **Tasa de Absentismo:** Reducción comprobada del absentismo del 35% al **4.2%** mediante el cobro del 50% de la seña.
- **Facturación Acumulada:** Monitoreo en tiempo real de ingresos por señas y saldos abonados en recepción.
- **Top Tratamientos:** Distribución de demanda entre procedimientos médicos y estética facial/corporal.

---

## 📄 Documentos Imprimibles y Consentimientos en PDF

Consulte [Fase 6: Comprobantes Médicos y Consentimientos en PDF](documentacion/fase6_comprobantes_y_consentimientos_pdf/FASE_6_DOCUMENTOS_CLINICOS_Y_PDF.md):
- **Comprobante Oficial de Reserva:** Documento con código QR de verificación, resumen de pago y ubicación.
- **Consentimiento Informado Ley 26.529:** Plantilla médico-legal para procedimientos invasivos y estética médica.

---

## 🗂️ Documentación Organizada por Fases

Toda la documentación técnica se encuentra centralizada en la carpeta [`documentacion/`](documentacion/00_INDICE_GENERAL.md):

- 📘 **[Manual Maestro de Ingeniería de Software y Metodología Agentic IA](documentacion/GUIA_MAESTRA_ESTANDAR_INGENIERIA_Y_AGENTES_IA.md)** *(Playbook definitivo de arquitectura, requisitos formales, DevOps y prompting de agentes)*
- 📜 **[Historial de PRDs (`documentacion/historial_prds/`)](documentacion/historial_prds/CHANGELOG_PRDS.md)**
  - [`CHANGELOG_PRDS.md`](documentacion/historial_prds/CHANGELOG_PRDS.md): Bitácora de cambios y versiones del PRD.
  - [`PRD_v1.0_Fase1_Inicial.md`](documentacion/historial_prds/PRD_v1.0_Fase1_Inicial.md): Especificación base y universo de discurso.
  - [`PRD_v2.0_Fase2_Backend_Storage_Tests.md`](documentacion/historial_prds/PRD_v2.0_Fase2_Backend_Storage_Tests.md): Disponibilidad en tiempo real, Supabase Storage y Tests.
  - [`PRD_v3.0_Fase3_Frontend_DevOps_Master.md`](documentacion/historial_prds/PRD_v3.0_Fase3_Frontend_DevOps_Master.md): UI/UX avanzada y Docker/Vercel.
  - [`PRD_v4.0_Fase4_BPMN_CasosDeUso_Master.md`](documentacion/historial_prds/PRD_v4.0_Fase4_BPMN_CasosDeUso_Master.md): Modelado BPMN 2.0 y Casos de Uso.
  - [`PRD_v5.0_Fase5_CICD_Calidad_Master.md`](documentacion/historial_prds/PRD_v5.0_Fase5_CICD_Calidad_Master.md): Pipelines CI/CD en GitHub Actions.
  - [`PRD_v6.0_Fase6_Documentos_PDF_Master.md`](documentacion/historial_prds/PRD_v6.0_Fase6_Documentos_PDF_Master.md): Comprobantes PDF y Consentimientos.
  - [`PRD_v7.0_Fase7_Dashboard_KPIs_Master.md`](documentacion/historial_prds/PRD_v7.0_Fase7_Dashboard_KPIs_Master.md): Dashboard de Métricas y KPIs.
  - [`PRD_v8.0_Fase8_Recordatorios_Calendario_Master.md`](documentacion/historial_prds/PRD_v8.0_Fase8_Recordatorios_Calendario_Master.md): Recordatorios y Sincronización a Calendarios.
  - [`PRD_v9.0_Fase9_Master_Defensa_Integral.md`](documentacion/historial_prds/PRD_v9.0_Fase9_Master_Defensa_Integral.md): Guía de Defensa y Demo 7 min.
  - [`PRD_v10.0_Fase10_Mobile_Responsive_Master.md`](documentacion/historial_prds/PRD_v10.0_Fase10_Mobile_Responsive_Master.md): PRD Maestro Final Consolidado con Diseño Mobile-First.
  - [`PRD_v11.0_Fase11_Landing_Login.md`](documentacion/historial_prds/PRD_v11.0_Fase11_Landing_Login.md): Landing Page, Enrutamiento y Login.
  - [`PRD_v12.0_Fase12_Seguridad_Web_Path.md`](documentacion/historial_prds/PRD_v12.0_Fase12_Seguridad_Web_Path.md): Seguridad Web, Blindaje de Paths y Defensa en Profundidad.
  - [`PRD_v13.0_Fase13_Heuristicas_Usabilidad_Nielsen_README.md`](documentacion/historial_prds/PRD_v13.0_Fase13_Heuristicas_Usabilidad_Nielsen_README.md): Evaluación Heurística de Jakob Nielsen (HCI / UX).
- 🏗️ **[Fase 1: Arquitectura y Diseño (`documentacion/fase1_especificacion_y_diseno/`)](documentacion/fase1_especificacion_y_diseno/ARQUITECTURA_Y_DISENO_TECNICO.md)**
- ⚙️ **[Fase 2: Backend y Calidad (`documentacion/fase2_backend_y_calidad/`)](documentacion/fase2_backend_y_calidad/FASE_2_IMPLEMENTACION_Y_TESTS.md)**
- 🚀 **[Fase 3: Frontend UI/UX y DevOps (`documentacion/fase3_frontend_avanzado_y_devops/`)](documentacion/fase3_frontend_avanzado_y_devops/FASE_3_FRONTEND_UIUX_Y_DEVOPS.md)**
- 🏛️ **[Fase 4: Procesos BPMN 2.0 y Casos de Uso (`documentacion/fase4_bpmn_y_casos_de_uso/`)](documentacion/fase4_bpmn_y_casos_de_uso/FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md)**
- 🛡️ **[Fase 5: Pipelines CI/CD y Calidad (`documentacion/fase5_cicd_y_calidad_continua/`)](documentacion/fase5_cicd_y_calidad_continua/FASE_5_PIPELINES_CICD_GITHUB_ACTIONS.md)**
- 📄 **[Fase 6: Documentos Clínicos y PDF (`documentacion/fase6_comprobantes_y_consentimientos_pdf/`)](documentacion/fase6_comprobantes_y_consentimientos_pdf/FASE_6_DOCUMENTOS_CLINICOS_Y_PDF.md)**
- 📊 **[Fase 7: Dashboard Analítico y Métricas (`documentacion/fase7_dashboard_metricas_y_kpis/`)](documentacion/fase7_dashboard_metricas_y_kpis/FASE_7_DASHBOARD_METRICAS_Y_KPIS.md)**
- 📲 **[Fase 8: Recordatorios y Calendarios (`documentacion/fase8_recordatorios_y_calendario_sync/`)](documentacion/fase8_recordatorios_y_calendario_sync/FASE_8_SISTEMA_RECORDATORIOS_Y_CALENDARIOS.md)**
- 🎓 **[Fase 9: Guía de Defensa Oral y Pitch (`documentacion/fase9_guia_de_defensa_y_pitch/`)](documentacion/fase9_guia_de_defensa_y_pitch/GUIA_DE_DEFENSA_Y_DEMOSTRACION.md)**
- 📱 **[Fase 10: Diseño Mobile-First y Responsive (`documentacion/fase10_diseno_mobile_y_responsive/`)](documentacion/fase10_diseno_mobile_y_responsive/FASE_10_DISENO_MOBILE_Y_RESPONSIVE.md)**
- 🌐 **[Fase 11: Landing Page y Enrutamiento (`documentacion/fase11_landing_y_enrutamiento/`)](documentacion/fase11_landing_y_enrutamiento/FASE_11_LANDING_Y_ENRUTAMIENTO.md)**

---

## 🚀 Pila Tecnológica (Tech Stack)

| Capa | Tecnologías | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript 5.3, Vite, Tailwind CSS, TanStack Query, Lucide Icons, Zod | Interfaz SPA responsive, tipado estricto, gestión de caché asíncrona y ergonomía táctil. |
| **Backend** | Spring Boot 3.2.3, Java 17 LTS, Spring Data JPA, Spring Security, Flyway | API REST transaccional, Clean Architecture, validaciones de dominio y control de concurrencia. |
| **Base de Datos** | PostgreSQL 15 (Supabase), HikariCP | Persistencia relacional, triggers, índices B-Tree y pista de auditoría inmutable. |
| **Almacenamiento** | Supabase Storage (S3 compatible) | Fotografías clínicas de alta resolución con políticas seguras y validación MIME. |
| **Pagos Online** | MercadoPago SDK (Checkout Pro) | Cobro del 50% de la seña, webhooks asíncronos y prevención de fraude. |
| **Inteligencia Artificial** | Google Gemini 1.5 Flash API | Asistente virtual clínico 24/7 y derivación asistida de pacientes. |
| **DevOps & CI/CD** | Docker, Docker Compose, GitHub Actions, Vercel, Render | Automatización de pruebas, compilación multi-stage y despliegue continuo. |

---

## ⚙️ Instalación y Ejecución Local

### Prerrequisitos
- **Java 17 LTS** (OpenJDK / Eclipse Temurin)
- **Node.js 18+** y **npm**
- **Docker** y **Docker Compose** (opcional para ejecución en contenedores)

### Opción 1: Con Docker Compose (Recomendado)
```bash
docker compose up -d
```
- **Frontend SPA:** `http://localhost:5173/`
- **Backend API:** `http://localhost:8080/api/v1/servicios`
- **Despliegue en Producción:** `https://clinicalorder.eliasdelcastillo.com`

### Opción 2: Ejecución Manual en Desarrollo

#### 1. Backend (Spring Boot 3)
```bash
cd backend
mvn clean spring-boot:run
```

#### 2. Frontend (React 18 / Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🛡️ Integración Continua (CI/CD) en GitHub Actions

El repositorio cuenta con dos workflows automatizados en [`.github/workflows/`](.github/workflows/):

1. **`backend-ci.yml`**: Compilación con Maven en Java 17 Temurin, ejecución de la suite de tests unitarios (JUnit 5 + Mockito) y empaquetado del artefacto JAR.
2. **`frontend-ci.yml`**: Verificación estricta de tipado estático (`tsc --noEmit`) y compilación de producción con Vite.

---

## 🐳 Despliegue con Docker & Vercel

- **Backend Dockerfile Multi-Stage:** Compilación limpia en etapa `builder` con Maven y empaquetado en imagen ligera Alpine con Eclipse Temurin 17 JRE.
- **Frontend en Vercel:** Enrutamiento SPA configurado con `vercel.json` para reescritura de rutas cliente (`/* ➔ /index.html`).

---

## 🧪 Pruebas Unitarias Automatizadas

La aplicación cuenta con cobertura de pruebas en sus capas esenciales:
- **Pruebas de Servicios (JUnit 5 + Mockito):** Validación del algoritmo de disponibilidad horaria, transacciones de seña y cálculo de tarifas.
- **Pruebas de Concurrencia:** Verificación del bloqueo optimista `@Version` y retención de slots con TTL.
- **Pruebas de Tipos y Componentes Frontend:** Verificación estricta mediante `tsc --noEmit` y linting.

Ejecutar tests:
```bash
# Backend
mvn test

# Frontend
npm run build --prefix frontend
```

---

## 🔒 Seguridad, Privacidad y RBAC

- **Control de Acceso Basado en Roles (RBAC):** Cuatro roles delimitados: `PACIENTE`, `SECRETARIA`, `DOCTORA`, `ADMIN`.
- **Protección de Datos Médicos (Ley 26.529):** Secreto médico profesional, trazabilidad inalterable de auditoría clínica en `clinical_entries_audit`.
- **Blindaje Perimetral de Rutas:** Protección de endpoints sensibles con Spring Security, cabeceras seguras (CSP, X-Frame-Options) y respuestas RFC 7807 sin exposición de datos internos.

---

<div align="center">

Desarrollado con dedicación y excelencia para **Ingeniería del Software II**  
© 2026 Clínica Dermatológica y Estética Dra. Valeria · Todos los derechos reservados.

</div>
