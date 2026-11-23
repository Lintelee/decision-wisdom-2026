import { group, keep, box, cyl, disc, ring, beam, poly, tri, quad, slab } from '../paper.js';
import { foldedTree, ridgeLine, bankPlants } from '../paper-landscape.js';

const tau = Math.PI * 2;
const smooth = (t) => t * t * (3 - 2 * t);

function stand(g, x, y, z) {
  const part = group(g);
  part.position.set(x, y, z);
  return part;
}

// One silhouette per leaf. Their low ends meet above the gutter when the book lies flat.
function hills(S, left, right, colors, z = -3.34) {
  for (const [anchor, profile] of [
    [-2.84, left],
    [2.84, right],
  ]) {
    S.plant(anchor, z, (g) => ridgeLine(g, { ...colors, profile, depth: 0.26 }));
  }
}

function verge(g, outline, ink, plantings) {
  slab(g, outline, 0.035, ink, 0.009);
  for (const [x, z, kind, height, width, leaf, light, shade] of plantings)
    bankPlants(stand(g, x, 0.046, z), { kind, height, width, leaf, light, shade });
}

export function templeCourt(S) {
  hills(
    S,
    [
      [-2.76, 0.5],
      [-1.98, 1.3],
      [-1.55, 1.09],
      [-0.63, 1.84],
      [-0.25, 1.57],
      [0.34, 1.71],
      [1.14, 0.84],
      [1.9, 1.22],
      [2.82, 0.61],
    ],
    [
      [-2.82, 0.61],
      [-2.29, 0.85],
      [-1.68, 0.69],
      [-0.82, 1.26],
      [0.11, 0.92],
      [0.98, 1.32],
      [1.77, 0.84],
      [2.76, 0.62],
    ],
    { base: '#918b73', light: '#b0a184', shade: '#777c70' },
  );
  S.plant(-4.8, -2.56, (g) => {
    foldedTree(g, { kind: 'banyan', height: 2.87, leaf: '#849265', light: '#a6ab73', shade: '#536f58', bark: '#82705b' });
    const foot = stand(g, 0.02, 0.08, 0.05);
    cyl(foot, 0, 0.07, 0, 0.58, 0.64, 0.14, '#a3987d', 8);
  });
  S.plant(5.32, -1.72, (g) =>
    foldedTree(g, { kind: 'cypress', height: 1.84, leaf: '#667d62', light: '#879573', shade: '#536758' }),
  );
  // The troupe's pennant has a raised paper ridge and a double-swallow tail.
  S.plant(5.02, -0.47, (g) => {
    cyl(g, 0, 0.08, 0, 0.18, 0.23, 0.16, '#a6957a', 6);
    beam(g, [0, 0.06, 0], [0, 2.13, 0], 0.032, '#966b44', 7);
    cyl(g, 0, 2.16, 0, 0.013, 0.053, 0.12, '#d7b369', 6);
    const flag = keep(g, -0.008, 2.045, 0);
    poly(
      flag,
      [
        [0, 0],
        [-1.01, -0.16],
        [-0.75, -0.29],
        [-1.08, -0.53],
        [-0.8, -0.52],
        [-0.97, -0.7],
        [0, -0.56],
      ],
      0.029,
      '#b75c45',
    );
    tri(flag, [0, -0.04, 0.032], [-0.73, -0.28, 0.095], [-1.0, -0.166, 0.032], '#d88a5b');
    tri(flag, [0, -0.53, 0.032], [-0.73, -0.28, 0.095], [0, -0.04, 0.032], '#bd684b');
    poly(
      flag,
      [
        [-0.15, -0.13],
        [-0.26, -0.23],
        [-0.42, -0.22],
        [-0.33, -0.31],
        [-0.4, -0.42],
        [-0.24, -0.38],
        [-0.15, -0.44],
        [-0.18, -0.29],
      ],
      0.008,
      '#eed491',
      0,
      0,
      0.082,
    );
    beam(g, [0, 1.45, 0.02], [0.075, 1.27, 0.015], 0.012, '#d8b566', 5);
    S.pad(flag, 0.37, [-0.48, -0.34, 0.01]);
    S.discovery(flag, {
      id: 'lion-standard',
      label: '獅陣出場的燕尾隊旗',
      aim: [-0.39, -0.28, 0.04],
      sound: 'cloth',
      duration: 1.15,
      draw(u, visit, still) {
        const lean = visit % 2 ? 0.14 : -0.08;
        flag.rotation.y = lean + (still ? 0 : 0.67 * Math.sin(tau * u) * Math.sin(Math.PI * u));
        flag.rotation.z = still ? 0 : 0.11 * Math.sin(tau * u) * Math.sin(Math.PI * u);
      },
      reset() {
        flag.rotation.set(0, 0, 0);
      },
    });
  });
  S.plant(-4.53, 2.16, (g) => {
    verge(
      g,
      [
        [-0.78, -0.39],
        [-0.12, -0.48],
        [0.48, -0.26],
        [0.94, 0.13],
        [0.64, 0.35],
        [-0.62, 0.36],
      ],
      '#9c9e77',
      [
        [-0.45, -0.18, 'fern', 0.43, 0.69, '#698469', '#98a276', '#526b59'],
        [0.36, 0.08, 'grass', 0.29, 0.48, '#7f8c68', '#aaac7e', '#657759'],
      ],
    );
    for (const [x, z, w] of [
      [-0.64, 0.17, 0.37],
      [-0.29, 0.27, 0.31],
      [0.05, 0.28, 0.35],
    ]) {
      const stone = stand(g, x, 0.036, z);
      slab(
        stone,
        [
          [-w * 0.48, -0.085],
          [w * 0.44, -0.105],
          [w * 0.5, 0.04],
          [w * 0.14, 0.11],
          [-w * 0.47, 0.072],
        ],
        0.085,
        '#ae9e83',
      );
    }
  });
}

