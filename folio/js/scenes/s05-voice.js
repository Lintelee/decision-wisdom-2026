// 第 5 頁｜臭豆腐攤｜孫韞筑〈討好演算法，還是打動人？〉p.66–71；莊閔雯、呂季霖〈GEO 時代〉p.168–175；吳宗霖〈在注意力被 AI 稀釋的時代…〉p.116–127
// 正午。夥計用一大堆花蓋住臭豆腐攤、猛噴香水，可是一縷臭味還是鑽出來，把旅人嚇得更遠。
// 讀者把花掀開：常客一手捏鼻子、一手比讚。夥計照著他的樣子學給旅人看，旅人笑了，也捏著鼻子坐下來吃。
import { storyPanel, pulse } from './reading-beats.js';
import { T, C, keep, group, box, cyl, cone, ball, disc, ring, beam, poly, card, quad, tab, cratePlank } from '../paper.js';
import { flowerTile, foldTravel, paperMechanism } from './market-craft.js';
import { fieldSun, fieldPress, issuePrint, pressPlate, wallHanger } from './market-atlas.js';

import { marketUpperStorey, pavedCutout, tofuLane } from './market-streetscape.js';

const DIARY = '吃過的人說臭也說香，我照著說。';
const STALL = { x: -1.93, z: -1.28 };
const STINK = ['#a9c94a', '#c3d94e', '#8fb85a'];
const BENCH = { x: -1.6, z: .5 };
const SEAT = -.11;                                     // how far a seated puppet sinks behind the bench
const TRAV = { z: 1.5, x0: 3.3, back: { x: 3.9, z: .35 }, front: { x: -2.15, z: -.55 }, seat: { x: -2.15, z: -1.18, y: SEAT } };
const COPY = { x: -1.39, z: -.32 };                    // where the stall helper stands to copy the regular, in its own plant
const FLOWER = [['#c67968','#e1a28b'],['#a84f44','#db8270'],['#d2a45a','#e8c789'],['#d8c8a5','#efe1c3'],['#ad676d','#cf9490'],['#cc8c74','#edb59a']];

/** a curly paper strip rising h: the smell */
function curl(g, h, col, w = .05, amp = .12, turns = 1.5) {
  const N = 18, L = [], R = [];
  for (let i = 0; i <= N; i++) { const u = i / N, x = Math.sin(u * Math.PI * 2 * turns) * amp * (1 - u * .3), y = u * h, ww = w * (1 - u * .55); L.push([x - ww / 2, y]); R.push([x + ww / 2, y]); }
  return poly(g, [...L, ...R.reverse()], .02, col, 0, 0, -.01);
}
/** a thumb on a puppet's right hand, so a raised arm reads as a thumbs-up */
function thumb(p, len, col, z) { box(p.armR, 0, len, z, .035, .09, .035, col); }
/** one hand pinching the nose, the other up with its thumb: the regular's verdict, and the stall helper's copy of it */
function verdict(p, robot) { p.armL.rotation.z = robot ? 2.45 : 2.6; p.armR.rotation.z = 2.75; if (robot) p.armL.position.z = .14; }   // the robot's arm comes out in front of its chest
function pinchOnly(p) { p.armL.rotation.z = 2.6; }

// From the lane, a pair of slatted shutters opens onto the neighbour eating
// behind them. The open window lets another ribbon of frying aroma through.
function neighbouringWindow(S) {
  S.plant(3.05, -2.59, (g) => {
    const shop = keep(g);
    marketUpperStorey(shop);
    const green = '#47736b', dark = '#305050', ivory = '#f1ddb6';
    tab(shop, 2.23);
    box(shop, 0, .78, -.07, 2.35, 1.56, .41, '#d6b78f');
    box(shop, 0, .57, .17, 2.35, .98, .05, '#b9996c');
    for (let i = 0; i < 6; i++) flowerTile(shop, -.94 + i * .375, .27, .22, .33, i % 2 ? green : ivory, i % 2 ? ivory : green);
    box(shop, 0, 1.03, .19, 1.88, .88, .055, dark);
    box(shop, 0, .58, .26, 2.04, .075, .25, C.bark);
    const eave = group(shop);
    eave.position.set(0, 1.62, .02);
    for (let i = 0; i < 12; i++) {
      const x = -1.24 + i * .207;
      quad(eave, [x,.08,-.28], [x+.207,.08,-.28], [x+.207,-.15,.52], [x,-.15,.52], i % 2 ? '#537f71' : '#65937f');
      box(eave, x + .104, -.165, .525, .207, .045, .037, i % 2 ? green : '#749480');
    }
    const guest = keep(shop, -.12, .37, .29);
    const diner = S.person(guest, { s: .84, kind: 'elder', coat: '#cc915d', prop: false });
    card(diner.inner, 0, .24, .05, .27, .34, ivory, .018);
    const dish = keep(guest, .21, .13, .14);
    cyl(dish, 0, .04, 0, .15, .09, .09, '#efe3c6', 12);
    cyl(dish, 0, .082, 0, .122, .122, .012, C.honey, 12);
    for (const dx of [0, .046]) beam(dish, [dx, .1, 0], [dx+.16,.33,-.04], .012, C.bark, 4);
    const shutters = [-1, 1].map((side) => {
      const leaf = keep(shop, side * .96, .60, .48);
      const mid = -side * .48;
      box(leaf, mid, .421, 0, .955, .842, .045, '#f4dcb2');
      box(leaf, mid, .42, .027, .85, .70, .025, green);
      for (let i = 0; i < 6; i++) box(leaf, mid, .147 + i * .108, .058, .79, .047, .035, i % 2 ? '#9fa785' : '#b4b699').rotation.x = -.24;
      box(leaf, -side * .85, .38, .075, .042, .13, .04, C.gold);
      return leaf;
    });
    const scent = keep(shop, -.59, .68, .42);
    curl(scent, .6, '#b0c778', .044, .1, 1.35);
    paperMechanism(S, shop, { id: 'market-shutters', label: '循著香味開窗', sound: 'wood-creak', duration: 1 }, (u) => {
      shutters.forEach((leaf, i) => { leaf.rotation.y = (i ? 1 : -1) * u * 1.78; });
      guest.position.y = .33 + .095 * foldTravel(u, .18, .85);
      scent.visible = u > .39;
      scent.scale.setScalar(Math.max(.01, foldTravel(u, .39, 1)));
    });
  }, { s:1.16, ry:-.12 });
}

