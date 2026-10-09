import axios from 'axios'; // Cliente HTTP Axios
import { toast } from '../components/ui/Toast';
import {
  AuthResponse,
  Patient,
  DermatologicService,
  Appointment,
  AppointmentStatus,
  PaymentPreferenceResponse,
  MedicalRecord,
  ClinicalEntry,
  ClinicalAuditLog,
  GeminiChatResponse,
  TimeSlot,
  PaymentType,
  PaymentConcept,
  PaymentReceipt,
  UserRole
} from '../types'; // Importación de contratos de tipos

/** URL absoluta de la API (para requests fuera de axios, p. ej. fetch keepalive). */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const isDemoSession = (): boolean => {
  const token = localStorage.getItem('token');
  return !token || token.startsWith('demo-');
};

/**
 * true sólo si el backend no está disponible (modo demo):
 *  - sin respuesta (caída de red), o
 *  - 502/503/504, o un 500 con cuerpo vacío (lo que devuelve el proxy de Vite
 *    cuando Spring Boot está apagado).
 * Los errores reales del backend (409, 400, 404, 500 con JSON...) se propagan:
 * p. ej. un 409 significa que otro usuario ya tomó el horario.
 */
const isNetworkError = (err: unknown): boolean => {
  if (!axios.isAxiosError(err)) return false;
  const res = err.response;
  if (!res) return true;
  if ([502, 503, 504].includes(res.status)) return true;
  // El proxy de Vite responde 500 cuando Spring Boot está apagado. Un 500 real
  // del backend trae un JSON con "message"/"error"; sin eso, lo tratamos como caída.
  if (res.status === 500) {
    const d = res.data as unknown;
    if (d == null || d === '') return true;
    if (typeof d === 'object' && !('message' in d) && !('error' in d)) return true;
  }
  return false;
};

/**
 * En modo demo (token simulado o no autenticado), las rutas protegidas del backend
 * responden con 401/403 o fallos de conexión. Este helper asegura que en tales casos
 * se active inmediatamente el comportamiento simulado en lugar de romper el flujo.
 */
const shouldFallbackToDemo = (err: unknown): boolean => {
  if (isDemoSession()) return true;
  return isNetworkError(err);
};

const ROLE_FALLBACK_IDS: Record<string, number> = {
  ADMIN: 1,
  DOCTORA: 2,
  SECRETARIA: 3,
};

const currentUserId = (): number => {
  const raw = localStorage.getItem('userId');
  const n = raw ? Number(raw) : NaN;
  if (Number.isFinite(n) && n > 0 && n !== 999) return n;
  const role = localStorage.getItem('role') || 'ADMIN';
  return ROLE_FALLBACK_IDS[role] ?? 1;
};

// Instancia configurada de Axios con base URL hacia la API de Spring Boot
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1', // URL base configurada o proxy relativo
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000, // Previene bloqueos indefinidos ante problemas de red
});

