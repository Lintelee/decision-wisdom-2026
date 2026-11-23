// Set plates for the printed street edition. Architecture uses the same grained, edge-coloured
// stock and assembled geometry as the original morning wharf and the Model / AI workshops.
const EDITIONS = {
  court: { index: 5, paper: '#f2ead7', edge: '#b08989', rule: '#986e783b' },
  fruit: { index: 6, paper: '#efebd9', edge: '#80a5a8', rule: '#527c8040' },
  dye: { index: 7, paper: '#e8eadf', edge: '#88a3b0', rule: '#5877833b' },
  pier: { index: 8, paper: '#e5e7de', edge: '#7898a6', rule: '#45697547' },
};
const P = {
  ink: '#304147',
  charcoal: '#313e41',
  jade: '#456960',
  medium: '#668377',
  patina: '#799285',
  bark: '#684c40',
  walnut: '#8e6951',
  stone: '#a99787',
  brick: '#a25a48',
  wine: '#804c48',
  dusk: '#716974',
  clay: '#c59b83',
  cream: '#eee1c0',
  straw: '#d5bc8e',
  brass: '#bb9058',
  blue: '#476876',
  slate: '#435661',
  cyan: '#85aeb0',
  light: '#d4d8c3',
};

export function printedYard(G, name) {
  const stock = window.AtlasStock,
    spec = EDITIONS[name];
  if (typeof stock?.sheet !== 'function' || !spec) return false;
  const base = stock.sheet(spec.index),
    sheet = base.image,
    g = G.g;
  G.wash(spec.paper);
  // The edition's folio is supplied by the new book. Preserve the inked, torn field,
  // deckled border and cartographic rules above the old edition's footer.
  g.drawImage(sheet, 0, 0, sheet.width, sheet.height - 80, 0, 0, G.c.width, G.c.height * 0.942);
  base.dispose();
  if (name === 'court') {
    const stone = [
      [-5.45, -1.93],
      [-3.32, -2.34],
      [1.1, -2.4],
      [5.24, -1.75],
      [5.42, -0.2],
      [5.08, 1.95],
      [3.58, 2.42],
      [-2.66, 2.49],
      [-5.33, 1.87],
    ];
    G.blob(stone, '#cbb2a5', { edge: '#ad8d83', edgeW: 0.024, sharp: true });
    for (let row = 0; row < 7; row++) {
      const z = -1.61 + row * 0.57;
      G.path(
        [
          [-5.05, z],
          [0.1, z + 0.024],
          [5.0, z - 0.012],
        ],
        { w: 0.017, col: '#8c777157', sharp: true },
      );
      for (let n = 0; n < 7; n++) {
        const x = -4.53 + n * 1.42 + (row % 2) * 0.5;
        if (x < 5)
          G.path(
            [
              [x, z + 0.02],
              [x + 0.025, z + 0.53],
            ],
            { w: 0.016, col: '#8c777150', sharp: true },
          );
      }
    }
    for (const side of [-1, 1]) G.circle(side * 4.35, 1.95, 0.39, null, { edge: spec.rule, edgeW: 0.036 });
  } else if (name === 'fruit') {
    G.blob(
      [
        [-5.5, -1.81],
        [-2.4, -2.04],
        [1.1, -1.7],
        [5.25, -1.62],
        [5.52, 0.99],
        [4.38, 2.33],
        [-3.68, 2.38],
        [-5.39, 1.75],
      ],
      '#cfcbc0',
      { sharp: true, edge: '#a9afa3', edgeW: 0.027 },
    );
    for (let r = 0; r < 7; r++) {
      const z = -1.65 + r * 0.58;
      G.path(
        [
          [-5.05, z],
          [4.97, z],
        ],
        { w: 0.017, col: '#8a91885c', sharp: true },
      );
      for (let k = 0; k < 8; k++) {
        const x = -4.8 + k * 1.29 + (r % 2) * 0.51;
        if (x < 4.98)
          G.path(
            [
              [x, z],
              [x, z + 0.56],
            ],
            { w: 0.015, col: '#8a918844', sharp: true },
          );
      }
    }
    G.blob(
      [
        [-3.03, 0.98],
        [-2.66, 0.89],
        [-2.48, 1.09],
        [-2.59, 1.28],
        [-2.96, 1.29],
      ],
      '#be7568',
    );
    for (let i = 0; i < 21; i++) G.rect(-5.05 + i * 0.51, -1.73, 0.23, 0.08, i % 2 ? '#92a596' : '#b49270', { r: 0.004 });
  } else if (name === 'dye') {
    G.blob(
      [
        [-5.35, -2.17],
        [4.74, -1.92],
        [5.39, -1.05],
        [5.2, 1.91],
        [3.45, 2.32],
        [-3.95, 2.41],
        [-5.3, 1.56],
      ],
      '#bbccc6',
      { sharp: true, edge: '#91aaa9', edgeW: 0.032 },
    );
    for (let i = 0; i < 5; i++) {
      const z = -1.31 + i * 0.73;
      G.path(
        [
          [-4.98, z],
          [-2.65, z - 0.03],
          [-0.55, z + 0.009],
          [2.71, z - 0.012],
          [4.94, z],
        ],
        { w: 0.021, col: '#849c965c', sharp: true },
      );
      for (let j = 0; j < 5; j++) {
        const x = -4.18 + j * 1.91 + (i % 2) * 0.65;
        if (x < 4.9)
          G.path(
            [
              [x, z],
              [x + 0.13, z + 0.7],
            ],
            { w: 0.018, col: '#849c9657', sharp: true },
          );
      }
    }
    for (const side of [-1, 1])
      for (let i = 0; i < 7; i++) {
        const x = side * 5.27,
          z = -1.29 + i * 0.48;
        G.path(
          [
            [x - 0.1, z],
            [x, z - 0.12],
            [x + 0.1, z],
            [x, z + 0.12],
            [x - 0.1, z],
          ],
          { w: 0.023, col: '#63829088', sharp: true },
        );
      }
  } else {
    const sea = [
      [-5.59, -2.89],
      [-4.26, -3.08],
      [-1.2, -2.98],
      [1.3, -3.03],
      [4.87, -3.09],
      [5.55, -2.72],
      [5.32, -0.74],
      [3.13, -0.71],
      [1.12, -0.78],
      [-2.07, -0.69],
      [-5.43, -0.81],
    ];
    G.blob(sea, '#5b7585', { edge: '#889aa5', edgeW: 0.04, sharp: true });
    G.marks('wave', -5.12, -2.7, 5.12, -1.08, { n: 30, col: '#c3bd9e80', size: 0.16, seed: 74 });
    G.blob(
      [
        [-5.39, -0.93],
        [-2.21, -1.18],
        [1.14, -1.1],
        [5.28, -1.13],
        [5.48, 0.92],
        [4.81, 2.13],
        [2.15, 2.5],
        [-4.41, 2.36],
        [-5.42, 1.6],
      ],
      '#90a0a7',
      { edge: '#6e8390', edgeW: 0.037, sharp: true },
    );
    for (let i = 0; i < 6; i++) {
      const z = -0.8 + i * 0.55;
      G.path(
        [
          [-5.06, z],
          [-1.3, z + 0.03],
          [2.4, z - 0.03],
          [4.98, z],
        ],
        { w: 0.021, col: '#586f7d78', sharp: true },
      );
      for (let j = 0; j < 7; j++) {
        const x = -4.82 + j * 1.4 + (i % 2) * 0.44;
        if (x < 4.9)
          G.path(
            [
              [x, z],
              [x + 0.03, z + 0.52],
            ],
            { w: 0.019, col: '#63798669', sharp: true },
          );
      }
    }
    G.circle(-0.8, -0.45, 1.04, '#c7bd9548', { edge: '#ddccaa80', edgeW: 0.042 });
  }
  return true;
}