// A thick melon-shaped shop crest. Flat-cut seeds read at phone size.
export function melonCrest(g) {
  const arc = (r) =>
    Array.from({ length: 15 }, (_, i) => [Math.cos((Math.PI * i) / 14) * r, Math.sin((Math.PI * i) / 14) * r]);
  const crest = stand(g, 0, 2.24, -0.27);
  poly(crest, arc(0.71), 0.074, '#426855');
  poly(crest, arc(0.647), 0.026, '#d9c78b', 0, 0.019, 0.067);
  poly(crest, arc(0.574), 0.016, '#b95b48', 0, 0.034, 0.091);
  for (const [x, y, tilt] of [
    [-0.35, 0.17, -0.5],
    [-0.13, 0.37, -0.22],
    [0.16, 0.37, 0.26],
    [0.35, 0.17, 0.47],
    [0.0, 0.13, 0.04],
  ]) {
    const pip = poly(
      crest,
      [
        [0, 0],
        [0.029, 0.028],
        [0.023, 0.089],
        [0, 0.12],
        [-0.024, 0.061],
        [-0.024, 0.022],
      ],
      0.008,
      '#593e39',
      x,
      y,
      0.107,
    );
    pip.rotation.z = -tilt;
  }
  box(crest, 0, 0.016, 0.066, 1.45, 0.062, 0.12, '#77895f');
}

