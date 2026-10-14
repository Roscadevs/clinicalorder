# PRD FASE 24: Formulario de Gestión, Alta y Edición de Tratamientos del Catálogo (Tarifas y Servicios)

---

## 1. Encabezado y Resumen (Hoy vs. Después)

| Dimensión | Hoy | Después |
| :--- | :--- | :--- |
| **Validación de Unicidad en Edición** | Al editar un servicio existente y cambiar el nombre por el de otro tratamiento ya registrado, la aplicación no valida unicidad previa y dispara un error 500 no controlado por violación de constraint SQL. | `DermatologicServiceService` valida unicidad excluyente (`existsByNameAndIdNot`), emitiendo una excepción de regla de negocio clara bajo RFC 7807 ("Ya existe otro servicio con el nombre..."). |
| **Manejo de Errores en Frontend** | `ServiceFormModal.tsx` captura cualquier fallo con un bloque genérico ignorando la respuesta del servidor ("No se pudo guardar el servicio. Intentá nuevamente."). | Muestra el detalle específico del servidor (`ProblemDetail.detail` / `error.message`) en el componente `Callout`, permitiendo al usuario corregir exactamente el campo conflictivo. |
| **Ergonomía Táctil y Accesibilidad Móvil** | Varios controles interactivos del modal tienen alturas inferiores a 44px, dificultando su uso táctil en teléfonos y tablets. | Todos los campos de entrada, botones de acción y botones de sugerencia rápida cumplen con el estándar de touch target $\ge 44$ px. |
| **Sugerencias y Plantillas de Tratamientos** | El formulario no ofrece sugerencias de categorías ni plantillas típicas de tratamientos dermatológicos/estéticos. | Incorpora atajos rápidos para protocolos comunes (ej. *Consulta Dermatológica*, *Peeling Químico Facial*, *Toxina Botulínica*, *Relleno Ácido Hialurónico*, *Limpieza Profunda e Hidratación*), autocompletando duración, seña y seguimiento sugerido. |
| **Seguridad en Activación / Desactivación** | En `AdminServicesView.tsx`, pulsar en el botón de estado conmuta inmediatamente el tratamiento sin diálogo de confirmación, con riesgo de deshabilitar reservas públicas por un clic accidental. | Incorpora un diálogo modal de confirmación con advertencia de impacto antes de suspender o reactivar un servicio del catálogo público. |

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)

### Antes:
Cuando el administrador necesitaba actualizar los precios de la clínica o dar de alta un nuevo tratamiento estético, el formulario resultaba rudimentario. Si por error tipográfico escribía un nombre que ya pertenecía a otro servicio, la pantalla mostraba un mensaje genérico de error ("No se pudo guardar...") sin explicar la causa ni orientar la corrección. Además, en la pantalla principal del catálogo, un toque accidental sobre el botón de activar/desactivar suspendía inmediatamente el tratamiento, impidiendo que los pacientes pudieran reservarlo desde la web o el chatbot sin que nadie advirtiera el problema.

### Después:
El administrador abre el catálogo y cuenta con una experiencia clara y guiada. Al crear o modificar un tratamiento, el formulario calcula de forma interactiva la seña requerida y el saldo que el paciente pagará en mostrador. Si está creando un servicio frecuente, puede seleccionar una plantilla sugerida que preconfigura la duración estimada, el porcentaje de seña habitual y el tiempo de control médico recomendado. Si intenta repetir un nombre ya asignado, el sistema le indica con total precisión el motivo del rechazo. Asimismo, para suspender o reactivar un tratamiento, el sistema solicita confirmación expresa alertando del impacto en las reservas públicas, evitando errores operacionales.

---

## 3. Objetivos y No-Objetivos

### Objetivos:
1. **Validación Defensiva de Unicidad Cruzada:** Garantizar en backend y frontend que un servicio no pueda duplicar el nombre de otro existente durante el alta o la edición, arrojando mensajes explicativos bajo RFC 7807.
2. **Resiliencia y Captura de Errores RFC 7807:** Extraer y mostrar mensajes amigables del backend en `ServiceFormModal.tsx` sin mensajes genéricos opacos.
3. **Ergonomía Táctil y Accesibilidad:** Ajustar inputs, selectores y botones a una zona táctil mínima de 44px (`min-h-[44px]`).
4. **Plantillas y Sugerencias Rápidas:** Proveer selectores rápidos para tratamientos usuales de dermatología clínica y estética médica.
5. **Confirmación Segura de Cambio de Estado:** Incorporar modal de confirmación en `AdminServicesView.tsx` antes de activar o desactivar un servicio.

### No-Objetivos:
- No se alterarán los precios de citas ya confirmadas o pagadas previamente (los cambios aplican únicamente a reservas futuras).
- No se modificará la auditoría médica de `clinical_entries_audit`.

---