function architecture(parent, cacheKey, build) {
  const K = window.PaperKit;
  if (!K) return false;
  const model = K.group(),
    type = [];
  const pin = (part, x = 0, y = 0, z = 0) => K.at(model, part, x, y, z);
  const draw = {
    box: (x, y, z, w, h, d, col) => pin(K.box(w, h, d, col), x, y, z),
    cut: (points, x, y, z, depth, face, edge = P.cream) => pin(K.cut(points, depth, face, edge), x, y, z),
    beam: (a, b, r, ink) => {
      const obj = K.rod(a, b, r, ink);
      model.add(obj);
      return obj;
    },
    cyl: (x, y, z, r, rb, h, ink, n = 8) => pin(K.cyl(r, rb, h, n, ink), x, y, z),
    text: (caption, x, y, z, w, h, ink, paper = 'transparent') =>
      type.push([K.label(caption, w, h, { ink, paper }), x, y, z]),
  };
  build(draw);
  parent.add(K.assembled(model, 'folio-evening-edition-' + cacheKey));
  for (const [stamp, x, y, z] of type) K.at(parent, stamp, x, y, z);
  return true;
}

function strip(d, points, z, r, color) {
  points.slice(1).forEach(([x, y], i) => d.beam([...points[i], z], [x, y, z], r, color));
}
function medallion(d, x, y, z, r, ink, n = 16) {
  const m = d.cyl(x, y, z, r, r, 0.021, ink, n);
  m.rotation.x = Math.PI / 2;
}
function pane(d, x, y, z, w, h, shade, lit = false) {
  d.box(x, y, z, w + 0.07, h + 0.07, 0.05, shade);
  d.box(x, y, z + 0.03, w, h, 0.035, lit ? '#dabf8d' : '#97a8a4');
  d.box(x, y, z + 0.057, 0.025, h, 0.023, shade);
  d.box(x, y + 0.01, z + 0.057, w, 0.023, 0.023, shade);
}

