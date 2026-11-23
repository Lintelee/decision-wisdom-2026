// Optional paper mechanisms for the harbour, field and rainy street.
import { keep, box, cyl, cone, ball, disc, ring, beam, poly, tri, quad, tab } from '../paper.js';

const INK = '#263f4c', BRASS = '#d7a453', CREAM = '#fff0cf', VERDIGRIS = '#548d83';
const TAU = Math.PI * 2;
const paperFold = (g, outline, color, z = 0) => poly(g, outline, .018, color, 0, 0, z);

// A page can turn while a mechanism is open. The kit restores the model from its snapshot on return.
function discover(S, node, id, label, run, aim) {
  let playing = false;
  S.on('reset', () => { playing = false; });
  S.curio(node, { id, label, aim, quiet:true, tap: async () => {
    if (playing) return;
    playing = true;
    try { await run(); } finally { playing = false; }
  } });
}

// A real punched aperture lets the bench show through even with the flat paper renderer.
export function ticketPress(S, bench) {
  const T = S.T, ticket = keep(bench, -.43, .39, .14);
  ticket.name='渡輪驗票紙券';
  ticket.rotation.x = -1.19;
  const face = new T.MeshLambertMaterial({color:'#f4d696'});
  const slots = [-.17, 0, .17], slips = slots.concat(null).map((_, count) => {
    const outline = new T.Shape();
    const corners = [[-.34,-.145],[.34,-.145],[.34,-.042],[.309,0],[.34,.042],[.34,.145],[-.34,.145],[-.34,.042],[-.31,0],[-.34,-.042]];
    corners.forEach(([x,y], i) => i ? outline.lineTo(x,y) : outline.moveTo(x,y)); outline.closePath();
    for(const x of slots.slice(0,count)) {
      const hole = new T.Path(); hole.absarc(x,-.064,.043,0,TAU,true); outline.holes.push(hole);
    }
    const layer=keep(ticket), mesh = new T.Mesh(new T.ExtrudeGeometry(outline,{depth:.021,bevelEnabled:false,curveSegments:6}),face);
    layer.name='船票・'+count+'孔';layer.add(mesh); layer.visible=count===0; return layer;
  });
  // A condensed ferry pictogram and printed inspection rings stay with the ticket.
  poly(ticket,[[-.25,.052],[.006,.052],[-.031,.006],[-.205,.006]],.005,INK,0,0,.024);
  box(ticket,-.13,.077,.026,.12,.047,.01,INK);
  for(const x of [.09,.135,.21,.246]) box(ticket,x,.077,.025,.012,.059,.01,VERDIGRIS);
  for(const x of slots) ring(ticket,x,-.064,.025,.055,.006,'#ac7448',12);
  const press = keep(bench,.56,.383,.145);
  box(press,0,.024,0,.35,.047,.36,'#507a73');
  beam(press,[.12,.06,.03],[.12,.34,.018],.034,INK,6);
  const lever = keep(press,.115,.33,0);
  beam(lever,[0,0,0],[-.19,.09,.02],.027,BRASS,6);
  box(lever,-.21,.09,.02,.103,.048,.068,'#9d5c44');
  beam(lever,[-.118,.05,0],[-.118,-.098,.012],.025,INK,6);
  disc(press,.117,.328,.028,.041,CREAM,.015,10);
  let struck=0;
  S.pad(bench,.21,[0,.49,.095]);
  S.pad(bench,.18,[-.43,.435,.12]);
  S.pad(bench,.18,[.56,.53,.15]);
  S.discovery(bench,{id:'ferry-ticket',label:'候船椅上的驗票夾與船票',aim:[-.14,.53,.13],duration:1.6,
    reset(){struck=0;},
    draw(u,visit,still) {
      const slot=(visit-1)%3, target=press.position.x+.103-slots[slot];
      const travel=T.MathUtils.smoothstep(u,.02,.31)*(1-T.MathUtils.smoothstep(u,.65,1));
      ticket.position.set(-.43+(target+.43)*travel,.39+.21*travel,.14-.037*travel);
      ticket.rotation.x=-1.19+(still ? .39 : .56)*travel;
      const clamp=T.MathUtils.smoothstep(u,.31,.45)*(1-T.MathUtils.smoothstep(u,.50,.64));
      lever.rotation.z=.79*clamp;
      slips.forEach((sheet,i)=>{sheet.visible=i===(u<.44?slot:slot+1);});
      if(u>=.44 && struck!==visit){struck=visit;S.sound('ticket-punch');}
    }});
}

