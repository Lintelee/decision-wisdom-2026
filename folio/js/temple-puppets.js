import { tri } from './paper.js';

const stock='#ead4ab', dark='#443b36';
const monkey={
  fur:'#907660',shadow:'#705e50',temple:'#c3ad87',skin:'#d79c85',skinShadow:'#ba806f',
  muzzle:'#e3b299',jacket:'#c69961',seam:'#9b734c',sash:'#b65846',redShadow:'#914538',
  trousers:'#687165',binding:'#d8c39b',sole:'#5c5549'
};
const bird={
  leaf:'#83a366',deep:'#587954',wing:'#71925b',quill:'#526f52',blue:'#628e9c',
  blueShade:'#49788b',yellow:'#dec067',scarlet:'#bc594a',beak:'#404546',
  beakShade:'#323b3c',vest:'#506180',vestShade:'#404e68',feet:'#8c826c'
};

const points=path=>path.split(' ').map(pair=>pair.split(',').map(Number));
const flip=(path,side)=>points(path).map(([x,y])=>[side*x,y]);

// The face has a cream cut edge and a smaller coloured back. The side facets
// are visible when the reader turns the book or the performer looks at a partner.
function shell(h,g,path,color,shade,z,depth,crease) {
  const front=points(path);
  const sum=front.reduce(([u,v],[x,y])=>[u+x,v+y],[0,0]);
  const cx=sum[0]/front.length,cy=sum[1]/front.length;
  const back=front.map(([x,y])=>[cx+(x-cx)*.81,cy+(y-cy)*.84]);
  const a=front.map(([x,y])=>[x/100,y/100,(z-.78)/100]);
  const b=back.map(([x,y])=>[x/100,y/100,(z-depth)/100]);
  front.forEach((_,i)=>{
    const j=(i+1)%front.length;
    tri(g,a[j],a[i],b[i],shade);
    tri(g,b[i],b[j],a[j],shade);
  });
  h.ink(g,back,shade,z-depth-.3,.32);
  h.folded(g,front,color,z,{shade,crease,edge:.95,depth:.88});
}

function patch(h,g,path,color,shade,z=0,edge=.62,crease=[1,.08]) {
  h.folded(g,path,color,z,{shade,crease,edge,depth:1.35});
}

function eyePaper(h,head,x,y,rx,ry,color) {
  const iris=h.pip(head,x,y,7.26,rx,color,12);
  iris.scale.z=ry/rx;
}