export function melonLane(S) {
  hills(
    S,
    [
      [-2.73, 0.67],
      [-1.86, 1.16],
      [-0.99, 0.92],
      [-0.34, 1.26],
      [0.54, 0.86],
      [1.59, 0.99],
      [2.8, 0.48],
    ],
    [
      [-2.8, 0.48],
      [-1.98, 0.9],
      [-0.79, 0.61],
      [0.23, 1.38],
      [0.87, 1.15],
      [1.38, 1.39],
      [2.74, 0.83],
    ],
    { base: '#9b9879', shade: '#7c8871', light: '#b9ab85' },
  );
  for (const [x, z, height] of [
    [-5.02, -2.48, 2.28],
    [4.24, -2.6, 2.15],
  ]) {
    S.plant(x, z, (g) =>
      foldedTree(g, { kind: 'orchard', height, leaf: '#76845c', light: '#a0a777', shade: '#566f55', bark: '#806e54' }),
    );
  }
  // The morning delivery is still on the cart. Each whole melon has its own paper stripe.
  S.plant(-4.42, 2.18, (g) => {
    const cart = keep(g);
    cart.rotation.y = 0.13;
    box(cart, 0, 0.31, 0, 1.13, 0.11, 0.61, '#9f7953');
    for (const z of [-0.28, 0.28])
      for (const y of [0.45, 0.6]) box(cart, 0, y, z, 1.23, 0.105, 0.055, z > 0 ? '#b88d5c' : '#a07c58');
    for (const x of [-0.58, 0.58]) {
      box(cart, x, 0.47, 0, 0.056, 0.35, 0.62, '#9b7654');
      for (const z of [-0.26, 0.26]) box(cart, x, 0.49, z, 0.076, 0.42, 0.072, '#85654d');
    }
    for (const z of [-0.25, 0.25]) beam(cart, [0.57, 0.33, z], [0.92, 0.56, z], 0.04, '#9f7954', 6);
    const wheels = [];
    for (const z of [-0.38, 0.38]) {
      const wheel = keep(cart, -0.23, 0.24, z);
      disc(wheel, 0, 0, 0, 0.23, '#59564a', 0.066, 12);
      disc(wheel, 0, 0, 0.04, 0.164, '#ab9567', 0.03, 10);
      for (let j = 0; j < 3; j++) box(wheel, 0, 0, 0.068, 0.275, 0.023, 0.019, '#655e49').rotation.z = (Math.PI * j) / 3;
      disc(wheel, 0, 0, 0.078, 0.04, '#e3c68e', 0.024, 8);
      wheels.push(wheel);
    }
    const load = [];
    for (const [x, z, size] of [
      [-0.33, 0.025, 0.23],
      [0.02, 0.1, 0.25],
      [0.36, -0.02, 0.23],
      [-0.13, -0.12, 0.21],
    ]) {
      const fruit = keep(cart, x, 0.58, z);
      load.push(fruit);
      const body = cyl(fruit, 0, 0, 0, size, size, 0.25, '#748956', 9);
      body.rotation.x = Math.PI / 2;
      body.scale.y = 1.1;
      disc(fruit, 0, 0, 0.123, size, '#819460', 0.022, 11);
      for (const side of [-1, 1])
        poly(
          fruit,
          [
            [side * 0.09, size * 0.76],
            [side * 0.14, size * 0.18],
            [side * 0.115, -size * 0.53],
            [side * 0.085, -size * 0.77],
            [side * 0.106, size * 0.13],
          ],
          0.008,
          '#4e704e',
          0,
          0,
          0.144,
        );
    }
    S.discovery(cart, {
      id: 'melon-delivery',
      label: '載整顆西瓜的送貨手車',
      aim: [0, 0.52, 0.29],
      sound: 'wheel',
      duration: 1.21,
      draw(u, visit, still) {
        const park = visit % 2 ? 0.15 : 0,
          from = visit % 2 ? 0 : 0.15,
          t = still ? 1 : smooth(u);
        cart.position.x = from + (park - from) * t;
        wheels.forEach((w) => {
          w.rotation.z = -cart.position.x / 0.23;
        });
        load.forEach((fruit, i) => {
          fruit.rotation.z = still ? 0 : Math.sin(tau * u + i * 0.57) * Math.sin(Math.PI * u) * 0.14;
        });
      },
      reset() {
        cart.position.x = 0;
        wheels.forEach((w) => {
          w.rotation.z = 0;
        });
        load.forEach((f) => {
          f.rotation.z = 0;
        });
      },
    });
  });
  S.plant(4.13, 2.33, (g) =>
    verge(
      g,
      [
        [-0.84, -0.06],
        [-0.35, -0.42],
        [0.38, -0.39],
        [1.0, -0.15],
        [0.79, 0.37],
        [-0.61, 0.34],
      ],
      '#9ca477',
      [
        [-0.42, 0.08, 'fern', 0.35, 0.66, '#738357', '#a2a976', '#607954'],
        [0.56, -0.07, 'fern', 0.55, 0.86, '#6c8058', '#9ca371', '#506950'],
      ],
    ),
  );
}

