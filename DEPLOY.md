# Deploy GitHub + Vercel + Supabase

## 1. GitHub

1. Crear un repositorio en GitHub.
2. Subir este proyecto al repo.
3. Verificar que existan `package.json`, `vercel.json`, `.env.example` y `supabase/schema.sql`.

## 2. Supabase

1. Crear un proyecto en Supabase.
2. Ir a SQL Editor.
3. Ejecutar el contenido de `supabase/schema.sql`.
4. En Authentication > Providers, activar Email.
5. Para Google, crear credenciales OAuth en Google Cloud y pegarlas en Authentication > Providers > Google.
6. Copiar:
   - Project URL
   - anon public key

## 3. Vercel

1. Importar el repo de GitHub en Vercel.
2. Framework: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Agregar variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy.

## 4. Configurar URLs de autenticacion

En Supabase, ir a Authentication > URL Configuration.

Agregar en Site URL la URL principal de Vercel, por ejemplo:

```text
https://controlpro-dashboard.vercel.app
```

Agregar tambien en Redirect URLs:

```text
https://controlpro-dashboard.vercel.app/*
http://localhost:5173/*
```

## 5. Estado actual

La app ya usa Supabase cuando existen estas variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Con Supabase activo:

- Registro por email y contrasena.
- Login por email y contrasena.
- Login con Google OAuth.
- Creacion de empresa y perfil.
- Guardado de movimientos, tareas y configuracion en `app_workspaces`.

Si las variables no existen, la app sigue funcionando en modo local/demo.

## 6. Siguiente paso tecnico

- Agregar recuperacion de contrasena.
- Mejorar roles por usuario: owner, admin, operador, lectura.
- Agregar planes/pagos con Stripe o Mercado Pago.
- Crear invitaciones a empresas para equipos.
