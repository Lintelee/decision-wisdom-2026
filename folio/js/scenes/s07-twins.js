// 第 7 頁｜街坊試茶所｜陳介立、孫郁喬、高靖萍〈People Model：讓消費者研究變成一場隨時能開口的對話〉p.96–115
// 涼亭裡一座大沙盤，是茶街的迷你模型。阿滿姨有三款新口味拿不定：沙盤上冒出街坊的迷你分身，各喝一滴、排到喜歡的壺前，
// 分身排好後先看票數。紅、綠各七票，再請板凳上同一位客人分別試喝，等她選定才開煮。
import { pulse } from './reading-beats.js';
import { teaBench, dressTeaCup, makeTaste } from './model-tea-service.js';
import { C, keep, group, box, cyl, cone, ball, disc, ring, beam, poly, tri, quad, card, words, tab, house, cratePlank } from '../paper.js';
import { foldTravel, paperStream, paperMechanism, steamCurl } from './market-craft.js';
import { fieldCloud, fieldSun, fieldPress, issuePrint, pressPlate } from './market-atlas.js';

import { teaWorkshopStreet } from './market-streetscape.js';

const DIARY = '分身先刷掉一款，最後一口問真人。';
const WHITE = '#fbf6ea';
const TBL = { x: 2.47, z: -.76 };                          // the sand table under the pavilion
// the market model has three stepped tasting lanes, each with a teapot at its left end and room for a line to its right
const ROW = [{ y: .7, z: .55 }, { y: .95, z: -.04 }, { y: 1.2, z: -.62 }];
const POTS = [{ col: '#c5604d', tea: '#e89b78' }, { col: C.gold, tea: '#e6c25c' }, { col: '#4b805d', tea: '#8db785' }];
const PX = -1.2, LX = -.93, STEP = .17;                    // pot x, first place in line, spacing (table-local)
const KINDS = ['adult', 'kid', 'adult', 'elder', 'adult', 'kid', 'adult'];
const COATS = [C.blue, C.gold, C.leaf, C.slate, C.coral, C.aqua, C.wood, C.navy, C.pink, C.teal, C.honey, C.plum, C.mint, C.red];
// fourteen twins: where each pops up on a lane of the model, and the line it joins (row 0 or row 2; nobody joins row 1)
const MINIS = Array.from({ length: 14 }, (_, i) => {
  let s = 17 + i * 31; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const row = i < 7 ? 0 : 2, k = i % 7, r0 = [1, 2, 0, 1, 2, 1, 0, 1, 0, 2, 1, 0, 1, 2][i], R = ROW[r0];
  return { choice: row, from: [-.85 + r() * 1.55, R.y, R.z + (r() - .5) * .16], to: [LX + k * STEP, ROW[row].y, ROW[row].z], kind: KINDS[(i * 3) % 7], coat: COATS[i] };
});
const GRAN = 7;                                            // the mini grandmother: front of the teal line

/** a paper teapot (in its own keep, origin on the ground) */
function teapot(g, col) {
  g.name = '模擬市場的試味茶壺';
  const b = ball(g, 0, .1, 0, .1, col, 1); b.scale.set(1.15, .85, 1);
  cyl(g, 0, .18, 0, .05, .07, .03, col, 10); ball(g, 0, .21, 0, .025, C.gold, 0);
  beam(g, [.1, .1, 0], [.18, .17, 0], .018, col, 5);
  const h = ring(g, -.12, .11, 0, .05, .012, col, 12); h.scale.y = 1.1;
}

// The spout and the tasting cup belong to the same terrace, but the teapot can
// later leave for the shop shelf. Only a pot at its own counter can pour there.
function tastingStation(S,table,row,index) {
  const recipe=POTS[index], pot=keep(table,PX,row.y,row.z), body=keep(pot);
  teapot(body,recipe.col);
  const cup=keep(table,PX+.23,row.y,row.z+.16);
  cyl(cup,0,.044,0,.10,.074,.088,'#f0dec1',12);
  cyl(cup,0,.091,0,.082,.082,.005,'#6b5445',12);
  const tea=keep(cup,0,.096,0);
  cyl(tea,0,0,0,.079,.079,.006,recipe.tea,12);
  tea.name=['紅壺','黃壺','綠壺'][index]+'的茶面'; tea.visible=false;
  const stream=paperStream(table,recipe.tea,'#f0dfaf',.043);
  const rim=cup.position.clone(); rim.y+=.096;
  const from=new S.T.Vector3(), tip=new S.T.Vector3(.18,.17,0);
  const atHome=()=>Math.abs(pot.position.x-PX)<.045&&Math.abs(pot.position.z-row.z)<.045;
  let sounded=0;
  function sample(u,visit,reduced){
    const tilt=Math.min(foldTravel(u,0,.25),1-foldTravel(u,.73,1));
    body.position.y=tilt*(reduced ? .12 : .25);
    body.rotation.z=-tilt*(atHome() ? .69 : .28);
    if(!atHome()){stream.hide();return;}
    const fill=foldTravel(u,.29,.70);
    tea.visible=fill>0||visit>1;
    const size=visit>1 ? .80+.20*fill : fill;
    tea.scale.set(Math.max(.001,size),1,Math.max(.001,size));
    if(tilt>.48&&u<.8) {
      from.copy(tip); body.localToWorld(from); table.worldToLocal(from);
      stream.pour(from,rim,Math.sin(Math.PI*foldTravel(u,.13,.8)));
      if(sounded!==visit){sounded=visit;S.sound('pour',body);}
    } else stream.hide();
  }
  S.pad(pot,.145,[0,.12,0]);
  const title=['紅壺','黃壺','綠壺'][index];
  const action=S.discovery(pot,{id:'sample-'+index,label:title+'的試飲小杯',duration:1.03,sound:()=>atHome()?null:'lid',draw:sample,reset:()=>{sounded=0;}});
  return {pot,action};
}
/** a '?' drawn with paper rods (height about .3) */
function qmark(g, col, x, y, z) {
  const P = [[-.09, .09], [-.07, .15], [0, .18], [.08, .15], [.1, .08], [.06, .02], [0, -.01], [0, -.06]];
  for (let i = 0; i < P.length - 1; i++) beam(g, [x + P[i][0], y + P[i][1], z], [x + P[i + 1][0], y + P[i + 1][1], z], .03, col, 5);
  disc(g, x, y - .14, z, .035, col, .02, 10);
}
function scarf(p) {
  const tie=keep(p.inner,0,.69,.107);tie.name='客人的朱紅領巾';
  poly(tie,[[-.162,.10],[-.066,.033],[.135,.098],[.117,.016],[.023,-.046],[-.050,-.041],[-.153,.021]],.018,'#ad4038');
  poly(tie,[[-.085,.015],[-.031,.031],[.018,-.009],[-.042,-.157],[-.069,-.129],[-.113,-.150]],.014,'#d2604e',0,0,.024);
  poly(tie,[[-.028,.025],[.044,.006],[.077,-.085],[.030,-.067],[.005,-.097]],.014,'#923f38',0,0,.018);
}

