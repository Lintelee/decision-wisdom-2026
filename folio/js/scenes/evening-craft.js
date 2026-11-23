// Movable paper mechanisms for the temple, fruit stall, dye yard and lantern square.
import { keep, group, box, cyl, ball, disc, ring, beam, poly, tri, quad, tab } from '../paper.js';

const TAU = Math.PI * 2;
const clamp = (v) => Math.max(0, Math.min(1, v));

function at(parent, x, y, z) {
  const g = group(parent);
  g.position.set(x, y, z);
  return g;
}

function diamond(g, x, y, z, width, height, ink) {
  return poly(
    g,
    [
      [-width / 2, 0],
      [0, height / 2],
      [width / 2, 0],
      [0, -height / 2],
    ],
    0.008,
    ink,
    x,
    y,
    z,
  );
}

function pickToy(S, node, id, label, radius, y, tap) {
  S.pad(node, radius, [0, y, 0]);
  S.curio(node, { id, label, quiet: true, tap });
}

// Tween one continuous paper fold, including when a reader reverses it halfway.
function foldingToy(S, node, { id, label, radius, y, duration, sound }, draw) {
  const fold = { value: 0 };
  let open = false,
    painted = -1;
  function render() {
    if (painted === fold.value) return;
    painted = fold.value;
    draw(fold.value);
  }
  function reset() {
    open = false;
    fold.value = 0;
    painted = -1;
    render();
  }
  pickToy(S, node, id, label, radius, y, () => {
    open = !open;
    S.sound(sound);
    S.to(fold, { value: open ? 1 : 0 }, S.stage.still.matches ? 0.22 : duration, 'inOut');
  });
  S.on('reset', reset);
  S.tick(render);
  reset();
}

// The two faces of a leaf meet along a raised crease, like a real valley fold.
function leaf(g, x, y, z, length, width, angle, colors) {
  const b = at(g, x, y, z);
  b.rotation.z = angle;
  const base = [0, 0, 0],
    tip = [0, length, 0],
    mid = [0, length * 0.43, width * 0.3];
  const l = [-width, length * 0.45, -0.01],
    r = [width, length * 0.37, -0.01];
  tri(b, base, l, mid, colors[0]);
  tri(b, l, tip, mid, colors[0]);
  tri(b, base, mid, r, colors[1]);
  tri(b, mid, tip, r, colors[1]);
}

function templeGong(S) {
  S.plant(
    -4.43,
    -1.44,
    (g) => {
      const rack = keep(g),
        bowl = keep(rack, 0, 0.88, 0.055),
        mallet = keep(rack, 0.48, 1.36, 0.24);
      const timber = '#37605b',
        rim = '#e2b761';
      tab(rack, 1.26, '#c59c75');
      for (const side of [-1, 1]) {
        box(rack, side * 0.56, 0.76, 0, 0.085, 1.42, 0.1, timber);
        box(rack, side * 0.56, 0.065, 0, 0.18, 0.13, 0.37, '#805341');
        for (const y of [0.23, 1.32]) box(rack, side * 0.56, y, 0, 0.115, 0.047, 0.115, rim);
        beam(rack, [side * 0.56, 1.24, 0], [side * 0.33, 1.46, 0], 0.034, '#b64e3e', 5);
        beam(rack, [side * 0.22, 1.46, 0.045], [side * 0.165, 1.205, 0.05], 0.013, '#7e3a35', 4);
      }
      poly(
        rack,
        [
          [-0.75, 0.1],
          [-0.59, 0],
          [0.6, 0],
          [0.75, 0.1],
          [0.74, 0.035],
          [0.62, -0.06],
          [-0.63, -0.06],
          [-0.74, 0.035],
        ],
        0.11,
        '#a8493a',
        0,
        1.45,
        -0.055,
      );
      box(rack, 0, 1.47, 0.045, 1.15, 0.027, 0.044, rim);
      // Alternating pressed rings give the disc the shallow profile of hammered bronze.
      for (const [r, z, ink] of [
        [0.386, 0, '#67503c'],
        [0.363, 0.025, '#bc8847'],
        [0.323, 0.049, '#e3b65f'],
        [0.25, 0.066, '#bb8848'],
        [0.199, 0.08, '#dcaa57'],
        [0.1, 0.1, '#8e683d'],
      ]) {
        disc(bowl, 0, 0, z, r, ink, 0.022, 28);
      }
      const boss = ball(bowl, 0, 0, 0.116, 0.09, '#eac47b', 1);
      boss.scale.z = 0.56;
      for (let i = 0; i < 16; i++) {
        const a = (i * TAU) / 16;
        diamond(bowl, 0.286 * Math.cos(a), 0.286 * Math.sin(a), 0.068, 0.026, 0.045, '#96663a').rotation.z = a + Math.PI / 2;
      }
      beam(mallet, [0, 0, 0], [-0.14, -0.5, 0], 0.019, '#6d4140', 6);
      const tip = ball(mallet, -0.15, -0.51, 0, 0.071, '#a63e3f', 1);
      tip.scale.y = 1.23;
      const waves = Array.from({ length: 2 }, (_, i) => {
        const wave = keep(rack, 0, 0.88, 0.17 + i * 0.015);
        ring(wave, 0, 0, 0, 0.38, 0.01, i ? '#e4ac56' : '#a9653d', 28);
        wave.visible = false;
        return wave;
      });
      let time = 2, heard = false;
      pickToy(S, rack, 'temple-gong', '獅陣的節拍鑼', 0.41, 0.81, () => {
        time = 0; heard = false;
      });
      S.tick((_, dt) => {
        if (time >= 1.32) return;
        time += dt;
        const t = Math.min(1, time / 1.32),
          quiet = S.stage.still.matches;
        const strike = Math.sin(Math.min(1, t * 2.7) * Math.PI);
        if (!heard && t >= .16) { S.sound('temple-gong', rack); heard = true; }
        mallet.rotation.z = -0.71 * strike;
        bowl.rotation.x = quiet ? 0 : -0.24 * Math.sin(t * 18) * Math.sin(t * Math.PI) * (1 - t);
        waves.forEach((w, i) => {
          const u = (t - 0.12 - i * 0.22) / 0.57;
          w.visible = u > 0 && u < 1 && (!quiet || i === 0);
          if (w.visible) w.scale.setScalar(1.06 + clamp(u) * (quiet ? 0.22 : 0.56));
        });
      });
      S.on('reset', () => {
        time = 2;
      });
    },
    { ry: 0.12, s: 1.04 },
  );
}