// Interceptor para inyectar automáticamente el Bearer JWT en cada solicitud saliente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Recupera el token guardado en el navegador
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`; // Agrega el encabezado de autorización
  }
  return config;
});

let isRedirectingToLogin = false;

// Interceptor global de respuestas para manejo amable de fallos HTTP
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      // 401: Sesión caducada
      if (status === 401 && !isRedirectingToLogin) {
        const isAuthRoute =
          typeof window !== 'undefined' &&
          (window.location.pathname === '/login' ||
            window.location.pathname === '/recover-password');

        if (!isAuthRoute) {
          isRedirectingToLogin = true;
          toast.friendlyError('Tu sesión ha caducado por seguridad', {
            description:
              'Te redirigiremos al inicio de sesión para que continúes de forma segura.',
            duration: 3500,
          });
          setTimeout(() => {
            localStorage.removeItem('token');
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            isRedirectingToLogin = false;
          }, 2000);
        }
      } else if (status >= 500 && !isNetworkError(error)) {
        // 500+ Error interno no simulado
        toast.friendlyError('Inconveniente temporal en el servidor', {
          description:
            'Los datos están protegidos. Podés reintentar la acción en unos segundos.',
        });
      }
    } else if (isNetworkError(error)) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        toast.friendlyError('Sin conexión a internet', {
          description:
            'Comprobá tu red. La aplicación volverá a sincronizarse cuando estés en línea.',
        });
      }
    }

    return Promise.reject(error);
  }
);


// --- SERVICIOS DE AUTENTICACIÓN ---
export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { username, password });
    return response.data;
  },
  /** Alta de usuario del staff (solo ADMIN). POST /auth/register. */
  register: async (data: {
    username: string;
    password: string;
    email: string;
    fullName: string;
    role: UserRole;
  }): Promise<void> => {
    try {
      await api.post('/auth/register', data);
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      // Modo demo: se considera creado.
    }
  },
};

// Catálogo de demostración (backend apagado)
const DEMO_SERVICES: DermatologicService[] = [
  { id: 1, name: 'Peeling Químico Facial (Ácido Mandélico + Retinol)', description: 'Renovación celular profunda, atenúa manchas solares, melasma y secuelas de acné.', durationMinutes: 45, basePrice: 42000, depositPercentage: 50, active: true },
  { id: 2, name: 'Toxina Botulínica (Frente, Entrecejo y Patas de Gallo)', description: 'Atenuación armónica de arrugas dinámicas y líneas de expresión.', durationMinutes: 45, basePrice: 65000, depositPercentage: 50, active: true },
  { id: 3, name: 'Relleno con Ácido Hialurónico (Labios y Surcos)', description: 'Volumen e hidratación profunda con cánula de precisión y anestesia tópica.', durationMinutes: 60, basePrice: 75000, depositPercentage: 50, active: true },
  { id: 4, name: 'Limpieza Facial Profunda + Hidrodermoabrasión', description: 'Extracción atraumática de impurezas, punta de diamante y mascarilla descongestiva.', durationMinutes: 60, basePrice: 28000, depositPercentage: 50, active: true },
  { id: 5, name: 'Mesoterapia Capilar', description: 'Microinyecciones para estimular el crecimiento y fortalecer el folículo.', durationMinutes: 30, basePrice: 35000, depositPercentage: 40, active: false },
];

// --- SERVICIOS DEL CATÁLOGO ---
export const servicesApi = {
  /** Servicios activos (vista pública / reserva). */
  getActiveServices: async (): Promise<DermatologicService[]> => {
    try {
      const response = await api.get<DermatologicService[]>('/servicios');
      if (!Array.isArray(response.data)) throw new Error('Expected array');
      return response.data;
    } catch (err) {
      if (!isNetworkError(err) && !(err instanceof Error && err.message === 'Expected array')) throw err;
      return DEMO_SERVICES.filter((s) => s.active);
    }
  },
  /** Todos los servicios, activos e inactivos (panel de administración). */
  getAllServicesForAdmin: async (): Promise<DermatologicService[]> => {
    try {
      const response = await api.get<DermatologicService[]>('/servicios/todos');
      if (!Array.isArray(response.data)) throw new Error('Expected array');
      return response.data;
    } catch (err) {
      if (!isNetworkError(err) && !(err instanceof Error && err.message === 'Expected array')) throw err;
      return DEMO_SERVICES;
    }
  },
  createService: async (data: Partial<DermatologicService>): Promise<DermatologicService> => {
    try {
      const response = await api.post<DermatologicService>('/servicios', data);
      return response.data;
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      return {
        id: Date.now(),
        name: data.name || 'Nuevo Servicio',
        description: data.description || '',
        durationMinutes: data.durationMinutes || 45,
        basePrice: data.basePrice || 30000,
        depositPercentage: data.depositPercentage ?? 50,
        active: true,
      };
    }
  },
  /** Actualiza un servicio completo (nombre, precio, seña, duración, activo). */
  updateService: async (id: number, data: Partial<DermatologicService>): Promise<DermatologicService> => {
    try {
      const response = await api.put<DermatologicService>(`/servicios/${id}`, data);
      return response.data;
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      return {
        id,
        name: data.name ?? 'Servicio',
        description: data.description ?? '',
        durationMinutes: data.durationMinutes ?? 45,
        basePrice: data.basePrice ?? 30000,
        depositPercentage: data.depositPercentage ?? 50,
        followUpIntervalDays: data.followUpIntervalDays,
        active: data.active ?? true,
      };
    }
  },
  /** Activa o desactiva un servicio (baja lógica). Reenvía todos los campos + active. */
  setServiceActive: async (service: DermatologicService, active: boolean): Promise<DermatologicService> => {
    return servicesApi.updateService(service.id, { ...service, active });
  },
};

// --- SERVICIOS DE GESTIÓN DE PACIENTES ---
const INITIAL_DEMO_PATIENTS: Patient[] = [
  { id: 1, name: 'Lucía Fernández', dni: '38456123', phone: '+54 9 11 1234-5678', email: 'lucia.fernandez@example.com', active: true, createdAt: '2026-08-01' },
  { id: 2, name: 'Camila Rossi', dni: '40123987', phone: '+54 9 11 8765-4321', email: 'camila.rossi@example.com', active: true, createdAt: '2026-08-10' },
  { id: 3, name: 'Mariana Díaz', dni: '36987452', phone: '+54 9 11 5555-1234', email: 'mariana.diaz@example.com', active: true, createdAt: '2026-08-12' },
  { id: 4, name: 'Sofía Álvarez', dni: '39874125', phone: '+54 9 11 9999-8888', email: 'sofia.alvarez@example.com', active: true, createdAt: '2026-08-15' },
];

const getDemoPatients = (): Patient[] => {
  const raw = localStorage.getItem('demo_patients');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return INITIAL_DEMO_PATIENTS;
};

const filterDemoPatients = (search?: string): Patient[] => {
  const list = getDemoPatients();
  const q = (search ?? '').trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) => p.dni.includes(q) || p.name.toLowerCase().includes(q));
};

const patientSearchCache = new Map<string, { data: Patient[]; timestamp: number }>();
const PATIENT_CACHE_TTL = 30000;

export const patientsApi = {
  getPatients: async (search?: string): Promise<Patient[]> => {
    const q = (search ?? '').trim().toLowerCase();

    // En modo demo respondemos de forma inmediata en memoria (sin latencia de red ni esperar el 403 del servidor)
    if (isDemoSession()) {
      return filterDemoPatients(q);
    }

    const cached = patientSearchCache.get(q);
    if (cached && Date.now() - cached.timestamp < PATIENT_CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await api.get<Patient[]>('/pacientes', { params: { search } });
      if (!Array.isArray(response.data)) throw new Error('Expected array');
      patientSearchCache.set(q, { data: response.data, timestamp: Date.now() });
      return response.data;
    } catch {
      return filterDemoPatients(q);
    }
  },
  createPatient: async (patient: Partial<Patient>): Promise<Patient> => {
    if (isDemoSession()) {
      const current = getDemoPatients();
      const newPatient: Patient = {
        id: current.length > 0 ? Math.max(...current.map((p) => p.id)) + 1 : 1,
        name: patient.name || '',
        dni: patient.dni || '',
        phone: patient.phone || '',
        email: patient.email || '',
        active: true,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('demo_patients', JSON.stringify([...current, newPatient]));
      patientSearchCache.clear();
      return newPatient;
    }

    try {
      const response = await api.post<Patient>('/pacientes', patient);
      patientSearchCache.clear();
      return response.data;
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const current = getDemoPatients();
      const newPatient: Patient = {
        id: current.length > 0 ? Math.max(...current.map((p) => p.id)) + 1 : 1,
        name: patient.name || '',
        dni: patient.dni || '',
        phone: patient.phone || '',
        email: patient.email || '',
        active: true,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('demo_patients', JSON.stringify([...current, newPatient]));
      patientSearchCache.clear();
      return newPatient;
    }
  },
};

// --- SERVICIOS DE CITAS Y RESERVAS ---
export const appointmentsApi = {
  /**
   * Franjas horarias calculadas por el backend para una fecha y servicio.
   * `available=false` cubre turnos confirmados, bloqueos temporales de otros
   * usuarios (PENDING_PAYMENT) y bloqueos de agenda.
   */
  getAvailableSlots: async (date: string, serviceId: number): Promise<TimeSlot[]> => {
    try {
      const response = await api.get<TimeSlot[]>('/citas/disponibilidad', {
        params: { fecha: date, servicioId: serviceId },
      });
      if (!Array.isArray(response.data)) throw new Error('Expected array');
      return response.data;
    } catch (err) {
      if (!isNetworkError(err) && !(err instanceof Error && err.message === 'Expected array')) throw err;
      // Modo demo: grilla 09:00–18:30 cada 30 min. Los ocupados se derivan de la fecha y
      // el servicio (pseudoaleatorio pero estable), así cada día muestra una agenda distinta.
      let seed = 0;
      for (const ch of `${date}|${serviceId}`) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
      const slots: TimeSlot[] = [];
      let i = 0;
      for (let h = 9; h < 19; h++) {
        for (const m of [0, 30]) {
          const hhmm = `${String(h).padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
          const start = new Date(`${date}T${hhmm}:00-03:00`);
          const taken = ((seed >>> (i % 24)) ^ (i * 2654435761)) % 5 === 0;
          slots.push({
            startTime: start.toISOString(),
            endTime: new Date(start.getTime() + 45 * 60000).toISOString(),
            timeDisplay: `${hhmm} hs`,
            available: !taken && start.getTime() > Date.now() + 2 * 3600 * 1000,
          });
          i++;
        }
      }
      return slots;
    }
  },

  /**
   * Bloquea el horario por 10 minutos (turno en PENDING_PAYMENT).
   * Si otro usuario ya lo tomó, el backend responde 409 y el error se propaga:
   * NO se simula éxito, porque eso rompería el control de concurrencia.
   */
  bookTemporaryHold: async (data: {
    patientId: number;
    serviceId: number;
    startTime: string;
  }): Promise<PaymentPreferenceResponse> => {
    if (isDemoSession()) {
      return {
        appointmentId: Math.floor(Math.random() * 9000) + 1000,
        preferenceId: 'PREF-MP-2026-SIMULATED',
        initPointUrl: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=simulated',
        depositAmount: 21000,
        holdExpiresAt: new Date(Date.now() + 600000).toISOString(),
      };
    }
    try {
      const response = await api.post<PaymentPreferenceResponse>('/citas/reservar-temporal', data, {
        params: { userId: currentUserId() },
      });
      return response.data;
    } catch (err) {
      if (!shouldFallbackToDemo(err)) throw err;
      return {
        appointmentId: Math.floor(Math.random() * 9000) + 1000,
        preferenceId: 'PREF-MP-2026-SIMULATED',
        initPointUrl: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=simulated',
        depositAmount: 21000,
        holdExpiresAt: new Date(Date.now() + 600000).toISOString(),
      };
    }
  },

  /**
   * Intento de liberar el bloqueo cuando se cierra o recarga la pestaña.
   * `keepalive` deja que el request termine aunque la página se descargue. No es
   * garantizado (el navegador puede cerrarse abruptamente o quedarse sin red): la
   * garantía real es el vencimiento del bloqueo en el servidor a los 10 minutos.
   */
  releaseHoldOnPageExit: (id: number): void => {
    const token = localStorage.getItem('token');
    try {
      fetch(`${API_BASE_URL}/citas/${id}/cancelar`, {
        method: 'POST',
        keepalive: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }).catch(() => undefined);
    } catch {
      /* el navegador no permitió el envío */
    }
  },

  /** Libera un bloqueo temporal (p. ej. al editar servicio u horario). */
  releaseHold: async (id: number): Promise<void> => {
    try {
      await api.post(`/citas/${id}/cancelar`);
    } catch (err) {
      if (!shouldFallbackToDemo(err)) throw err;
    }
  },

  /**
   * Caso de uso "Registrar Pago" (seña en mostrador: efectivo o transferencia).
   * El backend valida (bloqueo vigente, monto >= seña) y confirma el turno.
   * Devuelve los datos del pago para el comprobante.
   */
  registerDepositPayment: async (
    id: number,
    payload: {
      paymentType: Exclude<PaymentType, 'MERCADOPAGO'>;
      amount: number;
      agreedPrice: number;
      /** Concepto elegido: seña (DEPOSIT) o pago total (FULL). */
      concept?: Exclude<PaymentConcept, 'BALANCE'>;
      paymentConcept?: PaymentConcept;
    }
  ): Promise<PaymentReceipt> => {
    // Si no viene explícito, se infiere por el monto respecto del precio acordado.
    const concept: Exclude<PaymentConcept, 'BALANCE'> =
      payload.concept ?? (payload.amount >= payload.agreedPrice ? 'FULL' : 'DEPOSIT');

    if (isDemoSession()) {
      return {
        appointmentId: id,
        paymentType: payload.paymentType,
        concept,
        amount: payload.amount,
        paymentDate: new Date().toISOString(),
        appointmentStatus: 'CONFIRMED',
      };
    }

    try {
      const response = await api.post<PaymentReceipt>(
        `/citas/${id}/registrar-pago`,
        {
          paymentType: payload.paymentType,
          paymentConcept: payload.paymentConcept ?? concept,
          concept,
          amount: payload.amount,
        },
        { params: { userId: currentUserId() } }
      );
      return response.data;
    } catch (err) {
      if (!shouldFallbackToDemo(err)) throw err;
      // Modo demo o caída de red: se considera registrado.
      return {
        appointmentId: id,
        paymentType: payload.paymentType,
        concept,
        amount: payload.amount,
        paymentDate: new Date().toISOString(),
        appointmentStatus: 'CONFIRMED',
      };
    }
  },
  /** Turnos en el rango [start, end) (ISO 8601). Para la agenda del staff. */
  getAgenda: async (start: string, end: string): Promise<Appointment[]> => {
    try {
      const response = await api.get<Appointment[]>('/citas/agenda', { params: { start, end } });
      if (!Array.isArray(response.data)) throw new Error('Expected array');
      return response.data;
    } catch (err) {
      if (!shouldFallbackToDemo(err) && !(err instanceof Error && err.message === 'Expected array')) throw err;
      return demoAgenda(start, end);
    }
  },
  cancelAppointment: async (id: number): Promise<void> => {
    try {
      await api.post(`/citas/${id}/cancelar`);
    } catch (err) {
      if (!shouldFallbackToDemo(err)) throw err;
    }
  },
  /** Consulta pública del estado de un turno (usado en la pantalla de retorno de Mercado Pago). */
  getPublicStatus: async (
    id: number
  ): Promise<{ appointmentId: number; status: string; serviceName: string; startTime: string }> => {
    try {
      const response = await api.get<{
        appointmentId: number;
        status: string;
        serviceName: string;
        startTime: string;
      }>(`/citas/${id}/estado`);
      return response.data;
    } catch (err) {
      if (!shouldFallbackToDemo(err)) throw err;
      return {
        appointmentId: id,
        status: 'CONFIRMED',
        serviceName: 'Consulta Dermatológica',
        startTime: new Date().toISOString(),
      };
    }
  },
  /** El médico marca el turno como atendido (CONFIRMED -> ATTENDED). */
  markAsAttended: async (id: number): Promise<void> => {
    try {
      await api.post(`/citas/${id}/atender`);
    } catch (err) {
      if (!shouldFallbackToDemo(err)) throw err;
    }
  },
  /**
   * Reprograma un turno a una nueva fecha/hora, conservando el servicio.
   * El backend revalida la disponibilidad del nuevo horario. Devuelve el turno
   * actualizado. En modo demo (sin backend) se simula el cambio localmente.
   */
  rescheduleAppointment: async (id: number, newStartTime: string): Promise<Appointment | null> => {
    try {
      const response = await api.post<Appointment>(
        `/citas/${id}/reprogramar`,
        { startTime: newStartTime },
        { params: { userId: currentUserId() } }
      );
      return response.data;
    } catch (err) {
      if (!shouldFallbackToDemo(err)) throw err;
      // Modo demo: se considera reprogramado; el refresco de la agenda reflejará el cambio.
      return null;
    }
  },
  /**
   * Liquida el saldo final en mostrador (turno CONFIRMED -> COMPLETED).
   * paymentType: canal real (CASH, BANK_TRANSFER, MERCADOPAGO).
   */
  finalizePayment: async (id: number, amount: number, paymentType: PaymentType): Promise<void> => {
    try {
      await api.post(`/citas/${id}/liquidar-saldo`, { amount, paymentType }, {
        params: { receptionistUserId: currentUserId() },
      });
    } catch (err) {
      if (!shouldFallbackToDemo(err)) throw err;
    }
  },
};

