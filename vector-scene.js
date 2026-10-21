import {routePath,routePoint,projectStations,clamp,smooth,storyAt} from './geometry.js';
import {projectObject,projectFragment,projectAppFragment,plans,products,films,filmImages} from './project-art.js';
import {balanceData,won} from './balance-art.js';
const NS='http://www.w3.org/2000/svg';
export const stageLayouts=[
 {x:.69,y:.50,w:.77,h:.78,nativeW:1000,nativeH:780},
 {x:.65,y:.46,w:.74,h:.84,nativeW:1000,nativeH:780},
 {x:.50,y:.54,w:.96,h:.62,nativeW:1280,nativeH:690},
 {x:.35,y:.46,w:.77,h:.76,nativeW:1000,nativeH:780},
 {x:.50,y:.54,w:.96,h:.62,nativeW:1280,nativeH:740}
];
const mix=(a,b,t)=>a+(b-a)*t;
export function stagePose(index,cam,width,height){
 const c=stageLayouts[index],fit=Math.min(width*c.w/c.nativeW,height*c.h/c.nativeH),station=projectStations[index];
 const driftX=(station.x-cam.x)*cam.s*.12,driftY=(station.y-cam.y)*cam.s*.1;
 return{x:width*c.x+driftX,y:height*c.y+driftY,s:fit*cam.zoom/(4.5+index*.35),a:0};
}
export function scenePose(index,cam,width,height){
 const i=index,part=cam;
 const active=(part.type==='arrival'||part.type==='journey')&&part.project===i,departing=(part.type==='journey'&&part.project===i+1&&part.t<.42)||(part.type==='outro'&&i===projectStations.length-1&&part.t<.42);
 const pose=stagePose(i,cam,width,height);
 if(!active&&!departing)return{...pose,visible:false,opacity:0};
 let opacity=1;
 if(part.type==='journey'&&active){const e=smooth(clamp((part.t-.06)/.94)),station=projectStations[i],rawX=clamp(width/2+(station.x-cam.x)*cam.s,width*.2,width*1.07),rawY=clamp(height/2+(station.y-cam.y)*cam.s,height*.35,height*.83);pose.x=mix(rawX,pose.x,e);pose.y=mix(rawY,pose.y,e);pose.s*=mix(.82,1,e);pose.a=(i%2?-9:8)*(1-e);opacity=clamp(part.t/.12);}
 if(departing){const e=smooth(part.t/.42);pose.x-=width*e*.95;pose.y+=height*e*.18;pose.s*=1+e*.35;pose.a=-8*e;opacity=1-e;}
 return{...pose,visible:true,opacity};
}
export class VectorScene{
 constructor(container){
  this.svg=document.createElementNS(NS,'svg');this.svg.classList.add('zoom-world');this.svg.setAttribute('aria-hidden','true');
  this.svg.innerHTML=`<g data-route><path d="${routePath}" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/></g><g data-intro-fragments><g data-hero-shard="front"><svg width="590" height="280">${projectFragment(0,'intro-web')}</svg></g></g>${projectStations.map((station,i)=>{const c=stageLayouts[i];return `<g data-station="${i}" opacity="0" style="display:none"><g data-primary-layout="${i}"><g data-project-depth="${i}"><svg width="${c.nativeW}" height="${c.nativeH}" overflow="visible">${projectObject(i,'scene-'+i)}</svg></g></g></g>`;}).join('')}`;
  this.backSvg=document.createElementNS(NS,'svg');this.backSvg.classList.add('zoom-world');this.backSvg.setAttribute('aria-hidden','true');this.backSvg.innerHTML=`<g data-hero-shard="back"><svg width="450" height="253">${projectFragment(2,'intro-tv')}</svg></g><g data-hero-shard="app"><svg width="260" height="400">${projectAppFragment('intro-app')}</svg></g>`;document.querySelector('#scene-back').replaceChildren(this.backSvg);
  container.replaceChildren(this.svg);
  this.stations=[...this.svg.querySelectorAll('[data-station]')];this.layouts=[...this.svg.querySelectorAll('[data-primary-layout]')];this.depths=[...this.svg.querySelectorAll('[data-project-depth]')];this.route=this.svg.querySelector('[data-route]');this.intro=this.svg.querySelector('[data-intro-fragments]');this.shards=[...this.backSvg.querySelectorAll('[data-hero-shard]'),...this.svg.querySelectorAll('[data-hero-shard]')];
  this.artLayers=this.stations.map(root=>[...root.querySelectorAll('[data-art-layer],[data-balance-layer]')]);this.artLayers.flat().forEach(n=>n.dataset.baseTransform=n.getAttribute('transform')||'');this.reveals=Array(5).fill(1);this.pointer={x:0,y:0};
  this.balance=this.stations[1];this.balanceLine=this.balance.querySelector('[data-balance-line]');this.total=this.balance.querySelector('[data-balance-total]');this.arcs=[...this.balance.querySelectorAll('[data-balance-arc]')].map(node=>({node,dashes:node.getAttribute('stroke-dasharray').split(' ').map(Number)}));
  this.svg.querySelectorAll('[data-plan],[data-film],[data-product-focus]').forEach(n=>n.style.cursor='pointer');
  this.svg.addEventListener('click',e=>{if(this.paused||this.part?.type!=='arrival')return;const hit=e.target.closest('[data-plan],[data-film],[data-product-focus]');if(!hit)return;const index=this.part.project,choice=Number(hit.dataset.plan??hit.dataset.film??hit.dataset.productFocus);this.svg.dispatchEvent(new CustomEvent('scene-choice',{detail:{index,choice}}));});
  this.balance.querySelectorAll('[data-balance-hit],[data-balance-month-hit]').forEach(hit=>{
   hit.addEventListener('pointerenter',e=>{if(this.paused||this.part?.type!=='arrival'||this.part.project!==1||e.pointerType==='touch')return;const kind=hit.hasAttribute('data-balance-hit')?'asset':'month',index=Number(kind==='asset'?hit.dataset.balanceHit:hit.dataset.balanceMonthHit);this.svg.dispatchEvent(new CustomEvent('scene-inspect',{detail:{kind,index,x:e.clientX,y:e.clientY}}));});
   hit.addEventListener('pointerleave',()=>this.svg.dispatchEvent(new CustomEvent('scene-inspect',{detail:null})));
  });
 }
 setPaused(value){this.paused=value;}
 focus(){}
 setPointer(x,y,energy=0){this.pointer={x,y,energy};this.positionLayers();}
 positionLayers(){
  const {x,y}=this.pointer;
  this.depths.forEach((node,i)=>{if(this.stations[i].style.display==='none')return;node.setAttribute('transform',`translate(${x*(i===2?3:6)} ${y*4})`);
   const reveal=this.reveals[i],settle=1-Math.pow(1-clamp((reveal-.06)/.7),3);
   this.artLayers[i].forEach(layer=>{const kind=layer.dataset.artLayer||layer.dataset.balanceLayer;
    if(kind==='type'||kind==='caption')return;
    const depth=kind==='ribbon'||kind==='back'?-10:kind==='front'?11:4;
    layer.setAttribute('transform',`translate(${x*depth} ${y*depth*.6+(1-settle)*(kind==='ribbon'?-14:21)}) ${layer.dataset.baseTransform}`);
   });
  });
  const highlight=this.balance.querySelector('[data-balance-highlight]');highlight.setAttribute('cx',735+x*80);highlight.setAttribute('cy',195+y*55);
  if(this.heroPositions)this.shards.forEach((node,i)=>{const p=this.heroPositions[i];node.setAttribute('transform',`translate(${p.x+x*(i===2?12:-7)} ${p.y+y*(i===2?8:-5)}) scale(${p.s}) rotate(${i===0?8:i===1?-8:-7})`);});
 }
 setReveal(index,value){
  if(this.reveals[index]===value)return;this.reveals[index]=value;
  if(index===1){const chart=1-Math.pow(1-clamp((value-.25)/.7),3);this.balanceLine.setAttribute('stroke-dasharray',`${chart} 1`);this.total.textContent=won(balanceData.months[0]+(balanceData.total-balanceData.months[0])*chart);this.arcs.forEach(({node,dashes:[length,gap]})=>node.setAttribute('stroke-dasharray',`${length*chart} ${gap+length*(1-chart)}`));}
 }
 select(index,choice){const root=this.stations[index];
  if(index===0){root.querySelectorAll('[data-plan]').forEach((node,i)=>{node.querySelector('[data-plan-surface]').setAttribute('fill',i===choice?'#dfe7ff':'#f0f2f7');node.querySelector('[data-plan-surface]').setAttribute('stroke',i===choice?'#5268ed':'#e8eaf0');node.querySelector('[data-plan-check]').setAttribute('fill',i===choice?'#3d55ed':'#dce1ee');});root.querySelector('[data-connect-selected]').textContent=plans[choice].name+' · '+plans[choice].data+(choice<2?'GB':'');root.querySelector('[data-connect-remaining]').textContent=['9.8','32.8','∞'][choice];root.querySelector('[data-connect-unit]').textContent=choice<2?'GB':'';root.querySelector('[data-connect-percent]').textContent=['65.3%','65.6%','무제한'][choice];root.querySelector('[data-connect-ring]').setAttribute('stroke-dasharray',`${choice===2?371:choice===0?242:243} 371`);}
  if(index===2){root.querySelector('[data-film-title]').textContent=films[choice].name;root.querySelector('[data-film-sub]').textContent=films[choice].sub;root.querySelector('[data-film-genre]').textContent=films[choice].genre;root.querySelectorAll('[data-film-focus]').forEach((n,i)=>n.setAttribute('stroke',i===choice?'#ffe3be':'transparent'));root.querySelector('[data-film-image]').setAttribute('href','/assets/'+filmImages[choice]);}
  if(index===3){const p=products[choice];for(const [key,value]of Object.entries({title:p.name,kr:p.kr,price:p.price+'원',color:p.color}))root.querySelector('[data-product-'+key+']').textContent=value;root.querySelectorAll('[data-product-focus]').forEach((n,i)=>n.setAttribute('opacity',i===choice?1:0));}
  if(index===4)root.querySelectorAll('[data-relay-view]').forEach(n=>n.setAttribute('opacity',n.dataset.relayView===(choice?'timeline':'board')?1:0));
 }
 highlightBalance(kind,index){this.arcs.forEach(({node},i)=>node.style.opacity=(kind==='asset'&&i!==index) ? .25 : 1);this.balance.querySelectorAll('[data-balance-month]').forEach((n,i)=>n.setAttribute('r',kind==='month'&&i===index?6:3.5));}
 render(cam,width,height,progress,paused){
  this.cam=cam;this.part=storyAt(progress);this.paused=paused;const part=this.part;
  this.svg.setAttribute('viewBox',`0 0 ${width} ${height}`);this.backSvg.setAttribute('viewBox',`0 0 ${width} ${height}`);this.svg.dataset.camera=`${cam.x},${cam.y},${cam.s}`;
  this.route.setAttribute('transform',`translate(${width/2-cam.x*cam.s} ${height/2-cam.y*cam.s}) scale(${cam.s})`);this.route.style.opacity=part.type==='journey'?'.16':'0';
  const introAlpha=1-smooth(clamp(progress/1.45));this.intro.style.opacity=introAlpha;this.intro.style.display=introAlpha>0?'':'none';this.backSvg.style.opacity=introAlpha;this.backSvg.style.display=introAlpha>0?'':'none';
  this.heroPositions=[{x:width*.72,y:height*.16,s:Math.min(width*.34/450,height*.28/253)},{x:width*.58,y:height*.13,s:Math.min(width*.15/260,height*.29/400)},{x:width*.56,y:height*.65,s:Math.min(width*.44/590,height*.27/280)}];
  this.stations.forEach((node,i)=>{
   const pose=scenePose(i,cam,width,height);
   if(!pose.visible){node.style.display='none';node.setAttribute('opacity',0);return;}
   node.style.display='';
   const c=stageLayouts[i];node.setAttribute('opacity',pose.opacity);node.setAttribute('pointer-events',part.type==='arrival'&&part.project===i?'auto':'none');
   this.layouts[i].setAttribute('transform',`translate(${pose.x} ${pose.y}) rotate(${pose.a}) scale(${pose.s}) translate(${-c.nativeW/2} ${-c.nativeH/2})`);
  });
  this.positionLayers();
 }
}
