// The scene kit: what a scene file gets as `S`. It plants pop-up pieces on a spread, makes things tappable,
// runs small animations and reports the scene's state to the page furniture (captions, buttons).
import { T, C, FONT, SERIF, group, keep, seal, words } from './paper.js';
import { W, D, EASE, clamp, lerp, pageY } from './stage.js';
import { makePerson, makeRobot, posePuppet } from './cast.js';
import { addAtmosphere } from './scene-atmosphere.js';
import { finishFolioProps } from './prop-finish.js';

const PX = 170; // canvas pixels per world unit on the printed page
// Raycasting still sees this material. The camera and shadow passes can skip the grab areas.
const grabAreaMaterial = new T.MeshBasicMaterial({ visible:false, colorWrite:false, depthWrite:false });

/** Drawing on the printed page, in page coordinates: x from -W (left edge) to W, z from -D/2 (far) to D/2 (near). */
export class Ground {
  constructor() { this.c = document.createElement('canvas'); this.c.width = 2 * W * PX; this.c.height = D * PX; this.g = this.c.getContext('2d'); this.g.lineJoin = this.g.lineCap = 'round'; }
  X(x) { return (x + W) * PX; } Z(z) { return (z + D / 2) * PX; }
  wash(col) { const g = this.g; g.fillStyle = col; g.fillRect(0, 0, this.c.width, this.c.height); return this; }
  _trace(pts, closed, smoothIt) {
    const g = this.g, P = pts.map(([x, z]) => [this.X(x), this.Z(z)]); g.beginPath();
    if (!smoothIt) { P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); if (closed) g.closePath(); return; }
    const n = P.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    if (closed) { let m = mid(P[n - 1], P[0]); g.moveTo(m[0], m[1]); for (let i = 0; i < n; i++) { const q = P[i], nx = mid(q, P[(i + 1) % n]); g.quadraticCurveTo(q[0], q[1], nx[0], nx[1]); } g.closePath(); }
    else { g.moveTo(P[0][0], P[0][1]); for (let i = 1; i < n - 1; i++) { const m = mid(P[i], P[i + 1]); g.quadraticCurveTo(P[i][0], P[i][1], m[0], m[1]); } g.lineTo(P[n - 1][0], P[n - 1][1]); }
  }
  /** a soft-edged area, e.g. water, a lawn, a plaza */
  blob(pts, col, { edge = null, edgeW = .05, sharp = false } = {}) { const g = this.g; this._trace(pts, true, !sharp); g.fillStyle = col; g.fill(); if (edge) { g.strokeStyle = edge; g.lineWidth = edgeW * PX; g.stroke(); } return this; }
  path(pts, { w = .08, col = '#00000033', dash = null, sharp = false } = {}) { const g = this.g; this._trace(pts, false, !sharp); g.strokeStyle = col; g.lineWidth = w * PX; g.setLineDash(dash ? dash.map((d) => d * PX) : []); g.stroke(); g.setLineDash([]); return this; }
  circle(x, z, r, col, { edge = null, edgeW = .04 } = {}) { const g = this.g; g.beginPath(); g.ellipse(this.X(x), this.Z(z), r * PX, r * PX, 0, 0, 7); if (col) { g.fillStyle = col; g.fill(); } if (edge) { g.strokeStyle = edge; g.lineWidth = edgeW * PX; g.stroke(); } return this; }
  rect(x, z, w, d, col, { rot = 0, r = .06, edge = null, edgeW = .04 } = {}) { const g = this.g; g.save(); g.translate(this.X(x), this.Z(z)); g.rotate(rot); g.beginPath(); g.roundRect(-w * PX / 2, -d * PX / 2, w * PX, d * PX, r * PX); if (col) { g.fillStyle = col; g.fill(); } if (edge) { g.strokeStyle = edge; g.lineWidth = edgeW * PX; g.stroke(); } g.restore(); return this; }
  text(str, x, z, { size = .22, col = '#5a4a36', rot = 0, weight = 700, font = FONT, align = 'center', spacing = 0, alpha = 1 } = {}) {
    const g = this.g; g.save(); g.translate(this.X(x), this.Z(z)); g.rotate(rot); g.globalAlpha = alpha; g.font = `${weight} ${size * PX}px ${font}`; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'middle';
    if ('letterSpacing' in g) g.letterSpacing = spacing * PX + 'px'; String(str).split('\n').forEach((l, i) => g.fillText(l, 0, i * size * PX * 1.3)); g.restore(); return this;
  }
  grid(step = .5, col = '#0000000f', w = .012) { const g = this.g; g.strokeStyle = col; g.lineWidth = w * PX; g.beginPath(); for (let x = -W; x <= W + .001; x += step) { g.moveTo(this.X(x), 0); g.lineTo(this.X(x), this.c.height); } for (let z = -D / 2; z <= D / 2 + .001; z += step) { g.moveTo(0, this.Z(z)); g.lineTo(this.c.width, this.Z(z)); } g.stroke(); return this; }
  /** small repeated marks inside a box: 'tick' | 'dot' | 'wave' | 'cross' */
  marks(kind, x0, z0, x1, z1, { n = 30, col = '#00000022', size = .08, seed = 7 } = {}) {
    const g = this.g; let s = seed; const rnd = () => ((s = (Math.imul(1664525, s) + 1013904223) >>> 0) / 4294967296); g.strokeStyle = g.fillStyle = col; g.lineWidth = .018 * PX;
    for (let i = 0; i < n; i++) { const x = this.X(lerp(x0, x1, rnd())), y = this.Z(lerp(z0, z1, rnd())), k = size * PX; g.beginPath();
      if (kind === 'dot') { g.arc(x, y, k * .22, 0, 7); g.fill(); } else if (kind === 'wave') { g.moveTo(x - k, y); g.quadraticCurveTo(x - k / 2, y - k * .5, x, y); g.quadraticCurveTo(x + k / 2, y + k * .5, x + k, y); g.stroke(); }
      else if (kind === 'cross') { g.moveTo(x - k / 2, y); g.lineTo(x + k / 2, y); g.moveTo(x, y - k / 2); g.lineTo(x, y + k / 2); g.stroke(); } else { g.moveTo(x, y); g.lineTo(x + k * .3, y - k); g.stroke(); } }
    return this;
  }
  finish(folio, plate) {
    const g = this.g, w = this.c.width, h = this.c.height; let s = 31; const rnd = () => ((s = (Math.imul(1664525, s) + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < 9000; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,.05)' : 'rgba(60,40,10,.045)'; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 1 + rnd() * 2); }
    // dog-ears: the outer bottom corners invite a drag to turn the page
    for (const d of [-1, 1]) { const x = d > 0 ? w : 0, k = 150; g.fillStyle = 'rgba(70,50,25,.13)'; g.beginPath(); g.moveTo(x - d * (k + 14), h); g.lineTo(x, h - k - 14); g.lineTo(x, h); g.closePath(); g.fill();
      g.fillStyle = '#fff6dc'; g.beginPath(); g.moveTo(x - d * k, h); g.lineTo(x, h - k); g.lineTo(x - d * k * .82, h - k * .82); g.closePath(); g.fill(); }
    const gut = g.createLinearGradient(w / 2 - 150, 0, w / 2 + 150, 0); gut.addColorStop(0, 'rgba(60,40,20,0)'); gut.addColorStop(.5, 'rgba(60,40,20,.26)'); gut.addColorStop(1, 'rgba(60,40,20,0)'); g.fillStyle = gut; g.fillRect(w / 2 - 150, 0, 300, h);
    g.strokeStyle = 'rgba(70,50,25,.16)'; g.lineWidth = 3; g.strokeRect(34, 34, w / 2 - 80, h - 68); g.strokeRect(w / 2 + 46, 34, w / 2 - 80, h - 68);
    if (folio) this.text(folio, -W + .42, D / 2 - .36, { size: .13, col: '#6b5a40', align: 'left', font: '"IBM Plex Mono",monospace', weight: 500, spacing: .03, alpha: .8 });
    if (plate) this.text(plate, W - .42, D / 2 - .36, { size: .13, col: '#6b5a40', align: 'right', font: '"IBM Plex Mono",monospace', weight: 500, spacing: .03, alpha: .8 });
    const t = new T.CanvasTexture(this.c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t;
  }
}

/** Build one scene onto a spread and return its controller S. */
export function buildScene(def, index, stage, app) {
  const sp = { group: new T.Group(), anchors: [], theme: def.land, look: def.look || null, texture: null, def };
  const G = new Ground(); def.ground?.(G); sp.texture = G.finish(def.folio, def.plate);
  if (index && !def.backmatter && window.AtlasStock) {
    const stockIndex = [0,0,1,3,2,2,2,4,5,5,6,7,8][index];
    const stock = window.AtlasStock.sheet(stockIndex);
    const page = document.createElement('canvas'); page.width = 1400; page.height = 868;
    const print = page.getContext('2d'); print.drawImage(stock.image,0,0);
    print.save(); print.beginPath();
    const edge=[[58,55],[355,47],[700,56],[1010,46],[1340,63],[1350,338],[1333,747],[1100,764],[925,750],[701,785],[421,770],[196,779],[64,750],[48,425]];
    edge.forEach(([x,y],i)=>i ? print.lineTo(x,y) : print.moveTo(x,y)); print.closePath(); print.clip();
    // Let turf, lanes, paving and water read as the floor of the set. On the
    // first two spreads the harbour floor itself is made of raised card.
    print.globalAlpha = index <= 2 ? .42 : .74;
    print.drawImage(sp.texture.image,0,0,1400,868); print.restore();
    // Reprint the colophon on a clean strip of the original stock. The surveyed location belongs to this story.
    print.drawImage(stock.image,540,807,150,35,30,807,1310,35);
    const locations = ['','TEA AT THE QUAY','TODAY AT THE CAMERA SHOP','THE JAVELIN FIELD','THE RAINWEAR FITTING ROOM',
      'VOICES AT THE TOFU STALL','THE HANDPRINT WALL','THE TASTING MODEL','THE BANQUET TABLE','UNDER THE LION CLOTH',
      'THE FRUIT STALL','THE INDIGO WORKSHOP','LANTERN SQUARE'];
    print.fillStyle={prologue:'#beb1d7',people:'#aec36c',model:'#c893a3',ai:'#75b3bc'}[def.land];
    print.fillRect(33,817,21,14); print.font='500 16px monospace'; print.fillStyle='#514b4e';
    print.fillText(locations[index].split('').join(' '),69,829);
    print.textAlign='right';print.fillText('F O L I O   '+String(index).padStart(2,'0'),1332,829);
    stock.dispose(); sp.texture.dispose(); sp.texture = new T.CanvasTexture(page);
    sp.texture.colorSpace=T.SRGBColorSpace; sp.texture.anisotropy=4;
  }

  const tweens = [], cast = [], props = [], hooks = { enter: [], leave: [], reset: [], tick: [] }, acts = {};
  let epoch = 0, uiFn = () => ({}), state = null, state0 = null, snapshot = null, hinted = null; const temps = new Set(), boards = [];
  const found = new Set();
  const playingDiscoveries = new Set();
  let soundOrigin = null, drawingObject = null, landingSilently = false;
  let prepared = false;
  let openingLoop = null, openingTime = 0, openingDrawn = false, openingTouched = false, explorationPause = 0;
  function removeEmote(m) {
    if (!temps.delete(m)) return;
    m.removeFromParent();
    m.geometry.dispose(); m.material.map.dispose(); m.material.dispose();
  }
  function restoreOpeningPose() {
    if (!openingDrawn) return;
    for (const p of openingLoop.parts) {
      p.node.position.copy(p.position); p.node.quaternion.copy(p.rotation); p.node.scale.copy(p.scale);
    }
    openingDrawn = false;
  }
  function takeOver() {
    restoreOpeningPose();
    app.endInspection();
    landingSilently = true;
    try { for (const detail of playingDiscoveries) detail.land(); }
    finally { landingSilently = false; }
    soundOrigin = null;
    openingTouched = true;
  }

  const S = {
    T, C, W, D, def, index, active: false, stage, app,
    /** stand a pop-up piece on the page at (x, z); build its parts into g */
    plant(x, z, build, { s = 1, ry = 0, y = 0 } = {}) {
      const holder = new T.Group(), hinge = new T.Group(), art = new T.Group(); holder.add(hinge); hinge.add(art); art.scale.setScalar(s); art.rotation.y = ry;
      build?.(art); sp.group.add(holder); const a = { holder, hinge, art, x, z, y }; sp.anchors.push(a); return a;
    },
    keep, group,
    /** make node tappable. opts: {id, label, tap(S), aim:[x,y,z]} */
    prop(node, opts) { node.userData.keep = true; const p = { node, kind: 'prop', aim: [0, .4, 0], ...opts, id: opts.id || 'p' + props.length }; props.push(p); return p; },
    /** give a part an invisible grab area of radius r around a point of it, so it is easy to catch with a mouse or a finger */
    pad(node, r = .3, at = [0, 0, 0]) { const m = new T.Mesh(new T.SphereGeometry(r, 10, 8), grabAreaMaterial); m.position.set(...at); m.userData.raw = true; m.userData.pad = true; node.add(m); return m; },
    /** drag a part freely: {id, label, plane: 'screen'|'ground', start(e), move(e), end(e), tap} with e = {x, y, dx, dy, point (world), moved} */
    drag(node, o) { return S.prop(node, { ...o, drag: { plane: o.plane, start(e) { takeOver(); o.start?.(e); }, move: o.move, end: o.end } }); },
    /** turn a wheel or dial by dragging round it: turn(deltaRadians, totalRadians) while it turns (clockwise is positive); done(total) on release */
    crank(node, { turn, done, spin = true, ...o }) {
      let last = 0, total = 0; S.on('reset', () => { total = 0; });
      if (o.pad !== 0) { const b = new T.Box3().setFromObject(node), c = node.worldToLocal(b.getCenter(new T.Vector3())), sz = b.getSize(new T.Vector3()); S.pad(node, o.pad || Math.max(.22, Math.max(sz.x, sz.y) * .52 / (node.getWorldScale(new T.Vector3()).x || 1)), [c.x, c.y, c.z]); }
      const ang = (e) => { const c = stage.project(S.world(node)); return Math.atan2(e.y - c.y, e.x - c.x); };
      const p = S.drag(node, { ...o, start: (e) => { last = ang(e); }, end: () => done?.(total),
        move: (e) => { const a = ang(e); let d = a - last; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; last = a; total += d; if (spin) node.rotation.z -= d; turn?.(d, total); } });
      p.zero = () => { total = 0; }; return p;
    },
    /** slide a part between two points of its parent (a lever, a rope, a curtain): move(u) while dragging, end(u) on release, u from 0 to 1 */
    pull(node, { from, to, move, end, ...o }) {
      const A = new T.Vector3(...from), B = new T.Vector3(...to); let u = 0, u0 = 0, sa, sb; S.on('reset', () => { u = 0; }); if (o.pad) S.pad(node, o.pad, o.padAt);
      const apply = (v) => { u = clamp(v); node.position.lerpVectors(A, B, u); move?.(u); };
      const p = S.drag(node, { ...o, start: () => { sa = stage.project(node.parent.localToWorld(A.clone())); sb = stage.project(node.parent.localToWorld(B.clone())); u0 = u; },
        move: (e) => { const vx = sb.x - sa.x, vy = sb.y - sa.y; apply(u0 + (e.dx * vx + e.dy * vy) / (vx * vx + vy * vy || 1)); },
        end: (e) => { if (e.cancelled) apply(u0); end?.(u, e); } });
      p.set = apply; p.value = () => u; return p;
    },
    /** Drop a part on a projected target. A target can also accept the pointer itself. */
    carry(node, { targets, miss, start, end, ...o }) {
      let home, off, returnTarget, grabEpoch;
      if (o.pad) S.pad(node, o.pad, o.padAt);
      return S.drag(node, { ...o,
        start(e) {
          grabEpoch = epoch;
          const returning = returnTarget && tweens.find(w => w.to === returnTarget);
          if (returning) returning.to = {};
          else home = node.position.clone();
          returnTarget = null;
          off = S.local(node.parent, e.point).sub(node.position);
          start?.(e);
        },
        move(e) {
          if (grabEpoch === epoch && e.moved) node.position.copy(S.local(node.parent, e.point).sub(off));
        },
        end(e) {
          if (grabEpoch !== epoch) return;
          end?.(e);
          if (e.cancelled || !e.moved) { node.position.copy(home); return; }
          node.position.copy(S.local(node.parent, e.point).sub(off));
          const centre = stage.project(S.world(node));
          let hit, best = Infinity;
          for (const target of (typeof targets === 'function' ? targets() : targets)) {
            if (target.node && !target.node.visible) continue;
            const q = stage.project(target.at ? target.at() : S.top(target.node, -.2));
            const distance = Math.hypot(q.x - centre.x, q.y - centre.y);
            const d = target.acceptPointer ? Math.min(distance, Math.hypot(q.x - e.x, q.y - e.y)) : distance;
            if (d < (target.r || 95) && d < best) { hit = target; best = d; }
          }
          if (hit) hit.drop(node, home);
          else {
            returnTarget = { x: home.x, y: home.y, z: home.z };
            S.to(node.position, returnTarget, .4, 'back');
            miss?.();
          }
        } });
    },
    /** press and hold a part: during(seconds, dt) every frame while held, release(seconds) when let go */
    hold(node, { during, release, ...o }) {
      let t0 = null; S.on('reset', () => { t0 = null; }); S.tick((t, dt) => { if (t0 != null) during?.(t - t0, dt); });
      return S.drag(node, { ...o, start: () => { t0 = stage.clock; }, end: () => { if (t0 == null) return; const d = stage.clock - t0; t0 = null; release?.(d); } });
    },
    /** a thing that tells a fact from the article when tapped: {label, say, cite} */
    curio(node, opts) { node.userData.keep = true; const p = { node, kind: 'curio', aim: null, ...opts, id: opts.id || 'c' + props.length }; props.push(p); return p; },
    /** One clock per paper mechanism. The resting pose can remember the last visit. */
    discovery(node, { duration = 1, sound, draw, reset, ...options }) {
      let elapsed = 0, visit = 0;
      const pose = u => {
        const previous = drawingObject;
        drawingObject = node;
        try { draw(u, visit, stage.still.matches); }
        finally { drawingObject = previous; }
      };
      const detail = {
        land() {
          playingDiscoveries.delete(detail);
          pose(1);
        },
        step(dt) {
          elapsed += dt;
          if (elapsed >= duration) detail.land();
          else pose(elapsed / duration);
        },
      };
      const rewind = () => { playingDiscoveries.delete(detail); visit = 0; reset?.(); };
      S.on('reset', rewind);
      // Freeze the outgoing paper in its last pose. The next entry restores its stock.
      S.on('leave', () => playingDiscoveries.delete(detail));
      return S.curio(node, { ...options, quiet: true, tap() {
        if (playingDiscoveries.has(detail)) return;
        elapsed = 0; visit++;
        // One sound, or a few in a row: the thing that moves first, then the voice that answers it.
        const cue = typeof sound === 'function' ? sound(visit) : sound;
        [].concat(cue || []).forEach((name, i) => { if (i) S.wait(.2 * i).then(() => S.sound(name, node)); else S.sound(name, node); });
        pose(0);
        playingDiscoveries.add(detail);
      } });
    },
    /** a paper person; give {name, say, cite} to let readers tap them for a line from the article */
    person(parent, o = {}) { const p = makePerson(parent, o); cast.push(p); S._talk(p, o); return p; },
    /** The apron-wearing shop worker; older scene rigs use the same attachment points. */
    robot(parent, o = {}) { const p = makeRobot(parent, o); cast.push(p); S._talk(p, o); return p; },
    _talk(p, o) { if (!o.say) return; const c = S.curio(p.root, { label: o.name || '', say: o.say, cite: o.cite || '', tap: () => { p.hop(); p.wave(); } }); p.propId = c.id; },

    state(init) { state = init; state0 = JSON.parse(JSON.stringify(init)); return state; },
    set(patch) { Object.assign(state, patch); app.refresh(S); },
    refresh() { app.refresh(S); },
    ui(fn) { uiFn = fn; }, view() { return uiFn(state) || {}; },
    act(id, fn) { acts[id] = fn; }, run(id, arg) { takeOver(); return acts[id]?.(arg); },
    on(ev, fn) { hooks[ev].push(fn); }, tick(fn) { hooks.tick.push(fn); },
    onReadyLoop(draw, seconds, nodes) {
      const parts = nodes.map(node => ({ node, position: node.position.clone(), rotation: node.quaternion.clone(), scale: node.scale.clone() }));
      openingLoop = { draw, seconds, parts };
    },

    /** animate numeric fields: S.to(mesh.position, {y: 1}, .5, 'back') */
    to(obj, to, dur = .5, ease = 'out', delay = 0) { if (!delay) for (const w of tweens) if (w.obj === obj && w.t >= 0) for (const k in to) delete w.to[k]; return new Promise((res) => tweens.push({ obj, to, from: null, t: -delay, dur: Math.max(.001, dur), ease: EASE[ease] || EASE.out, res, ep: epoch })); },
    wait(sec) { return S.to({}, {}, sec, 'lin'); },
    /** a quick paper wobble */
    wiggle(node, amt = .22) { const r = node.rotation, z0 = r.z; let t = 0; const ep = epoch; const off = stage.tick((dt) => { t += dt; if (ep !== epoch || t > .7) { r.z = z0; off(); return; } r.z = z0 + Math.sin(t * 26) * Math.exp(-t * 6) * amt; }); },
    pop(node, k = 1.25) { const s0 = node.userData.pop0 || (node.userData.pop0 = node.scale.clone()); node.scale.copy(s0).multiplyScalar(k); return S.to(node.scale, { x: s0.x, y: s0.y, z: s0.z }, .45, 'elastic'); },
    /** pop a hidden keep() group into view / shrink it away */
    show(node, dur = .45) { node.userData.vis = (node.userData.vis || 0) + 1; node.visible = true; node.scale.setScalar(.001); return S.to(node.scale, { x: 1, y: 1, z: 1 }, dur, 'back'); },
    hide(node, dur = .25) { const ep = epoch, v = node.userData.vis = (node.userData.vis || 0) + 1; return S.to(node.scale, { x: .001, y: .001, z: .001 }, dur, 'in').then(() => { if (ep === epoch && node.userData.vis === v) node.visible = false; }); },
    /** walk a puppet to (x, z) in its parent's coordinates */
    async walk(p, to, dur = 1.2) { if (to.x != null && Math.abs(to.x - p.root.position.x) > .05) p.root.scale.x = Math.abs(p.root.scale.x) * (to.x < p.root.position.x ? -1 : 1); p.walking = true; await S.to(p.root.position, to, dur, 'inOut'); p.walking = false; },
    /** a mark over a puppet's head for a moment: '?', '!', '♥', '…' */
    emote(p, sym = '?', dur = 1.8, color = '#cf5a3e') { const m = words(p.inner, sym, 0, 1.32, .1, .3, { color, weight: 900 }); if (p.root.scale.x < 0) m.scale.x = -1; temps.add(m); S.pop(m, 1.6); S.wait(dur).then(() => removeEmote(m)); return m; },
    /** on a narrow (portrait) screen, turn the camera toward a part or an x position; S.focus(null) lets it follow the hint ring again */
    focus(at) { app.focus(at == null ? null : typeof at === 'number' ? at : S.world(at).x); },
    /** a world position expressed in a node's own coordinates */
    local(node, worldVec) { return node.worldToLocal(worldVec.clone()); },
    top(node, lift = .12) { const b = new T.Box3().setFromObject(node), c = b.getCenter(new T.Vector3()); return new T.Vector3(c.x, b.max.y + lift, c.z); },
    world(node, local = [0, 0, 0]) { return node.localToWorld(new T.Vector3(...local)); },
    say(at, text, { cite = '', dur = 4.2, who = '' } = {}) { app.bubble(at.isVector3 ? at : S.top(at), text, { cite, dur, who }); },
    sound(name, node) {
      if (landingSilently) return;
      const origin = node || drawingObject || (soundOrigin && stage.clock <= soundOrigin.until ? soundOrigin.node : null);
      const pan = origin ? clamp((stage.project(S.world(origin)).x / Math.max(1, innerWidth) - .5) * 1.05, -.55, .55) : 0;
      app.sound(name, index, pan);
    },
    /** a short line that pops up over the picture for a moment (a counter, an exclamation) */
    toast(text, dur) { app.toast(text, dur); },
    /** a small paper card over a place in the picture: S.card(node or Vector3, {kicker, title, note, button}, onButton); S.card(null) hides it */
    card(at, data, fn) { app.card(at ? (at.isVector3 ? at : S.top(at, .1)) : null, data, fn); },
    /** make the button with this id shake its head (for something that cannot be done) */
    nudge(id) { app.nudge(id); },
    /** a pulsing ring that tells the reader where to tap next (null hides it) */
    hint(node, aim, text = '') { hinted = node ? { node, aim: aim || null } : null; app.hint(hinted ? () => (hinted.aim ? S.world(hinted.node, hinted.aim) : S.top(hinted.node, -.25)) : null, text); },
    /** Mark one more finished job on the worker's apron. */
    learn(robot) { const lamp = robot.setLights(index); if (lamp) S.pop(lamp, 2); S.sound('clip', robot.root); },
    /** A reader can begin the work by tapping either the worker or the action button. */
    hero(worker, { label, ready, go }) { const p = S.prop(worker.root, { id: 'zhi', label, aim: [0, .7, 0], tap: () => { if (ready()) go(); else { worker.hop(); worker.wave(1.2); } } }); worker.propId = p.id; return p; },
    /** the story has reached its point: stamp the page and show the article's own words */
    done() { S.hint(null); app.complete(S); },
    go(id) { app.go(id); },
    found, props, cast,

    // -------- used by the app
    _finish() {
      const binding = new Set([sp.group]);
      for (const a of sp.anchors) { seal(a.art); binding.add(a.holder); binding.add(a.hinge); }
      snapshot = [];
      sp.group.traverse(o => {
        if (o.userData.board) boards.push([o.userData.board, o.userData.board.text, o.userData.board.opts]);
        if (!binding.has(o)) snapshot.push([o, o.position.clone(), o.rotation.clone(), o.scale.clone(), o.visible]);
      });
    },
    _prepare() {
      if (prepared) return;
      restoreOpeningPose(); openingTime = 0; openingTouched = false; explorationPause = 0; soundOrigin = null;
      epoch++;
      tweens.length = 0;
      for (const [b, text, opts] of boards) if (b.text !== text) b.write(text, opts);
      temps.forEach(removeEmote);
      for (const [node, position, rotation, scale, visible] of snapshot) {
        node.position.copy(position); node.rotation.copy(rotation); node.scale.copy(scale); node.visible = visible;
      }
      if (state) {
        for (const key of Object.keys(state)) delete state[key];
        Object.assign(state, JSON.parse(JSON.stringify(state0)));
      }
      for (const p of cast) {
        p.walking = false; p.mood = 'idle'; p.waveT = p.hopT = 0; p.setLights?.(p.lights0);
      }
      hooks.reset.forEach((f) => f());
      prepared = true;
    },
    _enter() { S._prepare(); prepared = false; S.active = true; S.hint(null); hooks.enter.forEach((f) => f()); app.refresh(S); },
    _pause(v) { S.active = !v; },
    /** where to draw a twinkle: the top of every curio that has not been tapped yet and can be seen */
    _sparks() {
      const out = [];
      for (const p of props) {
        if (p.kind !== 'curio' || found.has(p.id)) continue; let seen = true; for (let a = p.node; a; a = a.parent) if (!a.visible) { seen = false; break; } if (!seen) continue;
        if (!p.anchor) { const pads = []; p.node.traverse((o) => { if (o.userData.pad && o.visible) { pads.push(o); o.visible = false; } }); const b = new T.Box3().setFromObject(p.node); pads.forEach((o) => { o.visible = true; }); if (b.isEmpty()) continue; p.anchor = p.node.worldToLocal(new T.Vector3((b.min.x + b.max.x) / 2, b.max.y + .08, (b.min.z + b.max.z) / 2)); }
        out.push(p.node.localToWorld(p.anchor.clone()));
      }
      return out;
    },
    _leave() { S.active = false; app.card(null); app.focus(null); epoch++; tweens.length = 0; S.hint(null); hooks.leave.forEach((f) => f()); },
    _tap(p) {
      soundOrigin = { node: p.node, until: stage.clock + 1.8 };
      if (p.kind === 'curio') {
        restoreOpeningPose();
        explorationPause = 1.1;
        found.add(p.id);
        if (p.say) S.say(p.node, p.say, { cite: p.cite || '', who: p.label || '' });
        p.tap?.(S); app.refresh(S); return;
      }
      if (p.tap) { restoreOpeningPose(); explorationPause = 1.1; p.tap(S); }
    },
    _step(dt, t) {
      if (!S.active) return;
      restoreOpeningPose();
      for (let i = tweens.length - 1; i >= 0; i--) { const w = tweens[i]; w.t += dt; if (w.t < 0) continue; if (!w.from) { w.from = {}; for (const k in w.to) w.from[k] = w.obj[k]; }
        const k = clamp(w.t / w.dur), e = w.ease(k); for (const key in w.to) w.obj[key] = lerp(w.from[key], w.to[key], e); if (k >= 1) { tweens.splice(i, 1); if (w.ep === epoch) w.res(); } }
      const ptr = stage.pointer(), v = new T.Vector3();
      for (const p of cast) { let gx = 0, gy = 0; if (ptr.inside) { const s = stage.project(p.head.getWorldPosition(v)); gx = clamp((ptr.mx - s.x) / 260, -1, 1); gy = clamp((s.y - ptr.my) / 220, -1, 1); if (p.root.scale.x < 0) gx = -gx; } posePuppet(p, t, dt, gx, gy, app.hoverId() === p.propId, stage.still.matches); }
      hooks.tick.forEach((f) => f(t, dt));
      for (const detail of playingDiscoveries) detail.step(dt);
      explorationPause = Math.max(0, explorationPause - dt);
      if (openingLoop && !openingTouched && !explorationPause && !playingDiscoveries.size && state?.phase === 'ready' && !state.busy && !stage.still.matches) {
        for (const p of openingLoop.parts) {
          p.position.copy(p.node.position); p.rotation.copy(p.node.quaternion); p.scale.copy(p.node.scale);
        }
        openingTime = (openingTime + dt) % openingLoop.seconds;
        openingLoop.draw(openingTime / openingLoop.seconds);
        openingDrawn = true;
      }
    },
    spread: sp,
  };
  def.build(S);
  if (index > 0 && !def.backmatter) { finishFolioProps(S); addAtmosphere(S); }
  S._finish(); stage.register(index, sp); stage.tick((dt, t) => S._step(dt, t));
  return S;
}