function indigoStems(g, x, z, size) {
  const clump = stand(g, x, 0, z);
  clump.scale.setScalar(size);
  for (const [dx, h] of [
    [-0.18, 0.6],
    [0, 0.88],
    [0.18, 0.69],
  ]) {
    beam(clump, [dx * 0.14, 0.025, 0], [dx, h, -0.013], 0.014, '#69775f', 5);
    for (let i = 0; i < 4; i++) {
      const side = i % 2 ? -1 : 1,
        y = 0.14 + i * h * 0.15,
        xx = (dx * y) / h;
      const root = [xx, y, 0.002],
        tip = [xx + side * (0.23 - i * 0.023), y + 0.19, 0],
        spine = [xx + side * 0.1, y + 0.082, 0.056];
      tri(clump, root, spine, [xx + side * 0.14, y + 0.045, 0.009], '#637956');
      tri(clump, spine, tip, [xx + side * 0.14, y + 0.045, 0.009], '#6e865d');
      quad(clump, root, [xx + side * 0.048, y + 0.134, 0.009], tip, spine, '#89a176');
    }
    const cone = poly(
      clump,
      [
        [-0.031, 0],
        [-0.048, 0.07],
        [-0.028, 0.13],
        [-0.005, 0.2],
        [0.024, 0.13],
        [0.042, 0.069],
        [0.023, 0.016],
      ],
      0.026,
      '#aa7979',
      dx,
      h - 0.12,
      0.002,
    );
    cone.rotation.z = -dx * 0.48;
  }
}

