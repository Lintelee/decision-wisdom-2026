import { T, beam, box, card, disc, group, keep, poly, words } from '../paper.js';

const INK = '#243b54',
  INDIGO = '#486b86',
  BONE = '#f3e4bf';
const CEDAR = '#79523a',
  BAMBOO = '#c99351',
  WAX = '#e4ba78',
  VERMILION = '#c85038';
const PARK_X = 1.96,
  ROLLER_RADIUS = 0.116,
  RETURN_Z = 0.39,
  CONTACT_Z = 0.087;

/** Centre of the impression lies at (x,y,z), with its ink raised toward the reader. */
export function mountainPrint(g, x, y, z, width) {
  const motif = keep(g, x, y, z);
  motif.name = '朱日雙山印';
  motif.scale.setScalar(width);
  disc(motif, 0.185, 0.236, 0.002, 0.159, VERMILION, 0.014, 12);
  const ridge = [
    [-0.48, -0.187],
    [-0.164, 0.261],
    [0.027, 0.022],
    [0.18, 0.171],
    [0.482, -0.184],
  ];
  poly(motif, ridge, 0.012, BONE, 0, 0.014, 0.012);
  poly(
    motif,
    [
      [-0.474, -0.18],
      [-0.164, 0.226],
      [0.143, -0.18],
    ],
    0.012,
    INK,
    0,
    0,
    0.025,
  );
  poly(
    motif,
    [
      [-0.164, 0.226],
      [-0.082, -0.18],
      [0.143, -0.18],
    ],
    0.009,
    INDIGO,
    0,
    0,
    0.04,
  );
  poly(
    motif,
    [
      [-0.097, -0.18],
      [0.18, 0.138],
      [0.46, -0.18],
    ],
    0.011,
    INDIGO,
    0,
    0,
    0.053,
  );
  poly(
    motif,
    [
      [0.18, 0.138],
      [0.229, -0.18],
      [0.46, -0.18],
    ],
    0.009,
    INK,
    0,
    0,
    0.067,
  );
  // The second, broken stripe is the telltale registration mark below both hills.
  poly(
    motif,
    [
      [-0.5, -0.221],
      [0.5, -0.221],
      [0.428, -0.286],
      [-0.448, -0.286],
    ],
    0.012,
    INK,
    0,
    0,
    0.02,
  );
  for (const dx of [-0.21, 0.135]) {
    poly(
      motif,
      [
        [-0.155, -0.323],
        [0.16, -0.323],
        [0.111, -0.374],
        [-0.21, -0.374],
      ],
      0.01,
      INDIGO,
      dx,
      0,
      0.02,
    );
  }
  return motif;
}

function travellingWheel(carriage, x) {
  const wheel = keep(carriage, x, 2.235, 0.212);
  disc(wheel, 0, 0, 0, ROLLER_RADIUS, INK, 0.072, 12);
  disc(wheel, 0, 0, 0.048, 0.092, BAMBOO, 0.032, 12);
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    beam(wheel, [0, 0, 0.069], [0.082 * Math.cos(angle), 0.082 * Math.sin(angle), 0.069], 0.011, CEDAR, 4);
  }
  disc(wheel, 0, 0, 0.077, 0.031, BONE, 0.023, 8);
  return wheel;
}

