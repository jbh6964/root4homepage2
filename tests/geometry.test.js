import test from 'node:test';
import assert from 'node:assert/strict';
import {camera,frames,END,story,storyAt,rad,normalizeWheel} from '../geometry.js';
function screen(p,cam,w,h){const r=rad(cam.a),x=p.x-cam.x,y=p.y-cam.y;return{x:w/2+cam.s*(x*Math.cos(r)-y*Math.sin(r)),y:h/2+cam.s*(x*Math.sin(r)+y*Math.cos(r))};}
test('all project and world boundaries preserve the composition on each viewport',()=>{for(const[w,h]of[[1440,900],[900,1200],[1920,1080]])for(const part of story.filter(p=>p.type!=='detail')){const before=camera(part.end-1e-9,w,h),after=camera(part.end,w,h),f=frames[part.scene],s=f.w/780,r=rad(f.a);for(const q of[{x:0,y:0},{x:390,y:260},{x:780,y:520}]){const parent={x:f.x+s*(q.x*Math.cos(r)-q.y*Math.sin(r)),y:f.y+s*(q.x*Math.sin(r)+q.y*Math.cos(r))};const a=screen(parent,before,w,h),b=screen(q,after,w,h);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.001,`project ${part.project}`);}}});
test('case study exit joins the next zoom without moving the camera',()=>{for(const part of story.filter(p=>p.type==='detail'&&p.end<END)){const a=camera(part.end-1e-9,1440,900),b=camera(part.end,1440,900);for(const key of['x','y','s','a','segment'])assert.ok(Math.abs(a[key]-b[key])<.00001,key);}});
test('three projects each have a four-unit narrative with independent parallax progress',()=>{for(let i=0;i<3;i++){const part=story.find(p=>p.project===i&&p.type==='detail');assert.equal(part.end-part.start,4);assert.equal(storyAt((part.end+part.start)/2).type,'detail');assert.ok(Math.abs(storyAt((part.end+part.start)/2).t-.5)<1e-9);}});
test('deep forward/reverse path remains finite and locally bounded',()=>{for(let i=0;i<=Math.round(END*100);i++){for(const p of[i/100,END-i/100]){const cam=camera(p,1440,900);for(const key of['x','y','s','a'])assert.ok(Number.isFinite(cam[key]));assert.ok(cam.s>0&&cam.s<1500);}}});
test('wheel/trackpad units normalize consistently, with bounded impulses',()=>{assert.equal(normalizeWheel({deltaY:3,deltaMode:1},900),normalizeWheel({deltaY:48,deltaMode:0},900));assert.equal(normalizeWheel({deltaY:9000,deltaMode:0},900),.14);assert.ok(normalizeWheel({deltaY:-40,deltaMode:0},900)<0);});

test('inter-world zoom keeps the viewport inside the illustrated space',()=>{
 for(const [w,h] of [[1440,900],[950,760],[1920,1080]])for(const part of story.filter(p=>p.type!=='detail'&&p.scene>0))for(let step=0;step<100;step++){
  const cam=camera(part.start+(part.end-part.start)*step/100,w,h);
  for(const [sx,sy] of [[0,0],[w,0],[0,h],[w,h]]){
   const r=rad(-cam.a),dx=(sx-w/2)/cam.s,dy=(sy-h/2)/cam.s;
   const x=cam.x+dx*Math.cos(r)-dy*Math.sin(r),y=cam.y+dx*Math.sin(r)+dy*Math.cos(r);
   assert.ok(x>=0&&x<=780&&y>=0&&y<=520,`outside artwork at ${part.project}/${step}: ${x},${y}`);
  }
 }
});