/**
 * Agenda de demostración (backend apagado): turnos repartidos alrededor de "hoy"
 * con estados variados, para probar el calendario y los colores por estado.
 */
function demoAgenda(startIso: string, endIso: string): Appointment[] {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  const dayMs = 86400000;
  const at = (dayOffset: number, hhmm: string) => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const [h, m] = hhmm.split(':').map(Number);
    return new Date(base.getTime() + dayOffset * dayMs + (h * 60 + m) * 60000);
  };
  const mk = (
    id: number, dayOffset: number, hhmm: string, durationMin: number,
    status: AppointmentStatus, name: string, dni: string, phone: string,
    serviceName: string, price: number
  ): Appointment => {
    const s = at(dayOffset, hhmm);
    return {
      id, patientId: id, patientName: name, patientDni: dni, patientPhone: phone,
      serviceId: (id % 4) + 1, serviceName,
      startTime: s.toISOString(),
      endTime: new Date(s.getTime() + durationMin * 60000).toISOString(),
      status, agreedPrice: price, rescheduleCount: 0, version: 1,
    };
  };

  const all = [
    mk(101, 0, '09:30', 45, 'CONFIRMED', 'Lucía Fernández', '38456123', '+54 9 11 1234-5678', 'Peeling Químico Facial', 42000),
    mk(102, 0, '11:00', 45, 'COMPLETED', 'Camila Rossi', '40123987', '+54 9 11 8765-4321', 'Toxina Botulínica', 65000),
    mk(103, 0, '16:30', 60, 'CONFIRMED', 'Mariana Díaz', '36987452', '+54 9 11 5555-1234', 'Relleno con Ácido Hialurónico', 75000),
    mk(104, 1, '10:00', 60, 'CONFIRMED', 'Sofía Álvarez', '39874125', '+54 9 11 9999-8888', 'Limpieza Facial Profunda', 28000),
    mk(105, 1, '14:30', 60, 'PENDING_PAYMENT', 'Valentina Morales', '41258963', '+54 9 11 3333-7777', 'Bioestimulador de Colágeno', 180000),
    mk(106, 2, '12:00', 30, 'CONFIRMED', 'Julieta Benítez', '37412589', '+54 9 11 4444-2222', 'Control de Lunares', 25000),
    mk(107, 3, '15:00', 45, 'COMPLETED', 'Florencia Ruiz', '42011888', '+54 9 11 2222-1010', 'Peeling Químico Facial', 42000),
    mk(108, -1, '10:30', 45, 'CONFIRMED', 'Agustina Peña', '38999111', '+54 9 11 7777-2323', 'Toxina Botulínica', 65000),
  ];
  return all.filter((a) => {
    const t = new Date(a.startTime).getTime();
    return t >= start && t < end;
  });
}