// Precisely pitched paper strips. At a swallowtail each strip rises a little toward the tip.
function roofLeaves(d, centerY, halfWidth, depth, pitch, inks, { upturn = 0, count = 17, front = 0 } = {}) {
  const step = (halfWidth * 2) / count;
  for (let i = 0; i < count; i++) {
    const x = -halfWidth + step * (i + 0.5),
      rise = upturn * Math.pow(Math.abs(x / halfWidth), 3.3);
    for (const side of [-1, 1]) {
      const z = front + side * depth * 0.25;
      const panel = d.box(
        x,
        centerY + pitch * 0.5 + rise,
        z,
        step + 0.012,
        0.061,
        Math.hypot(depth * 0.5, pitch),
        inks[i % inks.length],
      );
      panel.rotation.x = side * Math.atan2(pitch, depth * 0.5);
      const a = [x - step / 2, centerY + pitch + rise + 0.045, front],
        b = [x - step / 2, centerY + rise + 0.042, front + side * depth * 0.5];
      d.beam(a, b, 0.014, inks[(i + 2) % inks.length]);
    }
  }
}

export function templeFacade(parent) {
  return architecture(parent, 'temple', (d) => {
    const roof = ['#526766', '#64766e', '#526661', '#64756c'];
    d.box(0, 0.1, -0.06, 4.39, 0.2, 1.31, '#a89a86');
    d.box(0, 0.23, -0.02, 4.12, 0.085, 1.19, '#dbc7a4');
    d.box(0, 0.83, -0.08, 3.72, 1.15, 0.75, '#b8a58d');
    d.box(0, 0.81, 0.305, 3.47, 1.02, 0.09, '#c4af90');
    for (const sx of [-1, 1]) {
      d.box(sx * 1.26, 0.77, 0.363, 0.67, 0.75, 0.065, '#8f8071');
      d.box(sx * 1.26, 0.8, 0.399, 0.48, 0.5, 0.033, '#5d7067');
      for (let i = -2; i <= 2; i++) {
        d.beam([sx * 1.26 + i * 0.076 - 0.05, 0.63, 0.427], [sx * 1.26 + i * 0.076 + 0.05, 0.96, 0.427], 0.011, P.straw);
        d.beam([sx * 1.26 + i * 0.076 - 0.05, 0.96, 0.429], [sx * 1.26 + i * 0.076 + 0.05, 0.63, 0.429], 0.011, P.straw);
      }
      d.box(sx * 0.44, 0.71, 0.385, 0.8, 0.91, 0.07, '#76534a');
      for (let k = 0; k < 2; k++) d.box(sx * (0.26 + k * 0.36), 0.78, 0.432, 0.285, 0.67, 0.034, k ? '#955f4f' : '#885449');
      for (const x of [0.29, 0.64]) {
        d.box(sx * x, 0.73, 0.454, 0.2, 0.4, 0.013, '#7f544a');
        d.cut(
          [
            [-0.053, 0.0],
            [0, 0.081],
            [0.053, 0],
            [0, -0.081],
          ],
          sx * x,
          0.77,
          0.465,
          0.009,
          P.brass,
          P.straw,
        );
      }
      for (const x of [0.41, 1.61]) {
        d.cyl(sx * x, 0.79, 0.46, 0.075, 0.095, 1.07, '#9a624d', 10);
        for (const [y, rr] of [
          [0.31, 0.116],
          [0.37, 0.089],
          [1.16, 0.104],
          [1.24, 0.135],
        ])
          d.cyl(sx * x, y, 0.46, rr, rr, 0.057, P.patina, 10);
        for (const delta of [-0.043, 0.03])
          d.beam([sx * x + delta, 0.42, 0.528], [sx * x + delta, 1.08, 0.528], 0.007, P.clay);
      }
      for (let i = 0; i < 3; i++) d.box(sx * (0.42 + i * 0.51), 1.2, 0.39, 0.28, 0.085, 0.36, P.jade);
    }
    d.box(0, 1.235, 0.485, 1.47, 0.19, 0.078, P.ink);
    d.box(0, 1.237, 0.53, 1.35, 0.137, 0.028, P.jade);
    d.text('廟　埕', 0, 1.24, 0.558, 1.17, 0.138, '#e7cf97');
    d.box(0, 1.35, 0.06, 4.18, 0.12, 1.13, P.walnut);
    roofLeaves(d, 1.36, 2.2, 1.35, 0.53, roof, { upturn: 0.23, count: 19, front: -0.05 });
    const silhouette = [
      [-2.26, 0.26],
      [-1.87, 0.105],
      [-1.39, 0.037],
      [-0.6, 0],
      [0.6, 0],
      [1.39, 0.037],
      [1.87, 0.105],
      [2.26, 0.26],
      [2.25, 0.196],
      [1.85, 0.024],
      [1.35, -0.049],
      [-1.35, -0.049],
      [-1.85, 0.024],
      [-2.25, 0.196],
    ];
    d.cut(silhouette, 0, 1.36, 0.64, 0.101, '#425b57', '#cabb9e');
    const ridge = [
      [-2.04, 0.38],
      [-1.83, 0.19],
      [-1.52, 0.08],
      [-1.22, 0],
      [1.22, 0],
      [1.52, 0.08],
      [1.83, 0.19],
      [2.04, 0.38],
      [2.08, 0.4],
      [1.91, 0.13],
      [1.57, -0.018],
      [1.3, -0.068],
      [-1.3, -0.068],
      [-1.57, -0.018],
      [-1.91, 0.13],
      [-2.08, 0.4],
    ];
    d.cut(ridge, 0, 1.94, -0.045, 0.115, '#87554b', '#ddc599');
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 7; i++) {
        const x = sx * (1.31 + i * 0.088),
          y = 1.973 + Math.pow(i / 6, 1.8) * 0.27;
        d.cut(
          [
            [-0.042, 0],
            [0, 0.045],
            [0.047, 0.009],
            [0, -0.018],
          ],
          x,
          y,
          0.021,
          0.012,
          i % 2 ? P.medium : P.brass,
        );
      }
      d.cut(
        [
          [0, 0],
          [0.17, 0.055],
          [0.31, 0.19],
          [0.44, 0.2],
          [0.36, 0.125],
          [0.53, 0.09],
          [0.28, 0.07],
          [0.1, -0.036],
        ].map(([x, y]) => [x * sx, y]),
        sx * 0.17,
        1.99,
        0.015,
        0.042,
        P.patina,
        P.straw,
      );
    }
    medallion(d, 0, 2.08, 0.01, 0.105, P.brass);
    for (const [y, w, z] of [
      [0.15, 1.7, 0.67],
      [0.085, 2.03, 0.78],
      [0.035, 2.22, 0.88],
    ])
      d.box(0, y, z, w, 0.065, 0.21, '#b9ac99');
    for (const sx of [-1, 1]) {
      d.cyl(sx * 0.83, 1.064, 0.6, 0.11, 0.155, 0.18, '#ad7058', 12);
      d.cyl(sx * 0.83, 0.96, 0.6, 0.105, 0.065, 0.054, P.wine, 12);
      d.beam([sx * 0.83, 0.936, 0.6], [sx * 0.83, 0.84, 0.6], 0.016, P.brass);
    }
  });
}

