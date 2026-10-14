# PRD Fase 15: Hotfix de Inyección de Dependencias en Constructor de GeminiApiClientAdapter para Despliegue en Render

---

## 1. Encabezado y Resumen (Hoy vs. Después)
* **Fecha:** 12 de Octubre de 2026
* **Autor:** Equipo de Arquitectura e Infraestructura
* **Estado:** Propuesta Formal (Fase 2)
* **Hoy:**
  Durante el arranque del contenedor backend en Render (`java -jar app.jar`), el ApplicationContext de Spring Boot colapsa de inmediato con una excepción crítica `BeanCreationException / NoSuchMethodException: com.clinicadermatologica.app.infrastructure.ai.GeminiApiClientAdapter.<init>()`. Esto ocurre porque la clase `@Component` `GeminiApiClientAdapter` posee dos constructores públicos (uno para inyección de configuración en producción y otro para pruebas unitarias desacopladas), pero carece de la anotación explícita de autoconexión en su constructor primario. Al encontrar múltiples constructores sin indicación expresa, el contenedor de Spring intenta localizar un constructor por defecto sin argumentos, el cual no existe, impidiendo abrir puertos HTTP y abortando el despliegue con código de salida 1.
* **Después:**
  Se clarifica y explicita ante el contenedor de Spring la estrategia de instanciación del bean mediante la anotación de inyección requerida en su constructor primario y se aseguran valores de tolerancia por defecto en los placeholders de configuración de variables de entorno. De este modo, Spring Boot instancia de forma determinista y predecible el bean `GeminiApiClientAdapter` al iniciar el servidor Tomcat, permitiendo que el despliegue en Render enlace correctamente los puertos HTTP y mantenga en servicio la resiliencia en cascada del asistente inteligente.

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)
* **Antes:**  
  Tras actualizar la resiliencia del chatbot, la clínica intenta desplegar la nueva versión en la nube. Sin embargo, al encender el servidor, el sistema no sabe cuál de las dos puertas de entrada debe utilizar para inicializar al asistente y se apaga de golpe antes de que los pacientes puedan siquiera cargar la página web. La clínica se queda sin servicio online.
* **Después:**  
  El sistema tiene claramente señalizada cuál es la puerta de entrada oficial que debe abrir en producción al encenderse el servidor. El servidor inicia suavemente, reconoce todos los servicios médicos y queda en línea listo para atender a los pacientes y recibir reservas sin interrupciones.

---

## 3. Objetivos y No-Objetivos
* **Objetivos:**
  1. Corregir de forma quirúrgica la ambigüedad en la instanciación del bean `geminiApiClientAdapter` en Spring Boot 3 para resolver el fallo de despliegue en Render.
  2. Garantizar que el constructor de producción tome precedencia indiscutible durante el ciclo de vida del contenedor de inversión de control (`IoC`).
  3. Proporcionar resiliencia y valores por defecto seguros en los placeholders de propiedades de configuración del asistente Gemini (`gemini.api.key`, `gemini.api.base-url`).
  4. Mantener intacto el constructor secundario utilizado en los tests unitarios para preservar la suite de verificación automatizada.
* **No-Objetivos:**
  1. No se modificará la lógica de negocio ni la cascada multi-modelo implementada en la Fase 14.
  2. No se alterarán esquemas de base de datos relacionales ni scripts de Flyway.
  3. No se modificarán contratos de controladores REST ni interfaces de usuario en el frontend.

---

## 4. Cómo funciona hoy vs. cómo funcionará después
* **Flujo Hoy:**
  1. Render ejecuta `java -jar app.jar`.
  2. Spring Boot inicia el escaneo de componentes y localiza `GeminiApiClientAdapter` anotado con `@Component`.
  3. Spring detecta dos constructores parametrizados y ninguno cuenta con indicación de inyección automática.
  4. Spring intenta invocar por reflexión un constructor sin argumentos (`<init>()`).
  5. Al no existir dicho constructor, se lanza `NoSuchMethodException` y el contenedor finaliza con error de salida 1.
* **Flujo Después:**
  1. Render ejecuta `java -jar app.jar`.
  2. Spring Boot localiza `GeminiApiClientAdapter`.
  3. Spring detecta la anotación de inyección en el constructor primario de producción.
  4. Spring inyecta las propiedades de configuración correspondientes (`apiKey`, `baseUrl`, `defaultModel`, `modelsConfig`), utilizando valores por defecto seguros si alguna variable no se encuentra provista.
  5. El bean queda inicializado satisfactoriamente, se inyecta en `GeminiChatbotService`, Tomcat abre el puerto de escucha y la aplicación entra en estado operativo.

---

## 5. Los Datos (Triggers, Candados Lógicos, Concurrencia y Auditoría)
* **Invariantes y Auditoría (`clinical_entries_audit`):**  
  Este ajuste es de naturaleza puramente infraestructural a nivel de arranque del contenedor web. No interactúa ni muta registros médicos, por lo que la tabla de auditoría inmutable de historias clínicas y las versiones de entidades JPA (`@Version`) no sufren ningún impacto de degradación ni riesgo de concurrencia.
* **Concurrencia del Bean:**  
  El bean `GeminiApiClientAdapter` mantiene su alcance como singleton seguro para hilos (`thread-safe`), operando de forma no bloqueante a través de clientes HTTP reactivos.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)
```text
CLASE AdaptadorClienteGemini:
    // Constructor oficial para el Contenedor de Inversión de Control (Spring)
    CONSTRUCTOR OFICIAL_SPRING (claveApiConValorPorDefecto, urlBaseConValorPorDefecto, modeloDefecto, configuracionModelos):
        ASIGNAR claveApi
        CONSTRUIR clienteWebHttp(urlBase)
        PROCESAR cadenaDeModelos(configuracionModelos, modeloDefecto)
    FIN CONSTRUCTOR

    // Constructor secundario para pruebas unitarias aisladas
    CONSTRUCTOR SECUNDARIO_PRUEBAS (clienteWeb, claveApi, listaModelos):
        ASIGNAR clienteWeb
        ASIGNAR claveApi
        ASIGNAR listaModelos
    FIN CONSTRUCTOR
FIN CLASE
```