function tastingParcel(S) {
  S.plant(-3.12, 2.02, (g) => {
    const parcel = keep(g);
    tab(parcel, .81);
    for (const x of [-.31, .31]) {
      beam(parcel, [x-.05,.01,.16], [x,.47,.14], .034, C.wood, 5);
      beam(parcel, [x+.05,.01,-.17], [x,.47,-.13], .034, C.bark, 5);
    }
    box(parcel, 0, .46, 0, .89, .07, .54, '#a66c45');
    box(parcel, 0, .51, 0, .80, .035, .48, C.edge);
    const bag = keep(parcel, 0, .53, 0);
    poly(bag, [[-.27,0],[.27,0],[.33,.35],[.22,.31],[.11,.35],[0,.31],[-.12,.35],[-.23,.31],[-.33,.35]], .18, '#bb8052', 0, 0, -.12);
    const front = keep(bag, 0, 0, .12);
    poly(front, [[-.27,0],[.27,0],[.33,.35],[.22,.31],[.11,.35],[0,.31],[-.12,.35],[-.23,.31],[-.33,.35]], .022, '#e9c58d');
    poly(front, [[-.27,.012],[0,.22],[.27,.012]], .007, '#d2a978', 0, 0, .023);
    disc(front, 0, .19, .03, .073, C.red, .012, 12);
    for (const side of [-1, 1]) {
      const fold = group(bag); fold.position.set(side * .27, .16, -.01);
      poly(fold, [[-.08,-.15],[.075,-.15],[.095,.19],[0,.13],[-.095,.19]], .018, '#ca9b63').rotation.y = Math.PI / 2;
    }
    const skewer = keep(bag, .015, .12, .02);
    beam(skewer, [0,.01,0], [.12,.61,0], .017, C.wood, 6);
    for (let i = 0; i < 2; i++) {
      const cube = group(skewer); cube.position.set(.055 + i * .035,.27 + i * .14,0); cube.rotation.set(.12,-.28,i ? -.13 : .2);
      box(cube, 0, 0, 0, .18, .15, .16, i ? '#d39545' : '#bf793d');
      box(cube, 0, .075, 0, .15, .012, .13, '#edc571');
      for (const [x,y] of [[-.045,.026],[.024,-.028],[.052,.028]]) disc(cube,x,y,.083,.012,'#975b35',.008,7);
    }
    for (const [x,z,col] of [[-.06,.02,C.leaf],[-.02,.07,'#a8b877'],[.07,.06,C.coral]]) {
      const ribbon = poly(skewer, [[0,0],[-.07,.09],[-.12,.18],[-.035,.14],[.025,.2],[.055,.12],[.03,.04]], .016, col, x, .17, z);
      ribbon.rotation.y = x * 7;
    }
    S.pad(parcel, .34, [0,.86,.05]);
    paperMechanism(S, parcel, { id: 'tasting-parcel', label: '掀開試吃紙包', sound: 'paper' }, (u) => {
      front.rotation.x = .96 * u;
      skewer.position.y = .015 + foldTravel(u,.12,1) * .33;
      skewer.rotation.z = -.27 * u;
    });
  }, { s: 1.14, ry: -.21 });
}

