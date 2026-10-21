import {routePath,routePoint,projectStations,stationDistances,clamp,smooth} from './geometry.js';
import {projectObject,projectPalettes,brandMark} from './project-art.js';
import {projects} from './projects.js';
const NS='http://www.w3.org/2000/svg';
const label=(x,y,text,size=12,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${text}</text>`;
const arrivalOffsets=[[-95,-205],[-35,-190],[-115,-225],[-15,-195],[-150,-190],[-170,-185]];
const captionOffsets=[56,20,48,56,71,24];
const colors=['#c2d5ba','#a2bca1','#adb9ed','#e3b9ab','#d0b184','#a3c7d4'];
// Dimensions are deliberately different. Node positions remain on the shared
// camera path; only the artifacts and their depth layers are composed around it.
export const compositions=[
 {x:200,y:-273,w:410,h:410,a:-15,depth:10},
 {x:22,y:-350,w:280,h:380,a:8,depth:6},
 {x:28,y:-332,w:410,h:410,a:-10,depth:12},
 {x:5,y:-352,w:330,h:410,a:7,depth:8},
 {x:-5,y:-300,w:470,h:430,a:-11,depth:9},
 {x:-32,y:-365,w:470,h:390,a:8,depth:7}
];
function secondary(index){const [bg,fg]=projectPalettes[index];
 if(index===0)return `<g transform="translate(370 90) rotate(-10)"><path d="M4 6H136V87H4Z" fill="#000" opacity=".15"/><path d="M0 0H132V81H0Z" fill="#e6e8da"/>${label(14,47,'f/o®',34,`fill="${fg}" font-family="Cormorant Garamond,Georgia,serif" font-style="italic"`)}${label(15,65,'INDEPENDENT, TOGETHER.',4,'fill="#53665a" letter-spacing=".8"')}</g>`;
 if(index===2)return `<g transform="translate(-103 -90) rotate(-12)"><path d="M0 0H120V164H0Z" fill="#d5ed8a"/>${label(12,39,'OFF',33,'fill="#263ba4" font-weight="750" letter-spacing="-2"')}${label(12,70,'BEAT',33,'fill="#263ba4" font-weight="750" letter-spacing="-2"')}<path d="M13 103c14-40 28 40 42 0s28 40 42 0" stroke="#263ba4" fill="none" stroke-width="1.5"/>${label(13,145,'IN YOUR OWN FREQUENCY',4,'fill="#263ba4" letter-spacing=".6"')}</g>`;
 if(index===4)return `<g transform="translate(-115 -83) rotate(13)"><rect width="120" height="80" rx="1" fill="#f0dfb5"/>${label(12,45,'Stay a little.',24,'fill="#734436" font-family="Cormorant Garamond,Georgia,serif" font-style="italic"')}<path d="M13 59h95" stroke="#a48b60" stroke-width=".4"/></g>`;
 return `<g transform="translate(-105 -92) rotate(${index%2?-10:12})"><path d="M0 0H121V150H0Z" fill="${index===5?'#a9c5d9':fg}"/><g transform="translate(26 22) scale(1.1)" color="${bg}">${brandMark(index)}</g>${label(13,129,index===1?'THE DAILY RITUAL':index===3?'LIGHT / FEELING':'FIELD NOTES / 06',4.3,`fill="${bg}" letter-spacing=".6"`)}</g>`;
}
function station(station,index){const c=compositions[index],color=colors[index];return `<g data-station="${index}" transform="translate(${station.x} ${station.y})" style="--object-accent:${color}">
 <g data-primary-depth="${index}" data-depth="${c.depth}">
  <g data-primary-layout="${index}" transform="translate(${c.x} ${c.y}) rotate(${c.a} ${c.w/2} ${c.h/2})">
   <ellipse class="project-aura" cx="${c.w*.5}" cy="${c.h*.56}" rx="${c.w*.78}" ry="${c.h*.74}" fill="url(#station-light-${index})"/>
   <svg width="${c.w}" height="${c.h}" overflow="visible">${projectObject(index,'object-'+index)}</svg>
   <rect class="object-hit" data-focus-hit="${index}" x="0" y="0" width="${c.w}" height="${c.h}" rx="${index===1?c.w/2:40}" fill="transparent" pointer-events="all"/>
  </g>
 </g>
 <g data-depth="${c.depth*1.45}" class="station-satellite">${secondary(index)}</g>
 <path d="M-12 0H12M0-12V12" fill="none" stroke="${color}" stroke-width=".5" vector-effect="non-scaling-stroke" opacity=".5"/>
 <circle r="5" fill="#10191a" stroke="${color}" stroke-width=".7" vector-effect="non-scaling-stroke"/><circle data-station-core="${index}" r="1.8" fill="${color}"/>
 <g data-station-label="${index}" class="station-caption" fill="${color}">${label(0,0,'0'+(index+1),7,'letter-spacing="1.3" opacity=".55"')}${label(24,0,station.name,11,'font-weight="500" letter-spacing="-.25"')}${label(24,15,station.category,5,'letter-spacing=".8" opacity=".5"')}</g>
 </g>`;}
export class VectorScene{
 constructor(container){
  this.svg=document.createElementNS(NS,'svg');this.svg.classList.add('zoom-world');this.svg.setAttribute('preserveAspectRatio','none');this.svg.setAttribute('aria-hidden','true');this.svg.setAttribute('shape-rendering','geometricPrecision');
  this.svg.innerHTML=`<defs><linearGradient id="flow-spectrum" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#c5d5aa"/><stop offset=".4" stop-color="#8eafb6"/><stop offset=".7" stop-color="#c1a3b9"/><stop offset="1" stop-color="#d5b18b"/></linearGradient>${colors.map((color,i)=>`<radialGradient id="station-light-${i}"><stop stop-color="${color}" stop-opacity=".17"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`).join('')}</defs>
  <g font-family="Manrope,Arial,sans-serif">
   <path data-flow-route d="${routePath}" fill="none" stroke="url(#flow-spectrum)" stroke-width=".7" opacity=".36" vector-effect="non-scaling-stroke"/>
   <path data-flow-traveled d="${routePath}" fill="none" stroke="url(#flow-spectrum)" stroke-width="1" pathLength="1000" stroke-dasharray="0 1000" vector-effect="non-scaling-stroke" opacity=".75"/>
   <path class="flow-signal" d="${routePath}" fill="none" stroke="#d4e3cf" stroke-linecap="round" stroke-width="1.8" pathLength="1000" stroke-dasharray=".4 43" opacity=".5" vector-effect="non-scaling-stroke"><animate attributeName="stroke-dashoffset" from="0" to="-434" dur="80s" repeatCount="indefinite"/></path>
   ${projectStations.map(station).join('')}
   <g transform="translate(130 830)" fill="#a3b2a7"><circle r="3"/>${label(-6,27,'ORIGIN / 00',6,'letter-spacing="1.3" opacity=".55"')}</g>
   <g transform="translate(215 1400)" fill="#a3b2a7"><circle r="3"/>${label(15,23,'TO BE CONTINUED',6,'letter-spacing="1.3" opacity=".55"')}</g>
   <circle data-flow-cursor r="3" fill="#dce8d6"/><circle data-flow-halo r="11" fill="none" stroke="#c5d8b5" stroke-width=".5" opacity=".55"><animate attributeName="r" values="8;13;8" dur="5s" repeatCount="indefinite"/></circle>
  </g>`;
  container.replaceChildren(this.svg);
  this.traveled=this.svg.querySelector('[data-flow-traveled]');this.cursor=this.svg.querySelector('[data-flow-cursor]');this.halo=this.svg.querySelector('[data-flow-halo]');this.stations=[...this.svg.querySelectorAll('[data-station]')];this.labels=[...this.svg.querySelectorAll('[data-station-label]')];this.depthLayers=[...this.svg.querySelectorAll('[data-depth]')];this.layouts=[...this.svg.querySelectorAll('[data-primary-layout]')];
  this.svg.querySelectorAll('[data-focus-hit]').forEach(node=>{
   node.addEventListener('pointerenter',event=>{if(!this.paused&&event.pointerType!=='touch')this.focus(Number(node.dataset.focusHit));});
   node.addEventListener('pointerleave',()=>this.focus(-1));
  });
  const map=document.querySelector('#flow-map svg');
  if(map){map.setAttribute('viewBox','0 0 2700 1750');map.innerHTML=`<path d="${routePath}" fill="none" stroke="#798d84" stroke-width="9" opacity=".6"/>${projectStations.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="24" fill="${colors[i]}"/>`).join('')}<circle data-map-position r="36" fill="#f0efe3"/>`;this.mapCursor=map.querySelector('[data-map-position]');}
 }
 focus(index){if(this.focused===index)return;this.focused=index;this.stations.forEach((node,i)=>node.classList.toggle('is-hovered',i===index));this.svg.dispatchEvent(new CustomEvent('projectfocus',{detail:index,bubbles:true}));}
 setPaused(paused){if(this.paused===paused)return;this.paused=paused;if(paused){this.svg.pauseAnimations();this.focus(-1);}else this.svg.unpauseAnimations();}
 setPointer(x,y){this.pointer={x,y};const s=this.cam?.s||1;for(const layer of this.depthLayers){const amount=Number(layer.dataset.depth);layer.setAttribute('transform',`translate(${(x*amount/s).toFixed(3)} ${(y*amount*.7/s).toFixed(3)})`);}}
 render(cam,width,height,seconds,paused){
  this.cam=cam;this.setPaused(paused);const w=width/cam.s,h=height/cam.s;
  this.svg.setAttribute('viewBox',`${cam.x-w/2} ${cam.y-h/2} ${w} ${h}`);this.svg.dataset.routeDistance=cam.routeDistance;
  const point=routePoint(cam.routeDistance);for(const node of[this.cursor,this.halo,this.mapCursor])if(node){node.setAttribute('cx',point.x);node.setAttribute('cy',point.y);}
  this.traveled.setAttribute('stroke-dasharray',`${clamp(cam.routeDistance)*1000} 1000`);
  this.stations.forEach((node,index)=>node.querySelector('[data-station-core]').setAttribute('r',Math.abs(cam.routeDistance-stationDistances[index])<.028?'3':'1.8'));
  this.labels.forEach((node,index)=>{node.setAttribute('transform',`translate(${17/cam.s} ${captionOffsets[index]/cam.s}) scale(${1/cam.s})`);node.style.opacity=cam.type==='detail'?'0':'';});
  this.layouts.forEach((node,index)=>{const c=compositions[index],near=1-smooth(clamp(Math.abs(cam.routeDistance-stationDistances[index])/.1)),approach=smooth(clamp((cam.zoom-1.5)/2.6))*near,[x,y]=arrivalOffsets[index];node.setAttribute('transform',`translate(${c.x+(x-c.x)*approach} ${c.y+(y-c.y)*approach}) rotate(${c.a*(1-approach*.5)} ${c.w/2} ${c.h/2})`);});
  if(this.pointer)this.setPointer(this.pointer.x,this.pointer.y);
 }
}
