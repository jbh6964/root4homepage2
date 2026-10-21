const TAU=Math.PI*2;
const fract=value=>value-Math.floor(value);
const noise=seed=>fract(Math.sin(seed*127.1+311.7)*43758.5453);

// A small, dependency-free light field. Camera coordinates come from the same
// finite journey as the SVG; pointer movement never changes the scroll camera.
export class SceneEffects {
 constructor(canvas,scene,container,detail){
  this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true});this.scene=scene;this.container=container;this.detail=detail;
  this.pointer={x:0,y:0};this.target={x:0,y:0};this.phase=1.8;this.enabled=true;this.paused=false;this.raf=0;
  this.fine=matchMedia('(hover:hover) and (pointer:fine)');
  this.particles=Array.from({length:72},(_,i)=>({x:350+noise(i+3)*2150,y:220+noise(i+93)*1330,z:noise(i+171),phase:noise(i+75)*TAU}));
  this.frame=this.frame.bind(this);
  container.addEventListener('pointermove',event=>{
   if(!this.enabled||this.paused||!this.fine.matches||event.pointerType==='touch')return;
   const rect=container.getBoundingClientRect();this.target.x=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));this.target.y=Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1));
  },{passive:true});
  container.addEventListener('pointerleave',()=>{if(!this.paused){this.target.x=0;this.target.y=0;this.scene.focus(-1);}});
  this.fine.addEventListener('change',()=>{this.target.x=0;this.target.y=0;});
 }
 update(cam,width,height){
  this.cam=cam;this.width=width;this.height=height;
  const dpr=Math.min(devicePixelRatio||1,1.25),w=Math.round(width*dpr),h=Math.round(height*dpr);
  if(this.canvas.width!==w||this.canvas.height!==h||this.dpr!==dpr){this.canvas.width=w;this.canvas.height=h;this.dpr=dpr;this.dirty=true;}
  // Static motion mode still follows intentional scrolling and viewport changes.
  if(this.paused&&this.enabled)this.draw();
  this.wake();
 }
 setState({paused,enabled}){
  const wasEnabled=this.enabled;this.paused=paused;this.enabled=enabled;
  if(!enabled){this.target.x=this.target.y=this.pointer.x=this.pointer.y=0;this.applyPointer();if(this.ctx)this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}
  if(paused||!enabled){cancelAnimationFrame(this.raf);this.raf=0;this.last=0;}else if(wasEnabled!==enabled||!this.raf){this.last=0;this.wake();}
 }
 wake(){if(this.enabled&&!this.paused&&!this.raf)this.raf=requestAnimationFrame(this.frame);}
 frame(now){
  this.raf=0;if(!this.enabled||this.paused)return;
  const dt=Math.min(50,this.last?now-this.last:16);this.last=now;this.phase+=dt*.00011;
  const ease=1-Math.exp(-dt/210),beforeX=this.pointer.x,beforeY=this.pointer.y;
  this.pointer.x+=(this.target.x-this.pointer.x)*ease;this.pointer.y+=(this.target.y-this.pointer.y)*ease;
  if(Math.abs(beforeX-this.pointer.x)+Math.abs(beforeY-this.pointer.y)>.00003)this.applyPointer();
  if(!this.lastDraw||now-this.lastDraw>=40||this.dirty){this.draw();this.lastDraw=now;this.dirty=false;}
  this.wake();
 }
 applyPointer(){
  this.scene.setPointer(this.pointer.x,this.pointer.y);
  this.detail.style.setProperty('--pointer-x',this.pointer.x.toFixed(4));
  this.detail.style.setProperty('--pointer-y',this.pointer.y.toFixed(4));
 }
 draw(){
  if(!this.ctx||!this.cam||!this.enabled)return;
  const ctx=this.ctx,{width:w,height:h,cam,pointer:p,phase:t}=this,s=cam.s;
  ctx.setTransform(this.dpr,0,0,this.dpr,0,0);ctx.clearRect(0,0,w,h);
  const cx=w/2+(1360-cam.x)*s,cy=h/2+(865-cam.y)*s,r=680*s;
  ctx.globalCompositeOperation='source-over';
  if(cx+r>-100&&cx-r<w+100&&cy+r>-100&&cy-r<h+100){
   const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.3);glow.addColorStop(0,'rgba(118,157,141,.065)');glow.addColorStop(.55,'rgba(103,133,153,.028)');glow.addColorStop(1,'rgba(80,130,130,0)');
   ctx.fillStyle=glow;ctx.fillRect(Math.max(0,cx-r*1.3),Math.max(0,cy-r*1.3),Math.min(w,r*2.6),Math.min(h,r*2.6));
   const yaw=-.3+p.x*.13,pitch=.94+p.y*.09,roll=-.48+p.x*.045;
   const cosY=Math.cos(yaw),sinY=Math.sin(yaw),cosP=Math.cos(pitch),sinP=Math.sin(pitch),cosR=Math.cos(roll),sinR=Math.sin(roll);
   const point=(u,v)=>{
    const tube=133+27*Math.sin(u*3+t*.8+v*.5),radius=437+45*Math.cos(u*2+t*.35);
    const x=(radius+tube*Math.cos(v))*Math.cos(u),y=(radius+tube*Math.cos(v))*Math.sin(u),z=tube*Math.sin(v)+72*Math.sin(u*2+t*.22);
    const xr=x*cosR-y*sinR,yr=x*sinR+y*cosR,yp=yr*cosP-z*sinP,zp=yr*sinP+z*cosP;
    const xp=xr*cosY+zp*sinY,zz=-xr*sinY+zp*cosY,perspective=1900/(1900+zz);
    return{x:cx+xp*perspective*s+p.x*5,y:cy+yp*perspective*s+p.y*3,z:zz};
   };
   const strands=w<1000?36:48,steps=96;
   ctx.lineWidth=.55;
   for(let i=0;i<strands;i++){
    const v=i/strands*TAU,alpha=.12+.29*(.5+.5*Math.cos(v+.7));
    const gradient=ctx.createLinearGradient(cx-r*.8,cy-r*.45,cx+r*.7,cy+r*.5);
    gradient.addColorStop(0,`rgba(201,178,154,${alpha})`);gradient.addColorStop(.42,`rgba(192,211,177,${alpha*.9})`);gradient.addColorStop(.7,`rgba(160,197,210,${alpha})`);gradient.addColorStop(1,`rgba(179,162,196,${alpha*.7})`);
    ctx.strokeStyle=gradient;ctx.beginPath();
    for(let j=0;j<=steps;j++){const a=point(j/steps*TAU,v);if(j===0)ctx.moveTo(a.x,a.y);else ctx.lineTo(a.x,a.y);}ctx.stroke();
   }
   ctx.lineWidth=.4;ctx.strokeStyle='rgba(176,204,186,.11)';
   for(let i=0;i<24;i++){ctx.beginPath();for(let j=0;j<=52;j++){const a=point(i/24*TAU,j/52*TAU);if(j===0)ctx.moveTo(a.x,a.y);else ctx.lineTo(a.x,a.y);}ctx.stroke();}
   for(let i=0;i<32;i++){const a=point(noise(i+47)*TAU+t*.035,noise(i+97)*TAU);ctx.fillStyle=`rgba(217,228,207,${.18+noise(i+9)*.4})`;ctx.beginPath();ctx.arc(a.x,a.y,.6+noise(i+67)*.7,0,TAU);ctx.fill();}
  }
  for(const dot of this.particles){
   const x=w/2+(dot.x-cam.x)*s+Math.sin(t*.3+dot.phase)*4+p.x*dot.z*7,y=h/2+(dot.y-cam.y)*s+Math.cos(t*.25+dot.phase)*3+p.y*dot.z*5;
   if(x<0||x>w||y<0||y>h)continue;
   ctx.fillStyle=`rgba(184,206,188,${.09+dot.z*.16})`;ctx.fillRect(x,y,dot.z>.7?1.5:.7,.7);
  }
  ctx.globalCompositeOperation='source-over';
 }
 get state(){return{phase:this.phase,paused:this.paused,enabled:this.enabled,pointer:{...this.pointer},target:{...this.target}};}
}
