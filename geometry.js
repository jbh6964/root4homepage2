export const rad = value => value * Math.PI / 180;
export const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
export const frames = [
  { x: 430, y: 270, w: 780, h: 520, a: -6 },
  { x: 488, y: 421, w: 3, h: 2, a: 0 },
  { x: 155, y: 342, w: 3, h: 2, a: 0 }
];
export const story = [
  { start: 0, end: 1.2, type: 'zoom', project: 0 },
  { start: 1.2, end: 5.2, type: 'detail', project: 0 },
  { start: 5.2, end: 7, type: 'zoom', project: 1 },
  { start: 7, end: 11, type: 'detail', project: 1 },
  { start: 11, end: 12.8, type: 'zoom', project: 2 },
  { start: 12.8, end: 16.8, type: 'detail', project: 2 }
];
export const END = story.at(-1).end;
export const stops = [0, ...story.map(part => part.end)];
export function storyAt(progress) {
  const p = clamp(progress, 0, END);
  const part = story.find(part => p < part.end) || story.at(-1);
  return { ...part, t: clamp((p - part.start) / (part.end - part.start)) };
}
export function center(frame) {
  const r = rad(frame.a);
  return { x: frame.x + Math.cos(r) * frame.w / 2 - Math.sin(r) * frame.h / 2,
    y: frame.y + Math.sin(r) * frame.w / 2 + Math.cos(r) * frame.h / 2 };
}
export function compose(parent, child) {
  const r = rad(parent.a), s = parent.w / 780;
  return { x: parent.x + s * (Math.cos(r) * child.x - Math.sin(r) * child.y),
    y: parent.y + s * (Math.sin(r) * child.x + Math.cos(r) * child.y),
    w: child.w * s, h: child.h * s, a: parent.a + child.a };
}
// A three-pixel print detail holds the next scene. Its full rectangular area
// covers the viewport before rebasing; no separate portal shape or thumbnail.
// Camera math always uses the current scene, never a huge accumulated scale.
export function camera(progress, width, height) {
  const part = storyAt(progress);
  const cover = Math.max(width / 780, height / 520) * 1.04;
  const heroScale = cover * 1.7;
  if (part.type === 'detail') {
    const excursion = Math.sin(part.t * Math.PI);
    return { segment: part.project + 1, x: 390 + excursion * 16, y: 260 - excursion * 10,
      s: (part.project === 0 ? cover : heroScale) * (1 + excursion * .025), a: 0, ...part };
  }
  const frame = frames[part.project], end = center(frame);
  const from = part.project === 0
    ? { x: 800, y: 500, s: Math.min(width / 1600, height / 1000), a: 0 }
    : { x: 390, y: 260, s: part.project === 1 ? cover : heroScale, a: 0 };
  const to = { ...end, s: cover * (part.project === 0 ? 1 : 1.7) * 780 / frame.w, a: -frame.a };
  const u = smooth(part.t), bend = Math.sin(u * Math.PI);
  const s = Math.exp(Math.log(from.s) * (1 - u) + Math.log(to.s) * u);
  // Converge in screen space as magnification rises. Linear world-space motion
  // at microscopic scale would spend most of the journey looking at empty ink.
  const remaining = part.project === 0 ? 1 - u : (1 - u) * from.s / s;
  const drift = part.project === 0 ? 1 : from.s / s;
  return { segment: part.project,
    x: to.x + (from.x - to.x) * remaining + bend * drift * (part.project % 2 ? -28 : 36),
    y: to.y + (from.y - to.y) * remaining + bend * drift * 24,
    s, a: from.a + (to.a - from.a) * u, ...part };

}
export function normalizeWheel(event, height) {
  const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
  return Math.sign(delta) * Math.min(Math.abs(delta), 140) / 1000;
}
