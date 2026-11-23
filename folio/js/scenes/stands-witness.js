import { keep, beam, disc, poly, quad } from '../paper.js';

const SEA = '#227d83',
  GOLD = '#f3bd58',
  STITCH = '#f2dfb7';

function flagAt(person, row, seat) {
  const side = person.position.x > 0.05 ? 1 : -1;
  const pivot = keep(person, side * 0.23, 0.46, 0.21);
  pivot.name = `加油旗・${row + 1}排${seat + 1}號`;
  beam(pivot, [0, -0.14, 0], [0, 1.22, 0], 0.035, '#775a43', 6);
  disc(pivot, 0, 1.225, 0, 0.051, GOLD, 0.035, 8);
  const cloth = keep(pivot, 0, 1.17, 0);
  // An ochre fly and a deep teal hoist remain legible against the striped canopy.
  quad(cloth, [0, 0, 0.035], [-0.55, 0.038, 0.095], [-0.52, -0.47, 0.1], [0, -0.56, 0.035], SEA);
  quad(cloth, [-0.55, 0.038, 0.095], [-1.17, -0.048, 0.029], [-1.0, -0.28, 0.035], [-0.52, -0.47, 0.1], GOLD);
  poly(
    cloth,
    [
      [-0.1, -0.095],
      [-0.17, -0.102],
      [-0.36, -0.36],
      [-0.3, -0.37],
    ],
    0.016,
    STITCH,
    0,
    0,
    0.087,
  );
  poly(
    cloth,
    [
      [-0.05, -0.026],
      [-0.1, -0.022],
      [-0.1, -0.344],
      [-0.05, -0.351],
    ],
    0.009,
    STITCH,
    0,
    0,
    0.071,
  );
  return { pivot, cloth, side };
}

function pointingSleeve(person, shoulder) {
  const arm = keep(person, shoulder.position.x, shoulder.position.y, 0.14);
  arm.name = '前排水獺的指尖';
  poly(
    arm,
    [
      [-0.035, -0.061],
      [0.29, -0.063],
      [0.39, -0.031],
      [0.38, 0.065],
      [0.25, 0.09],
      [-0.04, 0.07],
    ],
    0.069,
    '#537d77',
  );
  poly(
    arm,
    [
      [0.27, -0.065],
      [0.35, -0.057],
      [0.36, 0.071],
      [0.28, 0.082],
    ],
    0.018,
    STITCH,
    0,
    0,
    0.074,
  );
  poly(
    arm,
    [
      [0.342, -0.036],
      [0.44, -0.049],
      [0.49, -0.032],
      [0.54, -0.026],
      [0.55, 0.005],
      [0.77, 0.057],
      [0.78, 0.09],
      [0.715, 0.112],
      [0.53, 0.087],
      [0.49, 0.13],
      [0.46, 0.119],
      [0.465, 0.071],
      [0.344, 0.065],
    ],
    0.038,
    '#90654c',
    0,
    0,
    0.055,
  );
  poly(
    arm,
    [
      [0.51, 0.06],
      [0.735, 0.077],
      [0.76, 0.089],
      [0.707, 0.093],
      [0.52, 0.077],
    ],
    0.01,
    '#c2936e',
    0,
    0,
    0.096,
  );
  arm.visible = false;
  return arm;
}

