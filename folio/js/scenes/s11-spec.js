// 第 11 頁｜藍染坊｜〈交付力〉第 20、21、4 篇
// The same sunrise block runs through two shops. A master swatch changes what the first shop asks the press to keep.
import { pulse } from './reading-beats.js';
import { C, keep, box, cyl, ball, disc, ring, beam, poly, tag, tab, cloud, cratePlank, skyDisc } from '../paper.js';
import { mountainPrint, printRail } from './indigo-print.js';
import { indigoStream } from './night-streetscape.js';
import { dyeCraft } from './evening-craft.js';
import { printedYard, dyeHouseFacade, editionSky, editionCloud } from './evening-edition.js';

const DIARY = '先說好哪一樣不能換，再做一千個。';
const BLUE = '#33569b', DUN = '#e1c69e', CLOTH = '#f6f1e4', TUB = '#8a5a3a';
// The number, spacing and size of the circles can vary. Every arrangement keeps the dyer's indigo and white reserve.
const circleLayouts = [
  [[0,.68,.30],[0,.30,.15]], [[-.15,.73,.18],[.11,.48,.27],[0,.21,.12]],
  [[0,.61,.35],[0,.26,.15]], [[.12,.77,.18],[-.13,.47,.24],[.16,.25,.14]],
  [[0,.70,.25],[0,.36,.25]], [[-.13,.69,.21],[.13,.40,.25]],
];

/** a cloth hanging from its top edge (y = 0) down to -h. Its colours are layers that rise from the hem: lay(k, 'dun' | 'blue') */
function cloth(g, x, y, z, w, h, { variant = 0, long = false } = {}) {
  const k = keep(g, x, y, z);
  box(k, 0, -h / 2, 0, w, h, .02, CLOTH); box(k, 0, -.03, .004, w + .02, .06, .03, '#ddd5c2');
  const layer = (col, dz) => { const L = keep(k, 0, -h, dz); box(L, 0, h / 2 - .03, 0, w, h - .06, .012, col); L.visible = false; return L; };
  const dun = layer(DUN, .017), blue = layer(BLUE, .059);
  dun.name = '日出山紋印面'; blue.name = '靛藍白圈印面';
  mountainPrint(dun, 0, h * (long ? .62 : .49), .012, w * .88);
  if (long) mountainPrint(dun, 0, h * .30, .012, w * .88);
  for (const [cx, cy, r] of circleLayouts[variant]) {
    ring(blue, cx*w, cy*h, .014, r*w, Math.max(.012, w*.042), CLOTH, 18);
  }
  if (w >= .45) {
    k.name = '工房的展示布'; k.userData.loom = {width:w,length:h};
    // A stitched selvage stays on the fabric as it dyes. The family's blue holds the resist rings.
    for (const side of [-1, 1]) {
      const x = side * (w / 2 - .022);
      box(k, x, -h * .53, .014, .012, h * .87, .006, '#d6d0c0');
      box(blue, x, h * .47, .031, .014, h * .85, .007, '#a6b3ba');
    }
    for (let i = 0; i < 5; i++) {
      const x = -.17 + i * .082;
      box(blue, x, .082, .033, .040, .013, .006, '#e9ddc3');
      box(k, x, -h + .045, .017, .044, .012, .006, '#cfc7b1');
    }
  }
  return { k, dun, blue };
}

