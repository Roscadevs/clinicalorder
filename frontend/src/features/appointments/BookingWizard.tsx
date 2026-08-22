import React, { useState, useEffect } from 'react'; // React hooks
import { servicesApi, patientsApi, appointmentsApi } from '../../services/api'; // API services
import { DermatologicService, PaymentPreferenceResponse } from '../../types'; // Types
import { Calendar, Clock, CreditCard, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'; // Icons

export const BookingWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [services, setServices] = useState<DermatologicService[]>([]);
  const [selectedService, setSelectedService] = useState<DermatologicService | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
  const [selectedTime, setSelectedTime] = useState<string>('15:00');
  
  // Patient Form State
  const [patientName, setPatientName] = useState('');
  const [patientDni, setPatientDni] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');

  // Payment Hold State
  const [holdResult, setHoldResult] = useState<PaymentPreferenceResponse | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(600); // 10 minutes (600s)
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Carga inicial del catálogo de servicios
    servicesApi.getActiveServices().then(setServices).catch(console.error);
  }, []);

  // Temporizador de cuenta regresiva de 10 minutos para el bloqueo temporal
  useEffect(() => {
    if (step !== 4 || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timeLeftSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Crea o busca al paciente
      const patient = await patientsApi.createPatient({
        name: patientName,
        dni: patientDni,
        phone: patientPhone,
        email: patientEmail,
      }).catch(async () => {
        // Si ya existe, busca por DNI
        const found = await patientsApi.getPatients(patientDni);
        return found[0];
      });

      if (!patient) {
        throw new Error('No se pudo vincular los datos del paciente');
      }

      // 2. Realiza el bloqueo temporal de 10 minutos
      const startTimeIso = new Date(`${selectedDate}T${selectedTime}:00Z`).toISOString();
      const hold = await appointmentsApi.bookTemporaryHold({
        patientId: patient.id,
        serviceId: selectedService.id,
        startTime: startTimeIso,
      });

      setHoldResult(hold);
      setTimeLeftSeconds(600);
      setStep(4); // Pasa al paso de pago de seña
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'La franja horaria ya no está disponible. Por favor, elija otro horario.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Indicador de Pasos */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { num: 1, label: 'Tratamiento' },
            { num: 2, label: 'Fecha y Hora' },
            { num: 3, label: 'Tus Datos' },
            { num: 4, label: 'Confirmar Seña' },
          ].map((s) => (
            <div key={s.num} className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === s.num
                    ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* PASO 1: Selección de Servicio */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Selecciona tu Tratamiento Estético</h2>
            <p className="text-sm text-slate-500">Elige el servicio dermatológico que deseas realizarte.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((svc) => (
              <div
                key={svc.id}
                onClick={() => setSelectedService(svc)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedService?.id === svc.id
                    ? 'border-teal-600 bg-teal-50/50 shadow-md ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900">{svc.name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                    {svc.durationMinutes} min
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4 line-clamp-2">{svc.description}</p>
                <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block">Precio Total</span>
                    <span className="text-lg font-extrabold text-slate-900">${svc.basePrice.toLocaleString()} ARS</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-teal-600 font-semibold block">Seña Online (50%)</span>
                    <span className="text-sm font-bold text-teal-700">
                      ${(svc.basePrice * 0.5).toLocaleString()} ARS
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
            >
              <span>Continuar a Fecha y Hora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PASO 2: Selección de Horario */}
      {step === 2 && selectedService && (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Elige la Fecha y Horario</h2>
            <p className="text-sm text-slate-500">Duración del turno: {selectedService.durationMinutes} minutos</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Fecha</label>
              <input
                type="date"
                value={selectedDate}
                min="2026-08-22"
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Franjas Disponibles</label>
              <div className="grid grid-cols-3 gap-2">
                {['09:00', '10:00', '11:30', '14:00', '15:00', '16:30', '17:30', '18:30'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      selectedTime === time
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {time} hs
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="text-slate-600 hover:text-slate-900 text-sm font-semibold px-4 py-2"
            >
              Atrás
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2"
            >
              <span>Completar mis Datos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PASO 3: Formulario de Filiación del Paciente */}
      {step === 3 && selectedService && (
        <form onSubmit={handleStartBooking} className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Tus Datos de Contacto</h2>
            <p className="text-sm text-slate-500">Comprobante y recordatorios se enviarán a este correo.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Ej. Lucía Fernández"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">DNI *</label>
              <input
                type="text"
                required
                value={patientDni}
                onChange={(e) => setPatientDni(e.target.value)}
                placeholder="Ej. 38456123"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+54 9 11 1234-5678"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="lucia@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-slate-600 hover:text-slate-900 text-sm font-semibold px-4 py-2"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2"
            >
              {isLoading ? 'Bloqueando turno...' : 'Bloquear Turno y Pagar Seña'}
              <CreditCard className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>
      )}

      {/* PASO 4: Bloqueo Temporal Activo y Botón MercadoPago */}
      {step === 4 && holdResult && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">¡Horario Bloqueado Temporalmente!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
              Tu turno está retenido de forma exclusiva. Tienes <span className="font-bold text-amber-600">{formatTime(timeLeftSeconds)}</span> para completar el pago de la seña del 50% y confirmar la reserva.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl max-w-md mx-auto text-left border border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Tratamiento:</span>
              <span className="font-semibold text-slate-800">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fecha y Hora:</span>
              <span className="font-semibold text-slate-800">{selectedDate} a las {selectedTime} hs</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="font-bold text-slate-800">Seña a abonar (50%):</span>
              <span className="font-extrabold text-teal-600 text-base">${holdResult.depositAmount.toLocaleString()} ARS</span>
            </div>
          </div>

          <div>
            <a
              href={holdResult.initPointUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-[#009EE3] hover:bg-[#0082ba] text-white font-bold px-8 py-4 rounded-xl shadow-md transition-transform transform hover:scale-105 text-base"
            >
              <CreditCard className="w-5 h-5" />
              <span>Pagar Seña con MercadoPago</span>
            </a>
            <p className="text-xs text-slate-400 mt-2">Serás redirigido a la pasarela segura oficial de MercadoPago.</p>
          </div>
        </div>
      )}
    </div>
  );
};
