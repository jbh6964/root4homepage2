import test from 'node:test';
import assert from 'node:assert/strict';
import {camera,END,arrivalProgress,routePoint} from '../geometry.js';
import {journeyPathState} from '../journey-path.js';

test('route fill endpoint and locator always share the camera route position',()=>{
 for(let progress=0;progress<=END;progress+=.07){
  const cam=camera(progress,1440,1000),state=journeyPathState(cam,progress,END),point=routePoint(state.routeProgress);
  assert.ok(Math.abs(state.x-point.x)<1e-9);
  assert.ok(Math.abs(state.y-point.y)<1e-9);
  assert.ok(Math.abs(state.routeProgress-cam.routeDistance)<1e-9);
  assert.ok(Math.abs(state.overallProgress-progress/END)<1e-9);
 }
});

test('route fill and locator return to the same position in reverse',()=>{
 const values=[0,.45,arrivalProgress(0),arrivalProgress(2),arrivalProgress(4),END];
 const forward=values.map(progress=>journeyPathState(camera(progress,1280,900),progress,END));
 const reverse=[...values].reverse().map(progress=>journeyPathState(camera(progress,1280,900),progress,END)).reverse();
 assert.deepEqual(reverse,forward);
});

test('arrival light expands only while a project is being read',()=>{
 const arrival=arrivalProgress(1),at=journeyPathState(camera(arrival,1280,900),arrival,END);
 const travel=journeyPathState(camera(1.8,1280,900),1.8,END);
 assert.ok(at.arrival>.9);
 assert.equal(travel.arrival,0);
});
