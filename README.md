# ControlPro Dashboard

Dashboard web simple para empresas, orientado a gestion, ventas, control de procesos e indicadores operativos.

## Como usar

En Windows, doble clic en:

```text
iniciar-dashboard.bat
```

Eso inicia el servidor y abre el dashboard automaticamente.

O manualmente:

```bash
node server.js
```

Luego abrir:

```text
http://127.0.0.1:5173
```

Tambien puede abrirse `index.html` directo en un navegador externo, pero el servidor local evita bloqueos del navegador integrado.

## Deploy

El proyecto quedo preparado para GitHub + Vercel + Supabase:

- `package.json`: scripts para Vite/Vercel.
- `vercel.json`: configuracion de deploy.
- `.env.example`: variables necesarias para Supabase.
- `supabase/schema.sql`: tablas y politicas iniciales.
- `DEPLOY.md`: guia paso a paso.

## Funciones incluidas

- Indicadores calculados de ingresos, margen, cumplimiento, tareas y clientes.
- Filtros por periodo, area y rubro.
- Graficos de ingresos contra objetivo, embudo y distribucion por area.
- Carga manual de movimientos.
- Importacion y exportacion CSV.
- Exportacion Excel compatible con hojas de calculo.
- Documento HTML imprimible para enviar como reporte.
- Apertura de borrador de email y WhatsApp con resumen configurable.
- Exportacion JSON como respaldo.
- Registro e ingreso local por email y contrasena.
- Acceso Google en modo demo local.
- Datos de empresa configurables: nombre, rubro, ID fiscal y plan.
- Plantillas de prueba por rubro: servicios, comercio, salud e industria.
- Tareas operativas con prioridad, responsable, vencimiento y estado.
- Persistencia local en el navegador.

## Compartir reportes

En `Configurar` se puede guardar email, WhatsApp, nombre del reporte y mensaje. La app descarga el Excel o documento HTML y abre el canal elegido con un resumen listo para enviar.

Los adjuntos deben agregarse manualmente desde la descarga. Para adjuntar y enviar automaticamente hace falta integrar Gmail, Outlook, WhatsApp Business API o un backend propio.

## Cuentas y monetizacion

La version actual incluye autenticacion local para probar el flujo de producto: registro, login, sesion, empresa activa y datos separados por cuenta/empresa.

Para publicar como app monetizable en la nube hace falta reemplazar este modo local por autenticacion real:

- Google OAuth para ingresar con cuenta Google.
- Email y contrasena con recuperacion de clave.
- Base de datos multiempresa.
- Roles y permisos por usuario.
- Suscripciones o planes de pago.
- Backend para enviar emails, adjuntos y mensajes de WhatsApp Business.

## Archivos

- `index.html`: estructura de la aplicacion.
- `styles.css`: estilos responsivos.
- `app.js`: datos de ejemplo e interactividad.
- `server.js`: servidor local sin dependencias.
- `iniciar-dashboard.bat`: inicio rapido en Windows.
- `datos-ejemplo.csv`: archivo para probar la importacion.

## Que hace falta para llevarlo a produccion

- Definir los indicadores clave del cliente o rubro.
- Conectar la fuente real de datos: Excel, CSV, sistema de ventas, ERP o carga manual.
- Definir usuarios, permisos y vistas por rol.
- Agregar base de datos si se necesita trabajo multiusuario.
- Crear reportes exportables y alertas automaticas.
