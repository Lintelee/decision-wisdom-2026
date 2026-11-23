/* Printed terrain on a single sheet. Both leaves sample the same drawing at the gutter. */
(() => {
  'use strict';
  // The three section colours follow the issue's printed opening spreads, pp. 18, 94 and 150.
  const inks = [
    ['#baaaaa', '#77859b', '#918396', '#dac2a3', 'HARBOUR AT DAWN / 01'],
    ['#c2bbb2', '#93a7ad', '#889787', '#e1d5ca', 'FIELD INTERVIEW / 02'],
    ['#adb67c', '#a1bc7a', '#717e4b', '#e6d5a2', 'EVIDENCE / PEOPLE'],
    ['#bdc78b', '#bc977a', '#8ca457', '#e5dca9', 'SHARED MEMORY / PEOPLE'],
    ['#e3c4c6', '#c795a5', '#a6838f', '#f1dad7', 'AUDIENCE LAB / MODEL'],
    ['#dec4ba', '#bd9aa4', '#a78791', '#f5ded0', 'CHOICE LAB / MODEL'],
    ['#accaCA', '#83b6c3', '#829b9e', '#d6e6da', 'SERVICE FLOW / AI'],
    ['#a9c8ce', '#72afba', '#859fae', '#d7e3db', 'AGENT SIGNAL / AI'],
    ['#bdc9d4', '#83adb9', '#8793a5', '#d8dfe3', 'AUTHORIZATION / AI'],
  ];
  function random(seed) {
    return () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  }
  function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }
  function texture(c) {
    const map = new THREE.CanvasTexture(c);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }
  function outline(ctx, points, fill, stroke, width = 1) {
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke();
    }
  }
  function curve(ctx, d, ink, width, dash = []) {
    ctx.lineWidth = width;
    ctx.strokeStyle = ink;
    ctx.setLineDash(dash);
    ctx.stroke(new Path2D(d));
    ctx.setLineDash([]);
  }
  function sheet(index) {
    const w = 1400,
      h = 868,
      c = canvas(w, h),
      ctx = c.getContext('2d'),
      rng = random(19107 + index);
    const [field, water, grass, path, name] = inks[index];
    const paper = ctx.createLinearGradient(0, 0, w, h);
    paper.addColorStop(0, '#efecdf');
    paper.addColorStop(0.53, '#fbf7e9');
    paper.addColorStop(1, '#e6dfce');
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, w, h);
    // A cut field with the unprinted paper margin and registration lines visible around it.
    const silhouette = [
      [57, 54],
      [223, 43],
      [379, 54],
      [580, 40],
      [696, 47],
      [856, 40],
      [1033, 61],
      [1223, 46],
      [1344, 61],
      [1349, 185],
      [1336, 249],
      [1359, 355],
      [1345, 511],
      [1353, 641],
      [1329, 753],
      [1257, 774],
      [1113, 763],
      [975, 786],
      [843, 770],
      [700, 792],
      [572, 775],
      [426, 789],
      [318, 767],
      [189, 776],
      [76, 748],
      [52, 675],
      [67, 541],
      [41, 436],
      [60, 297],
      [50, 165],
    ];
    ctx.save();
    outline(ctx, silhouette, field, '#9fa084', 1.5);
    ctx.clip();
    // Cut edges on the perimeter read as layers of stock in a close view.
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#f9e8ba4f';
    ctx.stroke();
    if ([0, 2, 3].includes(index)) {
      const bank = new Path2D('M0 0H1400V188Q1120 230 872 160T378 200Q155 188 0 278Z');
      ctx.fillStyle = grass;
      ctx.fill(bank);
      for (let i = 0; i < 5; i++)
        curve(
          ctx,
          'M-15 ' +
            (170 + i * 10) +
            ' Q220 ' +
            (100 + i * 8) +
            ' 434 ' +
            (150 + i * 8) +
            ' T850 ' +
            (144 + i * 8) +
            ' T1460 ' +
            (128 + i * 8),
          '#506e5c3e',
          1.1,
        );
    }
    if (index === 0) {
      const estuary = new Path2D('M0 250C180 187 356 270 455 328C567 394 716 350 731 462S505 639 508 810H0Z');
      ctx.fillStyle = water;
      ctx.fill(estuary);
      ctx.save();
      ctx.clip(estuary);
      for (let i = 0; i < 200; i++) {
        const x = rng() * 760,
          y = 165 + rng() * 620,
          l = 9 + rng() * 35;
        curve(
          ctx,
          'M' + x + ' ' + y + 'q' + l * 0.5 + ' ' + (2 + rng() * 3) + ' ' + l + ' -1',
          i % 5 ? '#e0e3c092' : '#456e6b62',
          i % 5 ? 2 : 1,
        );
      }
      ctx.restore();
      ctx.strokeStyle = '#e9d9ad';
      ctx.lineWidth = 6;
      ctx.stroke(estuary);
      curve(ctx, 'M490 803C538 710 582 596 790 544S1001 419 1243 368', path, 42);
    } else if (index === 2) {
      curve(ctx, 'M-10 665C202 656 303 425 514 487S805 602 974 412S1212 362 1433 395', path, 78);
      curve(ctx, 'M-10 665C202 656 303 425 514 487S805 602 974 412S1212 362 1433 395', '#af80575e', 2, [10, 8]);
    } else if (index === 3) {
      const diamond = [
        [710, 700],
        [358, 429],
        [701, 205],
        [1061, 429],
      ];
      outline(ctx, diamond, '#bc946c', '#e0c397', 4);
      outline(
        ctx,
        [
          [710, 655],
          [424, 430],
          [702, 250],
          [991, 430],
        ],
        grass,
      );
      curve(ctx, 'M415 429L708 663 1000 430', '#efe6bd', 5);
      curve(ctx, 'M354 477L711 753 1060 477', '#f2deae', 3);
    } else {
      ctx.strokeStyle = '#6d82753c';
      ctx.lineWidth = 1.2;
      for (let j = 0; j < 19; j++) {
        let y = 50 + j * 46;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y + 4);
        ctx.stroke();
        for (let i = -1; i < 18; i++) {
          let x = i * 90 + (j % 2) * 45;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 3, y + 46);
          ctx.stroke();
        }
      }
      if (index === 1 || index === 7) {
        const y = index === 1 ? 530 : 610;
        for (let x = -10; x < w; x += 30) {
          ctx.fillStyle = '#927d63';
          ctx.fillRect(x, y - 14, 9, 67);
        }
        for (const off of [0, 43]) {
          ctx.fillStyle = '#626c60';
          ctx.fillRect(0, y + off, w, 5);
          ctx.fillStyle = '#d1c8a7';
          ctx.fillRect(0, y + off, w, 2);
        }
        curve(ctx, 'M0 ' + (y - 58) + 'L1400 ' + (y - 58), path, 8, [21, 9]);
      } else {
        curve(ctx, 'M-50 700Q345 579 627 647T1127 515Q1255 424 1420 464', path, 55);
        curve(ctx, 'M-50 700Q345 579 627 647T1127 515Q1255 424 1420 464', '#a3947575', 1.5, [8, 10]);
      }
    }
    if (index === 4 || index === 5) {
      // Crosshairs and calibration ticks keep the experiment on a visible measuring surface.
      ctx.strokeStyle = '#87596c62';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = 72; x < w; x += 50)
        for (let y = 58; y < h; y += 50) {
          ctx.moveTo(x - 4, y);
          ctx.lineTo(x + 4, y);
          ctx.moveTo(x, y - 4);
          ctx.lineTo(x, y + 4);
        }
      ctx.stroke();
      for (let x = 76; x < 1310; x += 12) ctx.fillRect(x, 76, 1, x % 36 === 4 ? 15 : 6);
    }
    if (index >= 6) {
      const route = [
        'M30 663H255L315 603H570L630 545H1140L1210 475H1380',
        'M20 710H285L344 651H590L652 590H1160L1230 521H1380',
      ];
      route.forEach((d) => curve(ctx, d, '#35758392', 3));
      for (const [x, y] of [
        [255, 663],
        [630, 545],
        [1210, 475],
        [345, 651],
        [1160, 590],
      ]) {
        ctx.fillStyle = '#336672';
        ctx.fillRect(x - 5, y - 5, 10, 10);
        ctx.fillStyle = '#b9eef1';
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }
    // Short ink marks and long fibres stay subtle underneath the raised illustrations.
    for (let i = 0; i < 620; i++) {
      const x = rng() * w,
        y = rng() * h;
      ctx.strokeStyle = i % 2 ? '#f2edcb43' : '#4c645738';
      ctx.lineWidth = 0.7 + rng() * 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 2 + rng() * 9, y - rng() * 2);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = '#8a81632c';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(24, 23, w - 48, h - 46);
    ctx.fillStyle = [
      '#b7a6ce',
      '#b7a6ce',
      '#c1d760',
      '#c1d760',
      '#edbabc',
      '#edbabc',
      '#76c9da',
      '#76c9da',
      '#76c9da',
    ][index];
    ctx.fillRect(32, h - 47, 21, 14);
    ctx.fillStyle = '#485055';
    ctx.font = '600 16px monospace';
    ctx.fillText(name.split('').join(' '), 70, 829);
    ctx.textAlign = 'right';
    ctx.fillText('F O L I O   ' + String(index + 1).padStart(2, '0'), 1333, 829);
    for (let i = 0; i < 4900; i++) {
      ctx.fillStyle = i % 3 ? 'rgba(97,76,49,.085)' : 'rgba(255,255,239,.23)';
      ctx.fillRect(rng() * w, rng() * h, 0.65 + rng() * 1.2, 0.65 + rng() * 0.8);
    }
    const gutter = ctx.createLinearGradient(w * 0.47, 0, w * 0.53, 0);
    gutter.addColorStop(0, '#4f523b00');
    gutter.addColorStop(0.46, '#655b453d');
    gutter.addColorStop(0.5, '#514c3c61');
    gutter.addColorStop(0.55, '#efe6bc10');
    gutter.addColorStop(1, '#464b3400');
    ctx.fillStyle = gutter;
    ctx.fillRect(w * 0.47, 0, w * 0.06, h);
    return texture(c);
  }
  window.AtlasStock = { sheet };
})();
