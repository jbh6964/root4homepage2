export const rad=value=>value*Math.PI/180;
export const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
export const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};
export const routeCurves=[
 [[180,980],[60,650],[350,360],[620,500]],
 [[620,500],[1010,702.2222222222],[820,1110],[1270,820]],
 [[1270,820],[1590,613.7777777778],[1510,170],[1880,410]],
 [[1880,410],[2160,591.6216216216],[2120,1040],[2320,810]]
];
export const routePath='M'+routeCurves[0][0].join(' ')+routeCurves.map(c=>'C'+c.slice(1).flat().join(' ')).join('');
function cubic(c,t){const u=1-t;return{x:u*u*u*c[0][0]+3*u*u*t*c[1][0]+3*u*t*t*c[2][0]+t*t*t*c[3][0],y:u*u*u*c[0][1]+3*u*u*t*c[1][1]+3*u*t*t*c[2][1]+t*t*t*c[3][1]};}
const samples=[{...cubic(routeCurves[0],0),distance:0}];
export const stationDistances=[];
for(const curve of routeCurves){for(let i=1;i<=160;i++){const p=cubic(curve,i/160),last=samples.at(-1);samples.push({...p,distance:last.distance+Math.hypot(p.x-last.x,p.y-last.y)});}stationDistances.push(samples.at(-1).distance);}
export const routeLength=samples.at(-1).distance;
stationDistances.forEach((distance,index)=>stationDistances[index]=distance/routeLength);
export function routePoint(progress){const distance=clamp(progress)*routeLength;let low=0,high=samples.length-1;while(low<high){const mid=(low+high)>>1;if(samples[mid].distance<distance)low=mid+1;else high=mid;}const b=samples[low],a=samples[Math.max(0,low-1)],t=(distance-a.distance)/(b.distance-a.distance||1);return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
export const projectStations=routeCurves.slice(0,3).map((curve,index)=>({project:index,x:curve[3][0],y:curve[3][1],distance:stationDistances[index],name:['FORM / OTHER','mori','OFFBEAT'][index],category:['IDENTITY / ART DIRECTION','BRAND / PACKAGING','DIGITAL / INTERACTION'][index]}));
const [a,b,c]=stationDistances;
export const story=[
 {start:0,end:1.6,type:'overview',project:0,from:0,to:.035,zoomFrom:1,zoomTo:1.5},
 {start:1.6,end:3.8,type:'journey',project:0,from:.035,to:a-.018,zoomFrom:1.5,zoomTo:4.4},
 {start:3.8,end:7.8,type:'detail',project:0,from:a-.018,to:a+.025,zoomFrom:4.4,zoomTo:4.75},
 {start:7.8,end:11.2,type:'journey',project:1,from:a+.025,to:b-.018,zoomFrom:4.75,zoomTo:5.1},
 {start:11.2,end:15.2,type:'detail',project:1,from:b-.018,to:b+.025,zoomFrom:5.1,zoomTo:5.45},
 {start:15.2,end:18.6,type:'journey',project:2,from:b+.025,to:c-.018,zoomFrom:5.45,zoomTo:5.8},
 {start:18.6,end:22.6,type:'detail',project:2,from:c-.018,to:c+.025,zoomFrom:5.8,zoomTo:6.15},
 {start:22.6,end:24.6,type:'outro',project:2,from:c+.025,to:1,zoomFrom:6.15,zoomTo:6.6}
];
export const END=story.at(-1).end;
export const stops=[0,...story.map(part=>part.end)];
export function storyAt(progress){const p=clamp(progress,0,END),part=story.find(part=>p<part.end)||story.at(-1);return{...part,t:clamp((p-part.start)/(part.end-part.start))};}
function tangent(points,index,key){const a=points[Math.max(0,index-1)],b=points[index],c=points[Math.min(points.length-1,index+1)];if(index===0)return(c[key]-b[key])/(c.time-b.time);if(index===points.length-1)return(b[key]-a[key])/(b.time-a.time);const left=(b[key]-a[key])/(b.time-a.time),right=(c[key]-b[key])/(c.time-b.time);return left*right<=0?0:2*left*right/(left+right);}
function hermite(a,b,ma,mb,t,duration){const t2=t*t,t3=t2*t;return(2*t3-3*t2+1)*a+(t3-2*t2+t)*duration*ma+(-2*t3+3*t2)*b+(t3-t2)*duration*mb;}
const timing=[{time:0,d:0,z:0},...story.map(part=>({time:part.end,d:part.to,z:Math.log(part.zoomTo)}))];
export function camera(progress,width,height){const p=clamp(progress,0,END),part=storyAt(p),index=story.findIndex(item=>item.start===part.start),a=timing[index],b=timing[index+1],duration=b.time-a.time;const sample=key=>hermite(a[key],b[key],tangent(timing,index,key),tangent(timing,index+1,key),part.t,duration);const distance=sample('d'),point=routePoint(distance),fit=Math.min(width/2630,Math.max(240,height-145)/1500);const reveal=part.type==='overview'?smooth(part.t):1;
 return{...part,segment:0,x:1200+(point.x-1200)*reveal,y:700+(point.y-700)*reveal,s:fit*Math.exp(sample('z')),a:0,routeDistance:distance};
}
export function normalizeWheel(event,height){const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?height:1);return Math.sign(delta)*Math.min(Math.abs(delta),140)/1000;}
