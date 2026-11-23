/* Working models for the first four spreads. Each mechanism pivots on its own paper hinge. */
(() => {
  'use strict';

  const sets = window.AtlasSets;
  const P = {
    ink: '#284640',
    dark: '#244a43',
    bottle: '#366553',
    mint: '#7e9d83',
    sage: '#a8b393',
    blue: '#448c89',
    sea: '#72aaa1',
    straw: '#f4d59b',
    cream: '#f8e6bd',
    gold: '#dea538',
    brick: '#ad5134',
    red: '#c95735',
    rose: '#ce835e',
    pine: '#426f59',
    wood: '#9b724d',
    bark: '#77523b',
    sand: '#d7b786',
    chalk: '#fcf0cd',
    black: '#39443b',
    grey: '#85948c',
  };
  const kit = () => window.PaperKit;
  const group = () => kit().group();
  const at = (p, o, x, y, z, ry = 0) => kit().at(p, o, x, y, z, ry);
  const block = (p, x, y, z, w, h, d, c, ry = 0) => at(p, kit().box(w, h, d, c), x, y, z, ry);
  const cut = (p, pts, x, y, z, c, depth = 0.04, edge = P.cream) =>
    at(p, kit().cut(pts, depth, c, edge), x, y, z);
  const line = (p, a, b, r, c) => p.add(kit().rod(a, b, r, c));
  const post = (p, x, z, height, wide = 0.1, c = P.wood) => block(p, x, height / 2, z, wide, height, wide, c);
  const print = (p, txt, x, y, z, w, h, paper, ink = P.ink) =>
    at(p, kit().label(txt, w, h, { paper, ink }), x, y, z);
  const side = (x, y, w, h) => [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
  function disk(p, x, y, z, r, c, d = 0.04, sides = 16) {
    const obj = at(p, kit().cyl(r, r, d, sides, c), x, y, z);
    obj.rotation.x = Math.PI / 2;
    return obj;
  }
  function flag(p, x, y, z, w, h, c) {
    return cut(
      p,
      [
        [0, 0],
        [w, -0.05],
        [0.78 * w, -h * 0.51],
        [w, -h],
        [0, -h + 0.04],
      ],
      x,
      y,
      z,
      c,
      0.026,
    );
  }
  function loosePaper(p, x, y, z, w, h, angle = 0.18) {
    const paper = group();
    cut(
      paper,
      [
        [0, 0],
        [w, 0],
        [w, h * 0.83],
        [w * 0.8, h],
        [0, h],
      ],
      0,
      0,
      0,
      P.chalk,
      0.023,
    );
    for (let i = 0; i < 3; i++)
      block(paper, w * 0.46, h * (0.65 - 0.14 * i), 0.022, w * (i === 2 ? 0.4 : 0.64), 0.017, 0.008, P.grey);
    paper.rotation.z = angle;
    return at(p, paper, x, y, z);
  }
  function scale(model, f) {
    model.scale.setScalar(f);
    return model;
  }
  function pine(s, x, z, h, seed) {
    return s.place(kit().tree('pine', h, seed), x, z);
  }
  function sprig(s, x, z, n) {
    return s.place(kit().grass(n), x, z);
  }
  // Creased leaves are cut as two paper faces. A few sparse clusters frame the
  // opening without blocking a hand reaching for the three larger mechanisms.
  function reedBed(height = 0.66, flowers = false, reedHeads = false) {
    const root = group();
    const fans = [
      [-0.16, 0.7, -0.25],
      [-0.09, 0.92, -0.11],
      [0.01, 1.02, 0.055],
      [0.13, 0.78, 0.22],
      [0.21, 0.65, 0.26],
      [-0.23, 0.53, -0.37],
    ];
    fans.forEach(([x, h, lean], i) => {
      const stalk = group(),
        tip = h * height;
      cut(
        stalk,
        [
          [0, 0],
          [-0.07, tip * 0.26],
          [-0.046, tip * 0.63],
          [lean, tip],
        ],
        0,
        0,
        0,
        i % 2 ? P.pine : P.mint,
        0.016,
      );
      cut(
        stalk,
        [
          [0, 0],
          [lean, tip],
          [0.045, tip * 0.38],
        ],
        0,
        0,
        0.008,
        i % 2 ? P.mint : P.sage,
        0.014,
      );
      at(root, stalk, x * 0.5, 0, (i % 3) * 0.065 - 0.07, ((i % 3) - 1) * 0.29);
    });
    if (reedHeads) {
      for (const [x, h, tilt] of [
        [-0.07, 1.15, -0.1],
        [0.14, 0.97, 0.14],
      ]) {
        const stem = group();
        line(stem, [0, 0, 0], [tilt, h * height, 0.02], 0.012, P.wood);
        cut(
          stem,
          [
            [-0.031, 0],
            [0.031, 0],
            [0.037, 0.122],
            [0.009, 0.159],
            [-0.031, 0.131],
          ],
          tilt,
          h * height - 0.11,
          0.02,
          P.bark,
          0.026,
        );
        at(root, stem, x, 0, -0.065);
      }
    }
    if (flowers) {
      [
        [-0.18, 0.53],
        [0.09, 0.68],
        [0.22, 0.47],
      ].forEach(([x, h], i) => {
        const y = h * height;
        line(root, [x * 0.63, 0, 0.085], [x, y, 0.1], 0.01, P.pine);
        const head = group();
        for (let j = 0; j < 5; j++) {
          const a = (2 * Math.PI * j) / 5;
          cut(
            head,
            [
              [0, 0],
              [-0.024, 0.029],
              [-0.014, 0.068],
              [0.01, 0.071],
              [0.025, 0.036],
            ],
            0,
            0,
            0.005 * (j % 2),
            P.chalk,
            0.012,
          ).rotation.z = a;
        }
        disk(head, 0, 0, 0.019, 0.029, P.gold, 0.023, 8);
        at(root, head, x, y, 0.1, i * 0.18 - 0.22);
      });
    }
    return root;
  }

  function lifesaver() {
    const rack = group();
    post(rack, 0, 0, 0.9, 0.074, P.wood);
    block(rack, 0, 0.77, 0, 0.42, 0.058, 0.075, P.sand);
    const ring = group();
    const parts = 12;
    for (let i = 0; i < parts; i++) {
      const a = (i * 2 * Math.PI) / parts,
        b = ((i + 1) * 2 * Math.PI) / parts,
        pt = (r, t) => [Math.sin(t) * r, Math.cos(t) * r];
      cut(
        ring,
        [pt(0.245, a), pt(0.245, b), pt(0.145, b), pt(0.145, a)],
        0,
        0,
        0,
        i % 3 === 0 ? P.chalk : P.red,
        0.086,
        i % 3 === 0 ? P.straw : P.rose,
      );
    }
    at(rack, ring, 0, 0.6, 0.068);
    line(rack, [-0.16, 0.4, 0.05], [-0.22, 0.22, 0.04], 0.018, P.straw);
    line(rack, [-0.22, 0.22, 0.04], [-0.13, 0.17, 0.04], 0.018, P.straw);
    return rack;
  }

  function gull() {
    const display = group(),
      bird = group();
    // A restrained wire makes the moving silhouette a suspended paper toy.
    line(display, [0.08, 0, -0.04], [0.02, 1.73, -0.04], 0.008, '#acb7a2');
    cut(
      bird,
      [
        [-0.21, 0.014],
        [-0.31, 0.12],
        [-0.09, 0.076],
        [0.115, 0.111],
        [0.178, 0.145],
        [0.216, 0.114],
        [0.19, 0.06],
        [0.02, -0.022],
      ],
      0,
      0,
      0,
      P.chalk,
      0.036,
    );
    cut(
      bird,
      [
        [0.18, 0.11],
        [0.3, 0.089],
        [0.19, 0.068],
      ],
      0,
      0,
      0.016,
      P.gold,
      0.023,
    );
    const wings = [];
    for (const sign of [-1, 1]) {
      const wing = group();
      const board = cut(
        wing,
        [
          [0, 0],
          [-0.25, 0.24],
          [-0.57, 0.305],
          [-0.33, 0.1],
          [-0.18, 0.02],
        ],
        0,
        0,
        0,
        sign > 0 ? P.cream : P.chalk,
        0.025,
      );
      cut(
        wing,
        [
          [-0.57, 0.305],
          [-0.45, 0.28],
          [-0.39, 0.19],
        ],
        0,
        0,
        0.02,
        P.grey,
        0.013,
      );
      board.rotation.x = 0.16;
      wing.scale.x = sign;
      at(bird, wing, -0.045, 0.056, sign * 0.04);
      wings.push(wing);
    }
    at(display, bird, 0.02, 1.74, -0.04, 0.08);
    return { display, wings };
  }

  function foldedCone() {
    const c = group();
    block(c, 0, 0.035, 0, 0.24, 0.055, 0.22, P.sand);
    cut(
      c,
      [
        [-0.096, 0],
        [0.099, 0],
        [0.022, 0.31],
        [-0.014, 0.31],
      ],
      0,
      0.063,
      0,
      P.brick,
      0.082,
    );
    cut(
      c,
      [
        [-0.065, 0.095],
        [0.07, 0.095],
        [0.056, 0.151],
        [-0.051, 0.151],
      ],
      0,
      0.063,
      0.049,
      P.cream,
      0.013,
    );
    return c;
  }

  function batRack() {
    const r = group();
    for (const x of [-0.35, 0.35]) {
      cut(
        r,
        [
          [-0.084, 0],
          [0.08, 0],
          [0.07, 0.38],
          [0.014, 0.43],
          [-0.073, 0.38],
        ],
        x,
        0,
        0,
        P.bark,
        0.19,
      );
    }
    block(r, 0, 0.31, 0, 0.82, 0.075, 0.22, P.wood);
    for (let i = 0; i < 2; i++) {
      const bat = group();
      at(bat, kit().cyl(0.025, 0.025, 0.22, 8, P.bark), 0, 0.11, 0);
      at(bat, kit().cyl(0.066, 0.026, 0.35, 8, i ? P.rose : P.sand), 0, 0.394, 0);
      at(bat, kit().cyl(0.057, 0.065, 0.11, 8, i ? P.rose : P.sand), 0, 0.61, 0);
      bat.rotation.z = -0.3 + i * 0.08;
      at(r, bat, -0.16 + i * 0.2, 0.068, -0.02);
    }
    return r;
  }

  function clothline(p, x1, x2, h, z, colors) {
    post(p, x1, z, h, 0.055, P.bark);
    post(p, x2, z, h, 0.055, P.bark);
    const y = (f) => h - 0.26 * Math.sin(f * Math.PI);
    for (let i = 0; i < 8; i++) {
      const f = i / 8,
        n = (i + 1) / 8;
      line(p, [x1 + (x2 - x1) * f, y(f), z], [x1 + (x2 - x1) * n, y(n), z], 0.013, P.bark);
    }
    return colors.map((c, i) => {
      const f = (i + 0.65) / (colors.length + 0.3),
        w = ((x2 - x1) / (colors.length + 2)) * 0.7;
      return cut(
        p,
        [
          [0, 0],
          [w, 0.005],
          [w * 0.48, -0.24 - (i % 2) * 0.07],
        ],
        x1 + (x2 - x1) * f - w / 2,
        y(f),
        z,
        c,
        0.014,
      );
    });
  }

  function landscape(s, palette, gradient = 0) {
    const [rear, near] = palette;
    for (const dir of [-1, 1]) {
      const hills = group();
      const pts = [
        [0, 0],
        [0, 0.57],
        [0.43, 0.72],
        [0.85, 1.16],
        [1.17, 0.94],
        [1.7, 1.58],
        [2.1, 1.07],
        [2.62, 1.39],
        [2.97, 0.82],
        [3.53, 1.09],
        [4.12, 0.52],
        [4.32, 0.58],
        [4.32, 0],
      ];
      cut(hills, pts, 0, 0, -0.08, rear, 0.065);
      cut(
        hills,
        [
          [0, 0],
          [0, 0.34],
          [0.56, 0.65],
          [0.96, 0.45],
          [1.52, 0.91],
          [1.92, 0.74],
          [2.29, 1.07],
          [2.64, 0.72],
          [3.09, 0.99],
          [3.67, 0.62],
          [4.32, 0.4],
          [4.32, 0],
        ],
        0,
        0,
        0.035,
        near,
        0.08,
      );
      cut(
        hills,
        [
          [0, 0],
          [0.36, 0.63],
          [0.49, 0.48],
          [0.73, 0.74],
          [0.97, 0.38],
          [0.84, 0.51],
          [0.72, 0.61],
          [0.54, 0.4],
          [0.41, 0.5],
        ],
        0.95,
        0.82,
        -0.03,
        P.straw,
        0.014,
      );
      hills.scale.y = dir < 0 ? 0.9 + gradient : 0.75 + gradient;
      if (dir > 0) hills.rotation.y = Math.PI;
      s.place(hills, dir < 0 ? -4.57 : 4.57, -2.49);
    }
  }
  function roof(p, w, d, h, base, c1, c2) {
    const slope = Math.hypot(w / 2, h),
      tilt = Math.atan2(h, w / 2);
    const ridge = group();
    for (const sign of [-1, 1]) {
      const panel = block(ridge, sign * w * 0.25, base + h * 0.5, 0, slope, 0.09, d, sign < 0 ? c1 : c2);
      panel.rotation.z = -sign * tilt;
      for (let i = 1; i < 9; i++) {
        const rib = block(
          ridge,
          sign * w * 0.25,
          base + h * 0.5 + 0.053,
          d * (i / 9 - 0.5),
          slope,
          0.022,
          0.025,
          sign < 0 ? P.rose : P.brick,
        );
        rib.rotation.z = -sign * tilt;
      }
      const trim = block(
        ridge,
        sign * w * 0.25,
        base + h * 0.5 - 0.023,
        d * 0.5 + 0.019,
        slope + 0.04,
        0.09,
        0.07,
        P.straw,
      );
      trim.rotation.z = -sign * tilt;
    }
    block(ridge, 0, base + h + 0.035, 0, 0.075, 0.068, d + 0.06, P.gold);
    at(p, ridge, 0, 0, 0);
    return ridge;
  }

  function satchel() {
    const a = group();
    const outline = [
      [-0.38, 0],
      [0.35, 0],
      [0.4, 0.08],
      [0.34, 0.58],
      [0.19, 0.73],
      [-0.21, 0.73],
      [-0.35, 0.55],
    ];
    cut(a, outline, 0, 0, 0, P.bottle, 0.17);
    cut(
      a,
      [
        [-0.35, 0.53],
        [-0.29, 0.68],
        [0.19, 0.72],
        [0.33, 0.57],
        [0.28, 0.38],
        [-0.06, 0.3],
        [-0.31, 0.37],
      ],
      0,
      0,
      0.12,
      P.mint,
      0.04,
    );
    line(a, [-0.12, 0.72, 0.05], [-0.12, 0.85, 0.05], 0.026, P.bark);
    line(a, [-0.12, 0.85, 0.05], [0.12, 0.85, 0.05], 0.026, P.bark);
    line(a, [0.12, 0.85, 0.05], [0.12, 0.72, 0.05], 0.026, P.bark);
    block(a, -0.03, 0.28, 0.17, 0.082, 0.21, 0.025, P.bark);
    block(a, -0.03, 0.34, 0.188, 0.13, 0.075, 0.035, P.gold);
    return a;
  }

  function harborBoat(makePassenger = coat => kit().person(coat)) {
    const boat = group();
    cut(
      boat,
      [
        [-1.14, 0.43],
        [-1.02, 0.16],
        [-0.69, 0],
        [0.74, 0.02],
        [1.12, 0.29],
        [1.27, 0.56],
        [0.82, 0.42],
        [-0.88, 0.4],
      ],
      0,
      0,
      0,
      P.bottle,
      0.61,
    );
    cut(
      boat,
      [
        [-1.11, 0.42],
        [-0.99, 0.29],
        [0.92, 0.32],
        [1.22, 0.5],
        [0.94, 0.42],
        [-0.92, 0.43],
      ],
      0,
      0,
      0.33,
      P.cream,
      0.028,
    );
    cut(
      boat,
      [
        [0.63, 0.05],
        [0.75, 0.055],
        [1.17, 0.37],
        [0.96, 0.26],
      ],
      0,
      0,
      0.35,
      P.red,
      0.015,
    );
    block(boat, -0.06, 0.39, 0.01, 1.83, 0.09, 0.68, P.sand);
    for (const z of [-0.27, 0.26]) for (const x of [-0.73, 0.62]) post(boat, x, z, 0.99, 0.05, P.bark);
    const awning = block(boat, -0.045, 1.02, -0.045, 1.81, 0.065, 0.88, P.gold);
    awning.rotation.x = -0.08;
    for (let i = 0; i < 7; i++)
      block(boat, -0.79 + i * 0.244, 1.052, -0.04, 0.1, 0.018, 0.86, i % 2 ? P.cream : P.straw).rotation.x =
        -0.08;
    for (let i = 0; i < 3; i++) {
      const passenger = scale(makePassenger([P.brick, P.blue, P.sage][i], i), 0.58);
      at(boat, passenger, -0.54 + i * 0.46, 0.39, 0.01);
    }
    for (let i = 0; i < 4; i++) disk(boat, -0.65 + i * 0.39, 0.225, 0.356, 0.032, P.gold, 0.013, 10);
    post(boat, 0.94, 0.09, 1.22, 0.044, P.wood);
    const pennant = flag(boat, 0.94, 1.2, 0.09, 0.34, 0.2, P.red);
    return { boat, pennant };
  }

  function workshop() {
    const b = group();
    block(b, 0, 0.1, 0, 2.42, 0.2, 1.66, P.sand);
    block(b, 0, 0.23, 0.1, 2.29, 0.08, 1.55, P.wood);
    block(b, 0, 1.11, -0.69, 2.32, 1.82, 0.1, P.bottle);
    for (const x of [-1.11, 1.11]) {
      block(b, x, 1.12, -0.11, 0.1, 1.78, 1.16, P.sand);
      post(b, x, 0.68, 2.03, 0.18, P.wood);
      block(b, x, 0.38, 0.68, 0.23, 0.24, 0.24, P.bark);
      line(b, [x, 1.53, 0.67], [x * 0.66, 1.96, 0.67], 0.058, P.straw);
    }
    cut(
      b,
      [
        [-1.24, 1.97],
        [0, 2.83],
        [1.24, 1.97],
      ],
      0,
      0,
      0.65,
      P.sand,
      0.12,
    );
    for (let i = -4; i <= 4; i++)
      block(b, i * 0.21, 2.06, 0.723, 0.018, 0.15 + (0.85 - Math.abs(i) * 0.18), 0.014, P.wood);
    const fascia = print(b, '試作工坊', 0, 2.24, 0.753, 1.12, 0.295, P.straw, P.ink);
    roof(b, 2.88, 2.05, 0.93, 2.0, P.red, P.brick);
    block(b, -0.78, 2.62, -0.43, 0.25, 0.62, 0.25, P.brick);
    block(b, -0.78, 2.91, -0.43, 0.32, 0.09, 0.32, P.bark);
    const hinges = [];
    for (const sign of [-1, 1]) {
      const gate = group();
      for (let i = 0; i < 3; i++)
        block(gate, -sign * (0.09 + i * 0.16), 0.92, 0, 0.155, 1.3, 0.085, i % 2 ? P.rose : P.wood);
      for (const y of [0.43, 1.34]) block(gate, -sign * 0.25, y, 0.061, 0.46, 0.07, 0.04, P.straw);
      line(gate, [-sign * 0.04, 0.48, 0.08], [-sign * 0.44, 1.28, 0.08], 0.034, P.bark);
      for (const y of [0.49, 1.25]) disk(gate, -sign * 0.06, y, 0.095, 0.037, P.gold);
      at(b, gate, sign * 1.02, 0, 0.72);
      hinges.push(gate);
    }
    for (const x of [-0.57, 0.57]) post(b, x, 0.49, 0.73, 0.095, P.wood);
    block(b, 0, 0.74, 0.41, 1.58, 0.12, 0.59, P.sand);
    block(b, -0.44, 0.85, 0.41, 0.32, 0.06, 0.23, P.blue);
    block(b, 0.47, 0.84, 0.44, 0.22, 0.055, 0.21, P.gold);
    const bag = at(b, satchel(), 0, 0.92, 0.59);
    line(b, [0, 1.78, 0.58], [0, 1.99, 0.58], 0.02, P.straw);
    const pocket = cut(
      b,
      [
        [-0.24, 0.07],
        [0.22, 0.07],
        [0.22, 0.23],
        [-0.24, 0.23],
      ],
      0,
      0.93,
      0.747,
      P.rose,
      0.058,
    );
    pocket.visible = false;
    const pole = group();
    post(pole, 0, 0, 0.52, 0.035, P.wood);
    const flagObj = flag(pole, 0, 0.5, 0, 0.56, 0.2, P.blue);
    at(b, pole, 0.25, 2.8, -0.24);
    return { b, fascia, hinges, bag, pocket, flagObj };
  }

  // The People opener's overlapping fingerprints become two registering print blocks.
  function impressionPress(parent, x, y, z, factor = 1) {
    const frame = group(),
      leaves = [],
      paper = '#c7d779';
    block(frame, 0, -0.015, 0, 1.28, 0.1, 0.19, P.ink);
    for (const sign of [-1, 1]) {
      const wing = group();
      const pts = [
        [0, 0.07],
        [0.19, 0.12],
        [0.54, 0.42],
        [0.61, 0.62],
        [0.56, 0.79],
        [0.43, 0.88],
        [0.28, 0.89],
        [0.12, 0.85],
        [0, 0.72],
      ];
      cut(
        wing,
        pts.map(([a, b]) => [a * sign, b]),
        0,
        0,
        0,
        paper,
        0.065,
        P.cream,
      );
      at(
        wing,
        kit().engraving('heart', 0.58, 0.77, '#2b4540', sign < 0 ? 'left' : 'right'),
        sign * 0.287,
        0.478,
        0.036,
      );
      block(wing, 0.27 * sign, 0.016, 0, 0.52, 0.055, 0.13, P.wood);
      leaves.push(at(frame, wing, sign * 0.15, 0, 0));
    }
    frame.scale.setScalar(factor);
    at(parent, frame, x, y, z);
    let gap = 0.17;
    return (registered, dt) => {
      gap += ((registered ? 0.008 : 0.17) - gap) * (dt ? Math.min(1, dt * 5.5) : 1);
      leaves.forEach((p, i) => {
        p.position.x = (i ? 1 : -1) * gap;
        p.rotation.y = (i ? 1 : -1) * gap * 1.35;
      });
    };
  }
  function observationStrips(parent, words, x, y, z, colour) {
    const strip = group(),
      tabs = [];
    const w = 0.442;
    block(strip, 0, 0, 0, w * 3 + 0.11, 0.34, 0.08, P.ink);
    words.forEach((word, i) => {
      const tab = group(),
        pos = (i - 1) * w;
      block(tab, 0, 0, 0, w - 0.028, 0.28, 0.057, i === 1 ? colour : P.cream);
      print(tab, word, 0, 0.014, 0.035, w - 0.048, 0.18, 'transparent', P.ink);
      block(tab, 0, -0.147, 0.018, w - 0.09, 0.043, 0.023, colour);
      at(strip, tab, pos, 0, 0.065);
      tabs.push(tab);
    });
    at(parent, strip, x, y, z);
    return (active) =>
      tabs.forEach((tab, i) => {
        tab.position.z = i === active ? 0.17 : 0.065;
        tab.rotation.x = i === active ? -0.28 : 0.025;
        tab.scale.setScalar(i === active ? 1.13 : 1);
      });
  }

  sets.growth = function (s) {
    const K = kit();
    landscape(s, ['#86a392', '#6e9280'], -0.05);
    s.place(K.sun(0.38), -1.17, -2.21);
    s.place(K.cloud(0.67), 0.26, -2.29);
    pine(s, 4.02, -1.84, 1.5, 3);
    pine(s, -4, -1.65, 1.14, 1);
    const water = group();
    const pool = cut(
      water,
      [
        [-1.98, -0.78],
        [-2.12, 0.12],
        [-1.61, 0.89],
        [-0.28, 1.01],
        [1.47, 0.73],
        [1.95, -0.14],
        [1.72, -0.75],
        [-0.15, -1.0],
      ],
      0,
      0,
      0,
      P.sea,
      0.035,
      '#b1c7a4',
    );
    pool.rotation.x = -Math.PI / 2;
    const ripples = [];
    for (let i = 0; i < 11; i++) {
      const x = -1.64 + (i % 5) * 0.66,
        z = -0.76 + Math.floor(i / 5) * 0.53 + (i % 3) * 0.09;
      const r = block(water, x, 0.031, z, 0.22 + 0.05 * (i % 4), 0.016, 0.021, P.cream);
      r.rotation.y = 0.12;
      ripples.push(r);
    }
    s.place(water, -2.43, -0.04, 0.067);
    const { boat, pennant } = harborBoat();
    const boatGrip = group();
    at(boatGrip, boat, 0, 0, 0, -0.09);
    s.place(boatGrip, -2.62, -0.19, 0.075);
    s.hot(boatGrip, 'step1', '讓通勤者帶包搭船', [-0.1, 1.08, 0], 'slide');
    const pier = group();
    for (let i = 0; i < 9; i++) {
      block(pier, -1.12 + i * 0.28, 0.22, 0, 0.26, 0.1, 0.55, i % 3 === 1 ? P.sand : P.wood);
    }
    for (const x of [-1.09, 0.03, 1.14]) for (const z of [-0.19, 0.2]) post(pier, x, z, 0.34, 0.12, P.bark);
    post(pier, 1.09, 0.21, 0.76, 0.095);
    post(pier, -1.08, 0.21, 0.76, 0.095);
    line(pier, [-1.08, 0.64, 0.21], [0, 0.46, 0.21], 0.026, P.straw);
    line(pier, [0, 0.46, 0.21], [1.09, 0.64, 0.21], 0.026, P.straw);
    s.place(pier, -2.35, 0.78);
    const w = workshop();
    s.place(w.b, 2.05, -0.51);
    s.hot(w.b, 'step2', '開啟工坊改版', [0, 1.72, 0.72]);
    const stand = group();
    for (const sign of [-1, 1]) line(stand, [sign * 0.29, 0, 0.12], [sign * 0.2, 0.96, -0.02], 0.036, P.bark);
    cut(
      stand,
      [
        [-0.41, 0.39],
        [0.43, 0.39],
        [0.4, 1.15],
        [-0.38, 1.13],
      ],
      0,
      0,
      0,
      P.wood,
      0.07,
    );
    print(stand, '打樣圖', 0, 0.94, 0.052, 0.64, 0.21, P.cream, P.bark);
    at(stand, scale(satchel(), 0.53), 0, 0.43, 0.084);
    s.place(stand, -0.81, -0.86);
    s.hot(stand, 'step0', '增加一組打樣提案', [0, 0.81, 0.02]);
    const stack = group();
    for (let i = 0; i < 4; i++)
      loosePaper(stack, -0.11 + i * 0.029, 0.04 + i * 0.015, 0.08, 0.21, 0.25, -0.12 + i * 0.06);
    at(stand, stack, 0, 0, 0.1);
    stack.visible = false;
    const steam = Array.from({ length: 3 }, (_, i) => {
      const a = group();
      disk(a, -0.04, 0, 0, 0.075 + 0.018 * i, P.cream, 0.018, 9);
      disk(a, 0.052, 0.019, 0, 0.068, P.cream, 0.014, 9);
      return at(w.b, a, -0.78, 2.98 + i * 0.18, -0.44);
    });
    // A tied parcel and a coil of rope make the wharf read at an oblique view.
    const wharfGear = group();
    cut(
      wharfGear,
      [
        [-0.21, 0],
        [0.22, 0],
        [0.22, 0.32],
        [-0.21, 0.32],
      ],
      0,
      0,
      0,
      P.wood,
      0.34,
    );
    for (const x of [-0.13, 0.13]) block(wharfGear, x, 0.17, 0.18, 0.042, 0.32, 0.035, P.straw);
    for (let i = 0; i < 3; i++)
      at(wharfGear, K.cyl(0.12, 0.12, 0.031, 12, P.straw), 0.3, 0.039 + i * 0.032, 0.16);
    s.place(wharfGear, -3.82, 0.97, 0.105);
    const helper = s.place(scale(K.person(P.rose), 0.85), 3.33, 0.84);
    s.place(K.tree('cypress', 1.36, 5), 4.12, -0.16);
    s.place(K.rock(0.64), -3.91, -0.83);
    const bird = gull();
    s.place(bird.display, -1.91, -1.36);
    const ring = s.place(lifesaver(), -1.51, 0.85, 0.22);
    s.hot(ring, 'find:0', '翻看碼頭救生圈', [0, 0.61, 0.1], 'lift');
    s.hot(helper, 'find:1', '和打樣師傅聊聊', [0, 0.72, 0.06], 'tap');
    const adjustStrips = observationStrips(w.b, ['打樣', '試用', '回改'], 0, 2.13, 0.8, '#c4d475');
    s.place(reedBed(0.64, false, true), -4.14, -0.43);
    s.place(reedBed(0.47, true), -3.32, 1.7);
    s.place(reedBed(0.62, false, true), -0.67, 0.34);
    s.place(reedBed(0.44, true), 3.54, 1.5);
    s.place(K.notebook('prologue'), -1.24, 1.64);
    sprig(s, 3.63, 0.77, 0.5);
    sprig(s, -3.91, 1.34, 0.48);
    let improved = false,
      learning = false,
      pulse = 0,
      sailing = 0,
      open = 0.3,
      time = 0;
    return {
      tick(t, dt) {
        time += Math.min(Number(dt) || 0.016, 0.07);
        const v = time;
        pulse = Math.max(0, pulse - 0.027);
        sailing = Math.max(0, sailing - 0.008);
        boat.position.y = 0.055 + Math.sin(v * 2) * 0.029 + sailing * 0.035;
        boat.position.x = Math.sin(v * 0.85) * 0.045 + sailing * Math.sin(v * 3) * 0.13;
        boat.rotation.z = Math.sin(v * 1.65) * 0.016 + sailing * 0.035;
        pennant.rotation.y = 0.25 * Math.sin(v * 2.8);
        w.flagObj.rotation.y = 0.3 * Math.sin(v * 2.1);
        const target = improved || pulse > 0.1 ? 1.04 : learning ? 0.74 : 0.3;
        open += (target - open) * 0.07;
        w.hinges[0].rotation.y = -open;
        w.hinges[1].rotation.y = open;
        w.bag.rotation.z = Math.sin(v * 2) * (0.023 + pulse * 0.15);
        steam.forEach((p, i) => {
          const n = (v * 0.46 + i / 3) % 1;
          p.position.y = 2.92 + n * 0.62;
          p.position.x = -0.78 + n * 0.2;
          p.scale.setScalar(0.37 + Math.sin(n * Math.PI) * 0.73);
        });
        ripples.forEach((p, i) => (p.scale.x = 0.9 + Math.sin(v * 1.3 + i) * 0.19));
        bird.wings.forEach((wing, i) => (wing.rotation.z = (i ? 1 : -1) * (0.05 + 0.13 * Math.sin(v * 1.7))));

        helper.rotation.y = -0.37 + Math.sin(v * 0.69) * 0.075;
      },
      update(state, action) {
        if (!state) return;
        improved = !!state.improved;
        learning = !!state.learning;
        const lastStep = typeof action === 'string' && /^step[0-2]$/.test(action) ? +action.slice(-1) : -1;
        adjustStrips(lastStep >= 0 ? lastStep : (state.steps?.at(-1) ?? -1));
        w.pocket.visible = improved;
        if (action === 'step1') sailing = 1;
        if (action === 'step2') pulse = 1;
        stack.visible = Boolean(state.steps?.includes(0));
        if (!state.log?.length) {
          stack.visible = false;
          pulse = 0;
          sailing = 0;
        }
      },
    };
  };

  function tramcar() {
    const tram = group();
    const silhouette = [
      [-1.4, 0.27],
      [-1.34, 0.9],
      [-1.22, 1.27],
      [-0.94, 1.37],
      [0.99, 1.37],
      [1.28, 1.24],
      [1.38, 0.99],
      [1.4, 0.32],
      [1.23, 0.2],
      [-1.25, 0.2],
    ];
    cut(tram, silhouette, 0, 0, 0, P.straw, 0.69);
    cut(
      tram,
      [
        [-1.38, 0.27],
        [-1.36, 0.63],
        [1.37, 0.63],
        [1.38, 0.3],
        [1.22, 0.22],
        [-1.22, 0.22],
      ],
      0,
      0,
      0.378,
      P.blue,
      0.032,
    );
    const stripe = cut(
      tram,
      [
        [-1.34, 0.53],
        [1.36, 0.53],
        [1.37, 0.61],
        [-1.35, 0.61],
      ],
      0,
      0,
      0.406,
      P.straw,
      0.02,
    );
    stripe.rotation.z = 0.007;
    for (let i = 0; i < 5; i++) {
      const x = -0.99 + i * 0.465;
      cut(
        tram,
        [
          [-0.166, 0.67],
          [0.165, 0.67],
          [0.147, 1.15],
          [-0.147, 1.15],
        ],
        x,
        0,
        0.378,
        P.bark,
        0.037,
      );
      cut(
        tram,
        [
          [-0.126, 0.72],
          [0.125, 0.72],
          [0.118, 1.1],
          [-0.119, 1.1],
        ],
        x,
        0,
        0.406,
        '#749d96',
        0.019,
      );
      cut(
        tram,
        [
          [-0.1, 0.74],
          [-0.024, 0.74],
          [0.09, 1.06],
          [0.04, 1.06],
        ],
        x,
        0,
        0.42,
        '#acc9b1',
        0.009,
      );
      block(tram, x, 0.735, 0.432, 0.27, 0.039, 0.03, P.cream);
    }
    const door = group();
    cut(
      door,
      [
        [0, 0.25],
        [0.36, 0.25],
        [0.34, 1.14],
        [0.02, 1.14],
      ],
      0,
      0,
      0,
      P.bottle,
      0.04,
    );
    block(door, 0.18, 0.83, 0.028, 0.25, 0.44, 0.02, P.sea);
    block(door, 0.27, 0.47, 0.047, 0.028, 0.12, 0.018, P.gold);
    at(tram, door, 0.71, 0, 0.445);
    cut(
      tram,
      [
        [-1.29, 1.24],
        [-1.05, 1.39],
        [1.08, 1.39],
        [1.32, 1.25],
      ],
      0,
      0,
      0,
      P.dark,
      0.79,
    );
    block(tram, 0, 1.398, 0, 1.78, 0.06, 0.61, P.grey);
    for (const x of [-0.92, 0.96]) {
      disk(tram, x, 0.215, 0.33, 0.182, P.ink, 0.13, 12);
      disk(tram, x, 0.215, 0.405, 0.072, P.sand, 0.025, 10);
    }
    const trolley = group();
    line(trolley, [-0.51, 0, 0], [0.03, 0.36, 0], 0.025, P.dark);
    line(trolley, [0.03, 0.36, 0], [0.52, 0.05, 0], 0.025, P.dark);
    block(trolley, 0.03, 0.36, 0, 0.37, 0.037, 0.07, P.bark);
    at(tram, trolley, -0.07, 1.42, 0);
    print(tram, '海岸線', -0.43, 0.45, 0.442, 0.59, 0.175, P.blue, P.chalk);
    disk(tram, -1.17, 0.43, 0.431, 0.057, P.gold, 0.029);
    return { tram, door, trolley };
  }

  function chair() {
    const chair = group();
    for (const x of [-0.29, 0.29])
      for (const z of [-0.21, 0.22]) line(chair, [x * 1.14, 0.02, z * 1.18], [x, 0.52, z], 0.045, P.bark);
    block(chair, 0, 0.5, 0, 0.76, 0.1, 0.6, P.gold);
    for (const x of [-0.32, 0.32]) line(chair, [x, 0.49, -0.19], [x, 0.98, -0.26], 0.038, P.bark);
    const back = cut(
      chair,
      [
        [-0.35, 0],
        [0.36, 0],
        [0.36, 0.29],
        [0.28, 0.35],
        [-0.28, 0.35],
        [-0.35, 0.28],
      ],
      0,
      0.67,
      -0.236,
      P.rose,
      0.078,
    );
    back.rotation.x = -0.1;
    for (const x of [-0.27, 0.27]) disk(chair, x, 0.77, -0.18, 0.025, P.straw, 0.019, 8);
    return chair;
  }

  function platform() {
    const b = group();
    block(b, 0, 0.12, -0.02, 2.62, 0.24, 1.57, P.sand);
    block(b, 0, 0.26, -0.02, 2.67, 0.055, 1.62, P.cream);
    for (let i = 0; i < 9; i++) block(b, -1.18 + 0.29 * i, 0.294, 0.68, 0.17, 0.018, 0.09, P.gold);
    const profile = [
      [-1.4, 0],
      [-1.38, 0.18],
      [-1.05, 0.56],
      [-0.64, 0.78],
      [0, 0.86],
      [0.62, 0.78],
      [1.03, 0.57],
      [1.38, 0.19],
      [1.4, 0],
    ];
    const rib = [
      ...profile,
      [1.27, 0],
      [1.25, 0.15],
      [0.96, 0.44],
      [0.56, 0.65],
      [0, 0.74],
      [-0.57, 0.65],
      [-0.98, 0.43],
      [-1.25, 0.14],
      [-1.27, 0],
    ];
    cut(b, profile, 0, 1.85, -0.6, '#8aa69a', 0.05);
    for (const z of [-0.64, -0.1, 0.57]) cut(b, rib, 0, 1.85, z, P.bottle, 0.065);
    for (let i = 0; i < 8; i++) {
      const a = profile[i],
        q = profile[i + 1];
      const len = Math.hypot(q[0] - a[0], q[1] - a[1]);
      const cap = block(
        b,
        (q[0] + a[0]) / 2,
        1.86 + (q[1] + a[1]) / 2,
        0.005,
        len + 0.02,
        0.051,
        1.41,
        i % 2 ? P.mint : '#90ad9e',
      );
      cap.rotation.z = Math.atan2(q[1] - a[1], q[0] - a[0]);
      const trim = block(
        b,
        (q[0] + a[0]) / 2,
        1.86 + (q[1] + a[1]) / 2,
        0.72,
        len + 0.035,
        0.087,
        0.065,
        P.cream,
      );
      trim.rotation.z = cap.rotation.z;
    }
    for (const x of [-1.25, 1.25]) {
      post(b, x, 0.54, 1.94, 0.11, P.bottle);
      post(b, x, -0.55, 1.94, 0.105, P.bottle);
      block(b, x, 0.44, 0.54, 0.16, 0.35, 0.16, P.wood);
      line(b, [x, 1.51, 0.54], [x * 0.71, 1.94, 0.54], 0.043, P.gold);
    }
    block(b, 0, 1.88, 0.54, 2.62, 0.09, 0.11, P.bottle);
    line(b, [-0.45, 1.91, 0.52], [-0.45, 1.7, 0.52], 0.02, P.bark);
    line(b, [0.45, 1.91, 0.52], [0.45, 1.7, 0.52], 0.02, P.bark);
    const fascia = print(b, '通 勤 月 台', 0, 1.61, 0.56, 1.17, 0.29, P.bottle, P.chalk);
    const clock = group();
    disk(clock, 0, 0, 0, 0.253, P.gold, 0.07, 16);
    disk(clock, 0, 0, 0.053, 0.212, P.cream, 0.045, 16);
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      const mark = block(clock, Math.sin(a) * 0.17, Math.cos(a) * 0.17, 0.095, 0.018, 0.043, 0.01, P.bark);
      mark.rotation.z = -a;
    }
    line(clock, [0, 0, 0.103], [0.095, 0.105, 0.103], 0.013, P.ink);
    line(clock, [0, 0, 0.103], [-0.071, 0.041, 0.103], 0.015, P.ink);
    at(b, clock, 0.94, 1.48, 0.57);
    const seat = chair(),
      chairGrip = group();
    at(chairGrip, seat, 0, 0, 0);
    at(b, chairGrip, 0, 0.295, 0.42);
    return { b, fascia, seat, chairGrip };
  }

  function umbrella(c) {
    const u = group();
    const lobes = [
      [-0.49, 0],
      [-0.43, 0.14],
      [-0.24, 0.28],
      [0, 0.37],
      [0.27, 0.27],
      [0.44, 0.13],
      [0.51, 0],
      [0.38, 0.07],
      [0.24, 0],
      [0.12, 0.07],
      [0, 0],
      [-0.13, 0.07],
      [-0.24, 0],
      [-0.37, 0.07],
    ];
    cut(u, lobes, 0, 0.69, 0, c, 0.065);
    cut(
      u,
      [
        [-0.23, 0],
        [-0.13, 0.18],
        [0, 0.36],
        [0.12, 0.17],
        [0.24, 0],
        [0.12, 0.06],
        [0, 0],
        [-0.12, 0.06],
      ],
      0,
      0.692,
      0.042,
      P.straw,
      0.02,
    );
    line(u, [0, 1.08, 0], [0, 0.12, 0], 0.028, P.bark);
    line(u, [0, 0.12, 0], [0.06, 0.06, 0], 0.028, P.bark);
    line(u, [0.06, 0.06, 0], [0.13, 0.14, 0], 0.028, P.bark);
    return u;
  }

  sets.distance = function (s) {
    const K = kit();
    landscape(s, ['#839a95', '#768e81'], -0.17);
    const west = group();
    for (let i = 0; i < 3; i++) {
      const x = -0.94 + i * 0.76,
        h = 1.38 + (i % 2) * 0.52;
      cut(
        west,
        [
          [-0.33, 0],
          [0.33, 0],
          [0.33, h],
          [0.2, h + 0.08],
          [-0.32, h + 0.08],
        ],
        x,
        0,
        0,
        i % 2 ? P.mint : P.grey,
        0.14,
      );
      for (let j = 0; j < 3; j++)
        for (const off of [-0.15, 0.15])
          block(west, x + off, 0.43 + j * 0.33, 0.088, 0.105, 0.14, 0.021, P.straw);
    }
    s.place(west, -2.78, -2.07);
    s.place(K.cloud(0.97), -2.86, -2.21);
    s.place(K.cloud(0.72), 0.78, -2.18);
    const rails = group();
    for (let i = 0; i < 13; i++) block(rails, -1.85 + i * 0.29, 0.047, 0, 0.12, 0.08, 0.88, P.bark);
    for (const z of [-0.29, 0.29]) block(rails, -0.05, 0.108, z, 4.12, 0.055, 0.047, P.grey);
    s.place(rails, -2.38, 0.01);
    const tr = tramcar(),
      tramGrip = group();
    at(tramGrip, tr.tram, 0, 0, 0, -0.075);
    s.place(tramGrip, -2.54, -0.03, 0.16);
    s.hot(tramGrip, 'seat0', '下車時聽見什麼？', [0, 1.37, 0], 'slide');
    const pow = group();
    post(pow, 0, 0, 2.13, 0.092, P.wood);
    line(pow, [0, 2.11, 0], [0.54, 2.11, 0.27], 0.041, P.grey);
    line(pow, [0, 1.71, 0], [0.53, 2.09, 0.27], 0.034, P.bark);
    s.place(pow, -4.16, -0.88);
    const st = platform();
    s.place(st.b, 1.94, -0.48);
    s.hot(st.chairGrip, 'ask1', '轉椅追問通勤情境', [0, 0.81, 0.04], 'spin');
    const office = group();
    cut(
      office,
      [
        [-0.42, 0],
        [0.42, 0],
        [0.42, 1.57],
        [0, 1.85],
        [-0.42, 1.57],
      ],
      0,
      0,
      0,
      P.grey,
      0.16,
    );
    cut(office, side(-0.22, 0.03, 0.44, 0.77), 0, 0, 0.105, P.bottle, 0.05);
    print(office, '辦公室', 0, 1.29, 0.13, 0.64, 0.2, P.cream, P.ink);
    block(office, -0.1, 0.51, 0.151, 0.04, 0.075, 0.02, P.gold);
    s.place(office, 3.86, -1.04);
    s.hot(office, 'seat2', '走進辦公室', [0, 1.2, 0]);
    const rack = group();
    block(rack, 0, 0.06, 0, 0.86, 0.11, 0.42, P.wood);
    post(rack, -0.33, 0, 0.72, 0.065, P.bark);
    post(rack, 0.33, 0, 0.72, 0.065, P.bark);
    block(rack, 0, 0.7, 0, 0.77, 0.08, 0.12, P.sand);
    const tested = umbrella(P.brick);
    at(rack, tested, 0.04, 0.2, 0.045);
    s.place(rack, 3.56, 0.83);
    s.hot(rack, 'pick0', '試用單手收傘', [0, 0.82, 0], 'lift');
    const busMarker = group();
    post(busMarker, 0, 0, 1.15, 0.055, P.bottle);
    disk(busMarker, 0, 1.18, 0, 0.19, P.brick, 0.045, 16);
    block(busMarker, 0, 1.18, 0.035, 0.22, 0.046, 0.021, P.cream);
    s.place(busMarker, -4.07, 0.87);
    s.place(K.tree('round', 1.21, 8), 4.11, -1.74);
    const commuter = scale(K.person(P.blue), 0.84);
    s.place(commuter, -0.63, 0.38);
    const gutter = group();
    block(gutter, 0, 0.042, 0, 0.59, 0.035, 0.24, P.bark);
    for (let i = 0; i < 7; i++) block(gutter, -0.23 + i * 0.077, 0.066, 0, 0.032, 0.019, 0.21, P.grey);
    s.place(gutter, 2.71, 1.04);
    const puddles = group();
    for (let i = 0; i < 2; i++) {
      const patch = cut(
        puddles,
        [
          [-0.38, 0],
          [-0.25, -0.1],
          [0.13, -0.13],
          [0.38, -0.02],
          [0.3, 0.07],
          [-0.11, 0.1],
        ],
        i * 0.53,
        0.04,
        i * 0.18,
        '#87aaa4',
        0.014,
      );
      patch.rotation.x = -Math.PI / 2;
      block(puddles, i * 0.53, 0.058, 0.024 + i * 0.18, 0.19, 0.013, 0.017, P.cream);
    }
    s.place(puddles, -3.12, 1.38);
    s.hot(commuter, 'find:0', '留意下車的通勤者', [0, 0.68, 0.08], 'tap');
    s.hot(puddles, 'find:1', '查看月台前的積水', [0.19, 0.06, 0.06], 'tap');
    const markStop = observationStrips(st.b, ['下車', '轉乘', '到站'], 0, 1.67, 0.69, '#c4d475');
    s.place(reedBed(0.4, true), 3.92, 1.57);
    s.place(reedBed(0.53), -0.72, -1.47);
    const weather = group();
    const rain = [];
    for (let i = 0; i < 14; i++) {
      const x = -1.2 + (i % 7) * 0.38,
        y = 1.49 + ((i * 7) % 11) * 0.095,
        z = -0.21 + Math.floor(i / 7) * 0.69;
      const drop = block(weather, x, y, z, 0.023, 0.17 + (i % 2) * 0.06, 0.024, '#bad3c7');
      drop.rotation.z = -0.24;
      rain.push({ drop, base: y, x });
    }
    s.place(weather, -2.64, -0.13);
    s.place(K.notebook('prologue'), -1.35, 1.58);
    sprig(s, -4.03, 1.04, 0.43);
    sprig(s, 3.81, 1.63, 0.42);
    let choice = 0,
      pulse = 0,
      target = 0,
      turn = 0,
      trainPulse = 0,
      feature = -1,
      time = 0;
    return {
      tick(t, dt) {
        time += Math.min(Number(dt) || 0.016, 0.075);
        const v = time;
        pulse = Math.max(0, pulse - 0.019);
        trainPulse = Math.max(0, trainPulse - 0.008);
        turn += (target - turn) * 0.065;
        st.seat.rotation.y = turn + Math.sin(v * 0.9) * 0.034;
        tr.tram.rotation.z = Math.sin(v * 2.4) * 0.008;
        tr.tram.position.x = 0.08 * Math.sin(v * 0.47) + trainPulse * Math.sin(v * 3) * 0.12;
        tr.door.position.x = 0.71 + 0.23 * (0.5 + 0.5 * Math.sin(v * 0.75)) + trainPulse * 0.12;
        tested.rotation.z = Math.sin(v * 1.4) * (0.024 + pulse * 0.14);
        tested.scale.setScalar(feature === 0 ? 0.88 + 0.08 * Math.sin(v * 2.0) : 1);
        commuter.rotation.y = choice === 2 ? 0.65 : -0.32;
        rain.forEach(({ drop, base, x }, i) => {
          const f = (v * 0.78 + i / 14) % 1;
          drop.position.y = base - f * 0.83;
          drop.position.x = x + f * 0.15;
          drop.visible = f > 0.06 && f < 0.94;
        });
      },
      update(state, a) {
        if (!state) return;
        choice = state.seat || 0;
        markStop(choice);
        feature = state.feature;
        if (a === 'ask1') target += Math.PI * 0.83;
        if (a === 'seat0') trainPulse = 1;
        if (a?.startsWith('pick')) pulse = 1;
        if (!state.seen && state.question === -1) target = choice * 0.65;
      },
    };
  };

  function filmStation() {
    const station = group();
    for (const sx of [-0.56, 0.56]) {
      line(station, [sx, 0, 0.23], [sx * 0.78, 1.1, 0], 0.065, P.bark);
      line(station, [sx, 0, -0.32], [sx * 0.78, 1.1, 0], 0.06, P.wood);
    }
    block(station, 0, 0.9, 0, 1.46, 0.13, 0.67, P.wood);
    const projector = group();
    cut(
      projector,
      [
        [-0.45, 0],
        [0.43, 0],
        [0.45, 0.53],
        [0.31, 0.68],
        [-0.38, 0.64],
        [-0.46, 0.55],
      ],
      0,
      0,
      0,
      P.bottle,
      0.49,
    );
    const reels = [];
    for (const x of [-0.25, 0.29]) {
      const r = group();
      disk(r, 0, 0, 0, 0.24, P.ink, 0.1, 14);
      disk(r, 0, 0, 0.068, 0.195, P.sand, 0.031, 14);
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        disk(r, Math.cos(a) * 0.105, Math.sin(a) * 0.105, 0.097, 0.048, P.ink, 0.013, 8);
      }
      disk(r, 0, 0, 0.101, 0.042, P.gold, 0.025, 8);
      at(projector, r, x, 0.73, 0.17);
      reels.push(r);
    }
    const lens = cut(
      projector,
      [
        [0, 0],
        [0.24, -0.09],
        [0.28, 0.23],
        [0, 0.17],
      ],
      0.44,
      0.17,
      0,
      P.ink,
      0.34,
    );
    lens.rotation.z = 0.02;
    disk(projector, -0.18, 0.32, 0.265, 0.087, P.gold, 0.042);
    at(station, projector, 0, 0.995, 0);
    return { station, reels };
  }

  function photoCard() {
    const c = group();
    cut(c, side(-0.34, 0, 0.68, 0.61), 0, 0, 0, P.chalk, 0.046);
    cut(c, side(-0.27, 0.136, 0.54, 0.41), 0, 0, 0.031, P.sea, 0.012);
    cut(
      c,
      [
        [-0.26, 0.16],
        [-0.06, 0.41],
        [0.04, 0.3],
        [0.14, 0.38],
        [0.27, 0.16],
      ],
      0,
      0,
      0.048,
      P.bottle,
      0.013,
    );
    disk(c, 0.142, 0.475, 0.05, 0.043, P.straw, 0.011, 10);
    return c;
  }
  function signBoard(txt, c) {
    const g = group();
    post(g, 0, 0, 0.92, 0.101, P.bark);
    cut(
      g,
      [
        [-0.48, 0.52],
        [0.46, 0.52],
        [0.5, 1.29],
        [-0.46, 1.34],
      ],
      0,
      0,
      0,
      c,
      0.085,
    );
    print(g, txt, 0, 0.88, 0.062, 0.79, 0.31, c, P.chalk);
    for (const x of [-0.39, 0.39]) disk(g, x, 1.23, 0.065, 0.023, P.gold, 0.023, 8);
    return g;
  }
  function tapeArch() {
    const arch = group();
    for (const sign of [-1, 1]) {
      const x = 1.14 * sign;
      cut(
        arch,
        [
          [-0.2, 0],
          [0.22, 0],
          [0.16, 0.23],
          [0.145, 2.25],
          [0.21, 2.44],
          [-0.17, 2.5],
          [-0.12, 2.24],
          [-0.13, 0.18],
        ],
        x,
        0,
        0,
        P.wood,
        0.32,
      );
      line(arch, [x, 0.13, -0.1], [x * 1.15, 0.04, -0.69], 0.068, P.bark);
      line(arch, [x, 1.79, 0.03], [x * 0.56, 2.29, 0.03], 0.087, P.bark);
      line(arch, [x, 2.05, 0], [x * 1.36, 2.42, 0], 0.046, P.wood);
      for (let j = 0; j < 2; j++) {
        const leaf = cut(
          arch,
          [
            [0, 0],
            [0.16, 0.27],
            [0.38, 0.29],
            [0.31, 0.13],
          ],
          x * 1.2,
          2.22 + j * 0.09,
          0.03,
          j ? P.sage : P.mint,
          0.035,
        );
        if (sign < 0) leaf.scale.x = -1;
      }
      disk(arch, x, 2.27, 0.19, 0.054, P.gold, 0.04);
    }
    cut(
      arch,
      [
        [-1.44, 2.14],
        [-0.63, 2.17],
        [0.05, 2.1],
        [0.65, 2.14],
        [1.43, 2.12],
        [1.38, 2.5],
        [0.5, 2.46],
        [-0.05, 2.52],
        [-0.7, 2.48],
        [-1.39, 2.54],
      ],
      0,
      0,
      0.055,
      P.brick,
      0.2,
    );
    print(arch, '終    點', 0, 2.315, 0.17, 1.19, 0.25, P.brick, P.chalk);
    for (const side of [-1, 1])
      for (let i = 0; i < 3; i++)
        for (let row = 0; row < 2; row++)
          if ((i + row) % 2 === 0)
            block(arch, side * (0.79 + i * 0.14), 2.24 + row * 0.135, 0.177, 0.126, 0.125, 0.012, P.cream);
    const ribbonL = group(),
      ribbonR = group();
    cut(
      ribbonL,
      [
        [0, 0],
        [0.62, -0.07],
        [1.07, -0.075],
        [1.18, 0.06],
        [0.65, 0.04],
        [0, 0.13],
      ],
      0,
      0,
      0,
      P.gold,
      0.023,
    );
    cut(
      ribbonR,
      [
        [0, 0],
        [-0.59, -0.055],
        [-1.13, -0.05],
        [-1.04, 0.074],
        [-0.54, 0.09],
        [0, 0.13],
      ],
      0,
      0,
      0,
      P.rose,
      0.023,
    );
    at(arch, ribbonL, -1.04, 1.05, 0.17);
    at(arch, ribbonR, 1.04, 1.05, 0.19);
    return { arch, ribbonL, ribbonR };
  }

  sets.witness = function (s) {
    const K = kit();
    landscape(s, ['#91a68c', '#688669'], 0.14);
    s.place(K.sun(0.34), -1.27, -2.25);
    const grove = [
      [-4.05, -1.85, 1.71],
      [-3.3, -2.01, 1.24],
      [-0.72, -1.8, 1.64],
      [0.57, -1.98, 1.81],
      [3.73, -1.96, 1.92],
      [4.22, -1.07, 1.37],
    ];
    grove.forEach(([x, z, h], i) => pine(s, x, z, h, i + 3));
    const aw = group();
    const bunt = clothline(aw, -1.45, 1.18, 1.97, -0.28, [P.gold, P.brick, P.sea, P.cream, P.gold]);
    s.place(aw, -2.64, -1.15);
    pine(s, -4.18, -0.22, 1.21, 17);
    pine(s, 4.19, -0.1, 1.27, 9);
    s.place(K.rock(0.72), -3.61, 0.2);
    s.place(K.rock(0.57), 3.48, 1.29);
    const race = tapeArch();
    s.place(race.arch, 1.91, -0.65);
    const matchWitness = impressionPress(race.arch, 0, 2.53, 0.08, 1.02);
    s.hot(race.ribbonL, 'find:1', '展開終點緞帶', [0.47, 0.01, 0.025], 'lift');
    const path = group();
    const road = cut(
      path,
      [
        [-0.69, -0.99],
        [-0.43, -0.04],
        [-1.07, 1.58],
        [-0.54, 1.65],
        [0.55, 1.16],
        [0.57, 0.42],
        [0.38, -0.21],
        [0.71, -0.99],
      ],
      0,
      0,
      0,
      '#c98f6b',
      0.023,
    );
    road.rotation.x = Math.PI / 2;
    s.place(path, 1.95, 0.29, 0.06);
    const lanes = group();
    for (const x of [-0.56, 0.01, 0.55])
      line(lanes, [x, 0.031, -0.46], [x - 0.24, 0.041, 0.91], 0.016, P.cream);
    s.place(lanes, 2.05, 0.22, 0.065);
    const camera = filmStation();
    s.place(camera.station, -2.69, -0.31);
    s.hot(camera.station, 'doc0', '調閱終點原始影像', [0, 1.47, 0.08], 'lift');
    const photo = photoCard();
    at(camera.station, photo, 0.52, 0.97, 0.3);
    photo.rotation.z = -0.12;
    const microphone = group();
    block(microphone, 0, 0.052, 0, 0.48, 0.1, 0.42, P.bark);
    post(microphone, 0, 0, 1.28, 0.067, P.ink);
    line(microphone, [0, 1.24, 0], [-0.24, 1.42, 0.1], 0.045, P.ink);
    const mic = group();
    cut(
      mic,
      [
        [-0.08, 0],
        [0.08, 0],
        [0.15, 0.29],
        [0.11, 0.39],
        [-0.05, 0.41],
        [-0.13, 0.33],
      ],
      0,
      0,
      0,
      P.ink,
      0.135,
    );
    for (let i = 0; i < 3; i++) block(mic, 0.007, 0.236 + i * 0.051, 0.079, 0.17, 0.014, 0.014, P.sage);
    block(mic, 0, 0.12, 0.015, 0.28, 0.137, 0.17, P.straw);
    at(microphone, mic, -0.24, 1.42, 0.1);
    s.place(microphone, 0.56, 0.72);
    s.hot(microphone, 'doc1', '聽當事人錄音', [0, 1.26, 0.04], 'lift');
    const news = signBoard('熱門轉貼', P.brick);
    s.place(news, -3.77, 0.96);
    s.hot(news, 'doc2', '翻看熱門轉貼', [0, 1.03, 0], 'lift');
    const record = signBoard('完賽名冊', P.bottle);
    s.place(record, 3.64, 0.69);
    s.hot(record, 'doc3', '核對完賽名冊', [0, 1.03, 0], 'lift');
    s.place(reedBed(0.52, true), -0.8, 0.03);
    s.place(reedBed(0.62), 4.03, 0.62);
    s.place(reedBed(0.42, true), -3.64, 1.56);
    s.place(foldedCone(), 1.19, 1.23);
    s.place(scale(foldedCone(), 0.84), 1.31, 0.69);
    const tandem = group();
    const runners = [
      at(tandem, scale(K.person(P.gold), 0.98), -0.36, 0, -0.23),
      at(tandem, scale(K.person(P.red), 0.9), 0.36, 0, -0.11),
    ];
    s.place(tandem, 1.87, 0);
    s.hot(tandem, 'find:0', '看兩位跑者如何抵達', [-0.36, 0.65, -0.2], 'tap');
    const selected = [camera.station, microphone, news, record].map((obj, i) => {
      const mark = group();
      cut(
        mark,
        [
          [0, 0],
          [0.19, -0.12],
          [0.34, 0],
          [0.34, 0.3],
          [0, 0.3],
        ],
        0,
        0,
        0,
        P.gold,
        0.026,
      );
      line(mark, [0.07, 0.14, 0.024], [0.14, 0.08, 0.024], 0.02, P.bottle);
      line(mark, [0.14, 0.08, 0.024], [0.27, 0.23, 0.024], 0.02, P.bottle);
      at(obj, mark, i === 0 ? 0.59 : i === 1 ? 0.04 : 0.28, i === 0 ? 1.75 : i === 1 ? 1.08 : 1.18, 0.2);
      mark.visible = false;
      return mark;
    });
    s.place(K.notebook('people'), -1.31, 1.53);
    sprig(s, -3.59, 1.67, 0.43);
    sprig(s, 3.07, 1.22, 0.42);
    let pulse = 0,
      last = -1,
      hasPhoto = false,
      hasVoice = false,
      time = 0;
    return {
      tick(t, dt) {
        time += Math.min(Number(dt) || 0.016, 0.075);
        const v = time;
        pulse = Math.max(0, pulse - 0.018);
        const pace = (Math.sin(v * 0.66) + 1) * 0.5;
        matchWitness(hasPhoto && hasVoice, dt);
        camera.reels.forEach((r, i) => (r.rotation.z = v * (hasPhoto ? 1.36 : 0.32) * (i ? 1 : -1)));
        runners.forEach((r, i) => {
          r.position.z = -0.32 + i * 0.1 + pace * (hasPhoto || hasVoice ? 0.74 : 0.36);
          r.rotation.z = Math.sin(v * 4.3 + i * 2.4) * 0.035;
        });
        race.ribbonL.rotation.y = 0.22 + pace * 0.45;
        race.ribbonR.rotation.y = -0.18 - pace * 0.48;
        mic.rotation.z = last === 1 ? Math.sin(v * 5) * pulse * 0.13 : -0.1;
        bunt.forEach((b, i) => (b.rotation.y = Math.sin(v * 1.7 + i) * 0.17));
        photo.rotation.z = -0.12 + Math.sin(v * 4) * pulse * (last === 0 ? 0.12 : 0);
      },
      update(state, a) {
        if (!state) return;
        const picks = state.picks || [];
        selected.forEach((obj, i) => {
          obj.visible = picks.includes(i);
        });
        hasPhoto = picks.includes(0);
        hasVoice = picks.includes(1);
        if (a?.startsWith('doc')) {
          last = +a.slice(3);
          pulse = 1;
        }
      },
    };
  };

  function spectator(coat, cap) {
    const g = group();
    cut(
      g,
      [
        [-0.16, 0],
        [0.15, 0],
        [0.12, 0.24],
        [0.075, 0.3],
        [-0.06, 0.3],
        [-0.13, 0.22],
      ],
      0,
      0,
      0,
      coat,
      0.055,
    );
    cut(
      g,
      [
        [-0.067, 0.27],
        [0.044, 0.25],
        [0.09, 0.32],
        [0.083, 0.406],
        [0.031, 0.441],
        [-0.049, 0.43],
        [-0.087, 0.365],
      ],
      0,
      0,
      0.023,
      '#d7a471',
      0.06,
    );
    cut(
      g,
      [
        [-0.1, 0.386],
        [0.1, 0.381],
        [0.143, 0.394],
        [0.075, 0.42],
        [0.043, 0.459],
        [-0.049, 0.458],
        [-0.091, 0.426],
      ],
      0,
      0,
      0.06,
      cap,
      0.034,
    );
    return g;
  }
  function bleachers(makeSpectator = spectator) {
    const b = group();
    // Saw-cut side plates carry the three folded seating tiers.
    for (const x of [-1.32, 1.32]) {
      const gusset = cut(
        b,
        [
          [-0.83, 0],
          [0.81, 0],
          [0.81, 0.34],
          [0.31, 0.34],
          [0.31, 0.65],
          [-0.17, 0.65],
          [-0.17, 0.98],
          [-0.83, 0.98],
        ],
        x,
        0,
        0,
        P.brick,
        0.097,
      );
      gusset.rotation.y = -Math.PI / 2;
    }
    const crowd = [];
    for (let row = 0; row < 3; row++) {
      const z = 0.54 - row * 0.47,
        h = 0.26 + row * 0.32;
      block(b, 0, h, z, 2.8, 0.095, 0.46, row % 2 ? P.wood : P.sand);
      block(b, 0, h - 0.1, z + 0.23, 2.74, 0.13, 0.06, P.brick);
      for (let i = 0; i < 6; i++) {
        if (row === 0 && (i === 0 || i === 5)) continue;
        const sp = makeSpectator(
          [P.brick, P.sage, P.gold, P.blue, P.rose, P.cream][(i + row * 2) % 6],
          i % 3 ? P.bottle : P.red,
          i + row * 2,
        );
        at(b, sp, -1.1 + 0.44 * i, h + 0.047, z - 0.06);
        crowd.push(sp);
      }
    }
    for (const x of [-1.31, 1.31]) {
      post(b, x, -0.67, 2.16, 0.111, P.bottle);
      line(b, [x, 0.18, 0.73], [x, 0.79, 0.73], 0.045, P.wood);
      line(b, [x, 1.59, -0.65], [x, 2.04, -0.06], 0.055, P.bottle);
    }
    line(b, [-1.3, 0.75, 0.73], [1.3, 0.75, 0.73], 0.038, P.wood);
    const canopy = block(b, 0, 2.01, -0.15, 3.12, 0.07, 1.42, P.straw);
    canopy.rotation.x = 0.17;
    for (let i = 0; i < 11; i++) {
      const strip = block(b, -1.4 + i * 0.277, 2.054, -0.15, 0.17, 0.022, 1.4, i % 2 ? P.cream : P.brick);
      strip.rotation.x = 0.17;
      cut(
        b,
        [
          [-0.135, 0],
          [0.135, 0],
          [0.135, -0.11],
          [0.056, -0.15],
          [-0.073, -0.15],
          [-0.135, -0.1],
        ],
        -1.385 + i * 0.276,
        1.94,
        0.555,
        i % 2 ? P.cream : P.red,
        0.025,
      );
    }
    const score = group();
    cut(
      score,
      [
        [-0.93, 0],
        [0.93, 0],
        [0.93, 0.6],
        [0.64, 0.6],
        [0.51, 0.73],
        [-0.52, 0.73],
        [-0.66, 0.6],
        [-0.93, 0.6],
      ],
      0,
      0,
      0,
      P.bottle,
      0.095,
    );
    print(score, '主 場 記 分', 0, 0.49, 0.063, 1.49, 0.23, P.bottle, P.chalk);
    print(score, '主  2', -0.46, 0.205, 0.063, 0.65, 0.22, P.bottle, P.straw);
    print(score, '客  1', 0.46, 0.205, 0.063, 0.65, 0.22, P.bottle, P.straw);
    for (const x of [-0.81, 0.81]) disk(score, x, 0.485, 0.064, 0.027, P.gold, 0.028, 8);
    at(b, score, 0, 2.07, -0.51);
    const lights = [];
    for (const x of [-0.76, 0.76]) {
      const light = disk(b, x, 2.71, -0.435, 0.068, P.gold, 0.032, 10);
      lights.push(light);
    }
    const pennants = [];
    for (const x of [-1.28, 1.28]) {
      const p = group();
      post(p, 0, 0, 0.77, 0.043, P.bark);
      pennants.push(flag(p, 0, 0.75, 0, 0.4, 0.19, x < 0 ? P.red : P.blue));
      at(b, p, x, 1.99, -0.45);
    }
    return { b, crowd, score, pennants, lights };
  }

  function paradeDrum() {
    const drum = group();
    const body = kit().cyl(0.45, 0.45, 0.59, 14, P.brick);
    at(drum, body, 0, 0.63, 0.04);
    body.rotation.x = 0.18;
    for (const y of [0.345, 0.91])
      at(drum, kit().cyl(0.47, 0.47, 0.055, 14, P.straw), 0, y, 0.04 + (y - 0.63) * 0.18).rotation.x = 0.18;
    at(drum, kit().cyl(0.421, 0.421, 0.025, 14, P.cream), 0, 0.951, 0.097).rotation.x = 0.18;
    for (let i = 0; i < 10; i++) {
      const a = (2 * Math.PI * i) / 10,
        q = a + Math.PI / 10;
      line(
        drum,
        [0.43 * Math.cos(a), 0.87, 0.11 + 0.43 * Math.sin(a)],
        [0.44 * Math.cos(q), 0.39, 0.044 + 0.44 * Math.sin(q)],
        0.021,
        P.cream,
      );
    }
    const sticks = [];
    for (const s of [-1, 1]) {
      line(drum, [s * 0.31, 0.024, -0.19], [s * 0.23, 0.46, 0.2], 0.047, P.wood);
      line(drum, [s * 0.31, 0.024, 0.24], [s * 0.23, 0.46, -0.16], 0.047, P.bark);
      const stick = group();
      line(stick, [0, 0, 0], [s * 0.17, 0.33, 0], 0.025, P.wood);
      disk(stick, s * 0.17, 0.34, 0, 0.06, P.straw, 0.074, 10);
      at(drum, stick, s * 0.27, 1.0, -0.02);
      stick.rotation.z = s * 0.35;
      sticks.push(stick);
    }
    print(drum, '應 援', 0, 0.64, 0.47, 0.37, 0.17, P.brick, P.cream);
    return { drum, sticks };
  }

  sets.memory = function (s) {
    const K = kit();
    landscape(s, ['#9fac8d', '#78937b'], -0.2);
    s.place(K.sun(0.38), -2.49, -2.21);
    s.place(K.cloud(0.68), 3.54, -2.21);
    const field = group();
    function turf(pts, y, c, d = 0.02) {
      const a = cut(field, pts, 0, y, 0, c, d);
      a.rotation.x = Math.PI / 2;
      return a;
    }
    turf(
      [
        [-1.65, -1.01],
        [-1.31, -1.42],
        [-0.69, -1.6],
        [0.19, -1.59],
        [0.92, -1.26],
        [1.45, -0.74],
        [1.62, -0.22],
        [0.15, 1.29],
        [-0.12, 1.4],
        [-1.72, -0.34],
      ],
      0.018,
      '#8caa73',
    );
    turf(
      [
        [0, 1.03],
        [-1.03, 0],
        [0, -1.03],
        [1.03, 0],
      ],
      0.043,
      '#c18355',
    );
    turf(
      [
        [0, 0.62],
        [-0.62, 0],
        [0, -0.62],
        [0.62, 0],
      ],
      0.059,
      '#a2ad72',
    );
    line(field, [-1.49, 0.077, -0.41], [0, 0.077, 1.06], 0.017, P.cream);
    line(field, [0, 0.077, 1.06], [1.48, 0.077, -0.41], 0.017, P.cream);
    for (const [x, z] of [
      [0, -0.98],
      [-0.98, 0],
      [0.98, 0],
      [0, 1.01],
    ])
      block(field, x, 0.082, z, 0.14, 0.028, 0.14, P.cream).rotation.y = Math.PI / 4;
    at(field, K.cyl(0.18, 0.19, 0.038, 10, P.sand), 0, 0.079, 0);
    const pitcher = at(field, scale(K.person(P.straw), 0.53), 0.03, 0.096, 0.04);
    const fielder = at(field, scale(K.person(P.rose), 0.47), -0.88, 0.07, -0.56);
    const ball = disk(field, 0, 0.68, 0.11, 0.064, P.chalk, 0.077, 10);
    s.place(field, -2.42, -0.13, 0.038);
    const grand = bleachers();
    s.place(grand.b, 2.13, -0.64);
    s.hot(grand.b, 'time1', '在第七局招呼全場', [0, 2.34, -0.45]);
    const large = paradeDrum();
    s.place(large.drum, -3.51, 0.88);
    large.drum.rotation.y = 0.13;
    s.hot(large.drum, 'role1', '轉動球場應援鼓', [0, 1.14, 0], 'spin');
    const kiosk = group();
    post(kiosk, -0.32, 0, 1.12, 0.083, P.bark);
    post(kiosk, 0.32, 0, 1.12, 0.083, P.bark);
    cut(
      kiosk,
      [
        [-0.47, 0.5],
        [0.47, 0.5],
        [0.47, 1.12],
        [0.37, 1.25],
        [-0.36, 1.25],
        [-0.47, 1.14],
      ],
      0,
      0,
      0,
      P.blue,
      0.075,
    );
    print(kiosk, '下一季', 0, 0.96, 0.049, 0.69, 0.235, P.blue, P.chalk);
    print(kiosk, '保 留 鼓 點', 0, 0.73, 0.049, 0.73, 0.16, P.blue, P.straw);
    const tickets = group();
    for (let i = 0; i < 3; i++)
      loosePaper(tickets, -0.18 + i * 0.12, 0.26 + i * 0.045, 0.05, 0.26, 0.32, 0.17 + i * 0.1);
    at(kiosk, tickets, 0, 0, 0);
    s.place(kiosk, 3.71, 0.92);
    s.hot(kiosk, 'year1', '把鼓點留給下一季', [0, 0.91, 0], 'lift');
    const entrant = at(grand.b, spectator(P.blue, P.gold), -1.12, 0.32, 0.36);
    const old = at(grand.b, spectator(P.rose, P.bottle), 1.11, 0.32, 0.36);
    entrant.visible = false;
    const flagline = group(),
      bunt = clothline(flagline, -1.26, 1.26, 1.31, 0, [P.brick, P.gold, P.sea, P.cream, P.red]);
    s.place(flagline, -2.52, -1.88);
    const signal = group();
    post(signal, 0, 0, 1.1, 0.069, P.bark);
    cut(
      signal,
      [
        [-0.3, 1.03],
        [0.3, 1.03],
        [0.3, 1.58],
        [-0.3, 1.58],
      ],
      0,
      0,
      0,
      P.bottle,
      0.07,
    );
    print(signal, '7', 0, 1.3, 0.049, 0.45, 0.37, P.bottle, P.cream);
    s.place(signal, 0.54, -0.99);
    signal.visible = false;
    const fence = group();
    for (const x of [-0.52, 0, 0.52]) post(fence, x, 0, 0.64, 0.038, P.bottle);
    for (const y of [0.15, 0.37, 0.62]) line(fence, [-0.52, y, 0], [0.52, y, 0], 0.017, P.mint);
    for (let i = 0; i < 5; i++)
      line(fence, [-0.44 + i * 0.21, 0.15, 0], [-0.32 + i * 0.21, 0.62, 0], 0.009, P.sage);
    fence.rotation.y = 0.62;
    s.place(fence, -3.84, -0.82);
    const bats = batRack();
    bats.rotation.y = 0.25;
    s.place(bats, 2.84, 1.17);
    s.hot(pitcher, 'find:0', '觀察投手準備的瞬間', [0, 0.75, 0.02], 'tap');
    s.hot(bats, 'find:1', '翻看候場的球棒架', [-0.21, 0.31, 0.11], 'lift');
    const pressMast = group();
    block(pressMast, 0, 0.7, 0, 0.075, 1.4, 0.09, P.wood);
    const matchRhythm = impressionPress(pressMast, 0, 1.34, 0, 1.17);
    s.place(pressMast, -1.28, -1.58);
    s.place(reedBed(0.43), -4.06, 1.42);
    s.place(reedBed(0.39), 3.97, -0.79);
    s.place(K.notebook('people'), -1.33, 1.54);
    sprig(s, 3.92, 1.76, 0.44);
    let time = 0,
      pulse = 0,
      joinIn = false,
      moment = -1,
      next = -1;
    return {
      tick(t, dt) {
        time += Math.min(Number(dt) || 0.016, 0.075);
        const v = time;
        pulse = Math.max(0, pulse - 0.012);
        const beat = (joinIn ? 0.5 : 0.08) + pulse * 0.45;
        matchRhythm(joinIn && moment === 1, dt);
        large.sticks.forEach(
          (o, i) =>
            (o.rotation.z = (i ? 1 : -1) * (0.35 + Math.max(0, Math.sin(v * 6.3 + i * 1.25)) * beat * 1.27)),
        );
        grand.crowd.forEach((o, i) => {
          o.rotation.z = Math.sin(v * (joinIn ? 4 : 1.0) - i * 0.54) * (joinIn ? 0.13 : 0.024);
        });
        grand.lights.forEach((o, i) => (o.visible = moment === 1 || Math.sin(v * 1.3 + i * 0.3) > -0.53));
        grand.pennants.forEach((f, i) => (f.rotation.y = 0.23 * Math.sin(v * 2 + i)));
        bunt.forEach((f, i) => (f.rotation.y = 0.18 * Math.sin(v * 1.5 + i * 0.6)));
        const arc = (v * 0.38) % 1;
        ball.position.set(-0.81 + arc * 1.72, 0.34 + Math.sin(arc * Math.PI) * 0.83, -0.38 + arc * 0.67);
        pitcher.rotation.z = -0.08 + 0.07 * Math.sin(v * 2.4);
        fielder.rotation.y = 0.15 + 0.1 * Math.sin(v * 0.8);
        entrant.rotation.z = next === 1 ? 0.1 * Math.sin(v * 4.1) : 0;
        old.rotation.z = -0.09 * Math.sin(v * 3.3);
        tickets.rotation.z = next === 1 ? Math.sin(v * 2) * 0.055 : 0;
      },
      update(state, a) {
        if (!state) return;
        joinIn = state.role === 1;
        moment = state.moment;
        next = state.returner;
        entrant.visible = next === 1;
        signal.visible = moment === 1;
        if (a === 'role1' || a === 'time1' || a === 'year1') pulse = 1;
      },
    };
  };
  window.AtlasHarborStock = Object.freeze({
    landscape, reedBed, lifesaver, gull, foldedCone, harborBoat, workshop, platform,
    umbrella, filmStation, spectator, bleachers, paradeDrum,
  });
})();
