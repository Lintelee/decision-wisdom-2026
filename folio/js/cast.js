import { C, keep, beam, poly, tab, strut } from './paper.js';
import { buildResident, hasResident, poseResident, residentName } from './resident-puppets.js';

function puppet(parent,{x,y,z,s,coat,legs,prop},animal,short=false) {
  const root=keep(parent,x,y,z);
  root.name=residentName(animal);
  root.scale.setScalar(s);
  const inner=keep(root);
  if (prop) { tab(root,.36); strut(root,short ? .68 : .78); }
  const rig=buildResident(inner,animal,short,coat,legs);
  const {head,eyes,armL,armR}=rig;
  const hopHeight = short ? .22 : .28;
  const p={
    root, inner, head, eyes, armL, armR, rig, kind:short?'robot':'person', species:animal,
    phase:Math.random()*6, mood:'idle', waveT:0, hopT:0, hopH:hopHeight,
    lookAt:[0, short ? .85 : 1, .05], gaze:{x:0,y:0},
    wave(d=1.6){p.waveT=d;return p;}, hop(h=hopHeight){p.hopT=.55;p.hopH=h;return p;},
    cheer(on=true){p.mood=on?'cheer':'idle';return p;}, doubt(on=true){p.mood=on?'doubt':'idle';return p;},
    still(){p.mood='idle';p.waveT=0;return p;},
  };
  return p;
}
export function makePerson(parent,{x=0,y=0,z=0,s=1,coat,kind='adult',legs=null,prop=true,species:character}={}) {
  let animal;
  if (hasResident(character)) animal=character;
  else if (kind==='elder') animal='badger';
  else if (kind==='ce') animal='owl';
  else if (kind==='kid') animal='hare';
  else if ([C.coral,C.pink,'#b5654f'].includes(coat)) animal='squirrel';
  else if ([C.blue,C.white].includes(coat)) animal='bear';
  else animal='otter';
  const p=puppet(parent,{x,y,z,s:s*(kind === 'kid' ? .72 : 1),coat,legs,prop},animal);
  if (kind==='elder'&&animal==='badger') beam(p.inner,[.27,.02,.021],[.218,.48,.024],.017,C.wood,6).name = 'walking-stick';
  return p;
}
// Completed jobs leave a small stitch in the apron or the robot's paper waist seam.
export function makeRobot(parent,{x=0,y=0,z=0,s=1,body,prop=true,lights=-1,species:character='leopard'}={}) {
  const p=puppet(parent,{x,y,z,s,coat:body,prop},character,true);
  const stitches=[];
  if (lights>=0) for(let i=0;i<12;i++) {
    const rail=p.rig.stitchRail;
    const stitch=poly(rail||p.inner,[[-.009,-.011],[.005,-.015],[.010,.011],[-.004,.015]],.004,'#66817a');
    if(rail){
      const offset=(i-5.5)*.026;
      stitch.position.set(offset,-.008+offset*offset*.28,0);
      stitch.scale.setScalar(.46);
    } else stitch.position.set((i%6-2.5)*.038,.199-.039*Math.floor(i/6),.086);
    stitch.material=stitch.material.clone();
    stitch.userData.raw=true;stitch.userData.keep=true;
    stitches.push(stitch);
  }
  p.lamps=stitches;p.lights0=Math.max(0,lights);
  p.setLights=(n=0)=>{
    stitches.forEach((stitch,i)=>stitch.material.color.set(i<n?'#dbb969':p.rig.stitchRail?'#817260':'#67877e'));
    p.lit=n;
    return stitches[n-1]||null;
  };
  p.setLights(p.lights0);
  return p;
}

const beat = (t, a, b) => (t <= a || t >= b ? 0 : Math.sin(Math.PI * (t - a) / (b - a)));
/** called every frame for every puppet on the open spread */
export function posePuppet(p, t, dt, gx, gy, hovered, reduced=false) {
  const e = 1 - Math.exp(-dt * 10), tt = t + p.phase;
  // The stage last aimed the mounted lens at its actual cup, footstep or wish.
  if(p.rig.targetLens)p.rig.targetLens();
  p.gaze.x += (gx - p.gaze.x) * e; p.gaze.y += (gy - p.gaze.y) * e;
  if (p.waveT > 0) p.waveT -= dt; if (p.hopT > 0) p.hopT -= dt;
  const hop = p.hopT > 0 ? Math.sin(Math.PI * (1 - p.hopT / .55)) * p.hopH : 0;
  const cheer = p.mood === 'cheer', doubt = p.mood === 'doubt';
  const drift = reduced ? 0 : 1;
  const bob = drift * Math.sin(tt * 2.1) * .012 + (cheer && !reduced ? Math.abs(Math.sin(tt * 6)) * .07 : 0);
  const step = p.walking ? Math.sin(tt * 11) : 0;
  p.inner.position.y = bob + hop + Math.abs(step) * .06; p.inner.rotation.z = (doubt ? .05 : 0) + drift * Math.sin(tt * 1.3) * .012 + (hovered ? .04 : 0) + step * .06;
  p.head.rotation.z = (doubt ? .26 : 0) + p.gaze.x * -.1 + drift * Math.sin(tt * 1.7) * .02;
  p.head.rotation.y = (p.rig.headYaw || 0) + p.gaze.x * .3; p.head.rotation.x = -p.gaze.y * .14;
  const blink=drift*beat(tt % 3.4,3.2,3.4);
  p.eyes.position.x = p.gaze.x * (p.rig.lens ? .005 : .016);
  p.eyes.scale.y = 1 - (p.rig.lens ? .34 : .86) * blink;
  const wave = p.waveT > 0 ? 1 : 0;
  const rest=p.rig.rest || [-.16,.16];
  const raisedHand=p.rig.lens ? .50 + Math.sin(tt*13)*.03 : 2.55 + Math.sin(tt*13)*.35;
  const rTarget = cheer ? 2.7 + Math.sin(tt * 9) * .2 : wave ? raisedHand : hovered ? .9 : rest[1] + drift * Math.sin(tt * 1.9) * .04;
  const lTarget = cheer ? -2.7 - Math.sin(tt * 9 + 1) * .2 : doubt ? -.5 : rest[0] - drift * Math.sin(tt * 1.9) * .04;
  p.armR.rotation.z += (rTarget - p.armR.rotation.z) * e; p.armL.rotation.z += (lTarget - p.armL.rotation.z) * e;
  poseResident(p,tt,step,reduced);
  if(p.rig.lens){
    // One hand checks the focus while the other can still hold a lantern string.
    const natural=drift*beat(tt%8.5,5.85,7.70);
    const focus=wave?Math.max(natural,Math.min(1,p.waveT*3)):natural;
    p.rig.focus(focus,lTarget);
    p.head.rotation.x+=.12*focus;
    p.rig.waist.rotation.x=.19*focus;
    p.rig.waist.rotation.z=.13*focus;
  }
}