// A set of paper twins cut from a single strip. The nested hinges meet
// hand to hand throughout the fold, like a real concertina cutting.
function twinCuttingBench(S) {
  S.plant(-4.03,-2.42,(g) => {
    const bench=keep(g);
    const drafting='#456869', teal='#77a4a1', linen='#efdfbc';
    tab(bench,1.8);
    for (const x of [-.79,.79]) {
      box(bench,x,.28,-.02,.084,.56,.38,C.wood);
      box(bench,x,.075,-.02,.14,.08,.42,C.bark);
    }
    box(bench,0,.53,-.015,1.88,.11,.64,C.wood);
    box(bench,0,.595,-.015,1.9,.02,.65,linen);
    card(bench,0,.59,-.26,1.76,.80,drafting,.045,.06);
    for (let i=0;i<12;i++) box(bench,-.78+i*.143,1.26,-.208,.012,i%3 ? .07 : .13,.008,teal);
    for (const x of [-.78,.78]) for (const y of [.7,1.28]) disc(bench,x,y,-.20,.028,C.gold,.012,8);
    const cuts=[];
    const hingeWidth=.40;
    let edge=bench;
    for (let i=0;i<4;i++) {
      const hinge=keep(edge,i ? hingeWidth : -.79,i ? 0 : .615,i ? 0 : .06);
      const body=group(hinge); body.position.x=hingeWidth/2;
      const coat=['#c07257','#809f96','#c99a5a','#a07b89'][i];
      const profile=[[-.08,.017],[-.10,.025],[-.091,.194],[-.070,.27],[-.20,.31],[-.20,.38],[-.060,.356],[-.04,.404],[.04,.404],[.060,.356],[.20,.38],[.20,.31],[.070,.27],[.091,.194],[.10,.025],[.08,.017],[.035,.019],[0,.156],[-.035,.019]];
      poly(body,profile,.025,coat);
      disc(body,0,.45,.01,.069,linen,.04,14);
      poly(body,[[-.07,0],[-.075,.034],[-.04,.073],[.027,.078],[.066,.053],[.070,.009],[.025,.036],[-.02,.020]],.013,i===3 ? '#9a9390' : C.bark,0,.446,.036);
      if (i===3) {
        ball(body,-.075,.481,.008,.036,'#9a9390',0);
        box(body,-.012,.355,.035,.12,.035,.012,C.red);
      } else {
        poly(body,[[-.038,0],[.038,0],[0,-.042]],.008,linen,0,.342,.026);
      }
      cuts.push(hinge); edge=hinge;
    }
    for (let i=0;i<9;i++) box(bench,-.72+i*.17,.53,.313,.014,i%2 ? .043 : .074,.008,linen);
    paperMechanism(S,bench,{id:'paper-twins',label:'攤開紙樣分身',sound:'paper',duration:1},(u) => {
      const angle=1.26-1.18*u;
      cuts.forEach((part,i) => { part.rotation.y = i ? (i%2 ? 2 : -2)*angle : -angle; });
    });
  },{ry:.10,s:1.04});
}

// Four registered street-plan sheets lift apart to show the homes behind the sample.
function neighbourhoodSample(S) {
  S.plant(-4.32,1.70,(g) => {
    const model=keep(g), layers=[];
    tab(model,.9);
    box(model,0,.060,0,1.44,.11,.87,'#ad8865');
    box(model,0,.126,0,1.39,.022,.82,'#648e96');
    for (let i=0;i<9;i++) box(model,-.56+i*.138,.141,.344,.013,.01,i%2 ? .044 : .073,'#e3d7b3');
    const spindle=keep(model,.02,.14,0);
    cyl(spindle,0,.42,0,.017,.017,.84,'#b58859',8);
    const colors=['#e6c28c','#c3c58f','#91b399','#71978b'];
    for (let i=0;i<4;i++) {
      const layer=keep(model,i*.013,.145+i*.054,-i*.015);
      const width=1.23-i*.085, depth=.61-i*.038;
      box(layer,0,.022,0,width,.044,depth,colors[i]);
      box(layer,-.14,.046,0,.079,.006,depth,'#eaddba');
      box(layer,0,.047,.055,width,.006,.064,'#eaddba');
      for (const x of [-.39,.13,.34]) box(layer,x,.050,-.1,.095,.008,.076,'#967d72');
      layers.push(layer);
    }
    const peak=layers[3];
    const hut=group(peak); hut.position.set(-.03,.047,0);
    house(hut,.21,.14,.19,'#f0dfb4','#b96350');
    beam(peak,[.12,.045,-.04],[.12,.34,-.04],.009,C.bark,5);
    poly(peak,[[0,0],[.105,-.024],[0,-.061]],.009,C.red,.12,.337,-.04);
    S.pad(model,.38,[0,.30,0]);
    paperMechanism(S,model,{id:'contour-lift',label:'掀開街區分層圖',sound:'paper',duration:1.1},(u) => {
      spindle.scale.y = .19+.78*u;
      layers.forEach((sheet,i) => { sheet.position.y = .145+i*.054+i*.215*foldTravel(u,(3-i)*.07,1); });
    });
  },{ry:-.18,s:1.02});
}

