# PRD FASE 26: Persistencia Real de Pacientes en Supabase, Desbloqueo del Directorio y Resiliencia ante Cold Starts

**Autor:** Equipo de Producto, UX y Arquitectura  
**Fecha:** 13 de Octubre de 2026  
**Estado:** PROPUESTO / EN REVISIÓN (Fase 2)  
**Metodología:** *How I Spec* (Rivera)  

---

## 1. Encabezado y Resumen (Hoy vs. Después)

| Dimensión | Hoy (Antes de Fase 26) | Después (Con Fase 26) |
|---|---|---|
| **Almacenamiento de Pacientes** | Si el servidor en Render está suspendido o la llamada tarda más de 8 segundos, el sistema finge éxito y guarda el paciente en el `localStorage` del navegador del usuario. El registro jamás llega a la base de datos de producción (Supabase). | Todo registro de paciente se envía de manera real y obligatoria a la API del backend (`/api/v1/pacientes`). Queda terminantemente prohibido fingir éxito local si el servidor no confirmó la persistencia con código 201 Created. |
| **Inicio de Sesión y Cold Starts** | Cuando Render tarda más de 8 segundos en responder (cold start), la pantalla de login entra silenciosamente en un "Modo Demo" ficticio (`demo-token-12345`), atrapando al operador en un entorno simulado sin avisarle. | La pantalla de login soporta tiempos de espera realistas para servidores en la nube en modo hibernación (hasta 60 segundos), muestra un estado visual informativo de *"Conectando con el servidor en la nube..."* y, ante un error real, notifica con claridad el rechazo sin asignar credenciales falsas. |
| **Acceso al Directorio de Pacientes** | El componente de listado y alta de pacientes (`PatientDirectoryView`) es código muerto inaccesible para cualquier usuario debido a restricciones y rutas cruzadas contradictorias. | Se habilita una ruta oficial y visible en la barra de navegación (`/app/patients`), permitiendo que el personal de recepción, administración y médicas consulten el padrón, busquen por DNI/nombre y den de alta pacientes con un clic. |
| **Alta Médica Rápida** | La médica no puede crear un nuevo paciente desde su espacio de atención clínica porque el botón de creación rápida está deshabilitado. | Si la médica busca un paciente y no lo encuentra en el padrón, el buscador le ofrece de inmediato la opción de "Dar de alta nuevo paciente", abriendo el formulario modal y permitiéndole continuar su consulta sin fricción. |
| **Manejo de Errores de Red** | El formulario de pacientes traga los fallos de conexión y dispara un mensaje verde de *"Paciente registrado exitosamente"* aunque la base de datos no haya recibido nada. | El formulario reporta fielmente cualquier problema de red o error de validación retornado por el servidor en formato estándar RFC 7807, impidiendo falsas sensaciones de guardado. |

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)

### Antes:
Sofía, la secretaria de la clínica, llega a su puesto de trabajo por la mañana. Abre la aplicación web e ingresa su usuario y contraseña. Como la clínica estuvo cerrada durante la noche, el servidor en la nube se encontraba en reposo para ahorrar recursos. La conexión demora 15 segundos en despertar al servidor. La aplicación, impaciente por un límite de 8 segundos, se rinde en silencio y le da acceso a Sofía con una sesión simulada sin advertirle.

Más tarde, llega una paciente nueva por ventanilla. Sofía carga su nombre, DNI, teléfono y fecha de nacimiento con cuidado y hace clic en "Registrar Paciente". La pantalla le muestra un cartel verde diciendo: *"Paciente registrado exitosamente"*. Sofía se queda tranquila. Sin embargo, ese paciente solo existe en la memoria temporal de su computadora; la base de datos central nunca se enteró. Cuando la médica entra a su consultorio e intenta buscar la ficha de esa paciente, no encuentra nada. El sistema muestra siempre a los mismos 3 pacientes que venían de ejemplo cuando se instaló el programa.

### Después:
Sofía abre la aplicación e introduce sus credenciales. La pantalla le informa con amabilidad: *"El servidor se está iniciando, por favor aguarde un momento..."*. A los 25 segundos, el servidor responde y Sofía ingresa con su sesión auténtica y segura. En el menú superior encuentra con claridad una nueva pestaña llamada **"Pacientes"**.

Cuando llega la paciente por ventanilla, Sofía ingresa a la sección de Pacientes, pulsa **"Nuevo Paciente"** y completa el formulario. La aplicación envía la información a la base de datos central. Si la red llega a fallar, el sistema le dice honestamente: *"No se pudo conectar con el servidor, reintente en unos instantes"*, evitando cualquier engaño. Cuando la base de datos confirma el registro, se guarda definitivamente en la nube. En ese instante exacto, la doctora en su consultorio ya puede ver a la nueva paciente en su lista, lista para ser atendida.

---

## 3. Objetivos y No-Objetivos

### Objetivos:
1. **Garantizar la persistencia obligatoria en Supabase:** Toda alta de paciente ejecutada desde la aplicación web debe traducirse en un registro persistente en la tabla de base de datos de producción (`public.paciente`).
2. **Eliminar el enmascaramiento silencioso de fallas:** Suprimir cualquier mecanismo que guarde pacientes en almacenamiento local del navegador simulando un guardado exitoso ante problemas de conexión.
3. **Resiliencia ante arranque en frío (Cold Start):** Ajustar la tolerancia temporal del inicio de sesión y la experiencia de usuario para esperar el encendido de los servidores en la nube sin degradar a modo demo ficticio.
4. **Habilitar el Directorio de Pacientes:** Proveer una ruta y elemento de navegación accesible para los roles operativos (Recepcionista, Administrador y Médica) para explorar, buscar y dar de alta pacientes.
5. **Habilitar alta médica contextual:** Permitir que las médicas den de alta pacientes no empadronados directamente desde su flujo de atención diaria.