function shadowPlayers(S) {
  S.plant(
    4.62,
    1.9,
    (g) => {
      const stage = keep(g),
        ink = '#3a5958',
        gold = '#dfb46d',
        coral = '#a74c40';
      tab(stage, 1.48, '#cfb28a');
      box(stage, 0, 0.13, -0.02, 1.45, 0.26, 0.61, '#846046');
      box(stage, 0, 0.29, 0, 1.55, 0.065, 0.66, gold);
      box(stage, 0, 0.65, -0.18, 1.36, 0.73, 0.06, '#d8c69d');
      for (const side of [-1, 1]) {
        box(stage, side * 0.68, 0.67, 0.12, 0.075, 0.77, 0.09, coral);
        for (let i = 0; i < 3; i++) {
          const x = side * (0.62 - i * 0.09);
          poly(
            stage,
            [
              [-0.071, 0],
              [0.071, 0],
              [0.057, -0.25 + i * 0.038],
              [0, -0.3 + i * 0.045],
              [-0.058, -0.23 + i * 0.037],
            ],
            0.035,
            i % 2 ? '#466864' : '#3a5958',
            x,
            0.98,
            0.16,
          );
        }
      }
      poly(
        stage,
        [
          [-0.8, 0],
          [-0.58, 0.1],
          [-0.38, 0.16],
          [0, 0.11],
          [0.38, 0.16],
          [0.58, 0.1],
          [0.8, 0],
          [0.77, -0.07],
          [-0.77, -0.07],
        ],
        0.19,
        ink,
        0,
        1.01,
        -0.05,
      );
      for (let i = 0; i < 5; i++) diamond(stage, (i - 2) * 0.21, 1.035, 0.149, 0.1, 0.046, gold);
      const axle = keep(stage, 0.71, 0.17, 0.2);
      disc(axle, 0, 0, 0, 0.13, '#785642', 0.04, 16);
      disc(axle, 0, 0, 0.025, 0.095, gold, 0.036, 16);
      beam(axle, [0, 0, 0.06], [0.14, 0.04, 0.07], 0.021, coral);
      disc(axle, 0.14, 0.04, 0.09, 0.031, '#dfb46d', 0.05, 8);
      const dolls = [-1, 1].map((side, index) => {
        const puppet = keep(stage, side * 0.25, 0.44, 0.012);
        const cloth = index ? coral : ink;
        poly(
          puppet,
          [
            [-0.09, 0],
            [-0.053, 0.2],
            [0.06, 0.21],
            [0.108, 0],
          ],
          0.024,
          cloth,
          0,
          0.02,
        );
        disc(puppet, 0, 0.28, 0.017, 0.075, '#765449', 0.029, 14);
        poly(
          puppet,
          [
            [-0.082, 0],
            [0.08, 0],
            [0.065, 0.068],
            [0.018, 0.082],
            [-0.06, 0.068],
          ],
          0.025,
          ink,
          0,
          0.278,
          0.02,
        );
        disc(puppet, side * 0.058, 0.349, 0.02, 0.034, ink, 0.023, 8);
        const hand = keep(puppet, -side * 0.041, 0.195, 0.04);
        beam(hand, [0, 0, 0], [-side * 0.116, -0.042, 0], 0.019, cloth);
        beam(hand, [-side * 0.116, -0.042, 0], [-side * 0.19, 0.035, 0.002], 0.014, '#805c46');
        const legs = [-1, 1].map((leg) => {
          const k = keep(puppet, leg * 0.043, 0.035, 0.02);
          beam(k, [0, 0, 0], [leg * 0.023, -0.115, 0], 0.022, ink);
          box(k, leg * 0.022 - side * 0.013, -0.113, 0, 0.075, 0.022, 0.04, '#493e37');
          return k;
        });
        return { puppet, hand, legs, side };
      });
      foldingToy(
        S,
        stage,
        { id: 'shadow-stage', label: '雙人步法的紙戲臺', radius: 0.42, y: 0.65, duration: 1.68, sound: 'wood-knock' },
        (u) => {
          axle.rotation.z = -u * TAU;
          dolls.forEach(({ puppet, hand, legs, side }, i) => {
            puppet.position.x = side * (0.27 - 0.084 * u);
            const gait = Math.sin(u * Math.PI * 4);
            puppet.position.y = 0.44 + 0.034 * Math.abs(gait);
            hand.rotation.z = -side * 0.66 * u;
            legs.forEach((leg, j) => {
              leg.rotation.z = (i + j) % 2 ? 0.52 * gait : -0.52 * gait;
            });
          });
        },
      );
    },
    { ry: -0.13, s: 1.03 },
  );
}

/** The lion lands on the existing plank. The flared trestles show its height from across the book. */
export function rehearsalBenchRails(g,height) {
  const timber='#a4774d', endGrain='#785d47', edge='#d9ba81';
  for(const side of [-1,1]){
    const face=(points,z,colour,depth)=>poly(g,points.map(([x,y])=>[x*side,y]),depth,colour,0,0,z);
    const leg=[[.60,height-.09],[.735,height-.09],[.75,.52],[.825,.044],[.80,.012],[.66,.012],[.59,.59]];
    face(leg,-.19,endGrain,.077);
    face(leg,.135,timber,.095);
    face([[.605,height-.12],[.636,height-.12],[.666,.53],[.717,.054],[.690,.055],[.61,.55]],.233,edge,.006);
    face([[.655,.075],[.815,.075],[.814,.047],[.65,.05]],.239,endGrain,.007);
  }
  poly(g,[[-.785,height-.107],[-.762,height-.041],[.742,height-.041],[.785,height-.076],[.755,height-.144],[.62,height-.173],[-.615,height-.173]],.065,timber,0,0,.164);
  poly(g,[[-.755,height-.057],[.736,height-.057],[.768,height-.075],[.715,height-.084],[-.757,height-.082]],.01,edge,0,0,.233);
  for(const x of [-.66,.66]) disc(g,x,height-.112,.240,.026,endGrain,.009,7);
}

