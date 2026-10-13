import React, { useEffect, useMemo, useState } from 'react';
import {
  Settings,
  Plus,
  Pencil,
  Search,
  Users,
  Tag,
  Clock,
  CheckCircle2,
  Ban,
  UserCheck,
  UserX,
  Mail,
  User as UserIcon,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { servicesApi, usersApi } from '../../services/api';
import { DermatologicService, User, UserRole } from '../../types';
import { Card, Button, Badge, Spinner, Modal } from '../../components/ui';
import { ServiceFormModal } from './ServiceFormModal';
import { UserFormModal } from './UserFormModal';
import { cn } from '../../utils/cn';

const ars = (n: number) => `$${n.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
type AdminTab = 'servicios' | 'usuarios';

const ROLE_CONFIG: Record<UserRole, { label: string; variant: 'primary' | 'info' | 'warning' | 'neutral' }> = {
  ADMIN: { label: 'Administrador', variant: 'primary' },
  DOCTORA: { label: 'Doctora', variant: 'info' },
  SECRETARIA: { label: 'Secretaria', variant: 'warning' },
};

/**
 * Panel de administración (solo ADMIN):
 * - Catálogo de servicios/tarifas con buscador, alta/edición y activar/desactivar.
 * - Nómina de usuarios del staff: listado, buscador, alta, edición y suspensión/reactivación.
 */
export const AdminServicesView: React.FC = () => {
  const [tab, setTab] = useState<AdminTab>('servicios');

  // Servicios
  const [services, setServices] = useState<DermatologicService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [query, setQuery] = useState('');
  const [editingService, setEditingService] = useState<DermatologicService | null>(null);
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [togglingServiceId, setTogglingServiceId] = useState<number | null>(null);

  // Usuarios del Staff
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [userFeedback, setUserFeedback] = useState<string | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [togglingUser, setTogglingUser] = useState(false);

  // Carga de catálogo
  const loadServices = () => {
    setLoadingServices(true);
    servicesApi
      .getAllServicesForAdmin()
      .then((list) => setServices([...list].sort((a, b) => a.name.localeCompare(b.name, 'es'))))
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false));
  };

  // Carga de usuarios
  const loadUsers = () => {
    setLoadingUsers(true);
    usersApi
      .getAllUsers()
      .then((list) => setUsers(list))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  };

  useEffect(() => {
    loadServices();
    loadUsers();
  }, []);

  // Filtros
  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.description ?? '').toLowerCase().includes(q)
    );
  }, [services, query]);

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, userQuery]);

  // Manejadores de servicios
  const openNewService = () => {
    setEditingService(null);
    setServiceFormOpen(true);
  };
  const openEditService = (s: DermatologicService) => {
    setEditingService(s);
    setServiceFormOpen(true);
  };
  const toggleActiveService = async (s: DermatologicService) => {
    setTogglingServiceId(s.id);
    try {
      await servicesApi.setServiceActive(s, !s.active);
      loadServices();
    } finally {
      setTogglingServiceId(null);
    }
  };

  // Manejadores de usuarios
  const openNewUser = () => {
    setEditingUser(null);
    setUserFormOpen(true);
  };
  const openEditUser = (u: User) => {
    setEditingUser(u);
    setUserFormOpen(true);
  };

  const confirmToggleUserActive = async () => {
    if (!userToToggle) return;
    setTogglingUser(true);
    try {
      await usersApi.toggleUserActive(userToToggle.id, !userToToggle.active);
      setUserFeedback(
        `La cuenta de ${userToToggle.fullName} ha sido ${userToToggle.active ? 'suspendida' : 'reactivada'} correctamente.`
      );
      setTimeout(() => setUserFeedback(null), 4500);
      loadUsers();
      setUserToToggle(null);
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.response?.data?.message || 'No se pudo modificar el estado del usuario.');
    } finally {
      setTogglingUser(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 space-y-5">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-500 text-white flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-sand-900">Administración</h2>
              <p className="text-xs text-sand-500">Catálogo de tratamientos y gestión de usuarios del staff.</p>
            </div>
          </div>
          <div className="bg-sand-100 p-1 rounded-xl flex items-center gap-1 border border-sand-200 self-start">
            {(
              [
                ['servicios', 'Servicios', Tag],
                ['usuarios', 'Usuarios', Users],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5',
                  tab === id ? 'bg-white text-primary-700 shadow-sm' : 'text-sand-600 hover:text-sand-900'
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {tab === 'servicios' ? (
        <>
          {/* Buscador + alta de servicios */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar tratamiento por nombre o descripción…"
                aria-label="Buscar tratamiento"
                className="w-full bg-white border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
              />
            </div>
            <Button onClick={openNewService} leftIcon={<Plus className="w-4 h-4" />}>
              Agregar tratamiento
            </Button>
          </div>

          {loadingServices ? (
            <div className="py-12 flex justify-center">
              <Spinner label="Cargando servicios" />
            </div>
          ) : filteredServices.length === 0 ? (
            <Card>
              <p className="text-sm text-sand-500 py-4 text-center">No hay tratamientos que coincidan con la búsqueda.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map((s) => (
                <Card key={s.id} className={cn('space-y-3', !s.active && 'opacity-70')}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-sand-900">{s.name}</h3>
                        <Badge variant={s.active ? 'success' : 'neutral'}>{s.active ? 'Activo' : 'Inactivo'}</Badge>
                      </div>
                      <p className="text-[11px] text-sand-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {s.durationMinutes} min
                      </p>
                    </div>
                    <button
                      onClick={() => openEditService(s)}
                      className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50"
                      title="Editar"
                      aria-label="Editar tratamiento"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  {s.description && (
                    <p className="text-xs text-sand-600 leading-relaxed line-clamp-2">{s.description}</p>
                  )}

                  <div className="flex items-baseline justify-between pt-3 border-t border-sand-100">
                    <div>
                      <span className="text-[10px] text-sand-400 uppercase font-bold block">Precio</span>
                      <span className="font-display text-base font-extrabold text-sand-900">{ars(s.basePrice)} ARS</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-primary-600 uppercase font-bold block">
                        Seña {s.depositPercentage}%
                      </span>
                      <span className="text-sm font-bold text-primary-700">
                        {ars((s.basePrice * s.depositPercentage) / 100)} ARS
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={s.active ? 'ghost' : 'success'}
                    fullWidth
                    isLoading={togglingServiceId === s.id}
                    onClick={() => toggleActiveService(s)}
                    leftIcon={s.active ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  >
                    {s.active ? 'Desactivar' : 'Activar'}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {/* Barra superior de usuarios */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Buscar por nombre, usuario, correo o rol…"
                aria-label="Buscar operador"
                className="w-full bg-white border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
              />
            </div>
            <Button onClick={openNewUser} leftIcon={<Plus className="w-4 h-4" />}>
              Crear usuario
            </Button>
          </div>

          {userFeedback && (
            <div className="p-3.5 rounded-xl bg-success-50 border border-success-200 text-success-800 text-sm flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0" />
              <span>{userFeedback}</span>
            </div>
          )}

          {loadingUsers ? (
            <div className="py-12 flex justify-center">
              <Spinner label="Cargando usuarios del staff" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <div className="text-center py-8 space-y-2">
                <Users className="w-8 h-8 text-sand-400 mx-auto" />
                <p className="text-sm text-sand-600 font-medium">No se encontraron usuarios del staff.</p>
                <p className="text-xs text-sand-400">
                  {userQuery ? 'Probá con otro término de búsqueda.' : 'Podés crear el primer operador con el botón superior.'}
                </p>
              </div>
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden border border-sand-200 shadow-sm">
              {/* Vista desktop en tabla */}
              <div className="overflow-x-auto hidden sm:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-sand-50/80 border-b border-sand-200 text-sand-600 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Operador</th>
                      <th className="py-3 px-4">Usuario</th>
                      <th className="py-3 px-4">Correo Institucional</th>
                      <th className="py-3 px-4">Rol</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {filteredUsers.map((u) => {
                      const roleMeta = ROLE_CONFIG[u.role] || { label: u.role, variant: 'neutral' };
                      return (
                        <tr key={u.id} className={cn('hover:bg-sand-50/50 transition-colors', !u.active && 'bg-sand-50/40 opacity-75')}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-sand-200 text-sand-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {u.fullName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-sand-900">{u.fullName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-sand-600 font-mono text-xs">
                            @{u.username}
                          </td>
                          <td className="py-3.5 px-4 text-sand-600 text-xs">
                            {u.email}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant={roleMeta.variant}>{roleMeta.label}</Badge>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant={u.active ? 'success' : 'neutral'}>
                              {u.active ? 'Activo' : 'Suspendido'}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditUser(u)}
                                leftIcon={<Pencil className="w-3.5 h-3.5" />}
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant={u.active ? 'ghost' : 'success'}
                                onClick={() => setUserToToggle(u)}
                                leftIcon={u.active ? <UserX className="w-3.5 h-3.5 text-sand-500" /> : <UserCheck className="w-3.5 h-3.5" />}
                              >
                                {u.active ? 'Suspender' : 'Reactivar'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Vista móvil en tarjetas táctiles */}
              <div className="sm:hidden divide-y divide-sand-100">
                {filteredUsers.map((u) => {
                  const roleMeta = ROLE_CONFIG[u.role] || { label: u.role, variant: 'neutral' };
                  return (
                    <div key={u.id} className={cn('p-4 space-y-3', !u.active && 'bg-sand-50/40 opacity-75')}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sand-900">{u.fullName}</h4>
                          <p className="text-xs text-sand-500 font-mono">@{u.username}</p>
                        </div>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          <Badge variant={roleMeta.variant}>{roleMeta.label}</Badge>
                          <Badge variant={u.active ? 'success' : 'neutral'}>
                            {u.active ? 'Activo' : 'Suspendido'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-sand-600">
                        <Mail className="w-3.5 h-3.5 text-sand-400" />
                        <span>{u.email}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-sand-100">
                        <Button
                          size="sm"
                          variant="ghost"
                          fullWidth
                          onClick={() => openEditUser(u)}
                          leftIcon={<Pencil className="w-3.5 h-3.5" />}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant={u.active ? 'ghost' : 'success'}
                          fullWidth
                          onClick={() => setUserToToggle(u)}
                          leftIcon={u.active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        >
                          {u.active ? 'Suspender' : 'Reactivar'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Modal de Servicios */}
      <ServiceFormModal
        isOpen={serviceFormOpen}
        onClose={() => setServiceFormOpen(false)}
        service={editingService}
        onSaved={loadServices}
      />

      {/* Modal de Usuarios (Dual: Alta y Edición) */}
      <UserFormModal
        isOpen={userFormOpen}
        onClose={() => {
          setUserFormOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSaved={() => {
          setUserFeedback(
            editingUser
              ? `Datos de ${editingUser.fullName} actualizados correctamente.`
              : 'Nuevo usuario del staff creado con éxito.'
          );
          setTimeout(() => setUserFeedback(null), 4500);
          loadUsers();
        }}
      />

      {/* Diálogo de Confirmación para Suspender / Reactivar Cuenta */}
      {userToToggle && (
        <Modal
          isOpen={Boolean(userToToggle)}
          onClose={() => setUserToToggle(null)}
          title={userToToggle.active ? 'Suspender acceso de usuario' : 'Reactivar cuenta de usuario'}
          footer={
            <>
              <Button variant="ghost" onClick={() => setUserToToggle(null)} disabled={togglingUser}>
                Cancelar
              </Button>
              <Button
                variant={userToToggle.active ? 'danger' : 'success'}
                onClick={confirmToggleUserActive}
                isLoading={togglingUser}
              >
                {userToToggle.active ? 'Confirmar suspensión' : 'Reactivar acceso'}
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-sand-100 border border-sand-200">
              <div className="w-10 h-10 rounded-full bg-sand-200 flex items-center justify-center font-bold text-sand-800">
                {userToToggle.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-sand-900">{userToToggle.fullName}</p>
                <p className="text-xs text-sand-500">@{userToToggle.username} • {userToToggle.email}</p>
              </div>
            </div>

            {userToToggle.active ? (
              <div className="p-3 rounded-xl bg-danger-50 border border-danger-200 text-danger-800 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-danger-600 flex-shrink-0 mt-0.5" />
                <p>
                  Al suspender la cuenta, este operador <strong>no podrá iniciar sesión</strong> en el sistema de la clínica. Sus registros históricos y acciones previas se conservarán intactos.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-success-50 border border-success-200 text-success-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                <p>
                  Al reactivar la cuenta, el operador podrá reanudar su inicio de sesión habitual con su nombre de usuario y contraseña actual.
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
