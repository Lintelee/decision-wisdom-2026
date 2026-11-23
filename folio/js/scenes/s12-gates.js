// 第 12 頁｜天燈廣場｜張詠琦、蔡孟軒、楊至靜〈保健、美妝與零售如何把 AI 變成行動能力〉p.188–195（全書結尾）
// 白面鼯鼠先畫紅心。穿山甲師傅親手修正貼歪的願箋，再勾住兩條燈繩。
// 願主點頭之後，師傅才逐爪放行；紙上的同一顆紅心隨天燈升空。
import { streetFigure } from '../cast-prints.js';
import { storyPanel, pulse } from './reading-beats.js';
import { T, C, keep, group, box, cyl, cone, ball, disc, ring, beam, poly, slab, card, tag, tab, house, pine, cratePlank, skyDisc } from '../paper.js';
import { lanternQuay } from './night-streetscape.js';
import { lanternCraft, homeTeaService } from './evening-craft.js';
import { printedYard, harborRow, crateLetterpress, lanternWorkshop, engravedPlace, editionSky } from './evening-edition.js';

const DIARY = '放手就收不回，所以等你點頭。';
const BW = .42, TW = .56, LH = 1.6, HOV = 1.64;
const LZ = -.35, RZ = .5;                          // in the lantern's plant: where the lantern and the lantern maker stand
const A = [0, 0, LZ], B = [0, 1.5, LZ - .45];      // the reader sends it up along this line
const WARM = '#ffd47a';
const HEART = [[0,.23],[-.40,.57],[-.72,.52],[-.88,.24],[-.80,-.09],[0,-.81],[.80,-.09],[.88,.24],[.72,.52],[.40,.57],[0,.23]];
const inkPath=HEART.map(([x,y])=>[x*.115,.141+y*.123]);

function wishCard(g, finished) {
  card(g,0,0,0,.305,.278,'#fff1ce',.012,.022);
  const ink = keep(g);
  ink.name='心願上的朱紅筆跡';
  poly(ink,inkPath.slice(0,-1),.006,'#bd4439',0,0,.018);
  ink.visible=finished;
  return ink;
}

