import test from 'node:test';
import assert from 'node:assert/strict';
import {projects} from '../projects.js';
import {story,END,arrivalProgress,arrivalOpacity,projectVisibility,storyAt,camera} from '../geometry.js';
test('three digital service examples have explicit scope and complete project detail',()=>{
 assert.equal(projects.length,3);
 for(const p of projects){assert.equal(p.sample,true);assert.ok(p.challenge&&p.overview&&p.result);assert.ok(p.scope.length>=3);assert.ok(p.decisions.length>=3);}
});
test('departure hides all projects and reveals them in journey order',()=>{
 assert.deepEqual(projects.map((_,i)=>projectVisibility(0,i)),[0,0,0]);
 for(let i=0;i<projects.length;i++){
  const p=arrivalProgress(i);assert.equal(projectVisibility(p,i),1);
  for(let next=i+1;next<projects.length;next++)assert.equal(projectVisibility(p,next),0);
 }
});
test('arrival shortcuts land in fully readable four-unit intervals',()=>{
 const arrivals=story.filter(p=>p.type==='arrival');assert.equal(arrivals.length,3);
 for(const p of arrivals){assert.equal(storyAt(arrivalProgress(p.project)).type,'arrival');assert.equal(arrivalOpacity(arrivalProgress(p.project)),1);assert.ok(p.end-p.start>=3.99);for(let t=.01;t<.99;t+=.05)assert.equal(arrivalOpacity(p.start+(p.end-p.start)*t),1);}
});
test('arrival camera slows down while continuing forward',()=>{
 for(const p of story.filter(p=>p.type==='arrival')){
  const journey=story.find(j=>j.type==='journey'&&j.project===p.project),speed=(p.to-p.from)/(p.end-p.start),travelSpeed=(journey.to-journey.from)/(journey.end-journey.start);
  assert.ok(speed<travelSpeed*.25);assert.ok(camera(p.end-.001,1440,1000).routeDistance>camera(p.start+.001,1440,1000).routeDistance);
 }
});
test('summaries reappear at the same progress in reverse and disappear in transit',()=>{
 const progress=Array.from({length:300},(_,i)=>i/299*END),forward=progress.map(p=>arrivalOpacity(p)),backward=progress.toReversed().map(p=>arrivalOpacity(p)).reverse();assert.deepEqual(forward,backward);
 for(const p of story.filter(p=>p.type!=='arrival'))assert.equal(arrivalOpacity((p.start+p.end)/2),0);
});
