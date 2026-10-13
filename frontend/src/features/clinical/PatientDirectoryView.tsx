import React, { useEffect, useMemo, useState } from 'react';
import { UserRound, Phone, Mail, Clock, ArrowLeft, UserPlus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { patientsApi, appointmentsApi } from '../../services/api';
import { Patient, Appointment } from '../../types';
import { Card, Badge, Spinner, Modal, Button, toast } from '../../components/ui';
import { PatientSearch } from '../appointments/PatientSearch';
import { PacienteForm } from './PacienteForm';
import { getVisualStatus, STATUS_STYLES } from '../agenda/appointmentStatus';

const TZ = 'America/Argentina/Buenos_Aires';
const fmt = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    timeZone: TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

/**
 * Vista de pacientes para personal administrativo y secretaría.
 * Permite buscar un paciente, ver su contacto, editar sus datos demográficos,
 * desactivarlo (baja lógica) y consultar su historial de turnos.
 */
export const PatientDirectoryView: React.FC = () => {
  const [selected, setSelected] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    // Historial: rango amplio alrededor de la fecha actual (un año hacia atrás y adelante)
    const now = Date.now();
    const start = new Date(now - 365 * 86400000).toISOString();
    const end = new Date(now + 365 * 86400000).toISOString();
    appointmentsApi
      .getAgenda(start, end)
      .then((all) =>
        setAppointments(
          all
            .filter((a) => a.patientId === selected.id)
            .sort((a, b) => b.startTime.localeCompare(a.startTime))
        )
      )
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [selected]);

  const handleDeactivate = async () => {
    if (!selected) return;
    setDeactivating(true);
    try {
      await patientsApi.deactivatePatient(selected.id);
      toast.success('Paciente desactivado correctamente');
      setSelected(null);
      setIsDeleting(false);
    } catch {
      toast.friendlyError('No se pudo desactivar el paciente', {
        description: 'Verifique su conexión o intente nuevamente.',
      });
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-5">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-500 text-white flex items-center justify-center flex-shrink-0">
              <UserRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-sand-900">Pacientes</h2>
              <p className="text-xs text-sand-500">Buscá un paciente para ver su contacto, editar datos o ver turnos.</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsCreating('')}
          >
            Nuevo Paciente
          </Button>
        </div>
      </Card>

      {!selected ? (
        <Card>
          <PatientSearch
            autoFocus
            onSelect={setSelected}
            onAddNew={(query) => setIsCreating(query)}
          />
          <p className="mt-4 text-xs text-sand-400">
            La historia clínica solo está disponible para el personal médico.
          </p>
        </Card>
      ) : (
        <>
          <Card className="border-primary-200 bg-primary-50/30">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-xl font-bold text-sand-900">{selected.name}</h3>
                  <Badge variant={selected.active ? 'success' : 'neutral'}>
                    {selected.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <p className="text-sm text-sand-600 mt-1">DNI {selected.dni}</p>
                <p className="text-sm text-sand-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {selected.phone}
                </p>
                <p className="text-sm text-sand-600 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {selected.email}
                </p>
                {selected.birthDate && (
                  <p className="text-xs text-sand-500 mt-1">
                    Nacimiento: {selected.birthDate}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap sm:flex-col items-end gap-2">
                <button
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sand-600 hover:text-primary-600 mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Otra búsqueda
                </button>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={<Pencil className="w-3.5 h-3.5" />}
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Datos
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Trash2 className="w-3.5 h-3.5 text-danger-500" />}
                    onClick={() => setIsDeleting(true)}
                    className="text-danger-600 hover:bg-danger-50 hover:text-danger-700"
                  >
                    Desactivar
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-bold text-sand-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-500" /> Historial de turnos
            </h3>
            {loading ? (
              <div className="py-8 flex justify-center">
                <Spinner label="Cargando turnos" />
              </div>
            ) : appointments.length === 0 ? (
              <p className="text-sm text-sand-500 py-4">Este paciente no tiene turnos registrados.</p>
            ) : (
              <ul className="divide-y divide-sand-100">
                {appointments.map((a) => {
                  const vs = getVisualStatus(a);
                  return (
                    <li key={a.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sand-900 truncate">{a.serviceName}</p>
                        <p className="text-xs text-sand-500 capitalize">{fmt(a.startTime)} hs</p>
                      </div>
                      <Badge
                        variant={
                          vs === 'COMPLETED'
                            ? 'success'
                            : vs === 'ATTENDED'
                            ? 'info'
                            : vs === 'OVERDUE'
                            ? 'danger'
                            : vs === 'CANCELED'
                            ? 'neutral'
                            : 'warning'
                        }
                      >
                        {STATUS_STYLES[vs].label}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </>
      )}

      {/* MODAL DE ALTA DE NUEVO PACIENTE */}
      {isCreating !== null && (
        <Modal
          isOpen={true}
          onClose={() => setIsCreating(null)}
          title="Nuevo Paciente"
          size="lg"
        >
          <PacienteForm
            initialQuery={isCreating}
            showHeader={false}
            onSuccess={(created) => {
              setSelected(created);
              setIsCreating(null);
            }}
            onCancel={() => setIsCreating(null)}
          />
        </Modal>
      )}

      {/* MODAL DE EDICIÓN DE PACIENTE EXISTENTE */}
      {isEditing && selected && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditing(false)}
          title={`Editar Paciente: ${selected.name}`}
          size="lg"
        >
          <PacienteForm
            patient={selected}
            showHeader={false}
            onSuccess={(updated) => {
              setSelected(updated);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        </Modal>
      )}

      {/* MODAL DE CONFIRMACIÓN DE DESACTIVACIÓN (BAJA LÓGICA) */}
      {isDeleting && selected && (
        <Modal
          isOpen={true}
          onClose={() => setIsDeleting(false)}
          title="Confirmar baja del paciente"
          size="sm"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsDeleting(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                isLoading={deactivating}
                onClick={handleDeactivate}
              >
                Confirmar Desactivación
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 bg-danger-50 rounded-xl border border-danger-200 text-danger-800 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-danger-600 mt-0.5" />
              <div>
                <p className="font-bold">¿Desactivar a {selected.name}?</p>
                <p className="text-xs text-danger-700 mt-1">
                  El paciente dejará de figurar en las búsquedas activas. Los turnos históricos y antecedentes médicos
                  se conservarán intactos por requerimiento legal.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
