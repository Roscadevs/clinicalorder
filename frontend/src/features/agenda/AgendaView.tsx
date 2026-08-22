import React, { useState, useEffect } from 'react'; // React hooks
import { appointmentsApi } from '../../services/api'; // API appointments
import { Appointment, AppointmentStatus } from '../../types'; // Types
import { Calendar, DollarSign, XCircle, Clock, Printer } from 'lucide-react'; // Icons
import { AppointmentReceiptModal } from '../documents/AppointmentReceiptModal'; // Modal de comprobante

export const AgendaView: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptAppointment, setReceiptAppointment] = useState<Appointment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod] = useState<'FINAL_BALANCE_50' | 'FULL_PAYMENT'>('FINAL_BALANCE_50');

  const fetchAgenda = () => {
    const startIso = new Date(`${selectedDate}T00:00:00Z`).toISOString();
    const endIso = new Date(`${selectedDate}T23:59:59Z`).toISOString();
    appointmentsApi.getAgenda(startIso, endIso).then(setAppointments).catch(console.error);
  };

  useEffect(() => {
    fetchAgenda();
  }, [selectedDate]);

  const handleCancel = async (id: number) => {
    if (confirm('¿Desea cancelar este turno? La franja horaria quedará libre.')) {
      await appointmentsApi.cancelAppointment(id);
      fetchAgenda();
    }
  };

  const handleOpenPayment = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setPaymentAmount(appt.agreedPrice * 0.5); // Saldo restante 50%
    setPaymentModalOpen(true);
  };

  const handleOpenReceipt = (appt: Appointment) => {
    setReceiptAppointment(appt);
    setReceiptModalOpen(true);
  };

  const handleFinalizePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    try {
      await appointmentsApi.finalizePayment(selectedAppointment.id, paymentAmount, paymentMethod, 3); // 3 = Sofía Secretaria
      setPaymentModalOpen(false);
      fetchAgenda();
    } catch (err) {
      alert('Error al registrar cobro en mostrador.');
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Confirmado (Seña Paga)</span>;
      case 'PENDING_PAYMENT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Bloqueo Temporal (10m)</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Finalizado</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">Cancelado</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Pago Fallido</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Agenda Operativa del Consultorio</h2>
            <p className="text-xs text-slate-500">Gestión de citas, asistencia, comprobantes y liquidación de saldos</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Día:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Horario</th>
                <th className="p-3.5">Paciente</th>
                <th className="p-3.5">Tratamiento</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Precio / Saldo</th>
                <th className="p-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No hay turnos registrados para la fecha seleccionada.
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-800 flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>{new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{a.patientName}</div>
                      <div className="text-[11px] text-slate-500">DNI: {a.patientDni} · Tel: {a.patientPhone}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">{a.serviceName}</td>
                    <td className="p-3.5">{getStatusBadge(a.status)}</td>
                    <td className="p-3.5 text-right">
                      <div className="font-bold text-slate-900">${a.agreedPrice.toLocaleString()} ARS</div>
                      <div className="text-[11px] text-teal-600 font-semibold">
                        {a.status === 'CONFIRMED' ? 'Saldo pendiente: 50%' : ''}
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleOpenReceipt(a)}
                          className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg"
                          title="Imprimir Comprobante Oficial"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {a.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleOpenPayment(a)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Cobrar</span>
                          </button>
                        )}
                        {a.status !== 'COMPLETED' && a.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleCancel(a.id)}
                            className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50"
                            title="Cancelar Turno"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cobro de Saldo en Mostrador */}
      {paymentModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleFinalizePayment} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Registrar Cobro de Saldo Final</h3>
            <p className="text-xs text-slate-500">
              Turno #{selectedAppointment.id} · Paciente: {selectedAppointment.patientName}
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>Precio Total Acordado:</span>
                <span className="font-bold">${selectedAppointment.agreedPrice.toLocaleString()} ARS</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Seña Abonada (50%):</span>
                <span>-${(selectedAppointment.agreedPrice * 0.5).toLocaleString()} ARS</span>
              </div>
              <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-200 pt-1.5 text-sm">
                <span>Saldo Restante a Cobrar:</span>
                <span className="text-teal-600">${paymentAmount.toLocaleString()} ARS</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monto a Liquidar *</label>
              <input
                type="number"
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="px-4 py-2 text-sm text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm"
              >
                Confirmar Cobro y Finalizar Cita
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Comprobante Imprimible */}
      {receiptModalOpen && receiptAppointment && (
        <AppointmentReceiptModal
          isOpen={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          appointmentData={{
            id: receiptAppointment.id,
            patientName: receiptAppointment.patientName,
            patientDni: receiptAppointment.patientDni,
            patientEmail: 'paciente@example.com',
            patientPhone: receiptAppointment.patientPhone,
            serviceName: receiptAppointment.serviceName,
            startTime: receiptAppointment.startTime,
            durationMinutes: 45,
            agreedPrice: receiptAppointment.agreedPrice,
            depositAmount: receiptAppointment.agreedPrice * 0.5,
          }}
        />
      )}
    </div>
  );
};