/** Only the number behind each aperture is exposed. The paired strips share a sheet of ten printed numerals. */
function tallyBox(carriage) {
  const plate = group(carriage);
  plate.position.set(0, 2.054, 0.364);
  plate.rotation.x = -0.34;
  card(plate, 0, -0.15, -0.06, 0.7, 0.3, CEDAR, 0.09, 0.047);
  card(plate, 0, -0.133, 0.034, 0.663, 0.266, INK, 0.02, 0.03);
  words(plate, 'AI', -0.178, 0, 0.059, 0.167, { color: BONE, weight: 900, font: 'Arial, sans-serif' });

  const sheet = document.createElement('canvas');
  const row = 96;
  sheet.width = 96;
  sheet.height = 10 * row;
  const ctx = sheet.getContext('2d');
  ctx.fillStyle = '#f9e9c6';
  ctx.fillRect(0, 0, sheet.width, sheet.height);
  ctx.fillStyle = '#243348';
  ctx.font = 'bold 88px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  for (let i = 0; i <= 9; i++) ctx.fillText(String(i), sheet.width / 2, i * row + 79);
  const texture = new T.CanvasTexture(sheet);
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 4;
  const material = new T.MeshBasicMaterial({ map: texture, toneMapped: false });

  function drum(x) {
    box(plate, x, 0, 0.06, 0.153, 0.212, 0.025, '#131f2c');
    const face = new T.PlaneGeometry(0.124, 0.177);
    const strip = new T.Mesh(face, material);
    strip.position.set(x, 0, 0.078);
    plate.add(strip);
    const uv = face.getAttribute('uv');
    return (digit) => {
      const top = 1 - (digit + 0.025) / 10,
        bottom = 1 - (digit + 0.975) / 10;
      uv.setY(0, top);
      uv.setY(1, top);
      uv.setY(2, bottom);
      uv.setY(3, bottom);
      uv.needsUpdate = true;
    };
  }
  const tens = drum(0.027),
    units = drum(0.181);
  const crown = keep(plate, 0.361, 0, 0.012);
  disc(crown, 0, 0, 0, 0.065, CEDAR, 0.047, 10);
  disc(crown, 0, 0, 0.027, 0.045, WAX, 0.018, 10);
  box(crown, 0, 0.022, 0.041, 0.014, 0.044, 0.012, INK);
  for (const x of [-0.297, 0.296]) disc(plate, x, 0.094, 0.06, 0.013, WAX, 0.007, 7);
  const count = (value) => {
    const numeric = Number(value);
    const n = Number.isFinite(numeric) ? Math.max(0, Math.min(12, Math.round(numeric))) : 0;
    tens(Math.floor(n / 10));
    units(n % 10);
    crown.rotation.z = (-n * Math.PI) / 5;
  };
  count(0);
  return count;
}