export function templeCraft(S) {
  templeGong(S);
  shadowPlayers(S);
  if (window.PaperKit) return;
  S.plant(2.35, -2.55, (g) => {
    // Torn ceramic and painted bracket ends form a second colour register under the orange tiles.
    for (const side of [-1, 1]) {
      const ridge = at(g, side * 1.24, 1.94, 0.105);
      for (let i = 0; i < 6; i++) {
        const t = i / 5;
        const tile = poly(
          ridge,
          [
            [-0.06, 0],
            [0, 0.075],
            [0.066, 0.02],
            [0, -0.025],
          ],
          0.018,
          ['#46847a', '#f5cf7d', '#8aab83'][i % 3],
          side * t * 0.6,
          t * t * 0.32,
          0.012,
        );
        tile.rotation.z = side * (0.06 + t * 0.3);
      }
      for (const x of [0.72, 1.19, 1.48]) {
        const bx = x * side;
        box(g, bx, 1.17, 0.419, 0.24, 0.052, 0.09, '#548375');
        box(g, bx, 1.095, 0.41, 0.16, 0.052, 0.105, '#a95741');
        box(g, bx, 1.045, 0.4, 0.095, 0.047, 0.11, '#d6a761');
      }
    }
    box(g, 0, 1.117, 0.406, 0.72, 0.124, 0.045, '#355c56');
    for (const x of [-0.235, 0, 0.235]) diamond(g, x, 1.117, 0.441, 0.093, 0.056, '#dfb466');
    for (let i = 0; i < 19; i++) {
      const x = -1.73 + i * 0.192;
      disc(g, x, 1.25, 0.464, 0.057, i % 2 ? '#598078' : '#64928a', 0.021, 12);
      disc(g, x, 1.25, 0.485, 0.021, '#e8bd76', 0.01, 8);
    }
  });
}

function marketIcebox(S) {
  S.plant(
    -4.74,
    0.18,
    (g) => {
      const chest = keep(g),
        hinges = '#537d78',
        enamel = '#84b7a2',
        lining = '#d4ddcd';
      tab(chest, 1.08);
      for (const sx of [-1, 1])
        for (const sz of [-1, 1]) {
          box(chest, sx * 0.42, 0.09, sz * 0.26, 0.075, 0.18, 0.075, hinges);
        }
      box(chest, 0, 0.25, 0, 1, 0.2, 0.66, enamel);
      box(chest, 0, 0.42, 0.3, 1, 0.35, 0.065, enamel);
      box(chest, 0, 0.42, -0.3, 1, 0.35, 0.065, enamel);
      for (const sx of [-1, 1]) {
        box(chest, sx * 0.47, 0.42, 0, 0.06, 0.35, 0.62, enamel);
        box(chest, sx * 0.475, 0.38, 0.338, 0.055, 0.43, 0.035, hinges);
        box(chest, sx * 0.505, 0.48, 0.01, 0.04, 0.043, 0.22, hinges);
      }
      box(chest, 0, 0.405, 0.344, 0.88, 0.043, 0.022, '#eadbb7');
      const badge = at(chest, 0, 0.405, 0.375);
      disc(badge, 0, 0, 0, 0.14, hinges, 0.016, 16);
      disc(badge, 0, 0, 0.012, 0.117, '#e1ddbb', 0.014, 16);
      for (let i = 0; i < 6; i++) {
        const arm = at(badge, 0, 0, 0.029);
        arm.rotation.z = (i * TAU) / 6;
        beam(arm, [0, 0, 0], [0, 0.084, 0], 0.009, hinges, 4);
        for (const s of [-1, 1]) beam(arm, [0, 0.044, 0], [s * 0.021, 0.062, 0], 0.006, hinges, 4);
      }
      const tray = keep(chest, 0, 0.24, 0);
      box(tray, 0, 0, 0, 0.9, 0.065, 0.53, lining);
      for (let i = 0; i < 3; i++) {
        const bottle = at(tray, (i - 1) * 0.244, 0.028, i === 1 ? -0.055 : 0.035);
        const color = ['#4f8b7f', '#cd8b57', '#5c9a9a'][i];
        cyl(bottle, 0, 0.13, 0, 0.077, 0.074, 0.26, color, 10);
        cyl(bottle, 0, 0.288, 0, 0.039, 0.077, 0.058, color, 10);
        cyl(bottle, 0, 0.341, 0, 0.039, 0.039, 0.052, color, 10);
        cyl(bottle, 0, 0.38, 0, 0.047, 0.047, 0.033, '#ced6bf', 10);
        cyl(bottle, 0, 0.146, 0, 0.08, 0.078, 0.109, '#ead7ac', 10);
        diamond(bottle, 0, 0.145, 0.081, 0.057, 0.071, color);
        box(bottle, -0.043, 0.24, 0.06, 0.014, 0.09, 0.012, '#bad6be');
      }
      for (const [x, z, s] of [
        [-0.36, 0.13, 0.055],
        [0.12, 0.18, 0.055],
        [0.32, -0.13, 0.061],
        [-0.15, -0.13, 0.067],
      ]) {
        const ice = box(tray, x, 0.045, z, s * 1.4, s, s, '#c2dfd5');
        ice.rotation.y = x * 2;
      }
      const lid = keep(chest, 0, 0.615, -0.315);
      box(lid, 0, 0, 0.315, 1.035, 0.077, 0.68, hinges);
      box(lid, 0, 0.036, 0.31, 0.98, 0.029, 0.61, lining);
      for (const z of [0.12, 0.5]) box(lid, 0, -0.046, z, 0.88, 0.045, 0.035, '#c0c8ad');
      box(lid, 0, 0.083, 0.31, 0.24, 0.048, 0.045, hinges);
      foldingToy(
        S,
        chest,
        { id: 'market-icebox', label: '水果攤的汽水冰櫃', radius: 0.39, y: 0.39, duration: 0.83, sound: 'ice-clink' },
        (u) => {
          lid.rotation.x = -1.78 * u;
          tray.position.y = 0.184 + 0.343 * clamp((u - 0.18) / 0.82);
        },
      );
    },
    { ry: 0.2, s: 1.05 },
  );
}

