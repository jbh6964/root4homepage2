import {routePath,routePoint,projectStations,stationDistances,clamp,smooth,projectVisibility} from './geometry.js';
import {projectObject,serviceFragment} from './project-art.js';
const NS='http://www.w3.org/2000/svg';
const colors=['#c1ddb8','#c7b6ef','#b9d4c6'];
export const compositions=[
 {x:180,y:-260,w:360,h:330,a:-9,depth:9},
 {x:15,y:-330,w:285,h:365,a:7,depth:7},
 {x:60,y:-260,w:380,h:285,a:-6,depth:11}
];
function station(p,i){const c=compositions[i];return `<g data-station="${i}" transform="translate(${p.x} ${p.y})" opacity="0" pointer-events="none"><g data-primary-depth="${i}" data-depth="${c.depth}"><g data-primary-layout="${i}" transform="translate(${c.x} ${c.y}) rotate(${c.a} ${c.w/2} ${c.h/2})"><ellipse class="project-aura" cx="${c.w/2}" cy="${c.h/2}" rx="${c.w*.8}" ry="${c.h*.8}" fill="url(#station-light-${i})"/><svg width="${c.w}" height="${c.h}" overflow="visible">${projectObject(i,'object-'+i)}</svg><rect data-focus-hit="${i}" x="0" y="0" width="${c.w}" height="${c.h}" fill="transparent" pointer-events="all"/></g></g><g data-depth="${c.depth*1.4}" class="station-satellite" transform="translate(-80 -80)"><g transform="translate(-110 -80) rotate(${i%2?8:-8})">${serviceFragment(i)}</g></g><circle r="3.5" fill="#10191a" stroke="${colors[i]}" stroke-width=".6" vector-effect="non-scaling-stroke"/><g data-station-label="${i}" fill="${colors[i]}" font-family="Manrope,Arial,sans-serif"><text font-size="7" letter-spacing="1" opacity=".6">0${i+1}</text><text x="24" font-size="10" letter-spacing=".2">${p.name}</text><text x="24" y="14" font-size="6" opacity=".6">UI 구성 예시</text></g></g>`;}
export class VectorScene{
 constructor(container){
  this.svg=document.createElementNS(NS,'svg');this.svg.classList.add('zoom-world');this.svg.setAttribute('preserveAspectRatio','none');this.svg.setAttribute('aria-hidden','true');
  const fragments=[{d:.27,i:1},{d:.51,i:2},{d:.69,i:2},{d:.80,i:2}];
  this.svg.innerHTML=`<defs><linearGradient id="flow-spectrum"><stop stop-color="#adc5a1"/><stop offset=".5" stop-color="#acacd0"/><stop offset="1" stop-color="#aac6b4"/></linearGradient>${colors.map((c,i)=>`<radialGradient id="station-light-${i}"><stop stop-color="${c}" stop-opacity=".16"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('')}</defs><path data-flow-route d="${routePath}" fill="none" stroke="url(#flow-spectrum)" stroke-width=".7" pathLength="1000" vector-effect="non-scaling-stroke" opacity=".28"/><path data-flow-traveled d="${routePath}" fill="none" stroke="url(#flow-spectrum)" stroke-width="1" pathLength="1000" vector-effect="non-scaling-stroke" opacity=".5"/>${fragments.map(({d,i},n)=>{const p=routePoint(d);return `<g data-bridge="${d}" transform="translate(${p.x+40} ${p.y-100}) rotate(${n%2?-7:8})" opacity="0"><g transform="scale(.7)">${serviceFragment(i)}</g></g>`;}).join('')}${projectStations.map(station).join('')}<circle data-flow-cursor r="2" fill="#d2dfc3" opacity="0"/>`;
  container.replaceChildren(this.svg);this.route=this.svg.querySelector('[data-flow-route]');this.traveled=this.svg.querySelector('[data-flow-traveled]');this.cursor=this.svg.querySelector('[data-flow-cursor]');this.stations=[...this.svg.querySelectorAll('[data-station]')];this.labels=[...this.svg.querySelectorAll('[data-station-label]')];this.layouts=[...this.svg.querySelectorAll('[data-primary-layout]')];this.depthLayers=[...this.svg.querySelectorAll('[data-depth]')];this.bridges=[...this.svg.querySelectorAll('[data-bridge]')];
  this.svg.querySelectorAll('[data-focus-hit]').forEach(hit=>{hit.addEventListener('pointerenter',e=>{if(!this.paused&&e.pointerType!=='touch')this.focus(Number(hit.dataset.focusHit));});hit.addEventListener('pointerleave',()=>this.focus(-1));});
 }
 focus(index){if(this.focused===index)return;this.focused=index;this.stations.forEach((n,i)=>n.classList.toggle('is-hovered',i===index));}
 setPaused(paused){if(this.paused===paused)return;this.paused=paused;if(paused){this.svg.pauseAnimations();this.focus(-1);}else this.svg.unpauseAnimations();}
 setPointer(x,y){this.pointer={x,y};const s=this.cam?.s||1;this.depthLayers.forEach(n=>{const d=Number(n.dataset.depth);n.setAttribute('transform',`translate(${(x*d/s).toFixed(3)} ${(y*d*.7/s).toFixed(3)})`);});}
 render(cam,width,height,progress,paused){
  this.cam=cam;this.setPaused(paused);const w=width/cam.s,h=height/cam.s;this.svg.setAttribute('viewBox',`${cam.x-w/2} ${cam.y-h/2} ${w} ${h}`);this.svg.dataset.routeDistance=cam.routeDistance;
  const start=Math.max(0,cam.routeDistance-.08),length=cam.type==='intro'?10+cam.t*90:210;
  this.route.setAttribute('stroke-dasharray',`${length} 1000`);this.route.setAttribute('stroke-dashoffset',`${-start*1000}`);this.traveled.setAttribute('stroke-dasharray',`${Math.max(0,(cam.routeDistance-start)*1000)} 1000`);this.traveled.setAttribute('stroke-dashoffset',`${-start*1000}`);
  this.route.style.opacity=clamp(progress/.65)*.28;this.traveled.style.opacity=clamp(progress/.65)*.5;
  const point=routePoint(cam.routeDistance);this.cursor.setAttribute('cx',point.x);this.cursor.setAttribute('cy',point.y);this.cursor.style.opacity=clamp(progress/.8)*.7;
  this.stations.forEach((n,i)=>{const visible=projectVisibility(progress,i);n.setAttribute('opacity',visible);n.setAttribute('pointer-events',visible>.3?'auto':'none');});
  this.labels.forEach(n=>{n.setAttribute('transform',`translate(${17/cam.s} ${26/cam.s}) scale(${1/cam.s})`);n.style.opacity=cam.type==='arrival'?'0':'.65';});
  this.layouts.forEach((node,i)=>{
   const c=compositions[i],near=1-smooth(clamp(Math.abs(cam.routeDistance-stationDistances[i])/.11)),a=smooth(clamp((cam.zoom-1.5)/2.6))*near;
   // Recompose within the right-hand stage as the camera arrives, leaving the
   // HTML reading column clear. Pointer parallax remains on a separate wrapper.
   const rightCenter=width*.74,targetX=cam.x-projectStations[i].x+(rightCenter-width/2)/cam.s-c.w/2,targetY=cam.y-projectStations[i].y-height*.025/cam.s-c.h/2;
   node.setAttribute('transform',`translate(${c.x+(targetX-c.x)*a} ${c.y+(targetY-c.y)*a}) rotate(${c.a*(1-a*.75)} ${c.w/2} ${c.h/2})`);this.stations[i].querySelector('.station-satellite').style.opacity=.75*(1-a);
  });
  this.bridges.forEach(n=>{const d=Number(n.dataset.bridge),near=1-smooth(clamp(Math.abs(cam.routeDistance-d)/.14));n.setAttribute('opacity',clamp((progress-.8)/.7)*near*.25);});
  if(this.pointer)this.setPointer(this.pointer.x,this.pointer.y);
 }
}
