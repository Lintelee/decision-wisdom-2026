import { ball, beam, box, card, cone, cyl, disc, group, keep, poly, quad, ring, slab, tri } from '../paper.js';
import { hangingCape } from './rainwear-atelier.js';

const P = {
  paper:'#f5dfb1', cream:'#fff0c9', clay:'#bf7658', brick:'#aa553e', rust:'#843e30',
  bark:'#5e4235', wood:'#976a4b', straw:'#dfaa62', gold:'#f1bb58', jade:'#4e8279',
  deep:'#365951', leaf:'#708b5f', blue:'#4d7884', night:'#384c5e', ink:'#353b40',
};

function oval(g,x,y,z,rx,ry,rz,tint,detail=1) {
  const m=ball(g,x,y,z,1,tint,detail);m.scale.set(rx,ry,rz);return m;
}
function peg(g,x,z,h,r=.033,color=P.wood) {cyl(g,x,h/2,z,r,r*1.08,h,color,6);}
function plinth(g,w,d,h=.07,color='#c6a27c') {
  const x=w/2,z=d/2,shape=[[-x+.10,-z],[x-.13,-z],[x,-z+.13],[x,z-.12],[x-.10,z],[-x+.04,z],[-x,z-.08],[-x,-z+.10]];
  slab(g,shape,h,color);slab(g,shape.map(([a,b])=>[a*.98,b*.98]),.018,'#dbc399',h);
}
function windowpane(g,x,y,z,w,h,glass=P.jade,frame=P.cream) {
  card(g,x,y,z,w+.07,h+.07,frame,.025,.023);
  card(g,x,y+.033,z+.027,w,h,glass,.018,.012);
  box(g,x,y+h*.54,z+.051,w,.022,.02,frame);
  box(g,x,y+h*.53,z+.052,.02,h,.02,frame);
}
function bowl(g,x,y,z,r,color=P.cream,inside=P.straw) {
  cyl(g,x,y+r*.36,z,r,r*.64,r*.72,color,14);
  cyl(g,x,y+r*.74,z,r*1.04,r,.025,P.cream,14);
  cyl(g,x,y+r*.74+.016,z,r*.87,r*.87,.01,inside,14);
}
function teacup(g,x,y,z,r,tint) {
  bowl(g,x,y,z,r,tint,'#875435');
  ring(g,x+r*.91,y+r*.41,z,r*.29,.016,tint,12);
}
function bench(g,x,y,z,w) {
  for(const dx of [-.34,.34])box(g,x+w*dx,y+.10,z,.055,.20,.13,P.rust);
  box(g,x,y+.212,z,w,.045,.20,P.straw);
}
function counter(g,w,h,body=P.wood,x=0,z=.09) {
  box(g,x,h*.50+.075,z,w,h,.40,body);
  box(g,x,h+.075,z+.005,w+.08,.055,.46,P.paper);
  box(g,x,h*.5+.07,z+.209,w*.81,h*.55,.018,body===P.jade?P.deep:P.bark);
}
function wall(g,w,h,d,color=P.paper) {box(g,0,h/2+.07,-.14,w,h,d,color);}
function stripeAwning(g,w,y,back,front,colors,slope=.20) {
  const n=7, step=w/n;
  for(let i=0;i<n;i++) {
    const a=-w/2+i*step,b=a+step,c=colors[i%colors.length];
    quad(g,[a,y,back],[b,y,back],[b,y-slope,front],[a,y-slope,front],c);
    poly(g,[[a,0],[b,0],[b,-.065],[b-.035,-.105],[a+.035,-.105],[a,-.065]],.023,c,0,y-slope,front);
  }
  beam(g,[-w/2,y,back],[w/2,y,back],.026,P.bark,6);
}
function gable(g,w,base,rise,back,front,baseCol,roofCol) {
  const e=w/2,r=rise;
  poly(g,[[-e+.07,0],[0,r],[e-.07,0]],front-back-.05,baseCol,0,base,back+.02);
  quad(g,[-e,base,front],[0,base+r+.035,front],[0,base+r+.035,back],[-e,base,back],roofCol);
  quad(g,[0,base+r+.035,front],[e,base,front],[e,base,back],[0,base+r+.035,back],roofCol);
  beam(g,[-e,base,front],[0,base+r+.035,front],.023,P.cream,5);
  beam(g,[0,base+r+.035,front],[e,base,front],.023,P.cream,5);
}
function lantern(g,x,y,z,r,color='#da7550') {
  cyl(g,x,y+.02,z,r*.63,r,r*.88,color,8);cyl(g,x,y+r*.61,z,r*.70,r,r*.32,color,8);
  cyl(g,x,y+r*.83,z,r*.57,r*.7,r*.17,P.gold,8);cyl(g,x,y-r*.46,z,r*.63,r*.74,r*.13,P.gold,8);
  beam(g,[x,y-r*.5,z],[x,y-r*.84,z],r*.052,P.gold,4);
  box(g,x+r*.23,y+r*.15,z+r*.87,r*.105,r*.75,.009,'#f4bd74');
}
function planter(g,x,z,scale) {
  cyl(g,x,.10*scale,z,.18*scale,.13*scale,.2*scale,P.clay,7);
  for(const [dx,h,sz,c] of [[-.10,.28,.13,P.jade],[.07,.33,.15,P.leaf],[.03,.20,.14,'#88945d']]) {
    oval(g,x+dx*scale,h*scale,z,sz*scale,sz*1.15*scale,sz*.64*scale,c,0);
  }
}
function pedestal(g,x,z,w,ht) {
  box(g,x,ht/2,z,w,ht,.26,P.wood);box(g,x,ht+.017,z,w+.04,.034,.30,P.paper);
}
function plume(g,x,y,z,register) {
  const steam=keep(g,x,y,z);
  for(const [dx,dy] of [[-.08,0],[.08,.11]]) {
    const p=keep(steam,dx,dy,0);
    const shape=[[0,0],[.064,.066],[.072,.125],[.013,.196],[-.008,.257],[.018,.298],[-.043,.258],[-.054,.193],[.008,.122],[.018,.072]];
    poly(p,shape,.014,'#fff0ca');
    register((t,still)=>{p.position.y=dy+(still?0:.035*Math.sin(t*1.8+dx*12));p.rotation.z=still?0:.15*Math.sin(t*1.45+dy*7);});
  }
}