function gardenTrellis(S) {
  S.plant(
    4.69,
    -1.38,
    (g) => {
      const stand = keep(g),
        cane = '#af9463',
        stem = '#577b51';
      tab(stand, 1.15, '#d8b891');
      const bed = at(stand, 0, 0.055, 0.035);
      box(bed, 0, 0.14, 0, 1.44, 0.28, 0.5, '#ae7953');
      for (const x of [-0.55, -0.21, 0.21, 0.55]) box(bed, x, 0.14, 0.253, 0.037, 0.28, 0.025, '#dcae77');
      box(bed, 0, 0.293, -0.006, 1.34, 0.035, 0.4, '#69533e');
      for (const x of [-0.59, 0, 0.59]) beam(stand, [x, 0.24, -0.12], [x * 0.88, 1.46, -0.12], 0.026, cane, 6);
      for (const y of [0.58, 0.95, 1.34]) {
        beam(stand, [-0.72, y, -0.095], [0.72, y, -0.095], 0.019, cane, 5);
        for (const x of [-0.55, 0.55])
          beam(stand, [x - 0.026, y - 0.033, -0.064], [x + 0.026, y + 0.034, -0.064], 0.012, '#795f49', 4);
      }
      const path = [
        [-0.46, 0.3],
        [-0.54, 0.54],
        [-0.21, 0.82],
        [-0.34, 1.08],
        [-0.05, 1.21],
        [0.21, 1.4],
        [0.51, 1.3],
        [0.61, 1.09],
      ];
      path.slice(1).forEach(([x, y], i) => {
        beam(stand, [...path[i], -0.024], [x, y, -0.024], 0.021, stem, 5);
        if (i > 0) {
          const side = i % 2 ? -1 : 1;
          leaf(stand, x, y, 0.01, 0.24, 0.085, side * 0.88, ['#5b8a63', '#82a879']);
          if (i % 2) leaf(stand, x, y, 0.003, 0.17, 0.062, -side * 0.99, ['#47795b', '#74a374']);
        }
      });
      for (const [x, y] of [
        [-0.16, 0.81],
        [0.33, 1.37],
      ]) {
        beam(stand, [x, y, 0], [x + 0.07, y - 0.24, 0.045], 0.012, stem, 4);
        const fruit = ball(stand, x + 0.075, y - 0.31, 0.05, 0.115, '#6e9959', 1);
        fruit.scale.set(1, 0.91, 0.82);
        ring(stand, x + 0.075, y - 0.31, 0.05, 0.114, 0.007, '#426c4d', 14).rotation.y = 1.05;
      }
      const flowers = [
        [-0.35, 1.08],
        [0.57, 1.15],
      ].map(([x, y]) => {
        const petals = keep(stand, x, y, 0.05);
        for (let i = 0; i < 5; i++) {
          const p = at(petals, 0, 0, 0.006);
          p.rotation.z = (i * TAU) / 5;
          poly(
            p,
            [
              [-0.018, 0.01],
              [-0.077, 0.095],
              [-0.026, 0.13],
              [0.058, 0.118],
              [0.064, 0.07],
              [0.025, 0.012],
            ],
            0.011,
            '#e5b450',
          );
          tri(p, [0, 0.018, 0.013], [-0.021, 0.105, 0.028], [0.036, 0.096, 0.015], '#f2cc70');
        }
        disc(petals, 0, 0, 0.032, 0.035, '#a88043', 0.018, 12);
        return petals;
      });
      const butterfly = keep(stand);
      const wings = [-1, 1].map((s) => {
        const wing = keep(butterfly);
        poly(
          wing,
          [
            [0, 0],
            [s * 0.085, 0.144],
            [s * 0.195, 0.168],
            [s * 0.19, 0.06],
            [s * 0.091, 0.005],
            [s * 0.14, -0.066],
            [s * 0.059, -0.092],
            [0, -0.043],
          ],
          0.015,
          '#563e42',
        );
        poly(
          wing,
          [
            [s * 0.018, 0.013],
            [s * 0.096, 0.124],
            [s * 0.164, 0.138],
            [s * 0.154, 0.069],
            [s * 0.08, 0.033],
          ],
          0.01,
          '#e9a45b',
          0,
          0,
          0.017,
        );
        diamond(wing, s * 0.095, -0.04, 0.019, 0.064, 0.039, '#f3ca74');
        disc(wing, s * 0.15, 0.118, 0.033, 0.014, '#fbebc8', 0.008, 8);
        return wing;
      });
      beam(butterfly, [0, -0.054, 0.036], [0, 0.046, 0.036], 0.017, '#59413e', 5);
      foldingToy(
        S,
        stand,
        { id: 'melon-blossom', label: '瓜棚裡的蝴蝶', radius: 0.51, y: 0.98, duration: 1.65, sound: 'cloth' },
        (u) => {
          const h = Math.sin(u * Math.PI);
          butterfly.position.set(-0.35 + 0.92 * u, 1.165 + 0.07 * u + 0.42 * h, 0.14 + 0.16 * h);
          butterfly.rotation.z = 0.15 * Math.sin(u * TAU) - 0.12;
          const wingAngle = (S.stage.still.matches ? 0.15 : 0.54) * Math.sin(u * TAU * 4);
          wings.forEach((w, i) => {
            w.rotation.y = (i ? 1 : -1) * (0.29 + wingAngle);
          });
          flowers.forEach((flower, i) => {
            const scale = i ? 0.72 + 0.28 * u : 1 - 0.24 * u;
            flower.scale.setScalar(scale);
          });
        },
      );
    },
    { ry: -0.12, s: 1.09 },
  );
}

