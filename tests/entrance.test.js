import test from 'node:test';
import assert from 'node:assert/strict';
import {entranceState,fieldLight} from '../entrance-scene.js';
import {scenePose,captionOpacity} from '../vector-scene.js';
import {projectObject} from '../project-art.js';
import {camera,story,END} from '../geometry.js';

const intro=story[0],travel=story[1],arrival=story[2];
const state=p=>entranceState(camera(p,1440,1000));
test('entrance hides every project through intro and the early approach',()=>{
 for(let p=0;p<=travel.start+(travel.end-travel.start)*.28;p+=.025){
  assert.equal(state(p).projectReveal,0);
  for(let i=0;i<5;i++)assert.equal(scenePose(i,camera(p,1440,1000),1440,1000).visible,false);
 }
 assert.equal(state(intro.end*.8).textOpacity,0);assert.equal(state(0).textOpacity,1);
});
test('one background depth advances across the complete itinerary including reading intervals',()=>{
 let previous=-1;
 for(let p=0;p<=END;p+=.025){
  const s=state(p);assert.equal(s.graphicOpacity,1);assert.ok(s.depth>previous);previous=s.depth;
  assert.ok(s.progress>=0&&s.progress<=1);assert.ok(Number.isFinite(s.focusX)&&Number.isFinite(s.focusY));
 }
 for(const part of story.filter(s=>s.type==='arrival'))assert.ok(state(part.end).depth>state(part.start).depth+10);
});
test('field position, direction, speed and light do not reset at scene boundaries',()=>{
 for(const boundary of story.slice(1).map(s=>s.start)){
  const a=state(boundary-1e-6),b=state(boundary),c=state(boundary+1e-6);
  assert.ok(Math.abs(a.depth-b.depth)<.00001);
  assert.ok(Math.abs((b.depth-a.depth)-(c.depth-b.depth))<1e-8);
  for(const key of['focusX','focusY'])assert.ok(Math.abs(a[key]-b[key])<.000001);
  const lightA=fieldLight(boundary-1e-6),lightB=fieldLight(boundary);
  lightA.forEach((v,i)=>assert.ok(Math.abs(v-lightB[i])<.0001));
 }
});
test('the field and project placement restore exactly along the reverse itinerary',()=>{
 const points=Array.from({length:300},(_,i)=>i/299*END);
 assert.deepEqual(points.map(state),points.toReversed().map(state).reverse());
 const scenes=p=>Array.from({length:5},(_,i)=>scenePose(i,camera(p,1440,1000),1440,1000));
 assert.deepEqual(points.map(scenes),points.toReversed().map(scenes).reverse());
});
test('every project arrives from a much smaller scale and exits by translation before fading',()=>{
 for(const part of story.filter(s=>s.type==='journey')){
  const sample=t=>scenePose(part.project,camera(part.start+(part.end-part.start)*t,1440,1000),1440,1000);
  assert.ok(sample(.32).s<sample(.96).s*.6);
  const exit=story.find(s=>(s.type==='journey'&&s.project===part.project+1)||(s.type==='outro'&&s.project===part.project));
  const a=scenePose(part.project,camera(exit.start,1440,1000),1440,1000),b=scenePose(part.project,camera(exit.start+(exit.end-exit.start)*.3,1440,1000),1440,1000);
  assert.ok(Math.abs(b.x-a.x)>1440*.8);assert.ok(b.s>a.s);assert.ok(b.opacity>.5);
 }
});
test('captions fade within their fixed reading interval while project art has no fluid objects',()=>{
 for(const part of story.filter(s=>s.type==='arrival')){
  const sample=t=>captionOpacity(camera(part.start+(part.end-part.start)*t,1440,1000));
  assert.equal(sample(0),0);assert.equal(sample(.4),1);assert.ok(sample(.99)<.02);
 }
 for(let i=0;i<5;i++)assert.doesNotMatch(projectObject(i,'test-'+i),/studio-fluid|balance-ribbon|data-balance-layer="ribbon"|data-balance-highlight/);
});
