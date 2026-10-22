import React, { useEffect, useMemo, useState } from 'react';
import { UserRound, Phone, Mail, Clock, ArrowLeft, UserPlus } from 'lucide-react';
import { patientsApi, appointmentsApi } from '../../services/api';
import { Patient, Appointment } from '../../types';
import { Card, Badge, Spinner, Modal, Button } from '../../components/ui';
import { PatientSearch } from '../appointments/PatientSearch';
import { PacienteForm } from './PacienteForm';
import { getVisualStatus, STATUS_STYLES } from '../agenda/appointmentStatus';

const TZ = 'America/Argentina/Buenos_Aires';
const fmt = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

/**
 * Vista de pacientes para NO-médicos (secretaria).
 * Permite buscar un paciente, ver su info de contacto y su historial de turnos.
 * NO da acceso a la historia clínica.
 */
export const PatientDirectoryView: React.FC = () => {
  const [selected, setSelected] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    // Historial: rango amplio alrededor de la fecha actual (un año hacia atrás y adelante)
    const now = Date.now();
    const start = new Date(now - 365 * 86400000).toISOString();
    const end = new Date(now + 365 * 86400000).toISOString();
    appointmentsApi
      .getAgenda(start, end)
      .then((all) => setAppointments(all.filter((a) => a.patientId === selected.id).sort((a, b) => b.startTime.localeCompare(a.startTime))))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [selected]);

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
              <p className="text-xs text-sand-500">Buscá un paciente para ver su contacto e historial de turnos.</p>
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
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-sand-900">{selected.name}</h3>
                <p className="text-sm text-sand-600 mt-1">DNI {selected.dni}</p>
                <p className="text-sm text-sand-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {selected.phone}</p>
                <p className="text-sm text-sand-600 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selected.email}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sand-600 hover:text-primary-600"
              >
                <ArrowLeft className="w-4 h-4" /> Otra búsqueda
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-bold text-sand-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-500" /> Historial de turnos
            </h3>
            {loading ? (
              <div className="py-8 flex justify-center"><Spinner label="Cargando turnos" /></div>
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
                          vs === 'COMPLETED' ? 'success' : vs === 'ATTENDED' ? 'info'
                          : vs === 'OVERDUE' ? 'danger' : vs === 'CANCELED' ? 'neutral' : 'warning'
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
    </div>
  );
};
