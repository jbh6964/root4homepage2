import { projects } from './projects.js';
import { projectVisual, brandMark, projectPalettes } from './project-art.js';
import { VectorScene } from './vector-scene.js';
import { SceneEffects } from './scene-effects.js';
import { END, story, stops, storyAt, camera, normalizeWheel, clamp } from './geometry.js';
const $ = selector => document.querySelector(selector);
const scene = $('#scene'), explorer = $('#explorer'), dialog = $('#panel'), caseStudy = $('#case-study');
const vectorScene = new VectorScene(scene);
const effects = new SceneEffects($('#ambient-field'),vectorScene,explorer,caseStudy);
$('.project-index').innerHTML=projects.map((p,i)=>`<button data-project-jump="${i}" aria-label="${p.name} 프로젝트로 이동">0${i+1}</button>`).join('');

function card(index,frame){const element=document.createElement('div');element.className='art '+projects[index].type;element.style.cssText=`left:${frame.x}px;top:${frame.y}px;width:${frame.w}px;height:${frame.h}px;transform:rotate(${frame.a}deg)`;element.innerHTML=projectVisual(index);return element;}
// Keep ambient motion continuous across case-study mounts and pauses.
const motionOrigin=performance.now();
let motionPausedAt=null,motionPausedTotal=0;
function syncMotionClock(){
 const now=performance.now(),halted=document.body.matches('.motion-paused,.motion-off,.tab-hidden')||fallback.matches;
 if(halted&&motionPausedAt===null)motionPausedAt=now;
 else if(!halted&&motionPausedAt!==null){motionPausedTotal+=now-motionPausedAt;motionPausedAt=null;}
 vectorScene.setPaused(halted);
 effects.setState({paused:halted,enabled:!fallback.matches});
}
function synchronizeAnimations(root){
 const time=(motionPausedAt??performance.now())-motionOrigin-motionPausedTotal;
 root.getAnimations({subtree:true}).forEach(animation=>{animation.currentTime=time;});
}
function specimen(index){const p=projects[index],[bg,fg,accent]=projectPalettes[index];return `<div class="case-art-board">${projectVisual(index)}</div><div class="case-identity-card">${brandMark(index)}<span>${p.short}</span><small>${p.category}<br>ROOT4 STUDIO / ${p.year}</small></div><div class="case-chip"><div class="material-swatches"><i style="background:${bg}"></i><i style="background:${fg}"></i><i style="background:${accent}"></i></div><span>0${index+1} / COLOUR STUDY<br>${p.year} COLLECTION</span></div>`;}
function digital(index) {
 const p=projects[index],heads=['Better, together.','Your daily ritual.','Find your frequency.','A softer kind of bright.','Make yourself at home.','Open to new ideas.'];
 return `<div class="browser-mock"><div class="browser-toolbar"><i></i><i></i><i></i><span>${p.short} / digital experience</span></div><div class="browser-body theme-${index}"><nav><b>${p.short}</b><span>Discover　 Studio　 ↗</span></nav><span class="browser-eyebrow">${p.category} — ${p.year}</span><div class="browser-headline">${p.title.replaceAll('\n','<br>')}</div><div class="browser-visual">${projectVisual(index)}</div><div class="browser-stamp">${brandMark(index)}<span>AN INDEPENDENT<br>POINT OF VIEW.</span></div><span class="browser-bottom">EXPLORE THE POSSIBILITIES <b>↓</b></span></div></div><div class="phone-mock theme-${index}"><div class="phone-status"><span>9:41</span><span>● ▰</span></div><span>${p.short}<i>☰</i></span><div class="phone-visual">${brandMark(index)}</div><b>${heads[index]}</b><p>${p.category}</p><div class="phone-ui-line"></div><div class="phone-ui-line short"></div><small>DISCOVER MORE　↗</small></div>`;
}
scene.addEventListener('projectfocus',event=>{
 const index=event.detail,caption=$('#focus-caption'),active=index>=0&&current<.5&&!paused;
 caption.classList.toggle('visible',active);
 if(active){caption.querySelector('span').textContent='SELECTED WORK / 0'+(index+1);caption.querySelector('strong').textContent=projects[index].name;caption.querySelector('p').textContent=projects[index].role;}
});
let caseIndex=-1;
function mountCase(index) {
 const p=projects[index];
 caseStudy.className='case-study case-'+index;
 caseStudy.innerHTML=`<div class="case-track"><section class="case-hero"><div class="hero-kicker">SELECTED PROJECT / 0${index+1}<span>${p.category} — ${p.year}</span></div><div class="hero-title"><span>ROOT4 CASE STUDY</span><h1>${p.name}</h1><p>${p.role}</p></div><span class="hero-scroll">THE STORY CONTINUES <i>↓</i></span></section><section class="case-overview"><div class="case-topline"><span>0${index+1} / THE IDEA</span><span>CONCEPT PROJECT · ${p.year}</span></div><div class="overview-copy"><h2 data-parallax="-.08">${p.heading.replace('\n','<br>')}</h2><div><p>${p.description}</p><p>${p.approach}</p><dl><dt>OUR ROLE</dt><dd>${p.scope.join('<br>')}</dd></dl></div></div><div class="specimen-stage" data-parallax=".07">${specimen(index)}</div><div class="case-bottomline"><span>STRATEGY → IDENTITY → EXPERIENCE</span><span>DESIGNED TO MOVE.</span></div></section><section class="case-application"><div class="application-copy"><span>02 / IN EVERY TOUCHPOINT</span><h2>${p.title.replace('\n','<br>')}</h2><p>${p.caption}</p></div><div class="digital-stage" data-parallax="-.09">${digital(index)}</div><div class="application-caption"><span>VISUAL SYSTEM × DIGITAL EXPERIENCE</span><span>${p.scope.slice(-2).join(' / ')}</span></div></section><section class="case-outro"><span>${index===projects.length-1?'KEEP EXPLORING':'A DIFFERENT PERSPECTIVE'}</span><p>${index===projects.length-1?'Every ending, a new beginning.':'Small things. Lasting impressions.'}</p>${index===projects.length-1?'<button id="restart-story">다시 탐색하기 ↗</button>':'<span class="outro-arrow">↓</span>'}</section></div>`;
 synchronizeAnimations(caseStudy);
 caseIndex=index;
 $('#restart-story')?.addEventListener('click',()=>{target=0;wake();});
}
let target=0,current=0,paused=false,raf=0,last=0;
const fallback=matchMedia('(max-width:700px), (prefers-reduced-motion: reduce)');
function render() {
 const cam=camera(current,innerWidth,innerHeight), part=storyAt(current);
 vectorScene.render(cam,innerWidth,innerHeight,((motionPausedAt??performance.now())-motionOrigin-motionPausedTotal)/1000,document.body.matches('.motion-paused,.motion-off,.tab-hidden')||fallback.matches);
 effects.update(cam,innerWidth,innerHeight);
 const inCase=part.type==='detail';
 document.body.classList.toggle('in-detail',inCase);
 $('.scene-colophon').style.opacity=clamp(1-current/.7);
 $('#journey-end').hidden=!(part.type==='outro'&&part.t>.8);
 $('#flow-map').classList.toggle('reading',inCase);
 if(inCase && caseIndex!==part.project)mountCase(part.project);
 caseStudy.hidden=!inCase;
 if(inCase) {
   // Three viewport heights of narrative: copy and artifacts move at different speeds.
   const travel=part.project===projects.length-1?3.4:4.4;
   $('.case-track').style.transform=`translate3d(0,${-part.t*innerHeight*travel}px,0)`;
   caseStudy.querySelectorAll('[data-parallax]').forEach(el=>{el.style.transform=`translate3d(0,${(part.t-.5)*innerHeight*Number(el.dataset.parallax)}px,0)`;});
 }
 $('.intro').style.opacity=clamp(1-current/.7);
 $('.intro').inert=current>=.5;
 $('.explore-hint').style.opacity=clamp(1-current/.4);
 if(current>=.5)$('#focus-caption').classList.remove('visible');
 const count=current<story.find(p=>p.type==='detail').start?0:part.project+1;
 $('#position').textContent=`0${count} / ${String(projects.length).padStart(2,'0')}`;
 $('#chapter-label').textContent=part.type==='overview'?'SELECTED WORKS — THE WHOLE JOURNEY':part.type==='journey'?'FOLLOWING THE FLOW':`${projects[part.project].name} — ${inCase?'CASE STUDY':'SELECTED WORK'}`;
 $('.track i').style.width=current/END*100+'%';
 $('#back').disabled=target<=0;$('#forward').disabled=target>=END;
 explorer.setAttribute('aria-label',`프로젝트 탐색 ${Math.round(current/END*100)}%. ${inCase?projects[part.project].name+' 상세 설명':part.type==='journey'?'공간 탐색':'확대 이동'}. 방향키로 이동, Home 처음, End 마지막.`);
}
function tick(time) { raf=0;if(paused||fallback.matches)return;const dt=Math.min(50,time-(last||time));last=time;current+=(target-current)*(1-Math.exp(-dt/105));if(Math.abs(target-current)<.00005)current=target;render();if(current!==target)raf=requestAnimationFrame(tick); }
function wake(){if(!raf&&!paused&&!fallback.matches){last=0;raf=requestAnimationFrame(tick);}}
function move(delta){target=clamp(target+delta,0,END);wake();}
explorer.addEventListener('wheel',event=>{if(paused||fallback.matches||event.ctrlKey)return;event.preventDefault();move(normalizeWheel(event,innerHeight));},{passive:false});
document.addEventListener('keydown',event=>{if(paused||fallback.matches||event.target.closest('input,textarea')||(event.key===' '&&event.target.closest('button,a')))return;const keys={ArrowDown:.16,ArrowRight:.16,ArrowUp:-.16,ArrowLeft:-.16,PageDown:.65,PageUp:-.65,' ':(event.shiftKey?-.45:.45)};if(event.key in keys){event.preventDefault();move(keys[event.key]);}else if(event.key==='Home'||event.key==='End'){event.preventDefault();target=event.key==='Home'?0:END;wake();}});
document.querySelectorAll('[data-project-jump]').forEach(button=>button.onclick=()=>{target=story.find(part=>part.type==='detail'&&part.project===Number(button.dataset.projectJump)).start;wake();});
$('#flow-overview').onclick=$('#restart-flow').onclick=()=>{target=0;wake();};
$('#forward').onclick=()=>{target=stops.find(stop=>stop>target+.001)??END;wake();};
$('#back').onclick=()=>{target=stops.findLast(stop=>stop<target-.001)??0;wake();};
$('.logo').onclick=event=>{event.preventDefault();target=0;wake();if(fallback.matches)window.scrollTo({top:0,behavior:'instant'});};
const panels={about:'<h2 id="panel-title">Good work.<br>Better together.</h2><p>root4는 브랜드의 본질을 발견하고, 시각 언어와 디지털 경험으로 연결하는 독립 디자인 스튜디오입니다.</p><p>브랜딩, 아트 디렉션, 웹 디자인과 실험적인 인터랙션을 함께 다룹니다.</p><p class="panel-note">SEOUL, KR · INDEPENDENT DESIGN PRACTICE<br>현재 프로젝트와 상세 설명은 디자인 콘셉트를 보여 주는 샘플입니다.</p>',lab:'<h2 id="panel-title">Always<br>in motion.</h2><p>정지된 이미지 너머, 움직임이 만드는 새로운 감각을 탐색합니다.</p><p>01 — Connected perspectives<br>전체 여정을 먼저 보고 경로를 따라 프로젝트 지점을 통과하는 탐색.</p><p>02 — Living identities<br>같은 공간 안에서 연결되는 브랜드, 패키지와 디지털 경험.</p><p>03 — Different perspectives<br>레이어마다 다른 속도로 전개되는 프로젝트 스토리.</p>',contact:'<h2 id="panel-title">Let’s make<br>something matter.</h2><p>브랜드와 디지털 경험에 관한 새로운 협업을 기다립니다.</p><p>연락처는 준비 중입니다.</p><p class="panel-note">BASED IN SEOUL · OPEN TO THE WORLD</p>'};
let opener;
document.querySelectorAll('[data-panel]').forEach(button=>button.onclick=()=>{opener=button;paused=true;target=current;if(raf)cancelAnimationFrame(raf);raf=0;document.body.classList.add('motion-paused');syncMotionClock();$('#panel-content').innerHTML=panels[button.dataset.panel];dialog.showModal();$('#close-panel').focus();});
$('#close-panel').onclick=()=>dialog.close();
dialog.addEventListener('click',event=>{if(event.target===dialog&&event.clientX<dialog.getBoundingClientRect().left)dialog.close();});
dialog.addEventListener('close',()=>{paused=false;document.body.classList.remove('motion-paused');syncMotionClock();opener?.focus();wake();});
dialog.addEventListener('wheel',event=>event.stopPropagation(),{passive:true});
projects.forEach((project,index)=>{
 const article=document.createElement('article');article.className='list-card';
 const image=document.createElement('div');image.className='art-list';image.setAttribute('aria-hidden','true');image.append(card(index,{x:0,y:0,w:780,h:520,a:0},false));article.append(image);
 article.insertAdjacentHTML('beforeend',`<span class="mobile-category">${project.category} / ${project.year}</span><h2>0${index+1} — ${project.name}</h2><p>${project.role}</p><h3>${project.heading.replace('\n',' ')}</h3><p>${project.description}</p><p>${project.approach}</p><div class="mobile-specimen case-${index}">${specimen(index)}</div><p>${project.caption}</p>`);$('#list-items').append(article);
});
function resize(){syncMotionClock();document.querySelectorAll('.art-list').forEach(element=>{element.firstChild.style.transform=`scale(${element.clientWidth/780})`;});render();wake();}
window.addEventListener('resize',resize);fallback.addEventListener('change',resize);resize();
$('#toggle-motion').onclick=()=>{const off=document.body.classList.toggle('motion-off');syncMotionClock();$('#toggle-motion').setAttribute('aria-pressed',String(off));$('#toggle-motion').setAttribute('aria-label',off?'반복 모션 재생':'반복 모션 일시 정지');$('#toggle-motion').textContent=off?'MOTION OFF ▷':'MOTION ON Ⅱ';};
document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('tab-hidden',document.hidden);syncMotionClock();});
window.__zoom={get progress(){return current;},get target(){return target;},get paused(){return paused;},get chapter(){return storyAt(current);},get visual(){return effects.state;},end:END};