function macaqueFace(h,g) {
  const p=monkey, head=h.at(g,-2,71,2.7);
  head.name='獅頭手的桃褐裸臉與低圓耳';
  // The far ear is almost in profile. The near ear hangs below the brow
  // and opens towards us, a useful distinction from the bear's high ears.
  patch(h,head,'-20,22 -25,23 -29,21 -31,17 -30,11 -27,8 -22,8 -18,13',
    p.fur,p.shadow,.7,.69);
  h.ink(head,'-24,20 -28,19 -28,15 -26,11 -23,12 -21,16',p.skinShadow,3);
  shell(h,head,'-24,15 -23,25 -21,31 -18,38 -15,36 -10,42 -2,45 8,44 16,40 20,35 25,27 24,18 22,12 24,8 19,9 17,4 11,5 6,1 -3,0 -13,3 -21,8',
    p.fur,p.shadow,2,8.2,[-4,.07]);
  h.ink(head,'-21,26 -20,32 -16,36 -13,35 -7,40 1,42 8,41 4,39 -3,38 -8,35 -13,32 -18,30',
    p.temple,4.4);
  patch(h,head,'16,23 21,25 27,24 30,21 30,15 27,10 23,8 18,9 16,13 18,17',
    p.skin,p.skinShadow,3.2,.64,[24,.05]);
  h.ink(head,'19,20 23,22 27,21 27.7,17.7 25.2,14.0 22.2,12.6 21,14.1 23.9,17.1 23.9,18.7 21.1,18.6',
    '#ac7767',5.6);
  // A continuous bare mask sets both eyes and the short projecting muzzle in the same skin.
  patch(h,head,'-23,22 -21,28 -16,31 -10,30 -6,28 -2,30 4,32 10,31 15,27 15.5,22 13,18 9,15 10,11 6,6 -1,3 -10,3 -17,6 -23,11 -26,15 -26,19',
    p.skin,p.skinShadow,3.35,.33,[-5,.05]);
  h.ink(head,'11,18 14,19 16,21 15,15 12,11 11,7 6,4 4,4 8,9',p.temple,5.8);
  h.ink(head,'-22,18 -15,18 -10,20 -6,18 -5,16 1,15 4,11 2,7 -3,5 -12,6 -20,9 -25,12 -26,15',
    p.muzzle,6.15,.53);
  h.ink(head,'-20,16.2 -16.8,18.2 -12,18.1 -8,16.8 -8.6,15.1 -13.3,14.6 -16.6,14.5 -20.4,15',
    '#b87c6c',7.42);
  h.line(head,-18.3,15.6,-16.5,15.8,8.6,.53,dark);
  h.line(head,-12.8,15.7,-11.2,15.1,8.6,.51,dark);
  eyePaper(h,head,-16,24.1,3.5,3.45,'#f1d6a9');
  eyePaper(h,head,2.8,24.1,5.4,5.10,'#f3dcb5');
  h.ink(head,'-20.0,27.9 -18,29.3 -14.7,29.6 -12.4,28.5 -15.2,28.6 -18.8,27.6',p.shadow,7.75);
  h.ink(head,'-2.9,29.1 .4,31 5.2,31.8 9.0,30.4 8.5,29.5 4.6,30.1 .8,29.5',p.shadow,7.75);
  h.ink(head,'-18.7,10.8 -15.3,9.5 -10.3,9.0 -5.3,10.2 -2.4,12.7 -3.0,10.4 -5.4,7.9 -9.5,7.3 -14.6,8.0',
    '#915b50',7.88);
  return {head,eyes:h.eyes(head,[[-17.0,23.9,2.18],[1.15,24.2,3.29]],24),mouth:h.at(head,-9.4,9.1,8.5)};
}

