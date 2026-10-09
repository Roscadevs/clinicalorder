import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Fingerprint,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Loader2,
  UserPlus,
  AlertCircle,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import { Patient } from '../../types';
import { cn } from '../../utils/cn';

/**
 * ---------------------------------------------------------------------------
 * ESQUEMA DE VALIDACIÓN DEFENSIVA (ZOD & ZERO-TRUST)
 * ---------------------------------------------------------------------------
 * Mapeo exacto de restricciones del Diccionario de Datos de la entidad PACIENTE
 * y restricciones DDL de Supabase / PostgreSQL:
 *  - P-nombre: VARCHAR(100) NOT NULL, longitud entre 2 y 100 caracteres.
 *  - P-dni: VARCHAR(8) NOT NULL CHECK (dni ~ '^[0-9]{7,8}$'). Exactamente 7-8 dígitos.
 *  - P-telefono: VARCHAR(20) NOT NULL UNIQUE. Formato telefónico básico (8 a 20 chars).
 *  - P-email: VARCHAR(100) NOT NULL UNIQUE. Formato email estándar válido.
 *  - P-fecha_nacimiento: DATE NOT NULL. Fecha válida, nunca en el futuro (<= hoy), > 1900.
 */
const PHONE_REGEX = /^\+?[0-9\s\-()]{8,20}$/;

export const pacienteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres (P-nombre)')
    .max(100, 'El nombre no puede superar los 100 caracteres (P-nombre)'),
  dni: z
    .string()
    .min(1, 'El DNI es obligatorio (P-dni)')
    .refine((val) => /^[0-9]{7,8}$/.test(val.replace(/[\.\s\-]/g, '')), {
      message: 'El DNI debe contener exactamente 7 u 8 dígitos numéricos (P-dni)',
    }),
  phone: z
    .string()
    .trim()
    .min(8, 'El teléfono debe tener al menos 8 dígitos (P-telefono)')
    .max(20, 'El teléfono no puede superar los 20 caracteres (P-telefono)')
    .regex(PHONE_REGEX, 'Formato telefónico inválido (ej: +54 9 11 1234-5678) (P-telefono)'),
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio (P-email)')
    .email('Debe ingresar un correo electrónico válido (P-email)')
    .max(100, 'El correo electrónico no puede superar los 100 caracteres (P-email)'),
  birthDate: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria (P-fecha_nacimiento)')
    .refine(
      (val) => {
        if (!val) return false;
        const selected = new Date(val + 'T00:00:00');
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return !isNaN(selected.getTime()) && selected <= today;
      },
      { message: 'La fecha de nacimiento no puede ser una fecha futura (P-fecha_nacimiento)' }
    )
    .refine(
      (val) => {
        if (!val) return false;
        const selected = new Date(val + 'T00:00:00');
        const minDate = new Date('1900-01-01T00:00:00');
        return selected >= minDate;
      },
      { message: 'La fecha de nacimiento no puede ser anterior al año 1900' }
    ),
});

export type PacienteFormData = z.infer<typeof pacienteSchema>;

