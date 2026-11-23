// The table, the open book, its turning leaf and the camera. Scenes stand on spreads; this file knows nothing about stories.
import { T, C, group, box, cyl, cone, ball, disc, ring, beam, poly, slab, seal } from './paper.js';

import { bindIssue } from './bound-issue.js';
import { createPaperRenderer } from './paper-renderer.js';

export const W = 6, D = 7.2, Y = .04;
const PI = Math.PI;
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
export const EASE = {
  lin: (t) => t, in: (t) => t * t * t, out: (t) => 1 - (1 - t) ** 3, inOut: (t) => (t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  back: (t) => { const c = 1.9; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; },
  bounce: (t) => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; },
  elastic: (t) => (t === 0 || t === 1 ? t : 2 ** (-10 * t) * Math.sin((t * 10 - .75) * (2 * PI / 3)) + 1),
};
/** how high the page stands above Y at distance r from the spine (pages dip into the gutter) */
export const camber = (r) => .13 * (1 - Math.exp(-r * 2.6));
export const pageY = (x) => Y + camber(Math.abs(x));

// The print issue determines the ink, shadow and edge light of each desk.
const THEMES = {
  map:{bg:'#38343e',key:'#fff3df',fill:'#bad9ce',sky:'#fff5e9'},
  prologue:{bg:'#32313b',key:'#fff3df',fill:'#bad9ce',sky:'#fff5e9'},
  people:{bg:'#37432b',key:'#fff1d8',fill:'#cad6ad',sky:'#fff5e9'},
  model:{bg:'#533e47',key:'#fff0e8',fill:'#d4c9da',sky:'#fff5e9'},
  ai:{bg:'#1a424f',key:'#f6f4eb',fill:'#badce2',sky:'#f1f6f3'},
};