export default {
  id: 's11-spec', land: 'ai', short: '自己的藍', calm: true,
  title: '用 AI 大量製作內容，怎麼讓人一眼認出你的品牌？',
  sources: [{ n: 20 }, { n: 21 }, { n: 4 }],
  diary: DIARY,
  takeaway: '人人都用 AI 量產，做出來一模一樣、分不出誰是誰。先定下自己絕不妥協的規矩，同樣的產量才件件像你。',
  quote: { t: '而平均，正是品牌差異化最大的敵人。', n: 20, page: 177 },
  // One sentence from each of the scene's other source articles, for the list on the explanation card.
  more: [{ n: 21, page: 184, t: '一項 AI 素材不會只憑一句簡單提示詞就能精準生成。' }, { n: 4, page: 31, t: '當 AI 可以快速生成大量內容，品牌最需要的不是更多素材，而是更清楚的判斷標準。' }],
  look: { bg: '#2c3948', table: '#536670', key: '#e9dbc8', fill: '#b7c9d8', sky: '#d6d5c9' },   // just after dark
  ground(G) {
    if (printedYard(G, 'dye')) return;
    G.wash('#e9e3d8');
    G.rect(0, -3.3, 12.4, .7, '#cfc6dc', { r: 0 });                 // the night coming in over the far edge
    G.rect(0, -2.86, 12.4, .24, '#ddd3dc', { r: 0 });
    // the dye yard: packed earth and flagstones
    G.rect(0, .62, 12.4, 5.96, '#ece4d6', { r: 0 });
    G.path([[-6, -2.38], [6, -2.38]], { w: .08, col: '#bfb3a0', sharp: true });
    G.marks('dot', -5.4, -1.8, 5.4, 3.2, { n: 40, col: '#c9bba366', size: .14, seed: 4 });
    // shade under the rack and the trough
    G.rect(-2.4, -1.15, 4.4, 1.0, '#ddd2bf', { r: .12 });
    G.marks('tick', -5.6, -2.2, 5.6, -1.6, { n: 26, col: '#b9ad9566', size: .14, seed: 21 });
    // A narrow resist-printed border runs along the edges of the dye yard.
    for (const side of [-1, 1]) for (let i = 0; i < 9; i++) {
      const x = side * 5.63, z = -1.50 + i * .48;
      G.path([[x-.10,z],[x,z-.12],[x+.10,z],[x,z+.12],[x-.10,z]], { w:.02, col:'#68849865', sharp:true });
      G.circle(x, z, .028, '#879795');
    }
    G.rect(4.23, -.53, 1.84, 1.35, '#b5b7aa72', { r: .08 });
  },
  build(S) {
    const st = S.state({ phase: 'intro', busy: false });
    let compare = false, chosen = false, birdBusy = false, spinStars = 0;
    const billow = [0, 0, 0, 0, 0, 0], bubbleT = [9, 9, 9];

    dyeCraft(S);
    indigoStream(S);

    // ---- the moon, with a wrapper so a tap's wobble does not stop the stars turning
    let stars, moon;
    S.plant(3.67, -3.30, (g) => { moon = keep(g); stars = editionSky(moon, { kind: 'moon', y: 2.56, r: .46 }) || skyDisc(moon, { kind: 'moon', y: 2.56, r: .46 }); });
    S.pad(moon, .39, [-.12, 2.56, 0]);
    S.curio(moon, { id: 'moon', label: '染坊窗上的月輪', aim:[-.28, 2.54, .035], quiet: true, tap: () => { S.sound('paper', moon); spinStars = 1; } });
    S.plant(3.2, -3.4, (g) => editionCloud(g, .81, 2.06) || cloud(g, .8, 2.3, '#d9d2e6'));

    // ---- the drying rack: six long cloths over the dye trough
    const cloths = []; let press, poolBlue, sparrow, plank;
    S.plant(-2.4, -1.4, (g) => {
      tab(g, 3.8);
      for (const sx of [-1, 1]) { box(g, sx * 1.95, 1.17, 0, .1, 2.34, .1, C.bark); beam(g, [sx * 1.95, 0, -.4], [sx * 1.95, 1.4, 0], .025, C.bark, 4); }
      beam(g, [-2.1, 2.25, 0], [2.1, 2.25, 0], .045, '#c8b27a', 8);                       // the bamboo pole
      for (const sx of [-1, 1]) beam(g, [sx * .45, 2.27, .02], [sx * .45, 2.42, .02], .012, C.ink, 3);
      if (!dyeHouseFacade(g)) tag(g, '藍染坊', 0, 2.58, .03, { h: .27, paper: C.white, ink: C.navy });   // the place sign, the only words on the page
      for (const sx of [-1, 1]) { beam(g, [sx * 1.95, 2.18, .07], [sx * 1.95, 1.98, .07], .008, C.ink, 3); ball(g, sx * 1.95, 1.88, .09, .1, C.gold, 1); }   // two lanterns
      for (let i = 0; i < 6; i++) cloths.push(cloth(g, -1.5 + i*.6, 2.22, 0, .50, 1.72, {variant:i, long:true}));
      press = printRail(g);
      // the trough at its foot, and the step in front made from a crate plank
      box(g, -.3, .15, .55, 3.3, .3, .32, '#7d5536'); box(g, -.3, .29, .55, 3.18, .02, .22, '#5a4a40');
      poolBlue = keep(g, 1.33, .315, .55); box(poolBlue, -1.58, 0, 0, 3.16, .015, .21, BLUE); poolBlue.visible = false;
      box(g, -.3, .05, .86, 2.9, .1, .22, '#c9a274');
      plank = cratePlank(g, -.3, .1, .985, { len: 2.9, h: .2 });
      // a sparrow on the pole
      sparrow = keep(g, .95, 2.3, .04);
      const b = ball(sparrow, 0, .06, 0, .07, '#9a7a5a', 0); b.scale.set(1.3, 1, .7); ball(sparrow, .08, .12, 0, .045, '#9a7a5a', 0);
      poly(sparrow, [[.12, .13], [.17, .12], [.12, .1]], .02, C.gold, 0, 0, -.01); disc(sparrow, .095, .14, .03, .01, C.ink, .006, 6);
      poly(sparrow, [[-.08, .06], [-.2, .1], [-.18, .03]], .02, '#7d6046', 0, 0, -.01);
    });
    S.pad(plank, .30);
    S.curio(plank, { id: 'plank', label: '晾衣架前的踏板', aim:[0,0,.02], quiet: true,
      tap: () => { S.sound('wood-knock', plank); bird.tap(); } });
    S.curio(cloths[4].k, { id: 'wind', label: '架上的晾布', aim:[0,-.80,.018], quiet: true, tap: () => { S.sound('cloth'); for (let i = 0; i < 6; i++) billow[i] = Math.max(billow[i], 1 - Math.abs(i - 4) * .22); } });
    S.pad(sparrow, .19, [0,.09,0]);
    const bird = S.curio(sparrow, { id: 'sparrow', label: '竹竿上的麻雀', aim:[0,.09,.03], quiet: true, tap: async () => {
      if (birdBusy) return; birdBusy = true; S.sound('wing-flit', sparrow);
      await S.to(sparrow.position, { x: 1.6, y: 3.0, z: .4 }, .45, 'out'); await S.to(sparrow.position, { x: .2, y: 3.2, z: .2 }, .6, 'inOut'); await S.to(sparrow.position, { x: .95, y: 2.3, z: .04 }, .55, 'inOut'); birdBusy = false;
    } });

    // ---- other dye houses far off: small racks, white cloths
    const far = [];
    for (const [x, z] of [[1.0, -2.75], [2.35, -2.95]]) S.plant(x, z, (g) => {
      tab(g, 1); for (const sx of [-1, 1]) box(g, sx * .62, .6, 0, .06, 1.2, .06, '#8a7a6a'); beam(g, [-.7, 1.16, 0], [.7, 1.16, 0], .025, '#c8b27a', 6);
      for (let i = 0; i < 3; i++) far.push(cloth(g, -.38 + i * .38, 1.14, 0, .30, .85, {long:true}));
    });

    // ---- the paint shelf: every colour in the house
    S.plant(-4.4, .15, (g) => {
      tab(g, 1.1); box(g, 0, .42, -.12, 1.1, .84, .06, '#b9875a');
      for (const y of [.02, .44]) box(g, 0, y + .03, 0, 1.1, .06, .32, '#c9a274');
      [C.red, C.gold, C.leaf, C.pink, C.plum, C.aqua].forEach((col, i) => {
        const k = keep(g, -.34 + (i % 3) * .34, i < 3 ? .5 : .08, .02);
        cyl(k, 0, .15, 0, .12, .12, .3, col, 12); cyl(k, 0, .31, 0, .125, .125, .04, '#e9e3d8', 12); cyl(k, 0, .14, 0, .123, .123, .1, C.white, 12);
      });
    });

    // ---- her vat of blue, on a little stand in front of the trough. It tips over backwards into the trough
    let vat, lip, stream;
    S.plant(-1.45, -.3, (g) => {
      tab(g, .8); box(g, 0, .12, 0, .74, .24, .7, '#6f4a30'); for (const sx of [-1, 1]) box(g, sx * .3, .12, .35, .06, .24, .03, '#5a3a24');
      vat = keep(g, 0, .25, -.36);
      cyl(vat, 0, .24, .36, .36, .31, .48, TUB, 16);
      for (const y of [.08, .4]) ring(vat, 0, y, .36, .32 + y * .1, .02, C.dark, 22).rotation.x = Math.PI / 2;
      cyl(vat, 0, .475, .36, .33, .33, .02, BLUE, 16);
      // her blue hand print on its side, and a drip over the rim
      poly(vat, [[-.05, 0], [.05, 0], [.06, .07], [.09, .14], [.06, .15], [.04, .1], [.035, .17], [.01, .17], [.0, .1], [-.02, .17], [-.045, .16], [-.04, .1], [-.07, .14], [-.09, .12], [-.06, .06]], .01, BLUE, -.08, .13, .68);
      poly(vat, [[-.025, 0], [.025, 0], [.02, -.08], [0, -.1], [-.02, -.08]], .01, BLUE, .17, .48, .66);
      stream = keep(g, 0, 0, 0); beam(stream, [0, .52, -.72], [0, .29, -.58], .07, BLUE, 8); stream.visible = false;
      lip = keep(g, 0, .73, .36);
    });

    // ---- people
    let gran, orders, masterCloth, cust, swA, swB, ce, zhi;
    S.plant(-.49, .73, (g) => {
      gran = S.person(g, { s: 1.97, kind: 'elder', coat: '#5b6b8c' });
      gran.root.traverse((o) => { if (o.isMesh && o.geometry.type === 'IcosahedronGeometry' && o.parent !== gran.head) o.material = o.material.clone(), o.material.color.set(BLUE); });   // hands blue to the wrist
      masterCloth = cloth(gran.rig.elbows[0], .014, -.155, .054, .25, .35);
      masterCloth.k.name = '阿藍婆留的原樣布';
      masterCloth.blue.visible = true;
      orders = keep(gran.inner, .02, .5, .09);
      for (let i = 0; i < 5; i++) { const s = box(orders, (i % 2) * .015 - .007, i * .025, 0, .26, .02, .2, i % 2 ? C.white : '#efe6d2'); s.rotation.x = -1.2; }
    });
    const gp = S.curio(gran.root, { id: 'gran', label: '拿著靛藍白圈布樣的老師傅', aim:[0,.56,.11], quiet: true, tap: async () => {
      if (st.phase === 'touch') return S.run('touch');
      S.sound('cloth'); const angle = masterCloth.k.rotation.y;
      await S.to(masterCloth.k.rotation, { y: angle + .48 }, .22, 'out');
      await S.to(masterCloth.k.rotation, { y: angle }, .44, 'inOut');
    } }); gran.propId = gp.id;
    S.plant(1.62, 1.01, (g) => {
      cust = S.person(g, { s: 1.69, kind: 'adult', species: 'frog', coat: '#b5654f', hair: C.bark });
      const tape = cust.root.getObjectByName('點點的量尺');
      cust.inner.add(tape); tape.position.set(.12,.32,.059); tape.scale.setScalar(.70);
      swA = cloth(cust.rig.elbows[0], .012, -.178, .048, .29, .42);
      swB = cloth(cust.rig.elbows[1], .115, -.094, .048, .29, .42);
      swA.k.name = '樹蛙左手的本店樣布'; swB.k.name = '樹蛙右手的鄰店樣布';
      swA.k.visible = swB.k.visible = false;
    });
    const cup = S.curio(cust.root, { id: 'cust', label: '來認布的樹蛙客人', aim:[0,.63,.10], quiet: true, tap: () => {
      if (st.phase === 'recognise') return S.run('choose');
      S.sound('cloth', cust.root); cust.wave(.75);
    } }); cust.propId = cup.id;
    S.plant(3.22, 1.76, (g) => { ce = S.person(g, { s: 1.33, kind: 'ce', coat: C.navy }); });
    const cp = S.curio(ce.root, { id: 'ce', label: '替染坊收布的夥伴', aim:[0,.62,.09], quiet: true, tap: () => { ce.wave(.72); S.sound('cloth', cloths[5].k); billow[5]=1; billow[4]=.65; } }); ce.propId = cp.id;
    S.plant(-3.14, 1.11, (g) => { zhi = S.robot(g, { species: 'magpie', s: 1.46, lights: S.index - 1 }); });
    S.hero(zhi, { label: '染坊對色師小靛', ready: () => st.phase === 'ready', go });

    // ---- small things: a bubbling pot, the cat with blue feet, the cloth mallet
    let pot; const bubbles = [];
    S.plant(-4.75, 1.45, (g) => {
      tab(g, .5); pot = keep(g);
      cyl(pot, 0, .17, 0, .22, .19, .34, '#6f4a30', 12); ring(pot, 0, .3, 0, .215, .015, C.dark, 18).rotation.x = Math.PI / 2; cyl(pot, 0, .335, 0, .2, .2, .02, '#4b6f8f', 12);
      for (let i = 0; i < 3; i++) { const b = keep(pot, -.08 + i * .08, .36, (i - 1) * .05); ball(b, 0, 0, 0, .045, '#9bb3cf', 1); b.visible = false; bubbles.push(b); }
    });
    S.pad(pot, .235, [0,.24,0]);
    S.curio(pot, { id: 'pot', label: '冒泡的小染缸', aim:[0,.24,.09], quiet: true, tap: () => { S.sound('dye', pot); for (let i = 0; i < 3; i++) bubbleT[i] = -i * .18; } });

    let cat; const prints = [], paws = [];
    S.plant(.75, 2.15, (g) => {
      for (let i = 0; i < 7; i++) {
        const p = keep(g, .025+i*.222,.006,0);
        for (const [x,z,r] of [[0,0,.043],[.051,-.036,.021],[.066,0,.020],[.049,.040,.020]]) {
          cyl(p,x,.009,z,r,r,.012,BLUE,8);
        }
        p.name = '染藍的貓腳印'; p.visible=false; prints.push(p);
      }
      cat = keep(g, 0, 0, 0); tab(g, .4);
      poly(cat, [[-.2, .1], [.14, .1], [.17, .24], [-.18, .25]], .07, '#f1ece2', 0, 0, -.035);
      for (const [x,z] of [[-.136,-.046],[-.116,.048],[.085,-.047],[.115,.050]]) {
        const paw=keep(cat,x,.11,z); box(paw,0,-.052,0,.049,.105,.050,'#f1ece2');
        box(paw,.006,-.094,0,.060,.033,.056,BLUE); paws.push(paw);
      }
      const head = keep(cat, .17, .27, 0); poly(head, [[-.09, -.07], [.09, -.07], [.09, .06], [.06, .13], [.03, .07], [-.03, .07], [-.06, .13], [-.09, .06]], .07, '#f1ece2', 0, 0, -.035);
      for (const sx of [-1, 1]) disc(head, sx * .035, .0, .04, .012, C.ink, .006, 6);
      const tail = keep(cat, -.19, .22, 0); beam(tail, [0, 0, 0], [-.07, .18, 0], .02, '#f1ece2', 4); cat.userData.tail = tail;
    });
    S.pad(cat,.27,[0,.22,0]);
    S.discovery(cat, { id: 'cat', label: '藍腳印的小白貓', aim:[.045,.21,.03], duration: 1.7, sound: ['handprint', 'meow'],
      draw(u, visit, reduced) {
        const forward = visit % 2 === 1;
        const v = reduced ? 1 : u*u*(3-2*u);
        const trail = forward ? v : 1-v, gait = reduced ? 0 : Math.sin(v*7*Math.PI);
        cat.scale.x=forward?1:-1;
        cat.position.set(1.4*trail, Math.abs(gait)*.038, .11*Math.sin(trail*Math.PI));
        paws.forEach((paw,i)=>{ paw.rotation.z=(i===0||i===3?1:-1)*.44*gait; });
        prints.forEach((p,i)=>{
          const stride=forward ? i : prints.length-1-i;
          p.visible = u>0 && v >= (stride+.45)/prints.length;
          p.scale.x = forward?1:-1;
          p.position.z=.11*Math.sin(i/(prints.length-1)*Math.PI) + (stride%2?.065:-.05);
        });
      },
      reset() {
        cat.scale.x=1; cat.position.set(0,0,0); paws.forEach(p=>{p.rotation.z=0;});
        prints.forEach(p=>{p.visible=false;});
      }
    });

    // A damp fold feeds under the mallet. The paper cloth flattens at contact,
    // and the water it held runs into a groove in the front of the block.
    let mallet, blanket, wetPrint, outlet, runnel;
    S.plant(-1.85, 1.95, g => {
      tab(g, .95);
      box(g, 0, .13, 0, .90, .26, .54, '#a8794e');
      box(g, 0, .272, 0, .83, .028, .49, '#c59e6c');
      for (const x of [-.26, -.13, 0, .13]) {
        box(g, x, .293, 0, .063, .016, .41, '#9e7c58');
      }
      blanket = keep(g, -.06, .29, -.14);
      blanket.name = '砧板上的溼藍布';
      box(blanket, 0, .024, .164, .51, .042, .32, '#36588a');
      // A small tent of cloth above the remaining folds. Only its height changes.
      for (const [z, slope, shade] of [[.06, -.65, '#57759d'], [.165, .65, '#466789']]) {
        const face = box(blanket, 0, .089, z, .52, .014, .142, shade);
        face.rotation.x = slope;
        for (const x of [-.192, .192]) {
          const seam = box(blanket, x, .103, z, .014, .006, .130, '#d1cfbb'); seam.rotation.x = slope;
        }
      }
      wetPrint = keep(g, -.04, .298, .078);
      const reserve = ring(wetPrint, 0, 0, 0, .096, .016, CLOTH, 18);
      reserve.rotation.x=-Math.PI/2; wetPrint.visible=false;
      outlet = keep(g, -.04, .28, .25);
      box(outlet, 0, -.127, .014, .036, .254, .014, '#6e91ab'); outlet.visible=false;
      runnel = keep(g, -.041, .016, .348);
      const water = cyl(runnel, 0, 0, 0, .09, .09, .008, '#72929e', 13);
      water.scale.x=1.40; runnel.visible=false;
      mallet=keep(g, .29, .39, -.015); mallet.rotation.z=-.48;
      beam(mallet, [0,0,0], [-.32,0,0], .028, C.wood, 7);
      const pressHead=keep(mallet,-.35,0,0);
      cyl(pressHead,0,0,0,.087,.089,.22,C.bark,12).rotation.x=Math.PI/2;
      box(pressHead,0,-.061,.006,.12,.057,.216,'#845f41');
    });
    S.pad(mallet, .23, [-.22, 0, 0]);
    let struck = false;
    const beatCloth = S.discovery(mallet, { id:'mallet', label:'把濕布搥平的木槌', aim:[-.24,0,.055], duration:1.28,
      draw(u, visit, reduced) {
        if (u === 0) struck = false;
        const down = Math.min(1, u / .33);
        const up = Math.min(1, Math.max(0, (u-.50)/.43));
        const travel = reduced ? (u < .5 ? 1 : 0) : down*(1-up);
        const squeeze = Math.min(1, Math.max(0, (u-.22)/.20));
        const feed = Math.min(1, Math.max(0, (u-.74)/.26));
        mallet.rotation.z = -.48 + .68*travel;
        // A fresh crease is fed from the rear when the next pass starts.
        blanket.scale.y = 1.34 - 1.12*squeeze + .25*feed;
        blanket.position.z = -.14 + .087*feed;
        if (!struck && u >= .29) { S.sound('wood-knock', mallet); struck = true; }
        wetPrint.visible = u > .32;
        wetPrint.scale.set(.82 + .20*squeeze, 1, .88);
        outlet.visible = u > .32 && u < .72;
        outlet.scale.y = Math.min(1, Math.max(.01, (u-.32)/.30));
        runnel.visible = u > .58 || visit > 1;
        const pool = Math.min(1, Math.max(.05, (u-.52)/.32));
        runnel.scale.setScalar(visit % 2 ? .56+.56*pool : 1.12+.26*pool);
      },
      reset() {
        mallet.rotation.z = -.48; blanket.scale.y = 1; blanket.position.z = -.14;
        outlet.visible = runnel.visible = wetPrint.visible = false;
      }
    });
    S.pad(blanket, .18, [-.188,.063,.21]);
    S.curio(blanket, { id:'damp-cloth', label:'砧板上的溼藍布', aim:[-.188,.063,.21], quiet:true, tap:()=>beatCloth.tap() });

    let selectionLift = 0;
    const guide = cloth(press.socket, 0, 0, .012, .40, .44);
    guide.k.name = '夾在印花車上的原樣布';
    guide.k.visible = false; guide.blue.visible = true;
    const ink = (layer, dur) => {
      layer.visible = true;
      layer.scale.y = S.stage.still.matches ? 1 : .018;
      return S.to(layer.scale, {y:1}, dur, 'inOut');
    };
    async function printOne(i, workshop, count) {
      const target = cloths[i];
      await press.stamp(S, target.k.position.x, async () => {
        press.count(count);
        billow[i] = .44;
        await ink(workshop ? target.blue : target.dun, .28);
        if (workshop) target.dun.visible = false;
      });
    }
    async function go() {
      if (st.phase !== 'ready') return;
      S.set({phase:'printing'}); S.focus(cloths[0].k);
      zhi.wave(.7);
      await printOne(0, false, 1);
      await S.wait(.45);
      S.set({phase:'proof'});
    }

    // A sample actually crosses the yard from each shop to one of the frog's empty hands.
    async function bringSample(sample, from) {
      const home = sample.k.position.clone(), wrist = sample.k.parent;
      const start = S.local(wrist, S.world(from.k, [0,-.35,.10]));
      sample.k.visible = sample.dun.visible = true;
      if (S.stage.still.matches) { S.sound('cloth', sample.k); return; }
      sample.k.position.copy(start); sample.k.rotation.y = -.26;
      S.to(sample.k.rotation, {y:0}, .82, 'inOut');
      const half = start.clone().lerp(home, .55); half.y += .17;
      await S.to(sample.k.position, {x:half.x,y:half.y,z:half.z}, .38, 'inOut');
      await S.to(sample.k.position, {x:home.x,y:home.y,z:home.z}, .43, 'inOut');
      S.sound('cloth', sample.k);
    }
    async function repeatBlock() {
      if (st.phase !== 'proof') return;
      S.set({phase:'printing'}); S.focus(cloths[2].k);
      for (let i=1; i<cloths.length; i++) await printOne(i, false, i+1);
      await press.park(S);
      await S.wait(.38);
      S.focus(far[2].k);
      for (let i=0; i<far.length; i++) {
        if (i%3===0) S.sound('cloth', far[i].k);
        await ink(far[i].dun, .24);
        press.count(cloths.length+i+1);
        await S.wait(.13);
      }
      S.focus(cust.root);
      await bringSample(swA, cloths[5]); await bringSample(swB, far[0]);
      compare = true; cust.doubt(); gran.doubt();
      await S.wait(.65);
      S.set({phase:'touch'});
    }

    const pr = {u:0}; let springing = false;
    const pull = S.pull(lip, {id:'vat', label:'老師傅的靛藍染缸', from:[0,.73,.36], to:[0,1.08,-.42], pad:.38,
      move(u) { vat.rotation.x = -(st.phase === 'touch' || st.phase === 'fitting' ? u : 0); },
      end(u) {
        if (st.phase === 'touch' && u > .5) { fitSwatch(true); return; }
        pull.set(0);
      },
      tap() {
        if (st.phase === 'touch') return S.run('touch');
        S.sound('dye', vat); for (let i=0; i<bubbleT.length; i++) bubbleT[i] = -i*.18;
      }
    });
    async function fitSwatch(byHand) {
      if (st.phase !== 'touch') return;
      S.set({phase:'fitting'}); S.focus(gran.root); gran.still();
      const socket = press.socket;
      const start = S.local(socket, S.world(masterCloth.k));
      guide.k.position.copy(start); guide.k.visible = true; masterCloth.k.visible = false;
      if (!S.stage.still.matches) {
        guide.k.scale.setScalar(1.18);
        S.to(guide.k.scale,{x:1,y:1,z:1},.88,'inOut');
        await S.to(guide.k.position,{x:start.x*.48,y:Math.max(start.y*.42,.32),z:start.z*.55},.45,'inOut');
        await S.to(guide.k.position,{x:0,y:0,z:.012},.45,'inOut');
      } else guide.k.position.set(0,0,.012);
      S.sound('clip', socket); await S.wait(.40);
      pr.u = pull.value(); springing = true;
      await S.to(pr,{u:1},byHand ? .22 : .52,'inOut');
      stream.visible = poolBlue.visible = true; S.sound('dye', vat);
      poolBlue.scale.x = .02; await S.to(poolBlue.scale,{x:1},.63,'inOut');
      stream.visible = false; await S.to(pr,{u:0},.40,'inOut');
      springing = false;
      S.focus(cloths[2].k); press.count(0);
      for (let i=0; i<cloths.length; i++) await printOne(i, true, i+1);
      await press.park(S);
      await ink(swA.blue,.45); swA.dun.visible = false;
      S.focus(cust.root);
      await S.wait(.5); S.set({phase:'recognise'});
    }
    async function choose() {
      if (st.phase !== 'recognise') return;
      S.set({phase:'choosing'}); compare=false; chosen=true; cust.still();
      S.sound('cloth',swA.k); gran.cheer(); ce.wave(1); zhi.wave(1);
      await S.wait(1.15); S.learn(zhi); await S.wait(.45);
      gran.still(); S.focus(null); S.set({phase:'done'}); S.done();
    }

    S.curio(press.carriage,{id:'print-carriage',label:'沿竹軌移動的 AI 印花車',aim:[0,1.57,.39],quiet:true,tap() {
      if (st.phase === 'ready') return S.run('go');
      if (st.phase === 'proof') return S.run('batch');
      S.sound('wood-knock',press.head); S.wiggle(press.head,.07);
    }});
    S.curio(masterCloth.k,{id:'master-swatch',label:'夾上老師傅的靛藍白圈布樣',aim:[0,-.14,.06],quiet:true,tap() {
      if (st.phase === 'touch') return S.run('touch');
      S.sound('cloth',masterCloth.k); S.wiggle(masterCloth.k,.14);
    }});
    S.onReadyLoop(phase => {
      const fan = pulse(phase,.02,.48), sample = pulse(phase,.53,.94);
      orders.rotation.z -= .20*fan; orders.position.y += .10*fan;
      masterCloth.k.position.y += .058*sample; masterCloth.k.rotation.z += .13*sample;
      zhi.rig.fan.rotation.z += .24*sample;
    },5.7,[orders,masterCloth.k,zhi.rig.fan]);
    S.act('go',go); S.act('batch',repeatBlock); S.act('touch',()=>fitSwatch(false)); S.act('choose',choose);
    S.on('reset',()=>{
      compare=chosen=birdBusy=springing=false;
      spinStars=pr.u=selectionLift=0; press.count(0); billow.fill(0); bubbleT.fill(9);
    });
    S.on('enter',async()=>{await S.wait(.85); S.set({phase:'ready'});});
    const turns = {
      ready:['熟客認得老師傅的靛藍白圈。訂單一多，藍鵲請 AI 印花車先出一塊樣布。','go','讓 AI 試印一塊'],
      proof:['第一塊印出一輪紅日、兩座山。沿用這張花版，下一批會長什麼樣？','batch','用同一張花版量產'],
      touch:['兩家一共印了十二塊。樹蛙兩手各拿一家的布，紅日和山峰連位置都一樣。','touch','夾上老師傅的靛藍白圈布樣'],
      recognise:['這回，老師傅的六塊布各有疏密，都保留了靛藍和白圈。樹蛙又把兩家的樣布舉到眼前。','choose','請樹蛙挑出藍染坊的布']
    };
    S.ui(()=>{
      if (st.phase==='done') return {playing:false, caption:'樹蛙舉起了白圈布。讓 AI 知道哪些特色每一件都要留，設計有變化，客人也認得你。',buttons:[]};
      const turn = turns[st.phase];
      return turn ? {playing:false,caption:turn[0],buttons:[{id:turn[1],label:turn[2],primary:true}]} : {playing:true,caption:'',buttons:[]};
    });

    S.tick((t, dt) => {
      spinStars = Math.max(0, spinStars - dt * .5); stars.rotation.z += dt * (.04 + spinStars * 4);
      for (let i = 0; i < 6; i++) { billow[i] = Math.max(0, billow[i] - dt * .9); cloths[i].k.rotation.x = Math.sin(t * 1.3 + i * .8) * .025 - Math.sin(billow[i] * Math.PI) * .35; }
      far.forEach((c, i) => { c.k.rotation.x = Math.sin(t * 1.1 + i) * .03; });
      if (springing) pull.set(pr.u);
      bubbles.forEach((bead, i) => {
        const u = bubbleT[i] = Math.min(.71, bubbleT[i] + dt);
        bead.visible = u > 0 && u < .7;
        if (!bead.visible) return;
        bead.scale.setScalar(Math.max(.01, Math.sin(u/.7*Math.PI)*1.55));
        bead.position.y = .36 + u*.34;
      });
      if (cat.userData.tail) cat.userData.tail.rotation.z = Math.sin(t * 2.4) * .3;
      const still = S.stage.still.matches;
      gran.armR.rotation.z = -.55; gran.armL.rotation.z = -1.34;
      const sway = compare && !still ? Math.sin(t*1.9) : 0;
      const left = chosen ? -2.32 : compare ? -1.52 - .27*Math.max(0,-sway) : -.77;
      const right = chosen ? .40 : compare ? 1.48 + .27*Math.max(0,sway) : .70;
      // Pose both wrists from stable angles. The customer lifts the identified piece and lowers the other.
      if (chosen) {
        const lift = still ? 1 : Math.min(1, selectionLift + dt*1.35);
        selectionLift = lift;
        cust.armL.rotation.z = -1.52 + (left+1.52)*lift;
        cust.armR.rotation.z = 1.48 + (right-1.48)*lift;
        cust.head.rotation.z = .12*lift;
      } else {
        cust.armL.rotation.z = left; cust.armR.rotation.z = right;
      }
      if (compare) { cust.head.rotation.y = sway*.43; cust.eyes.position.x = .021*sway; }
      for (const s of [swA,swB,masterCloth]) s.k.rotation.z = -s.k.parent.rotation.z - s.k.parent.parent.rotation.z;
    });
  },
};
