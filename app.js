import {projects,contact} from './projects.js';
import {projectVisual} from './project-art.js';
import {VectorScene} from './vector-scene.js';
import {SceneEffects} from './scene-effects.js';
import {END,story,storyAt,camera,normalizeWheel,clamp,arrivalProgress,arrivalOpacity} from './geometry.js';
const $=s=>document.querySelector(s),explorer=$('#explorer'),dialog=$('#panel'),arrival=$('#arrival-info');
const vectorScene=new VectorScene($('#scene'));
const effects=new SceneEffects($('#ambient-field'),vectorScene,explorer,arrival);
const fallback=matchMedia('(max-width:780px), (prefers-reduced-motion:reduce)');
let current=0,target=0,paused=false,raf=0,last=0,arrivalIndex=-1,opener=null,snapshot=null;
const digits=i=>String(i+1).padStart(2,'0');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function summary(index,heading='h2'){
 const p=projects[index];return `<span class="arrival-eyebrow">${digits(index)} / DIGITAL EXPERIENCE <i>구성 예시</i></span><${heading}>${p.name}</${heading}><p class="service-field">${p.category}</p><p class="project-promise">${p.title.replace('\n','<br>')}</p><dl class="arrival-facts"><div><dt>해결하려 한 과제</dt><dd>${p.challenge}</dd></div><div><dt>담당 범위 <small>구성 예시</small></dt><dd>${p.scope.join(' · ')}</dd></div></dl><button class="detail-link" data-detail="${index}">프로젝트 자세히 보기 <span>↗</span></button>`;
}
function mountArrival(index){arrival.innerHTML=summary(index);arrivalIndex=index;}
const jumps=projects.map((p,i)=>`<button data-jump="${i}" aria-label="${p.name} 도착 구간으로 이동"><span>${digits(i)}</span><i></i></button>`).join('');
$('.project-progress').innerHTML=jumps;
$('.mobile-project-nav').innerHTML=projects.map((p,i)=>`<button data-jump="${i}">${digits(i)} <span>${p.name}</span></button>`).join('');
$('#list-items').innerHTML=projects.map((p,i)=>`<article class="list-card" id="project-${p.id}" tabindex="-1"><div class="art-list">${projectVisual(i)}</div><div class="list-copy">${summary(i)}</div></article>`).join('');
function syncMotion(){const halted=paused||document.hidden||document.body.classList.contains('motion-off')||fallback.matches;vectorScene.setPaused(halted);effects.setState({paused:halted,enabled:!fallback.matches&&current>.08});}
function render(){
 const cam=camera(current,innerWidth,innerHeight),part=storyAt(current),inArrival=part.type==='arrival',fade=clamp(1-current/.5);
 vectorScene.render(cam,innerWidth,innerHeight,current,paused||document.hidden||document.body.classList.contains('motion-off')||fallback.matches);effects.setState({paused:paused||document.hidden||document.body.classList.contains('motion-off')||fallback.matches,enabled:!fallback.matches&&current>.08});effects.update(cam,innerWidth,innerHeight);
 $('.intro').style.opacity=fade;$('.intro').inert=fade<.05;$('.intro').setAttribute('aria-hidden',String(fade<.05));
 $('#ambient-field').style.opacity=clamp((current-.1)/1.2)*.45;
 if(inArrival&&arrivalIndex!==part.project)mountArrival(part.project);
 arrival.hidden=!inArrival;arrival.inert=!inArrival||arrivalOpacity(current)<.05;arrival.style.opacity=arrivalOpacity(current);
 const ending=part.type==='outro';$('#journey-end').hidden=!ending;$('#journey-end').style.opacity=ending?clamp(part.t*2.7):0;$('#journey-end').inert=!ending||part.t<.08;
 document.body.classList.toggle('at-arrival',inArrival);
 const count=part.type==='intro'?0:part.type==='journey'?part.project:part.project+1;$('#position').textContent=`${String(count).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;
 $('#chapter-label').textContent=part.type==='intro'?'여정의 시작':inArrival?`${projects[part.project].category} / 도착`:ending?'다음 경험을 향해':`${digits(part.project)} / 다음 경험으로 이동 중`;
 document.querySelectorAll('.project-progress [data-jump]').forEach((button,i)=>{const segment=story.find(p=>p.type==='arrival'&&p.project===i),active=inArrival&&part.project===i;button.toggleAttribute('data-active',active);if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');button.querySelector('i').style.setProperty('--segment-progress',clamp((current-segment.start)/(segment.end-segment.start)));});
 const percent=Math.round(current/END*100);$('.overall-progress').setAttribute('aria-valuenow',percent);$('.overall-progress i').style.width=percent+'%';explorer.setAttribute('aria-label',`프로젝트 여정 ${percent}%. ${inArrival?projects[part.project].name+' 도착':ending?'여정의 마지막':'프로젝트로 이동'}. 방향키로 진행하거나 되돌아갈 수 있습니다.`);
}
function tick(time){raf=0;if(paused||fallback.matches)return;const dt=Math.min(50,time-(last||time));last=time;current+=(target-current)*(1-Math.exp(-dt/105));if(Math.abs(target-current)<.00005)current=target;render();if(current!==target)raf=requestAnimationFrame(tick);}
function wake(){if(!raf&&!paused&&!fallback.matches){last=0;raf=requestAnimationFrame(tick);}}
function move(delta){target=clamp(target+delta,0,END);wake();}
function jump(index){if(paused)return;if(fallback.matches){const article=$('#project-'+projects[index].id);article.scrollIntoView({behavior:'instant',block:'start'});article.focus({preventScroll:true});return;}target=arrivalProgress(index);wake();}
function restart(){if(paused)return;if(fallback.matches)window.scrollTo({top:0,behavior:'instant'});else{target=0;wake();}}
explorer.addEventListener('wheel',e=>{if(paused||fallback.matches||e.ctrlKey)return;e.preventDefault();move(normalizeWheel(e,innerHeight));},{passive:false});
document.addEventListener('keydown',e=>{if(paused||fallback.matches||e.target.closest('input,textarea,select')||(e.key===' '&&e.target.closest('button,a')))return;const keys={ArrowDown:.16,ArrowRight:.16,ArrowUp:-.16,ArrowLeft:-.16,PageDown:.65,PageUp:-.65,' ':e.shiftKey?-.45:.45};if(e.key in keys){e.preventDefault();move(keys[e.key]);}else if(e.key==='Home'||e.key==='End'){e.preventDefault();target=e.key==='Home'?0:END;wake();}});
function detailContent(index){const p=projects[index];return `<div class="detail-heading"><span>${p.category} / UI 구성 예시</span><h2 id="panel-title">${p.name}</h2><p>${p.title.replace('\n',' ')}</p><div class="sample-notice">실제 프로젝트 자료가 제공되지 않아, 서비스 경험을 설명하기 위한 구성 예시로 제작했습니다. 아래 담당 범위는 예시의 설계 범위입니다.</div></div><div class="detail-cover">${projectVisual(index)}</div><div class="detail-sections"><section><span>01 / OVERVIEW</span><h3>개요</h3><p>${p.overview}</p></section><section><span>02 / CHALLENGE</span><h3>해결하려 한 과제</h3><p>${p.challenge}</p></section><section class="planning-section"><span>03 / DESIGN DECISIONS</span><h3>기획 판단</h3><ol>${p.decisions.map(([title,body])=>`<li><h4>${title}</h4><p>${body}</p></li>`).join('')}</ol></section><section><span>04 / OUTCOME</span><h3>디자인 결과</h3><p>${p.result}</p></section><section><span>05 / SCOPE</span><h3>담당 범위 <small>구성 예시</small></h3><ul class="scope-list">${p.scope.map(s=>`<li>${s}</li>`).join('')}</ul></section></div>`;}
function contactContent(){let link='';if(contact.url&&/^https?:\/\//.test(contact.url))link=`<a class="primary-action" href="${escape(contact.url)}" target="_blank" rel="noopener noreferrer">문의 페이지 열기 ↗</a>`;else if(contact.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))link=`<a class="primary-action" href="mailto:${escape(contact.email)}">${escape(contact.email)} ↗</a>`;return `<h2 id="panel-title">다음 경험을<br>함께 만듭니다.</h2><p>서비스의 방향부터 디지털 경험의 완성까지,<br>새로운 협업에 관한 이야기를 기다립니다.</p>${link||'<p class="contact-pending">문의 채널을 준비하고 있습니다.</p>'}<p class="panel-note">ROOT4 / DIGITAL EXPERIENCE DESIGN<br>기획 · UI/UX 디자인 · 디자인 시스템</p>`;}
const menuContent={about:()=>'<h2 id="panel-title">경험을 설계하고,<br>가능성을 연결합니다.</h2><p>루트포는 브랜드와 사람 사이의 디지털 경험을 설계합니다. 복잡한 정보를 이해하기 쉬운 구조로 정리하고, 기획부터 UI와 인터랙션까지 일관된 흐름을 만듭니다.</p><p>이번 여정은 통신 웹·앱, 금융 앱, TV 콘텐츠 UI의 세 가지 서비스 경험을 보여줍니다.</p><p class="panel-note">현재 프로젝트는 실제 자료가 제공되지 않아 제작한 UI 구성 예시입니다.</p>',lab:()=>'<h2 id="panel-title">작은 반응이 만드는<br>새로운 경험.</h2><p>서로 다른 서비스 경험이 하나의 경로로 이어집니다. 스크롤하면 프로젝트를 만나고, 멈추면 그 안의 생각을 읽을 수 있습니다.</p><p>포인터에 반응하는 깊이와 움직임을 통해 화면과 사람 사이의 감각을 탐색합니다.</p>',contact:contactContent};
function openPanel(kind,index,source){
 if(dialog.open)return;opener=source;snapshot={progress:current,target:current};paused=true;target=current;if(raf)cancelAnimationFrame(raf);raf=0;document.body.classList.add('motion-paused','panel-open');syncMotion();
 dialog.className=kind==='project'?'project-panel':'studio-panel';$('#panel-kicker').textContent=kind==='project'?`ROOT4 / PROJECT ${digits(index)}`:'ROOT4 / '+kind.toUpperCase();$('#panel-content').innerHTML=kind==='project'?detailContent(index):menuContent[kind]();dialog.showModal();dialog.scrollTop=0;$('#close-panel').focus({preventScroll:true});
}
document.addEventListener('click',e=>{const detail=e.target.closest('[data-detail]'),menu=e.target.closest('[data-panel]'),jumpButton=e.target.closest('[data-jump]'),start=e.target.closest('[data-restart]');if(detail)openPanel('project',Number(detail.dataset.detail),detail);else if(menu)openPanel(menu.dataset.panel,null,menu);else if(jumpButton)jump(Number(jumpButton.dataset.jump));else if(start){e.preventDefault();restart();}});
$('#close-panel').onclick=()=>dialog.close();dialog.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});dialog.addEventListener('close',()=>{if(snapshot){current=snapshot.progress;target=snapshot.target;}paused=false;document.body.classList.remove('motion-paused','panel-open');syncMotion();render();if(opener?.isConnected&&!opener.closest('[inert]'))opener.focus({preventScroll:true});else explorer.focus({preventScroll:true});snapshot=null;});
$('#toggle-motion').onclick=()=>{const off=document.body.classList.toggle('motion-off');$('#toggle-motion').setAttribute('aria-pressed',String(off));$('#toggle-motion').setAttribute('aria-label',off?'반복 모션 재생':'반복 모션 일시 정지');$('#toggle-motion').textContent=off?'MOTION OFF ▷':'MOTION ON Ⅱ';syncMotion();};
function resize(){syncMotion();render();wake();}window.addEventListener('resize',resize);fallback.addEventListener('change',resize);document.addEventListener('visibilitychange',syncMotion);resize();
window.__zoom={get progress(){return current;},get target(){return target;},get paused(){return paused;},get chapter(){return storyAt(current);},get visual(){return effects.state;},end:END};

dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const nodes=[...dialog.querySelectorAll('button:not([disabled]),a[href],input,textarea,select,[tabindex="0"]')].filter(n=>n.getClientRects().length),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
