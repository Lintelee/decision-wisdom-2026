// Coordinates are on the printed 720 × 442 endpaper. The tea stays in one cup.
const radians = Math.PI / 180;
const mix = (a, b, t) => a + (b - a) * t;
const blend = (a, b, t) => a.map((v, i) => mix(v, b[i], t));
const smooth = x => x * x * (3 - 2 * x);
const clamp = x => Math.max(0, Math.min(1, x));
const n = x => x.toFixed(3);

function rotatePoint([x, y], degrees, cx = 0, cy = 0) {
  const a = degrees * radians, c = Math.cos(a), s = Math.sin(a);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
}
function guestPoint(point, lean) {
  const [x, y] = rotatePoint(point, lean, 0, 6);
  return [265 + x, 285 + y];
}

const saucer = [347, 220, 0], offer = [327, 241, -3];
const mouth = guestPoint(rotatePoint([31, -55], 6, 0, -47), 4);
const lip = rotatePoint([-9, -.6], -18);
const sip = [mouth[0] - lip[0], mouth[1] - lip[1], -18];
const opening = 1.05, period = 9.85;
// Maker = body x, body y, head angle, grip. Guest = lean, head angle, grip.
const poses = [
  { at: 0,    cup: saucer,          maker: [0,0,0,0],      guest: [0,0,0] },
  { at: .67,  cup: saucer,          maker: [-10,1,-5,1],   guest: [2,-2,0] },
  { at: 1.30, cup: [344,210,-4],    maker: [-17,-1,-5,1],  guest: [4,-5,.20] },
  { at: 2.04, cup: offer,           maker: [-28,5,-8,1],   guest: [8,1,1] },
  { at: 2.45, cup: offer,           maker: [-28,5,-8,1],   guest: [8,1,1] },
  { at: 2.85, cup: offer,           maker: [-18,2,-4,0],   guest: [8,1,1] },
  { at: 3.68, cup: sip,             maker: [-4,0,1,0],     guest: [4,6,1] },
  { at: 4.70, cup: sip,             maker: [-4,0,1,0],     guest: [4,6,1] },
  { at: 5.38, cup: [313,249,2],     maker: [-3,0,-4,0],    guest: [-2,-9,1] },
  { at: 6.10, cup: [313,249,2],     maker: [-3,0,-4,0],    guest: [-2,-9,1] },
  { at: 6.78, cup: [341,217,-3],    maker: [-8,1,-9,0],    guest: [8,-1,1] },
  { at: 7.08, cup: saucer,          maker: [-8,1,-9,0],    guest: [8,1,1] },
  { at: 7.40, cup: saucer,          maker: [-8,1,-9,0],    guest: [8,1,1] },
  { at: 8.12, cup: saucer,          maker: [-6,1,-12,0],   guest: [0,-4,0] },
  { at: 8.85, cup: saucer,          maker: [-3,0,5,0],     guest: [0,-4,0] },
  { at: period, cup: saucer,        maker: [0,0,0,0],      guest: [0,0,0] }
];

function arm(root, upperLength, lowerLength, bend) {
  const upper = root.querySelector('.upper'), lower = root.querySelector('.lower'), paw = root.querySelector('.paw');
  function segment(node, from, to, length) {
    const x = to[0] - from[0], y = to[1] - from[1];
    node.setAttribute('transform', 'translate(' + n(from[0]) + ' ' + n(from[1]) + ') rotate(' + n(Math.atan2(y, x)/radians) + ') scale(' + n(Math.hypot(x, y)/length) + ' 1)');
  }
  return (shoulder, wrist, angle) => {
    const dx = wrist[0] - shoulder[0], dy = wrist[1] - shoulder[1], d = Math.hypot(dx, dy) || 1;
    const along = (upperLength**2 - lowerLength**2 + d*d)/(2*d);
    const height = bend * Math.sqrt(Math.max(0, upperLength**2 - along**2));
    const elbow = [shoulder[0] + (along*dx - height*dy)/d, shoulder[1] + (along*dy + height*dx)/d];
    segment(upper, shoulder, elbow, upperLength);
    segment(lower, elbow, wrist, lowerLength);
    paw.setAttribute('transform', 'translate(' + n(wrist[0]) + ' ' + n(wrist[1]) + ') rotate(' + n(angle) + ')');
  };
}