function macaque(h,g) {
  const p=monkey,tail=h.at(g,9,31,-4.75);
  tail.name='沿著獅布垂下的細長尾巴';
  patch(h,tail,'-5,4 1,8 8,7 14,3 20,-4 26,-10 32,-13 39,-13 45,-9 50,-7 47,-11 42,-15 37,-18 30,-18 23,-16 16,-11 9,-6 3,-5 -2,-5',
    p.fur,p.shadow,0,.74,[17,.13]);
  h.ink(tail,'2,4 8,4 14,0 21,-6 27,-11 33,-13 28,-13 21,-10 14,-4 8,.4',p.temple,2.25);
  const body=h.at(g);
  shell(h,body,'-17,62 -13,69 -4,75 5,75 14,71 19,62 17,53 14,43 16,32 12,26 3,23 -8,24 -17,29 -19,38 -16,49 -19,55',
    p.jacket,p.seam,.55,8.4,[3,.06]);
  h.ink(body,'-17,37 -10,40 3,40 15,42 15,35 12,29 4,25 -7,26 -15,29','#ac8054',3);
  patch(h,body,'-13,68 -8,72 -3,74 1,72 6,67 14,64 12,59 4,62 -4,67 -9,62 -14,60 -17,62',
    '#dfbe86','#c5a272',3.65,.32,[-2,.13]);
  h.ink(body,'-5,69 -1,66 4,62 5,58 4,47 2,45 2,57 .3,61 -7,67',p.seam,6.1);
  for(const y of [56,50]){
    h.line(body,-1.4,y,4.4,y+.23,6.64,.47,'#795a43');
    h.pip(body,4.5,y+.2,6.75,1.12,stock,8);
  }
  patch(h,body,'-16,41 -6,39 4,39 15,41 16,36 6,34 -5,33 -17,35',p.sash,p.redShadow,4.15,.44,[2,.13]);
  patch(h,body,'-10,37 -13,33 -12,25 -15,17 -9,18 -6,24 -7,33 -4,27 1,23 1,28 -3,35 -6,38',
    p.sash,p.redShadow,5,.42,[-7,.08]);
  h.ink(body,'-12,37 -9,39 -5,38 -4,35 -7,33 -11,34','#cc7053',7.4);
  const legs=[],arms=[],elbows=[];
  for(const side of [-1,1]){
    const leg=h.at(g,side*10.85,33,side<0?.25:-1.45);
    patch(h,leg,flip('-6,2 -1,4 5,3 8,-1 9,-7 7,-13 3,-17 -5,-17 -7,-13 -7,-5',side),
      p.trousers,'#536059',.7,.82);
    patch(h,leg,flip('-4,-14 5,-13 6,-17 4,-26 1,-29 -5,-28 -5,-22',side),p.binding,'#baa786',1.7,.52);
    for(const z of [-19.1,-23.3])h.line(leg,-3.6*side,z-1.3,4.3*side,z+1.3,4.05,.56,'#95875f');
    patch(h,leg,flip('-5,-26 3,-26 5,-28 9,-29 12,-30.5 12.5,-32 9,-32.5 -5,-32.5 -7,-31 -7,-28.5',side),
      p.sole,'#4c4a40',2.4,.64);
    legs.push(leg);
    const shoulder=h.at(g,side*15.1,68,4),elbow=h.at(shoulder,0,-16,1.5);
    patch(h,shoulder,flip('-4,4 1,5.4 5.7,3.5 8,-3 7,-9 4,-16 -4.5,-16.7 -7,-11 -7,-3',side),
      p.jacket,p.seam,.4,.77);
    h.ink(shoulder,flip('-6,-10.8 6.9,-9.2 5.7,-13 1,-15.9 -4.3,-16 -6,-13',side),'#dec08a',2.85);
    patch(h,elbow,flip('-3.9,2.9 2.6,2.2 4.4,-2 3.3,-8 2.2,-12 -3.5,-12.4 -5,-8 -5,-3',side),
      p.fur,p.shadow,1,.56);
    patch(h,elbow,flip('-3.6,-9.7 .6,-10 3.5,-11 5.4,-12.6 5.4,-14.6 3.7,-15.5 3.9,-17.7 1.5,-18.8 -.7,-18.4 -3.2,-17.7 -4.8,-15.3 -5,-12',side),
      p.skin,p.skinShadow,2.55,.47);
    h.line(elbow,.6*side,-15.8,2.4*side,-16.7,4.75,.31,'#aa705e');
    arms.push(shoulder);elbows.push(elbow);
  }
  const rest=[-.32,.32];
  arms.forEach((joint,i)=>{joint.rotation.z=rest[i];});
  return {...macaqueFace(h,g),tail,legs,elbows,armL:arms[0],armR:arms[1],rest};
}

