import {balanceData} from './balance-art.js';
const T=(x,y,label,size=14,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${label}</text>`;
const R=(x,y,w,h,fill,r=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const I=(src,x,y,w,h,extra='')=>`<image href="/assets/${src}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" ${extra}/>`;
export const plans=[{name:'라이트',data:'15',price:'29,000'},{name:'밸런스',data:'50',price:'39,000'},{name:'프리',data:'무제한',price:'49,000'}];
export const products=[{name:'Orbit Audio',kr:'오빗 무선 헤드폰',price:'189,000',color:'Cobalt'},{name:'Field Runner',kr:'필드 테크 스니커',price:'149,000',color:'Chartreuse'},{name:'Transit Mini',kr:'트랜짓 크로스백',price:'79,000',color:'Coral'}];
export const filmImages=['frame-cinema.webp','frame-night.webp','frame-architecture.webp'];
export const films=[{name:'ECHOES',sub:'다음 장면은, 아직 만나지 못한 세계.',genre:'SF · 드라마'},{name:'AFTER HOURS',sub:'밤이 깊어질수록 선명해지는 이야기.',genre:'미스터리 · 시리즈'},{name:'FORM & FEEL',sub:'형태와 감각 사이, 새로운 시선.',genre:'아트 · 다큐멘터리'}];
function connectApp(id){return ` <g data-art-layer="back" transform="translate(708 130) rotate(10)">${R(0,0,238,365,'#d9ff72',29)}${T(22,42,'my connect',21,'fill="#27362a" font-weight="650" letter-spacing="-1"')}${T(22,84,'이번 달 남은 데이터',11,'fill="#526437"')}${T(19,158,'32.8',61,'data-connect-remaining fill="#27362a" font-weight="550" letter-spacing="-4"')}${T(165,155,'GB',17,'data-connect-unit fill="#526437"')}<circle cx="119" cy="247" r="59" fill="none" stroke="#aecb57" stroke-width="14"/><circle data-connect-ring cx="119" cy="247" r="59" fill="none" stroke="#3849df" stroke-width="14" stroke-dasharray="243 371" transform="rotate(-90 119 247)"/>${T(119,252,'65.6%',22,'data-connect-percent fill="#33463b" text-anchor="middle"')}${T(119,336,'데이터 선물하기　↗',11,'fill="#475434" text-anchor="middle"')}</g>
`;}
function connectArt(id){return `
 <g fill="#f4f4e9"><g data-art-type>${T(35,125,'Closer,',113,'font-weight="650" letter-spacing="-7"')}${T(272,237,'together.',113,'font-weight="650" letter-spacing="-7"')}</g>
 ${connectApp(id)}
 <g data-art-layer="ui"><g transform="translate(20 263) rotate(-5 430 210)">
 ${R(8,16,826,390,'#1728a7',18,'opacity=".25"')}${R(0,0,826,390,'#f9faf4',16)}${R(0,0,826,43,'#e7ebfb',16)}${R(0,25,826,18,'#e7ebfb')}
 <g fill="#a9b4e8"><circle cx="19" cy="22" r="3"/><circle cx="30" cy="22" r="3"/><circle cx="41" cy="22" r="3"/></g>${T(413,25,'connect / YOUR EVERYDAY NETWORK',8,'fill="#7789c2" text-anchor="middle" letter-spacing="1.6"')}
 ${T(27,83,'connect.',27,'fill="#2f43ca" font-weight="750" letter-spacing="-1.8"')}${T(540,80,'요금제　　혜택　　마이페이지',10,'fill="#7a86a8"')}
 ${T(27,128,'당신의 일상에 딱 맞는 연결',26,'fill="#253778" letter-spacing="-1.2"')}${T(28,153,'데이터도, 혜택도. 나에게 맞게 선택하세요.',10,'fill="#8b92b1"')}
 ${plans.map((p,i)=>`<g data-plan="${i}" transform="translate(${28+i*256} 177)">${R(0,0,244,159,i===1?'#e7edff':'#f0f2f7',12,`data-plan-surface stroke="${i===1?'#5268ed':'#e8eaf0'}" stroke-width="${i===1?1.5:1}"`)}${T(17,29,p.name,13,'fill="#59699d"')}${T(17,76,p.data,37,'fill="#2b3e88" font-weight="550" letter-spacing="-2"')}${i<2?T(67,75,'GB',12,'fill="#7385b3"'):''}${T(17,105,'통화·문자 기본 제공',9,'fill="#8d97b0"')}${T(17,137,'월 '+p.price+'원',14,'fill="#384e9a" font-weight="600"')}<circle data-plan-check cx="216" cy="25" r="8" fill="${i===1?'#3d55ed':'#dce1ee'}"/><path d="m212 25 3 3 5-6" fill="none" stroke="#fff" stroke-width="1.2"/></g>`).join('')}
 ${T(28,365,'선택한 요금제',9,'fill="#929ab0"')}${T(126,366,'밸런스 · 50GB',11,'data-connect-selected fill="#4b5fa5"')}${R(642,348,155,27,'#3f53eb',14)}${T(719,366,'자세히 알아보기　↗',10,'fill="#fff" text-anchor="middle"')}
 </g></g></g>`;}
function financeArt(id){
 const circumference=2*Math.PI*88;let offset=0;
 const arcs=balanceData.assets.map((p,i)=>{const length=circumference*p.share/100-5,result=`<circle data-balance-arc="${i}" cx="186" cy="573" r="88" fill="none" stroke="${p.color}" stroke-width="26" stroke-dasharray="${length} ${circumference-length}" stroke-dashoffset="${-offset}" transform="rotate(-90 186 573)"/><circle data-balance-hit="${i}" cx="186" cy="573" r="88" fill="none" stroke="transparent" stroke-width="39" stroke-dasharray="${length} ${circumference-length}" stroke-dashoffset="${-offset}" transform="rotate(-90 186 573)" pointer-events="stroke"/>`;offset+=circumference*p.share/100;return result;}).join('');
 return `<defs><linearGradient id="${id}-area" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#a07bd4" stop-opacity=".35"/><stop offset="1" stop-color="#a07bd4" stop-opacity="0"/></linearGradient></defs>
 <g fill="#efe8f6">
 <g data-balance-layer="type">${T(27,71,'FINANCE, IN PERSPECTIVE.',10,'letter-spacing="3" fill="#ad95c0"')}${T(20,179,'A clearer picture.',109,'font-family="Cormorant,Georgia,serif" font-weight="500" letter-spacing="-4"')}</g>
 <g data-balance-layer="front">${T(33,332,'모든 자산이 하나의 균형으로.',12,'fill="#b6a0c9"')}${T(27,397,'12,480,000',57,'data-balance-total font-weight="500" letter-spacing="-3"')}${T(35,427,'총 자산 · 금액 예시 / 원',9,'fill="#b3a1c2" letter-spacing="1"')}
 <circle cx="186" cy="573" r="88" fill="none" stroke="#4c3d5c" stroke-width="26"/>${arcs}${T(186,566,'MY BALANCE',8,'fill="#b5a0c7" text-anchor="middle" letter-spacing="2"')}${T(186,601,'100%',42,'fill="#e5d7f0" text-anchor="middle" letter-spacing="-2"')}
 ${balanceData.assets.map((p,i)=>`<circle cx="48" cy="${701+i*25}" r="3" fill="${p.color}"/>${T(60,705+i*25,p.name,10,'fill="#bca6ce"')}${T(341,705+i*25,p.amount.toLocaleString('ko-KR')+'원',12,'text-anchor="end" fill="#dbcae9"')}`).join('')}</g>
 <g data-balance-layer="ui" fill="#49285f"><g transform="rotate(3 690 480)">${R(436,248,522,476,'#452060',16,'opacity=".08"')}${R(427,237,522,476,'#fffafc',16,'stroke="#fff" stroke-width="1.5"')}
 ${T(454,275,'balance',24,'font-weight="650" letter-spacing="-1"')}${T(920,272,'자산　　소비　　목표',10,'fill="#a18aac" text-anchor="end"')}<path d="M452 294H925" stroke="#ebe1ef"/>
 ${T(455,328,'자금 구성 흐름',15,'font-weight="550"')}${T(920,328,'항목별 / 예시',9,'fill="#a28bae" text-anchor="end"')}
 <g stroke="#eee5f3" stroke-width="1"><path d="M478 378H913M478 418H913M478 458H913"/></g>
 <path d="M485 435C515 435 545 410 570 410S630 435 655 420 710 383 740 381 795 373 825 370 880 363 910 358V470H485Z" fill="url(#${id}-area)"/>
 <path data-balance-line d="M485 435C515 435 545 410 570 410S630 435 655 420 710 383 740 381 795 373 825 370 880 363 910 358" fill="none" stroke="#8051b0" stroke-width="2.6" pathLength="1"/>
 ${[485,570,655,740,825,910].map((x,i)=>`<circle data-balance-flow="${i}" cx="${x}" cy="${[435,410,420,381,370,358][i]}" r="3.5" fill="#fff" stroke="#8051b0" stroke-width="1.4"/><circle data-balance-flow-hit="${i}" cx="${x}" cy="${[435,410,420,381,370,358][i]}" r="13" fill="transparent" pointer-events="all"/>${T(x,490,balanceData.flowLabels[i],8,'fill="#b39ac0" text-anchor="middle"')}`).join('')}
 <path d="M452 510H925" stroke="#ebe1ef"/>${T(454,537,'최근 거래',11,'fill="#916ea5"')}${T(920,537,'전체 보기 ↗',9,'fill="#b39ac0" text-anchor="end"')}
 ${balanceData.transactions.map(([name,type,amount],i)=>`<g transform="translate(455 ${568+i*49})">${R(0,-14,29,29,'#f0e5f7',9)}${T(14,6,['↓','↗','−'][i],14,'text-anchor="middle" fill="#9674b0"')}${T(42,0,name,12,'fill="#80618f"')}${T(42,16,type,8,'fill="#b29abe"')}${T(465,6,amount+'원',13,'text-anchor="end" fill="#6b447f"')}</g>`).join('')}
 </g></g></g>`;
}
function frameArt(id){return `<defs><linearGradient id="${id}-film" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#170d23" stop-opacity=".8"/><stop offset=".62" stop-color="#170d23" stop-opacity="0"/></linearGradient><clipPath id="${id}-cinema"><rect x="40" y="96" width="1200" height="460" rx="8"/></clipPath></defs>
 <g fill="#fff2df">

 <g data-art-layer="ui"><g clip-path="url(#${id}-cinema)">${I('frame-cinema.webp',40,96,1200,460,'data-film-image')}${R(40,96,1200,460,'url(#'+id+'-film)')}</g>
 ${T(69,138,'FRAME',23,'font-weight="700" letter-spacing="3"')}${T(288,134,'홈　　발견　　이어보기',11,'fill="#e8d7cd"')}${T(1209,134,'검색　⌕',11,'text-anchor="end"')}
 ${T(87,313,'ROOT4 ORIGINAL / CONCEPT',10,'fill="#ffbd8e" letter-spacing="2.5"')}${T(82,395,'ECHOES',83,'data-film-title font-weight="550" letter-spacing="-4"')}${T(88,428,films[0].sub,14,'data-film-sub fill="#f3d9c7"')}${T(88,456,films[0].genre,10,'data-film-genre fill="#dcc4b7"')}
 ${R(88,482,150,42,'#fff0df',4)}${T(163,508,'▷　프리뷰 살펴보기',11,'fill="#3e2838" text-anchor="middle"')}
 </g>
 <g data-art-layer="front">${films.map((film,i)=>`<g data-film="${i}" transform="translate(${89+i*382} 555)">${R(0,0,364,98,['#492d62','#2d2845','#d57553'][i],5)}${I(filmImages[i],0,0,364,98)}${R(0,49,364,49,'#160d2866')}${R(0,0,364,98,'#160d2820',5,`data-film-focus stroke="${i===0?'#ffe3be':'transparent'}" stroke-width="3"`)}${T(17,76,film.name,22,'font-weight="600" letter-spacing="-1"')}${T(17,92,['01 / FEATURE FILM','02 / SERIES','03 / DOCUMENTARY'][i],7,'fill="#f6e5dc" letter-spacing="1"')}</g>`).join('')}</g>
 </g>`;}
function objectsArt(id){return `<defs><clipPath id="${id}-shop"><rect x="16" y="168" width="952" height="514" rx="0"/></clipPath><linearGradient id="${id}-shop-shade" x1="0" y1="0" x2="0" y2="1"><stop offset=".48" stop-color="#152820" stop-opacity="0"/><stop offset="1" stop-color="#152820" stop-opacity=".64"/></linearGradient></defs><g fill="#26321d">
 <g data-art-type fill="#eef2da">${T(8,111,'Find your signal.',92,'font-weight="550" letter-spacing="-5.5"')}${T(587,151,'Choose with clarity.',39,'font-family="Cormorant,Georgia,serif" font-style="italic" letter-spacing="-1.5"')}</g>
 <g data-art-layer="ui"><g clip-path="url(#${id}-shop)">${I('objects-digital-campaign.webp',16,168,952,514)}${R(16,168,952,514,'url(#'+id+'-shop-shade)')}</g>
 ${R(16,168,952,57,'#fffdf4')}${T(40,205,'objects /',23,'font-weight="700" letter-spacing="-1.2"')}${T(279,203,'추천　　오디오　　웨어　　캐리',11,'fill="#626c62"')}${T(941,203,'검색　　비교 0　　장바구니 0',10,'fill="#626c62" text-anchor="end"')}
 ${[0,1,2].map((i)=>`<rect data-product-focus="${i}" x="${[43,328,676][i]}" y="${[270,302,252][i]}" width="${[280,344,264][i]}" height="${[318,348,316][i]}" rx="6" fill="none" stroke="#f5f3df" stroke-width="2.2" opacity="${i===0?1:0}"/>`).join('')}
 ${R(16,620,952,122,'#faf9ed')}${T(40,651,'추천 컬렉션 / 구성 예시',8,'fill="#7b806f" letter-spacing="1.5"')}${T(40,694,products[0].name,27,'data-product-title font-weight="600" letter-spacing="-1"')}${T(40,719,products[0].kr,11,'data-product-kr fill="#707768"')}${T(555,660,'선택 옵션',8,'fill="#7b806f"')}${T(555,694,products[0].color,12,'data-product-color fill="#4c574a"')}${T(754,695,products[0].price+'원',22,'data-product-price font-weight="550" text-anchor="end"')}${R(790,651,151,64,'#29351e',3)}${T(865,689,'옵션 살펴보기　↗',11,'fill="#f5f4de" text-anchor="middle"')}
 </g></g>`;}
function relayArt(id){const tasks=[['서비스 구조 정리','UX / 지민','핵심'],['탐색 화면 설계','UI / 서연','높음'],['컴포넌트 정리','SYSTEM / 도윤','보통'],['접근성 검토','QA / 하린','핵심'],['프로토타입 리뷰','TEAM / 전체','높음'],['가이드 업데이트','SYSTEM / 서연','보통']];return `<g fill="#44322d">
 <g data-art-type fill="#f4e9db">${T(20,105,'Work, in sync.',92,'font-weight="550" letter-spacing="-5"')}</g>
 <g data-art-layer="ui"><g transform="translate(18 124) rotate(-1 610 280)">${R(9,14,1230,567,'#942f22',12,'opacity=".17"')}${R(0,0,1230,567,'#fff8ed',10)}${R(0,0,191,567,'#382a29',10)}${R(172,0,19,567,'#382a29')}
 ${T(23,47,'relay',32,'fill="#fff0d7" font-weight="650" letter-spacing="-2"')}${T(23,85,'ROOT4 / TEAM SPACE',8,'fill="#c7ada2" letter-spacing="1.4"')}
 ${['워크스페이스','프로젝트','내 업무','인사이트','파일'].map((s,i)=>`${i===1?R(11,130+i*43,169,34,'#61504a',5):''}${T(29,153+i*43,s,12,`fill="${i===1?'#fff0d8':'#ac948b'}"`)}`).join('')}
 ${T(215,35,'프로젝트 / 디지털 경험 디자인',10,'fill="#a48d7c"')}${T(215,76,'더 나은 경험을 만드는 일',29,'font-weight="550" letter-spacing="-1.5"')}${T(215,101,'서로의 맥락을 놓치지 않고, 오늘의 일을 함께 이어갑니다.',11,'fill="#ac9384"')}
 <g fill="#e09a7d">${[0,1,2].map(i=>`<circle cx="${1090+i*25}" cy="65" r="17" fill="${['#e6bca6','#c8b3a2','#dfcdba'][i]}" stroke="#fff8ed" stroke-width="2"/>${T(1090+i*25,69,['JM','SY','DY'][i],8,'fill="#785b4c" text-anchor="middle"')}`).join('')}</g>
 <path d="M215 128H1200" stroke="#e9dacb"/>${R(214,143,190,30,'#f1dfcd',5)}${T(234,163,'▦ 상태별　　◎ 담당자별',10,'fill="#8e604c"')}${T(1198,161,'필터　　우선순위　　＋ 업무 추가',10,'fill="#a6846e" text-anchor="end"')}
 <g data-relay-view="board">${['할 일','진행 중','검토'].map((s,col)=>`<g transform="translate(${215+col*332} 202)">${T(0,0,s,12,'fill="#9c7762"')}${T(287,0,'02',9,'fill="#bba08b" text-anchor="end"')}${tasks.slice(col*2,col*2+2).map(([title,owner,priority],row)=>`<g transform="translate(0 ${20+row*142})">${R(0,0,314,127,['#f6eadb','#f6e4d7','#ebe9da'][col],7)}${T(17,26,['기획','디자인','리뷰'][col],8,'fill="#b5846c" letter-spacing="1"')}${T(17,58,title,16,'letter-spacing="-.6" font-weight="550"')}${T(17,98,owner,9,'fill="#a18473"')}${R(252,84,44,22,'#fff8ed',11)}${T(274,99,priority,8,'fill="#a18473" text-anchor="middle"')}</g>`).join('')}</g>`).join('')}</g>
 <g data-relay-view="owners" opacity="0">${['지민 / UX','서연 / UI','도윤 / SYSTEM','하린 / QA'].map((owner,i)=>`<g transform="translate(${215+(i%2)*493} ${202+Math.floor(i/2)*168})">${R(0,0,462,144,['#f6eadb','#f6e4d7','#ebe9da','#eee3d7'][i],8)}<circle cx="39" cy="42" r="19" fill="${['#c7d2a3','#e7ad8d','#d6b4aa','#cebda8'][i]}"/>${T(39,46,['JM','SY','DY','HR'][i],8,'fill="#735345" text-anchor="middle"')}${T(70,38,owner,14,'font-weight="550"')}${T(70,59,['사용자 흐름 · 2개 업무','화면 설계 · 2개 업무','컴포넌트 · 1개 업무','접근성 · 1개 업무'][i],9,'fill="#a18473"')}${R(20,93,390,8,'#ead7c5',4)}${R(20,93,[258,304,182,218][i],8,['#9aaa76','#d9886b','#b18b81','#ae967c'][i],4)}${T(430,103,['66%','78%','47%','56%'][i],9,'fill="#92705f" text-anchor="end"')}</g>`).join('')}</g>
 </g></g>${T(1205,753,'A SHARED CONTEXT. A BETTER FLOW.',9,'fill="#d7b1a0" text-anchor="end" letter-spacing="2"')}
 </g>`;}
const views=['0 0 1000 780','0 0 1000 780','0 0 1280 690','0 0 1000 780','0 0 1280 740'];
const art=[connectArt,financeArt,frameArt,objectsArt,relayArt];
export function projectObject(index,id){return `<svg class="project-object" width="100%" height="100%" viewBox="${views[index]}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g font-family="Manrope,Arial,sans-serif">${art[index](id)}</g></svg>`;}
let instance=0;
export function projectVisual(index){const id='cover-'+instance++;return `<svg class="project-art" viewBox="0 0 1280 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><svg x="45" y="35" width="1190" height="790">${projectObject(index,id)}</svg>${T(45,863,'ROOT4 / DIGITAL EXPERIENCE — 구성 예시',9,`font-family="Manrope,Arial,sans-serif" fill="#b9c7c5" letter-spacing="1.6"`)}</svg>`;}