/** Set the assembly on the drying rack's origin. The six cloth faces lie in its XY plane at z=0. */
export function printRail(g) {
  for (const x of [-1.95, 1.95]) {
    beam(g, [x, 2.05, 0.015], [x, 2.12, 0.218], 0.047, CEDAR, 6);
    box(g, x, 2.118, 0.212, 0.105, 0.108, 0.133, CEDAR);
    box(g, x, 2.162, 0.212, 0.128, 0.025, 0.141, WAX);
  }
  box(g, 0, 2.105, 0.193, 4.12, 0.067, 0.104, BAMBOO);
  box(g, 0, 2.134, 0.215, 4.12, 0.021, 0.08, WAX);
  for (const x of [-1.94, -1.13, 0.82, 1.95]) {
    box(g, x, 2.108, 0.197, 0.041, 0.077, 0.113, CEDAR);
  }
  const carriage = keep(g, PARK_X);
  carriage.name = '竹軌 AI 印花車';
  box(carriage, -0.163, 2.218, 0.145, 0.593, 0.085, 0.09, CEDAR);
  // An offset bogie keeps both wheels on the bamboo even in the right-hand parking bay.
  const wheels = [-0.386, 0.06].map((x) => travellingWheel(carriage, x));
  for (const [axle, frame] of [
    [-0.386, -0.18],
    [0.06, 0.18],
  ]) {
    beam(carriage, [axle, 2.207, 0.176], [frame, 1.945, 0.343], 0.036, BAMBOO, 5);
  }
  box(carriage, 0, 1.92, 0.304, 0.383, 0.089, 0.15, CEDAR);
  for (const x of [-0.153, 0.153]) {
    beam(carriage, [x, 1.909, 0.025], [x, 1.909, 0.435], 0.023, CEDAR, 5);
  }
  const count = tallyBox(carriage);

  // The slide presses toward the cloth. A short hinged knuckle follows its stroke.
  const head = keep(carriage, 0, 1.568, RETURN_Z);
  head.name = '向布面壓印的花版';
  for (const x of [-0.139, 0.139]) {
    beam(head, [x, 0.205, -0.03], [x, 0.36, -0.03], 0.029, BAMBOO, 5);
    disc(head, x, 0.254, -0.013, 0.034, WAX, 0.035, 8);
  }
  card(head, 0, -0.245, -0.075, 0.488, 0.503, CEDAR, 0.082, 0.038);
  card(head, 0, -0.226, 0.008, 0.453, 0.461, WAX, 0.025, 0.025);
  card(head, 0, -0.211, 0.035, 0.413, 0.421, '#efdab3', 0.013, 0.011);
  mountainPrint(head, 0, -0.002, 0.051, 0.361);
  const socket = keep(head, 0, 0.212, 0.086);
  socket.name = '布樣掛夾';
  for (const x of [-0.125, 0.125]) {
    beam(head, [x, 0.242, 0.023], [x, 0.222, 0.111], 0.028, CEDAR, 5);
    box(head, x, 0.205, 0.11, 0.056, 0.092, 0.038, BAMBOO);
    disc(head, x, 0.216, 0.134, 0.02, '#724934', 0.012, 7);
  }
  const pivotY = 1.917,
    pivotZ = 0.28,
    pinY = 1.822,
    arm = 0.151;
  const links = [-0.155, 0.155].map((x) => {
    const first = keep(carriage, x, pivotY, pivotZ),
      second = keep(carriage, x);
    for (const rod of [first, second]) {
      beam(rod, [0, 0, 0], [0, -arm, 0], 0.027, '#995f40', 5);
      disc(rod, 0, 0, 0.019, 0.034, WAX, 0.019, 8);
    }
    return { first, second };
  });
  const drive = {
    get x() {
      return carriage.position.x;
    },
    set x(x) {
      carriage.position.x = x;
      for (const wheel of wheels) wheel.rotation.z = (PARK_X - x) / ROLLER_RADIUS;
    },
  };
  const press = {
    get u() {
      return (head.position.z - RETURN_Z) / (CONTACT_Z - RETURN_Z);
    },
    set u(u) {
      head.position.z = RETURN_Z + (CONTACT_Z - RETURN_Z) * u;
      const drop = pivotY - pinY,
        depth = head.position.z - 0.013 - pivotZ;
      const center = Math.atan2(-depth, drop),
        elbow = Math.acos(Math.hypot(drop, depth) / (2 * arm));
      for (const { first, second } of links) {
        first.rotation.x = center - elbow;
        second.position.y = pivotY - arm * Math.cos(first.rotation.x);
        second.position.z = pivotZ - arm * Math.sin(first.rotation.x);
        second.rotation.x = center + elbow;
      }
    },
  };
  press.u = 0;

  async function stamp(S, pieceX, onContact) {
    const x = Math.min(1.5, Math.max(-1.5, pieceX));
    const still = S.stage.still.matches;
    if (still) {
      drive.x = x;
      press.u = 1;
    } else {
      await S.to(drive, { x }, 0.34, 'inOut');
      await S.to(press, { u: 1 }, 0.19, 'in');
      S.sound('wood-knock', head);
    }
    try {
      const contact = onContact?.();
      // Let each finished print register even when travel, recoil and sound are turned off.
      await Promise.all([contact, S.wait(still ? 0.78 : 0.085)]);
    } finally {
      if (still) press.u = 0;
      else await S.to(press, { u: 0 }, 0.23, 'out');
    }
  }
  async function park(S) {
    if (S.stage.still.matches) {
      press.u = 0;
      drive.x = PARK_X;
      return;
    }
    if (press.u > 0.001) await S.to(press, { u: 0 }, 0.19, 'out');
    if (Math.abs(drive.x - PARK_X) > 0.001) await S.to(drive, { x: PARK_X }, 0.41, 'inOut');
  }
  return { carriage, head, socket, count, stamp, park };
}
