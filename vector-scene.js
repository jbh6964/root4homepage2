import {projectStations,clamp,smooth,storyAt} from './geometry.js';
import {projectObject,plans,products,films,filmImages} from './project-art.js';
import {balanceData,won} from './balance-art.js';
import {entranceState} from './entrance-scene.js';
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
 return{x:width*c.x+driftX,y:height*c.y+driftY,s:fit*cam.zoom/(index===0?2.65:4.5+index*.35),a:0};
}
export function scenePose(index,cam,width,height){
 const part=cam,pose=stagePose(index,cam,width,height),active=(part.type==='arrival'||part.type==='journey')&&part.project===index;
 const departing=(part.type==='journey'&&part.project===index+1&&part.t<.52)||(part.type==='outro'&&index===projectStations.length-1&&part.t<.52);
 if(!active&&!departing)return{...pose,visible:false,opacity:0};
 let opacity=1;
 if(part.type==='journey'&&active){
  const delay=index===0?.28:0,e=smooth((part.t-delay)/(1-delay)),field=entranceState(cam),station=projectStations[index];
  const sourceX=width*field.focusX+clamp((station.x-cam.x)*cam.s*.025,-width*.07,width*.07);
  const sourceY=height*field.focusY+clamp((station.y-cam.y)*cam.s*.025,-height*.06,height*.06);
  pose.x=mix(sourceX,pose.x,e);pose.y=mix(sourceY,pose.y,e);
  pose.s*=mix(.12,1,e);pose.a=(index%2?-4:4)*(1-e);
  opacity=smooth((part.t-delay)/.20);
 }
 if(departing){
  const e=smooth(part.t/.52),side=index===3?1:-1;
  pose.x+=side*width*1.95*e;pose.y+=height*.12*e;pose.s*=1+.65*e;pose.a=side*5*e;
  opacity=1-smooth((e-.7)/.3);
 }
 return{...pose,visible:opacity>0,opacity};
}
export function captionOpacity(cam){
 return cam.type==='arrival'?smooth(cam.t/.09)*(1-smooth((cam.t-.87)/.13)):0;
}

