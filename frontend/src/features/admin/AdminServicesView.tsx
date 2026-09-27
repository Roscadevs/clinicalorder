import React, { useEffect, useMemo, useState } from 'react';
import { Settings, Plus, Pencil, Search, Users, Tag, Clock, CheckCircle2, Ban } from 'lucide-react';
import { servicesApi } from '../../services/api';
import { DermatologicService } from '../../types';
import { Card, Button, Badge, Spinner } from '../../components/ui';
import { ServiceFormModal } from './ServiceFormModal';
import { UserFormModal } from './UserFormModal';
import { cn } from '../../utils/cn';

const ars = (n: number) => `$${n.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
type AdminTab = 'servicios' | 'usuarios';

/**
 * Panel de administración (solo ADMIN): catálogo de servicios/tarifas con buscador,
 * alta/edición y activar/desactivar; y alta de usuarios del staff.
 */
export const AdminServicesView: React.FC = () => {
  const [tab, setTab] = useState<AdminTab>('servicios');
  const [services, setServices] = useState<DermatologicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<DermatologicService | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [userCreated, setUserCreated] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    servicesApi.getAllServicesForAdmin()
      .then((list) => setServices([...list].sort((a, b) => a.name.localeCompare(b.name, 'es'))))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) => s.name.toLowerCase().includes(q) || (s.description ?? '').toLowerCase().includes(q));
  }, [services, query]);

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (s: DermatologicService) => { setEditing(s); setFormOpen(true); };

  const toggleActive = async (s: DermatologicService) => {
    setTogglingId(s.id);
    try {
      await servicesApi.setServiceActive(s, !s.active);
      load();
    } finally {
      setTogglingId(null);
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
              <p className="text-xs text-sand-500">Catálogo de tratamientos y gestión de usuarios.</p>
            </div>
          </div>
          <div className="bg-sand-100 p-1 rounded-xl flex items-center gap-1 border border-sand-200 self-start">
            {([['servicios', 'Servicios', Tag], ['usuarios', 'Usuarios', Users]] as const).map(([id, label, Icon]) => (
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
          {/* Buscador + alta */}
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
            <Button onClick={openNew} leftIcon={<Plus className="w-4 h-4" />}>Agregar tratamiento</Button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center"><Spinner label="Cargando servicios" /></div>
          ) : filtered.length === 0 ? (
            <Card><p className="text-sm text-sand-500 py-4 text-center">No hay tratamientos que coincidan con la búsqueda.</p></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((s) => (
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
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50" title="Editar" aria-label="Editar tratamiento">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  {s.description && <p className="text-xs text-sand-600 leading-relaxed line-clamp-2">{s.description}</p>}

                  <div className="flex items-baseline justify-between pt-3 border-t border-sand-100">
                    <div>
                      <span className="text-[10px] text-sand-400 uppercase font-bold block">Precio</span>
                      <span className="font-display text-base font-extrabold text-sand-900">{ars(s.basePrice)} ARS</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-primary-600 uppercase font-bold block">Seña {s.depositPercentage}%</span>
                      <span className="text-sm font-bold text-primary-700">{ars((s.basePrice * s.depositPercentage) / 100)} ARS</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={s.active ? 'ghost' : 'success'}
                    fullWidth
                    isLoading={togglingId === s.id}
                    onClick={() => toggleActive(s)}
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
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-sand-900">Usuarios del staff</h3>
              <p className="text-xs text-sand-500">Creá cuentas para secretaria, doctora u otro administrador.</p>
            </div>
            <Button onClick={() => setUserFormOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>Crear usuario</Button>
          </div>
          {userCreated && (
            <div className="p-3 rounded-xl bg-success-50 border border-success-100 text-success-700 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Usuario <strong>{userCreated}</strong> creado correctamente.
            </div>
          )}
          <p className="text-xs text-sand-400">
            El listado y la edición de usuarios existentes se agregará en una próxima etapa.
          </p>
        </Card>
      )}

      <ServiceFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} service={editing} onSaved={load} />
      <UserFormModal
        isOpen={userFormOpen}
        onClose={() => setUserFormOpen(false)}
        onCreated={() => { setUserCreated('nuevo'); setTimeout(() => setUserCreated(null), 4000); }}
      />
    </div>
  );
};
