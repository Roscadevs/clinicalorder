# PRD Fase 14: Arquitectura de Resiliencia en Cascada Multi-Modelo para Asistente Virtual Gemini (50 RPM)

---

## 1. Encabezado y Resumen (Hoy vs. Después)
* **Fecha:** 12 de Octubre de 2026
* **Autor:** Equipo de Ingeniería y Arquitectura
* **Estado:** Propuesta Formal (Fase 2)
* **Hoy:** 
  El backend de la clínica dermatológica depende de un único modelo de Google Gemini (`gemini-3.5-flash-lite`) configurado de forma estática en `GeminiApiClientAdapter`. Cuando este modelo alcanza su cuota por minuto (15 RPM), su límite diario (RPD) o experimenta picos de demanda del proveedor (HTTP 429 / HTTP 503), el sistema colapsa de inmediato hacia un mensaje estático de error o contingencia. Además, el endpoint frontend suprime silenciosamente los errores en un bloque de captura global.
* **Después:**
  Se implementa un mecanismo de **Resiliencia en Cascada (*Model Failover Pipeline*)** que encadena dinámicamente 6 modelos activos verificados (`gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`, `gemini-3-flash-preview`, `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`). Si un modelo agota su tasa o satura, el backend conmuta de manera transparente y en milisegundos al siguiente modelo en la misma llamada, alcanzando un techo acumulado de 50 peticiones por minuto (RPM) 100% gratuitas, garantizando disponibilidad continua del asistente para los pacientes.

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)
* **Antes:**  
  Un paciente ingresa al sitio web un domingo por la tarde para consultar sobre el tratamiento de manchas y precios. Si otros 15 pacientes enviaron consultas en ese mismo minuto, el asistente virtual deja de funcionar abruptamente y le muestra un cartel genérico diciendo que el servicio experimenta intermitencias. El paciente no obtiene la información y abandona la página sin reservar su turno.
* **Después:**  
  El paciente consulta sobre el tratamiento. Si la primera inteligencia artificial está ocupada o agotó su límite del minuto, el sistema le pasa el mensaje instantáneamente a una segunda inteligencia artificial de respaldo, y si es necesario a una tercera. El paciente nunca nota la transición: recibe su respuesta cálida y personalizada en menos de dos segundos con los tratamientos y precios actualizados de la clínica.

---

## 3. Objetivos y No-Objetivos
* **Objetivos:**
  1. Multiplicar la capacidad gratuita del chatbot de 15 RPM a **50 RPM** encadenando 6 modelos activos compatibles con la API REST.
  2. Implementar tolerancia a fallos automática para errores de saturación (`HTTP 429 Too Many Requests`) y sobrecarga del proveedor (`HTTP 503 Service Unavailable`).
  3. Configurar la lista de modelos de forma flexible y desacoplada mediante variables de entorno en el backend (`GEMINI_MODELS_CASCADE`).
  4. Mantener la latencia de respuesta al paciente por debajo de 2 segundos incluso en caso de failover.
  5. Preservar la inyección del catálogo activo de tratamientos y las reglas de seguridad clínica (no emitir diagnósticos médicos definitivos).
* **No-Objetivos:**
  1. No se implementará streaming por WebSockets para modelos de voz/audio ("API en vivo"), ya que la interfaz web del paciente opera mediante chat de texto sobre HTTP REST.
  2. No se modificarán las entidades de historias clínicas ni se alterará el esquema de base de datos relacional (PostgreSQL).
  3. No se integrará facturación de pago por uso en Google Cloud; la arquitectura se mantiene 100% sobre la capa gratuita (*Free Tier*).

---

## 4. Cómo funciona hoy vs. cómo funcionará después
* **Flujo Hoy:**
  1. El controlador recibe la pregunta del paciente.
  2. El servicio inyecta el catálogo activo de servicios (`DermatologicServiceRepository.findAllActive`).
  3. El adaptador invoca a `POST /models/{modelo_fijo}:generateContent`.
  4. Si la llamada falla (429, 503, etc.), captura la excepción y retorna un mensaje de contingencia fijo.
