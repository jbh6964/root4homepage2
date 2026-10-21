import test from 'node:test';
import assert from 'node:assert/strict';
import {camera,END,arrivalProgress,routePoint} from '../geometry.js';
import {journeyPathState,PROJECT_ROUTE_START} from '../journey-path.js';

test('route fill endpoint and locator always share the camera route position',()=>{
 for(let progress=0;progress<=END;progress+=.07){
  const cam=camera(progress,1440,1000),state=journeyPathState(cam,progress,END),point=routePoint(PROJECT_ROUTE_START+state.routeProgress*(1-PROJECT_ROUTE_START));
  assert.ok(Math.abs(state.x-point.x)<1e-9);
  assert.ok(Math.abs(state.y-point.y)<1e-9);
  const expected=Math.max(0,Math.min(1,(cam.routeDistance-PROJECT_ROUTE_START)/(1-PROJECT_ROUTE_START)));
  assert.ok(Math.abs(state.routeProgress-expected)<1e-9);
  assert.ok(Math.abs(state.routeDistance-cam.routeDistance)<1e-9);
  assert.ok(Math.abs(state.overallProgress-progress/END)<1e-9);
 }
});

test('the entire gauge stays hidden until the bright project space is revealed',()=>{
 const hidden=journeyPathState(camera(2.38,1440,1000),2.38,END,0);
 const emerging=journeyPathState(camera(2.8,1440,1000),2.8,END,.2);
 assert.equal(hidden.visibility,0);assert.equal(hidden.routeProgress,0);
 assert.equal(emerging.visibility,.2);assert.ok(emerging.routeProgress>0);
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
