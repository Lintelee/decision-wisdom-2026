// 第 6 頁｜手印牆｜何華軒〈娛樂與運動如何累積品牌心智資產？〉、徐莉媛〈別買曝光了，開始買注意力吧〉、吳宗霖、陳炯文〈共同記憶帶來的品牌價值〉
// 街上三處已掛了同版風箏海報。畫師把同一幅畫放大滾上入口的白牆，每個路過的人都看到了。
// 只是前面拉著紅龍，兩手沾滿顏料的小孩把手藏到背後。把他帶到牆邊按一下：紅龍收起，大家一個接一個按上手印。
import { storyPanel, pulse } from './reading-beats.js';
import { printPalm } from '../prop-finish.js';
import { C, keep, group, box, cyl, cone, ball, disc, beam, poly, card, tab, cratePlank } from '../paper.js';
import { flowerTile, foldTravel, paperMechanism } from './market-craft.js';
import { fieldCloud, fieldSun, fieldPress, issuePrint, pressPlate } from './market-atlas.js';
import { marketEditions } from './market-picture-street.js';
import { printCourt } from './market-streetscape.js';

// Each pass leaves one brushstroke on a real test card. The bristles sit on the wet edge.
function swallowsProof(S,g) {
  const work=keep(g,.96,.11,1.24), width=1.12;
  box(work,0,.31,0,width,.62,.05,'#aa8157');
  box(work,0,.31,.034,width-.08,.56,.018,'#f0e3c4');
  box(work,-.34,.592,.059,.11,.045,.012,'#89765d');
  beam(work,[.44,.02,-.27],[.44,.47,-.023],.022,C.wood,5);
  const lines=[
    [[-.44,.50],[-.23,.448],[-.107,.318],[.025,.27]],
    [[.025,.27],[.165,.405],[.29,.463],[.43,.52]],
    [[-.224,.15],[-.11,.212],[.045,.26],[.115,.304],[.19,.306]],
  ];
  const strokes=lines.map((path,line)=>path.slice(1).map(([x,y],i)=>{
    const [a,b]=path[i], length=Math.hypot(x-a,y-b), g=keep(work,a,b,.055+line*.0025);
    g.rotation.z=Math.atan2(y-b,x-a);
    const thick=line===2 ? .02 : .026;
    poly(g,[[0,-thick*.65],[length*.63,-thick],[length,0],[length*.54,thick],[0,thick*.65]],.007,'#aa4f42');
    g.visible=false; return g;
  }));
  const brush=keep(work,-.54,.015,.12), restAngle=.14, tip=.86*.71;
  const birdInk=keep(work,-.24,0,.066);
  const silhouette=[[.43,.305],[.387,.326],[.350,.326],[.298,.293],[.225,.289],[.100,.22],[.006,.148],[.106,.188],[.051,.118],[.195,.211],[.294,.235],[.354,.266],[.372,.291]];
  poly(birdInk,silhouette,.009,'#9c4b3e');
  disc(birdInk,.348,.304,.01,.008,'#e1ba93',.004,7);
  birdInk.name='三筆完成的燕子試樣'; birdInk.visible=false;
  brush.scale.setScalar(.71);
  beam(brush,[0,0,0],[0,.55,0],.022,C.wood,5);
  box(brush,0,.62,0,.16,.1,.05,C.steel); box(brush,0,.74,0,.15,.16,.06,C.gold);
  box(brush,0,.8,0,.13,.05,.061,C.red); brush.rotation.z=restAngle;
  S.pad(brush,.52,[.81,.36,-.08]);
  S.discovery(brush,{id:'brush',label:'畫師的紅漆試刷紙',duration:1.22,sound:'brush',draw(u,visit,reduced){
    const which=(visit-1)%lines.length, phase=foldTravel(u,.15,.78), path=lines[which];
    const parts=path.length-1, part=Math.min(parts-1,Math.floor(phase*parts)), local=phase*parts-part;
    strokes.forEach((segments,k)=>segments.forEach((seg,i)=>{
      const amount=k<which?1:k===which?Math.max(0,Math.min(1,phase*segments.length-i)):0;
      seg.visible=amount>0; seg.scale.x=Math.max(.001,amount);
    }));
    birdInk.visible=which===2&&phase>.02;
    birdInk.scale.x=Math.max(.001,phase);
    const [a,b]=path[part],[c,d]=path[part+1];
    const reach=Math.min(foldTravel(u,0,.15),1-foldTravel(u,.79,1)), x=a+(c-a)*local, y=b+(d-b)*local;
    const angle=restAngle-(reduced ? .55 : 2.1)*reach;
    brush.rotation.z=angle;
    brush.position.set(-.54+(x+Math.sin(angle)*tip+.54)*reach,.015+(y-Math.cos(angle)*tip-.015)*reach,.12-.078*reach);
  }});
}

const DIARY = '一起按過手印的牆，大家會記一輩子。';
const WALL = { x: -2.55, z: -1.6, w: 4.48, h: 2.45 };      // the wall (its front face is at z = -1.52)
const K = 1.16;                                            // the mural's scale on the wall
const MW = 3.6, MH = 1.6, MY = .3, MZ = .081;              // the mural on it: width, height, bottom, face
const FOLK = { x: -.5, z: 0 };                             // the piece the people stand in
const P = (x, z) => ({ x: x - FOLK.x, z: z - FOLK.z });    // a place on the page, in that piece's own coordinates
const WHITE = '#fbf6ea';