* **Flujo Después:**
  1. El controlador recibe la pregunta del paciente y su historial de conversación previo.
  2. El servicio prepara el contexto clínico con el catálogo actualizado.
  3. El adaptador toma la lista ordenada de modelos:
     `[gemini-3.5-flash-lite, gemini-3.1-flash-lite, gemini-3-flash-preview, gemini-3.8-flash, gemini-3.7-flash, gemini-3.6-flash]`.
  4. Intenta con el primer modelo. Si responde HTTP 200, retorna el resultado.
  5. Si el modelo devuelve HTTP 429 (límite superado) o 503 (saturación transitoria), registra una advertencia en el log con el modelo fallido y prueba inmediatamente con el siguiente en la lista.
  6. Únicamente si los 6 modelos fallan en cadena, devuelve la respuesta de contingencia institucional con sugerencias de reserva.

---

## 5. Los Datos (Triggers, Candados Lógicos, Concurrencia y Auditoría)
* **Aislamiento Clínico e Invariantes:**  
  La consulta del chatbot es una operación de **solo lectura** sobre el catálogo activo (`@Transactional(readOnly = true)`). No realiza mutaciones en base de datos.
* **Auditoría de Entradas Clínicas (`clinical_entries_audit`):**  
  Se garantiza que el asistente virtual **no tiene permisos ni capacidad** de crear, modificar o eliminar registros en el historial médico de pacientes. Las invariantes de auditoría permanecen intactas ya que ninguna entrada clínica es afectada por este pipeline.
* **Concurrencia:**  
  La selección de modelos en cascada se realiza a nivel de hilo de solicitud (*per-request stateless failover*), evitando contención o bloqueos sincronizados entre usuarios concurrentes.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)
```text
PROCESO GenerarRespuestaChatbotConCascada(solicitud, catalogoClinico):
    DEFINIR listaModelos = OBTENER_CONFIGURACION("gemini.models.cascade")
    // Por defecto: gemini-3.5-flash-lite, gemini-3.1-flash-lite, gemini-3-flash-preview, gemini-3.8-flash, gemini-3.7-flash, gemini-3.6-flash

    CONSTRUIR promptSistemaConReglasYCatalogo(catalogoClinico)
    CONSTRUIR cuerpoPeticion(solicitud.mensaje, solicitud.historial, promptSistema)

    PARA CADA modelo EN listaModelos:
        INTENTAR:
            respuesta = ENVIAR_PETICION_HTTP_POST(urlBase + modelo + ":generateContent", cuerpoPeticion)
            SI respuesta.codigoEstado == 200 ENTONCES:
                texto = EXTRAER_TEXTO(respuesta.cuerpo)
                RETORNAR DTO_EXITO(texto, serviciosSugeridos, urlReserva)
            SINO SI respuesta.codigoEstado ES 429 O 503 ENTONCES:
                REGISTRAR_LOG_ADVERTENCIA("Modelo agotado o saturado: " + modelo + ". Conmutando al siguiente.")
                CONTINUAR SIGUIENTE_MODELO
            SINO:
                REGISTRAR_LOG_ERROR("Error no recuperable con modelo: " + modelo)
                CONTINUAR SIGUIENTE_MODELO
        CAPTURAR EXCEPCION_RED (timeout, errorHTTP):
            REGISTRAR_LOG_ADVERTENCIA("Fallo al contactar modelo " + modelo + ": " + mensajeExcepcion)
            CONTINUAR SIGUIENTE_MODELO

    // Si todos los modelos de la cadena agotaron su cuota:
    REGISTRAR_LOG_ERROR("Todos los modelos de la cadena agotaron su cuota o fallaron.")
    RETORNAR DTO_CONTINGENCIA("Intermitencia temporal. Te sugerimos explorar la sección de Servicios o contactar a la clínica.")
FIN PROCESO
```
