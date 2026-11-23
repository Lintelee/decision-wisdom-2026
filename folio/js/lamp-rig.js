// The approved robot uses the same folded card, ink relief and cut edges as the animals.
import { T, keep } from './paper.js';

const cream = '#f0e4ce', ivory = '#f7efdd', buff = '#cfbfa1';
const slate = '#474344', dark = '#34333b';
const violet = '#a28ab7';
const shell = '-27,49 -32,56 -36,67 -37,79 -35,89 -30,98 -23,105 -15,109 -3,111 9,110 20,106 29,100 35,90 38,78 37,66 33,56 27,49 22,47 20,53 13,57 4,58 -7,58 -15,56 -21,52 -23,47';
const cap = '-13,-8 -16,-2 -17,6 -16,13 -13,19 -8,24 -1,26 6,25 12,21 16,15 18,7 18,0 15,-6 9,-10 3,-12 -5,-12';
const belly = '-36,76 -23,73 0,72 24,74 37,78 36,66 32,56 26,49 22,47 20,52 12,56 1,58 -11,57 -20,53 -23,47 -28,50 -33,57 -36,65';
const seam = '-36,77 -21,74 -2,73 17,73.7 37,77.8 36.5,75.3 19,71.9 -2,71 -23,72.1 -36,75.1';
const shoulder = '-5,-5 -8,-1 -7,4 -4,8 1,9 5,7 8,3 8,-2 5,-6 0,-7';
const upperStrip = '-2,0 2,0 2.7,-11 2,-18 -2.5,-20 -3,-12';
const upperCuff = '-3,-5 2,-4 3,-6 2.6,-14 -2.4,-15 -3.5,-12';
const forearm = '-3,0 2.6,.7 4,-4 3,-15 1,-18 -2.7,-17 -4.1,-11 -4.4,-4';
const fingers = '-2.5,-15 2.4,-15 2.7,-19 6,-23.5 5.2,-24.5 1.7,-22.4 1,-25 .1,-25.4 -1.2,-21.7 -3.9,-24 -4.9,-23.7 -3.1,-19';
const pelvis = '-13,0 -10,4 -6,7 3,8 9,6 13,3 14,0 10,-5 3,-8 -5,-8 -11,-5';
const sole = '-4,2 3,3 4,.8 9,-1 11,-3 8,-3.5 4,-3 6,-4.3 3,-4.3 -1,-3.1 -5,-3.6 -6,-2 -5,.9';
const oval = (x,y,rx,ry,sides=14) => Array.from({length:sides},(_,i) => {
  const a = Math.PI * 2 * i / sides;
  return [x + Math.cos(a) * rx, y + Math.sin(a) * ry];
});

