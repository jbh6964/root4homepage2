import {smooth,worldFrames,rootFrame,relativeFrame} from './geometry.js';
const NS='http://www.w3.org/2000/svg',PAPER='#e9e4d9';
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
export function pigment(color,base,amount){const a=rgb(base),b=rgb(color);return`rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*amount)).join(',')})`;}
export function contrastForWidth(width){return smooth((Math.log2(Math.max(width,1))-2)/Math.log2(100));}
export function projectedWidth(index,cam){const base=cam.segment?worldFrames[cam.segment-1]:rootFrame;return worldFrames[index].w/base.w*780*cam.s;}
function random(seed){let n=seed;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
export function inkVisibility(width){return contrastForWidth(width)*(1-smooth((Math.log2(Math.max(width,1))-11)/3.5));}
function printField(index){
 const r=random(1201+index*313),accent=['#8e5447','#6b7f82','#73764b'][index%3];
 const strokes=Array.from({length:32},(_,i)=>{
  const y=-100+i*22,shift=Math.sin(index*1.7)*155;
  const d=index%3===0?`M${-230+i*17} -340C${730-i*12} 110 ${-140+i*26} 240 ${900-i*9} 930`:index%3===1?`M-530 ${y-110}C-20 ${y+shift} 233 ${y+320} 560 ${y+18}S1040 ${y-180} 1470 ${y+73}`:`M${-430+i*30} -250C${440+i*5} ${83+shift} ${150+i*6} 270 ${390+i*34} 990`;
  return `<path d="${d}" fill="none" stroke="${i%7===0?accent:'#626d60'}" stroke-width="${i%7===0?.8:.3}"/>`;
 }).join('');
 const specks=Array.from({length:66},()=>{const x=-180+r()*1170,y=-120+r()*790;return `<path d="m${x} ${y} ${.4+r()*2} ${r()*1.8-.9}" stroke="#7c8170" stroke-width="${.15+r()*.25}" fill="none"/>`;}).join('');
 const fragment=index===2||index===5?`<text x="-150" y="530" font-family="Georgia,serif" font-size="700" font-style="italic" letter-spacing="-25" fill="none" stroke="${accent}" stroke-width=".7">${index===2?'a':'f'}</text>`:'';
 return `<g data-material-depth="${index}"><g data-ink-layer="${index}">${strokes}${specks}${fragment}<g><animateTransform attributeName="transform" type="translate" values="0 0;1.5 -1;0 0" dur="19s" repeatCount="indefinite"/><path d="M-107 402C215-83 134 256 566 103S871 204 1084 562" fill="none" stroke="${accent}" stroke-width=".55"/></g></g></g>`;
}
function poster(x,y,w,h,angle,bg,title,sub){return`<g transform="translate(${x} ${y}) rotate(${angle})"><path d="M0 0H${w}V${h}H0Z" fill="${bg}"/><text x="22" y="65" font-family="Georgia,serif" font-size="${w*.18}" fill="#303a31" letter-spacing="-2">${title}</text><text x="22" y="${h-22}" font-size="7" fill="#4b5548" letter-spacing="1.5">${sub}</text><path d="M24 110Q${w*.8} 60 ${w*.7} ${h*.8}" fill="none" stroke="#7d8977" stroke-width=".7"/></g>`;}
function collage(){return`${poster(1120,75,280,340,9,'#d2d5ca','Q.','A STUDY IN QUIET CONTRAST')}${poster(180,478,172,275,-12,'#dce0d1','mori.','DAILY RITUAL / 02')}${poster(-68,748,320,230,7,'#dfd8ca','Aa Bb.','TYPE STUDIES — NO. 04')}${poster(755,834,305,140,5,'#c5b8a4','Offbeat.','INDEPENDENT IN SPIRIT')}${poster(1124,642,265,260,-5,'#d1d4c5','f / o','FORMS IN COMMON')}`;}
let instance=0;
export class VectorScene{
 constructor(container){this.svg=document.createElementNS(NS,'svg');this.svg.classList.add('zoom-world');this.svg.setAttribute('aria-hidden','true');this.svg.setAttribute('preserveAspectRatio','none');this.svg.setAttribute('shape-rendering','geometricPrecision');this.svg.setAttribute('text-rendering','geometricPrecision');const prefix='material-'+instance++;
 this.svg.innerHTML=`<defs><clipPath id="${prefix}-first-print"><path d="M0 0H780V520H0Z"/></clipPath></defs><g data-vector-world font-family="Arial,sans-serif"><g data-root-collage>${collage()}</g>${worldFrames.map((_,i)=>`<g data-field-transform="${i}">${i===0?`<path d="M0 0H780V520H0Z" fill="${PAPER}"/><text x="30" y="105" font-family="Georgia,serif" font-size="84" letter-spacing="-5" fill="#30382f">form &amp; other.</text><text x="35" y="475" font-size="7" letter-spacing="2" fill="#4e5849">INDEPENDENT IN SPIRIT. CONNECTED BY DESIGN.</text>`:''}${i===0?`<g clip-path="url(#${prefix}-first-print)">${printField(i)}</g>`:printField(i)}</g>`).join('')}</g>`;
 container.replaceChildren(this.svg);this.world=this.svg.querySelector('[data-vector-world]');this.collage=this.svg.querySelector('[data-root-collage]');this.fields=[...this.svg.querySelectorAll('[data-field-transform]')];this.inks=this.fields.map(field=>[...field.querySelectorAll('[data-ink-layer] [stroke]')].map(node=>({node,color:node.getAttribute('stroke')})));this.amounts=[];this.segment=-1;this.id=prefix;
 }
 setPaused(paused){if(this.paused===paused)return;this.paused=paused;if(paused)this.svg.pauseAnimations();else this.svg.unpauseAnimations();}
 render(cam,width,height,seconds,paused){
  this.setPaused(paused);const base=cam.segment?worldFrames[cam.segment-1]:rootFrame;
  if(this.segment!==cam.segment){this.segment=cam.segment;const set=(node,frame)=>{const f=relativeFrame(frame,base);node.setAttribute('transform',`translate(${f.x} ${f.y}) rotate(${f.a}) scale(${f.s})`);};set(this.collage,rootFrame);this.fields.forEach((node,index)=>set(node,worldFrames[index]));}
  const w=width/cam.s,h=height/cam.s;this.svg.setAttribute('viewBox',`${cam.x-w/2} ${cam.y-h/2} ${w} ${h}`);this.world.setAttribute('transform',`rotate(${cam.a} ${cam.x} ${cam.y})`);this.svg.dataset.segment=String(cam.segment);
  this.collage.style.display=projectedWidth(0,cam)>4000?'none':'';
  this.inks.forEach((entries,index)=>{const amount=inkVisibility(projectedWidth(index,cam));this.fields[index].style.display=amount<.0002?'none':'';if(Math.abs((this.amounts[index]??-1)-amount)<.0001)return;this.amounts[index]=amount;for(const{node,color}of entries)node.setAttribute('stroke',pigment(color,PAPER,amount));});
 }
}
