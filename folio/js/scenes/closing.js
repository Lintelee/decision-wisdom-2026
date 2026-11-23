// The tea cart from the first spread opens once more, after the lantern fair.
import { T, keep, box, cyl, disc, ring, beam, poly, tab, strut, slab } from '../paper.js';
import { teaStall } from './harbor-atelier.js';
import { foldedTree, ridgeLine, bankPlants } from '../paper-landscape.js';

const ink = '#354e4c', darkWood = '#704b3e', wood = '#a1704f', brass = '#c29b5f';
const damp = T.MathUtils.smoothstep;

function lanternPaper(off, on) {
  const cold = new T.Color(off), warm = new T.Color(on);
  const material = new T.MeshLambertMaterial({ color: cold, emissive: warm, emissiveIntensity: 0, side: T.DoubleSide });
  return {
    material,
    warm(value) {
      material.color.lerpColors(cold, warm, value);
      material.emissiveIntensity = value * .35;
    },
  };
}

function pane(parent, paper, x, y, z, width, height) {
  const mesh = new T.Mesh(new T.PlaneGeometry(width, height), paper.material);
  mesh.position.set(x, y, z);
  mesh.userData.raw = true;
  parent.add(mesh);
}

function printQuay(G) {
  G.wash('#e7d9b8');
  const water = [[-5.70,-3.25],[-2.94,-3.29],[-.38,-3.13],[1.25,-3.23],[5.70,-3.17],
    [5.57,-1.93],[3.05,-1.90],[.77,-1.38],[-.79,-.99],[-3.05,-.71],[-5.52,-.82]];
  G.blob(water,'#78928d',{edge:'#627e79',edgeW:.033,sharp:true});
  const farBank=[[-5.57,-3.05],[-2.67,-3.12],[-.72,-2.72],[.37,-2.38],[1.11,-2.42],
    [2.22,-2.66],[5.50,-2.81],[5.53,-1.63],[2.91,-1.81],[.91,-2.04],[-1.07,-1.63],[-3.54,-1.38],[-5.52,-1.42]];
  G.blob(farBank,'#a19f8b',{edge:'#788a7f',edgeW:.032,sharp:true});
  for (let row=0; row<4; row++) {
    for (let k=0; k<8; k++) {
      const x = -5.19 + k*1.36 + Math.sin(k*13 + row*5)*.24;
      const z = -1.39 + row*.11 - .085*x + Math.sin(k*3 + row)*.055;
      G.path([[x,z],[x+.21,z-.018],[x+.42+(k%3)*.09,z+.009]],
        {w:k%3===0?.027:.017,col:(k+row)%4===0?'#e2c49a':'#b4c3ac',sharp:true});
    }
  }
  const apron=[[-5.56,.04],[-3.31,-.02],[-1.04,-.40],[2.18,-.97],[5.44,-1.19],
    [5.62,-.02],[5.49,1.21],[5.55,2.66],[4.29,2.79],[1.86,2.73],[.24,2.84],[-1.66,2.72],[-3.91,2.84],[-5.43,2.66]];
  G.blob(apron,'#ccbfa3',{edge:'#b8a98b',edgeW:.038,sharp:true});
  for(let row=0;row<3;row++) {
    const z=1.43+row*.52;
    G.path([[-5.39,z],[-3.19,z+.038],[.14,z-.073],[3.1,z+.035],[5.36,z-.043]],{col:'#ac9b8060',w:.014,sharp:true});
    for(let k=0;k<8;k++) {
      const x=-4.94+k*1.30+(row%2)*.51;
      G.path([[x,z+.034],[x+.027,z+.46]],{col:'#ae9b7f52',w:.012,sharp:true});
    }
  }
  const lane = [[-5.57,.00],[-3.53,.10],[-.77,-.28],[2.14,-.90],[5.47,-1.26],
    [5.52,.25],[2.67,.38],[-.74,.95],[-3.48,1.58],[-5.51,1.65]];
  G.blob(lane,'#ccba99',{edge:'#ad9776',edgeW:.027,sharp:true});
  G.path([[-5.42,1.45],[-3.53,1.37],[-.8,.76],[2.5,.21],[5.4,.08]],{col:'#eddfc3',w:.041});
  for (let i=0;i<16;i++) {
    const x=-5.25+i*.67, z=.77-.13*x+.1*Math.sin(x);
    G.path([[x-.12,z-.33],[x+.09,z+.21]],{col:'#aa967737',w:.017,sharp:true});
  }
  G.marks('tick',-5.4,1.78,5.39,2.82,{n:37,col:'#9c86642f',size:.053,seed:47});
}

