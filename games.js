(() => {
  'use strict';

  const articles = {
    1: ['AI for Growth', '唐心慧 Jennifer Tang', '6–11'],
    2: ['品牌與人的真實距離', '邵懿文 Freda Shao', '12–17'],
    3: ['真實的力量', '周麗君', '20–27'],
    6: ['信任', '楊欣怡', '44–49'],
    7: ['AI 可以幫人買東西，但品牌要讓人想買東西', '陳蒔', '50–57'],
    8: ['娛樂與運動如何累積品牌心智資產？', '何華軒', '58–65'],
    9: ['討好演算法，還是打動人？', '孫韞筑', '66–71'],
    10: ['別買曝光了，開始買注意力吧', '徐莉媛', '72–79'],
    11: ['共同記憶帶來的品牌價值', '吳宗霖、陳炯文', '80–93'],
    12: ['People Model', '陳介立、孫郁喬、高靖萍', '96–115'],
    13: ['在注意力被 AI 稀釋的時代，如何守住品牌被選擇的關鍵場域', '吳宗霖', '116–127'],
    14: ['「衡斷力 (Judgment)」將成為最稀缺的競爭力', '強義明', '128–135'],
    15: ['生成式體驗來臨', '鄭怡櫛、張家誠', '136–143'],
    17: ['顧客為何停下來？', '陳詳翰、康晉嵐', '152–159'],
    18: ['體驗這件事，我們一直只問了一半', '王姿喨、詹佳穎、黃靖婷', '160–167'],
    19: ['GEO 時代', '莊閔雯、呂季霖', '168–175'],
    20: ['拒絕同質化 AI Slop', '潘其偉', '176–181'],
    22: ['保健、美妝與零售如何把 AI 變成行動能力', '張詠琦、蔡孟軒、楊至靜', '188–195']
  };

  const rows = [
    ['growth', 'prologue', '港邊早餐車', 'Jennifer Tang 的成長實驗', '橋縫前晃了一下，第一杯熱湯灑在信角。', [1], '先送一杯，才知道下一籃該怎麼裝。'],
    ['distance', 'prologue', '把椅子轉過來', 'Freda Shao 的換位提問', '同一把雨傘，品牌與使用者看見什麼？', [2], '坐到通勤者的位置，試試哪個問題能讓產品提案改變方向。'],
    ['witness', 'people', '一則故事的來處', '真實、查證與社群信任', '這張終點線照片，足以寫出怎樣的故事？', [3, 6, 9], '為一則賽事故事挑選兩份材料，看看編輯能負責任地寫到哪裡。'],
    ['memory', 'people', '把今晚留到明年', '注意力與共同記憶', '球場散場後，明年還能一起做哪個動作？', [8, 10, 11], '為主場的第七局編一段儀式，把一次看見變成可以重演的記憶。'],
    ['persona', 'model', '園遊會的水壺攤', 'People Model 專題', '哪句招牌值得帶去找真人試用？', [12], '攤開一個舉手的紙人，沿著摺痕找回原問卷，再決定要去問真人什麼。'],
    ['context', 'model', '三枚籌碼', '選擇場域與人的衡斷', '三枚預算籌碼，應該守住哪個選擇時刻？', [13, 14], '親自分配預算，然後帶著同一套配置，換個品類再試一次。'],
    ['friction', 'ai', '最後一步', '顧客猶豫與決策支援', '她已經想買，為什麼最後還是停下來？', [15, 17], '翻開取貨流程的現場筆記，挑一個改動，觀察前台和後台的連鎖反應。'],
    ['signal', 'ai', '早餐到月台', '代理體驗與情境搜尋', '早餐拿到了，走哪條路趕得上七點的車？', [18, 19, 7], '推開近路的鐵門，看看代理替你排的路能不能走。換一位帶推車的旅客，再試一次。'],
    ['permission', 'ai', '交出哪一把鑰匙', 'AI 的交付與行動權限', '從寫文案到替人下單，每一步該交出多少權限？', [20, 22], '替一間書店設定代理的工作規格與授權，走一次真正在櫃檯發生的任務。']
  ];
  const list = rows.map(([id, region, title, subtitle, question, articles, intro]) =>
    ({ id, region, title, subtitle, question, articles, intro, minutes: 1 }));
  const regions = { prologue: '序章', people: 'People', model: 'Model', ai: 'AI' };

  // All symbols share a 48-unit box, so a scene can show the same object changing.
  const symbols = {
    bag: '<path class="dg-color" d="M9 41V18q0-6 7-8h14q7 3 8 9v22z"/><path d="M18 10V7q5-7 11 0v3M11 24q12 7 24-1"/><path class="dg-paper" d="m15 27 16-1v10l-16 1z"/>',
    key: '<circle class="dg-color" cx="14" cy="14" r="8"/><circle cx="14" cy="14" r="2"/><path d="m20 20 19 19m-6-6 4-4m-8 0 4-4"/>',
    human: '<circle class="dg-paper" cx="23" cy="13" r="8"/><path class="dg-color" d="M7 41q2-17 15-18 16-1 19 18z"/><path d="m17 26 6 7 7-8"/>',
    rain: '<path class="dg-paper" d="M4 20q1-8 9-8 3-12 15-8 7 1 9 10 8-1 9 6z"/><path d="m11 26-5 8m18-8-5 8m18-8-5 8m-17 0-4 7"/>',
    umbrella: '<path class="dg-color" d="M3 26q8-31 40-5-6-1-7 5-6-6-11 0-6-5-11 1-6-5-11-1z"/><path d="m23 22 5 16q0 7-7 5m-1-33q12 3 15 15"/>',
    closed: '<path class="dg-color" d="m23 5-5 27 13 1-6-28z"/><path d="m25 33 1 8q1 6-5 3M19 26h10"/>',
    file: '<path class="dg-paper" d="M9 4h23l7 9v31H9z"/><path d="M32 4v10h7M15 20h17m-17 6h16m-16 6h10"/>',
    mic: '<rect class="dg-color" x="17" y="5" width="15" height="24" rx="7"/><path d="M12 21v4q2 11 12 11t13-11v-4M24 36v7m-8 0h16"/>',
    photo: '<path class="dg-paper" d="M3 6h41v35H3z"/><path class="dg-color" d="M7 11h32v22H7z"/><circle class="dg-paper" cx="30" cy="16" r="3"/><path d="m7 30 10-12 7 9 5-4 10 8"/>',
    quote: '<path class="dg-paper" d="M5 6h37v26H22l-10 10 1-10H5z"/><path d="m15 22 3-10h5l-4 10zm12 0 3-10h5l-4 10z" class="dg-color"/>',
    drum: '<ellipse class="dg-paper" cx="24" cy="18" rx="18" ry="7"/><path class="dg-color" d="M6 18v19q18 12 36 0V18q-18 13-36 0z"/><path d="m9 23 7 15 6-13 8 15 7-16M3 8l18 7M44 4 27 14"/>',
    ticket: '<path class="dg-paper" d="M2 13h44v7q-6 3 0 6v8H2v-8q6-3 0-6z"/><path d="M16 14v19m5-14h17m-17 6h11"/>',
    board: '<path class="dg-paper" d="M4 6h40v30H4z"/><path d="M12 43h24m-12-7v7"/><path class="dg-color" d="m12 28 7-9 6 5 10-12v16z"/>',
    cup: '<path class="dg-color" d="M10 7h24l-2 34H13z"/><path class="dg-paper" d="M9 5h26v7H9z"/><path d="M14 23h16"/>',
    form: '<path class="dg-paper" d="M7 7h35v37H7z"/><rect class="dg-color" x="16" y="4" width="16" height="6" rx="2"/><path d="m12 20 2 2 4-5m3 3h12m-21 9 2 3 4-6m3 4h12"/>',
    split: '<path d="M4 23h12q4 0 7-7l3-5h13m-5-4 6 4-6 4M15 23q6 1 9 8l3 6h12m-5-4 6 4-6 4"/>',
    shop: '<path class="dg-paper" d="M6 21h36v22H6z"/><path class="dg-color" d="m5 10 36-1 5 12q-5 6-10 0-4 5-9 0-5 5-9 0-6 5-10 0-5 5-7 0z"/><path d="M11 43V29h9v14m5-15h12v8H25z"/>',
    coin: '<path class="dg-color" d="M4 18v12q19 19 40 0V18z"/><ellipse class="dg-paper" cx="24" cy="18" rx="20" ry="10"/><path d="M21 18h6m-3-3v6"/>',
    shoe: '<path class="dg-color" d="m5 23 6-9 12 9 5-4 6 7 9 3v9H4z"/><path d="M5 33h36m-21-8 3-5m3 7 3-5"/>',
    clock: '<circle class="dg-paper" cx="23" cy="23" r="18"/><path d="M23 10v14l10 5M20 43h8"/>',
    parcel: '<path class="dg-paper" d="m3 15 20-9 23 9-22 10z"/><path class="dg-color" d="M3 15v19l21 10V25z"/><path class="dg-paper" d="m24 25 22-10v19l-22 10z"/><path d="m12 11 23 10v8"/>',
    fork: '<path d="M11 6v13q6 6 12-1V6m-6 0v37m20 0V6q-9 12-9 20h8"/>',
    train: '<rect class="dg-color" x="8" y="4" width="32" height="33" rx="5"/><path class="dg-paper" d="M12 11h24v12H12z"/><path d="m15 38-7 7m24-7 7 7m-26-3h23"/><circle class="dg-paper" cx="16" cy="29" r="2"/><circle class="dg-paper" cx="31" cy="29" r="2"/>',
    check: '<circle class="dg-color" cx="24" cy="24" r="18"/><path d="m15 24 6 6 13-15"/>',
    book: '<path class="dg-paper" d="M3 10q10-5 21 1 10-6 21-2v29q-12-4-21 2-11-6-21-3z"/><path d="M24 11v29M8 18q6-3 11 1m10 0q5-4 10-3m-30 9q6-2 11 1"/>',
    lock: '<rect class="dg-color" x="9" y="21" width="30" height="22" rx="3"/><path d="M15 21v-7q0-16 19-4l1 11"/><circle class="dg-paper" cx="24" cy="30" r="3"/><path d="M24 33v4"/>'
  };
  const glyph = (name,x,y,size) => `<g transform="translate(${x} ${y}) scale(${size / 48})">${symbols[name]}</g>`;
  const join = (fromX,toX,y) => `<path class="dg-flow" d="M${fromX} ${y}H${toX}m-6-4 6 4-6 4"/>`;
  const pair = (a,b) => glyph(a,27,42,62) + join(89,113,71) + glyph(b,117,38,65);
  const stack = (sym) => glyph(sym,33,32,64) + glyph(sym,66,41,64) + glyph(sym,99,50,64);
  const crowd = (withNewcomer) => glyph('human',22,53,44) + glyph('drum',73,45,60) + glyph('human',139,withNewcomer ? 65 : 51,withNewcomer ? 32 : 48) + '<path class="dg-flow" d="m58 58 6-5m-3 12 7-2m65-5 6 3m-8-10 7 1"/>';
  const cardRow = () => glyph('form',25,46,52) + glyph('form',47,41,52) + join(101,118,68) + glyph('human',124,34,67);
  const scenes = {
    growth: [
      ['提出預測','團隊預測通勤者需要一個容量更大的背包。',pair('file','bag')],
      ['讓人試用','雨天一手拿傘，她翻遍背包才找到鑰匙。',glyph('rain',18,17,52) + glyph('human',38,61,49) + glyph('bag',88,51,62) + glyph('key',151,68,32)],
      ['修正再試','鑰匙移到外袋後，團隊請她再走一次同一段路。',glyph('bag',39,21,94) + glyph('key',94,71,36) + glyph('check',141,40,35)]
    ],
    distance: [
      ['品牌發問','品牌介紹八根傘骨，顧客只好跟著回憶規格。',pair('umbrella','file')],
      ['聽見情境','把問題換成「哪一刻最不方便」，才聽見下車時她騰不出手。',glyph('human',28,48,63) + glyph('quote',77,22,54) + glyph('umbrella',120,55,58)],
      ['重寫提案','團隊帶著能單手收起的傘回到站牌試用。',pair('umbrella','closed')]
    ],
    witness: [
      ['故事流傳','同一張終點線照片被轉貼三次，看來像有三份證據。',stack('photo')],
      ['追索來源','找到原始影像，再聽跑者親口說出當時的心情。',glyph('photo',34,36,75) + glyph('mic',120,35,68)],
      ['收斂說法','兩份材料支持兩位跑者的故事，觀眾的心情仍待查證。',pair('quote','form')]
    ],
    memory: [
      ['看見訊號','球迷看過隊名和票根，但還沒有一個共同動作。',glyph('ticket',35,30,102) + glyph('human',130,66,42)],
      ['一起參與','第七局響起同一段鼓點，全場一起拍兩下。',crowd(false)],
      ['再度想起','隔年保留熟悉節奏，新來的孩子也能接上最後一拍。',crowd(true) + glyph('ticket',148,27,33)]
    ],
    persona: [
      ['攤開紙人','沿著紙人的摺痕，看見他平時只空得出一隻手。',cardRow()],
      ['換水壺招牌','兩句話舉手的人數一樣，舉手的卻是不同的人。',glyph('cup',25,36,65) + glyph('split',86,37,65) + glyph('quote',149,28,34) + glyph('quote',149,80,34)],
      ['回到真人','把模擬得到的假設帶回現場，由真人試用校準。',pair('form','human')]
    ],
    context: [
      ['觀察現場','有些客人進店就拿競品，有些客人還在找可信的評價。',pair('shop','quote')],
      ['配置籌碼','手上只有三枚籌碼，每投到一處，就少了一次其他選擇。',glyph('coin',30,43,57) + glyph('coin',75,51,57) + glyph('coin',118,40,57)],
      ['檢視取捨','換成第一次買登山鞋的人，試穿心得可能比貨架位置更重要。',pair('shoe','quote')]
    ],
    friction: [
      ['發現停頓','她選好了禮物，流程卻停在選門市的那一頁。',pair('parcel','shop')],
      ['聽見顧慮','問了才知道，她擔心的是週六以前能不能取貨。',pair('human','clock')],
      ['驗證改動','把門市和可取貨日放在一起，再追蹤實際交付。',glyph('shop',30,38,65) + glyph('clock',104,32,51) + glyph('check',130,75,38)]
    ],
    signal: [
      ['提著早餐出門','離發車還有十五分鐘。地圖推薦一條穿過百貨的近路。',pair('train','fork')],
      ['推近路的門','百貨七點才開門。地圖上的五分鐘，漏掉了等門開的時間。',pair('fork','form')],
      ['改走大路','查到街口已開放。走十分鐘，06:55 抵達月台。',glyph('form',36,30,76) + join(111,126,69) + glyph('train',128,44,50) + glyph('check',148,74,30)]
    ],
    permission: [
      ['定義規格','只說「寫得有趣」，容易生成幾張口吻相似的推薦卡。',stack('file')],
      ['逐項授權','店員先附上試讀筆記，再分別訂出寫卡、列書單與下單的權限。',pair('book','key')],
      ['覆核行動','代理整理好書單，涉及付款的那一步留給讀者確認。',pair('human','lock')]
    ]
  };

  function picture(id,index) {
    return `<svg class="dg-art" viewBox="0 0 200 130" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g class="dg-lines"><path d="m8 94 19-2m143-58 18-3M17 36l14-2m120 77 25-3"/><ellipse cx="103" cy="111" rx="64" ry="4" fill="currentColor" opacity=".12" stroke="none"/></g><g class="dg-frame">${scenes[id][index][2]}</g></g></svg>`;
  }

  function button(action, label, active = null, extra = '') {
    const pressed = active === null ? '' : ` aria-pressed="${active}"`;
    return `<button type="button" class="dg-btn ${extra}" data-act="${action}"${pressed}>${label}</button>`;
  }
  function group(label, options, selected, prefix) {
    return `<fieldset class="dg-field"><legend>${label}</legend><div class="dg-options">${options.map((label, i) =>
      button(prefix + i, label, i === selected)).join('')}</div></fieldset>`;
  }
  function multiple(label, options, selected, prefix) {
    return `<fieldset class="dg-field"><legend>${label}</legend><div class="dg-options">${options.map((label, i) =>
      button(prefix + i, label, selected.includes(i))).join('')}</div></fieldset>`;
  }
  function note(label, message) {
    return `<div class="dg-note"><small>${label}</small><p>${message}</p></div>`;
  }
  function action(label, enabled = true) {
    return `<button class="dg-commit" type="button" data-act="commit" ${enabled ? '' : 'disabled'}>${label}</button>`;
  }
  function chooseTwo(array, index) {
    if (array.includes(index)) return array.filter(item => item !== index);
    if (array.length < 2) return [...array, index];
    return array;
  }

  const games = {};
  games.growth = {
    initial: () => ({ days: 7, log: [], steps: [], learning: false, improved: false }),
    render(s) {
      const history = s.log.length ? `<ol class="dg-log">${s.log.map(text => `<li>${text}</li>`).join('')}</ol>` : '';
      return note('試航日誌', 'AI 根據「容量更大」畫出第一版通勤包。你有七個工作天，可以繼續出圖，也可以帶著樣包去渡口找真人試背。') +
        `<div class="dg-days" aria-label="剩餘 ${s.days} 天">${Array.from({length:7}, (_,i) => `<i class="${i < s.days ? 'free' : ''}"></i>`).join('')}<b>剩 ${s.days} 天</b></div>` +
        `<div class="dg-options">${[['用 AI 出一組提案',1],['找人帶包通勤',3],['改版再試',2]].map(([label, cost], i) =>
          `<button type="button" class="dg-btn" data-act="step${i}" ${s.days < cost ? 'disabled' : ''}>${label}<small>${cost} 天</small></button>`).join('')}</div>` +
        history + action('結束這輪實驗', s.log.length > 0);
    },
    change(s, a) {
      const i = Number(a.slice(4)), cost = [1,3,2][i];
      if (!a.startsWith('step') || !cost || s.days < cost) return;
      s.days -= cost;
      const lines = ['多了一款外觀提案。辦公室裡對容量的假設還沒有新證據。', s.learning ? '第二位通勤者也在找鑰匙。值得比較有無外袋的版本。' : '一手拿傘的通勤者翻了半天才找到鑰匙。她想要伸手就拿得到的外袋。', s.learning ? '把鑰匙移到外袋後，同一位通勤者單手就能開門。團隊記下下一輪要驗證的情境。' : '團隊依內部偏好加大容量，改動完成，仍待使用者驗證。'];
      s.log.push(lines[i]);
      (s.steps ||= []).push(i);
      if (i === 2 && s.learning) s.improved = true;
      if (i === 1) s.learning = true;
    },
    result(s) {
      if (s.improved) return ['完成一次學習循環', '你把預測交給真實情境檢查，再用觀察改版。這一位通勤者的經驗，讓團隊知道下一輪該驗證什麼。'];
      return s.learning ? ['找到下一輪的起點', '你發現容量以外的痛點。把觀察變成一版可試用的外袋，再看同一個困難有沒有消失。'] : ['設計庫增加了，假設仍待驗證', '這輪的成果都來自辦公室。留三天觀察一次通勤，或許就會改寫下一版需求。'];
    }
  };

  const distanceScenes = [
    ['下車時', '我要收傘、刷卡，後面還有一整排人。', '單手收傘'],
    ['走回家', '路口風很大，我只希望傘骨別再翻過去。', '抗風傘骨'],
    ['走進公司', '我和同事站得很近，傘收了還在滴水。', '快收吸水套']
  ];
  games.distance = {
    initial: () => ({ seat:0, question:-1, seen:false, feature:-1 }),
    render(s) {
      const row = distanceScenes[s.seat];
      const answers = ['我有一把八根傘骨、三折的雨傘。', row[1], '我比較喜歡深色。'];
      return group('坐進一段通勤路', distanceScenes.map(r => r[0]), s.seat, 'seat') +
        group('你想開口問什麼？', ['手上的傘有什麼規格？','剛才哪一刻最不方便？','你喜歡哪個顏色？'], s.question, 'ask') +
        note('通勤者的回答', s.question < 0 ? '換一個問題，聽聽坐在對面的聲音。' : '「' + answers[s.question] + '」') +
        group('把哪個提案帶去試用？', distanceScenes.map(r => r[2]), s.feature, 'pick') +
        action('寫下試用假設', s.question >= 0 && s.feature >= 0);
    },
    change(s,a) {
      if (a.startsWith('seat')) {s.seat = +a.slice(4); s.question = -1; s.seen = false; s.feature = -1;}
      if (a.startsWith('ask')) {s.question = +a.slice(3); if (s.question === 1) s.seen = true;}
      if (a.startsWith('pick')) s.feature = +a.slice(4);
    },
    result(s) {
      const [place, quote, fit] = distanceScenes[s.seat];
      if (s.seen && s.feature === s.seat) return ['一個可拿去現場問的假設', `在「${place}」的時刻試用「${fit}」，觀察它是否解決了通勤者剛提到的麻煩。下一次對話就從這裡開始。`];
      return [s.seen ? '再靠近她的那一刻' : '你的提案還需要一個理由', `她在${place}時說：「${quote}」若要投入「${distanceScenes[s.feature][2]}」，先問使用者會在哪個時刻用到它。`];
    }
  };

  const evidence = [
    ['原始影像','終點攝影師的連拍裡，能看見兩位跑者一起跨線。'],
    ['當事人錄音','其中一位跑者同意公開這句話：「她轉身等我的時候，我就敢跑完了。」'],
    ['熱門轉貼','多個帳號都轉貼同張照片，標題寫著「全場都為她們落淚」。'],
    ['賽事名冊','主辦單位的完賽紀錄可核對項目與完賽者，沒有記錄觀眾的反應。']
  ];
  games.witness = {
    initial: () => ({ picks:[], touched:-1 }),
    render(s) {
      return note('編輯台來稿', '社群瘋傳「全場為最後一棒落淚」。你要寫一篇賽後貼文，版面只能附上兩份來源。') +
        multiple('選兩份來源，再點一次可放回', evidence.map(r => r[0]), s.picks, 'doc') +
        note(s.touched < 0 ? '待查來稿' : evidence[s.touched][0], s.touched < 0 ? '每點開一份來源，就會看到它能支持的說法。' : evidence[s.touched][1]) +
        action('送進編輯台', s.picks.length === 2);
    },
    change(s,a) { if (a.startsWith('doc')) { s.touched = +a.slice(3); s.picks = chooseTwo(s.picks,s.touched); } },
    result(s) {
      const [photo,voice,viral,record] = evidence.map((_,i) => s.picks.includes(i));
      const headline = voice ? '「她等我，我就敢跑完」' : photo ? '終點線前，兩位跑者一起跨線' : '主辦單位公布完賽名單';
      return [headline, [
        voice ? '當事人的聲音讓讀者知道這一刻對她的意義。' : '手上的材料能記錄事件，心情仍得向跑者本人求證。',
        photo ? '原始影像能核對兩人同行的動作。' : '',
        record ? '名冊證實完賽紀錄。' : '',
        viral ? '大量轉貼來自同一則貼文；聲量沒有增加獨立佐證。' : '',
        '現有來源都無法支持「全場落淚」。'
      ].join('')];
    }
  };

  games.memory = {
    initial: () => ({ moment:-1, role:-1, returner:-1 }),
    render(s) {
      return note('主場企劃', '一個家庭帶孩子第一次進球場。你希望他們明年回來時，孩子能教新朋友一起參加。') +
        group('在哪個時刻出現？', ['每段廣告都輪播','第七局，全場停下來'], s.moment, 'time') +
        group('觀眾能做什麼？', ['看大螢幕上的隊徽','跟著鼓點拍兩下'], s.role, 'role') +
        group('明年怎麼接續？', ['換上全新的主題','保留鼓點，讓新球迷接最後一拍'], s.returner, 'year') +
        action('讓時間走到明年', [s.moment,s.role,s.returner].every(v => v >= 0));
    },
    change(s,a) { if (a.startsWith('time')) s.moment = +a.slice(4); if (a.startsWith('role')) s.role = +a.slice(4); if (a.startsWith('year')) s.returner = +a.slice(4); },
    result(s) {
      return [s.role && s.returner ? '孩子知道下一拍在哪裡' : '球迷帶走了什麼？', [
        s.moment ? '第七局成了大家可以指認的時刻。' : '輪播增加看見的機會，缺少一個大家同時抬頭的理由。',
        s.role ? '孩子的手記住了節奏。' : '隊徽留下視覺線索，孩子還沒有能教朋友做的動作。',
        s.returner ? '熟悉的聲音再度響起，新球迷也有位置加入。' : '隔年換了新主題，去年累積的線索需要重新學習。'
      ].join('')];
    }
  };

  // Each response is traceable to one of the six fictional survey slips.
  const cards = [
    { name: '阿晴', need: '我在公車上扶著吊環，只剩一隻手能開瓶。', match: [true, false] },
    { name: '小哲', need: '站一天園遊會攤位，我沒空回教室裝水。', match: [false, true] },
    { name: '明芳', need: '送貨時一手拿單，跑完一輪才有地方補水。', match: [true, true] },
    { name: '阿寧', need: '我在操場練球，球場旁的飲水機還在整修。', match: [false, true] },
    { name: '可恩', need: '我抱著小孩時，常常只空得出一隻手。', match: [true, false] },
    { name: '阿立', need: '我桌上就能加水，每次挑瓶子最在意好不好洗。', match: [false, false] },
  ];
  const messages = ['單手開蓋', '能裝一整天的水'];
  const matches = (copy) => cards.filter((card) => card.match[copy]).length;
  const freshBatch = () => ({
    copy: 0,
    report: null,
    opened: [],
    lastPerson: null,
    tested: [],
    exposed: false,
    covered: true,
    asked: false,
    followup: null,
    last: '',
  });
  function peopleFeedback(s) {
    if (s.last.startsWith('person')) {
      const card = cards[s.lastPerson];
      let answer = card.name + '的原問卷寫著「' + card.need + '」';
      if (s.report !== null)
        answer += card.match[s.report]
          ? ' 這正好對上「' + messages[s.report] + '」，所以紙人舉手。'
          : ' 「' + messages[s.report] + '」沒有對上這張卡記錄的需要。';
      return answer;
    }
    switch (s.last) {
      case 'copy0':
      case 'copy1':
        return '手上換成「' + messages[s.copy] + '」。掛起來，看看同一排紙人誰舉手。';
      case 'run':
        return (
          '「' +
          messages[s.report] +
          '」有 ' +
          matches(s.report) +
          ' 張示意卡符合。攤開紙人，看看他為什麼舉手或坐著。'
        );
      case 'reveal':
        return '「晴川」亮相了，六張紙都沾上藍墨。現在這批紙人都看過名字了。';
      case 'cover':
        return '牌名蓋回去了。紙上的藍墨還在，剛看過名字的經驗也還在。';
      case 'scope1':
        return s.exposed
          ? '先亮過名字，再問「以前聽過嗎」，已經給了提示。要查原本的知名度，得找未被提示的真人。'
          : '紙是乾淨的，但六張原問卷都沒有問過「晴川」。這一欄只能留白。';
      case 'fresh':
        return '換了六張同樣需求的乾淨紙卡，墨痕消失。新卡也沒有調查過原先的知名度。';
      case 'field0':
      case 'field1':
        return '把「' + messages[s.copy] + '」寫進試用邀請，下一步是讓真人帶著水壺過一天，看這句話能不能兌現。';
      case 'survey':
        return '另找沒看過名字的人，先請他們自己說出記得哪些水壺品牌，才有一份未受提示的基準。';
      default:
        return '水壺攤還沒開張。點一個紙人，先聽聽他平常怎麼喝水。';
    }
  }
  games.persona = {
    cards,
    messages,
    feedback: peopleFeedback,
    initial: freshBatch,
    source(s) {
      const brand = ['reveal', 'cover', 'fresh', 'scope1', 'survey'].includes(s.last);
      return brand
        ? { article: 12, page: 110, label: '先說出牌名，還問得準嗎？' }
        : { article: 12, page: 112, label: '紙人的回答從哪裡來？' };
    },
    ready: (s) => s.followup !== null,
    render(s) {
      const research = s.tested.length === 2 && s.opened.length > 0;
      const names = cards.map((c, i) => button('person' + i, '攤開' + c.name, s.opened.includes(i))).join('');
      return (
        note('園遊會水壺攤 · 六張示意問卷', peopleFeedback(s)) +
        '<fieldset class="dg-field"><legend>誰平常需要什麼？</legend><div class="dg-options">' +
        names +
        '</div></fieldset>' +
        group('換一張招牌，讓同一排人看', messages, s.copy, 'copy') +
        button('run', '掛上這張招牌') +
        '<div class="dg-options">' +
        button('scope1', '問以前聽過牌名嗎') +
        button(
          s.exposed && !s.covered ? 'cover' : 'reveal',
          s.exposed && !s.covered ? '蓋回牌名' : '揭開新牌名',
        ) +
        (s.exposed ? button('fresh', '換一批乾淨紙人') : '') +
        '</div>' +
        (research
          ? '<div class="dg-options">' +
            messages
              .map((v, i) => button('field' + i, '帶「' + v + '」去找真人試用', s.followup === 'field' + i))
              .join('') +
            '</div>'
          : '') +
        (s.asked ? button('survey', '另找真人做未提示調查', s.followup === 'survey') : '') +
        action('收下這張研究筆記', this.ready(s))
      );
    },
    change(s, a) {
      if (/^person[0-5]$/.test(a)) {
        s.lastPerson = Number(a.slice(6));
        if (!s.opened.includes(s.lastPerson)) s.opened.push(s.lastPerson);
      } else if (a === 'copy0' || a === 'copy1') s.copy = Number(a.slice(4));
      else if (a === 'run') {
        s.report = s.copy;
        if (!s.tested.includes(s.copy)) s.tested.push(s.copy);
      } else if (a === 'reveal') {
        s.exposed = true;
        s.covered = false;
      } else if (a === 'cover' && s.exposed) s.covered = true;
      else if (a === 'fresh' && s.exposed) Object.assign(s, freshBatch());
      else if (a === 'scope1') s.asked = true;
      else if (a === 'survey' && s.asked) s.followup = a;
      else if ((a === 'field0' || a === 'field1') && s.tested.length === 2 && s.opened.length) {
        s.followup = a;
        s.copy = Number(a.slice(5));
      } else return;
      s.last = a;
    },
    result(s) {
      if (s.followup === 'survey')
        return [
          '去問一位還沒看過牌名的人',
          '六張問卷能說明用水習慣，留下的知名度欄位是空白。你決定另外做未提示的真人調查，再談有多少人原本認識「晴川」。',
        ];
      const choice = messages[Number(s.followup?.slice(5))];
      return [
        '帶「' + choice + '」去找真人試用',
        '兩句各有 ' +
          matches(0) +
          ' 張紙卡舉手，舉手的人卻不全相同。你挑了「' +
          choice +
          '」去現場驗證。People Model 能幫人挑出值得測的假設，市場反應還要靠真人研究。',
      ];
    },
  };

  const venues = ['通路可見度', '社群信任', '注意與記憶'];
  const markets = [
    ['下班補貨的洗衣精','顧客已經記得這瓶洗衣精，走進熟悉的店卻只在入口看到競品。',0],
    ['第一次買的登山鞋','價格與尺碼都查到了，群組裡的朋友最常問：「穿它走完一天是什麼感覺？」',1],
    ['夏天的新飲料','便利店已經鋪貨，小聚時卻沒有人想起可以帶這一瓶。',2]
  ];
  games.context = {
    initial: () => ({ market:0, tokens:[0,0,0] }),
    render(s) {
      const left = 3 - s.tokens.reduce((a,b) => a + b, 0);
      return group('選擇觀察的品類', markets.map(r => r[0]), s.market, 'market') +
        note('現場筆記', markets[s.market][1]) +
        `<div class="dg-budget"><b>可用籌碼 ${left} / 3</b>${venues.map((name,i) =>
          `<div class="dg-allocation"><span>${name}</span><div class="dg-coins" aria-label="${s.tokens[i]} 枚">${'●'.repeat(s.tokens[i])}${'○'.repeat(3 - s.tokens[i])}</div><button aria-label="減少${name}預算" type="button" data-act="minus${i}" ${!s.tokens[i] ? 'disabled' : ''}>−</button><button aria-label="增加${name}預算" type="button" data-act="plus${i}" ${!left ? 'disabled' : ''}>＋</button></div>`).join('')}</div>` +
        action('觀察選擇時刻', left === 0);
    },
    change(s,a) {
      if (a.startsWith('market')) s.market = +a.slice(6);
      if (a.startsWith('plus') && s.tokens.reduce((a,b) => a+b, 0) < 3) s.tokens[+a.slice(4)]++;
      if (a.startsWith('minus') && s.tokens[+a.slice(5)] > 0) s.tokens[+a.slice(5)]--;
    },
    result(s) {
      const [product,,target] = markets[s.market];
      const strength = s.tokens[target];
      return [strength >= 2 ? '主力投在決策發生的地方' : strength === 1 ? '有一枚籌碼接到了猶豫' : '還有一個場域需要補上', `「${product}」的現場線索指向${venues[target]}，你投入 ${strength} 枚。${['這次配置能在其他場域發揮，要解決眼前的問題，仍得移動預算。','平均配置能維持多點可見。若資源有限，可以讓主要場域先累積足夠影響。','這個配置呼應了眼前的障礙。換一個品類，分配理由也會隨之改變。'][Math.min(strength,2)]}`];
    }
  };

  const stops = [
    ['商品頁','「這份禮物可以刻字。」她試了幾種稱呼，挑好一款。'],
    ['取貨頁','「搬家聚會就在週六，這家門市來得及嗎？」她在地圖與結帳頁之間切換。'],
    ['客服窗','「我剛才已經選了門市，還要再說一次？」客服看不到她選的地點。']
  ];
  const fixes = [
    ['加一張限時折價券','折扣讓她想下單，能否在週六取貨還得問客服。','客服仍須逐筆查詢門市與交期。'],
    ['顯示該店最早取貨日','她在選好門市後，能直接判斷是否趕得上週六聚會。','交期需與門市庫存同步，才能兌現畫面上的日期。'],
    ['把已選門市交給客服','客服接起時已經知道她選的店，第一句就能說明取貨安排。','門市資料能延續到客服，仍需安排可即時回應的人力。']
  ];
  games.friction = {
    initial: () => ({ stop:-1, seen:[], fix:-1 }),
    render(s) {
      return `<div class="dg-route">${stops.map(([name],i) => button('stop'+i,name,s.stop === i)).join('<span aria-hidden="true">·</span>')}</div>` +
        note('觀察這段旅程',s.stop < 0 ? '點開各個接觸點，聽聽顧客在當下怎麼說。' : stops[s.stop][1]) +
        group('本週只改一處', fixes.map(r => r[0]), s.fix, 'fix') +
        action('走一次新流程', s.seen.length >= 2 && s.fix >= 0) +
        '<small class="dg-help">觀察至少兩處接觸點，再選定改動。</small>';
    },
    change(s,a) {
      if (a.startsWith('stop')) { s.stop = +a.slice(4); if (!s.seen.includes(s.stop)) s.seen.push(s.stop); }
      if (a.startsWith('fix')) s.fix = +a.slice(3);
    },
    result(s) { const [,front,back] = fixes[s.fix]; return ['顧客走到櫃檯時', front + ' ' + back + ' 試行時，追蹤準時取貨與客服詢問量，才能驗證改動。']; }
  };

  const tripStart = 6 * 60 + 45;
  const departure = 7 * 60;
  const clockTime = (minutes) =>
    [Math.floor(minutes / 60), minutes % 60].map((n) => String(n).padStart(2, '0')).join(':');
  function itinerary(s) {
    if (!s.route) return { status: 'idle', text: '早餐在手，06:45 出發。穿過百貨只要五分鐘，試推門看看。' };
    if (s.route === 'gate') {
      return {
        status: 'blocked',
        text: s.noticeVisible
          ? '鐵門紋絲不動。百貨公告寫 07:00 才開門，再走五分鐘是 07:05，車已經走了。'
          : '推過才知道鐵門關著。取走公告後，代理查不到幾點開門，不能把近路排進行程。',
      };
    }
    if (!s.noticeVisible && !s.verified)
      return { status: 'unknown', text: '街口公告被抽走了。代理暫停安排，得先問站務大路今天有沒有開放。' };
    if (s.stroller && !s.accessChecked)
      return {
        status: 'unknown',
        text: '有推車的旅客在階梯前停住。十分鐘是一般入口的走法，還要確認哪個入口可以推車。',
      };
    const minutes = s.stroller ? 12 : 10;
    const arrival = tripStart + minutes;
    return {
      status: 'arrived',
      minutes,
      arrival,
      margin: departure - arrival,
      text: s.stroller
        ? '站務確認東口有斜坡。推車經東口走十二分鐘，' + clockTime(arrival) + ' 進站，離發車還有三分鐘。'
        : '今天大路已開放。走十分鐘，' + clockTime(arrival) + ' 抵達月台，離七點發車還有五分鐘。',
    };
  }
  function tripFeedback(s) {
    switch (s.last) {
      case 'notice':
        if (!s.noticeVisible && s.verified)
          return '公告抽走了。剛才站務對今天路況的確認還在。' + (s.route === 'street' ? itinerary(s).text : '');
        if (s.route === 'street') return itinerary(s).text;
        return s.noticeVisible
          ? '把今天的公告掛回去。百貨七點開，大路從清晨就開放。'
          : '把兩個入口的當日公告收起。下一位旅客出發前，代理少了一個可核對的來源。';
      case 'stroller':
        return s.stroller
          ? '旅客這次推著娃娃車。試走同一路口，看看還要向站務多問哪件事。'
          : '旅客收起推車，恢復一般步行條件。' + (s.route === 'street' ? itinerary(s).text : '');
      case 'ask':
        if (s.route === 'street') return itinerary(s).text;
        return s.stroller
          ? '站務確認大路開放，東口有斜坡，推車要走十二分鐘。現在可以安排這條路。'
          : '站務確認今天大路開放，走到月台十分鐘。';
      case 'memo':
        return s.named
          ? '委託改成「先問上次幫我留早餐的晨禾旅店」。一次趕車經驗，讓旅客出發前就想起它。'
          : '委託換回「幫我找站前旅店」。這次由代理比較符合早餐與車班條件的選項。';
      default:
        return itinerary(s).text;
    }
  }
  games.signal = {
    initial: () => ({
      route: null,
      gateTried: false,
      streetTried: false,
      noticeVisible: true,
      stroller: false,
      verified: false,
      accessChecked: false,
      named: false,
      last: '',
    }),
    itinerary,
    feedback: tripFeedback,
    source(s) {
      if (s.last === 'memo') return { article: 7, page: 51, label: '旅客為什麼點名這家店？' };
      if (s.last === 'stroller' || !s.last)
        return { article: 19, page: 171, label: '同一趟車，為什麼要查不同的事？' };
      return { article: 18, page: 163, label: '代理憑什麼替人安排行程？' };
    },
    ready: (s) =>
      s.route === 'street' && (itinerary(s).status === 'arrived' || itinerary(s).status === 'unknown'),
    render(s) {
      return (
        note('06:45 · 晨禾旅店門口', tripFeedback(s)) +
        '<div class="dg-options">' +
        button('gate', '推百貨鐵門', s.route === 'gate') +
        button('street', '走十分鐘的大路', s.route === 'street') +
        '</div><div class="dg-options">' +
        button('notice', s.noticeVisible ? '抽掉入口公告' : '掛回入口公告') +
        button('stroller', s.stroller ? '收起推車' : '帶一輛推車', s.stroller) +
        button('ask', '問站務今天怎麼走') +
        button('memo', '翻旅客的委託紙', s.named) +
        '</div>' +
        action(itinerary(s).status === 'unknown' ? '記下要向站務確認的事' : '收下這張行程票', this.ready(s))
      );
    },
    change(s, a) {
      switch (a) {
        case 'gate':
          s.route = 'gate';
          s.gateTried = true;
          break;
        case 'street':
          s.route = 'street';
          s.streetTried = true;
          break;
        case 'notice':
          s.noticeVisible = !s.noticeVisible;
          break;
        case 'stroller':
          s.stroller = !s.stroller;
          break;
        case 'ask':
          s.verified = true;
          if (s.stroller) s.accessChecked = true;
          break;
        case 'memo':
          s.named = !s.named;
          break;
        default:
          return;
      }
      s.last = a;
    },
    result(s) {
      const trip = itinerary(s);
      const note = s.named
        ? '旅客記得晨禾曾替自己留早餐，這次主動點名先問這間旅店。'
        : '「趕七點的車」讓代理知道，該查的是早餐能否外帶、入口何時開放、走到月台多久。';
      return [
        trip.status === 'arrived' ? clockTime(trip.arrival) + '，早餐和你都上了月台' : '行程留白，交給站務確認',
        trip.text + ' ' + note,
      ];
    },
  };

  const jobs = ['替書店寫推薦卡','替讀者整理書單','替讀者送出訂單'];
  const authority = ['提出草稿','人工確認後執行','依規則直接執行'];
  games.permission = {
    initial: () => ({ spec:0, job:0, levels:[-1,-1,-1] }),
    render(s) {
      return group('交給代理的品牌規格', ['寫得有趣一點','使用店員試讀筆記，保留引文出處'], s.spec, 'spec') +
        `<div class="dg-policy">${jobs.map((task,i) => button('job'+i,task + (s.levels[i] >= 0 ? '<small>'+authority[s.levels[i]]+'</small>' : '<small>待授權</small>'),s.job === i)).join('')}</div>` +
        group('這項任務可以做到哪裡？',authority,s.levels[s.job],'level') +
        note('櫃檯情境','書店已可查詢庫存與來源資料。讀者授權整理書單，尚未確認金額或付款。') +
        action('試跑書店的一天',s.levels.every(v => v >= 0));
    },
    change(s,a) {
      if (a.startsWith('spec')) s.spec = +a.slice(4);
      if (a.startsWith('job')) s.job = +a.slice(3);
      if (a.startsWith('level')) s.levels[s.job] = +a.slice(5);
    },
    result(s) {
      const [card,book,order] = s.levels;
      const cardFeedback = ['店員可以先核對推薦卡的引文。','推薦卡保留一道人工檢驗。','推薦卡會直接發出，出處需要事前核驗。'][card];
      const bookFeedback = ['書單停在草稿，讀者還要等人交付。','店員會先確認書單，增加一道等待。','已授權的整理任務可以直接交付。'][book];
      const orderFeedback = ['訂單停在草稿，付款仍在讀者手上。','讀者確認金額後才送單。','直接送單超過讀者授權，需要增設確認與撤回機制。'][order];
      return [order === 2 ? '訂單越過了授權線' : '每個決定都有自己的負責人', (s.spec ? '試讀筆記留下品牌自己的語氣與依據。' : '籠統規格讓生成文案容易趨同。') + cardFeedback + bookFeedback + orderFeedback];
    }
  };

  function mount(container, id, callbacks = {}) {
    const item = list.find(game => game.id === id);
    if (!item) throw new Error('找不到互動單元 ' + id);
    const game = games[id];
    let state = game.initial();
    let result = null;
    let completed = false;
    let frame = 0;
    let timer = null;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let playing = !motion.matches;
    function stopStory() {
      clearTimeout(timer);
      timer = null;
      playing = false;
    }
    function showFrame(index) {
      clearTimeout(timer);
      frame = index;
      const plate = container.querySelector('.dg-plate');
      const stage = scenes[id][frame];
      plate.querySelector('.dg-film').innerHTML = picture(id,frame);
      plate.querySelector('.dg-caption').textContent = stage[1];
      plate.querySelectorAll('.dg-story button').forEach((node,i) => node.setAttribute('aria-pressed', String(i === frame)));
      const controls = plate.querySelector('[data-act="play"]');
      controls.textContent = playing ? '暫停' : frame === 2 ? '重播' : '播放';
      controls.setAttribute('aria-label', playing ? '暫停概念動畫' : frame === 2 ? '從頭重播概念動畫' : '播放概念動畫');
      if (playing) {
        timer = setTimeout(() => {
          if (frame === 1) playing = false;
          showFrame(Math.min(2, frame + 1));
        }, 3600);
      }
    }
    const changeMotion = () => { if (motion.matches) {stopStory(); showFrame(frame);} };
    motion.addEventListener('change',changeMotion);
    const cleanup = () => {
      stopStory();
      motion.removeEventListener('change',changeMotion);
      container.removeEventListener('click', click);
    };

    function render(focus = null) {
      const desk = result ? `<div class="dg-result"><small>本次決策手記</small><h2 tabindex="-1">${result[0]}</h2><p>${result[1]}</p>${button('retry','換個做法再試')}</div>` : game.render(state);
      if (!container.querySelector('.dg-game')) {
        const refs = item.articles.map(n => {
          const [title,author,pages] = articles[n];
          return `<button class="dg-source" type="button" data-act="read${n}"><span>${title}</span><small>${author} · p.${pages}</small></button>`;
        }).join('');
        container.innerHTML = `<section class="dg-game dg-${item.region}" aria-label="${item.title}">
          <div class="dg-top">${button('back','返回地圖')}<span>${regions[item.region]} ／ ${item.subtitle}</span></div>
          <div class="dg-layout"><div class="dg-brief"><div class="dg-plate"><div class="dg-film"></div><div class="dg-story" aria-label="選擇概念動畫分鏡">${scenes[id].map(([label],i) => button('frame'+i,label,false)).join('')}</div><p class="dg-caption"></p><button type="button" class="dg-play" data-act="play">播放</button></div><h1>${item.title}</h1><p>${item.question}</p></div>
          <div class="dg-desk"></div></div>
          <div class="dg-reading"><h2>${result ? '回到原文，讀懂這次取捨' : '直接閱讀原文'}</h2><div>${refs}</div></div></section>`;
        showFrame(0);
      }
      container.querySelector('.dg-desk').innerHTML = desk;
      container.querySelector('.dg-reading h2').textContent = result ? '回到原文，讀懂這次取捨' : '直接閱讀原文';
      if (focus === 'result') container.querySelector('.dg-result h2').focus({preventScroll:true});
      else if (focus) {
        const next = container.querySelector('[data-act="' + focus + '"]:not(:disabled)');
        (next || container.querySelector('.dg-commit:not(:disabled)'))?.focus({preventScroll:true});
      }
    }
    function click(e) {
      const node = e.target.closest('button[data-act]');
      if (!node || !container.contains(node) || node.disabled) return;
      const a = node.dataset.act;
      if (a.startsWith('frame')) { stopStory(); showFrame(+a.slice(5)); return; }
      if (a === 'play') {
        if (playing) stopStory();
        else { playing = true; if (frame === 2) frame = 0; }
        showFrame(frame);
        return;
      }
      if (a === 'back') { callbacks.onBack?.(); return; }
      if (a.startsWith('read')) { callbacks.onRead?.(+a.slice(4)); return; }
      if (a === 'retry') { state = game.initial(); result = null; render(); container.querySelector('.dg-desk button')?.focus({preventScroll:true}); return; }
      if (a === 'commit') {
        result = game.result(state);
        render('result');
        if (!completed) { completed = true; callbacks.onComplete?.(id); }
      } else {
        game.change(state,a);
        render(a);
      }
    }
    container.replaceChildren();
    container.addEventListener('click', click);
    render();
    return cleanup;
  }
  window.AtlasSets = window.AtlasSets || {};
  window.DecisionGames = { list, mount, articles, rules: games, preview(id) { return scenes[id].map(([title,caption]) => ({title,caption})); } };
})();