function shopArch(d, x, y, z, w, h, cladding, shadow) {
  const out = [
    [-w * 0.5, 0],
    [-w * 0.5, h * 0.63],
    [-w * 0.38, h * 0.86],
    [-w * 0.2, h * 0.97],
    [0, h],
    [w * 0.2, h * 0.97],
    [w * 0.39, h * 0.85],
    [w * 0.5, h * 0.63],
    [w * 0.5, 0],
  ];
  d.cut(out, x, y, z, 0.056, cladding, P.straw);
  d.cut(
    out.map(([xx, yy]) => [xx * 0.77, yy * 0.84]),
    x,
    y + 0.018,
    z + 0.039,
    0.036,
    shadow,
  );
  d.box(x, y + h * 0.31, z + 0.064, w * 0.69, 0.023, 0.028, cladding);
  d.box(x, y + h * 0.34, z + 0.064, 0.024, h * 0.64, 0.028, cladding);
}

export function fruitMarketFacade(parent) {
  return architecture(parent, 'fruit-market', (d) => {
    d.box(0, 0.09, -0.05, 3.26, 0.18, 1.31, '#9bac9e');
    d.box(0, 1.02, -0.465, 2.96, 1.99, 0.47, '#b8ae93');
    d.box(0, 0.97, -0.199, 2.62, 1.75, 0.066, '#516a60');
    for (const x of [-1.39, -0.73, 0.71, 1.39]) {
      d.box(x, 1.16, -0.16, 0.104, 2.14, 0.15, '#9d987b');
      d.box(x, 0.21, -0.137, 0.144, 0.34, 0.19, '#718977');
      d.box(x, 1.91, -0.117, 0.179, 0.09, 0.22, '#d6c99f');
    }
    for (let i = 0; i < 5; i++) {
      const x = -1.16 + i * 0.58;
      d.box(x, 1.32, -0.158, 0.51, 0.61, 0.053, i % 2 ? '#5d7869' : '#647b69');
      for (let j = 0; j < 4; j++) d.box(x - 0.185 + j * 0.125, 1.33, -0.119, 0.018, 0.55, 0.023, '#859781');
    }
    const crown = [
      [-1.54, 0],
      [-1.54, 0.36],
      [-1.34, 0.36],
      [-1.31, 0.29],
      [-0.98, 0.29],
      [-0.91, 0.4],
      [-0.57, 0.44],
      [-0.39, 0.6],
      [-0.17, 0.67],
      [0, 0.7],
      [0.18, 0.67],
      [0.39, 0.6],
      [0.56, 0.44],
      [0.9, 0.4],
      [0.97, 0.29],
      [1.31, 0.29],
      [1.34, 0.36],
      [1.54, 0.36],
      [1.54, 0],
    ];
    d.cut(crown, 0, 1.8, -0.34, 0.44, '#c9b99a', P.straw);
    d.cut(
      crown.map(([x, y]) => [x * 0.96, y * 0.87]),
      0,
      1.85,
      -0.105,
      0.043,
      '#9da792',
      '#e2d3ae',
    );
    for (const sx of [-1, 1]) {
      shopArch(d, sx * 1.02, 1.89, -0.065, 0.41, 0.28, '#ddcfad', '#526a66');
      d.cyl(sx * 1.49, 2.17, -0.3, 0.05, 0.073, 0.22, '#b1ae91', 8);
    }
    d.box(0, 2.167, -0.048, 1.16, 0.26, 0.075, P.cream);
    d.box(0, 2.168, -0.001, 1.09, 0.208, 0.021, P.jade);
    d.text('當 季 鮮 果', 0, 2.17, 0.018, 1.04, 0.172, '#efdfb6');
    for (let i = 0; i < 14; i++) {
      const x = -1.5 + i * 0.222,
        face = i % 2 ? '#c6b590' : '#5f7969';
      const panel = d.box(x + 0.108, 1.695, 0.02, 0.224, 0.038, 0.72, face);
      panel.rotation.x = 0.27;
      d.cut(
        [
          [-0.112, 0],
          [0.112, 0],
          [0.11, -0.14],
          [0.048, -0.174],
          [-0.049, -0.174],
          [-0.11, -0.139],
        ],
        x + 0.108,
        1.602,
        0.365,
        0.023,
        face,
        P.straw,
      );
    }
    d.beam([-1.61, 1.6, 0.36], [1.6, 1.6, 0.36], 0.023, P.bark);
    for (const side of [-1, 1]) {
      d.beam([side * 1.45, 1.28, -0.08], [side * 1.45, 1.59, 0.35], 0.022, P.walnut);
      d.box(side * 1.49, 0.64, 0.05, 0.086, 1.26, 0.11, P.jade);
    }
  });
}

