import { $, escapeHTML, toast } from './utils.js';

/** Image and video viewer. Hotspots use percentages from the public scene geometry. */
export class Scene {
  constructor() {
    this.frame = $('#scene'); this.visual = $('#visual'); this.media = $('#media'); this.hotspots = $('#hotspots');
    this.zoom = 1; this.x = 0; this.y = 0; this.ratio = 16/9; this.token = 0;
    new ResizeObserver(()=>this.fit()).observe(this.frame);
    this.frame.addEventListener('wheel',event=>{event.preventDefault();this.setZoom(this.zoom+(event.deltaY<0?.15:-.15));},{passive:false});
    this.frame.addEventListener('pointerdown',event=>{
      if(event.button!==0 || event.target.closest('button')) return;
      this.drag={id:event.pointerId,startX:event.clientX,startY:event.clientY,x:this.x,y:this.y,moved:false};
    });
    this.frame.addEventListener('pointermove',event=>{
      const d=this.drag;if(!d||d.id!==event.pointerId)return;
      const dx=event.clientX-d.startX,dy=event.clientY-d.startY;
      if(Math.hypot(dx,dy)>6){d.moved=true;this.frame.setPointerCapture(event.pointerId);this.frame.classList.add('dragging');}
      if(d.moved){this.x=d.x+dx;this.y=d.y+dy;this.transform();}
    });
    const end=()=>{if(this.drag?.moved){this.suppressClick=true;setTimeout(()=>this.suppressClick=false,0);}this.drag=null;this.frame.classList.remove('dragging');};
    this.frame.addEventListener('pointerup',end);this.frame.addEventListener('pointercancel',end);
    this.frame.addEventListener('click',e=>{if(this.suppressClick){e.preventDefault();e.stopPropagation();}},true);
    this.frame.addEventListener('pointerleave',()=>{if(!this.drag?.moved)this.drag=null;});
  }
  set(descriptor, pins=[]) {
    this.contain=!!descriptor.contain;
    if(this.src!==descriptor.src) {
      this.src=descriptor.src;this.zoom=1;this.x=0;this.y=0;
      this.media.querySelector('video')?.pause();
      const token=++this.token;
      const element=document.createElement(descriptor.video?'video':'img');
      this.media.replaceChildren(element);
      $('#scene-loading').hidden=false;
      const ready=()=>{
        if(token!==this.token)return;
        this.ratio=descriptor.video?element.videoWidth/element.videoHeight:element.naturalWidth/element.naturalHeight;
        this.fit();$('#scene-loading').hidden=true;
      };
      element.addEventListener(descriptor.video?'loadeddata':'load',ready,{once:true});
      element.addEventListener('error',()=>{if(token===this.token){$('#scene-loading').hidden=true;toast(descriptor.errorText||'No se pudo cargar esta escena. Probá otra vista.');}},{once:true});
      if(descriptor.video) {
        element.muted=true;element.loop=descriptor.loop??true;element.playsInline=true;element.preload='auto';
        element.addEventListener('ended',()=>{if(token===this.token)descriptor.onEnded?.();});
        const updatePlayback=()=>{if(token===this.token)$('#video-toggle').textContent=element.paused?'Reproducir vídeo':'Pausar vídeo';};
        element.addEventListener('play',updatePlayback);element.addEventListener('pause',updatePlayback);
        element.setAttribute('aria-label',descriptor.alt||'Escena animada del showroom');
        element.src=descriptor.src;
        if(!matchMedia('(prefers-reduced-motion: reduce)').matches) element.play().catch(()=>{});
      } else {element.alt=descriptor.alt||'Vista del showroom';element.draggable=false;element.src=descriptor.src;}
    }
    this.hotspots.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${pins.map(p=>`<polygon class="region ${p.status||''} ${p.selected?'selected':''}" data-${p.action}="${p.id}" points="${p.vertices.map(v=>v.x+','+v.y).join(' ')}"/>`).join('')}</svg>` + pins.map(p=>`<button class="pin ${p.status||''} ${p.selected?'selected':''}" data-${p.action}="${p.id}" style="left:${p.x}%;top:${p.y}%" aria-label="${escapeHTML(p.label)}" aria-pressed="${!!p.selected}">${escapeHTML(p.name)}</button>`).join('');
    $('#video-toggle').hidden=!descriptor.video;
    $('#video-toggle').textContent=matchMedia('(prefers-reduced-motion: reduce)').matches?'Reproducir vídeo':'Pausar vídeo';
    this.fit();
  }
  fit() {
    const w=this.frame.clientWidth,h=this.frame.clientHeight;
    const width=this.contain?Math.min(w,h*this.ratio):Math.max(w,h*this.ratio);
    this.width=width;this.height=width/this.ratio;
    Object.assign(this.visual.style,{width:width+'px',height:this.height+'px',left:(w-width)/2+'px',top:(h-this.height)/2+'px'});
    this.transform();
  }
  transform() {
    const maxX=Math.max(0,(this.width*this.zoom-this.frame.clientWidth)/2);
    const maxY=Math.max(0,(this.height*this.zoom-this.frame.clientHeight)/2);
    this.x=Math.max(-maxX,Math.min(maxX,this.x));this.y=Math.max(-maxY,Math.min(maxY,this.y));
    this.visual.style.transform=`translate(${this.x}px,${this.y}px) scale(${this.zoom})`;
    $('#zoom-out').disabled=this.zoom<=1;$('#zoom-in').disabled=this.zoom>=3;
    this.frame.style.cursor=maxX||maxY?'grab':'default';
  }
  setZoom(value) {this.zoom=Math.max(1,Math.min(3,value));this.transform();}
  reset(){this.zoom=1;this.x=0;this.y=0;this.transform();}
  toggleVideo(){const video=this.media.querySelector('video');if(!video)return;video.paused?video.play().catch(()=>toast('No se pudo reproducir el vídeo.')):video.pause();$('#video-toggle').textContent=video.paused?'Reproducir vídeo':'Pausar vídeo';}
}
