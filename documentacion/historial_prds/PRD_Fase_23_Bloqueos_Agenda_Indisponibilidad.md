# PRD FASE 23: Formulario de Bloqueos de Agenda e Indisponibilidad Médica (Agenda de Turnos)

---

## 1. Encabezado y Resumen (Hoy vs. Después)

| Dimensión | Hoy | Después |
| :--- | :--- | :--- |
| **Gestión de Indisponibilidades en Agenda** | `AgendaView.tsx` solo muestra citas de pacientes. No existe ninguna opción para ver horarios bloqueados ni para que la médica o el administrador cierren franjas por motivos institucionales. | `AgendaView.tsx` incorpora el botón **"Bloquear horario"**, permitiendo programar bloqueos de consultorio (feriados, cirugías, congresos, capacitaciones o licencias) y visualizarlos claramente en el calendario. |
| **Formulario de Bloqueo de Horario** | Inexistente en la interfaz web de React. | Dispone del modal `CalendarBlockModal.tsx` con selector de fecha, rango horario o día completo, y campo obligatorio de motivo de indisponibilidad. |
| **Integración con Endpoints Backend** | El backend tiene implementado `CalendarBlockController` (`/api/v1/bloqueos`), pero no existe cliente HTTP en el frontend (`api.ts`). | Se incorpora `calendarBlocksApi` en `api.ts` (`createBlock`, `getBlocks`, `deleteBlock`) con soporte para modo demo y sincronización reactiva en agenda. |
| **Eliminación y Desbloqueo** | Si se genera un bloqueo por base de datos, no hay forma visual de desbloquearlo. | Cada bloqueo activo muestra un botón para desestimar/eliminar el bloqueo, liberando de inmediato las franjas horarias para reservas de pacientes. |
| **Afectación en la Disponibilidad Pública** | La lógica backend de `/citas/disponibilidad` ya tiene en cuenta `findOverlappingBlocks`, pero sin interfaz de administración. | Al crear un bloqueo desde la UI, las franjas horarias quedan inmediatamente inhabilitadas tanto en el turnero público como en la agenda interna. |

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)

### Antes:
Cuando la médica debía ausentarse por un congreso, una cirugía programada, vacaciones o un feriado puente, la secretaria no tenía ninguna herramienta en el sistema para marcar ese horario como no laborable. Para evitar que los pacientes tomaran turnos en esas fechas, la secretaria tenía que crear turnos ficticios con datos inventados o recordar manualmente no agendar citas en ese horario. Si un paciente ingresaba por la página web o el chatbot, el sistema le permitía reservar turnos en momentos en que la clínica estaba cerrada, generando cancelaciones traumáticas y quejas de los pacientes.

### Después:
Desde la pantalla de Agenda, la médica o el administrador hacen clic en "Bloquear horario". Se despliega un formulario claro donde eligen la fecha, el rango de horas (o la opción de "Día completo") y el motivo (por ejemplo: "Cirugía dermatológica ambulatoria" o "Feriado nacional"). Al confirmar, el bloqueo aparece destacado en la agenda en color ámbar o gris con un ícono de candado. De forma automática, ninguna persona puede reservar turnos en esa franja ni desde la web ni en recepción. Además, si el compromiso se suspende, con un solo clic pueden eliminar el bloqueo y la agenda vuelve a quedar disponible de inmediato.

---

## 3. Objetivos y No-Objetivos

### Objetivos:
1. **Formulario Modal de Bloqueo (`CalendarBlockModal.tsx`):** Permitir a médicas y administradores seleccionar fecha de inicio, fecha de fin (o día completo) y motivo del bloqueo con validaciones de tiempo válidas (`startTime < endTime`).
2. **Visualización en `AgendaView.tsx`:** Mostrar de forma destacada las franjas bloqueadas junto a los turnos habituales, identificando motivo, horario y profesional responsable.
3. **Desbloqueo y Liberación:** Permitir cancelar o eliminar un bloqueo con confirmación de seguridad.
4. **Cliente API Frontend (`calendarBlocksApi`):** Conectar `api.ts` con los endpoints `/api/v1/bloqueos` de Spring Boot 3 con fallback en memoria para modo demo.
5. **Robustez en Backend:** Permitir resolución flexible del usuario autenticado en `CalendarBlockController` sin obligar a pasar `userId` de forma manual en la URL.

### No-Objetivos:
- No se cancelarán automáticamente turnos confirmados existentes que se solapen con el bloqueo sin previo aviso (se alertará al usuario si hay turnos en el rango seleccionado).
- No se modificará la auditoría médica de historias clínicas en `clinical_entries_audit`.

