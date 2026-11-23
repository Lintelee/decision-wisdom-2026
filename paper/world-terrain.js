/* A small archipelago for the issue. Positions are printed-map coordinates, x east and z south.
   The roads, visual world, fallback drawing, and vehicle all read the same survey. */
(() => {
  'use strict';
  const T = window.THREE;
  const lands = [
    {
      id: 'prologue',
      y: 0.21,
      grass: '#a8c882',
      cliff: '#a57962',
      sand: '#ead197',
      ink: '#c9b9ed',
      outline: [
        [-9.7, 1.9],
        [-9.25, 0.77],
        [-8.1, 0.17],
        [-7.16, 0.36],
        [-6.45, -0.03],
        [-5.65, 0.15],
        [-4.8, -0.28],
        [-3.45, 0.01],
        [-2.68, 0.6],
        [-2.95, 1.65],
        [-2.22, 2.14],
        [-2.12, 3.45],
        [-3.13, 4.2],
        [-4.34, 4.23],
        [-5.15, 4.92],
        [-6.16, 4.61],
        [-7.3, 4.96],
        [-8.53, 4.44],
        [-8.64, 3.52],
        [-9.44, 3.15],
      ],
    },
    {
      id: 'people',
      y: 0.3,
      grass: '#8cb855',
      cliff: '#937954',
      sand: '#e1c68a',
      ink: '#ccdd6a',
      outline: [
        [-9.66, -3.41],
        [-8.93, -4.28],
        [-8.08, -4.67],
        [-7.58, -5.34],
        [-6.38, -5.47],
        [-5.62, -5.15],
        [-4.72, -5.63],
        [-3.31, -5.48],
        [-2.44, -5.92],
        [-1.4, -5.46],
        [-1.06, -4.46],
        [-0.6, -3.66],
        [-1.07, -2.85],
        [-0.75, -2.04],
        [-1.55, -1.43],
        [-2.95, -1.67],
        [-3.96, -0.83],
        [-5.18, -1.14],
        [-6.33, -0.89],
        [-7.12, -1.33],
        [-8.5, -1.13],
        [-9.24, -1.92],
      ],
    },
    {
      id: 'model',
      y: 0.54,
      grass: '#e6bba2',
      cliff: '#a96e70',
      sand: '#efd4b2',
      ink: '#f5bfc8',
      outline: [
        [-0.01, -4.16],
        [0.23, -5.11],
        [1.47, -5.54],
        [2.62, -5.43],
        [3.61, -5.9],
        [4.45, -5.62],
        [5.6, -5.77],
        [6.78, -5.1],
        [7.3, -4.65],
        [7.28, -3.7],
        [8.06, -3.14],
        [8.37, -2.04],
        [7.42, -1.39],
        [6.25, -1.23],
        [5.45, -0.71],
        [4.46, -1.01],
        [3.24, -0.55],
        [2.19, -0.96],
        [1.0, -0.71],
        [0.4, -1.51],
        [0.42, -2.5],
        [-0.17, -3.09],
      ],
    },
    {
      id: 'ai',
      y: 0.28,
      grass: '#92c8bb',
      cliff: '#5c858c',
      sand: '#c5d6bf',
      ink: '#7fd5e3',
      outline: [
        [-0.08, 1.68],
        [0.59, 0.83],
        [1.42, 0.39],
        [2.66, 0.49],
        [3.6, 0.13],
        [4.41, 0.33],
        [5.23, -0.04],
        [6.57, 0.01],
        [7.13, 0.53],
        [8.2, 0.54],
        [9.02, 1.34],
        [9.4, 2.83],
        [8.66, 3.4],
        [8.53, 4.14],
        [7.62, 4.81],
        [6.51, 4.6],
        [5.36, 5.39],
        [4.17, 5.24],
        [2.98, 5.55],
        [2.05, 5.11],
        [1.05, 4.98],
        [0.44, 4.27],
        [-0.18, 3.61],
        [0.13, 2.68],
      ],
    },
  ];
  const stops = [
    {id:'growth',r:0,x:-7.2,z:2.75,dx:-.42,dz:-.89}, {id:'distance',r:0,x:-4.48,z:1.47,dx:.56,dz:-.72},
    {id:'witness',r:1,x:-6.85,z:-2.12,dx:-.35,dz:-.78}, {id:'want',r:1,x:-7.32,z:-4.03,dx:-.55,dz:-.38},
    {id:'voice',r:1,x:-4.65,z:-4.30,dx:.14,dz:-.60}, {id:'memory',r:1,x:-2.68,z:-3.39,dx:-.35,dz:-.76},
    {id:'persona',r:2,x:1.92,z:-3.05,dx:-.28,dz:-.9}, {id:'context',r:2,x:3.88,z:-4.26,dx:.15,dz:-.66},
    {id:'friction',r:2,x:5.6,z:-2.35,dx:.68,dz:-.67}, {id:'signal',r:3,x:6.24,z:1.29,dx:.48,dz:-.75},
    {id:'spec',r:3,x:4.99,z:3.83,dx:.74,dz:-.4}, {id:'permission',r:3,x:1.53,z:3.18,dx:-.25,dz:-.79},
  ];
  const connections = [
    [0,1,[[-6.17,2.92],[-5.38,2.25]]], [1,2,[[-4.86,.6],[-5.35,-.1],[-5.75,-.89],[-5.99,-1.76]]],
    [2,3,[[-7.4,-2.65]]], [3,4,[[-6.1,-4.22]]], [4,5,[[-3.7,-4.05]]], [2,5,[[-5.58,-2.11],[-4.9,-2.99],[-3.83,-3.07]]],
    [5,6,[[-1.65,-3.49],[-.64,-3.63],[.48,-3.68],[1,-3.2]]], [6,7,[[2.56,-3.79]]],
    [7,8,[[5.0,-3.77]]], [6,8,[[2.68,-2.58],[3.37,-1.8],[4.56,-1.76]]],
    [8,9,[[5.68,-1.65],[5.88,-.81],[6.05,-.08]]], [9,10,[[6.72,2.22],[6.52,3.05],[5.77,3.48]]],
    [10,11,[[4.22,4.07],[3.38,3.79],[2.65,3.16]]],
    [11,1,[[.69,3.27],[-.27,3],[-1.37,2.68],[-2.64,2.4],[-3.55,1.64]]],
    [6,11,[[1.7,-2.07],[1.51,-1.46],[1.31,-.48],[1.19,.54],[1.07,1.5],[1.07,2.44]]],
  ];
  function contains(outline, x, z) {
    let inside = false;
    for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
      const [x1, z1] = outline[i],
        [x2, z2] = outline[j];
      if (z1 > z !== z2 > z && x < ((x2 - x1) * (z - z1)) / (z2 - z1) + x1) inside = !inside;
    }
    return inside;
  }
  const landAt = (x, z) => lands.find((l) => contains(l.outline, x, z));
  const seed = (initial) => () => {
    initial = (Math.imul(initial, 1664525) + 1013904223) >>> 0;
    return initial / 4294967296;
  };
  function routes() {
    return connections.map(([a, b, middle]) => {
      const start = stops[a],
        end = stops[b];
      const curve = new T.CatmullRomCurve3(
        [[start.x, start.z], ...middle, [end.x, end.z]].map(([x, z]) => new T.Vector3(x, 0, z)),
      );
      const points = curve.getSpacedPoints(Math.ceil(curve.getLength() * 12));
      const y0 = lands[start.r].y,
        y1 = lands[end.r].y;
      for (let i = 0; i < points.length; i++) {
        const p = points[i],
          land = landAt(p.x, p.z),
          fraction = i / (points.length - 1);
        p.y = (land?.y ?? y0 + (y1 - y0) * fraction) + 0.038;
      }
      // Ease the shallow ramps into each bridge so the van never jumps at a shoreline.
      const heights = points.map((p) => p.y);
      points.forEach((p, i) => {
        let sum = 0,
          weight = 0;
        for (let j = -4; j <= 4; j++) {
          const k = Math.min(points.length - 1, Math.max(0, i + j)),
            w = 5 - Math.abs(j);
          sum += heights[k] * w;
          weight += w;
        }
        p.y = sum / weight;
      });
      return { a, b, points, length: curve.getLength() };
    });
  }
  function roadAt(edges, x, z) {
    let best = Infinity,
      point;
    for (const edge of edges)
      for (let i = 0; i < edge.points.length; i += 2) {
        const p = edge.points[i],
          d = (p.x - x) ** 2 + (p.z - z) ** 2;
        if (d < best) {
          best = d;
          point = p;
        }
      }
    return { distance: Math.sqrt(best), point };
  }
  function course(edges, start, target) {
    const dest = stops[target],
      end = new T.Vector3(dest.x, lands[dest.r].y + 0.05, dest.z);
    if (start.distanceTo(end) < 0.12) return [start.clone(), end];
    // Route from the nearest sampled point, including when the driver changes their mind on a bridge.
    let entry = null,
      offset = 0,
      closest = Infinity;
    for (const edge of edges)
      edge.points.forEach((v, i) => {
        const d = (v.x - start.x) ** 2 + (v.z - start.z) ** 2;
        if (d < closest) {
          closest = d;
          entry = edge;
          offset = i;
        }
      });
    const distance = stops.map(() => Infinity),
      next = stops.map(() => null),
      done = new Set();
    distance[target] = 0;
    for (let n = 0; n < stops.length; n++) {
      let from = -1;
      for (let i = 0; i < stops.length; i++)
        if (!done.has(i) && (from < 0 || distance[i] < distance[from])) from = i;
      done.add(from);
      for (const e of edges) {
        const to = e.a === from ? e.b : e.b === from ? e.a : -1;
        if (to < 0) continue;
        if (distance[to] > distance[from] + e.length) {
          distance[to] = distance[from] + e.length;
          next[to] = e;
        }
      }
    }
    const f = offset / (entry.points.length - 1);
    let i =
      distance[entry.a] + entry.length * f < distance[entry.b] + entry.length * (1 - f) ? entry.a : entry.b;
    const path = [
      start.clone(),
      ...(i === entry.a ? entry.points.slice(0, offset + 1).reverse() : entry.points.slice(offset)),
    ];
    while (i !== target && next[i]) {
      const e = next[i],
        forward = e.a === i;
      path.push(...(forward ? e.points.slice(1) : e.points.slice(0, -1).reverse()));
      i = forward ? e.b : e.a;
    }
    return path;
  }

  // Untextured static solids are baked into two vertex-colour meshes. Individual landmarks keep their moving parts.
  function solidBuilder() {
    const positions = [],
      colors = [],
      normals = [],
      m = new T.Matrix4(),
      q = new T.Quaternion(),
      p = new T.Vector3(),
      scale = new T.Vector3(1, 1, 1);
    const a = new T.Vector3(),
      b = new T.Vector3(),
      c = new T.Vector3(),
      n = new T.Vector3();
    const cache = new Map();
    function color(ink) {
      if (!cache.has(ink)) cache.set(ink, new T.Color(ink));
      return cache.get(ink);
    }
    function triangle(v0, v1, v2, ink) {
      const col = color(ink);
      a.fromArray(v0);
      b.fromArray(v1);
      c.fromArray(v2);
      n.subVectors(b, a).cross(c.sub(a)).normalize();
      positions.push(...v0, ...v1, ...v2);
      for (let i = 0; i < 3; i++) {
        colors.push(col.r, col.g, col.b);
        normals.push(n.x, n.y, n.z);
      }
    }
    function geometry(g, x, y, z, ink, sx = 1, sy = 1, sz = 1, turn = 0) {
      m.compose(p.set(x, y, z), q.setFromAxisAngle(new T.Vector3(0, 1, 0), turn), scale.set(sx, sy, sz));
      addGeometry(g, m, ink);
    }
    function addGeometry(g, mt, ink) {
      const attr = g.getAttribute('position'),
        norm = g.getAttribute('normal'),
        col = g.getAttribute('color'),
        idx = g.index;
      const v = new T.Vector3(),
        normalMatrix = new T.Matrix3().getNormalMatrix(mt),
        paint = color(ink);
      for (let i = 0; i < (idx ? idx.count : attr.count); i++) {
        const j = idx ? idx.getX(i) : i;
        v.fromBufferAttribute(attr, j).applyMatrix4(mt);
        positions.push(v.x, v.y, v.z);
        v.fromBufferAttribute(norm, j).applyNormalMatrix(normalMatrix);
        normals.push(v.x, v.y, v.z);
        if (col) colors.push(col.getX(j) * paint.r, col.getY(j) * paint.g, col.getZ(j) * paint.b);
        else colors.push(paint.r, paint.g, paint.b);
      }
    }
    function mesh(shadow) {
      const geom = new T.BufferGeometry();
      geom.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
      geom.setAttribute('normal', new T.Float32BufferAttribute(normals, 3));
      geom.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
      geom.computeBoundingSphere();
      const material = new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide });
      const object = new T.Mesh(geom, material);
      object.castShadow = shadow;
      object.receiveShadow = true;
      return object;
    }
    return { triangle, geometry, addGeometry, mesh };
  }
  function build(scene, edges) {
    const ground = solidBuilder(),
      detail = solidBuilder(),
      rng = seed(66100),
      cube = new T.BoxGeometry(1, 1, 1),
      rock = new T.DodecahedronGeometry(1, 0),
      cone = new T.ConeGeometry(1, 1, 6);
    function box(x, y, z, w, h, d, ink, yaw = 0) {
      detail.geometry(cube, x, y, z, ink, w, h, d, yaw);
    }
    function line(x1, z1, x2, z2, y, width, ink, h = 0.018) {
      box(
        (x1 + x2) / 2,
        y,
        (z1 + z2) / 2,
        width,
        h,
        Math.hypot(x2 - x1, z2 - z1),
        ink,
        Math.atan2(x2 - x1, z2 - z1),
      );
    }
    function strip(a, b, y1, y2, w, ink) {
      const length = Math.hypot(b.x - a.x, b.z - a.z) || 1,
        dx = ((-(b.z - a.z) / length) * w) / 2,
        dz = (((b.x - a.x) / length) * w) / 2;
      const p = [a.x + dx, y1, a.z + dz],
        q = [a.x - dx, y1, a.z - dz],
        r = [b.x + dx, y2, b.z + dz],
        s = [b.x - dx, y2, b.z - dz];
      detail.triangle(p, r, q, ink);
      detail.triangle(q, r, s, ink);
    }
    function disc(x, y, z, rx, rz, ink, n = 14) {
      for (let i = 0; i < n; i++) {
        const u = (i / n) * 2 * Math.PI,
          v = ((i + 1) / n) * 2 * Math.PI;
        detail.triangle(
          [x, y, z],
          [x + Math.cos(v) * rx, y, z + Math.sin(v) * rz],
          [x + Math.cos(u) * rx, y, z + Math.sin(u) * rz],
          ink,
        );
      }
    }
    function ribbon(points, cx, cz, levels, unit = ground) {
      for (let i = 1; i < levels.length; i++) {
        const [s0, y0] = levels[i - 1],
          [s1, y1, inks] = levels[i];
        for (let j = 0; j < points.length; j++) {
          const a = points[j],
            b = points[(j + 1) % points.length],
            ink = Array.isArray(inks) ? inks[j % inks.length] : inks;
          const p = [cx + (a[0] - cx) * s0, y0, cz + (a[1] - cz) * s0],
            q = [cx + (b[0] - cx) * s0, y0, cz + (b[1] - cz) * s0],
            r = [cx + (a[0] - cx) * s1, y1, cz + (a[1] - cz) * s1],
            s = [cx + (b[0] - cx) * s1, y1, cz + (b[1] - cz) * s1];
          unit.triangle(p, r, q, ink);
          unit.triangle(q, r, s, ink);
        }
      }
    }
    function hill(x, z, w, h, base, inks, snow = false) {
      const outline = [];
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        outline.push([
          x + Math.cos(a) * w * (0.87 + rng() * 0.13),
          z + Math.sin(a) * w * (0.72 + rng() * 0.16),
        ]);
      }
      ribbon(
        outline,
        x,
        z,
        [
          [1, base],
          [0.6, base + h * 0.48, inks],
          [0.26, base + h * 0.84, snow ? '#e2e8d8' : inks],
          [0.015, base + h, snow ? '#fcfae7' : inks],
        ],
        detail,
      );
    }
    for (const [landIndex, l] of lands.entries()) {
      const points = l.outline,
        center = points.reduce((a, p) => [a[0] + p[0] / points.length, a[1] + p[1] / points.length], [0, 0]);
      const [x, z] = center;
      ribbon(points, x, z, [
        [1.035, -0.54],
        [1.023, -0.29, l.sand],
        [1.01, -0.19, l.cliff],
        [0.995, l.y - 0.12, [l.cliff, l.cliff, '#ac9678', l.cliff]],
        [1.0, l.y - 0.075, l.sand],
        [0.987, l.y, l.grass],
      ]);
      const vertices = points.map(([xx, zz]) => new T.Vector2(x + (xx - x) * 0.987, z + (zz - z) * 0.987));
      for (const face of T.ShapeUtils.triangulateShape(vertices, [])) {
        const arr = face.map((i) => [vertices[i].x, l.y, vertices[i].y]);
        ground.triangle(arr[2], arr[1], arr[0], l.grass);
      }
      const grassMarks = ['#bdd88c', '#b1ce76', '#f0c9ad', '#add6bf'][landIndex];
      for (let i = 0; i < 152; i++) {
        const xx = x + (rng() - 0.5) * 10,
          zz = z + (rng() - 0.5) * 6;
        if (!contains(points, xx, zz) || roadAt(edges, xx, zz).distance < 0.24) continue;
        const size = 0.04 + rng() * 0.12;
        detail.triangle(
          [xx, l.y + 0.008, zz],
          [xx + size * 0.21, l.y + 0.009, zz - size * 0.22],
          [xx + size, l.y + 0.008, zz],
          grassMarks,
        );
      }
      // Trees stay outside the roads, the station's landing circle and each model's footprint.
      const species = ['round', 'pine', 'bloom', 'poplar'][landIndex];
      for (let i = 0; i < 160; i++) {
        const xx = x + (rng() - 0.5) * 10,
          zz = z + (rng() - 0.5) * 5.1;
        if (
          !contains(points, xx, zz) ||
          roadAt(edges, xx, zz).distance < 0.49 ||
          stops.some(
            (s) => Math.hypot(s.x + s.dx - xx, s.z + s.dz - zz) < 1.2 || Math.hypot(s.x - xx, s.z - zz) < 0.7,
          )
        )
          continue;
        if (rng() > 0.62) continue;
        const size = 0.33 + rng() * 0.52;
        const tree = window.AtlasMapModels?.tree(species, i);
        if (tree) {
          tree.scale.setScalar(size);
          tree.position.set(xx, l.y, zz);
          tree.rotation.y = rng() * 6;
          tree.updateMatrixWorld(true);
          tree.traverse((m) => {
            if (m.isMesh) detail.addGeometry(m.geometry, m.matrixWorld, '#' + m.material.color.getHexString());
          });
        } else {
          box(xx, l.y + 0.16 * size, zz, 0.11 * size, 0.32 * size, 0.11 * size, '#836d50');
          detail.geometry(
            cone,
            xx,
            l.y + 0.61 * size,
            zz,
            ['#6e9b65', '#52865a', '#c58394', '#709e88'][landIndex],
            size * 0.35,
            size * 0.8,
            size * 0.35,
          );
        }
      }
    }
    for (const [x, z, w, h] of [
      [-8, -4.35, 0.92, 1.1],
      [-7.05, -4.7, 0.99, 1.42],
      [-6.13, -4.65, 0.6, 0.77],
      [-4.78, -4.81, 0.63, 0.79],
      [3.1, -5.05, 0.86, 1.36],
      [4.27, -4.86, 0.75, 1.05],
      [5.22, -4.88, 0.59, 0.7],
      [7.72, 3.5, 0.57, 0.83],
    ]) {
      const land = landAt(x, z);
      if (land)
        hill(
          x,
          z,
          w,
          h,
          land.y,
          land.id === 'model' ? ['#ba9295', '#cda2a3', '#d9b4a4'] : ['#739769', '#8eac78', '#9cb78a'],
          true,
        );
    }
    for (const e of edges) {
      const ps = e.points;
      for (let i = 1; i < ps.length; i++) {
        const a = ps[i - 1],
          b = ps[i],
          mx = (a.x + b.x) / 2,
          mz = (a.z + b.z) / 2,
          isBridge = !landAt(mx, mz);
        strip(a, b, a.y + 0.004, b.y + 0.004, 0.42, isBridge ? '#9a715a' : '#e2d9ac');
        strip(a, b, a.y + 0.011, b.y + 0.011, 0.33, isBridge ? '#c6a072' : '#666e70');
        if (i % 6 === 2) strip(a, b, a.y + 0.018, b.y + 0.018, 0.027, '#f4ebcc');
        if (isBridge) {
          const dx = b.x - a.x,
            dz = b.z - a.z,
            len = Math.hypot(dx, dz),
            vx = (-dz / len) * 0.219,
            vz = (dx / len) * 0.219;
          if (i % 4 === 0) {
            line(mx - vx, mz - vz, mx + vx, mz + vz, a.y + 0.022, 0.027, '#8d6e55');
            for (const sign of [-1, 1])
              box(mx + vx * sign, a.y - 0.11, mz + vz * sign, 0.055, 0.65, 0.055, '#796352');
          }
          for (const sign of [-1, 1])
            line(
              a.x + vx * sign,
              a.z + vz * sign,
              b.x + vx * sign,
              b.z + vz * sign,
              a.y + 0.18,
              0.026,
              '#f5d3a0',
              0.035,
            );
        }
      }
    }
    const animated = [];
    for (const [i, s] of stops.entries()) {
      const l = lands[s.r];
      disc(s.x, l.y + 0.064, s.z, 0.42, 0.42, '#ede2bf');
      disc(s.x, l.y + 0.071, s.z, 0.32, 0.32, '#5c6264');
      disc(s.x, l.y + 0.079, s.z, 0.21, 0.21, l.ink);
      const lx = s.x + s.dx,
        lz = s.z + s.dz;
      disc(lx, l.y + 0.014, lz, 0.84, 0.62, '#e4d6ad');
      const object = window.AtlasMapModels?.landmark(s.id);
      if (object) {
        object.position.set(lx, l.y + 0.025, lz);
        object.rotation.y = [-.17,-.12,.2,-.12,-.16,-.3,.18,-.34,-.14,.1,-.2,.05][i];
        scene.add(object);
        if (object.userData.animate) animated.push(object);
      }
      const fx = s.x - 0.35,
        fz = s.z + 0.12;
      box(fx, l.y + 0.31, fz, 0.042, 0.59, 0.042, '#44494b');
      box(fx + 0.15, l.y + 0.51, fz, 0.3, 0.16, 0.033, l.ink, -0.15);
    }
    // Small editorial scenes between the main stops.
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 5; j++) {
        const x = 3.2 + j * 0.3,
          z = -3.82 - i * 0.26;
        line(x, z, x + 0.17, z - 0.05, 0.555, 0.055, i === 1 ? '#b58284' : '#d29da3');
      }
    for (const [x, z] of [
      [-7.9, 3.84],
      [-8.32, 3.5],
    ]) {
      box(x, 0.24, z, 0.34, 0.1, 0.56, '#c99970');
      for (const v of [-0.11, 0.11]) box(x + v, 0.02, z - 0.2, 0.05, 0.59, 0.05, '#977e66');
    }
    const offshore = [
      [-8.85, -0.31, 0.42],
      [-9.52, -0.58, 0.2],
      [-1.55, 0, 0.42],
      [-1.92, 0.44, 0.23],
      [8.91, -3.22, 0.38],
      [9.25, -3.03, 0.21],
      [0.02, 4.92, 0.29],
      [7.85, 5.43, 0.26],
      [-7.92, 5.4, 0.22],
    ];
    offshore.forEach(([x, z, r]) => {
      detail.geometry(rock, x, -0.4, z, '#b8bcad', r, r * 0.78, r * 0.77, rng() * 5);
    });
    const ocean = new T.Mesh(new T.PlaneGeometry(170, 170), new T.MeshLambertMaterial({ color: '#70bec4' }));
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.49;
    ocean.receiveShadow = true;
    scene.add(ocean);
    for (let i = 0; i < 690; i++) {
      const x = (rng() - 0.5) * 37,
        z = (rng() - 0.5) * 27;
      if (landAt(x, z)) continue;
      const d = 0.09 + rng() * 0.27;
      line(x, z, x + d, z - 0.025, -0.48, 0.019, i % 3 ? '#a2d6d4' : '#86cacd', 0.006);
      if (i % 7 === 0) line(x + d * 0.35, z + 0.085, x + d * 0.71, z + 0.075, -0.478, 0.016, '#c4e5db', 0.005);
    }
    scene.add(ground.mesh(false), detail.mesh(true));
    cube.dispose();
    cone.dispose();
    rock.dispose();
    return animated;
  }
  window.AtlasTerrain = { lands, stops, routes, landAt, roadAt, course, build };
})();