export function indigoStream(S) {
  hills(
    S,
    [
      [-2.75, 0.8],
      [-1.68, 1.33],
      [-1.12, 0.91],
      [-0.45, 1.02],
      [0.38, 0.63],
      [1.57, 0.86],
      [2.8, 0.46],
    ],
    [
      [-2.8, 0.46],
      [-1.92, 1.1],
      [-0.99, 1.84],
      [-0.55, 1.49],
      [0.15, 1.6],
      [0.78, 2.05],
      [1.36, 1.28],
      [2.74, 0.83],
    ],
    { base: '#7c918f', light: '#99a49c', shade: '#607b7d' },
  );
  S.plant(4.6, -2.43, (g) => {
    foldedTree(g, { kind: 'willow', height: 2.5, leaf: '#688675', light: '#95a58d', shade: '#526f66', bark: '#796e60' });
  });
  S.plant(2.86, -1.28, (g) => {
    const bed = [
      [-1.91, -0.37],
      [-1.37, -0.55],
      [-0.51, -0.47],
      [0.17, -0.59],
      [0.99, -0.4],
      [1.35, -0.52],
      [2.47, -0.42],
      [2.47, 0.24],
      [1.53, 0.17],
      [0.86, 0.32],
      [-0.16, 0.2],
      [-0.79, 0.36],
      [-1.88, 0.19],
    ];
    slab(g, bed, 0.064, '#8c9487');
    slab(
      g,
      bed.map(([x, z]) => [x * 0.98, z * 0.68]),
      0.014,
      '#6f9999',
      0.069,
    );
    for (const [x, z, len] of [
      [-1.13, 0.008, 0.54],
      [-0.28, 0.074, 0.25],
      [0.57, 0.044, 0.55],
      [1.45, -0.12, 0.4],
      [1.94, 0.05, 0.27],
    ])
      slab(
        g,
        [
          [x, z],
          [x + len * 0.56, z - 0.026],
          [x + len, z + 0.006],
          [x + len * 0.59, z + 0.02],
        ],
        0.008,
        '#c3d1b9',
        0.084,
      );
    const mill = stand(g, 0.25, 0.09, 0);
    for (const z of [-0.29, 0.12]) {
      beam(mill, [-0.41, 0.035, z], [0, 0.94, z], 0.063, '#8a6e53', 5);
      beam(mill, [0.38, 0.035, z], [0, 0.94, z], 0.063, '#a88860', 5);
    }
    const wheel = keep(mill, 0, 0.87, 0.32);
    for (const z of [-0.19, 0.16]) {
      ring(wheel, 0, 0, z, 0.73, 0.047, z > 0 ? '#bc925e' : '#8c7355', 12);
      for (let spoke = 0; spoke < 8; spoke++) {
        const a = (tau * spoke) / 8;
        beam(wheel, [0, 0, z], [0.71 * Math.cos(a), 0.71 * Math.sin(a), z], 0.024, '#9d7951', 5);
      }
    }
    for (let blade = 0; blade < 12; blade++) {
      const a = (tau * blade) / 12;
      box(
        wheel,
        0.73 * Math.cos(a),
        0.73 * Math.sin(a),
        0,
        0.16,
        0.062,
        0.46,
        blade % 2 ? '#b39466' : '#ad865e',
      ).rotation.z = a + 0.48;
    }
    disc(wheel, 0, 0, 0.2, 0.13, '#766449', 0.066, 10);
    disc(wheel, 0, 0, 0.25, 0.065, '#dbc18c', 0.036, 8);
    S.pad(wheel, 0.61, [0, 0, 0.045]);
    S.discovery(wheel, {
      id: 'dye-waterwheel',
      label: '把溪水帶進染坊的水車',
      aim: [0.37, 0.33, 0.17],
      sound: 'wheel',
      duration: 1.62,
      draw(u, visit, still) {
        wheel.rotation.z = -(visit - 1 + (still ? 1 : smooth(u))) * Math.PI * 0.75;
      },
      reset() {
        wheel.rotation.z = 0;
      },
    });
  });
  S.plant(4.49, 2.19, (g) => {
    slab(
      g,
      [
        [-0.87, 0.26],
        [-0.66, -0.28],
        [0.22, -0.46],
        [0.94, -0.14],
        [0.86, 0.28],
        [0.36, 0.45],
      ],
      0.042,
      '#98a18a',
    );
    indigoStems(g, -0.24, 0.02, 0.68);
    indigoStems(g, 0.43, -0.04, 0.98);
  });
}

