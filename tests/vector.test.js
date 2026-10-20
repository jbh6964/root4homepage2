import test from 'node:test';
import assert from 'node:assert/strict';
import { contrastForWidth, pigment, projectedWidth, inkVisibility } from '../vector-scene.js';
import { camera, story, frames } from '../geometry.js';
test('print contrast emerges monotonically as a detail grows, without a reveal threshold jump',()=>{
  assert.equal(contrastForWidth(1),0);
  assert.equal(contrastForWidth(400),1);
  let previous=0;
  for(let width=1;width<=500;width+=.1){const current=contrastForWidth(width);assert.ok(current>=previous&&current-previous<.01);previous=current;}
});
test('scene rebasing preserves both projected detail size and pigment contrast',()=>{
  for(const[w,h]of[[1440,1000],[950,760],[1920,1080]])for(const boundary of story.filter(part=>part.type!=='detail'&&part.scene>0).map(part=>part.end)){
    const before=camera(boundary-1e-10,w,h),after=camera(boundary,w,h);
    for(let index=after.segment-1;index<frames.length;index++){
      const a=projectedWidth(index,before),b=projectedWidth(index,after);
      assert.ok(Math.abs(a-b)<.00001);
      assert.ok(Math.abs(contrastForWidth(a)-contrastForWidth(b))<.00001);
    }
  }
});
test('pigment grows from the material color to the authored color',()=>{
  assert.equal(pigment('#e9e4d9','#202923',0),'rgb(32,41,35)');
  assert.equal(pigment('#e9e4d9','#202923',1),'rgb(233,228,217)');
  for(let i=0;i<=100;i++)assert.match(pigment('#e9e4d9','#202923',i/100),/^rgb\(\d+,\d+,\d+\)$/);
});

test('material detail emerges and recedes continuously without an opacity threshold',()=>{let last=inkVisibility(1);for(let width=1;width<50000;width*=1.001){const current=inkVisibility(width);assert.ok(current>=0&&current<=1);assert.ok(Math.abs(current-last)<.002);last=current;}assert.ok(inkVisibility(500)>.9);assert.ok(inkVisibility(50000)<.01);});
