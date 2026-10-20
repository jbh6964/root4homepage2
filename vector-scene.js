import { frames, sceneProjects, smooth } from './geometry.js';

import { worldArtwork, worldBases, openingPath, foreground, projectThread } from './worlds.js';

const NS = 'http://www.w3.org/2000/svg';
const PAPER = '#e9e4d9';
const INK = '#202923';
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
export function pigment(color, base, amount) {
  const a = rgb(base), b = rgb(color);
  return `rgb(${a.map((value, i) => Math.round(value + (b[i] - value) * amount)).join(',')})`;
}
export function contrastForWidth(width) {
  // Detail emerges through increasing print contrast, never through a scene fade.
  return smooth((Math.log2(Math.max(width, 1)) - Math.log2(4)) / Math.log2(100));
}
export function projectedWidth(index, cam) {
  let width = 780;
  for (let ancestor = Math.max(0, cam.segment - 1); ancestor < index; ancestor++) width *= frames[ancestor + 1].w / 780;
  return width * cam.s;
}
function text(x, y, content, size = 8, extra = '') {
  return `<text x="${x}" y="${y}" font-size="${size}" ${extra}>${content}</text>`;
}
function paint(attribute, value) {
  return `${attribute}="${value}" data-pigment-${attribute}="${value}"`;
}
function botanical() {
  return `<g transform="translate(465 8)"><g><animateTransform attributeName="transform" type="rotate" values="-2 150 220;2 150 220;-2 150 220" dur="17s" repeatCount="indefinite"/>
    <path d="M145 420C170 298 127 205 177 30" fill="none" ${paint('stroke', '#ccd1b6')} stroke-width="1"/>
    ${Array.from({length: 11}, (_, i) => {
      const y = 56 + i * 28, x = 160 + (i % 2 ? 0 : 12), side = i % 2 ? -1 : 1;
      return `<path d="M${x} ${y + 45}C${x + side * 75} ${y + 40} ${x + side * 100} ${y - 32} ${x + side * 80} ${y - 35}C${x + side * 20} ${y - 20} ${x + side * 5} ${y + 12} ${x} ${y + 45}Z" ${paint('fill', '#53604a')} ${paint('stroke', '#ccd1b6')} stroke-width=".5"/>
      <path d="m${x} ${y + 45} ${side * 80} -80" fill="none" ${paint('stroke', '#ccd1b6')} stroke-width=".4"/>`;
    }).join('')}</g></g>`;
}
function wave() {
  return `<g transform="translate(180 50)"><g><animateTransform attributeName="transform" type="translate" values="-8 0;8 0;-8 0" dur="18s" repeatCount="indefinite"/>
  ${Array.from({length:32}, (_, i) => { const y = 30 + i * 10;
    return `<path d="M-40 ${y}C140 ${y - 120} 200 ${y + 190} 360 ${y + 40}S560 ${y - 110} 740 ${y + 10}" fill="none" ${paint('stroke', '#26312b')} stroke-width="${i % 5 === 0 ? 1.2 : .5}"/>`;
  }).join('')}</g></g>`;
}
function artwork(index, prefix) {
  if (index === 0) return `
    ${text(34, 40, 'F/O — 001', 8, 'letter-spacing="1.8"')}
    <rect x="25" y="34" width="5" height="5" fill="#8f3d32"/>
    ${text(29, 220, 'form', 152, 'font-family="Georgia,serif" letter-spacing="-10"')}
    ${text(29, 317, '&amp; other.', 87, 'font-family="Georgia,serif" font-style="italic" letter-spacing="-5"')}
    <rect x="430" y="70" width="300" height="365" fill="${INK}"/>
    <g transform="translate(462 85) scale(.7866667 .8388889)"><g>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="12s" repeatCount="indefinite"/>
      <path d="M145 15 258 94 176 171 251 270 134 345 36 261 116 181 39 84Z" fill="url(#${prefix}-paper)"/>
      <path d="m145 15 31 156-60 10-77-97m77 97 18 164 42-174m0 0 75 99-117 75M39 84l219 10-82 77M36 261l215 9" fill="none" stroke="#fff9ed" stroke-width=".6"/>
      <path d="m145 15-29 166 142-87-82 77-42 174-18-164-80 80" fill="none" stroke="#73766a" stroke-width=".6"/>
    </g></g>
    ${text(448, 420, 'STUDIES IN COLLECTIVE FORM', 5, 'fill="#cccdbf" letter-spacing="1.8"')}
    ${text(38, 364, 'A shared space.', 9, 'fill="#5c6259"')}
    ${text(38, 381, 'A different perspective.', 9, 'fill="#5c6259"')}
    ${text(34, 486, 'INDEPENDENT IN SPIRIT. CONNECTED BY DESIGN.', 6, 'letter-spacing="2"')}
    <g stroke="#525b50" stroke-width=".8"><rect x="340" y="482" width="3" height="3"/><rect x="348" y="482" width="3" height="3" fill="none"/><rect x="356" y="482" width="3" height="3" fill="none"/></g>`;
  if (index === 1) return `

    ${botanical()}


    <rect x="130" y="130" width="160" height="300" rx="18" fill="url(#${prefix}-bottle)"/>
    <rect x="165" y="92" width="90" height="46" rx="6" ${paint('fill', '#151e17')}/>
    ${Array.from({length:24}, (_, i) => `<path d="M${169+i*3.5} 96v37" ${paint('stroke', '#354131')} stroke-width=".8"/>`).join('')}
    <rect x="130" y="250" width="160" height="125" ${paint('fill', PAPER)}/>
    ${text(144, 296, 'mori', 36, `${paint('fill', '#303b2e')} font-family="Georgia,serif" letter-spacing="-2"`)}
    ${text(144, 318, 'DAILY BALANCE', 5, `${paint('fill', '#303b2e')} letter-spacing=".65"`)}
    ${text(144, 327, 'BOTANICAL FORMULA / 01', 5, `${paint('fill', '#303b2e')} letter-spacing=".65"`)}
    ${text(144, 343, '30 ml / 1.0 fl oz', 4, `${paint('fill', '#303b2e')} letter-spacing=".5"`)}
    `;
  return `

    ${wave()}




    <rect x="736" y="34" width="6" height="6" ${paint('fill', '#8d4037')}/>`;
}
function project(index, prefix) {
  const base = worldBases[index], child = frames[index + 1], projectIndex = sceneProjects[index];
  return `<g data-vector-project="${index}" data-base="${base}" fill="${index === 3 ? PAPER : INK}">
    <rect width="780" height="520" fill="${base}"/>
    <g data-vector-art="${index}">${projectIndex === null ? worldArtwork(index) : artwork(projectIndex, prefix)}</g>
    ${child ? `<g clip-path="url(#${prefix}-opening-${index})"><svg data-nested-project="${index + 1}" x="${child.x}" y="${child.y}" width="${child.w}" height="${child.h}" viewBox="0 0 780 520" overflow="hidden">${project(index + 1, prefix)}</svg></g>` : ''}
    ${foreground(index,child)}${projectThread(index)}
  </g>`;
}
function placedProject(prefix) {
  const f = frames[0];
  return `<svg x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" viewBox="0 0 780 520" transform="rotate(${f.a} ${f.x} ${f.y})" overflow="hidden">${project(0, prefix)}</svg>`;
}
function phone(x, y, w, h, angle, title, description) {
  return `<g transform="translate(${x} ${y}) rotate(${angle})">
    <rect width="${w}" height="${h}" rx="19" fill="#30382e"/>
    <rect x="5" y="5" width="${w-10}" height="${h-10}" rx="15" fill="#e9e8df"/>
    ${text(18, 48, title, 27, 'font-family="Georgia,serif" fill="#252b22"')}
    <rect x="18" y="72" width="${w-36}" height="${h*.4}" fill="#b7c2a9"/>
    ${text(18, h-51, description, 8, 'fill="#252b22"')}
    <path d="M18 ${h-72}h${w-36}" stroke="#b3b6aa" stroke-width=".5"/>
    ${text(18, h-25, 'Discover more ↗', 7, 'fill="#252b22"')}</g>`;
}
function collage(prefix) {
  return `<g transform="translate(1130 60) rotate(10)"><rect width="290" height="360" fill="#d4d3c9"/>
    ${text(25, 65, 'A study', 47, 'font-family="Georgia,serif" fill="#343e35" letter-spacing="-3"')}
    ${text(25, 110, 'in quiet', 47, 'font-family="Georgia,serif" fill="#343e35" letter-spacing="-3"')}
    ${text(25, 155, 'contrast.', 47, 'font-family="Georgia,serif" fill="#343e35" letter-spacing="-3"')}
    ${text(25, 310, 'Q.', 145, 'font-family="Georgia,serif" font-style="italic" fill="#6f7a68"')}</g>
    ${phone(190, 460, 165, 300, -12, 'mori.', 'A little closer to nature.')}
    <g transform="translate(-65 750) rotate(7)"><rect width="330" height="250" fill="#e1dcd1"/>${text(20, 95, 'Aa', 95, 'font-family="Georgia,serif" fill="#484c40"')}${text(20, 180, 'Bb.', 95, 'font-family="Georgia,serif" fill="#484c40"')}${text(20, 220, 'TYPE STUDIES — NO. 04', 8, 'letter-spacing="2" fill="#484c40"')}</g>
    <g transform="translate(1395 775)"><circle r="135" fill="#292c26"/>${Array.from({length:28}, (_,i)=>`<circle r="${42+i*3.25}" fill="none" stroke="#42473a" stroke-width=".5"/>`).join('')}<g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="18s" repeatCount="indefinite"/><circle r="44" fill="#d6d3c2"/>${text(-20, 12, 'r4', 32, 'font-family="Georgia,serif" font-style="italic" fill="#384234"')}</g></g>
    <g transform="translate(720 825) rotate(5)"><rect width="300" height="170" fill="#7c3f35"/>${text(22, 30, 'ROOT4 EXPERIMENTS / 026', 7, 'fill="#e9dfd0" letter-spacing="1.5"')}${text(22, 92, 'Off the', 48, 'font-family="Georgia,serif" font-style="italic" fill="#e9dfd0"')}${text(22, 138, 'record.', 48, 'font-family="Georgia,serif" font-style="italic" fill="#e9dfd0"')}</g>
    ${placedProject(prefix)}
    ${phone(1030, 690, 135, 240, 8, 'OFF/', 'Find your frequency.')}`;
}
let instance = 0;
export class VectorScene {
  constructor(container) {
    this.container = container;
    this.svg = document.createElementNS(NS, 'svg');
    this.svg.classList.add('zoom-world');
    this.svg.setAttribute('aria-hidden', 'true');
    this.svg.setAttribute('preserveAspectRatio', 'none');
    this.svg.setAttribute('shape-rendering', 'geometricPrecision');
    this.svg.setAttribute('text-rendering', 'geometricPrecision');
    this.container.replaceChildren(this.svg);
    this.segment = -1;
  }
  mount(segment, seconds = 0, paused = false) {
    const prefix = `vector-${instance++}`;
    this.segment = segment;
    this.svg.innerHTML = `<defs>
      ${frames.slice(1).map((frame,index)=>`<clipPath id="${prefix}-opening-${index}" clipPathUnits="userSpaceOnUse"><path d="${openingPath(frame,index)}"/></clipPath>`).join('')}
      <linearGradient id="${prefix}-paper" x1="44" y1="32" x2="240" y2="335" gradientUnits="userSpaceOnUse"><stop stop-color="#faf7ef"/><stop offset=".42" stop-color="#b9b8ad"/><stop offset=".52" stop-color="#f1eee5"/><stop offset="1" stop-color="#6e726b"/></linearGradient>
      <linearGradient id="${prefix}-bottle"><stop ${paint('stop-color','#0d1610')}/><stop offset=".28" ${paint('stop-color','#47513c')}/><stop offset=".6" ${paint('stop-color','#303e2b')}/><stop offset="1" ${paint('stop-color','#151e17')}/></linearGradient>
    </defs><g data-vector-world font-family="Arial,sans-serif">${segment === 0 ? collage(prefix) : project(segment - 1, prefix)}</g>`;
    this.world = this.svg.querySelector('[data-vector-world]');
    this.details = [...this.svg.querySelectorAll('[data-vector-project]')].map(group => ({
      index: Number(group.dataset.vectorProject), base: group.dataset.base,
      colors: [...group.querySelectorAll(`[data-vector-art="${group.dataset.vectorProject}"] [fill], [data-vector-art="${group.dataset.vectorProject}"] [stroke]`)].flatMap(node => ['fill', 'stroke'].filter(attribute => /^#[a-f0-9]{6}$/i.test(node.getAttribute(attribute)||'')).map(attribute => ({ node, color: node.getAttribute(attribute), attribute }))),
      amount: -1
    }));
    this.bottleStops = [...this.svg.querySelectorAll('[data-pigment-stop-color]')];
    this.svg.setCurrentTime(seconds);
    this.setPaused(paused);
  }
  setPaused(paused) {
    if (this.paused === paused) return;
    this.paused = paused;
    if (paused) this.svg.pauseAnimations(); else this.svg.unpauseAnimations();
  }
  render(cam, width, height, seconds, paused) {
    if (cam.segment !== this.segment) this.mount(cam.segment, seconds, paused);
    this.setPaused(paused);
    const w = width / cam.s, h = height / cam.s;
    this.svg.setAttribute('viewBox', `${cam.x-w/2} ${cam.y-h/2} ${w} ${h}`);
    this.world.setAttribute('transform', `rotate(${cam.a} ${cam.x} ${cam.y})`);
    this.svg.dataset.segment = String(cam.segment);
    for (const detail of this.details) {
      const amount = detail.index === 0 ? 1 : contrastForWidth(projectedWidth(detail.index, cam));
      if (Math.abs(detail.amount - amount) < .0001) continue;
      detail.amount = amount;
      for (const entry of detail.colors) entry.node.setAttribute(entry.attribute, pigment(entry.color, detail.base, amount));
      if (detail.index === 3) for (const node of this.bottleStops) node.setAttribute('stop-color', pigment(node.getAttribute('data-pigment-stop-color'), INK, amount));
    }
  }
}
