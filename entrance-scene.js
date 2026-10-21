import {clamp,smooth} from './geometry.js';

// The camera itinerary stays in geometry.js. This local projection travels
// through the entrance only, then hands over to the first existing scene.
export function entranceState(cam){
 const first=cam.type==='journey'&&cam.project===0;
 const progress=cam.type==='intro'?cam.t*.36:first ? .36+cam.t*.64 : 1;
 return{
  progress,
  depth:progress*16,
  graphicOpacity:cam.type==='intro'?1:first?1-smooth((cam.t-.40)/.40):0,
  projectReveal:cam.type==='intro'?0:first?smooth((cam.t-.28)/.42):1,
  textOpacity:cam.type==='intro'?1-smooth((cam.t-.12)/.64):0
 };
}

const bundles=[
 {points:[[-.17,1.27],[.16,.45],[.91,.86],[.704,.465]],count:37,spread:156,color:[178,241,228],weight:1.65,phase:.3},
 {points:[[1.17,-.33],[.46,-.15],[1.03,.36],[.704,.465]],count:32,spread:134,color:[247,241,216],weight:1.3,phase:1.8},
 {points:[[1.31,1.26],[.68,1.31],[.91,.72],[.704,.465]],count:33,spread:154,color:[123,183,225],weight:1.35,phase:3.1},
 {points:[[-.31,-.34],[.32,-.23],[.38,.70],[.704,.465]],count:21,spread:83,color:[115,182,173],weight:.75,phase:4.1}
];
function cubic(points,t){const a=1-t;return{x:a*a*a*points[0][0]+3*a*a*t*points[1][0]+3*a*t*t*points[2][0]+t*t*t*points[3][0],y:a*a*a*points[0][1]+3*a*a*t*points[1][1]+3*a*t*t*points[2][1]+t*t*t*points[3][1]};}
function tangent(p,t){const a=1-t;return{x:3*a*a*(p[1][0]-p[0][0])+6*a*t*(p[2][0]-p[1][0])+3*t*t*(p[3][0]-p[2][0]),y:3*a*a*(p[1][1]-p[0][1])+6*a*t*(p[2][1]-p[1][1])+3*t*t*(p[3][1]-p[2][1])};}
function buildFilaments(){return bundles.map(b=>({...b,strands:Array.from({length:b.count},(_,i)=>{
 const lane=(i/(b.count-1)-.5)*2;
 return Array.from({length:151},(_,j)=>{
  const t=j/150,p=cubic(b.points,t),d=tangent(b.points,t),length=Math.hypot(d.x*1600,d.y*1000)||1;
  const width=Math.pow(1-t,1.13)*b.spread*(1+.2*Math.sin(t*8+b.phase));
  const offset=lane*width+Math.sin(t*11+b.phase+lane*.9)*Math.sin(Math.PI*t)*8;
  const sx=p.x*1600-d.y*1000/length*offset,sy=p.y*1000+d.x*1600/length*offset;
  const z=.95+Math.pow(t,1.12)*29;
  return{x:(sx-1126.4)*z/1000,y:(sy-465)*z/1000,z,t};
 });
})}));}
const filaments=buildFilaments();