---

## 4. Cómo funciona hoy vs. después

### Flujo de Creación de Bloqueo:
- **Hoy:** 
  - Inexistente. La agenda solo muestra citas.
- **Después:**
  - El usuario con perfil médico o administrador hace clic en el botón "Bloquear horario" en la barra de herramientas de la agenda.
  - Se abre `CalendarBlockModal`.
  - Selecciona:
    - Fecha (por defecto, la fecha actual de la agenda).
    - Horario desde y hasta (ej. 14:00 a 18:00) o marca el interruptor "Día completo".
    - Motivo del bloqueo (ej. "Congreso Argentino de Dermatología").
  - Hace clic en "Confirmar bloqueo".
  - Se invoca `calendarBlocksApi.createBlock`.
  - El modal se cierra, la agenda se actualiza y muestra la tarjeta de bloqueo en el listado.

### Flujo de Eliminación de Bloqueo:
- **Hoy:** 
  - Inexistente.
- **Después:**
  - En la tarjeta del horario bloqueado en la agenda, se visualiza el botón "Liberar horario" (ícono de tacho / desbloqueo).
  - Al pulsar, un diálogo modal solicita confirmación: *"¿Deseas liberar este horario y permitir nuevamente la reserva de turnos?"*.
  - Al confirmar, se invoca `calendarBlocksApi.deleteBlock(id)` y la agenda se actualiza al instante.

---

## 5. Los Datos (Triggers, candados lógicos, concurrencia)

1. **Estructura en PostgreSQL (`bloqueo_calendario`):**
   - Columnas: `id` (PK), `usuario_id` (FK a `usuario`), `start_time` (TIMESTAMP WITH TIME ZONE), `end_time` (TIMESTAMP WITH TIME ZONE), `motivo` (VARCHAR 255), `created_at`.
2. **Validación Temporal Estricta:**
   - Regla de negocio en `CalendarBlockService`: `startTime < endTime`. Si la hora de inicio es igual o posterior a la de fin, se emite `BusinessRuleException` (RFC 7807).
3. **Impacto en Disponibilidad:**
   - La consulta `AppointmentService.getAvailableSlots` ya cruza `calendarBlockRepository.findOverlappingBlocks(start, end)`, asegurando que las franjas bloqueadas devuelvan `available: false` para pacientes.
4. **Aislamiento de Invariantes:**
   - La entidad `CalendarBlock` es estrictamente operativa y de agendamiento; no toca ni altera la historia clínica ni `clinical_entries_audit`.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)

```text
MODULO: GestionBloqueosAgenda

// FRONTEND: Componente CalendarBlockModal
COMPONENTE CalendarBlockModal(abierto, alCerrar, fechaInicial, alGuardar):
    Estado fecha = fechaInicial o hoy
    Estado horaInicio = "09:00"
    Estado horaFin = "13:00"
    Estado diaCompleto = FALSO
    Estado motivo = vacio
    Estado guardando = FALSO
    Estado error = nulo

    AL ENVIAR():
        Si motivo esta vacio:
            error = "El motivo del bloqueo es obligatorio"
            Retornar
        FinSi

        Si diaCompleto es VERDADERO:
            inicioISO = fecha + "T00:00:00"
            finISO = fecha + "T23:59:59"
        Sino:
            inicioISO = fecha + "T" + horaInicio + ":00"
            finISO = fecha + "T" + horaFin + ":00"
            Si finISO <= inicioISO:
                error = "El horario de fin debe ser posterior al horario de inicio"
                Retornar
            FinSi
        FinSi

        guardando = VERDADERO
        error = nulo

        Intentar:
            Llamar a calendarBlocksApi.createBlock({ startTime: inicioISO, endTime: finISO, reason: motivo })
            Notificar toast: "Horario bloqueado con éxito"
            alGuardar()
            alCerrar()
        Capturar excepcion (err):
            error = err.message o "No se pudo registrar el bloqueo"
        Finalmente:
            guardando = FALSO
        FinIntentar
    FIN AL ENVIAR

// FRONTEND: Integración en AgendaView
COMPONENTE AgendaView():
    Cargar citas con appointmentsApi.getAgenda(start, end)
    Cargar bloqueos con calendarBlocksApi.getBlocks(start, end)
    Renderizar boton "Bloquear horario" (solo para DOCTORA o ADMIN)
    Renderizar citas y bloqueos intercalados por horario
    Permitir boton "Liberar horario" en cada bloqueo activo
```
