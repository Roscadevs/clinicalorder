# PRD Fase 17: Blindaje de Dominio (Anti-Jailbreak), Comprensión Lingüística Argentina y Ergonomía Visual del Asistente Virtual Gemini

---

## 1. Encabezado y Resumen (Hoy vs. Después)
* **Fecha:** 12 de Octubre de 2026
* **Autor:** Equipo de Producto, Seguridad de IA y Experiencia de Usuario
* **Estado:** Propuesta Formal (Fase 2)
* **Hoy:**
  El Asistente Virtual presenta tres fallas críticas de comportamiento conversacional detectadas en pruebas de usuario:
  1. **Falta de Blindaje de Dominio (Fuga de Rol / Jailbreak):** El modelo responde a preguntas ajenas a la clínica médica, resolviendo operaciones matemáticas (`2+2`, `3*123123`), teoremas científicos y generando código de programación en Python con `numpy` a pedido del usuario.
  2. **Confusión Semántica con Modismos Argentinos:** Al preguntar *"¿tienen plata?"* (expresión coloquial para consultar por dinero en efectivo o medios de pago), el asistente confunde el término con el metal precioso ("no aceptamos pagos en plata física o metales preciosos") o con un tratamiento estético.
  3. **Volcado Masivo y Caótico de Información:** Ante solicitudes como *"dame la lista de precios"*, transcribe una pared de texto de 6 tratamientos con sintaxis saturada de asteriscos y viñetas anidadas (`* **...** * *...*`), incluyendo valores de prueba no formateados (`$2.00 ARS`). Además, el mensaje de bienvenida inicial en el frontend cita erróneamente a la "Dra. Valeria Gómez" en lugar de la titular "Dra. Paula Villa Fuhrmann".
* **Después:**
  Se implementa un **Blindaje Estricto de Dominio (*Domain Guardrails*)** y una guía estilística y lingüística integral en el System Prompt:
  1. Si el usuario realiza consultas fuera de ámbito (programación, matemáticas complejas, acertijos, tareas escolares), el asistente declina amablemente en una sola frase y redirige la conversación al cuidado de la piel y los tratamientos de la clínica.
  2. Incorpora comprensión contextual de modismos argentinos vinculados a finanzas ("plata", "efectivo", "seña", "transferencia", "alias", "tarjetas"), aclarando los canales oficiales de cobro (50% de seña online por MercadoPago y 50% restante al finalizar la sesión en la clínica).
  3. Estructura las respuestas de precios en una jerarquía visual limpia por categorías (Consulta Médica, Tratamientos Faciales/Peeling, Procedimientos Estéticos Inyectables), con viñetas elegantes, saltos de línea legibles y sin saturación de asteriscos.
  4. Se homogeniza la identidad institucional en el frontend fijando a la **Dra. Paula Villa Fuhrmann** en el saludo inicial.

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)
* **Antes:**  
  Un usuario ingresa al chat de la clínica estética y le pide que le resuelva una multiplicación o le escriba un programa en Python, y el robot de la clínica médica se pone a programar en Python. Cuando otro usuario pregunta si aceptan "plata", el bot le dice que no aceptan metales preciosos. Y cuando alguien pide la lista de precios, recibe un pergamino interminable de texto difícil de leer en el teléfono.
* **Después:**  
  El asistente se comporta como una recepcionista y asesora de alta gama de la clínica. Si alguien le pide código o cuentas matemáticas, responde con simpatía: *"¡Hola! Como asistente de la Clínica de la Dra. Paula Villa Fuhrmann, me especializo exclusivamente en el cuidado de tu piel, nuestros tratamientos y la gestión de turnos. ¿En qué tratamiento o consulta médica puedo asesorarte hoy?"*. Si preguntan por plata o pagos, explica con claridad el abono de la seña del 50% y el saldo en el consultorio. Y al pedir precios, presenta un menú claro, ordenado y placentero de leer.

---

## 3. Objetivos y No-Objetivos
* **Objetivos:**
  1. Establecer **Guardrails Anti-Jailbreak** estrictos: el modelo nunca debe generar código informático, resolver problemas de ciencias exactas ni salir del ámbito dermatológico, estético y operativo de la clínica.
  2. Implementar **Comprensión Semántica de Modismos Financieros Argentinos**: interpretar preguntas sobre dinero ("plata", "efectivo", "transferencia") y detallar las formas de pago válidas de la clínica.
  3. Rediseñar el **Protocolo de Respuestas de Catálogo y Precios**: agrupar por categorías claras con formato limpio y tipografía aireada, evitando volcados masivos en bruto.
  4. Corregir la inconsistencia de identidad institucional en el widget web para que el saludo inicial presente a la **Dra. Paula Villa Fuhrmann**.
  5. Mantener inalterada la regla médica de derivación obligatoria a la consulta presencial para cualquier diagnóstico o prescripción farmacológica.