function tea(g,register) {
  plinth(g,1.64,1.05);
  for (const x of [-.67,.64]) { peg(g,x,-.36,1.18);peg(g,x,.19,.98); }
  counter(g,1.28,.39,P.jade);
  stripeAwning(g,1.64,1.34,-.51,.18,[P.jade,'#c9cb9a'],.21);
  box(g,-.26,.69,-.35,.39,.40,.045,P.paper);
  for(const x of [-.37,-.27,-.17]) box(g,x,.69,-.319,.026,.28,.012,P.wood);
  cyl(g,.30,.57,.10,.25,.18,.15,P.clay,12);
  cyl(g,.30,.71,.10,.16,.25,.16,P.clay,12);
  cyl(g,.30,.808,.10,.19,.15,.04,P.straw,12);oval(g,.30,.865,.10,.060,.044,.052,P.bark);
  poly(g,[[0,0],[.12,.04],[.20,.19],[.26,.19],[.21,.045],[.07,-.065]],.09,P.clay,.48,.70,.08);
  ring(g,.10,.67,.13,.105,.032,P.clay,12);
  for (const x of [-.50,-.24]) teacup(g,x,.49,.20,.105,P.cream);
  plume(g,.68,.93,.23,register);
  const sail=group(g);sail.position.set(-.75,.08,-.55);
  beam(sail,[0,0,0],[0,1.17,0],.025,P.bark);
  poly(sail,[[0,.13],[0,1.13],[-.39,.27]],.022,P.cream);
  box(g,-.71,.12,-.5,.52,.10,.16,'#9e654a');
}
function camera(g) {
  plinth(g,1.49,1.02,.14);
  wall(g,1.22,1.24,.65,'#d7a47e');
  const stepped=[[-.68,0],[-.68,.15],[-.48,.15],[-.48,.27],[-.26,.27],[-.16,.39],[.16,.39],[.26,.27],[.47,.27],[.47,.16],[.68,.16],[.68,0]];
  poly(g,stepped,.10,P.brick,0,1.23,.145);
  box(g,0,1.24,.214,1.39,.06,.07,P.cream);
  disc(g,0,1.48,.235,.085,P.paper,.03,12);
  card(g,-.41,.16,.195,.26,.75,P.bark,.024,.10);
  windowpane(g,.10,.28,.195,.49,.54,'#6c8c83');
  box(g,.08,.95,.225,.64,.28,.09,P.ink);
  for(const x of [-.16,.31]) box(g,x,1.10,.22,.12,.08,.085,P.straw);
  for(const [r,z,c] of [[.19,.29,P.straw],[.15,.33,P.ink],[.104,.365,P.blue],[.059,.39,'#304e56']]) disc(g,.09,.95,z,r,c,.036,16);
  disc(g,.055,.999,.422,.024,'#f5e5b8',.012,8);
  const frame=group(g);frame.position.set(.58,.15,.32);frame.rotation.z=-.09;
  card(frame,0,0,0,.30,.48,P.bark);card(frame,0,.058,.043,.23,.33,P.paper,.018);poly(frame,[[-.1,0],[-.025,.12],[.015,.07],[.057,.13],[.11,.015]],.012,P.jade,0,.12,.065);
}
function field(g,register) {
  plinth(g,1.70,1.13);
  const turf=cyl(g,0,.12,.01,1,1,.075,'#7d935f',22);turf.scale.set(.79,1,.49);
  for(const [radius,tube,col] of [[.94,.10,'#b57152'],[.86,.023,P.cream],[.99,.018,P.cream]]) {
    const track=ring(g,0,.163,.02,radius,tube,col,28);track.rotation.x=-Math.PI/2;track.scale.set(.75,.44,1);
  }
  for(let i=0;i<3;i++){const z=-.33-i*.123;box(g,0,.20+i*.10,z,1.36,.13,.19,i%2?P.clay:P.straw);}
  const standard=group(g);standard.position.set(-.64,0,-.44);peg(standard,0,0,.99,.023);
  const pennon=keep(standard,0,.97,0);poly(pennon,[[0,0],[.43,-.03],[.32,-.11],[.35,-.20],[0,-.16]],.02,P.brick);
  register((t,still)=>pennon.rotation.y=still?0:.27*Math.sin(t*1.5));
  beam(g,[-.33,.19,.17],[.33,.94,.01],.019,P.cream,5);
  cone(g,.34,.953,.01,.039,.11,P.gold,5).rotation.z=-.62;
  for(const [x,z,h] of [[.28,.19,.27],[.50,-.05,.32]]){peg(g,x,z,h,.013,P.bark);poly(g,[[0,0],[.13,-.023],[0,-.081]],.013,P.cream,x,h,z);}
}
function rain(g,register) {
  plinth(g,1.49,1.02,.09);
  wall(g,1.18,.92,.63,'#acb49a');gable(g,1.42,.99,.32,-.57,.36,'#899f89','#577f77');
  windowpane(g,-.28,.23,.19,.37,.43);
  peg(g,.48,.37,1.16,.026,P.bark);beam(g,[-.09,1.16,.37],[.59,1.16,.37],.026,P.wood);
  const coat=hangingCape(g);
  coat.position.set(.25,.75,.40);
  coat.scale.setScalar(.55);
  register((t,still)=>coat.rotation.z=still?-.025:-.025+.055*Math.sin(t*1.45));
  const bike=group(g);bike.position.set(-.33,.10,.43);bike.rotation.y=-.18;
  for(const x of [-.23,.23]){
    ring(bike,x,.169,0,.150,.025,P.ink,16);
    for(const [dx,dy] of [[.11,.093],[-.11,.093]])beam(bike,[x-dx,.169-dy,.003],[x+dx,.169+dy,.003],.008,P.paper,4);
  }
  for(const [a,b] of [[[-.23,.169,.014],[-.066,.36,.014]],[[-.066,.36,.014],[.031,.17,.014]],[[.031,.17,.014],[-.23,.169,.014]],[[.031,.17,.014],[.177,.39,.014]],[[.177,.39,.014],[-.066,.36,.014]],[[.177,.39,.014],[.23,.169,.014]]])beam(bike,a,b,.017,'#a95e49',5);
  box(bike,-.075,.39,0,.126,.032,.055,P.bark);beam(bike,[.177,.38,0],[.144,.46,0],.013,P.ink,5);box(bike,.14,.464,0,.09,.022,.06,P.ink);
}
function tofu(g,register) {
  plinth(g,1.50,.96);
  peg(g,-.56,-.30,1.14);peg(g,.59,-.30,1.14);
  stripeAwning(g,1.55,1.20,-.49,.075,[P.brick,P.paper],.18);
  counter(g,1.25,.36,P.wood,0,.21);
  box(g,-.28,.28,.45,.58,.26,.29,'#ab7455');
  bowl(g,-.28,.46,.43,.31,'#517383','#c7984c');
  for(const [x,y,z,c] of [[-.39,.70,.46,P.gold],[-.17,.71,.46,'#d8a962'],[-.30,.76,.34,'#f1cf91']]){
    const piece=box(g,x,y,z,.17,.115,.16,c);piece.rotation.y=x*1.8;
    box(g,x-.024,y+.061,z+.024,.052,.009,.028,'#aa8048');
  }
  for(const side of [-1,1]){
    const handle=ring(g,-.28+side*.30,.63,.43,.066,.016,P.ink,10);handle.rotation.y=side*.27;
  }
  for(const [i,offset] of [[0,-.14],[1,.07],[2,.16]]){
    const bubble=keep(g);oval(bubble,0,0,0,.039,.048,.032,'#f4d892',0);
    register((t,still)=>{
      const v=still?.35+i*.12:(t*.57+i*.31)%1;
      bubble.position.set(-.28+offset+v*.036,.68+v*.30,.45+.028*i);
      bubble.scale.setScalar(.16+.84*Math.sin(v*Math.PI));
    });
  }
  for(const [x,y,z] of [[.30,.84,.35],[.53,.94,.32],[.56,.81,.45]]) {
    beam(g,[.43,.46,.33],[x,y,z],.016,P.leaf,4);
    for(let k=0;k<5;k++){const a=2*Math.PI*k/5;disc(g,x+Math.cos(a)*.054,y+Math.sin(a)*.054,z,.052,'#cc8878',.020,6);}
    disc(g,x,y,z+.026,.033,P.gold,.016,8);
  }
  stool(g,-.66,.34);
}
function stool(g,x,z) {
  for(const dx of [-.07,.07])box(g,x+dx,.12,z,.035,.23,.13,P.bark);
  box(g,x,.24,z,.23,.045,.18,'#bc725c');
}
function paw(g,x,y,z,s,c) {
  const p=group(g);p.position.set(x,y,z);p.scale.setScalar(s);
  oval(p,0,0,0,.10,.078,.02,c);
  for(const [px,py] of [[-.098,.075],[-.046,.13],[.025,.145],[.097,.09]])oval(p,px,py,.009,.032,.052,.014,c);
}
function prints(g) {
  plinth(g,1.60,.83,.09);
  poly(g,[[-.75,0],[-.75,.78],[-.62,.79],[-.56,.88],[-.30,.92],[-.14,1.04],[.02,.97],[.18,1.06],[.35,.93],[.55,.92],[.61,.82],[.75,.82],[.75,0]],.16,'#c78d72',0,.10,-.12);
  poly(g,[[-.66,.04],[-.66,.65],[-.51,.68],[-.43,.79],[-.19,.77],[-.07,.88],[.12,.83],[.26,.87],[.42,.77],[.61,.75],[.67,.65],[.67,.04]],.025,'#efd9af',0,.13,.044);
  for(const [x,y,s,c] of [[-.40,.52,1.03,P.jade],[.02,.71,1.19,P.brick],[.41,.47,.86,'#7d7e9b'],[-.04,.35,.64,'#d5a544']])paw(g,x,y,.086,s,c);
  for(const [x,z,c] of [[-.47,.26,P.jade],[.39,.31,P.brick]]){cyl(g,x,.19,z,.11,.085,.20,c,10);cyl(g,x,.30,z,.12,.11,.022,P.paper,10);}
  planter(g,.72,.15,.67);
}
function pair(g,register){
  plinth(g,1.62,.99,.20);
  for(const x of [-.49,.49]){
    peg(g,x,-.27,1.14,.042,P.rust);peg(g,x,.19,1.03,.033,P.wood);
  }
  // Two parallel sampling windows sit below a split ridge.
  for(const x of [-.4,.4]){
    box(g,x,.70,-.21,.63,.68,.16,'#ccb898');
    windowpane(g,x,.48,-.107,.41,.34,'#5b7980');
    const roof=group(g);roof.position.x=x;
    gable(roof,.86,1.055,.26,-.52,.31,'#d2ad83','#698b7c');
  }
  counter(g,1.30,.38,P.jade);
  teacup(g,-.34,.48,.26,.20,P.cream);teacup(g,.33,.48,.26,.20,'#b77557');
  plume(g,.32,.70,.18,register);
}
function banquet(g) {
  plinth(g,1.66,1.12,.12);
  const roof=group(g);roof.position.set(0,1.35,-.21);
  const rim=i=>{const a=i*Math.PI/4+Math.PI/8;return [.91*Math.cos(a),-.17,.63*Math.sin(a)];};
  for(let i=0;i<8;i++){
    const a=rim(i),b=rim(i+1);
    tri(roof,[0,.17,0],a,b,i%2?'#ae5947':'#bf7050');
    beam(roof,a,b,.021,P.straw,5);beam(roof,[0,.179,0],a,.012,'#d99266',4);
    const mx=(a[0]+b[0])/2,mz=(a[2]+b[2])/2;
    tri(roof,[(a[0]+mx)/2,-.165,(a[2]+mz)/2],[(b[0]+mx)/2,-.165,(b[2]+mz)/2],[mx,-.285,mz],P.paper);
  }
  for(const [x,z] of [[-.61,-.38],[.61,-.38],[-.60,.27],[.60,.27]])peg(g,x,z,1.18,.029,P.bark);
  cyl(g,0,.32,.17,.12,.18,.42,P.wood,10);
  cyl(g,0,.555,.17,.53,.56,.08,P.rust,16);cyl(g,0,.61,.17,.51,.52,.04,P.paper,16);
  cyl(g,0,.647,.17,.24,.24,.032,P.jade,14);
  for(let i=0;i<5;i++){const a=i*2*Math.PI/5;bowl(g,Math.cos(a)*.34,.635,.17+Math.sin(a)*.34,.094,P.cream,[P.clay,'#839576',P.gold][i%3]);}
  for(const y of [.685,.754])cyl(g,.04,y,.21,.13,.135,.055,'#c7965d',12);
  bench(g,0,.10,.50,.65);box(g,0,1.56,-.06,.075,.12,.075,P.gold);
}

