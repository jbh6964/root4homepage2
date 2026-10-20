// Illustrated spatial interludes. Every contour stays a native SVG path.
const copper='#ad512b',edge='#d98a52';
function rand(seed){let value=seed;return()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};}
function taperedRibbon(curves,startWidth,endWidth){
 const points=[],path='M'+curves[0][0].join(' ')+curves.map(c=>'C'+c.slice(1).flat().join(' ')).join('');
 for(let index=0;index<curves.length;index++)for(let step=0;step<=40;step++){
  if(index&&step===0)continue;const t=step/40,u=1-t,c=curves[index];
  const x=u*u*u*c[0][0]+3*u*u*t*c[1][0]+3*u*t*t*c[2][0]+t*t*t*c[3][0];
  const y=u*u*u*c[0][1]+3*u*u*t*c[1][1]+3*u*t*t*c[2][1]+t*t*t*c[3][1];
  const dx=3*u*u*(c[1][0]-c[0][0])+6*u*t*(c[2][0]-c[1][0])+3*t*t*(c[3][0]-c[2][0]);
  const dy=3*u*u*(c[1][1]-c[0][1])+6*u*t*(c[2][1]-c[1][1])+3*t*t*(c[3][1]-c[2][1]);
  const length=Math.hypot(dx,dy)||1,progress=(index+t)/curves.length,width=startWidth+(endWidth-startWidth)*progress;
  points.push({x,y,nx:-dy/length,ny:dx/length,width});
 }
 const side=(factor)=>points.map(p=>[p.x+p.nx*p.width*factor,p.y+p.ny*p.width*factor].map(v=>v.toFixed(3)).join(' '));
 const polygon=(factor)=>'M'+side(factor).join('L')+'L'+side(-factor).reverse().join('L')+'Z';
 return `<g data-flow-ribbon="true"><path d="${polygon(.5)}" fill="#713f2c"/><path d="${polygon(.46)}" fill="${copper}"/><path d="M${side(.36).join('L')}" fill="none" stroke="${edge}" stroke-width=".8"/><circle r="1.3" fill="#e5c49b"><animateMotion path="${path}" dur="18s" repeatCount="indefinite"/></circle></g>`;
}
function hatch(x,y,w,h,count=20,color='#65675c'){return Array.from({length:count},(_,i)=>`<path d="M${x+i*w/count} ${y}l${-h*.25} ${h}" fill="none" stroke="${color}" stroke-width=".45"/>`).join('');}
function stonework(x,y,w,h){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#9f9c8e"/>${Array.from({length:Math.ceil(h/13)},(_,row)=>`<path d="M${x} ${y+row*13}h${w}" fill="none" stroke="#73786c" stroke-width=".7"/>${Array.from({length:Math.ceil(w/23)},(_,col)=>`<path d="M${x+col*23+(row%2?11:0)} ${y+row*13}v13" stroke="#73786c" stroke-width=".5"/>`).join('')}`).join('')}`;}
function rail(path,posts){return `<path d="${path}" fill="none" stroke="#5e655c" stroke-width="2"/>${posts.map(([x,y])=>`<path d="M${x} ${y}v-14" stroke="#7d8173" stroke-width="1"/>`).join('')}`;}
function stars(){const random=rand(88);return Array.from({length:55},()=>`<circle cx="${random()*780}" cy="${random()*420}" r="${.3+random()*.7}" fill="#e6e0ca"/>`).join('');}
function paperCity(){return `
 <rect width="780" height="520" fill="#b7b8ac"/><path d="M0 120 260 55 500 90 780 20V0H0Z" fill="#bfc5b8"/>
 <g fill="#d5d0c0" stroke="#777e71" stroke-width=".8"><path d="M-40 520 25 90 119 17 172 520Z"/><path d="M119 17 143 98 195 520H172Z" fill="#a5a898"/><path d="M220 520 243-30 349-30 405 520Z"/><path d="M349-30 405 520 432 520 382 7Z" fill="#969d8e"/><path d="M610 520 649 85 765 40 820 520Z"/><path d="M649 85 672 520H610Z" fill="#a9ad9b"/></g>
 <path d="M247 55Q297-2 348 55V95H247Z" fill="#454f45"/><path d="M257 54Q295 8 337 54" fill="none" stroke="#c4c3b1" stroke-width="2"/>
 <g stroke="#8f9585" stroke-width=".7" fill="none"><path d="M48 152 87 122 133 498M76 68 59 512M252 105l-9 389M268 105l-9 389M365 105l35 402M687 115l30 390M710 107l30 390"/></g>
 <path d="M-20 251C101 155 55 369 233 290S405 133 441 230" fill="none" stroke="#6d776a" stroke-width="30"/><path d="M-20 251C101 155 55 369 233 290S405 133 441 230" fill="none" stroke="#c7c8b6" stroke-width="22"/><path d="M-20 248C101 152 55 366 233 287S405 130 441 227" fill="none" stroke="#ecdfc8" stroke-width="1.4"/>
 <g transform="translate(593 108) rotate(18)"><path d="M0 0H103V315H0Z" fill="#aaa58f" stroke="#707568"/><path d="M12 62Q28 27 42 62V156H12ZM57 62Q73 27 88 62V156H57Z" fill="#4c584a"/><path d="M12 174H88V185H12ZM12 212H88V223H12Z" fill="#d6c8ac"/>${hatch(9,235,85,65,16,'#7f8575')}</g>
 <path d="M0 440C127 314 303 480 451 341S646 354 800 260L800 302C631 395 583 302 464 386S120 374 0 477Z" fill="#abae9d" stroke="#6b7567" stroke-width="1.2"/>
 ${rail('M0 427C127 301 303 467 451 328S646 341 800 247',[[25,411],[64,402],[107,405],[150,418],[195,431],[245,438],[294,435],[344,412],[390,377],[432,342],[470,317],[513,314],[560,321],[610,325],[660,307],[711,278],[754,259]])}
 <path d="M0 477C147 377 304 489 464 386S631 395 800 302" fill="none" stroke="#c9c4ae" stroke-width="2"/>
 ${stonework(422,181,217,130)}
 <path d="M442 310V216Q442 161 529 155Q617 161 617 216V310H594V218Q594 185 530 183Q467 185 467 218V310Z" fill="#c5c1af" stroke="#606e60" stroke-width="1.2"/>
 ${hatch(424,190,15,116,7,'#596554')}${hatch(619,188,17,120,7,'#596554')}
 <path d="M420 181H639V190H420Z" fill="#dfd5bf" stroke="#74816e"/><path d="M415 178 529 144 645 178Z" fill="#8c6e4a" stroke="#5d6758"/>
 <path d="M420 178 529 150 640 178" fill="none" stroke="#ba9367" stroke-width="2"/>
 <g fill="#c7c3b2" stroke="#66725f" stroke-width=".8"><path d="M415 204V137L425 112 436 137V204Z"/><path d="M625 204V137L635 112 646 137V204Z"/></g>
 <g fill="#5b6759"><path d="M421 136h9v36h-9ZM631 136h9v36h-9Z"/></g>
 ${taperedRibbon([[[390,520],[390,480],[110,455],[210,400]],[[210,400],[330,340],[530,330],[530,290]]],80,80*150/780)}
 ${Array.from({length:16},(_,i)=>`<path d="M${87+i*23} ${446-i*3.2}l4-7" stroke="#8c4b30" stroke-width=".8"/>`).join('')}`;}
function tree(x,y,s,seed){const random=rand(seed);return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-2 3 0-53 6-55 4 4Z" fill="#4c5540"/><path d="M1-23l-19-17M2-34l17-18" fill="none" stroke="#535d42" stroke-width="2"/>${Array.from({length:21},()=>{const x=(random()-.5)*50,y=-38-random()*44;return `<ellipse cx="${x}" cy="${y}" rx="${7+random()*9}" ry="${5+random()*8}" fill="${['#546e45','#718449','#819353','#9da269'][Math.floor(random()*4)]}"/>`;}).join('')}</g>`;}
function meadow(){return `
 <rect width="780" height="520" fill="#b7cbd0"/>
 <path d="M-50 99C43 8 105 128 203 68S341 97 428 36 615 103 829 18" fill="none" stroke="#e6e9db" stroke-width="23"/>
 <path d="M36 128C119 80 167 122 260 89M418 92C522 23 578 111 729 62" fill="none" stroke="#d0dddd" stroke-width="14"/>
 <path d="M-30 278 139 136 219 183 339 65 406 150 480 117 636 270 804 174V430H0Z" fill="#7b9190"/>
 <path d="m240 168 99-103 67 85-45-24-15 16-11-24-15 16-18-3Z" fill="#d5dcd3"/>
 <path d="M0 295 213 212 350 285 489 219 780 287V520H0Z" fill="#91a37c"/>
 <path d="M0 386C161 215 269 368 395 303S621 325 780 258V520H0Z" fill="#a7ad75"/>
 <path d="M0 426C198 326 233 402 396 351S607 398 780 315V520H0Z" fill="#72875b"/>
 <path d="M0 477C118 388 295 480 429 404S656 432 780 407V520H0Z" fill="#849260"/>
 ${Array.from({length:18},(_,i)=>tree(330+i*15,303+Math.sin(i)*17,.37+(i%4)*.09,i*71+9)).join('')}
 ${tree(93,390,1.45,66)}${tree(665,420,1.7,89)}
 ${taperedRibbon([[[390,520],[390,480],[510,440],[426,360]],[[426,360],[320,250],[490,240],[498,310]],[[498,310],[500,400],[252.5,398.333],[252.5,358.333]]],80,80*95/780)}
 <path d="M170 420 187 287Q197 248 222 258L229 295H205V365H295V301L276 266Q310 258 322 307L338 420Z" fill="#535d43"/>
 <path d="M184 408 198 290 210 279M314 412 299 287M199 389 208 365M312 378 294 358" fill="none" stroke="#87906a" stroke-width="2"/>
 ${tree(219,308,.77,61)}${tree(282,304,.83,83)}
 <g stroke="#56694c" stroke-width=".7">${Array.from({length:70},(_,i)=>{const x=(i*113)%780,y=400+(i*17)%120;return `<path d="M${x} ${y}l-2-6m2 6 3-4"/>`;}).join('')}</g>`;}
function observatory(){return `
 <rect width="780" height="520" fill="#d4d0c2"/><path d="M0 183 780 72V0H0Z" fill="#e3decd"/>
 <path d="M20 520 47 63 192 42 239 520Z" fill="#aaa99b" stroke="#5f6b5e"/><path d="m47 63 62 448 23 9-34-464" fill="#bfc0ae"/>
 <path d="M603 520 643-20 780 27V520Z" fill="#a8aa9c" stroke="#64715f"/>
 ${hatch(650,38,120,250,31,'#87917e')}
 <g transform="translate(245 201)"><circle r="153" fill="#303a33" stroke="#a9a997" stroke-width="7"/>${Array.from({length:26},(_,i)=>`<circle r="${40+i*4.15}" fill="none" stroke="#606c5b" stroke-width=".7"/>`).join('')}<circle r="45" fill="#a69e83"/><circle r="5" fill="#28362e"/></g>
 <path d="M341 492 391 123H620L676 492Z" fill="#8d9785" stroke="#52604e"/>
 <path d="M418 286V174Q418 115 513 113Q608 115 608 174V286H584V176Q584 143 513 143Q442 143 442 176V286Z" fill="#c7c4b0" stroke="#63715c" stroke-width="2"/>
 <path d="M414 126Q512 29 613 126Z" fill="#46584c" stroke="#b0b59d" stroke-width="2"/>
 <path d="M436 120Q512 53 591 120M464 119Q512 69 561 119M514 70v54" fill="none" stroke="#85927a" stroke-width="1.5"/>
 <path d="M0 409C119 312 183 470 379 352S603 341 800 240" fill="none" stroke="#6c7967" stroke-width="35"/>
 <path d="M0 409C119 312 183 470 379 352S603 341 800 240" fill="none" stroke="#bdc0ab" stroke-width="27"/>
 ${rail('M0 391C119 294 183 452 379 334S603 323 800 222',[[31,375],[81,379],[133,402],[185,413],[239,404],[291,382],[340,352],[392,326],[445,310],[502,305],[560,309],[618,297],[680,267],[743,236]])}
 ${taperedRibbon([[[390,520],[390,480],[440,470],[365,410]],[[365,410],[290,350],[513,308],[513,268]]],80,80*156/780)}
 <g stroke="#86917a" fill="none" stroke-width=".65">${Array.from({length:10},(_,i)=>`<path d="M${48+i*14} 82v73M${48+i*14} 290v51"/>`).join('')}</g>
 <g transform="translate(690 381)"><circle r="46" fill="#a9b09a" stroke="#66785e" stroke-width="3"/><circle r="23" fill="#455b48"/>${Array.from({length:12},(_,i)=>`<path d="M0-23V-42" stroke="#ced0b9" transform="rotate(${i*30})"/>`).join('')}</g>`;}
function orbit(){return `
 <rect width="780" height="520" fill="#c4d0cb"/>
 <path d="M-50 81C92 10 113 143 281 78S491 26 617 81 768 18 838 57" fill="none" stroke="#e7e7da" stroke-width="45"/>
 <path d="M-42 173C105 86 215 239 368 141S635 159 832 89" fill="none" stroke="#d6ded5" stroke-width="25"/>
 <path d="M0 312C212 171 322 393 531 278S711 226 810 246V520H0Z" fill="#99b0a2"/>
 <path d="M0 373C200 282 365 424 579 335S735 303 810 332V520H0Z" fill="#6c8b7b"/>
 <path d="M0 443C211 325 321 535 567 405S722 422 809 411V520H0Z" fill="#42695d"/>
 <path d="M72 387C107 228 357 228 405 345S608 482 693 328" fill="none" stroke="#d3d9c6" stroke-width="12"/>
 <path d="M73 387C108 229 357 229 405 345S608 482 693 328" fill="none" stroke="#f0e9d7" stroke-width="1"/>
 <g transform="translate(508 124) rotate(-17)"><ellipse rx="75" ry="18" fill="none" stroke="#e4ddc4" stroke-width="5"/><circle r="36" fill="#859889" stroke="#4b685a"/><path d="M-29-20Q10-40 30 17" fill="none" stroke="#bec6ad" stroke-width="1.5"/></g>
 <path d="M175 370C192 320 161 295 196 269S302 225 331 262 325 334 343 366Z" fill="#ebe6d8" stroke="#b4bfac" stroke-width="1.5"/>
 <path d="M190 361C214 321 178 298 208 281M317 275C332 310 299 338 328 358" fill="none" stroke="#c6cbbb" stroke-width="4"/>
 ${taperedRibbon([[[390,520],[390,480],[480,410],[345,411]],[[345,411],[230,410],[264,363],[264,323]]],80,80*90/780)}
 <g fill="#e8e5d4" stroke="#8eaa98" stroke-width=".5"><path d="m82 213 38 7-26 13Z"/><path d="m629 175 35 11-30 9Z"/><path d="m602 387 37 9-27 15Z"/></g>
 ${stars()}`;}
export function worldArtwork(scene){return scene===1?paperCity():scene===2?meadow():scene===4?observatory():orbit();}
export const worldBases=['#e9e4d9','#b7b8ac','#b7cbd0','#202923','#d4d0c2','#c4d0cb','#e9e4d9'];
export function openingPath(frame,scene){const{x,y,w,h}=frame;if(scene===1||scene===4)return `M${x} ${y+h}V${y+h*.3}Q${x} ${y} ${x+w/2} ${y}T${x+w} ${y+h*.3}V${y+h}Z`;if(scene===2||scene===5)return `M${x+w*.05} ${y+h*.9}Q${x-w*.1} ${y+h*.35} ${x+w*.19} ${y+h*.08}Q${x+w*.5} ${y-h*.12} ${x+w*.86} ${y+h*.08}Q${x+w*1.07} ${y+h*.5} ${x+w*.94} ${y+h*.96}Q${x+w*.75} ${y+h} ${x+w*.5} ${y+h}Q${x+w*.2} ${y+h} ${x+w*.05} ${y+h*.9}Z`;return `M${x} ${y+h*.09} ${x+w*.14} ${y} ${x+w*.91} ${y+h*.03} ${x+w} ${y+h*.17} ${x+w*.98} ${y+h} ${x+w*.5} ${y+h} ${x+w*.05} ${y+h*.98}Z`;}
export function foreground(scene,frame){return scene===0?`<path d="M430 94 451 112 445 292 430 311Z" fill="#cbc4b3"/><path d="M704 114 718 104 720 294 701 286Z" fill="#8f9587"/>`:'';}
export function projectThread(scene){
 if(scene===3)return taperedRibbon([[[390,520],[390,480],[370,420],[294,409]],[[294,409],[204,399],[211,407],[211,367]]],80,80*96/780);
 if(scene===0)return taperedRibbon([[[779,508],[699,490],[740,396],[663,367]],[[663,367],[600,340],[574,327.333],[574,287.333]]],5,80*260/780);
 if(scene===6)return taperedRibbon([[[390,520],[390,480],[500,420],[490,340]],[[490,340],[480,260],[350,280],[300,200]]],80,18);
 return '';
}