export class VectorScene{
 constructor(container){
  this.svg=document.createElementNS(NS,'svg');this.svg.classList.add('zoom-world');this.svg.setAttribute('aria-hidden','true');
  this.svg.innerHTML=`${projectStations.map((station,i)=>{const c=stageLayouts[i];return `<g data-station="${i}" opacity="0" style="display:none"><g data-primary-layout="${i}"><g data-project-depth="${i}"><svg width="${c.nativeW}" height="${c.nativeH}" overflow="visible">${projectObject(i,'scene-'+i)}</svg></g></g></g>`;}).join('')}`;
  container.replaceChildren(this.svg);
  this.stations=[...this.svg.querySelectorAll('[data-station]')];this.layouts=[...this.svg.querySelectorAll('[data-primary-layout]')];
  this.reveals=Array(5).fill(1);
  this.balance=this.stations[1];this.balanceLine=this.balance.querySelector('[data-balance-line]');this.total=this.balance.querySelector('[data-balance-total]');this.arcs=[...this.balance.querySelectorAll('[data-balance-arc]')].map(node=>({node,dashes:node.getAttribute('stroke-dasharray').split(' ').map(Number)}));
  this.svg.querySelectorAll('[data-plan],[data-film],[data-product-focus]').forEach(n=>n.style.cursor='pointer');
  this.svg.addEventListener('click',e=>{if(this.paused||this.part?.type!=='arrival')return;const hit=e.target.closest('[data-plan],[data-film],[data-product-focus]');if(!hit)return;const index=this.part.project,choice=Number(hit.dataset.plan??hit.dataset.film??hit.dataset.productFocus);this.svg.dispatchEvent(new CustomEvent('scene-choice',{detail:{index,choice}}));});
  this.balance.querySelectorAll('[data-balance-hit],[data-balance-flow-hit]').forEach(hit=>{
   hit.addEventListener('pointerenter',e=>{if(this.paused||this.part?.type!=='arrival'||this.part.project!==1||e.pointerType==='touch')return;const kind=hit.hasAttribute('data-balance-hit')?'asset':'flow',index=Number(kind==='asset'?hit.dataset.balanceHit:hit.dataset.balanceFlowHit);this.svg.dispatchEvent(new CustomEvent('scene-inspect',{detail:{kind,index,x:e.clientX,y:e.clientY}}));});
   hit.addEventListener('pointerleave',()=>this.svg.dispatchEvent(new CustomEvent('scene-inspect',{detail:null})));
  });
 }
 setPaused(value){this.paused=value;}
 focus(){}
 setReveal(index,value){
  if(this.reveals[index]===value)return;this.reveals[index]=value;
  if(index===1){const chart=1-Math.pow(1-clamp((value-.25)/.7),3);this.balanceLine.setAttribute('stroke-dasharray',`${chart} 1`);this.total.textContent=won(balanceData.flow[0]+(balanceData.total-balanceData.flow[0])*chart);this.arcs.forEach(({node,dashes:[length,gap]})=>node.setAttribute('stroke-dasharray',`${length*chart} ${gap+length*(1-chart)}`));}
 }
 select(index,choice){const root=this.stations[index];
  if(index===0){root.querySelectorAll('[data-plan]').forEach((node,i)=>{node.querySelector('[data-plan-surface]').setAttribute('fill',i===choice?'#dfe7ff':'#f0f2f7');node.querySelector('[data-plan-surface]').setAttribute('stroke',i===choice?'#5268ed':'#e8eaf0');node.querySelector('[data-plan-check]').setAttribute('fill',i===choice?'#3d55ed':'#dce1ee');});root.querySelector('[data-connect-selected]').textContent=plans[choice].name+' · '+plans[choice].data+(choice<2?'GB':'');root.querySelector('[data-connect-remaining]').textContent=['9.8','32.8','∞'][choice];root.querySelector('[data-connect-unit]').textContent=choice<2?'GB':'';root.querySelector('[data-connect-percent]').textContent=['65.3%','65.6%','무제한'][choice];root.querySelector('[data-connect-ring]').setAttribute('stroke-dasharray',`${choice===2?371:choice===0?242:243} 371`);}
  if(index===2){root.querySelector('[data-film-title]').textContent=films[choice].name;root.querySelector('[data-film-sub]').textContent=films[choice].sub;root.querySelector('[data-film-genre]').textContent=films[choice].genre;root.querySelectorAll('[data-film-focus]').forEach((n,i)=>n.setAttribute('stroke',i===choice?'#ffe3be':'transparent'));root.querySelector('[data-film-image]').setAttribute('href','/assets/'+filmImages[choice]);}
  if(index===3){const p=products[choice];for(const [key,value]of Object.entries({title:p.name,kr:p.kr,price:p.price+'원',color:p.color}))root.querySelector('[data-product-'+key+']').textContent=value;root.querySelectorAll('[data-product-focus]').forEach((n,i)=>n.setAttribute('opacity',i===choice?1:0));}
  if(index===4)root.querySelectorAll('[data-relay-view]').forEach(n=>n.setAttribute('opacity',n.dataset.relayView===(choice?'owners':'board')?1:0));
 }
 highlightBalance(kind,index){this.arcs.forEach(({node},i)=>node.style.opacity=(kind==='asset'&&i!==index) ? .25 : 1);this.balance.querySelectorAll('[data-balance-flow]').forEach((n,i)=>n.setAttribute('r',kind==='flow'&&i===index?6:3.5));}
 render(cam,width,height,progress,paused){
  this.cam=cam;this.part=storyAt(progress);this.paused=paused;const part=this.part;
  this.svg.setAttribute('viewBox',`0 0 ${width} ${height}`);this.svg.dataset.camera=`${cam.x},${cam.y},${cam.s}`;
  const foreground=part.type==='journey'&&part.project>0?part.project-1:null;
  if(foreground!==null&&this.frontStation!==foreground){this.svg.append(this.stations[foreground]);this.frontStation=foreground;}

  this.stations.forEach((node,i)=>{
   const pose=scenePose(i,cam,width,height);
   if(!pose.visible){node.style.display='none';node.setAttribute('opacity',0);return;}
   node.style.display='';
   const c=stageLayouts[i];node.setAttribute('opacity',pose.opacity);node.setAttribute('pointer-events',part.type==='arrival'&&part.project===i?'auto':'none');
   this.layouts[i].setAttribute('transform',`translate(${pose.x} ${pose.y}) rotate(${pose.a}) scale(${pose.s}) translate(${-c.nativeW/2} ${-c.nativeH/2})`);
  });
 }
}
