/**
 * Definiciones de Tipos de TypeScript sincronizadas con los DTOs y Modelos de Dominio del Backend Spring Boot.
 */

export type UserRole = 'ADMIN' | 'PHYSICIAN' | 'RECEPTIONIST'; // Roles de usuario RBAC

export interface AuthResponse {
  token: string; // Token JWT firmado
  tokenType: string; // 'Bearer'
  userId: number; // ID del usuario
  username: string; // Nombre de usuario
  fullName: string; // Nombre completo
  role: UserRole; // Rol asignado
  expiresInMs: number; // Milisegundos de vigencia
}

export interface Patient {
  id: number; // Identificador
  name: string; // Nombre y apellido
  dni: string; // DNI argentino
  phone: string; // Teléfono
  email: string; // Email único
  birthDate?: string; // Fecha de nacimiento (YYYY-MM-DD)
  profession?: string; // Ocupación
  active: boolean; // Estado activo
  createdAt: string; // Fecha de alta
}

export interface DermatologicService {
  id: number;
  name: string; // Nombre del tratamiento
  description: string; // Detalle clínico
  durationMinutes: number; // Duración en minutos
  basePrice: number; // Precio base actual en ARS
  depositPercentage: number; // Porcentaje de seña (ej. 50%)
  followUpIntervalDays?: number; // Días recomendados para control
  active: boolean;
}

export type AppointmentStatus =
  | 'PENDING_PAYMENT' // Bloqueo temporal de 10 min
  | 'CONFIRMED'       // Seña abonada
  | 'CANCELLED'       // Cancelado
  | 'COMPLETED'       // Finalizado
  | 'PAYMENT_FAILED'  // Expirado o rechazado
  | 'NO_SHOW';        // Inasistencia

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  patientDni: string;
  patientPhone: string;
  serviceId: number;
  serviceName: string;
  startTime: string; // ISO 8601 UTC
  endTime: string; // ISO 8601 UTC
  status: AppointmentStatus;
  agreedPrice: number;
  temporaryHoldDeadline?: string; // Límite de 10 minutos
  rescheduleCount: number;
  version: number; // Control de concurrencia optimista
}

export interface PaymentPreferenceResponse {
  appointmentId: number; // Turno bloqueado
  preferenceId: string; // ID de preferencia MercadoPago
  initPointUrl: string; // URL para pagar en MercadoPago Checkout Pro
  depositAmount: number; // Monto del 50% de la seña
  holdExpiresAt: string; // Fecha y hora límite (10 min)
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  patientName: string;
  patientDni: string;
  // Antecedentes patológicos
  hasHta: boolean;
  hasDbt: boolean;
  hasHypothyroidism: boolean;
  hasHyperthyroidism: boolean;
  hasAnemia: boolean;
  hasAutoimmuneDiseases: boolean;
  hasGlaucoma: boolean;
  hasCoagulationDisorders: boolean;
  hasScarringAlterations: boolean;
  otherPathological?: string;
  // Alergias
  allergyAnesthesia: boolean;
  allergyEgg: boolean;
  allergyFish: boolean;
  otherAllergies?: string;
  // Hábitos
  habitTobacco: boolean;
  habitAlcohol: boolean;
  habitSunExposure: boolean;
  habitSpfUse: boolean;
  // Quirúrgicos y medicamentos
  surgicalHistory?: string;
  gynecologicalHistory?: string;
  currentMedications?: string;
  previousAestheticTreatments?: string;
  // Evaluación clínica
  fitzpatrickPhototype: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
  physicalExamination?: string;
  treatmentPlan?: string;
  informedConsentSigned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalEntry {
  id: number;
  medicalRecordId: number;
  appointmentId: number;
  authorUserId: number;
  authorFullName: string;
  content: string; // Notas de evolución, unidades inyectadas, zonas
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalAuditLog {
  id: number;
  medicalRecordId: number;
  modifiedByUserId: number;
  modifiedByFullName: string;
  action: string;
  previousStateJson?: any;
  newStateJson?: any;
  timestamp: string;
  ipAddress: string;
  reason?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GeminiChatResponse {
  reply: string; // Respuesta empática generada por Gemini
  suggestedServices: string[]; // Sugerencias detectadas
  bookingActionUrl: string; // Enlace directo a reserva
}
