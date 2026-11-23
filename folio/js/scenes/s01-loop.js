// 第 1 頁｜啟程港｜唐心慧〈AI for Growth：看懂世界，加速成長〉p.6–11
// The tea maker is already at work when a passenger orders a cup. The chalkboard keeps each tasting.
import { storyPanel, pulse } from './reading-beats.js';
import { C, keep, box, cyl, cone, ball, disc, ring, beam, poly, card, tag, tab, cloud, flag } from '../paper.js';
import { quayStock, ferryHull, teaStall, originalGull } from './harbor-atelier.js';
import { harbourMechanisms, ticketPress } from './quayside-paper.js';
import { teaQuayScenery } from './quay-streetscape.js';
import { handLantern } from '../bamboo-hand-lantern.js';

const DIARY = '先端出一杯，臉會告訴我怎麼改。';
const TEA = ['#6f4326', '#a56d36', '#dba63f'];   // too strong, better, just right
const CHALK = '#fffaf0';

/** a chalk face: 'frown' | 'flat' | 'smile' */
function face(g, mood) {
  disc(g, 0, 0, -.022, .143, '#365758', .017, 22);
  ring(g, 0, 0, 0, .118, .013, CHALK, 20);
  for (const sx of [-1, 1]) disc(g, sx * .042, .034, 0, .017, CHALK, .012, 8);
  const m = mood === 'frown' ? [[-.052, -.062], [0, -.034], [.052, -.062]] : mood === 'smile' ? [[-.056, -.03], [0, -.066], [.056, -.03]] : [[-.048, -.046], [.048, -.046]];
  for (let i = 0; i < m.length - 1; i++) beam(g, [m[i][0], m[i][1], 0], [m[i + 1][0], m[i + 1][1], 0], .011, CHALK, 4);
}

function tastingCup(g, color) {
  g.name = '遞到手中的試飲杯';
  cyl(g, 0, .15, 0, .13, .087, .28, '#f9eccc', 12);
  cyl(g, 0, .152, 0, .114, .104, .065, '#4b7c76', 12);
  cyl(g, 0, .291, 0, .136, .127, .026, '#dfb879', 12);
  const tea = cyl(g, 0, .307, 0, .119, .119, .014, color, 12);
  beam(g, [.04, .313, 0], [.106, .473, 0], .014, C.red, 5);
  return tea;
}

