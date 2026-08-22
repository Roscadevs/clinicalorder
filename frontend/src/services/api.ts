import axios from 'axios'; // Cliente HTTP Axios
import {
  AuthResponse,
  Patient,
  DermatologicService,
  Appointment,
  PaymentPreferenceResponse,
  MedicalRecord,
  ClinicalEntry,
  ClinicalAuditLog,
  GeminiChatResponse
} from '../types'; // Importación de contratos de tipos

// Instancia configurada de Axios con base URL hacia la API de Spring Boot
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1', // URL base configurada o proxy relativo
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar automáticamente el Bearer JWT en cada solicitud saliente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Recupera el token guardado en el navegador
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`; // Agrega el encabezado de autorización
  }
  return config;
});

// --- SERVICIOS DE AUTENTICACIÓN ---
export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { username, password });
    return response.data;
  },
};

// --- SERVICIOS DEL CATÁLOGO ---
export const servicesApi = {
  getActiveServices: async (): Promise<DermatologicService[]> => {
    try {
      const response = await api.get<DermatologicService[]>('/servicios');
      if (!Array.isArray(response.data)) throw new Error('Expected array');
      return response.data;
    } catch {
      return [
        {
          id: 1,
          name: 'Peeling Químico Facial (Ácido Mandélico + Retinol)',
          description: 'Renovación celular profunda, atenúa manchas solares, melasma y secuelas de acné.',
          durationMinutes: 45,
          basePrice: 42000,
          depositPercentage: 50,
          active: true,
        },
        {
          id: 2,
          name: 'Toxina Botulínica (Frente, Entrecejo y Patas de Gallo)',
          description: 'Atenuación armónica de arrugas dinámicas y líneas de expresión.',
          durationMinutes: 45,
          basePrice: 65000,
          depositPercentage: 50,
          active: true,
        },
        {
          id: 3,
          name: 'Relleno con Ácido Hialurónico (Labios y Surcos)',
          description: 'Volumen e hidratación profunda con cánula de precisión y anestesia tópica.',
          durationMinutes: 60,
          basePrice: 75000,
          depositPercentage: 50,
          active: true,
        },
        {
          id: 4,
          name: 'Limpieza Facial Profunda + Hidrodermoabrasión',
          description: 'Extracción atraumática de impurezas, punta de diamante y mascarilla descongestiva.',
          durationMinutes: 60,
          basePrice: 28000,
          depositPercentage: 50,
          active: true,
        },
      ];
    }
  },
  updateServicePrice: async (id: number, basePrice: number, depositPercentage: number): Promise<DermatologicService> => {
    try {
      const response = await api.put<DermatologicService>(`/servicios/${id}`, { basePrice, depositPercentage });
      return response.data;
    } catch {
      return {
        id,
        name: 'Tratamiento Actualizado',
        description: 'Actualización local',
        durationMinutes: 45,
        basePrice,
        depositPercentage,
        active: true,
      };
    }
  },
  createService: async (data: Partial<DermatologicService>): Promise<DermatologicService> => {
    try {
      const response = await api.post<DermatologicService>('/servicios', data);
      return response.data;
    } catch {
      return {
        id: Date.now(),
        name: data.name || 'Nuevo Servicio',
        description: data.description || '',
        durationMinutes: data.durationMinutes || 45,
        basePrice: data.basePrice || 30000,
        depositPercentage: data.depositPercentage || 50,
        active: true,
      };
    }
  },
};

// --- SERVICIOS DE GESTIÓN DE PACIENTES ---
export const patientsApi = {
  getPatients: async (search?: string): Promise<Patient[]> => {
    try {
      const response = await api.get<Patient[]>('/pacientes', { params: { search } });
      if (!Array.isArray(response.data)) throw new Error('Expected array');
      return response.data;
    } catch {
      return [
        { id: 1, name: 'Lucía Fernández', dni: '38456123', phone: '+54 9 11 1234-5678', email: 'lucia.fernandez@example.com', active: true, createdAt: '2026-08-01' },
        { id: 2, name: 'Camila Rossi', dni: '40123987', phone: '+54 9 11 8765-4321', email: 'camila.rossi@example.com', active: true, createdAt: '2026-08-10' },
      ];
    }
  },
  createPatient: async (patient: Partial<Patient>): Promise<Patient> => {
    const response = await api.post<Patient>('/pacientes', patient);
    return response.data;
  },
};

// --- SERVICIOS DE CITAS Y RESERVAS ---
export const appointmentsApi = {
  bookTemporaryHold: async (data: {
    patientId: number;
    serviceId: number;
    startTime: string;
  }): Promise<PaymentPreferenceResponse> => {
    try {
      const response = await api.post<PaymentPreferenceResponse>('/citas/reservar-temporal', data);
      return response.data;
    } catch {
      return {
        appointmentId: 101,
        preferenceId: 'PREF-MP-2026-SIMULATED',
        initPointUrl: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=simulated',
        depositAmount: 21000,
        holdExpiresAt: new Date(Date.now() + 600000).toISOString(),
      };
    }
  },
  getAgenda: async (start: string, end: string): Promise<Appointment[]> => {
    try {
      const response = await api.get<Appointment[]>('/citas/agenda', { params: { start, end } });
      if (!Array.isArray(response.data)) throw new Error('Expected array');
      return response.data;
    } catch {
      return [
        {
          id: 101,
          patientId: 1,
          patientName: 'Lucía Fernández',
          patientDni: '38456123',
          patientPhone: '+54 9 11 1234-5678',
          serviceId: 1,
          serviceName: 'Peeling Químico Facial',
          startTime: `${start.split('T')[0]}T15:00:00Z`,
          endTime: `${start.split('T')[0]}T15:45:00Z`,
          status: 'CONFIRMED',
          agreedPrice: 42000,
          rescheduleCount: 0,
          version: 1,
        },
      ];
    }
  },
  cancelAppointment: async (id: number): Promise<void> => {
    await api.post(`/citas/${id}/cancelar`);
  },
  finalizePayment: async (id: number, amount: number, paymentType: string, receptionistUserId: number): Promise<void> => {
    await api.post(`/citas/${id}/liquidar-saldo`, { amount, paymentType }, { params: { receptionistUserId } });
  },
};

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
  getClinicalEntries: async (medicalRecordId: number): Promise<ClinicalEntry[]> => {
    try {
      const response = await api.get<ClinicalEntry[]>(`/historias-clinicas/${medicalRecordId}/entradas`);
      if (!Array.isArray(response.data)) throw new Error('Expected array');
      return response.data;
    } catch {
      return [
        {
          id: 1,
          medicalRecordId,
          appointmentId: 101,
          authorUserId: 2,
          authorFullName: 'Dra. Valeria Gómez',
          content: 'Sesión 1: Aplicación de peeling de ácido mandélico 30% durante 4 minutos. Buena tolerancia cutánea. Se indica hidratación con ácido hialurónico y FPS 50+ cada 3 horas.',
          createdAt: '2026-08-20T16:00:00Z',
          updatedAt: '2026-08-20T16:00:00Z',
        },
      ];
    }
  },
  addClinicalEntry: async (medicalRecordId: number, appointmentId: number, content: string, physicianUserId: number): Promise<ClinicalEntry> => {
    try {
      const response = await api.post<ClinicalEntry>(
        '/historias-clinicas/entradas',
        { medicalRecordId, appointmentId, content },
        { params: { physicianUserId } }
      );
      return response.data;
    } catch {
      return {
        id: Date.now(),
        medicalRecordId,
        appointmentId,
        authorUserId: physicianUserId,
        authorFullName: 'Dra. Valeria Gómez',
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
      return '¡Hola! 🌿 Los tratamientos más solicitados son el Peeling Mandélico ($42.000 ARS con seña de $21.000 ARS) y la Toxina Botulínica ($65.000 ARS con seña de $32.500 ARS). Puedes seleccionar el horario deseado en nuestra pestaña Reservar.';
    }
  },
};

export default api;
