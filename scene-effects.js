import {clamp,smooth} from './geometry.js';

// Project material is a static image layer positioned only by the scroll camera.
// The entrance has its own geometry; this material is never present in the intro.
const presets=[
 {x:.69,y:.49,scale:1.24,alpha:1,tint:[.3,.4,1],mix:0},
 {x:1.05,y:.51,scale:1.15,alpha:.92,tint:[.3,.4,1],mix:0},
 {x:.90,y:.50,scale:1.15,alpha:0,tint:[.6,.4,.8],mix:.5},
 {x:1.2,y:.95,scale:1.15,alpha:.62,tint:[.3,.4,1],mix:0},
 {x:-.12,y:.51,scale:1.15,alpha:.92,tint:[.8,.84,.3],mix:.8},
 {x:1.05,y:1.03,scale:1.15,alpha:.92,tint:[1,.34,.17],mix:.8},
 {x:.8,y:.48,scale:1.2,alpha:1,tint:[.3,.4,1],mix:0}
];

export class SceneEffects{
 constructor(canvas){
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.paused=false;this.enabled=false;this.alpha=0;this.materials=new Map();
  this.image=new Image();this.image.onload=()=>{this.ready=true;this.draw();};this.image.src='/assets/studio-fluid.webp';
 }
 setState({paused,enabled}){
  this.paused=paused;this.enabled=enabled;
  if(!enabled){this.alpha=0;this.ctx?.clearRect(0,0,this.canvas.width,this.canvas.height);}
 }
 update(cam,width,height){
  this.cam=cam;this.width=width;this.height=height;
  const dpr=Math.min(devicePixelRatio||1,1.5),w=Math.round(width*dpr),h=Math.round(height*dpr);
  if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
  this.draw();
 }
 material(tint,amount){
  if(!amount)return this.image;
  const key=tint.join(',')+':'+amount;
  if(this.materials.has(key))return this.materials.get(key);
  const surface=document.createElement('canvas');surface.width=this.image.naturalWidth;surface.height=this.image.naturalHeight;
  const ctx=surface.getContext('2d');ctx.drawImage(this.image,0,0);
  const pixels=ctx.getImageData(0,0,surface.width,surface.height),data=pixels.data;
  for(let i=0;i<data.length;i+=4){
   const light=.35+(data[i]*.3+data[i+1]*.5+data[i+2]*.2)/255;
   for(let c=0;c<3;c++)data[i+c]=data[i+c]*(1-amount)+tint[c]*255*light*amount;
  }
  ctx.putImageData(pixels,0,0);this.materials.set(key,surface);return surface;
 }
 draw(){
  if(!this.ctx||!this.cam)return;
  const ctx=this.ctx,{width:w,height:h,cam}=this,dpr=this.canvas.width/w;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);this.alpha=0;
  if(!this.enabled||!this.ready||cam.type==='intro')return;
  let from,to,t;
  if(cam.type==='outro'){from=presets[5];to=presets[6];t=clamp(cam.t*1.7);}
  else if(cam.type==='journey'){from=presets[cam.project];to=presets[cam.project+1];t=cam.t;}
  else{from=to=presets[cam.project+1];t=1;}
  t=smooth(t);const mix=(a,b)=>a+(b-a)*t;
  const scale=mix(from.scale,to.scale)*(.94+.06*cam.zoom),width=w*scale,height=width*2/3;
  const cx=w*(mix(from.x,to.x)+Math.sin(cam.routeDistance*Math.PI*3)*.06),cy=h*(mix(from.y,to.y)+Math.sin(cam.routeDistance*Math.PI*2)*.045);
  this.alpha=mix(from.alpha,to.alpha)*(cam.type==='journey'&&cam.project===0?smooth(clamp((cam.t-.35)/.5)):1);
  if(this.alpha<=0)return;
  // Cache the settled project tints, then composite them during travel. The
  // source texture stays sharp and the UI is never displaced or distorted.
  const first=this.material(from.tint,from.mix),second=this.material(to.tint,to.mix);
  if(first===second){ctx.globalAlpha=this.alpha;ctx.drawImage(first,cx-width/2,cy-height/2,width,height);}
  else{
   ctx.globalAlpha=this.alpha*(1-t);ctx.drawImage(first,cx-width/2,cy-height/2,width,height);
   ctx.globalAlpha=this.alpha*t;ctx.drawImage(second,cx-width/2,cy-height/2,width,height);
  }
  ctx.globalAlpha=1;
 }
 get state(){return{phase:0,paused:this.paused,enabled:this.enabled,pointer:{x:0,y:0},target:{x:0,y:0},energy:0,renderer:'canvas',alpha:this.alpha};}
}
