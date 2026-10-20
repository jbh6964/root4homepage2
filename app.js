import { VectorScene } from './vector-scene.js';
import { END, sceneNames, stops, storyAt, camera, normalizeWheel, clamp } from './geometry.js';
const $ = selector => document.querySelector(selector);
const scene = $('#scene'), explorer = $('#explorer'), dialog = $('#panel'), caseStudy = $('#case-study');
const vectorScene = new VectorScene(scene);
const projects = [
  { name:'FORM / OTHER', short:'form & other.', role:'브랜드 전략 · 아이덴티티 · 아트 디렉션', type:'a', year:'2026', category:'CULTURE & COMMUNITY',
    title:'Different forms.\nOne shared voice.', heading:'다름을 모아,\n하나의 태도로.',
    description:'독립적인 크리에이터가 각자의 개성을 지키면서도 하나의 커뮤니티로 연결될 수 있을까? 서로 다른 형태가 만나 새로운 균형을 이루는 브랜드를 구상했습니다.',
    approach:'세리프 타이포그래피와 접힌 종이의 구조를 조합했습니다. 아이보리 용지와 짙은 잉크, 섬세한 인쇄 디테일이 독립적인 태도와 연결의 감각을 함께 전합니다.',
    scope:['Brand strategy','Visual identity','Art direction','Digital applications'], caption:'하나의 로고보다, 함께 확장되는 시스템.' },
  { name:'mori', short:'mori', role:'브랜드 아이덴티티 · 패키지 · 디지털 경험', type:'b', year:'2025', category:'WELLNESS & DAILY RITUAL',
    title:'A little closer\nto your nature.', heading:'일상에 스며드는\n자연의 리듬.',
    description:'바쁜 일상 속 작은 루틴을 자연과 연결하는 웰니스 브랜드 콘셉트입니다. 좋은 습관을 강요하기보다, 손이 가고 곁에 두고 싶은 경험을 디자인했습니다.',
    approach:'잎의 곡선에서 출발한 그래픽과 차분한 세이지 컬러를 사용했습니다. 패키지의 촉감부터 모바일 화면의 정보 밀도까지 같은 호흡으로 이어집니다.',
    scope:['Brand identity','Packaging system','E-commerce direction','Digital experience'], caption:'보이는 것에서, 매일 손에 닿는 경험으로.' },
  { name:'OFFBEAT', short:'OFFBEAT', role:'크리에이티브 디렉션 · 웹 디자인 · 인터랙션', type:'c', year:'2025', category:'MUSIC & INDEPENDENT CULTURE',
    title:'Find your\nown frequency.', heading:'익숙한 박자\n밖의 새로운 감각.',
    description:'음악을 고르는 순간부터 새로운 아티스트를 발견하는 순간까지. 장르의 경계를 넘어 독립 음악의 에너지를 전달하는 디지털 플랫폼을 제안합니다.',
    approach:'흑백의 절제된 대비와 넓은 여백, 유연한 세리프 타이포그래피를 조합했습니다. 얇은 선으로 겹친 파형이 음악의 밀도와 리듬을 시각화합니다.',
    scope:['Creative direction','Web design','Motion language','Interaction design'], caption:'정해진 장르 없이. 당신만의 주파수로.' }
];
let graphicId=0;
function foldedMark(){
 const id='fold-'+graphicId++;
 return `<svg class="folded-mark" viewBox="0 0 300 360" fill="none" aria-hidden="true"><defs><linearGradient id="${id}" x1="44" y1="32" x2="240" y2="335" gradientUnits="userSpaceOnUse"><stop stop-color="#faf7ef"/><stop offset=".42" stop-color="#b9b8ad"/><stop offset=".52" stop-color="#f1eee5"/><stop offset="1" stop-color="#6e726b"/></linearGradient></defs><path d="M145 15 258 94 176 171 251 270 134 345 36 261 116 181 39 84Z" fill="url(#${id})"/><path d="m145 15 31 156-60 10-77-97m77 97 18 164 42-174m0 0 75 99-117 75M39 84l219 10-82 77M36 261l215 9" stroke="#fff9ed" stroke-opacity=".58" stroke-width=".6"/><path d="m145 15-29 166 142-87-82 77-42 174-18-164-80 80" stroke="#4d514b" stroke-opacity=".4" stroke-width=".6"/></svg>`;
}
function botanicalMark(){
 return `<svg class="botanical-mark" viewBox="0 0 320 420" fill="none" aria-hidden="true"><path d="M145 420C170 298 127 205 177 30" stroke="currentColor" stroke-width="1"/>${Array.from({length:11},(_,i)=>{const y=56+i*28,x=160+(i%2?0:12),side=i%2?-1:1;return `<path d="M${x} ${y+45}C${x+side*75} ${y+40} ${x+side*100} ${y-32} ${x+side*80} ${y-35}C${x+side*20} ${y-20} ${x+side*5} ${y+12} ${x} ${y+45}Z" fill="currentColor" fill-opacity="${.11+i*.012}" stroke="currentColor" stroke-width=".5"/><path d="m${x} ${y+45} ${side*80} -80" stroke="currentColor" stroke-width=".4"/>`;}).join('')}</svg>`;
}
function waveMark(){
 return `<svg class="wave-mark" viewBox="0 0 700 400" fill="none" aria-hidden="true">${Array.from({length:32},(_,i)=>{const y=30+i*10;return `<path d="M-40 ${y}C140 ${y-120} 200 ${y+190} 360 ${y+40}S560 ${y-110} 740 ${y+10}" stroke="currentColor" stroke-width="${i%5===0?1.2:.5}"/>`;}).join('')}</svg>`;
}
function artwork(index) {
 if(index===0)return `<div class="editorial-number">F/O — 001</div><div class="cover-type">form<span>& other.</span></div><div class="sculpture-field">${foldedMark()}<span>STUDIES IN COLLECTIVE FORM</span></div><div class="cover-note">A shared space.<br>A different perspective.</div><div class="print-marks"><i></i><i></i><i></i></div><div class="cover-baseline">INDEPENDENT IN SPIRIT. CONNECTED BY DESIGN.</div>`;
 if(index===1)return `<div class="mori-edition">MORI / BOTANICAL STUDIES — 02</div><div class="mori-title">mori<span>the nature of everyday.</span></div>${botanicalMark()}<div class="hero-bottle"><div class="bottle-label"><b>mori</b><small>DAILY BALANCE<br>BOTANICAL FORMULA / 01</small><span>30 ml / 1.0 fl oz</span></div></div><div class="mori-side">SLOW DOWN. COME CLOSER.</div>`;
 return `<div class="offbeat-edition">OFFBEAT® — INDEPENDENT MUSIC & CULTURE</div><div class="offbeat-title">Off<span>beat.</span></div>${waveMark()}<div class="offbeat-index"><span>VOL. 004</span><span>SEOUL / EVERYWHERE</span></div><div class="signal-dot"></div>`;
}
function card(index, frame, nested=true) {
  const element = document.createElement('div'); element.className = 'art '+projects[index].type;
  Object.assign(element.style,{left:frame.x+'px',top:frame.y+'px',width:frame.w+'px',height:frame.h+'px',transform:`rotate(${frame.a}deg)`});
  const canonical = document.createElement('div'); canonical.className='canonical';
  canonical.style.cssText=`position:absolute;width:780px;height:520px;zoom:${frame.w/780}`;
  canonical.innerHTML=`<div class="art-inner"><span class="tiny-label">${projects[index].category}</span>${artwork(index)}<div class="art-foot"><span>${projects[index].name}</span><span>ROOT4 × ${projects[index].year} ↗</span></div></div>`;
  element.append(canonical); return element;
}
// Keep ambient animation phases continuous when a nested scene is rebased.
const motionOrigin=performance.now();
let motionPausedAt=null,motionPausedTotal=0;
function syncMotionClock(){
 const now=performance.now(),halted=document.body.matches('.motion-paused,.motion-off,.tab-hidden')||fallback.matches;
 if(halted&&motionPausedAt===null)motionPausedAt=now;
 else if(!halted&&motionPausedAt!==null){motionPausedTotal+=now-motionPausedAt;motionPausedAt=null;}
 vectorScene.setPaused(halted);
}
function synchronizeAnimations(root){
 const time=(motionPausedAt??performance.now())-motionOrigin-motionPausedTotal;
 root.getAnimations({subtree:true}).forEach(animation=>{animation.currentTime=time;});
}
function specimen(index) {
  if(index===0) return '<div class="identity-poster"><span>FORM / OTHER — A BRAND IN COMMON</span><strong>Different<br>by design<span>↗</span></strong><small>ONE COMMUNITY. MANY POSSIBILITIES.</small></div><div class="identity-card"><span>F/O®</span><small>INDEPENDENT MINDS.<br>CONNECTED BY DESIGN.</small></div><div class="identity-seal">form<br><em>& other.</em></div>';
  if(index===1) return '<div class="package-bottle one"><span>mori<small>DAILY BALANCE<br>BOTANICAL BLEND / 01</small></span></div><div class="package-bottle two"><span>mori<small>FIND YOUR CALM<br>BOTANICAL BLEND / 02</small></span></div><div class="package-box">mori.<small>A LITTLE CLOSER<br>TO YOUR NATURE.</small></div><span class="still-caption">LESS, BUT CLOSER.</span>';
  return '<div class="record-sleeve"><span>OFF/<br>BEAT</span><small>NO GENRES. JUST FEELING.</small></div><div class="vinyl"><i>OB®</i></div><div class="gig-ticket"><small>LIVE SESSIONS — VOL. 04</small><strong>MAKE<br>NOISE.</strong><span>SEOUL / EVERYWHERE</span></div>';
}
function digital(index) {
 const p=projects[index];
 return `<div class="browser-mock"><div class="browser-toolbar"><i></i><i></i><i></i><span>${p.short} / digital experience</span></div><div class="browser-body theme-${index}"><nav><b>${p.short}</b><span>Discover　 Studio　 ↗</span></nav><div class="browser-headline">${p.title.replaceAll('\n','<br>')}</div><div class="browser-visual">${index===0?foldedMark():index===1?'<div class="package-bottle"><span>mori</span></div>':waveMark()}</div><span class="browser-bottom">EXPLORE THE POSSIBILITIES <b>↓</b></span></div></div><div class="phone-mock theme-${index}"><span>${p.short}</span><div class="phone-visual">${index===1?'m.':index===0?'f/o':'↗'}</div><b>${index===1?'Your daily ritual.':index===0?'Better, together.':'On your frequency.'}</b><div class="phone-ui-line"></div><div class="phone-ui-line short"></div><small>DISCOVER MORE　↗</small></div>`;
}
let caseIndex=-1;
function mountCase(index) {
 const p=projects[index];
 caseStudy.className='case-study case-'+index;
 caseStudy.innerHTML=`<div class="case-track"><section class="case-hero"><div class="hero-kicker">SELECTED PROJECT / 0${index+1}<span>${p.category} — ${p.year}</span></div><div class="hero-title"><span>ROOT4 CASE STUDY</span><h1>${p.name}</h1><p>${p.role}</p></div><span class="hero-scroll">THE STORY CONTINUES <i>↓</i></span></section><section class="case-overview"><div class="case-topline"><span>0${index+1} / THE IDEA</span><span>CONCEPT PROJECT · ${p.year}</span></div><div class="overview-copy"><h2 data-parallax="-.08">${p.heading.replace('\n','<br>')}</h2><div><p>${p.description}</p><p>${p.approach}</p><dl><dt>OUR ROLE</dt><dd>${p.scope.join('<br>')}</dd></dl></div></div><div class="specimen-stage" data-parallax=".07">${specimen(index)}</div><div class="case-bottomline"><span>STRATEGY → IDENTITY → EXPERIENCE</span><span>DESIGNED TO MOVE.</span></div></section><section class="case-application"><div class="application-copy"><span>02 / IN EVERY TOUCHPOINT</span><h2>${p.title.replace('\n','<br>')}</h2><p>${p.caption}</p></div><div class="digital-stage" data-parallax="-.09">${digital(index)}</div><div class="application-caption"><span>VISUAL SYSTEM × DIGITAL EXPERIENCE</span><span>${p.scope.slice(-2).join(' / ')}</span></div></section><section class="case-outro"><span>${index===2?'KEEP EXPLORING':'A DIFFERENT PERSPECTIVE'}</span><p>${index===2?'Every ending, a new beginning.':'Small things. Lasting impressions.'}</p>${index===2?'<button id="restart-story">다시 탐색하기 ↗</button>':'<span class="outro-arrow">↓</span>'}</section></div>`;
 synchronizeAnimations(caseStudy);
 caseIndex=index;
 $('#restart-story')?.addEventListener('click',()=>{target=0;wake();});
}
let target=0,current=0,paused=false,raf=0,last=0;
const fallback=matchMedia('(max-width:700px), (prefers-reduced-motion: reduce)');
function render() {
 const cam=camera(current,innerWidth,innerHeight), part=storyAt(current);
 vectorScene.render(cam,innerWidth,innerHeight,((motionPausedAt??performance.now())-motionOrigin-motionPausedTotal)/1000,document.body.matches('.motion-paused,.motion-off,.tab-hidden')||fallback.matches);
 const inCase=part.type==='detail';
 if(inCase && caseIndex!==part.project)mountCase(part.project);
 caseStudy.hidden=!inCase;
 if(inCase) {
   // Three viewport heights of narrative: copy and artifacts move at different speeds.
   const travel=part.project===2?3.4:4.4;
   $('.case-track').style.transform=`translate3d(0,${-part.t*innerHeight*travel}px,0)`;
   caseStudy.querySelectorAll('[data-parallax]').forEach(el=>{el.style.transform=`translate3d(0,${(part.t-.5)*innerHeight*Number(el.dataset.parallax)}px,0)`;});
 }
 $('.intro').style.opacity=current<.12?1:0;
 $('.explore-hint').style.opacity=current<.1?1:0;
 const count=current<.8?0:part.project+1;
 $('#position').textContent=`0${count} / 03`;
 $('#chapter-label').textContent=current<.8?'SELECTED WORKS — 2024 / 2026':part.type==='journey'?`${sceneNames[part.scene]} — EXPLORATION`:`${projects[part.project].name} — ${inCase?'CASE STUDY':'SELECTED WORK'}`;
 $('.track i').style.width=current/END*100+'%';
 $('#back').disabled=target<=0;$('#forward').disabled=target>=END;
 explorer.setAttribute('aria-label',`프로젝트 탐색 ${Math.round(current/END*100)}%. ${inCase?projects[part.project].name+' 상세 설명':part.type==='journey'?'공간 탐색':'확대 이동'}. 방향키로 이동, Home 처음, End 마지막.`);
}
function tick(time) { raf=0;if(paused||fallback.matches)return;const dt=Math.min(50,time-(last||time));last=time;current+=(target-current)*(1-Math.exp(-dt/105));if(Math.abs(target-current)<.00005)current=target;render();if(current!==target)raf=requestAnimationFrame(tick); }
function wake(){if(!raf&&!paused&&!fallback.matches){last=0;raf=requestAnimationFrame(tick);}}
function move(delta){target=clamp(target+delta,0,END);wake();}
explorer.addEventListener('wheel',event=>{if(paused||fallback.matches||event.ctrlKey)return;event.preventDefault();move(normalizeWheel(event,innerHeight));},{passive:false});
document.addEventListener('keydown',event=>{if(paused||fallback.matches||event.target.closest('input,textarea')||(event.key===' '&&event.target.closest('button,a')))return;const keys={ArrowDown:.16,ArrowRight:.16,ArrowUp:-.16,ArrowLeft:-.16,PageDown:.65,PageUp:-.65,' ':(event.shiftKey?-.45:.45)};if(event.key in keys){event.preventDefault();move(keys[event.key]);}else if(event.key==='Home'||event.key==='End'){event.preventDefault();target=event.key==='Home'?0:END;wake();}});
$('#forward').onclick=()=>{target=stops.find(stop=>stop>target+.001)??END;wake();};
$('#back').onclick=()=>{target=stops.findLast(stop=>stop<target-.001)??0;wake();};
$('.logo').onclick=event=>{event.preventDefault();target=0;wake();if(fallback.matches)window.scrollTo({top:0,behavior:'instant'});};
const panels={about:'<h2 id="panel-title">Good work.<br>Better together.</h2><p>root4는 브랜드의 본질을 발견하고, 시각 언어와 디지털 경험으로 연결하는 독립 디자인 스튜디오입니다.</p><p>브랜딩, 아트 디렉션, 웹 디자인과 실험적인 인터랙션을 함께 다룹니다.</p><p class="panel-note">SEOUL, KR · INDEPENDENT DESIGN PRACTICE<br>현재 프로젝트와 상세 설명은 디자인 콘셉트를 보여 주는 샘플입니다.</p>',lab:'<h2 id="panel-title">Always<br>in motion.</h2><p>정지된 이미지 너머, 움직임이 만드는 새로운 감각을 탐색합니다.</p><p>01 — Nested stories<br>작업물의 디테일이 다음 세계로 이어지는 탐색.</p><p>02 — Living identities<br>접힌 종이의 빛, 식물의 실루엣, 겹쳐 흐르는 파형.</p><p>03 — Different perspectives<br>레이어마다 다른 속도로 전개되는 프로젝트 스토리.</p>',contact:'<h2 id="panel-title">Let’s make<br>something matter.</h2><p>브랜드와 디지털 경험에 관한 새로운 협업을 기다립니다.</p><p>연락처는 준비 중입니다.</p><p class="panel-note">BASED IN SEOUL · OPEN TO THE WORLD</p>'};
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
window.__zoom={get progress(){return current;},get target(){return target;},get paused(){return paused;},get chapter(){return storyAt(current);},end:END};