/** The market mural on a sunny afternoon. Origin at its bottom centre, x ±1.8, y 0…1.6 */
function mural(g) {
  card(g,0,0,0,MW,MH,'#b5cbbd',.006,.045);
  const sx = -1.16, sy = 1.15;
  for (let i = 0; i < 9; i++) poly(g, [[-.028, .317], [.028, .317], [0, .399]], .004, '#d9a352', sx, sy, .007).rotation.z = i * Math.PI * 2 / 9;
  disc(g, sx, sy, .012, .286, '#edac42', .012, 20);
  poly(g, [[-.3, 0], [-.24,.065],[-.13,.076],[-.05,.16],[.09,.18],[.17,.10],[.27,.10],[.37,.018]], .004, WHITE, -.12, 1.28, .008);
  const ridges=[
    {base:.51,z:.010,ink:'#91aa87',h:[.24,.38,.33,.53,.44,.63,.48,.57,.42,.36,.56,.42,.32]},
    {base:.38,z:.015,ink:'#537c6d',h:[.20,.31,.29,.46,.36,.42,.23,.38,.31,.24,.34,.28,.19]},
  ];
  for(const {base,z,ink,h} of ridges) {
    const profile=h.map((v,i)=>[-MW/2+i*MW/(h.length-1),base+v]);
    poly(g,[[-MW/2,0],...profile,[MW/2,0]],.004,ink,0,0,z);
  }
  // A continuous tiled arcade fills the foreground. Its rhythm survives when
  // this same artwork is printed on distant walls and the camera's little photograph.
  box(g,0,.191,.024,3.55,.369,.009,'#ba8b70');
  box(g,0,.365,.031,3.55,.057,.009,'#ead1a7');
  for (let i=0;i<12;i++) {
    const x=-1.69+i*.30;
    beam(g,[x,.060,.033],[x+.145,.178,.033],.009,'#e2bd93',4);
    beam(g,[x+.145,.178,.033],[x+.27,.077,.033],.009,'#d5a681',4);
  }
  const shops=[
    [-1.32,.60,'#d0ac80','#985d50'],[-.74,.83,'#d9c099','#606f66'],
    [-.12,.63,'#d9bca2','#99786e'],[.47,.76,'#e1c798','#67938a'],[1.15,.61,'#d6b8a4','#ac7156']
  ];
  for (const [x,top,wall,eave] of shops) {
    box(g,x,(top+.40)/2,.040,.52,top-.40,.013,wall);
    poly(g,[[-.285,0],[.285,0],[.226,.095],[-.214,.085]],.009,eave,x,top,.049);
    for(const dx of [-.112,.112]) box(g,x+dx,.47,.057,.101,.14,.011,'#5a6c62');
    beam(g,[x-.26,.398,.052],[x+.26,.398,.052],.012,'#dec9a6',4);
  }
  box(g,.47,.731,.060,.54,.085,.010,'#cbad87');
  for(let i=0;i<5;i++) box(g,.249+i*.105,.733,.067,.050,.086,.008,'#6d8880');
  for(const x of [-.97,-.43,.77,1.52]){
    beam(g,[x,.376,.063],[x,.624,.065],.017,'#796447',4);
    disc(g,x,.67,.070,.103,'#678568',.011,12);
  }
  // The large two-tone red kite, its ribbon, the yellow sun and the five-shop silhouette
  // must read at the size of a hanging street sign as well as on the wall.
  const kite = group(g); kite.position.set(.89,1.174,.085); kite.rotation.z=-.18;
  for(const [a,b] of [
    [[0,-.275],[-.13,-.413]],[[-.13,-.413],[-.34,-.392]],[[-.34,-.392],[-.53,-.49]],
  ]) beam(kite,[...a,0],[...b,0],.013,'#735a50',5);
  for(const [dx,dy] of [[-.16,-.407],[-.39,-.424]]) {
    poly(kite,[[-.052,.043],[.01,0],[-.048,-.039]],.006,'#c34b3b',dx,dy,.006);
    poly(kite,[[.060,.033],[.005,0],[.046,-.039]],.006,'#c34b3b',dx,dy,.006);
  }
  poly(kite,[[0,.326],[-.366,.043],[0,-.282],[.341,.055]],.007,'#f1d3a1');
  poly(kite,[[-.005,.307],[-.342,.044],[-.007,-.26]],.007,'#a63631',0,0,.008);
  poly(kite,[[.01,.305],[.324,.055],[.01,-.264]],.007,'#e05c43',0,0,.008);
  for (const [x, y] of [[-.35, 1.32], [-.15, 1.42], [-.22, 1.22]]) { beam(g, [x - .05, y + .025, .02], [x, y, .02], .007, C.ink, 3); beam(g, [x, y, .02], [x + .05, y + .025, .02], .007, C.ink, 3); }
}

/** The painter leaves a rounded leopard-cat pad among the neighbours' impressions. */
function handprint(g, col, k = 1, catPad = false) {
  if (catPad) {
    pawprint(g,col,k*1.88);
    return;
  }
  printPalm(g,col,k);
}
function pawprint(g, col, k = 1) {
  disc(g, 0, 0, .004, .045 * k, col, .008, 12);
  for (const [x, y] of [[-.05, .045], [-.018, .07], [.018, .07], [.05, .045]]) disc(g, x * k, y * k, .004, .019 * k, col, .008, 8);
}

