export const paths = {intro:'/',masterplan:'/masterplan',units:'/units',floors:'/buildings/166/floors',mall:'/buildings/168/floors',levels:'/niveles',model:'/custom/unidad-modelo',amenities:'/amenities',corporate:'/custom/pocito-corporativo',work:'/work-progress',map:'/location/map',contact:'/contact'};
export const names = {intro:'Inicio',masterplan:'Masterplan',units:'Unidades',floors:'Torre 2',mall:'Mall & Parking',levels:'Niveles',model:'Unidad Modelo',amenities:'Amenities',corporate:'Pocito Corporativo',work:'Avances de Obra',map:'Ubicación',contact:'Contacto'};
export function readRoute(url) {
  const path = url.pathname.replace(/\/$/,'') || '/';
  const page = Object.entries(paths).find(([,v])=>v===path)?.[0] || 'intro';
  return {page,night:url.searchParams.get('time')==='night',slide:Math.max(0,(Number(url.searchParams.get('slide'))||1)-1),floorId:Number(url.searchParams.get('floor'))||null,mode2d:url.searchParams.get('mode')==='2d',unitId:Number(url.searchParams.get('unit'))||null};
}
export function routeURL(state) {
  const p = new URLSearchParams();
  if(state.night && state.page==='masterplan') p.set('time','night');
  if(state.slide) p.set('slide',state.slide+1);
  if(['floors','mall','levels'].includes(state.page)) {
    p.set('floor',state.floorId);
    if(state.mode2d) p.set('mode','2d');
    if(state.unitId) p.set('unit',state.unitId);
  }
  return paths[state.page] + (p.size?'?'+p:'');
}