function horizontalRing(g, x, y, z, radius, tube, color, sides = 16) {
  ring(g, x, y, z, radius, tube, color, sides).rotation.x = Math.PI / 2;
}

export function harbourMechanisms(S) {
  // The striped harbour light. Its clockwork lens sweeps once across the water.
  S.plant(-4.87, -2.62, (g) => {
    const tower = keep(g);
    tab(tower, 1.05);
    cyl(tower, 0, .08, 0, .47, .55, .16, '#728387', 8);
    cyl(tower, 0, .49, 0, .225, .33, .75, CREAM, 8);
    cyl(tower, 0, .75, 0, .232, .267, .26, '#bb563f', 8);
    cyl(tower, 0, .97, 0, .207, .236, .24, CREAM, 8);
    box(tower, 0, .33, .284, .117, .31, .035, INK);
    disc(tower, 0, .78, .239, .055, BRASS, .016, 12);
    disc(tower, 0, .78, .249, .03, INK, .015, 12);
    cyl(tower, 0, 1.12, 0, .315, .28, .075, INK, 10);
    horizontalRing(tower, 0, 1.29, 0, .305, .014, INK);
    for (let i = 0; i < 8; i++) {
      const a = TAU * i / 8, x = Math.sin(a), z = Math.cos(a);
      beam(tower, [x * .302, 1.14, z * .302], [x * .302, 1.29, z * .302], .011, INK, 4);
      if (i % 2) beam(tower, [x * .215, 1.15, z * .215], [x * .215, 1.59, z * .215], .025, INK, 4);
    }
    const lens = keep(tower, 0, 1.38, 0);
    ball(lens, 0, 0, 0, .14, '#f3c14e', 1);
    for (let i = -1; i <= 1; i++) horizontalRing(lens, 0, i * .05, 0, .14 - Math.abs(i) * .022, .008, CREAM);
    const shafts = keep(lens, .12, 0, 0);
    paperFold(shafts, [[0, .025], [1.12, .12], [1.3, .07], [.14, 0]], '#ffe5a6');
    paperFold(shafts, [[.09, -.035], [.94, -.12], [1.05, -.15], [.05, -.07]], '#eeb760', .01);
    shafts.visible = false;
    cone(tower, 0, 1.68, 0, .31, .2, '#a6493a', 8);
    beam(tower, [0, 1.73, 0], [0, 1.92, 0], .017, INK, 5);
    ball(tower, 0, 1.94, 0, .036, BRASS);
    discover(S, tower, 'harbour-lens', '港口引航燈', async () => {
      S.sound('wheel');
      shafts.visible = true;
      lens.rotation.y = -.45;
      const isStill = S.stage.still.matches;
      await S.to(lens.rotation, { y: isStill ? .65 : TAU + .65 }, isStill ? .4 : 1.55, 'inOut');
      await S.wait(.26);
      shafts.visible = false;
    });
  }, { s: 1.14 });

  // A copper kettle on a peat stove tips into a tasting cup. The thin amber stream is a hinged paper strip.
  S.plant(3.36, 1.95, (g) => {
    const stove = keep(g);
    tab(stove, .95);
    cyl(stove, -.12, .17, 0, .245, .21, .32, '#315956', 8);
    cyl(stove, -.12, .32, 0, .26, .245, .045, INK, 8);
    for (let i = 0; i < 3; i++) box(stove, -.205 + i * .08, .18, .205, .039, .11, .018, '#e7a355');
    const pot = keep(stove, -.12, .34, 0);
    cyl(pot, 0, .15, 0, .225, .19, .28, '#b9764b', 10);
    cyl(pot, 0, .292, 0, .16, .23, .065, '#db9b5d', 10);
    cyl(pot, 0, .34, 0, .115, .18, .055, '#b66d43', 10);
    ball(pot, 0, .385, 0, .04, INK, 1);
    const arch = [[-.18, .26], [-.21, .47], [-.12, .60], [.06, .63], [.16, .50], [.155, .32]];
    for (let i = 1; i < arch.length; i++) beam(pot, [...arch[i - 1], 0], [...arch[i], 0], .025, INK, 6);
    paperFold(pot, [[.14, .13], [.32, .17], [.44, .35], [.36, .35], [.27, .24], [.15, .25]], '#c98b52');
    paperFold(pot, [[.29, .20], [.43, .347], [.37, .34]], '#f0c78d', .024);
    for (const y of [.093, .22]) horizontalRing(pot, 0, y, 0, .21, .009, BRASS, 10);
    const stream = keep(stove, .34, .53, .02);
    paperFold(stream, [[-.012, 0], [.014, 0], [.075, -.15], [.085, -.30], [.052, -.30], [.045, -.15]], '#e7a54e');
    stream.visible = false;
    cyl(stove, .42, .06, .04, .13, .13, .025, VERDIGRIS, 12);
    cyl(stove, .42, .139, .04, .091, .061, .13, CREAM, 10);
    const tea = ['#784829','#ab7438','#d0a448'].map(ink=>{
      const inkCup=keep(stove,.42,.211,.04);
      cyl(inkCup,0,0,0,.085,.082,.016,ink,12); inkCup.visible=false; return inkCup;
    });
    const steam=keep(stove,.42,.27,.04);steam.visible=false;
    for(const [x,h] of [[-.053,.27],[.056,.18]]) {
      paperFold(steam,[[x,0],[x-.043,h*.32],[x+.024,h*.66],[x+.009,h],[x+.045,h*.68],[x-.018,h*.32],[x+.015,0]],'#efe6c8');
    }
    let poured=0;
    S.discovery(stove,{id:'tea-kettle',label:'銅水壺與三種濃淡的試茶杯',aim:[.05,.46,0],duration:1.65,
      reset(){poured=0;},
      draw(u,visit){
        const tilt=S.T.MathUtils.smoothstep(u,.02,.27)*(1-S.T.MathUtils.smoothstep(u,.68,.93));
        pot.rotation.z=-.48*tilt;stream.visible=u>=.24&&u<.70;
        stream.scale.y=.08+.92*S.T.MathUtils.smoothstep(u,.24,.39);
        tea.forEach((cup,i)=>{cup.visible=i===(visit-1)%3&&u>=.37;cup.scale.setScalar(.12+.88*S.T.MathUtils.smoothstep(u,.37,.61));});
        steam.visible=u>=.5;steam.scale.y=.3+.7*S.T.MathUtils.smoothstep(u,.50,.86);
        if(u>=.28&&poured!==visit){poured=visit;S.sound('pour');}
      }});
  }, { s: 1.19 });
}

