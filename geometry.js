import {projects} from './projects.js';
export const rad=value=>value*Math.PI/180;
export const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
export const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};
export const canvas={width:2700,height:1750,x:1300,y:850};
export const routeCurves=[
 [[130,830],[100,600],[300,600],[580,570]],
 [[580,570],[860,540],[1000,380],[1240,410]],
 [[1240,410],[1480,440],[1800,360],[2090,540]],
 [[2090,540],[2380,720],[2420,1130],[2100,1150]],
 [[2100,1150],[1780,1170],[1600,1480],[1300,1330]],
 [[1300,1330],[1000,1180],[820,1100],[590,1180]],
 [[590,1180],[360,1260],[150,1180],[215,1400]]
];
export const routePath='M'+routeCurves[0][0].join(' ')+routeCurves.map(c=>'C'+c.slice(1).flat().join(' ')).join('');
function cubic(c,t){const u=1-t;return{x:u*u*u*c[0][0]+3*u*u*t*c[1][0]+3*u*t*t*c[2][0]+t*t*t*c[3][0],y:u*u*u*c[0][1]+3*u*u*t*c[1][1]+3*u*t*t*c[2][1]+t*t*t*c[3][1]};}
const samples=[{...cubic(routeCurves[0],0),distance:0}];
export const routeDistances=[];
for(const curve of routeCurves){for(let i=1;i<=160;i++){const p=cubic(curve,i/160),last=samples.at(-1);samples.push({...p,distance:last.distance+Math.hypot(p.x-last.x,p.y-last.y)});}routeDistances.push(samples.at(-1).distance);}
export const routeLength=samples.at(-1).distance;
routeDistances.forEach((distance,index)=>routeDistances[index]=distance/routeLength);
export const stationDistances=projects.map(p=>p.routePosition??routeDistances[p.routeIndex]);
export function routePoint(progress){const distance=clamp(progress)*routeLength;let low=0,high=samples.length-1;while(low<high){const mid=(low+high)>>1;if(samples[mid].distance<distance)low=mid+1;else high=mid;}const b=samples[low],a=samples[Math.max(0,low-1)],t=(distance-a.distance)/(b.distance-a.distance||1);return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
export const projectStations=projects.map((project,index)=>({project:index,...routePoint(stationDistances[index]),distance:stationDistances[index],name:project.name,category:project.category}));
export const story=[{start:0,end:1.15,type:'intro',project:0,from:0,to:.025,zoomFrom:1,zoomTo:1.5}];
let time=1.15,from=.025,zoom=1.5;
projects.forEach((_,index)=>{
 const arrival=stationDistances[index]-(index<3?.012:.003),nextZoom=4.4+index*.35,duration=index===0?2.2:index===1?3.8:index===2?5.4:2.4;
 story.push({start:time,end:time+duration,type:'journey',project:index,from,to:arrival,zoomFrom:zoom,zoomTo:nextZoom});time+=duration;
 const departure=stationDistances[index]+(index<3?.016:.003);
 story.push({start:time,end:time+4,type:'arrival',project:index,from:arrival,to:departure,zoomFrom:nextZoom,zoomTo:nextZoom+.22});time+=4;from=departure;zoom=nextZoom+.22;
});
story.push({start:time,end:time+2,type:'outro',project:projects.length-1,from,to:1,zoomFrom:zoom,zoomTo:zoom+.25});
export const END=story.at(-1).end;
export const stops=[0,...story.map(part=>part.end)];
export function storyAt(progress){const p=clamp(progress,0,END),part=story.find(part=>p<part.end)||story.at(-1);return{...part,t:clamp((p-part.start)/(part.end-part.start))};}
function tangent(points,index,key){const a=points[Math.max(0,index-1)],b=points[index],c=points[Math.min(points.length-1,index+1)];if(index===0)return(c[key]-b[key])/(c.time-b.time);if(index===points.length-1)return(b[key]-a[key])/(b.time-a.time);const left=(b[key]-a[key])/(b.time-a.time),right=(c[key]-b[key])/(c.time-b.time);return left*right<=0?0:2*left*right/(left+right);}
function hermite(a,b,ma,mb,t,duration){const t2=t*t,t3=t2*t;return(2*t3-3*t2+1)*a+(t3-2*t2+t)*duration*ma+(-2*t3+3*t2)*b+(t3-t2)*duration*mb;}
const timing=[{time:0,d:0,z:0},...story.map(part=>({time:part.end,d:part.to,z:Math.log(part.zoomTo)}))];
export function camera(progress,width,height){const p=clamp(progress,0,END),part=storyAt(p),index=story.findIndex(item=>item.start===part.start),a=timing[index],b=timing[index+1],duration=b.time-a.time;const sample=key=>hermite(a[key],b[key],tangent(timing,index,key),tangent(timing,index+1,key),part.t,duration);const distance=sample('d'),point=routePoint(distance),fit=Math.min(width/2900,Math.max(240,height-145)/1900);const reveal=part.type==='intro'?smooth(part.t):1,zoom=Math.exp(sample('z'));
 return{...part,segment:0,x:canvas.x+(point.x-canvas.x)*reveal,y:canvas.y+(point.y-canvas.y)*reveal,s:fit*zoom,zoom,a:0,routeDistance:distance};
}
export function normalizeWheel(event,height){const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?height:1);return Math.sign(delta)*Math.min(Math.abs(delta),140)/1000;}

// Arrival shortcuts land inside the readable region, with no timed pause.
export function arrivalProgress(index){const p=story.find(p=>p.type==='arrival'&&p.project===index);return p?p.start+(p.end-p.start)*.42:0;}
export function projectVisibility(progress,index){
 const journey=story.find(p=>p.type==='journey'&&p.project===index),arrival=story.find(p=>p.type==='arrival'&&p.project===index);
 const hintStart=index===0?.38:journey.start-1.1;
 if(progress<=hintStart)return 0;
 if(progress<journey.start)return .16*smooth((progress-hintStart)/(journey.start-hintStart));
 if(progress<arrival.start)return .16+.84*smooth((progress-journey.start)/(arrival.start-journey.start)*1.3);
 return progress<=arrival.end?1:1-.68*smooth((progress-arrival.end)/1.8);
}
export function arrivalOpacity(progress){const p=storyAt(progress);return p.type==='arrival'?1:0;}