export function createStage(canvas) {
  const attributes = { antialias: true, alpha: true, powerPreference: 'high-performance' };
  const context = canvas.getContext('webgl2', attributes);
  const renderer = context ? new T.WebGLRenderer({ canvas, context, ...attributes }) : createPaperRenderer(canvas);
  canvas.dataset.renderer = context ? 'webgl' : 'paper';
  renderer.outputColorSpace = T.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; renderer.setClearColor?.(0x000000,0);
  const scene = new T.Scene(); scene.fog = new T.FogExp2(THEMES.map.bg, .0085);
  const camera = new T.PerspectiveCamera(33, 1, .1, 180);
  const hemi = new T.HemisphereLight(0xfff5e9,0x9fa7a5,1.91); scene.add(hemi);
  const key = new T.DirectionalLight(0xfff3df, 2.24); key.position.set(-4.5, 9.7, 5.2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -9.5, right: 9.5, top: 9.5, bottom: -9.5, near: 1, far: 30 }); key.shadow.normalBias = .02; key.shadow.bias = -.0003; scene.add(key);
  const fill = new T.DirectionalLight(0xc3e5ed, .68); fill.position.set(5, 5, -5); scene.add(fill);

  const tabletop = new T.Mesh(new T.PlaneGeometry(150,150),new T.ShadowMaterial({color:'#111118',opacity:.34}));
  tabletop.rotation.x=-PI/2; tabletop.position.y=-.42; tabletop.receiveShadow=true; scene.add(tabletop);

  // ------------------------------------------------------------ the book itself
  const book = new T.Group(); scene.add(book);
  function board(x, y, w, h, d, col) { const m = new T.Mesh(new T.BoxGeometry(w, h, d), new T.MeshLambertMaterial({ color: col })); m.position.set(x, y, 0); m.castShadow = m.receiveShadow = true; book.add(m); return m; }
  const stacks = { L: new T.Group(), R: new T.Group() };
  book.add(stacks.L, stacks.R);
  for (const s of [-1, 1]) {
    const stack = s < 0 ? stacks.L : stacks.R;
    stack.add(board(s * (W / 2 + .02), -.335, W + .26, .11, D + .36, '#2f3a4a'), board(s * (W / 2 + .02), -.275, W + .28, .03, D + .38, '#e8b84e'));
    for (let i = 0; i < 9; i++) { const e = Math.sin(i * 2) * .012; stack.add(board(s * (W / 2 + .012), -.245 + i * .03, W + .02 + e, .03, D + .05 + e, ['#cbb38a', '#ecd7ad', '#f8e7c0'][i % 3])); }
  }
  board(0, -.3, .34, .17, D + .34, '#273140');
  const seam = board(0, Y + .012, .04, .012, D, '#9b8460'); seam.castShadow = false;
  // bookmark ribbon
  { const s = new T.Shape(); s.moveTo(0, 0); s.lineTo(.3, 0); s.lineTo(.3, .95); s.lineTo(.15, .78); s.lineTo(0, .95); s.closePath();
    const r = new T.Mesh(new T.ShapeGeometry(s), new T.MeshLambertMaterial({ color: '#cf5a3e', side: T.DoubleSide })); r.rotation.x = PI / 2; r.rotation.z = -.08; r.position.set(.5, -.23, D / 2 - .02); stacks.R.add(r); }

  function pageGeo(side, nx = 22) {
    const pos = [], uv = [], idx = [];
    for (let j = 0; j <= 1; j++) for (let i = 0; i <= nx; i++) { const r = W * i / nx; pos.push(side * r, Y + camber(r), (j - .5) * D); uv.push(.5 + side * .5 * r / W, 1 - j); }
    for (let i = 0; i < nx; i++) { const a = i, b = i + 1, c = i + nx + 1, d = c + 1; idx.push(...(side > 0 ? [a, c, b, b, c, d] : [a, b, c, b, d, c])); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  const blank = (() => { const c = document.createElement('canvas'); c.width = c.height = 8; const g = c.getContext('2d'); g.fillStyle = '#f3e4c0'; g.fillRect(0, 0, 8, 8); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; })();
  const pages = { L: new T.Mesh(pageGeo(-1), new T.MeshLambertMaterial({ map: blank })), R: new T.Mesh(pageGeo(1), new T.MeshLambertMaterial({ map: blank })) };
  for (const m of Object.values(pages)) { m.receiveShadow = true; book.add(m); }

  // the turning leaf: one sheet, two printed faces
  const NX = 26, leafPos = new T.BufferAttribute(new Float32Array((NX + 1) * 2 * 3), 3); leafPos.setUsage(T.DynamicDrawUsage);
  function leafGeo(back) {
    const uv = [], idx = [];
    for (let j = 0; j <= 1; j++) for (let i = 0; i <= NX; i++) uv.push(back ? .5 - .5 * i / NX : .5 + .5 * i / NX, 1 - j);
    for (let i = 0; i < NX; i++) { const a = i, b = i + 1, c = i + NX + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    const g = new T.BufferGeometry(); g.setAttribute('position', leafPos); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx); return g;
  }
  const leaf = { front: new T.Mesh(leafGeo(false), new T.MeshLambertMaterial({ map: blank, side: T.FrontSide })), back: new T.Mesh(leafGeo(true), new T.MeshLambertMaterial({ map: blank, side: T.BackSide })) };
  for (const m of Object.values(leaf)) { m.castShadow = m.receiveShadow = true; m.frustumCulled = false; m.visible = false; book.add(m); }
  const stripAngles = new Float64Array(NX);
  function bendLeaf(p) {
    const a = PI * p, k = .9 * Math.sin(a), ds = W / NX; let x = 0, y = 0;
    for (let i = 0; i <= NX; i++) {
      if (i) {
        const th = a + k * ((i - .5) / NX - .5);
        stripAngles[i - 1] = th;
        x += Math.cos(th) * ds; y += Math.sin(th) * ds;
      }
      const yy = Y + .014 + y + camber(W * i / NX) * (1 - Math.sin(a));
      leafPos.setXYZ(i, x, yy, -D / 2); leafPos.setXYZ(i + NX + 1, x, yy, D / 2);
    }
    leafPos.needsUpdate = true; leaf.front.geometry.computeVertexNormals(); leaf.back.geometry.attributes.normal = leaf.front.geometry.attributes.normal;
  }

  // ------------------------------------------------------------ spreads and their pop-ups
  const spreads = []; let cur = -1, turn = null, theme = { ...THEMES.map }, themeFrom = null, themeTo = null;
  /** the land's theme, with the page's own look (time of day) laid over it */
  const themeOf = (sp) => ({ ...THEMES[sp.theme], ...sp.look });
  const ticks = new Set(), frames = new Set();
  function setLift(sp, L, mode = 'rise') {
    sp.lift = L; sp.group.visible = L > .001;
    if (sp.group.visible && sp.group.parent !== book) book.add(sp.group);
    if (!sp.group.visible) sp.group.removeFromParent();
    for (const a of sp.anchors) {
      const l = clamp(L * 1.5 - a.delay), e = mode === 'rise' ? EASE.back(l) : EASE.inOut(l), f = clamp(e);
      a.holder.position.set(a.x, pageY(a.x) + .004 + a.y, a.z);
      a.holder.rotation.z = 0;
      a.holder.visible = l > .002;
      a.hinge.rotation.x = a.dir * (1 - e) * PI * .495;
      a.hinge.scale.set(1, lerp(a.pack, 1, f), lerp(.03, 1, f));
    }
  }
  function register(i, sp) {
    // sp: {texture, group, anchors:[{holder,hinge,art,x,z}], theme}
    const sorted = [...sp.anchors].sort((p, q) => (p.z - q.z) || (Math.abs(q.x) - Math.abs(p.x)));
    sorted.forEach((a, k) => { a.delay = sorted.length > 1 ? .5 * k / (sorted.length - 1) : 0; });
    for (const a of sp.anchors) {
      a.dir = a.z < -.25 ? 1 : -1;
      const box = new T.Box3().setFromObject(a.art), h = box.isEmpty() ? 1 : Math.max(.2, box.max.y);
      const run = (a.dir > 0 ? D / 2 - a.z : a.z + D / 2) - .12; a.pack = Math.min(1, run / h); a.height = h;
      const width = box.isEmpty() ? 0 : box.max.x - box.min.x;
      a.foldReach = Math.max(.32, Math.abs(a.x) - width * .3);
      const strip = clamp(Math.abs(a.x) / W) * NX;
      a.strip = Math.min(Math.floor(strip), NX - 1);
      a.stripFraction = strip - a.strip;
    }
    spreads[i] = sp; setLift(sp, 0);
  }
  function show(i) {
    // open the book at spread i without a turn
    const sp = spreads[i]; if (cur >= 0 && spreads[cur]) setLift(spreads[cur], 0);
    cur = i; pages.L.material.map = pages.R.material.map = sp.texture; pages.L.material.needsUpdate = pages.R.material.needsUpdate = true;
    leaf.front.visible = leaf.back.visible = false; applyTheme(themeOf(sp));
  }
  function rise(dur = 1.5) { return new Promise((res) => { const sp = spreads[cur]; let t = 0; const f = (dt) => { t += dt / dur; setLift(sp, clamp(t), 'rise'); if (t >= 1) { ticks.delete(f); res(); } }; ticks.add(f); }); }
  function fold(dur = .6) { return new Promise((res) => { const sp = spreads[cur]; let t = 0; const f = (dt) => { t += dt / dur; setLift(sp, 1 - clamp(t), 'fold'); if (t >= 1) { ticks.delete(f); res(); } }; ticks.add(f); }); }
  function applyTheme(th) { theme = { ...th }; scene.fog.color.set(th.bg); key.color.set(th.key); fill.color.set(th.fill); hemi.color.set(th.sky); }
  const cA = new T.Color(), cB = new T.Color();
  function mixTheme(a, b, t) { for (const [k, tgt] of [['bg',scene.fog.color], ['key', key.color], ['fill', fill.color], ['sky', hemi.color]]) tgt.copy(cA.set(a[k])).lerp(cB.set(b[k]), t); }

  function setupTurn(i) {
    const A = spreads[cur], B = spreads[i], fwd = i > cur;
    B.group.visible = false;
    if (fwd) { leaf.front.material.map = A.texture; leaf.back.material.map = B.texture; pages.R.material.map = B.texture; }
    else { leaf.front.material.map = B.texture; leaf.back.material.map = A.texture; pages.L.material.map = B.texture; }
    for (const m of [leaf.front, leaf.back, pages.L, pages.R]) m.material.needsUpdate = true;
    bendLeaf(fwd ? 0 : 1); leaf.front.visible = leaf.back.visible = true;
    themeFrom = themeOf(A); themeTo = themeOf(B);
    return { A, B, fwd, t: 0, to: i, elapsed: 0, held: false, settle: null };
  }
  function turnTo(i, speed = 1) {
    if (turn || i === cur || !spreads[i]) return Promise.resolve(false);
    const dur = clamp(1.75 + Math.abs(i - cur) * .08, 1.75, 2.4) / speed;
    return new Promise((resolve) => { turn = { ...setupTurn(i), dur, resolve }; });
  }
  // The two faces of the moving sheet carry different scenery. A glue tab on the
  // desk stays put. A tab on the leaf follows the actual curved strip under it.
  function poseTurnSpread(sp, movingSide, p) {
    sp.lift = movingSide > 0 ? 1 - p : p;
    sp.group.visible = sp.lift > 0;
    if (!sp.group.visible) return;
    if (sp.group.parent !== book) book.add(sp.group);
    for (const a of sp.anchors) {
      const i = a.strip, angle = stripAngles[i];
      const opening = movingSide > 0 ? PI - angle : angle;
      // A wide-open spread leaves the piece upright. As paper approaches,
      // the available gap at its foot determines how far its hinge can stand.
      const gapAngle = Math.min(PI / 2, opening);
      const elevation = Math.atan2(a.foldReach * Math.sin(gapAngle), a.height * Math.cos(gapAngle));
      const standing = Math.sin(elevation), offset = .004 + a.y * standing;
      a.hinge.rotation.x = a.dir * (PI / 2 - elevation);
      a.hinge.scale.set(1, lerp(a.pack, 1, standing), standing);
      a.holder.visible = true;
      const side = a.x < 0 ? -1 : 1;
      if (side === movingSide) {
        const surface = side > 0 ? angle : angle - PI;
        const x = lerp(leafPos.getX(i), leafPos.getX(i + 1), a.stripFraction);
        const y = lerp(leafPos.getY(i), leafPos.getY(i + 1), a.stripFraction);
        a.holder.position.set(x - offset * Math.sin(surface), y - .014 + offset * Math.cos(surface), a.z);
        a.holder.rotation.z = surface;
      } else {
        a.holder.position.set(a.x, pageY(a.x) + offset, a.z);
        a.holder.rotation.z = 0;
      }
    }
  }
  function applyTurn(u) {
    const p = u.fwd ? u.t : 1 - u.t, side = u.fwd ? 1 : -1;
    bendLeaf(p);
    poseTurnSpread(u.A, side, p);
    poseTurnSpread(u.B, -side, p);
    mixTheme(themeFrom, themeTo, smooth(0, 1, u.t));
  }
  function endTurn(done) {
    const u = turn, keepSp = done ? u.B : u.A; turn = null;
    pages.L.material.map = pages.R.material.map = keepSp.texture; pages.L.material.needsUpdate = pages.R.material.needsUpdate = true;
    leaf.front.visible = leaf.back.visible = false; setLift(done ? u.A : u.B, 0); setLift(keepSp, 1);
    if (done) cur = u.to; applyTheme(done ? themeTo : themeFrom);
    u.resolve(done);
  }
  function stepTurn(dt) {
    const u = turn;
    if (u.held && down?.grab) u.t = progressAtPointer(down);
    else if (u.settle) {
      const finish = u.settle;
      finish.elapsed += dt;
      u.t = lerp(finish.from, finish.to, EASE.out(clamp(finish.elapsed / finish.duration)));
    } else {
      u.elapsed += dt;
      u.t = (1 - Math.cos(PI * clamp(u.elapsed / u.dur))) / 2;
    }
    applyTurn(u);
    if (!u.held && u.t >= 1) endTurn(true); else if (u.settle?.to === 0 && u.t <= 0) endTurn(false);
  }

  // ------------------------------------------------------------ camera
  const view = { detail: false, yaw: .045, tilt: .51, zoom: 1, px: 0, py: 0, sx: 0, sy: 0, home: { yaw: .045, tilt: .51 }, flat: 0, focus: 0, focusTo: 0, portrait: false };
  const issue = bindIssue({
    canvas, book, pages, stacks, tabletop, leaf, bendLeaf, pageY, paperWidth: W, paperDepth: D, paperTop: pageY(W),
    addTick(f) { ticks.add(f); return () => ticks.delete(f); },
    storyInk: () => spreads[cur].texture,
    poseStory: p => poseTurnSpread(spreads[cur], 1, p),
  });
  const target = new T.Vector3();
  const sideBySide = matchMedia('(min-width:460px) and (max-height:530px) and (orientation:landscape)');
  let closeFrame = 0;
  // Fit the physical cover, including the nearer projecting corner when a
  // reader turns the table. A fixed horizontal span only fits a straight book.
  function portraitCoverDistance(yaw, tilt, targetY, targetZ, halfSlope) {
    const cs = Math.cos(yaw), sn = Math.sin(yaw);
    const lift = (-.26 - targetY) * Math.sin(tilt), forward = Math.cos(tilt);
    let required = 0;
    for (let side = -1; side <= 1; side += 2) {
      const x = side * (W + .16);
      for (let edge = -1; edge <= 1; edge += 2) {
        const z = edge * (D / 2 + .19) - targetZ;
        const depth = lift + forward * (sn * x + cs * z);
        required = Math.max(required, depth + Math.abs(cs * x - sn * z) / halfSlope);
      }
    }
    return required;
  }
  function place() {
    camera.fov=33;
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1, aspect = w / h; camera.aspect = aspect;
    const portrait = w <= h; view.portrait = portrait;
    // On a short wide screen, leave the question and story control beside the book.
    // The offset unwinds with the same leaf as the printed issue.
    const textColumn = w < 560 ? clamp(w * .35, 162, 196) : clamp(w * .32, 206, 310);
    const margin = sideBySide.matches ? textColumn * (1 - issue.opening) : 0;
    const usableHeight = h - (sideBySide.matches ? Math.min(70, h * .19) : 0);
    const frameAspect = (w - margin) / usableHeight;
    // Make room for the far edge and its attached scenery when the leaf stands up.
    const raised = turn ? Math.sin(PI * turn.t) : 0;
    const close = portrait ? closeFrame * (1 - smooth(0, .7, raised)) : 0;
    const span = portrait ? lerp(13.95, 9.0, close) : 15.65;
    const height = Math.max(portrait ? lerp(12.5, 10.3, close) : 8.4, span / frameAspect) * h / usableHeight;
    const yaw = view.yaw + view.sx * .05, tilt = clamp(lerp(view.tilt - view.sy * .03, 1.5, view.flat), .12, 1.52);
    const cy = lerp(portrait ? 1.1 : 1.3, .2, view.flat) + .72 * raised;
    target.set(close * view.focus * (1 - view.flat), cy, lerp(portrait ? .2 : 0, 0, view.flat));
    const halfTangent = Math.tan(camera.fov * PI / 360);
    let framed = height * (1 + .12 * raised) / (2 * halfTangent);
    if (portrait && close < 1 && issue.opening < 1) {
      const inset = Math.min(18, w * .0375);
      const fit = portraitCoverDistance(yaw, tilt, cy, target.z, halfTangent * (w - inset * 2) / h);
      framed += Math.max(0, fit - framed) * (1 - close) * (1 - issue.opening);
    }
    const dist = framed / view.zoom;
    camera.position.set(target.x + dist * Math.sin(yaw) * Math.cos(tilt), cy + dist * Math.sin(tilt), target.z + dist * Math.cos(yaw) * Math.cos(tilt));
    camera.lookAt(target);
    if (margin > .01) camera.setViewOffset(w, h, -margin / 2, 0, w, h);
    else if (camera.view?.enabled) camera.clearViewOffset();
    else camera.updateProjectionMatrix();
    camera.updateMatrixWorld(); issue.cameraAtPrint(camera);
  }
  function resize() { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75)); renderer.setSize(w, h, false); place(); }
  new ResizeObserver(resize).observe(canvas);

  const preference = matchMedia('(prefers-reduced-motion: reduce)'); let customMotion;
  try {const v=localStorage.getItem('decision-atlas-v1-motion');if(v!==null)customMotion=v==='true';} catch {}
  const forcedStill = new URLSearchParams(location.search).has('still');
  const still = {get matches(){return forcedStill || !(customMotion ?? !preference.matches);}};
  const reflectMotion = () => {
    document.documentElement.classList.toggle('still', still.matches);
    document.documentElement.classList.toggle('motion-on', !still.matches);
  };
  preference.addEventListener('change', reflectMotion);
  reflectMotion();
  function setMotion(value) {customMotion=value;reflectMotion();try{localStorage.setItem('decision-atlas-v1-motion',String(value));}catch{}}
  // ------------------------------------------------------------ pointer: tap things, drag parts, drag a page, drag the table
  const ray = new T.Raycaster(), ndc = new T.Vector2(), plane = new T.Plane(), hitPoint = new T.Vector3(), camDir = new T.Vector3(), upY = new T.Vector3(0, 1, 0);
  let pickables = () => [], onTap = () => {}, onHover = () => {}, onPage = () => {}, onGrab = () => -1, onDrop = () => {}, down = null, hover = null, orbiting = false;
  function shown(o) { for (let a = o; a; a = a.parent) if (!a.visible) return false; return true; }
  function setRay(ev) { const r = canvas.getBoundingClientRect(); ndc.set((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); return r; }
  function pick(ev) {
    setRay(ev);
    const list = pickables().filter((p) => shown(p.node)); if (!list.length) return null;
    const hits = ray.intersectObjects(list.map((p) => p.node), true);
    for (const h of hits) { if (!shown(h.object)) continue; for (let a = h.object; a; a = a.parent) { const p = list.find((q) => q.node === a); if (p) return { ...p, point: h.point.clone() }; } }
    return null;
  }
  /** which page the pointer is holding by its outer part: 1 = right page (turns to the next spread), -1 = left page, 0 = neither */
  function edgeAt(ev) {
    const rect = setRay(ev); plane.set(upY, -pageY(W));
    const p = ray.ray.intersectPlane(plane, hitPoint);
    if (!p || Math.abs(p.z) > D / 2 + .3 || Math.abs(p.x) > W + .6) return 0;
    if (Math.abs(p.x) > W - 2.2) return Math.sign(p.x);
    if (view.portrait && view.detail) {
      if (ev.clientX > rect.right - 24 && p.x > 0) return 1;
      if (ev.clientX < rect.left + 24 && p.x < 0) return -1;
    }
    return 0;
  }
  // Project the picked strip of the curved leaf itself. Its travel depends on
  // the book's zoom and angle, and is shortest near the printed binding.
  const gripPoint = new T.Vector3();
  function gripX(d, progress) {
    const angle = PI * (d.edge > 0 ? progress : 1 - progress), curve = .9 * Math.sin(angle) / W;
    const inner = angle - curve * W / 2, outer = inner + d.radius * curve;
    const x = Math.abs(curve) < .00001 ? d.radius * Math.cos(angle) : (Math.sin(outer) - Math.sin(inner)) / curve;
    const y = Math.abs(curve) < .00001 ? d.radius * Math.sin(angle) : (Math.cos(inner) - Math.cos(outer)) / curve;
    gripPoint.set(x, Y + .014 + y + camber(d.radius) * (1 - Math.sin(angle)), d.z).project(camera);
    return (gripPoint.x * .5 + .5) * canvas.clientWidth;
  }
  function progressAtPointer(d) {
    if ((d.x - d.pointerX) * d.edge <= 0) return 0;
    const desired = d.pointerX - d.pointerOffset;
    let low = 0, high = 1;
    for (let i = 0; i < 12; i++) {
      const middle = (low + high) / 2;
      if ((gripX(d, middle) - desired) * d.edge > 0) low = middle; else high = middle;
    }
    return (low + high) / 2;
  }
  function dragInfo(ev, d) { const r = setRay(ev), p = ray.ray.intersectPlane(plane, hitPoint); return { x: ev.clientX - r.left, y: ev.clientY - r.top, dx: ev.clientX - d.x, dy: ev.clientY - d.y, point: (p || d.hit.point).clone(), moved: d.moved, cancelled: ev.type === 'pointercancel' || ev.type === 'lostpointercapture' }; }
  function letGo(ev) {
    const d = down; if (!d || d.id !== ev.pointerId) return null;
    down = null; orbiting = false; canvas.style.cursor = 'grab';
    if (d.drag) { plane.copy(d.plane); d.drag.end?.(dragInfo(ev, d)); return d; }
    if (d.grab && turn) {
      const to = ev.type === 'pointerup' && turn.t >= .32 ? 1 : 0;
      turn.held = false;
      turn.settle = { from: turn.t, to, elapsed: 0, duration: still.matches ? .12 : .24 + .64 * Math.abs(to - turn.t) };
    }
    return d;
  }
  canvas.addEventListener('pointerdown', (ev) => {
    if (turn || down || ev.button !== 0 || !ev.isPrimary) return;
    const hit = pick(ev);
    const edge = hit ? 0 : edgeAt(ev);
    down = { x: ev.clientX, y: ev.clientY, pointerX: ev.clientX, yaw: view.yaw, tilt: view.tilt, id: ev.pointerId, moved: false, hit, drag: hit?.drag, edge, grab: false };
    if (edge) {
      down.radius = clamp(Math.abs(hitPoint.x), .15, W);
      down.z = clamp(hitPoint.z, -D / 2, D / 2);
      down.pointerOffset = down.x - gripX(down, 0);
    }
    canvas.setPointerCapture(ev.pointerId);
    if (down.drag) {
      if (down.drag.plane === 'ground') plane.setFromNormalAndCoplanarPoint(upY, hit.point); else plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(camDir).negate(), hit.point);
      down.plane = plane.clone(); canvas.style.cursor = 'grabbing'; down.drag.start?.(dragInfo(ev, down));
    }
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (down && ev.pointerId !== down.id) return;
    const r = canvas.getBoundingClientRect(); view.px = (ev.clientX - r.left) / r.width * 2 - 1; view.py = (ev.clientY - r.top) / r.height * 2 - 1; view.mx = ev.clientX; view.my = ev.clientY; view.inside = true;
    if (down && down.drag) { if (Math.hypot(ev.clientX - down.x, ev.clientY - down.y) > 5) down.moved = true; plane.copy(down.plane); down.drag.move?.(dragInfo(ev, down)); return; }
    if (down) down.pointerX = ev.clientX;
    if (down?.grab) { if (turn) turn.t = progressAtPointer(down); return; }
    if (down) {
      const dx = ev.clientX - down.x, dy = ev.clientY - down.y;
      if (!down.moved && Math.hypot(dx, dy) > 7) {
        down.moved = true;
        // a sideways pull that starts on the outer part of a page lifts that page; anything else turns the table
        if (down.edge && Math.abs(dx) > Math.abs(dy) * 1.1 && dx * -down.edge > 0) {
          const i = onGrab(down.edge);
          if (i >= 0 && spreads[i] && !turn) {
            turn = { ...setupTurn(i), t: progressAtPointer(down), held: true, resolve: (ok) => onDrop(ok, i) };
            down.grab = true; canvas.style.cursor = 'grabbing'; return;
          }
        }
        orbiting = true; canvas.style.cursor = 'grabbing'; if (hover) { hover = null; onHover(null, ev); }
      }
      if (down.moved) { view.yaw = clamp(down.yaw - dx * .0045, -.75, .75); view.tilt = clamp(down.tilt + dy * .004, .16, 1.15); }
      return;
    }
    if (ev.pointerType === 'touch') return;
    const h = turn ? null : pick(ev); hover = h;
    canvas.style.cursor = h ? (h.drag ? 'grab' : 'pointer') : (!turn && edgeAt(ev)) ? 'ew-resize' : 'grab';
    onHover(h, ev);
  });
  canvas.addEventListener('pointerup', (ev) => {
    const d = letGo(ev); if (!d || d.grab) return;
    if (d.drag) { if (!d.moved && !turn) onTap(d.hit, ev); return; }
    if (!d.moved && !turn) { const h = pick(ev); if (h) onTap(h, ev); else if (d.edge) onPage(d.edge); else onTap(null, ev); }
  });
  canvas.addEventListener('pointercancel', (ev) => { letGo(ev); });
  canvas.addEventListener('lostpointercapture', (ev) => { letGo(ev); });
  canvas.addEventListener('pointerleave', () => { view.inside = false; view.px = view.py = 0; if (hover) { hover = null; onHover(null, null); } });
  canvas.addEventListener('wheel', (ev) => {
    ev.preventDefault();
    const pixels = ev.deltaY * (ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? canvas.clientHeight : 1);
    view.zoom = clamp(view.zoom * Math.exp(-clamp(pixels, -140, 140) * .0015), .72, 1.7);
  }, { passive: false });
  canvas.style.cursor = 'grab';

  // ------------------------------------------------------------ frame loop
  let last = performance.now(), running = true, clock = 0, paused = false;
  function frame(now) {
    requestAnimationFrame(frame); if (!running || paused || issue.idle) { last = now; return; }
    if (renderer.software && now-last < 1000/28) return;
    step(Math.min(.14, Math.max(0, (now - last) / 1000))); last = now;
  }
  function step(dt) {
    clock += dt;
    if (turn) stepTurn(dt);
    for (const f of [...ticks]) f(dt, clock);
    closeFrame = still.matches ? Number(view.detail) : lerp(closeFrame, Number(view.detail), 1 - Math.exp(-dt * 5.8));
    view.focus += (view.focusTo - view.focus) * (1 - Math.exp(-dt * 2.2));
    const e = 1 - Math.exp(-dt * 5), sway = view.inside && !orbiting && !still.matches; view.sx += ((sway ? view.px : 0) - view.sx) * e; view.sy += ((sway ? view.py : 0) - view.sy) * e;
    paint(dt);
  }
  function paint(dt = 0) {
    place(); renderer.render(scene, camera);
    for (const f of frames) f(dt, clock);
  }
  document.addEventListener('visibilitychange', () => { running = !document.hidden; last = performance.now(); });
  resize(); requestAnimationFrame(frame);

  const v3 = new T.Vector3();
  return {
    T, scene, camera, renderer, view, spreads, issue, register, show, rise, fold, turnTo, setLift, still, setMotion,
    get current() { return cur; }, get turning() { return Boolean(turn); }, get clock() { return clock; },
    tick(f) { ticks.add(f); return () => ticks.delete(f); }, afterFrame(f) { frames.add(f); },
    set pickables(f) { pickables = f; }, set onTap(f) { onTap = f; }, set onHover(f) { onHover = f; }, set onPage(f) { onPage = f; }, set onGrab(f) { onGrab = f; }, set onDrop(f) { onDrop = f; },
    paintRestingPose() { closeFrame = Number(view.detail); paint(); },
    pause(v) { paused = v; last = performance.now(); },
    /** screen position of a world point */
    project(p) { v3.copy(p).project(camera); return { x: (v3.x * .5 + .5) * canvas.clientWidth, y: (.5 - v3.y * .5) * canvas.clientHeight, behind: v3.z > 1 }; },
    resetView() { const from = { yaw: view.yaw, tilt: view.tilt, zoom: view.zoom }; let t = 0; const f = (dt) => { t = Math.min(1, t + dt / .6); const e = EASE.inOut(t); view.yaw = lerp(from.yaw, view.home.yaw, e); view.tilt = lerp(from.tilt, view.home.tilt, e); view.zoom = lerp(from.zoom, 1, e); if (t >= 1) ticks.delete(f); }; ticks.add(f); },
    flatten(to, dur = .7) { return new Promise((res) => { const from = view.flat; let t = 0; const f = (dt) => { t = Math.min(1, t + dt / dur); view.flat = lerp(from, to, EASE.inOut(t)); if (t >= 1) { ticks.delete(f); res(); } }; ticks.add(f); }); },
    pointer() { return view; },
    /** run the book forward by hand (for checks and screenshots when the tab is throttled) */
    async advance(sec, h = 1 / 30) { for (let t = 0; t < sec; t += h) { step(h); for (let k = 0; k < 6; k++) await Promise.resolve(); } },
  };
}
