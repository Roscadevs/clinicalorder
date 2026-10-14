# 📄 Product Requirements Document (PRD) - v13.0
**Fase 13: Incorporación de Evaluación Heurística de Usabilidad (10 Principios de Jakob Nielsen) en la Documentación y README**

---

## 1. Encabezado y Resumen (Hoy vs. Después)

| Dimensión | Hoy (Estado Actual) | Después (Estado Propuesto) |
| :--- | :--- | :--- |
| **Documentación en README** | El archivo `README.md` describe la arquitectura técnica, CI/CD y stack, pero omite la justificación de usabilidad e Interacción Humano-Computadora (HCI). Las secciones listadas en el índice no presentan la correspondencia sistemática con los principios de diseño de interfaces. | El archivo `README.md` incorpora una sección principal de **Evaluación Heurística de Usabilidad (10 Principios de Jakob Nielsen)**, estructurada como checklist de calidad y alineada con los estándares de evaluación de la cátedra de Ingeniería del Software II. |
| **Mapeo del Sistema a HCI/UX** | Las decisiones de diseño (bloqueo TTL de 10 min, Bottom Sheets ergonómicos, visor Antes/Después táctil, chatbot Gemini 24/7, RFC 7807) están dispersas en carpetas de documentación técnica sin un hilo conductor de usabilidad. | Cada una de las 10 heurísticas de Jakob Nielsen se mapea punto por punto con los módulos reales del sistema (asistente de turnos, agenda médica, historia clínica, visor dermatológico, control de errores y asistente IA). |
| **Guía de Auditoría de Usabilidad** | No existe una checklist explícita que evalúe si las interfaces cumplen con las reglas de prevención de errores, reconocimiento, estética minimalista y libertad del usuario. | Se provee una matriz exhaustiva de cumplimiento heurístico que sirve como instrumento formal de auditoría y defensa oral del proyecto integrador. |
| **Preservación de Invariantes Clínicos** | La documentación técnica resalta la seguridad pero no vincula la usabilidad con la integridad de auditoría clínica inmutable (`clinical_entries_audit`). | Se documenta cómo los principios de usabilidad (prevención de errores y claridad del estado) protegen la integridad de los datos médicos y la inmutabilidad de la auditoría legal. |

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)

### Antes
Un profesor o evaluador de la cátedra de Ingeniería del Software II abre el repositorio del proyecto. Al leer la portada y el `README.md`, encuentra un gran despliegue de tecnologías (Spring Boot, React, Docker, PostgreSQL, Gemini IA, CI/CD), pero no encuentra una sección dedicada a cómo el sistema cuida la experiencia humana y la usabilidad de sus usuarios (pacientes, secretarias, doctoras). Si el evaluador busca verificar si el sistema aplica los principios clásicos de usabilidad de Jakob Nielsen —como si se previene que un paciente reserve en el pasado, si hay salidas de emergencia para deshacer errores, o si el lenguaje usado es comprensible y no plagado de jerga técnica— debe bucear en múltiples carpetas y deducirlo por su cuenta.

### Después
Al ingresar al `README.md`, el evaluador o usuario encuentra inmediatamente una sección destacada y rigurosa titulada **"🎨 Evaluación Heurística de Usabilidad (10 Principios de Jakob Nielsen)"**. Cada principio está explicado con claridad, acompañado de su respectiva evidencia visual y técnica dentro de la aplicación: desde el cronómetro de 10 minutos que visibiliza el estado del turno, pasando por el catálogo visual con fotos que evita tener que memorizar nombres de tratamientos, hasta los mensajes de error amables en lenguaje humano que orientan al paciente sobre cómo resolver el problema. El `README.md` no solo presenta el código fuente, sino que demuestra que el software fue concebido con un estándar profesional centrado en las personas y libre de frustraciones.

---

## 3. Objetivos y No-Objetivos

### Objetivos
1. **Integración de las 10 Heurísticas de Nielsen:** Añadir en `README.md` una sección completa y pedagógica que analice las 10 heurísticas de usabilidad aplicadas a la clínica dermatológica.
2. **Mapeo Explícito con Módulos del Sistema:** Demostrar el cumplimiento de cada heurística con componentes y flujos existentes en el frontend y backend:
   - H1: Visibilidad del estado (Spinners, cuenta regresiva TTL 10 min, estados de pago MercadoPago, pasos del asistente 1 al 4).
   - H2: Mundo real (Metáfora de consultorio, fototipos Fitzpatrick I-VI, iconografía estándar del mundo real, términos comprensibles).
   - H3: Control y libertad (Botones "Atrás", cancelar reserva, cerrar modales y Bottom Sheets con un gesto).
   - H4: Consistencia y estándares (Diseño Tailwind consistente, zonas táctiles 48x48 px, iconografía Lucide React uniforme).
   - H5: Prevención de errores (Bloqueo de fechas pasadas, validaciones Zod en tiempo real, candado de concurrencia TTL para evitar sobreturnos).
   - H6: Reconocer antes que recordar (Catálogo visual con fotos de tratamientos, selector táctil de días, visor Antes/Después interactivo).
   - H7: Flexibilidad y eficiencia (Simulador de roles RBAC en 1 clic para testing/demo, atajos de agenda, sincronización con Google Calendar y `.ics`).
   - H8: Diseño estético y minimalista (Paleta médica relajante, eliminación de saturación visual, foco en información esencial de la consulta).
   - H9: Recuperación de errores (Respuestas de error RFC 7807 traducidas a lenguaje natural sin exponer excepciones internas de Java).
   - H10: Ayuda y documentación (Asistente IA 24/7 con Google Gemini 1.5 Flash, comprobantes con instrucciones claras, documentación por fases).
