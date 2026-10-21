// Original SVG service screens. Interface data and project names are examples.
export const projectPalettes=[['#e8f1e9','#254e42','#b9e5ad'],['#edeaf8','#504191','#bfb1f0'],['#172a32','#e6ede1','#d4e6a2']];
const sans='Manrope,Arial,sans-serif';
const text=(x,y,s,size=14,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${s}</text>`;
const rect=(x,y,w,h,fill,rx=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const pill=(x,y,w,label,fill,color)=>`${rect(x,y,w,28,fill,14)}${text(x+13,y+18,label,9,`fill="${color}"`)}`;
function defs(id){return `<defs><linearGradient id="${id}-mint" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c3e9ae"/><stop offset="1" stop-color="#81bca6"/></linearGradient><linearGradient id="${id}-violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c7b8fa"/><stop offset="1" stop-color="#8378d1"/></linearGradient><linearGradient id="${id}-sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a9c9c1"/><stop offset=".5" stop-color="#516b73"/><stop offset="1" stop-color="#23353d"/></linearGradient><linearGradient id="${id}-shade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#14282c" stop-opacity="0"/><stop offset="1" stop-color="#14282c" stop-opacity=".96"/></linearGradient></defs>`;}
function telecom(id){return `<g transform="translate(24 72) rotate(-4 270 225)">
 ${rect(7,12,523,390,'#031411',16,'opacity=".16"')}${rect(0,0,523,390,'#eef3e9',16,'stroke="#fbfff5" stroke-width="1"')}${rect(0,0,523,37,'#dbe5d7',16)}${rect(0,20,523,17,'#dbe5d7')}
 <g fill="#839b8a"><circle cx="17" cy="19" r="2.5"/><circle cx="26" cy="19" r="2.5"/><circle cx="35" cy="19" r="2.5"/></g>${text(213,22,'connect / WEB',7,'fill="#79917c" letter-spacing="1"')}
 ${text(26,77,'connect.',24,'fill="#2b5142" font-weight="700" letter-spacing="-1.2"')}${text(329,75,'요금제　혜택　고객지원',8,'fill="#647e68"')}
 ${pill(28,108,110,'YOUR NEXT CONNECTION','#dae9d0','#5e7858')}${text(27,175,'가볍게 시작하는',28,'fill="#244f3b" letter-spacing="-1.2"')}${text(27,211,'나다운 연결.',28,'fill="#244f3b" letter-spacing="-1.2"')}
 ${text(28,242,'일상에 맞는 요금제를 찾아보세요.',9,'fill="#789078"')}${pill(28,265,119,'요금제 알아보기　↗','#2d5a43','#edf2df')}
 <g transform="translate(385 190)"><circle r="79" fill="none" stroke="#a9c595" stroke-width=".7"/><ellipse rx="53" ry="78" fill="none" stroke="#8eaf8b" stroke-width=".7" transform="rotate(30)"/><ellipse rx="27" ry="79" fill="none" stroke="#78a38c" stroke-width="1.2" transform="rotate(30)"/><circle r="20" fill="url(#${id}-mint)"/></g>
 ${rect(28,325,215,41,'#dfe9d8',8)}${text(42,342,'이번 달 데이터',7,'fill="#6e876b"')}${text(42,357,'12.4 GB / 30 GB',10,'fill="#34573e" font-weight="600"')}
 ${rect(255,325,240,41,'#e6ece0',8)}${text(268,350,'새로운 일상을 위한 혜택　↗',10,'fill="#587554"')}
 </g>
 <g transform="translate(445 207) rotate(7 102 175)">
 ${rect(3,7,201,353,'#061a13',27,'opacity=".25"')}${rect(0,0,201,353,'#284c3d',26)}${rect(5,5,191,343,'#f1f5e9',22)}${rect(77,10,47,10,'#284c3d',7)}
 ${text(18,36,'9:41',6,'fill="#61745d"')}${text(18,68,'My connect',16,'fill="#355b40" font-weight="650" letter-spacing="-.6"')}${text(18,91,'오늘도 나답게 연결되는 하루',7,'fill="#819375"')}
 ${rect(17,113,167,129,'url(#'+id+'-mint)',15)}${text(31,137,'남은 데이터',8,'fill="#4c7152"')}${text(31,174,'17.6',34,'fill="#2b5039" font-weight="600" letter-spacing="-2"')}${text(119,172,'GB',10,'fill="#577456"')}
 <path d="M32 201H166" stroke="#e3efd7" stroke-width="5" stroke-linecap="round"/><path d="M32 201H112" stroke="#538267" stroke-width="5" stroke-linecap="round"/>${text(31,224,'충분해요. 여유롭게 즐겨보세요.',7,'fill="#5d7e59"')}
 ${['요금 조회','선물하기','고객지원'].map((s,i)=>`${rect(18+i*57,259,51,48,'#e2ebda',9)}${text(25+i*57,289,s,7,'fill="#64805c"')}`).join('')}
 <path d="M18 322H183" stroke="#d4dfca" stroke-width=".7"/>${text(28,337,'홈　　　혜택　　　마이',7,'fill="#76916a"')}</g>
 ${pill(109,498,173,'WEB + APP / UI COMPOSITION','#305641','#d5e6c7')}`;}
function finance(id){return `<g transform="translate(196 27) rotate(5 114 249)">
 ${rect(6,11,233,482,'#100f2a',32,'opacity=".22"')}${rect(0,0,233,482,'#302d4b',31)}${rect(5,5,223,472,'#f3f1fa',27)}${rect(91,10,52,11,'#302d4b',7)}
 ${text(19,36,'9:41',6,'fill="#8a80a6"')}${text(20,73,'balance',24,'fill="#60518a" font-weight="600" letter-spacing="-1"')}${text(21,98,'나의 속도로 만드는 금융',8,'fill="#a296b2"')}
 ${rect(18,120,197,131,'url(#'+id+'-violet)',16)}${text(34,144,'총 자산 · 금액 예시',8,'fill="#665790"')}${text(33,180,'12,480,000',25,'fill="#42366c" font-weight="600" letter-spacing="-1.5"')}${text(183,180,'원',9,'fill="#665790"')}
 ${pill(32,207,73,'자산 보기　↗','#e3dcf8','#6b5c91')}${pill(112,207,87,'바로 이체하기','#695b9c','#f3effc')}
 ${text(22,286,'이번 달의 흐름',11,'fill="#625485" font-weight="600"')}${text(22,305,'일상 지출을 한눈에',7,'fill="#a397b4"')}
 ${[37,54,43,71,48,85,62].map((h,i)=>rect(23+i*27,407-h,14,h,i===5?'#8772bf':'#cfc4e7',6)).join('')}${text(23,426,'월　　　화　　　수　　　목　　　금',6,'fill="#a99bbb"')}
 <path d="M21 444H212" stroke="#ddd6eb" stroke-width=".7"/>${text(31,463,'홈　　　내역　　　목표　　　전체',7,'fill="#8f80a6"')}</g>
 <g transform="translate(31 231) rotate(-9 111 76)">${rect(5,7,225,147,'#141027',17,'opacity=".16"')}${rect(0,0,225,147,'#4b416b',17)}${text(21,34,'WEEKLY INSIGHT',8,'fill="#c1b3dc" letter-spacing="1"')}${text(21,62,'나를 위한 균형.',19,'fill="#f0e8ff" letter-spacing="-1"')}<path d="M21 118c25 0 22-41 49-28s32-37 55-20 37-22 75-34" stroke="#beadea" stroke-width="2" fill="none"/><circle cx="200" cy="36" r="3" fill="#e7dcff"/></g>
 <g transform="translate(345 363) rotate(11)">${rect(0,0,158,123,'#e2dbf4',14)}${text(18,29,'MY GOAL / 구성 예시',7,'fill="#9988b6"')}${text(18,55,'조금씩, 꾸준히.',15,'fill="#665284"')}<circle cx="123" cy="88" r="17" fill="none" stroke="#c5b6df" stroke-width="3"/><path d="M123 71a17 17 0 1 1-16 23" fill="none" stroke="#8d76b6" stroke-width="3" stroke-linecap="round"/>${text(18,94,'목표 저축',9,'fill="#9d8ab5"')}</g>`;}
function landscape(id,x,y,w,h){return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" overflow="hidden">${rect(0,0,800,450,'url(#'+id+'-sky)')}<circle cx="580" cy="111" r="93" fill="#d9d7ad" opacity=".7"/><path d="M0 343 208 104 413 307 593 189 800 344V450H0Z" fill="#597474"/><path d="M0 450 0 340 218 263 381 407 623 290 800 361V450Z" fill="#354e55"/><path d="M0 450 165 374 373 450 656 345 800 404V450Z" fill="#223c45"/>${Array.from({length:9},(_,i)=>`<path d="M0 ${383+i*9}C250 ${342+i*8} 470 ${473+i*3} 800 ${348+i*10}" fill="none" stroke="#bad3b4" stroke-width=".7" opacity=".16"/>`).join('')}</svg>`;}
function television(id){return `<g transform="translate(26 59) rotate(-3 327 196)">
 ${rect(8,14,655,390,'#061118',15,'opacity=".28"')}${rect(0,0,655,390,'#21343c',14,'stroke="#8da3a1" stroke-width="1.2"')}
 ${landscape(id,6,6,643,378)}${rect(6,6,643,378,'url(#'+id+'-shade)',10)}
 ${text(28,41,'FRAME',17,'fill="#e2e7d6" font-weight="600" letter-spacing="2"')}${text(186,39,'홈　　발견　　이어보기',8,'fill="#c5d0c1"')}${text(577,39,'검색　○',8,'fill="#dce5d4"')}
 ${pill(28,138,86,'ORIGINAL / DEMO','#c6d7a8','#405b55')}${text(26,202,'BEYOND',45,'fill="#edf0dd" font-weight="500" letter-spacing="4"')}${text(29,228,'아직 만나지 못한 장면들',11,'fill="#cbd6c4"')}${pill(28,251,98,'이어보기　▷','#e1e9cb','#344a46')}
 ${text(29,309,'지금 발견하는 이야기',10,'fill="#d4dfc8"')}
 ${['AFTER HOURS','A QUIET DAY','OPEN WATER','NEW PERSPECTIVE'].map((s,i)=>`${rect(28+i*151,326,140,34,['#bac4a4','#687e7c','#506f78','#818d7e'][i],3,i===0?'stroke="#e3ebc9" stroke-width="2.2"':'')}${text(36+i*151,347,s,7,`fill="${i===0?'#4a6159':'#e0e7d8'}" letter-spacing=".5"`)}`).join('')}
 </g>
 <g transform="translate(526 357) rotate(8)">${rect(4,6,119,139,'#071218',13,'opacity=".3"')}${rect(0,0,119,139,'#dae4ce',13)}${text(14,23,'CONTINUE',7,'fill="#6a7c65" letter-spacing="1"')}${landscape(id,9,35,101,59)}${text(13,110,'BEYOND',10,'fill="#465e55" font-weight="650"')}<path d="M14 124h88" stroke="#b4c5a5" stroke-width="2"/><path d="M14 124h53" stroke="#5b7966" stroke-width="2"/></g>
 <g transform="translate(120 463)">${['←','↑','→'].map((s,i)=>`${rect(i*38,0,29,27,'#b4c7b0',7)}${text(9+i*38,18,s,12,'fill="#3f5d54"')}`).join('')}${text(130,18,'FOCUS / TV INTERACTION',7,'fill="#b2c8b4" letter-spacing="1"')}</g>`;}
function body(index,id){return index===0?telecom(id):index===1?finance(id):television(id);}
const frames=['0 0 700 570','0 0 550 550','0 0 720 530'];
export function projectObject(index,id){return `<svg class="project-object" width="100%" height="100%" viewBox="${frames[index]}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs(id)}<g font-family="${sans}">${body(index,id)}</g></svg>`;}
let instance=0;
export function projectVisual(index){const id='screen-'+instance++,[bg]=projectPalettes[index];return `<svg class="project-art" viewBox="0 0 780 580" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${rect(0,0,780,580,bg)}<svg x="35" y="10" width="710" height="535">${projectObject(index,id)}</svg>${text(31,553,'ROOT4 / DIGITAL EXPERIENCE — 구성 예시',6,`font-family="${sans}" fill="${index===2?'#a0bba8':'#789080'}" letter-spacing="1"`)}</svg>`;}
export function serviceFragment(index){const [bg,fg,accent]=projectPalettes[index];return `<g font-family="${sans}">${rect(0,0,135,94,bg,11,'stroke="#ffffff30" stroke-width=".6"')}${rect(12,13,22,5,accent,2)}${text(12,39,['MY CONNECTION','MY BALANCE','NOW PLAYING'][index],7,`fill="${fg}" letter-spacing=".6"`)}<path d="M13 55h108M13 68h67" stroke="${fg}" stroke-width="2" opacity=".15"/>${index===1?'<path d="M13 76c25-33 37 20 63-19s26-9 45-25" stroke="#9d88c8" fill="none" stroke-width="1"/>':''}</g>`;}
