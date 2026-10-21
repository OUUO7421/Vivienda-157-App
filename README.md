# Pocito · Showroom local

Reconstrucción local de [Pocito Social Life](https://pocito.urbania3d.app), realizada con HTML, CSS y JavaScript modular. Las imágenes, planos y vídeos se sirven desde esta carpeta. El catálogo es una captura del **19 de octubre de 2026**, no un inventario comercial en tiempo real.

## Abrir el showroom

1. Abre esta carpeta: `D:\navegacion interactiva\showroom`.
2. Haz doble clic en **INICIAR.cmd** y deja abierta su ventana.
3. El navegador se abre automáticamente en [http://127.0.0.1:4173](http://127.0.0.1:4173). También puedes abrir ese enlace en el navegador integrado de Codex.

Para apagarlo, pulsa **Ctrl+C** en la ventana del servidor. Si indica que el puerto está ocupado, primero prueba el enlace: puede estar abierto el servidor de esta misma aplicación.

Node.js 22 o superior es el único requisito; ya estaba instalado durante el desarrollo. No hay dependencias externas que instalar. Si abres `index.html` con doble clic, aparecerá una pantalla con estas instrucciones: la carga de módulos y datos necesita el servidor.

También puedes arrancarlo desde una terminal:

```powershell
cd "D:\navegacion interactiva\showroom"
npm run dev
```

## Qué puedes recorrer

- Portada animada, vídeo de entrada y masterplan con día/noche.
- Transiciones de cámara hacia adelante y atrás, zoom, desplazamiento y pantalla completa.
- Torre 2: 28 niveles, con plantas 3D y planos 2D cuando están disponibles.
- Mall & Parking: cuatro niveles.
- Catálogo de **390 unidades y 55 tipologías**, búsqueda, filtros, ordenación, vistas de tarjetas/lista y comparación de hasta cuatro unidades.
- Ficha de unidad con precio publicado, superficies, planos, interiores, vistas y condiciones presentes en los datos originales.
- Unidad Modelo: 20 imágenes; Amenities: cinco; Pocito Corporativo: cuatro.
- Avances de obra: seis imágenes recuperadas del material que ya había en el proyecto.
- Mapa externo, recorridos 360° alojados en Kuula, QR del sitio original y formulario que prepara un correo.

Prueba directa: [unidad 14-15](http://127.0.0.1:4173/buildings/166/floors?floor=736&unit=4426). Sus valores capturados son USD 127.111 y 54 m² totales.

**Controles:** flechas izquierda/derecha para cambiar de escena; `+`, `-` y `0` para zoom/restablecer; arrastrar para desplazar; `Esc` para cerrar paneles. Los botones y tarjetas admiten teclado.

## Dónde modificar cada cosa

| Cambio | Archivo |
|---|---|
| Colores, tamaños, adaptación a móvil | `public/style.css` |
| Estructura de la pantalla | `public/index.html` |
| Menú, filtros, fichas y formularios | `src/panels.js` |
| Navegación e interacciones | `src/app.js` |
| Visor, zoom, arrastre, vídeos y polígonos | `src/scene.js` |
| Búsqueda, orden y comparación | `src/catalog.js` |
| Rutas y enlaces a pisos/unidades | `src/router.js` |
| Unidades, plantas, galerías y marca | `public/data/showroom.json` |
| Recursos descargados | `public/assets/media/` |
| Material conservado de la réplica anterior | `public/assets/legacy/` |

La hoja `public/base.css` conserva la base visual de la réplica anterior; `style.css` contiene los ajustes actuales.

## Comprobar y generar una copia estática

```powershell
npm test
npm run build
```

`npm test` verifica siete casos de catálogo, relaciones entre unidades y pisos, filtros, comparación, rutas y existencia de los recursos. `npm run build` genera **dist/** con los archivos necesarios para servir la aplicación. Los medios ocupan aproximadamente **650 MB** y se copian también a `dist/`.

Con el servidor activo:

```powershell
npm run verify:server
```

Comprueba ocho respuestas HTTP, incluyendo rutas directas y reproducción parcial de vídeo.

Para servir la copia de `dist/`, detén primero el servidor de desarrollo y ejecuta:

```powershell
node scripts/server.mjs --production
```

Un alojamiento futuro necesita devolver `index.html` para las rutas de la aplicación que no correspondan a archivos. Esta entrega permanece local.

## Datos, recursos y límites

Los **532 recursos** normalizados están descargados localmente. `research/` conserva las respuestas públicas utilizadas, el manifiesto con las URLs de procedencia y el resultado de descarga; esa carpeta no se expone por el servidor.

`npm run prepare:data` regenera el catálogo a partir de esas respuestas guardadas; **sobrescribe las modificaciones manuales de `public/data/showroom.json`**. `npm run download:assets` descarga los recursos que falten. Ninguno de esos comandos actualiza por sí mismo el inventario de la web original.

El mapa y los tours 360° necesitan Internet. El formulario abre un borrador en la aplicación de correo del usuario: no tiene CRM, recepción de consultas ni envío automático. No hay reservas, pagos ni actualización de disponibilidad. El QR conduce al sitio original; compartir una URL local solo sirve en este equipo.

La experiencia 3D usa renders, polígonos interactivos y vídeos prerenderizados. No incluye un modelo editable ni una cámara libre. La versión local está en español.

Se conservaron marcas y materiales visuales para la comparación solicitada. No se ha verificado una licencia para su redistribución o uso comercial; los recursos deben contar con autorización de sus titulares antes de publicar la réplica. Esta entrega no acredita esa autorización.

Lee el [análisis y alcance](docs/ANALISIS.md) y el [informe de verificación](docs/VERIFICACION.md) para conocer las comprobaciones y diferencias pendientes.