function foldingHills(g, rightSide) {
  const peaks=rightSide ? [[-2.75,.60],[-2.02,.77],[-1.36,1.41],[-.75,1.03],[.16,1.53],[.92,1.17],[1.76,1.91],[2.71,1.31]]
    : [[-2.73,1.29],[-1.97,1.64],[-1.38,1.27],[-.76,1.85],[-.20,1.48],[.56,1.65],[1.13,1.02],[1.84,1.20],[2.74,.64]];
  ridgeLine(g,{profile:peaks,base:'#68837d',light:'#8f9d83',shade:'#516e69',depth:.27});
  const near=keep(g,0,0,.34);
  ridgeLine(near,{profile:peaks.map(([x,y],i)=>[x,.26+y*.39+.12*Math.sin(i)]),base:'#536e62',light:'#698373',shade:'#435f5b',depth:.16});
}

function moon(g) {
  beam(g,[0,0,-.05],[0,2.28,-.05],.013,'#8c9385',4);
  poly(g,[[.22,.39],[.04,.41],[-.13,.37],[-.27,.26],[-.35,.09],[-.34,-.09],[-.26,-.24],
    [-.12,-.35],[.06,-.38],[.23,-.34],[.35,-.25],[.43,-.10],[.32,-.14],[.16,-.14],
    [.02,-.09],[-.08,.025],[-.11,.16],[-.06,.28],[.06,.36]],.038,'#f3d79f',0,2.42,0);
}

function rowHouse(g, index, paper) {
  const walls=['#a59e8e','#c2ad92','#9ba9a0'], roofs=['#756961','#866b5b','#526e69'];
  const w=1.02, h=[.97,1.18,.82][index], depth=.43;
  box(g,0,h/2,0,w,h,depth,walls[index]);
  const profiles=[
    [[-.55,0],[.55,0],[.55,.061],[.33,.10],[.18,.21],[-.19,.21],[-.34,.11],[-.55,.078]],
    [[-.55,0],[.55,0],[.53,.066],[.41,.072],[.41,.133],[.24,.133],[.20,.187],[-.20,.187],[-.24,.133],[-.41,.133],[-.41,.072],[-.53,.066]],
    [[-.56,0],[.57,0],[.57,.055],[.10,.315],[-.01,.34],[-.52,.085]],
  ];
  poly(g,profiles[index],.49,roofs[index],0,h-.035,-.265);
  box(g,0,h+.007,.012,1.12,.046,.55,'#d0c0a2');
  box(g,0,h-.207,.267,1.11,.060,.16,roofs[index]);
  box(g,0,.033,.074,1.13,.066,.63,'#9b957e');
  box(g,-.29,.30,.225,.20,.55,.037,ink);
  box(g,-.29,.414,.246,.137,.223,.016,'#817e6c');
  disc(g,-.236,.26,.258,.018,brass,.011,7);
  box(g,.134,.43,.225,.414,.38,.043,ink);
  pane(g,paper,.134,.43,.251,.339,.292);
  box(g,.134,.43,.260,.023,.32,.022,roofs[index]);
  box(g,.134,.458,.26,.363,.023,.021,roofs[index]);
  if (index===1) for(const x of [-.19,0,.19]) box(g,x,.88,.227,.103,.078,.024,'#787668');
  tab(g,.65); strut(g,h);
}

