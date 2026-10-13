# PRD FASE 22: Formulario de Nueva Nota de Evolución Clínica (Atención Médica en Consulta)

---

## 1. Encabezado y Resumen (Hoy vs. Después)

| Dimensión | Hoy | Después |
| :--- | :--- | :--- |
| **Pestaña "Notas Clínicas"** | `MedicalRecordView.tsx` muestra un listado de notas clínicas registradas previamente, pero **no contiene ningún botón ni modal para redactar una nueva nota**. | Dispone de un botón destacado **"+ Nueva Nota de Evolución"** que despliega el formulario de registro de consulta para el paciente atendido. |
| **Formulario de Carga de Evolución** | Inexistente en la interfaz de usuario. Solo existe `ClinicalNoteModal.tsx` que opera exclusivamente en modo lectura y edición de notas ya existentes. | Incorpora un formulario modal específico (`NewClinicalNoteModal.tsx`) que permite seleccionar el turno/sesión asociada, redactar la evolución médica (diagnóstico, procedimiento, dosis/unidades inyectadas, tolerancia y pautas post-tratamiento) y guardar. |
| **Conexión con el Cliente API** | El método `clinicalApi.addClinicalEntry(appointmentId, content)` existe en `api.ts` pero está completamente huérfano (no se invoca desde ningún componente React). | El formulario se conecta directamente con `clinicalApi.addClinicalEntry`, actualizando de forma reactiva e inmediata el historial de notas clínicas en pantalla. |
| **Cifrado y Seguridad de Datos** | La protección criptográfica AES-256-GCM está implementada en el backend, pero sin flujo de entrada desde la interfaz web. | La médica redacta en texto legible; el frontend transmite de forma segura por HTTPS y el backend cifra el contenido con AES-256-GCM antes de persistir en PostgreSQL. |
| **Trazabilidad y Autoría** | Solo se visualizan autores de notas precargadas. | Se asocia automáticamente el operador médico autenticado (`physicianUserId`), registrando de forma inmutable la autoría de la evolución. |

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)

### Antes:
La médica atiende a un paciente en el consultorio, realiza un procedimiento estético (por ejemplo, una aplicación de toxina botulínica o una sesión de peeling químico) y abre el sistema para registrar lo realizado: las unidades aplicadas, las zonas anatómicas tratadas, las marcas de producto y las indicaciones post-procedimiento. Sin embargo, al ingresar a la sección de "Notas clínicas" de la historia del paciente, solo ve una lista de notas antiguas. No existe ningún botón de "Nueva nota" ni ningún recuadro para escribir. La médica no tiene forma de asentar la consulta del día en el sistema digital y debe recurrir a anotaciones externas o dejar el expediente sin registrar.

### Después:
Al concluir la sesión o durante la consulta, la médica pulsa el botón "+ Nueva Nota de Evolución" dentro de la historia clínica. Se abre una ventana limpia y profesional que le muestra el nombre del paciente y le permite vincular la nota al turno del día (mostrando automáticamente el servicio contratado, ej. "Toxina Botulínica"). La médica redacta sus observaciones clínicas con un procesador ágil de texto. Al pulsar "Guardar Evolución", el sistema valida los datos, los envía al servidor donde se protegen con cifrado de grado médico, y la nueva nota aparece de inmediato en la parte superior del historial del paciente, fechada y firmada digitalmente con su nombre.

---

## 3. Objetivos y No-Objetivos

### Objetivos:
1. **Formulario Accesible y Ergonómico:** Crear el componente modal `NewClinicalNoteModal.tsx` con foco en agilidad médica: selección del turno asociado del paciente, área de texto enriquecida con contador y atajos para indicaciones frecuentes.
2. **Integración en `MedicalRecordView.tsx`:** Añadir el botón de acción principal en la cabecera de la pestaña de "Notas clínicas" (visible únicamente para usuarios con perfil médico / doctora).
3. **Vincular Turno con Evolución:** Permitir seleccionar a qué turno del paciente corresponde la evolución clínica (preseleccionando automáticamente el turno del día o el turno más reciente).
4. **Cierre Reactivo sin Recargas:** Al guardar exitosamente, la nueva nota se inserta en el estado local de la lista de entradas (`entries`) para visualización instantánea y confirmación mediante notificación toast.
5. **Preservación Incondicional de Invariantes:** El backend continuará aplicando cifrado AES-256-GCM sobre el contenido y mantendrá la estricta inmutabilidad en la tabla `clinical_entries_audit`.