function littleFish(g, color, fin) {
  const nose = [.28, .01, .015], top = [.02, .145, .015], tail = [-.21, .015, .015];
  const belly = [-.005, -.105, .015], ridge = [.04, .012, .10];
  tri(g, nose, top, ridge, color); tri(g, top, tail, ridge, color); tri(g, tail, belly, ridge, fin);
  tri(g, belly, nose, ridge, '#eee6cb');
  poly(g, [[-.18, .018], [-.32, .125], [-.29, .006], [-.33, -.085]], .026, fin);
  paperFold(g, [[-.026, .118], [-.13, .224], [-.15, .115]], fin);
  disc(g, .18, .032, .061, .023, INK, .014, 8);
  disc(g, .184, .036, .073, .006, CREAM, .006, 6);
  for (let i = 0; i < 3; i++) beam(g, [-.09 + i * .055, .068, .06], [-.07 + i * .055, .013, .087], .005, CREAM, 4);
}

export function studioMechanisms(S) {
  // The studio's drying line: the blank backs tip over to reveal three contact prints from the harbour.
  S.plant(-4.33, -1.7, (g) => {
    const line = keep(g), prints = [];
    for (const x of [-.77, .77]) {
      beam(line, [x, .01, 0], [x, 1.27, 0], .03, '#6b5140', 5);
      box(line, x, .028, 0, .22, .056, .28, '#967a55');
      ball(line, x, 1.28, 0, .045, BRASS, 0);
    }
    const cord = [[-.77, 1.21], [-.43, 1.14], [0, 1.105], [.43, 1.14], [.77, 1.21]];
    for (let i = 1; i < cord.length; i++) beam(line, [...cord[i - 1], 0], [...cord[i], 0], .013, INK, 5);
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * .445, y = 1.107 + .035 * Math.abs(i - 1);
      const photo = keep(line, x, y, .018); photo.rotation.z = (i - 1) * .08;
      box(photo, 0, -.26, 0, .365, .5, .022, CREAM);
      box(photo, 0, -.24, -.014, .304, .353, .01, ['#607c7b','#5e737d','#7e715d'][i]);
      // Illustration faces -z. At rest the reader sees the warm, stamped back of the print.
      for (const x of [-.11, -.01, .09]) box(photo, x, -.38, .016, .052, .009, .005, '#c7b395');
      box(photo, 0, -.02, .034, .055, .116, .04, BRASS);
      if (i === 0) {
        poly(photo, [[-.12, -.26], [.12, -.26], [.08, -.31], [-.08, -.31]], .008, CREAM, 0, 0, -.028);
        poly(photo, [[-.07, -.24], [.03, -.24], [.03, -.13]], .008, '#d8b475', 0, 0, -.03);
      } else if (i === 1) {
        for (const sx of [-1, 1]) beam(photo, [0, -.26, -.03], [sx * .11, -.17, -.03], .014, CREAM, 4);
      } else {
        disc(photo, 0, -.17, -.029, .055, '#d6ac6e', .008, 12);
        for (let j = 0; j < 3; j++) box(photo, -.02 + (j % 2) * .035, -.26 - j * .033, -.031, .17 - j * .027, .009, .008, CREAM);
      }
      prints.push(photo);
    }
    let front = false;
    S.on('reset', () => { front = false; });
    discover(S, line, 'contact-line', '港邊相片晾曬架', async () => {
      front = !front;
      S.sound('paper');
      await Promise.all(prints.map((photo, i) => S.to(photo.rotation, { y: front ? Math.PI : 0 }, .55, 'inOut', i * .12)));
      S.sound('clip');
    });
  });

  // In today's wicker landing basket, the flying fish opens its two paper wings and jumps.
  S.plant(4.13, .58, (g) => {
    const hamper = keep(g);
    const basket = cyl(hamper, 0, .245, 0, .40, .29, .4, '#a6784f', 10); basket.scale.z = .83;
    for (const [y, r] of [[.075,.309],[.18,.34],[.3,.37],[.447,.408]]) {
      const hoop = ring(hamper, 0, y, 0, r, y > .4 ? .021 : .011, '#e3bd83', 10);
      hoop.rotation.x = Math.PI / 2; hoop.scale.y = .83;
    }
    for (let i = 0; i < 10; i++) {
      const a = i * TAU / 10, b = a + .12;
      beam(hamper, [.30 * Math.sin(a), .07, .246 * Math.cos(a)], [.40 * Math.sin(b), .43, .327 * Math.cos(b)], .01, '#dbc193', 4);
    }
    const ice = cyl(hamper, 0, .45, 0, .387, .38, .024, '#c4d9d4', 10); ice.scale.z = .82;
    for (const [x,z] of [[-.18,.06],[.14,-.1],[.23,.09]]) { const shard=ball(hamper,x,.47,z,.075,'#e6f0df',0); shard.scale.y=.6; }
    const fish = keep(hamper, 0, .52, 0);
    littleFish(fish, '#5d8990', '#9cc1bd');
    const fins = [-1, 1].map((side) => {
      const hinge = keep(fish, .055, .028, side * .052);
      tri(hinge, [.04, 0, 0], [-.26, .05, side * .245], [-.13, -.015, side * .33], side > 0 ? '#d3c7a8' : '#9cb9b3');
      tri(hinge, [.04, 0, 0], [-.13, -.015, side * .33], [-.01, -.02, side * .18], '#e8dfb9');
      hinge.scale.z = .2; return hinge;
    });
    discover(S, hamper, 'flying-fish', '漁夫今天捕的飛魚', async () => {
      S.sound('cloth');
      for (const fin of fins) S.to(fin.scale, { z: 1 }, .25);
      S.to(fish.rotation, { z: .48 }, .28);
      await S.to(fish.position, { x: .15, y: 1.10, z: .07 }, .36, 'out');
      await S.wait(.2);
      S.to(fish.rotation, { z: 0 }, .38);
      await S.to(fish.position, { x: 0, y: .52, z: 0 }, .39, 'in');
      fins.forEach((fin) => S.to(fin.scale, { z: .2 }, .2));
      S.sound('rain-drop');
    });
  }, { s: 1.18 });
}

