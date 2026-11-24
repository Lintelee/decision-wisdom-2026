(() => {
  // Printed standfirsts from the supplied issue's article records, indexed by opener.
  const standfirsts = {
    6: "AI 改變的是技術和做法，不變的是經營的本質——為客戶創造價值、靠人才驅動成長、用信任贏得品牌。",
    12: "品牌離 AI 越近，會不會反而離人越遠？答案或許是：只要 AI 做的是幫品牌更懂人，品牌與人之間的距離，才會是真實的靠近。",
    20: "在 AI 真假難辨的時代，品牌需以真實感、人性與情感認同，重建不可複製的信任價值。",
    28: "AI 代理改寫消費旅程，電通以端到端創意、策略與科技整合，驅動品牌實質成長。",
    36: "策略人在 AI 時代進化為增長架構師，串聯數據、人性洞察與未來商機，推動品牌成長。",
    44: "生成式 AI 正在模糊真實與虛構的界線。當內容愈來愈容易被生成，真實將成為稀缺資產，而建立在真實之上的信任，也將成為品牌最難複製的競爭力。",
    50: "當購物決策逐漸被 Agent 攔截，品牌經營多年的接觸點將被壓縮。社群商務要在 AI 介入前，先一步喚醒消費者的真實渴望：Agent 攔截的是交易流程，品牌要創造的是購買動機，靠的是來自品牌洞察的「情緒價值」。",
    58: "品牌可以購買曝光，卻無法購買記憶。娛樂與運動透過真實情緒與體驗創造共同記憶，是累積品牌心智資產的關鍵。",
    66: "AI 正替消費者篩選品牌，它讀的不是你怎麼說自己，而是別人怎麼說你。讓真實的人自發、具體地談論你，成了內容量產時代品牌最貴的護城河。",
    72: "曝光不再稀缺，品牌應從買聲量轉向經營注意力，在 AI 決策時代創造能被看見、參與及記住的時刻。",
    80: "在分眾與 AI 時代，品牌需要打造 Common Ground，讓品牌與消費者相會相聚，創造共同記憶，延續長期關係。",
    96: "電通台灣以獨家 CCS 調查為基礎打造 People Model，用 AI 數位分身模擬真實消費者，讓你隨時與消費者對話，不用靠猜的。",
    116: "AI 投放與演算法讓廣告更精準，卻也讓品牌的選擇被稀釋。Share of Voice 應該要升級為 Share of Choice Context，透過系統可見度、社群信任與注意力記憶三個層次，重新建立品牌在關鍵選擇場域的占位，守住被選擇的理由。",
    128: "當生成式 AI 讓內容生成、數據分析與媒體優化的門檻快速降低，企業的競爭優勢回到人的判斷「Judgment 衡斷力」。凱絡拆解 People Intelligence 的三大核心能力與衡斷力累積的五個面向。",
    136: "AI 時代企業如何從旅程地圖轉向決策地圖，透過生成式體驗，引導猶豫的顧客邁出明確的下一步？",
    144: "別讓 19% 的認知落差，吃掉企業 AI 投資與未來競爭力。AI 轉型並非純粹的技術軍備競賽，而是組織文化的重塑戰役。電通商業顧問提出「AI 轉型暗流診斷」，協助企業破除認知落差，從文化底層精準移除阻力，釋放真實的轉型動能。",
    152: "數位體驗優化的核心，是看懂顧客為何猶豫，並以持續驗證縮短品牌與人的心理距離。",
    160: "AI Agent 正壓縮顧客旅程、改寫品牌被選擇的方式。從 UX 到 AX，能讓人與 AI 都信任的品牌才會勝出。",
    168: "如果所有品牌都成功被 AI 引用了，那接下來呢？當消費者看著 AI 整理出來的答案，你的品牌真的被記住了嗎？",
    176: "面對 AI Slop 的平庸化挑戰，電通 SLIP 方法論以規格、產線、檢驗與模式化，將生成力轉化為可持續的品牌護城河。",
    182: "AI 不只提升內容產製效率，更能串聯人才、創意與技術，協助台灣品牌創造符合在地文化與多元通路需求的內容，兼顧規模化、創意品質與行銷成效。",
    188: "多數品牌都在問「要不要導入 AI Agent 來服務顧客」，但保健品、美妝與零售的實際案例顯示，該問的是「哪些任務可以交、能交到哪一層」。本文拆解四個案例、四個共同變化，以及一套決定自主程度的權限框架。",
  };

  // Reserve the original crop before its image downloads, so the visible paragraph stays put.
  const figureSizes = {
    '03_00': [1600, 764], '03_01': [1471, 648], '03_02': [966, 699], '03_03': [1471, 803],
    '03_04': [1600, 568], '03_05': [1278, 615], '03_06': [1600, 481], '04_00': [1600, 952],
    '04_01': [1600, 882], '05_00': [689, 415], '07_00': [1237, 705], '07_01': [824, 822],
    '08_00': [1468, 359], '08_01': [693, 602], '08_02': [1476, 678], '08_03': [594, 1600],
    '08_04': [1464, 257], '08_05': [1464, 985], '10_00': [1563, 886], '10_01': [1600, 706],
    '10_02': [1476, 1221], '10_03': [514, 591], '10_04': [420, 571], '11_00': [1565, 764],
    '11_01': [699, 1176], '11_02': [408, 863], '11_03': [689, 852], '11_04': [1464, 833],
    '11_06': [816, 381], '11_07': [686, 362], '11_08': [628, 853], '12_00': [1476, 801],
    '12_01': [1464, 527], '12_02': [1464, 881], '12_03': [1482, 651], '12_04': [1464, 840],
    '14_00': [1464, 566], '14_01': [1600, 741], '14_02': [1600, 1075], '14_03': [1600, 958],
    '15_00': [699, 1014], '15_01': [1476, 948], '15_02': [1465, 1077], '15_03': [1600, 718],
    '16_00': [1476, 735], '17_00': [1600, 1080], '17_01': [1600, 1077], '19_00': [1476, 1284],
    '21_00': [1462, 690], '21_01': [686, 971], '22_00': [1464, 440], '22_01': [695, 607],
    '22_02': [1465, 765],
  };

  const element = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  class TextViewport extends HTMLElement {
    connectedCallback() {
      if (this.observer) return;
      const content = this.querySelector('article');
      if (!content) return;
      this.observer = new ResizeObserver(() => this.updateProgress());
      this.observer.observe(this);
      this.observer.observe(content);
      this.addEventListener('scroll', this.updateProgress, { passive: true });
      this.updateProgress();
    }
    disconnectedCallback() {
      this.observer?.disconnect();
      this.observer = null;
      this.removeEventListener('scroll', this.updateProgress);
    }
    updateProgress() {
      const meter = this.parentElement?.querySelector('.dr-text-progress');
      if (!meter) return;
      const remaining = this.scrollHeight - this.clientHeight;
      const overflow = remaining > 2;
      meter.hidden = !overflow;
      this.tabIndex = overflow ? 0 : -1;
      if (overflow) {
        const fraction = Math.min(1, (this.scrollTop + this.clientHeight) / this.scrollHeight);
        meter.value = fraction;
        meter.setAttribute('aria-valuetext', Math.round(fraction * 100) + '%');
      }
    }
  }
  if (!customElements.get('dw-text-viewport')) customElements.define('dw-text-viewport', TextViewport);

  function section(page) {
    if (page < 18) return 'Intro';
    if (page < 94) return 'People';
    if (page < 150) return 'Model';
    return 'AI';
  }

  function pageMark(page, land) {
    const mark = element('header', 'dr-text-folio');
    mark.setAttribute('aria-hidden', 'true');
    mark.append(element('b', '', page), element('span', '', land));
    return mark;
  }

  function opener(paper, article, page) {
    // Keep the original reading order when the author and standfirst wrap on a small leaf.
    paper.classList.add('dr-text-opener');
    const heading = element('header', 'dr-text-title');
    const printedTitle = paper.querySelector('h2');
    const sub = paper.querySelector('.sub');
    const printedKicker = article?.kicker;
    if (printedKicker) heading.append(element('p', 'dr-text-kicker', printedKicker));
    heading.append(printedTitle);
    if (sub) heading.append(sub);
    paper.prepend(heading);
    const numbered = paper.querySelector('.no');
    if (numbered) numbered.classList.add('dr-sr');
    const by = paper.querySelector('.by');
    if (by && article?.authors.length) {
      by.replaceChildren(...article.authors.map(a => {
        const person = element('span', 'dr-text-person');
        if (a.role) person.append(element('small', '', a.role));
        person.append(element('b', '', [a.zh, a.en].filter(Boolean).join(' ｜ ')));
        return person;
      }));
      // The source occasionally repeats the same names and roles as an extraction tag.
      for (const tag of paper.querySelectorAll('.tag')) {
        if (article.authors.every(a => tag.textContent.includes(a.zh || a.en))) tag.classList.add('dr-sr');
      }
    }
    paper.append(element('blockquote', 'dr-text-standfirst', standfirsts[page]));
  }

  function arrangeFigures(paper) {
    for (const figure of paper.querySelectorAll('figure')) {
      const image = figure.querySelector('img');
      if (!image) continue;
      const file = (image.getAttribute('src') || '').split('/').pop().replace(/\.jpg$/, '');
      const size = figureSizes[file];
      const measure = (w, h) => {
        image.width = w; image.height = h;
        figure.classList.toggle('dr-text-wide', w >= h * 2.2);
      };
      if (size) measure(...size);
      else if (image.complete && image.naturalWidth) measure(image.naturalWidth, image.naturalHeight);
      else image.addEventListener('load', () => measure(image.naturalWidth, image.naturalHeight), { once: true });
      image.draggable = false;
    }
  }

  function groupHeadings(paper) {
    for (const heading of paper.querySelectorAll('h3,h4')) {
      if (heading.children.length) continue;
      const lines = heading.textContent.replace(/([\u3400-\u9fff」』？])\s+(?=[\u3400-\u9fff「『])/gu, '$1\n').split('\n');
      if (lines.length < 2) continue;
      heading.replaceChildren(...lines.map((line, index) => {
        const phrase = element('span', 'dr-text-phrase', line);
        if (index) phrase.prepend(' ');
        return phrase;
      }));
    }
  }

  function tableOfContents(paper, entries, page) {
    paper.classList.add('dr-text-contents');
    paper.append(element('h2', '', '目錄'));
    const nav = element('nav');
    nav.setAttribute('aria-label', '原刊第 ' + page + ' 頁目錄');
    if (entries instanceof Node) nav.append(entries);
    else nav.append(...entries);
    paper.append(nav);
  }

  // The scene's cited sentence is found through punctuation, spacing and inline tags,
  // then wrapped one stretch of text at a time so a mark never crosses a tag.
  const letters = text => text.normalize('NFKC').replace(/[^\p{L}\p{N}]/gu, '');
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  const decoded = entity => {
    const code = entity.slice(1, -1);
    if (code[0] !== '#') return named[code.toLowerCase()] ?? '';
    const point = /^#x/i.test(code) ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : '';
  };
  function markQuote(html, quote) {
    const wanted = letters(quote || '');
    if (!html || !wanted) return html;
    const places = [];
    let printed = '';
    for (const run of html.matchAll(/<[^>]*>|[^<]+/g)) {
      if (run[0][0] === '<') continue;
      for (const piece of run[0].matchAll(/&(?:[a-z]+|#\d+|#x[0-9a-f]+);|[\s\S]/giu)) {
        const from = run.index + piece.index, to = from + piece[0].length;
        const plain = letters(piece[0].length > 1 && piece[0][0] === '&' ? decoded(piece[0]) : piece[0]);
        for (let i = 0; i < plain.length; i++) places.push({ from, to });
        printed += plain;
      }
    }
    const first = printed.indexOf(wanted);
    if (first < 0) return html;
    let from = places[first].from, to = places[first + wanted.length - 1].to;
    if (/[「『“‘]/.test(html[from - 1] || '')) from--;
    for (let i = 0; i < 3 && /[。！？!?」』”’]/.test(html[to] || ''); i++) to++;
    let marked = '', at = 0;
    for (const run of html.matchAll(/<[^>]*>|[^<]+/g)) {
      const start = run.index, end = start + run[0].length;
      if (run[0][0] === '<' || end <= from || start >= to) continue;
      const a = Math.max(start, from), b = Math.min(end, to);
      marked += html.slice(at, a) + '<mark class="dr-text-key">' + html.slice(a, b) + '</mark>';
      at = b;
    }
    return marked + html.slice(at);
  }

  function compose(leaf, html, { page, title, label, imagePath, contents, keyQuote } = {}) {
    const land = section(page);
    const article = window.DecisionArticles?.find(a => a.pages[0] === page);
    leaf.classList.add('dr-text-leaf');
    leaf.dataset.printPage = page;
    leaf.dataset.ink = land.toLowerCase();
    leaf.classList.toggle('dr-text-verso', page % 2 === 0);

    const viewport = element('dw-text-viewport', 'dr-text-viewport');
    const fullLabel = label || (page > 0 ? '原刊第 ' + page + ' 頁' : '原刊封面');
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', fullLabel + (title ? '　' + title : ''));
    const paper = element('article', 'dr-prose dr-text-copy');

    if (html?.trim()) {
      paper.innerHTML = keyQuote ? markQuote(html, keyQuote) : html;
      if (standfirsts[page] && paper.querySelector('h2')) opener(paper, article, page);
      else { viewport.append(pageMark(page, land)); arrangeFigures(paper); groupHeadings(paper); }
    } else if (contents instanceof Node || contents?.length) {
      tableOfContents(paper, contents, page);
    } else if (imagePath) {
      paper.classList.add('dr-text-plate');
      const image = element('img');
      image.src = imagePath;
      image.alt = title || fullLabel;
      image.draggable = false;
      paper.append(image);
    } else {
      paper.append(element('h2', '', title || fullLabel));
    }
    viewport.append(paper);
    const meter = element('progress', 'dr-text-progress');
    meter.setAttribute('aria-label', '本頁已讀進度');
    meter.max = 1;
    meter.hidden = true;
    leaf.replaceChildren(viewport, meter);
    // Cover detached staging and composition directly into an already-mounted leaf.
    viewport.updateProgress?.();
    return leaf;
  }

  window.DecisionTextLeaf = { compose, markQuote };
})();