## 4. Cómo funciona hoy vs. después

### Flujo de Alta y Edición de Tratamiento:
- **Hoy:** 
  - El administrador completa nombre, descripción, precio, seña, duración y seguimiento.
  - Al guardar con nombre duplicado en edición, se produce un error 500 no capturado adecuadamente.
  - El modal muestra "No se pudo guardar el servicio. Intentá nuevamente."
- **Después:**
  - El administrador hace clic en "Agregar tratamiento" o "Editar".
  - Dispone de atajos rápidos con parámetros médicos sugeridos.
  - El formulario valida campos numéricos en tiempo real y calcula seña y saldo a cobrar.
  - Si el nombre colisiona con otro servicio, el servidor responde con 400 Bad Request y detalle legible; el modal muestra el `Callout` de advertencia.
  - Al guardar con éxito, la lista se actualiza reactivamente y muestra notificación de éxito.

### Flujo de Activación / Desactivación de Tratamiento:
- **Hoy:** 
  - El botón ejecuta la mutación inmediatamente sin advertencia.
- **Después:**
  - Al pulsar en suspender/reactivar, se despliega un diálogo de confirmación:
    - Para suspensión: *"¿Deseas suspender este tratamiento? Los pacientes ya no podrán reservarlo en la web ni mediante el chatbot."*
    - Para reactivación: *"¿Deseas reactivar este tratamiento en el catálogo público?"*
  - Al confirmar, se aplica la modificación y se actualiza el estado visual con badge correspondiente.

---

## 5. Los Datos (Triggers, candados lógicos, concurrencia)

1. **Tabla `servicio` en PostgreSQL:**
   - Columnas: `id`, `name` (UNIQUE), `description`, `duration_minutes` (CHECK 10-480), `base_price` (CHECK > 0), `deposit_percentage` (CHECK 1-100), `follow_up_interval_days` (CHECK >= 0), `active`, `created_at`, `updated_at`.
2. **Candado de Unicidad Excluyente:**
   - En `DermatologicServiceRepository`: `existsByNameAndIdNot(String name, Long id)`.
   - Si `serviceRepository.existsByNameAndIdNot(request.getName(), id)` devuelve `true`, se lanza `BusinessRuleException` con código 400.
3. **Invariabilidad Histórica de Citas:**
   - Cada cita almacena su propio `agreed_price` snapshot al momento de la reserva; modificar el `base_price` de un servicio nunca altera transacciones o citas pasadas.
4. **Invariantes del Sistema:**
   - La tabla `clinical_entries_audit` no interviene ni se modifica en la administración del catálogo de servicios.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)

```text
MODULO: GestionCatalogoServicios

// BACKEND: Capa de Servicio
METODO actualizarServicio(id, peticion):
    servicio = buscarPorId(id) o lanzar NoEncontrado
    
    Si peticion.nombre != servicio.nombre Y repositorio.existePorNombreYIdDistinto(peticion.nombre, id):
        lanzar ReglaDeNegocioExcepcion("Ya existe otro tratamiento registrado con el nombre: " + peticion.nombre)
    FinSi

    servicio.nombre = peticion.nombre
    servicio.descripcion = peticion.descripcion
    servicio.duracionMinutos = peticion.duracionMinutos
    servicio.precioBase = peticion.precioBase
    servicio.porcentajeSena = peticion.porcentajeSena
    servicio.diasSeguimiento = peticion.diasSeguimiento
    Si peticion.activo != nulo:
        servicio.activo = peticion.activo
    FinSi

    Retornar mapearADTO(repositorio.guardar(servicio))
FIN METODO

// FRONTEND: Formulario Modal ServiceFormModal
COMPONENTE ServiceFormModal(abierto, alCerrar, servicioAEditar, alGuardar):
    Estado nombre, descripcion, precioBase, porcentajeSena, duracionMinutos, diasSeguimiento
    Estado guardando = FALSO
    Estado error = nulo

    AL SELECCIONAR PLANTILLA_RAPIDA(plantilla):
        nombre = plantilla.nombre
        descripcion = plantilla.descripcion
        duracionMinutos = plantilla.duracionMinutos
        porcentajeSena = plantilla.porcentajeSena
        diasSeguimiento = plantilla.diasSeguimiento
    FIN

    AL ENVIAR():
        Validar campos obligatorios y rangos numericos
        guardando = VERDADERO
        error = nulo
        Intentar:
            Si editando:
                Llamar a servicesApi.updateService(servicioAEditar.id, payload)
            Sino:
                Llamar a servicesApi.createService(payload)
            FinSi
            Notificar exito
            alGuardar()
            alCerrar()
        Capturar errorServidor:
            error = extraerMensajeRFC7807(errorServidor) o "No se pudo guardar el servicio"
        Finalmente:
            guardando = FALSO
        FinIntentar
    FIN AL ENVIAR
```
