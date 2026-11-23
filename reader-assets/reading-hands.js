// Gestures and settling of an individual leaf. The reader commits the page only after it lands.
(() => {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pinchTwistSlop = 5 * Math.PI / 180;
  function attach({
    root,
    port,
    surface,
    signal,
    frameForPointer,
    view,
    neighbour,
    begin,
    pose,
    finish,
    zoom,
    rotate
  }) {
    const touches = new Map();
    let hand = null,
      pinch = null,
      turn = null,
      task = 0,
      flexFrame = 0,
      lastPull = -Infinity,
      queued = 0;
    const on = (target, type, callback, opts = {}) =>
      target.addEventListener(type, callback, { ...opts, signal });
    function capture(id) {
      try {
        port.setPointerCapture(id);
      } catch {}
    }
    function clearPointer() {
      cancelAnimationFrame(flexFrame);
      flexFrame = 0;
      const id = hand?.id;
      hand = null;
      root.classList.remove('dr-holding', 'dr-panning', 'dr-orbiting');
      if (id != null && port.hasPointerCapture(id)) port.releasePointerCapture(id);
    }
    function stop(commit = false) {
      if (task) cancelAnimationFrame(task);
      task = 0;
      if (turn) {
        turn = null;
        root.classList.remove('dr-moving');
        finish(commit);
      }
    }
    function cancel() {
      queued = 0;
      clearPointer();
      pinch = null;
      touches.clear();
      stop();
    }
    function launch(dir, corner) {
      const next = neighbour(dir);
      if (next === undefined) return false;
      begin(next, dir, corner);
      turn = { p: 0, corner };
      root.classList.add('dr-moving');
      pose(0, corner, 0);
      return true;
    }
    function settle(goal, initial = 0) {
      const t = turn;
      if (!t) return;
      if (!view().motion) {
        stop(Boolean(goal));
        return;
      }
      let x = t.p,
        v = clamp(initial, -3.8, 3.8),
        previous = performance.now(),
        elapsed = 0;
      const rigid = view().rigid,
        frequency = rigid ? 12 : 13.8,
        damping = rigid ? 0.86 : 0.63;
      function animate(now) {
        if (turn !== t) return;
        const dt = Math.min(0.055, Math.max(0, (now - previous) / 1000));
        previous = now;
        elapsed += dt;
        const count = Math.max(1, Math.ceil(dt * 120)),
          h = dt / count;
        for (let i = 0; i < count; i++) {
          v += ((goal - x) * frequency * frequency - 2 * damping * frequency * v) * h;
          x += v * h;
        }
        // A leaf can lift a little after contact but cannot travel through the stack.
        const contact = x < 0 ? -x * 0.48 : x > 1 ? 1 - (x - 1) * 0.48 : x;
        t.p = clamp(contact, 0, 1);
        pose(t.p, t.corner, clamp(v / 3, -1, 1), null, goal);
        if ((Math.abs(x - goal) < 0.0018 && Math.abs(v) < 0.034) || elapsed > 1.05) {
          pose(goal, t.corner, 0, null, goal);
          stop(Boolean(goal));
          const next = Math.sign(queued);
          queued -= next;
          if (next) step(next);
        } else task = requestAnimationFrame(animate);
      }
      task = requestAnimationFrame(animate);
    }
    function step(dir) {
      if (turn) {
        if (task) queued += dir;
        return;
      }
      if (hand) clearPointer();
      if (launch(dir, 0.76)) settle(1);
      else queued = 0;
    }
    function point(e) {
      return { x: e.clientX, y: e.clientY };
    }
    function pinchPoints() {
      const [a, b] = [...touches.values()];
      return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
        d: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
        angle: Math.atan2(b.y - a.y, b.x - a.x)
      };
    }
    function edgeAt(e, uv) {
      const corner = e.target.closest?.('[data-corner]');
      if (corner && !corner.hidden) return Number(corner.dataset.corner);
      if (!uv.inside || (view().mode === 'text' && !view().outer)) return 0;
      const side = uv.u > 0.78 ? 1 : uv.u < 0.22 ? -1 : 0;
      return side && neighbour(side) !== undefined ? side : 0;
    }
    on(port, 'pointerdown', (e) => {
      if (
        (e.pointerType !== 'touch' && e.button !== 0 && e.button !== 1 && e.button !== 2) ||
        e.target.closest('.dr-toc-row')
      )
        return;
      if (e.pointerType === 'touch') {
        if (touches.size >= 2) return;
        touches.set(e.pointerId, point(e));
        if (touches.size === 2) {
          clearPointer();
          stop();
          const m = pinchPoints();
          pinch = { ...m, scale: view().zoom, totalAngle: 0, appliedAngle: 0 };
          for (const id of touches.keys()) capture(id);
          lastPull = performance.now();
          e.preventDefault();
          return;
        }
        if (pinch) return;
      }
      if (turn || hand) return;
      const frame = frameForPointer(),
        uv = frame(e.clientX, e.clientY),
        s = view();
      const tools = s.orbit || e.altKey || e.button === 2,
        dir = tools && !e.target.closest('[data-corner]') ? 0 : edgeAt(e, uv);
      const text = e.target.closest('.dr-text-viewport');
      if (text && !tools && !dir) return;
      const type = dir
        ? 'leaf'
        : tools || !uv.inside || (!e.shiftKey && e.button === 0 && s.zoom <= 1.001)
          ? 'orbit'
          : 'pan';
      hand = {
        id: e.pointerId,
        type,
        dir,
        frame,
        uv,
        down: point(e),
        last: point(e),
        left: port.scrollLeft,
        top: port.scrollTop,
        active: false,
        at: performance.now(),
        speed: 0
      };
      if (type !== 'leaf' && e.button !== 0) e.preventDefault();
    });
    on(port, 'pointermove', (e) => {
      if (e.pointerType === 'touch' && touches.has(e.pointerId)) touches.set(e.pointerId, point(e));
      if (pinch && touches.size >= 2) {
        if (!touches.has(e.pointerId)) return;
        const m = pinchPoints(),
          spin = Math.atan2(Math.sin(m.angle - pinch.angle), Math.cos(m.angle - pinch.angle));
        zoom((pinch.scale * m.d) / pinch.d, { clientX: m.x, clientY: m.y });
        // Allow small changes of finger angle during a zoom. Slow, deliberate twists still add up.
        pinch.totalAngle += spin;
        const twist = Math.sign(pinch.totalAngle) * Math.max(0, Math.abs(pinch.totalAngle) - pinchTwistSlop);
        if (twist !== pinch.appliedAngle) rotate(0, 0, twist - pinch.appliedAngle);
        pinch.appliedAngle = twist;
        pinch.angle = m.angle;
        e.preventDefault();
        return;
      }
      const h = hand;
      if (!h || h.id !== e.pointerId) {
        if (!turn && e.pointerType === 'mouse') {
          const side = edgeAt(e, frameForPointer()(e.clientX, e.clientY));
          surface.dataset.edge = side === 1 ? 'next' : side === -1 ? 'prev' : '';
        }
        return;
      }
      const dx = e.clientX - h.down.x,
        dy = e.clientY - h.down.y;
      if (!h.active) {
        if (Math.hypot(dx, dy) < 5) return;
        if (h.type === 'leaf' && Math.abs(dy) > Math.abs(dx) * 1.45) {
          clearPointer();
          return;
        }
        h.active = true;
        capture(h.id);
        lastPull = performance.now();
        if (h.type === 'leaf') {
          if (!launch(h.dir, clamp(h.uv.v * 2 - 1, -1, 1))) {
            clearPointer();
            return;
          }
          root.classList.add('dr-holding');
        } else root.classList.add(h.type === 'orbit' ? 'dr-orbiting' : 'dr-panning');
      }
      if (h.type === 'leaf' && turn) {
        const uv = h.frame(e.clientX, e.clientY),
          radius = view().spread ? 0.47 : 0.65;
        const x = clamp(((h.uv.u - uv.u) * h.dir) / radius, 0, 2),
          p = Math.acos(1 - x) / Math.PI;
        const now = performance.now(),
          dt = clamp((now - h.at) / 1000, 0.009, 0.12);
        h.speed = 0.4 * h.speed + 0.6 * clamp((p - turn.p) / dt, -4, 4);
        h.at = now;
        turn.p = p;
        const bend = clamp(h.speed / 3, -1, 1);
        const grip = { u:h.uv.u, v:h.uv.v, x:e.clientX, y:e.clientY };
        pose(p, turn.corner, bend, grip);
        cancelAnimationFrame(flexFrame);
        // The fingertips stay put while slack farther down the sheet catches up.
        if (view().motion && Math.abs(bend) > .035) {
          function relax(time) {
            if (hand !== h || !turn) return;
            const slack = bend * Math.exp(-(time - now) / 115);
            pose(p, turn.corner, Math.abs(slack) < .025 ? 0 : slack, grip);
            if (Math.abs(slack) >= .025) flexFrame = requestAnimationFrame(relax);
          }
          flexFrame = requestAnimationFrame(relax);
        }
      } else if (h.type === 'orbit') {
        const mx = e.clientX - h.last.x,
          my = e.clientY - h.last.y;
        if (e.shiftKey) rotate(0, 0, mx * 0.0035);
        else rotate(mx, my, 0);
      } else if (h.type === 'pan') {
        port.scrollLeft = h.left - dx;
        port.scrollTop = h.top - dy;
      }
      h.last = point(e);
      e.preventDefault();
    });
    function up(e) {
      touches.delete(e.pointerId);
      if (pinch) {
        if (touches.size < 2) pinch = null;
        lastPull = performance.now();
        return;
      }
      const h = hand;
      if (!h || h.id !== e.pointerId) return;
      const wasDrag = h.active;
      clearPointer();
      if (!wasDrag) return;
      lastPull = performance.now();
      if (h.type === 'leaf' && turn) {
        const fresh = performance.now() - h.at < 100 ? h.speed : 0;
        const commit = e.type === 'pointerup' && (turn.p > 0.3 || (fresh > 0.75 && turn.p > 0.14));
        settle(commit ? 1 : 0, fresh);
      }
    }
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture'])
      on(port, name, (e) => {
        if (name === 'lostpointercapture' && (e.target !== port || pinch || hand?.id !== e.pointerId)) return;
        up(e);
      });
    on(port, 'pointerleave', (e) => {
      if (!hand?.active && e.pointerType === 'mouse') {
        clearPointer();
        delete surface.dataset.edge;
      }
    });
    on(port, 'contextmenu', (e) => {
      if (!e.target.closest('.dr-text-viewport') || view().orbit) e.preventDefault();
    });
    on(
      port,
      'wheel',
      (e) => {
        const text = e.target.closest('.dr-text-viewport');
        if (text && !e.ctrlKey && !e.metaKey && !e.altKey) return;
        if (turn || pinch) return;
        e.preventDefault();
        const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? port.clientHeight : 1);
        zoom(view().zoom * Math.exp(-clamp(delta, -240, 240) * 0.0024), e);
      },
      { passive: false }
    );
    on(port, 'dblclick', (e) => {
      if (e.target.closest('[data-corner],.dr-text-viewport') || performance.now() - lastPull < 320 || turn)
        return;
      e.preventDefault();
      zoom(view().zoom > 1.01 ? 1 : 2, e);
    });
    return {
      step,
      cancel,
      get moving() {
        return Boolean(turn);
      },
      ignoreClick() {
        return performance.now() - lastPull < 320;
      }
    };
  }
  window.DecisionBookHands = { attach };
})();