// a soft round glow, drawn additively: halos round the lanterns and pools of light on the page
const haloTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,226,160,1)'); r.addColorStop(.3, 'rgba(255,196,112,.5)'); r.addColorStop(.65, 'rgba(255,170,90,.14)'); r.addColorStop(1, 'rgba(255,160,80,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
})();
/** a part that shines by itself (not lit by the night): kept out of the merged paper mesh */
function lit(p, geo, m, x = 0, y = 0, z = 0) { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.userData.raw = true; p.add(o); return o; }
function litShape(p, pts, m, x = 0, y = 0, z = 0) { const s = new T.Shape(); pts.forEach(([a, b], i) => (i ? s.lineTo(a, b) : s.moveTo(a, b))); return lit(p, new T.ShapeGeometry(s), m, x, y, z); }
function litQuad(p, a, b, c, d, m) { const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute([...a, ...b, ...c, ...c, ...d, ...a], 3)); geo.computeVertexNormals(); return lit(p, geo, m); }
function halo(p, x, y, z, size, opacity = .6, col = '#ffd08a') {
  const m = new T.Sprite(new T.SpriteMaterial({ map: haloTex, color: col, transparent: true, opacity, depthWrite: false, blending: T.AdditiveBlending, fog: false }));
  m.position.set(x, y, z); m.scale.set(size, size, 1); m.raycast = () => {}; m.userData.raw = true; p.add(m); return m;
}
function pool(p, x, z, size, opacity) {
  const m = new T.Mesh(new T.PlaneGeometry(size, size), new T.MeshBasicMaterial({ map: haloTex, color: '#ffa04a', transparent: true, opacity, depthWrite: false, blending: T.AdditiveBlending, fog: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, .016, z); m.raycast = () => {}; m.userData.raw = true; p.add(m); return m;
}
const shine = (col) => new T.MeshBasicMaterial({ color: col, side: T.DoubleSide, fog: false });
/** a small sky lantern far away, glowing */
function skyLantern(p, s = 1) {
  const k = keep(p); k.scale.setScalar(s);
  lit(k, new T.CylinderGeometry(.085, .062, .19, 4), shine(['#ffc45e', '#ffb458', '#ffd27a'][Math.floor(s * 10) % 3]), 0, .095, 0).rotation.y = Math.PI / 4;
  halo(k, 0, .1, -.02, .62, .55);
  return k;
}

export default {
  id: 's12-gates', land: 'ai', short: '等你點頭', calm: true,
  title: '哪些事能放心交給 AI，哪些得由你親自點頭？',
  sources: [{ n: 22 }],
  diary: DIARY,
  takeaway: '不是讓 AI 做越多越好。錯了收得回的事放手讓它做；收不回的事，先等人點頭。',
  quote: { t: 'Agent 的成熟度不等於自主權越高越好。', n: 22, page: 195 },
  look: { bg: '#192935', table: '#42555e', key: '#d9d8c9', fill: '#95aebc', sky: '#c1c9c8' },   // night
  ground(G) {
    if (printedYard(G, 'pier')) return;
    G.wash('#7373a8');
    // the night sea beyond the sea wall, with lantern light on it
    G.rect(0, -3.0, 12.4, 1.3, '#3f4f88', { r: 0 });
    G.marks('wave', -6, -3.6, 6, -2.45, { n: 42, col: '#ffffff2e', size: .16, seed: 12 });
    for (const [x, z, w] of [[-4.6, -2.7, .34], [-2.4, -2.95, .26], [-1.2, -2.6, .22], [.9, -3.2, .3], [2.3, -2.75, .26], [4.2, -2.9, .32], [-3.3, -3.35, .2], [3.2, -3.4, .22]])
      for (let i = 0; i < 3; i++) G.path([[x - w * (1 - i * .3), z + i * .09], [x + w * (1 - i * .3), z + i * .09]], { w: .035, col: '#ffd27a' + ['aa', '77', '44'][i], sharp: true });
    G.path([[-6, -2.36], [6, -2.36]], { w: .13, col: '#a3abd6', sharp: true });
    // paving
    for (let i = 0; i < 12; i++) G.path([[-6, -2.0 + i * .5], [6, -2.0 + i * .5]], { w: .016, col: '#ffffff1c', sharp: true });
    for (let i = 0; i < 17; i++) G.path([[-6 + i * .75 + (i % 2) * .15, -2.3], [-6 + i * .75 + (i % 2) * .15, 3.6]], { w: .012, col: '#ffffff12', sharp: true });
    // the lantern circle, warm where the big lantern stands
    G.circle(-.8, -.8, 1.7, '#8a86be', { edge: '#c3bfe4', edgeW: .05 });
    G.circle(-.8, -.8, 1.25, null, { edge: '#b9bee277', edgeW: .03 });
    for (const [r, a] of [[1.6, '16'], [1.25, '1e'], [.9, '26'], [.55, '30']]) G.circle(-.8, -.8, r, '#ffcf7a' + a);
    // warm spots under the wish table, the cat's little lantern and the tea stall
    for (const [x, z, r] of [[-1.8, .84, .8], [-1.3, 1.65, .55], [1.8, .9, 1.1]]) for (const k of [1, .7, .45]) G.circle(x, z, r * k, '#ffcf7a14');
    // a path from the reader's side to the circle
    G.path([[-.6, 3.6], [-.7, 2.2], [-.8, .9]], { w: .5, col: '#ffffff14' });
    for (const side of [-1, 1]) {
      const x = side * 3.88;
      G.path([[x-.45,-2.56],[x+.45,-2.56]], { w:.036, col:'#e2c39b91' });
      G.path([[x-.24,-2.69],[x+.29,-2.69]], { w:.026, col:'#c6bfd799' });
    }
  },
  build(S) {
    const st = S.state({ phase: 'intro', busy: false, nodded: false });
    const GLOW = { u: 0 }, LIFT = { y: 0 }, GL = [];
    let hold = false, look = false, ceSlip = false, draw = false, nodT = 0, back = null, catBusy = false;
    const writing = { u:0, park:1 }, transfer = { u:0 }, pasting={reach:0}, lettingGo={u:0,relax:1};
    const knots=[], freeEnds=[null,null];
    let released=false;
    let flyingWish = null;
    /** a lantern colour that goes from moonlit paper (off) to lamplight (on) as GLOW.u goes from 0 to 1 */
    const gm = (on, off = .58) => { const c1 = new T.Color(on), c0 = typeof off === 'number' ? c1.clone().multiplyScalar(off) : new T.Color(off); const m = new T.MeshBasicMaterial({ color: c0, side: T.DoubleSide, fog: false }); GL.push([m, c0, c1]); return m; };
    const WIN = shine(WARM);

    lanternCraft(S, halo, pool);
    lanternWorkshop(S);

    lanternQuay(S);
    // ---- the moon, high: it is night
    let nightSky, stars, cupOutline;
    const constellation = [];
    S.plant(1.17, -3.29, g => {
      nightSky = keep(g);
      stars = editionSky(nightSky, {kind:'moon',y:2.4,r:.42}) || skyDisc(nightSky, {kind:'moon',y:2.4,r:.42});
      halo(nightSky, 0, 2.42, -.08, 1.9, .28, '#cfd6ff');
      const patch = keep(nightSky,-.87,2.30,-.03);
      cupOutline = keep(patch);
      // The last page remembers the very first tasting cup.
      const rim=[[-.28,.10],[.19,.10],[.13,-.15],[-.18,-.15],[-.28,.10]];
      const handle=[[.18,.061],[.32,.067],[.38,.004],[.32,-.070],[.155,-.070]];
      const steam=[[-.11,.17],[-.131,.24],[-.085,.33]];
      for (const edge of [rim,handle,steam]) {
        for (let i=1;i<edge.length;i++) beam(cupOutline,[...edge[i-1],0],[...edge[i],0],.010,'#c5aa75',5);
      }
      cupOutline.visible=false;
      const shape=[rim[0],rim[1],rim[2],rim[3],handle[2],handle[3],steam[1],steam[2]];
      shape.forEach(([x,y],i)=>{
        const a=i*2.17, rest=[Math.cos(a)*(.44+i*.023),Math.sin(a)*(.34+i*.014)];
        const pin=keep(patch,rest[0],rest[1],.012);
        disc(pin,0,0,0,i%3?.020:.032,'#e7cf8b',.007,5);
        constellation.push({pin,rest,x,y});
      });
    });
    S.pad(stars, .42);
    S.discovery(nightSky, { id:'moon', label:'月牙旁的星圖', duration:1.47, sound:'cup', aim:[0,2.4,0],
      draw(u,visit,reduced) {
        const t=reduced?1:u*u*(3-2*u), connected=visit%2?t:1-t;
        for (const {pin,rest,x,y} of constellation) {
          pin.position.x = rest[0]+(x-rest[0])*connected;
          pin.position.y = rest[1]+(y-rest[1])*connected;
        }
        cupOutline.visible=connected>.81;
        cupOutline.scale.y=Math.max(.01,(connected-.81)/.19);
      },
      reset() {
        for (const {pin,rest} of constellation) pin.position.set(rest[0],rest[1],.012);
        cupOutline.visible=false;
      }
    });

    // ---- the village across the water: lit windows
    for (const [x, z, s] of [[-4.13, -2.79, 1.24], [4.47, -2.82, 1.12]]) S.plant(x, z, (g) => { if (harborRow(g, x < 0 ? 'left' : 'right')) return; tab(g, .8); house(g, .9, .7, .6, '#d9c4a4', '#8b4f5c'); lit(g, new T.PlaneGeometry(.17, .15), WIN, .198, .392, .33); }, { s });
    S.plant(5.5, -1.7, (g) => pine(g, 1.47));
    // strings of little lights along the sea wall
    const bulbs = [shine('#ffd47a'), shine('#ff9a6a')];
    for (const side of [-1, 1]) S.plant(side * 3.95, -2.1, (g) => {
      for (const x of [-1.45, 1.45]) { const p = group(g); p.position.x = x; tab(p, .2); beam(p, [0, 0, 0], [0, 1.05, 0], .022, C.bark, 5); ball(p, 0, 1.07, 0, .035, C.gold, 0); }
      const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12, x = -1.45 + 2.9 * u; pts.push([x, 1.0 - Math.sin(Math.PI * u) * .28]); }
      for (let i = 0; i < 12; i++) beam(g, [pts[i][0], pts[i][1], 0], [pts[i + 1][0], pts[i + 1][1], 0], .006, '#2b2f45', 3);
      for (let i = 1; i < 12; i++) { lit(g, new T.SphereGeometry(.045, 8, 6), bulbs[i % 2], pts[i][0], pts[i][1] - .05, 0); halo(g, pts[i][0], pts[i][1] - .05, .02, .42, .45); }
    });

    // ---- a ferry going home far out, its windows lit
    let ferry, funnel, puff, wake; const cabins=[];
    S.plant(-1.95, -3.2, (g) => {
      ferry = keep(g);
      poly(ferry, [[-1.0, .3], [1.05, .3], [.85, 0], [-.85, 0]], .4, '#e9dcc0', 0, 0, -.2);
      poly(ferry, [[-1.02, .3], [1.07, .3], [1.05, .23], [-1.0, .23]], .42, C.red, 0, 0, -.21);
      box(ferry, -.15, .5, 0, 1.1, .4, .32, C.white);
      for (let i=0;i<4;i++) cabins.push(lit(ferry,new T.PlaneGeometry(.15,.13),WIN,-.55+i*.27,.52,.165));
      box(ferry, -.15, .72, 0, 1.2, .05, .36, C.navy);
      funnel = keep(ferry, .3, .74, 0); cyl(funnel, 0, .18, 0, .09, .1, .36, C.red, 8); cyl(funnel, 0, .37, 0, .1, .1, .05, C.dark, 8);
      puff = keep(ferry, .3, 1.05, 0); const b = ball(puff, 0, 0, 0, .12, C.white, 1); b.scale.z = .5; puff.visible = false;
      wake=keep(ferry,-.88,.012,.02);
      for(const sign of [-1,1]) {
        beam(wake,[0,0,sign*.15],[-.51,0,sign*.37],.016,'#e3d4ae',4);
        beam(wake,[-.40,0,sign*.27],[-.78,0,sign*.45],.011,'#9dafb0',4);
      }
      wake.visible=false;
    }, { s: .55 });
    S.discovery(ferry, { id: 'ferry', label: '晚班渡輪的汽笛', duration: 1.7, sound: 'ferry-horn',
      aim: [0,.50,0], draw(u,visit,reduced) {
        const travel=reduced?1:u*u*(3-2*u);
        ferry.position.x = 1.20*(visit%2?travel:1-travel);
        wake.visible = !reduced && u>.04 && u<.94;
        wake.position.x = visit%2 ? -.88 : .88; wake.scale.x = visit%2 ? 1:-1;
        wake.scale.z = .2+.8*Math.sin(Math.PI*u);
        puff.visible=!reduced && u>.02 && u<.86;
        puff.position.set(.30-.36*u,1.05+.67*u,.02); puff.scale.setScalar(.9-.58*u);
        cabins.forEach((win,i)=>{ win.visible = i!==((visit+(u<.30?0:1))%4); });
      },
      reset(){ferry.position.x=0;wake.visible=puff.visible=false;cabins.forEach(win=>{win.visible=true;});}
    });

    // ---- other people's lanterns, slowly rising far away (more join at the end)
    const sea = [], more = []; let rnd = 41; const R = () => ((rnd = (Math.imul(rnd, 1664525) + 1013904223) >>> 0) / 4294967296);
    const SEA0 = [[-4.6, -3.3, 1.5, 1], [-2.5, -3.2, 2.2, .9], [-1.3, -3.45, 1.2, .8], [2.6, -3.3, 1.9, .9], [4.5, -3.45, 1.35, 1], [.6, -3.05, 2.7, .8]];
    const SEA1 = []; for (let i = 0; i < 18; i++) SEA1.push([-5.2 + i * .6 + R() * .3, -3.4 + R() * 1.5, 1.4 + R() * 2.0, .7 + R() * .4]);
    for (const side of [-1, 1]) S.plant(side * 3.2, -3.0, (g) => {
      for (const [list, late] of [[SEA0, false], [SEA1, true]]) for (const [x, z, y, s] of list) {
        if (Math.sign(x || 1) !== side) continue;
        const slot = keep(g, x - side * 3.2, 0, z + 3.0), bob = keep(slot); skyLantern(bob, s);
        sea.push({ bob, y0: y - .6, ph: R(), sp: .028 + R() * .02 });
        if (late) { slot.visible = false; more.push(slot); }
      }
    });

    // ---- the place sign: the only words on the page
    S.plant(-4.5, -.45, (g) => {
      if (engravedPlace(g, '天 燈 廣 場', { w: 1.32 })) return;
      tab(g, .5); beam(g, [0, 0, 0], [0, 1.25, 0], .035, C.bark, 6);
      tag(g, '天燈廣場', 0, 1.02, .04, { h: .27, paper: C.white, ink: C.navy });
    });

    // ---- the big lantern and the lantern maker
    let LP, lanLift, lanHov, bob, body, flame, flick, tug, sheets, bucket, brush, filament, swatchFlap, lanHalo, lanPool, padMesh, maker, ropeL, ropeR, pastedWish;
    S.plant(-.18, -.55, (g) => {
      LP = g;
      lanLift = keep(g, ...A); lanHov = keep(lanLift); bob = keep(lanHov);
      body = keep(bob); body.name = '起飛的天燈紙囊'; body.rotation.y = Math.PI / 4;
      const b = BW, t = TW;
      const bfl = [-b, 0, b], bfr = [b, 0, b], bbr = [b, 0, -b], bbl = [-b, 0, -b], tfl = [-t, LH, t], tfr = [t, LH, t], tbr = [t, LH, -t], tbl = [-t, LH, -t], apex = [0, LH + .2, 0];
      litQuad(body, bfl, bfr, tfr, tfl, gm('#ffcf6e', '#bdb6d2'));      // faces the reader on the right
      litQuad(body, bbl, bfl, tfl, tbl, gm('#ffad57', '#a39cbf'));      // faces the reader on the left
      const backM = gm('#f59652', '#8e88aa'); litQuad(body, bfr, bbr, tbr, tfr, backM); litQuad(body, bbr, bbl, tbl, tbr, backM);
      const capM = gm('#ffe0a0', '#cfc8e0'); for (const [p, q] of [[tfl, tfr], [tfr, tbr], [tbr, tbl], [tbl, tfl]]) litQuad(body, p, q, apex, apex, capM);
      // bamboo: ribs, the bottom hoop, the cross wires and the fuel pad
      for (const [p, q] of [[bfl, tfl], [bfr, tfr], [bbr, tbr], [bbl, tbl]]) beam(body, p, q, .014, C.wood, 5);
      for (const [p, q] of [[bfl, bfr], [bfr, bbr], [bbr, bbl], [bbl, bfl]]) beam(body, p, q, .022, C.bark, 5);
      for (const [p, q] of [[tfl, tfr], [tfr, tbr], [tbr, tbl], [tbl, tfl]]) beam(body, p, q, .012, C.wood, 5);
      beam(body, bfl, bbr, .006, '#d8ccaa', 4); beam(body, bfr, bbl, .006, '#d8ccaa', 4); box(body, 0, 0, 0, .13, .03, .13, '#f2e2c0');
      flame = keep(body, 0, .02, 0); flick = keep(flame);
      lit(flick, new T.ConeGeometry(.065, .22, 8), shine('#ffbf4a'), 0, .11, 0); lit(flick, new T.ConeGeometry(.032, .13, 8), shine('#fff3c4'), 0, .075, 0);
      flame.visible = false;
      // The only mark on the lantern is the same hand-drawn heart from the desk.
      const onPanel = (face, y, off) => {
        const w = b + (t - b) * y / LH, a = Math.atan((t - b) / LH), k = keep(body); k.rotation.order = 'YXZ';
        if (face === 'front') { k.position.set(off, y, w + .014); k.rotation.set(a, 0, 0); } else { k.position.set(-w - .014, y, off); k.rotation.set(a, -Math.PI / 2, 0); }
        return k;
      };
      // Two strips of tissue overlap at each hem. Their darker seams carry the scale of the lantern.
      const hemInk = gm('#e9aa56', '#a39fbd'), foldInk = gm('#f5be62', '#b5b0c9');
      for (const face of ['front', 'left']) {
        const upper = onPanel(face, LH * .93, 0), lower = onPanel(face, .13, 0);
        litShape(upper, [[-t*.88,0],[t*.88,0],[t*.87,.025],[-t*.87,.025]], hemInk);
        litShape(lower, [[-b*.90,0],[b*.90,0],[b*.91,.022],[-b*.91,.022]], hemInk);
        for (const side of [-1,1]) {
          const crease = onPanel(face, .18, side * b * .59);
          litShape(crease, [[0,0],[.012,0],[side*.105,.85],[side*.105-.013,.85]], foldInk);
        }
      }
      // The wish faces its owner across the table and is clear of the maker's scaled back.
      pastedWish=keep(onPanel('left',.58,-.035));
      pastedWish.name='燈面上白面鼯鼠畫的紅心';
      wishCard(pastedWish,true); pastedWish.visible=false;
      // lines over the top that say "it wants to go up"
      tug = keep(bob, 0, LH + .38, .1);
      for (let i = 0; i < 3; i++) litShape(tug, [[-.09, 0], [0, .075], [.09, 0], [.09, -.04], [0, .035], [-.09, -.04]], shine('#fff1c8'), (i - 1) * .5, 0, 0);
      tug.visible = false;
      lanHalo = halo(bob, 0, LH * .55, 0, 3.6, 0); lanHalo.visible = false;
      padMesh = S.pad(bob, .82, [0, LH * .5, 0]); padMesh.visible = false;
      body.scale.y = .03;                                   // at first it is only a flat stack of paper on a bamboo frame
      lanPool = pool(g, 0, LZ, 3.8, 0);
      // loose sheets and the paste bucket beside it
      sheets = keep(g, -.85, 0, -.2);
      [[C.cream, .2, 0, 0], [C.coral, -.25, .05, .08], [C.gold, .5, -.03, .16]].forEach(([col, r, dx, y]) => { slab(sheets, [[-.26, -.2], [.26, -.2], [.26, .2], [-.26, .2]], .012, col, .012 + y * .1).rotation.z = r; });
      for (const [p, q] of [[[-.3, .06, .3], [.3, .06, .3]], [[.3, .06, .3], [.3, .06, -.1]]]) beam(sheets, p, q, .016, C.wood, 5);
      bucket = keep(g, -.99, 0, -1.42); bucket.scale.setScalar(1.16); tab(bucket, .7);
      cyl(bucket,0,.152,0,.175,.14,.30,'#78867d',12);
      cyl(bucket,0,.304,0,.172,.172,.015,'#f1e1b3',12);
      ring(bucket,0,.30,0,.177,.017,'#b59663',14).rotation.x=Math.PI/2;
      brush=keep(bucket,.01,.308,.01); brush.name='沾著漿糊的竹刷';
      poly(brush,[[-.060,0],[.056,0],[.044,.110],[-.048,.110]],.024,'#d3ba89');
      box(brush,0,.122,.008,.095,.039,.039,'#805c45');
      beam(brush,[0,.14,.014],[0,.403,.016],.025,'#ae8354',7);
      for(const x of [-.032,0,.031]) box(brush,x,.033,.028,.008,.060,.006,'#f5e9ca');
      brush.rotation.z=-.22;
      filament=keep(bucket,.01,.313,.035);
      cyl(filament,0,.5,0,.010,.019,1,'#eddfb8',6); filament.visible=false;
      const scrap=keep(bucket,.393,.034,.094);
      slab(scrap,[[-.19,-.15],[.17,-.12],[.19,.15],[-.17,.16]],.012,'#c49a5b');
      slab(scrap,[[-.135,-.12],[.04,-.12],[.055,.14],[-.15,.13]],.013,'#dda45f',.016);
      swatchFlap=keep(scrap,.035,.038,0);
      slab(swatchFlap,[[0,-.13],[.136,-.12],[.14,.13],[0,.14]],.012,'#ac6053');
      beam(scrap,[.024,.047,-.12],[.032,.047,.12],.011,'#e6d2a2',5);
      swatchFlap.rotation.z=.70;
      // Eleven stitches run along the hem of the lantern maker’s work apron.
      maker = S.robot(g, { species: 'pangolin', x: 0, y: 0, z: RZ, s: 1.30, prop: false, lights: S.index - 1 });
      // the two strings it holds on by (stretched between its hands and the lantern every frame)
      for (let i = 0; i < 2; i++) {
        const k=keep(g); k.name=i?'天燈右繩':'天燈左繩';
        cyl(k,0,.5,0,.019,.019,1,'#f0ce83',7);
        cyl(k,0,.5,.010,.010,.010,1,'#fff1d1',6);
        const knot=keep(body,i?0:-BW,-.015,i?BW:0);
        knots.push(knot);
        knot.name=i?'右繩竹結':'左繩竹結';
        cyl(knot,0,0,0,.030,.029,.057,'#845236',8);
        k.visible=false; if (i) ropeR=k; else ropeL=k;
      }
    }, {s:1.29});
    const recoil = (u) => {
      const spring = { u }; back = spring;
      S.to(spring, { u: 0 }, .38, 'out').then(() => { if (back === spring) back = null; });
    };
    const liftProp = S.pull(lanLift, { id: 'lift', label: '穿山甲師傅兩爪握住的燈繩', from: A, to: B,
      move: (u) => {
        if (st.phase !== 'touch' || st.busy) return;
        // While the maker still holds the cord, only its slack moves.
        lanLift.position.set(A[0], A[1] + (B[1] - A[1]) * u * .10, A[2] + (B[2] - A[2]) * u * .10);
      },
      end: (u) => {
        if (st.phase !== 'touch' || st.busy) return;
        if (u > .4) { touch(true); return; }
        recoil(u);
      },
      tap: () => { if (st.phase === 'ready') go(); else if (st.phase === 'touch') touch(false); else S.wiggle(bob, .05); } });
    const liftDrag = liftProp.drag;
    const startPull = liftDrag.start;
    liftDrag.start = (e) => { back = null; startPull(e); };
    const endPull = liftDrag.end;
    liftDrag.end = (e) => {
      if (e.cancelled) { recoil(liftProp.value()); return; }
      endPull(e);
    };
    liftProp.drag = null;     // it can only be sent up once the lantern maker is holding it
    S.hero(maker, { label: '戴墨綠圍裙、握著燈繩的穿山甲師傅', ready: () => st.phase === 'ready', go });
    S.pad(bucket,.28,[.04,.28,0]);
    S.discovery(bucket, { id:'paste',label:'竹刷與試糊的紙縫',duration:1.55,sound:'paste-brush',
      aim:[.13,.28,.06],draw(u,visit,reduced) {
        const v=Math.min(1,Math.max(0,(u-.22)/.32)), down=Math.min(1,Math.max(0,(u-.65)/.35));
        const reach=v*(1-down), lift=reduced?0:Math.sin(Math.PI*Math.min(1,u/.55))*.30;
        brush.position.set(.01+.42*reach,.308-.214*reach+lift,.01+.114*reach);
        brush.rotation.z=-.22+.77*reach;
        filament.visible=!reduced && u>.025 && u<.30;
        filament.scale.set(1,Math.max(.012,brush.position.y-.305),1);
        filament.rotation.z=-.42*v;
        const wet=Math.min(1,Math.max(0,(u-.48)/.21));
        swatchFlap.rotation.z=.70*(visit%2 ? 1-wet : wet);
      },
      reset(){brush.position.set(.01,.308,.01);brush.rotation.z=-.22;filament.visible=false;swatchFlap.rotation.z=.70;}
    });

    // The white-faced flying squirrel draws a wish for the family at the low table.
    let writer, wish, filledHeart, candle, cflick, candleGlow, shadow, silhouette, screenLight;
    let writingHand, pen, penCup;
    const inkLines=[];
    S.plant(-2.85, .92, (g) => {
      writer = S.person(g, { species:'glider', s:1.02, prop:false });
      // The white cheeks face inward, toward the wish and the lantern maker.
      writer.inner.scale.x=-1;
      writingHand=writer.rig.grips[0]; writingHand.name='白面鼯鼠握筆的前爪';
      writer.rig.grips[1].name='扶住願箋的另一隻爪';
      const tb = group(g); tb.position.set(.34, 0, .025); tab(tb, .7);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) beam(tb, [sx * .28, 0, sz * .16], [sx * .28, .42, sz * .16], .018, C.bark, 5);
      box(tb, 0, .43, 0, .7, .04, .44, C.wood);
      wish=keep(tb,-.09,.467,.175);wish.rotation.x=-1.02;wish.scale.setScalar(1.36);wish.name='白面鼯鼠的紅心願箋';
      const writingBoard=group(tb); writingBoard.position.copy(wish.position); writingBoard.position.y-=.011; writingBoard.rotation.copy(wish.rotation);
      writingBoard.scale.copy(wish.scale);
      card(writingBoard,0,-.012,-.012,.33,.302,'#bc975e',.014,.016);
      filledHeart=wishCard(wish,false);
      for(let i=0;i<inkPath.length-1;i++){
        const [x,y]=inkPath[i], [nx,ny]=inkPath[i+1], segment=keep(wish,x,y,.023);
        segment.rotation.z=Math.atan2(ny-y,nx-x);
        beam(segment,[0,0,0],[Math.hypot(nx-x,ny-y),0,0],.0082,'#ad4338',7);
        segment.visible=false; inkLines.push(segment);
      }
      penCup=keep(tb,-.29,.455,.19); penCup.name='桌上的筆筒';
      cyl(penCup,0,.039,0,.040,.030,.078,'#587975',9);
      cyl(penCup,0,.079,0,.032,.032,.004,'#51493d',9);
      pen=keep(g); pen.name='白面鼯鼠的朱砂筆';
      beam(pen,[0,-.078,0],[0,.173,0],.014,'#a87449',8);
      cyl(pen,0,-.084,0,.016,.016,.029,'#493f39',8);
      cone(pen,0,-.115,0,.014,.046,'#a64436',7).rotation.z=Math.PI;
      const tip=keep(pen,0,-.138,0);tip.name='紙上的筆尖';
      // The shadow play has its own low bench, clear of the writer and both ropes.
      const stool=keep(g,-.61,0,-.28);
      for(const x of [-.18,.18])for(const z of [-.10,.10]) box(stool,x,.136,z,.034,.272,.034,'#96724e');
      box(stool,0,.288,0,.46,.038,.29,'#c69e68');
      candle=keep(stool,-.012,.31,.074); candle.scale.setScalar(.84);
      cyl(candle, 0, .06, 0, .035, .035, .12, C.white, 8);
      cflick = keep(candle, 0, .13, 0); lit(cflick, new T.ConeGeometry(.03, .1, 8), shine('#ffc24d'), 0, .04, 0); candleGlow=halo(candle,0,.17,0,.7,.5);
      // A cutout on a pivot stands between the candle and its vellum screen.
      card(candle,.045,.018,-.135,.70,.52,'#ccb991',.020,.027);
      card(candle,.045,.045,-.111,.63,.46,'#ead8aa',.012,.020);
      screenLight=halo(candle,.016,.275,-.095,.62,.18);
      function rabbit(parent,ink) {
        const haunch = disc(parent,-.048,.101,0,.103,ink,.010,12);
        haunch.scale.x=.91;
        poly(parent,[[-.09,.013],[-.056,.098],[.007,.139],[.044,.185],[.059,.229],[.10,.240],
          [.15,.228],[.170,.200],[.196,.190],[.179,.172],[.120,.159],[.09,.13],[.072,.053],
          [.124,.033],[.126,.015],[.038,.014],[.009,.033],[-.020,.015]],.009,ink);
        disc(parent,-.144,.082,.002,.039,ink,.010,9);
        for(const [x,tilt] of [[.065,.37],[.100,-.19]]) {
          const ear=poly(parent,[[-.021,0],[-.025,.081],[-.015,.137],[.004,.159],[.021,.131],
            [.026,.081],[.018,.011]],.010,ink,x,.209,.001);
          ear.rotation.z=tilt;
        }
      }
      shadow=keep(candle,-.008,.057,-.086); rabbit(shadow,'#8c765a'); shadow.scale.setScalar(.63);
      silhouette=keep(candle,-.023,.04,-.020); rabbit(silhouette,'#755d41'); silhouette.scale.setScalar(.32);
      beam(candle,[-.023,.012,-.017],[-.023,.068,-.017],.010,'#8f7959',5);

      pool(g,-.61,-.28,1.3,.30);
    }, {s:1.58});
    const gp=S.curio(writer.root,{id:'writer',label:'核對心願、點頭放燈的白面鼯鼠',quiet:true,tap(){
      if(st.phase==='touch'&&!st.busy) touch(false);
      else if(st.phase==='ready') go();
      else if(st.phase==='done') writer.wave(.6);
    }}); writer.propId=gp.id;
    S.curio(wish,{id:'wish',label:'白面鼯鼠親筆畫的心願',quiet:true,tap:async()=>{
      if(st.phase!=='ready')return;
      S.sound('paper');await S.to(wish.rotation,{x:-.89},.2,'out');await S.to(wish.rotation,{x:-1.02},.4,'out');
    }});
    S.discovery(candle, { id: 'flame', label: '燭台上的紙兔影', duration: 1.06, sound:'paper',
      draw(u, visit, reduced) {
        const v=reduced?1:u*u*(3-2*u), lift=visit%2?v:1-v;
        silhouette.position.z=-.020+.050*lift; silhouette.rotation.z=-.11*lift;
        shadow.scale.setScalar(.63+.65*lift); shadow.position.x=-.008-.041*lift;
        shadow.rotation.z=-.11*lift; screenLight.material.opacity=.18+.25*lift;
        cflick.scale.y=1+.52*(reduced?0:Math.sin(Math.PI*u)); candleGlow.material.opacity=.5+.17*lift;
      },
      reset(){silhouette.position.z=-.020;silhouette.rotation.z=0;shadow.scale.setScalar(.63);shadow.position.x=-.008;shadow.rotation.z=0;screenLight.material.opacity=.18;cflick.scale.y=1;candleGlow.material.opacity=.5;} });

    // ---- a cat and a little paper lantern lying on its side
    let cat, tail, small;
    const CAT_OUT = -.44, CAT_IN = -.02;
    S.plant(-1.3, 1.6, (g) => {
      tab(g, .5);
      small = keep(g, 0, .16, 0);
      const tube = lit(small, new T.CylinderGeometry(.155, .155, .36, 14, 1, true), shine('#ff9468')); tube.rotation.z = Math.PI / 2;
      for (const x of [-.12, 0, .12]) ring(small, x, 0, 0, .157, .008, '#a3443a', 18).rotation.y = Math.PI / 2;
      disc(small, .182, 0, 0, .16, '#7d3f35', .02, 16).rotation.set(0, Math.PI / 2, 0);
      halo(small, 0, .02, .05, 1.0, .5);
      cat = keep(g, CAT_OUT, 0, .02);
      const b = ball(cat, 0, .1, 0, .1, '#e0954e', 1); b.scale.set(1.35, .75, .55);
      const h = ball(cat, .13, .17, .01, .068, '#e0954e', 1); h.scale.z = .7;
      for (const dz of [-.025, .025]) poly(cat, [[-.03, 0], [.03, 0], [0, .06]], .012, '#c97a3a', .13 + dz * 1.4, .22, dz);
      for (const dx of [-.07, .06]) box(cat, dx, .03, 0, .03, .07, .05, '#c97a3a');
      disc(cat, .175, .18, .05, .01, C.ink, .006, 6);
      tail = keep(cat, -.12, .1, 0); beam(tail, [0, 0, 0], [-.12, .1, 0], .018, '#c97a3a', 5); beam(tail, [-.12, .1, 0], [-.1, .19, 0], .016, '#c97a3a', 5);
    });
    S.curio(cat, { id: 'cat', label: '鑽小紙燈的橘貓', quiet:true, tap: async () => {
      if (catBusy) return; catBusy = true; S.sound('soft');
      await S.to(cat.position, { x: CAT_IN }, .5, 'inOut'); S.wiggle(small, .12); S.sound('tap');
      await S.wait(1.4); await S.to(cat.position, { x: CAT_OUT }, .45, 'out'); catBusy = false;
    } });

    // ---- 記錄員
    let ce;
    S.plant(.68, 1.76, (g) => { ce = S.person(g, { s: 1.36, kind: 'ce', species: 'otter', coat: C.navy }); });
    const cp = S.curio(ce.root, { id: 'ce', label: '接心願箋的港口茶攤夥計', quiet:true, tap: () => { ce.wave(.8); if(slip.visible) corner.tap(); } }); ce.propId = cp.id;

    // The morning tea counter is here for the evening lantern fair.
    let lid, slip, ear, mini, plank, figs, post, chime;
    S.plant(1.8, .45, (g) => {
      tab(g, 1.8);
      box(g, 0, .31, 0, 1.7, .62, .8, '#c99a63');
      for (const y of [.205, .41]) box(g, 0, y, .402, 1.7, .014, .01, '#a87a48');
      for (const sx of [-1, 1]) { box(g, sx * .8, .31, .405, .1, .62, .03, '#b3824e'); box(g, sx * .855, .31, 0, .012, .62, .8, '#b3824e'); }
      lid = keep(g, 0, .62, -.4); box(lid, 0, .03, .4, 1.76, .06, .84, '#b98a55'); for (const x of [-.5, .5]) box(lid, x, .066, .4, .09, .012, .84, '#a87a48');
      lid.rotation.x = -1.82;
      crateLetterpress(g, lid);
      homeTeaService(S, g);
      // A wish slip waits on the tea counter for the fair.
      slip = keep(g, -.6, .17, .414); slip.rotation.z = .07;
      card(slip, 0, 0, 0, .38, .3, C.white, .012, .02);
      poly(slip, [[-.05, 0], [.05, 0], [.066, .13], [-.066, .13]], .006, C.coral, -.09, .11, .013);
      poly(slip, [[-.022, 0], [.022, 0], [0, .04]], .006, C.gold, -.09, .06, .013);
      for (const x of [.045,.100]) disc(slip,x,.171,.017,.033,C.red,.007,11);
      poly(slip,[[0,.174],[.108,.174],[.053,.095]],.008,C.red,.019,0,.018);
      ear=keep(slip,.01,.014,.045); ear.name='心願箋的摺角';
      poly(ear,[[0,0],[.16,0],[.16,.14]],.008,'#e7c889');
      beam(ear,[.01,.006,.014],[.15,.137,.014],.006,'#b59869',4);
      // folded into a little lantern later
      mini = keep(g, 0, 0, 0); lit(mini, new T.CylinderGeometry(.12, .09, .26, 4), shine('#fff0c8'), 0, .13, 0).rotation.y = Math.PI / 4;
      litShape(mini, [[-.03, 0], [.03, 0], [.04, .08], [-.04, .08]], shine(C.coral), 0, .1, .095); halo(mini, 0, .14, 0, 1.0, .65); mini.visible = false;
      // the last plank, leaning on the crate; at the end it stands up as the shop's new sign
      post = keep(g, 0, 0, -.5); for (const sx of [-1, 1]) beam(post, [sx * 1.0, 0, 0], [sx * 1.0, 2.05, 0], .03, C.bark, 6); post.visible = false;
      plank = cratePlank(g, 1.09, .42, .45, { len: 1.3, h: .36, rz: -.7 });
      chime=keep(plank,-.47,-.168,.025);
      beam(chime,[0,0,0],[0,-.085,0],.01,'#ab9267',5);
      poly(chime,[[-.072,-.156],[-.036,-.094],[.043,-.093],[.076,-.155]],.022,'#b99253');
      ball(chime,0,-.172,.016,.025,'#715838',0);
      figs = keep(plank, .27, 0, .032); figs.scale.setScalar(1.15);
      // The night-market block uses the same owl and reporter as the street itself.
      for (const [species,x] of [['owl',-.12],['leopard',.12]]) {
        const print = streetFigure(species);
        print.position.set(x,-.148,.022); print.scale.set(.22,.22,.13);
        figs.add(print);
      }
      // and a heart between them
      for (const sx of [-1, 1]) disc(figs, sx * .014, .07, .004, .016, C.red, .005, 10); poly(figs, [[-.029, .066], [.029, .066], [0, .03]], .005, C.red, 0, 0, .002);
      figs.visible = false;
    }, { s: 1.1 });
    const corner=S.discovery(slip, { id:'slip',label:'茶攤心願箋的摺角',duration:.80,sound:'paper',
      draw(u,visit,reduced){const v=reduced?1:u*u*(3-2*u);ear.rotation.y=-2.44*(visit%2?v:1-v);},
      reset(){ear.rotation.y=0;}
    });
    S.discovery(plank,{id:'plank',label:'招牌下的銅鈴',duration:1.12,sound:'cycle-bell',
      draw(u,visit,reduced){chime.rotation.z=(visit%2?1:-1)*(reduced?.13:Math.sin(u*Math.PI*3.4)*.76*(1-u));},
      reset(){chime.rotation.z=0;}
    });

    // ---- the story
    const up=new T.Vector3(0,1,0), down=new T.Vector3(0,-1,0);
    const inkAt=new T.Vector3(), nibAt=new T.Vector3(), gripAt=new T.Vector3(), intoCup=new T.Vector3();
    const wristOffset=new T.Vector3(.044,.127,.038);
    const paperCorner=new T.Vector3(), pressSpot=new T.Vector3(), idlePaw=new T.Vector3();
    function writeWish(t) {
      const stroke=writing.u*(inkPath.length-1), index=Math.min(inkPath.length-2,Math.floor(stroke));
      const part=stroke-index, [x,y]=inkPath[index], [nx,ny]=inkPath[index+1];
      inkLines.forEach((line,i)=>{
        line.visible=stroke>i && wish.visible;
        line.scale.x=Math.max(.001,Math.min(1,stroke-i));
      });
      filledHeart.visible=writing.u>=.998;
      if(!draw)return;
      writer.inner.rotation.z=-.042;
      writer.head.rotation.z=.15; writer.head.rotation.x=.11;
      writer.eyes.position.x=-.018;
      inkAt.set(x+(nx-x)*part,y+(ny-y)*part,.026);wish.localToWorld(inkAt);
      intoCup.set(0,.036,0);penCup.localToWorld(intoCup);
      nibAt.copy(inkAt).lerp(intoCup,writing.park);
      nibAt.y+=.067*Math.sin(writing.park*Math.PI);
      gripAt.copy(nibAt);writer.inner.worldToLocal(gripAt);gripAt.add(wristOffset);
      writer.rig.aimGrip(0,gripAt,-.26);
      paperCorner.set(-.119,.03,.024);wish.localToWorld(paperCorner);
      writer.inner.worldToLocal(paperCorner);
      writer.rig.aimGrip(1,paperCorner,-.26);
      writer.rig.spreadMembranes();
      writingHand.getWorldPosition(gripAt);
      pen.parent.worldToLocal(gripAt);pen.position.copy(gripAt);
      pen.parent.worldToLocal(nibAt);nibAt.sub(gripAt);
      pen.scale.y=nibAt.length()/.138;
      pen.quaternion.setFromUnitVectors(down,nibAt.normalize());
      if(!S.stage.still.matches && st.phase==='ready' && writing.u<.82) writer.head.rotation.z-=.018*Math.sin(t*2);
    }
    // The first resting frame already shows a hand on the paper and a hand on the brush.
    draw=true;writeWish(0);draw=false;
    async function pasteWish() {
      const dest=pastedWish.parent;
      dest.updateWorldMatrix(true,false);wish.updateWorldMatrix(true,false);
      const relative=new T.Matrix4().copy(dest.matrixWorld).invert().multiply(wish.matrixWorld);
      relative.decompose(pastedWish.position,pastedWish.quaternion,pastedWish.scale);
      flyingWish={
        position:pastedWish.position.clone(), rotation:pastedWish.quaternion.clone(), scale:pastedWish.scale.clone(),
        crooked:new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),-.33)
      };
      transfer.u=0; pastedWish.visible=true; wish.visible=false; S.sound('paper');
      S.to(pasting,{reach:1},.68,'inOut');
      await S.to(transfer,{u:1},.86,'inOut');
      flyingWish=null; pastedWish.position.set(0,0,0);pastedWish.scale.setScalar(1.7);pastedWish.rotation.set(0,0,-.33);
      await S.wait(.38); S.sound('paper');
      // Peel the lower corner far enough for the paw, heart and bamboo edge to show separately.
      await S.to(pastedWish.position,{z:.33},.31,'out');
      await S.to(pastedWish.rotation,{z:0},.50,'inOut');
      await S.wait(.18);
      await S.to(pastedWish.position,{z:0},.32,'in'); S.sound('stamp');
      await S.to(pasting,{reach:0},.30,'out');
    }
    function nod() {
      if (st.nodded) return;
      st.nodded=true; nodT=1.2; writer.still();
    }
    async function release() {
      if (!hold) return;
      hold=false; look=false; tug.visible=false; released=true;
      lettingGo.u=0; lettingGo.relax=1; S.sound('cord',maker.root);
      const still=S.stage.still.matches;
      S.to(LIFT,{y:0},still ? .16 : .46,still ?'out':'bounce');
      await S.to(lettingGo,{u:1},still ? .38 : .64,'lin');
      S.to(lettingGo,{relax:0},.52,'inOut');
    }
    async function go() {
      if (st.phase !== 'ready') return; S.set({ phase: 'busy' });
      await S.to(writing,{u:1},.58,'inOut');S.sound('paper');
      await S.to(writing,{park:1},.46,'inOut'); draw=false;
      maker.still();S.hide(sheets,.3);
      await S.to(body.scale,{y:1},.56,'out');maker.still();
      await pasteWish();await S.wait(.26);
      // light it: it glows and fills with hot air
      S.show(flame, .3); lanHalo.visible = true; S.sound('rise'); await S.to(GLOW, { u: 1 }, .8, 'inOut');
      // it wants to go up: the lantern maker grabs the strings and holds on, off its feet, and looks back at her
      hold = true; ropeL.visible = ropeR.visible = true; tug.visible = true; maker.still();
      S.to(lanHov.position,{y:HOV},1.0,'out');S.to(LIFT,{y:.12},1.0,'out');
      await S.wait(.7);look=true;ce.still();
      await S.wait(.6);
      S.set({ phase: 'touch' }); padMesh.visible = true; liftProp.drag = liftDrag; S.hint(writer.root, [0, .78, .08]);
    }
    async function touch(byHand) {
      if (st.phase !== 'touch' || st.busy) return; st.busy = true; S.hint(null); S.refresh(); liftProp.drag = null; padMesh.visible = false; back = null;
      if(!st.nodded){nod();await S.wait(.94);}
      if (hold) await release();
      // up it goes, into the sea of lanterns
      S.sound('whoosh');
      S.to(lanLift.position, { x: .6, y: 2.0, z: -2.0 }, 3.4, 'inOut'); S.to(lanLift.scale, { x: .55, y: .55, z: .55 }, 3.4, 'inOut');
      await S.wait(.6); more.forEach((k, i) => S.wait(i * .1).then(() => S.show(k, .5)));
      await S.wait(1.0); maker.still(); S.learn(maker);
      await S.wait(.5); maker.lamps.forEach((m, i) => S.wait(i * .06).then(() => S.pop(m, 2.3))); maker.cheer();
      // the note-taking owl tears the slip off the crate, folds it into a little lantern and sends it up too
      await S.wait(.6); ce.still(); await S.walk(ce, { x: .4 }, .6); ceSlip = true;
      await S.wait(.25); S.sound('paper');
      const hand = S.local(slip.parent, S.world(ce.armR, [0, -.36, .06]));
      S.to(slip.rotation, { z: .5 }, .35, 'out'); await S.to(slip.position, { x: hand.x, y: hand.y, z: hand.z }, .35, 'out');
      await S.to(slip.scale, { x: .3, y: .3 }, .2, 'in'); slip.visible = false;
      mini.position.copy(slip.position); S.show(mini, .25); S.sound('paper'); ceSlip = false; ce.cheer();
      const sky = S.local(mini.parent, new T.Vector3(1.55, 2.5, -1.3));
      S.to(mini.position, { x: sky.x, y: sky.y, z: sky.z }, 3.0, 'inOut');
      // the last plank stands up: the tea stall's new sign, the two of them on it
      await S.wait(.9); S.show(post, .4); await S.wait(.3); S.sound('whoosh');
      S.to(plank.rotation, { z: 0 }, .6, 'back'); S.to(plank.scale, { x: 1.3, y: 1.3, z: 1.3 }, .6, 'out'); await S.to(plank.position, { x: 0, y: 1.82, z: -.46 }, .6, 'out');
      S.sound('stamp'); S.show(figs, .45);
      writer.cheer();
      await S.wait(1.0);
      S.sound('done'); S.set({ phase: 'done' }); S.done();
    }
    S.onReadyLoop((phase) => {
      // A draft lifts the blank sheets. The maker checks them, then waits for the writer.
      const breeze = pulse(phase, .04, .58), waitForHer = pulse(phase, .43, .92);
      sheets.rotation.z += .17 * breeze; sheets.position.y += .083 * breeze;
      maker.armL.rotation.z -= .24 * breeze; maker.head.rotation.y -= .44 * waitForHer;
    }, 5.4, [sheets, maker.armL, maker.head]);
    S.act('go', go); S.act('touch', () => touch(false));
    S.on('reset', () => {
      GLOW.u=0;LIFT.y=0;hold=look=ceSlip=draw=false;nodT=0;back=null;catBusy=false;
      writing.u=transfer.u=pasting.reach=lettingGo.u=0; writing.park=1; flyingWish=null;
      released=false; lettingGo.relax=1; freeEnds.fill(null); ropeL.visible=ropeR.visible=false;
      liftProp.drag = null;
    });
    S.on('enter', async () => {
      draw=true;writeWish(0);
      await S.to(writing,{park:0},.42,'inOut');S.set({phase:'ready'});
    });
    S.ui(() => storyPanel(st, {
      opening: '白面鼯鼠在願箋上畫下紅心，想把祝福送給家人。穿山甲師傅在旁等牠畫完。',
      start: '把心願貼上燈',
      checkpoint: '紅心貼歪了，穿山甲師傅把它扶正。現在天燈要飛了，牠兩爪勾住燈繩，回頭等畫紅心的鼯鼠。',
      action: '讓白面鼯鼠看過、點頭',
      ending: '白面鼯鼠認出自己的紅心，點了頭。穿山甲才鬆開兩爪。AI 可以先做能修改的工作，最後的放行由人決定。',
    }));

    const ropeStart=new T.Vector3(), ropeEnd=new T.Vector3(), lineVector=new T.Vector3(), dropEnd=new T.Vector3();
    function drawCord(rope,i,opening) {
      const knot=knots[i], grip=maker.rig.grips[i];
      LP.worldToLocal(knot.getWorldPosition(ropeEnd));
      LP.worldToLocal(grip.getWorldPosition(ropeStart));
      if(released && opening>.34) {
        if(!freeEnds[i])freeEnds[i]=knot.worldToLocal(grip.getWorldPosition(new T.Vector3()));
        const saved=freeEnds[i], t=Math.min(1,(opening-.34)/.66);
        // A released cord stays tied to its bamboo knot and then hangs under its own weight.
        dropEnd.set(saved.x*(1-t),-saved.length(),saved.z*(1-t));
        ropeStart.copy(saved).lerp(dropEnd,t*t*(3-2*t));
        knot.localToWorld(ropeStart); LP.worldToLocal(ropeStart);
      }
      lineVector.subVectors(ropeEnd,ropeStart);
      rope.position.copy(ropeStart); rope.scale.set(1,Math.max(.001,lineVector.length()),1);
      rope.quaternion.setFromUnitVectors(up,lineVector.normalize());
    }
    S.tick((t, dt) => {
      const still=S.stage.still.matches;
      if(st.phase==='ready') writing.u=Math.min(.82,writing.u+dt*.245);
      writeWish(t);
      if(flyingWish){
        const u=transfer.u;
        pastedWish.position.copy(flyingWish.position).multiplyScalar(1-u);
        pastedWish.position.y+=.37*Math.sin(Math.PI*u);
        pastedWish.quaternion.copy(flyingWish.rotation).slerp(flyingWish.crooked,u);
        pastedWish.scale.copy(flyingWish.scale).lerp(gripAt.setScalar(1.7),u);
      }
      // light
      for (const [m, c0, c1] of GL) m.color.copy(c0).lerp(c1, GLOW.u);
      const rise = Math.min(1, Math.max(0, lanLift.position.y / 1.6));
      lanHalo.material.opacity = .62 * GLOW.u; lanPool.material.opacity = .55 * GLOW.u * (1 - rise);
      if (flame.visible) flick.scale.y = still?1:1 + Math.sin(t * 17) * .12 + Math.sin(t * 29) * .06;
      cflick.scale.x = still?1:1 + Math.sin(t * 13) * .08;
      // the far lanterns rise slowly and fade away high up
      for (const s of sea) { const u = ((still?0:t) * s.sp + s.ph) % 1; s.bob.position.y = s.y0 + u * 1.3; s.bob.scale.setScalar(Math.max(.001, Math.pow(Math.sin(Math.PI * u), .35))); s.bob.position.x = still?0:Math.sin(t * .7 + s.ph * 6) * .05; }
      // the big lantern tugs while it is held; once gone it drifts
      bob.position.y = still?0:hold ? Math.sin(t * 2.3) * .06 : st.phase === 'done' ? Math.sin(t * 1.4) * .08 : 0;
      bob.rotation.z = !still && hold ? Math.sin(t * 1.7) * .03 : 0;
      if (tug.visible && !still) tug.children.forEach((m, i) => { const u = (t * 1.1 + i / 3) % 1; m.position.y = u * .3; m.scale.setScalar(Math.max(.001, Math.sin(Math.PI * u))); });
      if (back) liftProp.set(back.u);
      // the lantern maker hangs on by the strings, looking back at her
      maker.root.position.x=.30*pasting.reach;
      maker.root.position.z=RZ-.22*pasting.reach;
      maker.root.position.y = LIFT.y + (!still&&hold ? Math.sin(t*2.3)*.038 : 0);
      maker.root.rotation.y=look?-.16:0;
      if(pasting.reach>0) {
        maker.rig.legs[0].rotation.z-=.12*Math.sin(Math.PI*pasting.reach);
        maker.inner.rotation.z=.10*pasting.reach;
        maker.head.rotation.z=.28*pasting.reach;
        maker.armR.rotation.z=T.MathUtils.lerp(maker.armR.rotation.z,.67,pasting.reach);
        maker.head.rotation.x=.19*pasting.reach;
        maker.rig.grips[0].getWorldPosition(idlePaw);
        pressSpot.set(.10,.06,.05);pastedWish.localToWorld(pressSpot);
        idlePaw.lerp(pressSpot,pasting.reach);
        maker.inner.worldToLocal(idlePaw);maker.rig.aimGrip(0,idlePaw,-.24);
      }
      if(hold||released) {
        const u=lettingGo.u;
        const opened=[Math.min(1,u/.62),Math.min(1,Math.max(0,(u-.30)/.70))];
        if(hold||u<1||lettingGo.relax>0) {
          const left=opened[0]*lettingGo.relax, right=opened[1]*lettingGo.relax;
          maker.rig.poseClaws(hold?1:1-u,[left,right]);
          maker.inner.rotation.z=hold?(still?0:Math.sin(t*1.7)*.018):(still?0:-.16*Math.sin(Math.PI*u));
          if(released)maker.rig.tail.rotation.z+=(still?0:.13*Math.sin(Math.PI*u));
          if(released) {
            maker.armL.rotation.z=maker.rig.rest[0]-.14*(1-u)+left*.46;
            maker.armR.rotation.z=maker.rig.rest[1]+.14*(1-u)-right*.41;
          }
        }
        drawCord(ropeL,0,opened[0]);drawCord(ropeR,1,opened[1]);
      }
      if(look) {maker.head.rotation.y=-.20; maker.head.rotation.z=-.10; maker.eyes.position.x=-.014;}
      if (ceSlip) ce.armR.rotation.z = 1.9;
      if(hold){writer.head.rotation.z=.03;writer.eyes.position.x=-.020;}
      if(nodT>0){
        nodT=Math.max(0,nodT-dt);const nodProgress=1-nodT/1.2; const dip=still?(nodProgress>.18&&nodProgress<.77?1:0):pulse(nodProgress,.11,.82);
        writer.head.rotation.z=.03+.47*dip; writer.head.rotation.x=.25*dip;
      }
      tail.rotation.z = still?0:Math.sin(t * 2.4) * .25;
    });
  },
};
