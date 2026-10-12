import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { authApi } from '../../services/api';
import { Button, Input, Logo } from '../../components/ui';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await authApi.login(username, password);

      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('userId', response.userId.toString());
      localStorage.setItem('fullName', response.fullName);

      // La Agenda es la vista principal del sistema para todos los roles.
      navigate('/app/agenda');
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.status === 401 || err.response?.status === 403) {
        setErrorMsg(err.response?.data?.message || 'Usuario o contraseña incorrectos.');
      } else {
        // FALLBACK: Simulación local si el backend no está conectado (Modo Demo)
        console.warn('Backend no disponible. Iniciando sesión simulada en Modo Demo.');

        let simulatedRole = 'ADMIN';
        let simulatedUserId = 1;
        if (username.includes('recepcion') || username.includes('secretaria')) {
          simulatedRole = 'SECRETARIA';
          simulatedUserId = 3;
        } else if (username.includes('paula') || username.includes('doctora') || username.includes('valeria')) {
          simulatedRole = 'DOCTORA';
          simulatedUserId = 2;
        }

        sessionStorage.removeItem('demo_session_modal_dismissed');
        localStorage.setItem('token', 'demo-token-12345');
        localStorage.setItem('role', simulatedRole);
        localStorage.setItem('userId', String(simulatedUserId));
        localStorage.setItem('fullName', 'Usuario Demo');

        navigate('/app/agenda');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Logo variant="mark" className="w-20 h-20 text-primary-500" />
        <h1 className="mt-5 text-center font-display text-3xl font-bold text-sand-900">
          Acceso al Sistema
        </h1>
        <p className="mt-2 text-center text-sm text-sand-600">Solo para personal autorizado</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-2xl sm:px-10 border border-sand-200">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-100 text-danger-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <Input
              label="Usuario"
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese usuario"
              autoComplete="username"
              leftIcon={<User className="h-5 w-5" />}
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              leftIcon={<Lock className="h-5 w-5" />}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-sand-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-sand-300 rounded"
                />
                Recordarme
              </label>
              <Link
                to="/recover-password"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Ingresar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm font-medium text-sand-500 hover:text-sand-800 transition-colors">
              &larr; Volver a la página principal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
