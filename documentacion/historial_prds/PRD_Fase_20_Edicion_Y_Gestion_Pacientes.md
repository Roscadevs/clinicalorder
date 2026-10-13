# PRD FASE 20: Edición y Gestión Integral de Pacientes (Frontend React 18 + Backend Spring Boot 3)

---

## 1. Encabezado y Resumen (Hoy vs. Después)

| Dimensión | Hoy | Después |
| :--- | :--- | :--- |
| **Formulario de Pacientes** | `PacienteForm.tsx` solo permite el alta de nuevos pacientes (modo inserción unidireccional). | `PacienteForm.tsx` opera en modo dual: **Alta** (campos en blanco, DNI editable) y **Edición** (precarga reactiva, DNI bloqueado como identificador inmutable, validaciones Zod completas). |
| **Directorio de Pacientes** | `PatientDirectoryView.tsx` solo muestra datos de contacto en modo solo lectura y el historial de turnos. | Dispone de botones de acción directos: **"Editar Datos"** (abre modal con `PacienteForm` en modo edición) y **"Dar de Baja"** (modal de confirmación de baja lógica segura). |
| **Módulo Médico (Consulta)** | `MedicalRecordView.tsx` visualiza el nombre, DNI y teléfono en la cabecera sin posibilidad de actualizar cambios informados por el paciente en consulta. | Incorpora botón para editar rápidamente los datos de filiación del paciente sin salir de la historia clínica. |
| **Servicio API Frontend** | `patientsApi` en `api.ts` solo implementa `getPatients` y `createPatient`. | Incorpora `updatePatient(id, data)` y `deactivatePatient(id)` con soporte completo para fallback en modo demo. |
| **Validación Backend en Edición** | `PatientService.updatePatient` actualiza campos sin verificar si el nuevo email o teléfono pertenecen a otro paciente registrado. | `PatientService.updatePatient` valida colisiones de unicidad excluyendo al propio paciente que se actualiza, evitando errores 500 no controlados. |

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)

### Antes:
Cuando un paciente cambiaba su número de teléfono, actualizaba su correo electrónico o se detectaba un error tipográfico en su fecha de nacimiento o apellido, ni la secretaria en recepción ni la médica en el consultorio podían corregir los datos en pantalla. El sistema solo permitía dar de alta nuevos pacientes o buscar los existentes. Si se necesitaba cambiar un número de contacto, el operador no tenía otra alternativa que dejar el dato desactualizado o pedir una intervención técnica directa sobre la base de datos. Asimismo, si un paciente solicitaba no ser contactado más, no había forma de inactivarlo desde la interfaz.

### Después:
Desde el directorio de pacientes o desde la cabecera de la historia clínica, el personal autorizado (secretaria, médica o administrador) puede hacer clic en "Editar Datos". Se abre de inmediato una ventana con la información precargada del paciente. El DNI permanece bloqueado para proteger la identidad civil, mientras que el nombre, teléfono, correo y fecha de nacimiento se pueden modificar y validar en tiempo real. Al guardar, el sistema verifica que el nuevo teléfono o email no pertenezcan a otra persona, guarda los cambios y actualiza la vista de inmediato con una confirmación clara. Además, se añade la opción de inactivar a un paciente mediante una confirmación explícita, preservando de manera intacta todas sus consultas y antecedentes previos.

---

## 3. Objetivos y No-Objetivos

### Objetivos:
1. **Reutilización y Modo Dual de Formulario:** Extender `PacienteForm.tsx` para aceptar la propiedad opcional `patient?: Patient`. Cuando esté presente, inicializa el formulario con los valores existentes, adapta los textos a "Guardar Cambios" y deshabilita la edición del DNI.
2. **Ergonomía Operativa en Vistas Clave:**
   - Incorporar botón "Editar" y "Desactivar" en `PatientDirectoryView.tsx`.
   - Incorporar botón "Editar datos de filiación" en la cabecera de `MedicalRecordView.tsx`.
3. **Completitud del Cliente HTTP Frontend:** Incorporar `updatePatient(id, data)` y `deactivatePatient(id)` en `patientsApi` ([api.ts](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/services/api.ts)) con sincronización y limpieza del caché local.
4. **Validación Defensiva en Backend:** Asegurar en `PatientService.java` que la actualización valide que el correo y teléfono no estén en uso por *otro* paciente diferente al que se modifica (`id != targetId`).
5. **Preservación Estricta de Integridad:** La baja de paciente debe ser estrictamente lógica (`active = false`), protegiendo la integridad referencial de turnos (`cita`), pagos (`transaccion_pago`) e historias clínicas (`historia_clinica`).

### No-Objetivos:
- No se permitirá modificar el DNI de un paciente existente en esta fase (se considera identificador civil inmutable en edición rutinaria).
- No se realizarán borrados físicos (`DELETE` SQL cascada) en la base de datos.
- No se alterarán los triggers de auditoría inmutable en `clinical_entries_audit` ni `historia_clinica_audit`.

---

## 4. Cómo funciona hoy vs. después

### Flujo de Edición de Paciente:
- **Hoy:** 
  - La secretaria entra a `PatientDirectoryView.tsx`, selecciona un paciente y solo ve tarjetas de texto estático y la lista de turnos. No hay ningún botón para editar.
  - La médica en `MedicalRecordView.tsx` observa la cabecera fija con nombre, DNI y teléfono sin opciones de actualización.
