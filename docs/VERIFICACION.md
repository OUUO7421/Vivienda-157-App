# Informe de verificación

Fecha: **20/10/2026**. Plataforma: Windows, Node.js 22.18.0 y navegador integrado de Codex. Servidor de desarrollo en `http://127.0.0.1:4173`. Datos comerciales capturados el 19/10/2026.

## Comprobaciones automatizadas

| Comprobación | Resultado |
|---|---|
| `npm test` | 7 pruebas aprobadas, 0 fallos |
| Sintaxis de todos los módulos de `src/` y `scripts/` con `node --check` | Correcta |
| `npm run build` | Copia estática generada en `dist/` |
| `npm run verify:server` sobre desarrollo, puerto 4173 | 8 comprobaciones aprobadas |
| `node scripts/verify-server.mjs` sobre `--production`, puerto 4174 | Las mismas 8 comprobaciones aprobadas |
| Segundo arranque con el servidor ya activo | Reconoce la instancia del showroom y termina sin iniciar un servidor duplicado |
| Recursos del catálogo | 532 archivos normalizados descargados; todos los referenciados existen y no están vacíos |

Las siete pruebas verifican unidades únicas y su relación con las plantas, datos exactos de la unidad 14-15, filtros combinados, ordenación con precios desconocidos, límite del comparador, rutas directas y recursos locales.

Las ocho comprobaciones HTTP cubren portada, enlace directo a unidad, JavaScript, JSON, lectura parcial de un vídeo (`206` y 16 bytes), rango inválido (`416`), exclusión de `research/` (`404`) y rechazo de escritura (`405`).

El npm instalado emitió un aviso de obsolescencia interno `DEP0174`; los comandos terminaron correctamente. No se actualizaron las herramientas globales del equipo.

## Recorridos comprobados en el navegador

| Recorrido | Resultado observado |
|---|---|
| Inicio e ingreso | Portada, reproducción de entrada y llegada al masterplan |
| Masterplan | Coincide el render con la referencia; controles en las mismas zonas |
| Día/noche | Cambio a recursos nocturnos y actualización de la URL |
| Transiciones | Avance automático al terminar el vídeo; recursos inversos para volver; pausa y reanudación |
| Historial | Atrás vuelve a la vista anterior sin quedar atrapado en una transición |
| Zoom y arrastre | Ampliación y desplazamiento acotado de la escena |
| Torre 2 | Cambio de pisos, selección de unidad y alternancia 3D/2D |
| Búsqueda | `14-15` devuelve una unidad; sus valores coinciden con la captura pública |
| Filtros | 90 disponibles; disponibilidad más piso 14 devuelve dos unidades |
| Comparador | Selección de 14-01 y 14-15 y tabla comparativa de características |
| Ficha completa | Plano 3D, interiores y navegación entre imágenes |
| Enlace directo | Recarga de la URL con piso y unidad restaura la selección |
| Unidad Modelo | 20 imágenes; navegación circular comprobada |
| Amenities y Corporativo | Galerías de cinco y cuatro imágenes cargadas |
| Mall & Parking | Cuatro niveles; selección de PB y Amenities |
| Avances de obra | Seis imágenes visibles |
| Pantalla completa | Entrada y salida correctas |
| QR | Imagen visible y enlace de descarga SVG presente |
| Mapa | Google Maps cargó el mapa satelital de la ubicación |
| Tour 360° | Kuula cargó el panorama de la unidad 14-15 dentro del visor |
| Contacto | La consulta conserva el número de unidad; campos obligatorios presentes |
| Consola durante las pruebas funcionales | No se observaron errores ni advertencias de la aplicación |

## Adaptación y teclado

Se revisaron vistas de escritorio a **1440 × 900** y móvil a **390 × 844**. En móvil se comprobó que no hubiera desbordamiento horizontal, que la ficha fuera visible, que se pudieran ocultar los pisos y desplazar el plano. La tarjeta de unidad se abrió con Enter después de corregir su gestión del teclado.

También se corrigieron el tamaño de las casillas de filtros, la distribución de los atributos en las tarjetas y el bloqueo del panel de búsqueda mientras se muestra un modal encima.

## Incidencia al abrir index.html directamente

La captura aportada por el usuario mostraba una URL de archivo local, `D:/.../showroom/public/index.html`. Las rutas de estilos y módulos y la carga de datos requieren HTTP.

Se añadió:

- `INICIAR.cmd`, que valida la presencia de Node, inicia el servidor y solicita abrir el navegador predeterminado.
- Reconocimiento de un servidor del mismo showroom ya activo.
- Redirección de `index.html` bajo protocolo `file:` hacia `abrir.html`, una página autónoma con instrucciones.

La página de ayuda y su botón se comprobaron en el navegador a través de HTTP. El servidor y el segundo arranque se ejecutaron y verificaron. **No se automatizó el doble clic en el Explorador ni se verificó la apertura del navegador predeterminado desde el archivo CMD**; la rama de inicio correspondiente se revisó en el código.

## Evidencia visual

- [Masterplan original](capturas/masterplan-referencia.jpg)
- [Masterplan local](capturas/masterplan-local.jpg)
- [Unidad en móvil](capturas/movil-unidad.jpg)
- [Instrucciones para iniciar](capturas/ayuda-inicio.jpg)

## Límites de la verificación

No se revisaron individualmente las 390 fichas ni cada imagen a máxima resolución. Se validaron sus relaciones y archivos automáticamente y se probaron recorridos representativos. No se ejecutó una batería en Safari, Firefox ni dispositivos móviles físicos.

No se enviaron consultas, correos o mensajes, ni se realizaron reservas o pagos. El formulario solo prepara un correo en el cliente del usuario. No se probó la entrega de ese correo. No se escaneó el QR con un teléfono ni se guardó su descarga desde el navegador. No se probaron todas las habitaciones y opciones del proveedor de tours.

El inventario es estático; no se verificó actualidad comercial, titularidad de recursos o autorización de publicación. Mapa, tours y enlaces externos dependen de Internet y de terceros.

La fidelidad se evaluó visualmente; existen diferencias menores de iconos, tamaños de etiquetas y funciones documentadas en [ANALISIS.md](ANALISIS.md). Esta entrega es una reconstrucción local funcional, no una copia del backend de Urbania3D.
