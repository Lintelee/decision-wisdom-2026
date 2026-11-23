import { T, keep, box, cyl, beam, poly } from '../paper.js';
import { aimPaperHand } from '../paper-hands.js';
import { steamCurl } from './market-craft.js';

// Two cups, one seated customer. The tray, the rim, the muzzle and the paw
// keep their own hinges so their points meet even when the book is turned.
export function teaBench(g, gran) {
  const dock=keep(g,.46,.77,.14); dock.name='板凳旁的茶盤座';
  for (const x of [-.32,.32]) for (const z of [-.145,.145])
    beam(dock,[x,-.765,z],[x,-.03,z],.029,'#805b45',5);
  box(dock,0,-.029,0,.95,.058,.44,'#b68a5a');
  box(dock,0,-.105,.176,.79,.072,.032,'#9d714d');
  const basket=gran.root.getObjectByName('阿梅姨的菜籃');
  g.add(basket); basket.userData.keep=true;
  basket.scale.setScalar(gran.root.scale.x);
  basket.position.set(-.59,.198,.22); basket.rotation.set(0,-.17,0);
  const right=keep(gran.rig.elbows[1],.015,-.151,.055);
  const left=keep(gran.rig.elbows[0],.008,-.154,.055);
  right.name='紅領巾客人握杯的右爪'; left.name='紅領巾客人托杯的左爪';
  for(const paw of [right,left]) {
    poly(paw,[[-.032,-.012],[-.025,.018],[-.004,.031],[.023,.025],[.037,.008],[.028,-.013],[.007,-.022]],.011,'#75604e',0,0,.021);
    for(const x of [-.010,.008])beam(paw,[x,.009,.033],[x+.003,.019,.033],.0028,'#b39a7c',4);
  }
  return { dock, right, left };
}

export function dressTeaCup(cup,index) {
  const face=index?'#3e7958':'#b75245', light=index?'#91aa70':'#da876c';
  // A broad glaze and a different stamp carry the colour even at phone size.
  cyl(cup,0,.077,0,.087,.081,.081,face,10);
  cyl(cup,0,.122,0,.087,.087,.011,light,10);
  cyl(cup,0,.132,0,.082,.087,.010,face,10);
  if(index) poly(cup,[[-.029,.074],[-.025,.096],[-.009,.110],[.026,.117],[.021,.093],[.007,.079]],.006,'#e4d3a4',0,0,.087);
  else for(const x of [-.019,.014]) beam(cup,[x-.007,.066,.086],[x+.006,.108,.086],.0048,'#efcdb1',5);
  const rim=keep(cup,-.065,.152,.023);rim.name=index?'綠杯碰嘴的杯緣':'紅杯碰嘴的杯緣';
  const vapor=keep(cup,.069,.157,-.019);vapor.name=index?'綠茶的熱氣':'紅茶的熱氣';vapor.visible=false;
  const curl=keep(vapor,.009);steamCurl(curl);curl.scale.set(.47,.54,.48);
  return {cup,rim,vapor,home:cup.position.clone()};
}

export function makeTaste(S,gran,bench,tray,drinks) {
  const m={sip:0,sniff:0,hug:0,tilt:0,push:0,reject:0,nod:0};
  let current=-1;
  const seat=new T.Vector3(), start=new T.Vector3(), target=new T.Vector3(), local=new T.Vector3(), grip=new T.Vector3();
  const {left,right}=bench;
  function reset() { current=-1;for(const key of Object.keys(m))m[key]=0; }
  function select(index) {
    if(current>=0)drinks[current].vapor.visible=false;
    const push=m.push;reset();m.push=push;current=index;drinks[index].vapor.visible=true;
  }
  const to=(values,seconds)=>S.to(m,values,seconds,'inOut');
  function tick(t,still) {
    for(const [i,leg] of gran.rig.legs.entries()) {leg.rotation.x=-.38;leg.rotation.z=i?.14:-.15;}
    if(current<0)return;
    const {cup,rim,vapor,home}=drinks[current];
    gran.inner.rotation.z=.016-.07*m.reject-.034*m.hug;
    gran.head.rotation.y=-.39*m.reject+.07*m.sniff;
    gran.head.rotation.z=.15*m.reject-.19*m.sniff-.055*m.hug-.30*m.nod;
    gran.head.rotation.x=.15*m.sniff+.20*m.nod;
    gran.eyes.scale.y*=1-.31*m.reject-.28*m.sniff-.15*m.hug;
    gran.eyes.position.x=.013*(m.sip+m.sniff)-.015*m.reject;
    seat.copy(home);
    if(current===0){seat.x+=m.push*.062;seat.z+=m.push*.044;}
    cup.position.copy(seat);cup.rotation.z=m.tilt;
    rim.getWorldPosition(start);target.copy(start);
    if(m.sniff)target.lerp(gran.rig.mouth.localToWorld(local.set(.021,.030,.038)),m.sniff);
    if(m.sip)target.lerp(gran.rig.mouth.localToWorld(local.set(0,0,.029)),m.sip);
    if(m.hug)target.lerp(gran.inner.localToWorld(local.set(-.061,.792,.154)),m.hug);
    tray.worldToLocal(target);tray.worldToLocal(start);
    cup.position.add(target.sub(start));
    cup.localToWorld(grip.set(-.054+.118*m.hug,.079,.057));
    gran.inner.worldToLocal(grip);
    aimPaperHand(gran.armR,gran.rig.elbows[1],right,grip);
    if(m.hug>.01) {
      cup.localToWorld(grip.set(-.069,.068,.042));gran.inner.worldToLocal(grip);
      aimPaperHand(gran.armL,gran.rig.elbows[0],left,grip);
    } else {
      gran.armL.rotation.z=-.32-.62*m.reject;
      gran.rig.elbows[0].rotation.z=-.15-.25*m.reject;
    }
    vapor.rotation.z=-cup.rotation.z;
    const drift=still?0:Math.sin(t*2.4);
    vapor.scale.set(1,1+.12*drift,1);
    vapor.position.x=.076+.008*drift;
  }
  return {reset,tick,
    async red() {
      select(0);
      await to({sip:1,tilt:.32},.62);S.sound('soft',drinks[0].cup);
      await S.wait(.38);
      await to({sip:0,tilt:0,reject:1,push:1},.67);
      drinks[0].vapor.visible=false;S.sound('cup',drinks[0].cup);
    },
    async green() {
      select(1);
      await to({sniff:1,tilt:.13},.56);await S.wait(.45);
      await to({sniff:0,sip:1,tilt:.31},.30);S.sound('soft',drinks[1].cup);
      await S.wait(.32);
      await to({sip:0,hug:1,tilt:-.035},.52);
      await to({nod:1},.26);await S.wait(.14);await to({nod:0},.29);
    }
  };
}