export function fruitCraft(S) {
  marketIcebox(S);
  gardenTrellis(S);
  if (window.PaperKit) return;
  S.plant(-2.2, -1.3, (g) => {
    // A double-faced, striped canvas valance stretches between the existing signposts.
    const count = 14;
    for (let i = 0; i < count; i++) {
      const x = -1.37 + i * 0.196,
        color = i % 2 ? '#ebd9b2' : '#698b75';
      quad(g, [x, 1.94, -0.42], [x + 0.196, 1.94, -0.42], [x + 0.196, 1.85, -0.18], [x, 1.85, -0.18], color);
      poly(
        g,
        [
          [0, 0],
          [0.196, 0],
          [0.183, -0.095],
          [0.104, -0.14],
          [0.02, -0.099],
        ],
        0.017,
        color,
        x,
        1.85,
        -0.18,
      );
    }
    for (const x of [-1.31, 1.31]) {
      beam(g, [x, 1.61, -0.38], [x, 1.84, -0.16], 0.022, '#9b7954', 5);
      for (const y of [0.4, 0.75, 1.11, 1.51]) box(g, x, y, -0.36, 0.119, 0.034, 0.04, '#e0c697');
    }
  });
}

const INDIGO = '#475e88',
  INK_BLUE = '#344566',
  CALICO = '#eee2c6';
function weavingLoom(S) {
  S.plant(
    4.24,
    -0.59,
    (g) => {
      const loom = keep(g),
        maple = '#ac825e',
        pale = '#d1ad7b';
      tab(loom, 1.65, '#cdb99c');
      for (const sx of [-1, 1]) {
        for (const [z, h] of [
          [-0.43, 1.36],
          [0.35, 0.66],
        ]) {
          beam(loom, [sx * 0.63, 0, z], [sx * 0.63, h, z - 0.042], 0.045, maple, 5);
          box(loom, sx * 0.63, 0.06, z, 0.19, 0.1, 0.2, '#88664f');
          box(loom, sx * 0.63, h - 0.085, z - 0.042, 0.11, 0.044, 0.11, pale);
        }
        beam(loom, [sx * 0.63, 0.48, 0.36], [sx * 0.63, 0.32, -0.43], 0.031, '#8c7059', 4);
        beam(loom, [sx * 0.63, 0.64, 0.34], [sx * 0.63, 1.04, -0.39], 0.031, pale, 5);
      }
      for (const [y, z, r, ink] of [
        [1.34, -0.47, 0.05, maple],
        [1.03, -0.39, 0.043, pale],
        [0.57, 0.34, 0.07, maple],
      ]) {
        const shaft = cyl(loom, 0, y, z, r, r, 1.52, ink, 10);
        shaft.rotation.z = Math.PI / 2;
      }
      // Two combs of independent warp sit on opposite sides of the flying shuttle.
      const heddles = [keep(loom), keep(loom)];
      for (let i = 0; i < 21; i++) {
        const x = -0.51 + i * 0.051,
          color = i % 5 === 0 ? '#99a5ac' : CALICO;
        beam(heddles[i % 2], [x, 1.03, -0.37], [x, 0.779, 0.03], 0.0085, color, 4);
        beam(heddles[i % 2], [x, 0.779, 0.03], [x, 0.61, 0.31], 0.0085, color, 4);
      }
      const reed = keep(loom, 0, 1.31, -0.35);
      for (const sx of [-1, 1]) beam(reed, [sx * 0.51, 0, 0], [sx * 0.51, -0.47, 0.22], 0.018, INDIGO, 5);
      beam(reed, [-0.55, -0.48, 0.22], [0.55, -0.48, 0.22], 0.028, pale, 6);
      const cloth = keep(loom, 0, 0.58, 0.39);
      box(cloth, 0, -0.18, 0, 1.05, 0.36, 0.024, '#a9b3b1');
      for (let row = 0; row < 3; row++) {
        box(cloth, 0, -0.035 - row * 0.103, 0.016, 1.04, 0.035, 0.012, row === 1 ? INDIGO : CALICO);
        for (const x of [-0.4, -0.2, 0, 0.2, 0.4]) diamond(cloth, x, -0.085 - row * 0.096, 0.018, 0.072, 0.03, INDIGO);
      }
      const shuttle = keep(loom, -0.41, 0.835, 0.03);
      poly(
        shuttle,
        [
          [-0.28, 0],
          [-0.17, 0.073],
          [0.15, 0.073],
          [0.29, 0.015],
          [0.16, -0.044],
          [-0.15, -0.044],
        ],
        0.112,
        '#946d4a',
        0,
        0,
        -0.062,
      );
      box(shuttle, 0, 0.071, -0.002, 0.21, 0.034, 0.085, INDIGO);
      for (let i = 0; i < 5; i++) box(shuttle, -0.084 + i * 0.042, 0.091, -0.002, 0.012, 0.01, 0.086, CALICO);
      let pass = 0;
      const motion = { u: 0 };
      function weave() {
        const t = motion.u,
          half = Math.floor(t),
          u = t - half;
        // The centreline of the shuttle crosses once per pass. The heddles change on alternate passes.
        shuttle.position.x = -0.44 * Math.cos(Math.PI * t);
        shuttle.position.y = 0.827 + 0.047 * Math.sin(u * Math.PI);
        const shift = 0.048 * Math.cos(Math.PI * t);
        heddles[0].position.y = shift;
        heddles[1].position.y = -shift;
        reed.rotation.x = -0.12 + 0.26 * Math.sin(u * Math.PI);
        cloth.scale.y = 0.52 + 0.45 * Math.min(1, t / 3);
      }
      pickToy(S, loom, 'weave-shuttle', '腳踏織機的梭子', 0.49, 0.86, () => {
        S.sound('wood-knock', loom);
        pass++;
        S.to(motion, { u: pass }, S.stage.still.matches ? 0.25 : 0.9, 'inOut');
      });
      S.on('reset', () => {
        pass = 0;
        motion.u = 0;
        weave();
      });
      S.tick(weave);
      weave();
    },
    { ry: -0.2, s: 1.05 },
  );
}

