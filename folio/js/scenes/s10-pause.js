// 第 10 頁｜結帳口｜〈體驗與猶豫〉第 17、18、15 篇
// 阿梅姨站在低瓜架旁，用空著的手敲瓜；掛出半價牌，仍答不了她最在意的問題。
import { aimPaperHand } from '../paper-hands.js';
import { storyPanel, pulse } from './reading-beats.js';
import { C, keep, group, box, cyl, cone, ball, disc, ring, beam, poly, card, tri, tag, words, tab, cloud, cratePlank, skyDisc } from '../paper.js';
import { melonLane, melonCrest } from './night-streetscape.js';
import { fruitCraft } from './evening-craft.js';
import { printedYard, fruitMarketFacade, skyline, editionSky, editionCloud } from './evening-edition.js';

const DIARY = '她不是嫌貴，是怕不甜。';
const RIND = '#79905a', STRIPE = '#456546', FLESH = '#c85e50', PALE = '#e5ddbd', SEED = '#353b32';
const arc = (r, a0, a1, n = 14) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([Math.cos(a) * r, Math.sin(a) * r]); } return p; };

/** a whole watermelon (stripes running top to bottom); flat < 1 squashes it toward the page like a paper cut-out */
function melon(g, x, y, z, r, flat = .82) {
  const m = group(g); m.position.set(x, y, z); m.scale.z = flat;
  ball(m, 0, 0, 0, r, RIND, 1);
  for (const a of [-.62, 0, .62]) ring(m, 0, 0, 0, r * 1.01, r * .065, STRIPE, 18).rotation.y = Math.PI / 2 + a;
  beam(m, [0, r * .92, 0], [r * .12, r * 1.12, 0], r * .05, C.bark, 4);
  if (r >= .23) {
    // The larger fruit has tapered ink marks and a folded vine leaf.
    for (const side of [-1, 1]) {
      const mark = poly(m, [[-.039,-.37],[.008,-.16],[-.016,.05],[.037,.31],[.011,.4],[-.042,.23],[-.047,.04],[-.064,-.16]], .012, '#719459',
        side * r * .43, 0, r * .88);
      mark.scale.set(r * 1.45, r * 1.45, 1); mark.rotation.z = side * .12;
    }
    const leaf = poly(m, [[0,0],[-.045,.028],[-.129,.03],[-.184,-.009],[-.111,-.055],[-.055,-.046]], .013, '#7d9e63', r * .08, r * 1.085, .008);
    leaf.rotation.z = -.18;
  }
  return m;
}
/** a slice of watermelon: the tip at (0, 0), the rind arc on top */
function slice(g, R = .2) {
  poly(g, [[0, 0], ...arc(R, Math.PI * .28, Math.PI * .72)], .03, RIND, 0, 0, 0);
  poly(g, [[0, 0], ...arc(R * .9, Math.PI * .28, Math.PI * .72)], .03, PALE, 0, 0, .012);
  poly(g, [[0, 0], ...arc(R * .82, Math.PI * .28, Math.PI * .72)], .03, FLESH, 0, 0, .024);
  for (const [sx, sy] of [[-.05, .55], [.05, .55], [0, .38]]) disc(g, sx * R / .2, sy * R, .058, R * .055, SEED, .01, 6);
}

