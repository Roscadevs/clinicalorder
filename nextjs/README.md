# 🔐 Módulo de Autenticación Defensiva y Control de Acceso (Zero-Trust) — Next.js & Supabase Auth

Este módulo implementa un sistema de autenticación de grado corporativo B2B bajo el principio de **Zero-Trust** y **Anti-Enumeration**, diseñado específicamente para arquitecturas Next.js con soporte SSR.

---

## 🏛️ Estructura del Módulo

```text
nextjs/
├── middleware.ts                  # Muro de contención perimetral (HTTP 307 + validación criptográfica getUser)
├── components/
│   └── auth/
│       └── LoginForm.tsx          # Componente defensivo Zod + React Hook Form + Anti-Enumeration
└── utils/
    └── supabase/
        └── client.ts              # Cliente de navegador Supabase con persistencia en Cookies HTTP (@supabase/ssr)
```

---

## 🛡️ Políticas de Seguridad Implementadas

1. **SSR Auth (Server-Side Rendering):** 
   - Prohibido el uso de `localStorage` para el almacenamiento de tokens de sesión.
   - Todo token se persiste y refresca a través del flujo de *Cookies HTTP* (`@supabase/ssr`), permitiendo la inspección y protección de rutas en el Edge antes del renderizado de componentes.

2. **Zero-Trust Perimetral (`middleware.ts`):**
   - Intercepción de rutas privadas (`/dashboard`, `/admin`).
   - Uso obligatorio de `supabase.auth.getUser()` en lugar de `getSession()`, garantizando la validación criptográfica del JWT contra el servidor de autenticación de Supabase.
   - Redirección con código **HTTP 307 (Temporary Redirect)** hacia `/login`, preservando la integridad del método HTTP y evitando el almacenamiento en caché del redirect.

3. **Defensive UI & Anti-Enumeration (`LoginForm.tsx`):**
   - Validación estricta en cliente con **Zod** y **React Hook Form**: si el formato no es válido, ninguna petición sale a la red.
   - Mitigación de fugas de información: cualquier error de autenticación devuelve el mensaje unificado y opaco: `"Credenciales inválidas. Verifique sus datos de acceso."`.
   - Control tri-estado en interfaz: *Idle*, *Submitting* (con spinner y bloqueo de interacción) y banner de alerta en rojo.

---

## 📦 Dependencias Requeridas en Next.js

```bash
npm install @supabase/ssr @supabase/supabase-js react-hook-form @hookform/resolvers zod lucide-react
```

## ⚙️ Variables de Entorno Requeridas (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
```
