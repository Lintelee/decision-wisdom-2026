// Street furniture follows the paper hinge of the leaf it stands on.
import { group, keep, box, cyl, disc, ring, beam, poly, quad, slab, tab } from '../paper.js';
import { foldedTree, ridgeLine, bankPlants } from '../paper-landscape.js';

function cottage(g, x, floor, width, height, depth, wall, roof, timber) {
  const house=group(g);
  house.position.set(x,floor,0);
  const eaves=height*.72, ridge=height+.08;
  box(house,0,eaves*.5,0,width,eaves,depth,wall);
  poly(house,[[-width/2,eaves],[width/2,eaves],[width*.10,ridge]],.033,wall,0,0,depth*.5-.016);
  for(const [outer,tint] of [[-1,roof],[1,timber]]) {
    const side=outer*(width*.5+.07);
    quad(house,[side,eaves,-depth*.59],[width*.10,ridge,-depth*.59],[width*.10,ridge,depth*.62],[side,eaves,depth*.62],tint);
    beam(house,[side,eaves,depth*.62],[width*.10,ridge,depth*.62],.024,'#846e58',4);
  }
  const front=depth*.5+.021, w=width*.19;
  for(const sx of [-.26,.21]) {
    box(house,width*sx,eaves*.48,front,w,eaves*.43,.015,'#4a6461');
    box(house,width*sx,eaves*.34,front+.017,w*1.09,.035,.044,timber);
  }
}

function coastalRidge(S, morning) {
  const profiles = morning ? [
    [[-2.7,.75],[-2.18,1.48],[-1.79,1.23],[-1.25,1.88],[-.62,2.43],[-.13,1.86],[.27,2.02],[.74,1.42],[1.29,1.61],[1.83,1.10],[2.65,.69]],
    [[-2.67,.67],[-1.89,1.21],[-1.33,1.02],[-.97,1.40],[-.31,1.64],[.16,1.42],[1.00,2.22],[1.49,1.61],[1.88,1.76],[2.65,1.10]]
  ] : [
    [[-2.71,.95],[-2.16,1.73],[-1.75,1.39],[-1.06,1.98],[-.65,1.78],[.10,2.64],[.65,1.85],[1.11,2.03],[1.84,1.34],[2.65,.75]],
    [[-2.68,.74],[-1.93,1.13],[-1.55,1.08],[-.85,1.83],[-.34,1.51],[.16,1.92],[.69,2.34],[1.31,1.67],[1.68,1.83],[2.66,1.02]]
  ];
  for(const [index,profile] of profiles.entries()) {
    S.plant(index?2.79:-2.79,-3.51,g=>ridgeLine(g,{profile,depth:.21,
      base:morning?'#9b9b92':'#849997',light:morning?'#bbac96':'#a5afa1',shade:morning?'#7a8588':'#657e80'}));
  }
}

function quayWalk(S, morning) {
  const stone=morning?['#cebfa5','#cab69f','#b5b6a2','#c9b9a0']:['#a4b2aa','#bcc3af','#b3b7aa','#c0b9a4'];
  for(const side of [-1,1]) {
    // Match the old quay's glue joint so the paving follows its camber even halfway through a turn.
    const joint=side*2.18*1.31;
    S.plant(joint,0,g=>{
      const near=x=>1.98+.28*Math.sin(x*.87+(morning?.40:-.80));
      const xy=(x,z)=>[side*x-joint,z];
      for(let row=0;row<2;row++) {
        const cuts=row===0?[.075,.68,1.60,2.41,3.50,4.38,5.25]:[.075,.98,1.76,2.82,3.74,4.62,5.25];
        for(let k=1;k<cuts.length;k++) {
          const a=cuts[k-1]+.012,b=cuts[k]-.014,z=row*.36;
          const outline=[xy(a,near(a)+z),xy((a+b)*.5,near((a+b)*.5)+z-.010),
            xy(b,near(b)+z),xy(b,near(b)+z+.329),xy(a+.035,near(a)+z+.329)];
          slab(g,outline,.012,stone[(k+row+(side>0?1:0))%4],.224);
        }
      }
      // A pale curb traces the wet harbour edge between the bench and the gangway.
      for(const [a,b] of [[.12,1.18],[1.21,2.31],[2.34,3.54],[3.58,4.55],[4.59,5.12]]) {
        slab(g,[xy(a,.418),xy(b,.418),xy(b,.484),xy(a,.484)],.018,'#d8c4a3',.215);
      }
    });
  }
}

