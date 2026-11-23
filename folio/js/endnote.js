import { sourceTitle, sourceAuthors } from './editorial.js';

const entries = new Map([
  [1, {"title":"讓每一次試喝決定下一杯","event":"茶師端出第一杯，阿梅姨的反應才讓他知道濃淡該往哪裡調。","meaning":"先用小規模試用取得真實回饋，改一點，再試一次。把從嘗試到學會的時間縮短，新品就能更快貼近顧客。"}],
  [2, {"title":"照片留下的是當時的需要","event":"舊照片讓店員送來奶瓶，擦汗的漁夫卻提醒他，日子已經變了。","meaning":"顧客資料會過期。用 AI 協助持續觀察，再到現場核對，才知道今天該提供什麼。"}],
  [3, {"title":"讓大家親眼驗證","event":"海報上多出一根手指，看台開始起疑。標槍真的落地時，在場的人都看到了。","meaning":"生成內容愈容易，品牌愈需要提供可信的證據。一個公開可驗證的行動，能讓消費者自己形成判斷。"}],
  [4, {"title":"膝上的試紙，把品牌留在心裡","event":"小岑記住燕尾長擺，是因為騎完同一段路，膝上的試紙仍然乾爽。","meaning":"把商品放進顧客每天遇到的難題中。親身體會的好處，會影響她日後請 AI 搜尋時，能不能叫出你的名字。"}],
  [5, {"title":"顧客怎麼形容你，會傳到下一個人耳裡","event":"攤主說好吃，熟客卻說得出氣味和入口的感覺。後來的人才知道自己會不會喜歡。","meaning":"AI 整理網路上的討論來回答問題。具體、可核對的使用經驗，讓品牌更有機會在合適的情境被提起。"}],
  [6, {"title":"留下一個親手參與的時刻","event":"畫材舖、拱門和麵包舖掛著同一幅紅風箏。孩子下回經過，卻能在入口的牆上指給家人看：「這個手印是我的！」","meaning":"讓顧客參與一件值得記住的事，品牌就可能成為他們故事裡的一部分。曝光之後留下什麼，會影響記憶。"}],
  [7, {"title":"分身能先篩，產品要讓真人試","event":"黃壺前沒有分身排隊。紅領巾客人推回紅杯、留下綠杯，店主才開鍋煮綠茶。","meaning":"模擬可以快速比較方案，用來決定哪些值得投入試驗。要決定上市，再用真人的選擇驗證。"}],
  [8, {"title":"提出選項和承擔選擇是兩件事","event":"黑熊總舖師攤開四十道菜。水牛主人家圈一道請大家吃，帳單也回到牠手上。","meaning":"交給 AI 擴充選項。人先說清楚取捨的標準，再為最後的決定負責。"}],
  [9, {"title":"把獅布掀開，才看得見錯拍","event":"換了新獅頭還是跳不上凳。掀開獅布，才發現前腳和後腳用力的時間不同。","meaning":"導入 AI 也會遇上類似問題。先讓部門說出各自的做法與顧慮，找出交接卡在哪裡，新工具才幫得上忙。"}],
  [10, {"title":"她反覆敲瓜的時候，在擔心什麼？","event":"掛出半價牌，阿梅姨仍把銅板握在手裡。切開一角讓她確認，錢才過了手。","meaning":"停在結帳前的顧客，往往有一個尚未解開的疑問。看懂遲疑的原因，才能提供她願意往前的證據。"}],
  [11, {"title":"先留下工房認得的那一抹藍","event":"兩家都用同一張花版，印出的十二塊布連山峰的位置都一樣。夾上老師傅的布樣後，樹蛙從不同的花紋裡認出了靛藍白圈。","meaning":"用 AI 大量製作前，先定義品牌必須保留的特徵。創作可以有變化，最後還能用同一套標準辨認。"}],
  [12, {"title":"把放手的時機留給當事人","event":"白面鼯鼠畫了一顆紅心。穿山甲師傅把貼歪的心願扶正，握住兩條燈繩。白面鼯鼠看過、點頭，師傅才鬆爪。","meaning":"依後果與可逆性分配自主權。準備工作可以交給 AI，影響重大、難以收回的行動，要留下清楚的人為確認點。"}],
]);

export function makeEndnote({ panel, tab, article, read }) {
  const find = (name) => panel.querySelector(name);
  let scene = null, available = false;
  const chapter = document.getElementById('chapter');
  function positionOnPhone() {
    if (!panel.hidden && matchMedia('(max-width:600px) and (orientation:portrait)').matches) {
      const desired = chapter.getBoundingClientRect().bottom + 10;
      const top = Math.min(desired, Math.max(64, innerHeight - 330));
      panel.style.setProperty('--endnote-top', Math.ceil(top) + 'px');
    }
  }
  new ResizeObserver(positionOnPhone).observe(chapter);
  window.addEventListener('resize', positionOnPhone);
  function show(focus = false) {
    if (!available) return;
    panel.hidden = false;
    panel.scrollTop = 0;
    tab.hidden = true;
    tab.setAttribute('aria-expanded', 'true');
    positionOnPhone();
    if (focus) find('h2').focus({ preventScroll:true });
  }
  function close(focus = false) {
    panel.hidden = true;
    tab.hidden = !available;
    tab.setAttribute('aria-expanded', 'false');
    if (focus && available) tab.focus({ preventScroll:true });
  }
  function enter(spread, previouslyFinished) {
    scene = spread;
    available = previouslyFinished && entries.has(spread.index);
    close();
    if (available) fill(spread);
  }
  function fill(spread) {
    const entry = entries.get(spread.index), def = spread.def, quote = def.quote;
    panel.scrollTop = 0;
    find('h2').textContent = entry.title;
    find('.endnote-event').textContent = entry.event;
    find('.endnote-meaning').textContent = entry.meaning;
    const cited = quote && article(quote.n);
    const main = cited || (def.sources || []).map(source => article(source.n)).find(Boolean);
    const primary = find('.endnote-read');
    primary.hidden = !main;
    if (main) {
      const page = cited ? quote.page : main.pages[0];
      find('.endnote-authors').textContent = sourceAuthors(main);
      find('.endnote-article').textContent = '〈' + sourceTitle(main) + '〉';
      find('.endnote-page').textContent = '讀原文 p.' + page;
      primary.onclick = () => read(main.n, page, false, primary);
    } else primary.onclick = null;
  }
  function finish(spread, focus = false) {
    if (spread !== scene || !entries.has(spread.index)) return;
    if (!available) fill(spread);
    available = true;
    show(focus);
  }
  tab.onclick = () => show(true);
  find('.endnote-close').onclick = () => close(true);
  panel.onkeydown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    }
  };
  return { enter, finish, close };
}

