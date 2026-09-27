import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Key, CheckCircle } from 'lucide-react';
import { Button, Input } from '../../components/ui';

export const PasswordRecoveryView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula el envío del correo de recuperación
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
          <Key className="w-8 h-8" />
        </div>
        <h1 className="mt-5 text-center font-display text-3xl font-bold text-sand-900">
          Recuperar Contraseña
        </h1>
        <p className="mt-2 text-center text-sm text-sand-600">
          Ingresa tu correo para recibir un enlace de recuperación
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-2xl sm:px-10 border border-sand-200">
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Correo Electrónico"
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                leftIcon={<Mail className="h-5 w-5" />}
              />

              <Button type="submit" fullWidth size="lg">
                Enviar Enlace de Recuperación
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-success-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-success-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-sand-900">¡Enlace enviado!</h3>
              <p className="text-sm text-sand-600">
                Revisa la bandeja de entrada de <strong className="text-sand-800">{email}</strong> para
                continuar con la recuperación.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              &larr; Volver al Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
