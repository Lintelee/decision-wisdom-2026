// The host's horns, stand collar and lapel flower are cut as one readable silhouette across the table.
export function banquetHost(g, a) {
  const {at,paper,carved,ink,eyeWhite,stem,badge,eyes} = a;
  const hide = '#73736a', dark = '#4f524e', muzzle = '#b29e8c';
  const wine = '#88483f', fold = '#663e3e', cord = '#e9c58c', shoe = '#494945';
  const mirror = (points,s) => points.map(([x,y])=>[x*s,y]);
  const tail = at(g,-12,32,-5);
  stem(tail,0,0,-8,-17,0,.90,hide);
  paper(tail,'-7,-14 -4,-17 -5,-22 -10,-26 -11,-20',dark,'#484a45',0,.5);

  const legs = [], arms = [], elbows = [], grips = [];
  for (const side of [-1,1]) {
    const leg = at(g,side*9.5,29,side<0?-1:1);
    paper(leg,mirror([[-5,1],[5,2],[5,-12],[3,-23],[1,-26],[-5,-25],[-6,-14]],side),'#57626a','#414c54',0,.72);
    carved(leg,mirror([[-5,-23],[2,-23],[7,-25],[9,-26],[8,-28],[-6,-28],[-7,-26]],side),shoe,'#373a39',2,{depth:4,rim:.65});
    legs.push(leg);
  }
  carved(g,'-20,21 -19,38 -16,60 -13,68 -7,71 10,71 17,67 20,58 21,37 23,19 16,16 5,17 2,21 0,17 -13,16',wine,fold,2,{depth:9,rim:1.05,crease:[3,.08]});
  ink(g,'-18,21 -12,22 1,23 2,25 2,18 -13,17 -19,18','#ab6250',5.6);
  ink(g,'4,22 16,20 21,23 21,19 16,17 5,18','#aa6352',5.7);
  paper(g,'-9,69 -6,77 5,78 12,74 12,67 6,65 -4,66','#953f38','#6e3a35',5.1,.64);
  stem(g,-7,74,-1,70,8.1,.64,cord); stem(g,-1,70,9,74,8.1,.64,cord);
  for (const [p,q] of [[[0,69],[7,64]],[[7,64],[8,22]]]) stem(g,...p,...q,6.1,.55,'#c68e69');
  for (const y of [61,50,39]) {
    stem(g,3.8,y,10.4,y,7.1,.68,cord);
    stem(g,6,y-1.2,9.4,y-.75,7.1,.48,cord);
    badge(g,10.4,y,7.3,1.08,'#e3bd83');
  }
  const flower = at(g,-9.5,59,7.2); flower.name='水牛主人家的迎賓胸花';
  ink(flower,'-1,0 -8,2 -10,5 -4,5 0,1 5,5 9,5 7,2 2,0','#59715b',0);
  for (let i=0;i<5;i++) {
    const petal=at(flower); petal.rotation.z=i*2*Math.PI/5;
    paper(petal,'-1,-1 -3,1 -3.6,3.8 -1.8,5.5 .8,5.1 2.1,3.2 2,1','#d95e4c','#ad4339',1.0,.24);
  }
  badge(flower,0,0,3.8,1.65,'#ecc680');

  for (const side of [-1,1]) {
    const shoulder=at(g,side*17.4,64,side<0?1.5:4);
    const elbow=at(shoulder,side*2.4,-17.3,1.4);
    carved(shoulder,mirror([[-4,2],[3,4],[8,0],[8,-10],[5,-18],[-4,-18],[-6,-12]],side),wine,fold,0,{depth:4.8,rim:.68});
    paper(elbow,mirror([[-4,2],[5,2],[6,-4],[8,-10],[-3,-12],[-6,-6]],side),wine,fold,.6,.67);
    paper(elbow,mirror([[-4,-8],[7,-7],[8,-10],[-3,-12]],side),cord,'#be9871',2,.52);
    carved(elbow,mirror([[-2,-11],[6,-10],[7,-13],[8.6,-16],[6.6,-18],[4,-17.5],[2.5,-19],[-.3,-18],[-2,-15]],side),
      '#79776b',dark,1.9,{depth:3.1,rim:.58});
    stem(elbow,4*side,-17.6,4*side,-15.3,4.3,.36,'#454944');
    grips.push(at(elbow,side*3.5,-15.7,4.5));
    arms.push(shoulder); elbows.push(elbow);
  }
  const head=at(g,0,74,2.8);
  // Both horns sweep sideways before they turn upward, with a dark base and a pale cut at the tip.
  for (const side of [-1,1]) {
    const horn=at(head,side*13,25,side<0?-1.4:-.6);
    horn.name=side<0?'水牛左彎角':'水牛右彎角';
    const arc=[[0,-2],[-2,2],[1,7],[8,9],[14,11],[21,16],[25,23],[27,28],[27,18],[24,12],[19,6],[13,1],[6,-2]];
    carved(horn,mirror(arc,side),'#9b9080','#6a665e',0,{depth:4.2,rim:.75,crease:[0,.11]});
    ink(horn,mirror([[15,10],[21,16],[25,23],[27,28],[25,17],[22,13]],side),'#d5c5a3',3.2);
    for (const x of [5.3,9.3]) stem(horn,x*side,1.0,(x+1.8)*side,6.5,3.25,.45,'#726c61');
    const ear=at(head,side*14.7,20.3,.3);
    paper(ear,mirror([[-1,2],[8,5],[16,3],[18,1],[13,-4],[4,-7],[0,-3]],side),hide,dark,0,.78);
    ink(ear,mirror([[2,1],[9,2.3],[14,1],[9,-2.1],[3,-3]],side),'#ab9182',3.1);
  }
  carved(head,'-19,19 -17,27 -11,32 -3,34 7,33 14,30 18,25 18,17 16,10 12,4 8,1 -2,-.5 -10,3 -15,8',hide,dark,2,{depth:8.4,rim:1.0,crease:[2,.12]});
  ink(head,'-10,30 -7,32 -5,30 -3,33 0,31 3,33 5,31 9,30 5,27 -4,28','#a49f8c',5.3);
  const pupil=eyes(head,[[-6.8,19.3,2.1],[8.2,20,2]],19.6);
  eyeWhite(head,-6.5,19.0,3.68,2.86); eyeWhite(head,8.2,19.8,3.42,2.64);
  ink(head,'-12,23 -8,25 -5,25.2 -2.8,23.4 -7.5,23.9 -11.8,21.5','#dfcfb1',6);
  ink(head,'4,23.6 6,25.4 10.8,26 13,24.8 10,24.9 5,22.7','#dfcfb1',6);
  carved(head,'-13,11 -9,14.3 -1,14.8 4,13.9 10,14.5 15,12 16,8 13,4.2 8,.8 -1,0 -8,2 -13,6',muzzle,'#8c7f72',7.0,{depth:3.0,rim:.54,crease:[0,.16]});
  for (const x of [-6.2,9.6]) ink(head,[[x-2.1,9.3],[x-.8,11.4],[x+1.0,11.1],[x+1.4,9.5],[x+.15,8.4],[x-1.7,8.3]],'#494a44',10.9);
  stem(head,-2.8,4.8,2.4,3.7,10.5,.42,'#756751'); stem(head,2.4,3.7,8,5.5,10.5,.42,'#756751');
  return {head,eyes:pupil,mouth:at(head,4.0,4.5,11.0),tail,legs,elbows,grips,
    armL:arms[0],armR:arms[1],rest:[-.32,.35]};
}
