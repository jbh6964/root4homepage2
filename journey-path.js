import {routePath,routePoint,stationDistances,clamp,smooth} from './geometry.js';

const NS='http://www.w3.org/2000/svg';

// The camera and the gauge share the exact route geometry. The bright stroke
// ends at routeDistance and the locator uses routePoint(routeDistance), so the
// light can never drift away from the filled endpoint in either direction.
export function journeyPathState(cam,progress,end){
 const routeProgress=clamp(cam.routeDistance);
 const point=routePoint(routeProgress);
 const arrival=cam.type==='arrival'?smooth(cam.t/.12)*(1-smooth((cam.t-.9)/.1)):0;
 return{routeProgress,overallProgress:clamp(progress/end),x:point.x,y:point.y,arrival};
}

export class JourneyPath{
 constructor(container){
  this.svg=document.createElementNS(NS,'svg');
  this.svg.classList.add('journey-route');
  this.svg.setAttribute('aria-hidden','true');
  this.svg.innerHTML=`<defs>
   <filter id="route-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   <filter id="arrival-glow" x="-250%" y="-250%" width="600%" height="600%"><feGaussianBlur stdDeviation="22"/></filter>
  </defs><g data-route-world>
   <path class="route-future" d="${routePath}" pathLength="1"/>
   <path class="route-travelled route-travelled-glow" d="${routePath}" pathLength="1"/>
   <path class="route-travelled" d="${routePath}" pathLength="1"/>
   <g class="route-stations">${stationDistances.map((distance,index)=>{const p=routePoint(distance);return `<g data-route-station="${index}" transform="translate(${p.x} ${p.y})"><circle r="8"/><path d="M-17 0H-11M11 0H17M0-17V-11M0 11V17"/></g>`;}).join('')}</g>
   <circle class="route-arrival-light" r="58"/>
   <circle class="route-marker-halo" r="17"/>
   <circle class="route-marker" r="4.4"/>
  </g>`;
  container.replaceChildren(this.svg);
  this.world=this.svg.querySelector('[data-route-world]');
  this.travelled=[...this.svg.querySelectorAll('.route-travelled')];
  this.marker=[...this.svg.querySelectorAll('.route-marker,.route-marker-halo,.route-arrival-light')];
  this.stations=[...this.svg.querySelectorAll('[data-route-station]')];
 }
 render(cam,width,height,progress,end){
  const state=journeyPathState(cam,progress,end),scale=cam.s;
  this.state=state;
  this.svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  this.world.setAttribute('transform',`translate(${width/2} ${height/2}) scale(${scale}) translate(${-cam.x} ${-cam.y})`);
  this.travelled.forEach(path=>path.setAttribute('stroke-dasharray',`${state.routeProgress} ${1-state.routeProgress}`));
  this.marker.forEach(node=>{node.setAttribute('cx',state.x);node.setAttribute('cy',state.y);});
  this.svg.style.setProperty('--route-scale',scale);
  this.svg.style.setProperty('--arrival-light',state.arrival);
  this.svg.dataset.phase=cam.type;
  this.stations.forEach((node,index)=>{
   const passed=state.routeProgress>=stationDistances[index]-.0001;
   node.toggleAttribute('data-passed',passed);
   node.toggleAttribute('data-current',cam.type==='arrival'&&cam.project===index);
  });
 }
}
