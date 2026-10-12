import React, { useEffect, useState } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { authApi } from '../../services/api';
import { UserRole } from '../../types';
import { Modal, Button, Input, Select, Callout } from '../../components/ui';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'SECRETARIA', label: 'Secretaria' },
  { value: 'DOCTORA', label: 'Doctora' },
  { value: 'ADMIN', label: 'Administrador' },
];

/** Alta de un usuario del staff (solo ADMIN). */
export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('SECRETARIA');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFullName(''); setUsername(''); setEmail(''); setPassword(''); setRole('SECRETARIA'); setError(null);
  }, [isOpen]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !username.trim() || !email.trim()) return setError('Completá todos los campos.');
    if (username.trim().length < 3) return setError('El usuario debe tener al menos 3 caracteres.');
    if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');

    setSaving(true);
    try {
      await authApi.register({ username: username.trim(), password, email: email.trim(), fullName: fullName.trim(), role });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo crear el usuario. Revisá los datos (¿usuario o email ya existen?).');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo usuario del staff"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} isLoading={saving}>Crear usuario</Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input label="Nombre completo *" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ej. Sofía Gómez" leftIcon={<User className="h-5 w-5" />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Usuario *" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="sofia.recepcion" autoComplete="off" />
          <Select label="Rol *" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </Select>
        </div>
        <Input label="Correo electrónico *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sofia@clinica.com" leftIcon={<Mail className="h-5 w-5" />} />
        <Input label="Contraseña *" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" leftIcon={<Lock className="h-5 w-5" />} autoComplete="new-password" />

        {error && (
          <Callout intent="error" title="No se pudo crear el usuario" onClose={() => setError(null)}>
            {error}
          </Callout>
        )}
      </form>
    </Modal>
  );
};
