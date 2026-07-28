# Deton Arte

Sitio público y panel privado para administrar las galerías de obras.

## Desarrollo local

1. Copiá `.env.example` como `.env.local`.
2. Definí una contraseña larga en `ADMIN_PASSWORD`.
3. Generá un secreto aleatorio de 32 bytes o más para
   `ADMIN_SESSION_SECRET`.
4. Instalá dependencias y levantá el proyecto:

```bash
npm install
npm run dev
```

- Sitio: `http://localhost:3000`
- Panel privado: `http://localhost:3000/panel`

En desarrollo sin Blob configurado, las imágenes nuevas se guardan en
`data/gallery`. Los archivos de esa carpeta son locales y no se versionan.

## Producción

1. Creá un Blob Store **público** conectado al proyecto.
2. Configurá `BLOB_READ_WRITE_TOKEN` en el proveedor donde se ejecute la web.
   Vercel la agrega automáticamente al conectar el Store.
3. Configurá `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` y
   `NEXT_PUBLIC_SITE_URL` en las variables del proyecto.
4. Desplegá normalmente como una aplicación Next.js en Vercel o Hostinger.

El panel sube los archivos directamente al almacenamiento, valida que sean
imágenes, corrige la orientación, limita dimensiones, elimina metadatos y
publica una versión WebP optimizada. Los nombres originales no se usan como
rutas públicas. En producción, la administración se desactiva de forma segura
si el almacenamiento permanente no está configurado.

## Validación

```bash
npm run lint
npx tsc --noEmit
npm run build
```
