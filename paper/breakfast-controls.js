(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const printedPositions = {
    sleeve: [0.43, 0.57],
    bird: [0.36, 0.48],
    bell: [0.34, 0.56],
    awning: [0.72, 0.28],
    order: [0.66, 0.51],
    first: [0.51, 0.76],
    trial: [0.6, 0.74],
    carried: [0.47, 0.55],
    customer: [0.27, 0.58],
    vendor: [0.69, 0.44],
    ferry: [0.32, 0.39],
    water: [0.38, 0.51],
  };
  function sentence(s) {
    if (s.phase === 'closed' || s.phase === 'invited')
      return '船員在碼頭招手。點車籃裡的湯杯，把第一杯送給她。';
    if (s.phase === 'opening') {
      if (s.beat === 'proof') return '船員舉起濕掉的送餐單。這一杯，在橋縫上灑了。';
      if (s.beat === 'impact') return '前輪顛了一下，杯子一歪，熱湯濺到送餐單上。';
      return '攤主裝好第一杯。翠鳥帶著訂單，跟車往碼頭去。';
    }
    if (s.phase === 'ready') return '船員手裡的單子濕了。把杯托往上拉，鬆手再送一次。';
    if (s.phase === 'folding') return '杯托正跟著你的手升降。放手，讓車重走同一段路。';
    if (s.phase === 'riding') {
      if (s.beat === 'proof' || s.beat === 'impact')
        return s.target >= 0.78
          ? '同一道橋縫，這回杯子穩住了。船員伸手接湯。'
          : '杯子還是歪了。看看船員手中那張新單子。';
      return s.target >= 0.78 ? '紙托扶穩了杯子。早餐車再跑一趟。' : '換個杯托高度，再走同一道橋縫。';
    }
    if (s.height >= 0.78) return '這杯沒灑！船員收下熱湯，攤主照樣裝好剩下五杯。';
    return s.height > 0
      ? '湯漬變小了。再把杯托拉高一點，試給船員看。'
      : '船員又收到一張濕單。把杯托往上拉，再送一次。';
  }
  function mount({ record, onTrial, onCheckpoint, onSound, redraw, hits, project }) {
    const book = $('#book-room'),
      controls = $('#breakfast-controls'),
      buttons = [...controls.querySelectorAll('button')];
    const paper = $('#breakfast-print'),
      flat = $('#printed-scene'),
      seal = $('#story-seal'),
      mark = $('#breakfast-order-mark');
    const receipt = $('#breakfast-receipt'),
      action = $('#breakfast-action'),
      line = $('#line');
    const close = $('#receipt-close'),
      watch = $('#receipt-replay'),
      original = $('#receipt-original');
    let active = false,
      loadPrint = null,
      origin = null,
      paperKey = '',
      anchor = null;
    const cue = $('#breakfast-cue'),
      voice = $('#breakfast-voice'),
      lesson = $('#breakfast-lesson'),
      again = $('#breakfast-again'),
      compare = $('#breakfast-compare');
    let printNumbers = [];
    const sleeve = controls.querySelector('[data-story-control="sleeve"]');
    let voiceKey = '',
      voiceTimer = 0;
    function clearVoice() {
      clearTimeout(voiceTimer);
      voiceKey = '';
      voice.hidden = true;
    }
    function speak(key) {
      const s = story.state(),
        dry = s.phase === 'landed' && s.height >= 0.78;
      const messages = {
        customer: dry
          ? '船員：「這杯沒灑，可以上船了！」'
          : s.seen
            ? '船員：「看，剛才的湯灑在這裡。」'
            : '船員：「這裡！船上訂了六杯熱湯。」',
        vendor: dry ? '攤主：「剩下五杯，也這樣裝。」' : '攤主：「我來備湯，你先送一杯試試。」',
        bird: '翠鳥替早班船送來了訂單。',
      };
      clearVoice();
      voiceKey = key;
      voice.textContent = messages[key];
      voice.hidden = false;
      position();
      voiceTimer = setTimeout(clearVoice, 3900);
    }
    function drawWords(s) {
      if (!book.classList.contains('breakfast-page')) return;
      const words = sentence(s),
        first = s.phase === 'closed' || s.phase === 'invited';
      const moving = s.phase === 'opening' || s.phase === 'riding';
      const dry = s.phase === 'landed' && s.height >= 0.78;
      if (line.textContent !== words) line.textContent = words;
      const label = first
        ? '送第一杯給船員'
        : moving
          ? '車子過橋中'
          : dry
            ? '看 ' + s.trips + ' 趟送餐單'
            : '扶高杯托，再送一次';
      if (action.textContent !== label) action.textContent = label;
      action.disabled = moving;
      $('#note-label').textContent = moving ? '試送途中' : dry ? '船員簽收' : '輪到你';
      const guide = first ? '點湯杯出發' : '往上拉杯托';
      cue.querySelector('span').textContent = guide;
      cue.dataset.label = guide;
      cue.dataset.show = String(!moving && !dry && s.phase !== 'folding' && !s.paper);
      if (cue.dataset.show !== 'true') cue.hidden = true;
      sleeve.setAttribute('aria-label', first ? '送第一杯給船員' : '扶高車籃裡的杯托，再試送一杯');
      lesson.hidden = !dry;
      again.hidden = s.phase !== 'landed';
      compare.hidden = s.phase !== 'landed' || dry;
      compare.setAttribute('aria-expanded', String(s.paper === 'compare'));
      if (dry) {
        action.setAttribute('aria-controls', 'breakfast-receipt');
        action.setAttribute('aria-expanded', String(s.paper === 'compare'));
      } else {
        action.removeAttribute('aria-controls');
        action.removeAttribute('aria-expanded');
      }
      $('#read-source').title = '唐心慧 Jennifer Tang〈AI for Growth〉，原刊第 7 頁';
    }
    function readState(s) {
      if (book.dataset.breakfastPhase !== s.phase) clearVoice();
      book.dataset.breakfastPhase = s.phase;
      book.dataset.breakfastBeat = s.beat;
      seal.dataset.stamped = String(s.stamped);
      seal.setAttribute('aria-label', s.stamped ? '翠鳥帶著蓋好試送印記的訂單' : '翠鳥的早餐訂單');
      if (!s.paper) {
        receipt.hidden = true;
        paperKey = '';
      }
      for (const el of [mark, ...buttons.filter((b) => b.hasAttribute('aria-controls'))]) {
        el.setAttribute(
          'aria-expanded',
          String(!!s.paper && (el.dataset.storyControl || 'order') === s.paper),
        );
      }
      drawWords(s);
      if (active) position();
    }
    function drawPrint(p) {
      for (const label of printNumbers) {
        const serial = String(
          label.dataset.bfRunNumber === 'carried' && p.delivery === 'first' ? 1 : p.trialNo,
        ).padStart(2, '0');
        if (label.textContent !== serial) label.textContent = serial;
      }
      const values = {
        invited: Number(p.phase === 'invited'),
        travel: p.travel,
        motion: Number(p.motion),
        'vendor-greet': p.greeting === 'vendor' ? p.greet : 0,
        'customer-greet': p.greeting === 'customer' ? p.greet : 0,
        'wet-response': Math.max(0, -p.response),
        'dry-response': Math.max(0, p.response),
        whistle: p.whistle,
        ripple: p.ripple,
        support: p.support,
        tilt: -p.tilt + 'rad',
        'bike-x': (p.travel - 1) * 86 + 'px',
        bump: -p.bump * 62 + 'px',
        flight: p.flight,
        bell: p.bellBeat,
        rain: p.rain,
        copy: p.copy,
        stain: p.stain,
        first: p.first,
        spill: p.spill,
        trial: p.trial,
        carry: Number(p.carry),
        transfer: p.transfer,
        'carried-stain': p.carriedStain,
        impact: p.impact,
        load: p.load,
        'inspect-first': p.paper === 'first' || p.paper === 'compare' ? p.inspect : 0,
        'inspect-trial': p.paper === 'trial' || p.paper === 'compare' ? p.inspect : 0,
        'inspect-order': p.paper === 'order' ? p.inspect : 0,
      };
      for (const [key, value] of Object.entries(values))
        paper.style.setProperty('--bf-' + key, String(value));
    }
    function paint(p) {
      book.dataset.sleeveHeight = p.support.toFixed(2);
      if (!flat.hidden) {
        drawPrint(p);
        position();
      }
      if (!p.motion) redraw();
    }
    const story = BreakfastStory.create({
      record,
      onTrial,
      onCheckpoint,
      onSound,
      onFrame: paint,
      onState: readState,
    });
    function preparePrint() {
      if (loadPrint) return;
      loadPrint = fetch('art/breakfast-print.svg?v=crew3')
        .then((r) => {
          if (!r.ok) throw Error('print');
          return r.text();
        })
        .then((xml) => {
          const svg = new DOMParser().parseFromString(xml, 'image/svg+xml').documentElement;
          if (svg.localName !== 'svg') throw Error('print');
          svg.setAttribute('aria-hidden', 'true');
          svg.setAttribute('focusable', 'false');
          paper.replaceChildren(document.importNode(svg, true));
          printNumbers = [...paper.querySelectorAll('[data-bf-run-number]')];
          paint(BreakfastStory.pose);
          position();
          redraw();
        })
        .catch(() => {
          loadPrint = null;
        });
    }
    // The paper flag points at the cup but must leave the other actors touchable.
    function placeGuide(points) {
      const at = points.sleeve;
      if (!at || cue.dataset.show !== 'true') {
        cue.hidden = true;
        return;
      }
      const width = book.clientWidth,
        small = width < 650;
      const tagWidth = small ? 74 : 86,
        tagHeight = small ? 24 : 28,
        reach = small ? 17 : 21;
      const prefer = at.x > width / 2 ? -1 : 1;
      let best = null;
      for (const dir of [prefer, -prefer])
        for (const up of [-1, 1]) {
          const x = at.x + dir * (reach + tagWidth / 2);
          const y = at.y + up * (reach - 8 + tagHeight / 2);
          let cost = x - tagWidth / 2 < 6 || x + tagWidth / 2 > width - 6 ? 10000 : 0;
          for (const key of [
            'bird',
            'customer',
            'vendor',
            'bell',
            'carried',
            'order',
            'first',
            'trial',
            'water',
          ]) {
            const p = points[key];
            if (!p) continue;
            const named = key === 'customer' || key === 'vendor';
            const dx = tagWidth / 2 + (named ? 34 : 15) - Math.abs(x - p.x);
            const dy = tagHeight / 2 + (named ? 28 : 16) - Math.abs(y - p.y + (named ? 13 : 0));
            cost += Math.max(0, dx) * Math.max(0, dy);
          }
          if (!best || cost < best.cost) best = { dir, up, cost };
        }
      cue.hidden = false;
      cue.style.left = at.x + 'px';
      cue.style.top = at.y + 'px';
      cue.classList.toggle('point-left', best.dir < 0);
      cue.classList.toggle('point-below', best.up > 0);
    }
    function position() {
      if (!active || controls.hidden || book.classList.contains('turning')) return;
      const printed = !flat.hidden,
        data = BreakfastStory.pose,
        box = printed ? paper.getBoundingClientRect() : null;
      const stageHits = printed ? null : hits(),
        points = {};
      for (const button of buttons) {
        const key = button.dataset.storyControl;
        if (
          (key === 'first' && !data.first) ||
          (key === 'trial' && !data.trial) ||
          (key === 'carried' && !data.carry)
        ) {
          button.hidden = true;
          continue;
        }
        let point;
        if (printed) {
          const rect = paper.querySelector('[data-breakfast-hit="' + key + '"]')?.getBoundingClientRect();
          const [rx, ry] = printedPositions[key];
          point = rect?.width
            ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            : { x: box.left + box.width * rx, y: box.top + box.height * ry };
        } else point = project(stageHits?.find((h) => h.action === 'breakfast:' + key));
        button.hidden = !point;
        if (!point) continue;
        button.style.transform =
          'translate3d(' + Math.round(point.x) + 'px,' + Math.round(point.y) + 'px,0) translate(-50%,-50%)';
        points[key] = point;
        if (key === 'vendor' || key === 'customer') {
          const shift = Math.max(0, 43 - point.x) - Math.max(0, point.x + 43 - book.clientWidth);
          button.style.setProperty('--bf-name-shift', shift + 'px');
        }
        if (key === voiceKey) {
          const half = voice.offsetWidth / 2;
          voice.style.left = Math.max(half + 8, Math.min(book.clientWidth - half - 8, point.x)) + 'px';
          voice.style.top = Math.max(72, point.y - (innerWidth < 650 ? 30 : 45)) + 'px';
        }
      }
      placeGuide(points);
    }
    function placeReceipt() {
      if (receipt.hidden) return;
      const width = book.clientWidth,
        height = book.clientHeight;
      const x = anchor?.x ?? width * 0.55,
        y = anchor?.y ?? height * 0.58;
      const w = receipt.offsetWidth,
        h = receipt.offsetHeight;
      const left = Math.max(12, Math.min(width - w - 12, x - w * 0.52));
      const top = Math.max(62, Math.min(height - h - 12, y - h + 4));
      receipt.style.left = left + 'px';
      receipt.style.top = top + 'px';
      receipt.style.setProperty('--receipt-ox', Math.max(10, Math.min(w - 10, x - left)) + 'px');
      receipt.style.setProperty('--receipt-oy', Math.max(10, Math.min(h, y - top)) + 'px');
    }
    function shut(restore = false) {
      if (!paperKey) return;
      const back = origin;
      story.inspect('');
      if (restore) (back?.isConnected && !back.hidden ? back : action).focus({ preventScroll: true });
    }
    function unfold(key, point, trigger) {
      if (!active) return;
      clearVoice();
      if (paperKey === key) {
        shut(true);
        return;
      }
      const p = BreakfastStory.pose,
        s = story.state(),
        inTransit = s.phase === 'opening' || s.phase === 'riding',
        deliveryHeight = inTransit ? s.target : s.height,
        dry = deliveryHeight >= 0.78;
      if ((key === 'trial' && !p.trial) || (key === 'first' && !p.first)) return;
      if (key === 'compare' && !s.tested) key = 'order';
      const wet =
        key === 'first' || (key === 'trial' && !dry) || (key === 'carried' && p.carriedStain > 0.08);
      const titles = {
        order: '早班船的訂單',
        first: '第一次試送',
        trial: '第 ' + p.trialNo + ' 趟試送',
        carried: '隨車送餐單',
        compare: '同一道橋縫，試送 ' + s.trips + ' 趟',
      };
      const notes = {
        order:
          s.phase === 'landed' && dry
            ? '第一杯穩穩送到了。攤主給另外五杯裝好同款杯托，這筆訂單可以上船了。'
            : '船上要六杯熱湯。一杯先上路，另外五杯在攤上等結果。',
        first: '杯托平放，杯子一顛就歪了。紙角上的湯漬，是這趟留下的。',
        trial: dry
          ? '紙托扶住杯底。走過原來的橋縫，這張單子還是乾的。'
          : deliveryHeight > 0
            ? '杯托扶高了一點，角落還有一小圈湯漬。'
            : '杯托放平了。走過原來的橋縫，單子又濕了。',
        carried: wet
          ? '車輪剛才一顛，湯濺在這張隨車的單子上。'
          : '這張單和湯杯放在同一個車籃，會跟著這一杯過橋。',
        compare: dry
          ? '先送一杯，看湯漬改杯托，再送整批。試一次，下一次就有根據。'
          : '單子上留著每趟的湯漬。再把杯托扶高一點，看看下一趟會怎樣。',
      };
      origin = trigger instanceof HTMLElement ? trigger : action;
      anchor = point;
      paperKey = key;
      story.inspect(key);
      receipt.dataset.kind = key;
      receipt.dataset.wet = String(wet);
      $('#receipt-title').textContent = titles[key];
      $('#receipt-note').textContent = notes[key];
      $('#receipt-item').textContent = key === 'order' ? '訂購熱湯' : '試送熱湯';
      $('#receipt-quantity').textContent = key === 'order' ? '6 杯' : '1 杯';
      const amount = key === 'first' ? 1 : key === 'carried' ? p.carriedStain : p.stain;
      receipt.style.setProperty('--wet-scale', String(0.28 + 0.72 * amount));
      if (key === 'compare') {
        const row = $('#receipt-runs'),
          pages = document.createDocumentFragment();
        for (const [i, stain] of story.deliveries().entries()) {
          const item = document.createElement('li'),
            mini = document.createElement('i'),
            label = document.createElement('span');
          mini.className = stain > 0 ? 'receipt-mini wet' : 'receipt-mini';
          mini.dataset.no = String(i + 1).padStart(2, '0');
          mini.setAttribute('aria-hidden', 'true');
          mini.style.setProperty('--wet-scale', String(0.28 + 0.72 * stain));
          label.textContent = stain === 0 ? '單子乾了' : stain < 0.55 ? '小片湯漬' : '大片湯漬';
          item.setAttribute('aria-label', '第 ' + (i + 1) + ' 趟，' + label.textContent);
          item.append(mini, label);
          pages.append(item);
        }
        row.replaceChildren(pages);
        row.scrollTop = 0;
      }
      const replay = key === 'first' ? 'first' : key === 'trial' ? 'trial' : '';
      watch.dataset.replay = replay;
      watch.textContent = replay === 'first' ? '重看第一趟' : replay === 'trial' ? '重看這次試送' : '';
      watch.hidden = !replay || !p.motion || inTransit;
      original.hidden = key !== 'compare';
      receipt.hidden = false;
      placeReceipt();
      receipt.focus({ preventScroll: true });
      if (window.BreakfastStory.pose.motion && receipt.animate)
        receipt.animate(
          [
            { transform: 'scale(.35) rotate(-5deg)', opacity: 0.5 },
            { transform: 'scale(1) rotate(0)', opacity: 1 },
          ],
          { duration: 230, easing: 'cubic-bezier(.2,.77,.3,1)' },
        );
      onSound('page');
    }
    function interact(key, point, trigger) {
      if (!active) return;
      if (key === 'sleeve') {
        clearVoice();
        shut();
        story.tap();
        return;
      }
      const kind = key === 'beak' ? 'order' : key;
      if (['order', 'first', 'trial', 'carried', 'compare'].includes(kind)) {
        unfold(kind, point, trigger);
        return;
      }
      shut();
      if (['customer', 'vendor', 'bird'].includes(kind)) speak(kind);
      story.ambient(kind);
    }
    function pointOf(el) {
      const b = el.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    }
    function compareReceipts(trigger) {
      const latest = controls.querySelector('[data-story-control="trial"]');
      interact('compare', pointOf(latest.hidden ? trigger : latest), trigger);
    }
    compare.addEventListener('click', () => compareReceipts(compare));
    action.addEventListener('click', () => {
      const s = story.state();
      if (s.phase === 'landed' && s.height >= 0.78) {
        compareReceipts(action);
      } else interact('sleeve');
    });
    again.addEventListener('click', () => {
      clearVoice();
      shut();
      story.restart();
      position();
      action.focus({ preventScroll: true });
    });
    mark.addEventListener('click', () => interact('order', pointOf(mark), mark));
    close.addEventListener('click', () => shut(true));
    original.addEventListener('click', () => {
      shut();
      $('#read-source').click();
    });
    watch.addEventListener('click', () => {
      const which = watch.dataset.replay;
      shut(true);
      story.replay(which);
    });
    document.addEventListener(
      'keydown',
      (e) => {
        if (paperKey && e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          shut(true);
        }
      },
      true,
    );
    function activate(value) {
      if (!value) {
        clearVoice();
        shut();
        cue.hidden = true;
        lesson.hidden = true;
        again.hidden = true;
        compare.hidden = true;
      }
      active = value;
      controls.hidden = !value;
      if (active && !flat.hidden) preparePrint();
      story.activate(value);
      position();
      if (value) {
        drawWords(story.state());
        position();
      }
    }
    const observer = new ResizeObserver(() => {
      if (!flat.hidden) position();
      placeReceipt();
    });
    observer.observe(book);
    return {
      story,
      activate,
      preparePrint,
      position,
      interact,
      shut,
      describe: () => drawWords(story.state()),
    };
  }
  window.BreakfastControls = { mount };
})();
