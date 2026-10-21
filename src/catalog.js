export const defaultFilters = () => ({ query:'', beds:0, floor:0, orientation:'', minArea:53, maxArea:82, maxPrice:215000, available:false, balcony:false, sort:'floorAsc' });
export function filterUnits(units, f) {
  const query = f.query.trim().toLowerCase();
  const filtered = units.filter(u => u.name.toLowerCase().includes(query)
    && (!f.beds || u.beds === Number(f.beds)) && (!f.floor || u.floor === Number(f.floor))
    && (!f.orientation || u.orientation === f.orientation)
    && u.area >= Number(f.minArea) && u.area <= Number(f.maxArea)
    && (u.price == null || u.price <= Number(f.maxPrice))
    && (!f.available || u.status === 'available') && (!f.balcony || u.balconies > 0));
  const comparators = {
    floorAsc:(a,b)=>a.floor-b.floor || a.name.localeCompare(b.name,undefined,{numeric:true}),
    floorDesc:(a,b)=>b.floor-a.floor || a.name.localeCompare(b.name,undefined,{numeric:true}),
    priceAsc:(a,b)=>(a.price ?? Infinity)-(b.price ?? Infinity),
    priceDesc:(a,b)=>(b.price ?? -Infinity)-(a.price ?? -Infinity),
    areaAsc:(a,b)=>a.area-b.area,
  };
  return filtered.sort(comparators[f.sort] || comparators.floorAsc);
}
export function toggleComparison(selected, id) {
  const next = new Set(selected);
  if(next.has(id)) next.delete(id);
  else if(next.size<4) next.add(id);
  return next;
}
export function hydrateUnits(data) {
  const typologies = new Map(data.typologies.map(t=>[t.id,t]));
  return data.units.map(u=>({...typologies.get(u.typologyId),...u}));
}
