import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { authApi } from '../../services/api';

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
      
      // Guardar sesión en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('userId', response.userId.toString());
      localStorage.setItem('fullName', response.fullName);

      // Redirigir según el rol
      if (response.role === 'RECEPTIONIST') navigate('/app/agenda');
      else if (response.role === 'PHYSICIAN') navigate('/app/clinical');
      else if (response.role === 'ADMIN') navigate('/app/admin');
      else navigate('/app');
      
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setErrorMsg('Usuario o contraseña incorrectos.');
      } else {
        // FALLBACK: Simulación local si el backend no está conectado (Modo Demo)
        console.warn("Backend no disponible. Iniciando sesión simulada en Modo Demo.");
        
        let simulatedRole = 'ADMIN';
        if (username.includes('recepcion') || username.includes('sofia')) simulatedRole = 'RECEPTIONIST';
        if (username.includes('valeria') || username.includes('medica')) simulatedRole = 'PHYSICIAN';
        
        localStorage.setItem('token', 'demo-token-12345');
        localStorage.setItem('role', simulatedRole);
        localStorage.setItem('userId', '999');
        localStorage.setItem('fullName', 'Usuario Demo');
        
        if (simulatedRole === 'RECEPTIONIST') navigate('/app/agenda');
        else if (simulatedRole === 'PHYSICIAN') navigate('/app/clinical');
        else navigate('/app/admin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Acceso al Sistema
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Solo para personal autorizado
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200">
          
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Usuario (o Correo)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 border outline-none bg-slate-50"
                  placeholder="Ej: admin, dra.valeria"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 border outline-none bg-slate-50"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link to="/recover-password" className="font-medium text-teal-600 hover:text-teal-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Ingresar</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
             <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
               &larr; Volver a la página principal
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