### No-Objetivos:
1. **No modificar la estructura de tablas de la base de datos:** La tabla `paciente` y sus columnas actuales son correctas y no requieren cambios ni migraciones adicionales de Flyway.
2. **No alterar el mecanismo de auditoría clínica:** Las tablas inmutables de auditoría legal (`clinical_entries_audit` / `entrada_hc_audit`) y las historias clínicas no deben verse afectadas.
3. **No abrir el alta de pacientes al público general no autenticado:** El registro de pacientes sigue siendo una operación de staff protegido por autenticación y roles de seguridad; las consultas del público continuarán coordinándose por los canales de recepción y contacto establecidos.

---

## 4. Cómo funciona hoy vs. después

### Flujo de Inicio de Sesión:
* **Hoy:** Si la llamada al backend supera los 8 segundos, el sistema asume que el backend no existe, guarda un token falso en el navegador y le otorga acceso al usuario en un modo completamente desconectado.
* **Después:** La llamada al backend tiene un límite de tiempo adecuado para la nube (60 segundos) y muestra una animación de espera explicativa. Si el servidor devuelve error o no responde tras el tiempo extendido, se muestra el error real y no se permite ingresar con tokens simulados.

### Flujo de Creación de Pacientes:
* **Hoy:** La función de creación evalúa si el token es simulado; si lo es, agrega el paciente a una lista en el navegador y nunca llama a la red. Si el token es real pero hay una falla de conexión, atrapa el error y hace lo mismo, mostrando un mensaje verde de éxito.
* **Después:** La función de creación siempre realiza una petición HTTP al endpoint del servidor. Si el servidor responde exitosamente (código 201), se actualizan las vistas y se confirma el alta. Si el servidor falla, el error se propaga y la pantalla le muestra al operador el detalle exacto de lo ocurrido, sin fingir éxito.

### Flujo de Navegación del Directorio:
* **Hoy:** La pantalla de Directorio de Pacientes está aislada dentro de una ruta médica que bloquea a secretarias y administradores, y que dentro de sí misma contiene una regla que impide que las médicas la vean. Nadie puede acceder a ella.
* **Después:** Se crea la sección `/app/patients` en la barra de navegación, disponible para todos los roles de la clínica. Permite buscar pacientes en tiempo real contra la base de datos y abrir el formulario modal para registrar altas quirúrgicas o administrativas.

---

## 5. Los Datos (Triggers, candados lógicos, concurrencia)

1. **Candado de Unicidad de DNI y Correo Electrónico:**
   - La base de datos mantiene restricciones únicas sobre el DNI y el correo electrónico del paciente. Si un operador intenta cargar un DNI ya existente, el backend rechaza la operación y el frontend debe desplegar el mensaje de conflicto sin cerrar el formulario.
2. **Invariante de Identificador de Base de Datos:**
   - Ningún paciente puede ser utilizado en turnos o historias clínicas si su identificador numérico no fue expedido por la secuencia de la base de datos de producción. Se prohíbe la asignación de identificadores temporales aleatorios en el cliente.
3. **Control de Concurrencia Optimista:**
   - Los registros de turnos vinculados a pacientes deben seguir respetando el control de concurrencia optimista existente mediante el candado de versión (`@Version`), asegurando que dos operadores no asignen el mismo turno al mismo tiempo.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)

```text
CUANDO el usuario intenta iniciar sesión:
    MOSTRAR indicador de carga con mensaje de conexión al servidor en la nube
    INTENTAR autenticar credenciales contra el servidor (con tolerancia de hasta 60 segundos)
    SI el servidor responde con éxito:
        ALMACENAR el token real recibido
        REDIRECCIONAR a la agenda de turnos
    SINO:
        MOSTRAR el mensaje de error correspondiente al usuario
        NO generar tokens simulados bajo ninguna circunstancia
        PERMANECER en la pantalla de inicio de sesión

CUANDO un operador o médica completa el formulario de nuevo paciente:
    CAMBIAR el estado del botón a "Registrando..."
    ENVIAR los datos sanitizados al servidor mediante la ruta de pacientes
    SI el servidor responde con creación exitosa:
        LIMPIAR la memoria caché de búsqueda
        MOSTRAR notificación verde de "Paciente registrado exitosamente"
        CERRAR el formulario y actualizar la lista de pacientes
    SINO (falla de conexión, DNI duplicado o validación):
        CAPTURA el error del servidor
        MOSTRAR el mensaje de alerta en el formulario
        NO guardar el paciente en la memoria local del navegador
        MANTENER los datos en los campos para que el operador no pierda lo escrito

CUANDO el usuario navega por la aplicación:
    SI el usuario tiene rol de Recepcionista, Médica o Administrador:
        MOSTRAR la pestaña "Pacientes" en el menú de navegación
        AL hacer clic, ABRIR el Directorio de Pacientes con buscador y botón de alta
```
