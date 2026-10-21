import test from 'node:test';
import assert from 'node:assert/strict';
import {entranceState} from '../entrance-scene.js';
import {scenePose} from '../vector-scene.js';
import {camera,story} from '../geometry.js';

const intro=story[0],travel=story[1],arrival=story[2];
const state=p=>entranceState(camera(p,1440,1000));
test('entrance hides all project layers through intro and early forward travel',()=>{
 for(let p=0;p<=travel.start+(travel.end-travel.start)*.28;p+=.025){
  assert.equal(state(p).projectReveal,0);
  for(let i=0;i<5;i++)assert.equal(scenePose(i,camera(p,1440,1000),1440,1000).visible,false);
 }
 assert.equal(state(intro.end*.8).textOpacity,0);
 assert.equal(state(0).textOpacity,1);
});
test('entry projection and handoff remain continuous without an empty frame',()=>{
 const before=state(intro.end-1e-8),after=state(intro.end);
 assert.ok(Math.abs(before.depth-after.depth)<1e-6);
 for(let p=0;p<=arrival.start;p+=.01){
  const a=state(p),b=state(p+.000001);
  assert.ok(a.graphicOpacity>0||a.projectReveal===1);
  assert.ok(Math.abs(a.depth-b.depth)<.0001);
  assert.ok(Math.abs(a.graphicOpacity-b.graphicOpacity)<.0001);
  assert.ok(Math.abs(a.projectReveal-b.projectReveal)<.0001);
 }
 assert.equal(state(arrival.start).graphicOpacity,0);
 assert.equal(state(arrival.start).projectReveal,1);
});
test('scroll depth and visibility restore deterministically on reverse travel',()=>{
 const points=Array.from({length:200},(_,i)=>i/199*arrival.start);
 assert.deepEqual(points.map(state),points.toReversed().map(state).reverse());
 let previous=-1;
 for(const p of points){const s=state(p);assert.ok(s.depth>=previous);previous=s.depth;for(const key of['progress','graphicOpacity','projectReveal','textOpacity'])assert.ok(s[key]>=0&&s[key]<=1);}
});
test('later projects and the contact ending are outside the entrance layer',()=>{
 for(const part of story.slice(2)){
  const s=state((part.start+part.end)/2);
  assert.equal(s.graphicOpacity,0);assert.equal(s.textOpacity,0);assert.equal(s.projectReveal,1);
 }
});
