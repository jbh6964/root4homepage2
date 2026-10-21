// The arrival clock never controls the scroll camera. A visit is latched for
// the session, so leaving, reversing or crossing a boundary cannot replay it.
export class ArrivalSequence {
 constructor(duration=1050){this.duration=duration;this.value=1;this.seen=false;this.active=false;this.elapsed=0;this.last=null;}
 update({active,now,paused=false,staticMode=false}){
  if(active&&!this.seen){this.seen=true;this.elapsed=0;this.value=staticMode?1:0;this.last=now;}
  if(!active&&this.active)this.value=1;
  if(staticMode&&active)this.value=1;
  if(active&&this.value<1&&!paused){
   if(this.last!==null)this.elapsed+=Math.max(0,now-this.last);
   this.value=Math.min(1,this.elapsed/this.duration);
  }
  this.last=paused?null:now;this.active=active;
  return this.value;
 }
}