function quayBench(g) {
  for(const x of [-.57,.57]) {
    beam(g,[x,.032,.19],[x,.327,.11],.034,ink,5);
    beam(g,[x,.032,-.15],[x,.72,-.17],.039,ink,5);
    beam(g,[x,.297,-.15],[x,.31,.20],.035,ink,5);
  }
  for(const z of [-.085,.055,.19]) box(g,0,.338,z,1.57,.047,.122,'#bb9066');
  for(const y of [.53,.668]) {
    box(g,0,y,-.143,1.66,.111,.064,'#5b8172');
    for(const x of [-.65,.65]) disc(g,x,y,-.106,.016,'#c6b082',.007,8);
  }
  tab(g,1.3);
}

// Sea oats and tiny cream flowers edge the bench. Their low profiles leave
// the reader a clear line of sight to the lamp and all five lit windows.
function wharfBed(g, flowers) {
  const outline=[[-.88,-.15],[-.58,-.30],[.39,-.26],[.81,-.13],[.72,.12],[.27,.23],[-.64,.17]];
  slab(g,outline,.061,'#8c9079',.008);
  slab(g,outline.map(([x,z])=>[x*.92,z*.83]),.028,'#81865f',.069);
  bankPlants(keep(g,-.29,.086,.008),{kind:'reeds',width:.86,height:.47,leaf:'#71805d',light:'#aaab77',shade:'#536b56'});
  bankPlants(keep(g,.38,.091,-.03),{kind:'broadleaf',width:.55,height:.35,leaf:'#5a7b68',light:'#94a183',shade:'#405e54'});
  if (flowers) for(const [x,h] of [[-.43,.42],[-.19,.51],[.08,.35]]) {
    beam(g,[x+.05,.08,.03],[x,h,.048],.012,'#6f7c55',4);
    for(const a of [-1.05,0,1.05]) {
      const petal=poly(g,[[-.035,.018],[-.042,.066],[0,.112],[.037,.070],[.031,.02]],.012,'#e8d7aa',x,h,.05);
      petal.rotation.z=a;
    }
    disc(g,x,h+.036,.073,.026,'#bf9b57',.012,6);
  }
}

function table(g) {
  const shape=[[-.94,-.37],[-.79,-.49],[.83,-.49],[.99,-.32],[.99,.30],[.83,.46],[-.82,.46],[-.94,.32]];
  for (const x of [-.70,.69]) for (const z of [-.29,.26]) {
    beam(g,[x,.63,z],[x*1.10,.029,z*1.18],.054,darkWood,5);
  }
  for(const z of [-.25,.25]) box(g,0,.52,z,1.50,.12,.058,wood);
  beam(g,[-.75,.25,.25],[.76,.25,.25],.025,wood,5);
  slab(g,shape,.078,darkWood,.614);
  slab(g,shape.map(([x,z])=>[x*.989,z*.978]),.028,'#c29464',.694);
  for(const z of [-.24,.02,.26]) box(g,.01,.723,z,1.72,.003,.009,'#a77852');
}

function teaCup(g) {
  const saucer = cyl(g,0,.017,0,.206,.18,.033,'#657a6d',16);
  saucer.scale.z=.91;
  const cup=keep(g);
  cyl(cup,0,.055,0,.105,.07,.067,'#657c73',14);
  cyl(cup,0,.123,0,.154,.1,.14,'#e5d6b7',14);
  cyl(cup,0,.189,0,.159,.15,.032,'#728771',14);
  cyl(cup,0,.208,0,.134,.134,.008,'#a86f45',14);
  const handle=ring(cup,.152,.134,0,.055,.013,'#dacaab',12); handle.scale.y=1.08;
  return cup;
}

