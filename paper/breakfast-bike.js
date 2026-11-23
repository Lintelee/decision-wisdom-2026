/* The first test delivery. Wheels, cup, paper sleeve and bell keep their own pivots. */
(() => {
  'use strict';
  const K = window.PaperKit;
  const T = window.THREE;
  if (!K || !T) return;
  const ink = {
    tire: '#303239',
    rim: '#c6af8c',
    spoke: '#8c8170',
    brass: '#c99e5f',
    frame: '#a54132',
    light: '#da6747',
    oxblood: '#692f32',
    metal: '#646968',
    leather: '#4b3737',
    caramel: '#ae7e55',
    straw: '#d0a36f',
    weave: '#ad784f',
    cream: '#f7e3bb',
    linen: '#ead1a8',
    broth: '#de8a24',
    stock: '#eee0bd',
  };
  const tau = Math.PI * 2;
  const pos = K.at;
  const block = (g, x, y, z, w, h, d, color) => pos(g, K.box(w, h, d, color), x, y, z);
  const patch = (g, points, z, d, color, edge) => pos(g, K.cut(points, d, color, edge), 0, 0, z);
  const pipe = (g, a, b, r, color) => g.add(K.rod(a, b, r, color));
  const pipeRun = (g, points, radius, color) =>
    points.slice(1).forEach((point, i) => pipe(g, points[i], point, radius, color));
  const circle = (g, x, y, z, r, d, col) => {
    const hub = pos(g, K.cyl(r, r, d, 20, col), x, y, z);
    hub.rotation.x = Math.PI / 2;
    return hub;
  };
  const hoop = (g, x, y, z, r, tube, color, count = 36) => {
    const o = new T.Mesh(new T.TorusGeometry(r, tube, 6, count), K.mat(color));
    return pos(g, o, x, y, z);
  };
  const horizontalHoop = (g, x, y, z, r, tube, color, count = 24) => {
    const o = hoop(g, x, y, z, r, tube, color, count);
    o.rotation.x = Math.PI / 2;
    return o;
  };

  // Print adjoining colours onto one sheet per rigid part, keeping picking and mobile rendering inexpensive.
  let printedMaterial;
  function press(group) {
    const vertices = [],
      normals = [],
      uvs = [],
      colors = [];
    const p = new T.Vector3(),
      n = new T.Vector3();
    group.updateWorldMatrix(true, true);
    const toGroup = group.matrixWorld.clone().invert();
    group.traverse((part) => {
      if (!part.isMesh) return;
      const affine = toGroup.clone().multiply(part.matrixWorld);
      const normalMatrix = new T.Matrix3().getNormalMatrix(affine);
      const geom = part.geometry,
        attr = geom.attributes;
      const count = geom.index?.count ?? attr.position.count;
      const faces = Array.isArray(part.material) ? geom.groups : [{ start: 0, count }];
      for (const face of faces) {
        const color = (Array.isArray(part.material) ? part.material[face.materialIndex] : part.material)
          .color;
        for (let k = face.start; k < face.start + face.count; k++) {
          const i = geom.index ? geom.index.getX(k) : k;
          p.fromBufferAttribute(attr.position, i).applyMatrix4(affine);
          n.fromBufferAttribute(attr.normal, i).applyNormalMatrix(normalMatrix);
          vertices.push(p.x, p.y, p.z);
          normals.push(n.x, n.y, n.z);
          uvs.push(attr.uv.getX(i), attr.uv.getY(i));
          colors.push(color.r, color.g, color.b);
        }
      }
    });
    const printed = new T.BufferGeometry();
    printed.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
    printed.setAttribute('normal', new T.Float32BufferAttribute(normals, 3));
    printed.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
    printed.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
    printed.computeBoundingSphere();
    printedMaterial ??= K.mat('#ffffff').clone();
    printedMaterial.vertexColors = true;
    const sheet = new T.Mesh(printed, printedMaterial);
    sheet.castShadow = sheet.receiveShadow = true;
    group.clear();
    group.add(sheet);
  }

  function wheel() {
    const g = K.group();
    hoop(g, 0, 0, 0, 0.435, 0.045, ink.tire, 40);
    hoop(g, 0, 0, 0.03, 0.42, 0.019, '#b19068', 40);
    hoop(g, 0, 0, 0.026, 0.397, 0.014, ink.rim, 40);
    for (let i = 0; i < 16; i++) {
      const angle = (i * tau) / 16;
      const inner = angle + (i % 2 ? 0.54 : -0.54);
      pipe(
        g,
        [0.053 * Math.cos(inner), 0.053 * Math.sin(inner), i % 2 ? 0.025 : -0.025],
        [0.393 * Math.cos(angle), 0.393 * Math.sin(angle), 0],
        0.008,
        i % 2 ? '#ac9476' : '#7a736a',
      );
    }
    circle(g, 0, 0, 0, 0.073, 0.109, ink.metal);
    circle(g, 0, 0, 0.064, 0.037, 0.018, ink.brass);
    // The almond-shaped reflector makes a slow turn legible without turning the whole wheel into a disc.
    patch(
      g,
      [
        [0.276, -0.077],
        [0.312, -0.028],
        [0.307, 0.065],
        [0.271, 0.029],
      ],
      0.019,
      0.016,
      '#d6a34d',
    );
    press(g);
    return g;
  }

  function fender(g, cx, from, to, color) {
    const points = [];
    for (const [r, start, end] of [
      [0.53, from, to],
      [0.495, to, from],
    ]) {
      for (let i = 0; i <= 19; i++) {
        const a = ((start + ((end - start) * i) / 19) * Math.PI) / 180;
        points.push([cx + r * Math.cos(a), 0.481 + r * Math.sin(a)]);
      }
    }
    patch(g, points, 0, 0.139, color, '#ba9b77');
  }

  function frame(g) {
    fender(g, -0.84, 21, 187, ink.oxblood);
    fender(g, 0.77, 16, 160, ink.frame);
    // A low sweeping down-tube and skirt guard give the delivery bicycle its step-through silhouette.
    const crank = [-0.18, 0.45, 0];
    pipe(g, [-0.84, 0.48, -0.035], [-0.35, 1.115, -0.035], 0.036, ink.oxblood);
    pipe(g, [-0.84, 0.48, 0.045], [-0.35, 1.115, 0.045], 0.029, ink.frame);
    pipe(g, [-0.84, 0.48, 0], crank, 0.036, ink.oxblood);
    pipe(g, crank, [-0.39, 1.178, 0], 0.056, ink.frame);
    patch(
      g,
      [
        [-0.196, 0.434],
        [-0.131, 0.547],
        [0.062, 0.595],
        [0.214, 0.718],
        [0.328, 0.925],
        [0.424, 1.224],
        [0.5, 1.206],
        [0.423, 0.909],
        [0.313, 0.682],
        [0.119, 0.505],
        [-0.064, 0.452],
      ],
      0,
      0.085,
      ink.frame,
      ink.light,
    );
    pipeRun(
      g,
      [
        [-0.118, 0.522, 0.046],
        [0.074, 0.579, 0.046],
        [0.239, 0.728, 0.046],
        [0.345, 0.933, 0.046],
      ],
      0.0085,
      '#f3bb76',
    );
    pipeRun(
      g,
      [
        [-0.29, 0.799, -0.025],
        [-0.04, 0.77, -0.025],
        [0.189, 0.826, -0.025],
        [0.406, 1.095, -0.025],
      ],
      0.026,
      ink.light,
    );
    // Separate front and back blades leave a real fork around the front hub.
    for (const z of [-0.071, 0.071]) {
      pipeRun(
        g,
        [
          [0.491, 1.068, z],
          [0.566, 0.797, z],
          [0.664, 0.581, z],
          [0.77, 0.481, z],
        ],
        0.036,
        z > 0 ? ink.frame : ink.oxblood,
      );
    }
    pipe(g, [0.495, 1.055, 0], [0.414, 1.32, 0], 0.068, ink.frame);
    pipe(g, [0.455, 1.171, 0], [0.44, 1.227, 0], 0.071, ink.linen);
    circle(g, 0.444, 1.206, 0.063, 0.033, 0.012, ink.brass);
    for (const z of [-0.065, 0.065]) {
      pipe(g, [-1.08, 0.909, z], [-0.84, 0.481, z], 0.013, ink.metal);
      pipe(g, [0.77, 0.481, z], [1.13, 0.826, z], 0.012, ink.metal);
    }
    // The painted chaincase and metal eyelets are printed on opposite layers of stock.
    patch(
      g,
      [
        [-0.902, 0.425],
        [-0.9, 0.527],
        [-0.806, 0.56],
        [-0.21, 0.587],
        [-0.114, 0.563],
        [-0.047, 0.487],
        [-0.069, 0.41],
        [-0.146, 0.36],
        [-0.274, 0.363],
      ],
      0.083,
      0.047,
      ink.linen,
      '#927256',
    );
    patch(
      g,
      [
        [-0.862, 0.502],
        [-0.822, 0.53],
        [-0.246, 0.546],
        [-0.177, 0.526],
        [-0.278, 0.515],
      ],
      0.112,
      0.008,
      ink.frame,
    );
    circle(g, -0.177, 0.468, 0.12, 0.074, 0.025, ink.metal);
    circle(g, -0.838, 0.481, 0.118, 0.027, 0.019, ink.brass);
    pipe(g, [-0.17, 0.465, 0.142], [-0.035, 0.334, 0.154], 0.019, ink.brass);
    block(g, -0.031, 0.329, 0.175, 0.119, 0.036, 0.079, ink.leather);
    pipe(g, [-0.18, 0.46, -0.054], [-0.327, 0.599, -0.096], 0.018, ink.spoke);
    block(g, -0.34, 0.598, -0.107, 0.107, 0.034, 0.074, ink.tire);
    // Full-width saddle, handlebar, rack and kickstand also read when the book is rotated.
    pipe(g, [-0.373, 1.132, 0], [-0.444, 1.319, 0], 0.03, ink.metal);
    for (const x of [-0.42, -0.52]) pos(g, K.cyl(0.032, 0.025, 0.065, 8, ink.brass), x, 1.289, 0.056);
    patch(
      g,
      [
        [-0.657, 1.323],
        [-0.605, 1.382],
        [-0.463, 1.39],
        [-0.355, 1.354],
        [-0.235, 1.343],
        [-0.225, 1.304],
        [-0.38, 1.286],
        [-0.564, 1.292],
      ],
      0,
      0.244,
      ink.leather,
      '#a07657',
    );
    patch(
      g,
      [
        [-0.622, 1.338],
        [-0.557, 1.348],
        [-0.468, 1.35],
        [-0.535, 1.337],
      ],
      0.127,
      0.008,
      ink.caramel,
    );
    for (const x of [-0.58, -0.51]) circle(g, x, 1.316, 0.13, 0.009, 0.012, ink.brass);
    for (const z of [-0.1, 0.1]) {
      pipe(g, [-1.217, 1.062, z], [-0.555, 1.052, z], 0.019, ink.metal);
      pipe(g, [-1.158, 1.057, z], [-0.84, 0.479, z], 0.016, ink.metal);
      pipe(g, [-0.702, 1.053, z], [-0.84, 0.479, z], 0.013, ink.spoke);
    }
    for (const z of [-0.074, 0, 0.074]) block(g, -0.884, 1.071, z, 0.665, 0.035, 0.055, ink.caramel);
    block(g, -1.226, 1.043, 0, 0.04, 0.075, 0.158, ink.tire);
    block(g, -1.25, 1.044, 0, 0.022, 0.049, 0.11, '#c04432');
    pipe(g, [-0.37, 0.451, -0.035], [-0.483, 0.015, -0.18], 0.016, ink.metal);
  }
  function handlebars(g) {
    pipeRun(
      g,
      [
        [0.414, 1.3, 0],
        [0.384, 1.451, 0],
        [0.432, 1.503, 0],
      ],
      0.029,
      ink.metal,
    );
    for (const z of [-0.22, 0.22]) {
      pipeRun(
        g,
        [
          [0.432, 1.503, 0],
          [0.449, 1.542, z * 0.65],
          [0.397, 1.566, z],
          [0.246, 1.558, z],
        ],
        0.022,
        ink.rim,
      );
      pipe(g, [0.229, 1.558, z], [0.335, 1.563, z], 0.032, ink.leather);
    }
    pipeRun(
      g,
      [
        [0.333, 1.55, 0.212],
        [0.293, 1.443, 0.151],
        [0.314, 1.31, 0.104],
        [0.479, 1.198, 0.074],
        [0.572, 0.963, 0.075],
      ],
      0.0085,
      ink.tire,
    );
    // The front hub carries a little dynamo lamp.
    const lamp = pos(g, K.cyl(0.072, 0.047, 0.107, 12, ink.metal), 0.625, 1.123, 0);
    lamp.rotation.z = -Math.PI / 2;
    const lens = pos(g, K.cyl(0.064, 0.064, 0.014, 12, ink.cream), 0.684, 1.123, 0);
    lens.rotation.z = -Math.PI / 2;
  }

  function basket(g) {
    const cx = 1.025;
    const baseY = 1.165,
      lipY = 1.49;
    pipeRun(
      g,
      [
        [0.77, 0.483, 0.082],
        [1.06, 1.132, 0.076],
        [1.286, 1.159, 0.075],
      ],
      0.024,
      ink.metal,
    );
    pipe(g, [0.504, 1.16, -0.09], [0.81, 1.268, -0.135], 0.025, ink.metal);
    block(g, cx, baseY, 0.021, 0.786, 0.046, 0.397, '#aa7954');
    const ring = (y) => {
      const t = (y - baseY) / (lipY - baseY);
      const x = 0.371 + 0.135 * t,
        z = 0.182 + 0.1 * t;
      return [
        [cx - x + 0.064, y, -z],
        [cx + x - 0.068, y, -z],
        [cx + x, y, -z + 0.06],
        [cx + x, y, z - 0.06],
        [cx + x - 0.061, y, z],
        [cx - x + 0.062, y, z],
        [cx - x, y, z - 0.074],
        [cx - x, y, -z + 0.061],
      ];
    };
    // Alternating broad wicker strips leave the handles and envelope visible through the weave.
    for (const side of [-1, 1]) {
      for (let i = 0; i <= 7; i++) {
        const u = (i / 7) * 2 - 1;
        const a = [cx + u * 0.329, baseY + 0.01, side * 0.179];
        const b = [cx + u * 0.454, lipY, side * 0.279];
        pipe(g, a, b, 0.023, i % 2 ? ink.weave : ink.straw);
      }
      for (let i = 0; i < 4; i++) {
        const u = (i / 3) * 2 - 1;
        pipe(
          g,
          [cx + side * 0.367, baseY, u * 0.137],
          [cx + side * 0.504, lipY, u * 0.225],
          0.021,
          ink.weave,
        );
      }
    }
    for (const [index, y] of [baseY + 0.046, baseY + 0.138, baseY + 0.232, lipY].entries()) {
      const points = ring(y);
      const col = index === 3 ? '#edc38f' : index === 1 ? '#c48e5c' : '#bf8f64';
      pipeRun(g, [...points, points[0]], index === 3 ? 0.032 : 0.022, col);
    }
    block(g, 0.843, 1.282, 0.226, 0.114, 0.072, 0.02, '#966648');
    circle(g, 0.843, 1.282, 0.245, 0.017, 0.012, ink.brass);
  }

  function bellModel() {
    const g = K.group();
    pos(g, K.cyl(0.061, 0.058, 0.026, 14, ink.leather), 0, -0.032, 0);
    pos(g, K.cyl(0.081, 0.072, 0.021, 14, ink.brass), 0, -0.012, 0);
    pos(g, K.cyl(0.058, 0.082, 0.046, 14, '#deb567'), 0, 0.017, 0);
    pos(g, K.cyl(0.022, 0.058, 0.022, 14, '#f4d997'), 0, 0.05, 0);
    pos(g, K.cyl(0.013, 0.017, 0.015, 10, ink.metal), 0, 0.069, 0);
    pipe(g, [-0.042, -0.014, 0.025], [-0.105, -0.002, 0.072], 0.011, ink.metal);
    block(g, -0.107, 0.004, 0.071, 0.042, 0.023, 0.033, ink.leather);
    press(g);
    return g;
  }

  function cupModel() {
    const g = K.group();
    pos(g, K.cyl(0.258, 0.18, 0.47, 22, ink.cream), 0, 0.235, 0);
    pos(g, K.cyl(0.257, 0.252, 0.023, 22, '#c78b63'), 0, 0.449, 0);
    pos(g, K.cyl(0.246, 0.244, 0.01, 24, '#b45924'), 0, 0.474, 0);
    pos(g, K.cyl(0.229, 0.228, 0.008, 24, ink.broth), 0, 0.482, 0);
    horizontalHoop(g, 0, 0.479, 0, 0.254, 0.018, ink.cream);
    for (const [x, z, r] of [
      [-0.066, -0.025, 0.046],
      [0.046, 0.049, 0.031],
    ]) {
      const onion = horizontalHoop(g, x, 0.492, z, r, 0.011, '#6f833f', 11);
      onion.scale.y = 0.72;
    }
    pos(g, K.cyl(0.038, 0.035, 0.005, 9, '#ecc06d'), 0.11, 0.488, -0.042);
    // The red band matches the other five cups on the breakfast order.
    pos(g, K.cyl(0.253, 0.248, 0.038, 22, '#ac4c36'), 0, 0.398, 0);
    pos(g, K.cyl(0.247, 0.245, 0.009, 22, '#c57652'), 0, 0.357, 0);
    press(g);
    return g;
  }

  function accordion() {
    // Each little facet alternately folds in and out around the cup. Only the height changes when lifted.
    const g = K.group(),
      slices = 24;
    const vertices = [],
      uvs = [],
      colors = [];
    function triangle(a, b, c, color) {
      const paint = new T.Color(color);
      for (const p of [a, b, c]) {
        vertices.push(...p);
        colors.push(paint.r, paint.g, paint.b);
        uvs.push(p[0] + p[2], p[1]);
      }
    }
    function point(i, top, inner = false) {
      const angle = (i * tau) / slices;
      const ridge = i % 2 === 0;
      const r = (top ? (ridge ? 0.301 : 0.256) : ridge ? 0.239 : 0.212) - (inner ? 0.012 : 0);
      return [Math.cos(angle) * r, top ? 0.355 : 0, Math.sin(angle) * r];
    }
    for (let i = 0; i < slices; i++) {
      const a = point(i, false),
        b = point(i + 1, false),
        c = point(i + 1, true),
        d = point(i, true);
      const tint = i % 2 ? '#dfb576' : '#ac7848';
      triangle(a, b, d, tint);
      triangle(b, c, d, tint);
      const inside = point(i, true, true),
        next = point(i + 1, true, true);
      triangle(d, c, inside, '#f7d69a');
      triangle(c, next, inside, '#f7d69a');
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
    geometry.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    const fold = new T.Mesh(geometry, printedMaterial);
    fold.castShadow = fold.receiveShadow = true;
    g.add(fold);
    return g;
  }

  function steamWisp() {
    const g = K.group();
    patch(
      g,
      [
        [-0.014, 0],
        [-0.03, 0.046],
        [-0.014, 0.091],
        [0.016, 0.142],
        [0.018, 0.176],
        [0.008, 0.213],
        [0.029, 0.194],
        [0.041, 0.155],
        [0.023, 0.105],
        [-0.002, 0.062],
        [-0.006, 0.027],
      ],
      0,
      0.008,
      '#fff0d5',
    );
    press(g);
    return g;
  }

  function create() {
    const root = K.group();
    const chassis = pos(root, K.group());
    frame(chassis);
    press(chassis);
    const carrier = pos(root, K.group());
    basket(carrier);
    handlebars(carrier);
    press(carrier);
    carrier.name = '試送湯杯的車籃和車把';
    const wheels = [-0.84, 0.77].map((x) => pos(root, wheel(), x, 0.481, 0));
    const bell = pos(root, bellModel(), 0.491, 1.57, 0.204);
    bell.name = '早餐車車鈴';
    // The hit group includes the cup and the visible red thumb-tab, so it is easy to catch on a small screen.
    const sleeve = pos(root, K.group(), 0.916, 1.516, 0.256);
    sleeve.name = '扶穩湯杯的紙托';
    const base = pos(sleeve, K.group(), 0, -0.162, -0.196);
    const cup = pos(base, cupModel());
    const folds = pos(base, accordion(), 0, -0.018, 0);
    const tab = pos(base, K.group(), 0, 0, 0.259);
    patch(
      tab,
      [
        [-0.104, -0.028],
        [0.104, -0.028],
        [0.091, 0.071],
        [0.067, 0.112],
        [0.035, 0.132],
        [-0.042, 0.132],
        [-0.083, 0.106],
        [-0.099, 0.072],
      ],
      0,
      0.028,
      ink.light,
      '#f0c18b',
    );
    patch(
      tab,
      [
        [-0.049, 0.044],
        [0.049, 0.044],
        [0.051, 0.054],
        [-0.051, 0.054],
      ],
      0.017,
      0.005,
      ink.oxblood,
    );
    patch(
      tab,
      [
        [-0.042, 0.069],
        [0.042, 0.069],
        [0.043, 0.079],
        [-0.043, 0.079],
      ],
      0.017,
      0.005,
      ink.oxblood,
    );
    press(tab);
    const steam = [pos(cup, steamWisp(), -0.085, 0.52, 0), pos(cup, steamWisp(), 0.066, 0.534, -0.04)];
    const splash = pos(root, K.group());
    patch(
      splash,
      [
        [0, 0],
        [0.035, 0.072],
        [0.095, 0.141],
        [0.16, 0.181],
        [0.216, 0.187],
        [0.238, 0.167],
        [0.226, 0.153],
        [0.179, 0.152],
        [0.145, 0.139],
        [0.096, 0.099],
        [0.043, 0.029],
        [0.017, -0.014],
      ],
      0,
      0.018,
      '#e3982f',
      '#f9c875',
    );
    press(splash);
    const drops = [];
    for (let i = 0; i < 4; i++) {
      const drop = pos(root, K.group());
      const size = i === 0 ? 0.068 : 0.043;
      patch(
        drop,
        [
          [-size * 0.68, 0],
          [-size * 0.55, size * 0.42],
          [-size * 0.12, size * 1.02],
          [size * 0.3, size * 1.3],
          [size * 0.58, size * 0.45],
          [size * 0.62, -size * 0.13],
          [size * 0.26, -size * 0.45],
          [-size * 0.31, -size * 0.41],
        ],
        0,
        0.023,
        i % 2 ? '#e6a33b' : '#dd7b22',
        '#f2bc69',
      );
      press(drop);
      drops.push(drop);
    }
    const state = { support: 0, tilt: 0, spin: 0, spill: 0, time: 0, load: 1 };
    function set(values = {}) {
      Object.assign(state, values);
      const support = Math.min(1, Math.max(0, state.support));
      const height = 0.15 + support * 0.99;
      folds.scale.y = height;
      tab.position.y = height * 0.355 - 0.031;
      tab.position.z = 0.239 + 0.046 * height;
      tab.rotation.x = (1 - support) * 0.24 - 0.08;
      cup.rotation.z = state.tilt;
      cup.position.set(0, (1 - state.load) * 0.48, 0);
      for (const w of wheels) w.rotation.z = state.spin;
      steam.forEach((p, i) => {
        const t = (state.time * 0.47 + i * 0.54) % 1;
        p.position.y = 0.5 + 0.104 * t;
        p.position.x = (i ? 0.075 : -0.074) + Math.sin(t * 4 + i) * 0.021;
        p.scale.setScalar((i ? 0.68 : 0.9) * (0.45 + 0.55 * Math.sin(t * Math.PI)));
      });
      const s = Math.sin(state.tilt),
        c = Math.cos(state.tilt);
      const lipX = 0.916 + 0.21 * c - 0.472 * s,
        lipY = 1.354 + 0.21 * s + 0.472 * c;
      const burst = Math.sin(Math.PI * Math.min(1, Math.max(0, state.spill) / 0.72));
      splash.visible = burst > 0.02;
      splash.position.set(lipX, lipY, 0.14);
      splash.scale.set(burst * 1.17, burst * 1.13, 1);
      drops.forEach((p, i) => {
        const t = (state.spill - i * 0.075) * 1.46;
        p.visible = t > 0 && t < 1 && state.spill < 1;
        if (!p.visible) return;
        p.position.set(
          lipX + (1.35 + i * 0.018 - lipX) * t + (0.28 + i * 0.019) * Math.sin(t * Math.PI),
          lipY + (1.385 - lipY) * t + (0.98 + i * 0.095) * t * (1 - t),
          0.14 + (0.275 + i * 0.009) * t,
        );
        p.rotation.z = 0.97 - 2.05 * t;
      });
    }
    set();
    return { root, sleeve, cup, basket: carrier, bell, set };
  }
  window.BreakfastBike = Object.freeze({ create });
})();
