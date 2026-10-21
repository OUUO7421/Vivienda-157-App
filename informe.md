INSPECCIÓN DE INTERFAZ · 17 OCTUBRE 2026

# La ventana interactiva Pocito Social Life

Informe de diseño, navegación, datos y comportamiento de [pocito.urbania3d.app](https://pocito.urbania3d.app/), el showroom enlazado e integrado en la sección «Demo en vivo» de [Urbania Bolivia](https://urbania3d.app/bolivia).

**Alcance:** se inspeccionó la web pública mediante el navegador integrado, porque Microsoft Edge no estaba conectado a las herramientas de esta sesión. La inspección no incluye código privado, panel administrativo ni una exportación completa del sistema. Los datos siguientes describen lo que mostró el sitio durante esta revisión; no se sincronizan con disponibilidad o precios posteriores.

## 1. Cómo aparece dentro de Urbania Bolivia

La página de Bolivia presenta una sección «Demo en vivo» con el título «Recorré un proyecto por tu cuenta». Incluye el dominio pocito.urbania3d.app, un contenedor integrado para el showroom, un enlace «Abrir el showroom» y otro para abrirlo en una pestaña nueva. Por tanto, la ventana es una aplicación web independiente que también puede mostrarse dentro de la página comercial mediante un marco integrado.

El contenido de ejemplo pertenece a **Pocito Social Life, en Córdoba, Argentina**. Su presencia en la página dirigida a Bolivia no cambia la ubicación del proyecto.

## 2. Portada y acceso

La ruta raíz muestra un fondo de arquitectura desenfocado, el logotipo blanco «POCITO SOCIAL LIFE» centrado y un botón blanco «Ingresar», alargado y redondeado. En la esquina superior izquierda aparecen Menú y QR; arriba a la derecha está pantalla completa. El botón Ingresar da paso a `/masterplan`. Se observó un estado transitorio con el botón deshabilitado mientras se preparaba el acceso.

## 3. Composición visual y controles persistentes

| Elemento | Ubicación y apariencia | Función observada |
| --- | --- | --- |
| Menú | Arriba a la izquierda; píldora azul petróleo, icono de tres líneas y texto blanco. | Abre un panel lateral con navegación, dirección y contacto. |
| QR | Botón circular oscuro junto al menú. | Abre un diálogo con marca, código y «Descargar QR». |
| Volver | Círculo negro con flecha curva. | Control de retorno presente en las vistas interiores. |
| Buscar unidades | Píldora centrada en el borde superior. | Despliega el buscador sobre la escena, sin salir del masterplan. |
| Día / Noche | Selector segmentado arriba a la derecha. | Cambia a escenas iluminadas de día o de noche. |
| 3D / 2D | Ocupa la zona del selector en la vista de plantas. | Alterna la representación de la planta. |
| Pantalla completa | Círculo blanco en el extremo superior derecho. | Control anunciado para ampliar el showroom; no se forzó durante la revisión. |
| PROACO | Logotipo pequeño bajo el menú. | Marca del desarrollador superpuesta al contenido. |
| Flechas | Círculos en los bordes izquierdo y derecho, a media altura. | Avanzan y retroceden por las imágenes; se indican atajos ← y →. |
| Zoom | Abajo a la izquierda. | Acercar y alejar; Alejar aparece deshabilitado en la escala inicial. |
| WhatsApp | Abajo a la derecha. | Acceso de contacto presente en las páginas interiores. No se enviaron mensajes. |

La interfaz usa **Plus Jakarta Sans**. Se observó el color de marca **#164056** (RGB 22, 64, 86), fondos blancos, superficies translúcidas, esquinas redondeadas, sombras suaves e iconos lineales. Los botones circulares tienen aproximadamente 40 px en la vista de escritorio inspeccionada. Las imágenes llenan el área disponible y pueden recortarse lateralmente en una ventana estrecha.

## 4. Menú y arquitectura de navegación

| Entrada | Ruta observada | Contenido |
| --- | --- | --- |
| Inicio | / | Portada e ingreso. |
| Masterplan | /masterplan | Conjunto, áreas, imágenes y día/noche. |
| Áreas | Submenú | Torres y Mall & Parking. |
| Unidades | /units | Catálogo de unidades. |
| Unidad Modelo | /custom/unidad-modelo | Carrusel de 20 imágenes. |
| Amenities | /amenities | Carrusel de 5 imágenes; se comprobó la vista rotulada Piscina. |
| Pocito Corporativo | /custom/pocito-corporativo | Carrusel de 4 imágenes; la primera está rotulada Lobby. |
| Avances de Obra | /work-progress | Etapa de avance y seis fotografías. |
| Ubicación | /location/map?type=satellite | Mapa, puntos de interés y rutas. |
| Contacto | /contact | Canales de contacto y formulario. |

El menú muestra la dirección **Av. Vélez Sarsfield 1100, X5000 Córdoba, Argentina**, el teléfono **+54 9 3516 66-6677**, **info@grupoproaco.com**, el sitio de Grupo Proaco, Instagram, TikTok y «Chatear con nosotros». Al pie aparece «Powered by urbania3d.app».

El selector de idiomas ofrece **Español, English, Português e Italiano**. Se verificó la existencia de las opciones; no se auditó la traducción de cada página.

## 5. Masterplan y áreas

El masterplan muestra las tres torres y el basamento comercial. Sobre ellas hay etiquetas y zonas pulsables: **Torre 1, Torre 2, Torre 3 y Mall & Parking**. Se observaron contornos SVG interactivos superpuestos a las imágenes. Un selector vertical del lado derecho permite entrar a Torre 2 y a Mall & Parking, con un control para ocultar las áreas.

El carrusel diurno mostró **4 diapositivas** y el modo nocturno **2**. El cambio a noche sustituyó la imagen por una escena nocturna con ventanas e iluminación encendidas. La URL reflejó estados como `?time=night&slide=2`. Las transiciones pueden deshabilitar brevemente los controles mientras cambia la escena.

| Área | Estado mostrado en el submenú | Destino |
| --- | --- | --- |
| Torre 1 | 100% VENDIDO; botón deshabilitado. | Sin acceso desde ese botón. |
| Torre 2 | 91 DISPONIBLES. | /buildings/166/floors |
| Torre 3 | PRÓXIMAMENTE; botón deshabilitado. | Sin acceso desde ese botón. |
| Mall & Parking | Enlace habilitado. | /buildings/168/floors |

## 6. Buscador de unidades

Se abre como un panel grande de color blanco translúcido, con fondo de escena desenfocado. Incluye título, cierre, campo de texto, ordenamiento, filtros, contador, comparación y cambio entre tarjetas y lista. Durante la carga se muestran tarjetas de esqueleto y «Cargando…». La opción de ordenamiento seleccionada que se comprobó fue **Piso (menor a mayor)**.

| Filtro | Valores o límites mostrados |
| --- | --- |
| Dormitorios | 1 y 2. |
| Baños | 1. |
| Superficie total | 53 a 82 m², mediante dos controles deslizantes. |
| Superficie cubierta | 40 a 62 m², mediante dos controles deslizantes. |
| Precio | 86.900 a 214.825; las fichas revisadas usan USD. |
| Orientación | Sur, Oeste, Norte y Este. |
| Pisos | 9° a 34° en los filtros observados. |
| Características | Balcón. |
| Disponibilidad | Casilla «Solo unidades disponibles». |

El contador mostró **390 unidades**. Las tarjetas revisadas incluían identificador, estado, precio o «Consultar precio», superficie total, baños y piso. Un ejemplo fue **14-15 · Disponible · USD 127.111 · 54 m² · 1 baño · piso 14°**. Se registraron los datos visibles de 24 fichas; el informe no presume haber inspeccionado las 390.

El contador general de 390 y las 91 disponibles de Torre 2 describen señales distintas de la interfaz. No deben tratarse como cifras equivalentes de unidades disponibles.

## 7. Plantas, pisos y selección de departamentos

Al abrir una unidad, el showroom pasa a la vista de plantas de Torre 2. En el lado derecho hay un listado vertical desplazable desde **Terraza y 35° hasta 9°**, con el piso activo resaltado. También aparecen «Ocultar Pisos» y un control de desplazamiento hacia abajo.

La planta observada del piso 14 es una imagen amoblada vista desde arriba. Hay etiquetas 14-01 a 14-15 y zonas superpuestas con estados en verde o rojo. Elegir una unidad abre una tarjeta flotante a la izquierda con imagen, identificador, disponibilidad, precio, «Solicitar información», datos resumidos, «Ver Ficha», «Tour 360°» y cierre. El fondo de planta continúa visible.

La navegación de ejemplo pasó por `/buildings/166/floors?floor=736` y la ficha ampliada por `/buildings/166/floors/unit/4426/plans-3d`. Estos identificadores se transcriben de las rutas públicas; no son una exportación de la base de datos.

## 8. Ficha verificada: unidad 14-15

| Identificación | Unidad 14-15 · Torre 2 · Disponible |
| --- | --- |
| Precio mostrado | USD 127.111 |
| Superficie total | 54,00 m² |
| Superficie cubierta | 42,00 m² |
| Superficie semi cubierta | 1,00 m² |
| Superficie común | 11,00 m² |
| Distribución | 1 dormitorio, 1 baño y 1 balcón |
| Piso y orientación | 14° · Sur |
| Entrega inicial | 40% |
| Descuento | Hasta 10% |
| Posesión | 2028 |
| Financiación | Hasta 48 cuotas |

La ficha ampliada separa Superficies, Distribución, Datos y Condiciones comerciales. Incluye «Solicitar información», «Aviso Legal», «Ver Brochure» y «Compartir». La tarjeta previa mostraba dos posiciones de imagen. Se comprobó la entrada a la ficha; no se revisó el contenido del brochure ni se completaron solicitudes.

## 9. Galerías y avances de obra

**Unidad Modelo:** el contador indica 20 imágenes. Se observó una fotografía interior de cocina y comedor con revestimientos de madera, tonos cálidos y fondo blanco lateral cuando la proporción de la foto no llena la ventana. Tiene flechas y zoom.

**Amenities:** 5 imágenes. Se comprobó la escena Piscina; los recursos públicos observados también incluyen imágenes identificadas como Rooftop y SUM. No se atribuyen equipamientos adicionales que no se hayan verificado.

**Corporativo:** 4 imágenes; primera escena Lobby y recursos identificados como oficinas.

**Avances:** la sección muestra «Última actualización: 04 Mayo 2026», una etapa «Avances 0%» y seis fotografías. Sus archivos están identificados como Noviembre 2021, Noviembre 2022, Diciembre 2023, Agosto 2024, Junio 2025 y Abril 2026. El 0% es una etiqueta del sistema observada y no permite deducir el avance físico real.

## 10. Mapa, rutas y puntos de interés

La sección utiliza Google Maps con vista satélite. Se observaron zoom, selector de tipo de mapa, «Medir distancia», «Puntos de interés» y modos **Auto, Bicicleta y Caminando**. La lista indica que al tocar un punto se calcula la ruta desde el proyecto. No se probaron todas las rutas ni las mediciones.

24 puntos de interés enumerados en la interfaz

- Nueva Terminal de Ómnibus
- Aeropuerto Internacional Córdoba
- Estadio Mario Alberto Kempes
- Villa Carlos Paz
- Universidad Nacional de Córdoba
- Centro Ciudad
- Tribunales III
- Museo Provincial de Ciencias Naturales
- Parque de la Biodiversidad
- Parque Las Heras
- Paseo del Buen Pastor
- Plaza España
- Casa de Gobierno De Córdoba
- Av. Marcelo T. de Alvear 120 9° Piso
- Parque Sarmiento
- Universidad Tecnológica Nacional – Facultad Regional Córdoba
- Sanatorio Allende Nueva Córdoba
- Parque de Las Naciones
- Parque Autóctono
- Docta
- Opera Park
- Opera Luxury
- Opera Plaza
- DUO

## 11. Contacto y QR

La página de contacto combina una imagen del proyecto, marca, canales directos y un formulario. Sus campos son **Nombre, Email, Teléfono, Motivo de contacto y Mensaje**. También tiene una casilla para aceptar la política de privacidad, un botón que abre esa política y «Enviar». Las opciones internas del desplegable Motivo no se inspeccionaron. No se enviaron formularios ni mensajes.

El QR se abre en un diálogo con logotipo, título «QR», texto «Descripción», imagen del código y un botón desplegable «Descargar QR». Se verificó la apertura; no se enumeraron los formatos del desplegable original. La réplica genera un QR SVG que apunta al dominio original.

## 12. Recursos y funcionamiento técnico observables

La aplicación pública expone rutas del lado del cliente y paquetes de recursos con nombres asociados a React, consultas e internacionalización. Se observaron recursos de `assets.urbania3d.app`, variantes de imagen de `img.urbania3d.app` y peticiones a `api.urbania3d.app/api/v1/public/…`. El inventario de recursos también mostró archivos MP4 para introducciones o transiciones.

En masterplan y plantas se comprobó la combinación de imágenes, etiquetas y polígonos SVG. Esto permite recrear la ventana visualmente mediante HTML, CSS y JavaScript. No se verificó una malla 3D exportable, el motor interno completo, el almacenamiento administrativo ni las integraciones privadas. Que la página comercial anuncie CRM, analítica, IA u otras funciones generales no demuestra que todas estén activas en esta demo.

## 13. Qué incluye esta réplica

| Componente | Entrega |
| --- | --- |
| Portada y navegación | Reconstrucción local de marca, fondo, ingreso, menú y controles. |
| Masterplan | Cuatro recursos originales, modo noche con dos escenas, zoom, flechas y etiquetas pulsables. |
| Unidades | 24 fichas con los campos registrados; búsqueda, ordenamiento, filtros, tarjetas/lista y comparación local. El total 390 se identifica como referencia del original. |
| Plantas | Recursos de referencia 2D/3D y selector de pisos. La imagen local se basa en el piso 14; otros pisos no se presentan como levantamientos propios. |
| Ficha | Datos completos comprobados para 14-15; campos resumidos para las otras 23 unidades. |
| Galerías | 5 imágenes de amenities, 4 corporativas, 5 de muestra de unidad modelo y 6 de obra. |
| Mapa | Mapa de Google integrado y enlaces de ruta. Las herramientas avanzadas de medición y movilidad se remiten al original. |
| Contacto | Canales observados y preparación de correo. No replica el servidor de recepción de formularios. |
| Idiomas, tours y catálogo completo | Acceso explícito al showroom original dentro de un marco integrado, con alternativa para abrirlo en una pestaña. |

Esta entrega es una **réplica de interfaz de referencia**, con imágenes públicas originales y código nuevo. No es una copia independiente de toda la plataforma Urbania, de su base de datos ni de su backend. El modo «Original en vivo» depende del sitio de Urbania y de que permita la integración. La barra «Réplica de estudio» y este informe son añadidos de la entrega y no forman parte del showroom original.

## 14. Qué faltaría para una copia independiente completa

Haría falta una exportación autorizada de todas las unidades, disponibilidad, precios, planos por piso, las 20 imágenes ordenadas de la unidad modelo, recorridos 360°, transiciones y configuraciones; además de servicios para consultas, traducciones, mapa, descargas y actualización de datos. Estos materiales y servicios no se sustituyen por datos inventados.

Fuentes primarias: la página pública de Urbania Bolivia y las rutas de Pocito enlazadas en este informe. Fecha de revisión: 17/10/2026, zona horaria America/La_Paz.
