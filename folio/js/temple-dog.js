// The lion team's steward wears a cross-front cotton jacket, a narrow tied sash
// and wound gaiters. His head, ears and sickle tail follow the Taiwan dog audition.
import { puppetPaper } from './puppet-paper.js';
import { patch, shell, eyePaper, groundPaw, reachingArm, mirror, keeperRig } from './lantern-keeper-puppets.js';

const {at,ink,line,pip,eyes}=puppetPaper;
const indigo='#526a80', under='#3d5268', braid='#dcc9a0', charcoal='#3e3835';

function jacket(g) {
  const body=at(g);body.name='陣頭靛藍短打、盤扣和紅腰帶';
  shell(body,'-15,66 -14,73 -8,79 1,81 9,77 16,70 18,61 16,47 19,33 14,28 3,29 -2,32 -6,29 -15,29 -19,32 -16,46 -18,58',
    indigo,under,1.2,8,[1,.065]);
  ink(body,'-11,76 -6,79 1,79 7,77 9,74 4,70 -1,63 -5,62 -11,69',braid,3.23);
  patch(body,'-12,72 -7,77 -4,76 1,71 3,69 9,75 12,73 11,70 5,65 .2,62 -2,56 -5,55 -3,65 -8,70',
    '#7d9094','#657c88',3.55,.32,[0,.1]);
  ink(body,'-.6,63 1.4,63 .9,38 -.8,36',under,5.7);
  for(const y of [58.8,52.8]){
    line(body,-3.3,y,2.9,y-.20,5.95,.52,braid);
    pip(body,3.2,y-.17,6.25,.95,'#e7d5ad',7);
  }
  patch(body,'-17.5,46 -8,44.9 3,44.4 16.2,46.4 17,42 7.3,40.0 -4.3,39.9 -16.5,41.4',
    '#bf5f49','#994939',4.85,.36,[4,.04]);
  patch(body,'8,43 12,44 15,41 15,36 18,30 15,29 11.4,33 10,37 10,29 7,24 4.4,25 6.2,33 6.5,38',
    '#b15546','#904537',5.3,.35,[9,.08]);
  ink(body,'7.2,42.6 10.4,44 13.1,42.6 13.1,40 10.4,38.7 7.2,40','#d07b58',7.7);
}

function boundLeg(g,x,y,z,side,fur,shadow){
  const leg=groundPaw(g,x,y,z,fur,shadow,'#897052',side,true);
  patch(leg,mirror('-5,2 2,4 6,2.5 7,-2 6,-8 4,-14 1,-16 -4,-15 -6,-12 -7,-6',side),
    '#606e77','#4a5965',1.9,.55,[0,.08]);
  patch(leg,mirror('-4,-13.2 .3,-14 4.3,-13 4.7,-18 3.1,-25.8 .4,-26.6 -4,-26.2 -4.5,-22',side),
    '#d5bc92','#bba27b',2.78,.40,[.1,.04]);
  for(const h of [-17.8,-22.0]){
    ink(leg,mirror([[-4,h+.8],[-2.5,h+1.4],[3.9,h-1.0],[3.7,h-2.2],[-2.8,h+.18]],side),'#958361',5.15);
  }
  return leg;
}

const fur='#b8895c',shadow='#927151',muzzle='#d9b489';

export function taiwanDogTail(g){
  const tail=at(g,10,32,-4.6);tail.name='豎起的短毛鐮刀尾';
  shell(tail,'-5,8 3,10 12,10 20,14 25,23 26,33 24,42 18,49 13,53 18,52 25,48 31,42 34,33 34,24 31,14 26,7 18,1 8,-3 0,-4 -4,-1',
    fur,shadow,0,4.5,[22,.03]);
  ink(tail,'23,45 19,49 15,52 22,50 27,47 30,42 28,44',muzzle,2.7);
  return tail;
}

export function taiwanDogHead(g){
  const head=at(g,-4,76,2.4);
  shell(head,'-25,15 -21,24 -21,37 -19,58 -17,62 -11,56 -8,42 -3,40 7,40 15,46 23,59 26,59 27,42 24,32 23,24 19,16 18,9 13,10 10,4 4,2 -.8,3 -8,1 -18,5 -26,8 -34,11 -36,15 -33,17',
    fur,shadow,2,9.2,[3,.05]);
  ink(head,'-18,53 -16,48 -14,39 -18,35 -20,36','#a57466',4.49);
  ink(head,'17,39 23,52 24.5,52.6 23,41 20.2,35.8 16.8,33.9','#ae7b68',4.52);
  ink(head,'-26,18 -23,21 -18,22 -15,21 -10,19 -11,16 -17,15 -24,16 -33,16 -33,17.2','#966d50',4.58);
  patch(head,'-36,15 -29,18 -23,17 -17,15 -11,16 -5,13 2,11 9,12 15,16 13,10 5,5 -3,3 -13,4 -21,7 -30,9 -36,12',muzzle,'#c69d74',4.7,.26,[-14,.1]);
  ink(head,'-36,15.6 -33,17.1 -29,16.9 -26,15.7 -27.4,13.8 -31,12.5 -34.6,13.1',charcoal,7.35);
  ink(head,'-24,9.9 -18,9.1 -13,9.5 -8,11.4 -9,9.5 -13.8,7.9 -20,8.3','#81583e',7.4);
  eyePaper(head,-14.5,25.8,3.5,3.4,'#edc997');eyePaper(head,.7,26.0,5.25,4.8);
  ink(head,'-5.6,30.3 -2,33.1 3.5,33.2 6.1,31.8 2.9,32 -.6,31 -3.1,29.9',shadow,7.48);
  return {head,eyes:eyes(head,[[-16.3,25.8,2.1],[-1.0,26,3.15]],25.9),mouth:at(head,-20,9.4,8.1)};
}

export function buildTempleDog(g){
  const tail=taiwanDogTail(g),face=taiwanDogHead(g);
  jacket(g);
  const legs=[boundLeg(g,-10.8,30.8,-1.4,-1,fur,shadow),boundLeg(g,10.5,32,1.6,1,fur,shadow)];
  const arms=[
    reachingArm(g,'dog',-1,[-13.3,67,3.25],[-24.5,59],[-37.6,66]),
    reachingArm(g,'dog',1,[13.5,68,4.3],[20.7,55.5],[25.4,53.4])
  ];
  arms.forEach(({arm},i)=>{
    const side=i?1:-1;
    patch(arm,mirror('-4.7,2.1 -.1,3.5 4.6,2.2 6.1,-2 6.2,-7.1 3.4,-10.2 -3.7,-10.1 -5.5,-7.1',side),
      indigo,under,2.5,.50,[0,.08]);
    ink(arm,mirror('-4.9,-6.7 5.6,-6.1 4.7,-8.1 3.2,-9 -3.5,-9.25',side),'#8a9b9a',4.8);
  });
  const rig=keeperRig({...face,tail,arms,legs});
  rig.stitchRail=at(g,-2.2,42.2,7.78);
  rig.stitchRail.name='陣頭腰帶上的繡線';rig.stitchRail.scale.setScalar(.55);
  return rig;
}