function curbTree(S, x, z, h, colors, kind='broadleaf') {
  S.plant(x,z,g=>{
    slab(g,[[-.46,-.19],[-.24,-.38],[.40,-.30],[.52,.05],[.29,.34],[-.35,.31]],.072,'#ad9d7f');
    const roots=group(g);roots.position.y=.070;
    foldedTree(roots,{...colors,kind,height:h});
    const greens=group(roots);greens.position.set(.22,0,.12);
    bankPlants(greens,{kind:'grass',height:.36,width:.57,leaf:colors.leaf,light:colors.light,shade:colors.shade});
  });
}

function teaChest(S) {
  S.plant(-3.94,2.37,g=>{
    const crate=keep(g);
    crate.rotation.y=.19;
    const w=1.10,h=.51,d=.67;
    box(crate,0,.04,0,w,.08,d,'#896c50');
    for(const side of [-1,1]) {
      box(crate,0,h*.51,side*d*.48,w,h,.045,'#ba8f5d');
      box(crate,side*w*.48,h*.51,0,.052,h,d,'#a77a50');
      for(const x of [-.44,.44]) box(crate,x,.26,side*(d*.52),.073,h+.03,.025,'#d7b582');
      box(crate,0,.26,side*(d*.52),w,.018,.018,'#8d684b');
    }
    for(const [x,z,ink] of [[-.30,.06,'#7a9581'],[0,-.08,'#ac7855'],[.29,.04,'#72918a']]) {
      const packet=group(crate);packet.position.set(x,.065,z);
      poly(packet,[[-.126,0],[-.145,.44],[-.097,.58],[.099,.58],[.142,.43],[.126,0]],.18,ink,0,0,-.09);
      box(packet,0,.42,.015,.266,.055,.196,'#e7c891');
      beam(packet,[-.098,.576,-.095],[.097,.576,.095],.018,'#4e6656',4);
    }
    const lid=keep(crate,0,h+.03,-d*.49);
    box(lid,0,0,d*.49,w+.045,.075,d+.03,'#a77c53');
    for(const x of [-.34,.34]) box(lid,x,.047,d*.49,.065,.025,d+.02,'#d1b481');
    // A stencilled tea sprout ties the cargo to the tins on the counter.
    const stamp=keep(lid,0,.045,.38);
    stamp.rotation.x=-Math.PI/2;
    poly(stamp,[[-.12,-.042],[-.085,.066],[-.015,.115],[.012,.075],[-.038,-.029]],.007,'#4a695b');
    poly(stamp,[[.001,-.042],[.073,.059],[.158,.09],[.129,-.002],[.039,-.056]],.007,'#4a695b');
    S.pad(crate,.40,[0,.34,.02]);
    S.discovery(crate,{id:'morning-tea-cargo',label:'印著嫩芽的茶葉箱',aim:[0,.38,.05],sound:'wood-creak',duration:.93,
      draw(u,n,still) {
        const t=still?Number(u>.12):S.T.MathUtils.smootherstep(u,0,.85);
        lid.rotation.x=-1.55*(n%2?t:1-t);
      }});
    // Coiled line rests on a second low crate, just inside the edge of the quay.
    const coil=group(g);
    coil.position.set(.87,0,.09);coil.rotation.y=-.18;
    cyl(coil,0,.13,0,.31,.27,.25,'#9a8664',10);
    for(const [i,r] of [.27,.227,.176,.122].entries()) {
      const turn=ring(coil,0,.267+i*.006,0,r,.024,i%2?'#c4a06e':'#d4b37f',12);
      turn.rotation.x=-Math.PI/2;
    }
    beam(coil,[.15,.28,.12],[.39,.019,.26],.021,'#bd9668',5);
  },{y:.18});
}

