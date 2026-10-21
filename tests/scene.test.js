import test from 'node:test';
import assert from 'node:assert/strict';
import {scenePose} from '../vector-scene.js';
import {camera,story,END,routeDistances,stationDistances} from '../geometry.js';
import {projects} from '../projects.js';
test('new stops follow the original three projects on the remaining original curve',()=>{
 assert.deepEqual(projects.map(p=>p.id),['connect','balance','frame','objects','relay']);
 assert.deepEqual(stationDistances.slice(0,3),[routeDistances[0],routeDistances[2],routeDistances[5]]);
 assert.ok(stationDistances[3]>routeDistances[5]&&stationDistances[4]<routeDistances[6]);
});
test('artwork never jumps when travel becomes arrival or arrival becomes departure',()=>{
 for(const [w,h]of[[1440,1000],[1280,720],[1920,1080]])for(const part of story.filter(p=>p.type==='arrival'))for(const boundary of[part.start,part.end]){
  const a=scenePose(part.project,camera(boundary-1e-7,w,h),w,h),b=scenePose(part.project,camera(boundary,w,h),w,h);
  assert.ok(a.visible&&b.visible);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.001);assert.ok(Math.abs(a.s-b.s)<.00001);assert.ok(Math.abs(a.a-b.a)<.00001);assert.ok(Math.abs(a.opacity-b.opacity)<.00001);
 }
});
test('visible art remains finite throughout the forward and reverse itinerary',()=>{
 for(let progress=0;progress<END;progress+=.05)for(let i=0;i<projects.length;i++){
  const pose=scenePose(i,camera(progress,1440,1000),1440,1000);
  for(const key of['x','y','s','a','opacity'])assert.ok(Number.isFinite(pose[key]));
  assert.ok(pose.s>0&&pose.s<3);assert.ok(pose.opacity>=0&&pose.opacity<=1);
 }
});
test('scrolling toward and through each project continues to enlarge its artwork',()=>{
 for(const part of story.filter(p=>p.type==='journey'||p.type==='arrival')){
  const a=scenePose(part.project,camera(part.start+(part.end-part.start)*.15,1440,1000),1440,1000),b=scenePose(part.project,camera(part.start+(part.end-part.start)*.85,1440,1000),1440,1000);
  assert.ok(b.s>a.s);
 }
});