export function dyeHouseFacade(parent) {
  return architecture(parent, 'dye-house', (d) => {
    d.box(0, 0.095, -0.48, 4.66, 0.19, 1.49, '#91a29c');
    d.box(0, 1.13, -0.74, 4.32, 2.08, 0.58, '#b2ab90');
    for (let i = 0; i < 4; i++) {
      const x = -1.55 + i * 1.03;
      d.box(x, 1.14, -0.418, 0.9, 1.59, 0.073, '#586a66');
      for (let j = 0; j < 4; j++)
        d.box(x - 0.317 + j * 0.21, 0.84, -0.367, 0.179, 0.92, 0.032, j % 2 ? '#6a7668' : '#62746b');
      pane(d, x, 1.8, -0.355, 0.66, 0.33, P.walnut, i === 1 || i === 2);
      for (const delta of [-0.17, 0.17]) d.box(x + delta, 1.8, -0.286, 0.016, 0.3, 0.021, P.walnut);
    }
    for (const x of [-2.14, -1.05, 0, 1.05, 2.14]) {
      d.box(x, 1.23, -0.325, 0.09, 2.24, 0.11, P.walnut);
      d.box(x, 0.2, -0.31, 0.145, 0.34, 0.154, '#7f9188');
      d.box(x, 2.18, -0.327, 0.17, 0.105, 0.2, P.cream);
    }
    d.box(0, 2.22, -0.5, 4.61, 0.17, 0.77, '#75654e');
    // The broad roof pitches into the page, keeping the working line of the drying rack in front.
    roofLeaves(d, 2.3, 2.4, 1.52, 0.44, ['#4d626a', '#556d70', '#657b7c', '#50656d'], { count: 18, front: -0.83 });
    d.beam([-2.47, 2.304, -0.035], [2.47, 2.304, -0.035], 0.046, '#d1b997');
    d.beam([-2.42, 2.77, -0.83], [2.42, 2.77, -0.83], 0.041, '#8e9b94');
    for (const side of [-1, 1]) {
      const gable = [
        [-0.72, 0.0],
        [-0.22, 0.34],
        [0.24, 0.38],
        [0.72, 0],
      ];
      const wall = d.cut(gable, side * 2.28, 2.28, -0.8, 0.09, '#b9ad8e', '#dbcaa8');
      wall.rotation.y = Math.PI / 2;
      d.beam([side * 2.24, 1.86, -0.38], [side * 2.24, 2.27, 0.03], 0.033, P.brass);
    }
    // A raised vent carries the steam from the indigo vats. The north-facing panes sit above the drying cloth.
    d.box(-1.7, 2.63, -1.08, 0.23, 0.64, 0.23, '#987a6c');
    d.box(-1.7, 2.957, -1.08, 0.29, 0.069, 0.29, P.slate);
    for (let row = 0; row < 4; row++) d.box(-1.7, 2.43 + row * 0.115, -0.96, 0.22, 0.014, 0.014, '#b29880');
    d.box(0.74, 2.737, -0.84, 1.12, 0.26, 0.3, '#8d998d');
    for (const x of [0.38, 0.73, 1.07]) pane(d, x, 2.748, -0.661, 0.231, 0.14, P.slate);
    const ventRoof = d.box(0.75, 2.904, -0.85, 1.27, 0.065, 0.46, P.slate);
    ventRoof.rotation.x = -0.13;
    // The shop's name is set in the restrained brass-and-indigo face used by the first edition.
    d.box(0, 2.372, 0.012, 1.49, 0.296, 0.107, '#aa8963');
    d.box(0, 2.373, 0.072, 1.39, 0.224, 0.028, '#394e59');
    d.text('藍　染　坊', 0, 2.373, 0.093, 1.29, 0.201, '#e8dbb8');
  });
}

