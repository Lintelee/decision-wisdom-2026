import { group, keep, box, cyl, poly, slab, tri, quad, beam, disc, ring, tab } from '../paper.js';
import { foldedTree, bankPlants, ridgeLine } from '../paper-landscape.js';
import { paperMechanism } from './market-craft.js';

// The printed footprints stay on the same turning leaf as the buildings and puppets above them.
export function pavedCutout(G, outline, {mortar, colors, width, depth, angle=0, joint=.045}) {
  G.blob(outline,mortar,{sharp:true});
  const ink=G.g, c=Math.cos(angle), s=Math.sin(angle);
  ink.save();
  ink.beginPath();
  outline.forEach(([x,z],i)=>i ? ink.lineTo(G.X(x),G.Z(z)) : ink.moveTo(G.X(x),G.Z(z)));
  ink.closePath();
  ink.clip();
  const local=outline.map(([x,z])=>[x*c+z*s,z*c-x*s]);
  const xs=local.map(p=>p[0]), zs=local.map(p=>p[1]);
  const left=Math.floor(Math.min(...xs)/width)-1, right=Math.ceil(Math.max(...xs)/width)+1;
  const top=Math.floor(Math.min(...zs)/depth)-1, bottom=Math.ceil(Math.max(...zs)/depth)+1;
  for(let row=top;row<=bottom;row++) {
    for(let col=left;col<=right;col++) {
      const x=(col+(row&1)*.5)*width, z=row*depth;
      const tint=colors[Math.abs(col*17+row*11+col*row)%colors.length];
      G.rect(x*c-z*s,x*s+z*c,width-joint,depth-joint,tint,{rot:angle,r:.018});
    }
  }
  ink.restore();
}

// Paper silhouettes on their own feet, from the busy arcade through the workshop to the banquet.
// Low foreground pieces sit in the gutters of the *street* and leave the book's page edge free to grab.
function verge(g, outline, field, core) {
  slab(g,outline,.036,core);
  slab(g,outline.map(([x,z])=>[x*.976,z*.968]),.018,field,.037);
}

function roof(g,width,eave,ridge,front,back,tile,edge) {
  const h=width/2;
  quad(g,[-h,eave,front],[h,eave,front],[h,ridge,0],[-h,ridge,0],tile);
  quad(g,[-h,ridge,0],[h,ridge,0],[h,eave,back],[-h,eave,back],edge);
  for (const x of [-h,h]) tri(g,[x,eave,back],[x,ridge,0],[x,eave,front],edge);
  box(g,0,eave-.035,front,width+.06,.074,.068,edge);
  box(g,0,ridge+.012,0,width+.13,.060,.073,edge);
  for (let i=0;i<8;i++) {
    const x=(i/7-.5)*(width-.10);
    beam(g,[x,eave+.014,front],[x,ridge+.014,.004],.011,edge,4);
  }
}

function leafBlade(g,length,width,front,back) {
  const tip=[.12*length,length,-.16*length], foot=[0,0,0], spine=[0,.58*length,.054];
  const left=[-.47*width,.52*length,.007], right=[.53*width,.50*length,.004];
  quad(g,foot,left,tip,spine,front);
  quad(g,foot,spine,tip,right,back);
}