function barbetFace(h,g) {
  const p=bird,head=h.at(g,.7,70,2.6);
  head.name='五色鳥的黃額、紅斑與藍頰';
  shell(h,head,'-24,15 -23,23 -19,31 -14,36 -6,40 3,42 12,41 19,37 23,32 26,25 24,21 21,16 20,10 15,8 10,2 4,-1 -6,-2 -13,1 -18,7 -21,8 -20,11 -24,11',
    p.leaf,p.deep,2,9.2,[6,.04]);
  h.ink(head,'-19,16 -18,23 -14,29 -8,33 1,36 8,37 8,34 1,29 -3,23 -3,17 -9,12 -13,11 -11,14 -17,12',
    '#719987',4.7);
  patch(h,head,'-12,21 -8,25 -1,29 7,29 14,27 18,26 21,22 18,17 13,14 14,10 8,7 1,6 -7,9 -11,13 -13,12',
    p.blue,p.blueShade,3.85,.25,[4,.08]);
  h.ink(head,'-5,29 -1,34 5,38 12,38 17,35 20,31 23,29 22,26 17,25 11,28 5,29 .2,28',p.yellow,6);
  h.ink(head,'-13,31 -10,35 -5,38 -.8,38 -2,36 -5,32 -8,30',p.scarlet,5.96);
  h.ink(head,'12.6,26.2 15,28.9 20.3,27.6 23.6,25.3 21.7,22.6 18.5,23.4 16.4,25.4',p.scarlet,6.23);
  h.ink(head,'-3,7 2,7.1 8,9.1 12.5,12 14,10 11,6 4,2 -.5,2.2 -5,4.2','#ccae60',6.02);
  h.ink(head,'-4.2,4.1 .3,3 5.0,3.5 2.7,.4 -1.0,-.2 -5.3,1.7','#ad5947',6.35);
  patch(h,head,'13,22.4 17.6,25.2 24.7,25.7 34,23.8 39,20.8 35,18.8 22.2,15.2 15.2,16.6',
    p.beak,p.beakShade,5.4,.53,[23,.13]);
  patch(h,head,'15,16.3 22.2,16.4 34.9,19.0 35.3,18.2 31.3,14.6 21.4,11.6 17.3,11.8',
    '#596062',p.beakShade,5.6,.35,[23,.12]);
  h.ink(head,'18.6,22.9 25.7,23.4 33.1,22.1 26.3,22.4 21.8,21.6','#767b74',7.7);
  eyePaper(h,head,4.2,24.4,5.1,4.6,'#edcf8d');
  h.ink(head,'-2.1,28.7 .8,30.6 5.4,30.8 8.2,29.7 5.0,29.7 1.3,29.4',p.deep,7.72);
  return {head,eyes:h.eyes(head,[[5.1,24.4,3.2]],24.4),mouth:h.at(head,27.5,16.9,8.5)};
}