export function stadiumMechanisms(S) {
  // A surveyor's open reel pays a ruled tape across the field, then winds back on the next tap.
  S.plant(-3.73, 2.08, (g) => {
    const measure = keep(g);
    const tape = keep(measure, .09, .062, .16);
    box(tape, .81, 0, 0, 1.62, .012, .15, '#f4cf7a');
    for (let i = 0; i < 16; i++) box(tape, .06 + i * .1, .009, -.036, .012, .008, i % 5 === 0 ? .087 : .044, INK);
    box(tape, 1.60, .012, 0, .038, .023, .16, BRASS);
    tape.scale.x = .1;
    for (const z of [-.10,.10]) {
      poly(measure, [[-.37,.02],[.3,.02],[.13,.6],[-.10,.64]], .027, '#8e5b3b', 0,0,z);
      poly(measure, [[-.27,.045],[.23,.045],[.10,.42],[-.08,.46]], .016, '#ba8a51', 0,0,z+.03);
    }
    const spool = keep(measure, -.02, .37, .16);
    disc(spool, 0, 0, 0, .284, INK, .11, 20);
    ring(spool, 0, 0, .077, .237, .027, '#eba54c', 18);
    for (let i = 0; i < 5; i++) {
      const a = i * TAU / 5;
      beam(spool, [0,0,.072], [.22*Math.sin(a),.22*Math.cos(a),.072], .016, '#ce9256', 5);
    }
    disc(spool, 0, 0, .084, .058, BRASS, .04, 12);
    beam(spool, [0,0,.113], [.105,.105,.15], .018, CREAM, 6);
    disc(spool, .105, .105, .16, .035, '#b15c44', .054, 10);
    let extended = false;
    S.on('reset', () => { extended = false; });
    discover(S, measure, 'distance-reel', '田徑場的測距捲尺', async () => {
      extended = !extended;
      S.sound('wheel');
      await Promise.all([S.to(tape.scale, { x: extended ? 1 : .1 }, .75, 'inOut'),
        S.to(spool.rotation, { z: extended ? -Math.PI : 0 }, .75, 'inOut')]);
      S.sound('clip');
    });
  }, { s: 1.12 });

  // A collapsible, sewn windsock swings from brass bearings and unfolds into shape.
  S.plant(4.25, -2.44, (g) => {
    const post = keep(g);
    cyl(post, 0, .06, 0, .23,.29,.12, '#798d7e',8);
    beam(post,[0,.09,0],[0,2.03,0],.032,INK,6);
    ball(post,0,2.01,0,.057,BRASS,0);
    const vane = keep(post, 0, 1.98, 0);
    beam(vane,[0,0,0],[.21,.1,0],.018,BRASS,5);
    beam(vane,[.02,-.01,0],[.22,-.17,0],.014,BRASS,5);
    const sleeve = keep(vane,.24,-.024,0);
    for(let i=0; i<4; i++) {
      const radius=.142-i*.024, next=radius-.024, offset=i*.182;
      const swatch=i%2?'#f6e7c5':'#bf6047';
      for(let k=0;k<6;k++) {
        const a=k*TAU/6, b=(k+1)*TAU/6;
        const point=(x,r,t)=>[x,r*Math.cos(t),r*Math.sin(t)];
        quad(sleeve,point(offset,radius,a),point(offset+.183,next,a),point(offset+.183,next,b),point(offset,radius,b),swatch);
      }
    }
    const rim = ring(sleeve, 0, 0, 0, .144, .013, BRASS, 12); rim.rotation.y = Math.PI / 2;
    for (const side of [-1,1]) paperFold(sleeve, [[.71,side*.04],[.93,side*.045-.04],[.81,side*.012-.025],[.71,side*.018]], side>0?'#d8af60':'#e5d7ab',.01);
    sleeve.rotation.z = -.84; sleeve.scale.x=.75;
    S.pad(sleeve,.16,[.30,0,0]);
    discover(S, post, 'field-windsock', '擲標槍場的風向袋', async () => {
      S.sound('cloth');
      S.to(sleeve.scale,{x:1.06},.37); S.to(vane.rotation,{y:.30},.5);
      await S.to(sleeve.rotation,{z:.13},.44,'back');
      await S.wait(.48);
      S.to(vane.rotation,{y:0},.64,'inOut'); S.to(sleeve.scale,{x:.75},.58,'inOut');
      await S.to(sleeve.rotation,{z:-.84},.74,'inOut');
    }, [.40,1.80,0]);
  });
}

