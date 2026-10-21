import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {hydrateUnits,filterUnits,defaultFilters,toggleComparison} from '../src/catalog.js';
import {readRoute,routeURL} from '../src/router.js';
const data=JSON.parse(await fs.readFile(new URL('../public/data/showroom.json',import.meta.url)));
const units=hydrateUnits(data);
test('390 unique units, real floor relations, complete typologies',()=>{
  assert.equal(units.length,390);assert.equal(new Set(units.map(u=>u.id)).size,390);
  for(const u of units){assert.ok(u.area>0);assert.ok(u.images.length);assert.ok(data.floors.some(f=>f.id===u.floorId&&f.pins.some(p=>p.unitId===u.id)));}
});
test('verified unit 14-15 retains exact public values',()=>{
  const [u]=filterUnits(units,{...defaultFilters(),query:'14-15'});
  assert.equal(u.id,4426);assert.equal(u.price,127111);assert.equal(u.area,54);assert.equal(u.beds,1);assert.equal(u.covered,42);assert.equal(u.status,'available');assert.equal(u.orientation,'Sur');
});
test('availability and combined filters do not include sold or mismatched units',()=>{
  assert.equal(filterUnits(units,{...defaultFilters(),available:true}).length,90);
  const result=filterUnits(units,{...defaultFilters(),available:true,beds:2,orientation:'Este',maxPrice:212000});
  assert.ok(result.length>0);assert.ok(result.every(u=>u.status==='available'&&u.beds===2&&u.orientation==='Este'&&(u.price==null||u.price<=212000)));
  assert.equal(filterUnits(units,{...defaultFilters(),minArea:82,maxArea:53}).length,0);
});
test('unknown prices sort after known prices in both directions',()=>{
  const sample=[{name:'1',area:54,floor:1,price:null},{name:'2',area:54,floor:1,price:120000},{name:'3',area:54,floor:1,price:100000}];
  assert.deepEqual(filterUnits(sample,{...defaultFilters(),sort:'priceAsc'}).map(u=>u.name),['3','2','1']);
  assert.deepEqual(filterUnits(sample,{...defaultFilters(),sort:'priceDesc'}).map(u=>u.name),['2','3','1']);
});
test('comparison caps at four and permits removal',()=>{
  let selected=new Set();for(let i=1;i<=5;i++)selected=toggleComparison(selected,i);
  assert.equal(selected.size,4);assert.ok(!selected.has(5));selected=toggleComparison(selected,2);assert.equal(selected.size,3);
});
test('deep links round-trip floor, unit and mode and parse unknown routes safely',()=>{
  const s={page:'floors',floorId:736,unitId:4426,mode2d:true,slide:0,night:false};
  assert.deepEqual(readRoute(new URL(routeURL(s),'http://localhost')),s);
  assert.equal(readRoute(new URL('http://localhost/unknown')).page,'intro');
  assert.equal(readRoute(new URL('http://localhost/masterplan?slide=-4')).slide,0);
});
test('every normalized media reference exists locally and is nonempty',async()=>{
  const references=new Set(JSON.stringify(data).match(/\/assets\/media\/[^"\s]+/g));
  assert.ok(references.size>500);
  await Promise.all([...references].map(async file=>{const stat=await fs.stat(new URL('../public'+file,import.meta.url));assert.ok(stat.size>0,file);}));
});

test('levels page deep link round-trips and every masterplan point opens an existing level',()=>{
  const s={page:'levels',floorId:2,unitId:null,mode2d:true,slide:0,night:false};
  assert.deepEqual(readRoute(new URL(routeURL(s),'http://localhost')),s);
  for(const scene of data.scenes)for(const p of scene.points)assert.ok(data.levels.some(l=>l.id===p.levelId));
});
