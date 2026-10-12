import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  KeyRound,
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { Button, Input, toast } from '../../components/ui';
import {
  updatePasswordSchema,
  UpdatePasswordFormData,
} from './schemas/recoverySchemas';

export const UpdatePasswordView: React.FC = () => {
  const navigate = useNavigate();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const currentPassword = watch('password') || '';

  // Validación de sesión activa (generada tras el intercambio PKCE)
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          if (session) {
            setHasValidSession(true);
          } else {
            setHasValidSession(false);
          }
          setIsCheckingSession(false);
        }
      } catch (err) {
        if (isMounted) {
          setHasValidSession(false);
          setIsCheckingSession(false);
        }
      }
    };

    verifySession();

    // Escucha cambios en el estado de autenticación (ej. token expirado o revocado)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        if (event === 'PASSWORD_RECOVERY' || (session && event === 'SIGNED_IN')) {
          setHasValidSession(true);
          setIsCheckingSession(false);
        } else if (event === 'SIGNED_OUT') {
          setHasValidSession(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Criterios de complejidad en tiempo real
  const criteria = [
    { label: 'Mínimo 8 caracteres', met: currentPassword.length >= 8 },
    { label: 'Una letra mayúscula (A-Z)', met: /[A-Z]/.test(currentPassword) },
    { label: 'Una letra minúscula (a-z)', met: /[a-z]/.test(currentPassword) },
    { label: 'Al menos un número (0-9)', met: /[0-9]/.test(currentPassword) },
    {
      label: 'Un carácter especial (!@#$%...)',
      met: /[^A-Za-z0-9]/.test(currentPassword),
    },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Invocación nativa a Supabase Auth para actualizar la credencial del usuario autenticado
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        setApiError(
          error.message ||
            'No se pudo actualizar la contraseña. Es posible que el enlace haya expirado.'
        );
        return;
      }

      // Cierre de sesión temporal para exigir un login limpio con la nueva credencial
      await supabase.auth.signOut();

      toast.success(
        '¡Contraseña actualizada con éxito! Inicia sesión con tu nueva credencial.'
      );

      navigate('/login', { replace: true });
    } catch (err: any) {
      setApiError(
        err?.message || 'Ocurrió un error inesperado al actualizar la contraseña.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Pantalla de carga mientras se valida la sesión PKCE
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-sand-50 flex flex-col justify-center items-center py-12 px-4">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        <p className="mt-4 text-sm text-sand-600 font-medium">
          Verificando sesión segura de recuperación...
        </p>
      </div>
    );
  }

  // 2. Guarda: Sesión inválida o acceso directo no autorizado
  if (!hasValidSession) {
    return (
      <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 shadow-card sm:rounded-2xl sm:px-10 border border-sand-200 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-danger-50 text-danger-600 flex items-center justify-center mx-auto border border-danger-200 shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-sand-900 tracking-tight">
              Sesión No Autorizada
            </h2>
            <p className="text-sm text-sand-600 leading-relaxed">
              Para cambiar tu contraseña debes ingresar mediante el enlace seguro enviado a tu correo institucional.
            </p>
            <div className="pt-2 space-y-3">
              <Link to="/recover-password" className="block w-full">
                <Button fullWidth size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Solicitar enlace de recuperación
                </Button>
              </Link>
              <Link
                to="/login"
                className="block text-sm font-semibold text-sand-600 hover:text-sand-900 transition-colors"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Formulario seguro de cambio de contraseña
  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100">
          <KeyRound className="w-8 h-8" />
        </div>
        <h1 className="mt-5 text-center font-display text-3xl font-bold text-sand-900 tracking-tight">
          Nueva Contraseña
        </h1>
        <p className="mt-2 text-center text-sm text-sand-600 max-w-sm">
          Define una credencial segura para restablecer el acceso a tu cuenta
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-2xl sm:px-10 border border-sand-200">
          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-danger-600 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Campo Nueva Contraseña */}
            <div className="space-y-1.5">
              <Input
                label="Nueva Contraseña"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••••••"
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sand-400 hover:text-sand-700 transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                disabled={isLoading}
                {...register('password')}
              />

              {/* Medidor visual de seguridad */}
              {currentPassword.length > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="flex gap-1.5 h-1.5 w-full">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                          lvl <= metCount
                            ? metCount <= 2
                              ? 'bg-danger-500'
                              : metCount <= 4
                              ? 'bg-warning-500'
                              : 'bg-success-500'
                            : 'bg-sand-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-xs text-sand-600 pt-1">
                    {criteria.map((c, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-1.5 ${
                          c.met ? 'text-success-700 font-medium' : 'text-sand-500'
                        }`}
                      >
                        {c.met ? (
                          <Check className="w-3.5 h-3.5 text-success-600 flex-shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-sand-400 flex-shrink-0" />
                        )}
                        <span>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Campo Confirmar Contraseña */}
            <Input
              label="Confirmar Nueva Contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••••••"
              leftIcon={<ShieldCheck className="h-5 w-5" />}
              rightIcon={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-sand-400 hover:text-sand-700 transition-colors focus:outline-none"
                  aria-label={
                    showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Guardar Nueva Contraseña
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-sand-100 pt-5">
            <Link
              to="/login"
              className="text-sm font-semibold text-sand-600 hover:text-sand-900 transition-colors"
            >
              Cancelar y volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