export function streetMechanisms(S) {
  // The gutter of a tiled arcade feeds three copper cups; a hydrangea opens where the water lands.
  S.plant(3.74, -2.10, (g) => {
    const facade = keep(g);
    tab(facade,1.6);
    box(facade,0,.84,-.16,1.53,1.62,.38,'#cfbda1');
    box(facade,0,.85,.05,1.29,1.45,.065,'#afab94');
    for (const x of [-.54,-.2,.16]) {
      box(facade,x,.68,.103,.26,.98,.03,'#4f726d');
      box(facade,x,.64,.128,.185,.71,.015,'#789087');
      for (let j=0;j<4;j++) box(facade,x,.42+j*.13,.143,.17,.017,.013,'#adc0a7');
      box(facade,x,1.21,.127,.234,.13,.022,'#d9bd86');
    }
    for (const x of [-.73,.73]) box(facade,x,.82,.072,.09,1.65,.18,'#dfc9a3');
    poly(facade,[[-.87,1.56],[.87,1.56],[.77,1.73],[-.79,1.73]],.61,'#547571',0,0,-.22);
    box(facade,0,1.56,.394,1.73,.056,.045,'#ac724e');
    for(let i=0;i<12;i++) beam(facade,[-.79+i*.143,1.71,-.21],[-.79+i*.143,1.63,.35],.021,'#86a298',5);
    box(facade,0,.065,.15,1.58,.13,.54,'#9e9987');
    const watering = keep(facade,.61,0,.42);
    beam(watering,[0,1.55,0],[0,.49,0],.012,BRASS,5);
    const drops=[];
    for (let i=0;i<3;i++) {
      const y=1.31-i*.286;
      cyl(watering,0,y,0,.111,.041,.113,'#b47c52',6);
      horizontalRing(watering,0,y+.058,0,.112,.009,BRASS,6);
      const d=keep(watering,0,y-.07,0);
      poly(d,[[-.034,0],[0,.077],[.035,0],[.022,-.032],[-.015,-.04]],.014,'#83bdc6');
      d.visible=false; drops.push(d);
    }
    const flowerbed = keep(watering, -.18, 0, .04);
    box(flowerbed,0,.2,0,.66,.22,.38,'#a66f53'); box(flowerbed,0,.314,0,.69,.035,.4,'#d69f75');
    cyl(flowerbed,-.08,.46,0,.016,.021,.28,'#647955',5);
    paperFold(flowerbed,[[-.08,.48],[-.27,.53],[-.34,.64],[-.16,.60]],'#60836b');
    paperFold(flowerbed,[[-.08,.49],[.07,.62],[.18,.63],[.09,.52]],'#82a17b',.021);
    const florets=keep(flowerbed,-.08,.6,0);
    [[-.105,.015],[0,.105],[.105,.015],[.04,-.062],[-.065,-.058]].forEach(([x,y],i)=>{
      const p=ball(florets,x,y,(i%2)*.045,.091,['#a7b4c3','#c3bed0','#a6abc3'][i%3],0);p.scale.z=.7;
    });
    florets.scale.setScalar(.48);
    S.pad(watering,.29,[0,1.04,0]);
    discover(S,watering,'rain-chain','屋簷的銅製雨鏈',async()=>{
      S.sound('tick');
      florets.scale.setScalar(.48);
      for (let i=0;i<3;i++) {
        const d=drops[i], y=1.24-i*.286;
        d.position.y=y; d.visible=true;
        await S.to(d.position,{y:y-.26},.16,'in'); d.visible=false;
      }
      S.sound('pop');
      await S.to(florets.scale,{x:1.25,y:1.25,z:1.25},.42,'back');
    });
  });

  // An origami boat floats on the gutter puddle; the moving hull sends two separate ripples to either bank.
  S.plant(-3.40, 2.05, (g) => {
    const whole = keep(g);
    const boat=keep(whole,-.11,.043,.08);
    const bow=[.48,.235,0], stern=[-.47,.25,0], keel=[.02,0,0], front=[.02,.14,.20], back=[.01,.15,-.19];
    tri(boat,bow,front,keel,'#bf654d'); tri(boat,stern,keel,front,'#e4b784');
    tri(boat,bow,keel,back,'#bb8a6a'); tri(boat,back,keel,stern,'#c4865b');
    tri(boat,bow,back,front,'#e9cba2'); tri(boat,stern,front,back,'#fbebca');
    tri(boat,[.22,.14,0],[-.22,.14,0],[.01,.42,0],'#f9e8c4');
    tri(boat,[.21,.15,.012],[.014,.18,.014],[.01,.42,.013],'#a4b8a2');
    const ripples=[];
    for(const i of [0,1]){
      const ripple=keep(whole,.15+i*.33,.017,0);
      const loop=ring(ripple,0,0,0,.23,.014,'#f0f1d9',18); loop.rotation.x=Math.PI/2; loop.scale.set(1,.62,1);
      ripple.visible=false; ripples.push(ripple);
    }
    discover(S,boat,'puddle-skiff','水窪裡的摺紙船',async()=>{
      S.sound('soft');
      await Promise.all([S.to(boat.position,{x:.37,z:0},.71,'inOut'),S.to(boat.rotation,{z:-.12,y:.30},.44,'inOut')]);
      for(const [i,r] of ripples.entries()){
        r.visible=true;r.scale.set(.14,1,.14);
        S.to(r.scale,{x:1.55,z:1.55},.45,'out',i*.12).then(()=>{r.visible=false;});
      }
      S.to(boat.rotation,{z:0,y:0},.52,'inOut');
      await S.to(boat.position,{x:-.11,z:.08},.66,'inOut');
    });
  });
}
