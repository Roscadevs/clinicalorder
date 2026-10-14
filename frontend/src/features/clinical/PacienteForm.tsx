import React, { useState, useEffect, useMemo } from 'react';
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
  Save,
  Pencil,
  X,
} from 'lucide-react';
import { Card, Button, Input, Callout, toast } from '../../components/ui';
import { Patient } from '../../types';
import { patientsApi } from '../../services/api';
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
  /** Paciente existente para modo edición (si está presente, el formulario edita) */
  patient?: Patient;
  /** Callback invocado tras la confirmación exitosa con la entidad creada o modificada */
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
 * Componente Quirúrgico de Alta y Edición de Pacientes (Defensive UI & Zero-Trust).
 * Valida estrictamente todos los campos clínicos antes de persistir en el servidor.
 */
export const PacienteForm: React.FC<PacienteFormProps> = ({
  patient,
  onSuccess,
  onCancel,
  initialQuery,
  showHeader = true,
  className,
}) => {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const isEditMode = Boolean(patient);

  // Detección automática del valor inicial (si son sólo números asumimos DNI, sino Nombre)
  const defaultValues = useMemo<PacienteFormData>(() => {
    if (patient) {
      return {
        name: patient.name || '',
        dni: patient.dni || '',
        phone: patient.phone || '',
        email: patient.email || '',
        birthDate: patient.birthDate || '',
      };
    }
    const isQueryNumeric = initialQuery ? /^[0-9.\s-]+$/.test(initialQuery.trim()) : false;
    return {
      name: !isQueryNumeric && initialQuery ? initialQuery.trim() : '',
      dni: isQueryNumeric && initialQuery ? initialQuery.replace(/[\.\s\-]/g, '') : '',
      phone: '',
      email: '',
      birthDate: '',
    };
  }, [patient, initialQuery]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty, isSubmitted },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    mode: 'onChange', // Validación reactiva en tiempo real para feedback inmediato
    defaultValues,
  });

  // Si cambia el paciente o el initialQuery externamente, reseteamos con los nuevos datos
  useEffect(() => {
    reset(defaultValues);
    setServerError(null);
  }, [defaultValues, reset]);

  /**
   * Envío del formulario:
   * 1. Sanitización defensiva (limpieza de puntos en DNI, trim de cadenas).
   * 2. Invocación al servicio patientsApi (updatePatient o createPatient).
   * 3. Manejo de errores RFC 7807 o colisiones de unicidad.
   * 4. Transición visual y ejecución del callback onSuccess.
   */
  const onSubmit = async (data: PacienteFormData) => {
    setServerError(null);
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

    try {
      let savedPatient: Patient;
      if (isEditMode && patient) {
        savedPatient = await patientsApi.updatePatient(patient.id, sanitizedData);
        toast.success('Datos del paciente actualizados exitosamente');
      } else {
        savedPatient = await patientsApi.createPatient(sanitizedData);
        toast.success('Paciente registrado exitosamente');
      }

      setStatus('success');

      setTimeout(() => {
        setStatus('idle');
        if (onSuccess) {
          onSuccess(savedPatient);
        } else if (!isEditMode) {
          reset();
        }
      }, 1000);
    } catch (err: any) {
      setStatus('idle');
      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'No se pudo guardar la información del paciente. Verifique los datos ingresados.';
      setServerError(errorMsg);
      toast.friendlyError('Error al guardar datos del paciente', { description: errorMsg });
    }
  };

  // Botón bloqueado si hay envío activo, o si tras intentar enviar persisten errores
  const isSubmitDisabled = status === 'submitting' || status === 'success' || (isSubmitted && !isValid);

  return (
    <Card className={cn('bg-white border-sand-200 shadow-soft overflow-hidden p-0', className)}>
      {/* CABECERA CLÍNICA */}
      {showHeader && (
        <div className="border-b border-sand-200 bg-sand-50/70 p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              {isEditMode ? <Pencil className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg sm:text-xl font-bold text-sand-900 leading-tight">
                  {isEditMode ? 'Modificar datos del paciente' : 'Alta de Paciente'}
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-700 tracking-wider uppercase">
                  {isEditMode ? 'Edición' : 'Zero-Trust'}
                </span>
              </div>
              <p className="text-xs text-sand-500 mt-0.5">
                {isEditMode
                  ? 'Actualizá los datos de contacto y filiación del paciente.'
                  : 'Validación estricta pre-transaccional según Diccionario de Datos Clínico.'}
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

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6 space-y-5" noValidate>
        {/* ALERTA DEL SERVIDOR SI HUBO ERROR */}
        {serverError && (
          <Callout intent="error" title="No se pudo guardar el paciente" onClose={() => setServerError(null)}>
            {serverError}
          </Callout>
        )}

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
              <span className="text-[10px] font-mono text-sand-400">
                {isEditMode ? 'P-dni · inmutable en edición' : 'P-dni · 7-8 dígitos'}
              </span>
            </div>
            <Input
              id="p-dni"
              placeholder="Ej: 38456123"
              maxLength={10}
              leftIcon={<Fingerprint className="w-4 h-4" />}
              error={errors.dni?.message}
              disabled={isEditMode || status === 'submitting' || status === 'success'}
              {...register('dni')}
            />
            {isEditMode && (
              <p className="text-[11px] text-sand-400 mt-1">El DNI no puede modificarse tras el registro inicial.</p>
            )}
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
              leftIcon={isEditMode ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              className="w-full sm:w-auto min-w-[210px]"
            >
              {isEditMode ? 'Guardar Cambios' : 'Registrar Paciente'}
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
              {isEditMode ? 'Guardando cambios...' : 'Guardando en Supabase...'}
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
              {isEditMode ? '¡Cambios Guardados!' : '¡Paciente Registrado!'}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
