import {ArrivalSequence} from './arrival-sequence.js';
import {balanceData,won} from './balance-art.js';
import {clamp,smooth,story} from './geometry.js';

// Local arrival direction, intentionally independent of camera/render easing.
export class BalanceInteraction {
 constructor(scene,arrival,controls){
  this.scene=scene;this.arrival=arrival;this.controls=controls;this.clock=new ArrivalSequence();this.raf=0;this.active=false;this.paused=false;
  this.static=matchMedia('(prefers-reduced-motion:reduce), (hover:none), (pointer:coarse)');
  controls.innerHTML=`<div class="balance-chart-legend"><span>자산 구성 <small>금액 예시</small></span>${balanceData.assets.map((asset,i)=>`<button data-asset="${i}" aria-describedby="balance-chart-value"><i style="--asset-color:${asset.color}"></i>${asset.name} <b>${asset.share}%</b></button>`).join('')}</div><p id="balance-chart-value" role="status">항목을 선택하면 예시 금액을 확인할 수 있습니다.</p><div id="balance-tooltip" role="tooltip" hidden></div>`;
  controls.querySelectorAll('[data-asset]').forEach(button=>{
   const show=()=>this.inspect({kind:'asset',index:Number(button.dataset.asset)});
   button.addEventListener('pointerenter',show);button.addEventListener('focus',show);button.addEventListener('click',show);
   button.addEventListener('pointerleave',()=>{if(document.activeElement!==button)this.inspect(null);});button.addEventListener('blur',()=>this.inspect(null));
  });
  scene.svg.addEventListener('balance-inspect',e=>this.inspect(e.detail));
  this.static.addEventListener('change',()=>this.update(this.progress,this.part,this.paused));
 }
 update(progress,part,paused){
  this.progress=progress;this.part=part;this.active=part.type==='arrival'&&part.project===1;this.paused=paused;
  const segment=story.find(p=>p.type==='arrival'&&p.project===1),presence=smooth(clamp((progress-segment.start+1.8)/1.8))*(1-smooth(clamp((progress-segment.end)/1.5)));
  const fallback=matchMedia('(max-width:780px), (prefers-reduced-motion:reduce), (hover:none) and (pointer:coarse)').matches;
  document.body.style.setProperty('--balance-presence',fallback?0:presence);
  document.body.classList.toggle('balance-light',presence>.55&&!fallback);
  this.arrival.classList.toggle('balance-summary',this.active);
  this.controls.hidden=!this.active||fallback;this.controls.inert=!this.active||paused;
  if(!this.active)this.inspect(null);
  this.advance(performance.now());
 }
 advance(now){
  cancelAnimationFrame(this.raf);this.raf=0;
  const value=this.clock.update({active:this.active,now,paused:this.paused,staticMode:this.static.matches||document.body.classList.contains('motion-off')});
  this.scene.setBalanceReveal(value);
  this.arrival.style.setProperty('--arrival-reveal',value);
  this.controls.style.setProperty('--arrival-reveal',value);
  this.controls.inert=!this.active||this.paused||value<.68;
  const scope=this.arrival.querySelector('.balance-scope');if(scope)scope.inert=this.paused||value<.6;
  if(this.active&&value<1&&!this.paused)this.raf=requestAnimationFrame(time=>this.advance(time));
 }
 inspect(item){
  if(!this.active||this.paused)item=null;
  const value=document.getElementById('balance-chart-value');
  if(item?.kind==='asset'){const asset=balanceData.assets[item.index];value.textContent=`${asset.name}　${won(asset.amount)}원 · 전체 자산의 ${asset.share}%`;}else if(item?.kind==='month'){value.textContent=`${item.index+4}월 총 자산　${won(balanceData.months[item.index])}원 · 예시`;}else value.textContent='항목을 선택하면 예시 금액을 확인할 수 있습니다.';
  const tooltip=document.getElementById('balance-tooltip');tooltip.hidden=!item?.anchor;
  if(item?.anchor){tooltip.textContent=value.textContent;tooltip.style.left=Math.max(12,Math.min(innerWidth-280,item.anchor.x-80))+'px';tooltip.style.top=Math.max(100,item.anchor.y-58)+'px';}
  this.controls.toggleAttribute('data-inspecting',!!item);
  this.controls.querySelectorAll('[data-asset]').forEach((n,i)=>n.toggleAttribute('data-selected',item?.kind==='asset'&&item.index===i));
  this.scene.highlightBalance(item?.kind,item?.index);
 }
}
