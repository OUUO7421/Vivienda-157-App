import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const origin = `http://127.0.0.1:${Number(process.env.PORT) || 4173}`;
const data = JSON.parse(await fs.readFile(new URL('../public/data/showroom.json', import.meta.url)));
const video = data.scenes.find(scene => scene.video).src;
const cases = [
  ['Portada', '/', {}, 200, 'text/html'],
  ['Enlace directo a una unidad', '/buildings/166/floors?floor=736&unit=4426', {}, 200, 'text/html'],
  ['Módulo de aplicación', '/src/app.js', {}, 200, 'text/javascript'],
  ['Catálogo local', '/data/showroom.json', {}, 200, 'application/json'],
  ['Lectura parcial de vídeo', video, {headers:{Range:'bytes=0-15'}}, 206, 'video/mp4'],
  ['Rango inválido', video, {headers:{Range:'bytes=999999999999-'}}, 416],
  ['Datos de investigación fuera de la web', '/research/intro.json', {}, 404],
  ['Escritura no permitida', '/', {method:'POST'}, 405],
];
for (const [name, route, options, status, type] of cases) {
  const response = await fetch(origin + route, {...options, signal:AbortSignal.timeout(10000)});
  assert.equal(response.status, status, name);
  if (type) assert.ok(response.headers.get('content-type')?.startsWith(type), name);
  if (status === 206) {
    assert.match(response.headers.get('content-range'), /^bytes 0-15\/\d+$/);
    assert.equal((await response.arrayBuffer()).byteLength, 16);
  } else {
    await response.body?.cancel();
  }
  console.log(`OK · ${name}`);
}
console.log(`8 comprobaciones HTTP superadas en ${origin}.`);