function barbet(h,g) {
  const p=bird,tail=h.at(g,-6,37,-4.5);
  tail.name='五色鳥的三片短尾羽';
  patch(h,tail,'2,7 -4,10 -10,7 -18,-1 -28,-8 -34,-12 -29,-14 -22,-13 -25,-17 -17,-16 -10,-13 -5,-12 -1,-8 4,-6',
    p.wing,p.quill,0,.71,[-13,.24]);
  h.ink(tail,'-23,-10 -10,-3 -6,2 -11,-1 -24,-8',p.leaf,2.4);
  const body=h.at(g);
  shell(h,body,'-16,61 -11,70 -4,75 5,76 14,71 21,60 23,49 21,38 14,27 5,20 -3,17 -7,20 -12,19 -14,24 -19,29 -21,39 -21,49',
    p.leaf,p.deep,.65,8.5,[3,.055]);
  h.ink(body,'-8,26 -.5,23 7,25 16,31 14,26 6,20 -3,17 -7,21 -12,20 -15,26',p.wing,3);
  patch(h,body,'-17,61 -11,68 -6,69 -3,65 .8,58 3,50 3,32 -4,28 -15,29 -20,34 -18,43 -16,50',
    p.vest,p.vestShade,3.3,.58,[-9,.03]);
  patch(h,body,'7,71 13,68 19,60 20,51 20,44 22,39 18,32 10,29 5,30 4,47 3,54 6,61',
    p.vest,p.vestShade,3.3,.54,[12,.05]);
  h.ink(body,'-7,68 -5.5,68 -.3,61 4,54 4.8,47 5.3,31.3 3.6,30.1 2.7,47.5 .6,54.7 -2.2,60.2',
    '#89939d',5.68);
  for(const y of [49.6,39.5]){
    h.line(body,-.6,y,6.8,y+.45,6.15,.54,'#c8af76');
    h.pip(body,6.8,y+.46,6.47,1.06,'#d7b777',8);
  }
  const legs=[],arms=[],elbows=[];
  for(const side of [-1,1]){
    const leg=h.at(g,side*8.0,28,side<0?-.4:.7);
    patch(h,leg,'-4.7,3 1.4,4.0 5.2,1.4 4.4,-6.6 2.6,-8.8 .4,-7.4 -1.2,-10.1 -3.1,-7.4 -4.0,-8 -5,-3',
      p.leaf,p.deep,1,.55);
    patch(h,leg,'-2.6,-6.7 1.7,-7.1 2.8,-11.5 1.8,-18.0 2.8,-22.3 .5,-25.0 -2.4,-24.8 -2.4,-19.0 -3.4,-14.5',
      p.feet,'#736955',1.65,.43);
    patch(h,leg,flip('-1.5,-22.7 2.9,-21.7 4.9,-23.2 8.2,-23.8 10.7,-25.0 10.8,-26.1 7.3,-25.8 4.1,-24.8 3.4,-25.5 6.0,-26.8 5.2,-27.2 1.0,-26.2 -2.0,-24.9 -5.6,-25.2 -7.7,-26.4 -8.5,-25.4 -7.5,-24.0 -4.5,-23.4',side),
      p.feet,'#736955',2.3,.43);
    legs.push(leg);
    const shoulder=h.at(g,side*16.4,63.4,4.1),elbow=h.at(shoulder,0,-15,1.9);
    patch(h,shoulder,flip('-4.8,3.8 1.2,5.6 5.8,3.2 9.1,-2.8 9.0,-10.0 6.7,-17.6 3.3,-20.1 -.2,-17.1 -4.5,-15.6 -6.6,-10.1 -6.7,-3.2',side),
      p.wing,p.quill,.6,.72);
    h.ink(shoulder,flip('-4.8,-1 -.6,2.6 3.2,1.9 6.7,-2.8 7.2,-7.4 5.2,-6.3 2.8,-8.8 .9,-5.9 -2.3,-6.5 -2.4,-4.4 -4.1,-3.7',side),
      '#91aa71',3);
    // The primary feather curls around the scene's drumstick at (0,-33.5,6.3) from its shoulder.
    patch(h,elbow,flip('-4.6,2.3 .2,4.1 4.1,2.3 6.4,-2.9 6.1,-9.5 3.8,-15.0 3.4,-18.0 .5,-19.8 -2.6,-18.9 -4.7,-16.2 -6.2,-14.5 -5.5,-12 -7.1,-13.1 -6.8,-7.5',side),
      p.quill,'#486550',1.55,.54);
    h.ink(elbow,flip('-3.8,-3.0 -.6,-5.4 3.4,-3.1 2.3,-6.8 -1.8,-11.7 -2.4,-8.8 -5.3,-10 -4.1,-6.1',side),
      '#7e995e',3.9);
    patch(h,elbow,flip('-3.8,-14.3 -.9,-15.4 1.2,-16.3 2.7,-15.0 3.5,-15.2 3.7,-17.4 1.8,-19.0 -.4,-19.0 -2.5,-17.4',side),
      '#8a9e69',p.wing,4.5,.25);
    arms.push(shoulder);elbows.push(elbow);
  }
  const rest=[-.48,.58];
  arms.forEach((joint,i)=>{joint.rotation.z=rest[i];});
  return {...barbetFace(h,g),tail,legs,elbows,armL:arms[0],armR:arms[1],rest};
}

export function buildTempleResident(parent,key,short,helpers) {
  const g=helpers.at(parent);
  if(short)g.scale.setScalar(.865);
  return key==='macaque' ? macaque(helpers,g) : barbet(helpers,g);
}