// The upper storey is attached to the same folding footprint as the diner and the two opening shutters.
export function marketUpperStorey(g) {
  const house=group(g); house.position.z=-.095;
  const profile=[[-1.14,1.43],[-1.14,2.68],[-.90,2.68],[-.84,2.85],[-.55,2.85],
    [-.39,3.02],[-.17,3.09],[.13,3.09],[.39,3.02],[.54,2.85],[.84,2.85],[.90,2.68],[1.14,2.68],[1.14,1.43]];
  poly(house,profile,.36,'#b66e4e',0,0,-.27);
  for(let i=1;i<profile.length-1;i++){
    const a=profile[i-1],b=profile[i];
    if(a[1]<2.5||b[1]<2.5)continue;
    beam(house,[a[0],a[1]+.015,.115],[b[0],b[1]+.015,.115],.043,'#e1b38a',4);
  }
  box(house,0,2.64,.10,2.15,.072,.10,'#e5c393');
  box(house,0,1.75,.12,2.37,.11,.16,'#ecd1a2');
  for(const x of [-.67,0,.67]){
    const arch=[[-.218,0],[-.218,.34],[-.17,.43],[-.075,.48],[.075,.48],[.17,.43],[.218,.34],[.218,0]];
    poly(house,arch,.043,'#e5bf8d',x,1.94,.12);
    poly(house,arch.map(([u,v])=>[u*.77,v*.85]),.018,'#3e625b',x,1.965,.166);
    box(house,x,2.13,.193,.024,.34,.014,'#baba94');
    box(house,x,2.14,.193,.31,.023,.014,'#baba94');
    box(house,x,1.933,.15,.49,.049,.15,'#94694d');
  }
  const medallion=disc(house,0,2.855,.123,.121,'#e9c191',.034,8);
  medallion.rotation.z=Math.PI/8;
  poly(house,[[0,.072],[-.052,0],[0,-.065],[.052,0]],.012,'#52685d',0,2.855,.151);
}

function pickleJar(g, x, z, scale, open) {
  const jar=group(g); jar.position.set(x,.055,z); jar.scale.setScalar(scale);
  const ochre=open?'#b97a53':'#966246', shadow=open?'#80553f':'#714e3e';
  cyl(jar,0,.10,0,.30,.22,.18,shadow,10);
  cyl(jar,0,.38,0,.32,.30,.40,ochre,10);
  cyl(jar,0,.64,0,.19,.33,.15,ochre,10);
  cyl(jar,0,.737,0,.20,.18,.075,'#70543e',10);
  for(const y of [.245,.486]) cyl(jar,0,y,0,.307,.311,.020,'#d1a171',10);
  if(!open) {cyl(jar,0,.791,0,.224,.234,.053,'#757d65',10);return;}
  const lid=keep(jar,0,.79,-.11);
  cyl(lid,0,.00,.11,.224,.234,.050,'#6d816d',10);
  cyl(lid,0,.05,.11,.055,.073,.064,'#ba9366',9);
  const leaves=keep(jar,0,.73,0);
  for(const [i,a] of [-1.4,-.72,.04,.90,2.03].entries()) {
    const blade=group(leaves);blade.rotation.y=a;blade.rotation.z=(i-2)*.16;
    leafBlade(blade,.38+(i%2)*.09,.19,i%2?'#a9a864':'#b5a763','#7c874f');
  }
  return {lid,leaves,jar};
}

export function tofuLane(S) {
  S.plant(-4.68,-1.55,g=>foldedTree(g,{kind:'camphor',height:2.93,leaf:'#7e9966',light:'#a8ad6e',shade:'#526f57',bark:'#795e47'}));
  S.plant(-2.62,-3.31,g=>ridgeLine(g,{profile:[[-2.53,.65],[-1.94,1.38],[-1.58,1.23],[-.88,2.04],[-.37,1.53],[.16,1.38],[.70,1.66],[1.16,1.38],[1.51,1.49],[2.13,.80]],base:'#80a087',shade:'#6c8878',light:'#b4c0a0'}));
  S.plant(4.70,1.71,g=>{
    verge(g,[[-.81,-.36],[-.12,-.51],[.59,-.39],[.80,-.06],[.73,.39],[.36,.50],[-.72,.41]],'#a5ac79','#968c66');
    const jars=group(g);
    pickleJar(jars,.37,-.14,.92,false);
    const {jar,lid,leaves}=pickleJar(jars,-.29,.13,1.06,true);
    S.pad(jar,.26,[0,.55,.04]);
    paperMechanism(S,jar,{id:'mustard-jar',label:'掀開臭豆腐攤的酸菜甕',sound:'lid',duration:.9},u=>{
      lid.rotation.x=-1.67*u;
      leaves.scale.setScalar(Math.max(.001,u));
    });
    const herbs=group(g); herbs.position.set(.61,.054,.19);
    bankPlants(herbs,{kind:'grass',width:.48,height:.32,leaf:'#82925a',light:'#b1ab6a',shade:'#617b51'});
  },{ry:-.18});
}