export default {
  id: 's05-voice', land: 'people', short: '照著說實話', calm: true,
  title: '什麼樣的顧客評價，能讓你的品牌進入 AI 的推薦名單？',
  sources: [{ n: 9 }, { n: 19 }, { n: 13 }],
  diary: DIARY,
  takeaway: 'AI 推薦誰，看的是用過的人具體怎麼說你，不是你自己怎麼說。別人替你說的話，會變成 AI 對下一個人說的話。',
  quote: { t: '一個沒被討論、或被討論錯了的品牌，在消費者問 AI 的那一刻，等於隱形。', n: 9, page: 67 },
  // One sentence from each of the scene's other source articles, for the list on the explanation card.
  more: [{ n: 19, page: 174, t: '被 AI 看見，是技術的優化；被消費者記住，才是品牌的真本事。' }, { n: 13, page: 124, t: '品牌要進入的不是單一媒體版位，而是消費者的討論場域。' }],
  look: { bg: '#2a6150', table: '#8fb096', key: '#fff6dc', fill: '#cdeae6', sky: '#fffbe9' },   // noon
  ground(G) {
    G.wash('#ddd6aa');
    G.rect(0, -3.15, 12.4, 1.0, '#b7cba2', { r: 0 });
    G.marks('tick', -6, -3.55, 6, -2.75, { n: 70, col: '#7fa06a88', size: .14, seed: 9 });
    // An old red-brick arcade widens into the late lunch counter, then narrows past the pickle jars.
    const arcade=[[-5.98,-2.56],[-3.38,-2.49],[-2.47,-2.72],[-.63,-2.53],[-.49,-.95],[1.26,-.60],[3.05,-.39],[5.81,.28],[5.83,1.36],[4.26,1.14],[2.70,.81],[1.25,.65],[-.28,.66],[-1.29,1.18],[-1.91,2.45],[-3.55,2.62],[-3.45,1.61],[-3.93,.82],[-5.96,.55]];
    pavedCutout(G,arcade,{mortar:'#d9ba92',colors:['#bb8369','#c3876c','#c49373','#b57c63','#c18b70'],width:.98,depth:.42,angle:.10,joint:.052});
    G.path([[-5.75,.63],[-4.05,.89],[-3.57,1.64],[-3.67,2.64]],{w:.075,col:'#9a8c67',sharp:true});
    G.blob([[2.65,2.33],[3.20,1.72],[4.68,1.36],[5.61,1.66],[5.90,2.58],[5.31,2.84],[3.55,2.79]],'#acb27d',{sharp:true});
    G.path([[5.75,2.45],[4.29,1.83],[2.46,1.36],[.44,.99],[-.45,.99]], { w:.34, col:'#d5c192' });
    G.marks('dot', -6, 1.6, 6, 3.4, { n: 40, col: '#b9a57d55', size: .1, seed: 3 });
  },
  build(S) {
    const st = S.state({ phase: 'intro', busy: false });
    let drive = null, regEat = true, regPose = false, travPinch = true, travEat = false, zhiPose = false, plates = 0, smellSpin = 0;
    neighbouringWindow(S);
    tastingParcel(S);
    fieldPress(S,5);
    tofuLane(S);

    // ---- the sun, high at noon
    let rays, shade;
    S.plant(.7, -3.25, (g) => { rays = fieldSun(g, { y: 2.6, r: .42 }); });
    S.discovery(rays,{id:'sun',label:'正午攤前的遮陽簾',duration:.95,sound:'cloth',draw(u,visit){
      const lowered=visit%2?u:1-u;
      shade.scale.y=.12+.88*lowered;
      shade.rotation.x=.12*(1-lowered);
    }});

    // ---- the stall: a counter, a wok of oil, a stack of plates, and the smell curling up
    let wok, skimmer, bubbles, plateK, smells = [], flowers;
    const extra = [], tofuPieces = [], oilBeads = [];
    S.plant(STALL.x, STALL.z, (g) => {
      tab(g, 1.8);
      box(g,0,.42,0,2.0,.66,.8,'#596e59');
      box(g,0,.38,.405,2.0,.5,.02,'#a35a43');
      for(const x of [-.94,-.64,0,.64,.94]) box(g,x,.38,.432,.045,.51,.034,'#926643');
      for(const x of [-.78,.78]) {
        disc(g,x,.165,.36,.16,'#443e37',.074,16);
        disc(g,x,.165,.409,.10,'#aa936f',.024,14);
        disc(g,x,.165,.433,.029,'#61503f',.014,8);
      }
      box(g,0,.785,0,2.14,.07,.92,'#765942');
      box(g,0,.824,0,2.16,.018,.93,'#ccb28a');
      for (const x of [-.82,-.49,-.17,.17,.49,.82]) {
        const mark=group(g); mark.position.set(x,.375,.422);
        poly(mark,[[0,.104],[.086,0],[0,-.104],[-.086,0]],.008,'#e7bc85');
        poly(mark,[[0,.075],[.058,0],[0,-.075],[-.058,0]],.008,'#b56749',0,0,.01);
        disc(mark,0,0,.022,.016,'#e7bc85',.006,8);
      }
      for (const y of [.168,.591]) box(g,0,y,.421,1.95,.014,.012,'#e6b47b');
      // a striped awning over the plate end
      for (const [x,z] of [[-.99,-.39],[-.99,.39],[.20,-.39],[.20,.39]]) {
        beam(g,[x,.8,z],[x,1.88,z],.025,'#705441',6);
        for(const y of [.92,1.65]) cyl(g,x,y,z,.031,.031,.054,'#bc935d',8);
      }
      const canopy=[[-.56,2.04],[-.39,2.12],[-.12,2.11],[.18,2.02],[.43,1.88],[.56,1.76]];
      for(let i=0;i<7;i++) {
        const x=-1.14+i*.213, color=i%2 ? '#e1d3ac' : '#a95845';
        for(let j=0;j<canopy.length-1;j++) {
          const [za,ya]=canopy[j],[zb,yb]=canopy[j+1];
          quad(g,[x,ya,za],[x+.213,ya,za],[x+.213,yb,zb],[x,yb,zb],color);
        }
        poly(g,[[0,.012],[.213,.012],[.207,-.083],[.177,-.122],[.101,-.135],[.042,-.122],[.008,-.079]],.026,color,x,1.76,.557);
      }
      shade=keep(g,-.40,1.745,.55);
      for(let i=0;i<6;i++){
        const x=(i-3)*.21, ink=i%2?'#cda77b':'#dcbc92';
        poly(shade,[[x,0],[x+.21,0],[x+.21,-.28],[x+.14,-.33],[x+.054,-.34],[x,-.29]],.019,ink);
      }
      beam(shade,[-.63,-.24,.02],[.63,-.24,.02],.012,'#937957',5);
      shade.scale.y=.12;
      wallHanger(g,-.45,.70,.42,1.07);
      pressPlate(g,'阿伯臭豆腐',-.44,.592,.493,1.02,.187,'#42624e','#f2e4c4');
      issuePrint(g,'people',.65,.43,.449,.26,'#e2ba85');
      // plates
      plateK = keep(g, -.55, .81, .12);
      for (let i = 0; i < 5; i++) cyl(plateK, 0, .015 + i * .035, 0, .2, .17, .03, C.white, 14);
      for (let i = 0; i < 3; i++) { const k = keep(plateK, 0, .19 + i * .035, 0); cyl(k, 0, 0, 0, .2, .17, .03, C.white, 14); k.visible = false; extra.push(k); }
      // the wok
      wok = keep(g, .5, .81, .05);
      cyl(wok, 0, .1, 0, .36, .2, .2, C.dark, 14); cyl(wok, 0, .19, 0, .32, .32, .02, '#e8b84e', 14);
      for (const side of [-1,1]) {
        const handle=ring(wok,side*.35,.155,.02,.071,.012,C.dark,14); handle.rotation.y=Math.PI/2;
      }
      for (const [x,z,r] of [[-.16,-.03,.2],[.12,-.09,-.3],[.025,.15,.5]]) {
        const tofu=keep(wok,x,.26,z); tofu.rotation.y=r;
        tofu.name='翻面見焦紋的第'+(tofuPieces.length+1)+'塊豆腐';
        box(tofu,0,0,0,.19,.095,.158,C.honey);
        box(tofu,0,.05,0,.17,.009,.144,'#efd092');
        box(tofu,0,-.05,0,.18,.009,.15,'#9c552e');
        for (const groove of [-.047,0,.047]) box(tofu,groove,-.056,0,.013,.004,.106,'#673f2d').rotation.y=.28;
        for(const [dx,dz] of [[-.03,.026],[.014,-.022],[.033,.017]]) cyl(tofu,dx,.057,dz,.009,.009,.006,'#b98650',6);
        tofuPieces.push(tofu);
      }
      skimmer=keep(wok,.22,.22,.13);
      ring(skimmer,0,0,0,.121,.010,'#b49469',14).rotation.x=Math.PI/2;
      for(const a of [-.058,0,.058]) beam(skimmer,[a,0,-.084],[a,0,.084],.006,'#d1b995',4);
      beam(skimmer,[.08,0,.05],[.32,.10,.19],.014,'#908062',5);
      beam(skimmer,[.26,.073,.16],[.45,.15,.27],.024,C.bark,6);
      bubbles=keep(wok,0,.21,0);
      for (const [x,z] of [[-.2,-.1],[.18,.12],[.05,-.18],[-.05,.2]]) {
        const bead=keep(bubbles,x,0,z); ball(bead,0,0,0,.03,'#fbe3a0',0); oilBeads.push(bead);
      }
      S.pad(wok,.32,[0,.20,0]);
      // the smell: three curly green strips that slowly twist
      [[.38, -.05, 1.55, 0], [.58, .08, 1.3, 1], [.47, -.12, 1.15, 2]].forEach(([x, z, h, i]) => { const k = keep(g, x, 1.0, z); curl(k, h, STINK[i], .06, .13, 1.4 + i * .2); smells.push(k); });
      // the heap of flowers the stall helper piles over the whole stall
      flowers = keep(g, 0, 0, .15);
      const leafInks=['#648061','#8a9a6f','#6e8764','#4e7058'];
      for(let i=0;i<12;i++) {
        const a=(i/11-.5)*Math.PI*1.28, x=Math.sin(a)*1.15, z=Math.cos(a)*.69;
        const stem=group(flowers); stem.position.set(x,.04,z); stem.rotation.y=a; stem.rotation.z=-Math.sin(a)*.2;
        const h=1.44+.31*Math.cos(a),w=.30+.11*Math.cos(a);
        poly(stem,[[-w,0],[-w*.81,h*.48],[-w*.50,h*.78],[0,h],[0,0]],.034,leafInks[i%4]);
        poly(stem,[[0,0],[0,h],[w*.47,h*.77],[w*.73,h*.49],[w,0]],.034,leafInks[(i+1)%4],0,0,.008);
        beam(stem,[0,.02,.05],[0,h-.08,.046],.010,'#a6ad84',5);
      }
      let s = 21; const rnd = () => ((s = (Math.imul(1664525, s) + 1013904223) >>> 0) / 4294967296);
      const A = 1.38, B = 1.8, Cc = .98;
      for (let i = 0; i < 29; i++) {
        const y = .05 + Math.pow(rnd(), .8) * .95, phi = (rnd() - .5) * Math.PI * 1.25, rr = Math.sqrt(1 - y * y);
        const nx = rr * Math.sin(phi), ny = y, nz = rr * Math.cos(phi), px = nx * A, py = .2 + ny * B, pz = nz * Cc;
        const n = new T.Vector3(nx / A, ny / B, nz / Cc).normalize(), f = group(flowers);
        f.position.set(px, py, pz); f.rotation.order = 'YXZ'; f.rotation.set(-Math.asin(n.y), Math.atan2(n.x, n.z), 0);
        const [dark,light]=FLOWER[i%FLOWER.length],r=.16+rnd()*.11;
        for(let j=0;j<5;j++) {
          const petal=group(f); petal.rotation.z=j*2*Math.PI/5;
          poly(petal,[[0,.01],[-r*.35,r*.55],[-r*.26,r*.87],[0,r]],.014,dark);
          poly(petal,[[0,.01],[0,r],[r*.29,r*.83],[r*.30,r*.52]],.014,light,0,0,.008);
        }
        disc(f,0,0,.029,r*.20,i%3 ? '#bc8e42' : '#795847',.018,9);
      }
      flowers.visible = false;
    }, { s: 1.52 });

    // ---- the uncle who fries it, behind his counter
    let uncle;
    S.plant(-.48,-1.88,g=>{
      uncle=S.person(g,{y:.63,s:1.38,kind:'elder',coat:'#626e68',prop:false});
      card(uncle.inner,0,.27,.045,.29,.41,'#e3d5b6',.020,.035);
      box(uncle.inner,0,.51,.071,.27,.047,.018,'#a89170');
      poly(uncle.head,[[-.21,.27],[.20,.27],[.13,.40],[-.04,.45],[-.17,.41]],.032,'#e8ddbe',0,0,.061);
      box(uncle.head,0,.295,.095,.411,.043,.031,'#a9654f');
      const ladle=keep(uncle.armR,0,-.37,.085);
      beam(ladle,[0,0,0],[.18,-.13,0],.016,'#775b44',5);
      ring(ladle,.23,-.16,0,.075,.010,'#98836a',12);
      for (const y of [-.028,.012,.047]) beam(ladle,[.178,-.162+y,0],[.277,-.162+y,0],.005,'#af9880',4);
    });

    // ---- the bench: a reclaimed market plank. The regular eats on it
    let plank, reg, regPlate, benchPlate;
    S.plant(BENCH.x, BENCH.z, (g) => {
      tab(g, 1.4);
      for (const x of [-.7, .7]) { box(g, x, .14, 0, .08, .28, .28, C.bark); }
      plank = cratePlank(g, 0, .305, 0, { len: 1.75, h: .36 }); plank.rotation.x = -Math.PI / 2;
      benchPlate = keep(g, .25, .34, .02); cyl(benchPlate, 0, 0, 0, .16, .13, .03, C.white, 14); benchPlate.visible = false;
    });
    S.plant(BENCH.x + .5, BENCH.z - .16, (g) => {
      reg = S.person(g, { y: SEAT, s: 1.43, kind: 'adult', coat: C.coral, hair: C.ink, prop: false });
      thumb(reg, -.42, '#f3cfa6', .02);
      regPlate = keep(reg.inner, 0, .62, .13); cyl(regPlate, 0, 0, 0, .17, .14, .03, C.white, 14); for (const [x, z] of [[-.05, 0], [.05, .03], [0, -.05]]) box(regPlate, x, .04, z, .07, .05, .07, C.honey);
    });

    // ---- the traveller with a backpack, holding his nose from far away
    let trav, travPlate;
    S.plant(0, TRAV.z, (g) => {
      trav = S.person(g, { x: TRAV.x0, z: 0, s: 1.44, kind: 'adult', coat: C.blue, hair: '#5a4636' });
      box(trav.inner, 0, .56, -.12, .32, .4, .14, C.kraft); cyl(trav.inner, 0, .8, -.12, .07, .07, .34, C.red, 8).rotation.z = Math.PI / 2;
      travPlate = keep(trav.inner, 0, .62, .13); cyl(travPlate, 0, 0, 0, .17, .14, .03, C.white, 14); for (const [x, z] of [[-.05, 0], [.05, .03]]) box(travPlate, x, .04, z, .07, .05, .07, C.honey);
      travPlate.visible = false;
    });

    // ---- the stall helper, and the perfume it brought
    let zhi, bottle, bulb, scentFan, blossom;
    S.plant(1.27, 1.13, (g) => { zhi = S.robot(g, { species: 'otter', s: 1.68, lights: S.index - 1 }); thumb(zhi, -.36, C.aqua, 0); });
    S.hero(zhi, { label: '豆腐攤的水獺攤主', ready: () => st.phase === 'ready', go });
    S.plant(.74, .04, (g) => {
      tab(g, .4); bottle = keep(g);
      card(bottle, 0, 0, 0, .3, .36, '#f2a3b4', .2, .08); box(bottle, 0, .4, .1, .08, .08, .08, C.gold);
      beam(bottle, [0, .44, .1], [.18, .44, .1], .015, C.ink, 4);
      bulb = keep(bottle, .22, .44, .1); ball(bulb, 0, 0, 0, .07, C.deep, 1);
      beam(bottle,[0,.44,.10],[-.15,.47,.10],.021,C.gold,6);
      disc(bottle,0,.20,.212,.083,'#f4dec0',.009,16);
      for(let i=0;i<5;i++) poly(bottle,[[0,0],[-.014,.021],[0,.059],[.016,.022]],.007,'#a95d6e',0,.20,.224).rotation.z=i*Math.PI*2/5;
      scentFan=keep(bottle,-.15,.47,.10);
      for(let i=0;i<3;i++) {
        const x=-i*.20, y=i*.061;
        poly(scentFan,[[x,y],[x-.12,y+.08],[x-.22,y+.059],[x-.12,y+.043]],.008,i%2?'#cd8290':'#e4a2a6');
      }
      blossom=keep(scentFan,-.65,.21,.02);
      for(let i=0;i<5;i++) poly(blossom,[[0,0],[-.07,.09],[-.045,.17],[.035,.18],[.073,.094]],.014,i%2?'#f1bdb2':'#c77582').rotation.z=i*Math.PI*2/5;
      disc(blossom,0,0,.022,.039,C.gold,.012,10);
      scentFan.visible=false;
      S.pad(bottle,.19,[0,.27,.10]);
    },{s:1.21});

    // ---- the smell that gets out anyway
    let sneak;
    S.plant(0, 0, (g) => { sneak = keep(g, -1.4, 2.0, -1.6); curl(sneak, .55, STINK[1], .06, .1, 1.5); sneak.visible = false; });

    // ---- a cat with a clothes peg on its nose
    let cat, tail, peg;
    S.plant(2.6, -.55, (g) => {
      tab(g, .4); cat = keep(g);
      const b = ball(cat, 0, .14, 0, .14, '#8a8580', 1); b.scale.set(1.35, .9, .8);
      ball(cat, .19, .3, .03, .1, '#8a8580', 1);
      for (const sx of [-1, 1]) { cone(cat, .19 + sx * .055, .41, .03, .035, .08, '#8a8580', 4); disc(cat, .19 + sx * .035, .32, .12, .012, C.ink, .008, 8); }
      peg=keep(cat,.19,.28,.143);
      for(const y of [-.019,.012]) box(peg,.025,y,0,.13,.023,.032,'#c77754').rotation.z=y;
      disc(peg,0,0,.021,.018,'#e3c37e',.008,8);
      S.pad(cat,.20,[0,.22,0]);
      tail = keep(cat, -.18, .14, 0); beam(tail, [0, 0, 0], [-.12, .22, 0], .025, '#8a8580', 5);
    });

    // ---- the silent things to tap
    for (const [p,id,label,gesture] of [[uncle,'uncle','翻豆腐的阿伯',()=>{uncle.wave(.8);S.sound('oil');}],[reg,'regular','試吃的常客',()=>{reg.cheer();S.sound('cup');}],[trav,'traveller','聞見豆腐的旅人',()=>{trav.doubt();trav.hop(.16);}]]) {
      const c=S.curio(p.root,{id,label,quiet:true,tap:gesture}); p.propId=c.id;
    }
    S.discovery(wok,{id:'wok',label:'翻豆腐的油鍋',duration:1.15,sound:'oil',draw(u,visit,reduced){
      const i=(visit-1)%tofuPieces.length, active=tofuPieces[i];
      const flip=foldTravel(u,.22,.71), lift=Math.sin(Math.PI*flip);
      tofuPieces.forEach((piece,k)=>{
        const prior=Math.floor((visit-1+tofuPieces.length-1-k)/tofuPieces.length);
        piece.rotation.z=(prior%2+(i===k?flip:0))*Math.PI;
        piece.position.y=.26+(i===k?lift*(reduced ? .04 : .24):0);
      });
      const reach=Math.min(foldTravel(u,0,.24),1-foldTravel(u,.73,1));
      skimmer.position.set(.22+(active.position.x-.22)*reach,.22+lift*(reduced ? .02 : .13),.13+(active.position.z-.13)*reach);
      skimmer.rotation.z=-.30*lift;
    }});
    S.pad(smells[0], .22, [0,.94,0]);
    S.curio(smells[0], { id: 'smell', label: '油鍋飄起的臭豆腐味', aim: [0,.94,0], tap: () => { smellSpin = 1; S.sound('whoosh'); } });
    const atomizer=S.discovery(bottle,{id:'perfume',label:'攤主的花香噴瓶',duration:1.25,sound:'mist',draw(u,visit,reduced){
      const squeeze=pulse(u,0,.47), extend=foldTravel(u,.08,.44), fade=1-foldTravel(u,.76,1);
      bulb.scale.set(1-.42*squeeze,1-.34*squeeze,1-.30*squeeze);
      scentFan.visible=u>.065&&u<1;
      scentFan.scale.set(Math.max(.002,extend),Math.max(.002,fade),1);
      scentFan.position.y=.47+(reduced ? .028 : .17)*foldTravel(u,.40,1);
      blossom.rotation.z=(visit%2?1:-1)*extend*.54;
    }});
    S.discovery(cat,{id:'cat',label:'鼻子上夾著衣夾的貓',duration:.94,sound:['clip','meow'],draw(u,visit,reduced){
      const bare=visit%2?u:1-u, pinch=foldTravel(bare,.04,.40);
      peg.position.set(.19-.08*pinch,.28-.115*pinch,.143+.055*pinch);
      peg.rotation.z=-.85*pinch;
      cat.position.x=foldTravel(bare,.32,.82)*(reduced ? .12 : .43);
      cat.rotation.z=-.12*pulse(bare,.20,.93);
    }});
    S.curio(plateK,{id:'plates',label:'等著試吃的瓷盤',quiet:true,tap:()=>{
      if(plates%4===3) extra.forEach(e=>{e.visible=false;}); else S.show(extra[plates%4],.25);
      plates++; S.sound('cup');
    }});
    S.discovery(plank,{id:'plank',label:'常客的長板凳',duration:.64,sound:'wood-creak',draw(u,visit,reduced){
      const bend=pulse(u,.03,.90)*(reduced ? .35 : 1);
      plank.rotation.y=(visit%2?1:-1)*.12*bend;
      plank.position.y=.305-.045*bend;
    }});

    // ---- lifting the flowers off: the reader's hand
    const spring = () => { drive = { u: lift.value() }; const d = drive; S.to(d, { u: 0 }, .5, 'back').then(() => { if (drive === d) drive = null; }); };
    const lift = S.pull(flowers, { id: 'flowers', label: '把花掀開', from: [0, 0, .15], to: [0, 2.3, .6],
      end: (u) => { if (st.phase === 'touch' && !st.busy && u > .45) touch(true); else if (u > .02) spring(); },
      tap: () => { if (st.phase === 'touch') touch(false); } });

    // ---- the story
    async function go() {
      if (st.phase !== 'ready') return; S.set({ phase: 'busy' });
      const bottleSeat = bottle.position.clone();
      await S.walk(zhi, { x: -.20, z: -.59 }, .43);
      zhi.still();
      const palm = S.local(bottle.parent, S.world(zhi.armR, [0, -.29, .10]));
      await S.to(bottle.position, { x: palm.x, y: palm.y, z: palm.z }, .24, 'out');
      atomizer.tap();
      for (const k of smells) S.to(k.scale, { x: .001, y: .001, z: .001 }, .3, 'in');
      await S.show(flowers, .48);
      await S.to(bottle.position, { x: bottleSeat.x, y: bottleSeat.y, z: bottleSeat.z }, .24, 'inOut');
      await S.wait(.30);
      // a curl of smell gets out of the flowers anyway, and finds the traveller
      sneak.visible = true; sneak.position.copy(S.local(sneak.parent,S.world(flowers,[.44,1.82,.06]))); sneak.scale.setScalar(.001); S.to(sneak.scale, { x: 1.6, y: 1.6, z: 1.6 }, .3, 'back'); S.sound('whoosh');
      await S.wait(.3);
      const nose = S.local(sneak.parent, S.world(trav.rig.mouth, [0, .042, .08]));
      S.to(sneak.position, { x: nose.x - .1, z: nose.z }, 1.5, 'inOut'); await S.to(sneak.position, { y: nose.y }, 1.5, 'out');
      S.emote(trav, '!', 1.4); S.sound('tick'); trav.doubt();

      await S.walk(trav, TRAV.back, .6); trav.root.scale.x = Math.abs(trav.root.scale.x);
      zhi.doubt();
      await S.wait(.8);
      S.set({ phase: 'touch' }); S.hint(flowers, [0, 1.5, .8], '把花掀開');
    }
    async function touch(byHand) {
      if (st.phase !== 'touch' || st.busy) return; st.busy = true; S.hint(null); S.refresh();
      if (!byHand) { const d = drive = { u: lift.value() }; await S.to(d, { u: .7 }, .45, 'inOut'); drive = null; }
      // off they go
      S.sound('paper'); zhi.still(); S.hide(sneak, .2);
      S.to(flowers.position, { x: -2.5, y: 4.2, z: -.8 }, .8, 'in'); S.hide(flowers, .8);
      for (const k of smells) S.to(k.scale, { x: 1, y: 1, z: 1 }, .6, 'back');
      await S.wait(.8);
      // the regular finishes his plate: one hand on his nose, the other a thumbs-up
      regEat = false; regPose = true; S.hide(regPlate, .2); S.show(benchPlate, .3); S.sound('cup'); reg.hop();
      await S.wait(.64);
      // the stall helper stands right beside him and does exactly the same, for the traveller to see
      await S.walk(zhi, COPY, .7); zhi.root.scale.x = Math.abs(zhi.root.scale.x);
      zhiPose = true; zhi.hop();
      await S.wait(.68);
      // the traveller laughs, comes over, and sits down to eat, nose held
      travPinch = false; trav.still(); trav.cheer(); trav.hop();
      await S.wait(.44); trav.still();
      await S.walk(trav, TRAV.front, 1.0); await S.walk(trav, TRAV.seat, .34); trav.root.scale.x = Math.abs(trav.root.scale.x);
      travPinch = true; travEat = true; await S.show(travPlate, .24); S.sound('cup');
      await S.wait(.6);
      S.learn(zhi); await S.wait(1);
      S.set({ phase: 'done' }); S.done();
    }
    S.onReadyLoop((phase) => {
      // A curl from the fryer reaches the traveller. He recoils while the regular keeps eating.
      const whiff = pulse(phase, .02, .52), stepBack = pulse(phase, .27, .84);
      smells[0].scale.y *= 1 + .28 * whiff; smells[0].rotation.z -= .19 * whiff;
      trav.root.position.x += .45 * stepBack; trav.root.rotation.z -= .17 * stepBack;
      regPlate.position.y += .14 * pulse(phase, .51, .95);
    }, 4.9, [smells[0], trav.root, regPlate]);
    S.act('go', go); S.act('touch', () => touch(false));
    S.on('reset', () => { drive = null; regEat = true; regPose = false; travPinch = true; travEat = false; zhiPose = false; plates = 0; smellSpin = 0; });
    S.on('enter', async () => {
      // the regular tucks in; the traveller looks on from far away, holding his nose
      reg.hop(); S.sound('soft');
      await S.wait(.7); trav.doubt();
      await S.wait(1.0); trav.still(); S.set({ phase: 'ready' });
    });
    S.ui(() => storyPanel(st, {
      opening: '常客正捏著鼻子吃臭豆腐，路過的旅人卻退了一步。水獺攤主決定往攤前噴點花香。',
      start: '替豆腐攤噴花香',
      checkpoint: '花香蓋不住臭豆腐，旅人又退了一步。掀開花簾，看看坐在攤前的常客怎麼吃。',
      action: '掀開花看一看',
      ending: '「聞起來臭，吃起來香！」常客捏著鼻子比讚，旅人看懂了。顧客說得這麼具體，AI 推薦這家攤子時也有話可說。',
    }));

    S.tick((t, dt) => {
      const still=S.stage.still.matches, breeze=still ? 0 : t;
      if(!still) rays.rotation.z+=dt*.05;
      if (drive) lift.set(drive.u);
      smells.forEach((k,i)=>{k.rotation.y=Math.sin(breeze*.7+i*2.1)*1.1+(i===0?smellSpin*(still ? .44 : Math.PI*2):0);});
      if (smellSpin > 0) smellSpin = Math.max(0, smellSpin - dt * .9);
      if (sneak.visible) sneak.rotation.y = breeze * 3;
      oilBeads.forEach((b, i) => { b.position.y = Math.abs(Math.sin(breeze * 3 + i * 1.7)) * .03; });
      tail.rotation.z = Math.sin(breeze * 2.2) * .25;
      if (regEat) reg.armR.rotation.z = -2.45 + Math.sin(breeze * 7) * .3;
      if (regPose) verdict(reg);
      if (zhiPose) verdict(zhi, true);
      if (travPinch) pinchOnly(trav);
      if (travEat) trav.armR.rotation.z = -2.45 + Math.sin(breeze * 7 + 1) * .3;
    });
  },
};
