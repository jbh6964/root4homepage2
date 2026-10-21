// Original financial interface study. All amounts below are illustrative.
export const balanceData = {
 total:12480000,
 assets:[
  {name:'현금·예금',amount:6240000,share:50,color:'#5626a5'},
  {name:'적금',amount:3744000,share:30,color:'#a385dc'},
  {name:'투자',amount:2496000,share:20,color:'#d9caef'}
 ],
 months:[9200000,10400000,10000000,11700000,12000000,12480000],
 transactions:[['정기 급여','09.24 · 입금','+3,200,000'],['생활비 계좌','09.23 · 이체','−450,000'],['모닝 커피','09.23 · 카드','−4,500']]
};
export const won=value=>Math.round(value).toLocaleString('ko-KR');
const tx=(x,y,label,size=14,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${label}</text>`;
const box=(x,y,w,h,fill,r=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;

export function balanceArt(id){
 const circumference=2*Math.PI*51;
 let offset=0;
 const arcs=balanceData.assets.map((asset,i)=>{
  const length=circumference*asset.share/100-4,part=`<circle data-balance-arc="${i}" cx="720" cy="385" r="51" fill="none" stroke="${asset.color}" stroke-width="17" stroke-dasharray="${length} ${circumference-length}" stroke-dashoffset="${-offset}" transform="rotate(-90 720 385)"/><circle data-balance-hit="${i}" cx="720" cy="385" r="51" fill="none" stroke="transparent" stroke-width="28" stroke-dasharray="${length} ${circumference-length}" stroke-dashoffset="${-offset}" transform="rotate(-90 720 385)" pointer-events="stroke"/>`;offset+=circumference*asset.share/100;return part;
 }).join('');
 return `<defs>
  <linearGradient id="${id}-surface" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fffdfc"/><stop offset="1" stop-color="#f1ecf7"/></linearGradient>
  <linearGradient id="${id}-chart" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#a586db" stop-opacity=".33"/><stop offset="1" stop-color="#a586db" stop-opacity="0"/></linearGradient>
  <radialGradient id="${id}-highlight"><stop stop-color="#f6eaff" stop-opacity=".45"/><stop offset="1" stop-color="#e8d2ff" stop-opacity="0"/></radialGradient>
  <mask id="${id}-ribbon-alpha" x="0" y="0" width="1000" height="780" maskUnits="userSpaceOnUse" style="mask-type:alpha"><image href="/assets/balance-ribbon.png" x="5" y="5" width="1000" height="667"/></mask>
 </defs>
 <g class="balance-campaign" fill="#35204f">
  <g data-balance-layer="type">
   ${tx(53,73,'ORDER IN EVERY POSSIBILITY.',11,'letter-spacing="3.2" fill="#664c80"')}
   ${tx(45,204,'In balance.',148,'font-family="Cormorant,Georgia,serif" font-weight="500" letter-spacing="-6"')}
  </g>
  <g data-balance-layer="ribbon" pointer-events="none">
   <image href="/assets/balance-ribbon.png" x="5" y="5" width="1000" height="667" preserveAspectRatio="xMidYMid meet"/>
   <ellipse data-balance-highlight cx="735" cy="195" rx="185" ry="110" fill="url(#${id}-highlight)" mask="url(#${id}-ribbon-alpha)"/>
  </g>
  <g data-balance-layer="ui">
   <g transform="rotate(-4 480 468)">
    ${box(80,258,790,445,'#3b205d',22,'opacity=".06"')}${box(87,251,776,435,'#3b205d',20,'opacity=".05"')}
    ${box(78,240,780,433,'url(#'+id+'-surface)',19,'stroke="#ffffff" stroke-width="1.5"')}
    <path d="M78 294H858M587 294V673M108 567H560" stroke="#e7deee" stroke-width="1"/>
    <g transform="translate(105 262)" stroke="#6535a1" fill="none" stroke-width="1.6"><path d="M0 8 8 0l8 8-8 8Z"/><path d="m8 0 0 16M0 8h16"/></g>
    ${tx(132,279,'balance',22,'font-weight="650" letter-spacing="-1.2"')}
    ${tx(305,276,'자산',11,'font-weight="650" fill="#62359e"')}${tx(356,276,'소비',11,'fill="#94849e"')}${tx(407,276,'목표',11,'fill="#94849e"')}
    ${tx(819,275,'금액 예시',9,'fill="#a08cac" text-anchor="end"')}
    ${tx(108,326,'나의 총 자산',12,'fill="#84718f"')}
    ${tx(106,373,won(balanceData.total),45,'data-balance-total font-weight="550" letter-spacing="-2"')}${tx(382,370,'원',14,'fill="#8e7d9a"')}
    ${box(108,388,154,24,'#eee6f8',12)}${tx(120,404,'6개월 자산 흐름 · 예시',9,'fill="#76569e"')}
    <g fill="#a895b2" font-size="8"><text x="108" y="448">1,200만</text><text x="108" y="488">1,000만</text><text x="108" y="528">800만</text></g>
    <g stroke="#e8dfef" stroke-width=".8"><path d="M158 444H554M158 484H554M158 524H554"/></g>
    <path d="M162 500C192 500 212 474 239 476S290 499 316 484 367 450 393 450 444 443 470 440 520 434 547 430V535H162Z" fill="url(#${id}-chart)"/>
    <path data-balance-line d="M162 500C192 500 212 474 239 476S290 499 316 484 367 450 393 450 444 443 470 440 520 434 547 430" fill="none" stroke="#7143ad" stroke-width="2.5" pathLength="1" stroke-linecap="round"/>
    ${[162,239,316,393,470,547].map((x,i)=>`${tx(x,552,(i+4)+'월',8,'fill="#a18cac" text-anchor="middle"')}<circle data-balance-month="${i}" cx="${x}" cy="${[500,476,484,450,440,430][i]}" r="3.5" fill="#fff" stroke="#7143ad" stroke-width="1.5"/><circle data-balance-month-hit="${i}" cx="${x}" cy="${[500,476,484,450,440,430][i]}" r="13" fill="transparent" pointer-events="all"/>`).join('')}
    ${tx(615,327,'자산의 균형',12,'font-weight="550"')}
    <circle cx="720" cy="385" r="51" fill="none" stroke="#ede5f4" stroke-width="17"/>${arcs}
    ${tx(720,383,'MY',8,'fill="#aa97b6" text-anchor="middle" letter-spacing="2"')}${tx(720,404,'100%',23,'fill="#55327b" text-anchor="middle" letter-spacing="-1"')}
    ${balanceData.assets.map((asset,i)=>`<circle cx="618" cy="474" r="3" fill="${asset.color}" transform="translate(0 ${i*57})"/>${tx(630,478+i*57,asset.name,10,'fill="#8f7c9b"')}${tx(826,478+i*57,asset.share+'%',10,'fill="#7e6593" text-anchor="end"')}${tx(630,500+i*57,won(asset.amount)+' 원',17,'font-weight="500" letter-spacing="-.5"')}`).join('')}
    ${tx(108,592,'최근 거래',10,'fill="#7e678e"')}${tx(550,592,'전체 내역 ↗',8,'fill="#9e88af" text-anchor="end"')}
    ${balanceData.transactions.map(([name,date,amount],i)=>`<g transform="translate(${108+i*150} 610)">${box(0,0,24,24,['#eee5f8','#e5deef','#ede7ec'][i],8)}${tx(12,16,['↓','↗','−'][i],12,'fill="#8d6bb2" text-anchor="middle"')}${tx(31,8,name,9,'fill="#6c517f"')}${tx(31,23,date,7,'fill="#ab98b7"')}${tx(0,48,amount+' 원',11,'fill="#533372" font-weight="500"')}</g>`).join('')}
   </g>
  </g>
  <g data-balance-layer="caption">
   ${tx(103,734,'Less scattered. More connected.',22,'font-family="Cormorant,Georgia,serif" font-style="italic" fill="#795a93"')}
   ${tx(854,729,'FINANCIAL EXPERIENCE / CONCEPT STUDY',7,'fill="#8d71a3" text-anchor="end" letter-spacing="1.1"')}
  </g>
 </g>`;
}

// Transit uses the same artwork, not a second placeholder design.
export function balanceFragment(id='balance-fragment'){
 return `<svg class="balance-transit" width="340" height="265.2" viewBox="0 0 1000 780" overflow="visible">${balanceArt(id)}</svg>`;
}