/** The paper audience waves its club colours, sees the sixth finger and waits for the throw. */
export function makeWitnessStand(S, stand) {
  const T = S.T;
  const rows = Array.from({ length: 3 }, () => ({ root: keep(stand.b), lower: 0, rise: 0, seats: [] }));
  rows.forEach((row) => {
    row.root.visible = false;
  });
  let pointing, handTarget;
  const attention = { amount: 0 };
  const direction = new T.Vector3(),
    forward = new T.Vector3(1, 0, 0);
  for (const person of stand.crowd) {
    const rowIndex = Math.max(0, Math.min(2, Math.round((0.48 - person.position.z) / 0.47)));
    const row = rows[rowIndex],
      seat = row.seats.length;
    row.root.add(person);
    const left = person.getObjectByName('左肩'),
      right = person.getObjectByName('右肩'),
      head = person.getObjectByName('頭');
    const isWitness = rowIndex === 0 && seat === 3;
    if (isWitness) {
      person.name = '指向第六指的前排觀眾';
      person.position.set(1.52, 0.08, 0.95);
      person.scale.setScalar(1.19);
      const scarf = keep(person, 0, 0.58, 0.14);
      poly(
        scarf,
        [
          [-0.18, 0.022],
          [0.16, 0.034],
          [0.105, -0.056],
          [-0.11, -0.073],
        ],
        0.04,
        GOLD,
      );
      poly(
        scarf,
        [
          [0.035, -0.045],
          [0.133, -0.052],
          [0.19, -0.23],
          [0.115, -0.2],
          [0.08, -0.23],
        ],
        0.023,
        '#cc8c49',
        0,
        0,
        0.025,
      );
      pointing = pointingSleeve(person, right);
    } else {
      person.scale.setScalar(rowIndex === 0 ? 0.7 : rowIndex === 1 ? 0.59 : 0.54);
      if (rowIndex === 0) {
        person.position.z += 0.27;
        if (seat === 0) person.position.x -= 0.19;
      }
    }
    const carries =
      !isWitness &&
      (rowIndex === 0
        ? seat === 0 || seat === 2
        : rowIndex === 1
          ? seat === 0 || seat === 3 || seat === 5
          : seat === 1 || seat === 4);
    const flag = carries ? flagAt(person, rowIndex, seat) : null;
    row.seats.push({ person, left, right, head, flag, isWitness, seat, baseY: person.position.y });
  }

  function setPose(row, key, value, duration) {
    if (S.stage.still.matches) {
      row[key] = value;
      return;
    }
    S.to(row, { [key]: value }, duration, 'inOut');
  }
  function pointAt(hand) {
    handTarget = hand;
    pointing.visible = true;
    if (S.stage.still.matches) attention.amount = 1;
    else S.to(attention, { amount: 1 }, 0.38, 'out');
  }
  function showRow(i) {
    if (S.stage.still.matches) rows[i].root.visible = true;
    else S.show(rows[i].root, 0.33);
  }
  function lowerRow(i) {
    setPose(rows[i], 'lower', 1, 0.44);
  }
  function applaud() {
    for (const [i, row] of rows.entries()) {
      const start = () => {
        setPose(row, 'rise', 1, 0.44);
      };
      if (S.stage.still.matches) start();
      else S.wait(i * 0.11).then(start);
    }
    // The sound belongs to the palms on the three tiers, after the spear has landed.
    for (const [time, index] of [
      [0.08, 0],
      [0.25, 1],
      [0.39, 2],
      [0.56, 0],
      [0.71, 2],
    ]) {
      S.wait(time).then(() => S.sound('handprint', rows[index].root));
    }
  }
  function draw(t) {
    const still = S.stage.still.matches;
    for (const [rowIndex, row] of rows.entries()) {
      if (!row.root.visible) continue;
      const hush = row.lower * (1 - row.rise);
      for (const { person, left, right, head, flag, isWitness, seat, baseY } of row.seats) {
        const phase = t * 5.4 + seat * 0.91 + rowIndex * 1.1;
        const wave = still ? 0 : Math.sin(phase);
        person.position.y = baseY + 0.17 * row.rise + (still ? 0 : 0.047 * row.rise * Math.abs(wave));
        person.rotation.z = hush * (isWitness ? -0.105 : 0.075 * (seat % 2 ? 1 : -1));
        head.rotation.y = hush * (isWitness ? 0.42 : 0.26);
        head.rotation.z = hush * (isWitness ? -0.13 : seat % 2 ? -0.16 : 0.13);
        if (flag) {
          // The pole crosses the fold and the fabric hangs down the front of the seat.
          const liftAngle = 0.18 + (0.29 + 0.29 * row.rise) * wave;
          flag.pivot.rotation.z = -flag.side * (liftAngle * (1 - hush) + (2.41 + (seat % 2 ? 0.09 : -0.09)) * hush);
          flag.pivot.rotation.x = -0.12 * (1 - hush) - 0.54 * hush;
          flag.cloth.rotation.y = 0.21 * (1 - hush) * wave + 0.42 * hush;
          flag.cloth.scale.x = -flag.side * (1 - 0.2 * hush);
        }
        left.rotation.z = 1.1 * hush - row.rise * (still ? 1.55 : 1.33 + 0.7 * wave);
        right.rotation.z = -1.29 * hush + row.rise * (still ? 1.72 : 1.38 + 0.77 * wave);
        if (flag) {
          const carryingHand = flag.side < 0 ? left : right;
          carryingHand.rotation.z = flag.side * (0.46 * (1 - hush) - 0.88 * hush);
        }

        if (isWitness) {
          const reach = attention.amount * (1 - row.rise);
          right.visible = reach < 0.1;
          pointing.visible = reach >= 0.1;
          if (pointing.visible && handTarget) {
            direction.copy(S.world(handTarget, [0, 0.09, 0]));
            person.worldToLocal(direction).sub(pointing.position).normalize();
            pointing.quaternion.setFromUnitVectors(forward, direction);
            pointing.rotateZ(-0.76 * (1 - reach));
            left.rotation.z = 1.04 * reach;
          }
        }
      }
    }
  }
  function reset() {
    attention.amount = 0;
    handTarget = null;
    pointing.visible = false;
    rows.forEach((row) => {
      row.lower = row.rise = 0;
      row.root.visible = false;
    });
  }
  return { showRow, pointAt, lowerRow, applaud, draw, reset };
}
