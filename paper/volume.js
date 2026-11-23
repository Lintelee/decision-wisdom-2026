/* Each spread has two independently bound leaves. A right leaf and the next left leaf
   ride opposite faces of the same curved sheet while the reader moves it over the spine. */
(() => {
  'use strict';
  const T = window.THREE;
  const W = 5.12,
    D = 3.08,
    columns = 34,
    rows = 8,
    PI = Math.PI;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  function smooth(a, b, x) {
    const n = clamp((x - a) / (b - a), 0, 1);
    return n * n * (3 - 2 * n);
  }
  function crown(u) {
    return 0.018 + 0.112 * (1 - Math.exp(-u * 7)) - 0.055 * u * u;
  }
  function ribbon(color) {
    const geom = new T.BufferGeometry();
    const v = [
      -0.17, -0.13, 2.97, 0.15, -0.14, 2.97, -0.16, -0.4, 3.22, 0.16, -0.41, 3.22, -0.23, -0.432, 3.64, 0.11,
      -0.432, 3.69, -0.055, -0.43, 3.58,
    ];
    geom.setAttribute('position', new T.Float32BufferAttribute(v, 3));
    geom.setIndex([0, 2, 1, 1, 2, 3, 2, 4, 6, 2, 6, 3, 3, 6, 5]);
    geom.computeVertexNormals();
    return new T.Mesh(geom, new T.MeshLambertMaterial({ color, side: T.DoubleSide }));
  }
  function makeLeaf(left, material) {
    const n = (columns + 1) * (rows + 1),
      g = new T.BufferGeometry(),
      xyz = new Float32Array(n * 3),
      uv = [],
      ix = [];
    for (let j = 0; j <= rows; j++)
      for (let i = 0; i <= columns; i++) {
        uv.push(0.5 + ((left ? -0.5 : 0.5) * i) / columns, 1 - j / rows);
        if (i === columns || j === rows) continue;
        const a = j * (columns + 1) + i,
          b = a + 1,
          c = a + columns + 1,
          d = c + 1;
        ix.push(...(left ? [a, b, c, b, d, c] : [a, c, b, b, c, d]));
      }
    g.setAttribute('position', new T.BufferAttribute(xyz, 3).setUsage(T.DynamicDrawUsage));
    g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    g.setIndex(ix);
    const mesh = new T.Mesh(g, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.frustumCulled = false;
    return mesh;
  }
  function bookBlock(side) {
    const group = new T.Group(),
      n = 42;
    // Striped fore-edge continues around the two outside edges without separate floating sheets.
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#e2cfa5';
    ctx.fillRect(0, 0, 256, 128);
    for (let j = 0; j < 24; j++) {
      const y = 4 + j * 5.1;
      ctx.strokeStyle = j % 4 === 0 ? '#9f8c69' : '#c5b48e';
      ctx.lineWidth = j % 4 === 0 ? 1.6 : 0.8;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(48, y + 0.9, 155, y - 0.9, 256, y);
      ctx.stroke();
    }
    const map = new T.CanvasTexture(c);
    map.colorSpace = T.SRGBColorSpace;
    map.anisotropy = 4;
    const edgeMat = new T.MeshLambertMaterial({ map, side: T.DoubleSide });
    const edge = (p, q) => {
      const pos = [],
        uv = [],
        inds = [];
      for (let i = 0; i <= n; i++) {
        const k = i / n,
          x = p[0] + (q[0] - p[0]) * k,
          z = p[1] + (q[1] - p[1]) * k,
          u = Math.abs(x / W);
        const top = crown(u) - 0.018;
        pos.push(x, top, z, x * 0.996, -0.288 + 0.028 * (1 - u), z * 0.997);
        uv.push(k, 1, k, 0);
        if (i < n) {
          const a = i * 2;
          inds.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
        }
      }
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
      g.setIndex(inds);
      g.computeVertexNormals();
      const m = new T.Mesh(g, edgeMat);
      m.receiveShadow = true;
      group.add(m);
    };
    edge([0, D], [side * W, D]);
    edge([side * W, D], [side * W, -D]);
    edge([side * W, -D], [0, -D]);
    const pad = new T.Mesh(
      new T.BoxGeometry(W + 0.09, 0.13, D * 2 + 0.18),
      new T.MeshLambertMaterial({ color: '#35584f' }),
    );
    pad.position.set((side * (W + 0.07)) / 2, -0.345, 0.006);
    pad.castShadow = pad.receiveShadow = true;
    group.add(pad);
    const lining = new T.Mesh(
      new T.BoxGeometry(W + 0.045, 0.026, D * 2 + 0.1),
      new T.MeshLambertMaterial({ color: '#af824b' }),
    );
    lining.position.set((side * (W + 0.025)) / 2, -0.274, 0.006);
    group.add(lining);
    const endpaper = makeLeaf(side < 0, new T.MeshLambertMaterial({ color: '#e4d7b3', side: T.DoubleSide }));
    const vertices = endpaper.geometry.attributes.position;
    for (let j = 0; j <= rows; j++)
      for (let i = 0; i <= columns; i++) {
        const u = i / columns;
        vertices.setXYZ(j * (columns + 1) + i, side * W * u, crown(u) - 0.02, -D + (2 * D * j) / rows);
      }
    endpaper.geometry.computeVertexNormals();
    group.add(endpaper);
    return group;
  }
  // Integral of the leaf's tangent along a constant-length strip. The free front corner
  // lags the gutter, giving the turning page a curl rather than a rigid-board rotation.
  function stripPoint(out, u, z, theta, front) {
    const wave = Math.sin(theta),
      k = z / D;
    const base = theta + wave * (0.31 - 0.1 * k),
      slope = wave * (-0.77 + 0.25 * k);
    const phi = base + slope * u;
    if (Math.abs(slope) < 0.00001) {
      out.x = W * u * Math.cos(theta);
      out.y = W * u * Math.sin(theta);
    } else {
      out.x = (W * (Math.sin(phi) - Math.sin(base))) / slope;
      out.y = (W * (Math.cos(base) - Math.cos(phi))) / slope;
    }
    out.x -= Math.sin(phi) * front * 0.007;
    out.y += crown(u) + Math.cos(phi) * front * 0.007;
    out.z = z;
    return phi;
  }
  function build(canvas, items, callbacks = {}) {
    if (!T) throw Error('Three.js unavailable');
    const renderer = new T.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    const scene = new T.Scene();
    renderer.setClearColor(0x000000, 0);
    scene.fog = new T.FogExp2('#323139', 0.012);
    const camera = new T.PerspectiveCamera(31, 1, 0.15, 240);
    const light = new T.DirectionalLight(0xfff3df, 2.24);
    light.position.set(-4.5, 9.7, 5.2);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    Object.assign(light.shadow.camera, { left: -7.3, right: 7.3, top: 7.2, bottom: -7.1, near: 1, far: 26 });
    light.shadow.normalBias = 0.014;
    light.shadow.bias = -0.00018;
    light.shadow.radius = 2;
    scene.add(light, light.target, new T.HemisphereLight(0xfff5e9, 0x9fa7a5, 1.91));
    const edgeLight = new T.DirectionalLight(0xbad9ce, 0.7);
    edgeLight.position.set(4, 5, -4);
    scene.add(edgeLight);
    const tabletop = new T.Mesh(
      new T.PlaneGeometry(145, 145),
      new T.ShadowMaterial({ color: '#111118', opacity: 0.39 }),
    );
    tabletop.rotation.x = -PI / 2;
    tabletop.position.y = -0.445;
    tabletop.receiveShadow = true;
    scene.add(tabletop);
    const base = new T.Group();
    scene.add(base);
    base.add(bookBlock(-1), bookBlock(1), ribbon('#ac543c'));
    const binding = new T.Mesh(
      new T.BoxGeometry(0.15, 0.14, D * 2 + 0.16),
      new T.MeshLambertMaterial({ color: '#233d34' }),
    );
    binding.position.set(0, -0.35, 0.02);
    base.add(binding);
    const stitchMat = new T.MeshLambertMaterial({ color: '#b49b6d' });
    for (let i = 0; i < 16; i++) {
      const z = -D + 0.34 + i * 0.36;
      const g = new T.QuadraticBezierCurve3(
        new T.Vector3(-0.064, 0.043, z - 0.039),
        new T.Vector3(0, 0.068, z),
        new T.Vector3(0.064, 0.043, z + 0.039),
      );
      base.add(new T.Mesh(new T.TubeGeometry(g, 4, 0.012, 4, false), stitchMat));
    }
    const cache = new Map(),
      pair = new Set(),
      v = new T.Vector3(),
      ray = new T.Raycaster(),
      pointer = new T.Vector2();
    let intro = null,
      turnWave = 0,
      cornerSide = 0,
      reading = 0,
      reaction = null;
    let active = null,
      activeIndex = 0,
      time = 0,
      yaw = 0,
      tilt = 0.53,
      currentYaw = 0,
      currentTilt = 0.53,
      desk = false,
      frame = 0,
      prevTime = 0;
    let shadowTime = -1,
      hidden = false,
      dirty = true,
      motion = true,
      lost = false,
      hands = null,
      spotlight = null,
      single = true;
    let width = 1,
      height = 1,
      fitDistance = 15,
      centerX = 0,
      centerY = 0,
      sceneClock = 0;
    const measure = new T.Vector3(),
      tempPoint = new T.Vector3(),
      restCenter = new T.Vector3(0, 0.82, 0);
    function makeSpread(index) {
      if (cache.has(index)) return cache.get(index);
      const id = items[index].id,
        material = new T.MeshLambertMaterial({ map: AtlasStock.sheet(index) });
      const root = new T.Group();
      const left = makeLeaf(true, material),
        right = makeLeaf(false, material);
      root.add(left, right);
      const spread = { index, id, root, paper: [left, right], folds: [[], []], hits: [], last: [null, null] };
      const buildSet = window.AtlasSets[id];
      if (typeof buildSet !== 'function') throw Error('Missing paper stage ' + id);
      spread.model =
        buildSet({
          place(obj, x, z, y = 0) {
            const pivot = new T.Group(),
              fold = new T.Group(),
              origin = new T.Group();
            origin.position.set(-x, 0, -z);
            obj.position.set(x, y, z);
            origin.add(obj);
            fold.add(origin);
            pivot.add(fold);
            root.add(pivot);
            spread.folds[x < 0 ? 0 : 1].push({ pivot, fold, u: Math.abs(x) / W, z });
            if (obj.userData.notebook) {
              const hit = {
                obj,
                action: 'evidence',
                label: '採訪手記 · 查原文',
                local: new T.Vector3(0, 0.66, 0),
                gesture: 'tap',
              };
              obj.userData.paperHotspot = hit;
              spread.hits.push(hit);
            }
            return obj;
          },
          hot(obj, action, label, xyz = [0, 1, 0], gesture = 'tap') {
            const article = window.AtlasEditorial?.[id];
            const named = action.startsWith('find:')
              ? article?.finds[Number(action.slice(5))]
              : article?.roles[action];
            const hit = { obj, action, label: named?.label || label, local: new T.Vector3(...xyz), gesture };
            obj.userData.paperHotspot = hit;
            spread.hits.push(hit);
          },
        }) || {};
      root.visible = false;
      scene.add(root);
      cache.set(index, spread);
      return spread;
    }
    function foldLeaf(spread, side, moving, theta, opening) {
      const index = side < 0 ? 0 : 1,
        cached = spread.last[index];
      const tip = !moving && opening === 1 && side === cornerSide && !reading ? side : 0;
      if (
        cached &&
        cached.moving === moving &&
        cached.theta === theta &&
        cached.opening === opening &&
        cached.tip === tip
      )
        return;
      spread.last[index] = { moving, theta, opening, tip };
      const paper = spread.paper[index],
        positions = paper.geometry.attributes.position;
      const front = side > 0 ? 1 : -1;
      for (let j = 0; j <= rows; j++) {
        const z = -D + (2 * D * j) / rows;
        for (let i = 0; i <= columns; i++) {
          const u = i / columns;
          if (moving) stripPoint(v, u, z, theta, front);
          else {
            v.set(side * W * u, crown(u), z);
            if (tip) {
              const lift = smooth(0.74, 1, u) * smooth(0.5, 1, j / rows);
              v.y += lift * 0.46;
              v.x -= side * lift * 0.13;
              v.z -= lift * 0.14;
            }
          }
          positions.setXYZ(j * (columns + 1) + i, v.x, v.y, v.z);
        }
      }
      positions.needsUpdate = true;
      paper.geometry.computeVertexNormals();
      for (const part of spread.folds[index]) {
        let rotation = 0;
        if (moving) {
          rotation = stripPoint(v, part.u, part.z, theta, front) - (side < 0 ? PI : 0);
        } else v.set(side * W * part.u, crown(part.u), part.z);
        part.pivot.position.copy(v);
        part.pivot.rotation.z = rotation;
        part.pivot.visible = opening > 0.035;
        part.fold.rotation.x = -(1 - opening) * 1.13;
        part.fold.scale.set(1, 0.16 + 0.84 * opening, 0.18 + 0.82 * opening);
      }
    }
    function position(a, b, f) {
      intro = null;
      cornerSide = 0;
      reading = 0;
      const flat = f <= 0.00001 || f >= 0.99999 || a === b;
      turnWave = flat ? 0 : Math.sin(PI * f);
      updateCamera();
      activeIndex = f > 0.5 ? b : a;
      active = makeSpread(activeIndex);
      single = flat;
      const nextPair = flat ? [activeIndex] : [a, b];
      for (const i of pair)
        if (!nextPair.includes(i)) {
          cache.get(i).root.visible = false;
          pair.delete(i);
        }
      for (const i of nextPair) {
        makeSpread(i).root.visible = true;
        pair.add(i);
      }
      if (flat) {
        foldLeaf(active, -1, false, 0, 1);
        foldLeaf(active, 1, false, 0, 1);
      } else {
        const first = cache.get(a),
          last = cache.get(b),
          theta = PI * f;
        foldLeaf(first, -1, false, 0, 1 - smooth(0.12, 0.89, f));
        foldLeaf(first, 1, true, theta, 1 - smooth(0.16, 0.85, f));
        foldLeaf(last, -1, true, theta, smooth(0.13, 0.88, f));
        foldLeaf(last, 1, false, 0, smooth(0.08, 0.9, f));
      }
      dirty = true;
    }
    function fitCamera() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || 1;
      height = rect.height || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = 31;
      camera.updateProjectionMatrix();
      const narrow = width < 650;
      let endX = desk && width > 850 ? clamp(width * 0.68, width - 435, width - 335) / width : 0.985;
      const bleed = narrow ? clamp((height / width - 1) * 0.15, 0, 0.16) : 0;
      const startX = narrow ? 0.015 - bleed : 0.025;
      endX += bleed;
      const top = narrow ? clamp(176 / height, 0.19, 0.33) : Math.min(0.2, 110 / height);
      const bottom = narrow ? 1 - clamp(158 / height, 0.2, 0.3) : 1 - clamp(63 / height, 0.065, 0.14);
      const aimY = (top + bottom) / 2,
        aimX = (startX + endX) / 2;
      const corners = [
        [-5.22, -0.42, 3.21],
        [5.22, -0.42, 3.21],
        [-5.22, -0.42, -3.21],
        [5.22, -0.42, -3.21],
        [-3.8, 3.05, -2.65],
        [3.85, 3.4, -1.65],
        [-1.68, 3.35, -2.35],
        [2.3, 3.72, -1.25],
      ];
      function bounds(distance) {
        const ang = 0.53;
        camera.position.set(0, restCenter.y + distance * Math.sin(ang), distance * Math.cos(ang));
        camera.lookAt(restCenter);
        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();
        let minX = 2,
          maxX = -2,
          minY = 2,
          maxY = -2;
        for (const [x, y, z] of corners) {
          const point = measure.set(x, y, z).project(camera);
          minX = Math.min(minX, point.x);
          maxX = Math.max(maxX, point.x);
          minY = Math.min(minY, point.y);
          maxY = Math.max(maxY, point.y);
        }
        return { minX, maxX, minY, maxY, w: (maxX - minX) / 2, h: (maxY - minY) / 2 };
      }
      let lo = 5.9,
        hi = 65;
      for (let n = 0; n < 14; n++) {
        let d = (lo + hi) / 2,
          k = bounds(d);
        if (k.w > endX - startX || k.h > bottom - top) lo = d;
        else hi = d;
      }
      fitDistance = hi;
      scene.fog.density = 0.145 / fitDistance;
      const box = bounds(hi);
      centerX = aimX * 2 - 1 - (box.minX + box.maxX) / 2;
      centerY = 1 - 2 * aimY - (box.minY + box.maxY) / 2;
      updateCamera();
      dirty = true;
    }
    function updateCamera() {
      const d = fitDistance * (1 + 0.11 * turnWave - reading * 0.06);
      const lookY = (restCenter.y + turnWave * 0.62) * (1 - reading);
      const bearing = currentYaw * (1 - reading),
        angle = currentTilt + (1.53 - currentTilt) * reading;
      camera.position.set(
        d * Math.sin(bearing) * Math.cos(angle),
        lookY + d * Math.sin(angle),
        d * Math.cos(bearing) * Math.cos(angle),
      );
      camera.lookAt(0, lookY, 0);
      camera.updateProjectionMatrix();
      camera.projectionMatrix.elements[8] -= centerX * (1 - reading);
      camera.projectionMatrix.elements[9] -= centerY * (1 - reading);
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
      camera.updateMatrixWorld();
    }
    function locate(hit) {
      if (!hit || !single || !active?.hits.includes(hit)) return null;
      hit.obj.updateWorldMatrix(true, false);
      const p = tempPoint.copy(hit.local).applyMatrix4(hit.obj.matrixWorld).project(camera);
      return { x: ((p.x + 1) * width) / 2, y: ((1 - p.y) * height) / 2 };
    }
    function pick(x, y) {
      if (!single || !active) return { kind: 'page' };
      const r = canvas.getBoundingClientRect();
      pointer.set(((x - r.left) / width) * 2 - 1, 1 - ((y - r.top) / height) * 2);
      ray.setFromCamera(pointer, camera);
      const hits = ray.intersectObject(active.root, true);
      for (const { object } of hits) {
        let cur = object,
          found = null,
          shown = true;
        while (cur) {
          if (!cur.visible) {
            shown = false;
            break;
          }
          found ||= cur.userData.paperHotspot;
          cur = cur.parent;
        }
        if (!shown) continue;
        return found ? { kind: 'prop', hit: found } : { kind: 'page' };
      }
      const page = ray.intersectObjects([...active.paper, ...base.children], true)[0];
      return { kind: page ? 'page' : 'table' };
    }
    function draw(ms) {
      frame = 0;
      if (hidden || lost || document.hidden) return;
      const dt = Math.min(0.08, Math.max(0, (ms - prevTime) / 1000));
      prevTime = ms;
      if (intro) {
        const p = clamp((ms - intro.start) / 880, 0, 1),
          op = 0.22 + 0.78 * (1 - (1 - p) ** 3);
        foldLeaf(active, -1, false, 0, op);
        foldLeaf(active, 1, false, 0, op);
        dirty = true;
        if (p >= 1) intro = null;
      }
      const cameraMoving = Math.abs(yaw - currentYaw) + Math.abs(tilt - currentTilt) > 0.00007;
      if (cameraMoving) {
        const damp = motion ? Math.min(1, Math.max(0.13, dt * 12)) : 1;
        currentYaw += (yaw - currentYaw) * damp;
        currentTilt += (tilt - currentTilt) * damp;
        updateCamera();
      }
      if (motion || dirty || cameraMoving || hands) {
        if (motion) {
          time += dt;
          sceneClock += dt;
        }
        for (const i of pair) {
          const stage = cache.get(i);
          stage.model.tick?.(time, motion ? dt : 0);
        }
        let undoReaction = null;
        if (reaction) {
          const t = clamp((ms - reaction.start) / 660, 0, 1);
          if (t >= 1 || !motion) reaction = null;
          else if (!hands) {
            const object = reaction.hit.obj,
              y = object.position.y,
              z = object.rotation.z;
            const pulse = Math.sin(t * PI);
            object.position.y += 0.14 * pulse;
            object.rotation.z += 0.075 * Math.sin(t * 2 * PI);
            undoReaction = () => {
              object.position.y = y;
              object.rotation.z = z;
            };
          }
        }
        let restore = null;
        if (hands && hands.amount) {
          const o = hands.hit.obj,
            amount = hands.amount;
          const savedPos = o.position.clone(),
            savedRot = o.rotation.clone();
          if (hands.hit.gesture === 'slide') o.position.x += amount * 0.68;
          if (hands.hit.gesture === 'lift') {
            o.position.y += amount * 0.43;
            o.rotation.x -= amount * 0.12;
          }
          if (hands.hit.gesture === 'spin') {
            const axis = hands.hit.action === 'ask1' ? 'y' : 'z';
            o.rotation[axis] += amount * (hands.hit.action === 'run' ? 2.85 : 1.12);
          }
          restore = () => {
            o.position.copy(savedPos);
            o.rotation.copy(savedRot);
          };
        }
        if (dirty || (motion && sceneClock - shadowTime > 0.15)) {
          renderer.shadowMap.needsUpdate = true;
          shadowTime = sceneClock;
        }
        renderer.render(scene, camera);
        callbacks.frame?.(locate(spotlight));
        restore?.();
        undoReaction?.();
        dirty = false;
      }
      if (motion || cameraMoving || hands) request();
    }
    function request() {
      if (!frame && !hidden && !lost && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function refresh() {
      dirty = true;
      request();
    }
    const resize = new ResizeObserver(() => {
      if (!hidden) {
        fitCamera();
        refresh();
      }
    });
    resize.observe(canvas);
    const vis = () => {
      prevTime = performance.now();
      refresh();
    };
    document.addEventListener('visibilitychange', vis);
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      frame = 0;
      callbacks.lost?.();
    });
    canvas.addEventListener('webglcontextrestored', () => {
      lost = false;
      renderer.shadowMap.needsUpdate = true;
      callbacks.restored?.();
      refresh();
    });
    fitCamera();
    return {
      position(a, b, f) {
        position(a, b, f);
        request();
      },
      redraw: refresh,
      unfold() {
        if (motion && active && single) {
          intro = { start: performance.now() };
          refresh();
        }
      },
      update(i, data, action, result) {
        const spread = makeSpread(i);
        spread.model.update?.(data, action, result);
        const affected = spread.hits.find((hit) => hit.action === action);
        if (affected && motion) reaction = { hit: affected, start: performance.now() };
        refresh();
      },
      // The projected sheet is also the starting quadrilateral of the original printed spread.
      reading(value) {
        intro = null;
        reading = clamp(value, 0, 1);
        if (active) {
          const opening = 1 - smooth(0, 0.59, reading);
          foldLeaf(active, -1, false, 0, opening);
          foldLeaf(active, 1, false, 0, opening);
        }
        updateCamera();
        refresh();
      },
      pageCorners() {
        const bounds = canvas.getBoundingClientRect();
        return [
          [-W, -D],
          [W, -D],
          [W, D],
          [-W, D],
        ].map(([x, z]) => {
          tempPoint.set(x, crown(1), z).project(camera);
          return {
            x: bounds.left + ((tempPoint.x + 1) * width) / 2,
            y: bounds.top + ((1 - tempPoint.y) * height) / 2,
          };
        });
      },
      react(action) {
        const hit = active?.hits.find((h) => h.action === action);
        if (hit && motion) reaction = { hit, start: performance.now() };
        refresh();
      },
      curl(side) {
        cornerSide = motion ? side : 0;
        if (active && single && !reading) {
          foldLeaf(active, -1, false, 0, 1);
          foldLeaf(active, 1, false, 0, 1);
          refresh();
        }
      },
      hits() {
        return active?.hits || [];
      },
      pick,
      project: locate,
      marker(hit) {
        spotlight = hit;
        refresh();
      },
      dragProp(hit, amount) {
        hands = hit ? { hit, amount } : null;
        refresh();
      },
      orbit(dx, dy) {
        yaw = clamp(yaw - dx * 0.004, -0.68, 0.68);
        tilt = clamp(tilt + dy * 0.0038, 0.34, 0.93);
        refresh();
      },
      reset() {
        yaw = 0;
        tilt = 0.53;
        refresh();
      },
      motion(value) {
        motion = Boolean(value);
        refresh();
      },
      panel(value) {
        desk = value;
        fitCamera();
        refresh();
      },
      visible(value) {
        hidden = !value;
        if (hidden) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else {
          prevTime = performance.now();
          fitCamera();
          refresh();
        }
      },
      still() {
        return single;
      },
      dispose() {
        hidden = true;
        cancelAnimationFrame(frame);
        resize.disconnect();
        document.removeEventListener('visibilitychange', vis);
        renderer.dispose();
      },
    };
  }
  window.AtlasVolume = { build };
})();
