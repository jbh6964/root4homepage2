import {clamp,smooth,END,arrivalProgress} from './geometry.js';

// One unwrapped depth for the entire finite itinerary. Arrival intervals slow
// the foreground projects, while this field continues to advance with scroll.
export function entranceState(cam){
 const first=cam.type==='journey'&&cam.project===0;
 const journeyProgress=cam.start+(cam.end-cam.start)*cam.t;
 const depth=journeyProgress*4.9;
 const passage=smooth((journeyProgress-.38)/1.15),gallery=smooth((journeyProgress-.9)/1.65);
 return{
  progress:journeyProgress/END,
  journeyProgress,depth,passage,gallery,graphicOpacity:1,
  focusX:.704-.035*smooth(Math.min(journeyProgress/3.35,1))+.025*Math.sin(depth*.023),
  focusY:.465+.02*smooth(Math.min(journeyProgress/3.35,1))+.025*Math.sin(depth*.032),
  projectReveal:cam.type==='intro'?0:first?smooth((cam.t-.28)/.42):1,
  textOpacity:cam.type==='intro'?1-smooth((cam.t-.12)/.64):0
 };
}
const axis=z=>({x:1.8*Math.sin(z*.025),y:1.2*Math.sin(z*.028)});
export function fieldLight(progress){
 const colors=[[178,241,228],[171,206,246],[205,183,234],[174,219,232],[195,221,183],[236,205,179],[178,241,228]],stops=[0,...Array.from({length:5},(_,i)=>arrivalProgress(i)),END];
 const end=stops.findIndex((p,i)=>i>0&&progress<=p),i=end<0?colors.length-2:end-1,t=smooth((progress-stops[i])/(stops[i+1]-stops[i]));
 return colors[i].map((v,c)=>v+(colors[i+1][c]-v)*t);
}

const bundles=[
 {points:[[-.17,1.27],[.16,.45],[.91,.86],[.704,.465]],count:37,spread:156,color:[178,241,228],weight:1.65,phase:.3},
 {points:[[1.17,-.33],[.46,-.15],[1.03,.36],[.704,.465]],count:32,spread:134,color:[247,241,216],weight:1.3,phase:1.8},
 {points:[[1.31,1.26],[.68,1.31],[.91,.72],[.704,.465]],count:33,spread:154,color:[123,183,225],weight:1.35,phase:3.1},
 {points:[[-.31,-.34],[.32,-.23],[.38,.70],[.704,.465]],count:21,spread:83,color:[115,182,173],weight:.75,phase:4.1}
];
function cubic(points,t){const a=1-t;return{x:a*a*a*points[0][0]+3*a*a*t*points[1][0]+3*a*t*t*points[2][0]+t*t*t*points[3][0],y:a*a*a*points[0][1]+3*a*a*t*points[1][1]+3*a*t*t*points[2][1]+t*t*t*points[3][1]};}
function tangent(p,t){const a=1-t;return{x:3*a*a*(p[1][0]-p[0][0])+6*a*t*(p[2][0]-p[1][0])+3*t*t*(p[3][0]-p[2][0]),y:3*a*a*(p[1][1]-p[0][1])+6*a*t*(p[2][1]-p[1][1])+3*t*t*(p[3][1]-p[2][1])};}
function buildFilaments(){return bundles.map((b,bi)=>({...b,strands:Array.from({length:b.count},(_,i)=>{
 const lane=(i/(b.count-1)-.5)*2;
 const near=z=>{
  const t=clamp(Math.pow((z-.95)/29,1/1.12)),p=cubic(b.points,t),d=tangent(b.points,t),length=Math.hypot(d.x*1600,d.y*1000)||1;
  const width=Math.pow(1-t,1.13)*b.spread*(1+.2*Math.sin(t*8+b.phase)),offset=lane*width+Math.sin(t*11+b.phase+lane*.9)*Math.sin(Math.PI*t)*8;
  return{x:(p.x*1600-d.y*1000/length*offset-1126.4)*z/1000,y:(p.y*1000+d.x*1600/length*offset-465)*z/1000};
 };
 const far=z=>{
  const angle=[2.35,-1.18,.75,-2.5][bi]+z*.012+.28*Math.sin(z*.041+b.phase);
  const radius=[8,7,9,7][bi]+1.8*Math.sin(z*.047+b.phase),a=axis(z),fan=lane*(1.1+.38*Math.sin(z*.036+b.phase));
  return{x:a.x+radius*Math.cos(angle)-Math.sin(angle)*fan,y:a.y+radius*.72*Math.sin(angle)+Math.cos(angle)*fan*.78};
 };
 const start=near(20),end=far(55),dStart=near(20.01),dEnd=far(55.01);
 const bridge=z=>{
  const t=(z-20)/35,t2=t*t,t3=t2*t;
  const sample=k=>(2*t3-3*t2+1)*start[k]+(t3-2*t2+t)*35*(dStart[k]-start[k])/.01+(-2*t3+3*t2)*end[k]+(t3-t2)*35*(dEnd[k]-end[k])/.01;
  return{x:sample('x'),y:sample('y')};
 };
 // The entrance and the long field share positions and tangents. There is
 // no terminating endpoint, per-project segment or recycled depth interval.
 return Array.from({length:Math.ceil((END*4.9+260)/.25)+1},(_,j)=>{const z=.95+j*.25,p=z<=20?near(z):z<55?bridge(z):far(z);return{...p,z};});
})}));}
function visibleStrand(strand,depth){
 const start=Math.max(0,Math.floor((depth-.95)/.25)),end=Math.min(strand.length,start+1040),points=[];
 for(let j=start;j<end;){points.push(strand[j]);const ahead=(j-start)*.25;j+=ahead<50?2:ahead<140?8:24;}
 return points;
}
let cachedFilaments;
const getFilaments=()=>cachedFilaments||(cachedFilaments=buildFilaments());

