import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = async n => JSON.parse(await fs.readFile(path.join(root, 'research', n + '.json'), 'utf8'));
const [intro, tower, mall, corporate, model, amenities] = await Promise.all(['intro','building','mall','model','corporate','amenities'].map(read));
await fs.mkdir(path.join(root, 'public/data'), { recursive: true });
await fs.mkdir(path.join(root, 'public/assets/media'), { recursive: true });
const manifest = new Map();
function asset(url) {
  if (!url) return null;
  const hash = createHash('sha256').update(url).digest('hex').slice(0,16);
  const local = '/assets/media/' + hash + path.extname(new URL(url).pathname);
  manifest.set(url, { url, local });
  return local;
}
const orientations = { south:'Sur', north:'Norte', west:'Oeste', east:'Este' };
const statusNames = { available:'Disponible', sold:'Vendido', reserved:'Reservado', blocked:'Bloqueado', not_available:'No disponible' };
const units = new Map();
const typologies = new Map();
function floor(f) {
  const points = f.masks?.points || [];
  const pins = (f.masks?.mask_assignments || []).filter(a=>a.units).map(a => {
    const u = a.units, t = u.typologies, point = points[a.point_index];
    if (!typologies.has(t.id)) typologies.set(t.id, {
      id:t.id, name:t.name, area:t.total_area, covered:t.internal_area, external:t.external_area, common:t.common_area,
      beds:t.bedrooms, baths:t.bathrooms, balconies:t.balconies,
      images:(t.typology_images || []).map(x=>({src:asset(x.image_url),type:x.image_type,position:x.display_position})).sort((a,b)=>a.position-b.position),
      tours:(t.typology_tours || []).map(x=>({name:x.name,url:x.tour_360_url}))
    });
    units.set(u.id, { id:u.id, name:u.name, floorId:f.id, floor:parseInt(f.name), typologyId:t.id, status:u.status,
      statusLabel:statusNames[u.status] || u.status, priceLabel:u.show_price ? u.price : null,
      price:u.show_price && u.price != null ? Number(String(u.price).replace(/[^0-9]/g,'')) : null,
      orientation:orientations[u.orientation] || u.custom_orientation || '', installments:u.installments,
      possession:u.possession_date, initialPayment:u.initial_payment_percentage, discount:u.discount_percentage });
    return point ? {x:point.x,y:point.y,vertices:point.polygon?.vertices||[],unitId:u.id} : null;
  }).filter(Boolean);
  return {id:f.id,name:f.name,image:asset(f.image_url),plan:asset(f.plan_image_url),pins};
}
const floors = tower.floors.map(floor);
const mallFloors = mall.floors.map(floor);
const scenes = intro.masterplans[0].masterplan_content.map(s=>({
  id:s.id, src:asset(s.content_url), reverse:asset(s.reverse_content_url), night:s.content_type==='night', video:/\.mp4$/i.test(s.content_url), transition:/\.mp4$/i.test(s.content_url)&&!s.is_static_video,
  points:s.masterplan_content_points.map(p=>({id:p.id,x:p.x,y:p.y,name:p.buildings?.name,buildingId:p.building_id,vertices:p.polygon?.vertices||[]}))
}));
const gallery = items => items.sort((a,b)=>a.display_position-b.display_position).map(x=>({src:asset(x.content_url),label:x.label||'',contain:!!x.preserve_aspect_ratio}));
const data = {
  capturedAt:'2026-10-19',source:'https://pocito.urbania3d.app',
  brand:{logo:asset(intro.project.logo_url),developer:asset(intro.project.branding_logo_url),intro:asset(intro.project.cover_image_url),entry:asset(intro.masterplans[0].intro_video_url),contact:asset(intro.project.contact_background_url)},
  scenes, floors, mallFloors, defaultFloor:756,units:[...units.values()],typologies:[...typologies.values()],
  galleries:{model:gallery(model),corporate:gallery(corporate),amenities:gallery(amenities)}
};
await fs.writeFile(path.join(root,'public/data/showroom.json'),JSON.stringify(data));
await fs.writeFile(path.join(root,'research/assets-manifest.json'),JSON.stringify([...manifest.values()],null,2));
console.log(JSON.stringify({units:units.size,typologies:typologies.size,floors:floors.length,mallFloors:mallFloors.length,assets:manifest.size}));
