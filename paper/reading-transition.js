/* Ink appears on the same four corners as the 3D book. Project that sheet into its
   final, front-facing print layout before handing it to the accessible reader. */
(() => {
  'use strict';
  function ease(a, b, value) {
    const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }
  function boundsOf(surface, scroll) {
    const b = surface.getBoundingClientRect(),
      v = scroll.getBoundingClientRect();
    const left = Math.max(b.left, v.left),
      top = Math.max(b.top, v.top);
    return new DOMRect(
      left,
      top,
      Math.max(1, Math.min(b.right, v.right) - left),
      Math.max(1, Math.min(b.bottom, v.bottom) - top),
    );
  }
  function corners(r) {
    return [
      { x: r.left, y: r.top },
      { x: r.right, y: r.top },
      { x: r.right, y: r.bottom },
      { x: r.left, y: r.bottom },
    ];
  }
  function warp(quad, width, height) {
    const [a, b, c, d] = quad;
    const x1 = b.x - c.x,
      x2 = d.x - c.x,
      y1 = b.y - c.y,
      y2 = d.y - c.y;
    const sx = a.x - b.x + c.x - d.x,
      sy = a.y - b.y + c.y - d.y;
    const det = x1 * y2 - x2 * y1;
    const g = det ? (sx * y2 - sy * x2) / det : 0,
      h = det ? (x1 * sy - y1 * sx) / det : 0;
    return (
      'matrix3d(' +
      [
        (b.x - a.x + g * b.x) / width,
        (b.y - a.y + g * b.y) / width,
        0,
        g / width,
        (d.x - a.x + h * d.x) / height,
        (d.y - a.y + h * d.y) / height,
        0,
        h / height,
        0,
        0,
        1,
        0,
        a.x,
        a.y,
        0,
        1,
      ].join(',') +
      ')'
    );
  }
  function copyInk(surface, paper, r) {
    paper.replaceChildren();
    const leaves = [...surface.querySelectorAll(':scope > .dr-leaf:not(.dr-still) > img')];
    paper.classList.toggle('spread', leaves.length === 2);
    function place(el, source) {
      const box = source.getBoundingClientRect();
      Object.assign(el.style, {
        position: 'absolute',
        left: box.left - r.left + 'px',
        top: box.top - r.top + 'px',
        width: box.width + 'px',
        height: box.height + 'px',
        margin: '0',
      });
      paper.append(el);
    }
    for (const image of leaves) {
      const ink = image.cloneNode(false),
        css = getComputedStyle(image);
      ink.style.objectFit = css.objectFit;
      ink.style.objectPosition = css.objectPosition;
      place(ink, image);
    }
    if (!leaves.length) {
      const prose = surface.querySelector('.dr-prose');
      if (prose) {
        const clone = prose.cloneNode(true);
        clone.style.font = getComputedStyle(prose).font;
        place(clone, prose);
      }
    }
  }
  function create(book, reader, paper, getStage) {
    let progress = 0,
      frame = 0,
      generation = 0;
    return function transition(surface, target, animated, onProgress, done) {
      cancelAnimationFrame(frame);
      const generationAtStart = ++generation;
      const from = progress,
        stage = getStage();
      const shot = book.querySelector('#paper-world:not([hidden])') || book.querySelector('#printed-scene');
      const scroll = reader.querySelector('.dr-scroll');
      let rect;
      function measure() {
        rect = boundsOf(surface, scroll);
        paper.style.width = rect.width + 'px';
        paper.style.height = rect.height + 'px';
        copyInk(surface, paper, rect);
      }
      function draw(value) {
        progress = value;
        onProgress(value);
        stage?.reading(value);
        shot.style.opacity = 1 - ease(0.48, 0.84, value);
        const source = stage?.pageCorners() || [
          { x: innerWidth * 0.13, y: innerHeight * 0.47 },
          { x: innerWidth * 0.85, y: innerHeight * 0.47 },
          { x: innerWidth * 0.96, y: innerHeight * 0.74 },
          { x: innerWidth * 0.04, y: innerHeight * 0.74 },
        ];
        const dest = corners(rect),
          align = ease(0.32, 0.965, value);
        const quad = source.map((p, i) => ({
          x: p.x + (dest[i].x - p.x) * align,
          y: p.y + (dest[i].y - p.y) * align,
        }));
        paper.style.transform = warp(quad, rect.width, rect.height);
        paper.style.opacity = ease(0.31, 0.66, value);
        reader.style.opacity = ease(0.67, 0.97, value);
      }
      function finish() {
        progress = target;
        stage?.reading(target);
        onProgress(target);
        shot.style.opacity = target ? '0' : '';
        paper.hidden = true;
        paper.replaceChildren();
        reader.classList.remove('morphing');
        reader.inert = !target;
        reader.style.opacity = target ? '' : '0';
        done();
      }
      reader.inert = true;
      if (!animated || Math.abs(target - from) < 0.001 || !surface) {
        finish();
        return;
      }
      measure();
      reader.classList.add('morphing');
      paper.hidden = false;
      draw(from);
      const duration = Math.max(260, 1220 * Math.abs(target - from));
      const start = performance.now();
      let lastSize = [innerWidth, innerHeight];
      function animate(now) {
        if (generation !== generationAtStart) return;
        if (lastSize[0] !== innerWidth || lastSize[1] !== innerHeight) {
          measure();
          lastSize = [innerWidth, innerHeight];
        }
        const t = Math.min(1, (now - start) / duration);
        draw(from + (target - from) * ease(0, 1, t));
        if (t < 1) frame = requestAnimationFrame(animate);
        else finish();
      }
      frame = requestAnimationFrame(animate);
    };
  }
  window.AtlasLeafTransition = { create };
})();
