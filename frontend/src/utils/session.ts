import { RoleType } from '../components/navConfig';

export const ROLE_TO_USER_ID: Record<RoleType, number> = {
  PUBLIC: 1,
  ADMIN: 1,
  DOCTORA: 2,
  SECRETARIA: 3,
};

/** ID del usuario logueado (desde localStorage), o fallback según rol si no hay sesión / demo. */
export function currentUserId(): number {
  const raw = localStorage.getItem('userId');
  const n = raw ? Number(raw) : NaN;
  if (Number.isFinite(n) && n > 0 && n !== 999) {
    return n;
  }
  const role = (localStorage.getItem('role') as RoleType) || 'ADMIN';
  return ROLE_TO_USER_ID[role] ?? 1;
}

/** Rol activo del usuario (localStorage). */
export function currentRole(): RoleType | null {
  const r = localStorage.getItem('role');
  return (r as RoleType) || null;
}

/** El personal médico (doctora o admin) accede a la historia clínica. */
export function isMedicalStaff(role: RoleType | null = currentRole()): boolean {
  return role === 'DOCTORA' || role === 'ADMIN';
}
