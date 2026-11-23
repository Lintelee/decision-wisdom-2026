(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const book = $('#book-room'),
    world = $('#paper-world'),
    dialog = $('#atlas-dialog'),
    panel = $('#decision-desk');
  const cover = $('#book-cover');
  let readFromCover = false;
  cover.querySelector('[href="#read"]').addEventListener('click', () => { readFromCover = true; });
  const slider = $('#page-slider'),
    caption = $('#line'),
    cue = $('#prop-cue'),
    sheet = $('#game-sheet .dg-desk');
  const { list: items, articles, rules } = window.DecisionGames;
  const count = items.length,
    last = count - 1;
  const editorial = window.AtlasEditorial;
  const regions = {
    prologue: {
      name: '卷首工作室',
      en: 'Prologue',
      pages: '6–17',
      accent: '#d5c5ef',
      question: 'Jennifer 和 Freda 從兩個問題出發。怎麼試出值得做的事？怎麼聽見人的需要？',
    },
    people: {
      name: '人心採集場',
      en: 'People Land',
      pages: '20–93',
      accent: '#c9de70',
      question: '當內容越來越容易生成，什麼讓人相信、參與，甚至在一年後還記得？',
    },
    model: {
      name: '假設試驗場',
      en: 'Model Land',
      pages: '96–149',
      accent: '#f0c4c8',
      question: '把樣本、訊息或預算換掉一個，結論還站得住腳嗎？在這裡，每個模型都可以被追問。',
    },
    ai: {
      name: '代理調度台',
      en: 'AI Land',
      pages: '152–195',
      accent: '#86d2e1',
      question: '從回答問題到辦好一件事，資料、系統和人的同意，哪一步能交給代理？',
    },
  };
  const staging = {
    growth: {
      by: 'Jennifer Tang 唐心慧 · AI for Growth',
      site: '港邊早餐車',
      line: '早班船等著六杯熱湯，攤主先送一杯試路。',
      first: 'step1',
      reels: [['step0'], ['step1'], ['step2']],
    },
    distance: {
      by: 'Freda Shao 邵懿文 · 品牌與人的真實距離',
      site: '雨天月台',
      line: '雨傘滴著水，公車已經進站。轉過採訪椅，聽聽她此刻最在意什麼。',
      first: 'ask1',
      reels: [['seat0', 'ask0'], ['ask1'], ['pick0']],
    },
    witness: {
      by: 'People · 真實、查證與社群信任',
      site: '林間編輯台',
      line: '一張終點線照片在社群流傳。報導只能附兩份材料，你願意為哪個標題負責？',
      first: 'doc0',
      reels: [['doc2'], ['doc2', 'doc0'], ['doc1']],
    },
    memory: {
      by: 'People · 注意力與共同記憶',
      site: '第七局球場',
      line: '今年第一次進場的孩子，明年還能教朋友做什麼？敲一下那面應援鼓。',
      first: 'role1',
      reels: [['time1'], ['role1'], ['year1']],
    },
    persona: {
      by: 'Model · People Model 獨立專題',
      site: '園遊會水壺攤',
      line: '阿晴拉著公車吊環，另一隻手想開水壺。點一下她的紙人，沿著摺痕找回這句回答。',
      first: 'person0',
      reels: [['person0'], ['copy0', 'run'], ['copy1', 'run']],
    },
    context: {
      by: 'Model · 選擇場域與人的衡斷',
      site: '衡量市集',
      line: '桌上只有三枚預算籌碼。先讀現場筆記，再把它們放到人做決定的地方。',
      first: 'plus0',
      reels: [['market0'], ['plus0', 'plus0', 'plus1'], ['market1']],
    },
    friction: {
      by: 'AI · 顧客猶豫與體驗治理',
      site: '取貨郵局',
      line: '禮物選好了，客人卻在取貨前停下。沿著輸送帶查查她遇見哪個斷點。',
      first: 'stop0',
      reels: [['stop0'], ['stop1', 'stop2'], ['fix1']],
    },
    signal: {
      by: 'AI · 代理體驗與情境搜尋',
      site: '晨禾旅店到車站',
      line: '06:45，你提著早餐走到街角。地圖推薦五分鐘的百貨近路，推推看，這扇門開了嗎？',
      first: 'gate',
      reels: [['gate'], ['street'], ['stroller', 'ask']],
    },
    permission: {
      by: 'AI · 品牌交付與代理授權',
      site: '夜間書店',
      line: '寫卡、列書單、送出訂單。三把鑰匙交出去以前，先決定哪一步要等人點頭。',
      first: 'job2',
      reels: [
        ['spec0', 'job0', 'level0'],
        ['spec1', 'job1', 'level2'],
        ['job2', 'level1'],
      ],
    },
  };
  const icon = (name) => '<svg aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  const pad = (n) => String(n).padStart(2, '0');
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const saved = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem('decision-atlas-v1-' + key)) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const save = (key, value) => {
    try {
      localStorage.setItem('decision-atlas-v1-' + key, JSON.stringify(value));
    } catch {}
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let motion = saved('motion', true) && !reduced.matches,
    sound = saved('paper-sound', false) === true;
  const completedList = saved('completed', []),
    completed = new Set(
      Array.isArray(completedList) ? completedList.filter((id) => items.some((g) => g.id === id)) : [],
    );
  const sessions = new Map(),
    autoSeen = new Set();
  const findings = new Set(Array.isArray(saved('findings', [])) ? saved('findings', []) : []);
  const landEls = [...document.querySelectorAll('#lands .land')];
  const slip = $('#field-slip');
  let autoTimer = 0,
    pinItems = [],
    slipOrigin = null,
    lastLand = '';
  const landOrder = Object.keys(regions);
  function setLandscape(a, b = a, t = 0) {
    const region = t < 0.5 ? a : b;
    landEls.forEach((el, index) => {
      const key = landOrder[index];
      el.style.opacity = key === a && key === b ? 1 : key === a ? 1 - t : key === b ? t : 0;
    });
    if (lastLand !== region) {
      lastLand = region;
      document.body.dataset.land = region;
      document.body.style.setProperty('--accent', regions[region].accent);
    }
  }
  let volume = null,
    frame = 0,
    tween = null,
    fold = 0,
    current = 0,
    selectedCue = null,
    hovered = null,
    pointer = null;
  let visible = true,
    mapRegion = 'prologue',
    readerOrigin = '#game/growth',
    returnDesk = false,
    initialized = false;
  let demo = null,
    demoTimer = 0,
    audio = null,
    settling = false;
  $('.tick-marks').innerHTML = items.map(() => '<i></i>').join('');

  function currentItem() {
    return items[current];
  }
  function session(index = current) {
    const id = items[index].id;
    if (!sessions.has(id))
      sessions.set(id, { data: rules[id].initial(), result: null, feedback: '', action: '' });
    return sessions.get(id);
  }
  function playSound(kind) {
    if (!sound) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume().catch(() => {});
      const now = audio.currentTime,
        gain = audio.createGain();
      gain.connect(audio.destination);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(kind === 'page' ? 0.045 : 0.068, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'page' || kind === 'ferry' ? 0.32 : 0.14));
      if (kind === 'page') {
        const data = audio.createBuffer(1, Math.round(audio.sampleRate * 0.34), audio.sampleRate),
          samples = data.getChannelData(0);
        for (let i = 0; i < samples.length; i++)
          samples[i] = (Math.random() * 2 - 1) * (0.35 + 0.65 * Math.sin(i * 0.0013) ** 2);
        const source = audio.createBufferSource(),
          filter = audio.createBiquadFilter();
        source.buffer = data;
        filter.type = 'bandpass';
        filter.frequency.value = 1600;
        filter.Q.value = 0.68;
        source.connect(filter);
        filter.connect(gain);
        source.start(now);
        source.onended = () => {
          source.disconnect();
          filter.disconnect();
          gain.disconnect();
        };
      } else {
        const tone = audio.createOscillator();
        tone.type = kind === 'rim' || kind === 'ferry' ? 'triangle' : 'sine';
        const pitches = { finish: [660, 840], drum: [148, 58], rim: [620, 348], bell: [1580, 1180], ferry: [219, 183] };
        const [strike, release] = pitches[kind] || [375, 260];
        tone.frequency.setValueAtTime(strike, now);
        tone.frequency.exponentialRampToValueAtTime(release, now + 0.1);
        tone.connect(gain);
        tone.start(now);
        tone.stop(now + (kind === 'ferry' ? 0.32 : 0.16));
        tone.onended = () => {
          tone.disconnect();
          gain.disconnect();
        };
      }
    } catch {
      /* Sound is optional on browsers with restricted audio. */
    }
  }
  function reflectSound() {
    $('#audio').innerHTML = icon(sound ? 'audio' : 'muted');
    $('#audio').setAttribute('aria-pressed', String(sound));
    $('#audio').setAttribute('aria-label', sound ? '關閉紙張音效' : '開啟紙張音效');
    $('#audio').title = sound ? '關閉紙張音效' : '開啟紙張音效';
  }
  $('#audio').onclick = () => {
    sound = !sound;
    save('paper-sound', sound);
    reflectSound();
    if (sound) playSound('page');
  };
  function sources(item) {
    return item.articles
      .map((n) => {
        const [title, author, pages] = articles[n];
        return (
          '<a href="#read/' +
          n +
          '"><span>' +
          title +
          '</span><small>' +
          author +
          ' · 原刊 p.' +
          pages +
          '</small></a>'
        );
      })
      .join('');
  }
  function renderDesk() {
    const item = currentItem(),
      record = session();
    $('#desk-title').textContent = editorial[item.id].headline;
    $('#desk-question').textContent = editorial[item.id].briefing || item.question;
    $('#game-sheet').className = 'dg-game dg-' + item.region;
    if (record.result) {
      sheet.innerHTML =
        '<div class="dg-result"><small>你的決策結果</small><h2></h2><p></p><button type="button" class="dg-btn" data-act="retry">換個做法再試</button></div>';
      sheet.querySelector('h2').textContent = record.result[0];
      sheet.querySelector('p').textContent = record.result[1];
    } else sheet.innerHTML = rules[item.id].render(record.data);
    const entry = editorial[item.id];
    const inspect = (label, action, visited) =>
      '<button type="button" data-inspect="' +
      action +
      '">' +
      label +
      '<small>' +
      (visited ? '已讀' : '打開') +
      '</small></button>';
    const index = entry.finds
      .map((f, i) => inspect(f.label, 'find:' + i, findings.has(item.id + ':' + i)))
      .join('');
    const next = current < last ? items[current + 1].id : items[0].id;
    $('#sheet-sources').innerHTML =
      (record.result
        ? '<p class="bridge">' +
          entry.bridge +
          ' <a href="#game/' +
          next +
          '">' +
          (current === last ? '重回卷首' : '翻到下一景') +
          '</a></p>'
        : '') +
      '<section class="explore-register"><h3>紙上物件</h3>' +
      index +
      inspect('採訪手記 · 查原文', 'evidence', false) +
      '</section><h3>延伸閱讀</h3>' +
      sources(item);
  }
  const playMat = $('#play-mat'),
    playHost = playMat.querySelector('.play-sheet');
  let playInstance = null,
    worldMap = null,
    usedCorner = saved('turned-corner', false);
  const grips = [...book.querySelectorAll('[data-edge]')];
  function positionGrips() {
    if (!visible || settling || dialog.open || !panel.hidden || !playMat.hidden || !slip.hidden) return;
    const width = book.clientWidth,
      height = book.clientHeight;
    const illustration =
      world.hidden && currentItem().id === 'growth' ? $('#breakfast-print svg')?.getScreenCTM() : null;
    const corners =
      volume && !world.hidden
        ? volume.pageCorners()
        : illustration
          ? [
              [142, 281],
              [956, 229],
              [1054, 486],
              [46, 522],
            ].map(([x, y]) => new DOMPoint(x, y).matrixTransform(illustration))
          : [
              { x: width * 0.13, y: height * 0.44 },
              { x: width * 0.87, y: height * 0.44 },
              { x: width * 0.96, y: height * 0.72 },
              { x: width * 0.04, y: height * 0.72 },
            ];
    grips.forEach((b, i) => {
      const near = corners[i ? 2 : 3],
        far = corners[i ? 1 : 0],
        v = illustration ? 0.97 : 0.82;
      b.hidden = i ? current === last : current === 0;
      b.style.left = clamp(far.x + (near.x - far.x) * v + (i ? -9 : 9), 25, width - 25) + 'px';
      b.style.top = clamp(far.y + (near.y - far.y) * v, 95, height - 90) + 'px';
      b.classList.toggle('first-corner', i === 1 && !usedCorner && current === 0);
    });
  }
  function closePlay(focus = true) {
    if (playMat.hidden) return;
    playInstance?.destroy();
    playInstance = null;
    playHost.replaceChildren();
    playMat.hidden = true;
    book.classList.remove('playing');
    for (const node of book.children) if (node !== playMat) node.inert = false;
    if (focus) $('#try-station').focus({ preventScroll: true });
    refreshMarker();
    positionGrips();
  }
  function showPlayResult() {
    playInstance?.destroy();
    playInstance = null;
    const result = session().result;
    playHost.innerHTML =
      '<section class="ap-replay"><h2></h2><p></p><button type="button" data-result="read">讀這篇原文</button><button type="button" data-result="retry">重玩這一站</button><button type="button" data-result="close">回到書頁</button></section>';
    playHost.querySelector('h2').textContent = result[0];
    playHost.querySelector('p').textContent = result[1];
    playHost.querySelector('button').focus({ preventScroll: true });
  }
  function openPlay() {
    if (settling || !visible) return;
    stopDemo();
    closeSlip();
    if (!panel.hidden) setDesk(false, false);
    playMat.hidden = false;
    book.classList.add('playing');
    for (const node of book.children) if (node !== playMat) node.inert = true;
    if (session().result) {
      showPlayResult();
      return;
    }
    playInstance = AtlasPlay.mount(playHost, {
      id: currentItem().id,
      motion,
      getState: () => session().data,
      onBeat: (index) => playSound(index === 1 ? 'rim' : 'drum'),
      onAct(action) {
        if (!allowed(action)) return false;
        perform(action);
        return true;
      },
      onRead({ article, page }) { location.hash = 'read/' + article + '/p/' + page; },
      onDone() {
        if (!allowed('commit')) return false;
        perform('commit');
        showPlayResult();
        return true;
      },
      onClose: () => closePlay(),
    });
    playHost.querySelector('h2').tabIndex = -1;
    playHost.querySelector('h2').focus({ preventScroll: true });
  }
  $('#try-station').onclick = openPlay;
  playMat.addEventListener('click', (e) => {
    if (e.target === playMat) closePlay();
    const act = e.target.closest('[data-result]')?.dataset.result;
    if (act === 'retry') {
      perform('retry');
      openPlay();
    }
    if (act === 'read') {
      const source = rules[currentItem().id].source?.(session().data);
      if (source) location.hash = 'read/' + source.article + '/p/' + source.page;
      else readSources();
    }
    if (act === 'close') closePlay();
  });
  playMat.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !e.defaultPrevented) {
      e.preventDefault();
      e.stopPropagation();
      closePlay();
    }
    if (e.key === 'Tab') {
      const vs = [
        ...playHost.querySelectorAll('button:not(:disabled),input:not(:disabled),summary,[tabindex="0"]'),
      ].filter((el) => el.getClientRects().length);
      if (
        vs.length &&
        ((e.shiftKey && document.activeElement === vs[0]) ||
          (!e.shiftKey && document.activeElement === vs.at(-1)))
      ) {
        e.preventDefault();
        (e.shiftKey ? vs.at(-1) : vs[0]).focus();
      }
    }
  });
  function setLine(label, text) {
    $('#note-label').textContent = label;
    caption.textContent = text;
  }
  function setDesk(open, focus = true) {
    if (open) closeSlip();
    panel.hidden = !open;
    book.classList.toggle('desk-open', open);
    $('#desk-toggle').setAttribute('aria-expanded', String(open));
    volume?.panel(open);
    if (open) {
      stopDemo();
      renderDesk();
      if (focus) $('#close-desk').focus({ preventScroll: true });
    } else if (focus) $('#desk-toggle').focus({ preventScroll: true });
    paperChoices();
    refreshMarker();
  }
  $('#desk-toggle').onclick = () => setDesk(panel.hidden);
  $('#close-desk').onclick = () => setDesk(false);
  function allowed(action) {
    if (action === 'demo' || action === 'desk' || action === 'evidence' || action?.startsWith('find:'))
      return true;
    if (session().result) return false;
    const control = sheet.querySelector('[data-act="' + action + '"]');
    return Boolean(control && !control.disabled);
  }
  function suggestedAction() {
    const item = currentItem(),
      s = session().data,
      backup = staging[item.id].first;
    if (session().result) return null;
    switch (item.id) {
      case 'growth':
        return s.learning ? (s.improved ? null : 'step2') : backup;
      case 'distance':
        return s.seen ? (s.feature < 0 ? 'pick0' : null) : backup;
      case 'witness':
        return s.picks.length >= 2 ? null : s.picks.includes(0) ? 'doc1' : 'doc0';
      case 'memory':
        return s.role < 0 ? 'role1' : s.moment < 0 ? 'time1' : s.returner < 0 ? 'year1' : null;
      case 'persona':
        if (s.followup) return 'commit';
        if (s.asked) return 'survey';
        if (!s.opened.length) return 'person0';
        if (s.report !== s.copy) return 'run';
        if (s.tested.length < 2) return s.copy === 0 ? 'copy1' : 'copy0';
        return 'field' + s.copy;
      case 'context':
        return s.tokens.reduce((a, b) => a + b, 0) === 3 ? 'commit' : 'plus' + s.market;
      case 'friction':
        return !s.seen.length ? 'stop0' : s.seen.length < 2 ? 'stop1' : s.fix < 0 ? 'fix1' : null;
      case 'signal':
        if (!s.gateTried && !s.streetTried) return 'gate';
        if (s.route !== 'street') return 'street';
        return rules.signal.itinerary(s).status === 'unknown' ? 'ask' : 'commit';
      case 'permission': {
        const next = s.levels.findIndex((level) => level < 0);
        return !session().action ? 'job2' : next >= 0 ? 'job' + next : null;
      }
      default:
        return backup;
    }
  }
  const handVerbs = {
    step0: '畫一款包',
    step1: '找真人試背',
    step2: '替包加上外袋',
    ask1: '換個問法',
    pick0: '試單手收傘',
    doc0: '調出原始連拍',
    doc1: '聽跑者錄音',
    role1: '敲應援鼓',
    time1: '選第七局',
    year1: '把節奏留到明年',
    run: '掛上這張水壺招牌',
    copy0: '換成單手開蓋',
    copy1: '換成能裝一整天的水',
    desk: '調整研究條件',
    stop0: '跟著包裹走',
    stop1: '聽客人問什麼',
    fix1: '補上取貨日',
    gate: '推一推百貨鐵門',
    street: '改走大路去月台',
    job0: '分配寫卡權限',
    job1: '分配書單權限',
    job2: '分配下單權限',
    plus0: '投一枚給通路',
    plus1: '投一枚給社群',
    plus2: '投一枚給品牌記憶',
  };
  function directControl() {
    const b = $('#quick-act'),
      s = session(),
      item = currentItem();
    const action = suggestedAction();
    b.hidden = false;
    if (s.result) {
      b.dataset.act = 'continue';
      b.textContent = current === last ? '回到群島地圖' : '帶著問題翻頁';
      b.title = editorial[item.id].bridge;
      return;
    }
    b.title = '';
    b.dataset.act = action || '';
    b.hidden =
      !action ||
      action === 'commit' ||
      !allowed(action) ||
      (item.id === 'permission' && s.action.startsWith('job'));
    if (!b.hidden) b.textContent = handVerbs[action] || editorial[item.id].roles[action]?.label || '試試這件事';
  }
  $('#quick-act').onclick = () => {
    const action = $('#quick-act').dataset.act;
    if (action === 'continue') {
      if (current === last) showMap();
      else step(1);
    } else perform(action);
  };
  function refreshMarker() {
    if (currentItem().id === 'growth') {
      selectedCue = null;
      cue.hidden = true;
      $('#discovery-pins').hidden = true;
      return;
    }
    const hits = volume?.hits() || [];
    const demoAction = demo && staging[currentItem().id].reels[demo.step].at(-1);
    selectedCue =
      !volume ||
      world.hidden ||
      !visible ||
      !panel.hidden ||
      dialog.open ||
      settling ||
      !volume.still() ||
      !slip.hidden
        ? null
        : hovered &&
            hits.includes(hovered) &&
            allowed(hovered.action) &&
            !['evidence', 'find:0', 'find:1'].includes(hovered.action)
          ? hovered
          : (demo && hits.find((hit) => hit.action === demoAction)) ||
            hits.find((hit) => hit.action === suggestedAction());
    if (!selectedCue) {
      cue.hidden = true;
      volume?.marker(null);
    } else {
      cue.querySelector('span').textContent = selectedCue.label;
      cue.setAttribute('aria-label', selectedCue.label);
      volume.marker(selectedCue);
    }
    $('#discovery-pins').hidden = !visible || settling || !panel.hidden || dialog.open || !slip.hidden;
  }
  function rebuildPins() {
    if (currentItem().id === 'growth') {
      pinItems = [];
      $('#discovery-pins').replaceChildren();
      $('#discovery-pins').hidden = true;
      return;
    }
    const entry = editorial[currentItem().id];
    const data = [
      ['find:0', entry.finds[0].label],
      ['find:1', entry.finds[1].label],
      ['evidence', '採訪手記'],
    ];
    const container = $('#discovery-pins');
    container.replaceChildren();
    pinItems = data.map(([action, label], i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'object-pin' + (i === 2 ? ' evidence' : '');
      button.classList.toggle('found', i < 2 && findings.has(currentItem().id + ':' + i));
      button.setAttribute('aria-label', (i === 2 ? '查原文 · ' : '探索 · ') + label);
      const point = document.createElement('i'),
        name = document.createElement('span');
      point.innerHTML = i === 2 ? icon('book') : button.classList.contains('found') ? icon('check') : '+';
      name.textContent = label;
      button.append(point, name);
      button.onclick = () => inspectObject(action, button);
      container.append(button);
      return { button, hit: volume?.hits().find((h) => h.action === action), i };
    });
    placePins();
  }
  function placePins() {
    if ($('#discovery-pins').hidden || !visible || !panel.hidden || settling || !slip.hidden) return;
    for (const { button, hit, i } of pinItems) {
      let point;
      if (volume && !world.hidden) point = volume.project(hit);
      else {
        const size = Math.min(book.clientWidth / 1200, book.clientHeight / 760);
        const pin =
          window.AtlasPlatePins?.[currentItem().id]?.[i] ||
          [
            [0.22, 0.59],
            [0.77, 0.51],
            [0.54, 0.68],
          ][i];
        point = {
          x: (book.clientWidth - 1200 * size) / 2 + pin[0] * 1200 * size,
          y: (book.clientHeight - 760 * size) / 2 + pin[1] * 760 * size,
        };
      }
      button.hidden = !point;
      if (point)
        button.style.transform =
          'translate3d(' +
          Math.round(clamp(point.x - 15, 3, book.clientWidth - 38)) +
          'px,' +
          Math.round(clamp(point.y - 15, 58, book.clientHeight - 106)) +
          'px,0)';
    }
  }
  function positionMarker(point) {
    positionGrips();
    if (currentItem().id === 'growth') {
      breakfast.position();
      cue.hidden = true;
      return;
    }
    placePins();
    if (!point || !selectedCue || !visible || !panel.hidden || dialog.open || settling || !slip.hidden) {
      cue.hidden = true;
      return;
    }
    cue.hidden = false;
    const x = clamp(point.x - 9, 4, book.clientWidth - cue.offsetWidth - 6);
    const y = clamp(point.y - 13, 50, book.clientHeight - 68);
    cue.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(y) + 'px,0)';
  }
  function closeSlip(restore = false) {
    if (slip.hidden) return;
    slip.hidden = true;
    if (restore)
      (slipOrigin?.isConnected && !slipOrigin.hidden ? slipOrigin : $('#desk-toggle')).focus({
        preventScroll: true,
      });
    slipOrigin = null;
    refreshMarker();
  }
  function inspectObject(action, origin) {
    if (!visible || settling) return;
    stopDemo();
    if (!panel.hidden) setDesk(false, false);
    const item = currentItem(),
      entry = editorial[item.id];
    const evidence = action === 'evidence',
      idx = Number(action.slice(5));
    const discovery = entry.finds[idx];
    if (!evidence && !discovery) return;
    const source = (!evidence && discovery.source) || entry.source;
    slipOrigin = origin || null;
    slip.hidden = false;
    slip.dataset.action = action;
    const article = DecisionArticles.find((a) => a.n === source.article);
    $('#slip-kicker').textContent = evidence ? '採訪手記 · 原刊摘句' : staging[item.id].site + ' · 現場發現';
    if (!evidence)
      $('#slip-kicker').textContent +=
        '　' + entry.finds.filter((_, i) => i === idx || findings.has(item.id + ':' + i)).length + ' / 2';
    $('#slip-title').textContent = evidence ? '〈' + article.title + '〉' : discovery.label;
    $('#slip-text').textContent = evidence ? '「' + source.quote + '」' : discovery.detail;
    const link = document.createElement('a');
    link.href = '#read/' + source.article + '/p/' + source.page;
    link.textContent = evidence
      ? article.authors.map((a) => a.zh || a.en).join('、') + ' · 讀原刊 p.' + source.page
      : '對照這一景的原文 · p.' + source.page;
    $('#slip-links').replaceChildren(link);
    if (!evidence) {
      findings.add(item.id + ':' + idx);
      save('findings', [...findings]);
      rebuildPins();
      renderDesk();
      slipOrigin = pinItems[idx]?.button || null;
    }
    volume?.react(action);
    playSound('tap');
    refreshMarker();
    $('#slip-close').focus({ preventScroll: true });
  }
  $('#slip-close').onclick = () => closeSlip(true);
  $('#sheet-sources').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-inspect]');
    if (b) inspectObject(b.dataset.inspect, b);
  });
  window.addEventListener('resize', () => {
    placePins();
    positionGrips();
  });
  function paperChoices() {
    const box = $('#paper-choices'),
      s = session(),
      id = currentItem().id;
    let keys = [];
    if (id === 'permission' && s.action.startsWith('job')) keys = ['level0', 'level1', 'level2'];
    if (id === 'distance' && s.action.startsWith('ask')) keys = ['pick0', 'pick1', 'pick2'];
    if (id === 'persona' && s.action === 'run')
      keys = s.data.tested.length === 1 ? [s.data.copy ? 'copy0' : 'copy1', 'reveal'] : ['field0', 'field1', 'scope1'];
    if (id === 'persona' && ['reveal', 'cover', 'fresh'].includes(s.action))
      keys = ['scope1', ...(s.action === 'reveal' ? ['cover'] : [])];
    if (id === 'signal' && s.action === 'street') keys = ['notice', 'stroller'];
    if (id === 'signal' && ['notice', 'stroller'].includes(s.action)) keys = ['street', 'ask'];
    if (id === 'friction' && s.action.startsWith('stop') && s.data.seen.length >= 2)
      keys = ['fix0', 'fix1', 'fix2'];
    box.hidden = Boolean(demo || s.result || !keys.length || !panel.hidden);
    box.replaceChildren();
    if (!box.hidden)
      for (const key of keys) {
        const control = sheet.querySelector('[data-act="' + key + '"]');
        if (!control) continue;
        const b = document.createElement('button');
        b.type = 'button';
        b.dataset.choice = key;
        b.textContent = control.textContent;
        box.append(b);
      }
  }
  $('#paper-choices').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-choice]');
    if (b) perform(b.dataset.choice);
  });
  function paintCaption() {
    const item = currentItem(),
      s = session(),
      info = staging[item.id];
    $('#folio-region').textContent = regions[item.region].name + ' · ' + regions[item.region].en.toUpperCase();
    $('#folio-range').textContent = '第 ' + pad(current + 1) + ' 景';
    $('#chapter-title').textContent = editorial[item.id].headline;
    const breakfastPage = item.id === 'growth';
    $('#breakfast-action').hidden = !breakfastPage;
    $('#breakfast-order-mark').hidden = !breakfastPage;
    $('#read-source').innerHTML = icon('book') + (breakfastPage ? '讀這一頁' : '讀本景原文');
    if (breakfastPage) {
      $('#folio-region').textContent = '卷首 · 港邊早餐車';
      $('#chapter-title').textContent = '先送一杯，能學到什麼？';
      $('#chapter-attribution').textContent = '';
      $('#gesture-hint').textContent = '你是送餐員。翠鳥帶來早班船的訂單，攤主備好了六杯熱湯。';
      $('#note-label').textContent = '';
      breakfast.describe();
      refreshMarker();
      return;
    }
    $('#breakfast-lesson').hidden = true; $('#breakfast-again').hidden = true; $('#breakfast-compare').hidden = true;
    $('#read-source').removeAttribute('title');
    const source = editorial[item.id].source;
    $('#chapter-attribution').textContent =
      item.articles.length > 1
        ? '取材自〈' + articles[source.article][0] + '〉等 ' + item.articles.length + ' 篇'
        : item.id === 'persona'
          ? 'People Model 專題 · 陳介立、孫郁喬、高靖萍'
          : info.by;
    $('#gesture-hint').textContent = editorial[item.id].thesis;
    if (!demo) {
      const label = s.result
        ? '決策手記 · 已完成'
        : info.site + ' / ' + (item.id === 'growth' ? '剩 ' + s.data.days + ' 天' : '場景手記');
      setLine(label, s.result ? s.result[0] + '。' + editorial[item.id].bridge : s.feedback || info.line);
    }
    const submit = sheet.querySelector('[data-act=commit]'),
      inline = $('#finish-here');
    inline.hidden = Boolean(demo || s.result || !s.action || !submit || submit.disabled);
    if (!inline.hidden) inline.textContent = submit.textContent;
    $('#desk-toggle').lastChild.textContent = s.result ? '回顧結果' : '全部做法';
    directControl();
    paperChoices();
    refreshMarker();
  }
  function feedback(item, s, action) {
    if (item.id === 'growth') return s.log.at(-1);
    if (item.id === 'distance') return sheet.querySelector('.dg-note p')?.textContent;
    if (item.id === 'witness')
      return (
        sheet.querySelector('.dg-note:last-of-type p')?.textContent ||
        sheet.querySelectorAll('.dg-note p')[1]?.textContent
      );
    if (rules[item.id].feedback) return rules[item.id].feedback(s);
    if (item.id === 'friction' && action.startsWith('stop'))
      return sheet.querySelector('.dg-note p')?.textContent;
    if (item.id === 'context')
      return (
        sheet.querySelector('.dg-note p')?.textContent +
        ' 桌上還有 ' +
        (3 - s.tokens.reduce((a, b) => a + b, 0)) +
        ' 枚籌碼。'
      );
    if (item.id === 'permission' && action.startsWith('job'))
      return (
        ['這把鑰匙交給推薦卡。', '這把鑰匙交給整理書單。', '這把鑰匙能送出訂單。'][s.job] +
        '選擇這項任務可以執行到哪一步。'
      );
    const role = editorial[item.id].roles[action];
    if (role) return role.detail;
    const selected = sheet.querySelector('[data-act="' + action + '"]');
    return selected
      ? '已選「' + selected.innerText.trim().replace(/\s+/g, ' ') + '」。' + item.question
      : staging[item.id].line;
  }
  function perform(action, fromSheet = false) {
    if (!visible || settling) return;
    if (action === 'evidence' || action.startsWith('find:')) {
      inspectObject(action);
      return;
    }
    closeSlip();
    if (action === 'demo') {
      startDemo();
      return;
    }
    if (action === 'desk') {
      setDesk(true);
      return;
    }
    stopDemo();
    const s = session(),
      item = currentItem(),
      rule = rules[item.id];
    if (action === 'retry') {
      s.data = rule.initial();
      s.result = null;
      s.feedback = '';
      s.action = '';
    } else if (!allowed(action)) {
      setDesk(true);
      return;
    } else if (action === 'commit') {
      s.result = rule.result(s.data);
      completed.add(item.id);
      save('completed', [...completed]);
      playSound('finish');
      s.action = action;
    } else {
      rule.change(s.data, action);
      s.action = action;
      playSound('tap');
    }
    renderDesk();
    if (!s.result && action !== 'retry') s.feedback = feedback(item, s.data, action) || '';
    volume?.update(current, s.data, action, s.result);
    hovered = null;
    paintCaption();
    if (fromSheet) {
      const follow = s.result
        ? sheet.querySelector('.dg-result h2')
        : sheet.querySelector('[data-act="' + action + '"]:not(:disabled)') ||
          sheet.querySelector('button:not(:disabled)');
      if (follow) {
        if (s.result) follow.tabIndex = -1;
        follow.focus({ preventScroll: true });
      }
    }
  }
  sheet.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (b && !b.disabled) perform(b.dataset.act, true);
  });
  $('#finish-here').onclick = () => perform('commit');
  cue.onclick = (e) => {
    if (e.detail === 0 && selectedCue) perform(selectedCue.action);
  };

  function stopDemo() {
    clearTimeout(autoTimer);
    clearTimeout(demoTimer);
    if (!demo) return;
    demo = null;
    const s = session();
    volume?.update(current, s.data, 'restore', s.result);
    book.classList.remove('previewing', 'autoplay');
    $('#demo-tools').hidden = true;
    $('#demo').innerHTML = icon('play') + '<span>重看開場</span>';
    paintCaption();
  }
  function showDemoStep() {
    clearTimeout(demoTimer);
    const item = currentItem(),
      info = staging[item.id],
      entry = editorial[item.id],
      step = demo.step;
    // Replay the causal sequence from a separate fresh state, including on reverse scrubs.
    const data = rules[item.id].initial();
    for (let n = 0; n <= step; n++) {
      for (const act of info.reels[n]) rules[item.id].change(data, act);
    }
    const action = info.reels[step].at(-1);
    volume?.update(current, data, action, null);
    const role = entry.roles[action] || entry.roles[info.reels[step].at(-1)];
    setLine(
      info.site + ' · 開場 ' + (step + 1) + ' / 3' + (role ? '　' + role.label : ''),
      entry.opening[step],
    );
    refreshMarker();
    $('#demo').innerHTML =
      icon(demo.playing ? 'pause' : 'play') +
      '<span>' +
      (demo.playing ? '暫停預演' : step === 2 ? '重播預演' : '繼續預演') +
      '</span>';
    $('#demo-tools').hidden = false;
    $('#demo-before').disabled = step === 0;
    $('#demo-after').disabled = step === 2;
    $('#finish-here').hidden = true;
    paperChoices();
    if (demo.playing)
      demoTimer = setTimeout(
        () => {
          if (!demo) return;
          if (demo.step === 2) {
            if (demo.auto) {
              stopDemo();
              return;
            }
            demo.playing = false;
            $('#demo').innerHTML = icon('play') + '<span>重播預演</span>';
            return;
          }
          demo.step++;
          showDemoStep();
        },
        demo.auto ? 3300 : 4000,
      );
  }
  function startDemo(automatic = false) {
    closeSlip();
    if (!panel.hidden) setDesk(false, false);
    if (demo) {
      if (!automatic && demo.auto) {
        demo.auto = false;
        book.classList.remove('autoplay');
      }
      if (!demo.playing && demo.step === 2) demo.step = 0;
      demo.playing = !demo.playing;
    } else {
      demo = { step: 0, playing: motion, auto: automatic === true };
      book.classList.add('previewing');
      book.classList.toggle('autoplay', demo.auto);
    }
    refreshMarker();
    showDemoStep();
  }
  $('#demo').onclick = () => startDemo(false);
  $('#demo-exit').onclick = stopDemo;
  for (const [button, delta] of [
    ['#demo-before', -1],
    ['#demo-after', 1],
  ]) {
    $(button).onclick = () => {
      if (demo) {
        demo.playing = false;
        demo.step = clamp(demo.step + delta, 0, 2);
        showDemoStep();
      }
    };
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }
  function showDialog(kind, label, title, html) {
    stopDemo();
    closeSlip();
    worldMap?.destroy();
    worldMap = null;
    $('#close-modal').tabIndex = kind === 'map' ? -1 : 0;
    dialog.classList.toggle('map-mode', kind === 'map');
    $('#dialog-label').textContent = label;
    $('#dialog-title').textContent = title;
    $('#dialog-body').innerHTML = html;
    if (!dialog.open) dialog.showModal();
    volume?.visible(false);
    refreshMarker();
  }
  function showMap(region = currentItem().region) {
    closePlay(false);
    breakfast.activate(false);
    mapRegion = region;
    showDialog('map', '', '決策群島地圖', '<div id="world-route" style="height:100%"></div>');
    worldMap = AtlasRoadmap.mount($('#world-route'), {
      items,
      regions,
      staging,
      editorial,
      current,
      completed,
      motion,
      sound,
      onVisit(i) {
        const hash = '#game/' + items[i].id;
        closeDialog();
        if (location.hash !== hash) history.pushState(null, '', hash);
        travel(i, false, true);
        volume?.unfold();
      },
      onClose: closeDialog,
      onRead() {
        closeDialog();
        location.hash = 'read';
      },
      onCredits: showCredits,
      onMotion(value) {
        motion = value;
        save('motion', value);
        volume?.motion(value);
        breakfast.story.motion(value);
      },
      onSound(value) {
        if (sound !== value) $('#audio').click();
      },
    });
    if (region !== currentItem().region) worldMap.select(items.findIndex((g) => g.region === region));
  }
  $('#open-map').onclick = () => showMap();
  $('#close-modal').onclick = closeDialog;
  function readSources() {
    const item = currentItem();
    const {article, page} = editorial[item.id].source;
    location.hash = 'read/' + article + (item.id === 'growth' ? '/p/' + page : '');
  }
  $('#read-source').onclick = readSources;
  function showCredits() {
    showDialog(
      'credits',
      'COLOPHON',
      '作品與出處',
      '<div class="colophon"><p>《決策群島》改編自電通台灣《決策智慧 2026》。九場生活推演導讀 17 篇主題文章。趕車現場另可翻開旅客的委託紙，讀陳蒔談品牌偏好。全刊 22 篇均可在書中閱讀。原文、圖表與原刊美術屬 dentsu Taiwan 與各篇作者。</p><p>紙雕舞台、採訪車、地圖與互動情境為本作創作。翻頁操作參考了 <a href="https://rosy-wisdom-dw86.here.now/" target="_blank" rel="noopener">The Folded Atlas</a>。開車接近站旗的選關方式取材自 <a href="https://youtu.be/66u0FiSZjG4" target="_blank" rel="noopener">Overcooked! 2 地圖巡遊</a>。本作使用 MIT 授權的 Three.js。</p><p>在地圖上按住地面或用方向鍵開車。進入書頁後，拖頁角可往返翻景，拖桌面可轉動視角。鍵盤左右鍵翻景，A、D 轉動，W、S 俯仰，R 歸位。完成紀錄存在此瀏覽器。</p><button type="button" class="close-sheet" data-tool="map" aria-label="返回地圖">' +
        icon('map') +
        '</button></div>',
    );
  }
  dialog.addEventListener('click', (e) => {
    const tool = e.target.closest('[data-tool]')?.dataset.tool;
    if (tool === 'map') showMap(mapRegion);
    if (e.target.closest('a[href^="#"]')) {
      const link = e.target.closest('a');
      closeDialog();
      if (link.hash === '#game/' + currentItem().id) {
        e.preventDefault();
        if (location.hash !== link.hash) history.replaceState(null, '', link.hash);
      }
    }
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog();
    }
  });
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    worldMap?.destroy();
    worldMap = null;
    if (visible) volume?.visible(true);
    if (location.hash === '#map' || location.hash.startsWith('#region/')) {
      history.replaceState(null, '', '#game/' + currentItem().id);
      commitPage(current, false);
      volume?.unfold();
    }
    refreshMarker();
    syncBreakfast();
  });

  function plateURL(id) {
    if (id === 'growth') return 'art/breakfast-print.svg?v=crew3';
    return 'art/plates/' + id + '.webp' + (id === 'persona' || id === 'signal' ? '?v=life1' : '');
  }
  function showFallback() {
    $('#printed-scene').hidden = false;
    world.hidden = true;
    $('#reset-camera').hidden = true;
    cue.hidden = true;
    $('#plate-image').src = plateURL(currentItem().id);
    $('#plate-image').alt = staging[currentItem().id].site + '的立體紙景';
    if (currentItem().id === 'growth') breakfast.preparePrint();
  }
  function drawPosition(a, b, t) {
    fold = a + (b - a) * t;
    setLandscape(items[a].region, items[b].region, t);
    slider.value = fold;
    const turning = a !== b && t > 0.001 && t < 0.999;
    book.classList.toggle('turning', turning);
    if (!$('#printed-scene').hidden) book.classList.toggle('breakfast-plate', items[t > 0.5 ? b : a].id === 'growth');
    $('#travel-label').textContent = turning
      ? '翻頁中　' + Math.round(t * 100) + '%'
      : volume
        ? '拖書頁翻景 · 拖桌面轉向'
        : '拖動翻頁桿';
    $('#travel-count').textContent = turning
      ? pad(a + 1) + ' ↔ ' + pad(b + 1)
      : pad(Math.round(fold) + 1) + ' / ' + pad(count);
    slider.setAttribute(
      'aria-valuetext',
      turning
        ? '第 ' + (a + 1) + ' 景到第 ' + (b + 1) + ' 景，已翻 ' + Math.round(t * 100) + '%'
        : editorial[items[Math.round(fold)].id].headline,
    );
    $('#prev').disabled = fold < 0.001;
    $('#next').disabled = fold > last - 0.001;
    if (volume) volume.position(a, b, t);
    if (!$('#printed-scene').hidden) {
      const preview = t > 0.5 ? b : a,
        url = plateURL(items[preview].id),
        image = $('#plate-image');
      if (image.getAttribute('src') !== url) {
        image.src = url;
        image.alt = staging[items[preview].id].site + '的立體紙景';
      }
    }
    $('#turn-live').textContent = turning && t > 0.14 && t < 0.88 ? editorial[items[a].id].bridge : '';
    if (turning) {
      cue.hidden = true;
      $('#discovery-pins').hidden = true;
    }
  }
  function scrub(pos) {
    pos = clamp(pos, 0, last);
    const a = Math.floor(pos),
      b = Math.ceil(pos);
    drawPosition(a, b, pos - a);
  }
  function commitPage(i, push) {
    current = i;
    book.classList.toggle('breakfast-page', items[i].id === 'growth');
    settling = false;
    tween = null;
    hovered = null;
    fold = i;
    drawPosition(i, i, 0);
    const s = session();
    volume?.update(i, s.data, 'enter', s.result);
    if (push && location.hash !== '#game/' + items[i].id) history.pushState(null, '', '#game/' + items[i].id);
    renderDesk();
    paintCaption();
    rebuildPins();
    positionGrips();
    syncBreakfast();
    document.title = editorial[items[i].id].headline + '｜決策智慧 2026';
    const hash = location.hash;
    if (
      visible &&
      motion &&
      items[i].id !== 'growth' &&
      !autoSeen.has(i) &&
      !s.action &&
      !s.result &&
      !dialog.open &&
      !hash.startsWith('#map') &&
      !hash.startsWith('#region')
    ) {
      autoTimer = setTimeout(() => {
        if (
          current !== i ||
          !visible ||
          settling ||
          dialog.open ||
          !panel.hidden ||
          !slip.hidden ||
          !playMat.hidden ||
          session().action
        )
          return;
        autoSeen.add(i);
        startDemo(true);
      }, 420);
    }
  }
  function cancelTween() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (tween && Math.abs(tween.b - tween.a) > 1) {
      drawPosition(
        fold < (tween.a + tween.b) / 2 ? tween.a : tween.b,
        fold < (tween.a + tween.b) / 2 ? tween.a : tween.b,
        0,
      );
    }
    tween = null;
  }
  function travel(index, push = true, instant = false) {
    const end = clamp(index, 0, last);
    closePlay(false);
    closeSlip();
    stopDemo();
    cancelTween();
    if (!panel.hidden) setDesk(false, false);
    const start = fold;
    if (Math.abs(end - start) < 0.003 || !motion || instant) {
      commitPage(end, push);
      return;
    }
    const gap = Math.abs(end - start);
    const direct = gap > 1.001 && Number.isInteger(start);
    const a = direct ? Math.min(start, end) : Math.floor(Math.min(start, end));
    const b = direct ? Math.max(start, end) : Math.ceil(Math.max(start, end));
    const length = Math.max(1, b - a),
      begin = (start - a) / length,
      finish = (end - a) / length;
    tween = { a, b, end };
    settling = true;
    selectedCue = null;
    volume?.marker(null);
    cue.hidden = true;
    playSound('page');
    const duration = clamp(930 * Math.sqrt(Math.min(1, gap)), 230, 930);
    let startTime;
    function animate(ms) {
      if (!tween) return;
      startTime ??= ms;
      const p = Math.min(1, (ms - startTime) / duration);
      const ease = p * p * (3 - 2 * p);
      if (direct) drawPosition(a, b, begin + (finish - begin) * ease);
      else scrub(start + (end - start) * ease);
      if (p < 1) frame = requestAnimationFrame(animate);
      else {
        frame = 0;
        commitPage(end, push);
      }
    }
    frame = requestAnimationFrame(animate);
  }
  function step(dir) {
    travel(clamp((tween?.end ?? Math.round(fold)) + dir, 0, last));
  }
  $('#next').onclick = () => step(1);
  $('#prev').onclick = () => step(-1);
  const beginScrub = () => {
    closeSlip();
    stopDemo();
    cancelTween();
    settling = true;
    cue.hidden = true;
    volume?.marker(null);
  };
  slider.addEventListener('pointerdown', beginScrub);
  slider.addEventListener('input', () => {
    if (!settling) beginScrub();
    scrub(+slider.value);
  });
  const snap = () => {
    if (settling && !tween) travel(Math.round(fold));
  };
  slider.addEventListener('change', snap);
  slider.addEventListener('pointerup', () => queueMicrotask(snap));
  slider.addEventListener('pointercancel', snap);
  slider.addEventListener('blur', snap);
  slider.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Home') travel(0);
      else if (e.key === 'End') travel(last);
      else step(['ArrowLeft', 'ArrowDown'].includes(e.key) ? -1 : 1);
    }
  });

  function pointerStart(e) {
    if (!visible || !panel.hidden || !playMat.hidden || dialog.open || e.button !== 0 || pointer) return;
    const edge = Number(e.currentTarget.dataset?.edge);
    const cupGuide = e.currentTarget.id === 'breakfast-cue';
    let storyKey = cupGuide ? 'sleeve' : e.currentTarget.dataset?.storyControl;
    const onPaper = e.currentTarget.id === 'printed-scene' || storyKey;
    if (!cupGuide && !e.target.closest('.bf-name') && onPaper && currentItem().id === 'growth' && world.hidden) {
      const shape = document.elementsFromPoint(e.clientX,e.clientY)
        .find(el => el.hasAttribute('data-breakfast-hit'));
      storyKey = shape?.dataset.breakfastHit || storyKey;
    } else if (!cupGuide && !e.target.closest('.bf-name') && storyKey && volume) {
      // Padded targets can overlap on a phone. Prefer the actual paper object under the finger.
      const physical = volume.pick(e.clientX,e.clientY);
      if (physical.hit?.action.startsWith('breakfast:')) storyKey = physical.hit.action.slice(10);
    }
    const target = storyKey
      ? {
          kind: 'prop',
          hit: { action: 'breakfast:' + storyKey, gesture: storyKey === 'sleeve' ? 'lift' : 'tap' },
        }
      : edge
        ? { kind: 'page' }
        : e.currentTarget === cue && selectedCue
          ? { kind: 'prop', hit: selectedCue }
          : volume && world === e.currentTarget
            ? volume.pick(e.clientX, e.clientY)
            : { kind: 'page' };
    const wasTurning = settling;
    if (target.hit?.action === 'breakfast:sleeve' && ['opening','riding'].includes(BreakfastStory.pose.phase)) return;
    if (wasTurning) cancelTween();
    pointer = {
      id: e.pointerId,
      target: wasTurning ? { kind: 'page' } : target,
      edge,
      start: fold,
      x: e.clientX,
      y: e.clientY,
      px: e.clientX,
      py: e.clientY,
      moved: false,
      origin: e.currentTarget.dataset?.storyControl ? e.currentTarget : null,
    };
    if (currentItem().id === 'growth' && !target.hit?.action.startsWith('breakfast:')) breakfast.shut();
    if (!wasTurning && target.hit?.action === 'breakfast:sleeve') {
      breakfast.story.begin();
      pointer.sleeveStart = BreakfastStory.pose.support;
    }
    if (target.kind === 'prop' && target.hit.gesture === 'spin') {
      const c = volume?.project(target.hit);
      if (c) {
        pointer.center = c;
        pointer.angle = Math.atan2(e.clientY - c.y, e.clientX - c.x);
        pointer.sweep = 0;
      }
    }
    const capture =
      edge || e.currentTarget.dataset?.storyControl || cupGuide
        ? world.hidden
          ? $('#printed-scene')
          : world
        : e.currentTarget === cue
          ? world
          : e.currentTarget;
    capture.setPointerCapture(e.pointerId);
    if (e.currentTarget === cue || edge || storyKey) e.preventDefault();
  }
  function pointerMove(e) {
    if (!visible || !panel.hidden || dialog.open) return;
    if (!pointer) {
      if (volume && e.pointerType === 'mouse' && !settling && world === e.currentTarget) {
        const target = volume.pick(e.clientX, e.clientY),
          hit = target.kind === 'prop' ? target.hit : null;
        world.style.cursor = hit
          ? hit.gesture === 'tap'
            ? 'pointer'
            : 'grab'
          : target.kind === 'page'
            ? 'ew-resize'
            : 'grab';
        if (hovered !== hit) {
          hovered = hit;
          refreshMarker();
        }
      }
      return;
    }
    if (e.pointerId !== pointer.id) return;
    const d = pointer,
      dx = e.clientX - d.x,
      dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) > 5) {
      d.moved = true;
      volume?.curl?.(0);
      stopDemo();
      hovered = null;
      cue.hidden = true;
      volume?.marker(null);
      if (d.target.kind === 'prop' && d.target.hit.gesture === 'tap' &&
        !d.target.hit.action.startsWith('breakfast:')) d.target = { kind: 'page' };
      if (d.target.kind === 'page') settling = true;
      e.currentTarget.style.cursor = 'grabbing';
    }
    if (d.moved) {
      if (d.target.kind === 'page') {
        const span = clamp(book.clientWidth * 0.42, 140, 460);
        const forward = d.edge ? d.edge > 0 : true,
          backward = d.edge ? d.edge < 0 : true;
        scrub(clamp(d.start - dx / span, d.start - (backward ? 1 : 0), d.start + (forward ? 1 : 0)));
      } else if (d.target.hit?.action === 'breakfast:sleeve') {
        const travel = clamp(book.clientWidth * 0.09, 64, 106);
        d.amount = clamp(d.sleeveStart - dy / travel, 0, 1);
        breakfast.story.preview(d.amount);
      } else if (d.target.kind === 'table') volume?.orbit(e.clientX - d.px, e.clientY - d.py);
      else if (d.target.kind === 'prop' && !d.target.hit.action.startsWith('breakfast:')) {
        const gesture = d.target.hit.gesture;
        const dist =
          gesture === 'lift' ? -dy : gesture === 'slide' ? dx : Math.abs(dx) > Math.abs(dy) ? dx : -dy;
        let travel = dist / clamp(book.clientWidth * 0.1, 48, 95);
        if (gesture === 'spin' && d.center) {
          const x = e.clientX - d.center.x,
            y = e.clientY - d.center.y,
            next = Math.atan2(y, x);
          let delta = next - d.angle;
          if (delta > Math.PI) delta -= 2 * Math.PI;
          if (delta < -Math.PI) delta += 2 * Math.PI;
          if (Math.hypot(x, y) > 12) d.sweep += delta;
          d.angle = next;
          if (Math.abs(d.sweep) > Math.abs(travel) * 1.6) travel = -d.sweep / 1.6;
        }
        d.amount = clamp(travel, gesture === 'lift' ? 0 : -1, 1);
        volume?.dragProp(d.target.hit, d.amount);
      }
    }
    d.px = e.clientX;
    d.py = e.clientY;
  }
  function pointerEnd(e) {
    if (!pointer || e.pointerId !== pointer.id) return;
    const d = pointer;
    pointer = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grab';
    volume?.dragProp(null, 0);
    if (d.target.hit?.action.startsWith('breakfast:')) {
      const key = d.target.hit.action.slice(10);
      if (e.type !== 'pointerup') breakfast.story.cancel();
      else if (key === 'sleeve' && d.moved) breakfast.story.send(d.amount);
      else breakfast.interact(key, {x:e.clientX,y:e.clientY}, d.origin);
      return;
    }
    if (d.target.kind === 'page' && (d.moved || settling)) {
      let dest = Math.round(fold);
      const delta = fold - d.start;
      if (
        e.type === 'pointerup' &&
        Number.isInteger(d.start) &&
        Math.abs(delta) > 0.22 &&
        Math.abs(delta) < 1
      )
        dest = d.start + Math.sign(delta);
      if (e.type === 'pointercancel') dest = Math.round(d.start);
      if (dest !== Math.round(d.start)) {
        usedCorner = true;
        save('turned-corner', true);
      }
      travel(dest);
    } else if (d.edge && e.type === 'pointerup' && !d.moved) {
      usedCorner = true;
      save('turned-corner', true);
      step(d.edge);
    } else if (
      e.type === 'pointerup' &&
      d.target.kind === 'prop' &&
      (!d.moved || Math.abs(d.amount || 0) > 0.42)
    )
      perform(d.target.hit.action);
    else refreshMarker();
  }
  for (const b of grips) {
    const side = Number(b.dataset.edge);
    b.addEventListener('pointerenter', () => {
      if (!pointer && !settling) volume?.curl?.(side);
    });
    b.addEventListener('pointerleave', () => {
      if (!pointer) volume?.curl?.(0);
    });
    b.addEventListener('pointerdown', pointerStart);
    b.addEventListener('click', (e) => {
      if (e.detail === 0) {
        usedCorner = true;
        save('turned-corner', true);
        step(side);
      }
    });
  }
  cue.addEventListener('pointerdown', pointerStart);
  for (const control of book.querySelectorAll('[data-story-control],#breakfast-cue')) {
    const name = control.dataset.storyControl || 'sleeve';
    control.addEventListener('pointerdown', pointerStart);
    control.addEventListener('click', (e) => {
      if (e.detail === 0) {
        const box = control.getBoundingClientRect();
        breakfast.interact(name, {x:box.left+box.width/2,y:box.top+box.height/2}, control);
      }
    });
    if (name === 'sleeve')
      control.addEventListener('keydown', (e) => {
        const height = BreakfastStory.pose.support;
        const levels = {
          ArrowUp: Math.min(1, height + 0.25),
          ArrowDown: Math.max(0, height - 0.25),
          Home: 0,
          End: 1,
        };
        if (!Object.hasOwn(levels, e.key)) return;
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) breakfast.story.send(levels[e.key]);
      });
  }
  for (const el of [world, $('#printed-scene')]) {
    el.addEventListener('pointerdown', pointerStart);
    el.addEventListener('pointermove', pointerMove);
    el.addEventListener('pointerup', pointerEnd);
    el.addEventListener('pointercancel', pointerEnd);
    el.addEventListener('pointerleave', () => {
      if (!pointer && hovered) {
        hovered = null;
        refreshMarker();
      }
    });
    el.addEventListener('lostpointercapture', (e) => {
      if (pointer?.id === e.pointerId) pointerEnd(e);
    });
  }
  $('#reset-camera').onclick = () => volume?.reset();
  document.addEventListener('keydown', (e) => {
    if (
      !visible ||
      !cover.hidden ||
      !playMat.hidden ||
      dialog.open ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      e.target.closest('select,input,textarea,[contenteditable=true]')
    )
      return;
    if (!panel.hidden) {
      if (e.key === 'Escape') {
        setDesk(false);
        e.preventDefault();
      } else if (e.key === 'Tab' && innerWidth <= 850) {
        const controls = panel.querySelectorAll('button:not(:disabled),a[href]'),
          first = controls[0],
          end = controls[controls.length - 1];
        if (
          (e.shiftKey && document.activeElement === first) ||
          (!e.shiftKey && document.activeElement === end)
        ) {
          e.preventDefault();
          (e.shiftKey ? end : first).focus();
        }
      }
      return;
    }
    if (e.key === 'Escape' && !slip.hidden) {
      e.preventDefault();
      closeSlip(true);
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      step(e.key === 'ArrowRight' ? 1 : -1);
    } else if (e.key.toLowerCase() === 'm') showMap();
    else if (e.key.toLowerCase() === 'r') volume?.reset();
    else if (['a', 'd', 'w', 's'].includes(e.key.toLowerCase())) {
      const k = e.key.toLowerCase();
      volume?.orbit(k === 'a' ? 28 : k === 'd' ? -28 : 0, k === 'w' ? 18 : k === 's' ? -18 : 0);
      e.preventDefault();
    } else if (e.key === 'Escape') stopDemo();
  });
  const reader = $('#reader-view');
  const turnToPrint = AtlasLeafTransition.create(book, reader, $('#print-leaf'), () =>
    world.hidden ? null : volume,
  );
  let readerTurn = false,
    printLand = 'prologue',
    returnSlip = '',
    returnPlay = false,
    lastPrint = null;
  function pageLand(page) {
    return page >= 150 ? 'ai' : page >= 94 ? 'model' : page >= 18 ? 'people' : 'prologue';
  }
  function readPageChanged(page) {
    printLand = pageLand(page);
    if (!readerTurn) setLandscape(printLand);
  }
  function renderReader() {
    return DecisionReader.render(reader, {
      embedded: true,
      returnHash: readerOrigin,
      returnLabel: readerOrigin === '#cover' ? '返回封面' : '返回立體書',
      onPageChange: readPageChanged,
    });
  }
  function enterReader(first, id) {
    if (visible || first) {
      const n = Number(id);
      const related = items.findIndex((g) => g.articles.includes(n));
      const dest = first && related >= 0 ? related : (tween?.end ?? current);
      cancelTween();
      stopDemo();
      visible = false;
      readerOrigin = readFromCover ? '#cover' : '#game/' + items[dest].id;
      readFromCover = false;
      returnDesk = !panel.hidden;
      returnSlip = slip.hidden ? '' : slip.dataset.action;
      closeSlip();
      if (!panel.hidden) setDesk(false, false);
      commitPage(dest, false);
    }
    const alreadyOpen = document.body.classList.contains('is-reading') && !readerTurn;
    document.body.classList.add('is-reading');
    if (!alreadyOpen) {
      readerTurn = true;
      reader.style.opacity = '0';
    }
    reader.hidden = false;
    book.inert = true;
    lastPrint = renderReader();
    if (!alreadyOpen) {
      volume?.visible(true);
      turnToPrint(
        lastPrint,
        1,
        motion && !first,
        (amount) => setLandscape(currentItem().region, printLand, amount),
        () => {
          readerTurn = false;
          volume?.visible(false);
          reader.querySelector('.dr-title')?.focus({ preventScroll: true });
        },
      );
    }
    document.title = (reader.querySelector('.dr-title')?.textContent || '原刊全文') + '｜決策智慧 2026';
    initialized = true;
  }
  function route(first = false) {
    const hash = location.hash,
      parts = hash.slice(1).split('/'),
      mode = parts[0],
      id = parts[1];
    const atCover = mode === 'cover' || !mode;
    cover.hidden = !atCover;
    if (mode === 'read' && visible) returnPlay = !playMat.hidden;
    closePlay(false);
    if (dialog.open) closeDialog();
    if (mode === 'read') {
      enterReader(first, id);
      return;
    }
    let index = items.findIndex((item) => mode === 'game' && item.id === id);
    if (index < 0) index = atCover ? 0 : current;
    const isMap = mode === 'map' || mode === 'region';
    const openMap = () => {
      if (isMap) showMap(Object.hasOwn(regions, id) ? id : currentItem().region);
    };
    if (!visible) {
      readerTurn = true;
      book.hidden = false;
      volume?.visible(true);
      commitPage(index, false);
      turnToPrint(
        lastPrint,
        0,
        motion,
        (amount) => setLandscape(items[index].region, printLand, amount),
        () => {
          visible = true;
          readerTurn = false;
          book.inert = atCover;
          document.body.classList.remove('is-reading');
          reader.hidden = true;
          reader.style.opacity = '';
          DecisionReader.destroy();
          lastPrint = null;
          renderDesk();
          paintCaption();
          rebuildPins();
          if (returnPlay && hash === readerOrigin) {
            openPlay();
            playHost.querySelector('[data-ap="original"], [data-result="read"]')?.focus({ preventScroll: true });
          } else if (returnDesk && hash === readerOrigin) setDesk(true);
          else if (returnSlip && hash === readerOrigin) inspectObject(returnSlip);
          else if (atCover) cover.querySelector('.cover-start').focus({preventScroll:true});
          else $('#read-source').focus({ preventScroll: true });
          returnDesk = false;
          returnSlip = '';
          returnPlay = false;
          syncBreakfast();
          if (atCover) { volume?.visible(false); document.title = '決策群島｜決策智慧立體書'; }
          openMap();
        },
      );
      return;
    }
    book.inert = atCover;
    reader.hidden = true;
    book.hidden = false;
    volume?.visible(true);
    travel(index, false, first || !initialized || isMap || atCover);
    if (atCover) { volume?.visible(false); document.title = '決策群島｜決策智慧立體書'; }
    openMap();
    initialized = true;
  }
  window.addEventListener('hashchange', () => route());
  reduced.addEventListener('change', () => {
    motion = saved('motion', true) && !reduced.matches;
    worldMap?.motion(motion);
    volume?.motion(motion);
    breakfast.story.motion(motion);
    if (!motion && tween) {
      const destination = tween.end;
      cancelTween();
      commitPage(destination, true);
    }
    if (!motion && demo) {
      demo.playing = false;
      showDemoStep();
    }
  });
  const breakfast = window.BreakfastControls.mount({
    record: saved('breakfast', null),
    onSound: playSound,
    onCheckpoint: (checkpoint) => save('breakfast', checkpoint),
    onTrial({ height, heights, stamped, dry, edition }) {
      save('breakfast', { height, heights, stamped, edition });
      if (dry) {
        completed.add('growth');
        save('completed', [...completed]);
      }
    },
    redraw: () => {
      if (world.hidden) positionGrips();
      else volume?.redraw();
    },
    hits: () => volume?.hits(),
    project: (hit) => volume?.project(hit),
  });
  function syncBreakfast() {
    const mapRoute = /^#(?:map|region)(?:\/|$)/.test(location.hash);
    breakfast.activate(currentItem().id === 'growth' && visible && !readerTurn && !dialog.open && !mapRoute && cover.hidden);
  }
  breakfast.story.motion(motion);
  try {
    volume = window.AtlasVolume.build(world, items, {
      frame: positionMarker,
      lost: showFallback,
      restored() {
        world.hidden = false;
        $('#printed-scene').hidden = true;
        $('#reset-camera').hidden = false;
        refreshMarker();
        syncBreakfast();
      },
    });
    volume.motion(motion);
  } catch (error) {
    console.warn('立體書已切換至平面圖版。', error.message);
    volume = null;
    showFallback();
  }
  reflectSound();
  if (!location.hash) history.replaceState(null, '', '#cover');
  route(true);
  if (visible && !dialog.open && cover.hidden) volume?.unfold();
})();
