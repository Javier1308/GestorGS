# Deploy GestorGS — Supabase + Railway + Vercel

## Resumen de pasos

```
1. Supabase  → Crear proyecto + ejecutar schema.sql
2. Railway   → Conectar repo (carpeta backend) + variables de entorno
3. Vercel    → Conectar repo (carpeta frontend) + variable VITE_API_URL
```

---

## 1. Supabase (Base de datos)

### 1.1 Crear proyecto
1. Ir a [supabase.com](https://supabase.com) → New project
2. Nombre: `gestorgs`
3. Database password: generar una segura y **guardarla**
4. Region: South America (São Paulo) — más cercana a Perú

### 1.2 Ejecutar schema
1. En el dashboard de Supabase → **SQL Editor**
2. Copiar y pegar el contenido de `supabase/schema.sql`
3. Ejecutar → verifica que se crean 8 tablas y el usuario `admin@gs.com`

### 1.3 Obtener credenciales de conexión
En **Settings → Database** copiar:
- **Host**: `db.XXXX.supabase.co`
- **Database**: `postgres`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: la que generaste en 1.1

O bien usar el **Connection string** directo (modo `URI`):
```
postgresql://postgres:PASSWORD@db.XXXX.supabase.co:5432/postgres
```

---

## 2. Railway (Backend Spring Boot)

### 2.1 Crear servicio
1. Ir a [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Seleccionar el repositorio y elegir la carpeta **`backend`** como Root Directory
3. Railway detecta automáticamente el `railway.toml`

### 2.2 Variables de entorno
En Railway → tu servicio → **Variables**, agregar:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | `jdbc:postgresql://db.XXXX.supabase.co:5432/postgres` |
| `DATABASE_USERNAME` | `postgres` |
| `DATABASE_PASSWORD` | `tu-password-supabase` |
| `JWT_SECRET` | string aleatorio de mínimo 64 caracteres (ver nota abajo) |
| `CORS_ORIGIN` | URL de Vercel (ej: `https://gestorgs.vercel.app`) |
| `SPRING_PROFILES_ACTIVE` | `prod` |

**Generar JWT_SECRET seguro:**
```bash
openssl rand -hex 64
```

### 2.3 Deploy
- Railway hace deploy automático al pushear a main
- Verificar en **Deployments** que el build termina OK
- El servicio queda en una URL tipo: `https://gestorgs-backend.up.railway.app`
- Probar: `curl https://gestorgs-backend.up.railway.app/api/v1/health` → debe retornar `{"status":"UP"}`

### 2.4 Nota sobre ddl-auto
En producción el `application.yml` tiene `ddl-auto: validate`, lo que significa que JPA
solo valida el schema pero **no crea tablas**. Las tablas se crean con el `schema.sql`
de Supabase (paso 1.2). Si necesitas que JPA las cree automáticamente la primera vez,
agrega temporalmente la variable:
```
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```
Luego cámbiala de vuelta a `validate` una vez las tablas estén creadas.

---

## 3. Vercel (Frontend React)

### 3.1 Crear proyecto
1. Ir a [vercel.com](https://vercel.com) → New Project → Import desde GitHub
2. Seleccionar el repositorio
3. En **Root Directory** poner `frontend`
4. Framework Preset: **Vite** (se detecta automáticamente)

### 3.2 Variables de entorno
En Vercel → tu proyecto → **Settings → Environment Variables**:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://gestorgs-backend.up.railway.app/api/v1` |
| `VITE_WS_URL` | `https://gestorgs-backend.up.railway.app` |

### 3.3 Deploy
- Vercel hace deploy automático al pushear a main
- El frontend queda en: `https://gestorgs.vercel.app` (o el nombre que elijas)

---

## 4. Verificación final

```bash
# 1. Backend health
curl https://TU-BACKEND.up.railway.app/api/v1/health
# → {"status":"UP"}

# 2. Login
curl -X POST https://TU-BACKEND.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gs.com","password":"admin123"}'
# → {"accessToken":"...","refreshToken":"..."}

# 3. Frontend
# Abrir https://TU-FRONTEND.vercel.app en el browser
# Login con admin@gs.com / admin123
```

---

## 5. Post-deploy: cambiar password del admin

**Importante**: Al hacer login por primera vez con `admin@gs.com / admin123`,
cambiar la password inmediatamente desde **Settings → Change Password**.

---

## 6. Flujo de actualizaciones

```
git add .
git commit -m "feat: ..."
git push origin main
  └─ Railway auto-redeploy del backend
  └─ Vercel auto-redeploy del frontend
```

---

## Resumen de URLs

| Servicio | URL |
|---|---|
| Frontend (Vercel) | `https://TU-APP.vercel.app` |
| Backend (Railway) | `https://TU-BACKEND.up.railway.app` |
| Database (Supabase) | Dashboard en `supabase.com` |
