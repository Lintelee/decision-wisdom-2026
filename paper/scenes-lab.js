/* Five working paper theatres for the Model and AI chapters. Coordinates are in book units. */
(() => {
  'use strict';
  const K = window.PaperKit;
  const S = window.AtlasSets;
  const C = {
    ink: '#233f3c',
    green: '#346c5a',
    leaf: '#698668',
    mint: '#9db99c',
    deep: '#26394b',
    slate: '#526678',
    blue: '#759698',
    fog: '#adc2b7',
    wine: '#8f4238',
    brick: '#ae604a',
    rose: '#c48a6c',
    amber: '#e4ab51',
    brass: '#c18a45',
    wheat: '#dcc18b',
    edge: '#f0dfbb',
    cream: '#f6edcf',
    wood: '#845f46',
    shadow: '#51453e',
    moss: '#989b66',
    black: '#263330',
  };
  const at = (parent, object, x, y, z, ry = 0) => K.at(parent, object, x, y, z, ry);
  const box = (parent, w, h, d, color, x, y, z) => at(parent, K.box(w, h, d, color), x, y, z);
  const poly = (parent, points, color, x, y, z, depth = 0.055, edge = C.edge) =>
    at(parent, K.cut(points, depth, color, edge), x, y, z);
  const cylinder = (parent, top, bottom, h, n, color, x, y, z) =>
    at(parent, K.cyl(top, bottom, h, n, color), x, y, z);
  const disk = (parent, r, d, color, x, y, z, n = 16) => {
    const part = cylinder(parent, r, r, d, n, color, x, y, z);
    part.rotation.x = Math.PI / 2;
    return part;
  };
  const strut = (group, start, end, r, color) => {
    const part = K.rod(start, end, r, color);
    group.add(part);
    return part;
  };
  const type = (group, text, w, h, x, y, z, ink = C.ink, paper = C.cream) =>
    at(group, K.label(text, w, h, { ink, paper }), x, y, z);
  const groupAt = (parent, x = 0, y = 0, z = 0) => at(parent, K.group(), x, y, z);
  const prop = (s, group, x, z, y = 0, ry = 0) => {
    group.rotation.y = ry;
    return s.place(group, x, z, y);
  };
  function ledge(group, w, d, x, y, z, face = C.brass) {
    box(group, w, 0.09, d, face, x, y, z);
    box(group, w + 0.035, 0.025, d + 0.025, C.edge, x, y + 0.054, z);
  }
  function windowPane(group, x, y, z, w, h, lit = true) {
    box(group, w + 0.09, h + 0.09, 0.065, C.wood, x, y, z);
    box(group, w, h, 0.045, lit ? C.wheat : C.blue, x, y, z + 0.048);
    box(group, 0.035, h, 0.025, C.ink, x, y, z + 0.075);
    box(group, w, 0.035, 0.025, C.ink, x, y + 0.05 * h, z + 0.075);
  }
  function flag(group, x, y, z, color, scale = 1) {
    const assembly = groupAt(group, x, y, z);
    strut(assembly, [0, 0, 0], [0, 0.65 * scale, 0], 0.023 * scale, C.wood);
    const cloth = poly(
      assembly,
      [
        [0, 0.02],
        [0.44, 0.07],
        [0.34, -0.03],
        [0.45, -0.15],
        [0, -0.17],
      ],
      color,
      0,
      0.61 * scale,
      0,
      0.025,
    );
    cloth.scale.setScalar(scale);
    return cloth;
  }
  function plant(s, x, z, height, form = 'cypress', seed = 1) {
    return prop(s, K.tree(form, height, seed), x, z);
  }
  function skyline(s, x, z, w, tone, lit) {
    const g = K.group();
    const row = [
      [-0.46, 0.45],
      [-0.32, 0.66],
      [-0.14, 0.5],
      [0.025, 0.82],
      [0.19, 0.6],
      [0.345, 0.5],
    ];
    row.forEach(([offset, h], i) => {
      const bw = (i % 2 ? 0.148 : 0.133) * w,
        cx = offset * w;
      poly(
        g,
        [
          [-bw / 2, 0],
          [-bw / 2, h],
          [0, h + (i % 3) * 0.12],
          [bw / 2, h],
          [bw / 2, 0],
        ],
        tone,
        cx,
        0,
        (i % 3) * 0.04,
        0.06,
      );
      if (i % 2 === 1)
        for (let j = -1; j < 2; j++) box(g, 0.055, 0.105, 0.023, lit, cx + j * bw * 0.23, h * 0.55, 0.13);
    });
    return prop(s, g, x, z);
  }
  function lantern(s, x, z) {
    const g = K.group();
    cylinder(g, 0.15, 0.2, 0.12, 6, C.ink, 0, 0.06, 0);
    cylinder(g, 0.035, 0.055, 0.86, 6, C.wood, 0, 0.52, 0);
    cylinder(g, 0.15, 0.09, 0.25, 4, C.amber, 0, 1.02, 0);
    cylinder(g, 0.025, 0.21, 0.14, 4, C.deep, 0, 1.19, 0);
    prop(s, g, x, z);
  }
  function notebook(s, section) {
    return prop(s, K.notebook(section), -1.37, 1.5, 0, -0.12);
  }

  // Real sliding jaw, registration marks and a botanical reference proof.
  function calibration(parent, x, y, z, width, caption) {
    const unit = groupAt(parent, x, y, z),
      range = width * 0.56;
    const pale = '#eabfc0',
      chrome = '#954f59';
    box(unit, width, 0.53, 0.105, C.ink, 0, 0, 0);
    box(unit, width - 0.07, 0.46, 0.04, pale, 0, 0.008, 0.068);
    at(unit, K.engraving('flower', width * 0.17, 0.4, C.ink), -0.39 * width, 0.025, 0.092);
    type(unit, caption, width * 0.48, 0.13, -0.015 * width, 0.123, 0.096, C.ink, 'transparent');
    const origin = -range / 2 + 0.07;
    box(unit, range + 0.055, 0.018, 0.016, C.ink, 0.07, -0.077, 0.103);
    for (let i = 0; i <= 18; i++) {
      const len = i % 3 === 0 ? 0.089 : 0.044;
      box(unit, 0.013, len, 0.013, C.ink, origin + (range * i) / 18, -0.072 + len / 2, 0.106);
    }
    const jaw = groupAt(unit, origin, -0.025, 0.127);
    poly(
      jaw,
      [
        [-0.047, -0.145],
        [0.047, -0.145],
        [0.047, 0.11],
        [0.12, 0.139],
        [0.12, 0.172],
        [-0.047, 0.172],
      ],
      chrome,
      0,
      0,
      0,
      0.028,
    );
    let aim = origin;
    return {
      set(f) {
        aim = origin + range * Math.max(0, Math.min(1, f));
      },
      tick(dt) {
        jaw.position.x += (aim - jaw.position.x) * (dt ? Math.min(1, dt * 6.8) : 1);
      },
    };
  }

  // Raised traces fork into two physically gated paper tracks. A data slip
  // waits at the branch until the current service information permits a route.
  function router(words) {
    const unit = K.group(),
      teal = '#75c6cd',
      dark = '#25474c',
      wire = '#4f9399',
      idle = '#c4c4af';
    const panel = groupAt(unit, 0, 0, 0);
    poly(
      panel,
      [
        [-0.98, 0.07],
        [-0.86, 0],
        [0.78, 0],
        [0.96, 0.14],
        [0.96, 0.87],
        [0.83, 1.01],
        [-0.79, 1.01],
        [-0.98, 0.86],
      ],
      dark,
      0,
      0,
      0,
      0.095,
    );
    poly(
      panel,
      [
        [-0.92, 0.14],
        [-0.81, 0.067],
        [0.75, 0.067],
        [0.89, 0.18],
        [0.89, 0.79],
        [0.78, 0.93],
        [-0.77, 0.93],
        [-0.92, 0.82],
      ],
      '#dae1c9',
      0,
      0,
      0.06,
      0.037,
    );
    box(panel, 0.34, 0.79, 0.013, teal, -0.72, 0.49, 0.092);
    at(panel, K.engraving('head', 0.32, 0.49, dark), -0.723, 0.575, 0.106);
    type(panel, words[0], 0.33, 0.14, -0.713, 0.205, 0.106, dark, 'transparent');
    const x = [-0.48, -0.18, 0.12, 0.62],
      ys = [0.69, 0.32];
    const edges = [],
      gates = [];
    strut(panel, [x[0], 0.505, 0.13], [x[1], 0.505, 0.13], 0.03, wire);
    for (const [i, y] of ys.entries()) {
      strut(panel, [x[1], 0.505, 0.13], [x[2], y, 0.13], 0.03, wire);
      strut(panel, [x[2], y, 0.13], [x[3], y, 0.13], 0.03, wire);
      const track = groupAt(panel, 0, 0, 0.023);
      strut(track, [x[1], 0.505, 0.13], [x[2], y, 0.13], 0.035, teal);
      strut(track, [x[2], y, 0.13], [x[3], y, 0.13], 0.035, teal);
      edges.push(track);
      const gate = groupAt(panel, 0.258, y + 0.038, 0.178);
      box(gate, 0.065, 0.234, 0.045, '#9a6452', 0, 0.04, 0);
      gates.push(gate);
      box(panel, 0.3, 0.21, 0.035, dark, 0.66, y, 0.136);
      type(panel, words[i + 1], 0.28, 0.125, 0.66, y, 0.162, '#f8ead1', 'transparent');
    }
    const packet = groupAt(panel, x[0], 0.505, 0.195);
    poly(
      packet,
      [
        [-0.092, -0.075],
        [0.073, -0.075],
        [0.095, -0.049],
        [0.095, 0.077],
        [-0.092, 0.077],
      ],
      C.wheat,
      0,
      0,
      0,
      0.03,
    );
    box(packet, 0.119, 0.019, 0.011, dark, 0, 0.023, 0.023);
    let target = -1,
      phase = 0,
      choice = -1;
    function set(branch) {
      if (target !== branch) {
        phase = 0;
        choice = branch;
      }
      target = branch;
      edges.forEach((track, i) => {
        track.visible = target === i;
      });
    }
    set(-1);
    return {
      unit,
      set,
      tick(dt) {
        phase = dt ? Math.min(1, phase + dt * 0.9) : 1;
        gates.forEach((gate, i) => {
          const aim = i === target ? -0.99 : 0;
          gate.rotation.z += (aim - gate.rotation.z) * (dt ? Math.min(1, dt * 6) : 1);
        });
        const stop = choice < 0 ? -0.21 : 0.61;
        const px = x[0] + (stop - x[0]) * phase;
        const q = Math.max(0, Math.min(1, (px - x[1]) / (x[2] - x[1])));
        packet.position.set(px, choice < 0 ? 0.505 : 0.505 + (ys[choice] - 0.505) * q, 0.195);
      },
    };
  }

  function bookCrate(group, x, y, z, tone = C.brick) {
    box(group, 0.36, 0.23, 0.27, tone, x, y + 0.115, z);
    box(group, 0.066, 0.244, 0.277, C.wheat, x + 0.07, y + 0.118, z);
    box(group, 0.18, 0.066, 0.018, C.cream, x - 0.035, y + 0.125, z + 0.143);
  }

  function fairBottle(parent, x, y, z, color, scale = 1) {
    const bottle = groupAt(parent, x, y, z);
    bottle.scale.setScalar(scale);
    poly(
      bottle,
      [
        [-0.18, 0],
        [0.18, 0],
        [0.218, 0.1],
        [0.218, 0.63],
        [0.14, 0.73],
        [0.117, 0.73],
        [0.117, 0.82],
        [-0.117, 0.82],
        [-0.117, 0.73],
        [-0.14, 0.73],
        [-0.218, 0.63],
        [-0.218, 0.1],
      ],
      color,
      0,
      0,
      0,
      0.19,
    );
    box(bottle, 0.27, 0.103, 0.21, C.deep, 0, 0.844, 0);
    box(bottle, 0.205, 0.206, 0.018, C.cream, 0, 0.389, 0.111);
    strut(bottle, [-0.055, 0.414, 0.129], [0.069, 0.414, 0.129], 0.01, color);
    return bottle;
  }
  function profileFigure(card, index) {
    const root = K.group(),
      coats = ['#729397', '#ba777d', '#78916d', '#be9361', '#73849b', '#9c7791'];
    const front = coats[index % coats.length],
      sheet = '#fff0d9',
      back = '#ece0c6';
    const edge = '#b8a99b',
      blue = '#3c638d';
    const platform = box(root, 0.75, 0.043, 0.45, back, 0, 0.024, 0.01);
    platform.rotation.y = -0.03;
    poly(
      root,
      [
        [-0.171, 0],
        [-0.112, 0.378],
        [-0.024, 0.378],
        [0.023, 0.016],
        [-0.009, -0.008],
      ],
      C.deep,
      -0.064,
      0.057,
      0,
      0.064,
    );
    poly(
      root,
      [
        [-0.03, 0],
        [-0.018, 0.37],
        [0.1, 0.37],
        [0.152, 0.005],
      ],
      C.slate,
      0.078,
      0.057,
      0.002,
      0.064,
    );
    box(root, 0.19, 0.072, 0.112, C.deep, -0.167, 0.071, 0.042);
    box(root, 0.165, 0.072, 0.111, C.deep, 0.146, 0.071, 0.043);
    const body = groupAt(root, 0, 0.295, 0);
    const cut = [
      [-0.317, 0.067],
      [-0.223, 0.465],
      [-0.102, 0.555],
      [0.091, 0.562],
      [0.246, 0.465],
      [0.329, 0.091],
      [0.227, 0.037],
      [0.158, 0.121],
      [0.166, 0],
      [-0.171, 0.009],
      [-0.166, 0.147],
      [-0.228, 0.065],
    ];
    poly(body, cut, back, 0, 0, -0.018, 0.044, edge);
    const portrait = groupAt(root, 0, 0, 0.019);
    poly(
      portrait,
      [
        [-0.126, 0.797],
        [-0.144, 0.952],
        [-0.091, 1.043],
        [0.045, 1.064],
        [0.138, 0.976],
        [0.139, 0.848],
        [0.061, 0.792],
        [0.039, 0.732],
        [-0.056, 0.721],
        [-0.078, 0.783],
      ],
      ['#ddb299', '#c39477', '#e6b59c', '#c9967c', '#ddb195', '#ca9f85'][index],
      0,
      0,
      0,
      0.07,
    );
    const hair = ['#414348', '#62494a', '#5d5149', '#4b5150', '#725443', '#54444b'][index];
    const coiffure = poly(
      portrait,
      [
        [-0.151, 0.914],
        [-0.119, 1.024],
        [-0.028, 1.091],
        [0.09, 1.047],
        [0.147, 0.974],
        [0.125, 0.945],
        [0.029, 0.999],
        [-0.055, 0.967],
        [-0.121, 0.936],
      ],
      hair,
      0,
      index % 2 ? 0.012 : 0,
      0.044,
      0.041,
    );
    coiffure.scale.x = 1 + ((index % 3) - 1) * 0.055;
    box(portrait, 0.028, 0.017, 0.013, C.deep, -0.052, 0.923, 0.053);
    box(portrait, 0.026, 0.017, 0.013, C.deep, 0.065, 0.92, 0.053);
    strut(portrait, [-0.019, 0.857, 0.054], [0.03, 0.855, 0.054], 0.008, C.wood, 4);
    const collar = poly(
      body,
      [
        [-0.305, 0.08],
        [-0.221, 0.474],
        [-0.11, 0.556],
        [-0.04, 0.493],
        [0.006, 0.462],
        [0.006, 0.007],
        [-0.167, 0.009],
        [-0.162, 0.147],
        [-0.231, 0.069],
      ],
      front,
      0,
      0,
      0.038,
      0.041,
    );
    const flap = groupAt(body, 0.004, 0, 0.058);
    poly(
      flap,
      [
        [0, 0.001],
        [0.165, 0.005],
        [0.158, 0.13],
        [0.231, 0.059],
        [0.325, 0.109],
        [0.244, 0.469],
        [0.096, 0.557],
        [0, 0.46],
      ],
      front,
      0,
      0,
      0,
      0.039,
      edge,
    );
    strut(body, [0, 0.026, 0.093], [0, 0.448, 0.093], 0.009, '#846d6a', 5);
    poly(
      collar,
      [
        [-0.04, 0.47],
        [-0.102, 0.548],
        [-0.145, 0.505],
        [-0.056, 0.418],
      ],
      C.cream,
      0,
      0,
      0.041,
      0.01,
    );
    poly(
      flap,
      [
        [0, 0.46],
        [0.096, 0.556],
        [0.132, 0.51],
        [0.046, 0.414],
      ],
      C.cream,
      0,
      0,
      0.025,
      0.012,
    );
    for (const y of [0.15, 0.253, 0.355]) disk(flap, 0.012, 0.012, C.cream, 0.045, y, 0.029, 6);
    const inside = groupAt(body, 0.062, 0.228, 0.026);
    box(inside, 0.253, 0.285, 0.018, sheet, 0, 0, 0);
    for (const [row, len] of [
      [-0.075, 0.13],
      [0, 0.18],
      [0.068, 0.12],
    ])
      box(inside, len, 0.014, 0.008, blue, 0, row, 0.014);
    const memo = groupAt(root, 0, 0.15, 0.155);
    box(memo, 0.566, 0.14, 0.024, sheet, 0, 0, 0);
    type(memo, card.name, 0.527, 0.11, 0, 0.004, 0.017, C.ink, 'transparent');
    const ink = groupAt(body, -0.115, 0.238, 0.086);
    poly(
      ink,
      [
        [-0.067, -0.027],
        [-0.08, 0.049],
        [-0.038, 0.072],
        [0.007, 0.045],
        [0.043, 0.059],
        [0.068, 0.017],
        [0.048, -0.021],
        [0.066, -0.047],
        [-0.007, -0.065],
      ],
      blue,
      0,
      0,
      0,
      0.012,
    );
    disk(ink, 0.016, 0.012, blue, 0.077, -0.047, 0.004, 7);
    ink.visible = false;
    const answer = groupAt(root, 0.04, 1.13, 0.088);
    const need = String(card.need || '').replace(/[，。]/g, '');
    poly(
      answer,
      [
        [-0.48, -0.012],
        [-0.45, 0.24],
        [0.4, 0.24],
        [0.49, 0.16],
        [0.49, -0.012],
        [0.01, -0.012],
        [-0.09, -0.075],
        [-0.11, -0.012],
      ],
      sheet,
      0,
      0,
      0,
      0.022,
    );
    const lines = need.match(/.{1,11}/gu) || [];
    type(answer, lines.join('\n'), 0.91, 0.205, 0, 0.114, 0.016, blue, 'transparent');
    answer.visible = false;
    const response = groupAt(root, 0.182, 0.754, 0.109);
    poly(
      response,
      [
        [-0.036, -0.1],
        [0.023, -0.132],
        [0.165, -0.078],
        [0.247, 0.113],
        [0.145, 0.16],
        [0.089, -0.001],
      ],
      front,
      0,
      0,
      0,
      0.052,
      edge,
    );
    poly(
      response,
      [
        [0.143, 0.133],
        [0.173, 0.265],
        [0.202, 0.276],
        [0.201, 0.228],
        [0.235, 0.299],
        [0.263, 0.296],
        [0.249, 0.226],
        [0.272, 0.257],
        [0.291, 0.243],
        [0.263, 0.164],
        [0.239, 0.102],
      ],
      '#dfa785',
      0,
      0,
      0.025,
      0.032,
    );
    response.visible = false;
    return { root, flap, ink, response, portrait, answer };
  }
  S.persona = function (s) {
    const { cards, messages } = window.DecisionGames.rules.persona;
    const pink = '#dd9aa6',
      dark = '#844f64',
      cream = '#ffeddc',
      blue = '#355f8d',
      slate = '#425263';
    const stand = K.group();
    box(stand, 2.94, 0.16, 1.17, C.wood, 0, 0.092, 0);
    ledge(stand, 3.05, 1.22, 0, 0.2, 0, '#ad7281');
    for (const x of [-1.31, 1.31]) {
      box(stand, 0.108, 2.12, 0.125, dark, x, 1.29, -0.17);
      box(stand, 0.14, 0.07, 0.162, C.edge, x, 1.99, -0.17);
    }
    box(stand, 2.61, 0.726, 0.25, '#e2a8a8', 0, 0.662, 0.14);
    box(stand, 2.35, 0.5, 0.06, cream, 0, 0.68, 0.293);
    type(stand, '園 遊 會　水 壺 攤', 2.17, 0.283, 0, 0.691, 0.336, dark, 'transparent');
    ledge(stand, 2.9, 0.65, 0, 1.04, 0.057, '#b87a7d');
    for (const x of [-1.18, 1.18]) strut(stand, [x, 1.052, 0.22], [x, 1.47, 0.2], 0.012, C.brass, 6);
    const bottles = [
      [-1.08, 0.54, '#88b8ad'],
      [-0.8, 0.69, '#ba7c91'],
      [0.82, 0.7, '#7c9fb2'],
      [1.092, 0.52, '#d6a36d'],
    ];
    bottles.forEach(([x, k, col]) => fairBottle(stand, x, 1.105, 0.036, col, k));
    // Each stripe is one cut panel, including the folded scallop on its leading edge.
    for (let i = 0; i < 10; i++) {
      const x = -1.377 + i * 0.306,
        col = i % 2 ? cream : pink;
      const canopy = box(stand, 0.307, 0.062, 0.91, col, x, 2.28, -0.03);
      canopy.rotation.x = 0.28;
      poly(
        stand,
        [
          [-0.154, 0.04],
          [0.154, 0.04],
          [0.154, -0.07],
          [0.098, -0.154],
          [0, -0.171],
          [-0.094, -0.154],
          [-0.154, -0.07],
        ],
        col,
        x,
        2.15,
        0.408,
        0.059,
      );
    }
    box(stand, 3.12, 0.062, 0.092, dark, 0, 2.42, -0.45);
    for (const x of [-1.16, 1.16]) strut(stand, [x, 2.423, -0.35], [x, 2.71, -0.35], 0.025, C.wood);
    const crest = groupAt(stand, 0, 2.645, -0.35);
    poly(
      crest,
      [
        [-1.18, -0.121],
        [-1.08, 0.103],
        [-0.8, 0.12],
        [-0.71, 0.23],
        [0.71, 0.23],
        [0.8, 0.12],
        [1.08, 0.103],
        [1.18, -0.121],
      ],
      pink,
      0,
      0,
      0,
      0.063,
    );
    type(crest, 'PEOPLE MODEL', 1.66, 0.195, 0, 0.038, 0.048, slate, 'transparent');
    const sign = groupAt(stand, 0, 1.841, 0.146);
    for (const x of [-0.62, 0.62]) strut(stand, [x, 2.24, 0.12], [x, 2.01, 0.147], 0.017, C.brass, 5);
    box(sign, 1.76, 0.426, 0.073, dark, 0, 0, 0);
    box(sign, 1.635, 0.345, 0.025, cream, 0, 0, 0.047);
    const editions = ['掛上招牌', ...messages].map((line, i) =>
      type(sign, line, 1.5, 0.231, 0, 0, 0.066, i ? dark : C.slate, 'transparent'),
    );
    editions.forEach((item, i) => {
      item.visible = i === 0;
    });
    prop(s, stand, 1.76, -0.87, 0, -0.025);
    s.hot(sign, 'run', '試掛目前這張招牌', [0, 0.005, 0.08], 'lift');

    const rowPositions = [
      [-3.71, -0.34],
      [-2.55, -0.31],
      [-1.33, -0.25],
      [-3.55, 1.1],
      [-2.33, 1.1],
      [-1.12, 1.14],
    ];
    const people = cards.slice(0, 6).map((card, i) => {
      const figure = profileFigure(card, i),
        row = i < 3 ? 1 : 0;
      const [x, z] = rowPositions[i];
      figure.root.scale.setScalar(1.12);
      prop(s, figure.root, x, z, row * 0.12, ((i % 3) - 1) * -0.053);
      s.hot(figure.root, 'person' + i, '攤開' + card.name + '的調查紙人', [0, 0.6, 0.083], 'tap');
      return figure;
    });
    const rope = K.group();
    for (const x of [-1.28, 1.28]) strut(rope, [x, 0, 0], [x, 1.64, 0], 0.028, C.wood);
    for (let i = 0; i < 8; i++) {
      const x = -1.24 + i * 0.355,
        y = 1.59 - 0.16 * (1 - Math.abs(x) / 1.3);
      if (i < 7)
        strut(
          rope,
          [x, y, 0],
          [x + 0.355, 1.59 - 0.16 * (1 - Math.abs(x + 0.355) / 1.3), 0],
          0.012,
          C.wheat,
          4,
        );
      poly(
        rope,
        [
          [-0.099, 0],
          [0.1, 0],
          [0.005, -0.202],
        ],
        i % 2 ? cream : pink,
        x,
        y,
        0.014,
        0.014,
      );
    }
    prop(s, rope, -2.52, -1.6);
    const shelf = K.group();
    ledge(shelf, 2.03, 0.7, 0, 0.4, 0, dark);
    for (const x of [-0.68, 0.68]) box(shelf, 0.088, 0.39, 0.38, C.wood, x, 0.2, 0);
    const options = messages.map((message, i) => {
      const tag = groupAt(shelf, (i - 0.5) * 0.97, 0.48, 0.0);
      poly(
        tag,
        [
          [-0.45, 0],
          [0.45, 0],
          [0.45, 0.38],
          [0.37, 0.46],
          [-0.45, 0.46],
        ],
        i ? cream : '#edd0d0',
        0,
        0,
        0,
        0.035,
      );
      type(tag, message, 0.82, 0.153, 0, 0.26, 0.032, dark, 'transparent');
      box(tag, 0.4, 0.019, 0.012, i ? C.brass : pink, 0, 0.118, 0.028);
      s.hot(tag, 'copy' + i, '選「' + message + '」', [0, 0.239, 0.044], 'lift');
      return tag;
    });
    prop(s, shelf, 1.51, 0.72, 0, -0.03);
    const brand = K.group();
    box(brand, 0.83, 0.17, 0.48, C.wood, 0, 0.09, 0);
    box(brand, 0.73, 0.07, 0.39, blue, 0, 0.215, 0);
    const brandLeaf = groupAt(brand, 0, 0.272, 0);
    box(brandLeaf, 0.693, 0.594, 0.047, cream, 0, 0.302, 0);
    type(brandLeaf, '晴 川', 0.59, 0.19, 0, 0.352, 0.032, blue, 'transparent');
    const shutter = groupAt(brand, 0, 0.884, 0.066);
    box(shutter, 0.735, 0.592, 0.052, slate, 0, -0.295, 0);
    type(shutter, '牌名蓋紙', 0.48, 0.166, 0, -0.296, 0.033, C.cream, 'transparent');
    prop(s, brand, 3.57, 0.76, 0, -0.09);
    const tab = groupAt(brand, -0.49, 0.44, 0.049);
    poly(
      tab,
      [
        [-0.13, -0.12],
        [0.132, -0.12],
        [0.132, 0.14],
        [-0.13, 0.14],
      ],
      '#92abc8',
      0,
      0,
      0,
      0.09,
    );
    type(tab, '揭', 0.18, 0.15, 0, 0.01, 0.054, C.deep, 'transparent');
    s.hot(tab, 'reveal', '展示新品牌名', [0, 0.01, 0.064], 'lift');
    s.hot(shutter, 'cover', '把牌名蓋回去', [0, -0.294, 0.046], 'tap');
    // The ink blotter remains visible after the cover closes.
    const blotter = groupAt(brand, 0.328, 0.165, 0.198);
    poly(
      blotter,
      [
        [-0.1, -0.05],
        [-0.084, 0.077],
        [-0.014, 0.122],
        [0.11, 0.078],
        [0.118, -0.017],
        [0.031, -0.081],
      ],
      blue,
      0,
      0,
      0.055,
      0.042,
    );
    s.hot(blotter, 'find:1', '墨印會跟著樣本留下', [0, 0.036, 0.089]);

    const stack = K.group();
    for (let i = 0; i < 4; i++) {
      const card = box(
        stack,
        0.76,
        0.042,
        0.56,
        i === 3 ? cream : i % 2 ? pink : C.edge,
        i * 0.017,
        0.048 + i * 0.045,
        -i * 0.012,
      );
      card.rotation.y = (i - 1) * 0.055;
    }
    const stackLabel = type(stack, '換乾淨樣本', 0.65, 0.17, 0, 0.222, 0, dark, 'transparent');
    stackLabel.rotation.x = -Math.PI / 2;
    prop(s, stack, -0.48, 1.85, 0, -0.21);
    s.hot(stack, 'fresh', '拿一批乾淨的調查樣本', [0, 0.22, 0.03], 'lift');
    const foldCard = K.group();
    const foldCover = poly(
      foldCard,
      [
        [-0.45, 0],
        [0, 0.23],
        [0.44, 0.015],
        [0.41, -0.082],
        [-0.04, 0.07],
        [-0.43, -0.1],
      ],
      '#f8e7c9',
      0,
      0.21,
      0,
      0.219,
    );
    foldCover.rotation.y = 0.12;
    strut(foldCard, [0, 0.29, 0.129], [0.006, 0.43, 0.129], 0.014, dark, 4);
    prop(s, foldCard, -3.82, 1.88, 0, 0.1);
    s.hot(foldCard, 'find:0', '看紙人背面的調查摺痕', [0, 0.34, 0.121]);
    const question = K.group();
    strut(question, [0, 0, 0], [0, 0.69, 0], 0.034, C.wood);
    poly(
      question,
      [
        [-0.36, -0.16],
        [0.36, -0.16],
        [0.36, 0.16],
        [-0.28, 0.16],
        [-0.36, 0.09],
      ],
      cream,
      0,
      0.59,
      0,
      0.059,
    );
    type(question, '原先聽過？', 0.63, 0.135, 0, 0.59, 0.039, blue, 'transparent');
    prop(s, question, 2.88, 1.7, 0, -0.1);
    s.hot(question, 'scope1', '追問原本的品牌知名度', [0, 0.59, 0.048]);
    prop(s, K.notebook('model'), 0.58, 1.79, 0, -0.08);
    let opened = [],
      isExposed = false,
      isCovered = false,
      report = null,
      swing = 0,
      inkTime = 0,
      stampAge = 1;
    return {
      update(state, action) {
        if (!state) return;
        opened = state.opened || [];
        isExposed = Boolean(state.exposed);
        isCovered = !isExposed || Boolean(state.covered);
        report = Number.isInteger(state.report) ? state.report : null;
        editions.forEach((node, i) => {
          node.visible = i === (report === null ? 0 : report + 1);
        });
        options.forEach((node, i) => {
          node.rotation.x = i === state.copy ? -0.16 : 0.05;
        });
        if (action === 'run') swing = 1;
        if (action === 'reveal') {
          inkTime = 1;
          stampAge = 0;
        }
        people.forEach((person, i) => {
          person.ink.visible = isExposed;
          person.answer.visible = opened.includes(i);
          person.response.visible = report !== null && Boolean(cards[i].match?.[report]);
        });
      },
      tick(t, dt) {
        const follow = dt ? 1 - Math.exp(-dt * 8) : 1;
        swing = dt ? Math.max(0, swing - dt * 0.9) : 0;
        inkTime = dt ? Math.max(0, inkTime - dt) : 0;
        stampAge = dt ? Math.min(1, stampAge + dt * 3) : 1;
        sign.rotation.z = Math.sin(swing * 13) * swing * 0.095;
        const coverTarget = isCovered ? 0 : -2.33;
        shutter.rotation.x += (coverTarget - shutter.rotation.x) * follow;
        people.forEach((person, i) => {
          const open = opened.includes(i);
          const angle = open ? -1.66 : -0.15 - 0.047 * (i % 3);
          person.flap.rotation.y += (angle - person.flap.rotation.y) * follow;
          person.portrait.rotation.z = dt ? 0.016 * Math.sin(t * 1.5 + i) : 0;
          person.response.rotation.z = dt ? 0.057 * Math.sin(t * 3.1 + i * 0.66) : 0;
          person.ink.scale.setScalar(
            isExposed ? 0.9 + inkTime * 0.19 + Math.sin(stampAge * Math.PI) * 0.23 : 1,
          );
        });
      },
    };
  };

  function specimenBench(tone, name, variety) {
    const bench = K.group(),
      pink = '#e9bdba';
    box(bench, 1.02, 0.32, 0.49, C.ink, 0, 0.17, 0);
    box(bench, 1.07, 0.085, 0.55, pink, 0, 0.367, 0);
    type(bench, name, 0.66, 0.18, 0, 0.185, 0.256, C.edge, 'transparent');
    // Back plate and measuring jaw give each tested condition a common reference.
    poly(
      bench,
      [
        [-0.51, 0],
        [0.51, 0],
        [0.51, 0.83],
        [0.41, 0.93],
        [-0.51, 0.93],
      ],
      pink,
      0,
      0.4,
      -0.17,
      0.065,
    );
    for (let i = 0; i < 6; i++)
      box(bench, i % 2 ? 0.074 : 0.13, 0.016, 0.018, C.ink, -0.428, 0.5 + i * 0.138, -0.12);
    for (let i = 0; i < 5; i++) box(bench, 0.012, 0.6, 0.013, '#c49c96', -0.27 + i * 0.15, 0.84, -0.122);
    const specimen = groupAt(bench, 0, 0.425, 0.022);
    if (variety === 0) {
      poly(
        specimen,
        [
          [-0.19, 0.02],
          [0.16, 0.02],
          [0.204, 0.078],
          [0.18, 0.4],
          [0.11, 0.46],
          [0.065, 0.49],
          [0.02, 0.58],
          [-0.102, 0.58],
          [-0.107, 0.46],
          [-0.19, 0.4],
        ],
        tone,
        0,
        0,
        0,
        0.17,
      );
      box(specimen, 0.145, 0.055, 0.139, C.ink, -0.04, 0.597, 0);
      box(specimen, 0.246, 0.17, 0.016, C.edge, 0, 0.245, 0.096);
      box(specimen, 0.16, 0.022, 0.018, tone, -0.005, 0.25, 0.109);
    } else if (variety === 1) {
      poly(
        specimen,
        [
          [-0.23, 0.04],
          [0.31, 0.04],
          [0.325, 0.135],
          [0.25, 0.19],
          [0.049, 0.23],
          [-0.026, 0.43],
          [-0.17, 0.48],
          [-0.237, 0.41],
        ],
        C.brick,
        0,
        0.02,
        0,
        0.17,
      );
      box(specimen, 0.556, 0.055, 0.178, C.ink, 0.035, 0.058, 0.015);
      for (let i = 0; i < 3; i++)
        box(specimen, 0.099, 0.02, 0.01, C.edge, -0.043 + i * 0.043, 0.342 - i * 0.046, 0.092);
    } else {
      for (let i = 0; i < 3; i++)
        poly(
          specimen,
          [
            [-0.08, 0],
            [0.08, 0],
            [0.082, 0.34],
            [-0.083, 0.34],
          ],
          i === 1 ? C.wheat : C.brick,
          (i - 1) * 0.135,
          0.047,
          i * 0.02,
          0.088,
        );
    }
    bench.userData.specimen = specimen;
    return bench;
  }
  function coinRack(parent, x, z) {
    const g = groupAt(parent, x, 0, z),
      coins = [];
    cylinder(g, 0.29, 0.25, 0.12, 10, C.wood, 0, 0.075, 0);
    for (let j = 0; j < 3; j++) {
      const coin = cylinder(g, 0.24, 0.24, 0.075, 12, C.amber, 0, 0.167 + j * 0.09, 0);
      coin.visible = false;
      coins.push(coin);
    }
    const hand = groupAt(g, 0, 0.57, 0);
    disk(hand, 0.226, 0.085, C.brass, 0, 0, 0, 12);
    disk(hand, 0.18, 0.04, C.amber, 0, 0, 0.06, 12);
    box(hand, 0.17, 0.036, 0.037, C.cream, 0, 0, 0.09);
    box(hand, 0.036, 0.17, 0.037, C.cream, 0, 0, 0.09);
    return { coins, hand };
  }
  S.context = function (s) {
    skyline(s, -2.62, -2.1, 2.65, C.leaf, C.edge);
    plant(s, 4.02, -1.72, 1.4, 'cypress', 9);
    plant(s, -4.07, -1.61, 1.25, 'round', 8);
    const scale = K.group();
    ledge(scale, 2.34, 1.0, 0, 0.12, 0, C.wood);
    poly(
      scale,
      [
        [-0.33, 0],
        [-0.17, 0.29],
        [-0.14, 1.89],
        [-0.09, 2.2],
        [0.09, 2.2],
        [0.14, 1.89],
        [0.17, 0.29],
        [0.33, 0],
      ],
      C.green,
      0,
      0.17,
      0,
      0.23,
    );
    poly(
      scale,
      [
        [-0.033, 0],
        [-0.033, 1.91],
        [0.06, 2.0],
        [0.05, 0],
      ],
      C.brass,
      0,
      0.29,
      0.25,
      0.026,
    );
    const crown = disk(scale, 0.22, 0.15, C.wheat, 0, 2.48, 0.1, 10);
    const beam = groupAt(scale, 0, 2.29, 0.25);
    poly(
      beam,
      [
        [-1.22, 0.02],
        [-0.84, 0.12],
        [-0.28, 0.04],
        [0, 0.15],
        [0.28, 0.04],
        [0.84, 0.12],
        [1.22, 0.02],
        [1.22, -0.085],
        [0.84, -0.02],
        [0.28, -0.08],
        [0, 0.015],
        [-0.28, -0.08],
        [-0.84, -0.02],
        [-1.22, -0.085],
      ],
      C.brass,
      0,
      0,
      0,
      0.1,
    );
    const pans = [];
    for (const side of [-1, 1]) {
      const pan = groupAt(beam, side * 1.025, 0, 0.06);
      for (const [x, z] of [
        [-0.34, 0.14],
        [0.34, 0.14],
        [0, -0.31],
      ])
        strut(pan, [0, -0.01, 0], [x, -0.75, z], 0.014, C.wood);
      cylinder(pan, 0.38, 0.19, 0.145, 10, C.amber, 0, -0.8, 0);
      pans.push(pan);
    }
    type(scale, '衡 斷 所', 1.04, 0.24, 0, 0.43, 0.39, C.edge, C.green);
    const gauge = calibration(scale, 0, 0.73, 0.3, 1.61, '配置刻度');
    const pennant = flag(scale, 0.1, 2.62, 0, C.brick, 0.8);
    prop(s, scale, 1.91, -0.79);
    s.hot(scale, 'commit', '觀察選擇時刻', [0, 2.37, 0.24]);
    const locations = [
      [-3.62, 0.46],
      [-1.98, -0.73],
      [3.5, 1.42],
    ];
    const stalls = [],
      racks = [];
    ['通路', '社群', '記憶'].forEach((word, i) => {
      const stall = specimenBench([C.green, C.brick, C.slate][i], word, i);
      const [x, z] = locations[i];
      prop(s, stall, x, z, 0, i === 2 ? -0.13 : 0.1);
      const rack = coinRack(stall, 0.57, 0.28);
      if (i < 2)
        s.hot(
          stall.userData.specimen,
          'find:' + i,
          i === 0 ? '拿起測試台的洗衣精' : '看看測試台的登山鞋',
          [0, 0.32, 0.1],
          'lift',
        );
      racks.push(rack);
      stalls.push(stall);
      s.hot(rack.hand, 'plus' + i, '投入' + word + '籌碼', [0, 0.23, 0.09], 'lift');
    });
    notebook(s, 'model');
    let tilt = 0,
      rock = 0;
    return {
      tick(t, dt) {
        beam.rotation.z += (tilt - beam.rotation.z) * Math.min(1, dt * 7);
        pans.forEach((p) => (p.rotation.z = -beam.rotation.z));
        pennant.rotation.y = 0.15 * Math.sin(t * 2);
        crown.rotation.z = 0.08 * Math.sin(t * 0.8);
        rock = Math.max(0, rock - dt);
        gauge.tick(dt);
        stalls.forEach(
          (p, i) =>
            (p.rotation.z =
              rock && racks[i].coins.some((c) => c.visible) ? Math.sin(rock * 13) * 0.015 * rock : 0),
        );
      },
      update(state, action) {
        if (!state) return;
        const tokens = state.tokens || [0, 0, 0];
        gauge.set(tokens.reduce((a, b) => a + b, 0) / 3);
        tilt = (tokens[0] - tokens[2]) * 0.055 + (tokens[1] - 1) * 0.024;
        racks.forEach(({ coins, hand }, i) => {
          coins.forEach((c, j) => (c.visible = j < tokens[i]));
          hand.rotation.y = tokens.reduce((a, b) => a + b, 0) === 3 ? 0.78 : 0;
        });
        if (/^plus|^minus/.test(action || '')) rock = 0.9;
      },
    };
  };

  const dusk = { wall: '#9eafb0', night: '#344d61', trim: '#e9d7aa', red: '#a95748', light: '#f0c172' };
  function roof(group, w, d, h, x, y, z, roofColor) {
    const triangle = [
      [-w / 2, 0],
      [0, h],
      [w / 2, 0],
    ];
    poly(group, triangle, roofColor, x, y, z, d, C.wheat);
    const slope = Math.atan2(h, w / 2),
      length = Math.hypot(w / 2, h);
    for (const side of [-1, 1]) {
      const panel = box(
        group,
        length + 0.045,
        0.047,
        d + 0.036,
        roofColor,
        x + (side * w) / 4,
        y + h / 2 + 0.025,
        z,
      );
      panel.rotation.z = -side * slope;
      for (const fraction of [-0.3, 0, 0.3]) {
        const zz = z + fraction * d;
        strut(
          group,
          [x, y + h + 0.06, zz],
          [x + (side * w) / 2, y + 0.06, zz],
          0.012,
          roofColor === C.slate ? C.blue : C.slate,
        );
      }
    }
    strut(group, [x - w / 2, y, z + d / 2 + 0.035], [x, y + h, z + d / 2 + 0.035], 0.035, C.edge);
    strut(group, [x, y + h, z + d / 2 + 0.035], [x + w / 2, y, z + d / 2 + 0.035], 0.035, C.edge);
  }
  function clockFace(parent, x, y, z, scale = 1) {
    const g = groupAt(parent, x, y, z);
    g.scale.setScalar(scale);
    disk(g, 0.255, 0.075, C.brass, 0, 0, 0);
    disk(g, 0.209, 0.04, C.cream, 0, 0, 0.072);
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      disk(g, 0.015, 0.02, C.ink, Math.sin(a) * 0.176, Math.cos(a) * 0.176, 0.107, 5);
    }
    strut(g, [0, -0.015, 0.119], [0, 0.137, 0.119], 0.015, C.ink);
    strut(g, [0, 0, 0.12], [-0.097, 0.048, 0.12], 0.017, C.ink);
    disk(g, 0.022, 0.025, C.brick, 0, 0, 0.14, 6);
    return g;
  }
  function envelope(parent, x, y, z, w = 0.46) {
    const g = groupAt(parent, x, y, z),
      h = w * 0.64;
    box(g, w, h, 0.06, C.cream, 0, 0, 0);
    poly(
      g,
      [
        [-w / 2, h / 2],
        [w / 2, h / 2],
        [0, -h * 0.15],
      ],
      C.wheat,
      0,
      0,
      0.04,
      0.018,
    );
    disk(g, w * 0.065, 0.03, C.wine, 0, -0.025, 0.08, 8);
    return g;
  }
  function gutterHouses(s) {
    skyline(s, -2.6, -2.3, 2.93, C.slate, C.wheat);
    plant(s, -4.2, -1.36, 1.14, 'cypress', 5);
    plant(s, 4.14, -1.48, 1.32, 'cypress', 6);
  }
  S.friction = function (s) {
    gutterHouses(s);
    const post = K.group();
    box(post, 2.41, 1.43, 1.0, dusk.red, 0, 0.82, 0);
    ledge(post, 2.66, 1.11, 0, 0.12, 0, C.shadow);
    ledge(post, 2.57, 1.11, 0, 1.53, 0, C.wood);
    roof(post, 2.74, 1.21, 0.63, 0, 1.6, 0, C.slate);
    // A clock pavilion rises independently from the long mail-sorting hall.
    box(post, 0.75, 0.65, 0.7, C.rose, 0.48, 2.15, -0.04);
    ledge(post, 0.85, 0.78, 0.48, 2.5, -0.04, C.brick);
    const cap = cylinder(post, 0.082, 0.6, 0.47, 4, C.deep, 0.48, 2.77, -0.03);
    cap.rotation.y = Math.PI / 4;
    cylinder(post, 0.017, 0.034, 0.22, 6, C.amber, 0.48, 3.1, -0.03);
    const clock = clockFace(post, 0.48, 2.18, 0.33, 0.95);
    s.hot(clock, 'find:0', '讀郵局的服務時鐘', [0, 0, 0.13], 'spin');
    for (const side of [-1, 1]) {
      for (let j = 0; j < 4; j++) {
        box(post, 0.2, 0.085, 0.052, C.wheat, side * 1.08, 0.34 + 0.28 * j, 0.518);
      }
    }
    box(post, 1.14, 0.69, 0.068, C.deep, 0.22, 0.94, 0.53);
    box(post, 1.24, 0.105, 0.39, C.wood, 0.22, 0.6, 0.69);
    type(post, '取 貨', 0.71, 0.22, 0.22, 1.37, 0.57, C.edge, C.deep);
    windowPane(post, -0.68, 0.99, 0.535, 0.44, 0.55);
    const shutter = groupAt(post, 0.19, 1.19, 0.603);
    for (let i = 0; i < 4; i++) box(shutter, 0.94, 0.075, 0.026, C.moss, 0, -i * 0.083, 0.01);
    const clerk = K.person(C.slate);
    clerk.scale.setScalar(0.63);
    at(post, clerk, 0.17, 0.603, 0.607);
    bookCrate(post, -0.08, 0.665, 0.72, C.brass);
    const notice = groupAt(post, 0.62, 0.73, 0.75);
    type(notice, 'SAT', 0.37, 0.19, 0, 0, 0, C.ink, C.wheat);
    notice.visible = false;
    const emblem = envelope(post, -0.43, 1.88, 0.62, 0.46);
    emblem.rotation.z = 0.04;
    prop(s, post, 1.77, -0.69, 0, -0.045);
    s.hot(post, 'stop1', '查看取貨窗口', [0.25, 0.99, 0.58]);
    const line = K.group();
    for (const x of [-0.97, 0.97])
      for (const z of [-0.23, 0.23]) box(line, 0.075, 0.48, 0.075, C.wood, x, 0.25, z);
    box(line, 2.36, 0.16, 0.62, C.ink, 0, 0.59, 0);
    const rollers = [];
    for (let i = 0; i < 12; i++) {
      const roller = cylinder(line, 0.088, 0.088, 0.55, 7, i % 2 ? C.slate : C.blue, -1.07 + i * 0.195, 0.7, 0);
      roller.rotation.x = Math.PI / 2;
      rollers.push(roller);
    }
    const parcel = groupAt(line, -0.85, 0.79, 0);
    bookCrate(parcel, 0, 0, 0, C.brick);
    const pin = groupAt(line, -0.87, 0.71, -0.285);
    strut(pin, [0, 0, 0], [0, 0.56, 0], 0.032, C.wood);
    type(pin, '商品', 0.36, 0.19, 0, 0.5, 0.04, C.edge, C.deep);
    prop(s, line, -2.63, 0.15, 0, 0.07);
    s.hot(parcel, 'stop0', '沿輸送帶移動包裹', [0, 0.26, 0], 'slide');
    const callBox = K.group();
    box(callBox, 0.61, 0.51, 0.48, C.wood, 0, 0.265, 0);
    box(callBox, 0.67, 0.08, 0.53, C.wheat, 0, 0.55, 0);
    box(callBox, 0.6, 0.78, 0.39, C.brick, 0, 0.97, -0.07);
    windowPane(callBox, 0, 1.03, 0.13, 0.42, 0.44);
    roof(callBox, 0.8, 0.59, 0.28, 0, 1.39, -0.04, C.slate);
    type(callBox, '客服', 0.43, 0.18, 0, 0.73, 0.17, C.cream, C.brick);
    const bell = disk(callBox, 0.12, 0.06, C.brass, 0.19, 0.58, 0.24, 8);
    prop(s, callBox, 3.75, 1.41, 0, -0.17);
    s.hot(callBox, 'stop2', '接通客服窗口', [0, 1.19, 0.17]);
    const docket = K.group();
    box(docket, 0.75, 0.41, 0.36, C.green, 0, 0.22, 0);
    box(docket, 0.84, 0.07, 0.43, C.wheat, 0, 0.45, 0);
    const slip = envelope(docket, 0, 0.7, 0.075, 0.5);
    prop(s, docket, -3.57, 1.65, 0, 0.1);
    s.hot(slip, 'fix1', '提起取貨日單據', [0, 0.2, 0.09], 'lift');
    notebook(s, 'ai');
    s.hot(bell, 'find:1', '試一試客服鈴', [0, 0, 0.045], 'tap');
    const flow = router(['門市', '交期', '客服']);
    prop(s, flow.unit, -2.43, -1.13, 0.13);
    let destination = -0.85,
      activeCall = false;
    return {
      tick(t, dt) {
        flow.tick(dt);
        parcel.position.x += (destination - parcel.position.x) * Math.min(1, dt * 4);
        rollers.forEach((r, i) => (r.rotation.y = 0.08 * Math.sin(t * 1.1 + i * 0.14)));
        bell.rotation.z = activeCall ? 0.16 * Math.sin(t * 9) : 0;
        slip.rotation.z = 0.045 * Math.sin(t * 0.85);
      },
      update(state) {
        if (!state) return;
        destination = [-0.22, 0.36, 0.83][state.stop] ?? -0.85;
        shutter.scale.y = state.seen?.includes(1) ? 0.18 : 1;
        notice.visible = state.fix === 1;
        activeCall = state.stop === 2;
        flow.set(state.fix === 1 ? 0 : state.fix === 2 ? 1 : -1);
      },
    };
  };

  function track(s, x, z, w) {
    const g = K.group();
    for (let i = 0; i <= Math.floor(w / 0.27); i++)
      box(g, 0.09, 0.035, 0.57, C.wood, -w / 2 + i * 0.27, 0.035, 0);
    for (const zz of [-0.17, 0.17]) box(g, w, 0.055, 0.041, C.slate, 0, 0.078, zz);
    return prop(s, g, x, z);
  }
  function railcar() {
    const g = K.group();
    box(g, 1.59, 0.13, 0.55, C.ink, 0, 0.27, 0);
    box(g, 1.53, 0.6, 0.5, C.brick, 0, 0.63, 0);
    box(g, 1.5, 0.37, 0.53, C.cream, 0, 0.72, 0);
    box(g, 1.66, 0.11, 0.62, C.deep, 0, 0.99, 0);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) box(g, 0.21, 0.22, 0.018, C.blue, -0.56 + i * 0.31, 0.754, side * 0.279);
      for (const x of [-0.55, 0.51]) disk(g, 0.139, 0.07, C.shadow, x, 0.207, side * 0.22, 12);
    }
    box(g, 0.15, 0.49, 0.031, C.leaf, 0.63, 0.61, 0.28);
    return g;
  }
  function moon(s, x, z, height) {
    const g = K.group();
    const points = [];
    for (let i = 0; i <= 17; i++) {
      const a = Math.PI * (0.34 + i * (1.36 / 17));
      points.push([0.37 * Math.cos(a), 0.37 * Math.sin(a)]);
    }
    for (let i = 0; i <= 12; i++) {
      const a = Math.PI * (-0.53 - i * (0.94 / 12));
      points.push([0.21 + 0.3 * Math.cos(a), 0.29 * Math.sin(a)]);
    }
    strut(g, [0, 0, 0], [0, height - 0.1, 0], 0.017, C.wood);
    const moon = poly(g, points, C.wheat, 0, height, 0, 0.055);
    prop(s, g, x, z);
    return moon;
  }
  function breakfastBag(parent, x, y, z, size = 1) {
    const g = groupAt(parent, x, y, z);
    g.scale.setScalar(size);
    poly(
      g,
      [
        [-0.184, 0],
        [0.17, 0],
        [0.203, 0.34],
        [0.121, 0.422],
        [-0.136, 0.423],
        [-0.19, 0.313],
      ],
      '#c99661',
      0,
      0,
      0,
      0.16,
    );
    poly(
      g,
      [
        [-0.17, 0.334],
        [0.167, 0.334],
        [0.12, 0.421],
        [-0.135, 0.424],
      ],
      '#efe3bf',
      0,
      0,
      0.085,
      0.018,
    );
    strut(g, [-0.087, 0.4, 0], [-0.072, 0.582, 0], 0.013, C.wood);
    strut(g, [-0.072, 0.582, 0], [0.067, 0.582, 0], 0.013, C.wood);
    strut(g, [0.067, 0.582, 0], [0.091, 0.4, 0], 0.013, C.wood);
    box(g, 0.174, 0.117, 0.014, C.cream, 0, 0.218, 0.094);
    box(g, 0.084, 0.019, 0.009, '#869d83', 0, 0.22, 0.105);
    return g;
  }
  function tripBuggy() {
    const g = K.group();
    for (const side of [-1, 1]) {
      const z = side * 0.118;
      for (const x of [-0.171, 0.182]) disk(g, 0.084, 0.039, C.deep, x, 0.087, z, 10);
      strut(g, [-0.17, 0.103, z], [0.13, 0.39, z], 0.017, C.cream);
      strut(g, [0.183, 0.1, z], [-0.12, 0.372, z], 0.018, C.ink);
    }
    poly(
      g,
      [
        [-0.215, 0.257],
        [0.176, 0.245],
        [0.2, 0.393],
        [-0.117, 0.428],
        [-0.212, 0.382],
      ],
      '#c68073',
      0,
      0,
      0,
      0.247,
    );
    poly(
      g,
      [
        [-0.166, 0.392],
        [-0.14, 0.523],
        [-0.05, 0.596],
        [0.058, 0.586],
        [0.151, 0.503],
        [0.168, 0.425],
      ],
      '#79b5af',
      0,
      0,
      0,
      0.264,
    );
    for (const x of [-0.125, -0.034, 0.06]) strut(g, [0.14, 0.421, 0.144], [x, 0.537, 0.144], 0.007, '#4c8086');
    strut(g, [-0.16, 0.293, -0.045], [-0.33, 0.62, -0.045], 0.018, C.deep);
    strut(g, [-0.33, 0.62, -0.045], [-0.416, 0.622, -0.045], 0.026, C.wood);
    return g;
  }
  function breakfastTraveller() {
    const g = K.group();
    const legs = [];
    for (const [i, x] of [-0.092, 0.097].entries()) {
      const leg = groupAt(g, x, 0.402, (i - 0.5) * 0.065);
      poly(
        leg,
        [
          [-0.055, 0],
          [0.057, 0],
          [0.082, -0.319],
          [-0.024, -0.337],
        ],
        i ? C.deep : '#444f62',
        0,
        0,
        0,
        0.052,
      );
      box(leg, 0.175, 0.061, 0.101, C.shadow, 0.018, -0.335, 0.018);
      legs.push(leg);
    }
    const torso = groupAt(g, 0, 0.333, 0);
    poly(
      torso,
      [
        [-0.19, 0.025],
        [-0.154, 0.413],
        [-0.085, 0.51],
        [0.092, 0.488],
        [0.142, 0.422],
        [0.173, 0.023],
        [0.104, -0.022],
      ],
      '#d69764',
      0,
      0,
      0,
      0.145,
    );
    poly(
      torso,
      [
        [-0.066, 0.478],
        [0.033, 0.445],
        [0.075, 0.486],
        [0.108, 0.439],
        [0.053, 0.385],
        [-0.009, 0.418],
        [-0.07, 0.282],
        [-0.115, 0.299],
      ],
      '#789496',
      0,
      0,
      0.089,
      0.035,
    );
    poly(
      torso,
      [
        [-0.109, 0.51],
        [-0.121, 0.616],
        [-0.104, 0.734],
        [-0.049, 0.784],
        [0.067, 0.78],
        [0.122, 0.71],
        [0.125, 0.582],
        [0.082, 0.519],
        [0.056, 0.471],
        [-0.052, 0.466],
      ],
      '#ddaa8a',
      0,
      0,
      0,
      0.114,
    );
    poly(
      torso,
      [
        [-0.127, 0.65],
        [-0.124, 0.747],
        [-0.076, 0.795],
        [0.037, 0.815],
        [0.112, 0.765],
        [0.138, 0.717],
        [0.09, 0.686],
        [0.007, 0.747],
        [-0.071, 0.704],
        [-0.1, 0.633],
      ],
      C.deep,
      0,
      0,
      0.055,
      0.048,
    );
    box(torso, 0.022, 0.016, 0.01, C.deep, 0.083, 0.658, 0.067);
    strut(torso, [0.106, 0.383, 0.062], [0.204, 0.232, 0.084], 0.047, '#bd855e');
    strut(torso, [0.204, 0.232, 0.084], [0.234, 0.202, 0.086], 0.032, '#deb08a');
    breakfastBag(torso, 0.253, -0.078, 0.078, 0.53);
    return { g, legs };
  }
  function tripRoad(s, path, width, color, mark) {
    const points = [];
    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1],
        b = path[i],
        dx = b[0] - a[0],
        dz = b[1] - a[1],
        len = Math.hypot(dx, dz);
      const lane = K.group();
      box(lane, width, 0.034, len + 0.065, color, 0, 0.039, 0);
      if (mark) {
        const count = Math.max(1, Math.round(len / 0.39));
        for (let d = 0; d < count; d++)
          box(lane, 0.036, 0.01, Math.min(0.15, len * 0.35), mark, 0, 0.062, ((d + 0.5) / count - 0.5) * len);
      }
      const localX = (a[0] + b[0]) / 2,
        localZ = (a[1] + b[1]) / 2;
      prop(s, lane, localX, localZ, 0, Math.atan2(dx, dz));
      points.push(lane);
    }
    return points;
  }
  S.signal = function (s) {
    const marine = '#3d7c85',
      navy = '#325260',
      mint = '#a7cfbf',
      ice = '#d4e5d7';
    const cream = '#fbefcf',
      yellow = '#ecb86a',
      coral = '#c37c68',
      windowBlue = '#7aa8a9';
    const sky = K.group();
    strut(sky, [0, 0, 0], [0, 2.02, 0], 0.016, '#b6b39d');
    disk(sky, 0.435, 0.058, '#f4c27d', 0, 1.99, 0, 18);
    const cloud = poly(
      sky,
      [
        [-0.51, 0],
        [-0.44, 0.105],
        [-0.33, 0.112],
        [-0.245, 0.196],
        [-0.103, 0.207],
        [-0.002, 0.14],
        [0.087, 0.144],
        [0.189, 0.077],
        [0.329, 0.082],
        [0.42, 0],
      ],
      ice,
      0.21,
      1.82,
      0.061,
      0.035,
    );
    prop(s, sky, 0.59, -2.25);
    skyline(s, -2.0, -2.18, 3.9, '#accac1', '#e8d8ac');
    skyline(s, 2.57, -2.23, 3.3, '#aac6c0', ice);

    // A closed metal shutter and an actual folded notice share one street facade.
    const mall = K.group();
    ledge(mall, 2.22, 0.83, 0, 0.104, 0, navy);
    box(mall, 2.08, 1.47, 0.6, marine, 0, 0.89, 0);
    for (const x of [-0.91, 0.91]) {
      box(mall, 0.246, 1.49, 0.46, ice, x, 0.928, 0.2);
      box(mall, 0.313, 0.092, 0.5, navy, x, 0.255, 0.213);
      box(mall, 0.316, 0.087, 0.5, cream, x, 1.623, 0.213);
    }
    box(mall, 2.22, 0.09, 0.9, navy, 0, 1.67, 0.025);
    const cornice = poly(
      mall,
      [
        [-1.09, 0],
        [1.09, 0],
        [1.09, 0.24],
        [0.75, 0.24],
        [0.68, 0.345],
        [-0.68, 0.345],
        [-0.75, 0.24],
        [-1.09, 0.24],
      ],
      mint,
      0,
      1.708,
      0.0,
      0.65,
    );
    for (const x of [-0.85, 0.85]) disk(cornice, 0.074, 0.026, cream, x, 0.134, 0.342, 7);
    type(mall, '百 貨 通 廊', 1.21, 0.235, 0, 1.88, 0.347, navy, 'transparent');
    const gate = groupAt(mall, 0, 0.236, 0.357);
    box(gate, 1.6, 1.292, 0.076, '#7d9796', 0, 0.649, 0);
    for (let i = 0; i < 10; i++) {
      const lamella = box(gate, 1.6, 0.081, 0.08, i % 2 ? '#aabdac' : '#b6c6b8', 0, 0.077 + i * 0.127, 0.051);
      lamella.rotation.x = 0.21;
    }
    box(gate, 0.395, 0.131, 0.082, navy, 0.014, 0.286, 0.125);
    strut(gate, [-0.098, 0.292, 0.186], [0.108, 0.292, 0.186], 0.026, cream);
    const closed = groupAt(gate, 0, 0.809, 0.119);
    box(closed, 0.54, 0.2, 0.036, cream, 0, 0, 0);
    type(closed, '推 門', 0.44, 0.14, 0, 0.002, 0.027, navy, 'transparent');
    prop(s, mall, -2.49, -0.81, 0, 0.035);
    s.hot(gate, 'gate', '推百貨的鐵捲門', [0, 0.752, 0.15], 'tap');

    const bulletin = K.group();
    box(bulletin, 0.64, 0.089, 0.48, navy, 0, 0.048, 0);
    box(bulletin, 0.081, 1.045, 0.075, navy, 0, 0.589, 0);
    box(bulletin, 0.737, 0.719, 0.073, marine, 0, 0.79, 0.0);
    box(bulletin, 0.66, 0.635, 0.044, ice, 0, 0.79, 0.058);
    const notice = groupAt(bulletin, 0, 1.053, 0.09);
    box(notice, 0.598, 0.504, 0.028, cream, 0, -0.247, 0);
    type(notice, '入口公告\n07:00 開門', 0.55, 0.336, 0, -0.262, 0.024, navy, 'transparent');
    strut(bulletin, [-0.297, 1.066, 0.102], [0.297, 1.066, 0.102], 0.018, C.brass);
    const clip = groupAt(bulletin, -0.292, 0.672, 0.12);
    box(clip, 0.207, 0.236, 0.075, coral, 0, 0, 0);
    type(clip, '抽', 0.16, 0.155, 0, 0.006, 0.049, cream, 'transparent');
    prop(s, bulletin, -3.79, 0.06, 0, 0.065);
    s.hot(bulletin, 'find:0', '查看入口的開門公告', [0.09, 0.824, 0.136]);
    s.hot(clip, 'notice', '抽走或放回兩個入口公告', [0, 0.008, 0.05], 'lift');

    const station = K.group();
    ledge(station, 2.36, 1.1, 0, 0.095, 0, marine);
    box(station, 2.1, 1.035, 0.67, ice, 0, 0.693, 0);
    for (const x of [-0.91, 0.91]) box(station, 0.113, 1.01, 0.756, mint, x, 0.686, 0);
    roof(station, 2.42, 0.95, 0.455, 0, 1.255, 0, marine);
    const clock = groupAt(station, 0.68, 1.67, 0.17);
    box(clock, 0.136, 0.588, 0.126, navy, 0, 0.125, -0.09);
    disk(clock, 0.324, 0.088, navy, 0, 0.399, 0, 16);
    disk(clock, 0.272, 0.041, cream, 0, 0.399, 0.065, 20);
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      const mark = box(
        clock,
        0.018,
        i % 3 ? 0.032 : 0.058,
        0.016,
        marine,
        0.22 * Math.sin(a),
        0.399 + 0.22 * Math.cos(a),
        0.095,
      );
      mark.rotation.z = -a;
    }
    strut(clock, [0, 0.399, 0.11], [-0.183, 0.399, 0.11], 0.013, navy);
    strut(clock, [0, 0.399, 0.11], [-0.044, 0.284, 0.11], 0.016, navy);
    disk(clock, 0.023, 0.019, coral, 0, 0.399, 0.119, 8);
    const desk = groupAt(station, -0.37, 0.699, 0.383);
    box(desk, 0.87, 0.56, 0.092, navy, 0, 0, 0);
    box(desk, 0.751, 0.46, 0.038, windowBlue, 0, 0, 0.078);
    box(desk, 0.054, 0.464, 0.045, cream, -0.16, 0, 0.112);
    disk(desk, 0.09, 0.048, '#d6a581', 0.079, 0.048, 0.132, 9);
    poly(
      desk,
      [
        [-0.144, -0.115],
        [-0.112, -0.019],
        [0.002, 0.021],
        [0.08, 0.012],
        [0.139, -0.115],
      ],
      marine,
      0.078,
      -0.059,
      0.131,
      0.047,
    );
    box(desk, 0.9, 0.058, 0.214, cream, 0, -0.297, 0.048);
    const service = groupAt(station, -0.37, 1.098, 0.42);
    box(service, 0.88, 0.229, 0.063, marine, 0, 0, 0);
    type(service, '問 站 務', 0.703, 0.174, 0, 0.004, 0.041, cream, 'transparent');
    const routeStamp = groupAt(desk, 0.171, -0.037, 0.149);
    box(routeStamp, 0.316, 0.154, 0.038, '#eac575', 0, 0, 0);
    type(routeStamp, '已核對', 0.281, 0.104, 0, 0.001, 0.028, navy, 'transparent');
    routeStamp.visible = false;
    box(station, 0.563, 0.832, 0.071, navy, 0.57, 0.599, 0.366);
    box(station, 0.457, 0.583, 0.044, mint, 0.57, 0.71, 0.414);
    box(station, 0.062, 0.42, 0.035, cream, 0.676, 0.73, 0.453);
    const timeBoard = groupAt(station, 0.24, 1.461, 0.478);
    box(timeBoard, 1.41, 0.271, 0.071, navy, 0, 0, 0);
    type(timeBoard, '07:00 發車', 1.25, 0.21, 0, 0, 0.047, cream, 'transparent');
    prop(s, station, 1.73, -1.13, 0, -0.025);
    s.hot(desk, 'ask', '問站務今天怎麼走', [0.1, 0.04, 0.141], 'tap');

    track(s, 3.32, -1.51, 1.85);
    const train = railcar();
    box(train, 1.526, 0.135, 0.032, marine, -0.003, 0.475, 0.269);
    prop(s, train, 3.37, -1.5, 0.03);
    const ramp = K.group();
    const run = box(ramp, 0.445, 0.102, 1.07, '#9ab7a7', 0, 0.126, 0);
    run.rotation.x = 0.168;
    for (const x of [-0.235, 0.235]) {
      strut(ramp, [x, 0.14, 0.48], [x, 0.53, -0.43], 0.018, marine);
      strut(ramp, [x, 0.03, 0.45], [x, 0.16, 0.45], 0.017, marine);
      strut(ramp, [x, 0.194, -0.41], [x, 0.528, -0.41], 0.017, marine);
    }
    const eastSign = groupAt(ramp, 0.32, 0.504, -0.24);
    box(eastSign, 0.42, 0.184, 0.05, marine, 0, 0, 0);
    type(eastSign, '東口', 0.32, 0.126, 0, 0, 0.031, cream, 'transparent');
    prop(s, ramp, 3.21, -0.36, 0, -0.1);
    const rampGlow = box(ramp, 0.151, 0.026, 0.499, yellow, 0, 0.185, -0.006);
    rampGlow.rotation.x = 0.168;

    const start = [-1.49, 0.77],
      fork = [-1.02, 1.4],
      middle = [0, 1.54],
      corner = [1.17, 1.48];
    const steps = [
        [2.41, 0.99],
        [2.61, 0.43],
        [2.32, -0.4],
      ],
      east = [
        [2.41, 1.21],
        [3.23, 0.79],
        [3.22, -0.43],
      ];
    const mainPath = [start, fork, middle, corner, ...steps];
    const eastPath = [start, fork, middle, corner, ...east];
    const gatePath = [start, [-2.06, 0.5], [-2.49, -0.044]];
    tripRoad(s, mainPath, 0.3, '#91aca1', cream);
    tripRoad(s, [corner, ...east], 0.214, '#b8c6ae', null);
    tripRoad(s, gatePath, 0.247, '#bea990', cream);
    const backs = K.group();
    for (let i = 0; i < 3; i++)
      box(backs, 0.45, 0.069 + i * 0.049, 0.146, ice, 0, 0.054 + i * 0.025, 0.19 - i * 0.12);
    prop(s, backs, 2.32, -0.14);

    const street = K.group();
    box(street, 0.602, 0.069, 0.38, marine, 0, 0.044, 0);
    strut(street, [0, 0.074, 0], [0, 0.855, 0], 0.041, navy);
    const pointer = poly(
      street,
      [
        [-0.54, -0.133],
        [0.274, -0.133],
        [0.526, 0.009],
        [0.274, 0.159],
        [-0.54, 0.159],
      ],
      marine,
      0,
      0.716,
      0.018,
      0.095,
    );
    type(pointer, '大路 10 分', 0.762, 0.193, -0.061, 0.015, 0.059, cream, 'transparent');
    prop(s, street, 0.56, 0.686, 0, 0.046);
    s.hot(street, 'street', '走十分鐘的大路', [0, 0.726, 0.076], 'slide');
    const inn = K.group();
    for (const x of [-0.49, 0.49]) box(inn, 0.056, 0.492, 0.36, navy, x, 0.255, 0);
    box(inn, 1.2, 0.112, 0.491, '#d5b78a', 0, 0.536, 0);
    box(inn, 1.11, 0.259, 0.046, ice, 0, 0.438, 0.218);
    type(inn, '晨 禾 旅 店', 0.97, 0.176, 0, 0.433, 0.249, navy, 'transparent');
    const breakfast = breakfastBag(inn, -0.195, 0.605, 0, 0.951);
    const order = groupAt(inn, 0.3, 0.614, -0.006);
    const slip = box(order, 0.402, 0.245, 0.046, cream, 0, 0.112, 0);
    slip.rotation.z = -0.065;
    const orders = ['旅店', '晨禾'].map((line, i) =>
      type(order, line, 0.311, 0.148, 0, 0.12, 0.033, i ? marine : C.wood, 'transparent'),
    );
    prop(s, inn, -3.44, 1.42, 0, 0.08);
    s.hot(breakfast, 'find:1', '看清早出發旅客的早餐袋', [0, 0.276, 0.105], 'lift');
    s.hot(order, 'memo', '翻旅客的委託紙', [0, 0.117, 0.041], 'tap');
    const cartRack = K.group();
    ledge(cartRack, 0.81, 0.459, 0, 0.051, 0, marine);
    const parked = tripBuggy();
    at(cartRack, parked, 0, 0.113, 0);
    const cartCard = groupAt(cartRack, -0.286, 0.265, 0.161);
    box(cartCard, 0.242, 0.21, 0.036, mint, 0, 0, 0);
    type(cartCard, '推車', 0.204, 0.125, 0, 0, 0.026, navy, 'transparent');
    prop(s, cartRack, -1.38, 1.97, 0, -0.08);
    s.hot(cartRack, 'stroller', '替旅客帶上或收起推車', [-0.28, 0.266, 0.19]);
    prop(s, K.notebook('ai'), 1.44, 2.1, 0, -0.115);
    const anchors = [
      [-1.56, 0.76],
      [2.4, 0.4],
    ];
    // One carrier per leaf keeps the passenger attached to the correct moving paper when a page turns.
    const actors = anchors.map(([x, z]) => {
      const carrier = K.group(),
        mobile = groupAt(carrier),
        avatar = breakfastTraveller(),
        cart = tripBuggy();
      at(mobile, avatar.g, 0, 0, 0);
      at(mobile, cart, 0.405, 0, 0.043, -0.04);
      prop(s, carrier, x, z);
      return { mobile, avatar, cart };
    });
    let pos = start.slice(),
      pending = [],
      wanted = '',
      gatePulse = 0,
      intro = 1,
      hasCart = false,
      noticeUp = true;
    let verified = false,
      lastStatus = 'idle',
      streetTried = false,
      gateTried = false;
    const rule = window.DecisionGames.rules.signal;
    function plan(points, key, action) {
      if (wanted === key && action !== 'gate' && action !== 'street') return;
      const changeRoute = wanted.split('/')[0] !== key.split('/')[0];
      const arrived = [...points[points.length - 1]];
      if (changeRoute || action === 'gate' || action === 'street') {
        pos = start.slice();
        pending = points.slice(1);
      } else pending = [arrived];
      wanted = key;
    }
    return {
      update(state, action) {
        if (!state) return;
        const trip = rule.itinerary(state);
        hasCart = Boolean(state.stroller);
        noticeUp = state.noticeVisible !== false;
        verified = Boolean(state.verified);
        lastStatus = trip.status;
        streetTried = Boolean(state.streetTried);
        gateTried = Boolean(state.gateTried);
        const chosen = state.route,
          arrived = chosen === 'street' && trip.status === 'arrived';
        let points = [start];
        if (chosen === 'gate') points = gatePath;
        if (chosen === 'street')
          points = arrived
            ? hasCart
              ? eastPath
              : mainPath
            : hasCart && noticeUp
              ? [start, fork, middle, corner, [2.17, 1.15]]
              : [start, fork, [-0.7, 1.442]];
        plan(points, [chosen || 'idle', trip.status, hasCart, Boolean(state.accessChecked)].join('/'), action);
        parked.visible = !hasCart;
        rampGlow.visible = Boolean(state.accessChecked);
        routeStamp.visible = verified;
        orders.forEach((o, i) => {
          o.visible = i === Number(Boolean(state.named));
        });
        if (action === 'gate') gatePulse = 1;
        if (action === 'enter') intro = 1;
      },
      tick(t, dt) {
        const follow = dt ? 1 - Math.exp(-dt * 8) : 1;
        gatePulse = dt ? Math.max(0, gatePulse - dt * 1.28) : 0;
        intro = dt ? Math.max(0, intro - dt * 0.47) : 0;
        gate.position.x = Math.sin(gatePulse * 39) * gatePulse * 0.075;
        gate.position.y = 0.236 + Math.abs(Math.sin(gatePulse * 34)) * gatePulse * 0.052;
        notice.rotation.x += ((noticeUp ? 0 : -2.91) - notice.rotation.x) * follow;
        service.rotation.z = verified && dt ? 0.014 * Math.sin(t * 2.1) : 0;
        cloud.position.x = 0.21 + (dt ? 0.035 * Math.sin(t * 0.6) : 0);
        train.position.x = 3.37 - (dt ? intro * 0.39 : 0);
        const walking = pending.length > 0;
        let reach = dt ? Math.min(dt, 0.15) * 3.35 : Infinity;
        while (pending.length && reach > 0) {
          const next = pending[0],
            dx = next[0] - pos[0],
            dz = next[1] - pos[1],
            distance = Math.hypot(dx, dz);
          if (distance <= reach) {
            pos = next.slice();
            pending.shift();
            reach -= distance;
          } else {
            pos = [pos[0] + (dx * reach) / distance, pos[1] + (dz * reach) / distance];
            reach = 0;
          }
        }
        const headingGate = lastStatus === 'blocked' && gateTried;
        actors.forEach(({ mobile, avatar, cart }, i) => {
          mobile.visible = i === Number(pos[0] >= 0);
          if (!mobile.visible) return;
          const bob = dt && walking ? Math.abs(Math.sin(t * 11)) * 0.037 : 0;
          mobile.position.set(pos[0] - anchors[i][0], 0.1 + bob, pos[1] - anchors[i][1]);
          mobile.rotation.y = headingGate ? -0.38 : streetTried ? 0.22 : 0.05;
          avatar.g.rotation.z = headingGate ? -gatePulse * 0.1 : 0;
          avatar.legs.forEach((leg, n) => {
            leg.rotation.z = dt && walking ? Math.sin(t * 11 + n * Math.PI) * 0.24 : 0;
          });
          cart.visible = hasCart;
        });
      },
    };
  };

  function skeletonKey(color) {
    const key = K.group();
    const outer = 0.21,
      inner = 0.121,
      points = 7;
    for (let i = 0; i < points; i++) {
      const a = (i * Math.PI * 2) / points,
        b = ((i + 1) * Math.PI * 2) / points;
      const p = (angle, r) => [Math.cos(angle) * r, Math.sin(angle) * r + 0.24];
      poly(key, [p(a, outer), p(b, outer), p(b, inner), p(a, inner)], color, 0, 0, 0, 0.072, C.wheat);
    }
    box(key, 0.088, 0.61, 0.082, color, 0, -0.24, 0.04);
    box(key, 0.22, 0.085, 0.087, color, 0.08, -0.49, 0.04);
    box(key, 0.066, 0.14, 0.085, color, 0.158, -0.455, 0.04);
    box(key, 0.06, 0.1, 0.086, color, 0.057, -0.442, 0.04);
    return key;
  }
  function keyStand(color, word) {
    const stand = K.group();
    cylinder(stand, 0.36, 0.41, 0.13, 8, C.shadow, 0, 0.075, 0);
    cylinder(stand, 0.3, 0.36, 0.13, 8, C.wheat, 0, 0.193, 0);
    box(stand, 0.085, 1.07, 0.083, C.wood, -0.21, 0.75, -0.09);
    strut(stand, [-0.25, 1.29, -0.09], [0.12, 1.29, -0.09], 0.035, C.wood);
    strut(stand, [0, 1.28, -0.09], [0, 1.19, 0.02], 0.018, C.brass);
    const key = skeletonKey(color);
    at(stand, key, 0, 0.77, 0.055);
    type(stand, word, 0.62, 0.2, 0, 0.24, 0.32, C.cream, C.deep);
    return { stand, key };
  }
  S.permission = function (s) {
    skyline(s, -2.73, -2.26, 2.83, C.deep, C.brass);
    plant(s, 4.01, -1.78, 1.22, 'cypress', 11);
    const crescent = moon(s, -1.7, -1.82, 2.12);
    const shop = K.group();
    box(shop, 2.25, 1.49, 1.0, C.brick, 0, 0.91, 0);
    ledge(shop, 2.57, 1.18, 0, 0.14, 0, C.slate);
    ledge(shop, 2.4, 1.13, 0, 1.66, 0, C.wood);
    roof(shop, 2.63, 1.21, 1.17, 0, 1.73, 0, C.deep);
    // A projecting gable carries the open-book emblem.
    poly(
      shop,
      [
        [-0.58, 0],
        [-0.58, 0.67],
        [0, 1.21],
        [0.58, 0.67],
        [0.58, 0],
      ],
      C.leaf,
      0,
      1.55,
      0.61,
      0.27,
    );
    strut(shop, [-0.64, 2.19, 0.77], [0, 2.8, 0.77], 0.045, C.wheat);
    strut(shop, [0, 2.8, 0.77], [0.64, 2.19, 0.77], 0.045, C.wheat);
    poly(
      shop,
      [
        [-0.34, 0.14],
        [-0.18, 0.17],
        [0, 0.1],
        [0, -0.12],
        [-0.18, -0.06],
        [-0.34, -0.09],
      ],
      C.cream,
      0,
      2.22,
      0.754,
      0.042,
    );
    poly(
      shop,
      [
        [0, 0.1],
        [0.18, 0.17],
        [0.34, 0.14],
        [0.34, -0.09],
        [0.18, -0.06],
        [0, -0.12],
      ],
      C.wheat,
      0,
      2.22,
      0.754,
      0.042,
    );
    type(shop, '夜 讀 書 店', 1.51, 0.24, 0, 1.61, 0.79, C.wheat, C.deep);
    box(shop, 0.42, 1.01, 0.06, C.green, -0.58, 0.71, 0.53);
    windowPane(shop, -0.58, 0.86, 0.57, 0.23, 0.38);
    disk(shop, 0.028, 0.03, C.amber, -0.46, 0.53, 0.63, 7);
    box(shop, 1.03, 0.72, 0.1, C.shadow, 0.35, 0.88, 0.55);
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 7; i++) {
        const h = 0.18 + ((i * 13 + j * 3) % 5) * 0.027;
        const spine = box(
          shop,
          0.095,
          h,
          0.09,
          [C.wheat, C.brick, C.green, C.brass, C.blue][(i + j) % 5],
          -0.02 + i * 0.129,
          0.62 + j * 0.32 + h / 2,
          0.615,
        );
        if (i === 5) spine.rotation.z = -0.13;
      }
      box(shop, 1.01, 0.04, 0.14, C.wheat, 0.35, 0.6 + j * 0.32, 0.59);
    }
    const canopy = box(shop, 2.36, 0.09, 0.51, C.green, 0, 1.39, 0.59);
    canopy.rotation.x = 0.18;
    for (let i = 0; i < 8; i++)
      poly(
        shop,
        [
          [-0.145, 0],
          [0.145, 0],
          [0.12, -0.09],
          [0, -0.15],
          [-0.12, -0.09],
        ],
        i % 2 ? C.green : C.leaf,
        (i - 3.5) * 0.29,
        1.35,
        0.86,
        0.025,
      );
    const light = groupAt(shop, -0.96, 1.07, 0.66);
    cylinder(light, 0.1, 0.075, 0.17, 4, C.amber, 0, 0, 0);
    cylinder(light, 0.02, 0.125, 0.09, 4, C.deep, 0, 0.13, 0);
    prop(s, shop, 1.74, -0.83, 0, -0.045);
    s.hot(shop, 'desk', '打開書店的授權簿', [0.31, 1.15, 0.75]);
    const stands = [keyStand(C.brass, '推薦卡'), keyStand(C.green, '書單'), keyStand(C.brick, '訂單')];
    const sites = [
      [-3.66, 0.88],
      [-2.14, -0.7],
      [3.5, 1.34],
    ];
    const seals = [];
    stands.forEach(({ stand }, i) => {
      const [x, z] = sites[i];
      prop(s, stand, x, z, 0, i === 2 ? -0.18 : 0.035);
      const seal = disk(stand, 0.115, 0.03, C.amber, 0.26, 0.39, 0.25, 8);
      seal.visible = false;
      seals.push(seal);
      s.hot(stands[i].key, 'job' + i, '拿起' + ['推薦卡', '書單', '訂單'][i] + '鑰匙', [0, 0.35, 0.11], 'lift');
    });
    lantern(s, -4.04, -0.75);
    const cart = K.group();
    for (const x of [-0.26, 0.26]) disk(cart, 0.105, 0.07, C.shadow, x, 0.135, 0.13, 10);
    box(cart, 0.81, 0.065, 0.36, C.wood, 0, 0.28, 0);
    for (let i = 0; i < 6; i++)
      box(
        cart,
        0.087,
        0.29 + (i % 3) * 0.06,
        0.23,
        [C.green, C.wheat, C.brick][i % 3],
        -0.27 + i * 0.103,
        0.45 + (i % 3) * 0.03,
        0,
      );
    strut(cart, [0.36, 0.29, -0.12], [0.42, 0.76, -0.12], 0.026, C.brass);
    prop(s, cart, 1.2, 0.97, 0, -0.17);
    const books = K.group();
    for (let i = 0; i < 3; i++) {
      const book = box(books, 0.48, 0.075, 0.3, [C.brick, C.wheat, C.green][i], 0, 0.04 + i * 0.082, 0);
      book.rotation.y = 0.19 * i;
    }
    prop(s, books, -2.7, 1.86, 0, 0.17);
    notebook(s, 'ai');
    s.hot(cart, 'find:0', '察看店外書車', [0, 0.56, 0.1], 'slide');
    s.hot(books, 'find:1', '拿起店外的三本書', [0, 0.15, 0.04], 'lift');
    const policy = router(['授權', '確認', '執行']);
    policy.unit.scale.setScalar(0.88);
    at(shop, policy.unit, 0, 1.76, 0.83);
    let selected = 0;
    const target = [0, 0, 0];
    return {
      tick(t, dt) {
        stands.forEach(({ key }, i) => {
          key.position.y += (0.77 + (i === selected ? 0.11 : 0) - key.position.y) * Math.min(1, dt * 6);
          key.rotation.z +=
            (target[i] +
              Math.sin(t * (i === selected ? 1.7 : 0.8) + i) * (i === selected ? 0.12 : 0.045) -
              key.rotation.z) *
            Math.min(1, dt * 5);
        });
        policy.tick(dt);
        crescent.rotation.z = 0.028 * Math.sin(t * 0.55);
      },
      update(state) {
        if (!state) return;
        selected = state.job;
        const level = state.levels[selected];
        policy.set(level === 1 ? 0 : level === 2 ? 1 : -1);
        stands.forEach((_, i) => {
          const level = state.levels[i];
          seals[i].visible = level >= 0;
          target[i] = level >= 0 ? [-0.15, 0.06, 0.26][level] : 0;
        });
      },
    };
  };
})();
