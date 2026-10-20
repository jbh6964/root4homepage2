export const rad = value => value * Math.PI / 180;
export const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
// Each destination is part of an illustrated environment, not a preview card.
export const frames = [
  { x: 430, y: 270, w: 780, h: 520, a: -6 },
  { x: 444, y: 114, w: 260, h: 260*2/3, a: 0 },
  { x: 455, y: 190, w: 150, h: 100, a: 0 },
  { x: 205, y: 295, w: 95, h: 95*2/3, a: 0 },
  { x: 163, y: 303, w: 96, h: 64, a: 0 },
  { x: 435, y: 164, w: 156, h: 104, a: 0 },
  { x: 219, y: 263, w: 90, h: 60, a: 0 }
];
export const sceneProjects = [0, null, null, 1, null, null, 2];
export const sceneNames = ['FORM / OTHER','PAPER CITADEL','THE OTHER SIDE','mori','RESONANCE ATELIER','A QUIETER ORBIT','OFFBEAT'];
export const story = [
  { start: 0, end: 1.2, type: 'zoom', project: 0, scene: 0 },
  { start: 1.2, end: 5.2, type: 'detail', project: 0, scene: 0 },
  { start: 5.2, end: 6.8, type: 'journey', project: 0, scene: 1 },
  { start: 6.8, end: 8.4, type: 'journey', project: 0, scene: 2 },
  { start: 8.4, end: 10.2, type: 'zoom', project: 1, scene: 3 },
  { start: 10.2, end: 14.2, type: 'detail', project: 1, scene: 3 },
  { start: 14.2, end: 15.8, type: 'journey', project: 1, scene: 4 },
  { start: 15.8, end: 17.4, type: 'journey', project: 1, scene: 5 },
  { start: 17.4, end: 19.2, type: 'zoom', project: 2, scene: 6 },
  { start: 19.2, end: 23.2, type: 'detail', project: 2, scene: 6 }
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
// Architectural openings and natural gaps hold actual nested worlds.
// The opening fully covers the viewport before its local coordinates are rebased.
// Camera math always uses the current scene, never a huge accumulated scale.
export function camera(progress, width, height) {
  const part = storyAt(progress);
  const cover = Math.max(width / 780, height / 520) * 1.04;
  const heroScale = cover * 1.7;
  if (part.type === 'detail') {
    const excursion = Math.sin(part.t * Math.PI);
    return { segment: part.scene + 1, x: 390 + excursion * 16, y: 260 - excursion * 10,
      s: (part.scene === 0 ? cover : heroScale) * (1 + excursion * .025), a: 0, ...part };
  }
  const frame = frames[part.scene], end = center(frame);
  const from = part.scene === 0
    ? { x: 800, y: 500, s: Math.min(width / 1600, height / 1000), a: 0 }
    : { x: 390, y: 260, s: part.scene === 1 ? cover : heroScale, a: 0 };
  const to = { ...end, s: cover * (part.scene === 0 ? 1 : 1.7) * 780 / frame.w, a: -frame.a };
  const u = smooth(part.t), bend = Math.sin(u * Math.PI);
  const s = Math.exp(Math.log(from.s) * (1 - u) + Math.log(to.s) * u);
  // Converge in screen space as magnification rises. Linear world-space motion
  // at microscopic scale would spend most of the journey looking at empty ink.
  const remaining = part.scene === 0 ? 1 - u : (1 - u) * from.s / s;
  const drift = part.scene === 0 ? 1 : from.s / s;
  return { segment: part.scene,
    x: to.x + (from.x - to.x) * remaining + bend * drift * (part.scene % 2 ? -28 : 36),
    y: to.y + (from.y - to.y) * remaining + bend * drift * 24,
    s, a: from.a + (to.a - from.a) * u, ...part };

}
export function normalizeWheel(event, height) {
  const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
  return Math.sign(delta) * Math.min(Math.abs(delta), 140) / 1000;
}
