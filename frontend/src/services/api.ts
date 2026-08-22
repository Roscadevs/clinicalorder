import axios from 'axios'; // Cliente HTTP Axios
import {
  AuthResponse,
  Patient,
  DermatologicService,
  Appointment,
  PaymentPreferenceResponse,
  MedicalRecord,
  ClinicalEntry,
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
    const response = await api.get<DermatologicService[]>('/servicios');
    return response.data;
  },
};

// --- SERVICIOS DE GESTIÓN DE PACIENTES ---
export const patientsApi = {
  getPatients: async (search?: string): Promise<Patient[]> => {
    const response = await api.get<Patient[]>('/pacientes', { params: { search } });
    return response.data;
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
    const response = await api.post<PaymentPreferenceResponse>('/citas/reservar-temporal', data);
    return response.data;
  },
  getAgenda: async (start: string, end: string): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/citas/agenda', { params: { start, end } });
    return response.data;
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
      return null;
    }
  },
  saveMedicalRecord: async (patientId: number, data: Partial<MedicalRecord>, physicianUserId: number): Promise<MedicalRecord> => {
    const response = await api.post<MedicalRecord>(`/historias-clinicas/paciente/${patientId}`, data, {
      params: { physicianUserId },
    });
    return response.data;
  },
  getClinicalEntries: async (medicalRecordId: number): Promise<ClinicalEntry[]> => {
    const response = await api.get<ClinicalEntry[]>(`/historias-clinicas/${medicalRecordId}/entradas`);
    return response.data;
  },
  addClinicalEntry: async (medicalRecordId: number, appointmentId: number, content: string, physicianUserId: number): Promise<ClinicalEntry> => {
    const response = await api.post<ClinicalEntry>(
      '/historias-clinicas/entradas',
      { medicalRecordId, appointmentId, content },
      { params: { physicianUserId } }
    );
    return response.data;
  },
};

// --- SERVICIO DE ASISTENTE CON GOOGLE GEMINI API ---
export const chatApi = {
  sendMessageToGemini: async (message: string, history?: { role: string; text: string }[]): Promise<GeminiChatResponse> => {
    const response = await api.post<GeminiChatResponse>('/chat/gemini', { message, history });
    return response.data;
  },
};

export default api;