// The little camera keeps exactly the mural and prints already on the real
// wall at the moment the shutter is pressed, even halfway through the story.
function neighbourhoodCamera(S, cover, wallPrints) {
  S.plant(4.38, .96, (g) => {
    const camera = keep(g);
    const dark = '#344746', brass = '#d8a456', vellum = '#f6ebd3';
    tab(camera, .74);
    for (const [x,z] of [[-.34,.23],[.34,.21],[.035,-.3]]) {
      beam(camera, [x,.01,z], [x*.18,.73,z*.18], .032, C.wood, 5);
      beam(camera, [x*.67,.26,z*.67], [x*.51,.38,z*.51], .043, brass, 6);
    }
    box(camera, 0, .735, 0, .72, .06, .44, C.bark);
    box(camera, 0, .92, -.13, .72, .39, .28, dark);
    for (const x of [-.32,.32]) box(camera, x,.93,-.13,.045,.38,.3,brass);
    const bellows = [];
    for (let i=0; i<5; i++) {
      const pleat = keep(camera, 0, .91, .005+i*.047);
      box(pleat,0,0,0,.52-i*.04,.34-i*.023,.048,i%2 ? '#9c5342' : '#7e453e');
      box(pleat,0,0,.025,.46-i*.038,.285-i*.018,.008,'#854b40');
      bellows.push(pleat);
    }
    const lens = keep(camera,0,.91,.26);
    disc(lens,0,0,0,.147,brass,.066,18);
    disc(lens,0,0,.042,.117,dark,.030,18);
    disc(lens,0,0,.064,.073,'#52898b',.016,16);
    disc(lens,-.019,.028,.079,.023,'#cce2d4',.007,8);
    const shutter = keep(camera,.2,1.16,-.06);
    cyl(shutter,0,0,0,.04,.052,.075,brass,10);
    box(camera,0,1.13,-.15,.54,.026,.069,C.ink);
    const sheet = keep(camera,0,1.06,-.17);
    card(sheet,0,0,0,.61,.58,vellum,.016,.023);
    card(sheet,0,.112,.018,.52,.397,'#a7c7bd',.008,.012);
    const emptyWall = group(sheet);
    box(emptyWall,0,.162,.028,.51,.095,.008,'#caa87e');
    box(emptyWall,-.014,.294,.032,.36,.224,.008,'#f5e9cf');
    box(emptyWall,-.014,.412,.038,.38,.016,.012,C.stone);
    box(emptyWall,-.014,.177,.038,.37,.019,.012,C.stone);
    for (const x of [-.175,-.129]) beam(emptyWall,[x,.153,.045],[x+.03,.405,.045],.006,C.bark,4);
    for (let i=0;i<5;i++) beam(emptyWall,[-.171+i*.005,.176+i*.045,.045],[-.127+i*.005,.176+i*.045,.045],.004,C.wood,4);
    box(emptyWall,.149,.192,.046,.058,.045,.008,C.coral);
    disc(emptyWall,.192,.427,.04,.036,'#e9c36a',.008,10);
    const ink = keep(sheet,0,.15,.045); ink.scale.set(.129,.19,.18); mural(ink);
    const pictured = {};
    Object.entries(wallPrints).forEach(([id,print]) => {
      const mark = keep(ink, print.position.x, print.position.y, .111);
      if (id.startsWith('paw')) pawprint(mark,C.coral,1);
      else handprint(mark, ({ zhi:'#3f8a8c',baby:C.pink,gran:C.red,mom:C.gold,kidR:C.aqua })[id] || C.coral,1.3,id === 'zhi');
      pictured[id] = mark;
    });
    for (const x of [-.20,-.15,-.1]) box(sheet,x,.055,.018,.024,.016,.008,'#af8971');
    paperMechanism(S,camera,{
      id:'mural-camera', label:'拍下此刻的牆', sound:'stamp', duration:.95,
      measure(open) {
        if (!open) return;
        ink.visible = !cover.visible || cover.scale.x < .98;
        Object.entries(pictured).forEach(([id, mark]) => { mark.visible = wallPrints[id].visible; });
      },
    }, (u) => {
      const squeeze = Math.sin(Math.PI * u);
      shutter.position.y = 1.16 - .052*squeeze;
      bellows.forEach((pleat,i) => { pleat.position.z = .005+i*(.047-.024*squeeze); });
      lens.position.z = .26-.12*squeeze;
      sheet.visible = u > .28;
      sheet.position.y = 1.13 - .55 * (1-foldTravel(u,.28,1));
    });
  }, { s: 1.13, ry: -.22 });
}