// Six individually creased faces share the same cut-paper book motif and wooden ribs.
function makeLamp(g) {
  const lamp=keep(g,.285,.729,0), body=keep(lamp,0,.14,0), cord=keep(lamp,.427,1.028,.18);
  const papers=[lanternPaper('#ada68b','#ffda81'),lanternPaper('#92987c','#edb35d')];
  const radius=.432, height=.69, apothem=radius*Math.cos(Math.PI/6), faceWidth=radius;
  cyl(lamp,0,.043,0,.389,.446,.086,darkWood,6).rotation.y=Math.PI/6;
  cyl(lamp,0,.107,0,.426,.357,.063,brass,6).rotation.y=Math.PI/6;
  for(let i=0;i<6;i++) {
    const angle=i*Math.PI/3;
    const face=keep(body);
    face.rotation.y=angle;
    pane(face,papers[i%2],0,height/2,apothem,faceWidth-.014,height-.024);
    for(const s of [-1,1]) {
      box(face,s*(faceWidth/2-.012),height/2,apothem+.005,.031,height,.029,darkWood);
      for(const y of [.073,height-.067]) {
        box(face,s*.131,y,apothem+.013,.097,.014,.012,'#a17c50');
        box(face,s*(faceWidth*.41),y+(y<height/2?.031:-.031),apothem+.013,.013,.068,.012,'#a17c50');
      }
    }
    const leaf=[[-.008,.267],[-.073,.297],[-.151,.30],[-.146,.411],[-.068,.407],[-.008,.372]];
    poly(face,leaf,.008,'#825f45',0,0,apothem+.008);
    poly(face,leaf.map(([x,y])=>[-x,y]),.008,'#a27245',0,0,apothem+.008);
    beam(face,[-.137,.281,apothem+.020],[-.008,.243,apothem+.020],.007,brass,4);
    beam(face,[.137,.281,apothem+.020],[.008,.243,apothem+.020],.007,brass,4);
  }
  cyl(lamp,0,.848,0,.506,.465,.075,ink,6).rotation.y=Math.PI/6;
  cyl(lamp,0,.966,0,.233,.524,.174,'#547167',6).rotation.y=Math.PI/6;
  cyl(lamp,0,1.071,0,.174,.267,.065,'#3f5c55',6).rotation.y=Math.PI/6;
  cyl(lamp,0,1.12,0,.072,.104,.063,brass,8);
  const loop=ring(lamp,0,1.217,0,.072,.012,brass,12); loop.scale.y=1.10;
  beam(cord,[0,-.22,0],[0,0,0],.010,brass,4);
  poly(cord,[[0,-.19],[.073,-.25],[.051,-.362],[-.056,-.35],[-.071,-.24]],.018,'#b65f43');
  disc(cord,0,-.265,.022,.021,'#efd79c',.009,8);
  const light=new T.PointLight('#ffbd65',0,4.3,2);
  light.position.set(0,.68,.92); lamp.add(light);
  return {lamp,cord,papers,light};
}