### No-Objetivos:
- No se permitirá la eliminación física de notas clínicas (las notas solo pueden evolucionar o editarse con auditoría).
- No se permitirá a usuarios con rol `SECRETARIA` crear notas clínicas (restringido a `DOCTORA` según normativa médica RBAC).
- No se sustituirá el formulario de anamnesis previa (`AnamnesisForm.tsx`), que sigue existiendo de forma separada para antecedentes patológicos y alergias.

---

## 4. Cómo funciona hoy vs. después

### Flujo de Redacción de Nueva Evolución:
- **Hoy:** 
  - La médica entra a la historia clínica del paciente.
  - Pulsa en la pestaña "Notas clínicas".
  - Observa las notas anteriores. No hay ningún control para agregar una nueva.
- **Después:**
  - La médica pulsa en "Notas clínicas".
  - En la parte superior derecha visualiza el botón primario "+ Nueva Nota de Evolución".
  - Al hacer clic, se abre `NewClinicalNoteModal`.
  - El modal lista los turnos del paciente (por fecha y servicio) para elegir a cuál vincular la sesión.
  - La médica escribe las observaciones (mínimo 10 caracteres obligatorios).
  - Al hacer clic en "Guardar evolución", el botón entra en estado de carga.
  - Se ejecuta `clinicalApi.addClinicalEntry(appointmentId, content)`.
  - El modal se cierra, se dispara un mensaje de confirmación y la nueva nota se sitúa al tope de la lista con marca de tiempo actual y nombre de la médica.

---

## 5. Los Datos (Triggers, candados lógicos, concurrencia)

1. **Estructura y Cifrado:**
   - Tabla: `entrada_historia_clinica` (Flyway V4).
   - Columnas: `id`, `paciente_id`, `cita_id`, `usuario_medico_id`, `contenido_cifrado` (BYTEA), `created_at`, `updated_at`.
   - El contenido se cifra con el servicio criptográfico `AesEncryptionService` antes de cualquier escritura física.
2. **Auditoría Inmutable:**
   - La creación de la nota inicial persiste el registro en `entrada_historia_clinica`.
   - Cualquier edición posterior dispara la inserción obligatoria en `clinical_entries_audit` preservando la versión previa y la nueva de forma inmutable.
3. **Validación de Identidad Médica:**
   - El endpoint `POST /api/v1/historias-clinicas/entradas` requiere `physicianUserId` y rol `DOCTORA`.
   - Se valida la existencia del turno (`appointmentId`) y se asegura que pertenezca al paciente en consulta.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)

```text
MODULO: FormularioNuevaNotaEvolucion

// FRONTEND: Componente NewClinicalNoteModal
COMPONENTE NewClinicalNoteModal(abierto, alCerrar, paciente, turnosPaciente, alGuardar):
    Estado contenido = vacio
    Estado turnoSeleccionadoId = primer turno del paciente o nulo
    Estado guardando = FALSO
    Estado error = nulo

    AL ENVIAR():
        Si no hay turnoSeleccionadoId:
            error = "Debes seleccionar el turno o sesión asociada a esta evolución"
            Retornar
        FinSi

        Si contenido tiene menos de 10 caracteres:
            error = "La nota de evolución debe contener al menos 10 caracteres explicativos"
            Retornar
        FinSi

        guardando = VERDADERO
        error = nulo

        Intentar:
            Llamar a clinicalApi.addClinicalEntry(turnoSeleccionadoId, contenido)
            Notificar toast: "Nota de evolución registrada con éxito"
            alGuardar(notaCreada)
            alCerrar()
        Capturar excepcion (err):
            error = "No se pudo registrar la nota clínica. Reintente en unos instantes."
        Finalmente:
            guardando = FALSO
        FinIntentar
    FIN AL ENVIAR

// FRONTEND: Integración en MedicalRecordView
COMPONENTE MedicalRecordView():
    En seccion "notas":
        Renderizar encabezado con titulo "Notas clínicas"
        Si el usuario actual tiene rol médico:
            Renderizar boton "+ Nueva Nota de Evolución"
            Al hacer clic: abrir NewClinicalNoteModal
        FinSi
        Renderizar lista de notas clínicas
```