export default {
  id: 's06-memory', land: 'people', short: '一起按手印', calm: true,
  title: '廣告看完就忘，什麼樣的體驗會讓人記住品牌？',
  sources: [{ n: 8 }, { n: 10 }, { n: 11 }],
  diary: DIARY,
  takeaway: '把媒體做成邀請：人自己參與過的時刻，才會被記住、被分享、被帶到下一代。',
  quote: { t: '品牌可以購買曝光，卻無法購買記憶；真正影響消費決策的，不是品牌被看見多少次，而是是否出現在那些值得被記住的重要時刻。', n: 8, page: 65 },
  look: { bg: '#2f5f46', table: '#93ab85', key: '#fff1cc', fill: '#cfe6da', sky: '#fff6dc' },   // afternoon
  ground(G) {
    G.wash('#e3d8b7');
    G.rect(0, -3.15, 12.4, 1.1, '#afc28a', { r: 0 });
    G.marks('tick', -6, -3.6, 6, -2.65, { n: 70, col: '#7f9f6a66', size: .12, seed: 4 });
    // The turf wraps right around the white wall. Flat, irregular flagstones link the gate, paint tray and easel.
    G.blob([[-5.8,-2.75],[-2.29,-2.60],[.03,-2.25],[2.20,-3.1],[5.71,-2.82],[5.82,2.16],[5.1,2.71],[3.94,2.88],[2.80,2.59],[1.57,2.85],[.54,2.48],[-.36,1.65],[-2.20,1.41],[-3.07,2.57],[-4.82,2.70],[-5.55,2.13]],'#9eb481',{sharp:true});
    G.blob([[-5.52,-1.85],[-.05,-1.69],[.13,-.13],[-.69,.52],[-1.91,1.23],[-2.90,1.58],[-4.78,.95],[-5.44,.52]],'#d8b682',{sharp:true,edge:'#bc9f73',edgeW:.07});
    for(const z of [-.72,.08,.79])G.path([[-5.16,z-.16],[-3.17,z-.03],[-1.47,z]],{w:.047,col:'#c5a574',sharp:true});
    const walk=[[2.98,-3.1],[3.12,-2.00],[2.61,-1.14],[1.98,-.59],[1.89,.13],[2.45,.80],[3.42,1.41],[4.42,1.75],[5.76,2.07]];
    G.path(walk,{w:1.10,col:'#8e9575'});
    G.path(walk,{w:.96,col:'#d9d0ac'});
    for(const [x,z,rot,w] of [[3.01,-2.44,.1,.79],[2.86,-1.76,.27,.81],[2.36,-1.00,.84,.78],[1.99,-.34,.06,.79],[2.05,.27,-.40,.75],[2.54,.87,-.75,.75],[3.33,1.34,-1.14,.82],[4.2,1.70,-1.20,.7],[5.11,1.94,-1.29,.76]]) {
      G.rect(x,z,w,.49,'#abab91',{rot,r:.12,edge:'#c5c4a5',edgeW:.045});
    }
    G.path([[-.78,.36],[.34,.60],[1.21,.55],[2.06,.34]],{w:.34,col:'#d8c6a0'});
    G.blob([[3.51,-1.32],[5.63,-1.38],[5.72,.34],[5.02,.93],[3.85,.51],[3.23,.03]],'#b5c38b',{sharp:true});
    for (const [x, z, r, c] of [[-4.0, .05, .17, '#ee867299'], [-3.6, .2, .1, '#e8b84e99'], [-4.35, -.1, .08, '#62c4cf99'], [-2.0, .35, .07, '#ee867277']]) G.circle(x, z, r, c);
  },
  build(S) {
    const st = S.state({ phase: 'intro', busy: false });
    let painting = false, catAt = 0, catBusy = false;
    fieldPress(S,6);
    const gate = printCourt(S);
    const followTheCopies = marketEditions(S, gate, mural);

    // ---- the sun, in the afternoon sky over the wall
    let rays, swallowShadow;
    S.plant(-1.2, -3.25, (g) => { rays = fieldSun(g, { y: 2.3, r: .42 }); });
    S.discovery(rays,{id:'sun',label:'畫牆上的午後日光',duration:1.55,sound:'sparrow',draw(u,visit,reduced){
      const flight=visit%2?u:1-u;
      swallowShadow.visible=u>.04&&u<.97;
      swallowShadow.position.set((flight-.5)*(reduced?1.05:3.15),1.62+.21*Math.sin(Math.PI*flight),.192);
      swallowShadow.rotation.z=.18*Math.cos(flight*Math.PI);
      swallowShadow.scale.x=visit%2?1:-1;
    }});
    S.plant(-4.4, -3.35, (g) => fieldCloud(g, 1.1, 2.9)); S.plant(4.5, -3.3, (g) => fieldCloud(g, 1.2, 2.6));

    // ---- the wall: the hero of the page
    let cover, prints;
    const P6 = {};
    const wallP = S.plant(WALL.x, WALL.z, (g) => {
      tab(g, 3.8);
      box(g, 0, WALL.h / 2, 0, WALL.w, WALL.h, .16, WHITE);
      box(g, 0, .07, .01, WALL.w + .04, .14, .18, C.stone);
      box(g, 0, WALL.h + .04, 0, WALL.w + .24, .09, .26, C.stone);
      box(g, 0, WALL.h + .102, -.01, WALL.w + .34, .035, .30, '#b18d72');
      for (let i=0; i<15; i++) {
        const x=(i-7)*.294;
        box(g,x,WALL.h+.132,-.012,.277,.025,.31,i%3 ? '#ddad88' : '#cc9b7e');
        box(g,x,.12,.109,.284,.039,.014,i%3 ? '#bd9f7b' : '#b39273');
      }
      for (const sx of [-1, 1]) { box(g, sx * (WALL.w / 2 + .06), WALL.h / 2 + .02, 0, .18, WALL.h + .05, .24, '#ead8b2'); cyl(g, sx * (WALL.w / 2 + .06), WALL.h + .14, 0, .07, .1, .1, C.stone, 8); }
      for (const side of [-1,1]) for (const y of [.26,1.80,2.05]) flowerTile(g,side*(WALL.w/2+.059),y,.12,.137,'#e3ceb0','#7a9281');
      for(const side of [-1,1]) {
        const px=side*(WALL.w/2+.06);
        box(g,px,.19,.039,.28,.30,.34,'#988a71');
        box(g,px,.348,.032,.306,.036,.36,'#c7b392');
        box(g,px,2.15,.015,.254,.056,.28,'#a99271');
        box(g,px,2.25,.015,.288,.064,.30,'#b39472');
      }
      pressPlate(g,'手印牆',0,WALL.h+.13,.159,.85,.17,'#526b55','#f2e8c5');
      issuePrint(g,'people',-1.64,.207,.14,.18,'#84795a');
      swallowShadow=keep(g);
      poly(swallowShadow,[[-.28,.13],[-.15,.114],[-.015,.044],[.081,.109],[.224,.11],[.285,.147],[.196,.036],[.097,.014],[.146,-.007],[.088,-.018],[.020,-.019],[-.112,-.096],[-.074,-.020],[-.157,.014]],.005,'#a79d80');
      swallowShadow.visible=false;
      // the mural is under a blank cover that the painter's roller takes away from left to right
      const face = keep(g, 0, MY, MZ); face.scale.setScalar(K); mural(face);
      cover = keep(face, MW / 2 + .03, -.02, .117); box(cover, -(MW / 2 + .03), (MH + .04) / 2, .005, MW + .06, MH + .04, .01, WHITE);
      prints = keep(face, 0, 0, .111);
      const mk = (id, x, y, fn) => { const k = keep(prints, x, y, 0); fn(k); k.visible = false; P6[id] = k; return k; };
      mk('kidL', .42, .86, (k) => handprint(k, C.coral, .9)); mk('kidR', .7, .9, (k) => { const m = keep(k); m.scale.x = -1; handprint(m, C.aqua, .9); });
      mk('uncle', -.05, 1.3, (k) => handprint(k, C.gold, 1.25));
      mk('zhi', -.52, 1.02, (k) => handprint(k, '#3f8a8c', 1.15, true));
      mk('gran', 1.0, 1.3, (k) => handprint(k, C.red, 1.3));
      mk('mom', 1.33, 1.25, (k) => handprint(k, C.gold, 1.0));
      mk('baby', 1.58, 1.2, (k) => handprint(k, C.pink, .58));
      [[-1.5, 1.5, C.coral, .8], [-1.58, .62, C.gold, .7], [-.95, 1.55, C.aqua, .65], [-.25, .58, C.pink, .8], [.3, 1.5, C.red, .7], [-1.15, .85, C.lime, .6]]
        .forEach(([x, y, c, s], i) => mk('f' + i, x, y, (k) => { k.rotation.z = (i % 3 - 1) * .25; handprint(k, c, s); }));
      [[-.05, .3], [.12, .4], [.27, .34], [.42, .45], [.58, .39]].forEach(([x, y], i) => mk('paw' + i, x, y, (k) => { k.rotation.z = -.5; pawprint(k, C.coral, .9); }));
    });
    neighbourhoodCamera(S, cover, P6);

    // ---- the red rope in front of it (it comes up with the mural)
    let rope;
    S.plant(WALL.x, -.78, (g) => {
      rope = keep(g);
      const xs = [-1.55, 0, 1.55];
      for (const x of xs) { cyl(rope, x, .02, 0, .12, .12, .03, C.gold, 14); cyl(rope, x, .32, 0, .025, .025, .6, C.gold, 8); ball(rope, x, .64, 0, .05, C.gold, 1); }
      for (let i = 0; i < 2; i++) { const a = xs[i], b = xs[i + 1], pts = []; for (let j = 0; j <= 6; j++) { const u = j / 6; pts.push([a + (b - a) * u, .58 - Math.sin(Math.PI * u) * .18]); } for (let j = 0; j < 6; j++) beam(rope, [pts[j][0], pts[j][1], 0], [pts[j + 1][0], pts[j + 1][1], 0], .03, C.red, 6); }
      rope.visible = false;
    });

    // ---- the ladder, a bird on it, the buckets with the step board and the brush
    let bird, wing;
    S.plant(-4.87, -1.16, (g) => {
      tab(g, .5);
      for (const sx of [-1, 1]) beam(g, [sx * .19, 0, .2], [sx * .17, 2.0, -.26], .03, C.wood, 5);
      for (let i = 1; i < 8; i++) { const u = i / 8; beam(g, [-.18, u * 2.0, .2 - u * .46], [.18, u * 2.0, .2 - u * .46], .018, C.wood, 4); }
      bird = keep(g, .02, 1.98, -.2);
      bird.scale.setScalar(1.22);
      poly(bird, [[-.11, .02], [.07, 0], [.14, .07], [.08, .12], [-.04, .1]], .05, '#7fb1bb', 0, 0, -.025);
      poly(bird, [[.13, .08], [.2, .07], [.13, .05]], .03, C.gold, 0, 0, -.015); disc(bird, .085, .09, .028, .013, C.ink, .008, 8);
      wing = keep(bird, -.02, .08, .03); poly(wing, [[-.1, 0], [.05, 0], [-.13, .09]], .02, '#5f86a8', 0, 0, 0);
    });
    S.pad(bird,.19,[.008,.075,.02]);
    S.discovery(bird,{id:'bird',label:'壁畫旁的小燕子',aim:[.008,.075,.02],duration:1.25,sound:'wing-flit',draw(u,visit,reduced){
      const travel=visit%2?u:1-u, arc=Math.sin(Math.PI*u);
      bird.position.set(.02+1.01*travel,1.98+.51*travel+(reduced ? .025 : .43)*arc,-.20-.19*travel);
      bird.scale.x=visit%2?1.22:-1.22;
      wing.rotation.z=Math.sin(u*Math.PI*8)*(reduced ? .09 : .73)*arc;
    }});
    let plank, pail, drop, pencil;
    const blots=[];
    S.plant(-4.2, -.3, (g) => {
      tab(g, 1.0);
      for (const sx of [-1, 1]) { cyl(g, sx * .3, .16, 0, .14, .12, .32, C.steel, 12); cyl(g, sx * .3, .3, 0, .145, .145, .03, '#7d9196', 12); }
      plank = cratePlank(g, 0, .345, 0, { len: .95, h: .3, thick: .05 }); plank.rotation.x = -Math.PI / 2;
      S.pad(plank,.145,[0,0,.055]);
      pencil=keep(g,0,.26,.17);
      beam(pencil,[-.28,0,0],[.14,0,0],.024,C.gold,6);
      beam(pencil,[.14,0,0],[.2,0,0],.014,C.ink,5);
      pail=keep(g,.17,0,.36);
      cyl(pail,0,.17,0,.19,.145,.34,'#e0dcc7',14);
      cyl(pail,0,.339,0,.18,.18,.016,C.coral,14);
      poly(pail,[[-.055,0],[.03,0],[.025,-.11],[0,-.16],[-.036,-.108]],.013,C.coral,.04,.33,.176);
      drop=keep(pail,.04,.16,.195); ball(drop,0,0,0,.044,C.coral,1);
      box(pail,0,.012,.24,.42,.018,.24,'#e9dabc');
      for(const [x,z,r] of [[.044,.21,.071],[.11,.28,.055],[-.033,.27,.055]]) {
        const dot=keep(pail,x,.025,z);
        cyl(dot,0,0,0,r,r,.008,C.coral,12); dot.visible=false; blots.push(dot);
      }
      S.pad(pail,.18,[0,.16,0]); swallowsProof(S,g);
    });
    paperMechanism(S,plank,{id:'plank',label:'架在漆桶上的踏板',sound:'wood-creak',duration:.65},u=>{
      plank.rotation.y=.25*u; plank.position.y=.345+.11*u;
      pencil.position.z=.10+.23*u;
    });
    S.discovery(pail,{id:'drip',label:'桶沿的一滴油漆',duration:.92,draw(u,visit){
      const idx=(visit-1)%blots.length, dot=blots[idx], fall=foldTravel(u,.17,.42);
      drop.visible=u<.42||u>.76;
      const born=foldTravel(u,.76,1);
      drop.scale.setScalar(u>.76?Math.max(.01,born):1);
      drop.position.set(.04+(dot.position.x-.04)*fall,.16-.13*fall,.195+(dot.position.z-.195)*fall);
      if(u>.76) drop.position.set(.04,.16,.195);
      blots.forEach((blot,i)=>{
        blot.visible=i<idx||(i===idx&&u>=.42);
        const wet=i===idx?foldTravel(u,.4,.72):1;
        blot.scale.set(Math.max(.001,wet),1,Math.max(.001,wet*.78));
      });
      if(u>.41&&u<1&&dot.userData.hit!==visit){dot.userData.hit=visit;S.sound('handprint',dot);}
    },reset:()=>blots.forEach(b=>{delete b.userData.hit;})});

    // ---- the cat that has stepped in paint
    let cat; const paws = [];
    S.plant(.85, -1.15, (g) => {
      cat = keep(g, 0, 0, 0);
      const b = ball(cat, 0, .13, 0, .13, C.ink, 1); b.scale.set(1, .95, .6);
      ball(cat, 0, .32, .02, .1, C.ink, 1).scale.z = .7;
      for (const sx of [-1, 1]) { cone(cat, sx * .06, .43, .02, .035, .08, C.ink, 4); disc(cat, sx * .035, .34, .09, .014, C.gold, .008, 8); disc(cat, sx * .06, .02, .07, .035, C.coral, .02, 10); }
      beam(cat, [.1, .05, -.04], [.22, .28, -.04], .02, C.ink, 4);
      S.pad(cat,.19,[0,.23,0]);
      for (let i = 0; i < 4; i++) { const k = keep(g, .12 + i * .17, .006, (i % 2) * .09 - .02); pawprint(k, C.coral, .8); k.rotation.x = -Math.PI / 2; k.rotation.z = -Math.PI / 2; k.visible = false; paws.push(k); }
    });
    S.curio(cat, { id: 'cat', label: '貓', tap: async () => {
      if (catBusy) return; catBusy = true; S.sound('rear-step');
      if (catAt === 0) { cat.scale.x = 1; S.to(cat.position, { x: .72 }, 1.0, 'inOut'); for (const k of paws) { await S.wait(.22); S.show(k, .2); } catAt = 1; }
      else { cat.scale.x = -1; await S.to(cat.position, { x: 0 }, 1.0, 'inOut'); cat.scale.x = 1; catAt = 0; }
      await S.wait(.2); catBusy = false;
    } });

    // ---- the dog whose tail goes into the paint
    let dog, tail, tip;
    S.plant(1.3, 1.85, (g) => {
      dog = keep(g);
      tab(dog, .5);
      box(dog, 0, .24, 0, .42, .16, .14, C.honey);
      for (const x of [-.15, .15]) for (const z of [-.04, .04]) box(dog, x, .09, z, .05, .18, .04, C.honey);
      box(dog, .25, .36, 0, .17, .15, .14, C.honey); box(dog, .35, .33, 0, .08, .07, .1, '#f0c98a'); disc(dog, .39, .35, .052, .02, C.ink, .02, 8);
      poly(dog, [[0, 0], [.05, 0], [.02, -.13]], .03, C.wood, .2, .43, .04); disc(dog, .27, .4, .075, .014, C.ink, .01, 8);
      tail = keep(dog, -.2, .3, 0); beam(tail, [0, 0, 0], [-.08, .16, 0], .022, C.honey, 5);
      tip = keep(tail, -.08, .16, 0); ball(tip, 0, 0, 0, .052, C.aqua, 1); tip.visible = false;
      cyl(dog,-.30,.084,0,.154,.128,.138,'#9d9d88',12);
      cyl(dog,-.30,.154,0,.14,.14,.011,C.aqua,12);
      S.pad(dog,.22,[0,.23,0]);
    });
    S.discovery(dog,{id:'dog',label:'藍漆盤旁的小狗',duration:1.20,sound:'brush',draw(u,visit,reduced){
      const dip=Math.min(foldTravel(u,.03,.31),1-foldTravel(u,.41,.65));
      tip.visible=visit>1||u>=.29;
      tail.rotation.z=2.16*dip+Math.sin(foldTravel(u,.62,1)*Math.PI*3)*pulse(u,.59,1)*(reduced ? .10 : .57);
    }});

    // ---- the people: the painter, the painter, the child with painted hands, and (later) a grandmother with a mother and her baby
    let zhi, uncle, kid, gran, mom, baby, roller;
    const folk = S.plant(FOLK.x, FOLK.z, (g) => {
      uncle = S.person(g, { ...P(-3.04, -.06), s:1.28, kind: 'adult', coat: C.blue, hair: C.grey });
      poly(uncle.head, [[-.22, .3], [.22, .3], [.02, .62]], .03, WHITE, 0, 0, .04); box(uncle.head, 0, .32, .06, .46, .05, .02, C.coral);
      for (const [x, y, c] of [[-.07, .45, C.coral], [.06, .6, C.gold], [.09, .38, C.aqua]]) disc(uncle.inner, x, y, .04, .03, c, .01, 10);
      cyl(uncle.armL, 0, -.47, .06, .1, .085, .17, C.steel, 10); cyl(uncle.armL, 0, -.385, .06, .092, .092, .012, C.gold, 10); beam(uncle.armL, [-.09, -.39, .06], [0, -.3, .06], .008, C.dark, 3); beam(uncle.armL, [0, -.3, .06], [.09, -.39, .06], .008, C.dark, 3);
      kid = S.person(g, { ...P(-.85, 1.45), s:1.54, kind: 'kid', coat: C.gold, hair: C.bark });
      ball(kid.armL, 0, -.36, .03, .062, C.coral, 1); ball(kid.armR, 0, -.36, .03, .062, C.aqua, 1);
      for (const [x, y, c] of [[-.08, .5, C.coral], [.07, .64, C.aqua], [.05, .4, C.lime]]) disc(kid.inner, x, y, .04, .028, c, .01, 10);
      zhi = S.robot(g, { species: 'magpie', ...P(-1.77, .59), s: 1.55, lights: S.index - 1 });
      roller = keep(zhi.root, .3, .3, .06);
      beam(roller, [0, 0, 0], [0, 1.0, -.32], .02, C.wood, 5); const r = cyl(roller, 0, 1.04, -.34, .075, .075, .5, C.coral, 12); r.rotation.z = Math.PI / 2;
      gran = S.person(g, { ...P(5.9, -.7), s:1.20, kind: 'elder', species: 'civet', coat: C.plum }); gran.root.visible = false;
      mom = S.person(g, { ...P(6.4, -.45), s:1.18, kind: 'adult', coat: C.teal, hair: C.deep }); mom.root.visible = false;
      baby = keep(mom.inner, 0, .5, .08);
      const bb = ball(baby, 0, 0, 0, .11, C.pink, 1); bb.scale.set(1, .8, .5);
      for(const side of [-1,1]) disc(baby,side*.048,.154,.030,.026,'#ba9876',.014,9);
      disc(baby,0,.103,.034,.064,'#b18d6b',.020,14); disc(baby,0,.085,.050,.027,'#e2c8a4',.008,10);
      for (const sx of [-1, 1]) disc(baby, sx * .022, .11, .042, .009, C.ink, .006, 6);
    });
    const cp=(p,id,label,gesture)=>{const c=S.curio(p.root,{id,label,quiet:true,tap:gesture});p.propId=c.id;};
    cp(uncle,'uncle','油漆行阿伯',()=>{uncle.wave(.8);S.sound('lid');});
    cp(gran,'gran','阿梅姨',()=>gran.wave(1));
    cp(mom,'mom','抱著寶寶的媽媽',()=>{mom.cheer();S.wiggle(baby,.22);});
    S.hero(zhi, { label: '握著滾筒的藍鵲畫師小靛', ready: () => st.phase === 'ready', go });

    // ---- the note-taking owl, on the way in from the market
    let ce;
    S.plant(3.04, 1.17, (g) => { ce = S.person(g, { s: 1.36, kind: 'ce', coat: C.navy }); });
    cp(ce,'ce','幫忙認路的鄰居',()=>{ce.wave(1);S.sound('paper');});

    // ---- the story
    const hide2 = (on) => { for (const a of [kid.armL, kid.armR]) S.to(a.rotation, { x: on ? 1.05 : 0 }, .35, 'inOut'); };
    async function go() {
      if (st.phase !== 'ready') return; S.set({ phase: 'busy' });
      uncle.still(); kid.still(); zhi.cheer(); S.sound('whoosh');
      S.wiggle(roller, .17);
      await S.walk(zhi, P(-4.45, -1.12), .8); zhi.still();
      // three seconds: the whole mural, rolled on from left to right
      painting = true; zhi.root.scale.x = Math.abs(zhi.root.scale.x);
      await S.to(zhi.root.position, { x: P(-.55, 0).x }, 2.6, 'lin');
      painting = false; cover.visible = false; S.hide(roller, .25); S.sound('done');
      zhi.cheer(); uncle.cheer();
      // The three shop copies stay visible while the newly painted main wall joins them.
      await followTheCopies();
      await S.wait(.2); S.show(rope, .4); S.sound('stamp');
      // passers-by stop and look up: everybody has seen it
      gran.root.visible = true; mom.root.visible = true;
      S.walk(gran, P(1.6, -.6), 1.5); await S.walk(mom, P(2.45, -.4), 1.6);
      gran.wave(1.6); mom.hop(); ce.wave(1.2);
      S.walk(zhi, P(-1.75, .5), .7);
      await S.wait(.9); zhi.still(); uncle.still();
      // …but the child with painted hands hides them and steps back
      hide2(true); kid.doubt(); S.sound('soft'); S.emote(kid, '…', 2.6, C.ink);
      await S.to(kid.root.position, { z: kid.root.position.z + .3 }, .5, 'inOut');
      ce.doubt();
      await S.wait(.4);
      S.set({ phase: 'touch' }); S.hint(kid.root, [0, .5, 0], '帶他去按一下');
    }
    async function press(p, ids, lift) {
      p.still(); p.cheer(); await S.wait(.3);
      for (const id of ids) {
        const mark=P6[id]; mark.visible=true; mark.scale.set(.80,.82,1);
        S.to(mark.scale,{x:1,y:1,z:1},.22,'out'); S.sound('handprint',mark); await S.wait(.25);
      }
      await S.wait(lift || .15); p.still();
    }
    async function touch(byHand) {
      if (st.phase !== 'touch' || st.busy) return; st.busy = true; S.hint(null); S.refresh();
      ce.still(); kid.still();
      S.hide(rope, .3); S.sound('whoosh');
      const spot = P(-2.2, -1.22);
      if (byHand) { kid.root.scale.x = Math.abs(kid.root.scale.x); await S.to(kid.root.position, { x: spot.x, y: 0, z: spot.z }, .35, 'out'); }
      else await S.walk(kid, spot, .9);
      hide2(false); await S.wait(.3);
      await press(kid, ['kidL', 'kidR'], .3); kid.hop();
      // then everybody else
      S.walk(uncle, P(-2.8, -1.22), .7); S.walk(zhi, P(-3.45, -1.15), .9); S.walk(gran, P(-1.55, -1.22), 1.1); S.walk(mom, P(-.95, -1.2), 1.2);
      await S.wait(.75); press(uncle, ['uncle']); await S.wait(.3); await press(zhi, ['zhi']);
      // The cat leaves its own wet paw marks, keeping pace with the trail along the wall.
      const catSeat = cat.position.clone();
      const firstPaw = S.local(cat.parent, S.world(P6.paw0, [0, 0, .15]));
      S.to(cat.position, { x: firstPaw.x, z: firstPaw.z }, .46, 'inOut');
      await S.to(cat.position, { y: firstPaw.y + .24 }, .23, 'out');
      await S.to(cat.position, { y: firstPaw.y }, .23, 'in');
      for (let i = 0; i < 5; i++) {
        const mark = P6['paw' + i];
        const at = S.local(cat.parent, S.world(mark, [0, -.016, .15]));
        await S.to(cat.position, { x: at.x, y: at.y, z: at.z }, .11, 'inOut');
        S.show(mark, .18);
        if (i === 0 || i === 4) S.sound('handprint');
      }
      S.to(cat.position, { x: catSeat.x, y: catSeat.y, z: catSeat.z }, .6, 'inOut');
      for (let i = 0; i < 6; i++) { S.show(P6['f' + i], .3); await S.wait(.11); }
      await press(gran, ['gran']); await press(mom, ['mom']);
      await S.to(baby.position, { x: .28, y: .95 }, .4, 'back'); await press(mom, ['baby'], .3);
      await S.to(baby.position, { x: 0, y: .5 }, .4, 'inOut');
      // everyone steps back to look at it together
      for (const [p, x, z] of [[kid,-2.05,.25],[uncle,-3.13,-.40],[zhi,-4.08,-.89],[gran,-.97,.04],[mom,.12,-.35]]) S.walk(p,P(x,z),.7);
      await S.wait(.8);
      for (const id of ['gran', 'mom', 'baby']) S.pop(P6[id], 1.35);
      kid.cheer(); uncle.wave(2); gran.wave(2); mom.hop(); ce.cheer();
      S.learn(zhi); zhi.cheer();
      await S.wait(1);
      S.set({ phase: 'done' }); S.done();
    }
    S.carry(kid.root, { id: 'kid', label: '小孩', pad: .3, padAt: [0, .5, 0],
      tap: () => { if (st.phase === 'touch') touch(false); else kid.hop(); },
      targets: () => (st.phase !== 'touch' || st.busy ? [] : [-1.4, 0, 1.4].map((x) => ({ at: () => S.world(wallP.art, [x, .9, .1]), r: 125, drop: () => touch(true) }))) });
    S.onReadyLoop((phase) => {
      // A paint-covered paw hovers before the blank wall. The child withdraws without leaving a print.
      const reach = pulse(phase, .1, .83);
      kid.root.position.x -= .18 * reach; kid.root.position.z -= .22 * reach;
      kid.armL.rotation.z -= 1.19 * reach; kid.armR.rotation.z += .98 * reach;
      uncle.head.rotation.y += .32 * pulse(phase, .43, .95);
    }, 5.2, [kid.root, kid.armL, kid.armR, uncle.head]);
    S.act('go', go); S.act('touch', () => touch(false));
    S.on('reset', () => { painting = false; catAt = 0; catBusy = false; });
    S.on('enter', async () => {
      uncle.doubt(); await S.wait(.5);
      kid.cheer(); S.sound('pop'); await S.wait(.7);
      zhi.hop(); zhi.wave(1.2); await S.wait(.5);
      S.set({ phase: 'ready' });
    });
    S.ui(() => storyPanel(st, {
      opening: '畫材舖、拱門、麵包舖都掛了紅風箏海報。小靛還想把它畫滿入口的白牆。',
      start: '滾出一幅壁畫',
      checkpoint: '街上已有四幅一樣的紅風箏。孩子兩手沾了顏料，卻只能在紅繩外看。',
      action: '帶孩子按個手印',
      ending: '三張海報還是一樣。下次路過，孩子記得的是入口那面牆：「看，這是我的手印！」',
    }));

    S.tick((t, dt) => {
      if (!S.stage.still.matches) rays.rotation.z += dt * .05;
      tail.rotation.z = S.stage.still.matches ? 0 : Math.sin(t * 3) * .12;
      if (painting) {
        const x = S.world(roller,[0,1.04,-.34]).x, L = WALL.x - MW * K / 2, u = Math.min(1, Math.max(0, (x - L) / (MW * K)));
        cover.scale.x = Math.max(.001, 1 - u);
        roller.position.y = .3 + Math.sin(t * 13) * .28; roller.rotation.x = Math.sin(t * 13) * .08;
      }
    });
  },
};
