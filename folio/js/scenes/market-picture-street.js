import { beam, box, card, disc, group, keep, poly, quad, ring, tab } from '../paper.js';

const UMBER = '#765c47',
  CREAM = '#efdcad',
  TEAL = '#597971';

// The same full-size press plate draws the mural, these three editions and the camera print.
// Hardware belongs to each address. Only the picture itself is identical.
function framedEdition(parent, label, y, z, width, mural, canvas = false) {
  const mount = keep(parent, 0, y, z),
    height = (width * 1.6) / 3.6;
  const margin = canvas ? 0.049 : 0.062;
  const sheet = keep(mount);
  box(sheet, 0, -height / 2, -0.036, width + 2 * margin, height + 2 * margin, 0.065, canvas ? '#caac80' : UMBER);
  box(sheet, 0, -height / 2, 0.004, width + margin, height + margin, 0.023, '#f3e8cc');
  const art = keep(sheet, 0, -height, 0.023);
  art.scale.setScalar(width / 3.6);
  art.name = '街坊門面的同版海報・' + label;
  mural(art);
  if (canvas) {
    for (const yy of [0.042, -height - 0.038]) {
      beam(sheet, [-width / 2 - 0.093, yy, 0.018], [width / 2 + 0.093, yy, 0.018], 0.024, '#8a6948', 6);
    }
  } else {
    for (const x of [-width / 2 - 0.026, width / 2 + 0.026]) {
      for (const yy of [0.022, -height - 0.022]) disc(sheet, x, yy, 0.024, 0.016, '#ccaa67', 0.007, 8);
    }
  }
  return { mount, sheet, height };
}

function paperShop(S, mural) {
  let poster;
  S.plant(0.74, -2.15, (g) => {
    const w = 1.88,
      front = 0.236;
    poly(
      g,
      [
        [-w / 2, 0],
        [-w / 2, 2.37],
        [-0.6, 2.43],
        [0.49, 2.43],
        [w / 2, 2.32],
        [w / 2, 0],
      ],
      0.4,
      '#d8bd91',
      0,
      0,
      -0.17,
    );
    for (const x of [-0.846, 0.84]) {
      box(g, x, 1.07, front + 0.019, 0.088, 2.14, 0.07, '#ab8260');
      box(g, x, 0.13, front + 0.046, 0.19, 0.26, 0.117, '#a39374');
    }
    box(g, 0, 2.37, front + 0.048, 2.023, 0.103, 0.194, UMBER);
    box(g, 0, 2.439, front + 0.028, 1.986, 0.055, 0.201, '#ba8b66');
    box(g, -0.2, 0.69, front + 0.023, 1.13, 1.2, 0.077, '#62756d');
    for (let i = 0; i < 4; i++) {
      const x = -0.61 + i * 0.265;
      box(g, x, 0.83, front + 0.068, 0.223, 0.73, 0.018, i % 2 ? '#9eae94' : '#b8c0a1');
      box(g, x, 0.32, front + 0.068, 0.22, 0.2, 0.018, '#7e896f');
    }
    box(g, -0.2, 0.54, front + 0.09, 1.14, 0.059, 0.107, UMBER);
    // Rolls of paper in the open stock cupboard identify the frame shop from the street.
    box(g, 0.539, 0.62, front + 0.034, 0.388, 0.97, 0.069, '#8d7455');
    for (const [i, x] of [
      [0, 0.447],
      [1, 0.54],
      [2, 0.633],
    ]) {
      const to = [x + (i - 1) * 0.039, 0.84 + i * 0.084, front + 0.115];
      beam(g, [x, 0.23, front + 0.107], to, 0.043, ['#d6a36c', '#e7cc91', '#a1aa84'][i], 8);
    }
    tab(g, 1.68);
    poster = framedEdition(g, '畫材舖', 2.252, front + 0.159, 1.72, mural);
    S.pad(poster.sheet, 0.34, [0, -poster.height * 0.5, 0.042]);
    S.discovery(poster.sheet, {
      id: 'framed-kite',
      label: '畫材舖的裱框風箏海報',
      aim: [0, -poster.height * 0.5, 0.042],
      sound: 'wood-knock',
      duration: 0.88,
      draw(u, visit, reduced) {
        const lift = Math.sin(Math.PI * u) ** 2;
        poster.sheet.rotation.x = (reduced ? -0.026 : -0.24) * lift;
      },
    });
  });
  return poster;
}

