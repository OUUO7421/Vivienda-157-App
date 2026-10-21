import { $, escapeHTML as e, icon, toast } from './utils.js';
import { Scene } from './scene.js';
import { hydrateUnits, defaultFilters, filterUnits, toggleComparison } from './catalog.js';
import { names, readRoute, routeURL } from './router.js';
import * as panels from './panels.js';

async function main() {
  const response=await fetch('/data/showroom.json');
  if(!response.ok)throw new Error('No se pudieron cargar los datos locales.');
  const data=await response.json();
  const units=hydrateUnits(data),byId=new Map(units.map(u=>[u.id,u]));
  const state={...readRoute(new URL(location.href)),filters:defaultFilters(),compare:false,selected:new Set(),view:'cards',expanded:false,railHidden:false,detailIndex:0,sheetType:'floor_3d',sheetIndex:0,inquiry:''};
  const scene=new Scene();
  let opener=null,modalKind=null,entryTimer,sceneDirection=1,toggleFrom=null;
  const currentUnit=()=>byId.get(state.unitId);
  const currentFloors=()=>state.page==='mall'?data.mallFloors:state.page==='levels'?data.levels:data.floors;
  const currentFloor=()=>currentFloors().find(f=>f.id===state.floorId)||currentFloors().find(f=>f.id===data.defaultFloor)||currentFloors()[0];
  const gallery=()=>state.page==='masterplan'?data.scenes.filter(s=>s.night===state.night):(data.galleries[state.page]||[]);
  const remember=(replace=false)=>{const url=routeURL(state);if(location.pathname+location.search!==url)history[replace?'replaceState':'pushState'](null,'',url);};
  document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
  $('#proaco').src=data.brand.developer;$('#intro-logo').src=data.brand.logo;

  function restoreFocus(){if(opener?.isConnected)opener.focus();else $('[data-action="menu"]').focus();}
  function setOverlayState(){const open=!$('#drawer').hidden||!$('#searchpanel').hidden;$('#veil').hidden=!open;$('#app').inert=open;}
  function closeMenu(focus=true){$('#drawer').hidden=true;setOverlayState();if(focus)restoreFocus();}
  function closeSearch(focus=true){$('#searchpanel').hidden=true;$('#search').setAttribute('aria-expanded','false');setOverlayState();if(focus)restoreFocus();}
  function closeLayers(){closeMenu(false);closeSearch(false);if($('#modal').open)$('#modal').close();}
  function openModal(html,kind='info'){
    const fromSearch=!$('#searchpanel').hidden;
    if(!fromSearch)closeMenu(false);
    modalKind=kind;$('#modal').innerHTML=`<div class="modalbody">${panels.closeButton('closeModal')}${html}</div>`;
    $('#searchpanel').inert=fromSearch;
    if(!$('#modal').open)$('#modal').showModal();
  }
  function go(page,options={}) {
    closeLayers();
    state.page=page;state.slide=0;state.unitId=null;state.detailIndex=0;state.railHidden=false;sceneDirection=1;
    Object.assign(state,options);
    if(['floors','mall','levels'].includes(page))state.floorId=currentFloor().id;
    render();remember();
    if(page==='units')openSearch();
  }
  function pinsForFloor(floor){return state.mode2d?[]:floor.pins.map(p=>{const u=byId.get(p.unitId);return {...p,id:u.id,action:'unit',name:u.name,label:`Unidad ${u.name}, ${u.statusLabel}`,status:u.status,selected:state.unitId===u.id};});}
  function placeToggleKnob(){
    const t=$('#toggle'),a=$('.active',t),from=toggleFrom;toggleFrom=null;
    $('.knob',t)?.remove();
    if(!a||t.hidden)return;
    const knob=document.createElement('i'),to={left:a.offsetLeft,top:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight},px=r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,v+'px']));
    knob.className='knob';Object.assign(knob.style,px(to));t.prepend(knob);
    if(from&&!matchMedia('(prefers-reduced-motion: reduce)').matches)knob.animate([px(from),px(to)],{duration:300,easing:'cubic-bezier(.4,0,.2,1)'});
  }
  function render() {
    const intro=state.page==='intro',isFloor=['floors','mall','levels'].includes(state.page),g=gallery();
    document.body.classList.toggle('intro',intro);
    $('#intro').hidden=!intro;$('#back').hidden=intro||state.page==='masterplan';
    $('#search').hidden=!['masterplan','floors','units'].includes(state.page);
    $('#proaco').hidden=intro||['contact','work','map'].includes(state.page);
    $('#whatsapp').hidden=intro;
    $('#previous').hidden=$('#next').hidden=g.length<2;
    $('#zoom').hidden=intro||['contact','map','work'].includes(state.page);
    $('#toggle').hidden=!['masterplan','floors','mall','levels'].includes(state.page);
    $('#toggle').disabled=isFloor&&!currentFloor().plan;
    $('#toggle').innerHTML=isFloor?`<span class="${!state.mode2d?'active':''}">3D ◇</span><span class="${state.mode2d?'active':''}">▱ 2D</span>`:`<span class="${!state.night?'active':''}">Día ${icon('sun')}</span><span class="${state.night?'active':''}">${icon('moon')} Noche</span>`;
    placeToggleKnob();
    $('#toggle').setAttribute('aria-label',isFloor?(state.mode2d?'Cambiar a 3D':'Cambiar a 2D'):(state.night?'Cambiar a día':'Cambiar a noche'));
    state.slide=Math.min(state.slide,Math.max(g.length-1,0));
    let descriptor={src:data.scenes[0].src,alt:'Pocito Social Life'},pins=[],caption='';
    if(intro) descriptor={src:data.brand.intro,video:true,alt:'Portada animada Pocito Social Life'};
    else if(isFloor){
      const f=currentFloor();state.floorId=f.id;
      if(!f.plan)state.mode2d=false;
      descriptor={src:state.mode2d?f.plan:f.image,errorText:state.page==='levels'?`Falta la imagen ${state.mode2d?f.plan:f.image}`:null,alt:`${names[state.page]} · ${f.name} · ${state.mode2d?'2D':'3D'}`};
      pins=pinsForFloor(f);caption=names[state.page]+' · '+f.name;
    } else if(g.length){
      const item=g[state.slide];descriptor={...item,alt:`${names[state.page]} · ${item.label||'Vista '+(state.slide+1)}`};
      if(item.transition){
        descriptor.src=sceneDirection<0&&item.reverse?item.reverse:item.src;
        descriptor.loop=false;descriptor.onEnded=()=>advance(sceneDirection,true);
      }
      if(state.page==='masterplan')pins=(item.points||[]).map(p=>({...p,id:p.levelId??p.buildingId,action:p.levelId?'level':'building',label:p.name}));
      else caption=item.label||names[state.page];
    }
    scene.set(descriptor,pins);
    $('#caption').textContent=caption;
    $('#slide-count').textContent=g.length?`${state.slide+1} / ${g.length}`:'';
    if(intro)$('#video-toggle').hidden=true;
    renderRail();
    $('#content').innerHTML=state.page==='work'?panels.workHTML():state.page==='contact'?panels.contactHTML(data,state.inquiry):state.page==='map'?panels.mapHTML():'';
    $('#detail').innerHTML=currentUnit()&&state.page==='floors'?panels.detailHTML(currentUnit(),state.detailIndex):'';
    document.title=`${names[state.page]} | Pocito · Showroom local`;
  }
  function renderRail(){
    const rail=$('#rail'),oldScroll=rail.scrollTop;
    const floorPage=['floors','mall','levels'].includes(state.page);
    rail.className=floorPage?'floor':'';
    rail.innerHTML=floorPage?[...currentFloors()].reverse().map(f=>`<button data-floor="${f.id}" class="${f.id===state.floorId?'active':''}" aria-current="${f.id===state.floorId?'true':'false'}">${e(f.name)}</button>`).join(''):'';
    rail.hidden=state.railHidden;
    $('#hide-rail').hidden=!floorPage;
    $('#hide-rail').setAttribute('aria-label',`${state.railHidden?'Mostrar':'Ocultar'} ${floorPage?'pisos':'áreas'}`);
    $('#hide-rail').setAttribute('aria-expanded',String(!state.railHidden));
    rail.scrollTop=oldScroll;
    if(!rail.hidden){const active=$('.active',rail);if(active&&(active.offsetTop<rail.scrollTop||active.offsetTop+active.offsetHeight>rail.scrollTop+rail.clientHeight))rail.scrollTop=active.offsetTop-rail.clientHeight/2;}
  }
  function openMenu(){opener=document.activeElement;closeSearch(false);$('#drawer').innerHTML=panels.menuHTML(state.page,units.filter(u=>u.status==='available').length);$('#drawer').hidden=false;setOverlayState();$('.close',$('#drawer')).focus();}
  function openSearch(){opener=document.activeElement;closeMenu(false);$('#searchpanel').innerHTML=panels.searchHTML(state.filters,state.compare,state.view,state.expanded);$('#searchpanel').hidden=false;$('#search').setAttribute('aria-expanded','true');setOverlayState();renderResults();$('#query').focus();}
  function renderResults(){
    const result=filterUnits(units,state.filters);
    $('#count').textContent=`${result.length} ${result.length===1?'unidad':'unidades'}${result.length!==units.length?' de '+units.length:''}`;
    $('#results').className='resultlist '+(state.view==='list'?'list':'');
    $('#results').innerHTML=panels.cardsHTML(result,state.compare,state.selected);
    $('#selectedCount').textContent=state.selected.size?`${state.selected.size} seleccionadas (máx. 4)`:'Seleccioná hasta 4 unidades';
    $('#compareButton').disabled=state.selected.size<2;
    document.querySelectorAll('[data-view]').forEach(el=>{el.classList.toggle('active',el.dataset.view===state.view);el.setAttribute('aria-pressed',String(el.dataset.view===state.view));});
  }
  function selectComparison(id){const next=toggleComparison(state.selected,id);if(next.size===state.selected.size&&!state.selected.has(id))toast('Podés comparar hasta 4 unidades.');state.selected=next;renderResults();}
  function chooseUnit(id){
    if(state.compare&&!$('#searchpanel').hidden){selectComparison(id);return;}
    const u=byId.get(id);if(!u)return;
    closeLayers();state.page='floors';state.floorId=u.floorId;state.unitId=u.id;state.detailIndex=0;state.mode2d=false;
    render();remember();
  }
  function openSheet(){const u=currentUnit();if(!u)return;const types=panels.sheetTypes.map(([t])=>t);if(!u.images.some(i=>i.type===state.sheetType))state.sheetType=types.find(t=>u.images.some(i=>i.type===t));openModal(panels.sheetHTML(u,state.sheetType,state.sheetIndex),'sheet');}
  function advanceSheet(delta){const n=currentUnit().images.filter(i=>i.type===state.sheetType).length;state.sheetIndex=(state.sheetIndex+delta+n)%n;openSheet();}
  function advanceDetail(delta){const u=currentUnit();const n=Math.max(1,u.images.filter(i=>i.type==='gallery').length);state.detailIndex=(state.detailIndex+delta+n)%n;$('#detail').innerHTML=panels.detailHTML(u,state.detailIndex);}
  function building(id){if(id===166)go('floors',{floorId:data.defaultFloor});else if(id===168)go('mall',{floorId:data.mallFloors[0].id});else openModal(`<h2>${id===167?'Planta baja':'Piso 2'}</h2><p>${id===167?'100% vendido':'Próximamente'}</p><p class="muted">Estado indicado por el showroom de referencia.</p>`);}
  function advance(delta,replace=false){
    const g=gallery();if(!g.length)return;sceneDirection=Math.sign(delta)||1;
    state.slide=(state.slide+sceneDirection+g.length)%g.length;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){
      for(let i=0;i<g.length&&g[state.slide].transition;i++)state.slide=(state.slide+sceneDirection+g.length)%g.length;
    }
    scene.reset();render();remember(replace);
  }
  function finishEntry(){clearTimeout(entryTimer);const video=$('#transition video');video.pause();video.removeAttribute('src');video.load();$('#transition').hidden=true;go('masterplan');}
  function enter(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){go('masterplan');return;}
    $('#transition').hidden=false;const video=$('#transition video');video.src=data.brand.entry;video.onended=finishEntry;video.onerror=finishEntry;
    video.play().catch(finishEntry);entryTimer=setTimeout(finishEntry,25000);$('[data-action="skip"]').focus();
  }
  const actions={
    menu:openMenu,closeMenu,search:openSearch,
    closeSearch:()=>{closeSearch();if(state.page==='units')go('masterplan');},
    closeModal:()=>$('#modal').close(),enter,skip:finishEntry,
    back:()=>go(['floors','mall','levels','units'].includes(state.page)?'masterplan':'intro'),
    prev:()=>advance(-1),next:()=>advance(1),zoomin:()=>scene.setZoom(scene.zoom+.25),zoomout:()=>scene.setZoom(scene.zoom-.25),resetZoom:()=>scene.reset(),video:()=>scene.toggleVideo(),
    rail:()=>{state.railHidden=!state.railHidden;renderRail();},
    toggle:()=>{const a=$('#toggle .active');toggleFrom=a&&{left:a.offsetLeft,top:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight};if(['floors','mall','levels'].includes(state.page)){state.mode2d=!state.mode2d;state.unitId=null;}else{state.night=!state.night;state.slide=0;}scene.reset();render();remember();},
    fullscreen:async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Pantalla completa no disponible en este navegador.');}},
    qr:()=>openModal('<h2>QR · Pocito Social Life</h2><p>Este código abre el showroom original.</p><img class="qr" src="/assets/legacy/qr.svg" alt="QR del showroom original Pocito"><a class="primary" href="/assets/legacy/qr.svg" download="Pocito-QR.svg">Descargar QR (SVG)</a>'),
    contact:()=>go('contact'),inquire:()=>{state.inquiry=currentUnit()?'Consulta por unidad '+currentUnit().name:'';go('contact');},
    areas:()=>{closeMenu(false);openModal(`<h2>Áreas</h2><div class="area-grid"><button class="secondary" disabled>Torre 1<br><small>100% vendido</small></button><button class="primary" data-building="166">Torre 2<br><small>${units.filter(u=>u.status==='available').length} disponibles</small></button><button class="secondary" disabled>Torre 3<br><small>Próximamente</small></button><button class="secondary" data-building="168">Mall &amp; Parking<br><small>4 niveles</small></button></div>`);},
    about:()=>{closeMenu(false);openModal(panels.aboutHTML(data));},
    languages:()=>openModal('<h2>Idioma</h2><p>Esta reconstrucción funciona en español. El original ofrece Español, English, Português e Italiano.</p><a class="primary" href="https://pocito.urbania3d.app" target="_blank" rel="noopener noreferrer">Abrir idiomas en el original ↗</a>'),
    filters:()=>{state.expanded=!state.expanded;$('#extraFilters').hidden=!state.expanded;$('[data-action="filters"]').setAttribute('aria-expanded',state.expanded);},
    resetFilters:()=>{state.filters=defaultFilters();openSearch();},
    clearCompare:()=>{state.selected.clear();renderResults();},
    compare:()=>{if(state.selected.size>=2)openModal(panels.comparisonHTML(units.filter(u=>state.selected.has(u.id))),'compare');},
    closeDetail:()=>{state.unitId=null;render();remember();},
    detailPrev:()=>advanceDetail(-1),detailNext:()=>advanceDetail(1),sheet:()=>{state.sheetIndex=0;openSheet();},sheetPrev:()=>advanceSheet(-1),sheetNext:()=>advanceSheet(1),
    shareUnit:async()=>{try{await navigator.clipboard.writeText(location.href);toast('Enlace local copiado. Funciona en este equipo mientras el servidor esté activo.');}catch{toast('Copiá el enlace de la barra del navegador.');}},
    tour:()=>{const tour=currentUnit()?.tours[0];if(tour)openModal(`<h2>Tour 360° · Unidad ${e(currentUnit().name)}</h2><p class="tour-notice">Recorrido alojado en Kuula. Necesita conexión a Internet.</p><button class="primary" data-action="loadTour">Cargar recorrido 360°</button><p><a href="${e(tour.url)}" target="_blank" rel="noopener noreferrer">Abrir en otra pestaña ↗</a></p>`,'tour');},
    loadTour:()=>{const tour=currentUnit()?.tours[0];if(tour)openModal(`<h2>Tour 360° · Unidad ${e(currentUnit().name)}</h2><iframe class="tour-frame" src="${e(tour.url)}" title="Tour 360 de la unidad ${e(currentUnit().name)}" allow="fullscreen" allowfullscreen></iframe><p class="muted">Contenido externo de Kuula. <a href="${e(tour.url)}" target="_blank" rel="noopener noreferrer">Abrir el recorrido en otra pestaña</a></p>`,'tour');},
    loadMap:()=>{$('#map-consent').outerHTML='<iframe title="Ubicación de Pocito en Google Maps" src="https://maps.google.com/maps?q=Av.%20V%C3%A9lez%20Sarsfield%201100%2C%20C%C3%B3rdoba%2C%20Argentina&z=16&t=k&output=embed" referrerpolicy="no-referrer-when-downgrade" loading="lazy"></iframe>';}
  };
  addEventListener('resize',placeToggleKnob);document.fonts?.ready.then(placeToggleKnob);
  document.addEventListener('click',event=>{
    if(event.target.matches('[data-compare]'))return;
    const target=event.target.closest('[data-action],[data-page],[data-unit],[data-building],[data-level],[data-floor],[data-beds],[data-view],[data-sheet-type],[data-photo],[data-poi]');
    if(!target||target.disabled)return;
    const d=target.dataset;
    if(d.action){actions[d.action]?.();return;}
    if(d.page){event.preventDefault();go(d.page);return;}
    if(d.unit){chooseUnit(Number(d.unit));return;}
    if(d.building){building(Number(d.building));return;}
    if(d.level){go('levels',{floorId:Number(d.level)});return;}
    if(d.floor){state.floorId=Number(d.floor);state.unitId=null;scene.reset();render();remember();return;}
    if(d.beds){state.filters.beds=state.filters.beds===Number(d.beds)?0:Number(d.beds);document.querySelectorAll('[data-beds]').forEach(b=>{b.classList.toggle('active',Number(b.dataset.beds)===state.filters.beds);b.setAttribute('aria-pressed',String(Number(b.dataset.beds)===state.filters.beds));});renderResults();return;}
    if(d.view){state.view=d.view;renderResults();return;}
    if(d.sheetType){state.sheetType=d.sheetType;state.sheetIndex=0;openSheet();return;}
    if(d.photo){openModal(`<h2>Avances de Obra</h2><img style="max-width:100%;max-height:70vh;object-fit:contain" src="/assets/legacy/work${Number(d.photo)}.jpg" alt="Fotografía de avance de obra">`);return;}
    if(d.poi){const origin='Av. Vélez Sarsfield 1100, Córdoba, Argentina',destination=panels.pointsOfInterest[Number(d.poi)]+', Córdoba, Argentina';window.open('https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(origin)+'&destination='+encodeURIComponent(destination),'_blank','noopener,noreferrer');}
  });
  document.addEventListener('input',event=>{
    const t=event.target;if(!t.dataset.filter)return;
    state.filters[t.dataset.filter]=t.type==='checkbox'?t.checked:t.type==='number'?Number(t.value):t.value;renderResults();
  });
  document.addEventListener('change',event=>{
    const t=event.target;
    if(t.id==='compareToggle'){state.compare=t.checked;renderResults();}
    if(t.dataset.compare)selectComparison(Number(t.dataset.compare));
  });
  $('#veil').addEventListener('click',()=>{closeMenu(false);actions.closeSearch();});
  $('#modal').addEventListener('close',()=>{modalKind=null;$('#modal').innerHTML='';$('#searchpanel').inert=false;});
  $('#modal').addEventListener('click',event=>{if(event.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)$('#modal').close();}});
  document.addEventListener('keydown',event=>{
    const layer=!$('#drawer').hidden?$('#drawer'):!$('#searchpanel').hidden?$('#searchpanel'):null;
    if(event.key==='Tab'&&layer&&!$('#modal').open){const focusables=[...layer.querySelectorAll('button,a,input,select,textarea')].filter(el=>!el.disabled&&el.getClientRects().length);const first=focusables[0],last=focusables.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
    if(event.key==='Escape'){if($('#modal').open)return;if(!$('#transition').hidden){finishEntry();return;}if(layer){closeMenu(false);actions.closeSearch();return;}if(state.unitId)actions.closeDetail();return;}
    if(event.target.dataset.unit&&(event.key==='Enter'||event.key===' ')){event.preventDefault();chooseUnit(Number(event.target.dataset.unit));return;}
    if(event.target.matches('input,textarea,select')||$('#modal').open||layer||!$('#transition').hidden)return;
    if(event.key==='ArrowRight')advance(1);if(event.key==='ArrowLeft')advance(-1);
    if(event.key==='+')scene.setZoom(scene.zoom+.25);if(event.key==='-')scene.setZoom(scene.zoom-.25);if(event.key==='0')scene.reset();
  });
  document.addEventListener('submit',event=>{
    if(event.target.id!=='contactform')return;event.preventDefault();const f=new FormData(event.target);
    const body=`Nombre: ${f.get('name')}\nEmail: ${f.get('email')}\nTeléfono: ${f.get('phone')}\n\n${f.get('message')}`;
    location.href='mailto:info@grupoproaco.com?subject='+encodeURIComponent(f.get('reason')||'Consulta Pocito')+'&body='+encodeURIComponent(body);toast('Revisá el mensaje en tu aplicación de correo antes de enviarlo.');
  });
  window.addEventListener('popstate',()=>{closeLayers();sceneDirection=1;Object.assign(state,readRoute(new URL(location.href)));render();if(state.page==='units')openSearch();});
  document.addEventListener('fullscreenchange',()=>$('[data-action="fullscreen"]').setAttribute('aria-label',document.fullscreenElement?'Salir de pantalla completa':'Pantalla completa'));
  render();
  if(state.page==='units')openSearch();
}
main().catch(error=>{console.error(error);$('#scene-loading').hidden=true;$('#content').innerHTML='<section class="contentpage"><h1>No se pudo iniciar el showroom</h1><p>Comprobá que el servidor local esté activo y volvé a cargar la página.</p><a href="/">Reintentar</a></section>';});
