import {ArrivalSequence} from './arrival-sequence.js';
import {projects} from './projects.js';
import {projectPalettes,plans,products,films} from './project-art.js';
import {balanceData,won} from './balance-art.js';
import {clamp,smooth} from './geometry.js';
const hex=value=>value.match(/\w\w/g).map(s=>parseInt(s,16));
const mixColor=(a,b,t)=>'#'+hex(a).map((v,i)=>Math.round(v+(hex(b)[i]-v)*t).toString(16).padStart(2,'0')).join('');
export class SceneDirection{
 constructor(scene,arrival,controls){this.scene=scene;this.arrival=arrival;this.controls=controls;this.clocks=projects.map(()=>new ArrivalSequence());this.choices=[1,0,0,0,0];this.index=-1;this.static=matchMedia('(prefers-reduced-motion:reduce), (hover:none), (pointer:coarse)');this.raf=0;
  controls.addEventListener('click',e=>{const button=e.target.closest('[data-choice]');if(button)this.choose(Number(button.dataset.choice));});
  controls.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key)||this.paused)return;const buttons=[...controls.querySelectorAll('[data-choice]')],current=buttons.indexOf(document.activeElement);if(current<0)return;e.preventDefault();e.stopPropagation();const next=(current+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].focus({preventScroll:true});this.choose(next);});
  controls.addEventListener('pointerover',e=>{const button=e.target.closest('[data-choice]');if(button&&this.index===1)this.inspect({kind:'asset',index:Number(button.dataset.choice)});});
  controls.addEventListener('focusin',e=>{const button=e.target.closest('[data-choice]');if(button&&this.index===1)this.inspect({kind:'asset',index:Number(button.dataset.choice)});});
  controls.addEventListener('pointerleave',()=>{if(this.index===1&&!controls.contains(document.activeElement))this.inspect(null);});
  scene.svg.addEventListener('scene-choice',e=>{if(e.detail.index===this.index)this.choose(e.detail.choice);});
  scene.svg.addEventListener('scene-inspect',e=>this.inspect(e.detail));
 }
 mount(index){this.index=index;const labels=index===0?plans.map(p=>p.name+' '+p.data+(p.data==='무제한'?'':'GB')):index===1?balanceData.assets.map(p=>p.name+' '+p.share+'%'):index===2?films.map(p=>p.name):index===3?products.map(p=>p.name):['보드 보기','타임라인 보기'];
  const title=['나에게 맞는 연결','자산 구성 · 금액 예시','콘텐츠 프리뷰','컬렉션 선택 · 가격 예시','업무의 관점'][index];
  this.controls.dataset.project=projects[index].id;this.controls.innerHTML=`<span class="control-label">${title}</span><div class="control-options">${labels.map((label,i)=>`<button data-choice="${i}" aria-pressed="${this.choices[index]===i}">${label}<span>↗</span></button>`).join('')}</div><p class="control-value" role="status">${index===1?'항목을 선택해 예시 금액을 확인하세요.':'선택하여 인터랙션을 살펴보세요.'}</p><div class="chart-tooltip" role="tooltip" hidden></div>`;
 }
 choose(choice){if(this.paused)return;this.choices[this.index]=choice;this.controls.querySelectorAll('[data-choice]').forEach((n,i)=>n.setAttribute('aria-pressed',i===choice));if(this.index===1)this.inspect({kind:'asset',index:choice});else{this.scene.select(this.index,choice);this.controls.querySelector('.control-value').textContent=this.index===0?plans[choice].name+' 요금제 · 월 '+plans[choice].price+'원 / 예시':this.index===2?films[choice].sub:this.index===3?products[choice].kr+' · '+products[choice].price+'원 / 예시':choice?'일정의 순서와 업무의 기한을 함께 확인합니다.':'업무의 상태와 담당을 한눈에 확인합니다.';}}
 inspect(item){if(this.index!==1||this.paused||!this.active)return;const value=this.controls.querySelector('.control-value');if(!value)return;let text='항목을 선택해 예시 금액을 확인하세요.';if(item?.kind==='asset'){const asset=balanceData.assets[item.index];text=`${asset.name}　${won(asset.amount)}원 · 전체 자산의 ${asset.share}%`;}else if(item?.kind==='month')text=`${item.index+4}월 자산　${won(balanceData.months[item.index])}원 · 예시`;value.textContent=text;const tooltip=this.controls.querySelector('.chart-tooltip');tooltip.hidden=!item?.x;if(item?.x){tooltip.textContent=text;tooltip.style.left=clamp(item.x-100,12,innerWidth-280)+'px';tooltip.style.top=Math.max(100,item.y-65)+'px';}this.scene.highlightBalance(item?.kind,item?.index);}
 update(progress,part,paused,fallback){this.progress=progress;this.part=part;this.paused=paused;this.active=part.type==='arrival';this.fallback=fallback;
  const index=part.project,current=projectPalettes[index],previous=index>0?projectPalettes[index-1]:['#071216','#f0ecdf','#75c8c3'];let bg,ink;
  if(part.type==='intro'){bg='#071216';ink='#f0ecdf';}else if(part.type==='outro'){bg=mixColor(current[0],'#c7d1ff',smooth(part.t*2));ink='#2033a9';}else{const blend=part.type==='arrival'?1:smooth(clamp(index===0?(part.t-.35)/.45:part.t*2.5));bg=mixColor(previous[0],current[0],blend);ink=blend>.5?current[1]:previous[1];}
  document.body.style.setProperty('--stage-bg',bg);document.body.style.setProperty('--stage-ink',ink);document.body.style.setProperty('--stage-accent',current[2]);document.body.dataset.scene=part.type==='intro'?'intro':part.type==='outro'?'contact':projects[index].id;document.body.dataset.phase=part.type;
  if(this.active&&this.index!==index)this.mount(index);this.controls.hidden=!this.active||fallback;if(!this.active&&this.index===1){this.scene.highlightBalance(null);this.controls.querySelector('.chart-tooltip')?.setAttribute('hidden','');}this.arrival.dataset.project=projects[index].id;
  this.advance(performance.now());
 }
 advance(now){cancelAnimationFrame(this.raf);this.raf=0;let running=false;
  this.clocks.forEach((clock,index)=>{const active=this.active&&this.part.project===index,value=clock.update({active,now,paused:this.paused,staticMode:this.static.matches||this.fallback||document.body.classList.contains('motion-off')});this.scene.setReveal(index,value);if(active){this.arrival.style.setProperty('--arrival-reveal',value);this.controls.style.setProperty('--arrival-reveal',value);this.controls.inert=this.paused||value<.68;const scope=this.arrival.querySelector('.arrival-scope');if(scope)scope.inert=this.paused||value<.6;if(value<1&&!this.paused)running=true;}});
  this.scene.positionLayers();
  if(running)this.raf=requestAnimationFrame(time=>this.advance(time));
 }
}