function resistSampler(S) {
  S.plant(
    -3.48,
    2.37,
    (g) => {
      const book = keep(g);
      tab(book, 1.37, '#b9ad95');
      box(book, 0, 0.062, 0, 1.5, 0.122, 0.43, '#997a59');
      box(book, 0, 0.126, 0, 1.42, 0.03, 0.42, '#c7ad81');
      const strip = keep(book, -0.45, 0.145, 0),
        leaves = [];
      let fold = strip;
      for (let i = 0; i < 3; i++) {
        const panel = keep(fold, i ? 0.4 : 0, 0, 0);
        box(panel, 0.2, 0.235, 0, 0.414, 0.469, 0.052, INK_BLUE);
        box(panel, 0.2, 0.248, 0.03, 0.351, 0.384, 0.014, ['#587ba0', '#536d91', '#405d84'][i]);
        for (const y of [0.08, 0.423]) box(panel, 0.2, y, 0.039, 0.304, 0.014, 0.009, CALICO);
        if (i === 0) {
          for (const [x, y, r] of [
            [0.16, 0.268, 0.068],
            [0.249, 0.213, 0.046],
            [0.17, 0.167, 0.025],
          ])
            ring(panel, x, y, 0.048, r, 0.01, CALICO, 14);
        } else if (i === 1) {
          for (let n = 0; n < 4; n++) {
            const slope = at(panel, 0.077 + n * 0.065, 0.145 + (n % 2) * 0.039, 0.052);
            slope.rotation.z = (n % 2 ? 1 : -1) * 0.22;
            diamond(slope, 0, 0.093, 0, 0.059, 0.15, CALICO);
          }
        } else {
          for (let n = 0; n < 5; n++)
            diamond(panel, 0.1 + (n % 3) * 0.1, 0.17 + Math.floor(n / 3) * 0.126, 0.047, 0.066, 0.087, CALICO);
        }
        box(panel, 0.024, 0.237, 0.043, 0.017, 0.401, 0.013, '#cdb990');
        leaves.push(panel);
        fold = panel;
      }
      foldingToy(
        S,
        book,
        { id: 'resist-sampler', label: '阿藍婆的綁染樣本冊', radius: 0.36, y: 0.4, duration: 1.0, sound: 'cloth' },
        (u) => {
          strip.position.x = -0.2 - 0.36 * u;
          leaves[0].rotation.y = -0.51 + 0.18 * u;
          leaves[1].rotation.y = 2.47 - 1.9 * u;
          leaves[2].rotation.y = -2.5 + 1.89 * u;
        },
      );
    },
    { ry: 0.11, s: 1.21 },
  );
}

export function dyeCraft(S) {
  weavingLoom(S);
  resistSampler(S);
  // Fresh-cut indigo belongs beside the dye-house. Its pink spikes separate it from the cloth.
  for (const [x, z, k, angle] of [
    [4.96, -2.35, 1, -0.16],
    [-5.12, -1.56, 0.74, 0.18],
  ])
    S.plant(
      x,
      z,
      (g) => {
        const stems = [
          [-0.36, 0.62, -0.08],
          [-0.17, 0.98, -0.06],
          [0.13, 0.79, 0.038],
          [0.39, 0.62, 0.005],
        ];
        for (const [dx, h, dz] of stems) {
          beam(g, [dx * 0.42, 0, dz], [dx, h, dz - 0.045], 0.016, '#5e7568', 5);
          for (const j of [1, 2, 3]) {
            const u = j / 4,
              side = j % 2 === 1 ? 1 : -1;
            leaf(g, dx * (0.42 + 0.58 * u), h * u, dz, 0.22 + (j % 2) * 0.04, 0.069, side * 0.91, ['#4c756b', '#729082']);
          }
          for (let j = 0; j < 5; j++) {
            const bud = ball(g, dx + Math.sin(j * 2) * 0.021, h - 0.09 + j * 0.036, dz - 0.034, 0.029, '#aa7d85', 0);
            bud.scale.y = 1.31;
          }
        }
      },
      { s: k, ry: angle },
    );
}

