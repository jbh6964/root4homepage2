import test from 'node:test';
import assert from 'node:assert/strict';
import {ArrivalSequence} from '../arrival-sequence.js';
import {balanceData} from '../balance-art.js';

test('example asset shares and amounts reconcile with the displayed total',()=>{
 assert.equal(balanceData.assets.reduce((sum,item)=>sum+item.amount,0),balanceData.total);
 assert.equal(balanceData.assets.reduce((sum,item)=>sum+item.share,0),100);
 for(const item of balanceData.assets)assert.equal(item.amount/balanceData.total*100,item.share);
 assert.equal(balanceData.months.at(-1),balanceData.total);
});
test('arrival resolves within 1.05 seconds and holds without moving the camera',()=>{
 const clock=new ArrivalSequence();
 assert.equal(clock.update({active:true,now:100}),0);
 assert.ok(clock.update({active:true,now:600})>0);
 assert.equal(clock.update({active:true,now:1150}),1);
 assert.equal(clock.update({active:true,now:6000}),1);
});
test('scrolling away interrupts the sequence and reverse entry restores the final state',()=>{
 const clock=new ArrivalSequence();clock.update({active:true,now:0});clock.update({active:true,now:80});
 assert.equal(clock.update({active:false,now:90}),1);
 for(let i=0;i<10;i++)assert.equal(clock.update({active:i%2===0,now:100+i}),1);
});
test('a panel pauses the local clock and closing it resumes from the same reveal',()=>{
 const clock=new ArrivalSequence();clock.update({active:true,now:0});const value=clock.update({active:true,now:300});
 assert.equal(clock.update({active:true,now:310,paused:true}),value);
 assert.equal(clock.update({active:true,now:9000,paused:true}),value);
 assert.equal(clock.update({active:true,now:9100}),value);
 assert.equal(clock.update({active:true,now:9850}),1);
});
test('touch and reduced motion resolve to the complete scene immediately',()=>{
 const clock=new ArrivalSequence();assert.equal(clock.update({active:true,now:0,staticMode:true}),1);
 assert.equal(clock.update({active:true,now:1}),1);
});
