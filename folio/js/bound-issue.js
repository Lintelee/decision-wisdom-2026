import { T } from './paper.js';
import { createIssueLeaf } from './issue-leaf.js';

const mix = (a, b, t) => a + (b - a) * t;
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

export function bindIssue({
  canvas,
  book,
  pages,
  stacks,
  tabletop,
  leaf,
  bendLeaf,
  pageY,
  paperWidth,
  paperDepth,
  paperTop,
  addTick,
  storyInk,
  poseStory
}) {
  const original = {
    L: pages.L.material,
    R: pages.R.material,
    front: leaf.front.material,
    back: leaf.back.material
  };
  const material = (side) => new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, fog: false, side });
  const ink = { L: material(T.FrontSide), R: material(T.FrontSide), verso: material(T.BackSide) };
  const oldUV = {},
    singleUV = {},
    contact = {};
  for (const [side, mesh, offset] of [
    ['L', pages.L, 0],
    ['R', pages.R, 0.5],
    ['back', leaf.back, 0]
  ]) {
    const uv = mesh.geometry.getAttribute('uv');
    oldUV[side] = uv;
    singleUV[side] = uv.clone();
    for (let i = 0; i < uv.count; i++) singleUV[side].setX(i, (uv.getX(i) - offset) * 2);
    if (side !== 'back') {
      const shade = new T.Mesh(
        mesh.geometry,
        new T.ShadowMaterial({ color: 0x201925, opacity: 0.23, depthWrite: false })
      );
      shade.receiveShadow = true;
      shade.position.y = 0.004;
      shade.visible = false;
      book.add(shade);
      contact[side] = shade;
    }
  }
  const turning = createIssueLeaf({ book, width: paperWidth, depth: paperDepth, pageY });
  const texel = document.createElement('canvas');
  texel.width = texel.height = 2;
  const g = texel.getContext('2d');
  g.fillStyle = '#f3eddc';
  g.fillRect(0, 0, 2, 2);
  const cache = new Map();
  let active = false,
    resting = false,
    dirty = false,
    amount = 0,
    layout = null,
    motion = null;
  let printCamera = null;
  const gripProjection = new T.Matrix4();
  let tilt = 0,
    bank = 0,
    twist = 0;
  const printWidth = paperDepth * 0.75;
  const overhead = new T.Quaternion().setFromEuler(new T.Euler(-Math.PI / 2, 0, 0));
  const eye = new T.Vector3(),
    pivot = new T.Vector3(),
    centre = new T.Vector3();
  function entry(url) {
    if (!url) return null;
    let item = cache.get(url);
    if (item) {
      cache.delete(url);
      cache.set(url, item);
      return item;
    }
    const map = new T.Texture(texel);
    map.colorSpace = T.SRGBColorSpace;
    map.needsUpdate = true;
    map.anisotropy = 4;
    const img = new Image();
    item = {
      map,
      ready: new Promise((resolve) => {
        img.onload = () => {
          map.image = img;
          map.needsUpdate = true;
          dirty = true;
          resolve();
        };
        img.onerror = () => resolve();
      })
    };
    cache.set(url, item);
    img.src = url;
    return item;
  }
  function prune() {
    const held = new Set([ink.L.map, ink.R.map, ink.verso.map, spineMaterial.map]);
    for (const [key, item] of cache) {
      if (cache.size <= 12) break;
      if (!held.has(item.map)) {
        item.map.dispose();
        cache.delete(key);
      }
    }
  }
  function face(side, url, unprinted = false) {
    const sheet = pages[side];
    sheet.visible = Boolean(url) || unprinted;
    if (!sheet.visible) return;
    sheet.material = ink[side];
    sheet.geometry.setAttribute('uv', singleUV[side]);
    ink[side].map = entry(url)?.map || null;
    ink[side].color.set(url ? 0xffffff : 0xeee7d8);
    ink[side].needsUpdate = true;
  }
  const spineMaterial = material(T.DoubleSide);
  const spineGeo = new T.BufferGeometry();
  spineGeo.setAttribute(
    'position',
    new T.Float32BufferAttribute(
      [0, 0.12, -paperDepth / 2, 0, 0.12, paperDepth / 2, 0, -0.36, -paperDepth / 2, 0, -0.36, paperDepth / 2],
      3
    )
  );
  spineGeo.setAttribute('uv', new T.Float32BufferAttribute([1, 1, 1, 0, 0, 1, 0, 0], 2));
  spineGeo.setIndex([0, 1, 2, 1, 3, 2]);
  spineGeo.computeVertexNormals();
  const jacketSpine = new T.Mesh(spineGeo, spineMaterial);
  jacketSpine.visible = false;
  book.add(jacketSpine);
  function showSpine(outer) {
    jacketSpine.visible = Boolean(outer);
    if (!outer) return;
    if (!spineMaterial.map) {
      spineMaterial.map = entry('reader-assets/pages/spine.webp').map;
      spineMaterial.needsUpdate = true;
    }
    jacketSpine.position.x = outer === 'front' ? -0.115 : 0.115;
  }
  function stackWidth(side, width) {
    stacks[side].visible = width > 0.001;
    stacks[side].scale.x = Math.max(0.001, width);
  }
  function spread(desc) {
    // In a single-page layout an exposed facing scan would sit beside the
    // selectable text, even though that page is outside the reader’s spread.
    const left = (desc.spread || !desc.right) && desc.paths[0];
    const right = (desc.spread || desc.right) && desc.paths[1];
    face('L', left);
    face('R', right);
    stackWidth('L', left ? 1 : 0);
    stackWidth('R', right ? 1 : 0);
    showSpine(desc.outer);
  }
  function layoutChanged(next) {
    if (!active || !next?.rect.width) return;
    const changed = !layout || next.paths.join('|') !== layout.paths.join('|') ||
      next.spread !== layout.spread || (!next.spread && next.right !== layout.right);
    layout = next;
    dirty = true;
    next.paths.forEach(entry);
    if (changed && resting && !motion) {
      spread(layout);
      prune();
    }
  }
  function viewFor(desc) {
    const { rect, spread, right } = desc;
    const ppu = rect.width / ((spread ? 2 : 1) * printWidth);
    return {
      ppu,
      spine: spread ? rect.left + rect.width / 2 : right ? rect.left : rect.right,
      middle: rect.top + (paperDepth * ppu) / 2,
      pivot: spread ? 0 : ((right ? 1 : -1) * printWidth) / 2
    };
  }
  const clip = new T.Matrix4(),
    corners = Array.from({ length: 4 }, () => new T.Vector4());
  // Register selectable HTML ink to the same four projected paper corners as the physical sheet.
  function projectSurface(camera) {
    if (!layout.project) return;
    if (Math.abs(tilt) + Math.abs(bank) + Math.abs(twist) < 0.00005 && !motion) {
      layout.project(null, null);
      return;
    }
    const { rect, spread, right } = layout;
    const left = spread || !right ? -paperWidth : 0,
      span = spread ? 2 * paperWidth : paperWidth;
    clip.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).multiply(book.matrixWorld);
    const screen = corners.map((v, k) => {
      v.set(left + (k % 2) * span, paperTop, (k < 2 ? -0.5 : 0.5) * paperDepth, 1).applyMatrix4(clip);
      return { x: ((v.x + v.w) * canvas.clientWidth) / 2, y: ((v.w - v.y) * canvas.clientHeight) / 2, w: v.w };
    });
    const points = screen.map((v) => ({ x: v.x / v.w, y: v.y / v.w }));
    const col = screen.map((v) => [
      (v.x - rect.left * v.w) / screen[0].w,
      (v.y - rect.top * v.w) / screen[0].w,
      v.w / screen[0].w
    ]);
    const dx = col[1].map((v, j) => (v - col[0][j]) / rect.width),
      dy = col[2].map((v, j) => (v - col[0][j]) / rect.height);
    layout.project(
      [dx[0], dx[1], 0, dx[2], dy[0], dy[1], 0, dy[2], 0, 0, 1, 0, col[0][0], col[0][1], 0, 1],
      points
    );
  }
  function cameraAtPrint(camera) {
    if (!active || !layout) return;
    printCamera = camera;
    book.scale.x = mix(1, printWidth / paperWidth, amount);
    const v = viewFor(layout);
    if (motion) {
      const next = viewFor(motion.to),
        p = motion.progress;
      for (const k of ['ppu', 'spine', 'middle', 'pivot']) v[k] = mix(v[k], next[k], p);
    }
    // A longer lens keeps raised paper corners in frame at reading distance.
    camera.fov = mix(33, 19, amount);
    camera.updateProjectionMatrix();
    tabletop.material.opacity = mix(0.34, 0.15, amount);
    const distance = canvas.clientHeight / (2 * v.ppu * Math.tan((camera.fov * Math.PI) / 360));
    eye.set(
      (canvas.clientWidth / 2 - v.spine) / v.ppu,
      paperTop + distance,
      (canvas.clientHeight / 2 - v.middle) / v.ppu
    );
    camera.position.lerp(eye, amount);
    camera.quaternion.slerp(overhead, amount);
    camera.updateMatrixWorld();
    book.rotation.set(tilt * amount, twist * amount, bank * amount, 'YXZ');
    pivot.set(v.pivot, paperTop, 0);
    centre.copy(pivot).applyQuaternion(book.quaternion);
    book.position.copy(pivot).sub(centre);
    book.updateMatrixWorld(true);
    if (amount > 0.9999) projectSurface(camera);
    dirty = false;
  }
  function startTurn(from, to, direction, usePaper = true) {
    if (!resting) return;
    const fwd = direction > 0;
    const facing = from.paths.join('|') === to.paths.join('|');
    motion = { from, to, direction, progress: 0, paper: usePaper, facing };
    if (motion.paper) {
      // In single-page view the next page can already be on the desk. Lift its free
      // corner as the camera crosses the binding, then let that same sheet settle.
      const underLeft = fwd ? from.paths[0] : facing ? from.before[0] : to.paths[0];
      const underRight = fwd ? (facing ? from.after[1] : to.paths[1]) : from.paths[1];
      face('L', underLeft, facing);
      face('R', underRight, facing);
      const front = fwd ? from.paths[1] : from.paths[0];
      const back = facing ? (fwd ? from.after[0] : from.before[1]) : fwd ? to.paths[0] : to.paths[1];
      turning.setFaces(entry(front)?.map, entry(back)?.map || null, {
        rigid: Boolean(from.outer || to.outer),
        direction
      });
      for (const side of ['L', 'R']) contact[side].visible = pages[side].visible;
      showSpine(false);
    }
    dirty = true;
  }
  function poseTurn(progress, corner, bend, grip, landing) {
    if (!motion) return;
    motion.progress = clamp(progress, 0, 1);
    if (motion.paper) {
      const lift = motion.facing ? 0.35 * Math.sin(Math.PI * motion.progress) : motion.progress;
      let angle = lift, diagonal;
      if (grip && printCamera && !motion.facing) {
        // The camera crosses the binding when just one page is in view.
        if (!motion.from.spread || !motion.to.spread) cameraAtPrint(printCamera);
        gripProjection.multiplyMatrices(printCamera.projectionMatrix, printCamera.matrixWorldInverse).multiply(book.matrixWorld);
        const bounds = canvas.getBoundingClientRect();
        const project = point => {
          point.applyMatrix4(gripProjection);
          return { x:bounds.left + (.5 + .5 * point.x) * bounds.width, y:bounds.top + (.5 - .5 * point.y) * bounds.height };
        };
        const right = motion.direction > 0;
        const across = right ? grip.u : 1 - grip.u;
        const contact = { ...grip, u:motion.from.spread ? 2 * across - 1 : across };
        const solved = turning.pin(lift, corner, bend, contact, project, motion.held);
        motion.held = { ...solved, intent:lift };
        angle = solved.p; diagonal = solved.d;
      } else if (motion.held && landing != null) {
        const held = motion.held;
        const t = held.intent === landing ? 1 : clamp((lift - held.intent) / (landing - held.intent), 0, 1);
        angle = mix(held.p, landing, t);
        diagonal = mix(held.d, turning.defaultDiagonal(angle, corner), t * t * (3 - 2 * t));
      }
      turning.pose(angle, corner, bend, diagonal);
    }
    for (const [i, side] of ['L', 'R'].entries()) {
      const was = Boolean(motion.from.paths[i]),
        will = Boolean(motion.to.paths[i]);
      if (was !== will)
        stackWidth(
          side,
          will ? Math.max(0, -Math.cos(Math.PI * progress)) : Math.max(0, Math.cos(Math.PI * progress))
        );
    }
    dirty = true;
  }
  function endTurn(commit = false) {
    if (!motion) return;
    layout = commit ? motion.to : motion.from;
    motion = null;
    turning.hide();
    contact.L.visible = contact.R.visible = false;
    spread(layout);
    prune();
    dirty = true;
  }
  function tween(to, duration, update) {
    const from = amount;
    if (!duration) {
      amount = to;
      update(to);
      dirty = true;
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let time = 0;
      const remove = addTick((dt) => {
        time = Math.min(1, time + dt / duration);
        const t = time * time * (3 - 2 * time);
        amount = mix(from, to, t);
        update(amount);
        dirty = true;
        if (time === 1) {
          remove();
          resolve();
        }
      });
    });
  }
  function originalInk() {
    for (const side of ['L', 'R']) {
      pages[side].visible = true;
      pages[side].material = original[side];
      original[side].map = storyInk();
      pages[side].geometry.setAttribute('uv', oldUV[side]);
      stackWidth(side, 1);
    }
    leaf.front.material = original.front;
    leaf.back.material = original.back;
    leaf.back.geometry.setAttribute('uv', oldUV.back);
    leaf.front.visible = leaf.back.visible = false;
    jacketSpine.visible = false;
    tabletop.material.opacity = 0.34;
    book.rotation.set(0, 0, 0);
    book.position.set(0, 0, 0);
    book.scale.x = 1;
    book.updateMatrixWorld(true);
  }
  function entryLeaf() {
    original.front.map = storyInk();
    leaf.front.material = original.front;
    ink.verso.map = entry(layout.paths[0] || layout.paths[1]).map;
    ink.verso.needsUpdate = true;
    leaf.back.geometry.setAttribute('uv', singleUV.back);
    leaf.back.material = ink.verso;
    leaf.front.visible = leaf.back.visible = true;
  }
  return {
    begin() {
      active = true;
      resting = false;
      dirty = true;
      tilt = bank = twist = 0;
    },
    layoutChanged,
    cameraAtPrint,
    startTurn,
    poseTurn,
    endTurn,
    orient(angles) {
      tilt = angles.tilt;
      bank = angles.bank;
      twist = angles.twist;
      dirty = true;
    },
    preload(paths) {
      paths.filter(Boolean).forEach(entry);
      prune();
    },
    get idle() {
      return resting && !dirty;
    },
    get opening() { return amount; },
    async unfold(duration, fromStory = false) {
      await Promise.all(layout.paths.filter(Boolean).map((url) => entry(url).ready));
      if (layout.outer && !fromStory) {
        spread(layout);
        await tween(1, duration, () => {});
      } else {
        face('R', layout.paths[1]);
        entryLeaf();
        await tween(1, duration, p => { bendLeaf(p); if (fromStory) poseStory(p); });
      }
      spread(layout);
      leaf.front.visible = leaf.back.visible = false;
      resting = true;
      dirty = true;
    },
    async refold(duration, toStory = false) {
      endTurn(false);
      resting = false;
      if (layout.outer && !toStory) await tween(0, duration, () => {});
      else {
        pages.L.material = original.L;
        original.L.map = storyInk();
        pages.L.geometry.setAttribute('uv', oldUV.L);
        entryLeaf();
        await tween(0, duration, p => { bendLeaf(p); if (toStory) poseStory(p); });
      }
      originalInk();
      active = false;
      layout = null;
    }
  };
}
