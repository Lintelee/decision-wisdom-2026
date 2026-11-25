// 第 2 頁｜相機屋｜邵懿文〈品牌與人的真實距離〉p.12–17
// 相機屋的奶瓶：港邊照相館的牆上掛著一張嬰兒照（戴著小漁帽）。水獺漁夫收工，熱得想喝一杯。
// 店員盯著那張照片，端出奶瓶、搖鈴、圍兜；把它帶到本人面前從頭看到腳，才端上一大杯冰茶。
import { storyPanel, pulse } from './reading-beats.js';
import { C, keep, box, cyl, cone, ball, disc, ring, beam, poly, card, tag, tab, cloud, cratePlank, skyDisc } from '../paper.js';
import { quayStock, cameraWorkshop, fishingBoat, paperSun, paperCloud } from './harbor-atelier.js';
import { photoQuayScenery } from './quay-streetscape.js';
import { studioMechanisms } from './quayside-paper.js';
import { buildOtterPortrait } from '../resident-puppets.js';

const DIARY = '照片是那一天，人是今天的。';
const HAT = C.gold;                       // the little fisherman's hat: on the baby in the photo, and on the man today
const SKIN = '#d9a47a', BEARD = '#6b4a35', TEA = '#c9822f';
const WALL = '#f1e2c4', SILVER = '#d5d8d6';
const lerp = (a, b, t) => a + (b - a) * t;

function fishingHat(head) {
  cyl(head, 0, .359, 0, .30, .30, .026, HAT, 12);
  cyl(head, 0, .431, 0, .171, .218, .133, HAT, 12);
  cyl(head, 0, .388, 0, .211, .220, .028, '#c28c3a', 12);
}

// Print the same face and fishing hat as the live figure. Body size and bib date the first photo.
function portrait(g, grown) {
  g.name = '相館的相紙';
  card(g, 0, -.33, 0, .56, .62, grown ? '#bad4d0' : C.sky, .02, .02);
  const shoulder = grown ? .25 : .18;
  poly(g, [[-shoulder,-.33],[shoulder,-.33],[shoulder*.72,-.195],[.062,-.14],[-.062,-.14],[-shoulder*.7,-.193]],
    .012, grown ? C.teal : C.white, 0,0,.026);
  if (grown) poly(g,[[-.101,-.17],[-.01,-.228],[.093,-.177],[.037,-.234],[-.012,-.262]],.004,'#d49a61',0,0,.041);
  else poly(g,[[-.086,-.176],[.077,-.176],[.051,-.251],[-.043,-.256]],.005,'#dfbb81',0,0,.042);
  const {head} = buildOtterPortrait(g);
  head.name = grown ? '今天的水獺漁夫' : '戴漁帽的水獺寶寶';
  head.position.set(-.025, grown ? -.151 : -.164, .072);
  head.scale.set(grown ? .67 : .62, grown ? .67 : .65, .14);
  fishingHat(head);
}

