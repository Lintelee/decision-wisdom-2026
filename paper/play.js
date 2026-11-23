/* Tabletop paper toys. The atlas owns every committed decision. Local state only
   describes manipulation of the props and the play currently in progress. */
(() => {
  'use strict';

  const props = {
    key: '<circle cx="16" cy="16" r="10" fill="var(--ap-gold)"/><circle cx="16" cy="16" r="4" class="ap-ivory"/><path d="m23 22 20 18-4 5-20-19m12 5 4-4 4 4-4 4" fill="var(--ap-gold)"/>',
    bag: '<path class="ap-ivory" d="M16 14q0-13 9-12 9 0 9 12l-4 1q0-9-5-9t-5 9z"/><path fill="var(--ap-blue)" d="M9 16q2-6 9-7h14q7 2 8 9l3 25H6z"/><path fill="#92bba7" d="M9 19q13 9 32 0l-2-6q-15-7-28 0z"/><path fill="var(--ap-rust)" d="M13 26h22l1 12-24 1z"/><path d="M14 29h18m-4-1v4"/>',
    book: '<path class="ap-ivory" d="m3 12 14-4 8 3 9-4 12 3v28l-13-2-9 4-9-3-12 2z"/><path d="M24 12v27M7 16l9-3 5 2m7 0 7-3 7 1m-34 9 9-2m12 0 11-2"/>',
    wallet:
      '<path fill="var(--ap-rust)" d="m6 13 29-6 7 4v29H5z"/><path fill="#d89161" d="m5 16 34-3v25L5 41z"/><path class="ap-ivory" d="m29 22 15-1v10l-15 1z"/><circle cx="34" cy="26.5" r="1.4"/>',
    umbrella:
      '<path fill="var(--ap-gold)" d="M2 27q4-16 21-19 18 0 23 16-7-3-10 3-7-5-12 1-5-4-11 2-6-5-11-3z"/><path d="m23 8 1-5m0 21 4 16q2 9 8 2M24 8q9 7 11 17"/>',
    photo:
      '<path class="ap-ivory" d="M3 6h42v36H3z"/><path fill="var(--ap-blue)" d="M7 10h34v23H7z"/><circle class="ap-ivory" cx="32" cy="16" r="3"/><path d="m8 31 12-15 7 10 5-5 8 11" fill="#80a68b"/>',
    mic: '<rect x="17" y="4" width="15" height="24" rx="7" fill="var(--ap-rust)"/><path d="M12 21v3q0 12 12 12t13-12v-3m-13 15v7m-8 0h16m-13-30h10m-10 4h10"/>',
    paper: '<path class="ap-ivory" d="M9 3h23l8 9v32H9z"/><path d="M31 3v10h9M15 21h18m-18 6h14m-14 6h18"/>',
    drum: '<ellipse cx="24" cy="17" rx="19" ry="7" class="ap-ivory"/><path fill="var(--ap-rust)" d="M5 17v18q19 16 38 0V17q-19 13-38 0z"/><path d="m8 22 6 14 6-12 8 15 8-15M4 5l17 10M44 4 27 14"/>',
    beat: '<path d="M15 36V13l21-5v22" fill="none"/><path d="m16 14 20-5v7l-20 4z" fill="var(--ap-blue)"/><ellipse cx="10" cy="36" rx="6" ry="4" fill="var(--ap-blue)"/><ellipse cx="31" cy="30" rx="6" ry="4" fill="var(--ap-blue)"/>',
    cup: '<path fill="var(--ap-blue)" d="M11 9h25l-3 35H14z"/><path class="ap-ivory" d="M9 5h29v8H9z"/><path d="M16 25h15m-15 4h12"/>',
    tv: '<rect class="ap-ivory" x="4" y="7" width="40" height="30" rx="2"/><path fill="var(--ap-blue)" d="M8 11h31v21H8z"/><path d="M15 43h18m-9-6v6"/>',
    coin: '<path fill="var(--ap-rust)" d="M3 20v8q17 18 41 0v-8z"/><ellipse cx="23.5" cy="20" rx="20" ry="11" fill="var(--ap-gold)"/><path d="m18 19 8-3 5 3-7 4z"/>',
    shop: '<path class="ap-ivory" d="M7 18h35v25H7z"/><path fill="var(--ap-rust)" d="m7 9 33-1 5 13q-5 5-10 0-3 5-9 0-4 4-10 0-5 4-9 0-4 3-5 0z"/><path d="M13 43V29h9v14m5-15h10v7H27z"/>',
    chat: '<path fill="var(--ap-blue)" d="M4 6h32v22H19l-8 9 1-9H4z"/><path class="ap-ivory" d="M24 20h21v16h-6l1 8-9-8h-7z"/><path d="M9 13h21m-21 5h14"/>',
    flag: '<path d="M12 44V5"/><path fill="var(--ap-rust)" d="m13 6 25 2-7 6 7 7-25-2z"/>',
    lens: '<circle fill="#c9e1d2" cx="20" cy="19" r="14"/><circle class="ap-ivory" cx="20" cy="19" r="10"/><path fill="var(--ap-gold)" d="m29 27 3-3 14 15-5 5z"/><path d="M13 17q2-6 8-5"/>',
    parcel:
      '<path class="ap-ivory" d="m3 14 20-9 22 9-21 10z"/><path fill="var(--ap-rust)" d="M3 14v19l21 11V24z"/><path fill="var(--ap-gold)" d="m24 24 21-10v19L24 44z"/><path d="m14 9 20 10v9"/>',
    train:
      '<rect fill="var(--ap-blue)" x="8" y="4" width="32" height="33" rx="6"/><path class="ap-ivory" d="M12 10h24v13H12z"/><path d="m15 38-7 7m24-7 7 7m-26-3h23"/><circle class="ap-ivory" cx="16" cy="29" r="2"/><circle class="ap-ivory" cx="31" cy="29" r="2"/>',
    clock: '<circle class="ap-ivory" cx="24" cy="24" r="19"/><path d="M24 10v14l10 5m-11 11h2"/>',
    lock: '<path d="M15 21v-8q0-13 10-13 10 0 10 13v8"/><rect fill="var(--ap-gold)" x="9" y="18" width="30" height="25" rx="3"/><circle class="ap-ivory" cx="24" cy="28" r="3"/><path d="M24 31v5"/>',
  };
  function icon(name) {
    return (
      '<svg class="ap-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      props[name] +
      '</svg>'
    );
  }
  const toys = {};
  const control = (key, label, options = {}) => {
    const { image, cls = '', disabled = false, selected = false, drag = false, target = false, aria } = options;
    return `<button type="button" class="ap-token ${cls}${selected ? ' ap-chosen' : ''}" data-ap="${key}"${drag ? ' data-piece' : ''}${target ? ' data-target' : ''}${aria ? ' aria-label="' + aria + '"' : ''}${disabled ? ' disabled' : ''}${drag ? ' aria-pressed="' + selected + '"' : ''}>${image ? icon(image) : ''}<span>${label}</span></button>`;
  };
  const piece = (ctx, key, label, image, cls = '') =>
    control(key, label, { image, cls: 'ap-piece ' + cls, drag: true, selected: ctx.held === key });
  const target = (key, label, image, cls = '') =>
    control(key, label, { image, cls: 'ap-socket ' + cls, target: true });
  const rows = (...items) => '<div class="ap-row">' + items.join('') + '</div>';
  const scene = (html, style = '') => '<div class="ap-field ' + style + '">' + html + '</div>';
  const hint = (text) => '<p class="ap-hint">' + text + '</p>';
  const tab = (key, label, selected) => control(key, label, { cls: 'ap-tab', selected });
  const conciseText = {
    growth: '小規模試用讓團隊知道，下一次要改的是哪個動作。',
    distance: '同一件產品的用途，會隨使用者當下的困難改變。',
    witness: '查證要數獨立來源；同一張照片轉貼三次，仍只有一個出處。',
    memory: '共同記憶有一個能辨認的時刻，也有新來的人能接上的動作。',
    persona: '把你準備向真人求證的問題收進手記。',
    context: '同一份預算到了另一個品類，優先場域也可能改變。',
    friction: '停在同一頁的顧客，可能各有原因。知道他在等什麼，才能改對流程。',
    signal: '行程票會留下走得通的路，或還要問的那件事。',
    permission: '幫忙整理、提出建議和代人付款，需要分別取得授權。',
  };
  const asInt = (key) => Number(key.split('-').at(-1));

  toys.growth = {
    title: '渡口尋鑰匙',
    tip: '翻出包底的鑰匙，再試一次單手取用。',
    init: () => ({ lifted: 0, carried: false, fetched: false }),
    view(c) {
      const m = c.local,
        s = c.state();
      if (s.improved) {
        return (
          scene(
            rows(
              icon('bag'),
              control('retrieve', m.fetched ? '已取出鑰匙' : '從外袋拿鑰匙', {
                image: 'key',
                cls: 'ap-pocketkey',
                disabled: m.fetched,
              }),
            ),
            'ap-bagfield',
          ) +
          (m.fetched
            ? '<div class="ap-comparison"><span>原來的包　<b>3</b> 個動作</span><span>改版的外袋　<b>1</b> 個動作</span></div>'
            : '') +
          hint(
            m.fetched ? '這次只做了一個動作，手上的傘始終不用放下。' : '鑰匙已經改放外袋。試試這一次要翻幾層。',
          )
        );
      }
      if (s.learning) {
        return (
          scene(
            rows(piece(c, 'key', '通勤者的鑰匙', 'key'), target('pocket', '縫上外袋', 'bag')),
            'ap-bagfield',
          ) +
          hint(
            s.days >= 2
              ? '把鑰匙放進外袋，花兩天做一版可以再試的包。'
              : '這輪剩下的天數不夠改版，可以先記下試用發現。',
          )
        );
      }
      if (s.days < 3)
        return scene(icon('bag') + hint('這輪的天數已不足以安排三天試用，可以收起現有的實驗紀錄。'));
      const layers = [
        ['book', '挪開記事本'],
        ['wallet', '拿開票卡夾'],
        ['key', '拿出鑰匙'],
      ];
      const [image, label] = layers[m.lifted];
      return (
        scene(
          `<div class="ap-bagbody"><div class="ap-lining"></div><div class="ap-stack">${piece(c, 'layer', label, image, 'ap-layer ap-layer-' + m.lifted)}</div></div>` +
            target('aside', '放到包外', null, 'ap-aside'),
          'ap-bagfield',
        ) +
        hint(
          [
            '快到站了。一手撐傘，另一手要從通勤包裡拿出鑰匙。',
            '票卡夾壓在底層，還看不見鑰匙。',
            '鑰匙露出來了。把它拿出來，完成這趟真人試背。',
          ][m.lifted],
        )
      );
    },
    drop(c, p, d) {
      if (p === 'layer' && d === 'aside') {
        if (c.local.lifted < 2) {
          c.local.lifted++;
          return '移開一層，繼續找。';
        }
        if (c.state().days >= 3 && c.act('step1')) {
          c.local.carried = true;
          return '三個動作才拿到。你看見乘客為什麼在渡口手忙腳亂。';
        }
      }
      if (p === 'key' && d === 'pocket' && c.state().days >= 2 && c.act('step2'))
        return '外袋縫好了，試試單手能不能直接拿到鑰匙。';
      return '目前的實驗天數或道具位置不適合這個改動。';
    },
    push(c, k) {
      if (k === 'retrieve') {
        c.local.fetched = true;
        return '一次就拿到了。你剛用同一個困難比較了兩版設計。';
      }
    },
    ready: (c) =>
      c.local.fetched ||
      (c.state().log.length > 0 && c.state().days < (c.state().learning ? 2 : 3) && !c.state().improved),
  };

  const stops = ['下車刷卡', '風口回家', '進公司'];
  const lines = [
    '「車門開了，我還得騰手拿卡。」',
    '「一走到路口，風就把傘骨翻過去。」',
    '「電梯裡站得很近，傘還在滴水。」',
  ];
  const parts = ['單手收傘扣', '抗風傘骨', '吸水傘套'];
  toys.distance = {
    title: '把雨傘帶進現場',
    tip: '將一條問題或一個零件放入月台的試用窗。',
    view(c) {
      const s = c.state(),
        spoken =
          s.question < 0
            ? '雨傘設計師正等著問第一句。'
            : s.question === 1
              ? lines[s.seat]
              : '「這把傘有八根傘骨，可以三折。」';
      const tools = s.question >= 0 ? rows(...parts.map((x, i) => piece(c, 'part-' + i, x, 'umbrella'))) : '';
      return (
        rows(...stops.map((x, i) => tab('seat-' + i, x, s.seat === i))) +
        scene(
          '<div class="ap-stop-sign" aria-hidden="true">' +
            icon(['train', 'umbrella', 'shop'][s.seat]) +
            '</div>' +
            target('trial', spoken, 'chat', 'ap-speech'),
          'ap-tramwindow',
        ) +
        rows(piece(c, 'ask-0', '問傘的規格', 'paper'), piece(c, 'ask-1', '問剛才的麻煩', 'chat')) +
        tools +
        (s.feature >= 0 ? hint('已送試用：' + parts[s.feature] + '。換一段路，收傘的需求也會變。') : '')
      );
    },
    push(c, k) {
      if (k.startsWith('seat-')) {
        c.act('seat' + asInt(k));
        return '抵達' + stops[asInt(k)] + '，重新聽聽這一刻。';
      }
    },
    drop(c, p, d) {
      if (d !== 'trial') return;
      if (p.startsWith('ask-')) {
        const i = asInt(p);
        c.act('ask' + i);
        return i === 1 ? lines[c.state().seat] : '知道了規格。還可以追問她什麼時候最不方便。';
      }
      if (p.startsWith('part-')) {
        const i = asInt(p);
        c.act('pick' + i);
        return i === c.state().seat
          ? '這個零件對準了她此刻的困難，可以再去現場試用。'
          : '這個零件有用途，換到眼前的通勤時刻，還需要一個理由。';
      }
    },
    ready: (c) => c.state().question >= 0 && c.state().feature >= 0,
  };

  const proof = [
    ['原始連拍', 'photo', 0],
    ['跑者錄音', 'mic', 1],
    ['甲的轉貼', 'photo', 2],
    ['乙的轉貼', 'photo', 2],
    ['丙的轉貼', 'photo', 2],
    ['完賽名冊', 'paper', 3],
  ];
  const evidenceNames = ['原始連拍', '跑者錄音', '同源轉貼', '完賽名冊'];
  toys.witness = {
    title: '終點線的兩份證據',
    tip: '把消息貼進兩格查證欄，找出它們各自能證明的事。',
    init: () => ({ copies: new Set() }),
    view(c) {
      const s = c.state();
      return (
        scene(
          '<div class="ap-evidence">' +
            [0, 1]
              .map((i) =>
                s.picks[i] === undefined
                  ? target('proof-' + i, '貼入來源', null, 'ap-proofslot')
                  : control('remove-' + s.picks[i], evidenceNames[s.picks[i]] + ' · 取下', {
                      image: ['photo', 'mic', 'photo', 'paper'][s.picks[i]],
                      cls: 'ap-proofslot ap-stamped',
                    }),
              )
              .join('') +
            '</div>',
        ) +
        '<div class="ap-strip">' +
        proof.map(([n, g], i) => piece(c, 'doc-' + i, n, g, i >= 2 && i <= 4 ? 'ap-copy' : '')).join('') +
        '</div>' +
        (c.local.copies.size > 1
          ? '<div class="ap-contactsheet">' +
            [...c.local.copies]
              .map((i) => '<span><small>' + proof[i][0] + '背面</small><b>F17</b></span>')
              .join('') +
            '</div>'
          : '') +
        hint(
          c.local.copies.size > 1
            ? '轉貼的編號不同，三張背面都印著同一個原圖編號 F17。'
            : '點已貼上的來源可取下。留意三張轉貼背後的原圖編號。',
        )
      );
    },
    push(c, k) {
      if (k.startsWith('remove-')) {
        c.act('doc' + asInt(k));
        return '已取下，空出的欄位可以換另一份證據。';
      }
    },
    drop(c, p, d) {
      if (!p.startsWith('doc-') || !d.startsWith('proof-')) return;
      const i = asInt(p),
        v = proof[i][2],
        s = c.state();
      if (v === 2) c.local.copies.add(i);
      if (s.picks.includes(v))
        return v === 2 ? '同源！兩則轉貼都來自原圖 F17，不能當成兩份獨立證據。' : '這份來源已經在欄位裡。';
      if (s.picks.length >= 2) return '欄位已滿，先取下一份再換。';
      c.act('doc' + v);
      return [
        '連拍能核對兩人一起跨線，觀眾的心情仍待查證。',
        '錄音有跑者本人同意公開的話：「她轉身等我的時候，我就敢跑完了。」',
        '轉貼背面寫著原圖 F17。再試著貼另一個帳號的轉貼。',
        '名冊證實完賽紀錄，無法支持「全場落淚」。',
      ][v];
    },
    ready: (c) => c.state().picks.length === 2,
  };

  toys.memory = {
    title: '讓新球迷接最後一拍',
    tip: '學會「鼓心、鼓邊」，明年留一拍給新朋友。',
    init: () => ({ start: false, beat: 0, passed: false }),
    view(c) {
      const m = c.local;
      if (!m.start)
        return scene(
          rows(icon('drum'), control('start', '第七局，請鼓手起拍', { image: 'flag' })),
          'ap-rhythm',
        );
      const stand =
        '<div class="ap-stand" aria-hidden="true">' +
        Array.from(
          { length: 6 },
          (_, i) =>
            '<i class="' +
            (i < (m.passed ? 6 : m.beat === 2 ? 4 : m.beat === 1 ? 2 : 0) ? 'cheer' : '') +
            '"></i>',
        ).join('') +
        '</div>';
      return (
        scene(
          stand +
            '<div class="ap-score" aria-label="節奏：鼓心、鼓邊">' +
            ['咚', '嗒'].map((x, i) => '<i class="' + (m.beat > i ? 'hit' : '') + '">' + x + '</i>').join('') +
            '</div>' +
            rows(
              control('beat-0', '咚 · 鼓心', { image: 'drum', cls: 'ap-pad' }),
              control('beat-1', '嗒 · 鼓邊', { image: 'beat', cls: 'ap-pad' }),
            ),
          'ap-rhythm',
        ) +
        (m.beat >= 2
          ? rows(
              control('pass', m.passed ? '新球迷接上了' : '隔年，把最後一拍交給新球迷', {
                image: 'beat',
                disabled: m.passed,
              }),
            )
          : hint(m.beat === 0 ? '先敲鼓心，再敲鼓邊。可以照譜慢慢接。' : '咚！第二拍輪到鼓邊。'))
      );
    },
    push(c, k) {
      const m = c.local;
      if (k === 'start') {
        m.start = true;
        c.act('time1');
        return '第七局鼓手舉棒：咚、嗒。看台等你跟著接。';
      }
      if (k === 'pass' && m.beat >= 2) {
        m.passed = true;
        c.act('year1');
        c.strike(1);
        return '明年，第一次進場的球迷也能跟著拍。';
      }
      if (k.startsWith('beat-')) {
        c.strike(asInt(k));
        if (m.beat >= 2) return '兩拍都記住了，讓明年的新球迷加入吧。';
        if (asInt(k) !== m.beat) {
          m.beat = 0;
          return '鼓手重新打出「咚、嗒」。跟著譜再試，不必搶快。';
        }
        m.beat++;
        if (m.beat === 2) c.act('role1');
        return m.beat === 2 ? '你把符號變成了身體記得的動作。' : '第一拍已接上。';
      }
    },
    ready: (c) => c.local.passed,
  };

  const lifeButton = (key, text, selected) =>
    '<button type="button" class="life-button" data-ap="' +
    key +
    '"' +
    (selected === undefined ? '' : ' aria-pressed="' + selected + '"') +
    '>' +
    text +
    '</button>';
  const lifeRow = (...actions) => '<div class="life-actions">' + actions.join('') + '</div>';
  const pocket = (c, name, title, content) =>
    '<details class="life-pocket" data-pocket="' +
    name +
    '"' +
    (c.local[name] ? ' open' : '') +
    '><summary>' +
    title +
    '</summary>' +
    content +
    '</details>';
  const bird =
    '<svg viewBox="0 0 32 27" aria-hidden="true"><path fill="#226f80" d="m1 22 7-12 8-1 4-7 6 1 2 5-5 5-3 9-8 2 2-5z"/><path fill="#d57542" d="m12 22 9-12 4-1-3 12-7 3z"/><path fill="#8fc5c5" d="m5 20 6-10 8-1-7 7z"/><path fill="#253f49" d="m25 6 7 2-7 1z"/><circle cx="23.7" cy="5.5" r="1.1" fill="#f9edd8"/></svg>';
  function sourceTab(rule, s) {
    if (!s.last) return '';
    const source = rule.source(s);
    return (
      '<button type="button" class="life-source" title="翠鳥書籤帶你翻到這段原刊" data-ap="original">' +
      bird +
      '<span>' +
      source.label +
      '</span><small>讀原刊 p.' +
      source.page +
      '</small></button>'
    );
  }
  function lifeAction(c, key, rule) {
    if (!c.act(key)) return;
    return rule.feedback(c.state());
  }
  toys.persona = {
    readout(s) {
      if (!s.last.startsWith('person')) return DecisionGames.rules.persona.feedback(s);
      if (s.report === null) return '這是攤平後的原問卷。掛出一張招牌，看這個人會不會舉手。';
      const fits = DecisionGames.rules.persona.cards[s.lastPerson].match[s.report];
      return fits
        ? '這句招牌對上了紙裡的需要，所以這個人舉手了。'
        : '這句招牌和紙裡寫下的需要不同，所以這個人坐著。';
    },
    title: '園遊會的水壺攤',
    tip: '攤開一個紙人，看他怎麼喝水。再替同一攤水壺換句招牌。',
    view(c) {
      const s = c.state(),
        rule = DecisionGames.rules.persona;
      const signs = lifeRow(
        ...rule.messages.map((name, i) => lifeButton('hang' + i, '掛「' + name + '」', s.report === i)),
      );
      const followup =
        s.tested.length === 2 && s.opened.length
          ? '<div class="life-choice"><p>想先驗證哪一句？</p>' +
            lifeRow(
              ...rule.messages.map((name, i) =>
                lifeButton('field' + i, '帶「' + name + '」給真人試', s.followup === 'field' + i),
              ),
            ) +
            '</div>'
          : '';
      const brand = lifeRow(
        lifeButton('scope1', '問以前聽過嗎'),
        lifeButton(
          s.exposed && !s.covered ? 'cover' : 'reveal',
          s.exposed && !s.covered ? '把牌名蓋回去' : '揭開新牌名',
        ),
        s.exposed ? lifeButton('fresh', '換乾淨紙人') : '',
        s.asked ? lifeButton('survey', '另找真人做未提示調查', s.followup === 'survey') : '',
      );
      return (
        AtlasLifeArt.people(s, rule) +
        '<div class="life-response"></div>' +
        signs +
        followup +
        pocket(c, 'brand', '如果想知道，原本有誰認識這個品牌？', brand) +
        sourceTab(rule, s)
      );
    },
    push(c, key) {
      const rule = DecisionGames.rules.persona;
      if (key === 'hang0' || key === 'hang1') {
        c.act('copy' + key.slice(4));
        key = 'run';
      }
      return lifeAction(c, key, rule);
    },
    ready: (c) => DecisionGames.rules.persona.ready(c.state()),
  };

  const stallNames = ['通路', '社群', '記憶'];
  const stallIcons = ['shop', 'chat', 'flag'];
  const marketNotes = [
    '洗衣精已被記住，但她在店門口只看到競品。',
    '鞋的價格和尺碼都查到了，他還在問穿過的人腳感如何。',
    '新品已經上架，聚會前卻沒有人想起可以帶這瓶飲料。',
  ];
  function positions(tokens) {
    return [
      ...tokens.flatMap((n, i) => Array(n).fill(i)),
      ...Array(3 - tokens.reduce((a, b) => a + b, 0)).fill(-1),
    ];
  }
  toys.context = {
    title: '把三枚預算放上攤位',
    tip: '每枚籌碼只花一次，可從一攤搬到另一攤。',
    init: (s) => ({ coins: positions(s.tokens) }),
    view(c) {
      const s = c.state(),
        m = c.local;
      if (s.tokens.some((n, i) => n !== m.coins.filter((v) => v === i).length)) m.coins = positions(s.tokens);
      const trays = ['未分配', ...stallNames],
        ids = [-1, 0, 1, 2];
      const stalls = trays
        .map(
          (n, j) =>
            `<div class="ap-stall">${target('tray-' + j, n, j ? stallIcons[j - 1] : null, 'ap-tray')}<div class="ap-coinrow">${m.coins.map((v, i) => (v === ids[j] ? piece(c, 'coin-' + i, String(i + 1), 'coin', 'ap-coin') : '')).join('')}</div></div>`,
        )
        .join('');
      return (
        rows(...['補洗衣精', '買登山鞋', '帶聚會飲料'].map((n, i) => tab('market-' + i, n, s.market === i))) +
        hint(marketNotes[s.market]) +
        scene('<div class="ap-market">' + stalls + '</div>', 'ap-marketfield')
      );
    },
    push(c, k) {
      if (k.startsWith('market-')) {
        c.act('market' + asInt(k));
        return '籌碼留在原位。眼前的顧客改在哪一個時刻做決定？';
      }
    },
    drop(c, p, d) {
      if (!p.startsWith('coin-') || !d.startsWith('tray-')) return;
      const i = asInt(p),
        to = asInt(d) - 1,
        from = c.local.coins[i];
      if (to === from) return '這枚籌碼已經在這裡。';
      if (from >= 0 && !c.act('minus' + from)) return '這一攤的籌碼已經被收回。';
      if (to >= 0 && !c.act('plus' + to)) {
        if (from >= 0) c.act('plus' + from);
        return '這一枚沒有完成分配，可以再試。';
      }
      c.local.coins[i] = to;
      return to < 0
        ? '籌碼回到手上，可以重新分配。'
        : to === c.state().market
          ? '這一攤接到了這位客人眼前的障礙。'
          : '這一攤有其作用。再看看眼前顧客為什麼猶豫。';
    },
    ready: (c) => c.state().tokens.reduce((a, b) => a + b, 0) === 3,
  };

  const journey = ['商品頁', '取貨頁', '客服窗'];
  const delays = [
    '刻字完成，連收禮人的稱呼都選好了。',
    '週六要送禮，她找不到這家店最早可取貨的日期。',
    '店員接起電話，第一句又問「您選哪一家店？」',
  ];
  const repairs = ['折價券', '最早取貨日', '轉交已選門市'];
  toys.friction = {
    title: '把取貨斷點放大',
    tip: '把放大鏡放到流程上，再換一張修補片。',
    view(c) {
      const s = c.state();
      return (
        scene(
          '<div class="ap-pipeline">' +
            journey
              .map((n, i) =>
                target('spot-' + i, n, ['parcel', 'shop', 'chat'][i], s.seen.includes(i) ? 'ap-inspected' : ''),
              )
              .join('') +
            '</div>',
        ) +
        (s.stop >= 0
          ? '<div class="ap-parceltrace" aria-hidden="true"><i style="--where:' +
            s.stop +
            '">' +
            icon('parcel') +
            '</i></div>'
          : '') +
        rows(
          piece(c, 'glass', '放大鏡', 'lens'),
          ...(s.seen.length >= 2
            ? repairs.map((n, i) => piece(c, 'patch-' + i, n, ['coin', 'clock', 'chat'][i]))
            : []),
        ) +
        hint(
          s.fix >= 0
            ? '本輪修補片：' + repairs[s.fix] + '。可更換一片再比較。'
            : s.stop >= 0
              ? delays[s.stop]
              : '先觀察至少兩站。每一站，都藏著客人已經做過的一件事。',
        )
      );
    },
    drop(c, p, d) {
      if (!d.startsWith('spot-')) return;
      const i = asInt(d);
      if (p === 'glass') {
        c.act('stop' + i);
        return delays[i];
      }
      if (p.startsWith('patch-')) {
        const n = asInt(p);
        if (n === 1 && i !== 1) return '取貨日要貼在顧客選門市的那一步，才能及時派上用場。';
        if (n === 2 && i !== 2) return '客服窗需要接到前一站選的門市，把這張片放在客服窗。';
        c.act('fix' + n);
        return [
          '價格降低了，週六能不能取貨仍要打電話問。',
          '她可以對照聚會日期了。門市必須同步庫存和交期，才能兌現這張單。',
          '店員一接起就能沿用剛選的門市，少問了一次。',
        ][n];
      }
    },
    ready: (c) => c.state().seen.length >= 2 && c.state().fix >= 0,
  };

  toys.signal = {
    title: '提著早餐趕七點的車',
    tip: '06:45，外帶早餐已經到手。推一下百貨鐵門，或沿大路走到月台。',
    view(c) {
      const s = c.state(),
        rule = DecisionGames.rules.signal;
      const choices = lifeRow(
        lifeButton('notice', s.noticeVisible ? '抽掉入口公告' : '掛回入口公告'),
        lifeButton('stroller', s.stroller ? '收起推車' : '帶一輛推車', s.stroller),
        lifeButton('ask', '問站務怎麼走'),
      );
      const request =
        '<p class="life-memo">' +
        (s.named ? '「先問上次替我留早餐的晨禾旅店。」' : '「幫我找一間站前旅店，可以帶著早餐趕火車。」') +
        '</p>' +
        lifeRow(lifeButton('memo', '翻到另一份委託', s.named));
      return (
        AtlasLifeArt.route(s, rule) +
        '<div class="life-response"></div>' +
        choices +
        pocket(c, 'request', '旅客交給 AI 的那張紙', request) +
        sourceTab(rule, s)
      );
    },
    push: (c, key) => lifeAction(c, key, DecisionGames.rules.signal),
    ready: (c) => DecisionGames.rules.signal.ready(c.state()),
  };

  const jobs = ['推薦卡', '整理書單', '送出訂單'];
  const locks = ['只擬草稿', '確認後執行', '直接執行'];
  toys.permission = {
    title: '三把鑰匙，三道授權鎖',
    tip: '把每個任務的鑰匙插到合適的鎖，隨時可以改配。',
    view(c) {
      const s = c.state();
      return (
        rows(tab('spec-0', '籠統的創作規格', s.spec === 0), tab('spec-1', '店員試讀筆記', s.spec === 1)) +
        rows(
          ...jobs.map((n, i) =>
            piece(c, 'job-' + i, n + (s.levels[i] >= 0 ? ' · ' + locks[s.levels[i]] : ''), 'key', 'ap-taskkey'),
          ),
        ) +
        scene(
          '<div class="ap-locks">' +
            locks
              .map(
                (n, i) =>
                  '<div>' +
                  target('lock-' + i, n, 'lock') +
                  '<div class="ap-keyring" aria-hidden="true">' +
                  s.levels
                    .map((level, j) =>
                      level === i
                        ? '<i style="--key:' +
                          ['#edc674', '#a4cbb2', '#e19b89'][j] +
                          '">' +
                          icon('key') +
                          '</i>'
                        : '',
                    )
                    .join('') +
                  '</div></div>',
              )
              .join('') +
            '</div>',
        ) +
        hint('讀者已同意整理書單，付款金額還沒有確認。')
      );
    },
    push(c, k) {
      if (k.startsWith('spec-')) {
        c.act('spec' + asInt(k));
        return asInt(k)
          ? '用試讀筆記和出處定義寫作規格，推薦卡有了書店自己的聲音。'
          : '「寫得有趣」還不足以定義書店自己的語氣。';
      }
    },
    drop(c, p, d) {
      if (!p.startsWith('job-') || !d.startsWith('lock-')) return;
      const j = asInt(p),
        l = asInt(d);
      c.act('job' + j);
      c.act('level' + l);
      if (j === 2 && l === 2) return '這把鑰匙會直接送出訂單，已越過讀者同意的付款範圍。你可以重新配鎖。';
      if (j === 2 && l === 1) return '訂單做好後停在確認畫面，付款交給讀者決定。';
      if (j === 1 && l === 2) return '整理書單已獲授權，可以直接交給讀者。';
      return jobs[j] + '現在設成「' + locks[l] + '」。看一下其餘兩個任務需要誰點頭。';
    },
    ready: (c) => c.state().levels.every((v) => v >= 0),
  };

  // The book keeps each active decision in memory while its reader is open.
  // Pin the toy to the same decision so a half-played rhythm or a moved coin survives closing the sheet.
  const progress = new WeakMap();
  function mount(host, options) {
    const { id, onAct, onDone, onClose, getState, data, motion } = options;
    const toy = toys[id];
    const rule = window.DecisionGames?.rules[id];
    if (!toy || !rule) throw new Error('無法開啟紙上遊戲 ' + id);
    const external = typeof getState === 'function' || !!data;
    const localState = external ? null : rule.initial();
    const state = () => (typeof getState === 'function' ? getState() : data || localState);
    if (!progress.has(state())) progress.set(state(), toy.init?.(state()) || {});
    const ctx = {
      state,
      held: null,
      local: progress.get(state()),
      strike: (index) => options.onBeat?.(index),
      act(action) {
        if (onAct?.(action) === false) return false;
        if (!external) rule.change(localState, action);
        return true;
      },
    };
    const root = document.createElement('section');
    root.className = 'ap-play ap-' + id + (motion === false ? ' ap-still' : '');
    root.setAttribute('aria-label', toy.title);
    root.innerHTML = `<header class="ap-head"><div><h2>${toy.title}</h2><p>${toy.tip}</p></div><button type="button" data-ap="close" class="ap-close" aria-label="收起紙上遊戲">收起</button></header><div class="ap-work"></div><div class="ap-note" role="status" aria-live="polite"></div><footer class="ap-foot"><p></p><button type="button" data-ap="done" class="ap-finish">收錄這次決定</button></footer>`;
    host.replaceChildren(root);
    const work = root.querySelector('.ap-work'),
      note = root.querySelector('.ap-note'),
      finish = root.querySelector('.ap-finish');
    const caption = root.querySelector('.ap-foot p');
    const pilot = Boolean(rule.source);
    const abort = new AbortController();
    let dead = false,
      drag = null,
      ghost = null,
      over = null,
      ignoreClick = false,
      submitted = false;
    const listener = (el, type, fn, config = {}) =>
      el.addEventListener(type, fn, { ...config, signal: abort.signal });

    function render(message, focusKey) {
      if (dead) return;
      const active = root.contains(document.activeElement) ? document.activeElement : null;
      const restore = focusKey || active?.dataset.ap || '';
      for (const detail of work.querySelectorAll('details[data-pocket]')) {
        ctx.local[detail.dataset.pocket] = detail.open;
      }
      work.innerHTML = toy.view(ctx);
      if (pilot) {
        work.querySelector('.life-response').append(note);
        note.textContent = toy.readout?.(state()) ?? message ?? rule.feedback(state());
        finish.textContent = id === 'persona' ? '收下研究筆記'
          : rule.itinerary(state()).status === 'unknown' ? '記下待確認的事' : '收下行程票';
      }
      const ready = Boolean(toy.ready(ctx));
      finish.disabled = !ready || submitted;
      caption.textContent = ready ? conciseText[id] : '';
      caption.hidden = !ready;
      root.classList.toggle('ap-holding', Boolean(ctx.held));
      if (!pilot && message !== undefined) note.textContent = message;
      if (restore) {
        const exact = [...root.querySelectorAll('button[data-ap]:not(:disabled)')].find(
          (b) => b.dataset.ap === restore,
        );
        const brandSwitch = ['reveal', 'cover', 'fresh'].includes(restore)
          ? work.querySelector('button[data-ap="reveal"],button[data-ap="cover"]') : null;
        (exact || brandSwitch || work.querySelector('button:not(:disabled)') || finish)?.focus({ preventScroll: true });
      }
    }
    function transfer(source, dest) {
      ctx.held = null;
      const message = toy.drop?.(ctx, source, dest);
      render(message || '這張道具要放到相應的欄位。', dest);
    }
    function clearGesture() {
      if (over) over.classList.remove('ap-over');
      over = null;
      ghost?.remove();
      ghost = null;
      drag = null;
      root.classList.remove('ap-dragging');
    }
    function activate(b) {
      const key = b.dataset.ap;
      if (key === 'close') {
        onClose?.();
        return;
      }
      if (key === 'original' && rule.source) {
        options.onRead?.(rule.source(state()));
        return;
      }
      if (key === 'done') {
        if (submitted || !toy.ready(ctx)) return;
        submitted = true;
        finish.disabled = true;
        if (onDone?.() === false) {
          submitted = false;
          render('還有一個決定需要完成。');
        }
        return;
      }
      if (b.hasAttribute('data-piece')) {
        ctx.held = ctx.held === key ? null : key;
        render(
          ctx.held
            ? '拿起了「' + b.textContent.trim() + '」。點亮起的欄位放下，也可以直接拖曳。'
            : '道具已放回。',
          key,
        );
      } else if (b.hasAttribute('data-target')) {
        if (ctx.held) transfer(ctx.held, key);
        else render('先拿起道具，再點這個位置放下。', key);
      } else {
        ctx.held = null;
        render(toy.push?.(ctx, key), key);
      }
    }
    listener(root, 'click', (e) => {
      const b = e.target.closest('button[data-ap]');
      if (!b || !root.contains(b) || b.disabled) return;
      if (ignoreClick && e.detail !== 0) {
        ignoreClick = false;
        e.preventDefault();
        return;
      }
      activate(b);
    });
    listener(root, 'keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (ctx.held) {
          ctx.held = null;
          render('已放回道具。');
        } else onClose?.();
      }
    });
    listener(root, 'pointerdown', (e) => {
      const b = e.target.closest('button[data-piece]');
      if (!b || b.disabled || e.button !== 0 || !e.isPrimary) return;
      clearGesture();
      ignoreClick = false;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, piece: b.dataset.ap, node: b, moving: false };
    });
    const findTarget = (x, y) => {
      const dest = document.elementFromPoint(x, y)?.closest('[data-target]');
      return dest && root.contains(dest) ? dest : null;
    };
    listener(
      window,
      'pointermove',
      (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        if (!drag.moving && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return;
        if (!drag.moving) {
          drag.moving = true;
          drag.node.setPointerCapture?.(drag.id);
          root.classList.add('ap-dragging');
          ghost = drag.node.cloneNode(true);
          ghost.classList.add('ap-ghost');
          ghost.removeAttribute('data-piece');
          ghost.setAttribute('aria-hidden', 'true');
          ghost.tabIndex = -1;
          root.append(ghost);
        }
        e.preventDefault();
        // A fixed clone follows the pointer. Using the viewport's hit test keeps
        // drop targets correct when the atlas is scrolled or scaled.
        ghost.style.left = e.clientX + 'px';
        ghost.style.top = e.clientY + 'px';
        const next = findTarget(e.clientX, e.clientY);
        if (over !== next) {
          over?.classList.remove('ap-over');
          next?.classList.add('ap-over');
          over = next;
        }
      },
      { passive: false },
    );
    listener(window, 'pointerup', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const was = drag,
        dest = findTarget(e.clientX, e.clientY);
      clearGesture();
      if (was.moving) {
        ignoreClick = true;
        if (dest) transfer(was.piece, dest.dataset.ap);
        else {
          ctx.held = null;
          render('放回原處。也可以點道具，再點要放的位置。', was.piece);
        }
        // The compatibility click, when present, is dispatched after pointerup.
        window.setTimeout(() => {
          ignoreClick = false;
        }, 0);
      }
    });
    listener(window, 'pointercancel', clearGesture);
    listener(window, 'blur', clearGesture);
    render();
    return {
      destroy() {
        if (dead) return;
        for (const detail of work.querySelectorAll('details[data-pocket]')) ctx.local[detail.dataset.pocket] = detail.open;
        dead = true;
        abort.abort();
        clearGesture();
        root.remove();
      },
    };
  }
  window.AtlasPlay = { mount };
})();