export default {
  id:'ending', backmatter:true, land:'ai', short:'後記與致謝', title:'街角還亮著一盞燈', calm:true,
  folio:'街角的決策智慧', plate:'後記', sources:[],
  look:{bg:'#203a3c',table:'#475951',key:'#ffe0bc',fill:'#9abcc9',sky:'#e2dbce'},
  ground:printQuay,
  build(S) {
    const windows=[];
    for(const side of [-1,1]) S.plant(side*2.79,-3.08,g=>foldingHills(g,side>0));
    S.plant(-1.62,-2.96,moon,{s:1.13});
    // Every window is on its own footprint so the distant street follows both turning leaves.
    for(const [x,z,size,index] of [[-4.79,-1.69,1.12,0],[-3.55,-1.84,1.28,1],[-2.37,-1.90,.98,2],[-1.30,-2.01,.87,1],[4.71,-1.82,1.21,0]]) {
      const paper=lanternPaper('#7b8980','#f5c57c');
      windows.push(paper);
      S.plant(x,z,g=>rowHouse(g,index,paper),{s:size,ry:x<0?.075:-.09});
    }
    S.plant(5.07,-.27,g=>foldedTree(g,{kind:'camphor',height:2.5,leaf:'#708467',light:'#97a184',shade:'#4f705e'}),{ry:-.18});
    S.plant(-5.16,.30,g=>foldedTree(g,{kind:'willow',height:2.27,leaf:'#6d876e',light:'#a1a887',shade:'#526d5b'}),{ry:.37});
    S.plant(-4.37,1.68,g=>wharfBed(g,true),{s:1.05,ry:.27});
    S.plant(4.99,2.05,g=>wharfBed(g,false),{s:.77,ry:-.29});
    S.plant(-2.84,.84,quayBench,{s:1.17,ry:.09});
    let steam, teaMaker, passenger;
    S.plant(-.97,1.09,g=>{
      passenger=S.person(g,{species:'civet',kind:'elder',coat:'#b5654f',prop:false,s:1.69});
      poly(passenger.inner,[[-.14,.775],[.14,.775],[.02,.57]],.013,'#dfb05c',0,0,.045);
      const takeaway=keep(passenger.inner,-.25,.42,.123);
      cyl(takeaway,0,.079,0,.10,.069,.16,'#edd7ad',12);
      cyl(takeaway,0,.084,0,.09,.081,.042,'#547b70',12);
      cyl(takeaway,0,.163,0,.095,.095,.012,'#bc8846',12);
    },{ry:-.09});
    S.plant(1.51,-1.31,g=>{
      steam=teaStall(g);
      teaMaker=S.robot(g,{species:'otter',x:-.06,y:.54,z:-.14,s:1.26,prop:false});
      for(const [i,x] of [.18,.45,.72].entries()) {
        cyl(g,x,.989,.23,.077,.050,.129,'#f2dbb3',12);
        cyl(g,x,1.055,.23,.066,.066,.009,['#77533a','#a07042','#d29a55'][i],12);
      }
    },{s:1.29,ry:.035});

    let lamp, cup;
    S.plant(2.90,1.33,g=>{
      table(g);
      lamp=makeLamp(g);
      cup=teaCup(keep(g,-.55,.732,.096));
    },{s:1.49,ry:-.105});
    const {light,cord,papers}=lamp;
    let lit=false, elapsed=0;
    function showLight(progress) {
      const flame=damp(progress,0,.32);
      papers.forEach(p=>p.warm(flame));
      light.intensity=flame*.94;
      // Nearby panes catch the light first. The amber reflection then reaches across the street.
      for (let i=0;i<windows.length;i++) {
        const start=.21+.10*(windows.length-1-i);
        windows[i].warm(damp(progress,start,start+.23)*.94);
      }
      const tug=progress<.49 ? Math.sin(Math.PI*damp(progress,0,.49)) : 0;
      cord.position.y=1.028-.15*tug;
      cord.rotation.z=-tug*.075;
    }
    function sync() {
      lit=Boolean(S.app.hasThanked?.());
      elapsed=lit ? 1 : 0;
      showLight(elapsed);
    }
    function leaveLight() {
      if(lit || !S.active) return;
      lit=true;
      S.sound('cord',lamp.lamp);
      if(S.stage.still.matches) { elapsed=1; showLight(1); }
      else { teaMaker.wave(1.3); passenger.wave(.95); }
      S.app.leaveThanks();
    }
    S.act('light',leaveLight);
    S.pad(lamp.lamp,.57,[0,.55,0]);
    S.prop(lamp.lamp,{id:'thank-you-lamp',label:'拉亮桌上的致謝紙燈',aim:[0,.55,0],tap:leaveLight});
    S.pad(cup,.205,[0,.13,0]);
    S.discovery(cup,{id:'closing-cup',label:'水獺留在燈旁的一杯茶',aim:[0,.13,0],duration:1.20,sound:'cup',
      draw(u,visit,reduced){
        const lift=reduced ? 0 : Math.sin(Math.PI*u);
        cup.position.y=.16*lift; cup.rotation.z=-.11*lift;
        cup.rotation.y=.30*(visit%2 ? u : 1-u);
      }});
    S.on('reset',sync);
    S.on('enter',sync);
    S.tick((t,dt)=>{
      const still=S.stage.still.matches;
      if(lit && elapsed<1) {
        elapsed=still ? 1 : Math.min(1,elapsed+dt/.98);
        showLight(elapsed);
      }
      steam.forEach((curl,i)=>{
        const u=still ? .25+.42*i : (t*.31+i*.50)%1;
        curl.position.y=1.31+u*.25;
        curl.scale.setScalar(.58+.25*Math.sin(Math.PI*u));
      });
    });
    sync();
  },
};
