import { RoleType } from '../components/navConfig';

/** ID del usuario logueado (desde localStorage), o undefined si no hay sesión. */
export function currentUserId(): number | undefined {
  const raw = localStorage.getItem('userId');
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : undefined;
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