// Selectable text and the standalone reader keep their own ink during a turn.
// Narrow connected bands curve about the binding; both sides retain upright type.
window.DecisionBookHands.inkFold = function (surface, before, after, dir, rigid) {
  const layer = document.createElement('div');
  layer.className = 'dr-ink-fold';
  layer.setAttribute('aria-hidden', 'true');
  layer.inert = true;
  const w = before[0].offsetWidth,
    h = before[0].offsetHeight,
    paired = before.length === 2,
    forward = dir > 0;
  const hinge = paired ? w : forward ? 0 : w,
    front = before[forward ? before.length - 1 : 0],
    back = after[forward ? 0 : after.length - 1];
  const clone = (n) => {
    const c = n.cloneNode(true);
    if (n.querySelector('.dr-text-viewport')) c.dataset.scroll = n.querySelector('.dr-text-viewport').scrollTop;
    return c;
  };
  function base(n, x) {
    const l = clone(n);
    l.style.cssText = 'position:absolute;top:0;left:' + x + 'px;width:' + w + 'px;height:' + h + 'px';
    layer.append(l);
  }
  if (paired && after.length === 2) {
    base(forward ? before[0] : after[0], 0);
    base(forward ? after[1] : before[1], w);
  } else base(after[forward ? after.length - 1 : 0], 0);
  const count = rigid ? 1 : 10,
    strips = [];
  for (let i = 0; i < count; i++) {
    const band = document.createElement('div');
    band.className = 'dr-paper-band';
    const pair = [];
    for (const [n, f] of [
      [front, forward ? i : count - i - 1],
      [back, forward ? count - i - 1 : i]
    ]) {
      const copy = clone(n);
      copy.style.cssText =
        'position:absolute;top:0;left:' + (-f * w) / count + 'px;width:' + w + 'px;height:' + h + 'px';
      band.append(copy);
      pair.push(copy);
    }
    band.style.width = w / count + 0.7 + 'px';
    band.style.height = h + 'px';
    layer.append(band);
    strips.push({ band, pair });
  }
  surface.append(layer);
  surface.classList.add('dr-fold-active');
  for (const l of layer.querySelectorAll('[data-scroll]'))
    l.querySelector('.dr-text-viewport').scrollTop = Number(l.dataset.scroll);
  return {
    pose(p, corner, bend) {
      let x = hinge,
        y = 0;
      strips.forEach(({ band, pair }, i) => {
        const u = (i + 0.5) / count;
        const alpha =
          Math.PI * p +
          (rigid ? 0 : Math.sin(Math.PI * p) * (u - 0.48) * 1.78 - bend * 0.1 * Math.sin(Math.PI * p));
        const c = Math.cos(alpha),
          s = Math.sin(alpha),
          dx = (dir * c * w) / count;
        const dy = rigid ? 0 : ((-corner * s * w * 0.055) / count) * (1 - u);
        band.style.transform =
          'matrix(' +
          Math.abs(c) +
          ',' +
          ((dx > 0 ? 1 : -1) * dy * count) / w +
          ',0,1,' +
          Math.min(x, x + dx) +
          ',' +
          (dx > 0 ? y : y + dy) +
          ')';
        band.style.filter = 'brightness(' + (1 - 0.22 * Math.abs(s)) + ')';
        pair[0].style.visibility = c >= 0 ? 'visible' : 'hidden';
        pair[1].style.visibility = c < 0 ? 'visible' : 'hidden';
        x += dx;
        y += dy;
      });
    },
    remove() {
      layer.remove();
      surface.classList.remove('dr-fold-active');
    }
  };
};