export default {
  id: 's07-twins', land: 'model', short: '分身先試', calm: true,
  title: '新品上市前，哪些事可以問 AI 分身，哪些得問真人？',
  sources: [{ n: 12 }],
  diary: DIARY,
  takeaway: '分身幫你快速刷掉沒機會的選項；要不要上市，交給真人驗證。',
  quote: { t: '用模擬做篩選，用真人做把關，而不是讓模擬單獨做出上市與否的決定。', n: 12, page: 113 },
  look: { bg: '#4a2c40', table: '#b78f9b', key: '#ffe8d2', fill: '#f1d2e0', sky: '#fff0e6' },   // afternoon
  ground(G) {
    G.wash('#edcfd5');
    G.grid(.4, '#c98fa040', .012);
    G.grid(2, '#b8708a55', .02);
    // Three paper contours follow the actual rows of tea, beside the squared plotting paper of the model.
    const teaSlope=[[-5.87,-2.97],[-1.02,-2.68],[-.31,-2.17],[-.69,-1.51],[-1.34,-1.16],[-1.74,-.40],[-1.60,.44],[-2.10,1.14],[-2.71,1.67],[-3.89,2.54],[-5.47,2.57],[-5.87,2.11]];
    G.blob(teaSlope,'#94a581',{sharp:true});
    G.blob([[-5.85,-1.67],[-4.46,-1.31],[-3.11,-1.59],[-1.57,-2.19],[-1.28,-1.96],[-2.97,-1.26],[-4.44,-1.05],[-5.85,-1.37]],'#c2c096',{sharp:true});
    G.blob([[-5.85,-.44],[-4.43,-.26],[-3.53,-.50],[-2.48,-1.14],[-1.3,-1.45],[-1.19,-1.22],[-2.22,-.92],[-3.38,-.21],[-4.42,.04],[-5.85,-.10]],'#c9c59c',{sharp:true});
    G.blob([[-5.62,1.16],[-4.59,.98],[-3.62,.74],[-2.71,.18],[-1.61,-.40],[-1.62,-.12],[-2.55,.42],[-3.45,.98],[-4.57,1.24],[-5.62,1.53]],'#cbc49c',{sharp:true});
    G.blob([[-3.71,-2.88],[-.90,-2.74],[-.45,-2.13],[-.86,-1.52],[-1.58,-1.43],[-2.5,-1.72],[-3.58,-1.85]],'#c5a68c',{sharp:true});
    G.path([[-2.67,-1.82],[-2.06,-1.20],[-1.52,-.57],[-1.09,.20],[-1.25,.94],[-1.93,1.52],[-2.44,2.63]],{w:.57,col:'#dabfa2'});
    G.rect(TBL.x,TBL.z,4.42,3.16,'#c99da9',{r:.06,edge:'#b88799',edgeW:.08});
    G.rect(TBL.x,TBL.z,4.16,2.91,'#dfbac5',{r:.02,edge:'#eccecb',edgeW:.065});
    G.path([[-1.37,-.29],[-.6,-.04],[.43,.24],[1.05,.30]],{w:.48,col:'#dcbbb0'});
    G.circle(4.5, 1.5, .55, null, { edge: '#b8708a66', edgeW: .02 });                      // the compass's old circles
    G.circle(4.5, 1.5, .3, null, { edge: '#b8708a44', edgeW: .02 });
    G.marks('cross', 3.2, 1.0, 5.6, 2.6, { n: 10, col: '#b8708a55', size: .14, seed: 5 });
    G.rect(-4.32,1.7,1.61,1.03,null,{edge:'#765c7388',edgeW:.022,r:.025});
    G.path([[-5.2,1.08],[-5.2,2.32],[-3.4,2.32]],{w:.016,col:'#765c7388',sharp:true});
    for(let i=0;i<14;i++) G.path([[-5.12+i*.126,2.32],[-5.12+i*.126,2.32+(i%3 ? .05 : .095)]],{w:.012,col:'#765c7388',sharp:true});
  },
  build(S) {
    const st = S.state({ phase: 'intro' });
    let kettleT=0, catBusy=false, brewing=false, pouring=false;
    let bench, tasting, tally, trayControl, trayDrag, kettleStream;
    const cups=[], drinks=[], cupControls=[];
    twinCuttingBench(S);
    neighbourhoodSample(S);
    fieldPress(S,7);
    teaWorkshopStreet(S);

    // ---- the sun, an afternoon one
    let rays, clockStrike;
    S.plant(-2.4, -3.25, (g) => { rays = fieldSun(g, { y: 1.9, r: .42 }); });
    S.curio(rays,{id:'sun',label:'日光下的模型時鐘',quiet:true,tap:()=>{
      clockStrike.tap(); S.to(rays.rotation,{z:rays.rotation.z+.42},.72,'inOut');
    }});
    S.plant(-4.6, -3.3, (g) => fieldCloud(g, 1.1, 2.4)); S.plant(4.7, -3.35, (g) => fieldCloud(g, 1.0, 2.9));

    // ---- the pavilion and its market model
    const pots=[], samples=[], minis=[], signs=[];
    let clock,clockHand,clockBell,kettle,puff,mcat,fish,tray,plank;
    S.plant(TBL.x, TBL.z, (g) => {
      tab(g, 3.0);
      // pavilion: tall posts, the roof high enough to leave the whole model in view
      const H = 2.75;
      for(const x of [-1.75,1.75]) for(const z of [-1.12,1.12]) {
        box(g,x,.11,z,.20,.22,.21,'#a28c80');
        box(g,x,H/2,z,.10,H,.10,'#596a69');
        box(g,x-.036,H/2,z+.052,.025,H-.2,.026,'#c9aa88');
        for(const y of [.26,H-.28]) {
          box(g,x,y,z,.14,.048,.15,'#b49a79');
          disc(g,x,y,z+.081,.018,'#e4c59b',.012,8);
        }
      }
      // A rose-stock sawtooth roof, like the experimental halls in the Model
      // chapter. The three clerestories light the three tasting terraces below.
      box(g,0,H-.045,0,3.80,.15,2.42,'#74606a');
      box(g,0,H+.040,0,3.87,.036,2.48,'#d1b093');
      for(let i=0;i<3;i++) {
        const x0=-1.89+i*1.26, xr=x0+.92, x1=x0+1.26;
        const eave=H+.065, ridge=H+.55;
        quad(g,[x0,eave,-1.21],[xr,ridge,-1.21],[xr,ridge,1.21],[x0,eave,1.21],i%2 ? '#b58286' : '#be8d8e');
        quad(g,[xr,ridge,-1.21],[x1,eave,-1.21],[x1,eave,1.21],[xr,ridge,1.21],'#89a09e');
        for(const z of [-1.2,1.2]){
          tri(g,[x0,eave,z],[xr,ridge,z],[x1,eave,z],z>0 ? '#dfbbad' : '#a18c89');
          const facing=z>0 ? 1 : -1;
          beam(g,[x0,eave,z+.025*facing],[xr,ridge,z+.025*facing],.021,'#8b7167',5);
          beam(g,[xr,ridge,z+.025*facing],[x1,eave,z+.025*facing],.022,'#7e7169',5);
          for(let k=0;k<3;k++) box(g,x0+.48+k*.14,eave+.085,z+facing*.014,.077,.111,.018,'#a78c83');
        }
        for (const z of [-.72,0,.72]) {
          beam(g,[xr,ridge+.010,z],[x1,eave+.012,z],.016,'#dbc8ac',4);
          beam(g,[x0,eave+.010,z],[xr,ridge+.012,z],.010,'#cfaa9e',4);
        }
        beam(g,[xr,ridge,-1.26],[xr,ridge,1.26],.028,'#98756b',6);
      }
      for(const x of [-1.76,1.76]) for(const z of [-1.12,1.12]) {
        beam(g,[x,H-.36,z],[x*.81,H-.07,z],.037,'#b18361',5);
        beam(g,[x,H-.34,z],[x,H-.07,z*.74],.033,'#b18361',5);
      }
      pressPlate(g,'街坊分身試茶所',0,H-.032,1.249,1.77,.232,'#6c5661','#f4ddcc');
      issuePrint(g,'model',-1.42,H+.132,1.251,.29,'#80545c');
      // the table, one leg propped on a crate plank
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const shim = sx < 0 && sz > 0; box(g, sx * 1.4, shim ? .33 : .3, sz * .85, .1, shim ? .54 : .6, .1, C.wood); }
      plank = cratePlank(g, -1.4, .028, .85, { len: .55, h: .32, thick: .05 }); plank.rotation.x = -Math.PI / 2;
      box(g, 0, .58, 0, 3.12, .08, 1.98, '#775e54');
      box(g,0,.526,.99,3.13,.058,.050,'#cfac80');
      for(let i=0;i<26;i++) box(g,-1.43+i*.114,.533,1.019,.012,i%5 ? .024 : .045,.009,'#766255');
      box(g, 0, .63, 0, 3.0, .03, 1.86, '#8d7772');
      // Each stepped arcade has its own shop counter, curb and queue. The
      // pavements meet edge-to-edge, leaving a continuous neighbourhood.
      const paving = ['#dfb990', '#cda7a1', '#d5bd94'];
      ROW.forEach((row, i) => {
        const bottom=.646, height=row.y-bottom, depth=.58;
        box(g,0,bottom+height/2,row.z,2.94,height,depth,'#ab8572');
        box(g,0,row.y-.010,row.z,2.96,.020,depth,paving[i]);
        box(g,0,row.y-.024,row.z+depth/2,2.96,.025,.017,'#edd9af');
        for (let j=0;j<8;j++) box(g,-1.29+j*.365,row.y+.002,row.z+.192,.012,.004,.15,'#af8f77');
      });
      tally=keep(g,0,H+.335,1.31);tally.name='紅七票、黃零票、綠七票的模型記分牌';
      for(const x of [-1.20,1.20])box(tally,x,-.19,-.045,.054,.32,.078,'#8d7255');
      const counts=[0,0,0];
      for(const twin of MINIS)counts[twin.choice]++;
      const tallyColors=[['紅','#94483c'],['黃','#8c6938'],['綠','#406b52']];
      tallyColors.forEach(([label,ink],i)=>{
        const x=(i-1)*.91;
        box(tally,x,0,0,.87,.42,.042,'#e6cfa1');
        box(tally,x,0,.027,.821,.378,.016,ink);
        words(tally,label,x-.16,-.007,.041,.205,{color:'#fff0ce',weight:800});
        words(tally,String(counts[i]),x+.13,0,.042,.326,{color:'#fff3cf',weight:900});
      });
      tally.visible=false;
      // The market clock and the steaming teapot also work at model scale.
      clock = keep(g,.77,ROW[2].y,-.72);
      box(clock,0,.165,0,.22,.33,.15,'#ad7866');
      box(clock,0,.38,0,.245,.18,.17,'#edd6ae');
      poly(clock,[[-.15,0],[.15,0],[0,.11]],.18,'#72575d',0,.467,-.09);
      clockBell=keep(clock,0,.55,.045);
      cyl(clockBell,0,.02,0,.043,.069,.04,C.gold,12);
      beam(clockBell,[0,.015,0],[0,-.057,.01],.009,C.bark,5);
      disc(clock,0,.386,.095,.077,'#725a52',.017,14);
      disc(clock,0,.386,.109,.062,WHITE,.009,14);
      clockHand = keep(clock,0,.386,.122);
      beam(clockHand,[0,0,0],[.012,.045,0],.007,C.navy,4);
      beam(clockHand,[0,0,0],[-.03,.004,0],.007,C.navy,4);
      for (const [x,z,w,c] of [[.48,-.16,.23,C.coral],[.91,-.1,.22,C.teal],[1.19,-.63,.23,C.honey]]) {
        const shop=keep(g,x,z<-.30?ROW[2].y:ROW[1].y,z);
        house(shop,w,w*.72,w*.70,WHITE,c);
        box(shop,0,.073,.082,.18,.023,.06,c);
      }
      for (const [x,y,z] of [[.60,ROW[0].y,.28],[.38,ROW[2].y,-.80],[1.33,ROW[1].y,-.21]]) {
        cyl(g,x,y+.041,z,.012,.012,.082,C.bark,4); ball(g,x,y+.13,z,.068,C.leaf,0);
      }
      kettle = keep(g,1.20,ROW[0].y,.51);
      teapot(kettle,'#8c624c');
      puff = keep(kettle,.18,.20,0); steamCurl(puff); puff.visible=false;
      // the mini cat and the fish it wants
      mcat = keep(g, .55, ROW[0].y, .62);
      poly(mcat,[[-.05,.023],[-.10,.069],[-.14,.164],[-.123,.207],[-.106,.166],[-.08,.109],[-.018,.087]],.035,'#965e45');
      poly(mcat,[[-.079,.012],[-.07,.088],[-.026,.128],[.045,.120],[.082,.072],[.055,.008]],.057,'#b87954',0,0,-.012);
      poly(mcat,[[.013,.098],[.016,.193],[.053,.167],[.094,.181],[.127,.218],[.131,.124],[.1,.094],[.056,.087]],.054,'#bc805a',0,0,.004);
      poly(mcat,[[.036,.129],[.065,.111],[.109,.126],[.095,.105],[.066,.093],[.041,.102]],.008,'#ecdbc0',0,0,.065);
      disc(mcat,.095,.149,.062,.009,'#51443b',.006,8);
      S.pad(mcat,.166,[.01,.104,.031]);
      fish = keep(g, .7, ROW[0].y + .015, .66); poly(fish, [[-.05, 0], [.022, .024], [.067, 0], [.022, -.025]], .012, C.aqua, 0, .023, 0); poly(fish, [[-.05, 0], [-.082, .026], [-.082, -.026]], .012, C.aqua, 0, .023, 0);
      // three new flavours in three little teapots, one at the end of each terrace
      ROW.forEach((row,i)=>{
        const sample=tastingStation(S,g,row,i); pots.push(sample.pot); samples.push(sample.action);
      });
      // the neighbours in miniature, ready to sample the three flavours
      MINIS.forEach((m, i) => {
        const w = keep(g, m.from[0], m.from[1], m.from[2]);
        const p = S.person(w, { s: .36, species: i === GRAN ? 'civet' : undefined, kind: i === GRAN ? 'elder' : m.kind, coat: i === GRAN ? C.plum : m.coat, hair: [C.ink, C.bark, C.deep][i % 3] });
        if (i === GRAN) scarf(p);
        p.w = w; w.visible = false; minis.push(p);
        const sg = keep(p.inner, .3, .95, .06); beam(sg, [0, 0, 0], [0, .5, 0], .025, C.wood, 4); card(sg, 0, .42, 0, .48, .46, WHITE, .03, .06); qmark(sg, C.red, 0, .64, .04);
        sg.visible = false; signs.push(sg);
      });
    }, { s: 1.18 });
    // the tray with the last two cups waits on a stool in front of the pavilion (it is filled when the lines tie)
    S.plant(1.1, 1.2, (g) => {
      tab(g, .5); cyl(g, 0, .2, 0, .2, .22, .4, C.wood, 10); cyl(g, 0, .41, 0, .23, .23, .03, C.honey, 12);
      tray = keep(g,0,.431,0); tray.name='給紅領巾客人的雙杯托盤';
      tray.scale.setScalar(1.48);
      box(tray, 0, .012, 0, .44, .024, .22, C.wood); box(tray, 0, .03, .1, .44, .03, .02, C.bark); box(tray, 0, .03, -.1, .44, .03, .02, C.bark);
      for (const [j, pi] of [0, 2].entries()) {
        const c=keep(tray,j?-.134:.134,.029,0);c.scale.setScalar(1.18);
        c.name = j ? '綠壺的試茶杯' : '紅壺的試茶杯';
        cyl(c, 0, .063, 0, .065, .048, .126, WHITE, 12);
        cyl(c, 0, .079, 0, .064, .059, .048, POTS[pi].col, 12);
        cyl(c, 0, .126, 0, .06, .06, .008, POTS[pi].tea, 12);
        cups.push(c);drinks.push(dressTeaCup(c,j));
      }
      tray.visible = false;
    });
    paperMechanism(S,plank,{id:'plank',label:'桌腳的木楔',duration:.62,sound:'wood-creak'},u=>{
      plank.position.x=-1.4+.18*u; plank.rotation.y=.16*u;
    });
    let clockChimed=0;
    clockStrike=S.discovery(clock,{id:'lighthouse',label:'茶街的報時鐘',duration:1.1,draw(u,visit,reduced){
      const hand=foldTravel(u,0,.64); clockHand.rotation.z=-(visit-1+hand)*Math.PI/2;
      clockBell.rotation.z=Math.sin(foldTravel(u,.54,1)*Math.PI*3)*pulse(u,.52,1)*(reduced ? .11 : .43);
      if(u>=.60&&u<1&&clockChimed!==visit){clockChimed=visit;S.sound('clock-chime',clockBell);}
    },reset:()=>{clockChimed=0;}});
    S.curio(kettle, { id: 'ferry', label: '街角冒煙的茶壺', tap: () => {
      S.sound('tea-leaves'); kettleT=1.2; S.show(puff,.25); S.wait(.85).then(() => S.hide(puff,.28));
    } });
    S.curio(mcat, { id: 'minicat', label: '小貓', aim:[.01,.104,.031], tap: async () => {
      if (catBusy) return; catBusy = true; S.sound('meow', mcat);
      const away = fish.position.x < .8, y0 = ROW[0].y;
      S.to(fish.position, { x: away ? 1.0 : .7, y: y0 + .06 }, .25, 'out').then(() => S.to(fish.position, { y: y0 + .015 }, .2, 'bounce'));
      await S.wait(.25); mcat.scale.x = away ? 1 : -1; await S.to(mcat.position, { x: away ? .85 : .55 }, .55, 'inOut'); catBusy = false;
    } });

    // ---- 阿滿姨's tea stall: a big empty urn and a shelf
    let lid, steam = [], urnTop, urnSeat, slot0;
    S.plant(-1.6, -1.05, (g) => {
      tab(g, 1.0);
      box(g, 0, .17, 0, .9, .34, .8, '#b4644a'); box(g, 0, .2, .405, .3, .16, .02, C.dark);
      cyl(g, 0, .72, 0, .36, .33, .76, '#c9875a', 16); cyl(g, 0, .52, 0, .37, .37, .05, '#a86a42', 16); cyl(g, 0, .92, 0, .37, .37, .05, '#a86a42', 16);
      beam(g, [.12, .45, .32], [.12, .45, .44], .025, C.gold, 6);
      lid = keep(g, 0, 1.1, 0); cyl(lid, 0, 0, 0, .34, .36, .05, '#a86a42', 16); cone(lid, 0, .09, 0, .3, .13, '#b97a4e', 16); ball(lid, 0, .18, 0, .045, C.gold, 1);
      urnTop=keep(g,-.21,1.63,.055);urnSeat=keep(g,0,1.26,.02);
      kettleStream=paperStream(g,'#859655','#dfe1a5',.039);
      for(let i=0;i<3;i++){const p=keep(g,0,1.3,0); steamCurl(p); p.rotation.y=i*.64; p.visible=false; steam.push(p);}
    });
    S.curio(lid, { id: 'lid', label: '白圍裙店主的大茶桶', quiet: true, tap: async () => { if(st.phase==='chosen'){S.run('brew');return;} S.sound('lid'); for (let i = 0; i < 2; i++) { await S.to(lid.position, { y: 1.22 }, .12, 'out'); await S.to(lid.position, { y: 1.1 }, .14, 'in'); } } });
    S.plant(-2.65, -1.45, (g) => {
      tab(g, .9);
      for (const sx of [-1, 1]) box(g, sx * .42, .6, 0, .06, 1.2, .3, C.wood);
      for (const y of [.35, .8, 1.2]) box(g, 0, y, 0, .9, .04, .32, C.wood);
      for (const [x, c] of [[-.25, C.pink], [-.05, C.lime]]) { cyl(g, x, .45, 0, .07, .07, .16, c, 10); cyl(g, x, .55, 0, .05, .05, .03, C.wood, 10); }
      for (const [x, c] of [[.15, C.honey], [.3, C.mint]]) cyl(g, x, .9, 0, .06, .06, .16, c, 10);
      slot0 = keep(g, .05, .82, .02);
    });

    // ---- the real grandmother on her bench, 阿滿姨, the brewer, the note-taking owl
    let gran, auntie, zhi, ce;
    S.plant(-2.9, .95, (g) => {
      tab(g, 1.1);
      box(g, 0, .3, 0, 1.2, .06, .43, C.wood); for (const sx of [-1, 1]) box(g, sx * .4, .14, 0, .06, .28, .3, C.bark);
      box(g, 0, .62, -.17, 1.0, .2, .04, C.wood); for (const sx of [-1, 1]) beam(g, [sx * .4, .3, -.17], [sx * .4, .72, -.17], .025, C.bark, 4);
      gran = S.person(g, { x: .08, y: .12, z: -.04, s:1.52, kind: 'elder', species: 'civet', coat: C.plum, prop: false }); scarf(gran);
      bench=teaBench(g,gran);
    });
    S.plant(-.9, -.45, (g) => {
      auntie = S.person(g, { s:1.36, kind: 'adult', coat: C.coral, hair: C.ink });
      poly(auntie.inner,[[-.162,.21],[.162,.21],[.118,.62],[.077,.73],[-.043,.73],[-.101,.62]],.021,'#fff1d2',0,0,.125);
      poly(auntie.inner,[[-.11,.29],[.113,.29],[.110,.324],[-.114,.324]],.007,'#dab897',0,0,.151);
      box(auntie.head, 0, .36, .02, .42, .07, .1, C.pink);
    });
    S.plant(2.57, 1.43, (g) => { zhi = S.robot(g, { species: 'otter', s: 1.52, lights: S.index - 1 }); });
    S.plant(3.86, .71, (g) => { ce = S.person(g, { s:1.26, kind: 'ce', coat: C.navy }); });
    const cp=(p,id,label,gesture)=>{const c=S.curio(p.root,{id,label,quiet:true,tap:gesture});p.propId=c.id;};
    cp(gran,'gran','板凳上繫紅領巾的客人',()=>{
      if(st.phase==='touch')S.run('touch');
      else if(st.phase==='redBack')S.run('green');
      else if(st.phase!=='chosen')gran.wave(.74);
    });
    cp(auntie,'auntie','大茶桶旁穿白圍裙的店主',()=>{
      if(st.phase==='chosen'){S.run('brew');return;}
      auntie.wave(.9);S.wiggle(lid,.17);S.sound('lid',lid);
    });
    cp(ce,'ce','整理試茶名單的茶會志工',()=>{ce.doubt();ce.wave(.75);S.sound('pencil');});
    S.hero(zhi, { label: '整理試喝名單的水獺茶師', ready: () => st.phase === 'ready', go });

    // ---- the compass on the drafting paper
    let comp, leg; const rings=[];
    S.plant(1.89,2.17,g=>{
      box(g,0,.014,0,.99,.014,.93,'#e5d1ac');
      for(let i=0;i<8;i++) box(g,-.42+i*.12,.024,.377,.009,.005,i%2 ? .040 : .063,'#927f80');
      comp=keep(g,0,.022,0);
      beam(comp,[0,.016,0],[0,.72,0],.024,C.steel,5);
      leg=keep(comp,0,.72,0); beam(leg,[0,0,0],[.36,-.67,0],.025,C.steel,5);
      cone(leg,.36,-.675,0,.026,.07,C.ink,6).rotation.z=Math.PI;
      ball(comp,0,.74,0,.051,C.gold,1);
      for(const [radius,ink] of [[.36,'#a45650'],[.255,'#84677b']]) {
        rings.push(Array.from({length:12},(_,i)=>{
          const part=keep(g), a=i*Math.PI/6, b=(i+1)*Math.PI/6;
          beam(part,[Math.cos(a)*radius,.030,-Math.sin(a)*radius],[Math.cos(b)*radius,.030,-Math.sin(b)*radius],.013,ink,5);
          part.visible=false; return part;
        }));
      }
      S.pad(comp,.20,[.12,.43,0]);
    });
    S.discovery(comp,{id:'compass',label:'試畫圈的圓規',duration:1.25,sound:'pencil',draw(u,visit){
      const which=(visit-1)%2, turn=foldTravel(u,.12,.90);
      leg.scale.x=which ? .255/.36 : 1;
      comp.rotation.y=Math.PI*2*turn;
      rings.forEach((arcs,k)=>arcs.forEach((arc,i)=>{arc.visible=k<which||(k===which&&turn>(i+.3)/12);}));
    }});
    // ---- the story
    const fly = async (node, toWorld, dur = .7, lift = .7) => {
      const a = node.position.clone(), b = S.local(node.parent, toWorld), mid = { x: (a.x + b.x) / 2, y: Math.max(a.y, b.y) + lift, z: (a.z + b.z) / 2 };
      await S.to(node.position, mid, dur / 2, 'out'); await S.to(node.position, { x: b.x, y: b.y, z: b.z }, dur / 2, 'in');
    };
    async function go() {
      if (st.phase !== 'ready') return; S.set({ phase: 'busy' });
      auntie.still(); zhi.cheer(); S.sound('whoosh');
      // the digital neighbours appear on the market model
      for (let i = 0; i < minis.length; i++) { const m = minis[i]; S.show(m.w, .3); if (i % 3 === 0) S.sound('tick'); await S.wait(.06); }
      await S.wait(.35);
      // a drop of each
      for(const sip of samples){sip.tap();await S.wait(.16);}
      minis.forEach((m) => m.hop(.4)); S.sound('pop');
      await S.wait(.5);
      // and into line in front of the one they like
      minis.forEach((m, i) => S.to(m.w.position, { x: MINIS[i].to[0], y: MINIS[i].to[1], z: MINIS[i].to[2] }, .55, 'inOut', i * .03));
      await S.wait(1.0); zhi.still();
      const twoEnds=[signs[6],signs[13]];
      for(const end of twoEnds)S.show(end,.28);
      tally.visible=true;S.sound('paper',tally);
      tray.visible=true;S.sound('cup',tray);
      trayControl.drag=trayDrag;for(const p of cupControls)p.drag=trayDrag;
      S.focus(1.25);S.set({phase:'touch'});S.hint(pots[1],[0,.20,.02]);
    }

    tasting=makeTaste(S,gran,bench,tray,drinks);
    async function red(byHand=false) {
      if(st.phase!=='touch')return;
      S.set({phase:'busy'});S.hint(null);
      trayControl.drag=null;for(const p of cupControls)p.drag=null;
      S.focus(-1.58);gran.still();auntie.still();ce.still();
      await fly(pots[1],S.world(slot0),.70,.52);S.sound('lid',pots[1]);
      const at=S.world(bench.dock,[0,.015,0]);
      if(byHand) {
        const q=S.local(tray.parent,at);
        await S.to(tray.position,{x:q.x,y:q.y,z:q.z},.30,'out');
      } else await fly(tray,at,1.03,.38);
      S.sound('cup',tray);
      await tasting.red();
      S.set({phase:'redBack'});S.hint(cups[1],[0,.12,0]);
    }
    async function green() {
      if(st.phase!=='redBack')return;
      S.set({phase:'busy'});S.hint(null);S.focus(-2.24);
      await tasting.green();S.sound('cup',cups[1]);
      S.set({phase:'chosen'});S.hint(lid,[0,.12,0]);
    }
    async function brew() {
      if(st.phase!=='chosen')return;
      S.set({phase:'busy'});S.hint(null);S.focus(-1.64);
      auntie.wave(.72);
      for(const sign of signs) if(sign.visible)S.hide(sign,.23);
      await S.to(lid.position,{x:-.48,y:1.20},.36,'out');
      await fly(pots[2],S.world(urnTop),.84,.68);
      await S.to(pots[2].rotation,{z:-.82},.30,'out');
      pouring=brewing=true;steam.forEach(p=>p.visible=true);S.sound('pour',pots[2]);
      await S.wait(.69);pouring=false;kettleStream.hide();
      await S.to(pots[2].rotation,{z:0},.23,'out');
      await S.to(lid.position,{x:0,y:1.1},.25,'inOut');
      const seat=S.local(pots[2].parent,S.world(urnSeat));await S.to(pots[2].position,{x:seat.x,y:seat.y,z:seat.z},.36,'out');
      auntie.cheer();ce.cheer();minis[GRAN].wave(1.4);zhi.cheer();S.learn(zhi);
      await S.wait(.72);S.set({phase:'done'});S.done();
    }

    trayControl=S.carry(tray,{id:'tray',label:'端給紅領巾客人的雙杯托盤',pad:.119,padAt:[0,.038,.111],
      tap:()=>{if(st.phase==='touch')S.run('touch');else if(st.phase==='redBack')S.run('green');},
      targets:()=>st.phase==='touch'?[{at:()=>S.world(bench.dock),r:86,drop:()=>red(true)}]:[]});
    trayDrag=trayControl.drag;trayControl.drag=null;
    cups.forEach((cup,i)=>{
      S.pad(cup,.084,[0,.087,0]);
      const control=S.curio(cup,{id:i?'green-cup':'red-cup',label:i?'綠壺的試飲杯':'紅壺的試飲杯',aim:[0,.095,.017],quiet:true,tap(){
        if(!i&&st.phase==='touch')S.run('touch');
        else if(i&&st.phase==='redBack')S.run('green');
        else if(i&&st.phase==='chosen')S.run('brew');
        else S.sound('cup',cup);
      }});cupControls.push(control);
    });
    samples.forEach((sample,i)=>{
      const pour=sample.tap;
      sample.tap=()=>{
        if(st.phase==='touch'&&i!==2){S.run('touch');return;}
        if(st.phase==='redBack'&&i===2){S.run('green');return;}
        if(st.phase==='chosen'&&i===2){S.run('brew');return;}
        pour();
      };
    });
    S.onReadyLoop((phase) => {
      // Consider the three candidate pots in turn; the brewer still has only one urn.
      pots.forEach((pot, i) => {
        const weighing = pulse(phase, .03 + i * .25, .32 + i * .25);
        pot.position.y += .15 * weighing; pot.rotation.z -= .27 * weighing;
      });
      auntie.head.rotation.y += .34 * Math.sin(phase * 2 * Math.PI);
      auntie.armL.rotation.z -= .6 * pulse(phase, .65, .98);
    }, 5.2, [...pots, auntie.head, auntie.armL]);
    S.act('go',go);S.act('touch',()=>red(false));S.act('green',green);S.act('brew',brew);
    S.on('reset',()=>{
      tasting.reset();kettleT=0;catBusy=brewing=pouring=false;kettleStream.hide();
      trayControl.drag=null;for(const p of cupControls)p.drag=null;
    });
    S.on('enter', async () => {
      auntie.doubt(); await S.wait(.6);
      S.wiggle(pots[0], .15); await S.wait(.25); S.wiggle(pots[1], .15); await S.wait(.25); S.wiggle(pots[2], .15); S.sound('tick');
      await S.wait(.5); zhi.hop(); zhi.wave(1.2); await S.wait(.4);
      S.set({ phase: 'ready' });
    });
    const turns={
      ready:['穿白圍裙的店主只能煮一款新茶。先讓 14 個 AI 分身試試三壺。','go','請分身排隊選茶'],
      touch:['紅壺 7 票、黃壺 0 票、綠壺 7 票。紅綠平手，換板凳上繫紅領巾的客人試喝。','touch','收黃壺，端紅杯給客人'],
      redBack:['她喝了一口，把紅杯推回托盤。另一杯會留下嗎？','green','請她試綠杯'],
      chosen:['她聞香、啜了一口，把綠杯捧在胸前。店主知道該煮哪壺了。','brew','請白圍裙店主煮綠茶']
    };
    S.ui(()=>{
      if(st.phase==='done')return{playing:false,caption:'分身幫店主篩掉黃壺。紅綠難分時，店主請真人試喝，才決定煮綠茶。',buttons:[]};
      const turn=turns[st.phase];
      if(!turn)return{playing:true,caption:'',buttons:[]};
      return{playing:false,caption:turn[0],buttons:[{id:turn[1],label:turn[2],primary:true}]};
    });
    S.tick((t,dt)=>{
      tasting.tick(t,S.stage.still.matches);
      if(pouring){
        const g=urnSeat.parent,from=S.local(g,S.world(pots[2],[.18,.17,.02]));
        kettleStream.pour(from,new S.T.Vector3(0,1.11,.045),1);
      }
      const still=S.stage.still.matches, breeze=still ? 0 : t;
      if(!still) rays.rotation.z+=dt*.05;
      if (kettleT > 0) kettleT = Math.max(0,kettleT-dt);
      kettle.rotation.z = Math.sin(breeze*17) * .046 * kettleT;
      puff.position.y = .20 + (1.2-kettleT)*.16;
      if (brewing) steam.forEach((p, i) => { const u = (breeze * .35 + i / 3) % 1; p.position.set(Math.sin(u * 5 + i) * .08, 1.3 + u * 1.0, 0); p.scale.setScalar(Math.max(.001, (.5 + u * 1.2) * (1 - u * u))); });
    });
  },
};
