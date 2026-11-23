// The figures outside the workshops wear the same clothes as on their story page.
import { T, ball, beam, group, keep, poly, tri } from '../paper.js';
import { buildResident, residentName } from '../resident-puppets.js';
import { handLantern } from '../bamboo-hand-lantern.js';
import { townStops } from '../town-layout.js';

function body(g,x,y,z,w,h,d,color){
  const m=ball(g,x,y,z,1,color,1);m.scale.set(w,h,d);return m;
}
const visits={
  2:{species:'leopard',time:4.65,offset:.55,via:[[-3.74,-1.48],[-3.33,-1.35],[-2.79,-1.54],[-2.43,-1.76],[-2.46,-2.0]],look:[-2.08,-2.47]},
  10:{species:'civet',time:5.32,offset:6.45,via:[[2.24,.77],[2.55,1.37],[2.44,1.84],[2.07,2.34],[1.62,2.67]],look:[1.13,2.52]},
};
const up=new T.Vector3(0,1,0);
const eased=v=>{const u=Math.max(0,Math.min(1,v));return u*u*(3-2*u);};
const turn=(a,b,t)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*eased(t);
function followVisit(g,level,visit,register){
  const stop=townStops[level-1],p=new T.Vector3(),tangent=new T.Vector3();
  const local=([x,z])=>new T.Vector3(x-stop.x,0,z-stop.z).applyAxisAngle(up,-stop.angle);
  const lane=new T.CatmullRomCurve3(visit.via.map(local));
  const facing=u=>{lane.getTangentAt(u,tangent);return Math.atan2(tangent.x,tangent.z);};
  const arriving=facing(1),leaving=facing(0),shop=local(visit.look).sub(lane.getPointAt(1));
  const windowAngle=Math.atan2(shop.x,shop.z);
  const actor=keep(g);actor.name=level===2?'走向相館的石虎':'駐足看西瓜的阿嬤';actor.scale.setScalar(.65);
  const {legs,head:neck}=buildResident(actor,visit.species,false),walk=visit.time,inspect=3.15,rest=1.3,period=walk*2+inspect+rest;
  register((time,still)=>{
    const phase=still?walk+inspect*.46:(time+visit.offset)%period;
    let u,yaw,nod=0,stride=0;
    if(phase<walk){
      const progress=phase/walk;
      u=eased(progress);yaw=facing(u);stride=Math.sin(phase*9)*Math.sin(progress*Math.PI);
    }else if(phase<walk+inspect){
      const wait=phase-walk;u=1;
      yaw=wait<.70?turn(arriving,windowAngle,wait/.7):turn(windowAngle,arriving+Math.PI,(wait-inspect+.70)/.70);
      nod=eased((wait-.37)/.53)*(1-eased((wait-inspect+.90)/.55));
    }else if(phase<walk*2+inspect){
      const returning=phase-walk-inspect,progress=returning/walk;
      u=1-eased(progress);yaw=facing(u)+Math.PI;stride=Math.sin(returning*9)*Math.sin(progress*Math.PI);
    }else{
      u=0;yaw=turn(leaving+Math.PI,leaving,(phase-walk*2-inspect)/rest);
    }
    lane.getPointAt(u,p);actor.position.set(p.x,.027+.045*u+.025*Math.abs(stride),p.z);
    // The tiny stage puppets cheat toward the reader while their feet follow the lane.
    actor.rotation.y=Math.atan2(.70*Math.sin(yaw),.92+.16*Math.cos(yaw));actor.rotation.z=stride*.045;
    legs[0].rotation.x=stride*.63;legs[1].rotation.x=-stride*.63;
    neck.rotation.x=nod*(still?.25:.39)+Math.abs(stride)*.035;neck.rotation.z=nod*-.12;
  });
}
const residents={
  4:{species:'frog',position:[.63,.105,.46],size:.68},
  9:{species:'dog',position:[-.79,.115,.53],size:.66},
  11:{species:'magpie',position:[.78,.17,.40],size:.69},
  12:{species:'pangolin',position:[.30,.10,.52],size:.72},
};
function lanternStrings(g,rig,register){
  const lantern=g.getObjectByName('街圖天燈的燈身');
  const pins=rig.grips.map((grip,i)=>{
    const top=keep(lantern,i?.093:-.093,-.165,.060),line=keep(g);
    line.name=i?'街圖天燈的右牽繩':'街圖天燈的左牽繩';
    beam(line,[0,-.50,0],[0,.50,0],.0076,'#ac8559',5);
    return {top,grip,line};
  });
  const a=new T.Vector3(),b=new T.Vector3(),v=new T.Vector3();
  register(()=>{
    for(const {top,grip,line} of pins){
      g.worldToLocal(grip.getWorldPosition(a));g.worldToLocal(top.getWorldPosition(b));
      v.subVectors(b,a);line.position.copy(a).addScaledVector(v,.5);
      line.scale.y=v.length();line.quaternion.setFromUnitVectors(up,v.normalize());
    }
  });
}
export function neighbour(g,level,register){
  if(visits[level]){followVisit(g,level,visits[level],register);return;}
  const resident=residents[level];if(!resident)return;
  const actor=group(g);actor.name=residentName(resident.species);actor.position.set(...resident.position);
  actor.scale.setScalar(resident.size);actor.rotation.y=level===11?-.19:.22;
  if(level===9)actor.scale.x*=-1;
  const rig=buildResident(actor,resident.species,level===9);
  const lamp=level===9?handLantern(rig,actor,{size:1.08}):null;
  register((t,still)=>{
    const sway=still?0:Math.sin(t*1.35);
    rig.head.rotation.z=(level===9?-.06:.013)+sway*.047;
    if(level===4)rig.armR.rotation.z=-.35+sway*.13;
    if(rig.fan)rig.fan.rotation.z=sway*.16;
    if(lamp){
      rig.armL.rotation.z=rig.rest[0]-.078*sway;
      rig.armR.rotation.z=rig.rest[1]+.11*sway;
      lamp.hang(t,still?0:.057);
    }
    if(level===12)rig.poseClaws(.42,0);
  });
  if(level===12)lanternStrings(g,rig,register);
}
function foldedWing(g,side){
  const wing=keep(g,0,0,0),s=side;
  tri(wing,[0,.025,.045],[s*.23,.092,0],[s*.37,.205,-.14],'#f5e8bb');
  tri(wing,[0,.025,.045],[s*.37,.205,-.14],[s*.14,.008,-.10],'#bdbaa1');
  return wing;
}
export function fly(S,x,z,size,phase,register,flock,order){
  S.plant(x,z,g=>{
    const flight=keep(g),bird=keep(flight);
    const left=foldedWing(bird,-1),right=foldedWing(bird,1);
    body(bird,0,0,0,.070,.060,.165,'#e9dbc1');
    tri(bird,[-.048,.013,-.11],[.051,.010,-.11],[0,.053,-.28],PAPER_TAIL);
    body(bird,0,.023,.117,.058,.053,.071,'#f3e8c6');
    poly(bird,[[-.025,0],[.025,0],[0,.08]],.018,'#c9a359',0,.025,.153).rotation.x=.95;
    bird.scale.setScalar(size);
    S.pad(bird,.24);
    S.discovery(bird,{id:'map-gull-'+order,label:['屋脊上的領飛海鷗','橋上的紙海鷗','樹梢上的紙海鷗'][order],
      duration:1.6,sound:visit=>visit%2?'wing-flit':'gull',
      draw(u){if(u===0)flock.leader=order;if(flock.leader===order)flock.u=u;},
      reset(){if(flock.leader===order){flock.leader=-1;flock.u=1;}}
    });
    register((t,still)=>{
      const a=still?phase:phase+t*.36;
      const delay=((order-flock.leader+3)%3)*.16;
      const progress=Math.min(1,Math.max(0,(flock.u-delay)/.62));
      const lift=flock.leader<0?0:still?Number(progress>.12&&progress<.90)*.7:Math.sin(Math.PI*progress);
      flight.position.set(Math.cos(a)*.56+.46*lift,1.68+.28*Math.sin(a)+.14*phase+.59*lift,-.12+.36*Math.sin(a)-.22*lift);
      bird.rotation.y=-a+.48;bird.rotation.z=.11*Math.sin(a)+.48*lift;
      left.rotation.z=(still?.10:.35*Math.sin(t*3.35+phase))+.67*lift;right.rotation.z=-left.rotation.z;
    });
  });
}
const PAPER_TAIL='#d2c9a5';
