// Every scene uses a fresh 780 × 520 coordinate system. Small embedded details
// are real descendants; local camera transforms never accumulate global scale.
export const frames=[
 {x:430,y:270,w:780,h:520,a:-6},
 {x:584,y:192,w:55,h:55*2/3,a:2},
 {x:173,y:318,w:69,h:46,a:-4},
 {x:510,y:155,w:87,h:58,a:3},
 {x:219,y:331,w:48,h:32,a:-3},
 {x:512,y:142,w:63,h:42,a:4},
 {x:181,y:295,w:78,h:52,a:-2}
];
export const END=frames.length;
export const rad=d=>d*Math.PI/180;
export function compose(parent,child){const r=rad(parent.a),s=parent.w/780;return{x:parent.x+s*(Math.cos(r)*child.x-Math.sin(r)*child.y),y:parent.y+s*(Math.sin(r)*child.x+Math.cos(r)*child.y),w:child.w*s,h:child.h*s,a:parent.a+child.a};}
export function center(f){const r=rad(f.a);return{x:f.x+Math.cos(r)*f.w/2-Math.sin(r)*f.h/2,y:f.y+Math.sin(r)*f.w/2+Math.cos(r)*f.h/2};}
export function camera(progress,width,height){
 const p=Math.max(0,Math.min(END,progress)),segment=Math.min(END-1,Math.floor(p)),t=p-segment;
 const from=segment===0?{x:800,y:500,s:Math.min(width/1600,height/1000),a:0}:{x:390,y:260,s:Math.max(width/780,height/520)*1.04,a:0};
 const f=frames[segment],to={...center(f),s:Math.max(width/f.w,height/f.h)*1.04,a:-f.a};
 // Nonzero velocity inside each leg, eased near a discoverable composition.
 const u=t*t*(3-2*t),bend=Math.sin(Math.PI*u),r=rad(f.a);
 const drift=segment===0?35:42;
 return{segment,x:from.x+(to.x-from.x)*u+Math.cos(r)*bend*drift*(segment%2?1:-1),y:from.y+(to.y-from.y)*u+Math.sin(r+.8)*bend*drift,s:Math.exp(Math.log(from.s)*(1-u)+Math.log(to.s)*u),a:from.a+(to.a-from.a)*u};
}
export function localCamera(cam){return cam;}
export function normalizeWheel(event,height){const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?height:1);return Math.sign(delta)*Math.min(Math.abs(delta),110)/1800;}