function gateBanner(S, gate, mural) {
  const postX = 1.033,
    top = 2.94,
    z = 0.198;
  for (const x of [-postX, postX]) {
    beam(gate, [x, 0, z], [x, top + 0.095, z], 0.041, UMBER, 6);
    box(gate, x, 0.142, z, 0.135, 0.284, 0.138, '#ac9870');
    disc(gate, x, top + 0.045, z, 0.081, '#d6ae67', 0.057, 10);
  }
  beam(gate, [-postX - 0.1, top, z], [postX + 0.1, top, z], 0.031, '#b58a55', 6);
  const poster = framedEdition(gate, '拱門懸幅', top - 0.146, z + 0.063, 1.89, mural, true);
  for (const x of [-0.774, 0.774]) beam(gate, [x, top, z], [x, top - 0.16, z + 0.081], 0.016, '#967950', 5);
  const reel = keep(gate, postX, 1.83, z + 0.047);
  ring(reel, 0, 0, 0.018, 0.125, 0.023, TEAL, 16);
  for (let i = 0; i < 2; i++) box(reel, 0, 0, 0.021, 0.24, 0.02, 0.023, TEAL).rotation.z = (i * Math.PI) / 2;
  disc(reel, 0, 0, 0.045, 0.043, CREAM, 0.027, 8);
  disc(reel, 0.109, 0, 0.047, 0.023, '#cd9257', 0.045, 8);
  for (const dx of [-0.045, 0.045])
    beam(gate, [postX + dx, 1.83, z + 0.026], [postX + dx, top, z + 0.026], 0.008, '#937751', 4);
  S.pad(poster.sheet, 0.32, [0, -poster.height * 0.5, 0.042]);
  S.discovery(poster.sheet, {
    id: 'drying-line',
    label: '轉動懸掛風箏海報的滑輪',
    aim: [0, -poster.height * 0.5, 0.042],
    sound: 'wood-creak',
    duration: 1.05,
    draw(u, visit, reduced) {
      const tug = Math.sin(Math.PI * u) ** 2;
      reel.rotation.z = -tug * (reduced ? 0.25 : 2.7);
      poster.sheet.position.y = 0.105 * tug;
      poster.sheet.rotation.z = (reduced ? 0 : 0.048) * tug;
    },
  });
  return poster;
}

function breadShop(S, mural) {
  let poster;
  S.plant(
    4.71,
    -1.82,
    (g) => {
      const w = 1.93,
        front = 0.223;
      box(g, 0, 1.155, 0, w, 2.31, 0.43, '#b8bd9b');
      for (const x of [-0.89, 0.89]) box(g, x, 1.11, front, 0.112, 2.19, 0.098, TEAL);
      box(g, 0, 2.335, front - 0.019, w + 0.13, 0.13, 0.16, TEAL);
      box(g, 0, 2.42, front - 0.025, w + 0.2, 0.052, 0.19, '#95a38a');
      box(g, -0.05, 0.73, front + 0.013, 1.43, 1.15, 0.15, '#6e755e');
      for (const x of [-0.68, -0.22, 0.22, 0.62]) box(g, x, 0.77, front + 0.101, 0.046, 0.85, 0.032, '#c0a37d');
      box(g, -0.03, 0.42, front + 0.15, 1.51, 0.073, 0.25, '#a48158');
      const awning = keep(g, 0, 1.335, front + 0.062);
      const ink = ['#b56e5c', '#e4c89e'];
      for (let i = 0; i < 7; i++) {
        const l = -0.828 + i * 0.237,
          r = l + 0.237,
          colour = ink[i % 2];
        quad(awning, [l, 0, 0.005], [r, 0, 0.005], [r, -0.135, 0.38], [l, -0.135, 0.38], colour);
        poly(
          awning,
          [
            [l, -0.133],
            [r, -0.133],
            [r, -0.19],
            [r - 0.065, -0.23],
            [l + 0.06, -0.23],
            [l, -0.19],
          ],
          0.022,
          colour,
          0,
          0,
          0.375,
        );
      }
      for (const x of [-0.52, -0.13, 0.37]) {
        const loaf = group(g);
        loaf.position.set(x, 0.505, front + 0.166);
        poly(
          loaf,
          [
            [-0.14, -0.032],
            [-0.151, 0.023],
            [-0.113, 0.076],
            [-0.027, 0.104],
            [0.085, 0.094],
            [0.142, 0.052],
            [0.147, -0.029],
          ],
          0.106,
          '#d7a363',
        );
        beam(loaf, [-0.067, 0.039, 0.113], [-0.035, 0.083, 0.113], 0.011, '#f2cf90', 4);
        beam(loaf, [0.016, 0.038, 0.113], [0.048, 0.079, 0.113], 0.011, '#f2cf90', 4);
      }
      tab(g, 1.69);
      poster = framedEdition(g, '麵包舖', 2.243, front + 0.155, 1.76, mural);
      S.pad(poster.sheet, 0.33, [0, -poster.height * 0.5, 0.035]);
      S.discovery(poster.sheet, {
        id: 'bakery-kite',
        label: '麵包舖櫥窗上的風箏海報',
        aim: [0, -poster.height * 0.5, 0.035],
        sound: 'cloth',
        duration: 1.08,
        draw(u, visit, reduced) {
          const lift = Math.sin(Math.PI * u) ** 2;
          awning.rotation.x = (reduced ? -0.06 : -0.47) * lift;
          poster.sheet.rotation.z = (reduced ? 0 : -0.026) * lift;
        },
      });
    },
    { ry: -0.075 },
  );
  return poster;
}

export function marketEditions(S, gate, mural) {
  const posters = [paperShop(S, mural), gateBanner(S, gate, mural), breadShop(S, mural)];
  // One breeze runs left to right after the roller reaches the end of the large wall.
  return async function followTheCopies() {
    for (const { mount } of posters) {
      if (S.stage.still.matches) {
        await S.wait(0.24);
      } else {
        S.sound('paper', mount);
        await S.to(mount.rotation, { x: -0.23 }, 0.14, 'out');
        await S.to(mount.rotation, { x: 0 }, 0.27, 'inOut');
      }
    }
  };
}