export class EntranceScene{
 constructor(canvas){this.canvas=canvas;this.lastKey='';this.enabled=true;}
 initRenderer(){
  this.contextReady=true;const canvas=this.canvas;
  try{this.gl=canvas.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:true,depth:false,stencil:false});if(this.gl)this.initWebGL();}catch{this.useCanvasFallback();}
  if(this.gl)canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.useCanvasFallback();this.lastKey='';if(this.currentState)this.render(this.currentCamera,this.width,this.height);},{once:true});
  else if(!this.ctx)this.ctx=this.canvas.getContext('2d',{alpha:true});
 }
 useCanvasFallback(){
  // A canvas cannot change its context type after WebGL was acquired.
  const fallback=this.canvas.cloneNode(false);this.canvas.replaceWith(fallback);this.canvas=fallback;this.gl=null;this.ctx=fallback.getContext('2d',{alpha:true});
 }
 render(cam,width,height){
  if(!this.contextReady)this.initRenderer();
  const state=entranceState(cam);this.currentCamera=cam;this.width=width;this.height=height;this.currentState=state;this.enabled=true;const dpr=Math.min(devicePixelRatio||1,1.5);
  this.canvas.style.opacity=state.graphicOpacity;this.canvas.hidden=state.graphicOpacity===0;
  if(!state.graphicOpacity)return;
  const key=[state.depth,width,height,dpr].join(':');if(this.lastKey===key)return;this.lastKey=key;
  const canvas=this.canvas,ctx=this.ctx;
  const pixelW=Math.round(width*dpr),pixelH=Math.round(height*dpr);if(canvas.width!==pixelW||canvas.height!==pixelH){canvas.width=pixelW;canvas.height=pixelH;}
  if(this.gl)this.drawWebGL(width,height,state,dpr);else{ctx.setTransform(dpr,0,0,dpr,0,0);this.draw(ctx,width,height,state);}
 }
 initWebGL(){
  const gl=this.gl;
  const program=(vertex,fragment)=>{
   const shader=(type,source)=>{const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh;};
   const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;
  };
  const vertex=`attribute vec2 position;uniform vec2 resolution;void main(){gl_Position=vec4(position/resolution*vec2(2.,-2.)+vec2(-1.,1.),0.,1.);}`;
  const transition=`float spaceMix(vec2 p){float radius=max(1.,passage*resolution.x*1.28);float portal=1.-smoothstep(radius*.7,radius,length(p-focus));return max(gallery,portal*passage);}`;
  const atmosphere=`precision highp float;uniform vec2 resolution;uniform vec2 focus;uniform float dpr;uniform float progress;uniform float passage;uniform float gallery;${transition}void main(){vec2 p=vec2(gl_FragCoord.x/dpr,resolution.y-gl_FragCoord.y/dpr);float t=clamp(length(p-resolution*vec2(.72,.47))/(resolution.x*.8),0.,1.);vec3 dark=t<.38?mix(vec3(9.,43.,50.),vec3(10.,28.,35.),t/.38):mix(vec3(10.,28.,35.),vec3(7.,18.,22.),(t-.38)/.62);float sweep=.5+.5*sin(p.x/resolution.x*5.4+p.y/resolution.y*2.1+progress*.08);float shelf=smoothstep(.0,.75,p.y/resolution.y)*(.5+.5*sin(p.x/resolution.x*3.2-1.1));float curve=1.-smoothstep(.02,.2,abs(p.y/resolution.y-(.78-.18*sin(p.x/resolution.x*3.4+progress*.025))));vec3 pearl=mix(vec3(246.,247.,243.),vec3(216.,227.,233.),clamp(t*.38+sweep*.12,0.,1.));pearl=mix(pearl,vec3(220.,218.,240.),shelf*.13);pearl=mix(pearl,vec3(207.,220.,229.),curve*.12);float m=spaceMix(p);float header=1.-clamp(p.y/(resolution.y*.18),0.,1.);vec3 bg=mix(dark,pearl,m);bg=mix(bg,mix(vec3(7.,18.,22.),vec3(235.,240.,239.),m),header*.18);gl_FragColor=vec4(bg/255.,1.);}`;
  const lineVertex=`attribute vec2 position;attribute vec4 color;attribute float across;attribute float radius;uniform vec2 resolution;varying vec4 ink;varying float edge;varying float halfWidth;void main(){gl_Position=vec4(position/resolution*vec2(2.,-2.)+vec2(-1.,1.),0.,1.);ink=color;edge=across;halfWidth=radius;}`;
  const lineFragment=`precision highp float;uniform vec2 resolution;uniform vec2 focus;uniform float dpr;uniform float progress;uniform float passage;uniform float gallery;varying vec4 ink;varying float edge;varying float halfWidth;${transition}void main(){vec2 p=vec2(gl_FragCoord.x/dpr,resolution.y-gl_FragCoord.y/dpr);float t=length(p-focus)/(resolution.x*.92);float power=t<.025?mix(0.,.05,t/.025):t<.12?mix(.05,.37,(t-.025)/.095):t<.38?mix(.37,.86,(t-.12)/.26):t<.7?mix(.86,1.,(t-.38)/.32):mix(1.,.5,clamp((t-.7)/.3,0.,1.));float aa=.65/dpr;float coverage=1.-smoothstep(max(0.,halfWidth-aa),halfWidth+aa,abs(edge));float m=spaceMix(p);float alpha=ink.a*power*mix(.94,.68,m)*coverage;gl_FragColor=vec4(ink.rgb,alpha);}`;
  this.bgProgram=program(vertex,atmosphere);this.lineProgram=program(lineVertex,lineFragment);
  this.quadBuffer=gl.createBuffer();this.lineBuffer=gl.createBuffer();this.vertices=new Float32Array(700000);
  gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
 }
 drawWebGL(w,h,state,dpr){
  const gl=this.gl,focus=[w*state.focusX,h*state.focusY];gl.viewport(0,0,this.canvas.width,this.canvas.height);
  const uniform=(program,name,kind,...values)=>{const location=gl.getUniformLocation(program,name);if(location!==null)gl[kind](location,...values);};
  const common=program=>{gl.useProgram(program);uniform(program,'resolution','uniform2f',w,h);uniform(program,'focus','uniform2f',...focus);uniform(program,'dpr','uniform1f',dpr);uniform(program,'progress','uniform1f',state.journeyProgress);uniform(program,'passage','uniform1f',state.passage);uniform(program,'gallery','uniform1f',state.gallery);};
  const quad=(program,layer)=>{
   common(program);uniform(program,'layer','uniform1f',layer);gl.bindBuffer(gl.ARRAY_BUFFER,this.quadBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,w,0,0,h,0,h,w,0,w,h]),gl.DYNAMIC_DRAW);const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,8,0);gl.drawArrays(gl.TRIANGLES,0,6);
  };
  gl.disable(gl.BLEND);quad(this.bgProgram,0);gl.enable(gl.BLEND);
  const sx=w/1600,sy=h/1000,viewAxis=axis(state.depth),lightColor=fieldLight(state.journeyProgress),aa=.65/dpr;
  let count=0;
  const vertex=(x,y,color,alpha,edge,radius)=>{const buffer=this.vertices;buffer[count++]=x;buffer[count++]=y;buffer[count++]=color[0];buffer[count++]=color[1];buffer[count++]=color[2];buffer[count++]=alpha;buffer[count++]=edge;buffer[count++]=radius;};
  getFilaments().forEach((bundle,bi)=>{
   const color=bundle.color.map((v,c)=>{const luminous=v*.55+lightColor[c]*.45,silver=[67,94,104][c],spaceTone=Math.max(state.gallery,state.passage*.72);return Math.round(luminous+(silver-luminous)*spaceTone)/255;});
   bundle.strands.forEach((strand,i)=>{
    const valid=[];
    for(const point of visibleStrand(strand,state.depth)){
     const z=point.z-state.depth;if(z<.12)continue;
     const x=focus[0]+(point.x-viewAxis.x)*1000/z*sx,y=focus[1]+(point.y-viewAxis.y)*1000/z*sy;
     if(Math.abs(x)<w*12&&Math.abs(y)<h*12)valid.push({x,y,z});
    }
    if(valid.length<3)return;
    const normal=valid.map((v,j)=>{const a=valid[Math.max(0,j-1)],b=valid[Math.min(valid.length-1,j+1)],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;return{x:-dy/len,y:dx/len,r:clamp((2.6/(.6+v.z*.1))*bundle.weight,.32,3.7)*Math.max(.65,sx)*.5};});
    const strip=(dilation,alpha)=>{
     // Degenerate bridge vertices join all filaments into one GPU draw.
     const first=valid[0],n=normal[0],r=n.r*dilation+aa;
     if(count){this.vertices.copyWithin(count,count-8,count);count+=8;vertex(first.x+n.x*r,first.y+n.y*r,color,alpha,r,n.r*dilation);}
     valid.forEach((v,j)=>{const n=normal[j],radius=n.r*dilation,r=radius+aa;vertex(v.x+n.x*r,v.y+n.y*r,color,alpha,r,radius);vertex(v.x-n.x*r,v.y-n.y*r,color,alpha,-r,radius);});
    };
    if(i%12===0)strip(4,.075);
    const bright=.38+.62*Math.pow(Math.abs(Math.cos(i/(bundle.count-1)*Math.PI*2+bi)),5),group=Math.min(3,Math.floor((bright-.38)/.62*4));strip(1,.42+group*.2);
   });
  });
  common(this.lineProgram);gl.bindBuffer(gl.ARRAY_BUFFER,this.lineBuffer);gl.bufferData(gl.ARRAY_BUFFER,this.vertices.subarray(0,count),gl.DYNAMIC_DRAW);
  for(const [name,size,offset]of[['position',2,0],['color',4,8],['across',1,24],['radius',1,28]]){const attribute=gl.getAttribLocation(this.lineProgram,name);gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,size,gl.FLOAT,false,32,offset);}
  gl.drawArrays(gl.TRIANGLE_STRIP,0,count/8);
  // Stop line attributes from pointing into the larger buffer while the quad
  // changes the position buffer; WebGL validates all enabled vertex arrays.
  for(const name of['color','across','radius'])gl.disableVertexAttribArray(gl.getAttribLocation(this.lineProgram,name));

 }
 draw(ctx,w,h,state){
  const sx=w/1600,sy=h/1000,cx=w*state.focusX,cy=h*state.focusY,viewAxis=axis(state.depth),lightColor=fieldLight(state.journeyProgress);
  const project=point=>{const z=point.z-state.depth;if(z<.12)return null;return{x:cx+(point.x-viewAxis.x)*1000/z*sx,y:cy+(point.y-viewAxis.y)*1000/z*sy,z,t:point.t};};
  ctx.clearRect(0,0,w,h);
  const atmosphere=ctx.createRadialGradient(w*.75,h*.43,0,w*.68,h*.5,w*.8);atmosphere.addColorStop(0,'#092b32');atmosphere.addColorStop(.38,'#0a1c23');atmosphere.addColorStop(1,'#071216');ctx.fillStyle=atmosphere;ctx.fillRect(0,0,w,h);
  const pearl=ctx.createLinearGradient(0,0,w,h);pearl.addColorStop(0,'#f8f8f4');pearl.addColorStop(.52,'#eef2f3');pearl.addColorStop(1,'#e3e8ef');ctx.globalAlpha=state.gallery;ctx.fillStyle=pearl;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
  if(state.passage>0){const radius=Math.max(1,state.passage*w*1.28),portal=ctx.createRadialGradient(cx,cy,radius*.07,cx,cy,radius);portal.addColorStop(0,'rgba(250,250,247,1)');portal.addColorStop(.7,'rgba(239,244,245,.98)');portal.addColorStop(1,'rgba(229,232,242,0)');ctx.globalAlpha=state.passage*(1-state.gallery);ctx.fillStyle=portal;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;}
  if(state.gallery>.02){ctx.save();ctx.globalAlpha=state.gallery*.15;ctx.strokeStyle='#9caec0';ctx.lineWidth=Math.max(70,w*.07);ctx.beginPath();ctx.moveTo(-w*.08,h*.86);ctx.bezierCurveTo(w*.2,h*.5,w*.73,h*1.03,w*1.1,h*.55);ctx.stroke();ctx.globalAlpha=state.gallery*.08;ctx.strokeStyle='#b8a9cf';ctx.lineWidth=Math.max(120,w*.11);ctx.beginPath();ctx.moveTo(w*.2,-h*.12);ctx.bezierCurveTo(w*.42,h*.34,w*.76,h*.05,w*1.08,h*.22);ctx.stroke();ctx.restore();}
  // A broad, asymmetric wash gives the filaments a shared volume. It has no
  // moving time source: only the scroll depth changes the geometry.
  getFilaments().forEach((bundle,bi)=>{
   const [r,g,b]=bundle.color.map((v,c)=>{const luminous=v*.55+lightColor[c]*.45,silver=[67,94,104][c],spaceTone=Math.max(state.gallery,state.passage*.72);return Math.round(luminous+(silver-luminous)*spaceTone);});
   const paths=bundle.strands.map(strand=>visibleStrand(strand,state.depth).map(project));
   const light=ctx.createRadialGradient(cx,cy,0,cx,cy,w*.92);
   for(const [stop,power]of[[0,0],[.025,.05],[.12,.37],[.38,.86],[.7,1],[1,.5]])light.addColorStop(stop,`rgba(${r},${g},${b},${power*.94})`);
   const groups=Array.from({length:4},()=>new Path2D()),glow=new Path2D();
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
    const strip=(path,dilation)=>{
     valid.forEach((v,j)=>{const e=edge(v,j,dilation);j?path.lineTo(e.x,e.y):path.moveTo(e.x,e.y);});
     for(let j=valid.length-1;j>=0;j--){const e=edge(valid[j],j,-dilation);path.lineTo(e.x,e.y);}path.closePath();
    };
    if(i%12===0)strip(glow,4);
    strip(groups[Math.min(3,Math.floor((bright-.38)/.62*4))],1);
   });
   ctx.fillStyle=light;ctx.globalAlpha=.075;ctx.fill(glow);groups.forEach((path,i)=>{ctx.globalAlpha=.42+i*.2;ctx.fill(path);});ctx.globalAlpha=1;
  });
  // An unlit distance, rather than a ring or a visible portal, invites entry.
  const distance=ctx.createRadialGradient(cx,cy,0,cx,cy,w*(.18-.055*smooth(state.journeyProgress/3.35)));distance.addColorStop(0,'#061217');distance.addColorStop(.2,'#061217e8');distance.addColorStop(.64,'#06121745');distance.addColorStop(1,'#06121700');ctx.globalAlpha=1-state.passage;ctx.fillStyle=distance;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
  if(state.journeyProgress<1.15){const reading=ctx.createLinearGradient(0,0,w*.64,0);reading.addColorStop(0,'#071216db');reading.addColorStop(.55,'#07121691');reading.addColorStop(1,'#07121600');ctx.globalAlpha=1-smooth(state.journeyProgress/1.15);ctx.fillStyle=reading;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;}
  const header=ctx.createLinearGradient(0,0,0,h*.22);header.addColorStop(0,state.gallery>.5?'#eff2f1e8':'#071216e0');header.addColorStop(1,state.gallery>.5?'#eff2f100':'#07121600');ctx.fillStyle=header;ctx.fillRect(0,0,w,h*.22);
 }
 get state(){return{...this.currentState,enabled:this.enabled,renderer:this.gl?'webgl':'canvas',paused:false,pointer:{x:0,y:0},energy:0};}
}