// A raised ring built from brick voussoirs leaves an actual opening through to the lane.
function gardenGate(g) {
  const stone='#b78162', sandstone='#dfbc92', deep='#936d54';
  const radius=.73, width=.19, spring=.78;
  const foot=radius+width/2;
  for (const side of [-1,1]) {
    box(g,side*foot,spring/2,0,width,spring,.29,stone);
    box(g,side*foot,.105,0,.32,.21,.37,deep);
    box(g,side*foot,spring-.012,.002,.26,.07,.35,sandstone);
    const wall=side*(foot+.37);
    box(g,wall,.38,-.066,.55,.70,.135,'#d6ba8b');
    box(g,wall,.754,-.065,.62,.075,.195,'#8a957d');
    for(let i=0;i<3;i++) box(g,wall+side*((i-1)*.11),.51,.009,.061,.14,.017,'#889576');
  }
  const n=12;
  for(let i=0;i<n;i++){
    const a=Math.PI*i/n, b=Math.PI*(i+1)/n;
    const point=(r,t)=>[r*Math.cos(t),spring+r*Math.sin(t)];
    poly(g,[point(radius,a),point(radius+width,a),point(radius+width,b),point(radius,b)],.30,i%3===0?'#ca946f':stone,0,0,-.15);
    beam(g,[...point(radius+width-.03,a),.154],[...point(radius+width-.03,b),.154],.017,sandstone,4);
  }
  tab(g,2.52);
}

function inkBed(g) {
  verge(g,[[-.92,-.24],[-.39,-.47],[.35,-.42],[.81,-.16],[.77,.22],[.34,.40],[-.45,.37]],'#a4a77e','#928968');
  for(const [i,[x,z]] of [[-.52,-.05],[.13,.13],[.47,-.13]].entries()){
    const p=group(g);p.position.set(x,.058,z);
    cyl(p,0,.10,0,.21,.155,.2,i===1?'#bd7958':'#aa7455',8);
    cyl(p,0,.208,0,.226,.223,.050,'#d3a079',8);
    cyl(p,0,.232,0,.195,.195,.009,'#796449',8);
    for(let k=0;k<5;k++){
      const leaf=group(p);leaf.position.y=.233;leaf.rotation.y=(k*.91+i*.56);leaf.rotation.z=(k-2)*.28;
      leafBlade(leaf,.31+.06*((k+i)%3),.26,k%2?'#9ba567':'#b8ac71',k%2?'#667955':'#8b815d');
    }
  }
}

export function printCourt(S) {
  const gate = S.plant(2.7,-2.04,g=>gardenGate(g));
  S.plant(5.12,-3.03,g=>foldedTree(g,{kind:'banyan',height:2.85,leaf:'#7e925d',light:'#b3aa6a',shade:'#536f55',bark:'#816649'}));
  S.plant(.06,-3.05,g=>foldedTree(g,{kind:'broadleaf',height:1.88,leaf:'#879660',light:'#b4b27d',shade:'#6a825e'}));
  S.plant(-3.71,2.16,inkBed,{ry:.22});
  S.plant(4.48,2.18,g=>bankPlants(g,{kind:'fern',width:1.23,height:.63,leaf:'#879b65',shade:'#536d56',light:'#aab471'}));
  return gate.art;
}