function warehouse(d, x, w, h, z, tone, night) {
  d.box(x, h * 0.42, z, w, h * 0.84, 0.42, tone);
  d.cut(
    [
      [-w * 0.56, 0],
      [0, h * 0.3],
      [w * 0.56, 0],
    ],
    x,
    h * 0.84,
    z,
    0.55,
    '#5c6872',
    '#a7adab',
  );
  d.box(x, h * 0.85, z + 0.286, w * 1.14, 0.046, 0.062, '#a4aca4');
  for (let j = 0; j < 3; j++) {
    const px = x + (j - 1) * w * 0.254;
    d.box(px, h * 0.49, z + 0.219, 0.073, h * 0.205, 0.026, night ? '#d3bc8c' : '#8b938d');
    d.box(px, h * 0.48, z + 0.237, 0.014, h * 0.21, 0.011, '#586a70');
  }
}
export function harborRow(parent, variant) {
  const xList =
    variant === 'left'
      ? [
          [-0.72, 0.95, 0.6],
          [-0.06, 0.77, 0.8],
          [0.55, 0.64, 0.56],
        ]
      : [
          [-0.62, 0.81, 0.56],
          [0.05, 0.8, 0.79],
          [0.72, 0.69, 0.65],
        ];
  return architecture(parent, 'lantern-harbor-' + variant, (d) => {
    for (const [i, [x, w, h]] of xList.entries())
      warehouse(d, x, w, h, -0.08 * (i % 2), ['#7e8990', '#929b9c', '#798891'][i], true);
    const wharfWidth = variant === 'left' ? 2.7 : 2.64;
    d.box(0, 0.035, 0.105, wharfWidth, 0.07, 0.61, '#80919a');
    d.beam([-wharfWidth * 0.52, 0.091, 0.385], [wharfWidth * 0.52, 0.091, 0.385], 0.021, '#c1b99c');
  });
}

export function crateLetterpress(parent, lid) {
  const crate = architecture(parent, 'tea-crate-sides', (d) => {
    for (const side of [-1, 1]) {
      for (let row = 0; row < 3; row++) {
        const y = 0.117 + row * 0.198;
        d.box(side * 0.744, y, 0.424, 0.093, 0.145, 0.024, row % 2 ? '#a77853' : '#a16e4e');
        medallion(d, side * 0.747, y + 0.023, 0.445, 0.021, P.ink, 9);
      }
      d.box(side * 0.52, 0.317, 0.415, 0.079, 0.596, 0.018, '#b58a61');
    }
    for (const y of [0.175, 0.391]) d.box(0, y, 0.414, 1.48, 0.016, 0.019, '#806148');
    d.box(0.61, 0.49, 0.433, 0.24, 0.149, 0.024, '#d2b78b');
    d.cut(
      [
        [-0.065, -0.034],
        [-0.032, 0.009],
        [0, 0.013],
        [0.039, 0.061],
        [0.072, 0.035],
        [0.046, -0.014],
        [0.012, -0.016],
        [-0.013, -0.044],
      ],
      0.61,
      0.496,
      0.453,
      0.012,
      '#967248',
    );
    d.box(-0.05, 0.646, 0.396, 1.62, 0.035, 0.042, '#d6b484');
  });
  if (!crate) return false;
  architecture(lid, 'tea-crate-lid', (d) => {
    for (let i = 0; i < 5; i++) {
      const x = -0.64 + i * 0.31;
      d.box(x, -0.014, 0.391, 0.294, 0.018, 0.77, i % 2 ? '#b58d65' : '#c49b70');
      d.box(x, -0.026, 0.257, 0.19, 0.009, 0.011, '#a87c59');
    }
    for (const z of [0.11, 0.68]) {
      d.box(0, -0.043, z, 1.59, 0.038, 0.085, '#9a7756');
      for (const x of [-0.63, -0.25, 0.26, 0.61]) d.cyl(x, -0.067, z, 0.017, 0.017, 0.009, P.charcoal, 8);
    }
  });
  return true;
}

export function skyline(S, kind) {
  const K = window.PaperKit;
  if (!K) return;
  if (kind === 'fruit') {
    S.plant(1.02, -3.14, (g) =>
      architecture(g, 'fruit-side-street', (d) => {
        for (const [x, w, h, z, ink] of [
          [-0.85, 0.65, 0.41, -0.17, '#96a398'],
          [-0.24, 0.7, 0.55, -0.09, '#adb293'],
          [0.38, 0.61, 0.47, -0.2, '#8e9e92'],
          [0.91, 0.56, 0.6, -0.11, '#a3ac93'],
        ])
          warehouse(d, x, w, h, z, ink, false);
      }),
    );
    S.plant(5.14, -2.37, (g) => K.at(g, K.tree('cypress', 1.22, 67), 0, 0, 0));
  } else if (kind === 'dye') {
    S.plant(4.85, -2.7, (g) => K.at(g, K.tree('round', 1.44, 88), 0, 0, 0));
  } else if (kind === 'court') {
    S.plant(-4.97, -2.44, (g) => K.at(g, K.tree('round', 1.53, 83), 0, 0, 0));
    S.plant(4.89, -2.48, (g) => K.at(g, K.tree('cypress', 1.38, 91), 0, 0, 0));
  }
}

