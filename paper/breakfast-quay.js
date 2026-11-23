/* Screen-printed cut-paper scenery for the first delivery at the morning wharf. */
(() => {
  'use strict';
  const K = window.PaperKit;
  const { at, box, cut, cyl, group, rod } = K;
  const ink = '#373443',
    wood = '#785445',
    sand = '#d9bda0';
  const saffron = '#dba23d',
    cream = '#f4e1bb',
    vermilion = '#ae4a3c';

  function piece(parent, points, color, x = 0, y = 0, z = 0, thickness = 0.03, edge) {
    return at(parent, cut(points, thickness, color, edge), x, y, z);
  }
  function plank(parent, x, y, z, width, height, depth, color) {
    return at(parent, box(width, height, depth, color), x, y, z);
  }
  function link(parent, from, to, radius, color) {
    const thread = rod(from, to, radius, color);
    parent.add(thread);
    return thread;
  }
  function circle(parent, x, y, z, radius, color) {
    const disc = at(parent, cyl(radius, radius, 0.027, 32, color), x, y, z);
    disc.rotation.x = Math.PI / 2;
    return disc;
  }
  function flat(parent, outline, y, face, depth, edge) {
    const stock = piece(
      parent,
      outline.map(([x, z]) => [x, -z]),
      face,
      0,
      y,
      0,
      depth,
      edge,
    );
    stock.rotation.x = -Math.PI / 2;
    return stock;
  }
  function press(paper, key) {
    return K.assembled ? K.assembled(paper, 'breakfast-quay-' + key) : paper;
  }

  // Each half of the quay belongs to its own leaf. The binding stays visible as the page turns.
  function shoreline(s, side) {
    const left = side < 0,
      x = side * 2.18;
    const stock = group();
    const waterEdge = left
      ? [
          [-2.23, -1.49],
          [-1.94, -1.8],
          [2.15, -1.84],
          [2.15, 0.84],
          [-1.91, 0.86],
          [-2.38, 0.48],
        ]
      : [
          [-2.15, -1.84],
          [1.49, -1.81],
          [2.19, -1.4],
          [2.35, 0.35],
          [2.07, 0.83],
          [-2.15, 0.84],
        ];
    flat(stock, waterEdge, 0.034, '#626c87', 0.045, '#b6aabd');
    // Broken horizontal reflections leave large stretches of quiet, dark water.
    for (let i = 0; i < 21; i++) {
      const col = i % 5,
        row = Math.floor(i / 5);
      const cx = -1.82 + col * 0.75 + Math.sin(i * 8.21 + side) * 0.14;
      const cz = -1.38 + row * 0.41 + Math.sin(i * 3.4) * 0.075;
      const w = 0.12 + (0.5 + 0.5 * Math.cos(i * 6.17 + col)) * 0.31;
      flat(
        stock,
        [
          [cx - w, cz],
          [cx + 0.025, cz - 0.008],
          [cx + w * 0.22, cz + 0.016],
          [cx - 0.05, cz + 0.024],
        ],
        0.064,
        i % 6 === 0 ? '#cdc0bf' : i % 3 === 0 ? '#aaacb9' : '#828ba3',
        0.004,
      );
    }
    const deck = left
      ? [
          [-2.34, 0.5],
          [-1.97, 0.26],
          [2.16, 0.26],
          [2.16, 1.98],
          [-1.93, 2.01],
          [-2.34, 1.69],
        ]
      : [
          [-2.16, 0.26],
          [1.79, 0.26],
          [2.3, 0.61],
          [2.28, 1.63],
          [1.9, 1.99],
          [-2.16, 1.98],
        ];
    flat(stock, deck, 0.11, '#ae9a91', 0.085, '#8c7772');
    // Shallow scored joints on the old stone; only the broken threshold crosses the travel lane.
    for (const [z, leftEdge, rightEdge] of [
      [0.64, -1.98, 2.1],
      [1.11, -2.13, 2.12],
      [1.63, -2.12, 2.12],
    ]) {
      flat(
        stock,
        [
          [leftEdge, z],
          [rightEdge, z + 0.009],
          [rightEdge, z + 0.016],
          [leftEdge, z + 0.012],
        ],
        0.156,
        '#9e8981',
        0.003,
      );
    }
    for (const [px, z0, z1] of [
      [-1.61, 0.65, 1.11],
      [-0.42, 1.12, 1.63],
      [0.23, 0.29, 0.63],
      [0.72, 1.64, 1.93],
      [1.51, 0.65, 1.1],
    ]) {
      flat(
        stock,
        [
          [px, z0],
          [px + 0.014, z0],
          [px + 0.035, z1],
          [px + 0.022, z1],
        ],
        0.157,
        '#a38f87',
        0.003,
      );
    }
    if (left) {
      const seam = 1.48; // local 1.48 is -0.70 on the spread.
      flat(
        stock,
        [
          [seam - 0.042, 0.255],
          [seam + 0.028, 0.255],
          [seam + 0.042, 0.9],
          [seam + 0.09, 0.97],
          [seam + 0.061, 1.42],
          [seam + 0.115, 1.58],
          [seam + 0.13, 1.99],
          [seam + 0.02, 1.99],
          [seam + 0.002, 1.62],
          [seam - 0.048, 1.48],
          [seam - 0.027, 1.02],
          [seam - 0.076, 0.93],
        ],
        0.159,
        '#514951',
        0.009,
      );
      flat(
        stock,
        [
          [seam + 0.03, 0.26],
          [seam + 0.066, 0.26],
          [seam + 0.085, 0.88],
          [seam + 0.128, 0.96],
          [seam + 0.106, 1.41],
          [seam + 0.159, 1.57],
          [seam + 0.171, 1.98],
          [seam + 0.13, 1.98],
          [seam + 0.115, 1.58],
          [seam + 0.061, 1.42],
          [seam + 0.09, 0.97],
          [seam + 0.042, 0.9],
        ],
        0.171,
        '#d8beb1',
        0.016,
        '#867471',
      );
    }
    s.place(press(stock, left ? 'west-water' : 'east-water'), x, 0);
  }

  function hills(s, side) {
    const bank = group(),
      left = side < 0;
    const distant = left
      ? [
          [-2.17, 0.15],
          [-1.96, 0.32],
          [-1.68, 0.35],
          [-1.38, 0.57],
          [-1.14, 0.54],
          [-0.92, 0.67],
          [-0.54, 0.61],
          [-0.31, 0.79],
          [-0.13, 0.85],
          [0.05, 0.79],
          [0.29, 0.95],
          [0.46, 0.94],
          [0.83, 1.09],
          [1.08, 0.98],
          [1.36, 1.01],
          [1.68, 0.76],
          [1.91, 0.8],
          [2.16, 0.69],
        ]
      : [
          [-2.16, 0.69],
          [-1.98, 0.72],
          [-1.64, 0.61],
          [-1.36, 0.67],
          [-1.02, 0.56],
          [-0.7, 0.81],
          [-0.29, 0.93],
          [-0.05, 0.85],
          [0.18, 0.98],
          [0.55, 0.87],
          [0.9, 1.02],
          [1.14, 1.0],
          [1.48, 0.84],
          [1.71, 0.71],
          [1.87, 0.76],
          [2.18, 0.52],
        ];
    const near = left
      ? [
          [-2.17, 0.12],
          [-1.82, 0.26],
          [-1.48, 0.29],
          [-1.13, 0.41],
          [-0.82, 0.37],
          [-0.44, 0.49],
          [-0.22, 0.46],
          [0.07, 0.57],
          [0.36, 0.52],
          [0.69, 0.57],
          [1.05, 0.46],
          [1.39, 0.49],
          [1.79, 0.36],
          [2.16, 0.42],
        ]
      : [
          [-2.16, 0.42],
          [-1.81, 0.36],
          [-1.43, 0.43],
          [-1.04, 0.4],
          [-0.74, 0.49],
          [-0.48, 0.48],
          [-0.15, 0.57],
          [0.14, 0.56],
          [0.46, 0.68],
          [0.83, 0.59],
          [1.15, 0.68],
          [1.46, 0.54],
          [1.86, 0.61],
          [2.18, 0.43],
        ];
    piece(
      bank,
      [[distant[0][0], 0.015], ...distant, [distant.at(-1)[0], 0.015]],
      '#ac9bad',
      0,
      0,
      -0.12,
      0.065,
      '#d4c2ce',
    );
    // Faceted slopes are printed on the far cutout in the issue's violet inks.
    for (let i = 2; i < distant.length - 1; i += 3) {
      const [x, y] = distant[i],
        [nextX, nextY] = distant[i + 1];
      piece(
        bank,
        [
          [x, y - 0.02],
          [nextX, nextY - 0.018],
          [x - 0.18, y * 0.52],
          [x - 0.32, y * 0.4],
        ],
        i % 2 ? '#988ca3' : '#a194a9',
        0,
        0,
        -0.081,
        0.006,
      );
    }
    piece(
      bank,
      [[near[0][0], 0.015], ...near, [near.at(-1)[0], 0.015]],
      '#837c95',
      0,
      0,
      0.03,
      0.059,
      '#bdb0bd',
    );
    // Low warehouses cut into the distant shoreline, with one lit window on the upper floor.
    for (const [px, width, height] of left
      ? [
          [-1.72, 0.58, 0.23],
          [-0.68, 0.65, 0.35],
          [0.26, 0.54, 0.24],
          [1.46, 0.52, 0.29],
        ]
      : [
          [-1.4, 0.69, 0.31],
          [-0.34, 0.49, 0.24],
          [0.74, 0.7, 0.34],
          [1.58, 0.42, 0.25],
        ]) {
      piece(
        bank,
        [
          [-width / 2, 0],
          [width / 2, 0],
          [width / 2, height - 0.06],
          [0.16 * width, height - 0.06],
          [0, height],
          [-width / 2, height - 0.06],
        ],
        '#67677d',
        px,
        0.02,
        0.11,
        0.052,
      );
      plank(bank, px + 0.09, 0.02 + height * 0.56, 0.142, 0.12, 0.035, 0.009, '#aa9d9c');
    }
    s.place(press(bank, left ? 'west-bank' : 'east-bank'), side * 2.18, -1.985, 0.05);
  }

  function dawn(s) {
    const sunrise = group();
    circle(sunrise, 0, 1.26, 0, 0.36, '#efb469');
    for (const a of [0.22, 0.63, 1.02, 1.56, 2.11, 2.56, 2.95]) {
      const x = Math.cos(a),
        y = Math.sin(a);
      link(
        sunrise,
        [x * 0.405, 1.26 + y * 0.405, -0.018],
        [x * 0.485, 1.26 + y * 0.485, -0.018],
        0.008,
        '#d5ad7a',
      );
    }
    // Broken letterpress lines soften the low sun near its lower edge.
    plank(sunrise, -0.15, 1.13, 0.027, 0.47, 0.025, 0.014, '#d9a797');
    plank(sunrise, 0.19, 0.997, 0.027, 0.24, 0.024, 0.014, '#c2a5a5');
    s.place(press(sunrise, 'sun'), -0.81, -2.09);
    const haze = group();
    const cloud = [
      [-0.44, 0.038],
      [-0.31, 0.065],
      [-0.237, 0.151],
      [-0.134, 0.175],
      [-0.046, 0.148],
      [0.06, 0.219],
      [0.2, 0.206],
      [0.302, 0.117],
      [0.411, 0.087],
      [0.46, 0.025],
      [0.14, 0.005],
      [-0.16, 0.014],
    ];
    piece(haze, cloud, '#ccbbbd', 0, 0, 0, 0.032, '#dabfae');
    piece(
      haze,
      [
        [-0.438, 0.037],
        [0.445, 0.026],
        [0.19, -0.005],
        [-0.2, 0.009],
      ],
      '#a99caa',
      0,
      0,
      0.021,
      0.009,
    );
    s.place(press(haze, 'morning-cloud'), -2.08, -2.03, 1.71);
    const gantry = group();
    const metal = '#777689',
      bright = '#a39aa7';
    piece(
      gantry,
      [
        [-0.36, 0],
        [-0.26, 0],
        [-0.11, 0.86],
        [-0.05, 0.92],
        [-0.05, 0.99],
        [-0.17, 0.97],
      ],
      metal,
      0,
      0,
      0,
      0.047,
    );
    piece(
      gantry,
      [
        [0.06, 0],
        [0.14, 0],
        [0.03, 0.9],
        [-0.07, 0.96],
        [-0.08, 0.85],
      ],
      metal,
      0,
      0,
      0.005,
      0.042,
    );
    link(gantry, [-0.3, 0.18, 0.011], [-0.01, 0.67, 0.011], 0.012, bright);
    plank(gantry, -0.02, 1.02, 0.018, 0.31, 0.16, 0.13, metal);
    piece(
      gantry,
      [
        [-0.46, 0.93],
        [0.07, 1.11],
        [0.72, 1.43],
        [0.76, 1.4],
        [0.11, 1.013],
        [-0.43, 0.88],
      ],
      bright,
      0,
      0,
      0.008,
      0.055,
    );
    link(gantry, [-0.32, 0.95, 0], [-0.13, 1.34, 0], 0.014, metal);
    link(gantry, [-0.13, 1.34, 0], [0.73, 1.415, 0], 0.011, metal);
    link(gantry, [0.69, 1.385, 0.01], [0.69, 0.92, 0.01], 0.009, metal);
    piece(
      gantry,
      [
        [0.65, 0.93],
        [0.73, 0.93],
        [0.75, 0.88],
        [0.7, 0.84],
        [0.65, 0.87],
      ],
      metal,
      0,
      0,
      0.026,
      0.03,
    );
    s.place(press(gantry, 'crane'), -3.16, -1.69, 0.075);
    return { sunrise, haze, gantry };
  }

  function boat(s) {
    const cradle = group(),
      hull = group();
    at(cradle, hull, 0, 0, 0);
    piece(
      hull,
      [
        [-0.9, 0.29],
        [-0.58, 0.3],
        [-0.42, 0.27],
        [0.44, 0.25],
        [0.93, 0.42],
        [0.78, 0.19],
        [0.53, 0.078],
        [-0.6, 0.08],
        [-0.81, 0.16],
      ],
      '#424f66',
      0,
      0,
      0,
      0.3,
      '#64768a',
    );
    piece(
      hull,
      [
        [-0.82, 0.22],
        [-0.54, 0.238],
        [0.44, 0.206],
        [0.84, 0.335],
        [0.78, 0.268],
        [0.45, 0.171],
        [-0.61, 0.174],
      ],
      '#d6b8a3',
      0,
      0,
      0.159,
      0.019,
    );
    piece(
      hull,
      [
        [-0.7, 0.13],
        [0.53, 0.112],
        [0.66, 0.168],
        [0.54, 0.09],
        [-0.59, 0.08],
      ],
      '#995f54',
      0,
      0,
      0.163,
      0.012,
    );
    plank(hull, -0.095, 0.35, -0.012, 0.89, 0.1, 0.24, '#9c897a');
    piece(
      hull,
      [
        [-0.45, 0.37],
        [0.31, 0.37],
        [0.24, 0.64],
        [-0.35, 0.64],
      ],
      '#d9c6af',
      0,
      0,
      0,
      0.265,
      '#af9b8d',
    );
    for (const xx of [-0.26, -0.06, 0.13]) plank(hull, xx, 0.52, 0.139, 0.125, 0.126, 0.015, '#516070');
    plank(hull, -0.07, 0.667, 0, 0.85, 0.055, 0.34, '#786d70');
    link(hull, [0.32, 0.278, -0.025], [0.25, 1.14, -0.025], 0.02, '#6f6769');
    link(hull, [0.252, 1.064, -0.033], [-0.65, 0.305, -0.033], 0.009, '#988a80');
    link(hull, [0.25, 1.11, -0.033], [0.76, 0.342, -0.033], 0.011, '#908079');
    piece(
      hull,
      [
        [0, 0],
        [0.2, -0.05],
        [0.06, -0.103],
        [0, -0.074],
      ],
      '#b57262',
      0.25,
      1.125,
      -0.02,
      0.012,
    );
    for (const x of [-0.51, 0.43]) {
      const fender = at(hull, cyl(0.05, 0.052, 0.045, 12, '#343f50'), x, 0.24, 0.17);
      fender.rotation.x = Math.PI / 2;
    }
    const stack = at(hull, group(), -0.3, 0.698, -0.008);
    at(stack, cyl(0.093, 0.104, 0.3, 12, '#ac533c'), 0, 0.15, 0);
    at(stack, cyl(0.102, 0.099, 0.063, 12, '#434851'), 0, 0.298, 0);
    const whistle = at(stack, cyl(0.031, 0.069, 0.133, 12, '#d3a758'), -0.116, 0.19, 0.02);
    whistle.rotation.z = -1.32;
    // The ring buoy, lacquered rail and matching stripe on the deckhand belong to the morning service.
    for (const xx of [0.29, 0.48, 0.68]) link(hull, [xx, 0.295, 0.092], [xx, 0.423, 0.092], 0.009, '#efddbc');
    link(hull, [0.25, 0.42, 0.092], [0.75, 0.43, 0.092], 0.012, '#c6aa86');
    const buoy = at(
      hull,
      new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.021, 4, 16), K.mat('#f0dcb5')),
      -0.39,
      0.353,
      0.168,
    );
    buoy.rotation.z = 0.18;
    for (const angle of [0, 2.1, 4.2]) {
      const tie = plank(
        hull,
        -0.39 + Math.cos(angle) * 0.077,
        0.353 + Math.sin(angle) * 0.077,
        0.186,
        0.046,
        0.025,
        0.012,
        '#b8553f',
      );
      tie.rotation.z = angle;
    }
    press(hull, 'morning-passenger-ferry');
    const puffs = [];
    for (let i = 0; i < 4; i++) {
      const puff = group();
      piece(
        puff,
        [
          [-0.17, 0],
          [-0.19, 0.055],
          [-0.13, 0.132],
          [-0.055, 0.124],
          [-0.011, 0.178],
          [0.08, 0.161],
          [0.121, 0.1],
          [0.183, 0.078],
          [0.203, 0.017],
          [0.142, -0.013],
        ],
        i % 2 ? '#efdcc5' : '#d7c4bd',
        0,
        0,
        0,
        0.022,
        '#baa9ad',
      );
      puffs.push(at(cradle, press(puff, 'ferry-whistle-cloud-' + i), -0.3, 1.07, 0));
    }
    const wash = at(cradle, group(), 0, 0.007, 0.1);
    for (let i = 0; i < 3; i++) {
      const x = -0.34 - i * 0.22,
        z = -0.13 + i * 0.12;
      flat(
        wash,
        [
          [x - 0.9, z + 0.12],
          [x - 0.5, z + 0.05],
          [x - 0.05, z],
          [x - 0.19, z + 0.052],
          [x - 0.51, z + 0.087],
        ],
        0.015,
        i === 1 ? '#ddcbbb' : '#a6b5b5',
        0.006,
      );
    }
    press(wash, 'ferry-whistle-wake');
    s.place(cradle, -3.19, -1.0, 0.073);
    cradle.scale.setScalar(1.16);
    return { cradle, hull, puffs, wash };
  }

  function bollard(s, x, z) {
    const post = group();
    at(post, cyl(0.127, 0.14, 0.064, 8, '#695c64'), 0, 0.032, 0);
    at(post, cyl(0.065, 0.081, 0.19, 8, '#6b6267'), 0, 0.145, 0);
    at(post, cyl(0.1, 0.089, 0.062, 8, '#897b79'), 0, 0.255, 0);
    s.place(press(post, 'bollard'), x, z, 0.15);
  }

  function harbourMullet(s) {
    const pool = group(),
      rings = group(),
      fish = group();
    const curve = (rx, rz, angle) => [rx * Math.cos(angle), rz * Math.sin(angle)];
    // A small printed pool catches clicks inside the ripples as well as on their scored edges.
    flat(
      pool,
      Array.from({ length: 24 }, (_, i) => curve(0.48, 0.18, (i * Math.PI) / 12)),
      0.006,
      '#687890',
      0.005,
    );
    for (const [radius, depth, from, to, ink] of [
      [0.36, 0.126, 0.12, 2.57, '#d9cfc0'],
      [0.36, 0.126, 3.03, 5.73, '#a4b9c0'],
      [0.51, 0.176, 0.92, 2.58, '#b6c3c1'],
      [0.51, 0.176, 3.86, 5.62, '#b2baba'],
    ]) {
      const outer = [],
        inner = [];
      for (let i = 0; i <= 15; i++) {
        const t = i / 15,
          a = from + (to - from) * t,
          w = 0.022 * Math.sin(Math.PI * t);
        outer.push(curve(radius + w, depth + w * 0.45, a));
        inner.unshift(curve(radius - w, depth - w * 0.45, a));
      }
      flat(rings, [...outer, ...inner], 0.021, ink, 0.006);
    }
    at(pool, press(rings, 'silver-mullet-ripples'), 0, 0, 0);
    const skin = (shape, color, z = 0, thickness = 0.022) => piece(fish, shape, color, 0, 0, z, thickness);
    skin(
      [
        [-0.19, 0.01],
        [-0.35, 0.092],
        [-0.44, 0.163],
        [-0.401, 0.043],
        [-0.344, -0.015],
        [-0.4, -0.091],
        [-0.445, -0.133],
        [-0.324, -0.1],
        [-0.204, -0.044],
      ],
      '#548184',
      0,
      0.035,
    );
    skin(
      [
        [-0.367, 0.061],
        [-0.431, 0.149],
        [-0.406, 0.05],
        [-0.355, -0.002],
      ],
      '#b8cdbe',
      0.022,
      0.015,
    );
    skin(
      [
        [-0.207, 0.039],
        [-0.134, 0.098],
        [-0.019, 0.138],
        [0.109, 0.128],
        [0.2, 0.087],
        [0.288, 0.064],
        [0.341, 0.028],
        [0.344, 0.009],
        [0.294, -0.012],
        [0.247, -0.051],
        [0.115, -0.098],
        [-0.035, -0.106],
        [-0.148, -0.079],
        [-0.231, -0.025],
      ],
      '#789da0',
      0.019,
      0.082,
    );
    skin(
      [
        [-0.221, -0.014],
        [-0.108, 0.003],
        [0.049, 0.024],
        [0.201, 0.027],
        [0.326, 0.019],
        [0.278, -0.024],
        [0.148, -0.079],
        [-0.014, -0.097],
        [-0.125, -0.071],
      ],
      '#dfd6b8',
      0.066,
      0.01,
    );
    skin(
      [
        [-0.125, 0.107],
        [-0.118, 0.176],
        [-0.082, 0.211],
        [0.004, 0.144],
        [0.019, 0.131],
      ],
      '#536e7a',
      -0.014,
      0.027,
    );
    skin(
      [
        [0.058, 0.01],
        [-0.04, -0.113],
        [-0.092, -0.119],
        [-0.06, -0.047],
        [0.004, 0.017],
      ],
      '#8cafa8',
      0.076,
      0.015,
    );
    skin(
      [
        [0.142, 0.095],
        [0.119, 0.055],
        [0.115, 0.012],
        [0.147, -0.043],
        [0.127, 0.005],
        [0.132, 0.052],
      ],
      '#587c81',
      0.073,
      0.008,
    );
    for (const [x, y] of [
      [-0.157, 0.039],
      [-0.101, 0.053],
      [-0.046, 0.062],
      [0.011, 0.072],
      [0.067, 0.08],
      [-0.065, 0.023],
      [0.021, 0.036],
    ]) {
      skin(
        [
          [x - 0.011, y + 0.011],
          [x + 0.008, y],
          [x - 0.011, y - 0.01],
          [x - 0.003, y],
        ],
        '#e0d8b9',
        0.074,
        0.006,
      );
    }
    circle(fish, 0.239, 0.052, 0.073, 0.03, '#d5ba71');
    circle(fish, 0.242, 0.053, 0.086, 0.019, '#344652');
    at(pool, press(fish, 'jumping-silver-mullet'), 0, 0, 0);
    const drops = [];
    for (let i = 0; i < 4; i++) {
      const d = piece(
        pool,
        [
          [0, 0.073],
          [0.026, 0.015],
          [0.023, -0.012],
          [0, -0.031],
          [-0.019, -0.013],
          [-0.022, 0.015],
        ],
        i % 2 ? '#a7c0c8' : '#eee2c8',
        0,
        0,
        0.04,
        0.012,
      );
      d.rotation.z = (i - 1.5) * 0.37;
      drops.push(d);
    }
    s.place(pool, -1.55, -0.45, 0.073);
    let previous = 0,
      descending = false;
    function set(amplitude) {
      if (amplitude < 0.002) descending = false;
      else if (amplitude < previous - 0.001) descending = true;
      previous = amplitude;
      const ascent = Math.asin(Math.min(1, amplitude)) / Math.PI;
      const flight = descending ? 1 - ascent : ascent;
      // The tip of the forked tail breaks the surface while the rest of the fish stays submerged.
      fish.position.set(-0.07 + 0.25 * Math.sin(Math.PI * flight), -0.14 + 0.76 * amplitude, 0.008);
      fish.rotation.z = -0.23 * (1 - amplitude) + (0.54 - 1.04 * flight) * amplitude;
      rings.scale.set(
        0.86 + amplitude * 0.26 + (descending ? 0.16 * (1 - amplitude) : 0),
        1,
        0.88 + amplitude * 0.3,
      );
      for (let i = 0; i < drops.length; i++) {
        const splash = Math.sin(Math.PI * Math.max(0, Math.min(1, (amplitude - 0.035 * i) / 0.81)));
        drops[i].visible = splash > 0.035;
        drops[i].position.set(
          -0.24 + i * 0.14 + (i - 1.5) * 0.042 * splash,
          0.008 + (0.19 + 0.06 * (i % 2)) * splash,
          0.07 + (i % 2) * 0.04,
        );
        drops[i].scale.setScalar(0.72 + 0.34 * splash);
      }
    }
    return { pool, set };
  }

  function servingPier(s) {
    const timber = group();
    // Boards project over the water and meet the road along the front of the stall.
    flat(
      timber,
      [
        [-1.45, -0.68],
        [-1.28, -0.88],
        [1.25, -0.88],
        [1.49, -0.59],
        [1.49, 0.67],
        [1.32, 0.91],
        [-1.45, 0.91],
      ],
      0.077,
      '#987e6d',
      0.11,
      '#705e58',
    );
    for (let i = 0; i < 8; i++) {
      const z = -0.53 + i * 0.186;
      plank(timber, 0.01, 0.135, z, 2.84, 0.008, 0.016, '#7b6962');
    }
    for (const [px, pz] of [
      [-1.34, -0.41],
      [-1.34, 0.33],
      [1.32, -0.39],
      [1.32, 0.36],
    ])
      at(timber, cyl(0.025, 0.026, 0.009, 6, '#756866'), px, 0.14, pz);
    const stool = group();
    for (const x of [-0.126, 0.126])
      for (const z of [-0.087, 0.087]) {
        link(stool, [x * 1.27, 0.002, z * 1.3], [x, 0.301, z], 0.032, '#914d42');
      }
    for (const z of [-0.093, 0.093]) plank(stool, 0, 0.125, z, 0.309, 0.033, 0.034, '#86493f');
    const seat = at(stool, cyl(0.207, 0.193, 0.068, 12, '#b96750'), 0, 0.317, 0);
    seat.scale.z = 0.78;
    at(timber, stool, 1.05, 0.14, 0.82, -0.21);
    s.place(press(timber, 'timber-wharf-and-stool'), 2.4, -0.53, 0.01);
  }

  function waitingFigure(s) {
    const figure = group(),
      coat = group(),
      face = group(),
      bag = group();
    let sheet = coat;
    const paper = (p, c, z, d = 0.038) => piece(sheet, p, c, 0, 0, z, d);
    // Profile facing the road. The black bob and folded hood carry through to the rainy platform.
    paper(
      [
        [-0.14, 0.6],
        [-0.002, 0.6],
        [-0.032, 0.3],
        [-0.083, 0.065],
        [-0.175, 0.065],
        [-0.136, 0.307],
      ],
      '#474953',
      -0.028,
      0.075,
    );
    paper(
      [
        [-0.006, 0.6],
        [0.13, 0.59],
        [0.133, 0.309],
        [0.178, 0.089],
        [0.09, 0.062],
        [0.036, 0.291],
      ],
      '#595963',
      0.015,
      0.066,
    );
    paper(
      [
        [-0.17, 0.106],
        [-0.082, 0.094],
        [-0.06, 0.052],
        [0.002, 0.038],
        [0.011, 0.012],
        [-0.18, 0.012],
      ],
      '#433d45',
      0.019,
      0.076,
    );
    paper(
      [
        [0.078, 0.102],
        [0.174, 0.11],
        [0.192, 0.063],
        [0.243, 0.042],
        [0.248, 0.02],
        [0.092, 0.016],
      ],
      '#51464a',
      0.043,
      0.07,
    );
    paper(
      [
        [-0.046, 1.14],
        [0.069, 1.16],
        [0.17, 1.04],
        [0.207, 0.77],
        [0.243, 0.485],
        [0.074, 0.45],
        [-0.027, 0.479],
        [-0.195, 0.45],
        [-0.2, 0.53],
        [-0.147, 0.86],
        [-0.146, 1.02],
      ],
      saffron,
      0.014,
      0.092,
    );
    paper(
      [
        [-0.135, 1.007],
        [-0.024, 1.104],
        [0.005, 0.92],
        [-0.041, 0.73],
        [-0.064, 0.485],
        [-0.193, 0.47],
      ],
      '#c28b36',
      0.073,
    );
    paper(
      [
        [0.028, 1.13],
        [0.139, 1.055],
        [0.144, 0.906],
        [0.215, 0.491],
        [0.107, 0.474],
        [0.035, 0.77],
      ],
      '#eab447',
      0.077,
      0.021,
    );
    paper(
      [
        [-0.16, 1.02],
        [-0.185, 1.145],
        [-0.115, 1.244],
        [0.059, 1.21],
        [0.112, 1.15],
        [0.04, 1.048],
        [-0.06, 1.014],
      ],
      '#e8ae46',
      0.066,
      0.047,
    );
    paper(
      [
        [-0.149, 1.077],
        [-0.11, 1.17],
        [-0.008, 1.13],
        [0.055, 1.07],
        [-0.063, 1.03],
      ],
      '#bd812f',
      0.101,
      0.016,
    );
    // The ferry's collar, reflective cuff and cap let her signal her job without lettering.
    piece(
      coat,
      [
        [-0.125, 1.045],
        [-0.061, 1.086],
        [0.061, 1.057],
        [0.123, 1.101],
        [0.082, 0.986],
        [0.028, 1.008],
        [-0.023, 0.918],
        [-0.055, 0.987],
      ],
      '#4b5c69',
      0,
      0,
      0.127,
      0.021,
    );
    for (const y of [0.8, 0.69, 0.58]) circle(coat, 0.047, y, 0.131, 0.011, '#8c663e');
    const head = at(figure, group(), 0, 1.12, 0);
    at(head, face, 0, -1.12, 0);
    sheet = face;
    paper(
      [
        [0.005, 1.3],
        [0.087, 1.3],
        [0.086, 1.16],
        [0.034, 1.114],
        [-0.018, 1.17],
      ],
      '#c58a6b',
      0.06,
    );
    paper(
      [
        [-0.092, 1.407],
        [-0.008, 1.48],
        [0.104, 1.452],
        [0.133, 1.385],
        [0.136, 1.34],
        [0.177, 1.3],
        [0.141, 1.29],
        [0.135, 1.245],
        [0.085, 1.211],
        [-0.012, 1.265],
      ],
      '#dfac83',
      0.075,
      0.078,
    );
    paper(
      [
        [-0.151, 1.239],
        [-0.183, 1.323],
        [-0.16, 1.422],
        [-0.081, 1.515],
        [0.019, 1.542],
        [0.117, 1.511],
        [0.143, 1.448],
        [0.122, 1.394],
        [0.07, 1.394],
        [0.031, 1.343],
        [0.019, 1.239],
        [-0.053, 1.194],
        [-0.079, 1.218],
        [-0.112, 1.184],
      ],
      '#393643',
      0.093,
      0.084,
    );
    paper(
      [
        [-0.154, 1.387],
        [-0.105, 1.469],
        [0.001, 1.514],
        [0.102, 1.486],
        [0.013, 1.493],
        [-0.074, 1.451],
      ],
      '#534a54',
      0.141,
      0.012,
    );
    piece(
      face,
      [
        [-0.154, 1.422],
        [-0.159, 1.499],
        [-0.095, 1.543],
        [0.057, 1.558],
        [0.133, 1.52],
        [0.144, 1.457],
        [0.103, 1.425],
        [-0.06, 1.443],
      ],
      '#f6e7c6',
      0,
      0,
      0.151,
      0.029,
      '#c8b799',
    );
    piece(
      face,
      [
        [-0.157, 1.445],
        [0.136, 1.468],
        [0.198, 1.443],
        [0.183, 1.42],
        [0.074, 1.423],
        [-0.15, 1.416],
      ],
      '#394c5a',
      0,
      0,
      0.169,
      0.024,
    );
    circle(face, 0.079, 1.486, 0.184, 0.018, '#c7964d');
    circle(face, 0.105, 1.364, 0.133, 0.014, '#4b4039');
    piece(
      face,
      [
        [0.084, 1.367],
        [0.114, 1.376],
        [0.122, 1.37],
        [0.092, 1.36],
      ],
      '#604638',
      0,
      0,
      0.143,
      0.008,
    );
    press(face, 'ferry-crew-head');
    sheet = coat;
    paper(
      [
        [-0.108, 1.02],
        [-0.051, 0.957],
        [0.032, 0.757],
        [0.143, 0.711],
        [0.123, 0.645],
        [-0.038, 0.676],
        [-0.147, 0.867],
      ],
      '#d39730',
      0.118,
      0.044,
    );
    paper(
      [
        [0.107, 0.723],
        [0.157, 0.71],
        [0.203, 0.663],
        [0.185, 0.634],
        [0.133, 0.644],
        [0.105, 0.669],
      ],
      '#d7a279',
      0.145,
      0.033,
    );
    sheet = bag;
    link(bag, [0.131, 0.665, 0.155], [0.128, 0.535, 0.154], 0.014, '#8c6450');
    link(bag, [0.184, 0.648, 0.15], [0.213, 0.528, 0.154], 0.012, '#8c6450');
    paper(
      [
        [0.072, 0.55],
        [0.221, 0.55],
        [0.263, 0.354],
        [0.071, 0.344],
        [0.041, 0.392],
      ],
      '#b48762',
      0.144,
      0.051,
    );
    piece(
      bag,
      [
        [0.074, 0.539],
        [0.214, 0.54],
        [0.227, 0.51],
        [0.078, 0.508],
      ],
      '#d5b17b',
      0,
      0,
      0.177,
      0.012,
    );
    piece(
      bag,
      [
        [0.222, 0.51],
        [0.252, 0.369],
        [0.221, 0.351],
        [0.193, 0.374],
      ],
      '#916749',
      0,
      0,
      0.177,
      0.011,
    );
    figure.add(press(coat, 'ferry-crew-coat'), press(bag, 'ferry-crew-bag'));
    // One articulated arm is free to hail the rider, stop a spill or take the hot cup.
    const arm = at(figure, group(), 0.098, 1.012, 0.163);
    piece(
      arm,
      [
        [-0.028, 0.038],
        [0.038, 0.071],
        [0.166, 0.049],
        [0.251, 0.104],
        [0.274, 0.033],
        [0.156, -0.044],
        [0.084, -0.047],
        [-0.019, -0.021],
      ],
      '#efb94b',
      0,
      0,
      0,
      0.055,
      '#bb8634',
    );
    piece(
      arm,
      [
        [0.212, 0.08],
        [0.246, 0.102],
        [0.269, 0.043],
        [0.237, 0.025],
      ],
      '#fae2a3',
      0,
      0,
      0.03,
      0.022,
    );
    const wrist = at(arm, group(), 0.25, 0.064, 0.027);
    piece(
      wrist,
      [
        [-0.025, 0.026],
        [0.005, 0.047],
        [0.064, 0.053],
        [0.115, 0.09],
        [0.137, 0.086],
        [0.105, 0.041],
        [0.151, 0.057],
        [0.168, 0.047],
        [0.131, 0.023],
        [0.161, 0.03],
        [0.168, 0.019],
        [0.115, -0.011],
        [0.052, -0.025],
        [-0.009, -0.018],
      ],
      '#e8b88a',
      0,
      0,
      0.002,
      0.035,
      '#bc8e70',
    );
    const palm = at(wrist, group(), 0.117, 0.046, 0.015);
    s.place(figure, -2.93, 1.72, 0.17);
    figure.rotation.y = -0.075;
    figure.scale.setScalar(1.12);
    return { root: figure, head, arm, wrist, palm, bag };
  }

  function cup(parent, x, y, z, height, radius) {
    const paper = group();
    at(paper, cyl(radius, 0.7 * radius, height, 18, '#f5dfb3'), 0, height * 0.5, 0);
    at(paper, cyl(radius * 0.965, radius * 0.946, 0.032, 18, '#aa4934'), 0, height * 0.825, 0);
    at(paper, cyl(radius * 1.06, radius * 1.04, 0.018, 18, '#fff0c8'), 0, height, 0);
    at(paper, cyl(radius * 0.89, radius * 0.9, 0.009, 18, '#db8829'), 0, height + 0.01, 0);
    at(paper, cyl(radius * 0.155, radius * 0.155, 0.005, 9, '#707941'), -0.029, height + 0.018, 0.038);
    return at(parent, paper, x, y, z);
  }
  function foldedSleeve() {
    const paper = group(),
      n = 12;
    const panelW = 0.092;
    for (let i = 0; i < n; i++) {
      const a = (i * 2 * Math.PI) / n,
        panel = group();
      const r = 0.144 + (i % 2) * 0.006;
      piece(
        panel,
        [
          [-panelW * 0.46, 0],
          [panelW * 0.46, 0],
          [panelW * 0.52, 0.16 + 0.02 * (i % 2)],
          [-panelW * 0.52, 0.17],
        ],
        i % 2 ? '#9a693f' : '#c58d52',
        0,
        0,
        0,
        0.014,
        '#d5ab76',
      );
      at(paper, panel, Math.sin(a) * r, 0, Math.cos(a) * r, a);
    }
    piece(
      paper,
      [
        [-0.04, 0.15],
        [0.041, 0.15],
        [0.044, 0.21],
        [0.016, 0.235],
        [-0.024, 0.231],
        [-0.042, 0.206],
      ],
      '#b95839',
      0,
      0,
      0.152,
      0.018,
      '#edb879',
    );
    return press(paper, 'spare-cup-holder');
  }

  function ferryOrder() {
    const tray = group(),
      stock = group(),
      handle = group(),
      collars = [];
    // One continuous tray allows the five waiting cups to read as the rest of the order.
    for (let i = 0; i < 5; i++)
      plank(stock, 0, 0.042, -0.19 + i * 0.095, 1.98, 0.054, 0.091, i % 2 ? '#bb9167' : '#ca9f75');
    for (const x of [-0.96, 0.96]) plank(stock, x, 0.058, 0, 0.058, 0.119, 0.48, '#956f56');
    plank(stock, 0, 0.095, 0.23, 1.98, 0.1, 0.033, '#8d6852');
    plank(stock, 0, 0.107, -0.225, 1.98, 0.13, 0.035, '#9e7357');
    const spare = foldedSleeve();
    for (let i = 0; i < 5; i++) {
      const x = (i - 2) * 0.375,
        z = i % 2 ? -0.052 : 0.031;
      cup(stock, x, 0.074, z, 0.36, 0.16);
      const fold = at(tray, spare.clone(), x, 0.073, z);
      fold.scale.set(1.07, 0.14, 1.07);
      collars.push(fold);
    }
    // The carrying handle is lowered behind the cups until the whole batch is packed.
    piece(
      handle,
      [
        [-0.974, 0],
        [-0.913, 0],
        [-0.832, 0.52],
        [-0.708, 0.609],
        [0.708, 0.609],
        [0.832, 0.52],
        [0.913, 0],
        [0.974, 0],
        [0.895, 0.566],
        [0.746, 0.677],
        [-0.746, 0.677],
        [-0.895, 0.567],
      ],
      '#9e6f4d',
      0,
      0,
      0,
      0.047,
      '#e2be8e',
    );
    plank(handle, 0, 0.65, 0, 0.426, 0.074, 0.068, '#a64634');
    for (const x of [-0.942, 0.942]) circle(stock, x, 0.096, -0.176, 0.028, '#ecd0a4');
    at(tray, press(stock, 'waiting-order-and-five-cups'), 0, 0, 0);
    at(tray, press(handle, 'order-carrying-handle'), 0, 0.096, -0.17);
    const tab = group();
    piece(
      tab,
      [
        [-0.42, -0.075],
        [0.38, -0.079],
        [0.422, -0.029],
        [0.412, 0.088],
        [-0.414, 0.074],
      ],
      '#f7dfb4',
      0,
      0,
      0,
      0.016,
    );
    at(tab, K.label('早班船 × 6', 0.73, 0.139, { ink: '#513c37', paper: 'transparent' }), 0, 0, 0.012);
    at(tray, tab, 0.04, 0.111, 0.255);
    tray.name = '早班船的熱湯訂單';
    return { tray, handle, collars };
  }

  function shopkeeper(stall) {
    const person = group();
    const p = (outline, col, z, d = 0.035) => piece(person, outline, col, 0, 0, z, d);
    p(
      [
        [-0.2, 0],
        [0.3, 0],
        [0.25, 0.57],
        [0.14, 0.72],
        [-0.13, 0.75],
        [-0.26, 0.59],
      ],
      '#c8b8a8',
      0.0,
      0.12,
    );
    p(
      [
        [-0.117, 0.67],
        [0.022, 0.6],
        [0.134, 0.69],
        [0.19, 0.57],
        [0.155, 0.39],
        [0.25, 0.02],
        [-0.2, 0.02],
        [-0.14, 0.45],
      ],
      '#424c61',
      0.081,
      0.025,
    );
    p(
      [
        [-0.149, 0.68],
        [-0.116, 0.7],
        [0.026, 0.51],
        [0.006, 0.475],
      ],
      '#747888',
      0.102,
      0.016,
    );
    p(
      [
        [0.106, 0.71],
        [0.143, 0.694],
        [0.089, 0.49],
        [0.061, 0.495],
      ],
      '#747888',
      0.103,
      0.016,
    );
    p(
      [
        [-0.127, 0.42],
        [0.099, 0.42],
        [0.07, 0.25],
        [-0.112, 0.27],
      ],
      '#555e71',
      0.103,
      0.014,
    );
    p(
      [
        [-0.116, 0.78],
        [-0.104, 0.99],
        [0.058, 1.04],
        [0.161, 0.97],
        [0.142, 0.77],
        [0.085, 0.715],
        [-0.014, 0.737],
        [-0.073, 0.78],
        [-0.116, 0.78],
      ],
      '#c78e73',
      0.035,
      0.096,
    );
    p(
      [
        [-0.116, 0.948],
        [-0.144, 0.884],
        [-0.185, 0.846],
        [-0.14, 0.827],
        [-0.131, 0.782],
        [-0.084, 0.758],
        [0.017, 0.779],
        [0.068, 0.93],
        [-0.02, 0.989],
      ],
      '#e3b595',
      0.093,
      0.038,
    );
    p(
      [
        [0.052, 0.989],
        [0.13, 0.98],
        [0.193, 0.921],
        [0.176, 0.821],
        [0.13, 0.789],
        [0.071, 0.805],
        [0.083, 0.861],
        [0.047, 0.88],
      ],
      '#46414b',
      0.094,
      0.056,
    );
    p(
      [
        [-0.148, 0.917],
        [-0.145, 0.995],
        [-0.115, 1.07],
        [-0.036, 1.1],
        [0.112, 1.088],
        [0.188, 1.008],
        [0.21, 0.947],
        [0.143, 0.956],
        [0.101, 0.985],
        [0.016, 0.974],
      ],
      '#ded3bd',
      0.092,
      0.08,
    );
    p(
      [
        [-0.16, 0.926],
        [0.122, 0.968],
        [0.185, 0.946],
        [0.172, 0.917],
        [0.1, 0.932],
        [-0.153, 0.89],
      ],
      '#9e9ca1',
      0.138,
      0.02,
    );
    p(
      [
        [0.133, 0.947],
        [0.189, 0.965],
        [0.257, 0.933],
        [0.198, 0.905],
        [0.238, 0.851],
        [0.18, 0.87],
      ],
      '#d0c6b2',
      0.113,
      0.028,
    );
    circle(person, -0.079, 0.864, 0.119, 0.011, '#615047');
    at(stall, press(person, 'shopkeeper'), 0.48, 0.89, 0.0);
    // The shoulder and wrist stay attached as the cook works across the tray.
    const arm = group();
    piece(
      arm,
      [
        [0.04, 0.035],
        [0.013, -0.091],
        [-0.186, -0.271],
        [-0.298, -0.248],
        [-0.31, -0.184],
        [-0.179, -0.135],
        [-0.094, 0.042],
      ],
      '#d4c6b5',
      0,
      0,
      0,
      0.062,
    );
    piece(
      arm,
      [
        [-0.253, -0.17],
        [-0.22, -0.242],
        [-0.29, -0.274],
        [-0.331, -0.205],
      ],
      '#a39ba1',
      0,
      0,
      0.037,
      0.017,
    );
    const hand = group();
    piece(
      hand,
      [
        [0.01, 0.027],
        [-0.074, 0.041],
        [-0.137, 0.042],
        [-0.17, 0.019],
        [-0.149, -0.009],
        [-0.109, -0.002],
        [-0.163, -0.043],
        [-0.136, -0.062],
        [-0.06, -0.037],
        [0.008, -0.036],
      ],
      '#d9a384',
      0,
      0,
      0,
      0.043,
    );
    at(arm, hand, -0.302, -0.207, 0.02);
    const ladle = at(hand, group(), 0.004, -0.01, -0.015);
    link(ladle, [-0.024, 0.059, 0.021], [0.045, -0.104, -0.045], 0.019, '#995831');
    link(ladle, [0.041, -0.094, -0.038], [0.137, -0.337, -0.167], 0.012, '#c6b8a5');
    const scoop = at(
      ladle,
      new THREE.Mesh(
        new THREE.SphereGeometry(0.088, 14, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
        K.mat('#a7abad'),
      ),
      0.138,
      -0.333,
      -0.167,
    );
    scoop.scale.set(1.18, 0.65, 0.95);
    at(ladle, cyl(0.079, 0.072, 0.012, 14, '#d89946'), 0.138, -0.344, -0.167);
    press(ladle, 'cook-ladle');
    at(stall, arm, 0.38, 1.53, 0.32);
    return { arm, hand, person, ladle };
  }

  function awningFabric() {
    const awning = group(),
      width = 2.76,
      stripes = 9,
      stripeW = width / stripes;
    // One continuous folded profile per stripe; the scallops cast a real shadow across the counter.
    const profile = [
      [-1.0, 0.218],
      [-0.62, 0.27],
      [-0.28, 0.225],
      [0.065, 0.119],
      [0.26, 0.042],
      [0.265, 0.008],
      [0.051, 0.089],
      [-0.283, 0.195],
      [-0.62, 0.236],
      [-1, 0.186],
    ];
    for (let i = 0; i < stripes; i++) {
      const center = -width * 0.5 + (i + 0.5) * stripeW,
        color = i % 2 ? '#e4cab0' : i % 4 ? '#b74d3e' : '#a74539';
      const roof = piece(
        awning,
        profile,
        color,
        center,
        0,
        0,
        stripeW + 0.002,
        i % 2 ? '#c6a98c' : '#8d4239',
      );
      roof.rotation.y = -Math.PI / 2;
      const w = stripeW * 0.5;
      piece(
        awning,
        [
          [-w, 0.039],
          [w, 0.039],
          [w, -0.079],
          [0.86 * w, -0.111],
          [0.62 * w, -0.146],
          [0.24 * w, -0.168],
          [-0.2 * w, -0.17],
          [-0.61 * w, -0.149],
          [-0.87 * w, -0.116],
          [-w, -0.076],
        ],
        color,
        center,
        0,
        0.267,
        0.032,
      );
      plank(awning, center, 0.01, 0.292, stripeW * 0.96, 0.015, 0.014, i % 2 ? '#c4a98c' : '#a04439');
    }
    return press(awning, 'red-white-canvas');
  }

  function market(s, { teaCounter = false } = {}) {
    const stall = group(),
      frame = group();
    at(stall, frame, 0, 0, 0);
    const counter = 0.91;
    // A teal pushcart, with a butcher-block counter, faded red joinery and an open serving window.
    for (const x of [-0.97, 0.97])
      for (const z of [-0.4, 0.34]) {
        plank(frame, x, 0.26, z, 0.097, 0.5, 0.1, '#634b43');
        plank(frame, x, 0.076, z, 0.138, 0.1, 0.132, '#524750');
      }
    plank(frame, 0, 0.48, -0.05, 2.16, 0.65, 0.85, '#405454');
    plank(frame, 0, 0.56, 0.399, 2.08, 0.58, 0.04, '#496260');
    for (const x of [-0.988, -0.5, 0, 0.5, 0.988])
      plank(frame, x, 0.55, 0.429, 0.027, 0.55, 0.019, '#3f5555');
    plank(frame, 0, 0.267, 0.454, 2.16, 0.052, 0.061, '#916858');
    plank(frame, 0, 0.789, 0.448, 2.14, 0.055, 0.052, '#c19876');
    plank(frame, 0, counter - 0.057, 0, 2.37, 0.113, 1.18, '#83594b');
    plank(frame, 0, counter - 0.004, 0, 2.37, 0.037, 1.18, '#c5a68c');
    // One painted enamel sign, physically nailed to the cart.
    plank(frame, -0.23, 0.54, 0.464, 1.09, 0.37, 0.034, '#ddc7a4');
    plank(frame, -0.23, 0.54, 0.485, 1.02, 0.309, 0.017, '#546b68');
    for (const x of [-0.68, 0.22]) circle(frame, x, 0.54, 0.501, 0.027, '#b5a990');
    for (const x of [-1.115, 1.115]) {
      plank(frame, x, 1.21, -0.49, 0.102, 2.34, 0.108, wood);
      plank(frame, x, 1.12, 0.425, 0.074, 2.19, 0.082, '#936954');
      link(frame, [x, 1.81, 0.42], [x, 2.25, -0.21], 0.026, '#94735e');
    }
    // A dark backcloth gives the pale cups and the owner's light hands a clear silhouette.
    piece(
      frame,
      [
        [-1.05, 0.97],
        [-1.05, 2.19],
        [1.05, 2.2],
        [1.05, 1.0],
        [0.84, 1.025],
        [0.64, 0.965],
        [0.47, 0.99],
        [0.11, 0.97],
        [-0.1, 1.0],
        [-0.43, 0.957],
        [-0.72, 0.992],
      ],
      '#50505c',
      0,
      0,
      -0.5,
      0.047,
    );
    for (const x of [-0.84, -0.35, 0.13, 0.67]) plank(frame, x, 1.63, -0.467, 0.019, 1.01, 0.016, '#5d5861');
    plank(frame, -0.49, 1.44, -0.402, 0.87, 0.051, 0.139, '#8a695a');
    for (const x of [-0.75, -0.56]) {
      at(frame, cyl(0.062, 0.064, 0.19, 12, '#bc9b7a'), x, 1.56, -0.399);
      at(frame, cyl(0.055, 0.058, 0.037, 12, '#82695c'), x, 1.67, -0.398);
    }
    plank(frame, 0, 2.26, -0.17, 2.33, 0.089, 0.11, '#715349');
    const sign = at(stall, K.label('熱 湯', 0.67, 0.245, { ink: '#f4e4c4', paper: 'transparent' }), -0.23, 0.549, 0.502);

    // The pot, paper cups and waiting holder are all part of the serving counter.
    const potX = -0.7,
      potZ = 0.13;
    if (!teaCounter) {
      at(frame, cyl(0.242, 0.205, 0.3, 18, '#959396'), potX, counter + 0.155, potZ);
      at(frame, cyl(0.252, 0.248, 0.031, 20, '#c6bdb0'), potX, counter + 0.307, potZ);
      at(frame, cyl(0.222, 0.214, 0.009, 18, '#d28b41'), potX, counter + 0.321, potZ);
      at(frame, cyl(0.033, 0.035, 0.006, 10, '#768840'), potX + 0.065, counter + 0.328, potZ + 0.03);
      at(frame, cyl(0.024, 0.026, 0.006, 9, '#f0ca68'), potX - 0.069, counter + 0.327, potZ + 0.063);
    }
    const lid = at(stall, group(), potX, counter + 0.322, potZ - 0.198);
    at(lid, cyl(0.115, 0.237, 0.065, 18, '#aba8a4'), 0, 0.037, 0.198);
    at(lid, cyl(0.049, 0.061, 0.042, 12, '#63565b'), 0, 0.085, 0.198);
    press(lid, 'stockpot-cover');
    if (!teaCounter) {
      for (const d of [-1, 1]) {
        plank(frame, potX + d * 0.243, counter + 0.206, potZ, 0.107, 0.036, 0.053, '#6b646a');
      }
    }
    const batch = ferryOrder();
    at(stall, batch.tray, 0.14, counter + 0.016, 0.47);
    // An empty glazed bowl waits underneath the awning's left drip point.
    const bowlX = -1.055,
      bowlZ = 0.506;
    if (!teaCounter) {
      at(frame, cyl(0.143, 0.074, 0.095, 15, '#939ea1'), bowlX, counter + 0.062, bowlZ);
      at(frame, cyl(0.15, 0.143, 0.02, 16, '#d3c9b3'), bowlX, counter + 0.116, bowlZ);
      at(frame, cyl(0.126, 0.122, 0.01, 16, '#6e8391'), bowlX, counter + 0.128, bowlZ);
    }
    press(frame, teaCounter ? 'harbour-tea-counter' : 'breakfast-cart-and-kitchen');
    const owner = shopkeeper(stall);
    const awning = awningFabric();
    at(stall, awning, 0, 2.286, 0.248);

    const drops = [];
    for (let i = 0; i < 3; i++) {
      const d = piece(
        stall,
        [
          [0, 0.063],
          [0.021, 0.014],
          [0.019, -0.015],
          [0, -0.031],
          [-0.02, -0.018],
          [-0.023, 0.008],
        ],
        '#abc9cc',
        bowlX,
        2.11,
        bowlZ,
        0.019,
        '#dbd5c1',
      );
      d.visible = false;
      drops.push(d);
    }
    const ripple = at(stall, cyl(0.103, 0.103, 0.008, 16, '#abbfc0'), bowlX, counter + 0.137, bowlZ);
    ripple.visible = false;
    const steam = [];
    for (let i = 0; i < 2; i++) {
      const curl = piece(
        stall,
        [
          [0.003, 0],
          [0.044, 0.062],
          [0.051, 0.118],
          [0.017, 0.173],
          [0.016, 0.211],
          [0.035, 0.245],
          [0.011, 0.233],
          [-0.012, 0.205],
          [-0.012, 0.17],
          [0.014, 0.116],
          [0.015, 0.082],
          [-0.007, 0.043],
          [-0.01, 0.016],
        ],
        i ? '#c6b6bc' : '#ddd0c3',
        potX - 0.047 + i * 0.089,
        1.306,
        potZ,
        0.013,
      );
      steam.push(curl);
    }
    s.place(stall, 2.43, -0.67, 0.145);
    return { stall, sign, awning, owner, batch, drops, ripple, steam, lid, lipY: 2.12, bowlY: counter + 0.145 };
  }

  function build(s) {
    shoreline(s, -1);
    shoreline(s, 1);
    hills(s, -1);
    hills(s, 1);
    dawn(s);
    const ship = boat(s),
      mullet = harbourMullet(s);
    bollard(s, -4.05, 0.258);
    bollard(s, 0.38, 0.275);
    const customer = waitingFigure(s);
    servingPier(s);
    const cart = market(s);
    function set({
      copy = 0,
      rain = 0,
      time = 0,
      motion = true,
      inspect = 0,
      phase = 'invited',
      response = 0,
      whistle = 0,
      ripple = 0,
      greeting = '',
      greet = 0,
    } = {}) {
      const t = motion ? time : 0;
      mullet.set(ripple);
      ship.hull.position.y = 0.009 * Math.sin(t * 1.25) + whistle * 0.028;
      ship.hull.rotation.z = 0.012 * Math.sin(t * 0.83) + whistle * 0.029;
      ship.puffs.forEach((puff, i) => {
        const gust = whistle * (1.15 + i * 0.16);
        puff.visible = whistle > 0.026 && gust > i * 0.16;
        puff.position.set(-0.31 - i * 0.115 - whistle * 0.08, 1.01 + i * 0.11 + gust * 0.08, 0.02);
        puff.scale.setScalar(Math.max(0.001, (0.43 + i * 0.13) * Math.min(1, (gust - i * 0.13) * 3)));
        puff.rotation.z = 0.09 * i + gust * 0.15;
      });
      ship.wash.visible = whistle > 0.016;
      ship.wash.scale.set(0.65 + whistle * 0.55, 1, 0.1 + whistle * 1.1);
      const refuse = Math.max(0, -response),
        accept = Math.max(0, response);
      const waiting = phase === 'invited';
      const wave = motion ? Math.sin(t * 3.8) : 0;
      // Her arm is visible above the bag even at rest. Her hand opens toward the arriving bicycle.
      const hail = greeting === 'customer' ? greet : 0,
        serve = greeting === 'vendor' ? greet : 0;
      customer.arm.rotation.z =
        (waiting ? 0.49 + 0.15 * wave : -0.48 + 1.18 * refuse + 0.65 * accept) + hail * 0.39;
      customer.wrist.rotation.z =
        (waiting ? 0.89 + 0.18 * wave : 0.1 + (0.67 + 0.1 * wave) * refuse - 0.19 * accept) + hail * 0.38;
      customer.head.rotation.y = motion ? Math.sin(t * 5.1) * 0.24 * refuse : -0.13 * refuse;
      customer.head.rotation.z = -0.07 * refuse + (0.09 + 0.065 * Math.sin(t * 3.4)) * accept;
      customer.root.position.x = -2.93 + 0.162 * refuse + 0.21 * accept;
      customer.root.rotation.z = -0.035 * refuse - 0.066 * accept;
      cart.steam.forEach((curl, i) => {
        const phase = (t * 0.5 + i * 0.52) % 1;
        curl.position.y = 1.31 + phase * 0.25;
        curl.scale.setScalar(0.65 + 0.27 * Math.sin(Math.PI * phase));
        curl.rotation.z = 0.09 * Math.sin(t * 1.6 + i);
      });
      const across = Math.min(1, Math.max(0, (copy - 0.055) / 0.68));
      const packed = Math.min(1, Math.max(0, (copy - 0.72) / 0.28));
      const reach = Math.min(1, copy / 0.12) * (1 - packed);
      const pinch = reach * (0.5 - 0.5 * Math.cos((copy * 2 * Math.PI) / 0.14));
      const ownerX = -0.09 + 1.43 * across - 1.21 * packed;
      const cooking = 1 - reach;
      cart.owner.person.position.x = ownerX;
      cart.owner.person.position.y = 0.89 - 0.025 * pinch;
      cart.owner.person.rotation.z = 0.055 * reach;
      cart.owner.arm.position.x = ownerX - 0.1;
      cart.owner.arm.position.y = 1.53 - 0.045 * pinch;
      cart.owner.arm.rotation.z =
        -0.77 + reach * (0.78 + 0.21 * pinch) - cooking * (0.12 * Math.sin(t * 1.4) + serve * 0.65);
      cart.owner.ladle.visible = copy < 0.08 || copy > 0.93;
      cart.lid.rotation.x = -cooking * (0.72 + 0.59 * serve);
      cart.batch.collars.forEach((fold, i) => {
        const raised = Math.min(1, Math.max(0, (copy - i * 0.14) / 0.31));
        fold.scale.y = 0.14 + raised * 1.44;
      });
      cart.batch.handle.rotation.x = -1.51 * (1 - packed);
      cart.batch.tray.position.z = 0.47 + 0.135 * packed;
      cart.batch.tray.rotation.x = -0.08 * inspect;
      cart.batch.tray.position.y = 0.926 + 0.095 * inspect;
      const active = rain > 0 && rain < 1;
      cart.awning.rotation.z = active && motion ? Math.sin(rain * Math.PI * 5) * 0.014 * (1 - rain) : 0;
      cart.drops.forEach((drop, i) => {
        const q = (rain - i * 0.1) / 0.65;
        drop.visible = active && q > 0 && q < 1;
        drop.position.y = cart.lipY - (cart.lipY - cart.bowlY) * q * q;
      });
      const impact = (rain - 0.6) / 0.4;
      cart.ripple.visible = active && impact > 0;
      cart.ripple.scale.setScalar(0.18 + 0.82 * Math.min(1, Math.max(0, impact)));
    }
    set();
    return {
      awning: cart.awning,
      batch: cart.batch.tray,
      customer: customer.root,
      crewBag: customer.bag,
      crewPalm: customer.palm,
      vendor: cart.owner.person,
      ferry: ship.hull,
      water: mullet.pool,
      ownerHand: cart.owner.hand,
      set,
    };
  }
  window.BreakfastQuay = Object.freeze({
    build,
    stock: Object.freeze({ shoreline, hills, dawn, boat, bollard, harbourMullet, servingPier, market }),
  });
})();