// --- SERVICIOS DE HISTORIA CLÍNICA (Solo Médicas) ---
export const clinicalApi = {
  getMedicalRecordByPatient: async (patientId: number): Promise<MedicalRecord | null> => {
    try {
      const response = await api.get<MedicalRecord>(`/historias-clinicas/paciente/${patientId}`);
      return response.status === 204 ? null : response.data;
    } catch {
      return {
        id: 1,
        patientId: 1,
        patientName: 'Lucía Fernández',
        patientDni: '38456123',
        fitzpatrickPhototype: 'III',
        hasHta: false,
        hasDbt: false,
        hasHypothyroidism: false,
        hasHyperthyroidism: false,
        hasAnemia: false,
        hasAutoimmuneDiseases: false,
        hasGlaucoma: false,
        hasCoagulationDisorders: false,
        hasScarringAlterations: false,
        allergyAnesthesia: true,
        allergyEgg: false,
        allergyFish: false,
        habitTobacco: false,
        habitAlcohol: false,
        habitSunExposure: false,
        habitSpfUse: true,
        informedConsentSigned: true,
        treatmentPlan: 'Protocolo de 3 sesiones de Peeling Mandélico 30% + Retinol 1%. Control cada 21 días.',
        createdAt: '2026-08-01T10:00:00Z',
        updatedAt: '2026-08-22T02:00:00Z',
      };
    }
  },
  saveMedicalRecord: async (patientId: number, data: Partial<MedicalRecord>, physicianUserId: number): Promise<MedicalRecord> => {
    try {
      const response = await api.post<MedicalRecord>(`/historias-clinicas/paciente/${patientId}`, data, {
        params: { physicianUserId },
      });
      return response.data;
    } catch {
      return {
        id: 1,
        patientId,
        patientName: 'Lucía Fernández',
        patientDni: '38456123',
        fitzpatrickPhototype: data.fitzpatrickPhototype || 'III',
        hasHta: data.hasHta || false,
        hasDbt: data.hasDbt || false,
        hasHypothyroidism: data.hasHypothyroidism || false,
        hasHyperthyroidism: data.hasHyperthyroidism || false,
        hasAnemia: data.hasAnemia || false,
        hasAutoimmuneDiseases: data.hasAutoimmuneDiseases || false,
        hasGlaucoma: data.hasGlaucoma || false,
        hasCoagulationDisorders: data.hasCoagulationDisorders || false,
        hasScarringAlterations: data.hasScarringAlterations || false,
        allergyAnesthesia: data.allergyAnesthesia || false,
        allergyEgg: data.allergyEgg || false,
        allergyFish: data.allergyFish || false,
        habitTobacco: data.habitTobacco || false,
        habitAlcohol: data.habitAlcohol || false,
        habitSunExposure: data.habitSunExposure || false,
        habitSpfUse: data.habitSpfUse || true,
        informedConsentSigned: true,
        treatmentPlan: data.treatmentPlan || '',
        createdAt: '2026-08-01T10:00:00Z',
        updatedAt: new Date().toISOString(),
      };
    }
  },
  /** Notas clínicas de un paciente (más recientes primero, con serviceName). */
  getClinicalEntriesByPatient: async (patientId: number): Promise<ClinicalEntry[]> => {
    try {
      const response = await api.get<ClinicalEntry[]>(`/historias-clinicas/paciente/${patientId}/entradas`);
      if (!Array.isArray(response.data)) throw new Error('Expected array');
      return [...response.data].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch (err) {
      if (!isNetworkError(err) && !(err instanceof Error && err.message === 'Expected array')) throw err;
      return [
        {
          id: 1,
          patientId,
          appointmentId: 102,
          serviceName: 'Toxina Botulínica (Frente y Patas de Gallo)',
          authorUserId: 2,
          authorFullName: 'Dra. Paula Villa Fuhrmann',
          content: 'Aplicación de 24U de toxina botulínica en tercio superior. Buena tolerancia. Control en 15 días.',
          createdAt: '2026-08-20T16:00:00Z',
          updatedAt: '2026-08-20T16:00:00Z',
        },
        {
          id: 2,
          patientId,
          appointmentId: 101,
          serviceName: 'Peeling Químico Facial (Ácido Mandélico + Retinol)',
          authorUserId: 2,
          authorFullName: 'Dra. Paula Villa Fuhrmann',
          content: 'Sesión 1: peeling de ácido mandélico 30% durante 4 minutos. Se indica FPS 50+ cada 3 horas.',
          createdAt: '2026-07-30T11:00:00Z',
          updatedAt: '2026-07-30T11:00:00Z',
        },
      ];
    }
  },
  addClinicalEntry: async (appointmentId: number, content: string): Promise<ClinicalEntry> => {
    try {
      const response = await api.post<ClinicalEntry>(
        '/historias-clinicas/entradas',
        { appointmentId, content },
        { params: { physicianUserId: currentUserId() } }
      );
      return response.data;
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      return {
        id: Date.now(),
        appointmentId,
        authorUserId: currentUserId() ?? 2,
        authorFullName: localStorage.getItem('fullName') || 'Dra. Paula Villa Fuhrmann',
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },
  /** Edita una nota clínica (queda auditada en el backend). No se puede eliminar. */
  updateClinicalEntry: async (entryId: number, content: string): Promise<ClinicalEntry> => {
    try {
      const response = await api.put<ClinicalEntry>(
        `/historias-clinicas/entradas/${entryId}`,
        { content },
        { params: { physicianUserId: currentUserId() } }
      );
      return response.data;
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      return {
        id: entryId,
        appointmentId: 0,
        authorUserId: currentUserId() ?? 2,
        authorFullName: localStorage.getItem('fullName') || 'Dra. Paula Villa Fuhrmann',
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },
  getAuditLogs: async (): Promise<ClinicalAuditLog[]> => {
    try {
      const response = await api.get<ClinicalAuditLog[]>('/historias-clinicas/auditoria');
      if (!Array.isArray(response.data)) throw new Error('Expected array');
      return response.data;
    } catch {
      return [
        {
          id: 101,
          medicalRecordId: 1,
          modifiedByUserId: 2,
          modifiedByFullName: 'Dra. Valeria Gómez',
          action: 'UPDATE_ANAMNESIS',
          timestamp: '2026-08-22T02:45:00Z',
          ipAddress: '192.168.1.45',
          reason: 'Control post-peeling y ajuste de antecedentes',
          previousStateJson: { fitzpatrickPhototype: 'II', allergyAnesthesia: false },
          newStateJson: { fitzpatrickPhototype: 'III', allergyAnesthesia: true },
        },
      ];
    }
  },
};

// --- SERVICIO DE ASISTENTE CON GOOGLE GEMINI API ---
export const chatApi = {
  sendMessageToGemini: async (message: string, history?: { role: string; text: string }[]): Promise<GeminiChatResponse> => {
    const response = await api.post<GeminiChatResponse>('/chat/gemini', { message, history });
    return response.data;
  },
};

export const chatbotApi = {
  sendMessage: async (message: string): Promise<string> => {
    try {
      const res = await chatApi.sendMessageToGemini(message);
      return res.reply;
    } catch {
      return '¡Hola! 🌿 Los tratamientos más solicitados son el Peeling Mandélico ($42.000 ARS con seña de $21.000 ARS) y la Toxina Botulínica ($65.000 ARS con seña de $32.500 ARS). Para reservar, escribinos por WhatsApp y coordinamos tu turno.';
    }
  },
};

export default api;