export function lanternQuay(S) {
  hills(
    S,
    [
      [-2.75, 0.91],
      [-2.14, 1.37],
      [-1.55, 1.12],
      [-0.85, 1.82],
      [-0.58, 1.53],
      [-0.04, 1.61],
      [0.99, 0.81],
      [1.61, 0.85],
      [2.82, 0.4],
    ],
    [
      [-2.82, 0.4],
      [-2.21, 0.62],
      [-1.43, 0.81],
      [-0.76, 1.23],
      [0.24, 0.75],
      [1.01, 1.44],
      [1.65, 1.21],
      [2.76, 0.7],
    ],
    { base: '#567978', shade: '#415f67', light: '#7c9290' },
  );
  for (const [x, hue] of [
    [-2.82, '#719596'],
    [2.82, '#749795'],
  ]) {
    S.plant(x, -2.54, (g) => {
      const bed = [
        [-2.78, -0.63],
        [-1.69, -0.74],
        [-0.63, -0.65],
        [0.55, -0.71],
        [1.59, -0.61],
        [2.77, -0.63],
        [2.77, 0.59],
        [1.48, 0.42],
        [0.69, 0.48],
        [-0.36, 0.28],
        [-1.32, 0.51],
        [-2.78, 0.44],
      ];
      slab(g, bed, 0.038, hue, 0.014);
      for (const [dx, z, len] of [
        [-2.4, -0.16, 0.68],
        [-1.3, 0.13, 0.6],
        [-0.24, -0.19, 0.67],
        [0.76, 0.15, 0.55],
        [1.89, -0.06, 0.6],
      ]) {
        slab(
          g,
          [
            [dx, z],
            [dx + len * 0.49, z - 0.03],
            [dx + len, z + 0.006],
            [dx + len * 0.55, z + 0.028],
          ],
          0.008,
          '#afc1ae',
          0.056,
        );
      }
    });
  }
  S.plant(-5.18, -2.12, (g) =>
    foldedTree(g, { kind: 'pine', height: 2.18, leaf: '#577669', light: '#7e9180', shade: '#415e59' }),
  );
  // An open upper storey on the lantern workshop. Its round sample hangs from a beam:
  // the reader's square sky lantern in the square is the one that can be released.
  S.plant(3.44, -1.79, (g) => {
    const frame = '#725949',
      timber = '#a58360',
      lacquer = '#a8634e',
      gold = '#d6ae77';
    for (const x of [-1.22, 1.22]) {
      for (const z of [-0.34, 0.32]) {
        beam(g, [x, 1.03, z], [x, 3.09, z], 0.069, frame, 6);
        beam(g, [x, 2.69, z], [x * 0.71, 3.06, z], 0.051, timber, 5);
        cyl(g, x, 1.88, z, 0.102, 0.12, 0.12, '#b6a483', 8);
      }
      box(g, x, 2.17, -0.26, 0.27, 0.76, 0.074, '#667c7b');
      for (const a of [-1, 1])
        beam(g, [x - 0.116, 2.17 - a * 0.33, -0.207], [x + 0.116, 2.17 + a * 0.33, -0.207], 0.013, '#a6aa91', 5);
    }
    box(g, 0, 3.033, 0.32, 2.59, 0.13, 0.13, frame);
    box(g, 0, 3.095, 0.39, 2.74, 0.084, 0.052, lacquer);
    // The corners rise towards each end of the scored roof strip.
    const eave = (u) => [(u - 0.5) * 3.41, 3.1 + 0.28 * Math.abs(u * 2 - 1) ** 3, 0.73];
    const ridge = (u) => [(u - 0.5) * 2.64, 3.64 + 0.16 * Math.abs(u * 2 - 1) ** 3, -0.1];
    const rearEave = ([x, y]) => [x, y - 0.035, -0.77];
    const fascia = ([x, y, z]) => [x, y - 0.095, z];
    const roofInks = ['#50686e', '#5d7375', '#6d807b', '#59706f', '#667976'];
    for (let i = 0; i < 10; i++) {
      const left = eave(i / 10),
        right = eave((i + 1) / 10);
      const peakLeft = ridge(i / 10),
        peakRight = ridge((i + 1) / 10);
      quad(g, left, right, peakRight, peakLeft, roofInks[i % roofInks.length]);
      quad(g, peakLeft, peakRight, rearEave(right), rearEave(left), i % 2 ? '#4d686c' : '#536e71');
      quad(g, left, right, fascia(right), fascia(left), lacquer);
      beam(g, peakLeft, left, 0.025, i % 2 ? '#80908a' : '#6f8681', 6);
      if (i === 9) beam(g, peakRight, right, 0.026, '#87968c', 6);
      beam(g, peakLeft, peakRight, 0.043, '#a58f70', 6);
    }
    for (const x of [-1.31, 1.31]) {
      const side = Math.sign(x);
      beam(g, [x, 3.79, -0.1], [x + 0.13 * side, 3.92, -0.1], 0.041, gold, 5);
      beam(g, [x + 0.13 * side, 3.92, -0.1], [x + 0.22 * side, 3.91, -0.1], 0.03, gold, 5);
    }
    const wind = keep(g),
      lamp = keep(wind, -0.02, 3.025, 0.4);
    beam(lamp, [0, 0, 0], [0, -0.2, 0], 0.025, gold, 6);
    cyl(lamp, 0, -0.205, 0, 0.245, 0.31, 0.084, frame, 10);
    const levels = [
      [-0.24, 0.27],
      [-0.36, 0.51],
      [-0.57, 0.63],
      [-0.74, 0.62],
      [-0.91, 0.49],
      [-1.03, 0.27],
    ];
    const facets = ['#d38156', '#e4a060', '#e8a567', '#d17b50', '#c47150', '#d48457'];
    for (let k = 0; k < 12; k++) {
      const a = (tau * k) / 12,
        b = (tau * (k + 1)) / 12;
      const point = (angle, r, y) => [Math.cos(angle) * r, y, Math.sin(angle) * r];
      for (let j = 0; j < levels.length - 1; j++) {
        const [y, r] = levels[j],
          [yy, rr] = levels[j + 1];
        const lower = point(a, rr, yy),
          upper = point(a, r, y);
        quad(lamp, upper, point(b, r, y), point(b, rr, yy), lower, facets[k % 6]);
        if (k % 2 === 0) beam(lamp, upper, lower, 0.012, '#b87453', 5);
      }
    }
    cyl(lamp, 0, -1.035, 0, 0.296, 0.24, 0.073, frame, 10);
    cyl(lamp, 0, -1.086, 0, 0.155, 0.11, 0.05, gold, 8);
    beam(lamp, [0, -1.1, 0], [0, -1.19, 0], 0.023, gold, 5);
    for (const side of [-1, 1])
      poly(
        lamp,
        [
          [0, 0],
          [0.078, -0.19],
          [0.016, -0.163],
          [-0.053, -0.203],
          [-0.054, -0.087],
        ],
        0.021,
        '#aa6451',
        side * 0.028,
        -1.177,
        -0.018,
      ).rotation.z = side * 0.11;
    // Swallowtail wind ribbon suspended from the same roof as the pleated lamp.
    const indicator = keep(wind, 0.99, 3.014, 0.38);
    poly(
      indicator,
      [
        [-0.08, 0],
        [0.067, 0],
        [0.071, -0.18],
        [0.168, -0.37],
        [0.19, -0.51],
        [0.32, -0.72],
        [0.18, -0.67],
        [0.12, -0.8],
        [0.039, -0.54],
        [-0.034, -0.4],
        [-0.062, -0.26],
      ],
      0.026,
      '#d5b074',
    );
    tri(indicator, [-0.026, -0.011, 0.03], [0.025, -0.31, 0.064], [0.188, -0.55, 0.03], '#e4c99a');
    S.pad(wind, 0.46, [-0.02, 2.36, 0.66]);
    S.discovery(wind, {
      id: 'lantern-wind',
      label: '屋簷下的試風燈與紙帶',
      aim: [-0.02, 2.4, 0.73],
      sound: 'cloth',
      duration: 1.62,
      draw(u, visit, still) {
        const blow = still ? 0 : Math.sin(2 * tau * u) * Math.sin(Math.PI * u) * (1 - 0.44 * u);
        lamp.rotation.z = (visit % 2 ? 0.09 : 0) + 0.36 * blow;
        indicator.rotation.z = (visit % 2 ? 0.23 : 0) + 0.54 * blow;
        indicator.rotation.y = (visit % 2 ? -0.15 : 0.1) + 0.39 * blow;
      },
      reset() {
        lamp.rotation.z = 0;
        indicator.rotation.set(0, 0, 0);
      },
    });
  });
  S.plant(4.89, 2.09, (g) =>
    verge(
      g,
      [
        [-0.79, -0.14],
        [-0.52, -0.44],
        [0.2, -0.39],
        [0.71, -0.23],
        [0.75, 0.26],
        [0.19, 0.38],
        [-0.67, 0.3],
      ],
      '#8e9c85',
      [
        [-0.29, 0.04, 'reed', 0.55, 0.61, '#688574', '#94a28a', '#516c63'],
        [0.38, -0.06, 'reeds', 0.75, 0.72, '#5c796e', '#88a08c', '#48665f'],
      ],
    ),
  );
}