export function teaQuayScenery(S) {
  coastalRidge(S,true);
  quayWalk(S,true);
  curbTree(S,5.02,-1.13,2.64,{leaf:'#7a8d6c',light:'#a6ac83',shade:'#536e61',bark:'#806d50'},'camphor');
  S.plant(-4.66,-2.77,g=>{
    for(const [x,z,h] of [[-.49,.03,.63],[.20,-.03,.74]]) {
      const reed=group(g);reed.position.set(x,0,z);
      bankPlants(reed,{kind:'reeds',width:.52,height:h,leaf:'#86936f',light:'#b3af83',shade:'#5c7768'});
    }
  });
  S.plant(4.97,2.37,g=>{
    slab(g,[[-.55,-.12],[-.43,-.31],[.39,-.29],[.52,.10],[.25,.28],[-.43,.21]],.15,'#9a9881');
    const leaves=group(g);leaves.position.y=.144;
    bankPlants(leaves,{kind:'ginger',width:1.0,height:.66,leaf:'#6b846d',light:'#afad80',shade:'#577767'});
  },{y:.20});
  teaChest(S);
}

function hangingNet(S) {
  S.plant(-4.32,1.99,g=>{
    const rack=keep(g);
    rack.rotation.y=-.30;
    for(const x of [-.63,.63]) {
      beam(rack,[x,0,.16],[x,.98,0],.042,'#926f50',6);
      beam(rack,[x,0,-.26],[x,.98,0],.034,'#ad8b62',5);
    }
    beam(rack,[-.76,.94,0],[.76,.94,0],.042,'#b5986e',6);
    const net=keep(rack,0,.91,.041);
    const corners=[[-.58,0],[-.43,-.035],[0,-.10],[.43,-.035],[.58,0],[.51,-.54],[.32,-.75],[-.01,-.85],[-.37,-.76],[-.53,-.55]];
    poly(net,corners,.015,'#6e8881');
    for(const side of [-1,1]) {
      for(let row=0;row<4;row++) {
        const y=-.17-row*.145;
        for(let col=0;col<4;col++){
          const x=-.43+col*.257+(side===1?0:.126);
          if(x>.48 || (row===3 && Math.abs(x)>.37)) continue;
          beam(net,[x,y,.022],[x+side*.104,y-.142,.022],.008,'#c7c7a5',4);
        }
      }
    }
    for(const [x,y] of [[-.51,-.017],[-.19,-.075],[.13,-.078],[.46,-.027]]) {
      cyl(net,x,y,.027,.044,.052,.15,'#c3884a',6).rotation.z=Math.PI/2;
    }
    S.pad(net,.33,[0,-.38,0]);
    S.discovery(net,{id:'net-drying',label:'掛在岸邊晾乾的浮標網',aim:[0,-.38,0],sound:'cloth',duration:1.13,
      draw(u,n,still) {
        const t=still?Number(u>.1):S.T.MathUtils.smootherstep(u,0,.77),fold=n%2?t:1-t;
        net.scale.y=1-.60*fold;
        net.rotation.x=-.16*fold-(still?0:.31*Math.sin(Math.PI*u*2.7)*(1-u));
      }});
  },{y:.18});
}

export function photoQuayScenery(S) {
  coastalRidge(S,false);
  quayWalk(S,false);
  S.plant(3.92,-3.16,g=>{
    // A row of fishers' houses sits on a stepped stone quay across the harbour.
    const podium=[[-1.53,0],[-1.53,.61],[-1.10,.61],[-1.10,.82],[-.16,.82],[-.16,.60],[.91,.60],[.91,.45],[1.45,.45],[1.45,0]];
    poly(g,podium,.38,'#83948a',0,0,-.28);
    cottage(g,-.66,.82,.82,.78,.41,'#d7bd96','#aa7157','#8b664f');
    cottage(g,.39,.60,.91,.88,.49,'#b8b59a','#ac805a','#8a7358');
    cottage(g,1.17,.45,.52,.58,.39,'#e0c69f','#a9614a','#8e6656');
  });
  curbTree(S,5.13,-1.38,2.49,{leaf:'#748a71',light:'#a2ab7e',shade:'#4c6e66',bark:'#866e53'},'cypress');
  hangingNet(S);
}