3. **Actualización del Índice y Navegación del README:** Alinear la tabla de contenidos del `README.md` para enlazar de manera directa la nueva sección de heurísticas y verificar que todos los enlaces internos sean navegables.
4. **Respeto a la Identidad y Estructura Existente:** Mantener intactas las insignias (badges), el diagrama arquitectónico, los enlaces a documentación por fases y las instrucciones de despliegue local.

### No-Objetivos
- No se modificará el código fuente de las entidades Java ni la lógica transaccional de la base de datos en esta fase documental.
- No se alterarán los scripts de migración Flyway existentes.
- No se modificarán las interfaces ni contratos de los controladores REST existentes.

---

## 4. Cómo Funciona Hoy vs. Después

### Estructura de Secciones de Documentación en `README.md`
* **Hoy:**
  1. Portada con Badges y Presentación de la Asignatura.
  2. Índice de contenidos.
  3. Visión General & Propósito.
  4. Arquitectura Mobile-First & Responsive UX.
  5. Guía de Defensa Oral y Demostración en Vivo.
  6. Arquitectura del Sistema (Diagrama ASCII).
  7. Documentación Organizada por Fases (Fases 1 a 11).
  8. CI/CD en GitHub Actions.
  9. Instalación y Ejecución Local.
* **Después:**
  1. Portada con Badges e información de la asignatura.
  2. Índice de contenidos actualizado (incluyendo la sección de Heurísticas de Usabilidad).
  3. Visión General & Propósito del Proyecto.
  4. **🎨 Evaluación Heurística de Usabilidad (10 Principios de Jakob Nielsen)**:
     - Tabla/Matriz de Heurísticas vs. Implementación en la Clínica.
     - Detalle de cada heurística con ejemplos concretos y componentes de soporte.
  5. Arquitectura Mobile-First & Ergonomía Táctil (Thumb Zone, Bottom Sheets, 48x48 px).
  6. Guía de Defensa Oral y Demostración en Vivo (Pitch y Simulador RBAC).
  7. Arquitectura del Sistema (Diagrama ASCII de 4 capas limpias).
  8. Documentación Organizada por Fases (Fases 1 a 13 con enlaces directos).
  9. CI/CD en GitHub Actions.
  10. Instalación y Ejecución Local con Docker Compose y accesos de prueba.

---

## 5. Los Datos (Triggers, Candados Lógicos y Concurrencia)

1. **Invariante Crítico de Auditoría (`clinical_entries_audit` / `entrada_hc_audit`):**
   - Aunque la edición del `README.md` es de naturaleza documental y de diseño HCI, la heurística 1 (Visibilidad del estado) y la heurística 5 (Prevención de errores) deben documentar expresamente cómo el sistema protege la pista de auditoría médica inmutable. Cada evolución clínica registrada en el sistema continúa generando su correspondiente registro inmutable sin bypass.
2. **Concurrencia Optimista (`@Version`):**
   - En la heurística 5 (Prevención de errores), se documentará cómo la anotación `@Version` en las entidades `Appointment` y `MedicalRecord` previene colisiones concurrentes y condiciones de carrera entre la secretaria y la médica cuando atienden simultáneamente.
3. **Candados Lógicos (TTL de 10 Minutos):**
   - Se documenta el mecanismo de bloqueo temporal de turnos pendientes de pago para evitar que dos pacientes reserven el mismo horario a la vez.

---

## 6. Pseudo-código (El Acuerdo en Lenguaje Natural)

```text
AL ACTUALIZAR el archivo README.md:
    1. LEER el contenido actual del README.md preservando encabezado, diagramas y enlaces.
    2. INSERTAR en el Índice el enlace a la nueva sección:
       - [🎨 Evaluación Heurística de Usabilidad (10 Principios de Nielsen)](#-evaluación-heurística-de-usabilidad-10-principios-de-jakob-nielsen)
    3. INSERTAR tras la Visión General la sección de Evaluación Heurística:
       PARA CADA una de las 10 heurísticas (H1 a H10):
           DEFINIR el principio de Jakob Nielsen en lenguaje claro.
           DETALLAR la implementación concreta en el sistema de la clínica:
               - H1: Visibilidad y Feedback en tiempo real (loaders, cuenta regresiva TTL, estados de turno).
               - H2: Metáfora y vocabulario del mundo real (fototipos Fitzpatrick, iconografía intuitiva).
               - H3: Salidas de emergencia y control (botones Atrás, cancelar turno, cerrar paneles táctiles).
               - H4: Consistencia y estándares (Tailwind, Lucide icons, WCAG 2.1 AA, BottomNav).
               - H5: Prevención activa de errores (fechas deshabilitadas, validación Zod, candado TTL).
               - H6: Reconocer antes que recordar (cards de tratamientos con fotos, visor antes/después).
               - H7: Flexibilidad y atajos para expertos (Simulador RBAC 1-clic, filtros rápidos, Google Calendar).
               - H8: Estética y minimalismo (diseño sin sobrecarga cognitiva, layout clínico armónico).
               - H9: Diagnóstico amigable de errores (RFC 7807 en español, guía constructiva de solución).
               - H10: Ayuda y documentación contextual (Chatbot con Google Gemini 1.5 Flash 24/7, instructivos).
    4. ACTUALIZAR la lista de Fases en "Documentación Organizada por Fases" incorporando la Fase 12 y Fase 13.
    5. VERIFICAR que la sintaxis Markdown sea válida y que todos los enlaces relativos apunten a rutas existentes.
```