function roastingRoom(g) {
  const cream='#d8bc8d', sage='#72887c', clay='#b07557';
  const wall=[[-1.42,0],[-1.42,1.55],[-1.28,1.73],[-.22,2.10],[1.37,1.70],[1.37,0]];
  poly(g,wall,.32,cream,0,0,-.39);
  roof(g,3.04,1.63,2.11,.26,-.48,'#747d74','#596c66');
  for(const x of [-1.14,1.12]) {
    box(g,x,.74,-.005,.25,1.45,.11,clay);
    box(g,x,.19,0,.33,.36,.18,'#a78367');
    for(let j=0;j<3;j++)box(g,x,.58+j*.23,.058,.22,.017,.012,'#d5a484');
  }
  box(g,-.23,.9,-.02,1.33,.99,.11,'#465f5a');
  for(let i=0;i<5;i++){
    const x=-.78+i*.277;
    box(g,x,.90,.07,.027,.96,.032,'#b59b76');
  }
  box(g,-.23,.91,.07,1.32,.035,.032,'#b59b76');
  box(g,-.23,.394,.08,1.45,.081,.18,sage);
  // Tea winnowing baskets hang against the cool kiln wall.
  for(const [x,y,s] of [[.65,1.11,.24],[.69,.66,.16]]) {
    disc(g,x,y,.066,s,'#d1aa6f',.048,14);
    ring(g,x,y,.096,s*.91,.014,'#9a7750',16);
    for(let k=-1;k<=1;k++) box(g,x,y+k*s*.33,.096,1.35*s,.012,.008,'#b38c59').rotation.z=.32;
  }
  for(const [x,h,w] of [[-.95,2.49,.36],[-.78,2.49,.07]]) box(g,x,h/2,-.43,w,h,.31,x===-.95?'#a8715b':'#be8e71');
  box(g,-.95,2.46,-.43,.45,.095,.39,'#d7ad87');
  box(g,-.95,2.54,-.43,.39,.068,.33,'#896f60');
  tab(g,2.4);
}

function teaRows(g) {
  verge(g,[[-.75,-.48],[-.17,-.59],[.56,-.48],[.83,-.13],[.76,.47],[.29,.59],[-.52,.46],[-.88,.11]],'#bfaa78','#9c825d');
  for(let j=0;j<3;j++){
    const row=group(g); row.position.set(-.03,.06,j*.31-.36);
    const outline=[[-.66,.02],[-.61,.19],[-.40,.29],[-.20,.25],[.04,.32],[.27,.26],[.45,.29],[.65,.19],[.65,.02]];
    poly(row,outline,.12,j%2?'#6c865c':'#789262');
    for(const [x,h] of [[-.48,.23],[-.14,.27],[.22,.26],[.43,.24]]) {
      poly(row,[[0,0],[.11,.06],[.20,.04],[.10,.017]],.008,'#acb77e',x,h-.08,.122);
    }
  }
}

export function teaWorkshopStreet(S) {
  S.plant(-2.17,-2.85,roastingRoom,{ry:.06,s:1.08});
  S.plant(-4.94,-1.24,g=>foldedTree(g,{kind:'camphor',height:2.49,leaf:'#718d73',light:'#99ab81',shade:'#526f68'}));
  S.plant(-4.56,.17,teaRows,{ry:-.30,s:.92});
  S.plant(4.80,-2.36,g=>foldedTree(g,{kind:'cypress',height:2.44,leaf:'#75917d',light:'#9bad90',shade:'#526f6c'}));
  S.plant(-1.05,2.30,g=>bankPlants(g,{kind:'grass',width:1.15,height:.44,leaf:'#8f9f72',light:'#b3b887',shade:'#657b67'}));
}

