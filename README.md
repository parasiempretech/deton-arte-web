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

En desarrollo, las imágenes nuevas se guardan en `data/gallery`. Los archivos
de esa carpeta son locales y no se versionan.

## Producción

1. Configurá `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` y
   `NEXT_PUBLIC_SITE_URL` en las variables del proyecto.
2. Desplegá normalmente como una aplicación Next.js en Hostinger.

En producción, el panel guarda las imágenes en
`domains/detonar73.site/deton-arte-storage/gallery`, fuera del directorio
`nodejs` que Hostinger reconstruye en cada despliegue. Se puede indicar otra
ruta absoluta mediante `GALLERY_STORAGE_PATH`.

El panel sube los archivos directamente al almacenamiento, valida que sean
imágenes, corrige la orientación, limita dimensiones, elimina metadatos y
publica una versión WebP optimizada. Los nombres originales no se usan como
rutas públicas.

## Validación

```bash
npm run lint
npx tsc --noEmit
npm run build
```
