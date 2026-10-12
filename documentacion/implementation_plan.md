# Plan Técnico de Implementación - Fase 17: Blindaje de Dominio, Jerarquía Visual y Ergonomía del Chatbot Gemini

---

## 1. Base de Datos (Flyway, JPA, Índices e Invariantes)
* **Scripts Flyway:** Ninguno requerido. La persistencia relacional permanece inalterada.
* **Entidades JPA y Concurrencia:** Sin modificaciones; la anotación `@Version` se preserva intacta en todas las entidades del dominio (`DermatologicService`, `Appointment`, `ClinicalRecord`, etc.).
* **Auditoría Clínica (`clinical_entries_audit`):** No se realizan mutaciones clínicas en este módulo, preservando la inmutabilidad y consistencia de las tablas auditadas.

---

## 2. Backend (Spring Boot 3, Adaptador Gemini e Inyección de Prompt)
* **Archivos a Modificar:**
  - `backend/src/main/java/com/clinicadermatologica/app/infrastructure/ai/GeminiApiClientAdapter.java`
  - `backend/src/test/java/com/clinicadermatologica/app/infrastructure/GeminiApiClientAdapterTest.java`
* **Cambios Técnicos:**
  1. **Refactorización del System Instruction (`GeminiApiClientAdapter.java`):**
     - Extraer y robustecer la generación de la directiva del sistema mediante el método `buildSystemInstruction(String servicesCatalogContext)`.
     - **Regla 1: Blindaje Estricto de Dominio (Anti-Jailbreak / Guardrails):**
       - Prohibición explícita de generar código fuente (Python, JS, etc.), resolver ecuaciones matemáticas o acertijos, y debatir tópicos ajenos a la clínica.
       - Directiva de rechazo cortés en una sola frase con redirección inmediata a los servicios clínicos y estéticos de la Dra. Paula Villa Fuhrmann.
     - **Regla 2: Comprensión de Modismos y Formas de Pago Argentinas:**
       - Mapear consultas coloquiales sobre dinero ("plata", "efectivo", "transferencia", "alias", "tarjeta", "seña").
       - Explicar la política de pagos: seña del 50% online vía MercadoPago para confirmar el turno y 50% restante en el consultorio el día de la cita (efectivo, transferencia o tarjeta).
       - Desambiguar el término "plata" para evitar que el modelo lo confunda con metales preciosos o minerales.
     - **Regla 3: Jerarquía Visual y Ergonomía de Catálogo:**
       - Ante preguntas globales ("dame los precios", "qué tratamientos tienen"), presentar un resumen conciso estructurado en 3 grupos:
         1. 🩺 *Consultas Médicas y Diagnóstico*
         2. ✨ *Cuidado Facial y Renovación* (Limpiezas, Peelings)
         3. 💉 *Armonización y Rejuvenecimiento* (Botox, Ácido Hialurónico, Bioestimuladores)
       - Evitar volcados masivos en texto plano saturados de asteriscos y viñetas complejas (`* **...** * *...*`).
       - Detallar precios exactos, duración y seña únicamente cuando el paciente solicite o profundice sobre un tratamiento específico.
     - **Regla 4: Responsabilidad Médica y Derivación Presencial:**
       - Mantener el descargo de responsabilidad médico obligatorio aclarando que la información es orientativa y no sustituye la consulta presencial con la Dra. Paula Villa Fuhrmann.
  2. **Preservación de Resiliencia en Cascada:**
     - Mantener intacto el bucle de conmutación por fallos entre los 6 modelos configurados (`gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`, `gemini-3-flash-preview`, etc.).
     - Mantener el manejo de errores conforme al estándar de respuesta institucional.

---

## 3. Frontend (React 18 / TypeScript, Widget de Chat y Ergonomía)
* **Archivos a Modificar:**
  - `frontend/src/components/GeminiChatbotWidget.tsx`
* **Cambios Técnicos:**
  1. **Corrección de Identidad Institucional Inicial:**
     - Modificar el estado inicial de `messages` (id `'welcome'`) para reemplazar la referencia desactualizada a la "Dra. Valeria Gómez" por:
       `"¡Hola! 🌿 Soy la Asistente Virtual de la Clínica Dermatológica y Estética de la Dra. Paula Villa Fuhrmann. ¿En qué tratamiento o consulta médica puedo asesorarte hoy?"`.
     - Evita la contaminación del contexto histórico enviado al backend (`historyPayload`), previniendo que Gemini adopte un nombre inconsistente en turnos conversacionales posteriores.
  2. **Ergonomía de Renderizado:**
     - Asegurar que los saltos de línea de las respuestas estructuradas por viñetas se visualicen limpiamente con `whitespace-pre-line` o `whitespace-pre-wrap` dentro de las burbujas de mensaje del paciente y del asistente.

---

## 4. Pruebas Requeridas y Verificación
* **Backend:**
  - En `GeminiApiClientAdapterTest.java`:
    - Agregar prueba unitaria que valide que el `systemInstruction` generado contenga las directivas de blindaje de dominio (anti-código / anti-matemáticas), la política de modismos y señas ("MercadoPago", "50%"), y la identidad de la "Dra. Paula Villa Fuhrmann".
    - Verificar que todas las pruebas existentes de fallback y configuración continúen pasando al 100%.
  - Ejecución de suite completa: `JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test` (esperado: 0 errores).
* **Frontend:**
  - Verificación estática de tipos con `npx tsc --noEmit`.
  - Construcción de producción con `npm run build` en `frontend/` (esperado: 0 errores).
