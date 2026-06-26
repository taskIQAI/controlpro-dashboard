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

## 4. Estado actual

La app ya esta lista para deploy como front-end. El login actual funciona en modo local/demo. Para activar autenticacion real con Supabase hay que conectar `app.js` con `@supabase/supabase-js` usando las variables de entorno de Vercel.

## 5. Siguiente paso tecnico

- Reemplazar login local por Supabase Auth.
- Guardar `state` y `shareConfig` en `app_workspaces`.
- Crear perfiles y empresas en las tablas `user_profiles` y `companies`.
- Agregar recuperacion de contrasena.
- Agregar planes/pagos con Stripe o Mercado Pago.
