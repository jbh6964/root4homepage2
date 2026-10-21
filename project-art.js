import {projects} from './projects.js';

// The same artwork is used on the journey, in case studies, and on mobile.
// Type and illustrations remain vector geometry; product photography is framed
// at its native resolution rather than being enlarged across the entire world.
export const projectPalettes=[
 ['#ebe6d8','#263c34','#a8b69a'],['#e9e8d9','#344831','#a3b28b'],
 ['#293dcc','#edf0dc','#d5f269'],['#e6dfea','#783f45','#ef8e6d'],
 ['#eee0ba','#743d31','#c29a65'],['#234dc0','#f0eddf','#bfd2e4']
];
const serif='Cormorant Garamond,Georgia,serif';
const sans='Manrope,Arial,sans-serif';
const txt=(x,y,text,size,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${text}</text>`;
const lines=(x,y,width,count,color,step=5)=>Array.from({length:count},(_,i)=>`<path d="M${x} ${y+i*step}h${width*(i===count-1?.63:1)}" stroke="${color}" stroke-width=".65"/>`).join('');
const barcode=(x,y,color)=>`<g stroke="${color}">${Array.from({length:27},(_,i)=>`<path d="M${x+i*2.1} ${y}v${i%6===0?25:19}" stroke-width="${i%4===0?2:1}"/>`).join('')}</g>`;
function definitions(id){return `<defs>
 <linearGradient id="${id}-foil" x1="0" y1="0" x2="1" y2=".9"><stop stop-color="#faf8e8"/><stop offset=".22" stop-color="#b1beb0"/><stop offset=".43" stop-color="#f7f7e7"/><stop offset=".51" stop-color="#819789"/><stop offset=".74" stop-color="#cfd9c5"/><stop offset="1" stop-color="#6e8875"/></linearGradient>
 <linearGradient id="${id}-edge"><stop stop-color="#304f41"/><stop offset=".5" stop-color="#b8c7b1"/><stop offset="1" stop-color="#e8edde"/></linearGradient>
 <radialGradient id="${id}-shadow"><stop stop-color="#2b342c" stop-opacity=".25"/><stop offset="1" stop-color="#2b342c" stop-opacity="0"/></radialGradient>
 <linearGradient id="${id}-vinyl" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#141926"/><stop offset=".28" stop-color="#242c43"/><stop offset=".42" stop-color="#4b5370"/><stop offset=".47" stop-color="#22293c"/><stop offset=".77" stop-color="#111724"/><stop offset=".87" stop-color="#3a4157"/><stop offset="1" stop-color="#161c29"/></linearGradient>
 <linearGradient id="${id}-paper" x1="0" y1="0" x2="1" y2=".3"><stop stop-color="#ded9c9"/><stop offset=".07" stop-color="#f8f4e7"/><stop offset=".95" stop-color="#f1eddd"/><stop offset="1" stop-color="#d8d3c1"/></linearGradient>
 <linearGradient id="${id}-leather" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d8b37b"/><stop offset=".5" stop-color="#bd8f58"/><stop offset="1" stop-color="#a47745"/></linearGradient>
 <linearGradient id="${id}-brass"><stop stop-color="#795829"/><stop offset=".3" stop-color="#f3d69b"/><stop offset=".55" stop-color="#ad8145"/><stop offset=".78" stop-color="#f5da9b"/><stop offset="1" stop-color="#8c632c"/></linearGradient>
 <pattern id="${id}-stock" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 .5h1.4M2 2.8h.8" stroke="#574c37" stroke-width=".4" opacity=".16"/></pattern>
 <pattern id="${id}-cloth" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0v3M0 0h3" stroke="#eac59f" stroke-width=".45" opacity=".1"/></pattern>
 </defs>`;}
function foil(id){return `<ellipse cx="531" cy="467" rx="185" ry="23" fill="url(#${id}-shadow)"/>
 <g transform="translate(0 -5)"><path d="M452 70 696 149 568 286 661 408 451 465 326 344 471 224 345 130Z" fill="url(#${id}-foil)"/>
 <path d="m452 70 19 154-126-94Z" fill="#d9dfca"/><path d="m452 70 244 79-225 75Z" fill="url(#${id}-foil)"/>
 <path d="m471 224 225-75-128 137Z" fill="#7c9683" opacity=".62"/><path d="m471 224 97 62-117 179Z" fill="url(#${id}-edge)"/>
 <path d="m471 224-145 120 125 121Z" fill="url(#${id}-foil)"/><path d="m568 286 93 122-210 57Z" fill="url(#${id}-foil)"/>
 <path d="m345 130 126 94 97 62-117 179m20-241 225-75M326 344l125 121 210-57" fill="none" stroke="#f8f7e9" stroke-width="1.1"/>
 <path d="m452 70 19 154-145 120M568 286l93 122" fill="none" stroke="#59715e" stroke-width=".6"/>
 <path d="m452 70 244 79-128 137 93 122-210 57-125-121 145-120-126-94Z" fill="none" stroke="#405c48" stroke-width=".5" opacity=".3"/></g>
 <g fill="none" stroke="#7c8b75" stroke-width=".5"><path d="M355 61h-20v20M697 446h20v-20"/><path d="M737 88v300" stroke-dasharray="1 5"/></g>
 ${txt(348,52,'STUDY OF A SHARED FORM',5,'fill="#63735f" letter-spacing="1.5"')}${txt(718,414,'F.01',6,'fill="#63735f" transform="rotate(-90 718 414)"')}`;}
function product(index){const right=index===3;return `<svg x="287" y="0" width="493" height="520" viewBox="${right?768:0} 0 768 1024" preserveAspectRatio="xMidYMid slice" overflow="hidden"><image href="/assets/product-studies.png" width="1536" height="1024"/></svg><path d="M287 0V520" stroke="${right?'#bda9be':'#a8b08d'}" stroke-width=".6"/>
 ${txt(31,252,right?'Objects for':'Considered by',15,`fill="${right?'#783f45':'#344831'}" font-family="${serif}" font-style="italic"`)}
 ${txt(31,272,right?'the everyday.':'nature.',15,`fill="${right?'#783f45':'#344831'}" font-family="${serif}" font-style="italic"`)}
 <path d="M32 307h34" stroke="${right?'#783f45':'#344831'}" stroke-width=".7"/>
 ${txt(32,335,right?'MATERIAL / LIGHT / FEELING':'FORMULA / RITUAL / BALANCE',5,`fill="${right?'#783f45':'#344831'}" letter-spacing="1"`)}
 ${right?'<path d="M40 386v-22m-10 11h20m-17-7 14 14m0-14-14 14" stroke="#a76972" stroke-width=".6"/>':'<path d="M34 394c34-26 27-52 52-66 8 33-12 54-52 66Zm0 0 50-63" fill="none" stroke="#80926f" stroke-width=".7"/>'}`;}
function vinyl(id){return `<ellipse cx="557" cy="457" rx="185" ry="22" fill="url(#${id}-shadow)"/>
 <g transform="translate(555 296)"><circle r="178" fill="#141a2b"/><circle r="176" fill="url(#${id}-vinyl)"/>
 ${Array.from({length:49},(_,i)=>`<circle r="${64+i*2.15}" fill="none" stroke="${i%3===0?'#101626':'#707a8e'}" stroke-width="${i%3===0?1:.45}" opacity="${i%3===0?.65:.47}"/>`).join('')}
 <path d="M-126-122A175 175 0 0 1 58-165L20-59A62 62 0 0 0-45-42Z" fill="#f6f8ff" opacity=".055"/>
 <circle r="58" fill="#d5f269"/><circle r="52" fill="none" stroke="#425440" stroke-width=".6"/>
 ${txt(-38,-15,'OFFBEAT',10,'fill="#253926" font-family="Manrope,Arial,sans-serif" font-weight="700" letter-spacing="-.5"')}
 ${txt(-31,6,'SIDE A / 33⅓',6,'fill="#425440" letter-spacing=".4"')}<path d="M-32 17h64" stroke="#617440" stroke-width=".5"/>
 ${txt(-22,32,'VOL. 001',5,'fill="#425440" letter-spacing="1"')}<circle r="4" fill="#1a2031"/><circle r="1.2" fill="#adb8c1"/></g>
 <path d="M24 375c98-88 177 82 283-21s130 28 220-46" fill="none" stroke="#bcc7ff" stroke-width=".8" opacity=".7"/>
 ${barcode(32,402,'#adbfff')}${txt(32,443,'SOUND WITHOUT A STRAIGHT LINE.',5,'fill="#c7d4ff" letter-spacing="1"')}`;}
function hotel(id){return `<ellipse cx="499" cy="453" rx="205" ry="27" fill="url(#${id}-shadow)"/>
 <g transform="translate(440 64) rotate(10 110 180)">
 <path d="M5 9H232V368H5Z" fill="#624432" opacity=".2"/><path d="M-5 1H224V358H-5Z" fill="#c5ba99"/><path d="M-4 6H227V362H-4Z" fill="url(#${id}-paper)"/>
 ${[0,1,2,3].map(i=>`<path d="M0 ${351+i*2.1}H226" stroke="#bdb293" stroke-width=".5"/>`).join('')}
 <path d="M0 0H228V353H0Z" fill="#713e33"/><path d="M0 0H228V353H0Z" fill="url(#${id}-cloth)"/><path d="M12 0V353" stroke="#4c2f25" stroke-width="2"/><path d="M16 0V353" stroke="#b07857" stroke-width=".7"/>
 <path d="M33 25H205V329H33Z" fill="none" stroke="#d0ad79" stroke-width=".55"/>
 ${txt(48,112,'still',71,`font-family="${serif}" font-style="italic" fill="#ead4a7"`)}${txt(48,170,'room',67,`font-family="${serif}" font-style="italic" fill="#ead4a7"`)}
 <path d="M99 217q20-37 40 0m-35 0v23h30v-23m-20 23v-14h10v14" fill="none" stroke="#d0ad79" stroke-width=".8"/>
 ${txt(59,287,'THE ART OF TAKING YOUR TIME',4.5,'fill="#ddbc87" letter-spacing=".6"')}${txt(84,309,'GUEST JOURNAL',5,'fill="#ddbc87" letter-spacing="1.5"')}</g>
 <g transform="translate(276 270) rotate(-14 72 90)"><path d="M3 11Q3-7 20-7H126Q143-7 143 11V169Q143 186 126 186H20Q3 186 3 169Z" fill="#765030" opacity=".2"/>
 <rect width="140" height="180" rx="17" fill="url(#${id}-leather)" stroke="#aa7945" stroke-width="1.1"/>
 <rect x="7" y="7" width="126" height="166" rx="12" fill="none" stroke="#ecd09d" stroke-width=".7" stroke-dasharray="1.7 2.5"/>
 <circle cx="70" cy="21" r="8" fill="#977039" stroke="#e9c88d" stroke-width="1.7"/><circle cx="70" cy="21" r="4.5" fill="#eee0ba"/>
 <ellipse cx="72" cy="-13" rx="17" ry="30" fill="none" stroke="url(#${id}-brass)" stroke-width="5"/>
 ${txt(24,118,'204',53,`font-family="${serif}" fill="#f0cea0"`)}${txt(24,117,'204',53,`font-family="${serif}" fill="#75512c"`)}${txt(32,151,'STILL ROOM',6,'fill="#805e34" letter-spacing="1.8"')}</g>`;}
function journal(id){return `<ellipse cx="512" cy="456" rx="227" ry="27" fill="url(#${id}-shadow)"/>
 <g transform="translate(356 58) rotate(9 160 195)">
 <path d="M4 14H348V386H4Z" fill="#14275c" opacity=".27"/><path d="M-4 7H338V377H-4Z" fill="#d6d2c4"/><path d="M-5 3H340V373H-5Z" fill="url(#${id}-paper)"/>
 ${Array.from({length:5},(_,i)=>`<path d="M0 ${364+i*1.7}H340" stroke="#b0b7b9" stroke-width=".55"/>`).join('')}
 <path d="M0 0H340V362H0Z" fill="url(#${id}-paper)"/><path d="M11 0V362" stroke="#d0ccbc" stroke-width="1"/>
 <path d="M28 46H317M28 303H317" stroke="#294db2" stroke-width=".7"/>
 ${txt(27,34,'INDEX',21,`fill="#284eb9" font-family="${sans}" font-weight="650" letter-spacing="-1"`)}${txt(222,32,'ISSUE N° 006',6,'fill="#284eb9" letter-spacing="1"')}
 ${txt(20,268,'06',256,`fill="#2850bc" font-family="${serif}" letter-spacing="-19"`)}
 <g transform="translate(250 172)" stroke="#7390c3" fill="none" stroke-width=".6">${Array.from({length:16},(_,i)=>`<ellipse rx="${10+i*3}" ry="${45+i*1.7}" transform="rotate(${i*11.25})"/>`).join('')}</g>
 ${lines(28,322,78,4,'#6a7a96',4)}${lines(123,322,78,4,'#6a7a96',4)}${txt(232,341,'NEW PERSPECTIVES',5,'fill="#284eb9" letter-spacing=".6"')}</g>
 <g transform="translate(183 331) rotate(-9)"><path d="M5 7H245V126H5Z" fill="#152652" opacity=".14"/><path d="M0 0H240V120H0Z" fill="#bbd0df"/><path d="M15 15H225V105H15Z" fill="none" stroke="#5275a5" stroke-width=".5"/>
 ${txt(25,76,'Aa—Zz',49,`fill="#2c52ad" font-family="${serif}" font-style="italic" letter-spacing="-2"`)}${txt(26,96,'A CONTINUOUS EXPLORATION',4.5,'fill="#466a9a" letter-spacing="1"')}</g>`;}
export function artBody(index,id){const p=projects[index],[bg,fg]=projectPalettes[index],photo=index===1||index===3;
 let typography='';
 if(index===0)typography=txt(27,147,'form',112,`fill="${fg}" letter-spacing="-6"`)+txt(31,218,'&amp; other.',65,`fill="${fg}" font-style="italic" letter-spacing="-3"`)+txt(32,290,'Independent minds.',14,`fill="${fg}" font-style="italic"`)+txt(32,309,'Shared possibilities.',14,`fill="${fg}" font-style="italic"`);
 if(index===1)typography=txt(28,142,'mori.',100,`fill="${fg}" letter-spacing="-4"`);
 if(index===2)typography=txt(27,148,'OFF/',112,`fill="${fg}" font-family="${sans}" font-weight="750" letter-spacing="-9"`)+txt(27,250,'BEAT',112,`fill="${fg}" font-family="${sans}" font-weight="750" letter-spacing="-9"`);
 if(index===3)typography=txt(27,148,'luma',114,`fill="${fg}" letter-spacing="-5"`)+txt(32,184,'a softer kind of bright.',14,`fill="${fg}" font-style="italic"`);
 if(index===4)typography=txt(29,145,'Stay',108,`fill="${fg}" font-style="italic" letter-spacing="-4"`)+txt(29,232,'a little.',94,`fill="${fg}" font-style="italic" letter-spacing="-4"`)+txt(33,292,'Somewhere between',13,`fill="${fg}" font-style="italic"`)+txt(33,309,'a place and a feeling.',13,`fill="${fg}" font-style="italic"`);
 if(index===5)typography=txt(27,142,'Index',105,`fill="${fg}" font-style="italic" letter-spacing="-4"`)+txt(32,182,'IDEAS IN GOOD COMPANY.',6,`fill="${fg}" font-family="${sans}" letter-spacing="1.5"`)+`<path d="M32 236h156M32 247h156" stroke="#a7bfec" stroke-width=".4"/>`+txt(32,280,'A journal of',18,`fill="${fg}" font-style="italic"`)+txt(32,301,'new perspectives.',18,`fill="${fg}" font-style="italic"`);
 const art=index===0?foil(id):photo?product(index):index===2?vinyl(id):index===4?hotel(id):journal(id);
 return `${definitions(id)}<path d="M0 0H780V520H0Z" fill="${bg}"/>${!photo?`<path d="M0 0H780V520H0Z" fill="url(#${id}-stock)"/>`:''}${art}<g font-family="${serif}">${typography}</g><g font-family="${sans}" fill="${fg}">${txt(32,34,p.category,6.5,'letter-spacing="1.5"')}${txt(32,455,photo?'BRAND STUDY / 0'+(index+1):p.title.split('\n')[0],photo?5.5:9,`font-family="${photo?sans:serif}" ${photo?'letter-spacing="1"':'font-style="italic"'}`)}<path d="M32 473H${photo?254:747}" stroke="${fg}" stroke-width=".45" opacity=".4"/>${txt(32,493,'ROOT4 STUDIO / '+p.year,5,'letter-spacing="1.2"')}${txt(photo?229:717,493,'0'+(index+1)+' ↗',8)}</g>`;
}
let instance=0;
export function projectVisual(index){return `<svg class="project-art" viewBox="0 0 780 520" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${artBody(index,'art-'+instance++)}</svg>`;}

// Small identity marks are vector drawings, shared by stationery and UI.
export function brandMark(index){
 const bodies=[
  '<path d="M12 13h29L27 31H12Zm0 21h15L12 53Zm18 0h21L30 58Z" fill="currentColor"/>',
  '<path d="M17 55C49 49 55 24 49 8 25 16 10 33 17 55Zm0 0 30-43M25 43l18-3M32 32l-3-11" fill="none" stroke="currentColor" stroke-width="1.3"/>',
  '<g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 32c7-44 13 44 20 0s13 44 20 0 13 44 20 0"/><path d="M4 38c7-44 13 44 20 0s13 44 20 0 13 44 20 0" opacity=".4"/></g>',
  `<g stroke="currentColor" stroke-width="1.4">${Array.from({length:12},(_,i)=>`<path d="M32 6V22" transform="rotate(${i*30} 32 32)"/>`).join('')}<circle cx="32" cy="32" r="3" fill="none"/></g>`,
  '<g fill="none" stroke="currentColor" stroke-width="1.1"><path d="M13 51V30a19 19 0 0 1 38 0v21ZM19 51V30a13 13 0 0 1 26 0v21M26 51V39a6 6 0 0 1 12 0v12M8 56h48"/></g>',
  `<g transform="translate(32 32)" fill="none" stroke="currentColor" stroke-width=".7">${Array.from({length:12},(_,i)=>`<ellipse rx="12" ry="26" transform="rotate(${i*15})"/>`).join('')}</g>`
 ];return `<svg class="brand-mark" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${bodies[index]}</svg>`;
}
