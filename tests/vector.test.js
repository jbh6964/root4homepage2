import test from 'node:test';
import assert from 'node:assert/strict';
import {routePoint,routeCurves,stationDistances,routeDistances} from '../geometry.js';
test('arc-length traversal has consistent spatial speed through bends',()=>{const distances=[];for(let i=1;i<=1000;i++){const a=routePoint((i-1)/1000),b=routePoint(i/1000);distances.push(Math.hypot(a.x-b.x,a.y-b.y));}const min=Math.min(...distances),max=Math.max(...distances);assert.ok(max/min<1.03);});
test('every connected curve shares its endpoint and route order',()=>{for(let i=1;i<routeCurves.length;i++)assert.deepEqual(routeCurves[i][0],routeCurves[i-1][3]);assert.ok(stationDistances.every((d,i)=>i===0||d>stationDistances[i-1]));assert.equal(routeDistances.at(-1),1);});

test('the route turns continuously at each project point',()=>{for(let i=1;i<routeCurves.length;i++){const before=routeCurves[i-1],after=routeCurves[i],a=[before[3][0]-before[2][0],before[3][1]-before[2][1]],b=[after[1][0]-after[0][0],after[1][1]-after[0][1]];const cross=Math.abs(a[0]*b[1]-a[1]*b[0])/(Math.hypot(...a)*Math.hypot(...b));assert.ok(cross<1e-8);}});
