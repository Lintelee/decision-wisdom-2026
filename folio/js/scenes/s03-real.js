// 第 3 頁｜運動場｜楊欣怡〈信任〉p.44–49、周麗君〈真實的力量〉p.20–27。
// 六指海報讓看台收旗。目睹選手完成投擲後，觀眾才重新舉旗。
import { printedHead } from '../cast-prints.js';
import { storyPanel, pulse } from './reading-beats.js';
import { C, keep, box, cyl, cone, ball, disc, ring, beam, poly, card, quad, tag, tab, cloud, cratePlank, skyDisc } from '../paper.js';
import { fieldStand, terrain, stadiumDrum, paperSun, paperCloud } from './harbor-atelier.js';
import { stadiumScenery } from './quay-streetscape.js';
import { stadiumMechanisms } from './quayside-paper.js';
import { makeWitnessStand } from './stands-witness.js';

const DIARY = '真的，要讓人親眼看到。';
const SKIN = '#f3cfa6', HAIR = '#ecebe4';
const lerp = (a, b, t) => a + (b - a) * t;

/** The real paper fingers can each catch the reader's eye as the spectator counts. */
function sixHand(g, x, y, z, s, fingers) {
  const k = keep(g, x, y, z); k.scale.setScalar(s);
  disc(k, 0, 0, 0, .1, SKIN, .02, 16);
  for (let i = 0; i < 6; i++) {
    const a = -.95 + i * .38, f = keep(k, Math.sin(a) * .08, Math.cos(a) * .08, .005); f.rotation.z = -a;
    card(f, 0, 0, 0, .042, .15, SKIN, .02, .02); if (fingers) fingers.push(f);
  }
  return k;
}

