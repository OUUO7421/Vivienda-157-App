import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
await fs.mkdir(dist,{recursive:true});
await fs.cp(path.join(root,'public'),dist,{recursive:true});
await fs.cp(path.join(root,'src'),path.join(dist,'src'),{recursive:true});
console.log('Build estático listo en dist/. No requiere backend ni compilador en producción.');