function lanternStencil(g, face) {
  const ink = '#855546',
    z = 0.018;
  if (face === 0) {
    // The ferry that brought the crate on the first morning.
    poly(
      g,
      [
        [-0.16, -0.024],
        [0.157, -0.024],
        [0.094, -0.093],
        [-0.108, -0.093],
      ],
      0.008,
      ink,
      0,
      0,
      z,
    );
    box(g, -0.025, 0.012, z, 0.17, 0.076, 0.012, ink);
    box(g, 0.013, 0.073, z, 0.04, 0.053, 0.012, ink);
    for (const x of [-0.068, -0.022, 0.024]) box(g, x, 0.022, z + 0.015, 0.019, 0.026, 0.01, '#f1cc84');
  } else if (face === 1) {
    poly(
      g,
      [
        [-0.084, 0.056],
        [0.065, 0.056],
        [0.047, -0.065],
        [-0.061, -0.065],
      ],
      0.009,
      ink,
      0,
      0,
      z,
    );
    ring(g, 0.068, 0.01, z, 0.037, 0.012, ink, 12);
    box(g, -0.004, -0.079, z, 0.183, 0.014, 0.011, ink);
    for (const x of [-0.046, 0.007]) beam(g, [x, 0.074, z], [x + 0.016, 0.121, z], 0.008, ink, 4);
  } else if (face === 2) {
    poly(
      g,
      [
        [-0.104, -0.077],
        [-0.088, 0.028],
        [-0.124, 0.11],
        [-0.046, 0.092],
        [0, 0.108],
        [0.06, 0.081],
        [0.12, 0.1],
        [0.09, 0.013],
        [0.091, -0.072],
        [0, -0.106],
      ],
      0.008,
      ink,
      0,
      0,
      z,
    );
    for (const x of [-0.046, 0.048]) disc(g, x, 0.023, z + 0.014, 0.022, '#f1cc84', 0.01, 10);
  } else if (face === 3) {
    const pts = [];
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6,
        r = i % 2 ? 0.045 : 0.114;
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    poly(g, pts, 0.009, ink, 0, 0, z);
    disc(g, 0, 0, z + 0.013, 0.031, '#f1cc84', 0.009, 10);
  } else if (face === 4) {
    poly(
      g,
      [
        [-0.12, 0.072],
        [0.12, 0.072],
        [0.081, -0.079],
        [-0.08, -0.079],
      ],
      0.009,
      ink,
      0,
      0,
      z,
    );
    for (const x of [-0.044, 0.044]) diamond(g, x, 0.015, z + 0.012, 0.056, 0.056, '#f1cc84');
  } else {
    poly(
      g,
      [
        [-0.113, 0.083],
        [0.113, 0.083],
        [0.085, -0.053],
        [0, -0.103],
        [-0.081, -0.053],
      ],
      0.009,
      ink,
      0,
      0,
      z,
    );
    diamond(g, 0, 0.01, z + 0.013, 0.111, 0.083, '#f1cc84');
  }
}

export function lanternCraft(S, halo, pool) {
  S.plant(
    -4.3,
    1.48,
    (g) => {
      const carousel = keep(g),
        drum = keep(carousel, 0, 0.88, 0);
      const rose = '#9f544c',
        frame = '#986d4b',
        foil = '#d8ac70';
      tab(carousel, 1.05, '#8b8396');
      cyl(carousel, 0, 0.092, 0, 0.45, 0.52, 0.18, '#756374', 6);
      cyl(carousel, 0, 0.22, 0, 0.43, 0.37, 0.09, frame, 6);
      cyl(carousel, 0, 0.32, 0, 0.41, 0.41, 0.115, rose, 6);
      cyl(carousel, 0, 0.445, 0, 0.49, 0.37, 0.13, foil, 6);
      for (let i = 0; i < 6; i++) {
        const a = (i * TAU) / 6,
          panel = at(drum, Math.sin(a) * 0.346, 0, Math.cos(a) * 0.346);
        panel.rotation.y = a;
        box(panel, 0, 0, 0, 0.4, 0.72, 0.016, ['#f5cb83', '#e6ac75', '#edc284'][i % 3]);
        for (const s of [-1, 1]) {
          box(panel, s * 0.175, 0, 0.014, 0.012, 0.63, 0.014, rose);
          box(panel, 0, s * 0.302, 0.016, 0.352, 0.017, 0.014, rose);
          diamond(panel, s * 0.123, s * 0.235, 0.022, 0.07, 0.051, foil);
        }
        lanternStencil(panel, i);
        const seam = at(carousel, Math.sin(a + Math.PI / 6) * 0.417, 0.9, Math.cos(a + Math.PI / 6) * 0.417);
        box(seam, 0, 0, 0, 0.028, 0.79, 0.028, frame);
      }
      cyl(carousel, 0, 1.3, 0, 0.46, 0.44, 0.092, rose, 6);
      cyl(carousel, 0, 1.43, 0, 0.145, 0.53, 0.19, frame, 6);
      cyl(carousel, 0, 1.52, 0, 0.086, 0.17, 0.09, foil, 6);
      ring(carousel, 0, 1.64, 0, 0.085, 0.016, foil, 16);
      for (const s of [-1, 1]) {
        beam(carousel, [s * 0.426, 0.47, 0], [s * 0.426, 0.26, 0], 0.011, foil, 4);
        cyl(carousel, s * 0.426, 0.213, 0, 0.032, 0.056, 0.097, rose, 6);
      }
      halo(carousel, 0, 0.94, -0.25, 1.32, 0.25, '#edaf71');
      pool(g, 0, 0.06, 1.55, 0.29);
      let turn = 0;
      pickToy(S, carousel, 'shadow-lantern', '海堤上的走馬燈', 0.42, 0.9, () => {
        turn++;
        S.sound('wheel', carousel);
        S.to(drum.rotation, { y: (-turn * TAU) / 6 }, S.stage.still.matches ? 0.22 : 0.92, 'inOut');
      });
      S.on('reset', () => {
        turn = 0;
      });
    },
    { ry: 0.15, s: 0.98 },
  );

  for (const [x, z, s, side] of [
    [-4.62, -3.45, 0.9, 1],
    [4.6, -3.4, 0.9, -1],
  ])
    S.plant(
      x,
      z,
      (g) => {
        const ridge = [
          [-1.28, 0],
          [-1.28, 0.33],
          [-0.86, 0.53],
          [-0.62, 0.48],
          [-0.21, 0.89],
          [0.1, 0.69],
          [0.36, 0.71],
          [0.81, 0.4],
          [1.18, 0.47],
          [1.34, 0.32],
          [1.34, 0],
        ];
        poly(g, ridge, 0.064, '#535f86', 0, 0, -0.035);
        for (const [a, b, c] of [
          [
            [-0.21, 0.89],
            [-0.63, 0.47],
            [-0.43, 0.39],
          ],
          [
            [0.35, 0.7],
            [0.07, 0.66],
            [0.22, 0.51],
          ],
          [
            [-0.87, 0.52],
            [-1.21, 0.3],
            [-0.95, 0.36],
          ],
        ])
          tri(g, [...a, 0.039], [...b, 0.04], [...c, 0.039], '#7b85a1');
        for (const [xx, h] of [
          [-0.68, 0.23],
          [-0.47, 0.19],
          [0.72, 0.25],
          [0.92, 0.18],
        ]) {
          poly(
            g,
            [
              [-0.15, 0],
              [0, h],
              [0.15, 0],
            ],
            0.038,
            '#465677',
            xx,
            0,
            0.06,
          );
        }
        g.scale.x = side;
      },
      { s },
    );
}

