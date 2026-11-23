import { LANDS, ORDER } from './data.js';
import { streetStops } from './street-stops.js';
import { drawProp } from './study-objects.js';
import { worldStudy } from './world-studies.js';

const directions = {
  fold: {
    code:'A', name:'巷口摺紙偶', tagline:'手裡的工具先說話',
    idea:'每位街坊有一件拿手的工具。石虎端杯時先探出一隻短爪，小客人喝一口後，牠的耳朵才跟著抬起來。讀者從姿勢讀出彼此的反應。',
    face:'頭約佔身高一半，外沿留奶油色紙邊。石虎留額紋與圓耳，水獺用寬嘴與扁尾。臉上的大色塊縮小後仍清楚。',
    motion:'獅頭起跳，折成手風琴的獅布先被拉長，後面的腳才離地。凳前空出一塊紙面，讀者看得清落點。',
    colors:[['紙邊','#f4e3bf'],['屋瓦','#b76849'],['圍裙','#56877e'],['墨線','#473e3a']],
    places:['晨光照過茶攤的摺棚，杯口有一線熱氣。','攤子面向同一條走道，街坊的手勢互相呼應。','工坊的翻板和對照樣台可以掀開，假設擺在桌上。','從瓜攤到燈舖，每件工具都有一個交到人手裡的動作。'],
    props:['杯耳向外翻，斟茶時杯內茶色才看得見。','掀起相角，舊照片下露出漁夫現在的臉。','紙標旗在標槍落地的地方立起。','展開雨衣後襬，折線順著膝蓋垂下。','掀起紙花，露出後面捏鼻又比讚的兩隻爪。','紙掌向牆一按，打開時牆上多出一個手印。','兩隻杯耳一左一右，最後一杯送到長輩的爪邊。','可轉的紙菜單停在負責付帳的座位。','兩位舞者之間留一段可拉開的手風琴摺。','西瓜的小紙角能翻起，紅色瓜肉藏在裡面。','展開試色布，四道折都留有同一抹靛藍。','拉緊的紙繩橫過手掌，點頭後才鬆開。'],
  },
  ink: {
    code:'B', name:'街坊印舖', tagline:'每個決定都留下印子',
    idea:'把每一幕畫成一張手印海報。喝過的杯底、走過的爪印、染過的布樣會留在紙上。讀者從這些痕跡推回剛才發生的事。',
    face:'身體像一枚圓印章，眼睛和鼻子留白。石虎的斑、松鼠的大尾巴、黑熊胸前的月牙，各自用一種能重複印出的圖紋辨認。',
    motion:'獅頭的朱紅腳印先印在地上，獅尾的靛青腳印晚一拍。即使動作停了，兩排錯開的腳印仍留著線索。',
    colors:[['紙底','#efddb2'],['朱紅','#d36b53'],['靛墨','#374962'],['芥黃','#dfb558']],
    places:['攤布像剛攤開的試印紙，三杯茶留下三種杯底印。','顧客在攤前留下真實手印，街面逐漸熱鬧起來。','樣張並排曬著，兩次試驗的差異能直接比對。','靛墨鋪出夜街，用一枚朱紅記號留下最後一次人為確認。'],
    props:['濃淡不同的三杯茶，會留下深淺不同的杯印。','舊照與新印的側影並排，外形的差異一眼可見。','落點的印記壓在生成海報上，真實距離可被查驗。','雨刷過布面留下點狀水痕，膝蓋部分仍然留白。','花紋移開後，露出常客實際比出的拇指印。','每一種爪印保留不同大小，能辨認誰參與過。','杯底疊上試飲記號，最後一枚印來自真人。','四十道菜排成墨欄，點菜的人親手圈出一道。','前後兩組腳印使用兩種油墨，錯拍會看得見。','切開的瓜面像一枚版印，種子清楚落在切面上。','同一枚品牌紋樣試印在一排靛藍色布上。','同意記號落印，原先緊握的天燈繩才放開。'],
  },
  light: {
    code:'C', name:'窗燈小戲班', tagline:'跟著光看見誰在做決定',
    idea:'把店面折成窗框，讓街坊成為透光的紙戲偶。讀者先看見爪子的影子，再看見牠握著哪件工具。輪到誰做決定，亮處就移到誰身上。',
    face:'用側臉的鼻尖、長耳或鳥喙區別角色。眉毛和眼睛在透光窗紙上留出明亮小孔，關節的銅釘呼應手裡的工具。',
    motion:'前後兩支操偶桿分別提起獅頭和獅尾。兩個影子先後越過窗格，光把不合拍的地方放大。',
    colors:[['燈紙','#efd194'],['燭橙','#d88d58'],['孔雀綠','#49958e'],['幕布','#4d384d']],
    places:['用晨光做第一盞燈，杯裡茶湯在窗台上透出濃淡。','店面留出明亮窄窗，觀眾先看清顧客的表情。','兩層透紙分出預測和現場，疊起來才能看見差異。','夜色留在窗外，燈沿著工序亮起，照到該接手的那隻爪。'],
    props:['晨光穿過薄薄的杯身，杯中濃淡投在桌面。','相紙對著光，舊影和眼前的身形漸漸分開。','影子落地後，才亮起量測距離的那格窗。','水珠的影子從雨衣滑落，膝蓋處仍透出暖光。','花束遮住了一截光，移開後映出常客的拇指。','手掌貼上紙窗，街上的光把參與者的輪廓連起來。','模型試杯和真人試杯各有一盞燈，最後照向真人。','桌面亮處跟著菜單轉，停在點菜者的爪尖。','頭尾用兩個透紙影子，從先後起跳看見落差。','切面透出紅光，阿嬤終於看清瓜肉。','燈光穿過色布，工房的靛藍在每一幅都能認出。','繫繩的影子先繃緊，點頭的剪影出現才讓天燈升起。'],
  },
};
const animals=[
  ['cat','石虎','茶師','雙爪捧杯'],['otter','水獺','畫師','挽袖握刷'],['owl','角鴞','觀察員','抱著記事板'],
  ['badger','鼬獾','買菜的阿嬤','提著菜籃'],['hare','野兔','小客人','舉起手印紙'],
  ['squirrel','松鼠','染坊學徒','攬著布卷'],['bear','黑熊','試茶師','掀杯蓋聞香'],
];
const lands=['prologue','people','model','ai'];
const find=id=>document.getElementById(id);
const el=(tag,cls,txt)=>{
  const node=document.createElement(tag);
  if(cls) node.className=cls;
  if(txt) node.textContent=txt;
  return node;
};
function animal(medium, species) {
  return '<svg viewBox="0 0 160 180" aria-hidden="true" focusable="false"><use href="art/animal-studies.svg#'+medium+'-'+species+'" width="160" height="180"/></svg>';
}
let medium='', currentProp=8, stageRequest=0, finishJump=0;
const stageFiles=new Map(), choices=new Map(), reduced=matchMedia('(prefers-reduced-motion: reduce)');
const stageMeaning='共披一塊獅布，兩雙腳卻各踩各的拍子。部門用上同一套 AI，也得先看見彼此的工作習慣，才配合得起來。';
function stageFile(key) {
  if(!stageFiles.has(key)) {
    stageFiles.set(key,fetch('art/study-'+key+'.svg').then(async response=>{
      if(!response.ok) throw Error('stage');
      const svg=new DOMParser().parseFromString(await response.text(),'image/svg+xml').documentElement;
      if(svg.localName!=='svg') throw Error('stage');
      return svg;
    }).catch(err=>{ stageFiles.delete(key); throw err; }));
  }
  return stageFiles.get(key);
}
async function setStage(key) {
  const token=++stageRequest, host=find('preview-stage'), button=find('try-jump');
  clearTimeout(finishJump); button.disabled=true; button.textContent=reduced.matches?'▷ 看試跳定格':'▷ 試跳一次';
  find('stage-meaning').textContent='';
  host.replaceChildren();host.setAttribute('aria-busy','true');
  try {
    const source=await stageFile(key);
    if(token!==stageRequest) return;
    const svg=document.importNode(source,true);
    svg.setAttribute('role','img');
    svg.setAttribute('aria-label',directions[key].name+'的舞獅廟埕。'+directions[key].motion);
    host.replaceChildren(svg); button.disabled=false;
  } catch {
    if(token!==stageRequest) return;
    const retry=el('button','','重新載入試演');retry.type='button';retry.onclick=()=>setStage(key);host.replaceChildren(retry);
  } finally { if(token===stageRequest) host.setAttribute('aria-busy','false'); }
}
find('try-jump').onclick=()=>{
  const scene=find('preview-stage').querySelector('svg'), button=find('try-jump');
  if(!scene) return;
  if(reduced.matches) {
    const paused=scene.classList.toggle('still-moment');
    button.textContent=paused?'回到起跳前':'▷ 看試跳定格';
    find('stage-meaning').textContent=paused?stageMeaning:'';
    return;
  }
  scene.classList.remove('playing'); scene.getBoundingClientRect(); scene.classList.add('playing');
  find('stage-meaning').textContent='';button.disabled=true;button.textContent='試跳中…';
  finishJump=setTimeout(()=>{
    scene.classList.remove('playing');button.disabled=false;button.textContent='▷ 再試一次';
    find('stage-meaning').textContent=stageMeaning;
  }, {fold:2900,ink:3000,light:3200}[medium]);
};
reduced.addEventListener('change',()=>{
  const scene=find('preview-stage').querySelector('svg');
  if(!scene) return;
  clearTimeout(finishJump);
  scene.classList.remove('playing','still-moment');
  find('stage-meaning').textContent='';
  const button=find('try-jump');button.disabled=false;button.textContent=reduced.matches?'▷ 看試跳定格':'▷ 試跳一次';
});
function selectProp(index) {
  currentProp=index;
  const data=streetStops[index], treatment=directions[medium], land=LANDS[ORDER[index+1].land];
  const sample=find('prop-sample');
  sample.querySelector('.enlarged-prop').innerHTML=drawProp(data.icon,medium,'large');
  find('prop-level').textContent='第 '+String(index+1).padStart(2,'0')+' 幕 · '+land.en+' · '+data.place;
  find('prop-title').textContent=data.prop;
  find('prop-action').textContent=data.action;
  find('prop-treatment').textContent=treatment.props[index];
  for(const button of find('worlds').querySelectorAll('button')) button.setAttribute('aria-pressed',String(Number(button.dataset.prop)===index));
}
function renderCast(key) {
  const host=find('cast-row');
  host.replaceChildren(...animals.map(([species,name,job,gesture])=>{
    const figure=el('figure'),pose=el('div','portrait'),caption=el('figcaption');
    pose.innerHTML=animal(key,species);
    caption.append(el('strong','',name+' · '+job),el('span','',gesture));
    figure.append(pose,caption); return figure;
  }));
}
function renderWorlds(key) {
  const d=directions[key], host=find('worlds'); host.replaceChildren();
  lands.forEach((land,k)=>{
    const data=LANDS[land],section=el('section','district-study'),head=el('h3');
    section.style.setProperty('--zone-color',data.color);
    head.append(el('small','',data.en),document.createTextNode(data.name));
    const shelf=el('div','prop-shelf');
    streetStops.forEach((stop,i)=>{
      if(ORDER[i+1].land!==land) return;
      const button=el('button');button.type='button';button.dataset.prop=i;
      button.setAttribute('aria-label','第'+(i+1)+'幕，'+stop.prop);
      button.innerHTML=drawProp(stop.icon,key,String(i));button.append(el('span','',stop.prop));
      button.onclick=()=>selectProp(i); shelf.append(button);
    });
    const view=el('div','set-frame');view.innerHTML=worldStudy(key,land);
    section.append(head,view,el('p','',d.places[k]),shelf);host.append(section);
  });
  selectProp(currentProp);
}
function selectDirection(key) {
  if(!Object.hasOwn(directions,key)) key='fold';
  if(key===medium) return;
  medium=key; const d=directions[key]; document.body.dataset.medium=key;
  for(const [id,link] of choices) {
    if(id===key) link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');
  }
  find('direction-code').textContent='提案 '+d.code;
  find('direction-title').textContent=d.name;find('direction-idea').textContent=d.idea;
  find('direction-character').textContent=d.face;find('direction-motion').textContent=d.motion;
  find('cast-family').textContent=d.name+' · 七種輪廓';
  find('swatches').replaceChildren(...d.colors.map(([name,hex])=>{
    const swatch=el('span','swatch',name);swatch.style.setProperty('--swatch',hex);return swatch;
  }));
  renderCast(key);renderWorlds(key);setStage(key);
}
const moments={
  fold:'獅頭先跳，獅尾還蹲著。當中的紅紙獅身被拉成手風琴，兩人的距離一眼可見。',
  ink:'水獺先落下朱紅爪印，兔子晚一步才留下靛藍印。地上兩行足跡把錯開的節奏留了下來。',
  light:'兩人各握一支桿。亮窗上，獅頭的影子已經騰空，獅尾的影子還貼著地面。',
};
async function renderComparison() {
  for(const node of document.querySelectorAll('.studio-heading,#directions,.compare-tools,.worktable,.cast-section,.world-section')) node.hidden=true;
  document.title='三款紙偶並排看｜街角的決策智慧';
  const sheet=el('section');sheet.id='comparison-print';sheet.setAttribute('aria-labelledby','comparison-title');
  const header=el('div','compare-header'),titles=el('div'),title=el('h1','','街坊紙偶，三種演法');
  title.id='comparison-title';
  titles.append(el('p','overline','決策智慧 2026 · 街角的決策智慧'),title);
  header.append(titles,el('p','','第九幕問，公司導入 AI 之後，為什麼各部門還是各做各的？水獺和野兔共披一塊獅布，卻各踩各的拍子。三案演的是同一次試跳。'));
  const grid=el('div','compare-grid');sheet.append(header,grid);
  const links=el('div','compare-links'),all=el('a','','看七位街坊與十二件道具 →');
  const castFile=el('a','','下載可編輯角色 SVG ↓'),download=el('a','','下載三案對照圖 ↓');
  all.href='art-directions.html#fold';
  castFile.href='art/animal-studies.svg';castFile.download='街角的決策智慧_街坊紙偶.svg';
  download.href='art/three-directions.png';download.download='街角的決策智慧_紙偶三案.png';links.append(all,castFile,download);
  document.querySelector('.studio').prepend(sheet);sheet.after(links);
  await Promise.all(Object.entries(directions).map(async ([key,d])=>{
    const card=el('article','compare-card');card.dataset.family=key;grid.append(card);
    const cast=el('div','compare-people');
    for(const i of [0,1,4]){
      const [id,name]=animals[i],figure=el('figure');figure.innerHTML=animal(key,id);
      figure.append(el('figcaption','',name));cast.append(figure);
    }
    const scene=el('div','compare-scene'),detail=el('a','','進入提案，讓牠們試跳 →');detail.href='art-directions.html#'+key;
    card.append(el('p','compare-code','提案 '+d.code),el('h2','',d.name),el('p','compare-tag',d.tagline),cast,scene,el('p','',moments[key]),detail);
    try{
      const svg=document.importNode(await stageFile(key),true);
      svg.classList.add('still-moment');svg.setAttribute('role','img');svg.setAttribute('aria-label',moments[key]);scene.replaceChildren(svg);
    }catch{scene.textContent='舞獅試演可從下方連結開啟。'}
  }));
}
if(new URLSearchParams(location.search).get('view')==='compare') {
  renderComparison();
}else{
  for(const [key,d] of Object.entries(directions)) {
    const a=el('a','design-choice');a.href='#'+key;a.dataset.family=key;
    const face=el('span','choice-animal');face.innerHTML=animal(key,'cat');
    const words=el('span','choice-type');words.append(el('small','','提案 '+d.code),el('strong','',d.name),el('span','',d.tagline));
    a.append(face,words);find('directions').append(a);choices.set(key,a);
  }
  window.addEventListener('hashchange',()=>selectDirection(location.hash.slice(1)));
  selectDirection(location.hash.slice(1));
}
