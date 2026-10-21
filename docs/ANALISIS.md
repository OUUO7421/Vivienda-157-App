# Análisis de la referencia y alcance de la réplica

Referencia: [Pocito Social Life](https://pocito.urbania3d.app). Datos obtenidos el 19/10/2026 y verificación final el 20/10/2026. Inspección realizada en el navegador integrado de Codex, incluyendo el [piso 34 de Torre 2](https://pocito.urbania3d.app/buildings/166/floors?floor=756).

## Diseño observado

El render arquitectónico ocupa toda la pantalla. Los controles flotan sobre la escena: menú y QR a la izquierda, buscador centrado, día/noche o 3D/2D a la derecha, flechas laterales, selector vertical de pisos y zoom inferior. Predominan el azul petróleo `#164056`, superficies blancas translúcidas y botones redondeados. Se mantiene la fuente local Plus Jakarta Sans.

Los polígonos sobre edificios y unidades están vinculados a etiquetas seleccionables. Las fichas se abren sobre la planta y el buscador ocupa un panel amplio con filtros, tarjetas y comparación. En móvil se compactan los controles y la ficha se sitúa abajo; el arrastre permite explorar las partes recortadas del render.

El efecto 3D observado se puede reproducir con imágenes, vídeo y geometría de interacción 2D. No se identificó un modelo de geometría 3D descargable que permita reconstruir una cámara libre.

## Recursos y comportamiento

| Área | Reproducción local | Diferencias o límites |
|---|---|---|
| Portada | Marca, fondo animado, entrada con vídeo y botón para saltar | Se respeta la preferencia de movimiento reducido |
| Masterplan | Dos vistas diurnas, dos nocturnas y dos tramos de transición con sus vídeos inversos | Zoom y arrastre sobre renders; sin navegación libre 3D |
| Torre 2 | 28 niveles, polígonos y etiquetas vinculados a unidades | Los polígonos de la vista 3D se ocultan en 2D porque no existe una geometría 2D equivalente en los datos capturados |
| Mall & Parking | PB, 1°, 2° y Amenities | Sin inventario comercial inventado |
| Unidades | 390 unidades, 55 tipologías, filtros, precios publicados y comparador | Disponibilidad y precios estáticos |
| Fichas | Planos, interiores, vistas y atributos disponibles | Campos no publicados no se completan artificialmente |
| Galerías | Modelo 20 imágenes, Amenities 5, Corporativo 4 | Sin editor de contenido |
| Obra | Seis imágenes del material previo del proyecto | No se verificó que representen el último estado de obra |
| Ubicación | Mapa de Google y 16 puntos de interés | Los trayectos se abren en Google Maps; no se replica el cálculo integrado del original ni la totalidad de sus 24 puntos |
| Tours 360° | Visor externo de Kuula y enlace alternativo | Requieren Internet y disponibilidad del proveedor |
| Contacto | Validación y preparación de un correo | No conectado al backend del original; el botón flotante abre Contacto |
| QR | Imagen descargable del QR original | No representa una dirección pública de esta réplica local |
| Idiomas | Español | Se enlaza al original para los otros idiomas |

La respuesta del edificio contiene 90 unidades disponibles, mientras que el menú de referencia mostró 91. La réplica calcula el total a partir de las 390 unidades capturadas y muestra **90**; no se ha alterado una unidad para igualar un contador diferente.

## Arquitectura elegida

Aplicación de una sola página con módulos JavaScript nativos y History API. El servidor Node atiende únicamente `127.0.0.1`, soporta peticiones parciales para vídeo y devuelve la aplicación al abrir enlaces directos a pisos o unidades.

La separación entre datos, rutas, visor, catálogo y paneles permite sustituir los recursos por los de otro proyecto sin rehacer toda la navegación. No hacen falta paquetes externos para arrancar, comprobar o generar la copia estática.

Se recuperaron datos de endpoints públicos de `api.urbania3d.app` y recursos de `assets.urbania3d.app`. Las respuestas originales y el manifiesto de procedencia se conservan en `research/`. El código de interacción local está en `src/`; no se depende del JavaScript privado del servicio ni de sus credenciales.

## Límites de derechos y acceso

La disponibilidad pública de una imagen, vídeo, logo o respuesta de API no verifica una autorización de redistribución. Se utilizaron los materiales para esta reconstrucción local solicitada y no se publicó el resultado. Para una versión pública o comercial deben utilizarse materiales autorizados o reemplazos propios. No se comprobó la titularidad ni una licencia específica de estos recursos.

No se accedió al panel administrativo ni a datos privados. No se replicaron CRM, reservas, pagos, traducciones completas ni documentos comerciales descargables. Esas funciones requieren material o integraciones adicionales.

## Comparación visual

Capturas a 1440 × 900 de la primera vista diurna:

- [Original](capturas/masterplan-referencia.jpg)
- [Réplica local](capturas/masterplan-local.jpg)

Se conserva el mismo encuadre del render, la organización de controles y las posiciones de edificios. Quedan diferencias menores de tipografía, tamaño de etiquetas e iconos. La versión local añade un contador de escena, restablecimiento de zoom y pausa de vídeo. No se afirma equivalencia píxel a píxel.
