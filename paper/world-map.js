(() => {
  'use strict';
  const T = window.THREE,
    terrain = window.AtlasTerrain,
    { lands, stops } = terrain;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const pad = (n) => String(n + 1).padStart(2, '0');
  const ns = 'http://www.w3.org/2000/svg';
  const directions = {
    arrowup: [0, -1],
    w: [0, -1],
    arrowdown: [0, 1],
    s: [0, 1],
    arrowleft: [-1, 0],
    a: [-1, 0],
    arrowright: [1, 0],
    d: [1, 0],
  };
  function mount(host, options) {
    const {
      items,
      regions,
      staging,
      editorial,
      completed,
      onVisit,
      onClose,
      onRead,
      onCredits,
      onMotion,
      onSound,
    } = options;
    let motion = options.motion,
      sound = options.sound,
      selected = options.current,
      parked = selected;
    let alive = true,
      full = innerWidth > 680,
      currentZoom = 1,
      zoom = 1,
      frame = 0,
      prev = 0,
      time = 0,
      dirty = true,
      orbitDrag = null,
      path = [],
      wp = 0,
      traveling = false,
      menuOpen = false,
      angle = 0;
    let cameraMix = full ? 0 : 1,
      lockOverview = false;
    const controller = new AbortController(),
      listen = (el, name, fn, opt = {}) => el.addEventListener(name, fn, { ...opt, signal: controller.signal });
    host.innerHTML = `<section class="wm" aria-label="決策群島選關地圖"><header class="wm-head"><div class="wm-title"><span>決策智慧 2026</span><h2>決策群島</h2></div><nav class="wm-regions" aria-label="選擇主題領域"></nav><button class="wm-leave" type="button" aria-label="收起地圖，回到書頁">回到書頁</button></header>
      <div class="wm-view" tabindex="0" aria-label="採訪車地圖。按方向鍵自由行車，或點選站旗，按 Enter 進入。"><canvas class="wm-canvas" aria-hidden="true"></canvas><svg class="wm-fallback" aria-hidden="true" hidden></svg><div class="wm-points"></div><button type="button" class="wm-arrival" hidden><small></small><strong></strong></button><span class="wm-driving-hint">點站旗前往，按住地面自由開車</span><div class="wm-zoom"><button type="button" data-map="overview">全圖</button><button type="button" data-map="follow">跟車</button></div></div>
      <div class="wm-dock" aria-live="polite"><div class="wm-ticket"><b class="wm-stamp"></b><div><span class="wm-region"></span><h3></h3></div></div><p class="wm-prompt"></p><button type="button" class="wm-enter">打開這一頁</button></div>
      <footer class="wm-foot"><span class="wm-count"></span><span class="wm-keys">方向鍵開車 · Enter 進站</span><button type="button" data-map="list" aria-expanded="false">十二站目錄</button><button type="button" data-map="read">原刊全文</button><button type="button" data-map="settings" aria-expanded="false">設定</button></footer>
      <div class="wm-pop" hidden></div></section>`;
    const root = host.querySelector('.wm'),
      $ = (q) => root.querySelector(q),
      view = $('.wm-view'),
      paint = $('.wm-canvas'),
      paper = $('.wm-fallback'),
      pins = $('.wm-points'),
      pop = $('.wm-pop'),
      arrival = $('.wm-arrival');
    const edges = terrain.routes(),
      buttons = [],
      keys = new Set(),
      v = new T.Vector3(),
      car = new T.Vector3(stops[parked].x, lands[stops[parked].r].y + 0.08, stops[parked].z),
      focus = new T.Vector3(full ? 0 : car.x, 0, full ? 0 : car.z);
    const camera = new T.OrthographicCamera(-10, 10, 6, -6, 0.1, 180),
      screenRay = new T.Raycaster(),
      waterPlane = new T.Plane(new T.Vector3(0, 1, 0), 0);
    let scene,
      renderer,
      van,
      skiff,
      shadow,
      animated = [],
      w = 1,
      h = 1,
      look,
      skyClouds = [],
      lastPaint = '',
      lastShadow = -1;
    const groundPoint = (x, z) => {
      const l = terrain.landAt(x, z),
        road = terrain.roadAt(edges, x, z);
      return road.distance < 0.24 ? road.point.y + 0.046 : l ? l.y + 0.04 : -0.42;
    };
    const regionTabs = [];
    const labelPositions = [
      [-5.45, 4.02],
      [-3.7, -2.03],
      [3.3, -1.23],
      [3.04, 4.8],
    ];
    const landNames = lands.map((land, i) => {
      const label = document.createElement('span');
      label.className = 'wm-land-name';
      label.setAttribute('aria-hidden', 'true');
      label.innerHTML = '<small></small><b></b>';
      label.querySelector('small').textContent = regions[land.id].en;
      label.querySelector('b').textContent = regions[land.id].name;
      pins.append(label);
      return { label, point: labelPositions[i], height: land.y };
    });
    lands.forEach((land, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.region = land.id;
      b.innerHTML = '<i></i><span>' + ['卷首', 'People', 'Model', 'AI'][i] + '</span>';
      b.style.setProperty('--flag', land.ink);
      b.title = regions[land.id].name;
      b.onclick = () => {
        const target = stops.findIndex((s) => s.r === i);
        select(target);
      };
      $('.wm-regions').append(b);
      regionTabs.push(b);
    });
    stops.forEach((station, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'wm-pin';
      b.dataset.stop = station.id;
      b.style.setProperty('--flag', lands[station.r].ink);
      b.setAttribute('aria-label', '前往第 ' + pad(i) + ' 站，' + staging[station.id].site);
      b.innerHTML = '<b>' + pad(i) + '</b><span>' + staging[station.id].site + '</span>';
      if (completed.has(station.id)) b.classList.add('visited');
      b.onclick = () => {
        if (selected === i && parked === i && !traveling) onVisit(i);
        else select(i);
      };
      pins.append(b);
      buttons.push(b);
    });
    // The SVG uses the same camera projection and road survey when hardware 3D is unavailable.
    function svg(name, attrs, parent = paper) {
      const el = document.createElementNS(ns, name);
      for (const [k, val] of Object.entries(attrs)) el.setAttribute(k, val);
      parent.append(el);
      return el;
    }
    function xy(x, y, z) {
      v.set(x, y, z).project(camera);
      return [((v.x + 1) * w) / 2, ((1 - v.y) * h) / 2];
    }
    function linePoints(list) {
      return list
        .map(([x, y, z]) =>
          xy(x, y, z)
            .map((t) => t.toFixed(1))
            .join(','),
        )
        .join(' ');
    }
    let flatVan,
      flatHull,
      survey,
      plateReady = false;
    function fitPaper() {
      paint.hidden = true;
      paper.removeAttribute('hidden');
      const preview = new Image();
      preview.onload = () => {
        if (alive) {
          plateReady = true;
          lastPaint = '';
          dirty = true;
          request();
        }
      };
      preview.src = 'folio/img/islands.webp';
    }
    function paperVan() {
      flatVan = svg('g', {});
      flatHull = svg(
        'path',
        {
          d: 'M0 -18Q16 -11 13 12L0 22 -13 12Q-16 -11 0 -18Z',
          fill: '#f7e1b7',
          stroke: '#847e68',
          'stroke-width': '1.2',
        },
        flatVan,
      );
      svg(
        'rect',
        {
          x: -8,
          y: -12,
          width: 16,
          height: 25,
          rx: 4,
          fill: '#fff0c8',
          stroke: '#2f4550',
          'stroke-width': '1.5',
        },
        flatVan,
      );
      svg('path', { d: 'M-7 -6V-9Q0 -12 7 -9V-6Z M-7 1H7L6 6H-6Z', fill: '#6ca8b1' }, flatVan);
      svg('path', { d: 'M-7 7H7V11Q0 14 -7 11Z', fill: '#5c9c97' }, flatVan);
      svg(
        'rect',
        {
          x: -4.4,
          y: -6,
          width: 8.8,
          height: 6,
          rx: 0.8,
          fill: '#c6a7bc',
          stroke: '#65566a',
          'stroke-width': '.7',
        },
        flatVan,
      );
      for (const x of [-5, 4]) svg('rect', { x, y: 9, width: 2, height: 2, fill: '#ffe5a3' }, flatVan);
    }
    function drawFlat() {
      paper.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      if (plateReady) {
        if (!survey) {
          paper.replaceChildren();
          survey = svg('image', { href: 'folio/img/islands.webp', preserveAspectRatio: 'none' });
          paperVan();
        }
        const unit = w / (camera.right - camera.left),
          anchor = xy(0, 0.03, 0);
        // The printed landscape was rendered with this orthographic camera, 32 by 19 world units.
        for (const [k, value] of Object.entries({
          x: anchor[0] - 16 * unit,
          y: anchor[1] - 9.5 * unit,
          width: 32 * unit,
          height: 19 * unit,
        }))
          survey.setAttribute(k, value);
        return;
      }
      paper.replaceChildren();
      for (const l of lands) {
        const ring = (y) => linePoints(l.outline.map(([x, z]) => [x, y, z]));
        svg('polygon', { points: ring(-0.32), fill: l.cliff });
        svg('polygon', { points: ring(l.y - 0.09), fill: l.sand });
        svg('polygon', { points: ring(l.y), fill: l.grass });
      }
      for (const e of edges) {
        const pts = linePoints(e.points.filter((_, i) => i % 3 === 0).map((p) => [p.x, p.y, p.z]));
        const width = (camera.right - camera.left) / w;
        for (const [ink, size] of [
          ['#e6dbb2', 0.41],
          ['#68747b', 0.31],
          ['#ddd4b4', 0.022],
        ])
          svg('polyline', {
            points: pts,
            fill: 'none',
            stroke: ink,
            'stroke-width': size / width,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          });
      }
      const marks = ['⚓', '☂', '◉', '⚾', '▣', '⚖', '▧', '◷', '⚿'];
      stops.forEach((s, i) => {
        const [x, y] = xy(s.x + s.dx, lands[s.r].y + 0.3, s.z + s.dz),
          scale = clamp((w / (camera.right - camera.left)) * 0.75, 15, 56);
        svg('ellipse', { cx: x, cy: y + 4, rx: scale * 0.69, ry: scale * 0.29, fill: '#4a65583b' });
        svg('rect', {
          x: x - scale * 0.53,
          y: y - scale * 0.62,
          width: scale * 1.06,
          height: scale * 0.81,
          rx: scale * 0.13,
          fill: lands[s.r].ink,
          stroke: '#3d505b',
          'stroke-width': 1.3,
        });
        const t = svg('text', {
          x,
          y: y + scale * 0.01,
          'text-anchor': 'middle',
          'font-size': scale * 0.56,
          fill: '#354958',
        });
        t.textContent = marks[i];
      });
      paperVan();
    }
    function makeScene() {
      renderer = new T.WebGLRenderer({
        canvas: paint,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.shadowMap.autoUpdate = false;
      renderer.shadowMap.needsUpdate = true;
      renderer.outputColorSpace = T.SRGBColorSpace;
      scene = new T.Scene();
      scene.background = new T.Color('#9dd1c9');
      scene.add(new T.HemisphereLight(0xfff6e6, 0x8aa9ba, 1.95));
      const key = new T.DirectionalLight(0xfff0d4, 2.15);
      key.position.set(-8, 18, 9);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      Object.assign(key.shadow.camera, { left: -13, right: 13, top: 12, bottom: -11, far: 45, near: 0.2 });
      key.shadow.bias = -0.0004;
      key.shadow.normalBias = 0.018;
      scene.add(key);
      animated = terrain.build(scene, edges);
      van = window.AtlasMapModels.van();
      van.scale.setScalar(1.13);
      scene.add(van);
      // The press van travels on a folded paper ferry when the driver leaves a causeway.
      skiff = new T.Mesh(
        new T.SphereGeometry(1, 6, 3),
        new T.MeshLambertMaterial({ color: '#f6dec2', flatShading: true }),
      );
      skiff.scale.set(0.49, 0.15, 0.68);
      scene.add(skiff);
      shadow = new T.Mesh(
        new T.CircleGeometry(1, 20),
        new T.MeshBasicMaterial({ color: 0x234754, transparent: true, opacity: 0.22, depthWrite: false }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.scale.set(0.42, 0.58, 1);
      scene.add(shadow);
      for (let i = 0; i < 4; i++) {
        const cloud = new T.Group(),
          mat = new T.MeshLambertMaterial({ color: '#edf1dd', flatShading: true });
        [
          [-0.34, 0.02, 0.27],
          [0, 0.14, 0.4],
          [0.34, 0.03, 0.29],
        ].forEach(([x, y, s]) => {
          const part = new T.Mesh(new T.IcosahedronGeometry(1, 0), mat);
          part.scale.set(1.48 * s, 0.75 * s, s);
          part.position.set(x, y, 0);
          cloud.add(part);
        });
        cloud.position.set([-12, -8.5, 10.5, 11.8][i], 1.4 + i * 0.15, [-3.1, -7.5, -6.3, 3.8][i]);
        cloud.userData.initial = cloud.position.x;
        scene.add(cloud);
        skyClouds.push(cloud);
      }
    }
    try {
      makeScene();
    } catch (error) {
      renderer?.dispose();
      renderer = null;
      fitPaper();
    }
    function updateCamera() {
      const aspect = w / h,
        overview = Math.max(4.99, 10.75 / aspect),
        near = Math.max(2.85, Math.min(4.65, 4.29 / aspect + 0.75));
      const extent = (overview + (near - overview) * cameraMix) / currentZoom;
      camera.left = -extent * aspect;
      camera.right = extent * aspect;
      camera.top = extent;
      camera.bottom = -extent;
      camera.updateProjectionMatrix();
      camera.position.set(focus.x - 1.0, 16.6, focus.z + 13.3);
      camera.lookAt(focus.x, 0.03, focus.z);
      camera.updateMatrixWorld();
    }
    function screenToWorld(e) {
      const box = view.getBoundingClientRect();
      screenRay.setFromCamera(
        new T.Vector2(((e.clientX - box.left) / w) * 2 - 1, 1 - ((e.clientY - box.top) / h) * 2),
        camera,
      );
      return screenRay.ray.intersectPlane(waterPlane, new T.Vector3());
    }
    function zoomMode(overview) {
      full = overview;
      zoom = 1;
      dirty = true;
      root.dataset.camera = full ? 'overview' : 'follow';
      if (!motion) {
        cameraMix = full ? 0 : 1;
        focus.set(full ? 0 : car.x, 0, full ? 0 : car.z);
        updateCamera();
      }
      updateHUD();
      request();
    }
    function updateHUD() {
      const station = stops[selected],
        land = lands[station.r],
        g = items[selected];
      root.style.setProperty('--wm-accent', land.ink);
      $('.wm-stamp').textContent = pad(selected);
      $('.wm-region').textContent = regions[land.id].en + '　／　' + regions[land.id].name;
      $('.wm-ticket h3').textContent = staging[station.id].site;
      $('.wm-prompt').textContent = editorial[station.id].headline;
      $('.wm-count').textContent = '走過　' + completed.size + ' / ' + stops.length + ' 站';
      $('.wm-enter').textContent = '打開這一頁';
      $('.wm-enter').setAttribute('aria-label', '打開第 ' + pad(selected) + ' 站，' + staging[g.id].site);
      $('.wm-enter').dataset.enter = g.id;
      $('.wm-ticket').dataset.status = traveling ? 'driving' : parked < 0 ? 'exploring' : 'parked';
      buttons.forEach((b, i) => {
        b.setAttribute('aria-pressed', String(i === selected));
        b.classList.toggle('target', i === selected);
      });
      regionTabs.forEach((b, i) => b.setAttribute('aria-pressed', String(i === station.r)));
      for (const [key, value] of [
        ['overview', full],
        ['follow', !full],
      ])
        root.querySelector('[data-map="' + key + '"]').setAttribute('aria-pressed', String(value));
      root.dataset.camera = full ? 'overview' : 'follow';
      root.dataset.parked = parked >= 0 ? stops[parked].id : '';
      root.dataset.destination = g.id;
    }
    function hidePop() {
      menuOpen = false;
      pop.hidden = true;
      root.querySelectorAll('[aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    }
    function arrivalAt(i) {
      parked = i;
      arrival.hidden = i < 0;
      root.classList.toggle('at-station', i >= 0);
      if (i < 0) return;
      const entry = editorial[stops[i].id];
      arrival.querySelector('small').textContent =
        staging[stops[i].id].site + '　·　原刊 p.' + entry.source.page;
      arrival.querySelector('strong').textContent = entry.headline;
      arrival.setAttribute('aria-label', '進入' + staging[stops[i].id].site + '。' + entry.headline);
    }
    function select(i) {
      hidePop();
      keys.clear();
      orbitDrag = null;
      selected = i;
      look = null;
      const end = stops[i];
      if (full && !lockOverview && parked !== i) zoomMode(false);
      if (!motion) {
        car.set(end.x, lands[end.r].y + 0.08, end.z);
        arrivalAt(i);
        traveling = false;
        path = [];
      } else {
        path = terrain.course(edges, car, i);
        wp = 1;
        traveling = car.distanceTo(path.at(-1)) > 0.13;
        arrivalAt(traveling ? -1 : i);
      }
      updateHUD();
      dirty = true;
      request();
    }
    function showMenu(mode) {
      if (menuOpen === mode) {
        hidePop();
        return;
      }
      hidePop();
      menuOpen = mode;
      pop.hidden = false;
      root.querySelector('[data-map="' + mode + '"]').setAttribute('aria-expanded', 'true');
      if (mode === 'list')
        pop.innerHTML =
          '<h3>採訪站目錄</h3><div class="wm-directory">' +
          stops
            .map(
              (s, i) =>
                '<button type="button" data-jump="' +
                i +
                '"><b>' +
                pad(i) +
                '</b>' +
                staging[s.id].site +
                '</button>',
            )
            .join('') +
          '</div>';
      else
        pop.innerHTML =
          '<h3>地圖設定</h3><button type="button" data-pref="motion">動態' +
          (motion ? '開啟' : '暫停') +
          '</button><button type="button" data-pref="sound">紙張音效' +
          (sound ? '開啟' : '關閉') +
          '</button><button type="button" data-pref="credits">作品出處</button>';
      pop.querySelector('button')?.focus({ preventScroll: true });
    }
    listen(root, 'click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.matches('.wm-enter,.wm-arrival')) onVisit(selected);
      else if (b.matches('.wm-leave')) onClose();
      else if (b.dataset.jump !== undefined) select(Number(b.dataset.jump));
      else if (b.dataset.pref === 'motion') {
        motion = !motion;
        onMotion(motion);
        if (!motion && traveling) select(selected);
        menuOpen = false;
        showMenu('settings');
      } else if (b.dataset.pref === 'sound') {
        sound = !sound;
        onSound(sound);
        menuOpen = false;
        showMenu('settings');
      } else if (b.dataset.pref === 'credits') onCredits();
      else if (b.dataset.map === 'overview' || b.dataset.map === 'follow') {
        lockOverview = b.dataset.map === 'overview';
        zoomMode(lockOverview);
      } else if (b.dataset.map === 'read') onRead();
      else if (b.dataset.map === 'list' || b.dataset.map === 'settings') showMenu(b.dataset.map);
    });
    listen(view, 'pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button') || !e.isPrimary) return;
      hidePop();
      view.focus({ preventScroll: true });
      const box = view.getBoundingClientRect(),
        x = e.clientX - box.left,
        y = e.clientY - box.top;
      const pick = stops
        .map((s, i) => {
          const p = xy(s.x + s.dx, lands[s.r].y + 0.5, s.z + s.dz);
          return { i, d: Math.hypot(p[0] - x, p[1] - y) };
        })
        .sort((a, b) => a.d - b.d)[0];
      const hitRadius = clamp((w / (camera.right - camera.left)) * 0.55, 13, 45);
      orbitDrag = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        point: screenToWorld(e),
        time: performance.now(),
        hit: pick.d < hitRadius ? pick.i : -1,
      };
      view.setPointerCapture(e.pointerId);
      request();
      e.preventDefault();
    });
    listen(view, 'pointermove', (e) => {
      if (orbitDrag?.id === e.pointerId) {
        orbitDrag.point = screenToWorld(e);
        if (Math.hypot(e.clientX - orbitDrag.x, e.clientY - orbitDrag.y) > 6) orbitDrag.time = 0;
        request();
      }
    });
    function endDrive(e) {
      if (orbitDrag?.id !== e.pointerId) return;
      const d = orbitDrag;
      orbitDrag = null;
      look = null;
      if (view.hasPointerCapture(e.pointerId)) view.releasePointerCapture(e.pointerId);
      if (e.type === 'pointerup' && performance.now() - d.time < 210 && d.hit >= 0) {
        if (parked === d.hit && !traveling) onVisit(d.hit);
        else select(d.hit);
      }
      dirty = true;
      request();
    }
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) listen(view, name, endDrive);
    listen(
      view,
      'wheel',
      (e) => {
        if (e.ctrlKey) return;
        e.preventDefault();
        zoom = clamp(zoom * (e.deltaY > 0 ? 0.88 : 1.13), 0.8, 2.0);
        dirty = true;
        request();
      },
      { passive: false },
    );
    listen(document, 'keydown', (e) => {
      if (!alive || !root.isConnected || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'escape' && menuOpen) {
        e.preventDefault();
        e.stopPropagation();
        hidePop();
        view.focus();
        return;
      }
      if (menuOpen) return;
      if (directions[k]) {
        e.preventDefault();
        keys.add(k);
        request();
      } else if (e.key === 'Enter' && !e.target.closest('button,a,select,input')) {
        e.preventDefault();
        onVisit(selected);
      }
    });
    listen(window, 'keyup', (e) => keys.delete(e.key.toLowerCase()));
    const clearDrive = () => {
      keys.clear();
      orbitDrag = null;
      look = null;
    };
    listen(window, 'blur', clearDrive);
    function resetSize() {
      const box = view.getBoundingClientRect();
      w = Math.max(1, box.width);
      h = Math.max(1, box.height);
      renderer?.setSize(w, h, false);
      updateCamera();
      dirty = true;
      request();
    }
    function freeMove(dx, dz, dt) {
      if (traveling) {
        path = [];
        traveling = false;
      }
      const dist = Math.hypot(dx, dz);
      if (dist < 0.01) return;
      if (full && !lockOverview) zoomMode(false);
      const step = Math.min(dist, dt * 4.2);
      car.x = clamp(car.x + (dx / dist) * step, -10.0, 9.8);
      car.z = clamp(car.z + (dz / dist) * step, -6.45, 6.0);
      car.y = groundPoint(car.x, car.z);
      angle = Math.atan2(dx, dz);
      dirty = true;
      let best = -1,
        min = 0.92;
      stops.forEach((s, i) => {
        const d = Math.hypot(car.x - s.x, car.z - s.z);
        if (d < min) {
          min = d;
          best = i;
        }
      });
      if (parked !== best) {
        if (best >= 0) selected = best;
        arrivalAt(best);
        updateHUD();
      }
    }
    function advance(dt) {
      let budget = Math.min(8.7, 4.4 + path.length * 0.014) * dt;
      while (budget > 0 && wp < path.length) {
        const p = path[wp],
          d = car.distanceTo(p);
        if (d > 0.008) angle = Math.atan2(p.x - car.x, p.z - car.z);
        if (d <= budget) {
          car.copy(p);
          budget -= d;
          wp++;
        } else {
          car.lerp(p, budget / d);
          budget = 0;
        }
      }
      if (wp >= path.length) {
        traveling = false;
        arrivalAt(selected);
        updateHUD();
      }
    }
    function draw(ms) {
      frame = 0;
      if (!alive || document.hidden) return;
      const dt = Math.min(0.15, Math.max(0.001, (ms - (prev || ms - 16)) / 1000));
      prev = ms;
      if (motion) time += dt;
      let dx = 0,
        dz = 0;
      for (const key of keys) {
        const dir = directions[key];
        if (dir) {
          dx += dir[0];
          dz += dir[1];
        }
      }
      if (orbitDrag && ms - orbitDrag.time >= 195) look = orbitDrag.point;
      if (dx || dz) freeMove(dx * 10, dz * 10, dt);
      else if (look) freeMove(look.x - car.x, look.z - car.z, dt);
      else if (traveling) advance(dt);
      const aimX = full ? 0 : car.x,
        aimZ = full ? 0 : car.z;
      const targetMix = full ? 0 : 1,
        delta =
          Math.abs(focus.x - aimX) +
          Math.abs(focus.z - aimZ) +
          Math.abs(zoom - currentZoom) +
          Math.abs(cameraMix - targetMix);
      if (delta > 0.0008) {
        const f = motion ? 1 - Math.exp(-dt * 5.8) : 1;
        focus.x += (aimX - focus.x) * f;
        focus.z += (aimZ - focus.z) * f;
        currentZoom += (zoom - currentZoom) * f;
        cameraMix += (targetMix - cameraMix) * f;
        dirty = true;
      }
      updateCamera();
      if (dirty || traveling || motion) {
        root.dataset.vehicle = car.x.toFixed(2) + ',' + car.z.toFixed(2);
        const afloat = car.y < -0.2;
        if (renderer) {
          van.position.copy(car);
          van.position.y += afloat ? 0.15 + Math.sin(time * 3) * 0.021 : 0.012;
          const diff = Math.atan2(Math.sin(angle - van.rotation.y), Math.cos(angle - van.rotation.y));
          van.rotation.y += diff * (motion ? Math.min(1, dt * 12) : 1);
          van.userData.animate?.(time, traveling || keys.size || look ? 1 : 0);
          skiff.visible = afloat;
          skiff.position.copy(car);
          skiff.rotation.y = van.rotation.y;
          shadow.position.set(car.x, car.y + 0.006, car.z);
          shadow.rotation.z = -van.rotation.y;
          animated.forEach((o) => o.userData.animate?.(time));
          skyClouds.forEach((o, i) => (o.position.x = o.userData.initial + Math.sin(time * 0.085 + i) * 0.37));
          if (ms - lastShadow > 180) {
            renderer.shadowMap.needsUpdate = true;
            lastShadow = ms;
          }
          renderer.render(scene, camera);
        } else {
          const serial = [
            w,
            h,
            currentZoom.toFixed(3),
            focus.x.toFixed(3),
            focus.z.toFixed(3),
            cameraMix.toFixed(3),
          ].join('/');
          if (lastPaint !== serial) {
            drawFlat();
            lastPaint = serial;
          }
          const q = xy(car.x, car.y + 0.13, car.z),
            ahead = xy(car.x + Math.sin(angle), car.y + 0.13, car.z + Math.cos(angle)),
            turn = (-Math.atan2(ahead[0] - q[0], ahead[1] - q[1]) * 180) / Math.PI;
          const size = clamp((w / (camera.right - camera.left)) * 0.039, 0.6, 4.5);
          flatVan?.setAttribute(
            'transform',
            'translate(' + q[0] + ' ' + q[1] + ') rotate(' + turn + ') scale(' + size + ')',
          );
          flatHull?.setAttribute('visibility', afloat ? 'visible' : 'hidden');
        }
        stops.forEach((s, i) => {
          const q = xy(s.x - 0.27, lands[s.r].y + 0.8, s.z + 0.12);
          const b = buttons[i];
          b.style.left = q[0] + 'px';
          b.style.top = q[1] + 'px';
          b.hidden = q[0] < 6 || q[0] > w - 6 || q[1] < 8 || q[1] > h - 5;
        });
        if (full)
          for (const { label, point, height } of landNames) {
            const [x, y] = xy(point[0], height + 0.03, point[1]);
            label.style.left = x + 'px';
            label.style.top = y + 'px';
          }
        if (!arrival.hidden && parked >= 0) {
          const s = stops[parked],
            p = xy(s.x, lands[s.r].y + 0.9, s.z);
          const half = arrival.offsetWidth / 2;
          arrival.style.left = clamp(p[0], half + 8, w - half - 8) + 'px';
          arrival.style.top = clamp(p[1] - 29, arrival.offsetHeight + 8, h - 18) + 'px';
        }
        dirty = false;
      }
      if (motion || traveling || keys.size || orbitDrag || delta > 0.001) request();
    }
    function request() {
      if (!frame && alive && !document.hidden) frame = requestAnimationFrame(draw);
    }
    const resize = new ResizeObserver(resetSize);
    resize.observe(view);
    listen(document, 'visibilitychange', () => {
      if (document.hidden) clearDrive();
      else {
        prev = 0;
        dirty = true;
        request();
      }
    });
    listen(paint, 'webglcontextlost', (e) => {
      e.preventDefault();
      renderer = null;
      fitPaper();
      dirty = true;
      request();
    });
    updateHUD();
    resetSize();
    view.focus({ preventScroll: true });
    return {
      select,
      motion(value) {
        motion = value;
        if (!motion && traveling) select(selected);
        dirty = true;
        request();
      },
      destroy() {
        if (!alive) return;
        alive = false;
        cancelAnimationFrame(frame);
        resize.disconnect();
        controller.abort();
        if (renderer) {
          renderer.dispose();
          renderer.forceContextLoss();
        }
        root.remove();
      },
    };
  }
  window.AtlasRoadmap = { mount };
})();
