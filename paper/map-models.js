/* Original press-island miniatures. The front of a model is +Z and its feet are at y=0. */
(() => {
  'use strict';
  const T = window.THREE;
  const TAU = Math.PI * 2;
  const paint = {
    ink: '#26374a',
    deep: '#243b46',
    line: '#3d5056',
    brass: '#e9b557',
    sun: '#ffd778',
    ivory: '#fff0c7',
    paper: '#f4e4c0',
    board: '#caa77e',
    rust: '#ba7657',
    wood: '#855a51',
    plum: '#836899',
    lilac: '#c3a6de',
    lilacLight: '#e3cfec',
    lime: '#bace69',
    grass: '#819a50',
    leaf: '#486e53',
    peach: '#f5a78d',
    coral: '#ce6f72',
    rose: '#945d77',
    teal: '#75c5d2',
    cyan: '#a9e0dc',
    sea: '#4b9dac',
    glass: '#688e9b',
    night: '#384968',
    white: '#fff9de',
  };
  const geometries = new Map(),
    materials = new Map(),
    templates = new Map();
  const bodyPaint = new T.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  const group = () => new T.Group();
  const geom = (key, make) => {
    if (!geometries.has(key)) geometries.set(key, make());
    return geometries.get(key);
  };
  function shade(color) {
    if (!materials.has(color)) materials.set(color, new T.MeshLambertMaterial({ color, flatShading: true }));
    return materials.get(color);
  }
  function put(parent, child, x = 0, y = 0, z = 0) {
    child.position.set(x, y, z);
    parent.add(child);
    return child;
  }
  function primitive(parent, geometry, color, x = 0, y = 0, z = 0) {
    return put(parent, new T.Mesh(geometry, shade(color)), x, y, z);
  }
  function box(parent, w, h, d, color, x = 0, y = 0, z = 0) {
    const part = primitive(
      parent,
      geom('unit-box', () => new T.BoxGeometry(1, 1, 1)),
      color,
      x,
      y,
      z,
    );
    part.scale.set(w, h, d);
    return part;
  }
  function cylinder(parent, rTop, rBottom, h, color, x = 0, y = 0, z = 0, sides = 12) {
    const key = 'cyl:' + rTop + '/' + rBottom + '/' + h + '/' + sides;
    return primitive(
      parent,
      geom(key, () => new T.CylinderGeometry(rTop, rBottom, h, sides)),
      color,
      x,
      y,
      z,
    );
  }
  // Extruded outlines are used for the hull, covers, shutters and roofs as well as the printed die cuts.
  function outline(points, depth) {
    const key = 'cut:' + points.join('|') + '/' + depth;
    return geom(key, () => {
      const path = new T.Shape();
      path.moveTo(points[0][0], points[0][1]);
      points.slice(1).forEach(([x, y]) => path.lineTo(x, y));
      path.closePath();
      const result = new T.ExtrudeGeometry(path, { depth, bevelEnabled: false, curveSegments: 5 });
      result.translate(0, 0, -depth / 2);
      return result;
    });
  }
  function xy(parent, points, depth, color, x = 0, y = 0, z = 0) {
    return primitive(parent, outline(points, depth), color, x, y, z);
  }
  function deck(parent, points, height, color, x = 0, y = 0, z = 0) {
    const part = xy(
      parent,
      points.map(([px, pz]) => [px, -pz]),
      height,
      color,
      x,
      y + height / 2,
      z,
    );
    part.rotation.x = -Math.PI / 2;
    return part;
  }
  function slab(parent, w, h, d, color, x = 0, y = 0, z = 0, corner = 0.065) {
    const a = w / 2,
      b = d / 2,
      r = Math.min(a, b, corner);
    return deck(
      parent,
      [
        [-a + r, -b],
        [a - r, -b],
        [a, -b + r],
        [a, b - r],
        [a - r, b],
        [-a + r, b],
        [-a, b - r],
        [-a, -b + r],
      ],
      h,
      color,
      x,
      y,
      z,
    );
  }
  function roof(parent, w, rise, depth, color, x, y, z) {
    return xy(
      parent,
      [
        [-w / 2, 0],
        [0, rise],
        [w / 2, 0],
        [w / 2, -0.044],
        [0, rise - 0.044],
        [-w / 2, -0.044],
      ],
      depth,
      color,
      x,
      y,
      z,
    );
  }
  function axisCylinder(parent, r, h, color, x, y, z, sides = 16) {
    const disk = cylinder(parent, r, r, h, color, x, y, z, sides);
    disk.rotation.x = Math.PI / 2;
    return disk;
  }
  function ring(parent, outer, thick, color, x, y, z, segments = 18) {
    return primitive(
      parent,
      geom(
        'ring:' + outer + '/' + thick + '/' + segments,
        () => new T.TorusGeometry(outer - thick, thick, 5, segments),
      ),
      color,
      x,
      y,
      z,
    );
  }
  function rail(parent, start, end, radius, color, sides = 6) {
    const a = new T.Vector3(...start),
      b = new T.Vector3(...end),
      delta = b.sub(a);
    const rod = cylinder(parent, radius, radius, delta.length(), color);
    rod.position.copy(a).addScaledVector(delta, 0.5);
    rod.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
    return rod;
  }
  function pane(parent, w, h, color, x, y, z) {
    box(parent, w + 0.042, h + 0.044, 0.038, paint.deep, x, y, z);
    box(parent, w, h, 0.028, color, x, y, z + 0.025);
  }
  function packet(parent, w, h, d, x, y, z, color = paint.board) {
    const parcel = put(parent, group(), x, y, z);
    slab(parcel, w, h, d, color, 0, 0, 0, 0.014);
    box(parcel, w * 0.2, 0.011, d + 0.004, paint.ivory, 0, h + 0.003, 0);
    box(parcel, w * 0.2, h * 0.84, 0.011, paint.ivory, 0, h * 0.58, d / 2);
    box(parcel, w * 0.3, h * 0.18, 0.013, paint.paper, w * 0.25, h * 0.46, d / 2 + 0.003);
    return parcel;
  }
  // Each immobile assembly occupies one draw call irrespective of its number of ink colours.
  function batch(root, excluded = []) {
    root.updateWorldMatrix(true, true);
    const inverse = root.matrixWorld.clone().invert();
    const positions = [],
      normals = [],
      colors = [],
      originals = [];
    const local = new T.Matrix4(),
      normalMatrix = new T.Matrix3(),
      v = new T.Vector3(),
      n = new T.Vector3();
    function collect(object) {
      if (excluded.includes(object)) return;
      if (object.isMesh) {
        local.multiplyMatrices(inverse, object.matrixWorld);
        normalMatrix.getNormalMatrix(local);
        const shape = object.geometry;
        const xyz = shape.attributes.position,
          norm = shape.attributes.normal,
          indices = shape.index;
        const count = indices ? indices.count : xyz.count;
        const color = object.material.color;
        for (let i = 0; i < count; i++) {
          const j = indices ? indices.getX(i) : i;
          v.fromBufferAttribute(xyz, j).applyMatrix4(local);
          n.fromBufferAttribute(norm, j).applyNormalMatrix(normalMatrix);
          positions.push(v.x, v.y, v.z);
          normals.push(n.x, n.y, n.z);
          colors.push(color.r, color.g, color.b);
        }
        originals.push(object);
      } else {
        for (const child of object.children) collect(child);
      }
    }
    for (const child of root.children) collect(child);
    originals.forEach((object) => object.removeFromParent());
    if (!positions.length) return;
    const merged = new T.BufferGeometry();
    merged.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    merged.setAttribute('normal', new T.Float32BufferAttribute(normals, 3));
    merged.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
    merged.computeBoundingSphere();
    const solid = new T.Mesh(merged, bodyPaint);
    solid.castShadow = solid.receiveShadow = true;
    root.add(solid);
  }
  function complete(root, moving = [], animate) {
    moving.forEach((part) => batch(part));
    batch(root, moving);
    if (animate) root.userData.animate = animate;
    return root;
  }

  function breakfastStand() {
    const root = group();
    slab(root, 1.5, 0.09, 1.12, '#ad9e96', 0, 0, 0, 0.17);
    slab(root, 0.94, 0.06, 0.76, paint.board, 0.13, 0.1, -0.125);
    box(root, 0.9, 0.36, 0.48, paint.teal, 0.13, 0.33, -0.13);
    box(root, 1.02, 0.065, 0.61, paint.ivory, 0.13, 0.523, -0.11);
    for (const x of [-0.31, 0.57])
      for (const z of [-0.39, 0.105]) box(root, 0.045, 0.75, 0.048, paint.wood, x, 0.69, z);
    for (let i = 0; i < 7; i++) {
      const x = -0.393 + i * 0.173,
        color = i % 2 ? '#f4dab6' : '#c9684f';
      const roof = box(root, 0.173, 0.053, 0.89, color, x, 1.085, -0.12);
      roof.rotation.x = 0.15;
      xy(
        root,
        [
          [-0.087, 0],
          [0.087, 0],
          [0.087, -0.087],
          [0.046, -0.13],
          [-0.054, -0.13],
          [-0.087, -0.085],
        ],
        0.028,
        color,
        x,
        1.04,
        0.32,
      );
    }
    cylinder(root, 0.131, 0.12, 0.15, paint.ink, -0.07, 0.627, -0.09);
    cylinder(root, 0.153, 0.146, 0.033, paint.ivory, -0.07, 0.716, -0.09);
    cylinder(root, 0.074, 0.046, 0.123, paint.paper, 0.278, 0.61, 0.04);
    cylinder(root, 0.063, 0.063, 0.009, paint.brass, 0.278, 0.677, 0.04);
    const bike = put(root, group(), -0.18, 0.082, 0.42);
    for (const x of [-0.27, 0.23]) {
      ring(bike, 0.169, 0.022, paint.ink, x, 0.19, 0);
      rail(bike, [x - 0.13, 0.19, 0], [x + 0.13, 0.19, 0], 0.007, paint.board);
      rail(bike, [x, 0.05, 0], [x, 0.33, 0], 0.007, paint.board);
    }
    for (const [from, to] of [
      [
        [-0.27, 0.19, 0.02],
        [-0.07, 0.16, 0.02],
      ],
      [
        [-0.07, 0.16, 0.02],
        [0.13, 0.383, 0.02],
      ],
      [
        [0.13, 0.383, 0.02],
        [0.23, 0.19, 0.02],
      ],
      [
        [-0.07, 0.16, 0.02],
        [-0.17, 0.38, 0.02],
      ],
      [
        [-0.17, 0.38, 0.02],
        [-0.27, 0.19, 0.02],
      ],
    ])
      rail(bike, from, to, 0.019, '#ba5744');
    box(bike, 0.14, 0.036, 0.08, paint.ink, -0.17, 0.39, 0);
    box(bike, 0.21, 0.126, 0.166, '#bc936b', 0.25, 0.385, 0);
    const steam = put(root, group(), -0.07, 0.735, -0.09);
    rail(steam, [-0.032, 0, 0], [-0.07, 0.07, 0], 0.01, paint.paper);
    rail(steam, [-0.07, 0.07, 0], [-0.047, 0.14, 0], 0.009, paint.paper);
    return complete(root, [steam], (t) => {
      steam.scale.y = 0.78 + 0.22 * Math.sin(t * 2.2);
    });
  }

  function umbrella(root, x, y, z) {
    const pole = cylinder(root, 0.025, 0.031, y, paint.wood, x, y / 2, z, 7);
    const top = put(root, group(), x, y, z);
    const segments = 10,
      r = 0.435;
    for (let i = 0; i < segments; i++) {
      const a = ((i + 0.5) * TAU) / segments,
        b = ((i + 1.5) * TAU) / segments;
      const data = [];
      const P = (ang, rad, h) => [rad * Math.cos(ang), h, rad * Math.sin(ang)];
      const tip = [0, 0.248, 0],
        midA = P(a, r * 0.6, 0.138),
        midB = P(b, r * 0.6, 0.138),
        endA = P(a, r, 0),
        endB = P(b, r, 0);
      const c = P((a + b) / 2, r * 1.015, -0.033);
      const tri = (a, b, c) => data.push(...a, ...b, ...c);
      tri(tip, midB, midA);
      tri(midA, midB, endB);
      tri(midA, endB, endA);
      tri(endA, endB, c);
      const geometry = new T.BufferGeometry();
      geometry.setAttribute('position', new T.Float32BufferAttribute(data, 3));
      geometry.computeVertexNormals();
      primitive(top, geometry, i % 2 === 0 ? paint.lilac : paint.lilacLight);
      rail(top, [0, 0.24, 0], midA, 0.009, paint.ivory, 4);
      rail(top, midA, endA, 0.008, paint.ivory, 4);
    }
    cylinder(top, 0.028, 0.042, 0.07, paint.brass, 0, 0.256, 0, 8);
    return pole;
  }
  function tram() {
    const root = group();
    slab(root, 1.35, 0.072, 0.86, '#9da5a7', 0, 0, 0, 0.12);
    for (let i = 0; i < 7; i++) box(root, 0.098, 0.035, 0.43, paint.wood, -0.54 + i * 0.18, 0.094, 0.18);
    for (const z of [0.045, 0.32]) box(root, 1.33, 0.033, 0.029, paint.ink, 0, 0.12, z);
    slab(root, 0.89, 0.11, 0.3, paint.board, -0.12, 0.074, -0.24, 0.04);
    umbrella(root, -0.33, 0.78, -0.16);
    const car = put(root, group(), 0.114, 0, 0.17);
    for (const x of [-0.29, 0.28]) axisCylinder(car, 0.1, 0.34, paint.ink, x, 0.218, 0, 10);
    slab(car, 0.87, 0.22, 0.37, paint.plum, 0, 0.22, 0, 0.063);
    slab(car, 0.82, 0.22, 0.35, paint.lilacLight, 0, 0.44, 0, 0.04);
    for (const x of [-0.26, -0.075, 0.115, 0.296]) pane(car, 0.112, 0.12, paint.glass, x, 0.55, 0.18);
    slab(car, 0.92, 0.045, 0.43, paint.lilac, 0, 0.671, 0, 0.061);
    box(car, 0.8, 0.032, 0.01, paint.sun, 0, 0.365, 0.192);
    for (const x of [-0.375, 0.375]) box(car, 0.047, 0.057, 0.017, paint.sun, x, 0.32, 0.193);
    const sign = put(root, group(), 0.49, 0, -0.23);
    cylinder(sign, 0.028, 0.03, 0.76, paint.ink, 0, 0.44, 0, 7);
    axisCylinder(sign, 0.13, 0.042, paint.plum, 0, 0.825, 0, 12);
    box(sign, 0.13, 0.045, 0.018, paint.ivory, 0, 0.825, 0.031);
    return complete(root, [car], (t) => {
      car.position.x = 0.113 + Math.sin(t * 0.75) * 0.07;
    });
  }

  function camera() {
    const root = group();
    const board = put(root, group(), -0.544, 0.0, -0.18);
    board.rotation.y = -0.24;
    box(board, 0.066, 1.162, 0.065, paint.wood, 0, 0.582, 0);
    const checks = [paint.ink, paint.paper];
    for (let y = 0; y < 2; y++)
      for (let x = 0; x < 4; x++)
        box(board, 0.105, 0.099, 0.052, checks[(x + y) % 2], 0.071 + x * 0.102, 1.05 + y * 0.098, 0);
    const cam = put(root, group(), 0.045, 0.0, 0.05);
    cam.rotation.y = 0.14;
    for (const [x, z] of [
      [-0.39, 0.31],
      [0.36, 0.26],
      [0.04, -0.35],
    ])
      rail(cam, [0, 0.61, 0], [x, 0.055, z], 0.037, paint.ink, 7);
    cylinder(cam, 0.1, 0.11, 0.085, paint.brass, 0, 0.57, 0, 9);
    slab(cam, 0.75, 0.42, 0.41, paint.leaf, 0, 0.6, 0, 0.046);
    slab(cam, 0.79, 0.094, 0.46, paint.lime, 0, 1.016, 0, 0.057);
    box(cam, 0.29, 0.105, 0.18, paint.ink, -0.075, 1.146, -0.018);
    box(cam, 0.14, 0.077, 0.18, paint.brass, 0.254, 1.144, -0.026);
    pane(cam, 0.105, 0.092, '#9db9a0', -0.244, 0.897, 0.222);
    const objective = put(cam, group(), 0.07, 0.825, 0.22);
    axisCylinder(objective, 0.207, 0.17, paint.ink, 0, 0, 0.03);
    axisCylinder(objective, 0.188, 0.09, paint.board, 0, 0, 0.143);
    axisCylinder(objective, 0.164, 0.041, paint.deep, 0, 0, 0.207);
    axisCylinder(objective, 0.119, 0.045, paint.glass, 0, 0, 0.229);
    axisCylinder(objective, 0.061, 0.014, paint.ink, 0, 0, 0.26, 12);
    axisCylinder(objective, 0.023, 0.01, paint.white, -0.05, 0.044, 0.266, 8);
    return complete(root, [objective], (t) => {
      objective.position.z = 0.222 + 0.022 * (1 + Math.sin(t * 1.35));
    });
  }

  function stadium() {
    const root = group();
    const base = cylinder(root, 0.64, 0.66, 0.1, paint.ink, 0, 0.05, 0, 16);
    base.scale.x = 1.09;
    base.scale.z = 0.87;
    const turf = cylinder(root, 0.61, 0.6, 0.055, '#92aa63', 0, 0.126, 0, 20);
    turf.scale.x = 1.1;
    turf.scale.z = 0.87;
    deck(
      root,
      [
        [-0.32, 0.03],
        [0, -0.26],
        [0.32, 0.03],
        [0, 0.34],
      ],
      0.013,
      paint.rust,
      0,
      0.152,
      0,
    );
    deck(
      root,
      [
        [-0.216, 0.032],
        [0, -0.16],
        [0.216, 0.032],
        [0, 0.232],
      ],
      0.01,
      '#acc16c',
      0,
      0.166,
      0,
    );
    for (const [x, z] of [
      [-0.25, 0.045],
      [0, -0.19],
      [0.25, 0.045],
      [0, 0.288],
    ])
      box(root, 0.046, 0.012, 0.046, paint.white, x, 0.183, z).rotation.y = 0.8;
    for (let i = 0; i < 11; i++) {
      const a = (-0.15 + (i * 1.3) / 10) * Math.PI;
      const bank = put(root, group(), 0.552 * Math.cos(a), 0, -0.451 * Math.sin(a));
      bank.rotation.y = a - Math.PI / 2;
      box(bank, 0.222, 0.132, 0.115, paint.board, 0, 0.2, 0);
      box(bank, 0.217, 0.066, 0.082, paint.lime, 0, 0.29, 0.047);
      box(bank, 0.213, 0.106, 0.078, paint.leaf, 0, 0.26, -0.05);
      box(bank, 0.199, 0.034, 0.064, paint.ivory, 0, 0.328, -0.058);
    }
    const scoreboard = put(root, group(), 0, 0, -0.403);
    for (const x of [-0.18, 0.18]) box(scoreboard, 0.046, 0.38, 0.054, paint.ink, x, 0.496, 0);
    slab(scoreboard, 0.62, 0.267, 0.134, paint.ink, 0, 0.622, 0, 0.028);
    box(scoreboard, 0.53, 0.182, 0.022, paint.leaf, 0, 0.753, 0.073);
    box(scoreboard, 0.102, 0.023, 0.014, paint.sun, -0.115, 0.8, 0.089);
    box(scoreboard, 0.024, 0.09, 0.014, paint.sun, -0.082, 0.755, 0.089).rotation.z = -0.35;
    for (const x of [0.042, 0.094, 0.146])
      axisCylinder(scoreboard, 0.013, 0.013, paint.lime, x, 0.77, 0.092, 6);
    const flags = [];
    for (const [x, z] of [
      [-0.51, -0.13],
      [0.49, -0.16],
      [0.37, -0.31],
    ]) {
      cylinder(root, 0.011, 0.017, 0.393, paint.wood, x, 0.483, z, 5);
      const flag = put(root, group(), x, 0.646, z);
      xy(
        flag,
        [
          [0, 0.035],
          [0.157, 0.015],
          [0.053, -0.043],
          [0, -0.055],
        ],
        0.014,
        flags.length ? paint.lime : paint.brass,
      );
      flags.push(flag);
    }
    return complete(root, flags, (t) => {
      flags.forEach((f, i) => {
        f.rotation.y = 0.35 * Math.sin(t * 2.4 + i);
      });
    });
  }

  function bottleStall() {
    const root = group();
    slab(root, 1.15, 0.08, 0.78, paint.rose, 0, 0, 0, 0.06);
    for (const x of [-0.45, 0.45]) {
      box(root, 0.055, 0.72, 0.065, paint.wood, x, 0.43, -0.18);
    }
    box(root, 0.94, 0.25, 0.37, paint.peach, 0, 0.23, -0.015);
    box(root, 1.04, 0.052, 0.48, paint.board, 0, 0.38, 0);
    for (let i = 0; i < 7; i++) {
      const x = (i - 3) * 0.154;
      const color = i % 2 ? paint.paper : paint.coral;
      const awning = box(root, 0.156, 0.036, 0.57, color, x, 0.78, -0.09);
      awning.rotation.x = 0.32;
      xy(root, [[-0.077, 0], [0.077, 0], [0.077, -0.054], [0, -0.082], [-0.077, -0.054]],
        0.025, color, x, 0.70, 0.17);
    }
    for (const [x, height, color] of [[-0.26, 0.12, paint.sea], [0, 0.18, paint.coral], [0.24, 0.15, paint.teal]]) {
      cylinder(root, 0.061, 0.066, height, color, x, 0.41 + height / 2, 0.08, 8);
      cylinder(root, 0.041, 0.044, 0.045, paint.brass, x, 0.43 + height, 0.08, 8);
    }
    const sign = put(root, group(), 0, 0.79, -0.18);
    rail(sign, [0, 0, 0], [0, 0.23, 0], 0.015, paint.wood);
    xy(sign, [[0, 0.24], [0.31, 0.19], [0, 0.12]], 0.018, paint.peach);
    for (const [x, coat] of [[-0.33, paint.teal], [-0.06, paint.rose], [0.21, paint.ink]]) {
      xy(root, [[-0.065, 0], [-0.047, 0.12], [0, 0.15], [0.05, 0.12], [0.07, 0]],
        0.03, coat, x, 0.086, 0.33);
      axisCylinder(root, 0.044, 0.04, paint.paper, x, 0.264, 0.33, 8);
    }
    return complete(root, [sign], (time) => {
      sign.rotation.y = 0.28 * Math.sin(time * 1.6);
    });
  }

  function scaleStand() {
    const root = group();
    slab(root, 1.16, 0.103, 0.67, paint.wood, 0, 0, 0.0, 0.09);
    slab(root, 1.19, 0.04, 0.7, paint.peach, 0, 0.105, 0.0, 0.07);
    cylinder(root, 0.175, 0.222, 0.099, paint.brass, 0, 0.197, -0.061, 10);
    cylinder(root, 0.051, 0.073, 0.652, paint.rose, 0, 0.568, -0.061, 9);
    const beam = put(root, group(), 0, 0.905, -0.061);
    rail(beam, [-0.505, -0.061, 0], [-0.09, 0.056, 0], 0.037, paint.brass);
    rail(beam, [-0.09, 0.056, 0], [0.09, 0.056, 0], 0.037, paint.brass);
    rail(beam, [0.09, 0.056, 0], [0.505, -0.061, 0], 0.037, paint.brass);
    axisCylinder(beam, 0.078, 0.095, paint.rose, 0, 0.015, 0, 10);
    const pans = [];
    for (const x of [-0.439, 0.439]) {
      const pivot = put(beam, group(), x, -0.05, 0);
      for (const [px, pz] of [
        [-0.164, 0.057],
        [0.164, 0.057],
        [0, -0.15],
      ])
        rail(pivot, [0, 0, 0], [px, -0.275, pz], 0.012, paint.wood, 5);
      const pan = cylinder(pivot, 0.19, 0.112, 0.082, paint.brass, 0, -0.31, 0, 10);
      pan.scale.z = 0.84;
      for (let k = 0; k < (x < 0 ? 3 : 1); k++)
        cylinder(pivot, 0.074, 0.08, 0.029, paint.sun, 0, -0.255 + k * 0.032, 0.012, 9);
      pans.push(pivot);
    }
    for (const [x, count] of [
      [-0.35, 2],
      [0.0, 3],
      [0.31, 1],
    ])
      for (let i = 0; i < count; i++)
        cylinder(root, 0.069, 0.073, 0.026, paint.brass, x, 0.17 + i * 0.032, 0.209, 10);
    // Independently hang the pans; the beam rotates while the bottoms stay level.
    pans.forEach((part) => batch(part));
    batch(beam, pans);
    batch(root, [beam]);
    root.userData.animate = (t) => {
      const r = 0.12 * Math.sin(t * 1.48);
      beam.rotation.z = r;
      pans.forEach((p) => {
        p.rotation.z = -r;
      });
    };
    return root;
  }

  function exchange() {
    const root = group(),
      gate = put(root, group(), 0.18, 0, -0.2);
    slab(gate, 0.88, 0.12, 0.55, paint.ink, 0, 0, 0, 0.068);
    for (const x of [-0.34, 0.34]) slab(gate, 0.19, 0.54, 0.47, paint.teal, x, 0.119, 0, 0.03);
    slab(gate, 0.91, 0.23, 0.53, paint.deep, 0, 0.656, 0, 0.045);
    box(gate, 0.56, 0.142, 0.022, paint.cyan, 0, 0.77, 0.273);
    for (const [x, w] of [
      [-0.167, 0.038],
      [-0.093, 0.072],
      [0.001, 0.024],
      [0.067, 0.045],
      [0.153, 0.06],
    ])
      box(gate, w, 0.09, 0.014, paint.night, x, 0.774, 0.29);
    const belt = put(root, group(), -0.095, 0, 0.104);
    belt.rotation.y = -0.16;
    for (const x of [-0.57, 0.47])
      for (const z of [-0.22, 0.22]) box(belt, 0.05, 0.19, 0.049, paint.line, x, 0.11, z);
    slab(belt, 1.28, 0.108, 0.493, paint.ink, 0, 0.17, 0, 0.094);
    for (let i = 0; i < 10; i++) {
      const roller = cylinder(
        belt,
        0.046,
        0.046,
        0.4,
        i % 2 ? paint.glass : '#9cb5b0',
        -0.534 + i * 0.116,
        0.282,
        0,
        8,
      );
      roller.rotation.x = Math.PI / 2;
    }
    for (const z of [-0.24, 0.24]) box(belt, 1.19, 0.049, 0.033, paint.teal, 0, 0.282, z);
    const carton = packet(belt, 0.285, 0.232, 0.249, -0.26, 0.328, 0, '#d79d6a');
    packet(gate, 0.192, 0.162, 0.18, 0.21, 0.125, -0.04);
    const vane = put(gate, group(), -0.305, 0.473, 0.258);
    box(vane, 0.189, 0.045, 0.029, paint.brass, 0.081, 0, 0);
    axisCylinder(vane, 0.047, 0.031, paint.coral, 0, 0, 0.02, 8);
    return complete(root, [carton, vane], (t) => {
      carton.position.x = -0.27 + 0.23 * Math.sin(t * 1.14);
      vane.rotation.z = 0.19 + 0.42 * Math.sin(t * 1.14);
    });
  }
  function signal() {
    const root = group();
    slab(root, 1.25, 0.078, 0.78, paint.board, 0, 0, 0, 0.09);
    const cabin = put(root, group(), 0.12, 0, -0.065);
    slab(cabin, 0.58, 0.43, 0.51, paint.cyan, 0, 0.085, 0, 0.045);
    xy(
      cabin,
      [
        [-0.29, 0],
        [0, 0.21],
        [0.29, 0],
      ],
      0.502,
      paint.paper,
      0,
      0.511,
      0,
    );
    roof(cabin, 0.73, 0.28, 0.64, paint.sea, 0, 0.531, 0);
    pane(cabin, 0.173, 0.168, paint.glass, -0.128, 0.322, 0.262);
    pane(cabin, 0.118, 0.277, paint.glass, 0.119, 0.272, 0.262);
    const clock = put(cabin, group(), 0, 0.56, 0.274);
    axisCylinder(clock, 0.112, 0.045, paint.ink, 0, 0, 0);
    axisCylinder(clock, 0.087, 0.028, paint.ivory, 0, 0, 0.028, 14);
    rail(clock, [0, 0, 0.049], [0, 0.06, 0.049], 0.006, paint.deep, 4);
    rail(clock, [0, 0, 0.05], [-0.041, -0.024, 0.05], 0.006, paint.deep, 4);
    for (let i = 0; i < 7; i++) box(root, 0.069, 0.041, 0.17, paint.wood, -0.52 + i * 0.166, 0.102, 0.306);
    for (const z of [0.256, 0.358]) box(root, 1.17, 0.026, 0.023, paint.ink, 0, 0.13, z);
    const mast = put(root, group(), -0.39, 0, -0.032);
    slab(mast, 0.242, 0.098, 0.254, paint.deep, 0, 0.084, 0, 0.035);
    cylinder(mast, 0.035, 0.067, 0.905, paint.night, 0, 0.604, 0, 8);
    for (const y of [0.49, 0.64, 0.79, 0.94]) cylinder(mast, 0.05, 0.053, 0.052, paint.cyan, 0, y, 0, 8);
    const arm = put(mast, group(), 0, 0.964, 0.045);
    xy(
      arm,
      [
        [-0.08, -0.037],
        [0.304, -0.054],
        [0.337, 0],
        [0.304, 0.063],
        [-0.08, 0.045],
      ],
      0.05,
      paint.coral,
    );
    box(arm, 0.072, 0.105, 0.058, paint.white, 0.241, 0.006, 0);
    axisCylinder(arm, 0.079, 0.069, paint.night, 0, 0, 0.031, 10);
    axisCylinder(arm, 0.035, 0.022, paint.sun, 0, 0, 0.072, 10);
    return complete(root, [arm], (t) => {
      arm.rotation.z = 0.075 + 0.36 * (1 + Math.sin(t * 1.1));
    });
  }
  function bookshop() {
    const root = group();
    slab(root, 1.086, 0.089, 0.793, paint.night, 0, 0, 0, 0.068);
    slab(root, 0.885, 0.627, 0.616, paint.teal, 0, 0.094, -0.035, 0.037);
    xy(
      root,
      [
        [-0.435, 0],
        [0, 0.288],
        [0.435, 0],
      ],
      0.605,
      paint.night,
      0,
      0.716,
      -0.035,
    );
    roof(root, 1.11, 0.365, 0.796, paint.night, 0, 0.748, -0.032);
    // Two bound covers and the pale fore-edges turn the shop roof into an open book.
    roof(root, 1.1, 0.36, 0.791, paint.paper, 0, 0.778, -0.032);
    roof(root, 1.13, 0.367, 0.822, paint.sea, 0, 0.811, -0.032);
    box(root, 0.05, 0.05, 0.853, paint.night, 0, 1.163, -0.035);
    const facade = 0.286;
    box(root, 0.316, 0.358, 0.04, paint.night, 0.173, 0.348, facade);
    box(root, 0.22, 0.248, 0.025, paint.cyan, 0.169, 0.379, facade + 0.031);
    box(root, 0.078, 0.119, 0.029, paint.night, 0.17, 0.294, facade + 0.05);
    axisCylinder(root, 0.057, 0.031, paint.night, 0.17, 0.389, facade + 0.052, 9);
    pane(root, 0.256, 0.23, paint.rose, -0.195, 0.335, facade);
    ['#e5bb75', paint.lilac, paint.cyan].forEach(
      (c, i) =>
        (box(root, 0.048, 0.132 + i * 0.022, 0.024, c, -0.273 + i * 0.067, 0.303, facade + 0.05).rotation.z =
          i === 2 ? -0.2 : 0),
    );
    for (let i = 0; i < 7; i++) {
      const canvas = box(
        root,
        0.102,
        0.052,
        0.202,
        i % 2 === 0 ? paint.cyan : paint.sea,
        -0.314 + i * 0.105,
        0.552,
        0.337,
      );
      canvas.rotation.x = 0.25;
    }
    box(root, 0.044, 0.157, 0.09, paint.night, 0.005, 1.212, -0.04);
    const key = put(root, group(), 0.009, 1.306, -0.04);
    ring(key, 0.119, 0.032, paint.brass, -0.167, 0.008, 0, 12);
    box(key, 0.344, 0.048, 0.062, paint.brass, 0.107, 0.01, 0);
    box(key, 0.049, 0.095, 0.059, paint.brass, 0.259, -0.023, 0);
    box(key, 0.044, 0.074, 0.058, paint.brass, 0.188, -0.015, 0);
    return complete(root, [key], (t) => {
      key.rotation.y = 0.09 * Math.sin(t * 1.26);
    });
  }

  function van() {
    const root = group();
    // The body side is a continuous die-cut profile with a short sloped nose at +Z.
    function sideBody(points, width, color) {
      const body = xy(
        root,
        points.map(([z, y]) => [-z, y]),
        width,
        color,
      );
      body.rotation.y = Math.PI / 2;
      return body;
    }
    slab(root, 0.464, 0.069, 0.813, paint.ink, 0, 0.09, 0, 0.063);
    const lower = [
      [-0.405, 0.147],
      [-0.394, 0.288],
      [-0.355, 0.33],
      [0.206, 0.335],
      [0.37, 0.29],
      [0.425, 0.24],
      [0.425, 0.153],
    ];
    sideBody(lower, 0.464, paint.sea);
    const top = [
      [-0.347, 0.3],
      [-0.326, 0.441],
      [-0.264, 0.507],
      [0.148, 0.507],
      [0.263, 0.438],
      [0.323, 0.311],
    ];
    sideBody(top, 0.443, paint.ivory);
    for (const side of [-1, 1]) {
      function doorGlass(points) {
        const g = xy(
          root,
          points.map(([z, y]) => [-z, y]),
          0.012,
          paint.glass,
          side * 0.23,
          0,
          0,
        );
        g.rotation.y = Math.PI / 2;
      }
      doorGlass([
        [-0.265, 0.35],
        [-0.257, 0.438],
        [-0.209, 0.461],
        [-0.055, 0.461],
        [-0.055, 0.35],
      ]);
      doorGlass([
        [-0.025, 0.35],
        [-0.025, 0.461],
        [0.121, 0.461],
        [0.215, 0.426],
        [0.246, 0.35],
      ]);
      box(root, 0.012, 0.016, 0.054, paint.deep, side * 0.232, 0.314, 0.044);
      const badge = box(root, 0.014, 0.066, 0.12, paint.paper, side * 0.236, 0.219, -0.111);
      badge.rotation.x = -0.09;
      for (const [dz, dy] of [
        [-0.13, 0.229],
        [-0.106, 0.211],
      ])
        box(root, 0.017, 0.006, 0.052, paint.rose, side * 0.24, dy, dz).rotation.x = -0.09;
    }
    const windshield = box(root, 0.372, 0.132, 0.014, paint.deep, 0, 0.389, 0.3);
    windshield.rotation.x = -0.432;
    const reflection = box(root, 0.337, 0.056, 0.012, paint.glass, 0, 0.418, 0.291);
    reflection.rotation.x = -0.432;
    box(root, 0.239, 0.044, 0.02, paint.deep, 0, 0.21, 0.423);
    for (const side of [-1, 1]) {
      box(root, 0.068, 0.047, 0.017, paint.sun, side * 0.159, 0.242, 0.412);
      box(root, 0.05, 0.063, 0.016, paint.coral, side * 0.172, 0.237, -0.405);
      box(root, 0.038, 0.026, 0.053, paint.ink, side * 0.239, 0.356, 0.164);
    }
    slab(root, 0.424, 0.034, 0.07, paint.paper, 0, 0.13, 0.411, 0.022);
    for (const z of [-0.25, 0.253])
      for (const side of [-1, 1]) {
        const tire = cylinder(root, 0.104, 0.109, 0.069, paint.ink, side * 0.22, 0.108, z, 12);
        tire.rotation.z = Math.PI / 2;
        const hub = cylinder(root, 0.058, 0.058, 0.014, paint.board, side * 0.259, 0.108, z, 9);
        hub.rotation.z = Math.PI / 2;
        const cap = cylinder(root, 0.031, 0.031, 0.016, paint.ivory, side * 0.267, 0.108, z, 8);
        cap.rotation.z = Math.PI / 2;
      }
    const journal = put(root, group(), 0, 0.51, -0.066);
    journal.rotation.y = -0.045;
    slab(journal, 0.302, 0.016, 0.238, paint.deep, 0, 0, 0, 0.018);
    slab(journal, 0.292, 0.028, 0.227, paint.paper, 0, 0.015, 0, 0.018);
    slab(journal, 0.301, 0.012, 0.24, paint.plum, 0, 0.045, 0, 0.018);
    box(journal, 0.041, 0.012, 0.237, paint.lilac, -0.092, 0.06, 0);
    return complete(root);
  }

  function tree(kind = 'round', seed = 0) {
    if (kind === 'conifer' || kind === 'fir') kind = 'pine';
    if (kind === 'deciduous' || kind === 'oak') kind = 'round';
    const n = Math.abs(Math.trunc(Number(seed) || 0)) % 5,
      key = 'tree:' + kind + '/' + n;
    if (templates.has(key)) return templates.get(key).clone();
    const root = group();
    const trunk = kind === 'bloom' ? '#885d67' : '#886852';
    const cool = ['#426557', '#517b61', '#5d875e', '#547660', '#507569'];
    const warm = ['#87a35d', '#799c61', '#94ad68', '#82a972', '#8aa863'];
    const pink = ['#efaa9a', '#e49591', '#e3a5aa', '#f0b798', '#dda0a0'];
    const pick = (colors, m = 0) => colors[(Math.floor(n) + m) % colors.length];
    cylinder(root, 0.045, 0.064, 0.45, trunk, 0, 0.227, 0, 7);
    function crown(x, y, z, sx, sy, sz, color) {
      const flower = primitive(
        root,
        geom('faceted-crown', () => new T.IcosahedronGeometry(1, 0)),
        color,
        x,
        y,
        z,
      );
      flower.scale.set(sx, sy, sz);
      flower.rotation.y = n * 0.91 + x * 2;
      return flower;
    }
    if (kind === 'pine' || kind === 'snow') {
      for (let row = 0; row < 3; row++) {
        const r = 0.288 - row * 0.06,
          h = 0.397 - row * 0.042,
          y = 0.34 + row * 0.198;
        const bough = cylinder(root, 0, r, h, pick(cool, row), 0, y, 0, 6);
        bough.rotation.y = (row % 2) * 0.45 + n * 0.2;
        if (kind === 'snow') {
          const snow = cylinder(root, 0, r * 0.715, h * 0.714, '#e5f1de', 0, y + h * 0.145, 0, 6);
          snow.rotation.y = bough.rotation.y;
        }
      }
    } else if (kind === 'poplar') {
      crown(0, 0.527, 0, 0.208, 0.438, 0.175, pick(cool));
      crown(0.072, 0.66, 0.026, 0.151, 0.303, 0.131, pick(warm));
    } else if (kind === 'palm') {
      cylinder(root, 0.037, 0.054, 0.46, trunk, 0.016, 0.535, 0, 7);
      for (let i = 0; i < 6; i++) {
        const frond = put(root, group(), 0.016, 0.747, 0);
        frond.rotation.y = (i * TAU) / 6 + n * 0.19;
        const blade = xy(
          frond,
          [
            [0, 0],
            [0.17, 0.075],
            [0.35, 0.047],
            [0.464, -0.103],
            [0.25, -0.035],
            [0.105, 0.008],
          ],
          0.05,
          pick(i % 2 ? warm : cool, i),
        );
        blade.rotation.x = 0.18;
      }
    } else {
      const canopy = kind === 'bloom' ? pink : warm;
      rail(root, [0, 0.24, 0], [-0.105, 0.5, 0.012], 0.019, trunk, 6);
      crown(-0.1, 0.467, 0.023, 0.222, 0.221, 0.203, pick(canopy));
      crown(0.122, 0.504, -0.026, 0.218, 0.24, 0.188, pick(canopy, 2));
      crown(0.014, 0.635, -0.012, 0.223, 0.239, 0.223, pick(canopy, 4));
    }
    complete(root);
    templates.set(key, root);
    return root.clone();
  }
  function stationMiniature(id) {
    const g=new T.Group(), p=paint;
    slab(g,1.15,.08,.85,p.board,0,.04,0);
    const stall=(ink)=>{
      slab(g,.92,.38,.59,p.board,0,.27,0);
      for(const x of [-.43,.43]) rail(g,[x,.39,.21],[x,.9,.21],.025,p.wood);
      for(let i=0;i<7;i++){const awning=box(g,.148,.08,.82,i%2?p.ivory:ink,-.44+i*.146,.90,0);awning.rotation.x=-.16;}
    };
    if(id==='growth'||id==='voice'||id==='signal') {
      stall(id==='growth'?p.rust:id==='voice'?p.rose:p.leaf);
      for(let i=0;i<3;i++) {
        if(id==='signal'){const fruit=cylinder(g,.11,.085,.17,p.grass,-.22+i*.22,.51,.18,9);fruit.scale.y=.8;}
        else if(id==='growth'){cylinder(g,.075,.052,.14,p.ivory,-.23+i*.22,.52,.18,10);cylinder(g,.063,.063,.015,p.wood,-.23+i*.22,.59,.18,10);}
        else box(g,.145,.105,.13,p.sun,-.23+i*.22,.53,.18);
      }
    } else if(id==='want'){
      // The hood and swallowtail hem are the same cutout as the fitting-room sample.
      for(const x of [-.46,.19]) rail(g,[x,.06,-.13],[x,.96,-.13],.027,p.wood);
      rail(g,[-.49,.96,-.13],[.22,.96,-.13],.025,p.wood);
      xy(g,[[-.11,.60],[0,.77],[.11,.61],[.10,.54],[.25,.32],[.19,.25],[.13,.32],[.18,.01],[.022,.095],[-.16,.005],[-.12,.31],[-.20,.25],[-.25,.32],[-.10,.55]],.055,p.sun,-.15,.16,-.08);
      for(const x of [.07,.47]) {
        const wheel=primitive(g,geom('trial-wheel',()=>new T.TorusGeometry(.14,.022,5,16)),p.ink,x,.17,.22);
        wheel.rotation.z=.17;
      }
      for(const [x1,y1,x2,y2] of [[.07,.17,.2,.38],[.2,.38,.28,.17],[.28,.17,.07,.17],[.28,.17,.4,.37],[.4,.37,.47,.17],[.2,.38,.4,.37]])
        rail(g,[x1,y1,.22],[x2,y2,.22],.013,p.rust);
      box(g,.11,.025,.042,p.ink,.19,.405,.22);
    } else if(id==='memory'){
      box(g,1.02,.6,.12,p.ivory,0,.41,-.08);
      for(let i=0;i<5;i++)axisCylinder(g,.066,.025,[p.rust,p.leaf,p.coral][i%3],-.34+i*.17,.36+(i%2)*.17,.009,7);
    } else if(id==='context'){
      roof(g,1.15,.24,.88,p.rose,0,.93,0);
      for(const x of [-.48,.48])rail(g,[x,0,.26],[x,.92,.26],.025,p.wood);
      cylinder(g,.4,.4,.09,p.rust,0,.40,0);cylinder(g,.15,.19,.33,p.wood,0,.19,0);
      for(let i=0;i<5;i++)cylinder(g,.075,.056,.035,p.ivory,.25*Math.cos(i*1.257),.47,.25*Math.sin(i*1.257));
    } else if(id==='friction'){
      slab(g,.70,.5,.53,p.rust,0,.33,0);roof(g,1.07,.33,.8,p.slate||p.night,0,.58,0);
      for(const x of [-.42,.42]){axisCylinder(g,.12,.09,p.sun,x,.73,.3,9);box(g,.025,.12,.02,p.coral,x,.57,.33);}
    } else if(id==='spec'){
      for(const x of [-.46,.46])rail(g,[x,0,0],[x,1.02,0],.033,p.wood);
      rail(g,[-.53,.96,0],[.53,.96,0],.025,p.brass);
      for(let i=0;i<4;i++)box(g,.19,.53,.035,[p.night,p.glass,p.night,p.teal][i],-.33+i*.22,.65,0);
      cylinder(g,.22,.18,.26,p.wood,.12,.20,.20);
    } else {
      for(let i=0;i<3;i++){
        const x=-.32+i*.32,y=.5+(i%2)*.36;
        cylinder(g,.19,.13,.29,i%2?p.rust:p.sun,x,y,0,6);
        cylinder(g,.125,.085,.07,p.wood,x,y-.16,0,6);
        rail(g,[x,.10,0],[x,y-.19,0],.013,p.brass);
      }
    }
    return complete(g);
  }
  const landmarks = { growth:()=>stationMiniature('growth'), distance:camera, witness:stadium, want:()=>stationMiniature('want'),
    voice:()=>stationMiniature('voice'), memory:()=>stationMiniature('memory'), persona:bottleStall, context:()=>stationMiniature('context'),
    friction:()=>stationMiniature('friction'), signal:()=>stationMiniature('signal'),spec:()=>stationMiniature('spec'),permission:()=>stationMiniature('permission') };
  function landmark(id) {
    const make = landmarks[id];
    if (!make) throw new RangeError('Unknown map landmark: ' + id);
    const model = make();
    model.name = 'Press island: ' + id;
    return model;
  }
  window.AtlasMapModels = { landmark, van, tree };
})();
