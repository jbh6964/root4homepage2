import {routePath,routePoint,projectStations,stationDistances,clamp,smooth,projectVisibility} from './geometry.js';
import {balanceData,won} from './balance-art.js';
import {projectObject,serviceFragment} from './project-art.js';
const NS='http://www.w3.org/2000/svg';
const colors=['#c1ddb8','#c7b6ef','#b9d4c6'];
export const compositions=[
 {x:180,y:-260,w:360,h:330,a:-9,depth:9},
 {x:5,y:-320,w:480,h:374.4,a:7,depth:5},
 {x:60,y:-260,w:380,h:285,a:-6,depth:11}
];
function station(p,i){const c=compositions[i];return `<g data-station="${i}" transform="translate(${p.x} ${p.y})" opacity="0" pointer-events="none"><g data-primary-depth="${i}" data-depth="${c.depth}"><g data-primary-layout="${i}" transform="translate(${c.x} ${c.y}) rotate(${c.a} ${c.w/2} ${c.h/2})"><ellipse class="project-aura" cx="${c.w/2}" cy="${c.h/2}" rx="${c.w*.8}" ry="${c.h*.8}" fill="url(#station-light-${i})"/><svg width="${c.w}" height="${c.h}" overflow="visible">${projectObject(i,'object-'+i)}</svg>${i===1?'':`<rect data-focus-hit="${i}" x="0" y="0" width="${c.w}" height="${c.h}" fill="transparent" pointer-events="all"/>`}</g></g><g style="display:${i===1?'none':''}" data-depth="${c.depth*1.4}" class="station-satellite" transform="translate(-80 -80)"><g transform="translate(-110 -80) rotate(${i%2?8:-8})">${i===1?'':serviceFragment(i)}</g></g><circle data-station-node r="3.5" fill="#10191a" stroke="${colors[i]}" stroke-width=".6" vector-effect="non-scaling-stroke"/><g data-station-label="${i}" fill="${colors[i]}" font-family="Manrope,Arial,sans-serif"><text font-size="7" letter-spacing="1" opacity=".6">0${i+1}</text><text x="24" font-size="10" letter-spacing=".2">${p.name}</text><text x="24" y="14" font-size="6" opacity=".6">UI 구성 예시</text></g></g>`;}
export class VectorScene{
 constructor(container){
  this.svg=document.createElementNS(NS,'svg');this.svg.classList.add('zoom-world');this.svg.setAttribute('preserveAspectRatio','none');this.svg.setAttribute('aria-hidden','true');
  const fragments=[{d:.27,i:1},{d:.51,i:2},{d:.69,i:2},{d:.80,i:2}];
  this.svg.innerHTML=`<defs><linearGradient id="flow-spectrum"><stop stop-color="#adc5a1"/><stop offset=".5" stop-color="#acacd0"/><stop offset="1" stop-color="#aac6b4"/></linearGradient>${colors.map((c,i)=>`<radialGradient id="station-light-${i}"><stop stop-color="${c}" stop-opacity=".16"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('')}</defs><path data-flow-route d="${routePath}" fill="none" stroke="url(#flow-spectrum)" stroke-width=".7" pathLength="1000" vector-effect="non-scaling-stroke" opacity=".28"/><path data-flow-traveled d="${routePath}" fill="none" stroke="url(#flow-spectrum)" stroke-width="1" pathLength="1000" vector-effect="non-scaling-stroke" opacity=".5"/>${fragments.map(({d,i},n)=>{const p=routePoint(d);return `<g data-bridge="${d}" data-bridge-project="${i}" transform="translate(${p.x+40} ${p.y-100}) rotate(${n%2?-7:8})" opacity="0"><g transform="scale(.7)">${serviceFragment(i)}</g></g>`;}).join('')}${projectStations.map(station).join('')}<circle data-flow-cursor r="2" fill="#d2dfc3" opacity="0"/>`;
  container.replaceChildren(this.svg);this.route=this.svg.querySelector('[data-flow-route]');this.traveled=this.svg.querySelector('[data-flow-traveled]');this.cursor=this.svg.querySelector('[data-flow-cursor]');this.stations=[...this.svg.querySelectorAll('[data-station]')];this.labels=[...this.svg.querySelectorAll('[data-station-label]')];this.layouts=[...this.svg.querySelectorAll('[data-primary-layout]')];this.depthLayers=[...this.svg.querySelectorAll('[data-depth]')];this.bridges=[...this.svg.querySelectorAll('[data-bridge]')];
  this.balance=this.stations[1];this.balanceValue=1;
  this.balanceLayers=Object.fromEntries([...this.balance.querySelectorAll('[data-balance-layer]')].map(n=>[n.dataset.balanceLayer,n]));
  this.balanceArcs=[...this.balance.querySelectorAll('[data-balance-arc]')].map(node=>({node,dashes:node.getAttribute('stroke-dasharray').split(' ').map(Number)}));
  this.balanceLine=this.balance.querySelector('[data-balance-line]');this.balanceTotal=this.balance.querySelector('[data-balance-total]');this.balanceHighlight=this.balance.querySelector('[data-balance-highlight]');
  this.balance.querySelectorAll('[data-balance-hit],[data-balance-month-hit]').forEach(hit=>{
   hit.addEventListener('pointerenter',e=>{if(!this.balanceActive||this.paused||e.pointerType==='touch')return;const kind=hit.hasAttribute('data-balance-hit')?'asset':'month',index=Number(kind==='asset'?hit.dataset.balanceHit:hit.dataset.balanceMonthHit);this.svg.dispatchEvent(new CustomEvent('balance-inspect',{detail:{kind,index,anchor:{x:e.clientX,y:e.clientY}}}));});
   hit.addEventListener('pointerleave',()=>this.svg.dispatchEvent(new CustomEvent('balance-inspect',{detail:null})));
  });
  this.svg.querySelectorAll('[data-focus-hit]').forEach(hit=>{hit.addEventListener('pointerenter',e=>{if(!this.paused&&e.pointerType!=='touch')this.focus(Number(hit.dataset.focusHit));});hit.addEventListener('pointerleave',()=>this.focus(-1));});
 }
 setBalanceReveal(value){
  this.balanceValue=value;const ease=t=>1-Math.pow(1-clamp(t),3),settle=ease((value-.08)/.62),chart=ease((value-.28)/.65);
  this.balanceLine.setAttribute('stroke-dasharray',`${chart} 1`);
  this.balanceTotal.textContent=won(balanceData.months[0]+(balanceData.total-balanceData.months[0])*chart);
  this.balance.querySelectorAll('[data-balance-month]').forEach(n=>n.style.opacity=.2+.8*chart);
  this.balanceArcs.forEach(({node,dashes:[length,gap]})=>node.setAttribute('stroke-dasharray',`${length*chart} ${gap+length*(1-chart)}`));
  this.balanceSettle=settle;this.positionBalanceLayers();
 }
 positionBalanceLayers(){
  if(!this.balanceLayers)return;const p=this.pointer||{x:0,y:0},s=this.balanceSettle??1;
  this.balanceLayers.ui.setAttribute('transform',`translate(${p.x*5} ${(1-s)*24+p.y*3}) rotate(${(1-s)*3} 480 470)`);
  this.balanceLayers.ribbon.setAttribute('transform',`translate(${-p.x*9} ${-(1-s)*16-p.y*6})`);
  this.balanceHighlight.setAttribute('cx',735+p.x*85);this.balanceHighlight.setAttribute('cy',195+p.y*55);
 }
 highlightBalance(kind,index){
  this.balance.querySelectorAll('[data-balance-arc]').forEach((n,i)=>n.style.opacity=(kind==='asset'&&i!==index) ? .3 : 1);
  this.balance.querySelectorAll('[data-balance-month]').forEach((n,i)=>n.setAttribute('r',kind==='month'&&i===index?6:3.5));
 }
 focus(index){if(this.focused===index)return;this.focused=index;this.stations.forEach((n,i)=>n.classList.toggle('is-hovered',i===index));}
 setPaused(paused){if(this.paused===paused)return;this.paused=paused;if(paused){this.svg.pauseAnimations();this.focus(-1);}else this.svg.unpauseAnimations();}
 setPointer(x,y){this.pointer={x,y};const s=this.cam?.s||1;this.depthLayers.forEach(n=>{const d=Number(n.dataset.depth);n.setAttribute('transform',`translate(${(x*d/s).toFixed(3)} ${(y*d*.7/s).toFixed(3)})`);});this.positionBalanceLayers();}
 render(cam,width,height,progress,paused){
  this.cam=cam;this.balanceActive=cam.type==='arrival'&&cam.project===1;this.setPaused(paused);const w=width/cam.s,h=height/cam.s;this.svg.setAttribute('viewBox',`${cam.x-w/2} ${cam.y-h/2} ${w} ${h}`);this.svg.dataset.routeDistance=cam.routeDistance;
  const start=Math.max(0,cam.routeDistance-.08),length=cam.type==='intro'?10+cam.t*90:210;
  this.route.setAttribute('stroke-dasharray',`${length} 1000`);this.route.setAttribute('stroke-dashoffset',`${-start*1000}`);this.traveled.setAttribute('stroke-dasharray',`${Math.max(0,(cam.routeDistance-start)*1000)} 1000`);this.traveled.setAttribute('stroke-dashoffset',`${-start*1000}`);
  this.route.style.opacity=clamp(progress/.65)*.28;this.traveled.style.opacity=clamp(progress/.65)*.5;
  const point=routePoint(cam.routeDistance);this.cursor.setAttribute('cx',point.x);this.cursor.setAttribute('cy',point.y);this.cursor.style.opacity=clamp(progress/.8)*.7*(1-(this.balanceNear||0));
  this.stations.forEach((n,i)=>{const visible=projectVisibility(progress,i);n.setAttribute('opacity',visible);n.setAttribute('pointer-events',visible>.3?'auto':'none');});
  this.labels.forEach(n=>{n.setAttribute('transform',`translate(${17/cam.s} ${26/cam.s}) scale(${1/cam.s})`);n.style.opacity=cam.type==='arrival'?'0':'.65';});
  this.layouts.forEach((node,i)=>{
   const c=compositions[i],near=1-smooth(clamp(Math.abs(cam.routeDistance-stationDistances[i])/.11)),a=smooth(clamp((cam.zoom-1.5)/2.6))*near;
   // Recompose within the right-hand stage as the camera arrives, leaving the
   // HTML reading column clear. Pointer parallax remains on a separate wrapper.
   const rightCenter=width*(i===1?.72:.74),fit=i===1?Math.min(width*.66/(c.w*cam.s),height*.8/(c.h*cam.s)):1,scale=1+(fit-1)*a,targetX=cam.x-projectStations[i].x+(rightCenter-width/2)/cam.s-c.w*scale/2,targetY=cam.y-projectStations[i].y-height*(i===1?.06:.025)/cam.s-c.h*scale/2;
   node.setAttribute('transform',`translate(${c.x+(targetX-c.x)*a} ${c.y+(targetY-c.y)*a}) scale(${scale}) rotate(${c.a*(1-a*(i===1?1:.75))} ${c.w/2} ${c.h/2})`);this.stations[i].querySelector('.station-satellite').style.opacity=.75*(1-a);if(i===1){this.balanceNear=a;this.stations[i].querySelector('[data-station-node]').style.opacity=Math.pow(1-a,4);this.labels[i].style.opacity=cam.type==='arrival'?0:.65*Math.pow(1-a,4);}
  });
  // Route graphics stay behind the work and clear the reading/arrival stage.
  const routeEmphasis=Math.pow(1-(this.balanceNear||0),2);
  this.route.style.opacity=clamp(progress/.65)*.28*routeEmphasis;this.traveled.style.opacity=clamp(progress/.65)*.5*routeEmphasis;this.cursor.style.opacity=clamp(progress/.8)*.7*routeEmphasis;
  this.bridges.forEach(n=>{const d=Number(n.dataset.bridge),near=1-smooth(clamp(Math.abs(cam.routeDistance-d)/.14));n.setAttribute('opacity',clamp((progress-.8)/.7)*near*(n.dataset.bridgeProject==='1'?.85:.25));});
  if(this.pointer)this.setPointer(this.pointer.x,this.pointer.y);
 }
}
