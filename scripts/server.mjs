import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const production=process.argv.includes('--production');
const base=path.join(root,production?'dist':'public');
const port=Number(process.env.PORT)||4173;
const localURL=`http://127.0.0.1:${port}`;
const openBrowser=()=>{
  if(!process.argv.includes('--open'))return;
  const command=process.platform==='win32'?'cmd.exe':process.platform==='darwin'?'open':'xdg-open';
  const args=process.platform==='win32'?['/d','/c','start','""',localURL]:[localURL];
  const child=spawn(command,args,{windowsHide:true,stdio:'ignore'});
  child.on('error',()=>console.log(`Abre ${localURL} en tu navegador.`));
};
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.md':'text/plain; charset=utf-8'};
export const server=http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end('Method not allowed');}
  let route;
  try{route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end('Bad request');}
  const source=!production&&route.startsWith('/src/');
  const allowedRoot=source?path.join(root,'src'):base;
  let file=path.resolve(allowedRoot,'.'+(source?route.slice(4):route));
  if(!file.startsWith(allowedRoot+path.sep)&&file!==allowedRoot){res.writeHead(403);return res.end('Forbidden');}
  if(!path.extname(route))file=path.join(base,'index.html');
  fs.stat(file,(error,stat)=>{
    if(error||!stat.isFile()){res.writeHead(404);return res.end('Not found');}
    const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache','Accept-Ranges':'bytes','X-Pocito-Showroom':'local'};
    let start=0,end=stat.size-1,status=200;
    if(req.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if(!match){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}
      if(!match[1]){start=Math.max(0,stat.size-Number(match[2]));}else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
      if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length']=end-start+1;
    res.writeHead(status,headers);
    if(req.method==='HEAD')return res.end();
    const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
  });
});
server.listen(port,'127.0.0.1',()=>{
  console.log(`Pocito showroom local: ${localURL}\nCtrl+C para detener el servidor.`);
  openBrowser();
});
server.on('error',async error=>{
  if(error.code==='EADDRINUSE'){
    try{
      const existing=await fetch(localURL,{method:'HEAD',signal:AbortSignal.timeout(2000)});
      if(existing.headers.get('X-Pocito-Showroom')==='local'){
        console.log(`El showroom ya está iniciado en ${localURL}.`);
        openBrowser();return;
      }
    }catch{}
    console.error(`El puerto ${port} está ocupado por otro servicio. Cierra ese servicio o elige otro puerto con PORT.`);
  }else console.error(error.message);
  process.exitCode=1;
});