// A borrowed brick courtyard and dish hatch explain where a street banquet's food comes from.
function banquetKitchen(g) {
  const wall='#bc816b', dark='#755d58', cream='#e2bc97';
  poly(g,[[-1.49,0],[-1.49,1.43],[-.99,1.43],[-.80,1.69],[-.58,1.62],[-.46,1.43],[1.36,1.43],[1.36,0]],.28,wall,0,0,-.25);
  const ridge=[[-1.60,1.47],[-1.25,1.42],[-.96,1.42],[-.82,1.67],[-.57,1.83],[-.43,1.72],[-.37,1.54],[-.24,1.47],[1.24,1.47],[1.53,1.56]];
  for(let i=1;i<ridge.length;i++)beam(g,[...ridge[i-1],-.011],[...ridge[i],-.011],.086,dark,4);
  box(g,.48,.78,.025,1.06,.66,.11,'#5a6961');
  box(g,.48,.42,.16,1.23,.076,.34,'#c5a27e');
  quad(g,[-.19,1.24,-.005],[1.14,1.24,-.005],[1.14,1.15,.33],[-.19,1.15,.33],'#ab805d');
  for(let i=0;i<5;i++){
    cyl(g,.85,.48+i*.038,.16,.138,.094,.038,i%2?'#d7d0aa':'#e9dcbd',10);
    box(g,-1.23+(i%2)*.07,.19+i*.22,.043,.31,.019,.014,cream);
  }
  for(const x of [-.58,-.33]) box(g,x,.86,.045,.135,.27,.02,'#725d56');
  const lattice=disc(g,-.45,1.10,.042,.29,cream,.043,8);
  lattice.rotation.z=Math.PI/8;
  disc(g,-.45,1.10,.07,.235,'#677b70',.025,8);
  for(const dx of [-.075,.075]) box(g,-.45+dx,1.10,.091,.022,.34,.014,cream);
  for(const dy of [-.075,.075]) box(g,-.45,1.10+dy,.091,.34,.022,.014,cream);
  tab(g,2.5);
}

function cookingBaskets(g) {
  verge(g,[[-.69,-.30],[-.20,-.46],[.52,-.39],[.76,.04],[.53,.37],[-.28,.42],[-.71,.20]],'#b89c7a','#a9876b');
  const rack=group(g);rack.position.set(-.05,.05,.02);
  for(const [x,z] of [[-.34,-.09],[.27,-.06]]) {
    cyl(rack,x,.205,z,.31,.22,.36,'#ae8155',10);
    cyl(rack,x,.387,z,.315,.313,.045,'#d4ac75',10);
    cyl(rack,x,.410,z,.265,.265,.012,'#8d724e',10);
    for(let j=0;j<3;j++) {
      const leaf=group(rack);leaf.position.set(x+(j-1)*.07,.38,z+.02);
      leaf.rotation.z=(j-1)*.47;leaf.rotation.y=-.3+j*.6;
      leafBlade(leaf,.42-j*.032,.25,'#8ea072','#b2b588');
    }
    for(let i=0;i<5;i++) {
      const a=Math.PI*(.08+i*.22);
      beam(rack,[x+Math.cos(a)*.23,.043,z+Math.sin(a)*.23],[x+Math.cos(a)*.308,.37,z+Math.sin(a)*.308],.009,'#ceae80',4);
    }
  }
}

export function feastCourtyard(S) {
  S.plant(-1.76,-2.94,banquetKitchen,{ry:.09,s:1.13});
  S.plant(-4.81,-1.79,g=>foldedTree(g,{kind:'broadleaf',height:2.94,leaf:'#aa8a67',light:'#c9a56e',shade:'#897c63',bark:'#845f4e'}));
  S.plant(4.95,-1.66,g=>foldedTree(g,{kind:'camphor',height:2.43,leaf:'#7f8e70',light:'#a5ab78',shade:'#657d69'}));
  S.plant(-4.73,.79,cookingBaskets,{ry:.13});
  S.plant(4.66,2.10,g=>bankPlants(g,{kind:'fern',width:1.34,height:.60,leaf:'#a29d70',light:'#c2b184',shade:'#7d8563'}));
}
