/**
 * Configuración de la navegación del panel interno, compartida por Navbar y BottomNav.
 * Fuente única de verdad para las pestañas, sus íconos, rutas y roles habilitados.
 */
export type TabType = 'booking' | 'agenda' | 'clinical' | 'admin' | 'analytics';
export type RoleType = 'PUBLIC' | 'SECRETARIA' | 'DOCTORA' | 'ADMIN';

/** Nombre del ícono de lucide (se resuelve en cada componente). */
export type NavIcon = 'Calendar' | 'UserCheck' | 'ShieldCheck' | 'Settings' | 'BarChart3';

export interface NavTab {
  id: TabType;
  label: string;
  shortLabel: string; // Etiqueta corta para la barra inferior móvil
  icon: NavIcon;
  path: string;
  roles: RoleType[];
}

export const NAV_TABS: NavTab[] = [
  {
    id: 'booking',
    label: 'Reservar',
    shortLabel: 'Reservar',
    icon: 'Calendar',
    path: '/app/booking',
    roles: ['SECRETARIA', 'DOCTORA', 'ADMIN'],
  },
  {
    id: 'agenda',
    label: 'Agenda',
    shortLabel: 'Agenda',
    icon: 'UserCheck',
    path: '/app/agenda',
    roles: ['SECRETARIA', 'DOCTORA', 'ADMIN'],
  },
  {
    id: 'clinical',
    label: 'Historia Clínica',
    shortLabel: 'Clínica',
    icon: 'ShieldCheck',
    path: '/app/clinical',
    roles: ['DOCTORA', 'ADMIN'],
  },
  {
    id: 'admin',
    label: 'Tarifas',
    shortLabel: 'Tarifas',
    icon: 'Settings',
    path: '/app/admin',
    roles: ['ADMIN'],
  },
  {
    id: 'analytics',
    label: 'Métricas',
    shortLabel: 'Métricas',
    icon: 'BarChart3',
    path: '/app/analytics',
    roles: ['DOCTORA', 'ADMIN'],
  },
];