export function engravedPlace(parent, text, { x = 0, y = 0.92, z = 0.052, w = 0.91 } = {}) {
  const K = window.PaperKit;
  if (!K) return false;
  return architecture(parent, 'sign-' + text, (d) => {
    d.box(x, y * 0.53, z - 0.056, 0.082, y * 1.06, 0.09, P.walnut);
    d.box(x, y, z, w + 0.064, 0.277, 0.059, P.walnut);
    d.box(x, y, z + 0.037, w, 0.225, 0.024, P.cream);
    d.text(text, x, y, z + 0.056, w * 0.9, 0.17, P.ink);
    for (const s of [-1, 1]) medallion(d, x + s * (w * 0.5 - 0.056), y, z + 0.055, 0.017, P.brass, 8);
  });
}

export function lanternWorkshop(S) {
  if (!window.PaperKit) return;
  S.plant(
    3.39,
    -1.36,
    (g) =>
      architecture(g, 'lantern-workshop', (d) => {
        d.box(0, 0.09, -0.11, 2.63, 0.18, 0.99, '#8a9795');
        d.box(0, 0.213, -0.13, 2.45, 0.057, 0.93, '#c0b69d');
        d.box(0, 0.868, -0.48, 2.21, 1.31, 0.14, '#526873');
        for (const x of [-0.97, -0.53, 0.49, 1.0]) {
          d.box(x, 0.824, -0.374, 0.052, 1.2, 0.043, '#95856a');
          d.box(x, 1.29, -0.339, 0.066, 0.069, 0.079, '#d4bd8a');
        }
        for (let i = 0; i < 2; i++) pane(d, -0.67 + i * 1.37, 1.025, -0.329, 0.417, 0.3, '#566168', true);
        for (const side of [-1, 1]) {
          d.box(side * 1.109, 0.89, 0.249, 0.084, 1.34, 0.11, '#66594e');
          d.box(side * 1.109, 0.276, 0.252, 0.125, 0.133, 0.15, '#8b9a98');
          d.beam([side * 1.12, 1.3, 0.25], [side * 0.87, 1.54, 0.27], 0.037, P.brass);
        }
        d.box(0, 1.51, -0.118, 2.5, 0.138, 0.87, '#6f6957');
        roofLeaves(d, 1.54, 1.38, 1.28, 0.38, ['#4e6372', '#566b78', '#617382', '#546b76'], { count: 13, front: -0.13 });
        d.beam([-1.4, 1.54, 0.517], [1.4, 1.54, 0.517], 0.033, '#cbb799');
        d.box(0, 1.47, 0.489, 1.07, 0.198, 0.063, '#b99a6e');
        d.box(0, 1.47, 0.528, 0.992, 0.154, 0.023, '#485c64');
        d.text('天 燈 工 坊', 0, 1.47, 0.55, 0.947, 0.139, '#ede3c5');
        d.box(0, 0.57, 0, 1.89, 0.1, 0.41, '#a7926c');
        for (const sx of [-1, 1]) d.box(sx * 0.79, 0.386, 0, 0.056, 0.34, 0.3, P.bark);
        for (const side of [-1, 1]) {
          const x = side * 0.89;
          d.beam([x, 1.53, 0.423], [x, 1.34, 0.423], 0.011, P.brass);
          d.cyl(x, 1.335, 0.423, 0.074, 0.09, 0.047, P.walnut, 10);
          d.cyl(x, 1.218, 0.423, 0.126, 0.114, 0.194, '#deb986', 12);
          d.cyl(x, 1.103, 0.423, 0.086, 0.065, 0.042, P.walnut, 10);
          d.beam([x, 1.08, 0.423], [x, 0.98, 0.423], 0.012, P.brass);
          for (const offset of [-0.052, 0.052])
            d.beam([x + offset, 1.295, 0.524], [x + offset * 0.88, 1.132, 0.514], 0.006, '#af7f60');
        }
        // Four bamboo ribs and two square hoops, still waiting for their sheet of paper.
        const bx = -0.45,
          by = 0.623,
          bz = 0.01,
          low = 0.145,
          hi = 0.201;
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2 + Math.PI / 4,
            b = a + Math.PI / 2;
          const lo = [bx + Math.sin(a) * low, by, bz + Math.cos(a) * low],
            up = [bx + Math.sin(a) * hi, by + 0.42, bz + Math.cos(a) * hi];
          d.beam(lo, up, 0.012, P.straw);
          d.beam(lo, [bx + Math.sin(b) * low, by, bz + Math.cos(b) * low], 0.012, P.straw);
          d.beam(up, [bx + Math.sin(b) * hi, by + 0.42, bz + Math.cos(b) * hi], 0.012, P.straw);
        }
        for (let i = 0; i < 3; i++) {
          const sheet = d.box(0.38 + i * 0.023, 0.635 + i * 0.024, 0.08, 0.55, 0.023, 0.35, i % 2 ? P.straw : '#ddd1ac');
          sheet.rotation.y = 0.04 * i;
        }
      }),
    { ry: -0.07, s: 0.99 },
  );
}