export function bindFrontAnimation(dialog, svg, button) {
  const part = id => svg.querySelector('#fp-' + id);
  const makerBody = part('maker-body'), makerHead = part('maker-head');
  const guestBody = part('guest-body'), guestHead = part('guest-head');
  const serve = arm(part('maker-arm'), 30, 32, -1), reach = arm(part('guest-arm'), 26, 32, 1);
  const cup = part('tasting-cup'), shadow = part('cup-shadow');
  const street = part('near-street'), counter = part('counter-fold'), tree = part('tree-fold');
  const birds = [part('far-bird'), part('near-bird')], wings = svg.querySelector('.fp-wings');

  function spreadPiece(node, t, delay, x, y, shear) {
    const u = clamp((t - delay)/.72);
    const lift = 1 - (1-u)**3 + .12*Math.sin(2*Math.PI*u)*Math.sin(Math.PI*u);
    node.setAttribute('transform', 'translate(' + x + ' ' + y + ') skewX(' + n((1-lift)*shear) + ') scale(1 ' + n(.12+.88*lift) + ') translate(' + -x + ' ' + -y + ')');
  }
  let lastFold = -1;
  function draw(time) {
    const t = Math.max(0, time - opening) % period;
    const fold = Math.min(opening, time);
    if (fold !== lastFold) {
      spreadPiece(street, fold, 0, 200, 236, -14);
      spreadPiece(counter, fold, .09, 347, 292, 12);
      spreadPiece(tree, fold, .24, 571, 245, -18);
      lastFold = fold;
    }
    const i = poses.findIndex((p, j) => j && p.at >= t);
    const a = poses[i-1], b = poses[i], u = smooth((t-a.at)/(b.at-a.at));
    const [x,y,angle] = blend(a.cup,b.cup,u);
    const [mx,my,look,holding] = blend(a.maker,b.maker,u);
    const [lean,nod,receiving] = blend(a.guest,b.guest,u);
    makerBody.setAttribute('transform', 'translate(' + n(mx) + ' ' + n(my) + ')');
    makerHead.setAttribute('transform', 'rotate(' + n(look) + ' 1 2)');
    guestBody.setAttribute('transform', 'rotate(' + n(lean) + ' 0 6)');
    guestHead.setAttribute('transform', 'rotate(' + n(nod) + ' 0 -47)');
    cup.setAttribute('transform', 'translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(angle) + ')');
    const grip = offset => { const p = rotatePoint(offset, angle); return [x+p[0], y+p[1]]; };
    serve([407+mx,209+my], blend([378+mx,211+my],grip([11,4]),holding), angle*holding);
    reach(guestPoint([19,-42],lean), blend(guestPoint([38,-31],lean),grip([-10,5]),receiving), angle*receiving);
    shadow.setAttribute('opacity', n(.12+.45*(1-clamp(Math.hypot(x-saucer[0],y-saucer[1])/23))));

    // The birds re-enter behind the low shopfronts and disappear behind the awning.
    birds.forEach((bird, j) => {
      const phase = (time/(10.8+j*.95) + (j ? .38 : .27)) % 1;
      const x = 137 + 338*phase, y = 207 - 145*Math.sin(Math.PI*phase) - 34*phase - (j ? 0 : 6);
      const pitch = -20*Math.cos(Math.PI*phase), size = j ? .84 : .51;
      bird.setAttribute('transform','translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(pitch) + ') scale(' + size + ')');
    });
    wings.setAttribute('transform','scale(1 ' + n(.62+.38*Math.sin(time*6.6)) + ')');
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let elapsed = 0, previous = null, frame = 0, playing = false, manual = false;
  const posterTime = opening + 2.16;
  function defaultMotion() {
    if (reduce.matches || new URLSearchParams(location.search).has('still')) return false;
    try { return localStorage.getItem('decision-atlas-v1-motion') !== 'false'; }
    catch { return !document.documentElement.classList.contains('still'); }
  }
  function tick(now) {
    frame = 0;
    if (!dialog.open || document.hidden || !playing) return;
    if (previous === null) previous = now;
    if (now-previous >= 1000/45) {
      elapsed += Math.min(.12,(now-previous)/1000);
      previous = now;
      draw(elapsed);
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = null;
    const running = playing && dialog.open && !document.hidden;
    dialog.toggleAttribute('data-cover-playing', running);
    button.dataset.action = playing ? 'pause' : 'play';
    button.title = playing ? '暫停封面動畫' : '播放封面動畫';
    button.setAttribute('aria-label', button.title);
    if (running) frame = requestAnimationFrame(tick);
  }
  function open() {
    playing = defaultMotion(); manual = false;
    elapsed = playing ? 0 : posterTime;
    draw(elapsed); sync();
  }
  button.hidden = false;
  button.addEventListener('click', () => { manual = true; playing = !playing; sync(); });
  reduce.addEventListener('change', () => { if (!manual || reduce.matches) open(); });
  document.addEventListener('folio-front-show', open);
  document.addEventListener('folio-front-hide', sync);
  document.addEventListener('visibilitychange', sync);
  open();
}