export default {
  id: 's02-distance', land: 'prologue', short: '看今天的他', calm: true,
  title: '顧客的生活變了，品牌怎麼知道他今天需要什麼？',
  sources: [{ n: 2 }],
  diary: DIARY,
  takeaway: '比的不是誰用了更多 AI，是誰更懂人。AI 最該做的，是幫你更快、更準地懂人：從問一次就結束，變成隨時能問。',
  quote: { t: 'Agentic 時代，戰場上比的不是誰用了更多 AI，而取決於誰更懂人。', n: 2, page: 13 },
  look: { bg: '#2f5672', table: '#6f93ab', key: '#ffe6c4', fill: '#bfd6f5', sky: '#fff1e0' },   // just after dawn
  ground(G) {
    G.wash('#e6d9c2');
    G.marks('dot',-5.88,-3.35,5.86,3.10,{n:75,col:'#ad9b8266',seed:53,size:.027});
  },
  build(S) {
    const T = S.T, V = (x, y, z) => new T.Vector3(x, y, z);
    const st = S.state({ phase: 'intro', busy: false });
    quayStock(S, false);
    studioMechanisms(S);
    const follow = new Map();                 // node -> () => world position it sticks to
    const arms = new Map();                   // arm -> {w, z}: holds a puppet's arm in a pose
    const scan = { u: -1 };                   // 0 -> 1: the studio clerk's look runs from his hat down to his boots
    let wipe = false, beamTo = null, sweatT = 0, exposing=false;

    // ---------------------------------------------------------------- the camera house
    let flash, glow, shutter, cap, frame, tilt, keepsake, today, cat, catIn, rattle0, swing, plank;
    const curtains=[], tether=[];
    photoQuayScenery(S);
    S.plant(-2.35, -1.05, (g) => {
      const optic=cameraWorkshop(S,g);
      // The framed portraits hang at eye level on the darkroom's exhibition board.
      box(g,.36,.67,.39,1.58,1.02,.053,'#586654');
      for (const x of [-.41,1.12]) box(g,x,.67,.427,.041,1.08,.041,'#b69872');
      // the door, with a curtain the cat hides behind
      box(g, -.68, .47, .452, .56, .94, .01, '#7a5237');
      box(g, -.68, .44, .456, .46, .86, .01, '#4a3326');
      cat = keep(g, -.68, .65, .59); catIn = keep(cat); catIn.position.x=-.20;
      { const cat = catIn; const h = ball(cat, 0, 0, 0, .1, C.ink, 1); h.scale.set(1, .85, .5);
        for (const sx of [-1, 1]) { poly(cat, [[-.035, 0], [.035, 0], [0, .08]], .02, C.ink, sx * .055, .05, -.01); disc(cat, sx * .036, .01, .05, .017, C.lime, .008, 8); }
        poly(cat, [[-.012, -.03], [.012, -.03], [0, -.045]], .008, C.pink, 0, 0, .05); }
      for (const sx of [-1, 1]) {
        const c=keep(g,-.68+sx*.151,.89,.636);
        poly(c,[[-.144,0],[.144,0],[.142,-.39],[-.142,-.39]],.014,'#b96c51');
        for(const x of [-.075,.072]) box(c,x,-.20,.016,.014,.34,.009,'#da9873');
        curtains.push(c);
      }
      box(g, -.68, .89, .53, .56, .03, .1, C.bark);
      // a reclaimed market plank: the step in front of the door
      box(g, -.68, .1, .58, .6, .03, .26, C.wood);
      plank = cratePlank(g, -.68, .045, .72, { len: .62, h: .09, thick: .04 });
      // the photo of the baby, and an empty nail for one more photo
      frame = keep(g, .067, 1.07, .764); const frameIn = keep(frame); tilt = frameIn;
      card(frameIn, 0, -.38, -.02, .68, .76, C.wood, .02, .03); portrait(keep(frameIn), false);
      beam(frameIn, [-.2, .38, -.01], [0, .5, -.01], .008, C.bark, 4); beam(frameIn, [.2, .38, -.01], [0, .5, -.01], .008, C.bark, 4);
      ball(g,.067,1.57,.758,.025,C.bark);ball(g,.763,1.57,.758,.025,C.bark);
      // A small album pocket unfolds below the old photo; its rattle is the one still on the studio hook.
      keepsake=keep(frameIn,0,-.34,.045);keepsake.visible=false;
      card(keepsake,0,-.43,0,.52,.43,'#efdfb7',.019,.025);
      for(const x of [-.20,.20]) beam(keepsake,[x,-.05,.025],[x,-.37,.025],.007,'#c59b6c',4);
      beam(keepsake,[-.10,-.31,.039],[.084,-.123,.039],.021,'#a47747',6);
      disc(keepsake,.057,-.151,.054,.080,'#c16f54',.023,12);
      ring(keepsake,.057,-.151,.074,.087,.012,HAT,12);
      today = keep(g, .763, 1.07, .764);
      card(today, 0, -.38, -.02, .64, .76, C.wood, .02, .03); portrait(keep(today), true);
      beam(today, [-.2, .38, -.01], [0, .5, -.01], .008, C.bark, 4); beam(today, [.2, .38, -.01], [0, .5, -.01], .008, C.bark, 4);
      today.visible = false;
      // the rattle a studio waves to make babies look at the camera
      rattle0 = keep(g, -.31, 1.1, .5); const r0 = keep(rattle0); swing = r0;
      beam(r0, [0, 0, 0], [0, -.22, 0], .006, C.ink, 3);
      beam(r0, [0, -.22, 0], [0, -.38, 0], .018, C.white, 5); ball(r0, 0, -.45, 0, .07, C.coral, 1); ring(r0, 0, -.45, 0, .085, .012, HAT, 14);
      // The painted bellows camera sits under the studio gable. The loose cap hangs from its real lens.
      cap = keep(optic, .42, .03, .18);
      for(let i=0;i<2;i++){const link=keep(optic);cyl(link,0,.5,0,.008,.008,1,C.ink,5);tether.push(link);}
      disc(cap, 0, -.12, 0, .14, '#26272b', .03, 20); disc(cap, 0, -.12, .02, .1, SILVER, .01, 18);
      shutter = keep(optic, .29, .43, .03); cyl(shutter, 0, .04, 0, .08, .08, .08, C.red, 12);
      flash = keep(optic, -.40, .44, -.03);
      beam(flash, [0, 0, 0], [0, .24, 0], .025, SILVER, 6);
      const dish = cone(flash, 0, .36, .02, .25, .14, SILVER, 16); dish.rotation.x = -Math.PI / 2;
      ball(flash, 0, .36, .1, .07, C.white, 1);
      glow = new T.Mesh(new T.CircleGeometry(.5, 24), new T.MeshBasicMaterial({ color: '#fffbe8', transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
      glow.position.set(0, .36, .16); glow.userData.raw = true; glow.visible = false; flash.add(glow);
    }, { s: 1.35, y:.17 });
    const eyelet=V(.18,.27,.16),sag=V(0,0,0),length=V(0,0,0),up=V(0,1,0);
    function hangCord(closed){
      sag.copy(eyelet).lerp(cap.position,.51);sag.y-=.042+.132*closed;sag.z+=.012;
      tether.forEach((link,i)=>{
        const from=i?sag:eyelet,to=i?cap.position:sag;
        length.copy(to).sub(from);link.position.copy(from);link.scale.y=length.length();
        link.quaternion.setFromUnitVectors(up,length.normalize());
      });
    }
    hangCord(0);
    const pop = async () => {                       // the camera goes click: the button dips, the flash fires
      if(exposing)return;exposing=true;
      S.sound('shutter'); S.to(shutter.position, { y: .40 }, .08).then(() => S.to(shutter.position, { y: .43 }, .2, 'back'));
      const quiet=S.stage.still.matches,extent=quiet?1.05:2.64;
      glow.visible = true; glow.material.opacity=quiet ? .32 : .81; glow.scale.setScalar(.3);
      S.to(glow.scale,{x:extent,y:extent,z:extent},.42,'out');await S.to(glow.material,{opacity:0},.52,'in');glow.visible=false;exposing=false;
    };
    S.curio(flash, { id: 'flash', label: '按下相機快門', quiet: true, tap: pop });
    S.discovery(frame,{id:'frame',label:'嬰兒照相框裡的搖鈴留影',duration:.77,sound:'film-reel',
      draw(u,visit,still){
        const t=T.MathUtils.smootherstep(u,0,1),open=visit%2?t:1-t;
        keepsake.visible=open>.012;keepsake.rotation.x=-(1-open)*2.95;
        tilt.rotation.z=still?0:.045*Math.sin(Math.PI*u);
      }});
    S.discovery(cap,{id:'cap',label:'繫在鏡筒上的防塵蓋',duration:1.18,sound:'lid',
      draw(u){
        const closed=T.MathUtils.smoothstep(u,0,.33)*(1-T.MathUtils.smoothstep(u,.62,1));
        cap.position.set(.42-.54*closed,.03+.30*closed,.18+.111*closed);
        cap.rotation.y=Math.sin(Math.PI*closed)*.57;
        hangCord(closed);
      }});
    const peep=S.discovery(cat,{id:'cat',label:'藏在布簾後的相館貓',duration:1.31,sound:['cloth','meow'],
      draw(u,visit,still){
        const side=visit%2?1:-1,t=T.MathUtils.smoothstep(u,.05,.52);
        catIn.position.set(side*(-.20+.40*t),.05*Math.sin(Math.PI*t),.015+.11*t);
        catIn.rotation.z=side*(still ? .08 : .25)*t;
        curtains.forEach((c,i)=>{
          const near=(i===1)===(side===1),open=near?t:1-t;
          c.rotation.z=(i===1?1:-1)*.58*open;
        });
      }});
    S.pad(cat,.22,[0,-.03,.04]);
    S.discovery(rattle0,{id:'rattle',label:'用來吸引寶寶看鏡頭的搖鈴',duration:.71,sound:'clip',
      draw(u,_visit,still){swing.rotation.z=Math.sin(Math.PI*(still?2:4)*u)*(1-u)*.78;}});
    S.curio(plank,{id:'plank',label:'會驚動布簾後小貓的門階',quiet:true,tap:()=>{S.sound('front-step');peep.tap();}});

    // ---------------------------------------------------------------- the place sign, the sun, the boat he came in on
    S.plant(-4.75, .35, (g) => { tab(g, .5); beam(g, [0, 0, 0], [0, 1.3, 0], .035, C.bark, 6); tag(g, '相機屋', 0, 1.07, .04, { h: .27, paper: C.white, ink: C.navy }); });
    let rays;
    S.plant(3.9, -3.25, (g) => { rays = paperSun(g,2.63,.46); });
    let shade;
    S.plant(-5.0, -3.15, (g) => paperCloud(g,1.18,2.32)); S.plant(1.1, -3.3, (g) => {shade=keep(g);paperCloud(shade,1.28,2.50);});
    S.discovery(rays,{id:'sun',label:'時晴時陰的港口日光',duration:1.25,sound:'gull',
      draw(u,visit){const t=T.MathUtils.smootherstep(u,0,1),cover=visit%2?t:1-t;shade.position.set(2.68*cover,.13*cover,.33*cover);}});
    let boat;
    S.plant(1.37, -1.82, (g) => {
      boat = keep(g);
      fishingBoat(boat);
    },{s:1.18});
    S.plant(3.55, -.96, (g) => {
      const K=window.PaperKit;
      K.at(g,K.cyl(.21,.17,.34,12,'#6a8187'),0,.17,0);
      K.at(g,K.cyl(.22,.21,.026,12,'#c7bda6'),0,.36,0);
      for (const [x,r] of [[-.087,.5],[.063,-.4],[0,.12]]) {
        const h=K.cut([[-.13,0],[.035,.055],[.13,.008],[.195,.063],[.17,-.053],[.13,0],[.02,-.049]],.028,'#a1b8ae','#e0d8bb');
        K.at(g,h,x,.415,.012);h.rotation.z=r+1.05;
      }
    });

    // ---------------------------------------------------------------- the fisherman, back from the sea
    let fisher, fisherArt, wish, sweat, laugh, dots;
    const fp = S.plant(2.05, 1.15, (g) => {
      fisherArt = g;
      fisher = S.person(g, { x: .9, z: -1.25, s: 1.67, kind: 'adult', species: 'otter', coat: C.teal, hair: BEARD, skin: SKIN, legs: '#3c4a52' });
      const h = fisher.head;
      fishingHat(h);
      laugh = keep(h, 0, .06, .06); poly(laugh, [[-.06, 0], [.06, 0], [0, -.06]], .008, C.deep); laugh.visible = false;
      sweat = keep(h, .17, .3, .06);
      for (const [x, y] of [[0, 0], [.08, -.1]]) poly(sweat, [[-.025, 0], [.025, 0], [0, .06]], .01, C.aqua, x, y, 0).rotation.z = .2;
      sweat.visible = false;
      // what he wants: a cold glass of something
      wish = keep(fisher.root, -.62, 1.45, .05);
      card(wish, 0, 0, 0, .52, .48, C.white, .03, .2); disc(wish, .24, -.06, 0, .05, C.white, .03, 12); disc(wish, .33, -.13, 0, .03, C.white, .03, 10);
      poly(wish, [[-.08, .08], [.08, .08], [.1, .36], [-.1, .36]], .01, TEA, 0, 0, .035);
      for (const [x, y] of [[-.04, .3], [.035, .27]]) box(wish, x, y, .048, .05, .05, .01, C.white);
      beam(wish, [.03, .3, .05], [.1, .44, .05], .01, C.red, 4);
      wish.visible = false;
      dots = keep(fisher.root, -.62, 1.45, .05); card(dots, 0, 0, 0, .52, .3, C.white, .03, .14); disc(dots, .24, -.05, 0, .045, C.white, .03, 12);
      for (let i = 0; i < 3; i++) disc(dots, -.13 + i * .13, .15, .035, .042, C.navy, .02, 10);
      dots.visible = false;
    }, { y: .21 });
    const fpp = S.curio(fisher.root, { id: 'fisher', label: '戴黃帽的漁夫',quiet:true,tap:() => { if(st.phase==='ready'){fisher.wave(1.15);S.pop(wish,1.13);} else fisher.wave(.8); } }); fisher.propId = fpp.id;

    // what the studio clerk makes for him: from the photo, then from the man himself
    let bottle, bib, rattle, tea;
    {
      const g = fisherArt;
      bottle = keep(g); cyl(bottle, 0, .085, 0, .068, .068, .17, C.white, 12); cyl(bottle, 0, .21, 0, .064, .064, .08, '#cfe9f0', 12); for (const y of [.06, .12, .18]) box(bottle, 0, y, .068, .05, .008, .006, C.blue); cyl(bottle, 0, .265, 0, .074, .074, .04, C.coral, 12); cone(bottle, 0, .33, 0, .04, .1, C.honey, 10);
      bib = keep(g); poly(bib, [[-.17, .1], [-.13, -.12], [0, -.17], [.13, -.12], [.17, .1], [.07, .1], [0, .03], [-.07, .1]], .015, C.pink); box(bib, 0, -.07, .016, .1, .03, .005, C.white);
      beam(bib, [-.15, .1, .005], [-.2, .2, 0], .008, C.pink, 3); beam(bib, [.15, .1, .005], [.2, .2, 0], .008, C.pink, 3);
      rattle = keep(g); beam(rattle, [0, 0, 0], [0, .16, 0], .018, C.white, 5); ball(rattle, 0, .23, 0, .07, C.coral, 1); ring(rattle, 0, .23, 0, .085, .012, HAT, 14);
      tea = keep(g); cyl(tea, 0, .25, 0, .15, .12, .5, TEA, 14); cyl(tea, 0, .5, 0, .155, .155, .02, '#e8b06a', 14);
      for (const [x, z] of [[-.06, .02], [.05, -.03], [.02, .07]]) box(tea, x, .52, z, .08, .08, .08, '#eef7f8').rotation.y = x * 9;
      beam(tea, [.04, .45, 0], [.14, .78, .02], .016, C.red, 5); disc(tea, -.12, .5, .07, .07, C.lime, .02, 12);
      for (const k of [bottle, bib, rattle, tea]) k.visible = false;
    }

    // ---------------------------------------------------------------- 記錄員 and 店員
    let ce;
    S.plant(-2.42, 1.88, (g) => { ce = S.person(g, { s: 1.23, kind: 'ce', coat: C.navy }); }, { y: .21 });
    const cp = S.curio(ce.root, { id: 'ce', label: '替漁夫洗照片的相館師傅',quiet:true,tap:() => {ce.wave(1.1);pop();} }); ce.propId = cp.id;

    let zhi, zhiArt, ray, loupe;
    S.plant(-.9, .95, (g) => {
      zhiArt = g;
      zhi = S.robot(g, { species: 'leopard', s: 1.54, lights: S.index - 1 });
      loupe=keep(zhi.armL,-.035,-.28,.075);
      beam(loupe,[0,0,0],[-.085,.12,0],.021,'#755742',5);
      ring(loupe,-.13,.18,0,.083,.014,'#e3bd72',16);
      beam(loupe,[-.167,.204,.014],[-.113,.224,.014],.005,'#e0eeea',4);
      const geo = new T.ConeGeometry(1, 1, 18, 1, true); geo.rotateX(Math.PI); geo.translate(0, .5, 0);
      ray = new T.Mesh(geo, new T.MeshBasicMaterial({ color: C.aqua, transparent: true, opacity: .45, depthWrite: false, side: T.DoubleSide, toneMapped: false }));
      ray.userData.raw = true; ray.visible = false; g.add(ray);
    }, { y: .225 });

    // ---------------------------------------------------------------- helpers: hold a pose, stick to a hand, fly over
    const hand = (p, side, dy = 0) => () => S.world(side === 'R' ? p.armR : p.armL, [0, -.36, .07]).add(V(0, dy, 0));
    const pose = (arm, z, dur = .3) => { let o = arms.get(arm); if (!o) { o = { w: 0, z }; arms.set(arm, o); } o.z = z; return S.to(o, { w: z == null ? 0 : 1 }, dur, 'inOut'); };
    const at = (node, fn) => { follow.set(node, fn); node.position.copy(S.local(node.parent, fn())); };
    async function fly(node, to, dur = .55, peak = .7) {
      const from = node.getWorldPosition(V(0, 0, 0)), o = { u: 0 };
      follow.set(node, () => { const p = from.clone().lerp(to(), o.u); p.y += Math.sin(Math.PI * o.u) * peak; return p; });
      await S.to(o, { u: 1 }, dur, 'inOut'); follow.set(node, to);
    }
    const fromZhi = (node) => { node.rotation.set(0, 0, 0); at(node, () => S.world(zhi.root, [0, 1.35, .1])); follow.delete(node); return S.show(node, .2); };
    const beamAt = (fn) => { beamTo = fn; ray.visible = !!fn; };
    const photo = () => S.world(frame, [0, 0, .05]);
    const spot = () => S.local(zhi.root.parent, S.world(fisherArt, [-.92, 0, .32]));

    // ---------------------------------------------------------------- the story
    async function go() {
      if (st.phase !== 'ready') return; S.set({ phase: 'busy' });
      // it reads the photo on the wall in a blink
      zhi.hop(); S.sound('paper'); beamAt(photo); await S.wait(.8);
      S.emote(zhi, '!', 1.0, C.red); await S.wait(.35); beamAt(null);
      S.hide(wish, .2); zhi.cheer();
      // and serves the baby in it: bib, rattle, bottle
      await fromZhi(bib); S.sound('pop'); fly(bib, () => S.world(fisher.inner, [0, .58, .1]), .45, .5);
      await S.wait(.25); await fromZhi(rattle); S.sound('pop'); fly(rattle, hand(fisher, 'R', -.06), .45, .6);
      await S.wait(.25); await fromZhi(bottle); S.sound('pop'); pose(fisher.armL, -1.25, .4); await fly(bottle, hand(fisher, 'L', -.14), .5, .6);
      // a man with a beard, holding a baby's bottle with two fingers
      zhi.still(); S.sound('soft'); fisher.still();
      await S.wait(.5); S.show(dots, .3);
      await S.wait(.5); pose(ce.armR, -2.62, .35); ce.doubt();
      await S.wait(1.0);
      S.set({ phase: 'touch' }); S.hint(zhi.root, [0, .75, 0], '去看看本人');
    }
    async function touch(byHand) {
      if (st.phase !== 'touch' || st.busy) return; st.busy = true; S.hint(null); S.refresh();
      const p = spot(); p.y = 0;
      if (!byHand) { zhi.walking = true; await S.to(zhi.root.position, { x: p.x, y: 0, z: p.z }, .9, 'inOut'); zhi.walking = false; }
      else { S.sound('soft'); await S.to(zhi.root.position, { x: p.x, y: 0, z: p.z }, .25, 'out'); }
      pose(ce.armR, null, .4); ce.still();
      // it looks at the man himself, from his hat to his boots
      S.sound('whoosh'); scan.u = 0; beamAt(() => S.world(fisher.inner, [0, lerp(1.55, .05, scan.u), .05]));
      await S.to(scan, { u: 1 }, 1.1, 'inOut');
      S.show(sweat, .25); S.sound('tick'); await S.to(scan, { u: .2 }, .5, 'inOut');
      beamAt(null); scan.u = -1; S.emote(zhi, '!', .9, C.red); zhi.hop(); S.hide(dots, .2);
      // the bottle goes back; a big glass of iced tea comes out
      S.hide(bib, .2); await fly(bottle, () => S.world(zhi.root, [0, 1.2, .1]), .4, .4); S.hide(bottle, .15);
      await fromZhi(tea); await fly(tea, hand(fisher, 'L', -.24), .55, .6); S.sound('cup');
      pose(fisher.armL, -2.45, .3); S.hide(sweat, .2);
      laugh.visible = true; fisher.hop(); S.sound('done');
      await S.wait(.6);
      // The fisher returns the rattle to the studio hook while the clerk takes today's photo.
      S.to(rattle.rotation, { z: -.12 }, .6); await fly(rattle, () => S.world(rattle0, [.13,.06,.055]), .6, .5); S.sound('tick'); S.wiggle(rattle, .5);
      fisher.cheer(); ce.cheer(); zhi.cheer();
      await S.wait(.35); await pop();
      await S.show(today, .35);                       // the new print appears after the exposure
      S.learn(zhi);
      await S.wait(1.0);
      S.set({ phase: 'done' }); S.done();
    }

    // the studio clerk: tap it to start; when it is the reader's turn, drag it over to the man himself
    let home = null, off = null;
    const zp = S.drag(zhi.root, { id: 'zhi', label: '街報記者小照', aim: [0, .7, 0], plane: 'ground', pad: 0,
      tap: () => {
        if (st.phase === 'ready') go(); else if (st.phase === 'touch') touch(false);
        else { zhi.hop(); zhi.wave(1.2); }
      },
      start: (e) => { if (st.phase !== 'touch' || st.busy) { home = null; return; } home = zhi.root.position.clone(); off = zhi.root.parent.worldToLocal(e.point.clone()).sub(zhi.root.position); S.hint(null); },
      move: (e) => { if (!home) return; const p = zhi.root.parent.worldToLocal(e.point.clone()).sub(off); zhi.root.position.set(p.x, home.y, p.z); zhi.walking = true; },
      end: (e) => {
        if (!home) return; zhi.walking = false; const h = home; home = null;
        if (!e.moved) { zhi.root.position.copy(h); return; }
        const a = S.stage.project(S.world(zhi.root, [0, .5, 0])), b = S.stage.project(S.world(fisher.inner, [0, .7, 0]));
        if (Math.hypot(a.x - b.x, a.y - b.y) < 170) touch(true);
        else { S.to(zhi.root.position, { x: h.x, y: h.y, z: h.z }, .45, 'back'); S.wait(.5).then(() => { if (st.phase === 'touch' && !st.busy) S.hint(zhi.root, [0, .75, 0], '去看看本人'); }); }
      } });
    zhi.propId = zp.id;
    S.pad(zhi.root, .42, [0, .55, 0]);

    S.onReadyLoop((phase) => {
      // The shopkeeper leans toward yesterday's photo; the customer wipes his brow.
      const study = pulse(phase, .05, .60), wipeBrow = pulse(phase, .36, .92);
      zhi.root.position.x -= .27 * study; zhi.root.rotation.z += .12 * study;
      loupe.rotation.z += .22 * study;
      fisher.armL.rotation.z -= 1.25 * wipeBrow; fisher.head.rotation.z -= .11 * wipeBrow;
    }, 5.2, [zhi.root, loupe, fisher.armL, fisher.head]);
    S.act('go', go); S.act('touch', () => touch(false));
    S.on('reset', () => { follow.clear(); arms.clear(); wipe = false; scan.u = -1; beamTo = null; sweatT = 0; exposing=false; glow.material.opacity = 0; zhi.walking = false; home = null; });
    S.on('enter', async () => {
      // he comes up from his boat, hot, and wipes his brow: he would love a cold drink
      await S.wait(.2); await S.walk(fisher, { x: 0, z: 0 }, .8); fisher.root.scale.x = Math.abs(fisher.root.scale.x);
      wipe = true; pose(fisher.armL, 2.6, .25); S.show(sweat, .2);
      await S.wait(.8); wipe = false; pose(fisher.armL, null, .3); S.hide(sweat, .2);
      S.show(wish, .35); S.sound('pop');
      await S.wait(.4); S.set({ phase: 'ready' });
    });
    S.ui(() => storyPanel(st, {
      opening: '滿頭汗的漁夫走進相館。店員認得他的黃帽子，可是牆上的照片是他還喝奶的時候拍的。',
      start: '照舊照片招呼漁夫',
      checkpoint: '店員依照片送來奶瓶，眼前的漁夫卻在擦汗。',
      action: '帶店員去看看漁夫',
      ending: '漁夫捧著冰茶拍了今天的照片。人會變，品牌對顧客的認識也要跟著更新。',
    }));

    S.tick((t, dt) => {
      for (const [arm, o] of arms) if (o.w > .001) arm.rotation.z = lerp(arm.rotation.z, o.z + (wipe && arm === fisher.armL ? Math.sin(t * 14) * .2 : 0), o.w);
      for (const [node, fn] of follow) node.position.copy(S.local(node.parent, fn()));
      if (ray.visible && beamTo) {
        const a = S.local(zhiArt, S.world(loupe, [-.13, .18, .02])), b = S.local(zhiArt, beamTo()), d = b.clone().sub(a), len = d.length();
        ray.position.copy(a); ray.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
        const r = scan.u >= 0 ? .26 : .36; ray.scale.set(r, len, r); ray.material.opacity = .42 + Math.sin(t * 18) * .08;
      }
      if (sweat.visible) { sweatT += dt; sweat.position.y = .3 - (sweatT * .25) % .12; }
      boat.position.y = Math.sin(t * 1.5) * .025; boat.rotation.z = Math.sin(t * 1.2) * .02;
      rays.rotation.z += dt * .05;
      wish.position.y = 1.45 + Math.sin(t * 2.2) * .025;
    });
  },
};