export default {
  id: 's03-real', land: 'people', short: '親眼看到', calm: true,
  title: '當 AI 什麼都能生成時，如何取信消費者？',
  sources: [{ n: 6 }, { n: 3 }],
  diary: DIARY,
  takeaway: 'AI 讓什麼都像真的，大家反而不信。讓人親眼看見真實，才會相信。',
  quote: { t: '我們沒有試圖說服大家，我們只是讓大家看見真實。而真實，最終說服了所有人。', n: 6, page: 47 },
  // One sentence from each of the scene's other source articles, for the list on the explanation card.
  more: [{ n: 3, page: 25, t: '創意的力量，從不來自「正確」，而來自「真實」。' }],
  look: { bg: '#2b5a4c', table: '#86a590', key: '#fff0d0', fill: '#c6e6ea', sky: '#fff8e6' },   // morning
  ground(G) {
    G.wash('#a9c993');
    for (let i = 0; i < 9; i++) G.rect(-5.4 + i * 1.35, .2, .68, 7.4, '#a0c189', { r: 0 });          // mown stripes
    // the running track along the front
    G.rect(0, 3.05, 12.4, 1.05, '#d98a66', { r: 0 });
    for (const z of [2.55, 2.9, 3.25]) G.path([[-6, z], [6, z]], { w: .025, col: '#ffffffcc', sharp: true });
    // the javelin runway, the white line, and the landing sector out toward the far end
    G.path([[-3.9, 2.45], [-2.15, 1.25]], { w: .6, col: '#e8d6a8' });
    G.path([[-2.7, .95], [-2.2, .78], [-1.65, .8]], { w: .06, col: '#ffffff' });
    G.path([[-2.05, .7], [-.6, -2.6]], { w: .03, col: '#ffffffbb', sharp: true });
    G.path([[-1.95, .75], [2.6, -1.3]], { w: .03, col: '#ffffffbb', sharp: true });
    for (const [x, z] of [[-.9, -.7], [.1, -.3], [-.3, -1.6], [1.1, -.9]]) G.path([[x - .12, z], [x + .12, z]], { w: .035, col: '#ffffffaa', sharp: true });
    // under the stand and the billboard
    G.rect(-2.75, -1.75, 3.7, 1.5, '#c9b98d', { r: .06 });
    G.rect(1.25, -2.35, 2.4, .5, '#93b37c', { r: .1 });
    for (let i=0; i<6; i++) {
      const x=3.18+i*.47;
      G.rect(x,2.91,.13,.62,i%2?'#f3d39c88':'#b86a4f88',{r:.005});
    }
    for (let i=0;i<5;i++) G.path([[1.70+i*.29,-2.80],[1.83+i*.29,-2.89]],{w:.023,col:'#e4ebc266',sharp:true});
  },
  build(S) {
    const T = S.T, V = (x, y, z) => new T.Vector3(x, y, z);
    const st = S.state({ phase: 'intro', busy: false });
    terrain(S, 'field');
    stadiumMechanisms(S);
    stadiumScenery(S);
    const arms = new Map();                    // arm -> {w, z}: hold a puppet's arm in a pose
    const pull = { u: 0 };                     // how far the javelin is drawn back (springs home)
    let standIsQuiet = false, springing = false, birdsBusy = false, jav0 = null;

    // ---------------------------------------------------------------- the stand, hung with flags; nobody in it yet
    let audience, bunting, pennants = [];
    S.plant(-2.75, -1.85, (g) => {
      const stand=fieldStand(g);
      audience=makeWitnessStand(S,stand);
      bunting=keep(stand.b,0,1.94,.60);pennants=stand.pennants;
      pennants.forEach(f=>{f.userData.keep=true;});
      for(let i=0;i<9;i++) {
        const f=keep(bunting,-1.18+i*.30,.025,0);
        poly(f,[[-.079,0],[.088,0],[.01,-.14]],.012,['#caaa65','#a85c40','#7a9280'][i%3]);
        pennants.push(f);
      }
    },{s:1.14});
    S.discovery(bunting,{id:'bunting',label:'看台簷下的一排手縫旗',duration:1.24,sound:'cloth',
      draw(u,visit,still){pennants.forEach((f,i)=>{
        const k=i/Math.max(1,pennants.length-1),start=(visit%2?k:1-k)*.38;
        f.rotation.x=-(still ? .30 : .95)*pulse(u,start,start+.61);
      });}});

    // ---------------------------------------------------------------- the billboard the poster artist puts up: grandpa as a superman (six fingers)
    let bb, wrapped, chest, crease, posterHand, proof, glass, sixthMark;
    const handFingers = [];
    S.plant(1.25, -2.35, (g) => {
      // The rolled poster is already here when the reader arrives at the empty field.
      for (const side of [-1,1]) {
        const x=side*1.02;
        beam(g,[x,0,-.17],[x,2.56,-.17],.042,'#927958',6);
        beam(g,[x,0,-.56],[x,1.21,-.17],.028,'#a38c66',5);
      }
      beam(g,[-1.15,2.50,-.17],[1.15,2.50,-.17],.043,'#a58d68',6);
      wrapped=keep(g,0,2.31,-.08);
      cyl(wrapped,0,0,0,.134,.134,2.06,'#d9c8a4',12).rotation.z=Math.PI/2;
      box(wrapped,0,-.101,.073,1.97,.119,.040,'#e6d8b7');
      for(const x of [-.70,.70]) {
        cyl(wrapped,x,0,0,.145,.145,.073,'#869478',12).rotation.z=Math.PI/2;
        beam(wrapped,[x,.061,.088],[x,.21,-.095],.014,'#8a785d',4);
      }
      S.pad(wrapped,.18,[0,0,.03]);
      S.prop(wrapped,{id:'wrapped-poster',label:'掛起美編捲好的海報',aim:[0,0,.08],tap:()=>{if(st.phase==='ready') go();}});
      bb = keep(g);
      tab(bb, 2.2);
      card(bb, 0, .9, -.04, 2.46, 1.56, C.white, .06, .05);
      card(bb, 0, .96, .025, 2.32, 1.44, '#b6c7be', .01, .03);
      const K=window.PaperKit;
      K.at(bb,K.label('百 歲 標 槍 · 現 場',1.08,.142,{paper:'#e7d6b4',ink:'#4b5e4e'}),-.55,2.315,.056);
      const a = keep(bb, 0, 1.68, .04);
      for (let i = 0; i < 5; i++) poly(a, [[-1.1, -.55 + i * .26], [-.2, -.5 + i * .26], [-.2, -.48 + i * .26], [-1.1, -.52 + i * .26]], .004, C.white, 0, 0, 0);   // speed lines
      poly(a, [[.15, .12], [-.55, .38], [-1.05, .22], [-.9, -.02], [-.5, .02], [.15, -.08]], .006, C.red, 0, 0, .004);                                   // cape
      for (const y of [-.02, -.12]) { box(a, -.55, y, .012, .5, .085, .008, C.blue); box(a, -.86, y, .012, .14, .095, .008, C.red); }                 // legs, boots
      poly(a, [[-.36, -.17], [.25, -.17], [.32, .17], [-.36, .1]], .008, C.blue, 0, 0, .014);                                                          // body
      box(a, -.3, -.04, .026, .08, .27, .004, C.gold);                                                                                               // belt
      chest = keep(a, .03, 0, .03); disc(chest, 0, 0, 0, .1, C.gold, .01, 18); poly(chest, [[-.05, -.05], [.05, -.05], [0, .06]], .004, C.red, 0, 0, .006);
      crease=keep(chest,0,0,.028);crease.name='槍尖留下的紙裂口';crease.visible=false;
      poly(crease,[[-.14,.069],[-.037,.029],[.036,.064],[.012,.012],[.106,-.041],[.004,-.018],[-.071,-.087],[-.039,-.012]],.008,'#614e40');
      poly(crease,[[0,.008],[.036,.067],[.082,.061],[.042,.030]],.012,'#e4c99d',0,0,.012).rotation.y=-.36;
      const face = printedHead('badger');
      face.position.set(.388,.012,.081); face.scale.set(.66,.70,.18);
      a.add(face);
      // arms like hams: one punching forward with the six-finger hand, one flexed
      const b1 = ball(a, .28, .24, .02, .12, C.blue, 1); b1.scale.z = .3; const b2 = ball(a, .45, .32, .02, .09, SKIN, 1); b2.scale.z = .3;
      beam(a, [.2, .15, .02], [.62, .38, .02], .05, SKIN, 6);
      proof=keep(a,.69,.40,.065);
      glass=keep(proof,0,0,-.035);glass.name='第六指的放大鏡';
      // A raised brass rim frames the actual hand printed on the poster.
      disc(glass,0,.13,-.026,.337,'#52706b',.020,25);
      ring(glass,0,.13,.067,.35,.034,'#a57548',28);
      ring(glass,0,.13,.085,.324,.016,'#edca85',28);
      beam(glass,[-.27,-.10,.046],[-.49,-.25,.046],.046,'#9d7958',8);
      glass.visible=false;
      posterHand=sixHand(proof,0,-.045,.018,1.45,handFingers);
      handFingers[5].name='海報上的第六指';
      sixthMark=keep(handFingers[5],0,.092,.031);
      card(sixthMark,0,0,0,.037,.050,'#b95142',.008,.010);
      sixthMark.visible=false;
      const b3 = ball(a, -.05, -.26, .02, .12, C.blue, 1); b3.scale.z = .3; beam(a, [.05, -.16, .02], [-.1, -.34, .02], .05, SKIN, 6); ball(a, -.15, -.38, .02, .065, SKIN, 0);
      bb.visible = false;
    });
    S.discovery(bb,{id:'six-fingers',label:'海報上多出來的第六指',aim:[.71,2.22,.18],duration:.79,sound:'paper',
      draw(u,visit,still){
        // Only the hinged print shifts here. Counting in the main story owns the glass.
        if (st.phase === 'done') {
          glass.visible = still ? visit % 2 === 1 : u < 1;
          glass.rotation.x = 0;
          glass.scale.setScalar(1);
        }
        const spread = still ? .16 * (visit % 2) : Math.sin(Math.PI * u) * .22;
        posterHand.rotation.y=-spread;
        handFingers.forEach((f,i)=>{f.rotation.z=.95-i*.38+(.5-i/5)*spread;});
      }});

    // ---------------------------------------------------------------- the place sign, the sun, the scoreboard, a drum, a starter's pistol, sparrows
    S.plant(-4.8, 1.35, (g) => { tab(g, .5); beam(g, [0, 0, 0], [0, 1.3, 0], .035, C.bark, 6); tag(g, '運動場', 0, 1.07, .04, { h: .27, paper: C.white, ink: C.navy }); });
    let rays;
    S.plant(2.9, -3.25, (g) => { rays = paperSun(g,2.70,.45); });
    let shadowCloud;
    S.plant(-5.0, -3.2, (g) => paperCloud(g,1.08,2.40)); S.plant(4.7, -3.1, (g) => {shadowCloud=keep(g);paperCloud(shadowCloud,1.28,3.14);});
    S.discovery(rays,{id:'sun',label:'飄過日頭的田徑場白雲',duration:1.13,sound:'field',
      draw(u,visit){const t=T.MathUtils.smoothstep(u,0,1),shade=visit%2?t:1-t;shadowCloud.position.set(-1.83*shade,-.16*shade,0);}});
    let flip, plank, scoreStand, officialFlag;
    const scores=[];
    S.plant(4.25, -.6, (g) => {
      scoreStand=keep(g);g=scoreStand;
      tab(g, 1.1);
      box(g, 0, .22, -.02, .9, .03, .3, C.wood);
      plank = cratePlank(g, 0, .11, .14, { len: .9, h: .2 });
      for (const sx of [-1, 1]) beam(g, [sx * .38, .23, 0], [sx * .38, .95, 0], .03, C.bark, 5);
      box(g, 0, 1.1, 0, 1.0, .64, .1, '#2f4f45');
      const tally = (k, n, z) => { for (let i = 0; i < Math.min(n,4); i++) box(k, -.09 + i * .06, 0, z, .025, .2, .006, C.white); if (n === 5) beam(k, [-.14, -.07, z], [.16, .08, z], .012, C.white, 3); };
      const left = keep(g, -.23, 1.1, .06); card(left, 0, -.15, 0, .36, .3, '#41665b', .01, .02); tally(left, 3, .015);
      for(const [i,n] of [4,5].entries()){
        const sheet=keep(g,.23,1.1,.07);card(sheet,0,-.15,0,.36,.3,'#41665b',.013,.019);
        tally(sheet,n,.026);sheet.visible=i===0;scores.push(sheet);
      }
      flip=keep(g,.23,1.25,.11);
      card(flip,0,-.30,0,.36,.30,'#728276',.014,.02);
      for(const x of [-.08,.08]) disc(flip,x,-.027,.022,.012,'#cbbd91',.009,6);
      flip.visible=false;
      // The official's signal flag rests in a slot beneath the counters.
      officialFlag=keep(g,-.34,.22,.15);officialFlag.name='記分台的裁判旗';
      beam(officialFlag,[0,0,0],[0,.55,0],.022,'#856445',5);
      poly(officialFlag,[[0,.54],[.38,.49],[.31,.37],[.38,.29],[0,.34]],.023,'#f1e5bc');
      poly(officialFlag,[[.18,.51],[.23,.505],[.23,.319],[.18,.323]],.008,'#bd6c48',0,0,.027);
      officialFlag.rotation.z=-1.45;
    });
    S.discovery(scoreStand,{id:'score',label:'手翻記分牌',aim:[.12,1.10,0],duration:.69,sound:'clip',
      draw(u,visit){
        const t=T.MathUtils.smootherstep(u,0,1);flip.visible=t>.03&&t<.97;flip.rotation.x=-Math.PI*t;
        scores.forEach((sheet,i)=>{sheet.visible=i===(visit-(t<.4?1:0))%2;});
      }});
    S.discovery(plank,{id:'plank',label:'記分台下收著的裁判旗',duration:.78,sound:'cloth',
      draw(u,visit,still){const t=T.MathUtils.smootherstep(u,0,1),raised=visit%2?t:1-t;officialFlag.rotation.z=-1.45+raised*1.82;officialFlag.rotation.y=still?0:.32*Math.sin(Math.PI*u);}});
    let drum, mallet;
    S.plant(-4.45, -.45, (g) => {
      const old=stadiumDrum(g);
      drum=old.drum;mallet=old.sticks[0];
    });
    S.curio(drum,{id:'drum',label:'加油大鼓',quiet:true,tap:async()=>{
      for(let k=0;k<2;k++){
        await S.to(mallet.rotation,{z:.45},.13);S.sound('drum');
        await S.to(mallet.rotation,{z:0},.24,'back');
      }
    }});
    let gun, call;
    S.plant(3.75, 1.3, (g) => {
      const K=window.PaperKit;
      const cone=window.AtlasHarborStock.foldedCone();
      cone.scale.setScalar(.72);g.add(cone);
      gun=keep(g,.12,.76,.04);
      const bell=K.cyl(.14,.064,.21,10,'#b08046');bell.rotation.z=Math.PI/2;
      K.at(gun,bell,0,0,0);
      call=keep(gun,-.135,.10,0);call.visible=false;
      for(let i=0;i<3;i++){
        const x=-.035-i*.10,h=.06+i*.045;
        beam(call,[x,-h,.033],[x-.038,0,.033],.011,'#e3bd70',4);
        beam(call,[x-.038,0,.033],[x,h,.033],.011,'#e3bd70',4);
      }
    });
    S.curio(gun,{id:'gun',label:'出場號角',quiet:true,tap:async()=>{
      S.sound('field-horn');call.visible=true;await S.wait(.32);call.visible=false;
      startle.tap();
    }});
    const birds = []; let flock;
    S.plant(1.5, 2.25, (g) => {
      flock = keep(g);
      for(const x of [-.64,.52]) beam(flock,[x,.018,-.23],[x,.386,-.23],.023,'#9e8661',5);
      beam(flock,[-.72,.367,-.23],[.60,.367,-.23],.022,'#bc9c6a',6);
      for(const [x,z] of [[-.32,.06],[-.12,.09],[.22,.03]]) ball(flock,x,.020,z,.027,'#caa968');
      for (const [x, z] of [[-.35, 0], [.04, .12], [.35, -.08]]) {
        const b = keep(flock, x, 0, z); const body = ball(b, 0, .07, 0, .065, C.bark, 1); body.scale.set(1.3, .9, .7);
        ball(b, .07, .12, 0, .04, C.bark, 0); poly(b, [[.1, .12], [.15, .11], [.1, .1]], .01, C.gold, 0, 0, -.005); poly(b, [[-.08, .08], [-.18, .12], [-.16, .06]], .01, C.wood, 0, 0, -.005);
        const wings=[-1,1].map(side=>{
          const wing=keep(b,0,.098,side*.024);
          quad(wing,[.035,0,0],[-.047,.013,0],[-.128,.041,side*.144],[-.025,.033,side*.114],side>0?'#bb956e':'#8b694e');
          wing.rotation.x=side*.85;
          return wing;
        });
        b.scale.setScalar(1.37);birds.push({b,wings,x,z});
      }
    });
    const startle=S.discovery(flock,{id:'birds',label:'啄穀粒、會飛上欄杆的麻雀',aim:[0,.25,0],duration:1.6,sound:'sparrow',
      draw(u,visit,still){
        birdsBusy=u<1;
        birds.forEach(({b,wings,x,z},i)=>{
          const t=T.MathUtils.smootherstep(u,i*.075,.79+i*.075),perched=visit%2?t:1-t;
          const arc=Math.sin(Math.PI*t);
          b.position.set(x+.24*arc,.39*perched+arc*(still ? .05 : .91+i*.12),z+(-.23-z)*perched);
          b.rotation.z=.15*Math.sin(Math.PI*2*t);
          const flap=still ? .08 : .75*Math.sin(t*Math.PI*5)-.51;
          wings.forEach((w,n)=>{w.rotation.x=(n?1:-1)*((1-arc)*.85+arc*flap);});
        });
      }});

    // ---------------------------------------------------------------- 105-year-old grandpa, leaning on his javelin
    let gpa, gArt, jav, grip;
    S.plant(-2.15, 1.05, (g) => {
      gArt = g;
      gpa = S.person(g, { s: 1.15, kind: 'elder', coat: '#e8e2d0', legs: C.navy });
      gpa.inner.getObjectByName('walking-stick')?.removeFromParent();   // the javelin is his staff today
      box(gpa.inner, 0, .55, .04, .3, .06, .01, C.red);                                                                     // a red stripe on his vest
      poly(gpa.head, [[-.1, .1], [0, .08], [.1, .1], [.06, .06], [-.06, .06]], .012, HAIR, 0, 0, .04);                        // white moustache
      jav = keep(g, -.42, .95, .12); jav.name = '擲遠的紙標槍';
      beam(jav, [-.9, 0, 0], [.78, 0, 0], .026, '#f4f1ea', 6); cyl(jav, -.06, 0, 0, .028, .028, .26, C.red, 8).rotation.z = Math.PI / 2;
      cone(jav, .87, 0, 0, .04, .2, C.steel, 6).rotation.z = -Math.PI / 2;
      jav.rotation.z = Math.PI / 2;
      grip = keep(g, 0, 0, 0); grip.visible = false;
    },{s:1.38});
    gpa.root.rotation.z = .07;
    const gp = S.curio(gpa.root, { id:'gpa',label:'拄著標槍暖身的爺爺',quiet:true,tap:()=>{gpa.wave(.75);if(st.phase==='ready') S.wiggle(jav,.047);} }); gpa.propId = gp.id;

    // the kid who will count the fingers
    let kid;
    S.plant(-.85, .55, (g) => {
      kid = S.person(g, { s: 1.46, kind: 'kid', coat: C.coral, hair: C.bark });
    });
    const kp = S.curio(kid.root,{id:'kid',label:'數海報手指的小觀眾',aim:[0,.66,.11],quiet:true,tap:()=>{
      kid.wave(.75);
      if(st.phase==='touch' && !S.stage.still.matches)S.wiggle(glass,.08);
    }}); kid.propId=kp.id;

    let ce;
    S.plant(2.58, 1.60, (g) => { ce = S.person(g, { s: 1.18, kind: 'ce', coat: C.navy }); });
    const cp=S.curio(ce.root,{id:'ce',label:'量標槍落點的記分員',quiet:true,tap:()=>{ce.wave(.86);S.props.find(p=>p.id==='distance-reel')?.tap();}}); ce.propId=cp.id;

    let zhi;
    S.plant(.91, .45, (g) => { zhi = S.robot(g, { species: 'leopard', s: 1.28, lights: S.index - 1 }); });
    S.hero(zhi, { label: '到場拍攝的街報記者小照', ready: () => st.phase === 'ready', go });

    let landing, raisedTurf;
    S.plant(2.14,-1.17,g=>{
      landing=keep(g);landing.name='標槍落地記號';
      const mark=poly(landing,[[-.40,0],[-.18,-.077],[.28,-.072],[.41,.008],[.21,.063],[-.17,.077]],.014,'#bd986c');
      mark.rotation.x=-Math.PI/2;
      raisedTurf=keep(landing);raisedTurf.name='落地才翻起的草折';
      for(const side of [-1,1]){
        const tuft=poly(raisedTurf,[[0,0],[.058,.058],[.079,.135],[.13,.057],[.225,.118],[.164,.02]],.023,side<0?'#a99463':'#bec38a');
        tuft.scale.x=side;
      }
      beam(raisedTurf,[.17,.03,.08],[.18,.34,.08],.019,'#8a6c4a',6);
      poly(raisedTurf,[[0,0],[.25,-.045],[.18,-.102],[0,-.13]],.018,'#eddeb8',.18,.34,.08);
      raisedTurf.visible=false;
    });

    // ---------------------------------------------------------------- helpers
    const pose = (arm, z, dur = .3) => { let o = arms.get(arm); if (!o) { o = { w: 0, z }; arms.set(arm, o); } o.z = z; return S.to(o, { w: z == null ? 0 : 1 }, dur, 'inOut'); };
    const target = () => S.world(chest, [0, 0, .02]);
    const HOLD = V(.34, 1.2, .14), ARM_HOLD = 2.75, ARM_BACK = 3.35;
    const dir = V(3.09, 1.38, -3.47).normalize(), BACK = HOLD.clone().addScaledVector(dir, -1.0); BACK.y = HOLD.y - .15;   // from the white line toward the billboard's chest
    let flight = null;
    const aimQ = (d) => new T.Quaternion().setFromUnitVectors(V(1, 0, 0), d.clone().normalize());
    const placeJav = (u) => { jav.position.lerpVectors(HOLD, BACK, u); const o = arms.get(gpa.armR); if (o) o.z = lerp(ARM_HOLD, ARM_BACK, u); };

    // ---------------------------------------------------------------- the story
    async function go() {
      if (st.phase !== 'ready') return; S.set({ phase: 'busy' });
      // a huge billboard, and people come to see it
      zhi.cheer(); S.sound('whoosh'); S.hide(wrapped,.28); await S.show(bb, .55); S.sound('stamp');
      await S.wait(.3);
      for (let r = 0; r < 3; r++) { audience.showRow(r); await S.wait(.25); }
      zhi.still(); await S.wait(.4);
      // Follow the child's count on the actual poster. The front-row spectator then
      // turns and points at its extra finger before the colours drop down each tier.
      pose(kid.armR, 2.16, .25);
      glass.visible=true;
      if(S.stage.still.matches)proof.scale.setScalar(1.18);
      else S.to(proof.scale,{x:1.18,y:1.18,z:1.18},.38,'out');
      for(const [i,finger] of handFingers.entries()){
        if(!S.stage.still.matches)S.pop(finger,1.30);
        if(i===5)sixthMark.visible=true;
        S.sound('tick',finger);await S.wait(.18);
      }
      audience.pointAt(handFingers[5]);
      await S.wait(.60);
      for(let r=0;r<3;r++){
        audience.lowerRow(r);
        if(r===0)S.sound('cloth',glass);
        await S.wait(.27);
      }
      standIsQuiet = true;
      await S.wait(.48); pose(kid.armR,null,.24);
      // he goes and pokes the real one
      await S.walk(kid, { x: -.78, z: .25 }, .8);
      pose(kid.armR, 1.5, .15); await S.wait(.15); gpa.hop(.14); S.sound('tap'); await S.wait(.35); pose(kid.armR, null, .25); S.walk(kid, { x: -.3, z: .45 }, .6).then(() => { kid.root.scale.x = -Math.abs(kid.root.scale.x); });
      // grandpa straightens up and lifts his javelin
      S.to(gpa.root.rotation, { z: 0 }, .4, 'inOut');
      pose(gpa.armL, null, .3); pose(gpa.armR, ARM_HOLD, .5);
      S.to(jav.position, { x: HOLD.x, y: HOLD.y, z: HOLD.z }, .6, 'inOut');
      jav0 = { from: jav.quaternion.clone(), to: aimQ(dir), k: 0 }; await S.to(jav0, { k: 1 }, .6, 'inOut');
      grip.position.copy(HOLD); grip.visible = true;
      S.set({ phase: 'touch' }); S.hint(grip, [-.26, -.21, .29], '往後拉，放開');
    }
    async function touch(byHand) {
      if (st.phase !== 'touch' || st.busy) return; st.busy = true; S.hint(null); S.refresh(); grip.visible = false;
      if (!byHand) { springing = true; pull.u = 0; await S.to(pull, { u: 1 }, .55, 'inOut'); springing = false; await S.wait(.15); }
      // let go: the javelin flies the length of the field
      S.sound('whoosh'); pose(gpa.armR, 1.2, .12); gpa.hop(.1);
      // Track the point of the spear, not its centre. It stops in the paper at the little split.
      const tip=V(.97,0,0), from=S.local(gArt,S.world(jav,tip.toArray())), to=S.local(gArt,target()), o={u:0};
      const base=to.clone().sub(from), aim=V(0,0,0), path=V(0,0,0), tail=V(0,0,0), release=jav.quaternion.clone();
      const fly=()=>{
        const t=o.u;path.copy(from).lerp(to,t);path.y+=Math.sin(Math.PI*t)*1.30;
        aim.copy(base);aim.y+=1.30*Math.PI*Math.cos(Math.PI*t);
        jav.quaternion.copy(release).slerp(aimQ(aim),T.MathUtils.smoothstep(t,0,.16));
        jav.position.copy(path).sub(tail.copy(tip).applyQuaternion(jav.quaternion));
      };
      flight = fly;
      await S.to(o, { u: 1 }, .95, 'lin'); fly(); flight = null;
      // dead centre on the superman's chest
      crease.visible=true; S.sound('paper',chest);
      if(!S.stage.still.matches)S.wiggle(bb,.055);
      // It clips the painted bib and drops into the marked turf below. The stands
      // stay silent until the tip is stationary and the disturbed paper turf lifts.
      const soil = S.local(gArt, S.world(landing, [0, .022, 0]));
      const afterImpact = jav.quaternion.clone();
      const buried = aimQ(V(.63, -.84, -.08));
      const fall = { u: 0 };
      const settleTip = () => {
        path.copy(to).lerp(soil, fall.u);
        jav.quaternion.copy(afterImpact).slerp(buried, fall.u);
        jav.position.copy(path).sub(tail.copy(tip).applyQuaternion(jav.quaternion));
      };
      flight = settleTip;
      await S.to(fall, { u: 1 }, S.stage.still.matches ? .20 : .42, 'in');
      settleTip();
      flight = null;
      raisedTurf.visible = true;
      S.sound('field', landing);
      if (S.stage.still.matches) {
        glass.visible = false;
        proof.scale.setScalar(1);
      } else {
        S.to(glass.rotation, { x: -.94 }, .24, 'inOut');
        S.hide(glass, .32);
        S.to(proof.scale, { x: 1, y: 1, z: 1 }, .34, 'inOut');
      }
      await S.wait(.22);
      audience.applaud();
      standIsQuiet = false;
      pose(gpa.armR, null, .3); gpa.cheer(); kid.cheer(); ce.cheer();
      await S.wait(.6); zhi.cheer(); S.learn(zhi);
      await S.wait(1.0);
      S.set({ phase: 'done' }); S.done();
    }
    const drag = S.pull(grip, { id: 'jav', label: '標槍', pad: .5, padAt: [0, 0, 0], from: [HOLD.x, HOLD.y, HOLD.z], to: [BACK.x, BACK.y, BACK.z], tap: () => touch(false),
      move: (u) => { if (st.phase !== 'touch' || st.busy) return; S.hint(null); placeJav(u); },
      end: async (u) => {
        if (st.phase !== 'touch' || st.busy) return;
        if (u >= .5) { pull.u = u; touch(true); return; }
        springing = true; pull.u = u; drag.set(0); await S.to(pull, { u: 0 }, .35, 'back'); springing = false; drag.set(0); placeJav(0);
        S.hint(grip, [-.26, -.21, .29], '往後拉，放開');
      } });

    S.onReadyLoop((phase) => {
      // The athlete tests his grip and takes his weight on the staff at the starting line.
      const gripTest = pulse(phase, .04, .52), peer = pulse(phase, .45, .94);
      gpa.root.position.y += .085 * gripTest; gpa.root.rotation.z -= .10 * gripTest;
      jav.rotation.z -= .18 * gripTest; jav.position.x += .07 * gripTest;
      kid.head.rotation.y += .38 * peer; kid.root.position.x -= .19 * peer;
    }, 5.3, [gpa.root, jav, kid.head, kid.root]);
    S.act('go', go); S.act('touch', () => touch(false));
    S.on('reset', () => { arms.clear(); audience.reset(); standIsQuiet = springing = birdsBusy = false; pull.u = 0; jav0 = null; flight = null; });
    S.on('enter', async () => {
      // a very old man at the white line, javelin in hand; the stand is empty
      pose(gpa.armL, -.5, .01);
      await S.wait(.5); gpa.hop(.08); S.sound('tap'); await S.wait(.6);
      ce.wave(1.2); await S.wait(.6); S.set({ phase: 'ready' });
    });
    S.ui(() => storyPanel(st, {
      opening: '105 歲的選手走到白線前。美編用 AI 畫了張海報，要請大家來看他的身手。',
      start: '掛上 AI 畫的海報',
      checkpoint: '「六根手指？」前排指向海報，看台一排排放下加油旗。爺爺自己拿起了標槍。',
      action: '讓爺爺擲出去',
      ending: '標槍扎進草地，加油旗又舉起來了。觀眾親眼看見爺爺完成這一擲，才相信他的身手。',
    }));

    S.tick((t, dt) => {
      for (const [arm, o] of arms) if (o.w > .001) arm.rotation.z = lerp(arm.rotation.z, o.z, o.w);
      if (jav0 && jav0.k < 1) jav.quaternion.copy(jav0.from).slerp(jav0.to, jav0.k);
      if (springing) placeJav(pull.u);
      if (flight) flight();
      audience.draw(t);
      pennants.forEach((f, i) => { f.rotation.y = standIsQuiet || S.stage.still.matches ? 0 : Math.sin(t * 2 + i * .6) * .18; });
      rays.rotation.z += dt * .05;
      birds.forEach(({b},i)=>{if(!birdsBusy&&!S.stage.still.matches) b.rotation.z=Math.max(0,Math.sin(t*3+i*2))*.28;});
    });
  },
};
