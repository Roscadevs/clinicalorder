import React, { useEffect, useState } from 'react';
import { User as UserIcon, Lock, Mail } from 'lucide-react';
import { authApi, usersApi } from '../../services/api';
import { User, UserRole } from '../../types';
import { Modal, Button, Input, Select, Callout } from '../../components/ui';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSaved: () => void;
}

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'SECRETARIA', label: 'Secretaria' },
  { value: 'DOCTORA', label: 'Doctora' },
  { value: 'ADMIN', label: 'Administrador' },
];

/** Modal dual para Alta y Edición de usuarios operadores del staff (solo ADMIN). */
export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, user, onSaved }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('SECRETARIA');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(user);

  useEffect(() => {
    if (!isOpen) return;
    if (user) {
      setFullName(user.fullName || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setRole(user.role || 'SECRETARIA');
      setPassword('');
    } else {
      setFullName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('SECRETARIA');
    }
    setError(null);
  }, [isOpen, user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (!cleanFullName || !cleanUsername || !cleanEmail) {
      return setError('Completá todos los campos obligatorios.');
    }
    if (cleanUsername.length < 3) {
      return setError('El nombre de usuario debe tener al menos 3 caracteres.');
    }
    if (!isEditing && password.length < 8) {
      return setError('La contraseña inicial debe tener al menos 8 caracteres.');
    }
    if (isEditing && password.length > 0 && password.length < 8) {
      return setError('La nueva contraseña debe tener al menos 8 caracteres.');
    }

    setSaving(true);
    try {
      if (isEditing && user) {
        await usersApi.updateUser(user.id, {
          fullName: cleanFullName,
          username: cleanUsername,
          email: cleanEmail,
          role,
          password: password.trim() ? password.trim() : undefined,
        });
      } else {
        await authApi.register({
          fullName: cleanFullName,
          username: cleanUsername,
          email: cleanEmail,
          password,
          role,
        });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        (isEditing
          ? 'No se pudo actualizar el usuario. Revisá que el nombre de usuario o email no estén en uso.'
          : 'No se pudo crear el usuario. Revisá los datos (¿usuario o email ya existen?).');
      setError(serverMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar usuario del staff' : 'Nuevo usuario del staff'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={submit} isLoading={saving}>
            {isEditing ? 'Guardar cambios' : 'Crear usuario'}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Nombre completo *"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ej. Sofía Gómez"
          leftIcon={<UserIcon className="h-5 w-5" />}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Usuario *"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="sofia.recepcion"
            autoComplete="off"
          />
          <Select label="Rol *" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Select>
        </div>
        <Input
          label="Correo electrónico *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="sofia@clinica.com"
          leftIcon={<Mail className="h-5 w-5" />}
        />
        <Input
          label={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña *'}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isEditing ? 'Dejar en blanco para conservar actual' : 'Mínimo 8 caracteres'}
          leftIcon={<Lock className="h-5 w-5" />}
          autoComplete={isEditing ? 'new-password' : 'current-password'}
        />

        {error && (
          <Callout
            intent="error"
            title={isEditing ? 'Error al actualizar usuario' : 'No se pudo crear el usuario'}
            onClose={() => setError(null)}
          >
            {error}
          </Callout>
        )}
      </form>
    </Modal>
  );
};