export class EntranceScene{
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true});this.lastKey='';}
 render(cam,width,height){
  const state=entranceState(cam),dpr=Math.min(devicePixelRatio||1,1.5);
  this.canvas.style.opacity=state.graphicOpacity;this.canvas.hidden=state.graphicOpacity===0;
  if(!state.graphicOpacity)return;
  const key=[state.depth,width,height,dpr].join(':');if(this.lastKey===key)return;this.lastKey=key;
  const canvas=this.canvas,ctx=this.ctx;
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  this.draw(ctx,width,height,state);
 }
 draw(ctx,w,h,state){
  const sx=w/1600,sy=h/1000,cx=w*(.704-.035*smooth(state.progress)),cy=h*(.465+.02*smooth(state.progress));
  const project=point=>{const z=point.z-state.depth;if(z<.12)return null;return{x:cx+point.x*1000/z*sx,y:cy+point.y*1000/z*sy,z,t:point.t};};
  ctx.clearRect(0,0,w,h);
  const atmosphere=ctx.createRadialGradient(w*.75,h*.43,0,w*.68,h*.5,w*.8);atmosphere.addColorStop(0,'#092b32');atmosphere.addColorStop(.38,'#0a1c23');atmosphere.addColorStop(1,'#071216');ctx.fillStyle=atmosphere;ctx.fillRect(0,0,w,h);
  // A broad, asymmetric wash gives the filaments a shared volume. It has no
  // moving time source: only the scroll depth changes the geometry.
  filaments.forEach((bundle,bi)=>{
   const [r,g,b]=bundle.color;
   const paths=bundle.strands.map(strand=>strand.map(project));
   const left=paths[0].filter(Boolean),right=paths.at(-1).filter(Boolean);
   if(left.length&&right.length){
    ctx.beginPath();left.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));right.slice().reverse().forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();
    const volume=ctx.createLinearGradient(0,h,w,0);volume.addColorStop(0,`rgba(${r},${g},${b},.012)`);volume.addColorStop(.5,`rgba(${r},${g},${b},.055)`);volume.addColorStop(1,`rgba(${r},${g},${b},.018)`);ctx.fillStyle=volume;ctx.fill();
   }
   bundle.strands.forEach((strand,i)=>{
    const p=paths[i],lane=i/(bundle.count-1),bright=.38+.62*Math.pow(Math.abs(Math.cos(lane*Math.PI*2+bi)),5);
    // Each filament is a continuous variable-width strip. Depth controls its
    // thickness; a shared light field shades it without visible segment joints.
    const valid=p.filter(v=>v&&Math.abs(v.x)<w*12&&Math.abs(v.y)<h*12);
    if(valid.length<3)return;
    const edge=(v,j,dilation)=>{
     const a=valid[Math.max(0,j-1)],b=valid[Math.min(valid.length-1,j+1)],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;
     const radius=clamp((2.6/(.6+v.z*.1))*bundle.weight,.32,3.7)*Math.max(.65,sx)*dilation*.5;
     return{x:v.x-dy/len*radius,y:v.y+dx/len*radius};
    };
    const strip=(dilation,alpha)=>{
     ctx.beginPath();valid.forEach((v,j)=>{const e=edge(v,j,dilation);j?ctx.lineTo(e.x,e.y):ctx.moveTo(e.x,e.y);});
     for(let j=valid.length-1;j>=0;j--){const e=edge(valid[j],j,-dilation);ctx.lineTo(e.x,e.y);}ctx.closePath();
     const light=ctx.createRadialGradient(cx,cy,0,cx,cy,w*.92);
     for(const [stop,power]of[[0,0],[.025,.05],[.12,.37],[.38,.86],[.7,1],[1,.5]])light.addColorStop(stop,`rgba(${r},${g},${b},${Math.min(.98,power*bright*alpha)})`);
     ctx.fillStyle=light;ctx.fill();
    };
    if(i%9===0)strip(5,.12);
    strip(1,1.05);
   });
  });
  // An unlit distance, rather than a ring or a visible portal, invites entry.
  const distance=ctx.createRadialGradient(cx,cy,0,cx,cy,w*.125);distance.addColorStop(0,'#061217');distance.addColorStop(.2,'#061217e8');distance.addColorStop(.64,'#06121745');distance.addColorStop(1,'#06121700');ctx.fillStyle=distance;ctx.fillRect(0,0,w,h);
  const reading=ctx.createLinearGradient(0,0,w*.64,0);reading.addColorStop(0,'#071216db');reading.addColorStop(.55,'#07121691');reading.addColorStop(1,'#07121600');ctx.fillStyle=reading;ctx.fillRect(0,0,w,h);
  const header=ctx.createLinearGradient(0,0,0,h*.22);header.addColorStop(0,'#071216e0');header.addColorStop(1,'#07121600');ctx.fillStyle=header;ctx.fillRect(0,0,w,h*.22);
 }
}

// A vector still from the same filaments keeps the mobile/reduced-motion
// entrance complete without shipping a second animation or a raster backdrop.
export function entranceStillSvg(){
 const strands=filaments.map(bundle=>{
  const color=`rgb(${bundle.color.join(',')})`;
  return bundle.strands.map((points,i)=>{
   const lane=i/(bundle.count-1),opacity=.35+.57*Math.pow(Math.abs(Math.cos(lane*Math.PI*2)),5);
   const path=points.map((p,j)=>`${j?'L':'M'}${(1126.4+p.x*1000/p.z).toFixed(2)} ${(465+p.y*1000/p.z).toFixed(2)}`).join('');
   return `<path d="${path}" fill="none" stroke="${color}" stroke-width="${(bundle.weight*1.10).toFixed(2)}" opacity="${opacity.toFixed(2)}"/>`;
  }).join('');
 }).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><defs><radialGradient id="atmosphere" cx="75%" cy="43%" r="80%"><stop stop-color="#092b32"/><stop offset=".38" stop-color="#0a1c23"/><stop offset="1" stop-color="#071216"/></radialGradient><radialGradient id="distance"><stop stop-color="#061217"/><stop offset=".2" stop-color="#061217" stop-opacity=".91"/><stop offset=".64" stop-color="#061217" stop-opacity=".27"/><stop offset="1" stop-color="#061217" stop-opacity="0"/></radialGradient><linearGradient id="read"><stop stop-color="#071216" stop-opacity=".86"/><stop offset=".55" stop-color="#071216" stop-opacity=".57"/><stop offset="1" stop-color="#071216" stop-opacity="0"/></linearGradient></defs><path fill="url(#atmosphere)" d="M0 0H1600V1000H0Z"/>${strands}<ellipse cx="1126.4" cy="465" rx="200" ry="200" fill="url(#distance)"/><path fill="url(#read)" d="M0 0H1024V1000H0Z"/></svg>`;
}
