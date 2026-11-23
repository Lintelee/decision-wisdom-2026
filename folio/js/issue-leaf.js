import * as T from '../vendor/three.module.min.js';

const columns = 38, rows = 16, stride = columns + 1;
const count = stride * (rows + 1);
const limit = (value, low, high) => Math.max(low, Math.min(high, value));
const dynamic = (n, size) => new T.BufferAttribute(new Float32Array(n * size), size).setUsage(T.DynamicDrawUsage);

function indices(reversed) {
  const list = [];
  for (let z = 0; z < rows; z++) for (let x = 0; x < columns; x++) {
    const a = z * stride + x, b = a + 1, c = a + stride, d = c + 1;
    list.push(...(reversed ? [a,b,c, b,d,c] : [a,c,b, b,c,d]));
  }
  return new T.Uint16BufferAttribute(list, 1);
}

function faceUV(fromRight) {
  const uv = new Float32Array(count * 2);
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= columns; i++) {
    const k = (j * stride + i) * 2;
    uv[k] = fromRight ? i / columns : 1 - i / columns;
    uv[k + 1] = 1 - j / rows;
  }
  return new T.BufferAttribute(uv, 2);
}

// A cylindrical curl about a diagonal line is developable: ink follows the paper
// without stretching. Outside the curl the sheet swings about the bound edge.
export function createIssueLeaf({ book, width, depth, pageY }) {
  const sheet = new T.Group();
  sheet.name = 'Turning printed leaf';
  sheet.visible = false;
  book.add(sheet);
  const frontNormals = dynamic(count, 3);
  const faces = [T.FrontSide, T.BackSide].map(side => {
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', dynamic(count, 3));
    geometry.setAttribute('color', dynamic(count, 3));
    geometry.setAttribute('normal', frontNormals);
    const material = new T.MeshBasicMaterial({side, vertexColors:true, toneMapped:false, fog:false});
    const mesh = new T.Mesh(geometry, material);
    mesh.frustumCulled = false;
    sheet.add(mesh);
    return mesh;
  });
  faces[0].castShadow = true;
  faces[0].material.shadowSide = T.DoubleSide;
  const [front, back] = faces;
  const frontPos = front.geometry.attributes.position, backPos = back.geometry.attributes.position;
  const forwardIndices = indices(false), reverseIndices = indices(true);
  const rightUV = faceUV(true), leftUV = faceUV(false);
  const heights = Array.from({length:stride}, (_, i) => pageY(width * i / columns));
  const edge = [];
  for (let i = 0; i <= columns; i++) edge.push(i);
  for (let j = 1; j <= rows; j++) edge.push(j * stride + columns);
  for (let i = columns - 1; i >= 0; i--) edge.push(rows * stride + i);
  const rimGeometry = new T.BufferGeometry();
  const rimPos = dynamic(edge.length * 2, 3), edgeIndices = [];
  for (let i = 0; i < edge.length - 1; i++) {
    const a = i * 2;
    edgeIndices.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
  }
  rimGeometry.setAttribute('position', rimPos);
  rimGeometry.setIndex(edgeIndices);
  const rim = new T.Mesh(rimGeometry, new T.MeshBasicMaterial({side:T.DoubleSide, toneMapped:false, fog:false}));
  rim.frustumCulled = false;
  sheet.add(rim);
  let direction = 1, rigid = false;

  function setFaces(frontMap, backMap, options = {}) {
    direction = options.direction < 0 ? -1 : 1;
    rigid = Boolean(options.rigid);
    front.geometry.setAttribute('uv', direction > 0 ? rightUV : leftUV);
    back.geometry.setAttribute('uv', direction > 0 ? leftUV : rightUV);
    for (const mesh of faces) mesh.geometry.setIndex(direction > 0 ? forwardIndices : reverseIndices);
    for (const [mesh, ink] of [[front, frontMap], [back, backMap]]) {
      const material = mesh.material;
      if (Boolean(material.map) !== Boolean(ink)) material.needsUpdate = true;
      material.map = ink || null;
    }
    rim.material.color.set(rigid ? '#c5ac81' : '#e6d5b5');
    pose(0);
  }

  const defaultDiagonal = (p, corner) => rigid ? 0 : limit(corner, -1, 1) * (.50 - .09 * Math.sin(Math.PI * p));
  function shape(progress, corner, bend, diagonal = defaultDiagonal(progress, corner)) {
    const p = limit(progress, 0, 1);
    const angle = Math.PI * p, lifted = Math.sin(angle);
    const grip = limit(corner, -1, 1), lag = limit(bend, -1, 1);
    const nx = Math.cos(diagonal), nz = Math.sin(diagonal);
    const margin = width * (.045 + .19 * (1 - lifted) ** 2);
    // The curl starts clear of the spine even at the leading corner.
    const start = Math.abs(nz) * depth / 2 + margin;
    const sweep = rigid ? 0 : lifted * (2.63 - .38 * lag);
    const curvature = sweep / (width * nx - margin);
    const hinge = rigid ? angle : limit(angle - sweep * (.39 - .17 * Math.abs(grip)) - .16 * lag * lifted, 0, Math.PI);
    return { lifted, nx, nz, start, curvature, cosH:Math.cos(hinge), sinH:Math.sin(hinge) };
  }

  // The inverse grip and the rendered vertices use the exact same sheet.
  const sample = new T.Vector3();
  function materialPoint(form, u, z, restY) {
    const { lifted, nx, nz, start, curvature, cosH, sinH } = form;
    const run = Math.max(0, nx * u + nz * z - start);
    const curl = curvature * run;
    const shortening = curvature > .00001 ? Math.sin(curl) / curvature - run : 0;
    const lift = curvature > .00001 ? (1 - Math.cos(curl)) / curvature : 0;
    const flatX = u + nx * shortening;
    const x = direction * (flatX * cosH - lift * sinH);
    const paperHeight = heights[0] + (restY - heights[0]) * (1 - lifted);
    return sample.set(x, Math.max(pageY(Math.abs(x)), paperHeight + flatX * sinH + lift * cosH) + width * .0015, z + nz * shortening);
  }

  // Solve two screen-space constraints with two physical freedoms: how far the
  // leaf has turned, and the direction of its cylindrical curl. Its bound edge
  // and material lengths remain unchanged even when a corner is pulled diagonally.
  function pin(progress, corner, bend, grip, project, previous) {
    const u = limit(grip.u, 0, 1) * width, z = (limit(grip.v, 0, 1) - .5) * depth;
    const restY = pageY(u);
    const screen = (p, d) => project(materialPoint(shape(p, corner, bend, d), u, z, restY));
    let p = previous?.p ?? progress, d = previous?.d ?? defaultDiagonal(p, corner);
    let point = screen(p, d);
    for (let i = 0; i < 9; i++) {
      const ex = grip.x - point.x, ey = grip.y - point.y, distance = ex * ex + ey * ey;
      if (distance < .16) break;
      const dp = p < .998 ? .002 : -.002, dd = d < .797 ? .003 : -.003;
      const angleProbe = screen(p + dp, d), curlProbe = rigid ? point : screen(p, d + dd);
      const ax = (angleProbe.x - point.x) / dp, ay = (angleProbe.y - point.y) / dp;
      const cx = (curlProbe.x - point.x) / dd, cy = (curlProbe.y - point.y) / dd;
      const a = ax * ax + ay * ay + .4, b = ax * cx + ay * cy, c = cx * cx + cy * cy + 1;
      const e = ax * ex + ay * ey, f = cx * ex + cy * ey, det = a * c - b * b;
      const turn = limit((c * e - b * f) / det, -.22, .22);
      const tilt = limit((a * f - b * e) / det, -.32, .32);
      let improved = false;
      for (const step of [1, .5, .25]) {
        const nextP = limit(p + step * turn, .001, .999);
        const nextD = rigid ? 0 : limit(d + step * tilt, -.8, .8);
        const next = screen(nextP, nextD);
        if ((grip.x - next.x) ** 2 + (grip.y - next.y) ** 2 >= distance) continue;
        p = nextP; d = nextD; point = next; improved = true;
        break;
      }
      if (!improved) break;
    }
    return { p, d };
  }

  function pose(progress, corner = 0, bend = 0, diagonal) {
    const form = shape(progress, corner, bend, diagonal), lifted = form.lifted;
    const thickness = width * (rigid ? .003 : .0007);
    for (let j = 0; j <= rows; j++) {
      const z = (j / rows - .5) * depth;
      for (let i = 0; i <= columns; i++) {
        const k = j * stride + i, u = width * i / columns;
        const point = materialPoint(form, u, z, heights[i]);
        frontPos.setXYZ(k, point.x, point.y, point.z);
      }
    }
    front.geometry.computeVertexNormals();
    const frontInk = front.geometry.attributes.color, backInk = back.geometry.attributes.color;
    for (let k = 0; k < count; k++) {
      const x = frontPos.getX(k), y = frontPos.getY(k), z = frontPos.getZ(k);
      const dx = frontNormals.getX(k), dy = frontNormals.getY(k), dz = frontNormals.getZ(k);
      const half = k % stride ? thickness : 0;
      frontPos.setXYZ(k, x + dx * half, y + dy * half, z + dz * half);
      backPos.setXYZ(k, x - dx * half, y - dy * half, z - dz * half);
      const light = -.46 * dx + .83 * dy + .31 * dz;
      const edgeShade = .09 * (1 - Math.abs(dy));
      const frontValue = 1 - lifted * (.29 * (1 - Math.max(0, light)) + .15 * Math.max(0, -dy) + edgeShade);
      const backValue = 1 - lifted * (.29 * (1 - Math.max(0, -light)) + .15 * Math.max(0, dy) + edgeShade);
      frontInk.setXYZ(k, frontValue, frontValue, frontValue);
      backInk.setXYZ(k, backValue, backValue, backValue);
    }
    edge.forEach((k, i) => {
      rimPos.setXYZ(2 * i, frontPos.getX(k), frontPos.getY(k), frontPos.getZ(k));
      rimPos.setXYZ(2 * i + 1, backPos.getX(k), backPos.getY(k), backPos.getZ(k));
    });
    for (const attr of [frontPos, backPos, frontInk, backInk, rimPos]) attr.needsUpdate = true;
    sheet.visible = true;
  }
  function hide() {
    sheet.visible = false;
    for (const mesh of faces) {
      if (mesh.material.map) { mesh.material.map = null; mesh.material.needsUpdate = true; }
    }
  }
  return { setFaces, pose, pin, defaultDiagonal, hide };
}