export default {
  id: 's01-loop', land: 'prologue', short: '先端出一杯', calm: true,
  title: '新品還沒定案，該繼續改，還是先讓顧客試用？',
  sources: [{ n: 1 }],
  diary: DIARY,
  takeaway: '別等計畫完美：先小小試一次，看反應、調一下，再試。市場不會等。',
  quote: { t: '競爭優勢不在計劃更聰明，而在學習循環更快。', n: 1, page: 7 },
  look: { bg: '#39415f', table: '#7a86a8', key: '#ffd2ad', fill: '#b9c2f0', sky: '#ffe1d6' },   // dawn
  ground(G) {
    G.wash('#e7d8be');
    G.marks('dot', -5.94, -3.40, 5.94, 3.24, { n: 95, col: '#a7967f66', size: .026, seed: 191 });
  },
  build(S) {
    const st = S.state({ phase: 'intro', served: 0, busy: false });
    let hornT = 0, puffRate = .16, tinker = 0, gullBusy = false;
    quayStock(S, true);
    harbourMechanisms(S);
    teaQuayScenery(S);

    // ---- the ferry: it leaves when it leaves
    let ferry, funnel, deckGran, gull, wing; const puffs = [];
    S.plant(-1.58, -1.60, (g) => {
      ferry = keep(g);
      puffs.push(...ferryHull(ferry));
      funnel = keep(ferry, -.59, 1.71, .035);
      S.pad(funnel,.22,[0,0,0]);
      gull = keep(ferry, -.87, 1.35, .06);
      wing = originalGull(gull);
      deckGran = S.person(ferry, { x: 1.42, y: .5, z: .12, s: .62, kind: 'elder', species: 'civet', coat: '#b5654f', prop: false }); deckGran.root.visible = false;
      const onboardTea = keep(deckGran.inner,-.29,.44,.12); tastingCup(onboardTea,TEA[2]); onboardTea.scale.setScalar(.75);
    }, { s: 1.25, y: .17 });
    const horn = (audible = true) => { if (audible) S.sound('ferry-horn'); S.wiggle(funnel, .1); puffRate = .6; hornT = 0; };
    S.curio(funnel, { id: 'funnel', label: '渡輪汽笛', quiet: true, tap: () => horn() });
    S.discovery(gull,{id:'gull',label:'換到另一端欄杆的海鷗',duration:1.55,sound:'gull',
      draw(u,visit,still){
        const t=S.T.MathUtils.smootherstep(u,0,1),right=visit%2?t:1-t;
        gullBusy=!still && u<1;
        gull.position.set(-.87+right*1.68,1.35-.20*right+(still ? .07 : .88)*Math.sin(Math.PI*t),.06+.08*Math.sin(Math.PI*t));
      }});

    // ---- the place sign: the only words on the page
    S.plant(-4.8, .82, (g) => {
      tab(g, .5); beam(g, [0, 0, 0], [0, 1.25, 0], .035, C.bark, 6);
      tag(g, '啟程港', 0, 1.02, .04, { h: .27, paper: C.white, ink: C.navy });
    });

    // The shaded waiting bench belongs to this quay. A punched ticket is caught in the seat.
    S.plant(-3.13, .53, (g) => {
      const bench = keep(g);
      tab(bench, 1.75);
      for (const x of [-.73, .73]) {
        beam(bench, [x,.02,.21], [x,.35,.1], .039, '#335c59', 5);
        beam(bench, [x,.02,-.18], [x,.73,-.18], .043, '#335c59', 5);
        beam(bench, [x,.33,-.18], [x,.33,.23], .037, '#335c59', 5);
        beam(bench, [x,.18,-.12], [x,.33,.1], .018, '#66847a', 4);
      }
      for (let i=0;i<3;i++) box(bench,0,.355,-.12+i*.14,1.70,.042,.116,i===1?'#af8762':'#c69a69');
      for (const y of [.56,.70]) {
        box(bench,0,y,-.15,1.74,.105,.061,'#609184');
        for (const x of [-.73,.73]) disc(bench,x,y,-.114,.018,'#e2c495',.009,8);
      }
      ticketPress(S,bench);
    },{ry:.12,y:.19});

    // ---- bollards, a rope and a crab at the edge of the pier
    let crab;
    for (const x of [-5.4, -3.0, 3.2, 5.5]) S.plant(x, .36, (g) => { cyl(g, 0, .2, 0, .1, .13, .4, C.bark, 8); cyl(g, 0, .42, 0, .15, .15, .06, C.dark, 8); });
    S.plant(4.35, .38, (g) => {
      beam(g, [-1.1, .34, 0], [-.55, .12, 0], .02, C.kraft, 5); beam(g, [-.55, .12, 0], [.55, .12, 0], .02, C.kraft, 5); beam(g, [.55, .12, 0], [1.1, .34, 0], .02, C.kraft, 5);
      crab = keep(g, -.3, .06, .22);
      const b = ball(crab, 0, .07, 0, .1, C.red, 1); b.scale.set(1.25, .6, .8);
      for (const sx of [-1, 1]) { ball(crab, sx * .15, .15, .02, .045, C.red, 0); for (let i = 0; i < 3; i++) beam(crab, [sx * .09, .05, -.03 + i * .04], [sx * .19, 0, -.05 + i * .06], .011, C.deep, 4); disc(crab, sx * .035, .14, .07, .014, C.ink, .01, 6); }
    });
    S.pad(crab,.19,[0,.09,0]);
    S.discovery(crab,{id:'crab',label:'繫船繩下的招潮蟹',duration:.91,
      draw(u,visit,still){
        const right=visit%2===1, t=S.T.MathUtils.smootherstep(u,0,1);
        crab.position.x=right?-.30+.85*t:.55-.85*t;
        crab.rotation.z=still?0:Math.sin(u*Math.PI*6)*.13*Math.sin(Math.PI*u);
      }});

    // The ship's gangway sits flush on the pier, then crosses the water when she is ready to board.
    let gangway;
    S.plant(.31,.39,(g)=>{
      gangway=keep(g,0,.077,0);
      for(let i=0;i<9;i++) box(gangway,0,.015,-.061-i*.121,.475,.046,.108,i%2?'#a88b65':'#c7a574');
      for(const x of [-.225,.225]) {
        box(gangway,x,.016,-.55,.029,.070,1.115,'#557773');
        for (const z of [-.15,-.65,-.98]) box(gangway,x,.064,z,.038,.025,.043,'#d6b575');
      }
      gangway.scale.z=.2;
    });

    let slip, zhi, stallSteam; const tins = [], tower = [], cups = [], faces = [], recipes=[];
    S.plant(2.10, -.13, (g) => {
      stallSteam=teaStall(g);
      // The stripe on each tea tin matches the strength on the tasting card.
      TEA.forEach((color, i) => {
        const x = .38 + i * .19;
        const tin = keep(g, x, 1.045, -.33); tins.push(tin);
        cyl(tin, 0, 0, 0, .072, .073, .245, '#a59a74', 10);
        cyl(tin, 0, .011, 0, .075, .075, .074, color, 10);
        cyl(tin, 0, .131, 0, .077, .077, .031, '#d3b480', 10);
      });
      for (let i=0;i<3;i++) ring(g,-.55+i*.31,.545,.510,.123,.006,'#8e9b82',16);
      // The paper card matches the three tasting cups and their chalked reactions.
      slip = keep(g, -.89, .41, .496); slip.rotation.z = .07;
      card(slip, 0, 0, 0, .38, .3, C.white, .012, .02);
      TEA.forEach((color, i) => {
        poly(slip, [[-.038, .04], [.038, .04], [.029, -.028], [-.029, -.028]], .007, color, -.117 + i * .116, .155, .014);
        // Thumbing the three cards fans out the recipe. The visible leaf count matches the drink's strength.
        const tip=keep(slip,0,.21,.026+i*.012);
        card(tip,0,0,0,.22,.45,'#f6e4b9',.009,.018);
        box(tip,0,.402,.018,.19,.045,.009,color);
        for(let n=0;n<3-i;n++) {
          const leaf=poly(tip,[[-.058,-.018],[-.032,.036],[.062,.04],[.036,-.014],[-.036,-.038]],.007,'#57766a',0,.12+.086*n,.019);
          leaf.rotation.z=n%2?-.26:.16;
        }
        tip.visible=false;recipes.push(tip);
      });
      zhi = S.robot(g, { species: 'otter', x: -.06, y: .54, z: -.10, s: 1.37, prop: false, lights: 0 });
      // everything it will make: a tower of cups it keeps adjusting
      for (let r = 0; r < 4; r++) for (let j = 0; j < 4 - r; j++) {
        const k = keep(g, .3 + r * .085 + j * .17, .923 + r * .232, .155); cyl(k, 0, .11, 0, .075, .058, .22, C.white, 10); cyl(k, 0, .224, 0, .07, .07, .012, ['#8a5a30', '#b9803f', '#6f4326'][(r + j) % 3], 10);
        k.visible = false; tower.push(k);
      }
      // the cup that actually gets served: three tries
      for (let i = 0; i < 3; i++) {
        const k = keep(g, -.96, .923, .485); tastingCup(k, TEA[i]);
        k.visible = i === 0; cups.push(k);
      }
      // her three faces, kept in order on the front of the counter
      ['frown', 'flat', 'smile'].forEach((m, i) => { const k = keep(g, -.55 + i * .31, .545, .531); face(k, m); k.visible = false; faces.push(k); });
    }, { s: 1.44, y: .17 });
    S.discovery(slip,{id:'slip',label:'畫著茶葉用量的三杯試喝單',duration:.82,sound:'paper',
      draw(u,visit){
        const t=S.T.MathUtils.smootherstep(u,0,1),open=visit%2?t:1-t;
        recipes.forEach((tip,i)=>{
          tip.visible=open>.015;tip.rotation.z=(1-i)*.74*open;tip.scale.y=Math.max(.02,open);
        });
      }});
    S.hero(zhi, { label: '水獺茶師', ready: () => st.phase === 'ready', go });

    // The lantern maker lifts the shade just enough to catch the tea's colour.
    let ce, workCup, workTea, workLantern, cupLook=0;
    S.plant(2.24, 1.97, (g) => {
      ce = S.person(g, { s: 1.47, species: 'pangolin' });
      workLantern=handLantern(ce.rig,ce.inner,{size:.92});
      const bench=keep(g,-.85,0,.36);
      for(const [x,z] of [[-.15,.075],[.15,.075],[0,-.14]]){
        beam(bench,[x*.65,.412,z*.65],[x*1.12,.014,z*1.12],.018,'#916747',5);
      }
      cyl(bench,0,.423,0,.222,.217,.037,'#bd9062',14);
      workCup=keep(bench,-.013,.444,.008);
      workTea=tastingCup(workCup,TEA[0]);workCup.scale.setScalar(.73);
      workTea.material=workTea.material.clone();workTea.userData.raw=true;
      workCup.name='燈骨師傅照著看的試茶杯';
    }, {y:.19});
    const workSeat=workCup.position.clone();
    const workScale=workCup.scale.clone();
    const focusCup=()=>{cupLook=1.32;S.sound('cup',workCup);};
    const cp=S.curio(ce.root,{id:'ce',label:'提竹燈看茶色的穿山甲師傅',aim:[-.13,.74,.08],quiet:true,tap:focusCup});ce.propId=cp.id;
    const nearPaw=new S.T.Vector3(),freePaw=new S.T.Vector3(.24,.45,.10);
    S.tick((t,dt)=>{
      cupLook=Math.max(0,cupLook-dt);
      const lean=cupLook ? Math.sin(Math.PI*cupLook/1.32) : 0;
      nearPaw.set(-.42-.045*lean,.88-.095*lean,.17+.023*lean);
      ce.rig.aimGrip(0,nearPaw,-.042);
      if(ce.waveT<=0&&ce.mood==='idle')ce.rig.aimGrip(1,freePaw,.07);
      ce.head.rotation.z+=.11*lean;
      workLantern.boost=lean;
      workLantern.hang(t,S.stage.still.matches?0:.024+.046*lean);
    });

    // ---- the vegetable seller waiting for the next ferry
    let gran, basket, radish, lastCup, receivingPaw;
    S.plant(-5.6, 1.35, (g) => {
      gran = S.person(g, { x: 4.78, z: .11, s: 1.49, kind: 'elder', species: 'civet', coat: '#b5654f' });
      const scarf = keep(gran.inner); poly(scarf,[[-.14,.775],[.14,.775],[.02,.57]],.013,'#e3b35d',0,0,.045);
      receivingPaw=keep(gran.rig.elbows[0],.008,-.154,.065);
      receivingPaw.name='黃領巾客人接茶的空手';
      lastCup=keep(receivingPaw,-.045,-.115,.026); tastingCup(lastCup,TEA[2]); lastCup.scale.setScalar(.79); lastCup.visible=false;
      basket = keep(g, 4.2, 0, .25);
      box(basket, 0, .12, 0, .42, .24, .3, C.kraft); box(basket, 0, .245, 0, .46, .03, .34, C.wood); beam(basket, [-.2, .25, 0], [0, .5, 0], .015, C.wood, 4); beam(basket, [0, .5, 0], [.2, .25, 0], .015, C.wood, 4);
      for (const x of [-.1, .12]) { ball(basket, x, .3, .02, .09, C.leaf, 0); }
      radish = keep(basket, 0, .3, .08); cone(radish, 0, .02, 0, .06, .2, C.white, 7).rotation.z = Math.PI; for (const sx of [-1, 0, 1]) poly(radish, [[-.02, 0], [.02, 0], [sx * .05, .13]], .012, C.leaf, 0, .1, 0);
    }, {y:.19});
    const gp = S.curio(gran.root, { id: 'gran', label: '等船的阿梅姨', quiet:true, tap: () => { gran.wave(.83); } }); gran.propId = gp.id;
    S.discovery(basket,{id:'basket',label:'露出蘿蔔葉的菜籃',duration:1.1,sound:'cloth',
      draw(u,visit){
        const lift=Math.sin(Math.PI*u)**2;
        radish.position.y=.3+.36*lift;radish.rotation.z=(visit%2?-.34:.34)*lift;
      }});

    // ---- the story
    const canServe=()=>!st.busy && (st.phase==='ready' || st.phase==='serve');
    function hintCup() {
      S.hint(cups[st.served],[0,.21,0],'拖茶杯給黃領巾客人');
    }
    function readyWorkCup(k) {
      workTea.material.color.set(TEA[k]);
      workCup.position.copy(workSeat);workCup.scale.copy(workScale);
      workCup.rotation.z=0;workCup.visible=true;workCup.userData.inHand=false;
    }
    async function go() {
      if (st.phase !== 'ready') return; S.hint(null); S.set({ phase: 'busy' });
      zhi.cheer(); S.sound('whoosh');
      for (let i = 0; i < tower.length; i++) { S.show(tower[i], .2); if (i % 3 === 0) S.sound('tick'); await S.wait(.1); }
      await S.wait(.5); gran.doubt(); horn();            // the ferry is getting ready and she has not had a sip
      await S.wait(.9); zhi.still();
      S.pop(cups[0],1.08); S.sound('cup');
      S.set({ phase: 'serve' }); hintCup();
    }
    async function serve(byHand, cup = cups[st.served]) {
      if (!canServe() || !cup?.visible || st.served >= cups.length) return;
      const k = st.served, f = faces[k];
      S.hint(null); S.set({ phase:'serve', busy:true });
      if (cup === workCup) { cups[k].visible=false; workCup.userData.inHand=true; }
      const align = (anchor, offset) => S.local(cup.parent, S.world(anchor))
        .sub(S.local(cup.parent, S.world(cup, offset)).sub(cup.position));
      const palm = align(receivingPaw,[-.08,.14,0]);
      await S.to(cup.position, { x: palm.x, y: palm.y, z: palm.z }, byHand ? .16 : .48, 'inOut');
      // Aim the straw tip, including this particular cup's scale and drinking angle.
      cup.rotation.z=-.28;
      const sip = align(gran.rig.mouth,[.106,.473,0]);
      cup.rotation.z=0;
      S.to(cup.rotation,{z:-.28},.26,'inOut');
      await S.to(cup.position,{x:sip.x,y:sip.y,z:sip.z},.26,'inOut'); S.sound('soft');
      await S.wait(.25);
      S.hide(cup, .16); if(k===2) lastCup.visible=true;
      gran.still(); gran.hop(.12);
      if (k === 0) gran.doubt(); else if (k === 2) gran.cheer(); else gran.wave(1.4);
      // her face: first over her head, then chalked on the counter
      const slot = f.position.clone(), from = S.local(f.parent, S.world(gran.root, [0, 1.62, .12]));
      f.position.copy(from); f.visible = true; f.scale.setScalar(.001); S.to(f.scale, { x: 2.1, y: 2.1, z: 2.1 }, .35, 'back'); S.sound('tick');
      await S.wait(1.0);
      ce.still(); ce.hop();
      S.to(f.scale, { x: 1, y: 1, z: 1 }, .5, 'inOut'); await S.to(f.position, { x: slot.x, y: slot.y, z: slot.z }, .5, 'inOut'); S.sound('tap');
      st.served = k + 1;
      if (k < 2) {
        zhi.hop(); S.sound('whoosh'); for (let i = k; i < tower.length; i += 2) S.pop(tower[i], 1.3);   // it changes the recipe at once
        await S.wait(.5); gran.still();
        S.sound('pour'); readyWorkCup(k+1); await S.show(cups[k + 1], .3); S.sound('cup'); st.busy = false; S.refresh(); hintCup();
        return;
      }
      // the third one is right: she takes it aboard, and the ferry leaves on time
      workCup.userData.inHand=false;
      workCup.position.copy(workSeat); workCup.visible=false;
      zhi.cheer(); ce.cheer();
      await S.to(gangway.scale,{z:1.85},.6,'inOut'); S.sound('tap');
      await S.wait(.4); gran.still(); S.hide(basket, .2);
      await S.walk(gran, { x: 5.9, z: -2.15 }, 1.2);
      gran.root.visible = false; deckGran.root.visible = true; deckGran.wave(5); horn();
      S.to(gangway.scale,{z:.2},.58,'inOut');
      zhi.still(); ce.still();
      const lamp = zhi.setLights(1); if (lamp) S.pop(lamp, 3.2); S.sound('rise');
      zhi.wave(2); ce.wave(1.6);
      await S.to(ferry.position, { x: -.95 }, 3.2, 'inOut');
      S.set({ phase: 'done' }); S.done();
    }
    function recipientTargets(cup) {
      if (!canServe()) return [];
      const head=S.stage.project(S.world(gran.inner,[0,1.18,0]));
      const feet=S.stage.project(S.world(gran.inner));
      const radius=Math.max(20,.31*Math.hypot(head.x-feet.x,head.y-feet.y));
      const points=[S.world(receivingPaw),S.world(gran.rig.mouth),S.world(gran.inner,[0,.58,.08]),S.world(gran.rig.elbows[1],[0,-.15,.06])];
      return points.map(point=>({at:()=>point,r:radius,acceptPointer:true,drop:()=>serve(true,cup)}));
    }
    function registerCup(cup, options) {
      return S.carry(cup,{...options,pad:.29,padAt:[0,.22,0],aim:[0,.18,0],
        start() {
          if(!canServe()) return;
          cupLook=0;
          workCup.userData.inHand=cup===workCup;
          S.focus(S.stage.view.focus);
          S.hint(receivingPaw,[0,0,0],'放到客人手邊');
        },
        end() {
          workCup.userData.inHand=false; S.focus(null);
          if(canServe()) hintCup();
        },
        targets:()=>recipientTargets(cup)
      });
    }
    cups.forEach((cup,i)=>registerCup(cup,{id:'cup'+i,label:'拖茶杯給黃領巾客人',tap:()=>serve(false,cup)}));
    registerCup(workCup,{id:'work-cup',kind:'curio',label:'竹燈下也能遞給客人的試茶杯',quiet:true,tap:focusCup});
    S.onReadyLoop((phase) => {
      // Compare two tea tins while the customer reaches out with an empty hand.
      const strong = pulse(phase, .03, .45), mild = pulse(phase, .36, .79);
      tins[0].position.y += .18 * strong; tins[0].rotation.z -= .24 * strong;
      tins[2].position.y += .18 * mild; tins[2].rotation.z += .21 * mild;
      zhi.head.rotation.y += .39 * (mild - strong);
      gran.armR.rotation.z += .95 * pulse(phase, .57, .96);
    }, 5.4, [tins[0], tins[2], zhi.head, gran.armR]);
    S.act('go', go); S.act('serve', () => serve(false));
    S.on('reset', () => { hornT = 0; puffRate = .16; tinker = 0; gullBusy = false; cupLook=0; readyWorkCup(0); });
    S.on('enter', async () => {
      gran.wave(1.25); zhi.wave(.75);
      await S.wait(.7); S.set({ phase: 'ready' }); hintCup();
    });
    S.ui(() => storyPanel(st, {
      opening: '「一杯茶，帶上船！」繫黃領巾的客人趕著搭船，水獺茶師還拿不定要泡多濃。',
      start: '看茶師備茶',
      checkpoint: [
        '茶師試了一整排濃淡，繫黃領巾的客人還沒喝到第一口。',
        '第一杯太濃，客人皺起眉頭。茶師把第二杯泡淡了。',
        '第二杯淡了些，她還是抿抿嘴。第三杯再少放一撮茶葉。',
      ][st.served],
      action: ['遞第一杯給等船的客人', '請客人再喝一口', '遞出第三杯'][st.served],
      actionId: 'serve',
      ending: '第三杯剛好，客人笑著帶上船。先讓顧客試一口，才知道下一杯該怎麼改。',
    }));

    S.tick((t, dt) => {
      for (const [i,curl] of stallSteam.entries()) {
        const u=(t*.44+i*.50)%1;
        curl.position.y=1.315+u*.22; curl.scale.setScalar(.60+.27*Math.sin(Math.PI*u));
      }
      ferry.position.y = Math.sin(t * 1.6) * .03; ferry.rotation.z = Math.sin(t * 1.3) * .012;
      puffRate += (.16 - puffRate) * Math.min(1, dt * .6);
      puffs.forEach((p, i) => { const u = (t * puffRate * 2 + i / 3) % 1; p.position.set(-.58 - u * .59, 2.03 + u * .83, -.025); p.scale.setScalar(Math.max(.001, (.32 + u * 1.14) * (1 - u * u))); });
      wing.forEach((w,i)=>{ w.rotation.z = (i ? -1 : 1)*(gullBusy ? Math.sin(t*18)*.52 : Math.sin(t*1.9)*.025); });
      crab.position.y = .06 + Math.abs(Math.sin(t * 3)) * .012;
      if (st.phase === 'serve') {
        hornT += dt; if (hornT > 7) horn(false);              // the ferry will not wait for a perfect cup
        tinker += dt; if (tinker > .55 && !st.busy) { tinker = 0; S.pop(tower[Math.floor(t * 7) % tower.length], 1.18); }
      }
    });
  },
};
