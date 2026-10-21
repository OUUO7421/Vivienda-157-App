// Downloads only the public media URLs recorded in assets-manifest.json.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await fs.readFile(path.join(root,'research/assets-manifest.json'),'utf8'));
const queue = [...manifest];
let completed = 0, bytes = 0;
const failures = [];
await Promise.all(Array.from({length:6},async()=>{
  while(queue.length) {
    const item = queue.shift();
    if(new URL(item.url).hostname !== 'assets.urbania3d.app') throw new Error('Unapproved asset origin');
    const destination = path.join(root,'public',item.local);
    try {
      const existing = await fs.stat(destination).catch(()=>null);
      if(existing?.size) { completed++; continue; }
      let body;
      for(let attempt=0;attempt<3;attempt++) {
        try {
          const response = await fetch(item.url,{signal:AbortSignal.timeout(60000)});
          if(!response.ok) throw new Error(`HTTP ${response.status}`);
          body = Buffer.from(await response.arrayBuffer());
          if(!body.length) throw new Error('Empty media');
          break;
        } catch(error) { if(attempt===2) throw error; }
      }
      await fs.writeFile(destination,body);
      bytes += body.length;
      completed++;
      if(completed%30===0) console.log(`${completed}/${manifest.length} archivos, ${(bytes/1024/1024).toFixed(1)} MB descargados`);
    } catch(error) {failures.push({url:item.url,error:error.message});}
  }
}));
await fs.writeFile(path.join(root,'research/download-report.json'),JSON.stringify({completed,bytes,failures},null,2));
console.log(JSON.stringify({completed,total:manifest.length,megabytes:(bytes/1024/1024).toFixed(1),failures}));
if(failures.length) process.exitCode=1;