// A vector still from the same filaments keeps the mobile/reduced-motion
// entrance complete without shipping a second animation or a raster backdrop.
export function entranceStillSvg(){
 const strands=getFilaments().map(bundle=>{
  const color=`rgb(${bundle.color.join(',')})`;
  return bundle.strands.map((points,i)=>{
   const lane=i/(bundle.count-1),opacity=.35+.57*Math.pow(Math.abs(Math.cos(lane*Math.PI*2)),5);
   const path=visibleStrand(points,0).filter((_,j)=>j%2===0).map((p,j)=>`${j?'L':'M'}${(1126.4+p.x*1000/p.z).toFixed(2)} ${(465+p.y*1000/p.z).toFixed(2)}`).join('');
   return `<path d="${path}" fill="none" stroke="${color}" stroke-width="${(bundle.weight*1.10).toFixed(2)}" opacity="${opacity.toFixed(2)}"/>`;
  }).join('');
 }).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><defs><radialGradient id="atmosphere" cx="75%" cy="43%" r="80%"><stop stop-color="#092b32"/><stop offset=".38" stop-color="#0a1c23"/><stop offset="1" stop-color="#071216"/></radialGradient><radialGradient id="distance"><stop stop-color="#061217"/><stop offset=".2" stop-color="#061217" stop-opacity=".91"/><stop offset=".64" stop-color="#061217" stop-opacity=".27"/><stop offset="1" stop-color="#061217" stop-opacity="0"/></radialGradient><linearGradient id="read"><stop stop-color="#071216" stop-opacity=".86"/><stop offset=".55" stop-color="#071216" stop-opacity=".57"/><stop offset="1" stop-color="#071216" stop-opacity="0"/></linearGradient></defs><path fill="url(#atmosphere)" d="M0 0H1600V1000H0Z"/>${strands}<ellipse cx="1126.4" cy="465" rx="200" ry="200" fill="url(#distance)"/><path fill="url(#read)" d="M0 0H1024V1000H0Z"/></svg>`;
}