- **Después:**
  - En ambas vistas se presenta un botón claro con ícono de lápiz ("Editar").
  - Al pulsar, se abre un modal con `PacienteForm` precargado con los datos del paciente.
  - El DNI se muestra bloqueado con leyenda explicativa ("El DNI no puede modificarse una vez registrado").
  - El usuario edita nombre, teléfono, email o fecha de nacimiento con validaciones Zod reactivas.
  - Al pulsar "Guardar Cambios", se invoca `patientsApi.updatePatient(id, datosSanitizados)`.
  - El sistema actualiza el estado local y muestra una notificación de éxito ("Paciente actualizado correctamente").

### Flujo de Baja Lógica (Desactivación):
- **Hoy:** 
  - Inexistente en la interfaz de usuario.
- **Después:**
  - En `PatientDirectoryView.tsx`, para administradores o secretarias, se ofrece la acción "Desactivar paciente".
  - Se despliega un diálogo de confirmación que advierte: *"El paciente dejará de figurar en las búsquedas activas, pero sus turnos e historia clínica se conservarán por motivos legales"*.
  - Al confirmar, se invoca `patientsApi.deactivatePatient(id)`, el paciente pasa a `active: false` y se limpia la selección actual.

---

## 5. Los Datos (Triggers, candados lógicos, concurrencia)

1. **Inmutabilidad y Clave de Identidad:**
   - La columna `dni` posee restricción `UNIQUE` y formato `CHECK (dni ~ '^[0-9]{7,8}$')` según Flyway V4.
   - En la actualización (`PUT`), el DNI no sufre modificaciones, previniendo suplantaciones accidentales.
2. **Validación de Unicidad Cruzada:**
   - Al editar teléfono o correo electrónico, el backend debe verificar que no colisionen con registros ajenos:
     - `existsByEmailAndIdNot(email, id)`
     - `existsByPhoneAndIdNot(phone, id)`
   - Si colisiona, se emite una excepción de negocio que el `GlobalExceptionHandler` traduce en respuesta RFC 7807 (HTTP 409 Conflict o 400 Bad Request) con mensaje legible para la interfaz.
3. **Aislamiento de Auditoría Clínica:**
   - La tabla `paciente` almacena datos de contacto y filiación demográfica. Las notas clínicas y sus modificaciones continúan auditadas de forma inmutable en `entrada_hc_audit` y `clinical_entries_audit`. La edición de datos demográficos no altera ni corrompe estos registros médicos.
4. **Concurrencia Optimista:**
   - La entidad `Patient` actualiza su marca temporal `updatedAt = NOW()`. En caso de solicitudes concurrentes, se asegura la atomicidad a nivel de transacción `@Transactional`.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)

```text
MODULO: GestionPacientes

// FRONTEND: Formulario PacienteForm
COMPONENTE PacienteForm(pacienteExistente, alCompletar, alCancelar):
    Definir esquema Zod para campos demograficos
    Si pacienteExistente esta definido:
        Inicializar formulario con valores de pacienteExistente
        Deshabilitar campo DNI
        TituloFormulario = "Modificar datos del paciente"
        TextoBoton = "Guardar cambios"
    Sino:
        Inicializar formulario con valores vacios
        Habilitar campo DNI
        TituloFormulario = "Nuevo paciente"
        TextoBoton = "Crear paciente"
    FinSi

    AL ENVIAR(datosValidados):
        Si pacienteExistente esta definido:
            Llamar a patientsApi.updatePatient(pacienteExistente.id, datosValidados)
            Notificar exito "Datos del paciente actualizados exitosamente"
        Sino:
            Llamar a patientsApi.createPatient(datosValidados)
            Notificar exito "Paciente registrado exitosamente"
        FinSi
        Ejecutar callback alCompletar con el paciente resultante
    FIN AL ENVIAR

// BACKEND: Servicio PatientService
PROCEDIMIENTO updatePatient(idPaciente, peticion):
    Buscar paciente por idPaciente en BD
    Si no existe:
        Lanzar ResourceNotFoundException("Paciente no encontrado")
    
    Verificar si existe otro paciente con peticion.email y distinto ID
    Si existe:
        Lanzar BusinessRuleException("El correo ya se encuentra registrado por otro paciente")
        
    Verificar si existe otro paciente con peticion.phone y distinto ID
    Si existe:
        Lanzar BusinessRuleException("El telefono ya se encuentra registrado por otro paciente")

    Actualizar campos permitidos:
        paciente.nombre = peticion.nombre
        paciente.telefono = peticion.telefono
        paciente.email = peticion.email
        paciente.fechaNacimiento = peticion.fechaNacimiento
    
    Guardar paciente en repositorio
    Retornar DTO con datos actualizados
FIN PROCEDIMIENTO

PROCEDIMIENTO deactivatePatient(idPaciente):
    Buscar paciente por idPaciente en BD
    Si no existe:
        Lanzar ResourceNotFoundException("Paciente no encontrado")
    
    paciente.active = FALSO
    Guardar paciente en repositorio
FIN PROCEDIMIENTO
```