export function editionSky(g, { kind = 'sun', y = 1, r = 0.43 } = {}) {
  const K = window.PaperKit;
  if (!K) return null;
  const top = K.at(g, K.group(), 0, y, 0),
    rays = K.at(top, K.group(), 0, 0, -0.016);
  rays.userData.keep = true;
  if (y > r) g.add(K.rod([0, 0, -0.05], [0, y - r * 0.35, -0.05], 0.012, '#a59680'));
  if (kind === 'sun') {
    const outline = Array.from({ length: 36 }, (_, i) => [
      Math.cos((i * Math.PI) / 18) * r,
      Math.sin((i * Math.PI) / 18) * r,
    ]);
    top.add(K.cut(outline, 0.036, '#d9aa64', '#ead5a8'));
    for (let i = 0; i < 14; i++) {
      const strip = K.cut(
        [
          [-0.012, r * 1.08],
          [0.012, r * 1.08],
          [0.007, r * (i % 3 ? 1.21 : 1.32)],
          [-0.008, r * (i % 3 ? 1.21 : 1.32)],
        ],
        0.011,
        '#c8a465',
        '#e8c996',
      );
      strip.rotation.z = (i * Math.PI) / 7;
      rays.add(strip);
    }
  } else {
    // Two intersecting arcs cut a real crescent. The night is visible right through the opening.
    const cx = r * 0.39,
      cy = r * 0.19,
      inner = r * 0.87,
      d = Math.hypot(cx, cy),
      bearing = Math.atan2(cy, cx);
    const arc = Math.acos((r * r - inner * inner + d * d) / (2 * r * d));
    const a = bearing + arc,
      b = bearing - arc + Math.PI * 2;
    const points = [];
    for (let i = 0; i <= 30; i++) {
      const t = a + ((b - a) * i) / 30;
      points.push([r * Math.cos(t), r * Math.sin(t)]);
    }
    const end = points[points.length - 1],
      begin = points[0],
      a2 = Math.atan2(end[1] - cy, end[0] - cx);
    let b2 = Math.atan2(begin[1] - cy, begin[0] - cx);
    while (b2 > a2) b2 -= Math.PI * 2;
    for (let i = 1; i < 23; i++) {
      const t = a2 + ((b2 - a2) * i) / 23;
      points.push([cx + inner * Math.cos(t), cy + inner * Math.sin(t)]);
    }
    top.add(K.cut(points, 0.048, '#d2bd83', '#eee0af'));
    for (const [x, yy, s] of [
      [-0.86, 0.43, 0.04],
      [0.73, 0.57, 0.038],
      [0.99, -0.16, 0.029],
    ]) {
      const star = K.cut(
        [
          [-s, 0],
          [-s * 0.22, s * 0.19],
          [0, s * 1.75],
          [s * 0.22, s * 0.19],
          [s, 0],
          [s * 0.19, -s * 0.18],
          [0, -s * 1.55],
          [-s * 0.22, -s * 0.18],
        ],
        0.011,
        '#cfbe8b',
      );
      K.at(rays, star, x * r * 1.61, yy * r * 1.53, 0);
    }
  }
  return rays;
}

export function editionCloud(g, width, y) {
  const K = window.PaperKit;
  if (!K) return false;
  const cloud = K.cloud(width);
  cloud.scale.y = y / 2.48;
  K.at(g, cloud, 0, 0, 0);
  return true;
}

export function printedMane(g, rear) {
  return architecture(g, 'lion-crest-' + (rear ? 'tail' : 'mane'), (d) => {
    // Three folded ribbons ride on the cloth's top plane rather than the printed face.
    const outline = rear
      ? [
          [-0.35, 0.97],
          [-0.05, 0.91],
          [0.18, 0.83],
          [0.37, 0.73],
        ]
      : [
          [-0.36, 1.045],
          [-0.2, 1.125],
          [0.08, 1.14],
          [0.34, 1.035],
        ];
    for (const [z, ink] of [
      [-0.14, '#96513f'],
      [0.017, '#c39260'],
      [0.16, '#a76647'],
    ]) {
      const stripPoints = [
        ...outline,
        ...outline
          .slice()
          .reverse()
          .map(([x, y]) => [x, y - 0.027]),
      ];
      d.cut(stripPoints, 0, 0, z, 0.055, ink, '#d5ac78');
    }
    for (let i = 0; i < 4; i++) {
      const x = -0.26 + i * 0.165,
        y = (rear ? 0.93 : 0.99) + (rear ? -0.059 * i : Math.sin(i) * 0.054);
      d.cut(
        [
          [-0.05, 0],
          [0.009, 0.04],
          [0.071, 0.067],
          [0.038, 0.016],
          [0.083, 0.011],
          [0.028, -0.019],
        ],
        x,
        y,
        0.275,
        0.034,
        i % 2 ? '#d1af79' : '#dcc49b',
        '#e5cf9f',
      );
    }
  });
}