function runningBend(S) {
  // Cut each half of the oval into its own leaf. At the fold the lane lines meet.
  for(const side of [-1,1]) {
    S.plant(side*2.81,0,g=>{
      const edge=[0,.20,.40,.60,.78,.89,1].map(t=>[(t*5.60-2.81)*side,2.63-1.50*t*t*t]);
      for(let lane=0;lane<2;lane++) {
        const offset=lane*.235, near=edge.map(([x,z])=>[x,z+offset+.223]);
        const far=edge.map(([x,z])=>[x,z+offset]);
        slab(g,[...far,...near.slice().reverse()],.018,lane?'#bd8464':'#b47758',.029);
        const stripe=far.map(([x,z])=>[x,z+.026]);
        slab(g,[...far,...stripe.slice().reverse()],.009,'#ead7ae',.052);
      }
      const last=edge.map(([x,z])=>[x,z+.453]);
      slab(g,[...last,...last.map(([x,z])=>[x,z+.035]).reverse()],.009,'#e5cfa8',.054);
    });
  }
}

function fieldClock(S) {
  S.plant(5.12,-2.97,g=>{
    box(g,0,.095,0,.62,.19,.57,'#b8aa87');
    box(g,0,.90,0,.39,1.43,.31,'#beac84');
    for(const side of [-1,1]) box(g,side*.186,.87,.155,.040,1.35,.037,'#718674');
    const pivot=keep(g,0,2.04,.19);
    const faceRadius=.42;
    box(g,0,1.77,0,.63,.42,.37,'#668076');
    cyl(pivot,0,0,0,faceRadius+.044,faceRadius+.044,.14,'#5a726c',12).rotation.x=Math.PI/2;
    disc(pivot,0,0,.083,faceRadius,'#e9d6a8',.035,16);
    for(let n=0;n<12;n++) {
      const a=n*Math.PI/6,r=faceRadius*.80;
      const mark=box(pivot,Math.sin(a)*r,Math.cos(a)*r,.112,.021,n%3?.037:.062,.009,'#67716a');
      mark.rotation.z=-a;
    }
    beam(pivot,[0,0,.127],[-.132,.126,.127],.021,'#705949',4);
    const hand=keep(pivot,0,0,.143);
    beam(hand,[0,0,0],[.016,.247,0],.014,'#a25b44',4);
    disc(pivot,0,0,.158,.035,'#987749',.015,8);
    S.pad(pivot,.43,[0,0,.06]);
    S.discovery(pivot,{id:'field-clock',label:'起跑線旁的賽時計',aim:[0,0,.09],sound:'clock-chime',duration:1.32,
      draw(u,n,still) {
        const t=still?Number(u>.16):S.T.MathUtils.smootherstep(u,0,.92);
        hand.rotation.z=-(n-1+t)*Math.PI/2;
      }});
  });
}

export function stadiumScenery(S) {
  const hills=[
    [[-2.65,.88],[-2.16,1.58],[-1.49,1.30],[-.86,2.46],[-.42,2.00],[.02,2.23],[.85,1.37],[1.36,1.63],[2.65,.67]],
    [[-2.65,.69],[-1.86,1.21],[-1.46,.99],[-.86,1.50],[-.44,1.30],[.27,2.30],[.67,1.87],[1.02,2.02],[1.67,1.48],[2.65,.88]]
  ];
  for(const [i,profile] of hills.entries()) S.plant(i?2.80:-2.80,-3.51,g=>ridgeLine(g,{profile,depth:.22,base:'#83936c',light:'#aab183',shade:'#617f68'}));
  curbTree(S,-5.14,-1.81,2.60,{leaf:'#638367',light:'#92a576',shade:'#4d705d',bark:'#826d50'},'cypress');
  S.plant(2.81,-2.70,g=>foldedTree(g,{kind:'cypress',height:2.03,leaf:'#718866',light:'#9ca977',shade:'#526e5b'}));
  runningBend(S);
  fieldClock(S);
}

