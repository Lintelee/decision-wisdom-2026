/* Folded paper construction primitives. All figures stand on y=0 and face +Z. */
(() => {
  'use strict';
  const T = window.THREE;
  const materials = new Map();
  const solids = new Map();
  const labels = new Map();
  const tau = Math.PI * 2;

  function random(seed) {
    let n = seed >>> 0 || 1;
    return () => (n = (Math.imul(n, 1664525) + 1013904223) >>> 0) / 4294967296;
  }

  // A single seamless sheet of warm mould-made stock shared by all pieces.
  const grain = (() => {
    const size = 128,
      bytes = new Uint8Array(size * size * 4),
      rand = random(73462);
    for (let i = 0; i < bytes.length; i += 4) {
      const light = 246 + Math.floor(9 * rand());
      bytes.set([light, light, light - 1, 255], i);
    }
    for (let i = 0; i < 115; i++) {
      const x = Math.floor(rand() * size),
        y = Math.floor(rand() * size);
      const dx = rand() > 0.5 ? 1 : -1,
        len = 2 + Math.floor(rand() * 4);
      const v = rand() > 0.45 ? 238 : 254;
      for (let t = 0; t < len; t++) {
        const k = 4 * (((y + Math.floor(t * 0.36)) % size) * size + ((size + x + dx * t) % size));
        bytes.set([v, v, v - 1, 255], k);
      }
    }
    const tex = new T.DataTexture(bytes, size, size);
    tex.wrapS = tex.wrapT = T.RepeatWrapping;
    tex.magFilter = T.LinearFilter;
    tex.minFilter = T.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.colorSpace = T.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  })();

  function tint(color, target, amount) {
    return '#' + new T.Color(color).lerp(new T.Color(target), amount).getHexString();
  }
  function mat(color = '#f4e3ba') {
    const key = new T.Color(color).getHex();
    if (!materials.has(key)) {
      materials.set(
        key,
        new T.MeshLambertMaterial({
          color: key,
          map: grain,
          side: T.DoubleSide,
          flatShading: true,
          polygonOffset: false,
        }),
      );
    }
    return materials.get(key);
  }
  function geo(key, make) {
    if (!solids.has(key)) solids.set(key, make());
    return solids.get(key);
  }
  function mesh(geometry, material) {
    const obj = new T.Mesh(geometry, material);
    obj.castShadow = true;
    obj.receiveShadow = true;
    return obj;
  }
  function group() {
    return new T.Group();
  }
  function at(parent, obj, x = 0, y = 0, z = 0, ry = 0) {
    obj.position.set(x, y, z);
    obj.rotation.y = ry;
    parent.add(obj);
    return obj;
  }
  function box(w, h, d, color) {
    return mesh(
      geo('box:' + [w, h, d], () => new T.BoxGeometry(w, h, d)),
      mat(color),
    );
  }
  function cyl(top, bottom, height, sides, color) {
    return mesh(
      geo('cyl:' + [top, bottom, height, sides], () => new T.CylinderGeometry(top, bottom, height, sides)),
      mat(color),
    );
  }
  function cut(points, depth, color, edgeColor) {
    const geometry = geo('cut:' + depth + ':' + JSON.stringify(points), () => {
      const shape = new T.Shape(points.map(([x, y]) => new T.Vector2(x, y)));
      shape.closePath();
      return new T.ExtrudeGeometry(shape, {
        depth: depth,
        bevelEnabled: false,
        curveSegments: 1,
        steps: 1,
      }).translate(0, 0, -depth / 2);
    });
    return mesh(geometry, [mat(color), mat(edgeColor ?? tint(color, '#ebd8ae', 0.32))]);
  }
  function rod(a, b, r, color) {
    const start = new T.Vector3(...a),
      end = new T.Vector3(...b),
      dir = end.clone().sub(start);
    const obj = cyl(r, r, Math.max(0.00001, dir.length()), 6, color);
    obj.position.copy(start).add(end).multiplyScalar(0.5);
    obj.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize());
    return obj;
  }
  function label(text, width, height, options = {}) {
    const { ink = '#263b35', paper = '#f4e5c4', size } = options;
    const key = JSON.stringify([text, width, height, ink, paper, size]);
    if (!labels.has(key)) {
      const cnv = document.createElement('canvas');
      const ratio = Math.max(0.1, width / height);
      cnv.width = Math.min(2048, Math.round(180 * Math.max(1, ratio)));
      cnv.height = Math.max(32, Math.round(cnv.width / ratio));
      const ctx = cnv.getContext('2d');
      if (paper && paper !== 'transparent' && paper !== 'none') {
        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, cnv.width, cnv.height);
      }
      const lines = String(text).split('\n');
      let px = Math.min(
        (cnv.height * 0.75) / lines.length,
        Number(size) > 2 ? Number(size) : cnv.height * (Number(size) || 0.74),
      );
      const setFont = () => {
        ctx.font = '600 ' + px + 'px "Songti TC","Noto Serif TC","PingFang TC",Georgia,serif';
      };
      setFont();
      const widest = Math.max(1, ...lines.map((line) => ctx.measureText(line).width));
      px *= Math.min(1, (cnv.width * 0.89) / widest);
      setFont();
      ctx.fillStyle = ink;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      lines.forEach((line, i) =>
        ctx.fillText(line, cnv.width * 0.5, cnv.height * 0.5 + (i - (lines.length - 1) * 0.5) * px * 1.16),
      );
      const map = new T.CanvasTexture(cnv);
      map.colorSpace = T.SRGBColorSpace;
      map.anisotropy = 4;
      labels.set(
        key,
        new T.MeshBasicMaterial({
          map,
          transparent: true,
          side: T.FrontSide,
          alphaTest: 0.08,
          depthWrite: false,
          toneMapped: false,
        }),
      );
    }
    const obj = new T.Mesh(
      geo('label:' + [width, height], () => new T.PlaneGeometry(width, height)),
      labels.get(key),
    );
    obj.renderOrder = 2;
    return obj;
  }
  function part(root, points, color, z = 0, depth = 0.026, edge) {
    return at(root, cut(points, depth, color, edge), 0, 0, z);
  }
  function disc(root, x, y, z, rx, ry, color, sides = 16) {
    const obj = mesh(
      geo('ink:' + sides, () => new T.CircleGeometry(1, sides)),
      mat(color),
    );
    obj.castShadow = false;
    at(root, obj, x, y, z);
    obj.scale.set(rx, ry, 1);
    return obj;
  }

  // A finished cut-paper figure is rigid. Print its face and edge colours on
  // one mesh so a crowd of commuters or a grove costs one draw per figure.
  const printedStock = new T.MeshLambertMaterial({
    color: 0xffffff,
    map: grain,
    vertexColors: true,
    side: T.DoubleSide,
    flatShading: true,
  });
  function assembled(root, key) {
    const geometry = geo('assembled:' + key, () => {
      root.updateMatrixWorld(true);
      const inverse = root.matrixWorld.clone().invert();
      const points = [],
        normals = [],
        paperUVs = [],
        inks = [];
      const point = new T.Vector3(),
        normal = new T.Vector3();
      root.traverse((piece) => {
        if (!piece.isMesh) return;
        const transform = inverse.clone().multiply(piece.matrixWorld);
        const normalTransform = new T.Matrix3().getNormalMatrix(transform);
        const surface = piece.geometry,
          attrs = surface.attributes;
        const count = surface.index?.count ?? attrs.position.count;
        const sections = Array.isArray(piece.material) ? surface.groups : [{ start: 0, count }];
        for (const section of sections) {
          const ink = (Array.isArray(piece.material) ? piece.material[section.materialIndex] : piece.material)
            .color;
          for (let k = section.start; k < section.start + section.count; k++) {
            const i = surface.index ? surface.index.getX(k) : k;
            point.fromBufferAttribute(attrs.position, i).applyMatrix4(transform);
            normal.fromBufferAttribute(attrs.normal, i).applyNormalMatrix(normalTransform);
            points.push(point.x, point.y, point.z);
            normals.push(normal.x, normal.y, normal.z);
            paperUVs.push(attrs.uv.getX(i), attrs.uv.getY(i));
            inks.push(ink.r, ink.g, ink.b);
          }
        }
      });
      const output = new T.BufferGeometry();
      output.setAttribute('position', new T.Float32BufferAttribute(points, 3));
      output.setAttribute('normal', new T.Float32BufferAttribute(normals, 3));
      output.setAttribute('uv', new T.Float32BufferAttribute(paperUVs, 2));
      output.setAttribute('color', new T.Float32BufferAttribute(inks, 3));
      output.computeBoundingSphere();
      return output;
    });
    root.clear();
    root.add(mesh(geometry, printedStock));
    return root;
  }

  // Two cut halves share a scored central spine. An actual angle catches the
  // moving light even when the reader turns the book to see a tree edge-on.
  function folded(root, left, right, creaseZ, angle, dark, light) {
    for (const [side, points, col] of [
      [-1, left, light],
      [1, right, dark],
    ]) {
      at(root, cut(points, 0.026, col), 0, 0, creaseZ, side * angle);
    }
  }
  function tree(type, height, seed = 1) {
    const root = group(),
      rand = random(seed * 3583 + 13);
    const trunk = '#846c4c';
    const pair =
      type === 'round'
        ? ['#638560', '#9cab73']
        : type === 'cypress'
          ? ['#466b60', '#83a081']
          : ['#416e60', '#78937a'];
    const tone = rand() * 0.18;
    const dark = tint(pair[0], '#877951', tone),
      light = tint(pair[1], '#b4b98b', tone);
    at(root, cyl(0.026, 0.04, 0.32, 5, trunk), 0, 0.16, -0.008);
    if (type === 'round') {
      root.add(rod([0, 0.18, 0], [-0.13, 0.45, 0], 0.015, trunk));
      root.add(rod([0.005, 0.19, 0], [0.16, 0.46, 0], 0.013, trunk));
    }
    const profile =
      type === 'round'
        ? [
            [0, 0.24],
            [-0.15, 0.29],
            [-0.27, 0.41],
            [-0.32, 0.52],
            [-0.31, 0.64],
            [-0.26, 0.68],
            [-0.24, 0.8],
            [-0.17, 0.89],
            [-0.13, 0.89],
            [-0.08, 0.97],
            [0, 1],
          ]
        : type === 'cypress'
          ? [
              [0, 0.17],
              [-0.071, 0.19],
              [-0.14, 0.3],
              [-0.15, 0.45],
              [-0.126, 0.52],
              [-0.129, 0.6],
              [-0.088, 0.76],
              [-0.081, 0.79],
              [0, 1],
            ]
          : [
              [0, 0.19],
              [-0.32, 0.23],
              [-0.19, 0.43],
              [-0.245, 0.41],
              [-0.132, 0.6],
              [-0.186, 0.57],
              [-0.075, 0.77],
              [-0.115, 0.75],
              [0, 1],
            ];
    const right = profile.map(([x, y], i) => [
      -x * (i % 2 ? 0.93 : 1.03),
      y + (i && i < profile.length - 1 ? 0.013 : 0),
    ]);
    folded(root, profile, right, 0.036, 0.49, dark, light);
    // This third leaf folds strictly behind the central ridge and is seen side-on.
    const back = at(root, cut(profile, 0.02, dark), 0, 0, 0.028, -1.49);
    back.scale.x = 0.84;
    root.scale.setScalar(height);
    return assembled(root, 'tree:' + type + ':' + seed);
  }
  function grass(scale = 1) {
    const root = group();
    const blade = [
      [-0.17, 0],
      [-0.27, 0.24],
      [-0.12, 0.12],
      [-0.13, 0.35],
      [-0.012, 0.12],
      [0.048, 0.37],
      [0.088, 0.13],
      [0.23, 0.26],
      [0.13, 0],
    ];
    part(root, blade, '#74946b', -0.012, 0.012);
    const front = part(
      root,
      [
        [-0.12, 0],
        [-0.2, 0.19],
        [-0.067, 0.085],
        [0.004, 0.25],
        [0.045, 0.066],
        [0.167, 0.18],
        [0.102, 0],
      ],
      '#416e59',
      0.012,
      0.014,
    );
    front.rotation.y = -0.4;
    root.scale.setScalar(scale);
    return assembled(root, 'grass');
  }
  function rock(scale = 1) {
    const root = group();
    part(
      root,
      [
        [-0.22, 0],
        [-0.26, 0.055],
        [-0.15, 0.18],
        [-0.035, 0.22],
        [0.12, 0.17],
        [0.23, 0.055],
        [0.17, 0],
      ],
      '#a9aa8d',
      0,
      0.17,
    );
    part(
      root,
      [
        [-0.15, 0.18],
        [-0.035, 0.22],
        [0.12, 0.17],
        [0.06, 0.09],
        [-0.09, 0.12],
      ],
      '#c2bca1',
      0.087,
      0.006,
    );
    part(
      root,
      [
        [0.06, 0.09],
        [0.12, 0.17],
        [0.23, 0.055],
        [0.17, 0],
        [0.085, 0.015],
      ],
      '#858c79',
      0.087,
      0.006,
    );
    root.scale.setScalar(scale);
    return assembled(root, 'rock');
  }
  function cloud(w = 1.2) {
    const root = group(),
      wire = '#c3b897';
    root.add(rod([0, 0, 0], [-0.073, 2.41, -0.03], 0.012, wire));
    const top = at(root, group(), -0.073, 2.35, 0);
    part(
      top,
      [
        [-0.5, 0],
        [-0.5, 0.043],
        [-0.44, 0.085],
        [-0.4, 0.091],
        [-0.38, 0.157],
        [-0.3, 0.175],
        [-0.24, 0.16],
        [-0.19, 0.245],
        [-0.115, 0.283],
        [-0.022, 0.27],
        [0.029, 0.213],
        [0.12, 0.24],
        [0.196, 0.219],
        [0.224, 0.161],
        [0.29, 0.164],
        [0.348, 0.124],
        [0.365, 0.09],
        [0.445, 0.078],
        [0.5, 0.022],
        [0.477, 0],
      ],
      '#f4e8c9',
      0,
      0.026,
    );
    part(
      top,
      [
        [-0.49, 0.006],
        [-0.25, 0.029],
        [-0.1, 0.023],
        [0.115, 0.055],
        [0.33, 0.06],
        [0.48, 0.014],
        [0.477, 0],
      ],
      '#ddd5b7',
      0.014,
      0.004,
    );
    top.scale.setScalar(w);
    return assembled(root, 'cloud:' + w);
  }
  function sun(radius = 0.42) {
    const root = group(),
      topY = 2.65 - radius;
    root.add(rod([0, 0, 0], [0, topY, -0.04], 0.014, '#bba276'));
    const top = at(root, group(), 0, topY, 0);
    const diskPoints = Array.from({ length: 32 }, (_, i) => [
      radius * Math.cos((tau * i) / 32),
      radius * Math.sin((tau * i) / 32),
    ]);
    part(top, diskPoints, '#e4ae4c', 0, 0.038, '#f4d58b');
    for (let i = 0; i < 12; i++) {
      const a = (i * tau) / 12,
        spread = i % 3 === 0 ? 1.36 : 1.24;
      const ray = cut(
        [
          [-0.016, radius * 1.09],
          [0.014, radius * 1.09],
          [0.008, radius * spread],
          [-0.01, radius * spread],
        ],
        0.012,
        '#d7aa5f',
      );
      ray.rotation.z = -a;
      top.add(ray);
    }
    return assembled(root, 'sun:' + radius);
  }

  // Two-bit ink separations of the event's fingerprint, sunflower and portraits.
  // Decode synchronously so the printed editions also work when opened offline.
  const engravings = {
    heart: [
      144,
      115,
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABakAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaqVAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaaqqUAABAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFqVAAAlQAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABqkAAAoAAAAAAAAAGkABRAAAAAAAAAAAAAAAAAAAAAFVVUAAAAFVAAKAAAAAAAABpABaQAAAAAAAAAAAAAAAAAABq6qqqqqQAAAGgAAAAAAAAAAHgAGkAAAAAAAAAAAAAAAAAAABVUAAABVWqQAAVkAAAAAAAAAZABUAAAKVQAAAAAAAAAAAAAAAAAAAAAAAaZQABaQAAAAAAACkAaQAFAFAAAAAAAAAAAAAAAAAAAAAAAAAABQAABpAAAAAAAKACkABpAAAAAAAAAAAAAAAAABWaqpqqlQAAABZAAKQAAAAAAkAZAAqQAAAAAAAAAAAAAAAAaqqlVABVqpAAAAGkABaAAAAACQBkAFkAAAZVVUAAAAAAAAAKlUAAAAAAAFBqQAAqQAHgAAAAKAGAAUAAQAEABaUAAAAAAAAEAAAAAAAAAAAWlUABpAAUAAAAYAZAAAAaQAAAAAZAAAAAAAAAAAAVVWqZVQAAC+QAGQACgAABwBgAAAGlAAAAAAAAAAAAAAAABVqlVVVVapUAAFpAAZAB4AACQGABABpAAABVVVAAAAAAAAABaVQAAAAAAFRpQAGkAGQAdAAFAdAZAGQAAEUAVaqQAAAAAAaVQAAAAAAAAAAapAAaAABAGAAIA0BgAoABUAAAAAVqAAAAAapAAAABVWqUAAAAa4ABQACgAAAUCgHAGQAZQAAAAAAG0AAACkAABaqVZWZlqlAAAagAAQAkAAAQKAIAdAFQAAFlVVAAaAAAAAAZalAAAAAABVYAABpAAUAKAABAYAQC0AUABVVVAWqQBQAAAAapAAAAAAAAAAAKQAHgAKABQAAAkCAKAGQAVQAAAAWpAAAABqUAAABVquqlQAABqQBAACgAUAACgJAYAYAVQAAAAAAGkAAAakAABWqZZlWqqkAAFoAAQAoABA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AAAAAAAAAAABBBCRoRSkUAAAZLGRAAgABBQAAAAAAAAAAAAAAAAAAAAAAAABQRB1SQZHQAAAWVWBAUQBAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAXQQEGQAAAB0VQkUBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAShQBAAAAAAQAoEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARVqBAAAAAAAAAFABQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRBCUAAAAAAAIUABQgoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBRoAAAAAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBAEAAQAAVEAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAUJBQ4FAAFAQBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEABVqRoVAFBBkJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEFBCgoKBQBQAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAFBQFABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGBQJAFAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAABABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    ],
    flower: [
      108,
      156,
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAABUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQQABUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQQAFVAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQQAFVFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUVAFFVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVVAFEVUAAQAAAAAAAAAAAAAAAAAAAAAAAAABVVQFFVUAAAAAAAAAAAAAAAAAAAAAAAAAAAVVVVVFRVVAAAAAAAAAAAAAAAAAAAAAAAAFBVVVVVVVVVVAAAAAAAAAAAAAAAAAAAAAAAAFVVVVVVVVVVVQBAAAAAAAAAAAAAAAAAAAAAABVVVVVVVVVVVQBAAAAAAAAAAAAAAAAAAAAAABVVVVVVVVVZVUBAAAAAAAAAAAAAAAAAAAAAABVVVUVVVVZaVVFQAAAAAAAAAAAAAAAAAAAAAAVVVVVWVVZaVVVQAAAAAAAAAAAAAAAAAAAAABVVVVWVpVaalVVQABAAAAAAAAAAAAAAAAAQBVVVVVWmpVaWqVVQFRAAAAAAAAAAAAAAAAAFVVVVVVVlpVaWqVVVVVAAAAAAAAAAAAAAAAAFVVVVVVVpaVWaqlaVRZAAAAAAAAAAAAAAAAABVVVVVVaaWlWmqmpVWoAAAAAAAAAAAAAAAAAAVVVVVlWmlpWmqmpVW0AFAAAAAAAAAAAAAAAAFVVVVaqpVqW6qm5VbwAUAAAAAAAAAAAAAAAABVVVVqVpVqq67ppVvilgAAAAAAAAAAAAAAAABVVVVVVWlq//+ZlRv77QAAAAAAAAAAAAAAAAFVVVVVVlqv//+ZVV+5qAAAAAAAAAAAAAAAAABVVVVVVaq////aVW+6oAAAAAAAAAAAAAAAAABVVVVVVWr7///mmX6+kAAAAAAAAAAAAAAAAAAFVVVVVav////mqW/+gAAAAAAAAAAAAAAAAAABVVVVVqv////mqZf+gAAAAAAAAAAAAAAAAAABVWpVWqv////6qpb+QAAAAAAAAAAAAAAAAAAAVVaqlq/////+qlH+AAAAAAAAAAAAAAAAAAAAFVaqqr//////qVR4AAAAAAAAAAAAAAAAAAAAVVWqqr//////+RVZWQAAAAAAAAAAAAAAAAFVaVqqqv/////v5VVm5AAAAAAAAAAAAAAAAFVVWqqqqv////6/lVVakAAAAAAAAAAAAAAABVVVWqqqr/////6uaVWrgAAAAAAAAAAAAAAAFVVWqqqqv/////7uaVv7kaQAAAAAAAAAAAAAFVVVWqqr//////6uaq///5AAAAAAAAAAAAAAAVVVVaqr+r////+rWr//6QAAAAAAAAAAAAAAAFVVVVqr/q////6rqr/7tAAAAAAAAAAAAAAAABVVVVqqvr////6r+m/+4AAAAAAAAAAAAAAAABVWqqqq//////6v/lr/0AAAAAAAAAAAAAAAABVWqqqq//////+/+lq/wAAAAAAAAAAAAAAAAFVaqqqv//////6/+VVvgAAAAAAAAAAAAAAAAFVVqqqv//////r/uVVfAAAAAAAAAAAAAAAAAVVVqq//////6+r/uVVVQAAAAAAAAAAAAAAAFVVVqqr/////7q/+WVVVtAQAAAAAAAAAAAAAFVaWqqqq/////q/5VkVWvlAAAAAAAAAAAAAAAAGqaqqrv///+v/5qpav+kAAAAAAAAAAAAAAAABpqqqq///////1b///+oAAAAAAAAAAAAAAAABmlaqq///////lb///voAAAAAAAAAAAAAAAAFVVaqqq////79Vb////oAAAAAAAAAAAAAAAAVVVWqqv////5pWv////4AAAAAAAAAAAAAAABVVVqqr/////+Vq/////4AAAAAAAAAAAAAAAFVVWqqqq////+VW/////5AAAAAAABAAAAAAAVVVVqqqq////+Vb///q/5AAAAAAAVQAAAAAAFVVWqqqr//6/6lr//+pv+AAAABVVVVQAAAAAVVVWqpVWvqWvpqr//9f/+AAAFqVVVVVQAAAAVVVVpVVVqpWqllr//4Lr6AABaqVVVVVVQAAAFVVWlVVVapWlpqv//0Cr6QABapVVVVVVVQAAFapqVVVWqpVVmq///wBr6QAB6qqqVVVVVVVAFVqqVVWqqqWam///i4Aa/QAC6vqqlVVVVVQAAVWlVVWqqlWVWv//gdAG7QACrqqqqqUAAAAAAAGpqqqqpVaVv///gCABrgAKpqqlQBQAAAAAAALmqqqqpWpW////AAAAbgAaQBZQAAAAAAAAAAGqqv+rqapa///+AAAAbgApAAAAAAAAAAAAAAAqq/qvqqlq//74AAAArwAkAAAAAAAAAAAAAAAeqqr+mqqr/+XwAAAAa0BgAAAAAAAAAAAAAAAGqq//mWqv/gHgAAAAa0CgAAAAAAAAAAAAAAAAv/kvVaqq/ADQAAAAK0CQAAAAAAAAAAAAAAAG/0AflaakeACQAAAAK4CQAAAAAAAAAAAAAAAakAAf1WvgOACQAAAAL4GAAAAAAAAAAAAAAAAZAAAb5m+AHAAgAAAAK9GAAAAAAAAAAAAAAAAUAAArqq4ADAAQAAAAG8JAAAAAAAAAAAAAAABAAAVlGvgADQAAAAAAGtJAAAAAAAAAAAAAAAAAAAAAB9AACAAAAAAAG+YAAAAAAAAAAAAAAAAAAAAAA4AACAAAAAAAC/oAAAAAAAAAAAAAAAAAAAAAAgAABQAAAAAAC/oAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAC/0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvQAAAAAAAAAAAAAAAAAAAAAAAAAAAAVVUAABvQAAAAAAAAAAAAAAAAAAAAAAAAAAAFVVZQBqrQAAAAAAAAAAAAAAAAAAAAAAAAAAGlVqqlaqrgAAAAAAAAAAAAAAAAAAAAAAAAAAaqqqqqqqqgAAAAAAAAAAAAAAAAAAAAAAAAAClVZWuuqqqgAAAAAAAAAAAAAAAAAAAAAAAAAGVVVqq+qqqgAAAAAAAAAAAAAAAAAAAAAAAAAJVVWqr/uuqgAAAAAAAAAAAAAAAAAAAAAAAAAFVVWqr///6gAAAAAAAAAAAAAAAAAAAAAAAAAFVVarr///7gAAAAAAAAAAAAAAAAAAAAAAAAAVVVq6q/r/rgAAAAAAAAAAAAAAAAAAAAAAAABVVWq+q/qv+gAAAAAAAAAAAAAAAAAAAAAAAABVVaqur/6uboAAAAAAAAAAAAAAAAAAAAAAAAFVVq6/r/6ubkAAAAAAAAAAAAAAAAAAAAAAAAFVVrqvr/qubgAAAAAAAAAAAAAAAAAAAAAAAAFVVqqr7+pebgAAAAAAAAAAAAAAAAAAAAAAAAFVaqqW/+kKbgAAAAAAAAAAAAAAAAAAAAAAAAFVarlW/+ALbgAAAAAAAAAAAAAAAAAAAAAAAAFVrrVqr5ALrgAAAAAAAAAAAAAAAAAAAAAAAAFWvqWaqQALrgAAAAAAAAAAAAAAAAAAAAAAAABWqqVqVAVbrkAAAAAAAAAAAAAAAAAAAAAAAABaqpapVVVWrkAAAAAAAAAAAAAAAAAAAAAAAABaqVqpVVVVq0AAAAAAAAAAAAAAAAAAAAAAAABqqaVqVVVVq0AAAAAAAAAAAAAAAAAAAAAAAAAqqllWlVVVrkAAAAAAAAAAAAAAAAAAAAAAAAAamQFlpVVVr0AAAAAAAAAAAAAAAAAAAAAAAAAaVACqZVVVrkAAAAAAAAAAAAAAAAAAAAAAAAAaYAAWqVVVr0AAAAAAAAAAAAAAAAAAAAAAAAAagAAAWplVqgAAAAAAAAAAAAAAAAAAAAAAAAAaQAAAAFqVq0AAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAABUqgAAAAAAAAAAAAAAAAAAAAAAAAAJAAAAAAAFakAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAFb0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACbwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACb0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABm0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABq0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABqoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAq0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAq0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAW4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGrQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABqQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    ],
    head: [
      114,
      149,
      'AAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkAQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAARQAAAAAAUAAAAAAAAAAAAAAAAAAAFAAAAAAAAAFBQAAABVUQAAAAAAAAAAAAAAAAAAGAAAAAAQAAFAFAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAQBQpAFAAVFUEAAQAAAAAAAAAAAAAAAAAAAAAUAAAAlGFAGUBAJFFQAAAAAAAAAAAAAAAAAAAAAAAAABVLlBb0BQVdZUABAAAAAAAAAAAAAAAAAAAAAAACWblVWlCUVaVVVWQAAAAAAAAAAAAAABAAEAAAEBVblVVprlVWVVVVQAAAAAAAAAAAABQAAFUABABVVWVVVprVWqVVVaVQAAAAAAAAAAADwAAAAAABmVVVWpVlqVtlZVVqqVFAAAAAAAAAAGQAAAAVQBvlVZVVWpqVqmpVVWZVWQAAAAAAAAAFAAAAAZALflVZpVVqaWrqqalVZVaVVVUAAAAAAFUAAAAEELVVVVWVVaVpWWqqqlpVVWVVVAAAAAAAAAFQUFFLVVVVaVVlZaVaqqaqpWlZVVVAAAAAAAACWQAUGblVWVVVVVVaqqW6qrqqlVVUUQAAAAAAABBUAqRv5VrlVVVVVZaqm+uqmppVVVURAAAAAAVAAUQv1v5VWlZVVWVapqqrquqVpVVVVVQAAAAAVABQ5rlf5VVlVVVWVuq/mq6vumqVVVVFUAAAAAAERQ+6lVpVVVVVVWWuaqmq6rqqqVVVVFVAAAAAFEAQptVVZVVVVVVWqqVqqqqbqqqVVVVVVQAAAJBABQFlVlVVVVVVVVZpqqlapbZapVVVVFVUAAAGAARQH1VVVVVZVVVVVpaqqpauZVpVVVVVUUAAABAWkQWVlVVVVZVVVVVqqqq5qqVlmVVVVFAUAAAAAWVWkGpVaVVVVVVqWqpqq++qVVWlVVVJAVAAAAABFvhAVVblVVlVVqVapaq+q6lVWVVVVVAEAAAAAAGvgABVr5VVZVVWlaqqqqqlVVWVVVVVABAAAAAABfkAVVr1VVZtVWlaar6+qqVpWVVVVVABAAAAAAARFRqqqVVVZ5VaVaq6+qq+VpVVVVVVABAAAABQAEFRquuVVVW6ZqZlrq/vvupqlVVVVVQBQAAAAQAeBQeeuVVVVfpapqbqvv+qpqlVVlVVABQAAAAACpBQGqaVVVWalVVrqqrrWqlqVVVVVVQBQAAAABGQAUBaVVVVVVWlVuqpbqlqVqVVVVVUQBQAAAAABQEABVVVVVVpWVWp6pqr6ppqlVVVVVAFQAAAAAAAUAAVVFVVWllVbq5qurvpuqqVVVVVQFQAAAQBAVkAAAQAVWWlVlaqqqfr+ZqmqlVVVVVVUAAHQAAQQAAFAFVVVVVpZWaqar/pamapVVVVVVZAAHQCAUBAAFVFVVVZVZZWbvmq/qWlVpVVVVVVaAAAABAFVAABVZVVVaVZVWvbmqqqVVVmVVVVVVVAAAAAAFUAAUVZVVqlVWlqur6uqqZVVllVVVVVVAAAEAABUAAQVVVVqlVVmlur//qqlVVlVVVVVVVAABAABAUEBUVVVVVVVpWZqq//5qpVVllVVVVVVAABABABQVBkFVVVVVWpVWqm6/1qqVVllVVVVVVAAAAAABQFAQFVVVVVr5lWlVr/6qrlVVVVZVVVVAAAAAAEABBAFVVVVVpVpW5qr+/qr1blVVZVVVUAAAAAEAUAAAVVVVVZVWpa6+r/6rqqXpVVaVVVVAAAAAAEUAQRVVVVVZVmlqr6v/6rqqWVVVaVVVWQAAABkAABQVVVVVVVVlmq6qvr77qlaVWVWmVVWgAAAFQAABVVVVVVVbppWqq6/v///lZaWVVnVVVkAAAAAAABVVVVVVValpblar/6/v6lZVaVVWZVVoAAAAAAAAZVVVpVVVVpuqr+v7/vqqpVVWWlVVVoAAAAAAABpVVVlVVVVpapb+vr//7/5VtWVpVVVkABAAEABFlVVVlVVRVpqlf6///+qqpq/qVpVZVkAAAAEAAFVVVVWVValV/1vr6v/6qqpvm/VWVZWgAAAAUAABRVVVmVVulVr6vv7v6qqqpalapWVVVQAAAAEAAAABBlWZVqVVWq6v7r7qqqpV5VuulVWAAAAAAAABQAAqVVVqVVVq5v/qrqqquVpVbulVVAAAAAAAFGUAEVVVWVWlVa6/rqq72qeVpVbqlVUAAAAAAEFVVQFlVpaVmVVaa/aq6vmqaVpVaqpFUAAAAAAAAEAAGhVtVWlVVqW6qr+rWqW+pVapZBQAAAAAAAEAAAFAVZVaqlWVm2qq/qWqpv1VWpZAQAAAAAAAEAABkAVVaaq5VW+q+6v6r6m/1VWpVQUAAAAAQAAAAAQAVVrrqqZW+rq/76/7lvpWWlVRoAAAAAAAAGAAAAVW+qlVaqpvqv66u6lalWWVVVcAAAAAAABfgBRRVfpVVVaqmuu/66qqVWlWVVVVeAAAAAAFBv0CQBVaWaVVaqqq//+6qqVVVVVVVVbQAAAAAkA/0BABVVVapVWbqv///qqaVVVVVZVVWAAAAAAQAV0B0ZVVVZqVWr+v///mqaVVVVVVVVUAAAAAAAAAUW1pVVVZVVqn+v///W/uVlVVVlVVVAAAAAAAFAVkVWlVlVVVaq/r/6/Wv+ZVVVVlZVVQAAAAAAAAFQVWlVlVaWqv77/uv6rqmVVVVqqqpQAAAAABBVBQFVVZVVZW6vr///7+rrmpVVqmqqqQAAAEABBVQAFVVoVaVpuqrr//7/r7ppVVqWqqbUAAAJAABVQpAVVUFfmuqrqr//r/urpqVVqWqprkAAAEBAAVBkA9VUVqWu66+rr+b/+vplZVaWqpq5AAAAGAAEBAA9VVVZWvqu+r7/r/6bllZVWWqpptQEAAAAAEAABQVQVVVqbr7r//7/9bltZZWaqpptQAAAAAUAAAVQAAWmVVWnrq/76/9alpZVWapVWqQAAAAAEAAAAABCbrlaVrrub7qqpulqpVVapVVaVAAAAAEABQAAVSuaVWpbmqvr6qpvpqpVpaqWlaVAAQABAAFQUAFQVVVWqqqr//qqqupqlWpammlaUQAAAAAEAAEAFUFVVaqquv//aqqqq55WValWqqgQAAAAAEBAAAVVFalb9aquv/6qqpm1tVVaqqqqQAAAAAAJAAAHVVVuqbla6vv///6unlaVVqq/qvQAAAAAAFBkAHUFJFlVVW+rr///6vmlVlVqv+r5AQAAQAUAH0AAUEOClVVV+ur////+qWVl1lv6lQAAAFBQUAVQAAAEJBlVam+ur////aWWVllVblAAAAlUBQFAAAABAABQVVvlq7v//6r/qVVlVVeVAAAAQAAQEAAAAGQBhUVRbqlv//766/6VVVVVZVAAAAAAUAAGAAAFAAGVBRaqpr///+6621ZVVVZVAAAAAAAAABUAABAABVRRlW6r+//6/77+dVVVZVAAAAAAAEABUAABAAAAARWW365v////qqqVpVlVAAAAAAAAAEVAAAAAEAAAaW7//v///vqamluVpVAAAAAAABQABB0AAAAQUUZVv////+///rmqqVpVAAAAAAAAAAAAUAAAAQVUZVr3+n6//q/r6quVlVQAAEAAAAAAAAYFRAAAFFpWv6q3+//q///6uZlVQAAEAAABBAAAAVrgAAAKpVv7/////59urqvZtVQAAAAAAABAAQAVpQAQYFVVvq/72/u/++aq6++qAAAABAAAAHQAABQAAQYFVWqq/////+6/v6p/qqAAAABQAAALQQBUAEBkUFVVWr7////+uq6+WqpVAAAAAAAAAEAQBUAFB0VFVVWqr//7/+/Vm6WqWVAAAJAAAAAAAAAAAFBgVVVVWvv7/r///1lv7qWUAAAeAAAAEBAAAEFFABVVVVWv7//v///6WqqqmUAAAFAAAABQAQAZVVQBVVWVVb7//v////q1lqmlAAAAAAAAAAAQApVVXgVVlWVWr//v///+r66qmkAAAAAACQAAAAAEVVCQFW1Wqqr//////pW7/+qQAAAAAABQAAAAAAVVAAFXlaVWv/////66r2qqqAAAAAAAAAFGQAEAUGVQVbVqVWv+/////6amWVVAAAAAAAAAAFAAAFUCWlWqaplW+7+/v///uZVVUAAAAAAAABUAAAAZVAFBWVWmlquf6v////upVVUAAAAAAAABUBQAAFVBBBZVVWVauf7//////qVVQAAAAAAAAAAAAQEAAAAFtVWlaa/v3///++6qVlQAAAAAAAAAAAABUAAAABpVWqab/2r///++66VVQAAAAEAAAAAAAAAApABRVpXrlb/1f///++rqZVUAAAAUAAAAAAABQBlAABVZaVVbr5v/////r6uVUAAAAAAAAAAAACQR1AAFVppVZb/////////6aZUAAAAAAAAAAAAAARRQAVVVlVar/////////6aZUAAAAAAAAAAAAAAAAFAlQFpVW77////////6qqQAAAAAAAAAABAAAABABkBuqqaqr////////9tpQAAAAAAAAAAAAAAEBRBVAv7lpav///////++6qQAAAAAAAAAVAEAABRVQXRX6lpbr//7///////0AAAAAAAAAAVAUBQAAAAGBT61uf6///m1VVb6VQAAAAAAAAAAAAAFQAAAAAAB66+f///+AQAAAAAAAAAAAAAEAAAABQAEAAAAVG+luuv//9AAAAAAAAAAAAAAAEAAAABQBAAQAAUaqlauv6/kAAAAAAAAAAAAAAAAAAAAAUBABQWQEWpqW+r//gAAAAAAAAAAAAAAAAAAAAAFQAYABQBWtfq+quqgAAAAAAAAAAAAAAAAAAAAABQAsAAABUtaaqp9AkAAAAAAAAAAAAAAAAAAAAAAAAIAAAAB6+Wva8AUAAAAAAAAAAAAAAAAAAABAAAAEAAEBS6ub9D0AAAAAAAAAAAAAAAAAAAAAAAAAAVAAFGW0uv8DwAAAAAAAAAAAAAAAAAAAAAAAAAAFAABUFkuv9CQAAAAAAAAAAAAAAAAAAAAAAAAAAAAEABAEP5tBhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbQILhtARgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvQAAC9AAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AIEAUEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAUABAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAEAABwAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAACwAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAEBCFABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAA/UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAtAAAAAAAAAAAAAAAAAAAA=',
    ],
    bust: [
      114,
      137,
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAVAAABQAAAAAAAAAAAAAAAAAAAABVVUAAAAAAAAFFAAAAAAAAAAAAAAAAAAAAAAAABVVQEAAAAAAAVFAAAAAAAAAAAAAAAAAAAAAAAEFVWQAAAAAAQAUAAAAAAAAAAAAAAAAAAAAQBQAVGVVVAAAAABFVUAAAAAAAAAAAAAAAAAFAGVUQFVVmqkAAAAAUVZQAAABAQAAAAAAAAAAAUBKZVAFVllqQAAAQBVVZQABQFUEAAAAAAAAAABUAZVVVVWmqQAABQQVVAAFAAFURQAAAAAAAAEAFQAVBVRpBppAFVVUARFQAAWQBVWQAAAAAAAAFAVQBQAVBZVqgVWqpUAAFZQAZAABZAAAAAAAAAABQARQQFGtav5FaqqUAABVVBQAABBAAAAAAAAAABAAakZBW+q/+VqVqkAAAVFBQAAAVABAAAAAAAAAAAq1RQb+6//WlAFpUAAVABgAAAFAAAAAAAABQAAF65QBv+6/+VQAAVQBVVaVkAAAAQAEAAAAAAQFVaqpAC/+r/+kAAQAQFaqqpVAAAAAAFAAAAAAVVqbqpAb/6r/+pAAFBkFb/qqlAAAAAAAAAAAAAVa/rqWb//qv/+ulVBq5W6/6qlQAAAAAAAAAAAFVrvapKvmqq//69X/kFqq//6qqQAAAAEBAAAAAFqv/aVdqq6v//v0Wv5W7+u//6qkAAQBEBUQAABFqq+Vaqr/7///v0aa/v/////7+0ABUBRQZUAABVqq+Wq6Vv///uvkar/7///7//+1QBVFUUFUAAAZqrulb5AL//++/lq7/////7///5QGVFVUFVAAAGqr/6/4AH///r/m/qr////////+UZVVZVFQAAACqr/7/0Aa/6///m//r/////////lqlVZpFQAAAGqqv//0AW6uuv/m7/6/////////7qqmqqVUEAAFaqq/vgAFu/v6/2/////////////quqluVUEAABlqquvQAAf//6vmqq///////////6+qVvVQEAAAaqquuAAABv/+v+Wr7////////////+lXlVFAAAWqqqpAAAAb/+v+7/+//////////qv+lWlVBQAAVVqpkABVUFv//6r/////////7/6//ulVpWVUAAFRqlgFZAVVb//6b////////76////+lVZWlVAAFWqVAb0ABVVv//qv///////q+r+q//lapWmVAAFaqUBrgAQFVaqv+7///////qu76qr/lqqWqVAAABWULrQFUVVBqqqab//////+qr+qruquqqqVAAAABUuqFqlZkAalVaWv/////++r+qqqq6qqqVAAAAAUupqv/qQABUAFVb//////+r/qqqq7qqqVAAAABUaqr5aqUAABQVWmv/////+r/qqqq6qqqVAAAAFQaqqaqVUAAAAVGq//////ur/qquq7qqqVAAAAAAaquqVtAAAAAVVr/////+eb/+q+7/qqpZAAAAAAaqr5AQAAAABUb//////5Zr/6v/r/qqpkAAAABRWqrpFAAAAABVf/r////1lv/v/+v/qqqQAAAAAlW+rlUAAAAABVq6q////ml////6/+qqpEAAAAAaB+r1VAAAAABVlWa/r/+qW//////qqqpEAAAAAFAf61UAAAAABUVVa/r/+pq/////+qqqlQAAAAAAAL+lUAAAAAVVZGq6r/6mr/////6qqqlAAAAAAAABvmgAAAAFVVYaqqr/+qv/////6r6qpAAAAAAAAAFQAAAABVVQBpaqrvlr//////7/+qoAAAAAAAAAAAAAABVVVQGlaqqpa//////6qr/+gAAAAAAAAAAAAAAFVVVQFVaaqlq////7//6r/+gAAAAAAAAAAAAAAFUVVQAVZWvqq////6qq+r/qQAAAAAAAAAAAAAAFVVVQAVVWrqr////6q//qrqQAAAAAAAAAAAAAAFVVVAAAVVr//////+qv/qqrQAAAAAAAAAAAAAAFUVVQAAFVa///////qqqqqrQAAAAAAAAAAAAAAUBVVAAABVW///////+qr6mrQAAAAAAAAAAAAAAAFVUAAABVW/////////qqmvQAAAAAAAAAAAAAAABVAAAABWq//////+q+6lWvgAAAAAAAFUUAAAAARRAAAABWq///////qq6pWqVAAAAAAAFBVAAAAAQBAAAABWW/vv////qqqVWrpQAAAAAAAAEAAAAAAAAAAABVa/+v////qaaVaqpQAAAAAAAUUAAAAAABAAAABVa/+/v///6qqquuVQAAAAABVlUAAAAAAAAAAARWr/uvv////q6q6+VAAAABRar+pAAAAAAAAQAURWr/qv/////6qqmqlQAAABbr/+tAAAAAAABUBVVWr+ur/////5vlVrmQAAABav/+4AAAAAAAFVVRVa+u6r/////WvlVrlkAAAAqqqqQAAAAAAAFVVVVr666pv///paular4UAAAAZVppAAAAAAAAFVVVW/q6pUb///pVpqqv5QAAAABVAEAAAAAAAAFVVVr6vukAG///+qr+r/5UAAAAAAAEAAUAAAAAFVlW+r+6kABv////////5UAAAAAAAGQBlQAAABEamr6vr7QABb////////1UAAAAAAAGlq+VAAAFRZa/qur6QABb////////lUAAAAAAAVb/9lVAAFVVr+q6ruAABav///+///lEAAAAAAAKvpQVVURFVa/qqqrtAABqq///7//uVUAAAAAAAKsBABWVRVVr+6qqv5AABpa7////++UUAAAAAAAC0VQBWlVVWv6qqq+0AABpWq///6qpVQAAAAAAAARpVVWlVWb/+qqr6gAAFVWqv//+lWVQAAAAAAAAGqVVVRVav+6qqv7QAAFVVqr///qplAAAAAAAAAaqqVUBWr/6qqq/+AAAFVVWqv//6plAAAAAAAAAaapVQFqv+qqqq/8AAAFVVWqr/+qmkAAAAAAAAABWQAAFb++qqqv/0AAAFVEFar/6qqQAAAAAAAAAAVAAAVv/6qqq7/gAAAVQAVWr//6pAAAAAAAAAAAUAABW++qqq/7/AAAAFAAVWr//+lAAAAAAAAAAAQAAFrr/6qv+r9AAAAUABVVr+/qVAAAAAAAAAAAUAAa+//qq/+q4AAAAUAFVWr+/pVAAAAAAAAAAAUEGr//+ur/qqgAAABQAFVaaqvlUAAAAAAAAAAAVVav//66v/6qQAAABAARVVZqulAAAAAAAAAAAAVWv///r6//qZAAAAFAARVVVaulAAAAAAAAAAAAVr///+qrv/poAAAAEABVVVVWqVAAAAAAAAAAAAGqv//6qu/+pkAAAAEABRVVVVqVAAAAAAAAAAAAGm///qq//6qgAAAAAAFARAVVaUAAAAAAAAAAAACqqqqqr//6rQAAAAAAFBAARVaQAAAAAAAAAAAAAaqqqqqq/q+AAAAAAAUAAAABVQAAAAAAAAAAAAAGqqqqqr/r9AAAAAAAAAAAEAVQAAAAAAAAAAAAAAFVVVar//4AAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAG//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/+kAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAABvqQAAAAAAFEAAAAAAAAAAAAAAAAAAAAAAAAAABv+AAAAAAAFUAAAAAAAAAAAAAAAAAAAAAAAAAABukAAAAAAAFQAAAAAAAAAAAAAAAAAAAAAAAAAABqQAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAABqQAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAABqQAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAqQAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAaQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGVEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
    ],
  };
  const prints = new Map();
  function engraving(name, width, height, ink = '#343632', crop = 'full') {
    const key = name + ink;
    if (!prints.has(key)) {
      const [w, h, encoded] = engravings[name];
      const packed = atob(encoded),
        rgba = new Uint8Array(w * h * 4);
      const colour = new T.Color(ink).getHex();
      for (let i = 0; i < w * h; i++) {
        const x = i % w,
          y = Math.floor(i / w),
          d = ((h - 1 - y) * w + x) * 4;
        const v = (packed.charCodeAt(i >> 2) >> (6 - (i % 4) * 2)) & 3;
        rgba.set([(colour >> 16) & 255, (colour >> 8) & 255, colour & 255, v * 85], d);
      }
      const map = new T.DataTexture(rgba, w, h);
      map.colorSpace = T.SRGBColorSpace;
      map.magFilter = T.LinearFilter;
      map.minFilter = T.LinearMipmapLinearFilter;
      map.generateMipmaps = true;
      map.needsUpdate = true;
      prints.set(
        key,
        new T.MeshLambertMaterial({ map, side: T.FrontSide, transparent: true, depthWrite: false }),
      );
    }
    const geometry = geo('engraving:' + [width, height, crop], () => {
      const g = new T.PlaneGeometry(width, height),
        uv = g.attributes.uv;
      if (crop !== 'full') {
        for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * 0.5 + (crop === 'right' ? 0.5 : 0));
      }
      return g;
    });
    const print = new T.Mesh(geometry, prints.get(key));
    print.renderOrder = 2;
    return print;
  }
  const editions = {
    prologue: { colour: '#c5d66b', ink: '#56683a', art: 'bust', title: '序言' },
    people: { colour: '#c5d66b', ink: '#48623a', art: 'heart', title: 'People' },
    model: { colour: '#e4b8b8', ink: '#864f52', art: 'flower', title: 'Model' },
    ai: { colour: '#81c9d6', ink: '#27666f', art: 'head', title: 'A.I' },
  };
  function notebook(section) {
    const root = group(),
      stock = editions[section] || editions.prologue;
    const stand = at(root, group(), 0, 0.16, 0.05);
    stand.rotation.x = -0.42;
    for (const sign of [-1, 1]) {
      const page = at(stand, group(), 0, 0, 0, sign * 0.28);
      const xy = (points) => points.map(([x, y]) => [sign * x, y]);
      part(
        page,
        xy([
          [0, -0.04],
          [0.57, 0.014],
          [0.61, 0.07],
          [0.61, 0.69],
          [0.51, 0.74],
          [0, 0.69],
        ]),
        '#3d4e4c',
        -0.018,
        0.066,
      );
      part(
        page,
        xy([
          [0, 0],
          [0.55, 0.044],
          [0.575, 0.082],
          [0.575, 0.682],
          [0.5, 0.712],
          [0, 0.651],
        ]),
        '#cdbf9f',
        0.02,
        0.063,
      );
      part(
        page,
        xy([
          [0, 0.037],
          [0.2, 0.079],
          [0.53, 0.097],
          [0.56, 0.12],
          [0.56, 0.697],
          [0.42, 0.709],
          [0.18, 0.696],
          [0, 0.647],
        ]),
        '#f8f4e7',
        0.056,
        0.025,
      );
      if (sign < 0) {
        at(page, engraving(stock.art, 0.39, 0.39, '#454b46'), -0.277, 0.42, 0.074);
        at(page, label(stock.title, 0.4, 0.105, { ink: stock.ink, paper: 'transparent' }), -0.28, 0.165, 0.079);
      } else {
        at(page, box(0.44, 0.17, 0.013, stock.colour), 0.28, 0.527, 0.082);
        for (const x of [0.115, 0.18]) {
          const quote = part(
            page,
            [
              [0, 0],
              [0.057, 0],
              [0.057, 0.065],
              [0.031, 0.065],
              [0.065, 0.113],
              [0.044, 0.113],
              [0, 0.071],
            ],
            stock.ink,
            0.094,
            0.007,
          );
          quote.position.set(x, 0.49, 0.094);
        }
        at(page, label('手記', 0.19, 0.102, { ink: '#34483e', paper: 'transparent' }), 0.374, 0.529, 0.101);
        for (let i = 0; i < 3; i++)
          at(
            page,
            box(i === 2 ? 0.23 : 0.37, 0.017, 0.009, '#7c8275'),
            i === 2 ? 0.212 : 0.279,
            0.382 - i * 0.062,
            0.08,
          );
        at(page, box(0.152, 0.052, 0.013, stock.colour), 0.171, 0.148, 0.082);
        const tab = part(
          page,
          xy([
            [0.525, 0.642],
            [0.654, 0.642],
            [0.68, 0.609],
            [0.663, 0.554],
            [0.525, 0.554],
          ]),
          stock.colour,
          0.028,
          0.023,
        );
        tab.name = 'Section tab';
      }
    }
    at(root, box(0.14, 0.078, 0.4, '#7a6757'), 0, 0.037, -0.026);
    root.userData.notebook = true;
    root.name = '採訪手記';
    return root;
  }
  function person(coat = '#bd6d45') {
    const root = group();
    const fabricShade = tint(coat, '#493d37', 0.36),
      fabricLight = tint(coat, '#f7d6a1', 0.22);
    const skin = '#d3a078',
      hair = '#403b34',
      slacks = '#475b59',
      shoe = '#41463e';
    part(
      root,
      [
        [-0.14, 0.453],
        [0.021, 0.45],
        [-0.032, 0.269],
        [-0.071, 0.072],
        [-0.15, 0.072],
        [-0.146, 0.259],
      ],
      slacks,
      -0.026,
      0.06,
    );
    part(
      root,
      [
        [-0.025, 0.45],
        [0.11, 0.44],
        [0.138, 0.267],
        [0.155, 0.072],
        [0.075, 0.07],
        [0.02, 0.255],
      ],
      '#536763',
      0.003,
      0.06,
    );
    part(
      root,
      [
        [-0.148, 0.089],
        [-0.074, 0.088],
        [-0.067, 0.051],
        [-0.014, 0.031],
        [-0.019, 0.005],
        [-0.164, 0.007],
        [-0.17, 0.034],
      ],
      shoe,
      0,
      0.075,
    );
    part(
      root,
      [
        [0.072, 0.089],
        [0.153, 0.085],
        [0.162, 0.054],
        [0.217, 0.026],
        [0.216, 0.004],
        [0.071, 0.004],
        [0.062, 0.027],
      ],
      shoe,
      0.027,
      0.07,
    );
    // An oversized wool coat is assembled as two shaped panels and turned lapels.
    part(
      root,
      [
        [-0.084, 0.808],
        [0.041, 0.804],
        [0.139, 0.763],
        [0.13, 0.609],
        [0.181, 0.396],
        [0.136, 0.36],
        [-0.035, 0.372],
        [-0.172, 0.396],
        [-0.126, 0.597],
        [-0.145, 0.724],
      ],
      coat,
      0,
      0.087,
    );
    part(
      root,
      [
        [0.027, 0.785],
        [0.112, 0.768],
        [0.097, 0.61],
        [0.159, 0.393],
        [0.137, 0.372],
        [-0.004, 0.379],
        [0.014, 0.54],
      ],
      fabricShade,
      0.049,
      0.016,
    );
    part(
      root,
      [
        [-0.07, 0.82],
        [0.062, 0.815],
        [0.078, 0.761],
        [0.015, 0.649],
        [-0.052, 0.748],
      ],
      '#f0dfbc',
      0.062,
      0.02,
    );
    part(
      root,
      [
        [-0.132, 0.757],
        [-0.067, 0.813],
        [-0.058, 0.767],
        [-0.002, 0.642],
        [-0.083, 0.702],
        [-0.066, 0.718],
      ],
      fabricLight,
      0.075,
      0.015,
    );
    part(
      root,
      [
        [0.056, 0.808],
        [0.104, 0.777],
        [0.097, 0.735],
        [0.072, 0.732],
        [0.078, 0.713],
        [0.002, 0.646],
      ],
      fabricShade,
      0.076,
      0.015,
    );
    part(
      root,
      [
        [-0.133, 0.754],
        [-0.176, 0.692],
        [-0.223, 0.532],
        [-0.196, 0.484],
        [-0.143, 0.487],
        [-0.121, 0.57],
        [-0.076, 0.674],
      ],
      fabricLight,
      0.039,
      0.049,
    );
    part(
      root,
      [
        [-0.195, 0.493],
        [-0.148, 0.497],
        [-0.149, 0.456],
        [-0.171, 0.437],
        [-0.196, 0.452],
      ],
      skin,
      0.05,
      0.037,
    );
    part(
      root,
      [
        [0.089, 0.758],
        [0.148, 0.73],
        [0.19, 0.602],
        [0.131, 0.536],
        [0.075, 0.555],
        [0.108, 0.621],
        [0.066, 0.684],
      ],
      coat,
      0.062,
      0.046,
    );
    part(
      root,
      [
        [-0.046, 0.563],
        [0.145, 0.585],
        [0.173, 0.414],
        [-0.02, 0.392],
      ],
      '#56685a',
      0.1,
      0.032,
    );
    part(
      root,
      [
        [-0.04, 0.551],
        [0.146, 0.576],
        [0.142, 0.535],
        [-0.031, 0.506],
      ],
      '#81907b',
      0.124,
      0.012,
    );
    part(
      root,
      [
        [0.075, 0.582],
        [0.114, 0.593],
        [0.133, 0.569],
        [0.121, 0.54],
        [0.082, 0.531],
        [0.059, 0.55],
      ],
      skin,
      0.14,
      0.03,
    );
    part(
      root,
      [
        [-0.056, 0.864],
        [0.025, 0.862],
        [0.039, 0.804],
        [-0.002, 0.777],
        [-0.059, 0.81],
      ],
      skin,
      0,
      0.059,
    );
    part(
      root,
      [
        [-0.095, 0.941],
        [-0.061, 0.98],
        [0.038, 0.975],
        [0.081, 0.938],
        [0.077, 0.903],
        [0.103, 0.877],
        [0.076, 0.866],
        [0.062, 0.824],
        [0.014, 0.807],
        [-0.04, 0.824],
        [-0.084, 0.87],
      ],
      skin,
      0.016,
      0.07,
    );
    part(
      root,
      [
        [-0.105, 0.935],
        [-0.096, 0.969],
        [-0.057, 0.995],
        [0.025, 0.998],
        [0.073, 0.977],
        [0.088, 0.951],
        [0.065, 0.926],
        [0.017, 0.944],
        [-0.016, 0.923],
        [-0.042, 0.921],
        [-0.052, 0.872],
        [-0.084, 0.847],
        [-0.097, 0.88],
      ],
      hair,
      0.026,
      0.078,
    );
    part(
      root,
      [
        [-0.047, 0.888],
        [-0.035, 0.905],
        [-0.022, 0.896],
        [-0.03, 0.871],
        [-0.043, 0.873],
      ],
      '#ddac80',
      0.072,
      0.011,
    );
    part(
      root,
      [
        [0.03, 0.911],
        [0.064, 0.913],
        [0.07, 0.905],
        [0.031, 0.905],
      ],
      hair,
      0.061,
      0.008,
    );
    disc(root, 0.054, 0.892, 0.059, 0.008, 0.007, hair, 8);
    for (const y of [0.576, 0.487, 0.412]) disc(root, -0.033, y, 0.068, 0.01, 0.01, '#614f3f', 9);
    return assembled(root, 'commuter:' + coat);
  }
  window.PaperKit = Object.freeze({
    stockGrain: grain,
    group,
    assembled,
    box,
    cyl,
    cut,
    mat,
    at,
    rod,
    label,
    tree,
    grass,
    notebook,
    engraving,
    person,
    cloud,
    sun,
    rock,
  });
})();
