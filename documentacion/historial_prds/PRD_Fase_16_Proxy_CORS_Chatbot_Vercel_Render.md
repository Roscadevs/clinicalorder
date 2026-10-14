# PRD Fase 16: Enrutamiento Inverso en Vercel y Política de CORS para Conectividad del Asistente Virtual entre Frontend y Backend en Producción

---

## 1. Encabezado y Resumen (Hoy vs. Después)
* **Fecha:** 12 de Octubre de 2026
* **Autor:** Equipo de Arquitectura y Plataforma
* **Estado:** Propuesta Formal (Fase 2)
* **Hoy:**
  El frontend de la clínica se encuentra desplegado en la plataforma Vercel bajo el dominio personalizado `clinicalorder.eliasdelcastillo.com`, mientras que el backend REST de Spring Boot 3 opera en Render bajo `clinicalorder.onrender.com`. Al interactuar con el Asistente Virtual de IA desde la web, la aplicación realiza peticiones relativas `/api/v1/chat/gemini` hacia el mismo dominio de Vercel. Debido a que el archivo de configuración de Vercel (`vercel.json`) carece de una regla de reescritura (*reverse proxy*) que dirija las rutas `/api/*` hacia el servidor backend en Render, Vercel intercepta las peticiones POST y las redirige hacia su archivo estático `index.html`, respondiendo con error `HTTP 405 Method Not Allowed`. Como consecuencia, el cliente web captura el fallo de red y activa el mensaje de contingencia estático ("En este momento estamos experimentando una breve intermitencia con el servidor"), a pesar de que el backend en Render y la API de Gemini se encuentran 100% operativos.
* **Después:**
  Se configura en Vercel una regla de proxy inverso transparente que reescribe de forma automática todas las solicitudes entrantes dirigidas a `/api/(.*)` hacia el backend oficial en Render (`https://clinicalorder.onrender.com/api/$1`). Simultáneamente, se amplía la configuración de seguridad del backend en Spring Security para autorizar explícitamente el origen de producción `https://clinicalorder.eliasdelcastillo.com` mediante patrones de CORS declarativos. Con esta doble capa de enlace, el chatbot en la web se comunica fluidamente con el modelo Gemini, ofreciendo respuestas instantáneas y personalizadas a los pacientes sin bloqueos ni errores 405.

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)
* **Antes:**  
  Un paciente ingresa al sitio web de la clínica (`clinicalorder.eliasdelcastillo.com`) y le escribe un "hola" al asistente inteligente en la esquina inferior. La pantalla del navegador intenta pedir la respuesta al servidor web estático en lugar de llamar al cerebro central de la clínica. El servidor estático no entiende peticiones de conversación y rechaza el mensaje. El paciente ve un mensaje que dice que el sistema tiene una intermitencia y cree que la inteligencia artificial está caída.
* **Después:**  
  El paciente escribe "hola". La puerta de entrada web reconoce de inmediato que se trata de una consulta médica y la reenvía automáticamente al cerebro central de la clínica en Render. En menos de dos segundos, el asistente le da la bienvenida cálida en nombre de la Dra. Paula Villa Fuhrmann, le ofrece información sobre los tratamientos disponibles y lo invita a agendar su turno.

---

## 3. Objetivos y No-Objetivos
* **Objetivos:**
  1. Habilitar la redirección inversa (*reverse proxy*) en Vercel (`vercel.json`) para que cualquier petición enviada a `/api/*` en el dominio del frontend llegue de manera transparente al backend en Render.
  2. Ajustar la directiva de orígenes permitidos en la política de CORS de Spring Boot (`SecurityConfig` / `application.yml`) para aceptar peticiones provenientes del dominio oficial `https://clinicalorder.eliasdelcastillo.com` y entornos de vista previa.
  3. Asegurar que la URL base por defecto del cliente HTTP en el frontend apunte de manera infalible al servicio de producción si no se detecta la variable en tiempo de construcción.
  4. Eliminar el error `HTTP 405 Method Not Allowed` y permitir que las respuestas en vivo de Google Gemini se muestren en el widget web.
* **No-Objetivos:**
  1. No se modificará la estructura de la base de datos relacional (PostgreSQL en Supabase) ni los scripts de migración de Flyway.
  2. No se alterará la lógica interna de resiliencia en cascada ni los prompts médicos implementados en la Fase 14 y corregidos en la Fase 15.
  3. No se expondrán datos privados de pacientes ni se comprometerán los encabezados de autenticación JWT.

---

## 4. Cómo funciona hoy vs. cómo funcionará después
* **Flujo Hoy:**
  1. El paciente escribe "hola" en el chat web de `clinicalorder.eliasdelcastillo.com`.
  2. El frontend ejecuta una llamada POST a `/api/v1/chat/gemini`.
  3. Vercel recibe la petición, busca en sus rutas y no encuentra una función backend. Su regla comodín reescribe la ruta hacia `index.html`.
  4. Vercel rechaza el método POST sobre un archivo estático y responde `HTTP 405 Method Not Allowed`.
  5. El cliente web captura el error 405 y muestra el mensaje de intermitencia de respaldo.
* **Flujo Después:**
  1. El paciente escribe "hola" en el chat web de `clinicalorder.eliasdelcastillo.com`.
  2. El cliente envía la solicitud POST.
  3. La regla de proxy de Vercel intercepta la ruta `/api/*` y la reenvía con todos sus encabezados y cuerpo a `https://clinicalorder.onrender.com/api/v1/chat/gemini`.
  4. El backend en Render recibe la solicitud, valida la política de CORS y la despacha al controlador del chatbot.
  5. Gemini procesa la consulta y responde con código HTTP 200 y el texto generado.
  6. El paciente visualiza la respuesta de la asistente virtual de la clínica en tiempo real.

---

## 5. Los Datos (Triggers, Candados Lógicos, Concurrencia y Auditoría)
* **Auditoría e Invariantes (`clinical_entries_audit`):**  
  La consulta al asistente virtual es una operación de consulta de catálogo y generación de texto puramente reactiva. No interactúa con las tablas de historia clínica ni registros médicos, por lo que las invariantes de auditoría inmutable no corren ningún riesgo de alteración.
* **Seguridad Perimetral y CORS:**  
  El intercambio de cabeceras de origen cruzado se restringe a métodos estándar (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`) y se mantienen activos los filtros estrictos de cortafuegos HTTP (`StrictHttpFirewall`).

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)
```text
EN ENRUTADOR VERCEL (vercel.json):
    REGLA 1:
        SI la ruta de la solicitud inicia con "/api/" ENTONCES:
            REENVIAR transparente hacia "https://clinicalorder.onrender.com/api/{resto_de_la_ruta}"
    REGLA 2:
        SI la ruta es cualquier otra página web ENTONCES:
            SERVIR archivo estático "/index.html"

EN POLITICA SEGURIDAD BACKEND (ConfiguracionCORS):
    DEFINIR listaOrígenesPermitidos:
        INCLUIR "http://localhost:*"
        INCLUIR "https://clinicalorder.eliasdelcastillo.com"
        INCLUIR "https://clinicalorder.onrender.com"
        INCLUIR patrones de previsualización "*.vercel.app"
    HABILITAR credenciales y métodos estándar
```