// The morning tea counter returns to the lantern fair with its serving set.
export function homeTeaService(S, counter) {
  const service = keep(counter, -0.025, 0.647, 0.15);
  const metal = '#6c817c',
    glaze = '#d8dfc9',
    blue = '#496582',
    liquor = '#bb8443';
  const tray = cyl(service, 0, 0.02, 0, 0.435, 0.405, 0.045, metal, 24);
  tray.scale.z = 0.53;
  const mat = cyl(service, 0, 0.04, 0, 0.402, 0.399, 0.019, '#c6af84', 24);
  mat.scale.z = 0.5;
  const pot = keep(service, -0.194, 0.064, -0.01);
  const belly = ball(pot, 0, 0.14, 0, 0.148, glaze, 1);
  belly.scale.set(1.19, 0.81, 0.84);
  cyl(pot, 0, 0.039, 0, 0.096, 0.085, 0.047, blue, 12);
  cyl(pot, 0, 0.251, 0, 0.11, 0.129, 0.03, blue, 14);
  const lid = ball(pot, 0, 0.27, 0, 0.098, glaze, 1);
  lid.scale.set(1, 0.34, 0.84);
  ball(pot, 0, 0.317, 0, 0.026, '#b97155', 1);
  const handle = ring(pot, -0.16, 0.164, -0.006, 0.076, 0.017, blue, 16);
  handle.scale.y = 1.18;
  poly(
    pot,
    [
      [0.086, 0.093],
      [0.184, 0.145],
      [0.232, 0.249],
      [0.201, 0.259],
      [0.158, 0.204],
      [0.1, 0.194],
    ],
    0.064,
    glaze,
    0,
    0,
    -0.032,
  );
  for (const sx of [-1, 0, 1]) diamond(pot, sx * 0.058, 0.145, 0.122, 0.036, 0.069, blue);
  const cups = [0.115, 0.295].map((x, i) => {
    const cup = at(service, x, 0.055, 0.035 - i * 0.082);
    cyl(cup, 0, 0.051, 0, 0.077, 0.046, 0.103, glaze, 12);
    cyl(cup, 0, 0.1, 0, 0.078, 0.078, 0.013, blue, 12);
    cyl(cup, 0, 0.107, 0, 0.065, 0.065, 0.009, '#d5c6a8', 12);
    const drink = keep(cup, 0, 0.115, 0);
    cyl(drink, 0, 0, 0, 0.063, 0.063, 0.007, liquor, 12);
    drink.visible = false;
    return { cup, drink };
  });
  const stream = keep(service);
  // The stream starts at the transformed spout and finishes at the chosen cup.
  cyl(stream, 0, 0.5, 0, 0.012, 0.013, 1, '#bf8f56', 6);
  stream.visible = false;
  const steam = keep(service);
  for (let i = 0; i < 2; i++) {
    const x = i * 0.059;
    poly(
      steam,
      [
        [x, 0],
        [x + 0.026, 0.054],
        [x + 0.005, 0.115],
        [x + 0.034, 0.166],
        [x + 0.013, 0.163],
        [x - 0.01, 0.114],
        [x + 0.008, 0.056],
        [x - 0.011, 0.009],
      ],
      0.006,
      '#e2d4b6',
      0,
      0,
      0,
    );
  }
  steam.visible = false;
  const up = new S.T.Vector3(0, 1, 0),
    spout = new S.T.Vector3(),
    cupLip = new S.T.Vector3(),
    vec = new S.T.Vector3();
  const pour = { u: 1 };
  let next = 0,
    chosen = -1;
  pickToy(S, service, 'home-teapot', '回到茶攤的小茶壺', 0.245, 0.18, () => {
    if (pour.u < 1) return;
    chosen = next++ % cups.length;
    cups[chosen].drink.visible = false;
    S.sound('pour', service);
    pour.u = 0;
    S.to(pour, { u: 1 }, S.stage.still.matches ? 0.38 : 1.56, 'lin');
  });
  S.tick(() => {
    if (chosen < 0) return;
    const u = pour.u,
      rise = Math.sin(Math.PI * u),
      tilt = clamp(Math.sin(Math.PI * clamp((u - 0.13) / 0.72)) * 1.9);
    const c = cups[chosen].cup;
    pot.position.set(-0.194 + rise * (0.115 + chosen * 0.156), 0.064 + rise * 0.203, -0.01 + rise * (c.position.z + 0.01));
    pot.rotation.z = -0.77 * tilt;
    stream.visible = u > 0.29 && u < 0.65;
    if (stream.visible) {
      spout.set(0.219, 0.245, 0);
      pot.localToWorld(spout);
      service.worldToLocal(spout);
      cupLip.set(0, 0.115, 0);
      c.localToWorld(cupLip);
      service.worldToLocal(cupLip);
      vec.copy(spout).sub(cupLip);
      stream.position.copy(cupLip);
      stream.scale.set(1, vec.length(), 1);
      stream.quaternion.setFromUnitVectors(up, vec.normalize());
    }
    if (u > 0.4) cups[chosen].drink.visible = true;
    steam.visible = u > 0.51;
    if (steam.visible) {
      steam.position.set(c.position.x - 0.023, 0.183, c.position.z);
      steam.scale.y = 0.7 + 0.36 * Math.sin(Math.PI * clamp((u - 0.5) * 2));
    }
  });
  S.on('reset', () => {
    chosen = -1;
    next = 0;
    pour.u = 1;
  });
}
