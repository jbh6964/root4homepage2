export const rad = value => value * Math.PI / 180;
export const clamp = (value,min=0,max=1) => Math.max(min,Math.min(max,value));
export const smooth = value => {const t=clamp(value);return t*t*(3-2*t);};
// These are numerical origins only. No panels, windows or target markers are drawn.
export const frames=[
 {x:430,y:270,w:780,h:520,a:-6},
 {x:360,y:260,w:240,h:160,a:0},
 {x:160,y:150,w:180,h:120,a:0},
 {x:440,y:220,w:140,h:140*2/3,a:0},
 {x:200,y:250,w:180,h:120,a:0},
 {x:360,y:120,w:150,h:100,a:0},
 {x:210,y:280,w:160,h:160*2/3,a:0}
];
export const sceneNames=['FORM / OTHER','PAPER / GRAIN','INK / FREQUENCY','mori','IMPRINT / LIGHT','TYPE / MATTER','OFFBEAT'];
export const story=[
 {start:0,end:1.2,type:'zoom',project:0,scene:0},
 {start:1.2,end:5.2,type:'detail',project:0,scene:0},
 {start:5.2,end:6.8,type:'journey',project:0,scene:1},
 {start:6.8,end:8.4,type:'journey',project:0,scene:2},
 {start:8.4,end:10.2,type:'zoom',project:1,scene:3},
 {start:10.2,end:14.2,type:'detail',project:1,scene:3},
 {start:14.2,end:15.8,type:'journey',project:1,scene:4},
 {start:15.8,end:17.4,type:'journey',project:1,scene:5},
 {start:17.4,end:19.2,type:'zoom',project:2,scene:6},
 {start:19.2,end:23.2,type:'detail',project:2,scene:6}
];
export const END=story.at(-1).end;
export const stops=[0,...story.map(part=>part.end)];
export function storyAt(progress){const p=clamp(progress,0,END),part=story.find(part=>p<part.end)||story.at(-1);return{...part,t:clamp((p-part.start)/(part.end-part.start))};}
export function center(f){const r=rad(f.a);return{x:f.x+Math.cos(r)*f.w/2-Math.sin(r)*f.h/2,y:f.y+Math.sin(r)*f.w/2+Math.cos(r)*f.h/2};}
export function compose(parent,child){const r=rad(parent.a),s=parent.w/780;return{x:parent.x+s*(Math.cos(r)*child.x-Math.sin(r)*child.y),y:parent.y+s*(Math.sin(r)*child.x+Math.cos(r)*child.y),w:child.w*s,h:child.h*s,a:parent.a+child.a};}
export const rootFrame={x:0,y:0,w:780,h:520,a:0};
export const worldFrames=frames.reduce((all,frame)=>[...all,compose(all.at(-1)||rootFrame,frame)],[]);
export function relativeFrame(frame,base){const r=rad(-base.a),s=base.w/780,dx=frame.x-base.x,dy=frame.y-base.y;return{x:(dx*Math.cos(r)-dy*Math.sin(r))/s,y:(dx*Math.sin(r)+dy*Math.cos(r))/s,s:frame.w/base.w,a:frame.a-base.a};}
function worldPoint(frame,x,y){const r=rad(frame.a),s=frame.w/780;return{x:frame.x+s*(x*Math.cos(r)-y*Math.sin(r)),y:frame.y+s*(x*Math.sin(r)+y*Math.cos(r))};}
function waypoints(width,height){const cover=Math.max(width/780,height/520)*1.04;return[{time:0,x:800,y:500,z:Math.log(Math.min(width/1600,height/1000))},...story.map((part,index)=>{const f=worldFrames[part.scene],detail=part.type==='detail';const point=worldPoint(f,detail?454:340+(index%2?27:-18),detail?302:242+(index%2?19:-12));return{time:part.end,...point,z:Math.log(cover*(detail?1.52:1.35)*780/f.w)};})];}
function tangent(points,index,key){const a=points[Math.max(0,index-1)],b=points[index],c=points[Math.min(points.length-1,index+1)];if(index===0)return(c[key]-b[key])/(c.time-b.time);if(index===points.length-1)return(b[key]-a[key])/(b.time-a.time);const left=(b[key]-a[key])/(b.time-a.time),right=(c[key]-b[key])/(c.time-b.time);if(left*right<=0)return 0;return 2*left*right/(left+right);}
function hermite(a,b,ma,mb,t,duration){const t2=t*t,t3=t2*t;return(2*t3-3*t2+1)*a+(t3-2*t2+t)*duration*ma+(-2*t3+3*t2)*b+(t3-t2)*duration*mb;}
// One C1 flight curve spans reading and travel. Numerical origin changes do not
// lock the camera to a subject, stop velocity, replace art, or reset composition.
export function camera(progress,width,height){const p=clamp(progress,0,END),part=storyAt(p),points=waypoints(width,height),index=story.indexOf(story.find(item=>item.start===part.start)),a=points[index],b=points[index+1],duration=b.time-a.time,t=(p-a.time)/duration;
 const pose={};for(const key of['x','y','z'])pose[key]=hermite(a[key],b[key],tangent(points,index,key),tangent(points,index+1,key),t,duration);
 const segment=part.type==='detail'?part.scene+1:part.scene,base=segment===0?rootFrame:worldFrames[segment-1],r=rad(-base.a),scale=base.w/780,dx=pose.x-base.x,dy=pose.y-base.y;
 return{...part,segment,x:(dx*Math.cos(r)-dy*Math.sin(r))/scale,y:(dx*Math.sin(r)+dy*Math.cos(r))/scale,s:Math.exp(pose.z)*scale,a:base.a+Math.sin(p*.34)*2.2};
}
export function normalizeWheel(event,height){const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?height:1);return Math.sign(delta)*Math.min(Math.abs(delta),140)/1000;}
