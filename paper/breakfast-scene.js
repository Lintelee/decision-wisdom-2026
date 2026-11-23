/* The ferry order has a master slip and a carbon copy for each trial delivery. */
(() => {
  'use strict';
  const K = window.PaperKit;
  function paper(parent, outline, ink, x = 0, y = 0, z = 0, depth = 0.014, edge = '#d6c8ad') {
    return K.at(parent, K.cut(outline, depth, ink, edge), x, y, z);
  }
  function stroke(parent, a, b, width, ink) {
    parent.add(K.rod(a, b, width, ink));
  }
  function oval(parent, x, y, z, rx, ry, color, angles = 14) {
    const pts = Array.from({ length: angles }, (_, i) => {
      const t = (i / angles) * Math.PI * 2;
      return [Math.cos(t) * rx, Math.sin(t) * ry];
    });
    return paper(parent, pts, color, x, y, z, 0.008, color);
  }
  let driedBroth;
  function brothPrint() {
    if (!driedBroth) {
      const canvas = document.createElement('canvas');
      canvas.width = 228;
      canvas.height = 176;
      const ctx = canvas.getContext('2d'),
        mark = new Path2D();
      let seed = 31527;
      const rand = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
      for (let i = 0; i < 96; i++) {
        const a = (i * Math.PI) / 48,
          edge =
            1 +
            0.13 * Math.sin(3 * a + 0.2) +
            0.09 * Math.cos(a * 5.0) +
            0.04 * Math.sin(a * 11) +
            0.024 * rand();
        const x = 135 + 64 * edge * Math.cos(a),
          y = 74 + 45 * edge * Math.sin(a);
        if (!i) mark.moveTo(x, y);
        else mark.lineTo(x, y);
      }
      mark.closePath();
      ctx.fillStyle = 'rgba(184,87,24,.56)';
      ctx.fill(mark);
      ctx.save();
      ctx.clip(mark);
      ctx.strokeStyle = 'rgba(130,53,20,.72)';
      ctx.lineWidth = 6;
      ctx.stroke(mark);
      for (let i = 0; i < 940; i++) {
        ctx.fillStyle = i % 4 ? 'rgba(173,85,31,.12)' : 'rgba(126,71,41,.25)';
        ctx.fillRect(58 + rand() * 153, 14 + rand() * 123, 0.6 + rand() * 1.7, 0.7 + rand() * 1.6);
      }
      ctx.restore();
      for (const [x, y, r] of [
        [61, 106, 6],
        [40, 131, 4],
        [71, 119, 2.7],
        [106, 135, 3.7],
        [27, 126, 1.9],
        [75, 35, 2.2],
      ]) {
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.72, -0.65, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(158,74,24,.71)';
        ctx.fill();
      }
      const map = new THREE.CanvasTexture(canvas);
      map.colorSpace = THREE.SRGBColorSpace;
      driedBroth = new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      });
    }
    const pigment = new THREE.Mesh(new THREE.PlaneGeometry(0.61, 0.445), driedBroth);
    pigment.renderOrder = 2;
    return pigment;
  }
  const printRuns = new Map();
  function stampNumber(ctx, text, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(19, 22, 94, 74);
    ctx.fillStyle = '#fff2d2';
    ctx.font = 'bold 53px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, 66, 77, 84);
    ctx.restore();
  }
  function docketInk(run, trip = 2) {
    const number = Math.max(2, Number.isSafeInteger(trip) ? trip : 2);
    const existing = printRuns.get(run);
    if (existing) {
      // Both copies of the latest trip use the same canvas. Only the number block is re-inked.
      if (run === 'trial' && existing.userData.trip !== number) {
        stampNumber(existing.map.image.getContext('2d'), String(number).padStart(2, '0'), '#924431');
        existing.userData.trip = number;
        existing.map.needsUpdate = true;
      }
      return existing;
    }
    const master = run === 'order',
      canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 260;
    const ctx = canvas.getContext('2d');
    const ink = '#503d38',
      red = '#924431';
    stampNumber(
      ctx,
      master ? '6' : run === 'trial' ? String(number).padStart(2, '0') : '01',
      master ? '#45625c' : red,
    );
    ctx.textAlign = 'left';
    ctx.fillStyle = ink;
    ctx.font = 'bold 51px "Songti TC","Noto Serif TC","PingFang TC",serif';
    ctx.fillText(master ? '訂購單' : '送餐單', 126, 77);
    ctx.fillStyle = '#a88b71';
    ctx.fillRect(18, 106, 458, 3);
    ctx.fillStyle = '#736350';
    ctx.font = 'bold 26px "PingFang TC",sans-serif';
    ctx.fillText('早班船', 22, 150);
    ctx.fillText('熱湯', 22, 196);
    ctx.fillStyle = '#856c55';
    ctx.font = '24px Georgia,serif';
    ctx.fillText(master ? '× 6' : '× 1', 113, 196);
    ctx.strokeStyle = '#bba183';
    ctx.lineWidth = 1.5;
    for (const y of [161, 206]) {
      ctx.beginPath();
      ctx.moveTo(18, y);
      ctx.lineTo(275, y);
      ctx.stroke();
    }
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(18, 228);
    ctx.lineTo(480, 228);
    ctx.stroke();
    ctx.fillStyle = '#bfa88b';
    for (let i = 0; i < 12; i++) ctx.fillRect(20 + i * 4, 236, 2 + (i % 2), 9);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.035,
      depthWrite: false,
      toneMapped: false,
    });
    material.userData.trip = run === 'trial' ? number : 1;
    printRuns.set(run, material);
    return material;
  }
  function deliverySlip(run = 'first') {
    const root = K.group(),
      stock = K.group(),
      stain = K.group();
    const edge = [
      [-0.52, -0.315],
      [0.495, -0.314],
      [0.525, -0.269],
      [0.525, 0.226],
      [0.448, 0.304],
      [-0.516, 0.3],
    ];
    const carbon = paper(stock, edge, '#bcbaab', 0.013, -0.045, -0.035, 0.029, '#aa9b83');
    carbon.rotation.z = 0.027;
    const copy = paper(stock, edge, '#ddbe8f', -0.014, -0.023, -0.016, 0.021, '#b39473');
    copy.rotation.z = -0.017;
    paper(stock, edge, '#fff0cb', 0, 0, 0.007, 0.034, '#cbb38f');
    paper(
      stock,
      [
        [0.448, 0.304],
        [0.525, 0.226],
        [0.45, 0.226],
      ],
      '#e2c7a0',
      0,
      0,
      0.03,
      0.008,
    );
    for (let i = 0; i < 6; i++) oval(stock, -0.455 + i * 0.121, 0.273, 0.034, 0.011, 0.011, '#ae987e', 8);
    K.assembled(stock, 'breakfast-delivery-docket');
    root.add(stock);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.01, 0.54), docketInk(run));
    face.renderOrder = 1;
    K.at(root, face, -0.01, -0.012, 0.037);
    stain.add(brothPrint());
    K.at(root, stain, 0.212, -0.04, 0.048);
    return {
      root,
      run(value, trip) {
        face.material = docketInk(value, trip);
      },
      ink(value) {
        stain.visible = value > 0.005;
        const size = Math.sqrt(Math.max(0, value));
        stain.scale.set(size, size, 1);
      },
    };
  }
  function courier() {
    const root = K.group(),
      body = K.group(),
      wing = K.group();
    const cut = (shape, ink, z = 0, dep = 0.02) => paper(body, shape, ink, 0, 0, z, dep);
    for (const x of [-0.13, 0.07]) {
      stroke(body, [x, 0.15, 0], [x - 0.025, 0.028, 0.006], 0.015, '#8f503d');
      stroke(body, [x - 0.025, 0.028, 0.006], [x + 0.065, 0.008, 0.045], 0.014, '#a15d41');
    }
    cut(
      [
        [-0.255, 0.43],
        [-0.61, 0.373],
        [-0.57, 0.27],
        [-0.25, 0.244],
        [-0.08, 0.41],
      ],
      '#246474',
      -0.024,
    );
    cut(
      [
        [-0.25, 0.386],
        [-0.56, 0.29],
        [-0.48, 0.218],
        [-0.174, 0.273],
      ],
      '#347d84',
      0.005,
    );
    cut(
      [
        [-0.39, 0.36],
        [-0.245, 0.583],
        [-0.04, 0.613],
        [0.13, 0.53],
        [0.172, 0.383],
        [-0.006, 0.138],
        [-0.188, 0.108],
        [-0.32, 0.225],
      ],
      '#c97643',
      0,
      0.112,
    );
    cut(
      [
        [-0.36, 0.37],
        [-0.21, 0.6],
        [-0.035, 0.606],
        [0.08, 0.49],
        [-0.084, 0.355],
        [-0.24, 0.24],
      ],
      '#337887',
      0.054,
    );
    cut(
      [
        [-0.094, 0.541],
        [-0.042, 0.741],
        [0.083, 0.862],
        [0.239, 0.852],
        [0.364, 0.737],
        [0.367, 0.589],
        [0.244, 0.479],
        [0.067, 0.453],
      ],
      '#27717b',
      0.018,
      0.107,
    );
    cut(
      [
        [-0.066, 0.71],
        [0.072, 0.879],
        [0.24, 0.863],
        [0.317, 0.792],
        [0.09, 0.783],
      ],
      '#5ab6b0',
      0.081,
    );
    cut(
      [
        [0.015, 0.58],
        [0.103, 0.72],
        [0.279, 0.75],
        [0.354, 0.684],
        [0.255, 0.559],
        [0.162, 0.497],
      ],
      '#d58b50',
      0.083,
    );
    cut(
      [
        [0.113, 0.516],
        [0.247, 0.61],
        [0.36, 0.608],
        [0.241, 0.48],
        [0.102, 0.465],
      ],
      '#f6dfac',
      0.092,
    );
    cut(
      [
        [0.29, 0.696],
        [0.664, 0.652],
        [0.348, 0.602],
      ],
      '#27363e',
      0.081,
      0.036,
    );
    cut(
      [
        [0.352, 0.608],
        [0.662, 0.651],
        [0.432, 0.62],
      ],
      '#b28159',
      0.106,
      0.009,
    );
    oval(body, 0.254, 0.707, 0.111, 0.036, 0.038, '#202e34');
    oval(body, 0.265, 0.719, 0.124, 0.009, 0.009, '#ffefbb', 8);
    for (let i = 0; i < 4; i++) oval(body, 0.038 + i * 0.048, 0.804, 0.104, 0.014, 0.008, '#c3ded0', 8);
    K.assembled(body, 'breakfast-kingfisher-body');
    root.add(body);
    paper(
      wing,
      [
        [0.06, 0.06],
        [-0.068, 0.138],
        [-0.22, 0.103],
        [-0.432, -0.143],
        [-0.25, -0.14],
        [-0.076, -0.079],
      ],
      '#286474',
    );
    paper(
      wing,
      [
        [-0.063, 0.117],
        [-0.2, 0.083],
        [-0.407, -0.123],
        [-0.26, -0.077],
        [-0.105, 0.03],
      ],
      '#65b7ab',
      0,
      0,
      0.018,
    );
    for (let i = 0; i < 3; i++)
      stroke(wing, [-0.17 + i * 0.048, 0.029, 0.036], [-0.31 + i * 0.062, -0.097, 0.036], 0.007, '#8bc5b7');
    K.assembled(wing, 'breakfast-kingfisher-wing');
    K.at(root, wing, -0.06, 0.418, 0.12);
    const message = deliverySlip('order');
    message.ink(0);
    message.root.scale.setScalar(0.29);
    K.at(root, message.root, 0.496, 0.545, 0.101);
    message.root.rotation.z = -0.2;
    return { root, wing, order: message.root };
  }
  function peg(s, x, z, angle) {
    const stand = K.group();
    const color = '#927859';
    K.at(stand, K.box(0.56, 0.035, 0.22, '#b7a085'), 0, 0.023, 0.019);
    for (const k of [-0.18, 0.18]) K.at(stand, K.box(0.042, 0.32, 0.048, color), k, 0.174, -0.035);
    K.at(stand, K.box(0.62, 0.062, 0.089, '#8d6751'), 0, 0.32, 0.005);
    stand.rotation.y = angle;
    s.place(stand, x, z, 0.178);
  }
  window.AtlasSets.growth = function (s) {
    const quay = window.BreakfastQuay.build(s),
      bike = window.BreakfastBike.create();
    const carrier = s.place(K.group(), 1.86, 1.08, 0.185),
      body = K.at(carrier, bike.root, 0, 0, 0);
    const narrow = matchMedia('(max-width: 650px) and (orientation: portrait)');
    const bird = courier();
    K.at(body, bird.root, 0.335, 1.526, -0.025);
    bird.root.scale.setScalar(0.86);
    // The bicycle faces the wharf. Keep the lettering on the bird's order right-reading.
    bird.order.scale.x *= -1;
    const first = deliverySlip('first'),
      second = deliverySlip('trial'),
      carried = deliverySlip('first');
    const targets = [
      [-1.04, 0.56, 1.92, -0.105],
      [0.075, 0.55, 1.91, 0.1],
    ];
    for (const [i, letter] of [first, second].entries()) {
      const [x, y, z, a] = targets[i];
      peg(s, x, z - 0.13, a);
      s.place(letter.root, x, z, y);
      letter.root.scale.setScalar(0.95);
      letter.root.rotation.set(-0.26, a, i === 0 ? -0.085 : 0.052);
    }
    const post = s.place(K.group(), 0.58, 1.46, 0.18);
    post.add(carried.root);
    // The first anchor for each action is the keyboard/touch overlay. Ray hits cover the full physical object.
    s.hot(bike.sleeve, 'breakfast:sleeve', '扶穩湯杯的紙托', [0, 0.075, -0.06], 'lift');
    s.hot(bike.basket, 'breakfast:sleeve', '扶穩車籃裡的湯杯', [1.035, 1.41, 0.19], 'lift');
    s.hot(quay.batch, 'breakfast:order', '早班船的六杯熱湯訂單', [0, 0.25, 0.08]);
    s.hot(quay.customer, 'breakfast:customer', '收湯的早班船員', [0.021, 1.28, 0.137]);
    s.hot(quay.crewBag, 'breakfast:order', '船員取餐用的紙袋', [0.152, 0.44, 0.184]);
    s.hot(quay.vendor, 'breakfast:vendor', '備好六杯熱湯的攤主', [0.017, 0.851, 0.13]);
    s.hot(quay.ferry, 'breakfast:ferry', '早班渡輪的汽笛', [-0.28, 0.79, 0.05]);
    s.hot(quay.water, 'breakfast:water', '港池裡的銀魚', [-0.16, 0.019, 0.056]);
    s.hot(first.root, 'breakfast:first', '第一次試送的送餐單', [0, 0, 0.04]);
    s.hot(second.root, 'breakfast:trial', '這次試送的送餐單', [0, 0, 0.04]);
    s.hot(carried.root, 'breakfast:carried', '跟著試送的送餐單', [0, 0, 0.04]);
    s.hot(bird.order, 'breakfast:beak', '翠鳥叼著的早餐訂單', [-0.2, 0.04, 0.06]);
    s.hot(bike.bell, 'breakfast:bell', '車鈴', [0, 0, 0]);
    s.hot(bird.root, 'breakfast:bird', '送餐的翠鳥', [0, 0.54, 0.08]);
    s.hot(quay.awning, 'breakfast:awning', '留著雨珠的攤篷', [0, -0.05, 0.26]);
    const threshold = K.group();
    for (const [x, y, angle, h] of [
      [-0.19, 0.035, 0.49, 0.2],
      [-0.078, 0.074, 0.13, 0.27],
      [0.071, 0.044, -0.39, 0.21],
    ]) {
      const ray = paper(
        threshold,
        [
          [-0.02, 0],
          [0.018, 0],
          [0.007, h],
          [-0.007, h],
        ],
        '#f8d08e',
        x,
        y,
        0,
        0.016,
        '#ad633e',
      );
      ray.rotation.z = angle;
    }
    K.assembled(threshold, 'breakfast-front-wheel-jolt');
    s.place(threshold, -0.7, 1.32, 0.195);
    const atWheel = 1.06,
      crack = -0.7,
      frontAxle = 0.77;
    const shipward = (crack - atWheel) / 0.65;
    const start = new THREE.Vector3(),
      dock = new THREE.Vector3(),
      grip = new THREE.Vector3();
    function relativePoint(node, x, y, z, frame, output) {
      node.localToWorld(output.set(x, y, z));
      return frame.worldToLocal(output);
    }
    function tick(time) {
      const p = window.BreakfastStory.pose,
        phase = p.phase || (p.first ? 'ready' : 'invited');
      const size = narrow.matches ? 1.13 : 1;
      const response = p.response ?? (p.first ? (p.trial && !p.stain ? 1 : -1) : 0);
      const received = Math.max(0, response);
      const riding = phase === 'opening' || phase === 'riding';
      quay.set({
        phase,
        response,
        whistle: p.whistle || 0,
        ripple: p.ripple || 0,
        greeting: p.greeting,
        greet: p.greet,
        copy: p.copy,
        rain: p.rain,
        inspect: p.paper === 'order' ? p.inspect : 0,
        time,
        motion: p.motion,
      });
      body.scale.set(-size, size, size);
      body.position.set(
        atWheel + frontAxle * size - carrier.position.x + shipward * p.travel,
        p.bump,
        narrow.matches ? 0.13 : 0,
      );
      body.rotation.z = -0.13 * p.bump;
      const beckon =
        p.motion && !p.carry && !p.trial && !p.support ? 0.075 * Math.max(0, Math.sin(time * 2.6)) ** 4 : 0;
      const loading = 1 - (p.load ?? 1);
      bike.set({
        support: p.support + beckon,
        tilt: p.tilt,
        spin: p.spin,
        spill: p.spill,
        load: p.load ?? 1,
        time,
      });
      // One actual soup cup crosses the gap from the basket into the deckhand's open palm.
      // Both parents can be on different folding leaves. Resolve their current transforms.
      if (received > 0) {
        relativePoint(quay.crewPalm, 0.055, 0.014, 0.041, bike.cup.parent, grip);
        bike.cup.position.lerp(grip, received);
        bike.cup.position.y += 0.16 * Math.sin(received * Math.PI);
      }
      bike.cup.scale.setScalar(1 - 0.14 * received);
      bike.cup.userData.paperHotspot = received > 0.85 ? quay.customer.userData.paperHotspot : null;
      const impact = p.impact || 0;
      threshold.visible = impact > 0.015;
      threshold.scale.set(1 + 0.13 * impact, Math.max(0.02, impact), 1);
      bike.bell.rotation.z = p.bellBeat * Math.sin(p.birdBeat * Math.PI * 8) * 0.32;
      // The courier waits over the basket with the order, then flies out ahead of the front wheel.
      const guide = riding && p.beat !== 'fold' ? Math.sin(Math.PI * p.travel) : 0;
      bird.root.position.set(
        0.335 + 0.4 * p.flight + 0.17 * Math.sin(2 * Math.PI * p.birdBeat) + 0.95 * guide - 0.12 * loading,
        1.526 + 0.66 * p.flight + 0.59 * guide + 0.28 * p.bump + 0.32 * loading,
        -0.025 + 0.065 * p.flight - 0.075 * guide,
      );
      bird.root.rotation.z = 0.15 * p.flight + 0.09 * guide + (p.motion ? 0.028 * Math.sin(time * 1.85) : 0);
      bird.wing.rotation.z =
        p.flight * (0.28 + 0.58 * Math.sin(p.birdBeat * 5 * Math.PI)) +
        guide * (0.32 + 0.59 * Math.sin(11 * time));
      const inspect = p.inspect || 0;
      for (const [i, letter] of [first, second].entries()) {
        const lift = p.paper === 'compare' || p.paper === (i === 0 ? 'first' : 'trial') ? inspect : 0;
        // The deckhand holds the actual wet slip up to the rider. It is filed on a peg for comparison.
        const firstInHand =
          phase === 'opening' || phase === 'ready' || (phase === 'folding' && !p.trial)
            ? 1
            : phase === 'riding' && p.beat === 'fold'
              ? p.travel
              : 0;
        const inHand = p.paper === 'compare' ? 0 : i === 0 ? firstInHand : p.stain > 0.005 ? 1 : 0;
        const [atX, atY, atZ] = targets[i];
        letter.root.position.set(atX, atY, atZ);
        if (inHand) {
          relativePoint(quay.crewPalm, 0, 0, 0.061, letter.root.parent, grip);
          grip.x += 0.245;
          grip.y -= 0.105;
          grip.z += 0.02;
          letter.root.position.lerp(grip, inHand);
        }
        letter.root.position.y += 0.16 * lift;
        letter.root.scale.setScalar(0.89 - 0.22 * inHand + 0.095 * lift);
        letter.root.rotation.x = -0.26 - 0.17 * lift;
        letter.root.rotation.z = (i === 0 ? -0.085 : 0.052) + (i === 0 ? 0.11 : -0.1) * lift;
      }
      first.root.visible = !!p.first;
      first.ink(1);
      second.root.visible = !!p.trial;
      if (p.trial) second.run('trial', p.trialNo);
      second.ink(p.stain);
      carried.root.visible = p.carry;
      if (p.carry) {
        carried.run(p.delivery, p.trialNo);
        const f = p.transfer,
          delivered = p.delivery === 'first' ? first : second;
        relativePoint(body, 1.285, 1.4, 0.385, post, start);
        relativePoint(delivered.root, 0, 0, 0, post, dock);
        carried.root.position.copy(start).lerp(dock, f);
        carried.root.position.y += 0.22 * Math.sin(f * Math.PI);
        carried.root.scale.setScalar(0.46 * size * (1 - f) + delivered.root.scale.x * f);
        carried.root.rotation.set(
          -0.16 * (1 - f) + delivered.root.rotation.x * f,
          0.05 * (1 - f) + delivered.root.rotation.y * f,
          0.19 * (1 - f) + delivered.root.rotation.z * f,
        );
        carried.ink(p.carriedStain);
      }
    }
    tick(0);
    return { tick };
  };
})();