// Swallowtail ends turn upward, exposing the underside of both roof planes.
function templeRoof(g,y,w,d,rise,col,edge) {
  const x=[-w/2,-w*.34,0,w*.34,w/2], lift=[.16,.018,0,.018,.16];
  for(let i=0;i<x.length-1;i++) {
    for(const side of [-1,1]){
      const a=x[i],b=x[i+1],la=lift[i],lb=lift[i+1],z=side*d/2;
      quad(g,[a,y+rise+la*.57,0],[b,y+rise+lb*.57,0],[b,y+lb,z],[a,y+la,z],col);
      quad(g,[a,y+la,z],[b,y+lb,z],[b,y+lb-.063,z],[a,y+la-.063,z],edge);
      beam(g,[a,y+la+.01,z],[b,y+lb+.01,z],.018,P.straw,5);
      if(side>0)for(const f of [.25,.50,.75]){
        const tx=a+(b-a)*f,ly=la+(lb-la)*f;
        beam(g,[tx,y+rise+ly*.57+.009,0],[tx,y+ly+.019,z],.011,edge,4);
      }
    }
    beam(g,[x[i],y+rise+lift[i]*.57,0],[x[i+1],y+rise+lift[i+1]*.57,0],.026,P.straw,5);
  }
  for(const side of [-1,1]){
    const x0=w/2*side;
    poly(g,[[0,0],[side*.085,.036],[side*.17,.196],[side*.18,.033],[side*.11,-.04],[0,-.045]],.052,edge,x0,y+rise+.08,-.026);
  }
}
function temple(g) {
  plinth(g,1.92,1.23,.15,'#bd9573');
  for(let i=0;i<3;i++)box(g,0,.077+i*.048,.58-i*.066,1.0-i*.10,.06,.28,'#ddbd91');
  box(g,0,.68,-.16,1.55,1.02,.57,'#c77455');
  const gate=[[-.36,0],[-.36,.48],[-.33,.61],[-.23,.73],[-.10,.79],[.10,.79],[.23,.73],[.33,.61],[.36,.48],[.36,0]];
  poly(g,gate,.044,P.cream,0,.16,.128);
  poly(g,gate.map(([x,y])=>[x*.79,y*.89]),.043,'#533d37',0,.16,.176);
  for(const x of [-.64,.64]) {
    cyl(g,x,.65,.18,.075,.082,.99,P.brick,9);
    box(g,x,.22,.18,.203,.13,.20,P.paper);
    windowpane(g,x,.54,.209,.17,.24,'#814b37',P.straw);
    lantern(g,x*.73,.87,.29,.083,'#d68050');
  }
  templeRoof(g,1.15,2.0,1.0,.30,'#597a78','#9e4e3e');
  box(g,0,1.49,-.02,.79,.34,.40,P.brick);
  disc(g,0,1.51,.202,.13,P.paper,.051,12);disc(g,0,1.51,.236,.08,'#ab8754',.015,12);
  templeRoof(g,1.67,1.19,.68,.22,'#648c87','#a95243');
  for(const x of [-.52,.52]){cyl(g,x,.26,.44,.10,.12,.20,'#ac987b',7);oval(g,x,.41,.44,.098,.105,.088,'#e1bc85',0);}
}
function melon(g) {
  plinth(g,1.53,1.03,.08);
  for(const x of [-.56,.62])peg(g,x,-.29,1.05,.029,P.bark);
  stripeAwning(g,1.53,1.14,-.47,.12,['#917595','#d8a18b'],.20);
  counter(g,1.28,.34,P.wood);
  for(const [x,z,y,s] of [[-.41,.18,.54,.17],[-.13,.04,.55,.19],[-.20,.25,.55,.16],[.14,.0,.54,.17]]){
    oval(g,x,y,z,s,s*.84,s*.73,'#66865c');
    const stripe=poly(g,[[-.033,-.65],[.018,-.4],[0,0],[.042,.42],[.02,.66],[-.033,.51],[-.024,.13],[-.052,-.34]],.012,P.deep,x,y,z+s*.71);stripe.scale.set(s*1.8,s,1);
  }
  box(g,.46,.27,.36,.58,.27,.31,'#bd976d');
  for(const y of [.21,.32])box(g,.46,y,.525,.57,.024,.022,'#e7bf85');
  const slice=group(g);slice.position.set(.46,.58,.472);slice.rotation.z=-.11;slice.rotation.x=-.28;slice.scale.setScalar(1.73);
  for(const [n,c,z] of [[1,'#56765d',0],[.89,'#ecd099',.025],[.78,'#d67464',.054]]){
    poly(slice,[[-.24,.13],[.23,.13],[.20,.02],[.12,-.11],[.02,-.17],[-.09,-.13],[-.21,-.02]].map(([x,y])=>[x*n,y*n]),.03,c,0,0,z);}
  for(const [x,y] of [[-.11,.064],[-.055,-.014],[.075,.062],[.035,-.051]])oval(slice,x,y,.093,.014,.022,.008,P.ink,0);
}
function dye(g,register){
  plinth(g,1.66,1.07,.14);
  wall(g,1.51,1.0,.61,'#ba9e87');
  for(const x of [-.50,0,.50]){
    const k=group(g);k.position.x=x;
    poly(k,[[-.24,0],[.23,.39],[.23,0]],.78,'#e3cc9c',0,1.02,-.54);
    quad(k,[-.30,1.06,-.56],[.25,1.46,-.56],[.25,1.46,.30],[-.30,1.06,.30],'#567a86');
    poly(k,[[-.18,.02],[.16,.28],[.16,.02]],.018,'#587d82',0,1.06,.249);
  }
  for(const x of [-.65,.68])peg(g,x,.40,.82,.028,P.wood);
  beam(g,[-.68,.88,.39],[.70,.88,.39],.024,P.wood,5);
  for(const [i,x,c,l] of [[0,-.45,'#566689',.39],[1,-.05,'#485c7e',.46],[2,.34,'#667e96',.38]]){
    const strip=keep(g,x,.86,.42);
    poly(strip,[[-.15,0],[.16,.006],[.12,-l],[.04,-l+.032],[-.10,-l-.02]],.024,c);
    poly(strip,[[-.13,-.12],[.14,-.12],[.14,-.15],[-.13,-.15]],.012,'#d2c6aa',0,0,.026);
    register((t,still)=>strip.rotation.x=still?0:.13*Math.sin(t*1.51+i*.81));
  }
  bowl(g,.62,.16,.12,.18,P.bark,'#4e657d');
}
function lights(g,register) {
  plinth(g,1.72,1.06,.10);
  for(const x of [-.70,.70]){peg(g,x,-.08,1.36,.046,P.rust);box(g,x,.20,-.08,.16,.16,.16,P.paper);}
  const wire=[[-.70,1.36,-.08],[-.28,1.19,-.025],[.13,1.175,0],[.70,1.36,-.08]];
  for(let i=1;i<wire.length;i++)beam(g,wire[i-1],wire[i],.017,P.bark,5);
  for(const [x,y,r,c] of [[-.56,1.10,.137,'#b95c44'],[-.27,.97,.174,'#d88d49'],[.12,1.00,.126,'#be684c'],[.45,1.11,.154,'#dea25c']]){
    beam(g,[x,y+r*.83,-.009],[x,y+r*.83+.085,-.011],.009,P.bark,4);
    const lamp=keep(g,x,y,.006);lantern(lamp,0,0,0,r,c);
    register((t,still)=>lamp.rotation.z=still?0:.065*Math.sin(t+2*x));
  }
  const floating=keep(g,.52,1.62,-.17);
  const b=cyl(floating,0,0,0,.21,.125,.32,'#d78158',6);b.rotation.y=.22;
  const top=cyl(floating,0,.18,0,.165,.21,.07,'#ecad71',6);top.rotation.y=.22;
  cyl(floating,0,-.165,0,.128,.115,.029,P.wood,6);
  poly(floating,[[-.061,.10],[.045,.12],[.012,-.106],[-.051,-.11]],.012,'#f1bc79',.02,0,.157);
  floating.name='街圖天燈的燈身';
  const spool=group(g);spool.position.set(-.56,.49,.30);spool.rotation.z=.16;
  box(spool,0,-.020,0,.11,.14,.10,P.straw);box(spool,0,.055,0,.17,.026,.13,P.rust);box(spool,0,-.080,0,.17,.026,.13,P.rust);
  register((t,still)=>{
    floating.position.x=.52+(still?0:.075*Math.sin(t*.69));
    floating.position.y=1.62+(still?0:.105*Math.sin(t*.86));
    floating.rotation.z=still?-.08:-.08+.065*Math.sin(t*.69);
  });
  // Lantern makers have left two folded examples on the table.
  bench(g,-.30,.14,.35,.62);
  lantern(g,-.43,.425,.35,.072,'#e2a45a');lantern(g,-.21,.420,.35,.067,'#bf6650');
  planter(g,-.74,.29,.60);
}
export const workshops = [tea,camera,field,rain,tofu,prints,pair,banquet,temple,melon,dye,lights];