function commuterBlock(S) {
  S.plant(-4.87,-2.97,g=>{
    const concrete='#a5aaa0',edge='#7f8d86',frames='#e1d4af';
    box(g,0,1.10,0,1.31,2.20,.53,concrete);
    box(g,0,2.20,.015,1.43,.09,.60,'#9b9d85');
    for(const y of [.70,1.43]) {
      for(const x of [-.36,.05,.41]) box(g,x,y,.282,.22,.37,.025,'#667c76');
      box(g,0,y-.22,.305,1.21,.055,.12,frames);
    }
    cyl(g,-.24,2.51,-.04,.28,.30,.49,edge,12);
    for(const y of [2.31,2.54,2.70]) cyl(g,-.24,y,-.04,.307,.307,.024,'#b6b7a4',12);
    cyl(g,-.24,2.79,-.04,.14,.29,.12,'#a4aba3',12);
    beam(g,[.57,2.25,.15],[.57,.09,.15],.024,'#81948a',6);
  });
  S.plant(1.00,-3.33,g=>{
    const profile=[[-.94,.84],[-.49,1.21],[.02,1.08],[.49,1.51],[.93,1.33],[1.40,1.76],[2.10,1.10],[2.44,1.17],[3.12,.85]];
    ridgeLine(g,{profile,depth:.14,base:'#8eaaa2',light:'#a6b8ab',shade:'#78948e'});
  });
}

function rainBed(S) {
  S.plant(4.20,2.21,g=>{
    const bed=[[-.96,-.31],[-.55,-.43],[.75,-.35],[.95,-.13],[.75,.29],[-.31,.39],[-.91,.28]];
    slab(g,bed,.078,'#8c9790');
    slab(g,bed.map(([x,z])=>[x*.92,z*.79]),.032,'#769491',.074);
    const left=group(g);left.position.set(-.62,.107,-.01);
    bankPlants(left,{kind:'ginger',width:.63,height:.59,leaf:'#637e65',light:'#9aa878',shade:'#506e61'});
    const right=group(g);right.position.set(.56,.106,.04);
    bankPlants(right,{kind:'reeds',width:.64,height:.79,leaf:'#688a78',light:'#9ead88',shade:'#547368'});
    const perch=slab(g,[[-.32,-.09],[-.19,-.21],[.07,-.13],[.14,.03],[-.03,.14],[-.25,.1]],.11,'#a4a89a',.088);
    const snail=keep(g,-.26,.202,.014);
    poly(snail,[[-.19,0],[-.09,.07],[.05,.075],[.11,.13],[.17,.105],[.20,.033],[.11,.005]],.05,'#bdac79');
    disc(snail,-.028,.136,.033,.111,'#b77d50',.069,12);
    ring(snail,-.020,.139,.086,.055,.010,'#e2c58d',10);
    for(const [x,tip] of [[.109,.140],[.146,.191]]) {
      beam(snail,[x,.11,.037],[tip,.181,.055],.009,'#91785b',4);
      disc(snail,tip,.181,.060,.014,'#655d49',.009,6);
    }
    const shimmer=keep(g,.20,.10,.02);
    for(const [i,r] of [.11,.21].entries()) {
      const ripple=ring(shimmer,0,0,0,r,.010,'#d9dfbd',14);ripple.rotation.x=-Math.PI/2;ripple.scale.y=.53+.12*i;
    }
    S.pad(snail,.29,[0,.12,0]);
    S.discovery(snail,{id:'rain-garden-snail',label:'雨水花圃裡探出頭的蝸牛',aim:[0,.12,0],sound:'rain-drop',duration:1.28,
      draw(u,n,still) {
        const t=still?Number(u>.13):S.T.MathUtils.smootherstep(u,0,.95);
        snail.position.x=-.26+.30*(n%2?t:1-t);
        snail.rotation.z=(still?0:.07*Math.sin(u*Math.PI*3))*(1-u);
        shimmer.visible=u<.90;shimmer.scale.setScalar(.55+u*1.15);
      }});
    shimmer.visible=false;
    perch.name='雨水花圃踏石';
  });
}

export function rainLaneScenery(S) {
  commuterBlock(S);
  curbTree(S,5.02,-1.80,2.65,{leaf:'#699184',light:'#9cb292',shade:'#537c74',bark:'#8e795f'},'camphor');
  rainBed(S);
}