export default {
  id: 's10-pause', land: 'ai', short: '怕不甜', calm: true,
  title: '顧客在結帳前停下來，怎麼找出他擔心什麼？',
  sources: [{ n: 17 }, { n: 18 }, { n: 15 }],
  diary: DIARY,
  takeaway: '顧客停在結帳前，不是找不到按鈕，是怕後悔。把他擔心的事說清楚，他才往前。',
  quote: { t: '顧客不是不知道下一步在哪裡，而是不確定下一步會不會讓自己後悔。', n: 17, page: 153 },
  look: { bg: '#2d414a', table: '#576e74', key: '#f7e1c1', fill: '#c1d5ce', sky: '#e5ddc6' },   // sunset
  ground(G) {
    if (printedYard(G, 'fruit')) return;
    G.wash('#f2d6c4');
    G.rect(0, -3.3, 12.4, .7, '#f6b18c', { r: 0 });                  // the sky low in the west, on the far edge
    G.rect(0, -2.86, 12.4, .26, '#eec0bb', { r: 0 });
    // the market street: paving stones
    G.rect(0, .62, 12.4, 5.96, '#f0ddcb', { r: 0 });
    for (let i = 0; i < 10; i++) { const z = -2.3 + i * .62; G.path([[-6, z], [6, z]], { w: .018, col: '#c9a48c66', sharp: true });
      for (let j = 0; j < 12; j++) { const x = -5.7 + j * 1.05 + (i % 2) * .52; G.path([[x, z], [x, z + .62]], { w: .016, col: '#c9a48c55', sharp: true }); } }
    G.path([[-6, -2.36], [6, -2.36]], { w: .09, col: '#c79d84', sharp: true });
    // shade under the stall and the counter
    G.rect(-2.2, -1.25, 3.2, 1.3, '#e3c1ab', { r: .12 });
    G.rect(2.15, -.55, 1.95, .95, '#e3c1ab', { r: .12 });
    // a puddle of watermelon juice for the dog
    G.blob([[-3.05, 1.0], [-2.7, .92], [-2.45, 1.05], [-2.55, 1.3], [-2.9, 1.34], [-3.12, 1.2]], '#ec8b80');
    G.marks('dot', -3.3, -.45, -1.1, .55, { n: 9, col: '#2d2f3366', size: .16, seed: 5 });   // spilled seeds
    // Small green-and-cream mosaic tiles along the kerb of the fruit market.
    for (let i = 0; i < 21; i++) {
      const x = -5.65 + i * .53;
      G.rect(x, -2.21, .22, .11, i % 2 ? '#9baf94' : '#dbb780', { r: .015 });
    }
    G.rect(-4.73, .32, 1.26, .94, '#c8aa8555', { r: .08 });
    G.rect(4.68, -1.31, 1.73, .68, '#91a08377', { r: .09 });
  },
  build(S) {
    const st = S.state({ phase: 'intro', busy: false });
    const gp = { lean: 1, presentBasket: 0 };
    let audibleKnocks = 2, knockT = 0, lastKn = -1, fast = false, dragging = false, shake = 0, flyT = 0, flyAway = 0, spin = .12, tailT = 0, rolling = false, swatting = false, licking = false;

    fruitCraft(S); melonLane(S);
    skyline(S, 'fruit');

    // ---- the sun, about to set
    // (the curio is a wrapper: a tapped curio wobbles its own rotation.z, which would cancel the spin of the rays)
    let rays, sun;
    S.plant(-4.62, -3.28, (g) => { sun = keep(g); rays = editionSky(sun, { y: 1.48, r: .44 }) || skyDisc(sun, { y: 1.48, r: .44, col: '#ef7d4f' }); });
    S.discovery(sun, { id:'sun', label:'曬到果攤的斜陽', duration:1.10, sound:'cloth',
      draw(u,visit,reduced) {
        const progress=reduced ? 1 : u*u*(3-2*u);
        const west=visit%2 ? progress : 1-progress;
        sun.position.x=-.36*west; sun.position.y=-.15*west;
        canopy.rotation.z=.31*west;
      },
      reset() { sun.position.set(0,0,0); canopy.rotation.z=0; }
    });
    S.plant(-2.6, -3.3, (g) => editionCloud(g, 1.06, 2.25) || cloud(g, 1.1, 2.5, '#f8d2c8')); S.plant(3.0, -3.3, (g) => editionCloud(g, .86, 2.56) || cloud(g, .9, 2.9, '#fadcd2'));

    // ---- the fruit stall: a mountain of watermelons under a big slice of watermelon
    let pile, roll, rollM, fly, swat, swatW, plank, fruitBag, priceFlap, priceTie, snip, bladeA, bladeB; const extra = [];
    S.plant(-2.32, -1.36, (g) => {
      tab(g, 2.6);
      if (!fruitMarketFacade(g)) {
      // the back wall and the two posts that hold the sign
      box(g, 0, .68, -.47, 2.7, 1.36, .06, '#d9a46c'); for (let i = 0; i < 4; i++) box(g, 0, .2 + i * .33, -.435, 2.7, .012, .01, '#b9834e');
      for (const sx of [-1, 1]) box(g, sx * 1.3, 1.03, -.42, .1, 2.06, .1, C.bark);
      // the sign: half a watermelon, as big as the stall
      const R = .82, top = 2.06;
      poly(g, arc(R, 0, Math.PI, 22), .05, RIND, 0, top, -.44);
      poly(g, arc(R * .9, 0, Math.PI, 22), .05, PALE, 0, top, -.43);
      poly(g, arc(R * .8, 0, Math.PI, 22), .05, FLESH, 0, top, -.42);
      box(g, 0, top - .025, -.42, R * 2 + .04, .05, .07, '#2f5d35');
      for (const [sx, sy] of [[-.42, .2], [-.16, .34], [.14, .38], [.42, .22], [-.02, .58], [.26, .54], [-.3, .48]]) {
        const s = poly(g, [[0, -.05], [.03, 0], [0, .05], [-.03, 0]], .02, SEED, sx * R / .82, top + sy * R / .82, -.365); s.rotation.z = -sx * .9; }
      }
      if (window.PaperKit) melonCrest(g);
      // three steps of shelf
      box(g, 0, .15, .2, 2.5, .3, .56, '#c98f5a');
      box(g, 0, .42, -.02, 2.0, .24, .44, '#d39c66');
      box(g, 0, .64, -.2, 1.6, .2, .36, '#dda772');
      // a plank from the crate is the front of the bottom shelf
      plank = cratePlank(g, 0, .15, .485, { len: 2.4, h: .2 });
      // A concertina bag hangs in a slot in the front of the crate.
      fruitBag = keep(plank, -.57, .036, .040);
      fruitBag.name = '瓜攤的摺疊提袋';
      poly(fruitBag, [[-.23,0],[.21,0],[.226,.40],[-.20,.40]], .029, '#d5af70');
      poly(fruitBag, [[.21,0],[.277,.06],[.282,.36],[.226,.40]], .029, '#a88453');
      poly(fruitBag, [[.22,.015],[.248,.20],[.27,.345],[.245,.302]], .006, '#ead09b', 0, 0, .031);
      for (const side of [-1,1]) beam(fruitBag, [side*.105,.394,.025],[side*.073,.535,.028],.013,'#806548',5);
      beam(fruitBag, [-.073,.535,.028],[.073,.535,.028],.013,'#806548',5);
      const emblem = disc(fruitBag, 0, .21, .034, .09, RIND, .009, 12);
      emblem.scale.x = 1.22;
      poly(fruitBag, [[-.043,.05],[-.02,0],[-.04,-.048],[-.003,-.018],[.013,.012]], .005, PALE, .007,.21,.045);
      fruitBag.scale.set(1, .32, .30);
      // the mountain (it trembles while she knocks)
      pile = keep(g);
      const r = .19;
      for (let i = 0; i < 6; i++) melon(pile, -.95 + i * .38, .3 + r, .22, r);
      for (let i = 0; i < 5; i++) melon(pile, -.76 + i * .38, .54 + r, 0, r);
      for (let i = 0; i < 3; i++) melon(pile, -.57 + i * .38, .74 + r, -.2, r);
      roll = keep(pile, .57, .74 + r, -.2); rollM = keep(roll); melon(rollM, 0, 0, 0, r);
      // the doubled mountain, hidden until the shop assistant piles it up
      for (const [n, y, z] of [[3, 1.25, -.24], [2, 1.57, -.26], [1, 1.89, -.28]]) for (let i = 0; i < n; i++) {
        const k = keep(pile, (i - (n - 1) / 2) * .38, y, z); melon(k, 0, 0, 0, r); k.visible = false; extra.push(k); }
      // The fruit seller clips one large price wing to the front-left post, above the dog and the fruit.
      const board=keep(g,-.80,1.53,.73);
      board.name='一顆西瓜的價牌';board.rotation.x=-.08;
      for(const x of [-.72,.72]) beam(g,[-.80+x,.32,.48],[-.80+x,2.04,.71],.034,'#856546',6);
      card(board,0,-.53,0,1.99,1.06,'#815d44',.067,.064);
      card(board,0,-.487,.069,1.91,.976,'#f2deb2',.027,.035);
      function print(surface,text,x,y,z,h,maxWidth,ink) {
        const mark=words(surface,text,x,y,z,h,{color:ink,size:96,weight:850});
        mark.scale.x=Math.min(1,maxWidth/mark.userData.size[0]);
        return mark;
      }
      print(board,'原價',-.49,.016,.104,.264,.68,'#57433a');
      print(board,'60',.18,0,.106,.52,.80,'#384b41');
      print(board,'元',.729,-.094,.106,.18,.263,'#384b41');
      priceFlap=keep(board,0,.455,.138);priceFlap.name='翻下後的半價三十元';
      card(priceFlap,0,-.91,0,1.87,.91,'#f9df9e',.025,.033);
      card(priceFlap,-.53,-.74,.032,.64,.44,'#9f4936',.018,.035);
      print(priceFlap,'半價',-.53,-.52,.058,.233,.585,'#fff3cd');
      print(priceFlap,'30',.201,-.506,.052,.53,.84,'#633426');
      print(priceFlap,'元',.735,-.605,.052,.20,.245,'#633426');
      print(priceFlap,'原價 60',-.48,-.128,.047,.113,.71,'#746347');
      beam(priceFlap,[-.77,-.155,.056],[-.22,-.104,.056],.009,'#8d6749',4);
      priceFlap.visible=false;
      S.curio(board,{id:'price-board',label:'瓜攤的手翻價格牌',quiet:true,aim:[0,0,.12],tap:()=>{
        if(st.phase==='ready'){go();return;}
        if(priceFlap.visible && st.phase!=='busy' && !st.busy){
          S.sound('paper',priceFlap);
          S.to(priceFlap.rotation,{x:-.13},.12,'out').then(()=>S.to(priceFlap.rotation,{x:0},.22,'inOut'));
        }
      }});
      beam(board,[-.98,.477,.14],[.98,.477,.14],.034,'#ae8050',8);
      for(const x of [-.73,.73]) ring(board,x,.476,.142,.067,.015,'#d0ac6d',10);
      priceTie=keep(board,.831,.47,.188);
      poly(priceTie,[[-.041,.015],[.022,.036],[.040,-.143],[-.005,-.11],[-.040,-.161]],.023,'#aa523d');
      snip=keep(board,.835,.42,.22);
      bladeA = keep(snip); bladeB = keep(snip);
      poly(bladeA, [[0, 0], [.24, .03], [.24, -.01]], .015, C.steel, 0, 0, 0); ring(bladeA, -.07, .03, .008, .04, .012, C.red, 10);
      poly(bladeB, [[0, 0], [.24, -.03], [.24, .01]], .015, '#a9b9bd', 0, 0, .016); ring(bladeB, -.07, -.03, .024, .04, .012, C.red, 10);
      bladeA.rotation.z = .35; bladeB.rotation.z = -.35; snip.rotation.z = -Math.PI / 2; snip.visible = false;
      // a fly over the mountain, and the swatter hanging on the post
      fly = keep(g, 0, 1.4, .1); ball(fly, 0, 0, 0, .035, SEED, 0); for (const sx of [-1, 1]) poly(fly, [[0, 0], [sx * .07, .05], [sx * .05, -.01]], .006, '#ffffff', 0, .01, .01);
      swatW = keep(g, 1.38, 1.62, .06); swat = keep(swatW);
      beam(swat, [0, 0, 0], [0, -.5, 0], .016, C.wood, 4); card(swat, 0, -.76, 0, .2, .22, C.lime, .012, .04);
      for (let i = 0; i < 3; i++) box(swat, 0, -.7 + i * .06, .013, .17, .006, .004, '#8fa236');
    }, {s:1.12});
    S.discovery(plank, { id: 'plank', label: '果箱裡的牛皮提袋', aim: [-.55, .23, .1], duration: .88, sound: 'paper',
      draw(u, visit, reduced) {
        const open = visit % 2 === 1, v = reduced ? 1 : Math.sin(u * Math.PI / 2);
        const height = open ? v : 1-v;
        fruitBag.scale.set(1, .32 + .68 * height, .30 + .70 * height);
        fruitBag.rotation.x = -.17 * height;
      },
      reset() { fruitBag.scale.set(1,.32,.30); fruitBag.rotation.x = 0; }
    });
    S.curio(roll, { id: 'roll', label: '瓜堆邊緣的西瓜', quiet: true, tap: async () => {
      if (rolling) return; rolling = true; S.sound('melon', roll);
      await S.to(roll.position, { x: .98, y: .72, z: .02 }, .3, 'in'); S.to(rollM.rotation, { z: -5 }, .9, 'out');
      await S.to(roll.position, { x: 1.18, y: .5, z: .3 }, .22, 'lin'); await S.to(roll.position, { x: 1.42, y: .19, z: .78 }, .3, 'bounce'); S.sound('wood-knock', plank);
      await S.wait(.7); S.to(rollM.rotation, { z: 0 }, .6, 'inOut'); await S.to(roll.position, { x: .57, y: .93, z: -.2 }, .6, 'back'); rolling = false;
    } });
    S.curio(swatW, { id: 'swat', label: '攤柱上的蒼蠅拍', quiet: true, tap: async () => {
      if (swatting) return; swatting = true; flyAway = 1;
      await S.to(swat.rotation, { z: -1.25 }, .14, 'in'); S.sound('cloth', swat); await S.wait(.2); await S.to(swat.rotation, { z: 0 }, .5, 'back'); swatting = false;
    } });

    // ---- the checkout: a counter, the till, a pan scale and a beach umbrella
    let reg, drawer, scale, pan, weight, needle, canopy, coin, halves, cg;
    S.plant(2.15, -.6, (g) => {
      cg = g; tab(g, 1.6);
      box(g, 0, .31, 0, 1.6, .62, .62, '#c98f5a'); box(g, 0, .645, 0, 1.7, .05, .7, '#e8c48e');
      for (let i = 0; i < 5; i++) box(g, -.64 + i * .32, .31, .312, .012, .6, .01, '#b07a48');
      tag(g, '結帳口', -.2, .36, .32, { h: .24, paper: C.white, ink: C.navy });
      // the till: it grows from its foot
      reg = keep(g, .3, .67, .02);
      box(reg, 0, .1, 0, .62, .2, .46, '#738881'); box(reg, 0, .205, .0, .6, .012, .44, '#7d9289');
      for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) box(reg, -.18 + j * .12, .225, .04 + i * .1, .08, .03, .07, C.white);
      beam(reg, [0, .2, -.16], [0, .4, -.16], .025, C.dark, 5);
      box(reg, 0, .47, -.16, .36, .17, .06, C.dark); disc(reg, 0, .47, -.122, .045, C.gold, .012, 14);
      drawer = keep(reg, 0, .05, .2); box(drawer, 0, 0, 0, .52, .08, .14, '#f3b9a3'); disc(drawer, 0, 0, .075, .02, C.dark, .01, 8);
      // A slotted brass weight travels between the side peg and the pan.
      scale = keep(g, -.62, .66, .23);
      card(scale, 0, .035, -.022, .47, .35, '#536e66', .19, .06);
      disc(scale, 0, .212, .176, .179, '#ede3c8', .025, 22);
      for (let i = 0; i < 7; i++) {
        const a = -.96 + .32*i;
        beam(scale, [Math.sin(a)*.116,.208+Math.cos(a)*.116,.210],
          [Math.sin(a)*.15,.208+Math.cos(a)*.15,.210], .008, C.ink, 4);
      }
      needle = keep(scale, 0, .208, .217);
      needle.name = '秤盤紅指針';
      poly(needle, [[-.015,-.030],[0,.144],[.015,-.026]],.009,'#b64f38');
      disc(scale, 0, .208, .229, .024, C.ink, .014, 9);
      needle.rotation.z = .57;
      beam(scale, [0,.36,0],[0,.45,0],.026,'#a9a69a',7);
      pan = keep(scale, 0, .47, 0);
      cyl(pan, 0, .01, 0, .27, .16, .068, '#d6d6c7', 16);
      melon(pan, .072, .158, 0, .134);
      box(scale, -.35, .027, .05, .28,.048,.23,'#8f7752');
      weight = keep(scale, -.36, .058, .045);
      weight.name = '可移動的銅砝碼';
      cyl(weight,0,.071,0,.067,.085,.14,'#ac8243',10);
      cyl(weight,0,.156,0,.051,.053,.036,'#dec28a',9);
      // the beach umbrella
      beam(g, [.68, 0, -.44], [.68, 2.16, -.44], .025, C.white, 6); tab(g, .3);
      canopy = keep(g, .68, 2.12, -.44);
      for (let i = 0; i < 10; i++) { const a0 = i * Math.PI / 5, a1 = (i + 1) * Math.PI / 5; tri(canopy, [0, .34, 0], [Math.cos(a0) * .98, 0, Math.sin(a0) * .98], [Math.cos(a1) * .98, 0, Math.sin(a1) * .98], i % 2 ? '#dfd1a8' : '#596f69'); }
      ball(canopy, 0, .36, 0, .04, C.gold);
      // things for the end: the coin she pays with, and her melon cut in two
      coin = keep(g, 0, 0, 0); disc(coin, 0, 0, 0, .07, C.gold, .02, 16); disc(coin, 0, 0, .012, .045, C.honey, .01, 16); coin.visible = false;
      // A chopping board at the far end of the counter leaves the customer's face and serving hand in clear silhouette.
      box(g,.94,.636,.035,.66,.071,.45,'#b78d5e');
      for(const x of [.75,1.13])beam(g,[.71,.42,.035],[x,.59,.035],.026,'#97714d',5);
      halves=keep(g,.946,.681,.082);
      for (const sx of [-1, 1]) { const h = keep(halves, sx * .17, 0, 0); h.rotation.z = -sx * .25;
        poly(h, arc(.24, 0, Math.PI, 16), .04, RIND, 0, 0, 0); poly(h, arc(.215, 0, Math.PI, 16), .04, PALE, 0, 0, .012); poly(h, arc(.195, 0, Math.PI, 16), .04, FLESH, 0, 0, .024);
        for (const [x, y] of [[-.08, .07], [.06, .1], [0, .15]]) disc(h, x, y, .067, .014, SEED, .008, 6); }
      halves.visible = false;
    });
    S.pad(scale, .32, [0,.26,0]);
    let scaleSounded = false;
    const weigh = S.discovery(scale, { id: 'scale', label: '磅秤與銅砝碼', aim: [0,.28,.1], duration: 1.02,
      draw(u, visit, reduced) {
        const adding = visit % 2 === 1;
        const v = reduced ? 1 : u*u*(3-2*u);
        const travel = adding ? v : 1-v;
        const onPan = adding ? Math.max(0, (v-.63)/.37) : Math.max(0, 1-v/.32);
        const bounce = reduced ? 0 : .13 * Math.sin(Math.PI*3*onPan) * (1-onPan)*onPan;
        pan.position.y = .47 - .052*onPan;
        needle.rotation.z = .57 - 1.33*onPan + bounce;
        weight.position.set(-.36+.236*travel, .058 + .421*travel + (reduced ? 0 : .29*Math.sin(v*Math.PI)), .045);
        if (u === 0) scaleSounded = false;
        if (!scaleSounded && (reduced || (adding ? v >= .70 : v >= .14))) {
          S.sound('scale-spring', scale); scaleSounded = true;
        }
      },
      reset() { weight.position.set(-.36,.058,.045); pan.position.y = .47; needle.rotation.z = .57; }
    });
    S.curio(canopy, { id: 'umbrella', label: '遮瓜的布陽傘', quiet: true, tap: () => { S.sound('cloth', canopy); spin = 9; } });

    // ---- the dog, licking up the juice
    let dog, dogHead, tail, tongue, juice, seed;
    S.plant(-3.45, 1.08, (g) => {
      dog = keep(g); tab(g, .5);
      juice = keep(g, .384, .011, .089);
      const drop = disc(juice, 0,0,0,.124,'#bd6657',.012,12);
      drop.rotation.x=-Math.PI/2; drop.scale.x=1.55;
      seed = keep(g, .435, .033, .08);
      poly(seed, [[-.023,0],[-.019,.025],[0,.046],[.019,.021],[.018,0]],.012,SEED);
      poly(dog, [[-.26, .16], [.16, .16], [.18, .36], [-.24, .36]], .08, '#d9a066', 0, 0, -.04);
      for (const x of [-.2, -.08, .06, .14]) box(dog, x, .08, 0, .055, .17, .05, '#c98a52');
      tail = keep(dog, -.25, .33, 0); poly(tail, [[0, 0], [-.04, .16], [-.01, .17], [.03, 0]], .03, '#c98a52', 0, 0, -.015);
      dogHead = keep(dog, .17, .36, 0);
      poly(dogHead, [[-.04, -.06], [.1, -.06], [.24, -.1], [.25, .02], [.12, .12], [-.03, .1]], .09, '#e0ab72', 0, 0, -.045);
      poly(dogHead, [[.0, .08], [.07, .1], [.03, -.06]], .02, C.bark, 0, 0, .05);
      disc(dogHead, .13, .04, .05, .018, SEED, .01, 8); ball(dogHead, .25, -.04, 0, .025, SEED, 0);
      tongue = keep(dogHead, .201, -.077, .025);
      poly(tongue, [[-.024,0],[.032,0],[.036,-.094],[.016,-.115],[-.011,-.099]], .014, '#dc817d');
      dogHead.rotation.z = -.45;
    });
    S.pad(dog, .32, [.06,.26,0]);
    S.discovery(dog, { id: 'dog', label: '找瓜籽的小狗', duration: 1.52, sound: 'cloth',
      draw(u, visit, reduced) {
        const wet = Math.max(.38, 1-(visit-1)*.22);
        const lap = reduced ? 0 : Math.sin(Math.PI * Math.min(1,u/.80)*3)**2 * (u<.80?1:0);
        const forward = visit % 2 === 1;
        const nudge = Math.min(1,Math.max(0,(u-.52)/.31));
        dogHead.rotation.z = -.45 - .47*lap;
        tongue.scale.y = .64+1.05*lap;
        seed.position.x = .435 - .15*(forward?nudge:1-nudge);
        seed.position.y = .033 + (reduced ? 0 : .18*Math.sin(Math.PI*nudge));
        seed.rotation.z = -1.9*(forward?nudge:1-nudge);
        juice.scale.setScalar(Math.max(.38, wet-.22*u));
        licking = u < 1;
      },
      reset() { dogHead.rotation.z=-.45; tongue.scale.y=1; juice.scale.setScalar(1); seed.position.set(.435,.033,.08); seed.rotation.z=0; licking=false; }
    });

    // ---- the place's people
    let shop, ce, gran, melonK, plug, hole, purse, marks, zhi, knuckle, bagGrip, basket, rindPoint;
    let handMode='knock', holdingSample=false, holdingCoin=false, ripple=0;
    const handAim=new S.T.Vector3(), contact=new S.T.Vector3(), scratch=new S.T.Vector3();
    const slices = [];
    S.plant(3.57, .57, (g) => {
      shop = S.person(g, { s: 1.38, kind: 'adult', coat: '#5c8a63', hair: C.ink });
      poly(shop.inner, [[-.13, .3], [.13, .3], [.11, .66], [-.11, .66]], .02, C.white, 0, 0, .045);
    });
    const sp = S.curio(shop.root, { id: 'shop', label: '果攤老闆', quiet: true, tap: () => { shop.wave(.8); if (!st.busy && st.phase !== 'busy') weigh.tap(); } }); shop.propId = sp.id;
    S.plant(4.2, 1.55, (g) => { ce = S.person(g, { s: 1.32, kind: 'ce', coat: C.navy }); });
    const cp = S.curio(ce.root, { id: 'ce', label: '替果攤看秤的街坊', quiet: true, tap: () => { ce.wave(.5); weigh.tap(); } }); ce.propId = cp.id;

    S.plant(.93, 1.24, (g) => {
      gran = S.person(g, { s: 1.86, kind: 'elder', species: 'civet', coat: '#c0704f' });
      // The wicker handle hangs from the left paw; the right elbow and its knuckles remain free.
      const [leftElbow,rightElbow]=gran.rig.elbows;
      basket=gran.root.getObjectByName('阿梅姨的菜籃');
      bagGrip=keep(leftElbow,.006,-.154,.069);bagGrip.name='提籃的左爪';
      bagGrip.add(basket);basket.position.set(0,-.183,0);basket.rotation.z=0;
      knuckle=keep(rightElbow,.012,-.174,.064);knuckle.name='阿梅姨敲瓜的指節';
      poly(knuckle,[[-.030,.025],[-.014,.045],[.016,.048],[.039,.027],[.040,.008],[.021,-.003],[-.005,-.004]],.012,'#75604d',0,0,-.009);
      for(const x of [-.004,.014]) beam(knuckle,[x,.010,.005],[x+.006,.023,.005],.0028,'#b19a7e',4);
      // A folded money pouch peeks over the back of the basket. Its clasp stays clear of the knocking arm.
      purse=keep(basket,.068,.116,.025);purse.name='菜籃裡的零錢包';
      card(purse,0,-.105,0,.125,.135,'#875260',.025,.024);
      beam(purse,[-.055,.025,.025],[.053,.029,.025],.008,'#c1a064',5);
      ball(purse,.009,.038,.032,.015,'#d2ae60',0);
      // The fruit and stand share a fixed piece of the book. The customer can bend without taking them along.
      const display=keep(g);display.scale.setScalar(gran.root.scale.y);
      const cx=.519,cy=.476,cz=.061;
      const rack=keep(display,cx,0,cz);rack.name='試瓜的矮木架';
      for(const x of [-.199,.199])for(const z of [-.11,.11]){
        beam(rack,[x*1.12,0,z*1.13],[x*.90,.244,z],.026,'#92714e',5);
      }
      for(const z of [-.121,.121]){
        box(rack,0,.214,z,.495,.071,.041,'#a47d57');
        beam(rack,[-.185,.170,z],[.185,.040,z],.015,'#baa079',5);
      }
      // The two raised rails support the curved rind at their inside edges.
      for(const x of [-.104,.104])box(rack,x,.220,0,.048,.061,.32,'#b19166');
      melonK=keep(display,cx,cy,cz);melonK.name='木架上的試吃西瓜';
      const skin=melon(melonK,0,0,0,.245,.70);
      skin.children[0].name='可敲的瓜皮';
      const outside=S.world(melonK,[-.72,.59,.37]),center=S.world(melonK);
      const line=new S.T.Raycaster(outside,center.sub(outside).normalize());
      skin.children[0].updateWorldMatrix(true,false);
      const skinHit=line.intersectObject(skin.children[0],false)[0];
      const surface=skinHit?S.local(melonK,skinHit.point):new S.T.Vector3(-.163,.135,.084);
      rindPoint=keep(melonK,surface.x,surface.y,surface.z);rindPoint.name='指節碰到的瓜皮';
      const W = [[-.12, .07], [.12, .07], [0, -.13]], W2 = [[-.15, .088], [.15, .088], [0, -.162]];
      hole = keep(melonK, 0, -.01, .145);
      poly(hole, W2, .03, PALE, 0, 0, 0); poly(hole, W, .012, FLESH, 0, 0, .024);
      for (const [x, y] of [[-.04, .02], [.04, .02], [0, -.05]]) disc(hole, x, y, .022, .012, SEED, .006, 6);
      plug = keep(melonK, 0, -.01, .17);
      poly(plug, W, .09, FLESH, 0, 0, -.08); poly(plug, W, .02, '#3f7a3c', 0, 0, .01); beam(plug, [0, .065, .032], [0, -.09, .032], .012, STRIPE, 4);
      for (const [x, y] of [[-.04, .02], [.04, .02], [0, -.05]]) disc(plug, x, y, -.086, .013, SEED, .006, 6);
      marks=keep(rindPoint,0,0,.021);
      for (const [x,y,dx,dy] of [[-.026,.052,-.050,.045],[.018,.066,.017,.064]])
        beam(marks,[x,y,0],[x+dx,y+dy,.001],.007,'#ad7142',5);
      marks.visible = false;
    });
    const grp = S.curio(gran.root, { id: 'gran', label: '挑瓜的阿梅姨', quiet: true, tap: () => { if (st.phase === 'done') gran.hop(); else { startKnocks(); } } }); gran.propId = grp.id;

    S.plant(-1.02, 1.62, (g) => { zhi = S.robot(g, { species: 'squirrel', s: 1.62, lights: S.index - 1 }); });
    S.hero(zhi, { label: '換價牌的松鼠夥計', ready: () => st.phase === 'ready', go });

    // She takes the sample, coin and final slice with the same free hand.
    for(const actor of [gran,shop,ce,zhi]){
      const own=actor===gran,small=actor.kind==='robot';
      const k=own?keep(knuckle,0,.003,.021):keep(actor.armR,0,small?-.30:-.36,.07);
      slice(k,small?.20:.19);k.visible=false;slices.push(k);
    }
    const reach = (worldPoint,duration) => {
      handMode='reach';
      const p=S.local(gran.inner,worldPoint);
      return S.to(handAim,{x:p.x,y:p.y,z:p.z},duration,'inOut');
    };
    function startKnocks(quick=false) {
      if(handMode!=='knock')return;
      fast=quick;knockT=0;lastKn=-1;audibleKnocks=2;
    }

    // ---- the story
    async function go() {
      if (st.phase !== 'ready') return; S.set({ phase: 'busy' });
      zhi.cheer(); S.sound('whoosh');
      // 1. the till grows bigger than anyone
      S.to(reg.scale, { x: 2.3, y: 2.3, z: 2.3 }, .55, 'back'); S.sound('rise');
      await S.wait(.6); shop.hop();
      // 2. half the price: snip
      S.show(snip, .2); await S.wait(.25);
      for (let i = 0; i < 2; i++) { S.to(bladeA.rotation, { z: 0 }, .1, 'in'); await S.to(bladeB.rotation, { z: 0 }, .1, 'in'); S.sound('clip'); S.to(bladeA.rotation, { z: .35 }, .12); await S.to(bladeB.rotation, { z: -.35 }, .12); }
      S.hide(snip, .2);
      priceTie.visible=false;priceFlap.visible=true;
      priceFlap.rotation.x=S.stage.still.matches?-.10:-1.53;
      await S.to(priceFlap.rotation,{x:0},S.stage.still.matches?.18:.60,'out');S.sound('paper',priceFlap);
      // 3. twice the watermelons
      for (let i = 0; i < extra.length; i++) { S.show(extra[i], .22); await S.wait(.13); }
      zhi.still(); zhi.wave(1);
      await S.wait(.5);
      // she has not looked up once: she knocks faster, and the whole mountain shakes
      startKnocks(true);
      await S.wait(1.4); zhi.doubt(); shop.doubt(); ce.doubt();
      await S.wait(.8);
      S.set({ phase: 'touch' }); S.hint(plug, [0, -.02, .06], '拔出一角');
    }
    const pr = { u: 0 }; let springing = false;
    const pull = S.pull(plug, { id: 'plug', label: '拔出一角', from: [0, -.01, .17], to: [-.075, .45, .25], pad: .2, padAt: [0, -.01, 0],
      move: (u) => { if(!springing)dragging=true; if (st.phase !== 'touch' && u > .22) { pull.set(.22); return; } plug.rotation.x = -u * .9; },
      end: (u) => { dragging = false; if (st.phase === 'touch' && u > .45) touch(true); else { pr.u = u; springing = true; S.to(pr, { u: 0 }, .35, 'back').then(() => { springing = false; }); S.sound('tap'); } },
      tap: () => { if (st.phase === 'touch') touch(false); } });
    async function touch(byHand) {
      if (st.phase !== 'touch' || st.busy) return; st.busy = true; S.hint(null); S.refresh(); fast = false; audibleKnocks = 0; dragging = true;
      // the wedge comes out: it is red right through
      pr.u = pull.value(); springing = true; await S.to(pr, { u: 1 }, byHand ? .2 : .45, 'out'); springing = false;
      S.sound('melon', melonK);
      zhi.still();shop.still();ce.still();
      handMode='reach';
      await S.to(gp,{lean:0},.28,'inOut');
      const take=S.world(gran.inner,[.377,.713,.139]),landing=S.local(melonK,take);
      S.to(plug.rotation,{x:-Math.PI},.41,'out');
      await Promise.all([reach(take,.40),S.to(plug.position,{x:landing.x,y:landing.y,z:landing.z},.40,'inOut')]);
      holdingSample=true;
      const bite=S.world(gran.rig.mouth,[0,-.042,.065]);
      await reach(bite,.45);S.sound('soft',plug);
      await S.hide(plug,.14);holdingSample=false;
      S.emote(gran,'♥',1.8);ce.hop();await S.wait(.38);
      // Her left paw presents the basket. Her right paw takes a coin, then passes it toward the till.
      await S.to(gp,{presentBasket:1},.34,'inOut');
      await reach(S.world(purse,[0,.035,.031]),.31);
      coin.visible=true;coin.scale.setScalar(1);holdingCoin=true;
      S.to(reg.scale,{x:1,y:1,z:1},.50,'inOut');
      await S.to(drawer.position,{z:.36},.25,'out');
      await Promise.all([reach(S.world(gran.inner,[.424,.734,.157]),.39),S.to(gp,{presentBasket:0},.39,'inOut')]);
      holdingCoin=false;
      const a=coin.position.clone(),b=S.local(cg,S.world(drawer,[0,.06,0]));
      S.to(coin.position,{x:b.x,z:b.z},.45,'lin');
      await S.to(coin.position,{y:Math.max(a.y,b.y)+.22},.19,'out');await S.to(coin.position,{y:b.y},.26,'in');
      S.hide(coin, .1); S.sound('coin'); await S.to(drawer.position, { z: .2 }, .2, 'in'); S.pop(reg, 1.08);
      // the seller cuts it open on the spot and hands it round
      const cut=S.local(melonK.parent,S.world(halves,[0,.257,0]));
      shop.hop(); await S.to(melonK.position, { x: cut.x, y: cut.y, z: cut.z }, .5, 'inOut');
      melonK.visible = false; S.show(halves, .3); S.sound('stamp');
      await S.wait(.35);
      await reach(S.world(gran.inner,[.445,.656,.145]),.35);
      for (const k of slices) { S.show(k, .3); await S.wait(.14); }
      shop.cheer(); ce.cheer(); zhi.cheer();
      await S.wait(1.1); zhi.still(); S.learn(zhi);
      await S.wait(.5); gran.still(); shop.still(); ce.still(); ce.wave(1.6);
      await S.wait(1.0);
      S.set({ phase: 'done' }); S.done();
    }
    S.onReadyLoop((phase) => {
      // Grandma keeps knocking in the scene's own beat. The assistant looks
      // from her closed purse to the price tag and reaches for the scissors.
      const consider = pulse(phase, .05, .58), reach = pulse(phase, .49, .92);
      zhi.head.rotation.y -= .46 * consider; zhi.root.rotation.z += .11 * reach;
      zhi.armR.rotation.z += 1.08 * reach; priceTie.rotation.z += .12 * reach;
    }, 5.1, [zhi.head, zhi.root, zhi.armR, priceTie]);
    S.act('go', go); S.act('touch', () => touch(false));
    S.on('reset', () => { gp.lean=1;gp.presentBasket=0;handMode='knock';holdingSample=holdingCoin=false;ripple=0;audibleKnocks=2; knockT = 0; lastKn = -1; fast = false; dragging = false; shake = 0; flyAway = 0; spin = .12; rolling = swatting = licking = false; springing = false; pr.u = 0; });
    S.on('enter', async () => {
      await S.wait(1.6); S.set({ phase: 'ready' });
    });
    S.ui(() => storyPanel(st, {
      opening: '提菜籃的客人在收銀台前反覆敲瓜。松鼠夥計見她遲遲沒掏錢，拿出半價牌。',
      start: '掛上半價牌',
      checkpoint: '價錢砍半了，提菜籃的客人還在敲同一顆瓜。她到底想確認什麼？',
      action: '切一角給敲瓜的客人',
      ending: '客人嚐到甜味才掏錢。她一直怕買到不甜的瓜，切一角給她試吃，比降價有用。',
    }));

    S.tick((t, dt) => {
      rays.rotation.z += dt * .05;
      spin += (.12 - spin) * Math.min(1, dt * 1.2); canopy.rotation.y += dt * spin;
      tailT += dt; tail.rotation.z = Math.sin(tailT * (licking ? 18 : 6)) * .35;
      // the fly loops over the mountain; swatted, it zips off and comes back
      flyT += dt * (flyAway > 0 ? 4 : 1.6); flyAway = Math.max(0, flyAway - dt * .45);
      const fr = .35 + flyAway * 1.6;
      fly.position.set(Math.cos(flyT) * fr * 1.3, 1.35 + Math.sin(flyT * 2.3) * .1 + flyAway * .8, .1 + Math.sin(flyT) * fr * .5);
      if (springing) pull.set(pr.u);
      const L=gp.lean;
      gran.inner.rotation.z=-.095*L;gran.inner.position.y=0;
      gran.head.rotation.z-=.21*L;gran.eyes.position.x=gran.eyes.position.x*(1-L)+.022*L;
      gran.armL.rotation.set(0,0,-.48+1.23*gp.presentBasket);
      gran.rig.elbows[0].rotation.set(0,0,.19+.58*gp.presentBasket);
      bagGrip.rotation.z=-(gran.inner.rotation.z+gran.armL.rotation.z+gran.rig.elbows[0].rotation.z);
      let struck=false;
      if(handMode==='knock'){
        const period=fast?2.22:4.15,beat=fast?.36:.54;
        const finishingPair=knockT>0&&knockT<.16+2*beat;
        const active=!dragging&&!st.busy&&(audibleKnocks>0||finishingPair||(!fast&&!S.stage.still.matches));
        let hit=0;
        if(active){
          knockT+=dt;
          const whole=Math.floor(knockT/period),within=knockT-whole*period-.16;
          const index=Math.floor(within/beat),part=within/beat-index;
          if(index===0||index===1){
            hit=part<.42?S.T.MathUtils.smootherstep(part,0,.42):1-S.T.MathUtils.smootherstep(part,.55,1);
            const id=whole*2+index;
            if(part>=.42&&id!==lastKn){lastKn=id;struck=true;hit=1;if(audibleKnocks>0)audibleKnocks--;}
          }
        }
        contact.set(0,0,0);rindPoint.localToWorld(contact);gran.inner.worldToLocal(contact);
        handAim.copy(contact);
        handAim.x-=.104*(1-hit);handAim.y+=.091*(1-hit);
      }
      aimPaperHand(gran.armR,gran.rig.elbows[1],knuckle,handAim);
      if(struck){S.sound('melon',rindPoint);ripple=1;if(fast)shake=1;}
      ripple=Math.max(0,ripple-dt*4);marks.visible=ripple>.34&&!dragging;
      if(holdingSample){knuckle.localToWorld(scratch.set(0,.025,.016));plug.position.copy(melonK.worldToLocal(scratch));}
      if(holdingCoin){knuckle.localToWorld(scratch.set(.008,.019,.018));coin.position.copy(cg.worldToLocal(scratch));}
      slices[0].rotation.z=-(gran.inner.rotation.z+gran.armR.rotation.z+gran.rig.elbows[1].rotation.z);
      for(let i=1;i<slices.length;i++)slices[i].rotation.z=-slices[i].parent.rotation.z;
      shake = Math.max(0, shake - dt * 1.6);
      pile.position.x = Math.sin(t * 47) * .014 * shake; pile.rotation.z = Math.sin(t * 39) * .012 * shake;
    });
  },
};