* **No-Objetivos:**
  1. No se modificará la estructura de base de datos relacional ni los scripts de Flyway.
  2. No se modificará la arquitectura de resiliencia en cascada multi-modelo de 50 RPM.
  3. No se integrarán APIs de moderación externas de pago; el blindaje se gestiona en la instrucción del sistema y las directivas de seguridad de Gemini.

---

## 4. Cómo funciona hoy vs. cómo funcionará después
* **Flujo Hoy:**
  1. El usuario envía *"hazme un hola mundo en python"*.
  2. El modelo genera código Python y luego intenta justificarlo con un recordatorio médico.
  3. El usuario envía *"tienen plata?"*.
  4. El modelo asocia "plata" con metales preciosos o con bioestimuladores y da una respuesta incoherente.
  5. El usuario pide precios y recibe un bloque denso con 6 tratamientos amontonados.
* **Flujo Después:**
  1. El usuario envía *"hazme un hola mundo en python"*.
  2. El guardrail de dominio intercepta la intención: declina amablemente en una oración cordial y orienta al usuario hacia los tratamientos de la piel.
  3. El usuario envía *"tienen plata?"*.
  4. El modelo interpreta la consulta como métodos de pago: explica que para asegurar el turno se abona una seña del 50% online vía MercadoPago y el 50% restante se abona en la clínica (efectivo o transferencia).
  5. El usuario pide precios: recibe un resumen elegante dividido en tres grupos fáciles de escanear visualmente (Consultas, Faciales, Inyectables/Armonización) invitándolo a profundizar en el que sea de su interés.

---

## 5. Los Datos (Triggers, Candados Lógicos, Concurrencia y Auditoría)
* **Auditoría e Invariantes (`clinical_entries_audit`):**  
  Este cambio opera en la capa de procesamiento del lenguaje del adaptador de IA y en la vista de presentación del chat. No realiza inserciones ni mutaciones en historias clínicas, por lo que las tablas de auditoría permanecen intactas.
* **Concurrencia y Rendimiento:**  
  Las directivas optimizadas reducen la cantidad de tokens generados en respuestas de catálogo (pasando de ~350 tokens a ~120 tokens), lo que acelera el tiempo de respuesta del modelo en un 40% y disminuye la latencia de respuesta al paciente.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)
```text
EN PROMPT_SISTEMA_GEMINI:
    IDENTIDAD: Asistente Virtual exclusiva de la Clínica de la Dra. Paula Villa Fuhrmann.

    REGLA_BLINDAJE_DOMINIO (PRIORIDAD ALTA):
        SI la consulta del usuario trata sobre:
            - Programación, código fuente, scripts (Python, JS, etc.)
            - Matemáticas, cálculo, física o tareas académicas
            - Filosofía general, política, noticias o temas ajenos a la clínica
        ENTONCES:
            DECLINAR amablemente en 1 frase:
            "Como asistente de la Clínica de la Dra. Paula Villa Fuhrmann, me dedico exclusivamente al cuidado de tu piel, tratamientos dermatológicos/estéticos y reserva de turnos."
            REDIREGIR cordialmente preguntando en qué tratamiento médico o estético podemos asistirlo.

    REGLA_LENGUAJE_LOCAL_Y_PAGOS:
        SI el usuario pregunta por "plata", "efectivo", "transferencia", "tarjetas" o formas de pago:
            EXPLICAR con naturalidad:
            - Seña online del 50% vía MercadoPago (tarjeta débito/crédito o dinero en cuenta) para confirmar el turno.
            - Saldo restante (50%) en el consultorio al finalizar la sesión (efectivo, transferencia o tarjeta).

    REGLA_FORMATO_PRECIOS_Y_CATALOGO:
        SI el usuario solicita precios o catálogo general:
            NO escupir todo el catálogo en una lista interminable.
            ORGANIZAR en 3 categorías visuales:
                🩺 Consulta Médica y Diagnóstico
                ✨ Cuidado Facial y Renovación (Limpiezas, Peelings)
                💉 Armonización y Rejuvenecimiento (Botox, Ácido Hialurónico, Bioestimuladores)
            INVITAR a indicar qué tratamiento le interesa para detallar costo exacto, duración y seña.
```