export interface PacienteFormProps {
  /** Callback invocado tras la confirmación exitosa con la entidad creada */
  onSuccess?: (patient: Patient) => void;
  /** Callback opcional de cancelación o cierre */
  onCancel?: () => void;
  /** Pre-llenado automático de búsqueda previa (ej: query no encontrada en reserva) */
  initialQuery?: string;
  /** Ocultar cabecera cuando el componente está embebido en modales con título propio */
  showHeader?: boolean;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

type SubmissionStatus = 'idle' | 'submitting' | 'success';

/** Retorna la fecha de hoy en zona horaria de Argentina (YYYY-MM-DD) para bloquear fechas futuras en el picker nativo */
const getTodayDateString = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

/**
 * Componente Quirúrgico de Alta de Pacientes (Defensive UI & Zero-Trust).
 * Valida estrictamente todos los campos clínicos antes de permitir la interacción con Supabase.
 */
export const PacienteForm: React.FC<PacienteFormProps> = ({
  onSuccess,
  onCancel,
  initialQuery,
  showHeader = true,
  className,
}) => {
  const [status, setStatus] = useState<SubmissionStatus>('idle');

  // Detección automática del valor inicial (si son sólo números asumimos DNI, sino Nombre)
  const isQueryNumeric = initialQuery ? /^[0-9.\s-]+$/.test(initialQuery.trim()) : false;
  const defaultDni = isQueryNumeric ? initialQuery?.replace(/[\.\s\-]/g, '') : '';
  const defaultName = !isQueryNumeric && initialQuery ? initialQuery.trim() : '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty, isSubmitted },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    mode: 'onChange', // Validación reactiva en tiempo real para feedback inmediato
    defaultValues: {
      name: defaultName,
      dni: defaultDni,
      phone: '',
      email: '',
      birthDate: '',
    },
  });

  // Si cambia el initialQuery externamente, reseteamos con los nuevos datos
  useEffect(() => {
    if (initialQuery) {
      const numeric = /^[0-9.\s-]+$/.test(initialQuery.trim());
      reset({
        name: !numeric ? initialQuery.trim() : '',
        dni: numeric ? initialQuery.replace(/[\.\s\-]/g, '') : '',
        phone: '',
        email: '',
        birthDate: '',
      });
    }
  }, [initialQuery, reset]);

  /**
   * Envío del formulario:
   * 1. Sanitización defensiva (limpieza de puntos en DNI, trim de cadenas).
   * 2. Simulación de latencia de red (2 segundos).
   * 3. Logging estructurado del payload para Supabase y trazabilidad del Diccionario de Datos.
   * 4. Transición visual a Success (1.5 segundos) y ejecución de callback onSuccess.
   */
  const onSubmit = async (data: PacienteFormData) => {
    setStatus('submitting');

    // Sanitización defensiva
    const sanitizedDni = data.dni.replace(/[\.\s\-]/g, '');
    const sanitizedData: PacienteFormData = {
      name: data.name.trim(),
      dni: sanitizedDni,
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      birthDate: data.birthDate,
    };

    // Simulación de transacción asíncrona hacia Supabase (2 segundos)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Registro de auditoría y payload de base de datos
    console.group('🧬 [Defensive UI] Alta Quirúrgica de Paciente Validada');
    console.info('Diccionario de Datos (Mapeo Entidad PACIENTE):', {
      'P-nombre': sanitizedData.name,
      'P-dni': sanitizedData.dni,
      'P-telefono': sanitizedData.phone,
      'P-email': sanitizedData.email,
      'P-fecha_nacimiento': sanitizedData.birthDate,
    });
    console.info('Payload para Transacción SQL Supabase (sp_alta_paciente / INSERT):', {
      name: sanitizedData.name,
      dni: sanitizedData.dni,
      phone: sanitizedData.phone,
      email: sanitizedData.email,
      birth_date: sanitizedData.birthDate,
      active: true,
    });
    console.groupEnd();

    setStatus('success');

    const createdPatient: Patient = {
      id: Date.now(),
      name: sanitizedData.name,
      dni: sanitizedData.dni,
      phone: sanitizedData.phone,
      email: sanitizedData.email,
      birthDate: sanitizedData.birthDate,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Pausa visual de 1.5s en estado Success antes de notificar o reiniciar
    setTimeout(() => {
      setStatus('idle');
      if (onSuccess) {
        onSuccess(createdPatient);
      } else {
        reset();
      }
    }, 1500);
  };

  // Botón bloqueado si hay envío activo, o si tras intentar enviar persisten errores
  const isSubmitDisabled = status === 'submitting' || status === 'success' || (isSubmitted && !isValid);

  return (
    <Card className={cn('bg-white border-sand-200 shadow-soft overflow-hidden p-0', className)}>
      {/* CABECERA CLÍNICA HIGH-TICKET */}
      {showHeader && (
        <div className="border-b border-sand-200 bg-sand-50/70 p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg sm:text-xl font-bold text-sand-900 leading-tight">
                  Alta de Paciente
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-700 tracking-wider uppercase">
                  Zero-Trust
                </span>
              </div>
              <p className="text-xs text-sand-500 mt-0.5">
                Validación estricta pre-transaccional según Diccionario de Datos Clínico.
              </p>
            </div>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sand-400 hover:text-sand-600 transition-colors p-1.5 rounded-lg hover:bg-sand-100"
              aria-label="Cerrar formulario"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* FORMULARIO QUIRÚRGICO */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6 space-y-5" noValidate>
        {/* ALERTA PREVENTIVA SI HAY ERRORES SEMÁNTICOS */}
        {isSubmitted && !isValid && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-700 text-xs animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-danger-600" />
            <div>
              <p className="font-bold">El formulario contiene campos inválidos.</p>
              <p className="text-danger-600/90 mt-0.5">
                Revise los campos señalados en rojo para evitar el rechazo de la transacción en la base de datos médica.
              </p>
            </div>
          </div>
        )}

        {/* 1. CAMPO: P-nombre */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="p-nombre" className="text-xs font-bold text-sand-800 flex items-center gap-1.5">
              <span>Nombre Completo</span>
              <span className="text-danger-500 font-bold">*</span>
            </label>
            <span className="text-[10px] font-mono text-sand-400">P-nombre · máx. 100 car.</span>
          </div>
          <Input
            id="p-nombre"
            placeholder="Ej: Lucía Valentina Fernández"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            disabled={status === 'submitting' || status === 'success'}
            {...register('name')}
          />
        </div>

        {/* FILA DE 2 COLUMNAS: DNI Y TELÉFONO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 2. CAMPO: P-dni */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="p-dni" className="text-xs font-bold text-sand-800 flex items-center gap-1.5">
                <span>DNI</span>
                <span className="text-danger-500 font-bold">*</span>
              </label>
              <span className="text-[10px] font-mono text-sand-400">P-dni · 7-8 dígitos</span>
            </div>
            <Input
              id="p-dni"
              placeholder="Ej: 38456123"
              maxLength={10}
              leftIcon={<Fingerprint className="w-4 h-4" />}
              error={errors.dni?.message}
              disabled={status === 'submitting' || status === 'success'}
              {...register('dni')}
            />
          </div>

          {/* 3. CAMPO: P-telefono */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="p-telefono" className="text-xs font-bold text-sand-800 flex items-center gap-1.5">
                <span>Teléfono</span>
                <span className="text-danger-500 font-bold">*</span>
              </label>
              <span className="text-[10px] font-mono text-sand-400">P-telefono · 8-20 car.</span>
            </div>
            <Input
              id="p-telefono"
              type="tel"
              placeholder="Ej: +54 9 11 1234-5678"
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message}
              disabled={status === 'submitting' || status === 'success'}
              {...register('phone')}
            />
          </div>
        </div>

        {/* FILA DE 2 COLUMNAS: EMAIL Y FECHA DE NACIMIENTO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 4. CAMPO: P-email */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="p-email" className="text-xs font-bold text-sand-800 flex items-center gap-1.5">
                <span>Correo Electrónico</span>
                <span className="text-danger-500 font-bold">*</span>
              </label>
              <span className="text-[10px] font-mono text-sand-400">P-email · único</span>
            </div>
            <Input
              id="p-email"
              type="email"
              placeholder="ejemplo@clinica.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              disabled={status === 'submitting' || status === 'success'}
              {...register('email')}
            />
          </div>

          {/* 5. CAMPO: P-fecha_nacimiento */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="p-fecha-nacimiento" className="text-xs font-bold text-sand-800 flex items-center gap-1.5">
                <span>Fecha de Nacimiento</span>
                <span className="text-danger-500 font-bold">*</span>
              </label>
              <span className="text-[10px] font-mono text-sand-400">P-fecha_nacimiento</span>
            </div>
            <Input
              id="p-fecha-nacimiento"
              type="date"
              max={getTodayDateString()} // Doble defensa: restricción en UI nativa
              leftIcon={<Calendar className="w-4 h-4" />}
              error={errors.birthDate?.message}
              disabled={status === 'submitting' || status === 'success'}
              {...register('birthDate')}
            />
          </div>
        </div>

        {/* PIE DE FORMULARIO CON ACCIONES Y BOTÓN DE ESTADO TRIPLE */}
        <div className="pt-3 border-t border-sand-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={status === 'submitting' || status === 'success'}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
          )}

          {/* BOTÓN PRINCIPAL CON 3 ESTADOS: IDLE, SUBMITTING, SUCCESS */}
          {status === 'idle' && (
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitDisabled}
              leftIcon={<UserPlus className="w-4 h-4" />}
              className="w-full sm:w-auto min-w-[210px]"
            >
              Registrar Paciente
            </Button>
          )}

          {status === 'submitting' && (
            <Button
              type="button"
              variant="primary"
              disabled
              isLoading
              className="w-full sm:w-auto min-w-[210px] bg-primary-600"
            >
              Guardando en Supabase...
            </Button>
          )}

          {status === 'success' && (
            <Button
              type="button"
              variant="success"
              disabled
              leftIcon={<CheckCircle2 className="w-4 h-4 text-white" />}
              className="w-full sm:w-auto min-w-[210px] animate-in zoom-in-95 bg-success-600 hover:bg-success-600 text-white"
            >
              ¡Paciente Registrado!
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