export function lampPatterns({at,folded,ink,pip}) {
  function flat(g,shape,tone,z,depth=.65) { return ink(g,shape,tone,z,depth); }
  function panel(g,shape,tone,shade,z,edge=.85,depth=3,crease=[0,.1]) {
    folded(g,shape,tone,z,{edge,depth,shade,crease});
  }
  function joint(g,detail,x,y,z,r) {
    pip(g,x,y,z,r,slate,10);
    if(detail===2) pip(g,x,y,z+.52,r*.48,'#c3a576',9);
  }
  function leg(root,side,detail) {
    const hip=at(root,side*9.5,39,side>0?0:-1.5);
    hip.rotation.z=side*.046;
    flat(hip,'-2.5,2 2.5,2 2,-15 1,-26 -2,-26 -2.6,-14',slate,0,1.6);
    const shin=at(hip,0,-15,1);
    joint(shin,detail,0,0,1.1,2.6);
    const boot='-3,-1 2,-.5 3.5,-3 3,-17 2,-19 -2,-19 -3.2,-15';
    if(detail===0)flat(shin,boot,cream,2.2,1.8);
    else panel(shin,boot,ivory,buff,2.5,.47,2.1,[1,.018]);
    if(detail===2)flat(hip,upperCuff,cream,1.2);
    flat(shin,'-1.8,-17 2,-17 2,-21 -2,-21',slate,1.6);
    const foot=at(shin,0,-20,2.3);
    foot.scale.x=side;
    flat(foot,sole,dark,1,2);
    if(detail>0)flat(foot,'-4,1 0,3 3,1.8 6,.1 3.1,-.9 -.6,.1 -3,-.8',buff,3.2);
    return hip;
  }
  function arm(body,side,detail) {
    const root=at(body,side*38,77,side<0?5:0);
    flat(root,upperStrip,slate,.2,1.8);
    if(detail===2)panel(root,upperCuff,ivory,buff,2.1,.48,1.25);
    const elbow=at(root,0,-18,1.5);
    joint(elbow,detail,0,0,1,3);
    flat(elbow,fingers,slate,2,1.45);
    if(detail===0)flat(elbow,forearm,cream,2.6,1.3);
    else panel(elbow,forearm,ivory,buff,2.8,.52,1.6,[1,.03]);
    if(detail===0) flat(root,shoulder,ivory,3,2);
    else panel(root,shoulder,ivory,'#d8c6a5',3,.74,2.1,[-1,.12]);
    if(detail===2){
      flat(elbow,'-3.2,-11.8 2.6,-11.1 2.8,-13.4 -3.1,-14.1',buff,5);
      pip(root,1,0,5.5,1.8,'#b49b74',9);
    }
    const grip=at(elbow,.9*side,-22.1,3.4);
    grip.name=side<0?'左手紙指':'右手紙指';
    return {root,elbow,grip};
  }
  function bodyStock(body,detail) {
    flat(body,'-12,38 -11,50 -7,60 12,59 15,48 10,38',dark,-2,3.4);
    const hip=at(body,0,43,-1.2);
    if(detail===0)flat(hip,pelvis,cream,2,2);
    else panel(hip,pelvis,cream,buff,2,.68,2,[-3,-.2]);
    if(detail===0){
      flat(body,shell,ivory,0,3);
      flat(body,seam,'#766e62',3.2);
      return;
    }
    // One continuous front and one separate lower shell for the intermediate cut.
    panel(body,shell,ivory,'#e0d2b6',.3,1.1,3.9,[10,-.10]);
    panel(body,belly,'#ecdfc6','#cfbfa5',3.5,.56,2.0,[-8,.03]);
    flat(body,'-34,72 -25,71 -21,58 -20,53 -24,49 -29,56 -32,63','#f5e9d1',5.64,.37);
    flat(body,seam,'#77695a',5.7,.4);
    if(detail===2){
      // Three deliberately broad panels. No hairline scores, metal or machined rivets.
      flat(body,'-34,78 -32,91 -24,102 -14,107 -20,100 -25,90 -28,78','#f7ecd1',3.1);
      flat(body,'20,105 29,99 35,89 37,79 28,77 26,87 24,95','#c8b795',3.05);
      flat(body,'-29,71 -22,57 -21,52 -26,50 -32,59 -35,70','#d3c09d',5.85);
      panel(body,'17,65 23,66 24,61 22,58 17,57 15,59','#dfcaa2','#c3ab82',5.8,.4,1.5,[19,0]);
    }
  }
  function cutLamp(parent,detail,{short=true}={}) {
    const root=keep(parent);
    root.scale.setScalar(short ? .91 : 1.045);
    const waist=at(root,0,47.5,0);
    const body=at(waist,0,-47.5,0);
    const legs=[leg(root,-1,detail),leg(root,1,detail)];
    bodyStock(body,detail);

    // The frame belongs to the head. Only the purple ink and catchlight blink.
    const head=at(body,4,91,detail===0?5:8);
    head.rotation.z=-.06;
    if(detail===0)flat(head,cap,cream,1,2.5);
    else panel(head,cap,ivory,'#d8c5a3',1,.87,3.8,[4,-.06]);
    if(detail===2)flat(head,'-15,9 -13,17 -7,23 0,25 9,23 14,17 5,20 -4,21 -10,17','#f8ecd0',3.2);
    const eye=at(head,2.1,4.7,detail===0?4:5.4);
    if(detail>0)flat(eye,oval(0,0,13,14),detail===1?'#b5a080':'#b29a79',0,1.8);
    if(detail===2)flat(eye,oval(0,0,11.95,12.85),'#e3d2af',2,.9);
    flat(eye,oval(0,0,10.8,11.8),dark,3,1.3);
    if(detail>0)flat(eye,'-9,4 -7.2,8 -2,10.4 3,10.6 1,9 -3,8.1 -6.1,5.7','#56515b',4.43);
    const eyes=keep(eye);
    const lens=at(eyes,2.4,-.8,5.1);
    lens.name='巡燈鏡頭';
    flat(lens,oval(0,0,detail===0?3.3:3.85,detail===0?3.45:4),violet,0);
    pip(lens,1.1,1.25,.8,1.08,'#fff0d8',8);
    if(detail===2)flat(head,'-3,-9 5,-9 4,-13.6 1,-15 -3.4,-13.2','#887963',2.35);

    const left=arm(body,-1,detail),right=arm(body,1,detail);
    return {root,body,waist,head,eye,eyes,lens,legs,left,right};
  }

  // The proof sheets hold the same dies at the same pose across A, B and C.
  function lampPattern(parent,detail,options) {
    const model=cutLamp(parent,detail,options);
    model.left.root.rotation.z=3.01;
    model.left.elbow.rotation.z=-1.24;
    model.right.root.rotation.z=.24;
    model.right.elbow.rotation.z=.19;
    return model;
  }
  function lightingTechnician(parent,short) {
    const {body,waist,head,eyes,lens,legs,left,right}=cutLamp(parent,1,{short});
    const stitchRail=at(body,0,72.2,6.5);
    stitchRail.name='腰縫的工作記號';
    const rest=[-.14,.24];
    left.root.rotation.z=rest[0];right.root.rotation.z=rest[1];
    const target=new T.Vector3();
    const upper=.18,fore=.245;
    return {
      waist,head,eyes,lens,legs,stitchRail,rest,mouth:lens,
      armL:left.root,armR:right.root,elbows:[left.elbow,right.elbow],grips:[left.grip,right.grip],
      targetLens() {
        // Stop on the rim. The finger and the violet pupil should both be visible.
        target.set(-.162,.049,.012);
        lens.localToWorld(target);
        left.root.parent.worldToLocal(target);
      },
      focus(weight,restAngle) {
        const shoulder=left.root,elbow=left.elbow;
        shoulder.rotation.z=restAngle;
        shoulder.rotation.x=0;
        if(weight<=.001)return;
        const dx=target.x-shoulder.position.x,dy=target.y-shoulder.position.y;
        const distance=T.MathUtils.clamp(Math.hypot(dx,dy),Math.abs(upper-fore)+.0001,upper+fore-.0001);
        const bend=-Math.acos(T.MathUtils.clamp((distance*distance-upper*upper-fore*fore)/(2*upper*fore),-1,1));
        const reach=Math.atan2(dx,-dy)-Math.atan2(fore*Math.sin(bend),upper+fore*Math.cos(bend));
        // Rotate about the paper pins; the narrow edges never replace the hand silhouettes.
        shoulder.rotation.z=T.MathUtils.lerp(restAngle,reach,weight);
        elbow.rotation.z=T.MathUtils.lerp(elbow.rotation.z,bend,weight);
        const forward=target.z-shoulder.position.z-elbow.position.z-left.grip.position.z;
        shoulder.rotation.x=T.MathUtils.clamp(Math.atan2(forward,Math.max(.16,dy)),-.15,.29)*weight;
      }
    };
  }
  return {lampPattern,lightingTechnician};
}
