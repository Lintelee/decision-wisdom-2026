// Pressed paper, reflective tape and brass hardware for the rainwear fitting spread.
import { group, keep, box, card, poly, tri, quad, beam, ball, disc, ring, words, tag, raincoatPaper } from '../paper.js';
import { buildOtterPortrait } from '../resident-puppets.js';

const P = {
  teal: '#355e5b', dark: '#243f42', mint: '#91b4a4', brass: '#cda86b', bone: '#f1dbb3',
  ...raincoatPaper,
  trouser: '#b19777', rain: '#72aabc', ink: '#38464e', hair: '#453d3a', skin: '#eab991',
};

function swallow(g, x, y, z, scale, color = P.dark) {
  const wing = group(g); wing.position.set(x,y,z); wing.scale.setScalar(scale);
  poly(wing, [[-.49,.2],[-.12,.10],[0,-.01],[.49,.27],[.21,-.03],[-.07,-.18],[-.2,-.06]], .025, color);
}

// The two-tone long cape, dart seams and swallow emblem repeat on the order slip.
export function hangingCape(g) {
  const cape = keep(g);
  poly(cape, [[-.18,.49],[-.37,.40],[-.56,.04],[-.41,-.08],[-.3,.03],[-.43,-.54],[-.27,-.65],[0,-.59],[.24,-.65],[.43,-.56],[.31,.035],[.42,-.08],[.55,.02],[.36,.39],[.17,.49]], .055, P.coat);
  poly(cape, [[-.31,.35],[-.25,.37],[-.14,-.48],[-.27,-.61],[-.41,-.53]], .009, P.shade,0,0,.058);
  poly(cape, [[.02,.42],[.12,.44],[.30,-.55],[.12,-.52]], .009, P.light,0,0,.058);
  poly(cape, [[-.39,-.42],[-.01,-.47],[.39,-.42],[.397,-.485],[-.01,-.53],[-.40,-.48]], .012, P.reflect,0,0,.070);
  poly(cape, [[-.19,.43],[-.20,.60],[-.10,.74],[.055,.78],[.176,.675],[.208,.48],[.085,.405]], .060, P.light,0,0,.063);
  poly(cape, [[-.102,.491],[-.105,.605],[-.035,.684],[.072,.661],[.134,.507],[.054,.453]], .009, P.dark,0,0,.127);
  beam(cape,[-.001,.414,.085],[.001,-.52,.084],.012,P.bone,5);
  for(const y of [.26,.15,.04]) disc(cape, .021, y, .094, .014, P.dark,.012,8);
  swallow(cape, .148, .24, .090, .23);
  return cape;
}

export function raincoatShop(g) {
  const xOuter=1.48, wall=1.98;
  box(g,0,.09,0,3.27,.18,1.94,'#9f8b70');
  box(g,0,.19,.03,3.18,.065,1.91,P.bone);
  for(let i=0;i<11;i++) box(g,-1.43+i*.286,.245,.01,.272,.055,1.79,i%3===0?'#ac8261':'#bb9270');
  box(g,0,1.13,-.78,3.0,1.80,.15,P.teal);
  for(const x of [-xOuter,xOuter]) {
    box(g,x,1.18,-.04,.16,wall,1.62,P.teal);
    box(g,x,.43,.79,.20,.34,.22,P.dark);
    box(g,x,1.19,.79,.12,1.68,.17,P.mint);
    beam(g,[x,1.54,.79],[x*.73,1.98,.79],.042,P.brass,5);
  }
  // A shopfront with a tall glazed window and a ribbed zinc roof.
  box(g,0,1.78,-.653,2.57,.42,.04,'#c2cebc');
  for(let i=0;i<9;i++) box(g,-1.15+i*.29,1.78,-.620,.021,.42,.030,P.teal);
  for(const x of [-1.06,-.49,.37,.94]) {
    poly(g,[[0,0],[.065,0],[.23,.33],[.165,.33]],.009,'#e6e1c5',x,1.596,-.605);
  }
  for(const z of [-.91,.88]) {
    poly(g,[[-1.62,1.98],[1.62,1.98],[1.19,2.45],[-1.28,2.45]],.08,P.teal,0,0,z);
    beam(g,[-1.62,2.00,z+.063],[1.62,2.00,z+.063],.039,P.brass,5);
  }
  for(let i=0;i<12;i++) {
    const x=-1.57+i*.264, w=.27, h=x< -1.25?2.04+(x+1.6):x>.99?2.48-(x-.99)*.80:2.48;
    const next=x+w; const h2=next< -1.25?2.04+(next+1.6):next>.99?2.48-(next-.99)*.80:2.48;
    quad(g,[x,h,-1.0],[next,h2,-1.0],[next,h2,.98],[x,h,.98],i%2?'#6c8a84':'#789690');
    beam(g,[x,h+.017,-.99],[x,h+.017,.985],.017,'#a9b8a7',5);
  }
  tag(g,'雨衣試騎所',0,2.21,.978,{h:.24,ink:'#f9e8c4',paper:P.teal,pad:.16});
  for(const x of [-1.26,1.26]) { swallow(g,x,2.18,.973,.22,P.brass); }
  // Fabric bolts along the back counter belong to this rainwear shop.
  box(g,-.62,.49,-.36,1.54,.43,.50,P.teal);
  box(g,-.62,.73,-.35,1.64,.085,.57,P.bone);
  for(let i=0;i<4;i++) {
    const x=-1.21+i*.24, h=.32+.095*(i%3), shade=['#8d9d87','#bb7355','#bd9e6b','#83a5a1'][i];
    card(g,x,.78,-.48,.19,h,shade,.17,.05); box(g,x,.88,-.299,.195,.085,.014,P.bone);
    for(let j=0;j<3;j++) box(g,x-.059+j*.053,.89,-.288,.011,.038,.008,'#997c55');
  }
  // A portable wooden display rack stands out from the wall, with the actual wearable sample.
  const railX=.59, railZ=.69;
  beam(g,[railX-.64,.30,railZ],[railX-.64,1.76,railZ],.035,P.brass,6);
  beam(g,[railX+.65,.30,railZ],[railX+.65,1.76,railZ],.035,P.brass,6);
  beam(g,[railX-.69,1.76,railZ],[railX+.70,1.76,railZ],.042,P.brass,6);
  for(const x of [railX-.64,railX+.65]) {
    box(g,x,.295,railZ,.17,.075,.41,P.dark); ball(g,x,1.76,railZ,.058,P.bone,1);
  }
  const home=[railX,.99,railZ+.10];
  const cape=hangingCape(g); cape.position.set(...home);
  return {cape};
}

// Two clipped samples sit at hand height outside the fitting room, with a catch tray below each.
export function swatchTable(S,g) {
  box(g,0,.101,.04,1.46,.15,.57,'#a5815f');
  box(g,0,.187,.035,1.55,.073,.63,P.bone);
  for(const x of [-.56,.56]) beam(g,[x,.21,-.19],[x,.99,-.19],.025,P.teal,5);
  beam(g,[-.64,.99,-.19],[.64,.99,-.19],.028,P.brass,6);
  for(const [i,x] of [-.35,.35].entries()){
    const repels=i===1, kit=keep(g,x,0,0), cloth=keep(kit,0,.27,.01);
    cloth.rotation.x=-.22;
    const col=repels?P.coat:'#c7b698',edge=repels?P.shade:'#a69b88';
    poly(cloth,[[-.26,.68],[.253,.67],[.245,.14],[.16,.023],[-.25,.057]],.022,col);
    poly(cloth,[[.16,.023],[.245,.14],[.152,.13]],.008,edge,0,0,.032);
    for(const side of [-1,1]) for(let r=0;r<6;r++){
      box(cloth,side*.215,.155+r*.083,.029,.008,.037,.008,repels?'#f1dfae':'#ece0c5');
    }
    box(cloth,0,.625,.035,.16,.054,.033,P.teal);disc(cloth,0,.625,.06,.018,P.brass,.009,8);
    if(repels) swallow(cloth,.104,.485,.036,.21,P.teal);
    else for(let r=0;r<3;r++) beam(cloth,[-.17,.59-r*.052,.032],[-.07,.54-r*.052,.032],.006,'#a79c85',4);
    const stain=keep(cloth,0,.27,.037);stain.name='布面吸水暈痕';stain.visible=false;
    poly(stain,[[-.14,.056],[-.081,.148],[.012,.108],[.094,.133],[.158,.043],[.112,-.038],[.137,-.095],[.018,-.143],[-.095,-.102],[-.143,-.028]],.004,'#758f89');
    const drop=keep(kit,0,.91,.06);
    poly(drop,[[0,.086],[.043,.013],[.040,-.033],[.009,-.045],[-.034,-.031],[-.041,.01]],.025,'#7bbcc6');
    beam(drop,[-.020,-.012,.03],[-.016,.022,.03],.006,'#f1e7cc',4);
    drop.visible=false;
    const tray=keep(kit,0,.25,.21);
    const cup=disc(tray,0,0,0,.132,'#789993',.024,12);cup.rotation.x=0;cup.scale.z=.72;
    const rim=ring(tray,0,.017,0,.132,.012,P.brass,14);rim.rotation.x=-Math.PI/2;rim.scale.y=.72;
    const caught=keep(tray,0,.03,0);caught.name='滾進碟裡的水'; const water=disc(caught,0,0,0,.10,'#bfd9cc',.009,12);water.rotation.x=0;water.scale.z=.68;caught.visible=false;
    let landed=0;
    S.pad(kit,.27,[0,.58,.065]);
    S.discovery(kit,{id:repels?'swatch':'cotton',label:repels?'水珠會滑落的燕尾雨布':'會吸水變深的棉布',aim:[0,.59,.06],duration:1.58,
      reset(){landed=0;},
      draw(u,visit,still){
        const fall=S.T.MathUtils.smoothstep(u,.05,.39),roll=S.T.MathUtils.smoothstep(u,.42,.80);
        const side=visit%2?-.083:.074;
        drop.visible=u<(repels ? .80 : .47);drop.position.set(side+roll*(repels ? .12 : 0),.96-.40*fall-(repels ? .295 : 0)*roll,.03+.115*fall+.08*roll);
        cloth.rotation.x=-.22+(still?0:.10)*Math.sin(Math.PI*2*roll);
        if(repels){caught.visible=u>=.79;caught.scale.setScalar(.41+.59*S.T.MathUtils.smoothstep(u,.79,.95));}
        else {stain.visible=u>=.36;stain.position.x=side*.65;stain.scale.setScalar(.025+.975*S.T.MathUtils.smoothstep(u,.36,.84));}
        if(u>=(repels ? .79 : .36)&&landed!==visit){landed=visit;S.sound(repels?'tin-tap':'rain-drop',kit);}
      }});
  }
}

// The paper skiff travels between two printed eddies. Its wake comes from the stern.
export function gutterBoat(S,landing) {
  const boat=keep(landing,-.40,.039,0);
  const nose=[.34,.19,0],tail=[-.33,.18,0],keel=[.01,0,0],near=[.018,.123,.155],far=[-.01,.124,-.145];
  tri(boat,tail,near,keel,'#944f3d');
  tri(boat,nose,keel,near,'#c7774f');
  tri(boat,nose,far,keel,'#ecd5aa');
  tri(boat,tail,keel,far,'#bda687');
  quad(boat,tail,far,nose,near,'#f0d7a8');
  poly(boat,[[-.18,.136],[.135,.147],[.015,.362]],.019,'#f3e8cb',0,0,.005);
  poly(boat,[[.015,.362],[-.034,.145],[.135,.147]],.004,'#84a39b',0,0,.029);
  boat.scale.setScalar(1.17);
  const ripples=[];
  for(let i=0;i<2;i++){
    const r=keep(landing,0,.013,0),rim=ring(r,0,0,0,.15,.013,'#e7e3c7',16);
    rim.rotation.x=-Math.PI/2;rim.scale.y=.61;r.visible=false;ripples.push(r);
  }
  S.pad(landing,.29,[0,.056,.01]);
  S.discovery(landing,{id:'ripple',label:'積水裡折起來的小紙船',aim:[0,.14,0],duration:1.48,sound:'rain-drop',
    draw(u,visit,still){
      const t=S.T.MathUtils.smootherstep(u,0,1),right=visit%2?t:1-t,dir=visit%2?1:-1;
      boat.position.x=-.40+right*.88;boat.rotation.z=still?0:dir*.13*Math.sin(u*Math.PI*2);
      ripples.forEach((r,i)=>{const wave=(u-i*.2)/.70;r.visible=wave>0&&wave<1;
        if(r.visible){r.position.x=boat.position.x-dir*(.19+i*.05+wave*.17);r.scale.setScalar(.18+wave*1.42);}
      });
    }});
}

function wheel(g, x, y) {
  const w=keep(g,x,y);
  ring(w,0,0,0,.386,.046,P.ink,32);
  ring(w,0,0,.010,.346,.021,P.bone,32);
  for(let i=0;i<8;i++) {
    const a=Math.PI*i/8, dx=Math.cos(a)*.343, dy=Math.sin(a)*.343;
    beam(w,[-dx,-dy,.012],[dx,dy,.012],.009,'#9caba4',4);
  }
  disc(w,0,0,.025,.052,P.brass,.065,12);
  return w;
}
export function testBicycle(g) {
  const b=keep(g),wheels=[wheel(b,-.71,.46),wheel(b,.72,.46)];
  const links=[
    [[-.71,.46,0],[-.32,.98,0]], [[-.71,.46,0],[-.02,.48,.01]],
    [[-.32,.98,0],[-.02,.48,.02]],[[-.02,.48,.02],[.50,.94,.02]],
    [[-.30,.87,0],[-.17,.64,0]],[[-.17,.64,0],[.47,.99,0]],
    [[.43,1.06,0],[.72,.46,0]],[[-.32,.98,0],[-.37,1.12,0]],
  ];
  for(const [a,e] of links) beam(b,a,e,.035,P.teal,7);
  beam(b,[.46,.99,0],[.47,1.29,0],.023,P.brass,6);
  beam(b,[.47,1.28,0],[.70,1.38,.04],.026,P.brass,6);
  box(b,.67,1.36,.04,.14,.052,.077,P.dark);
  poly(b,[[-.54,1.09],[-.21,1.075],[-.12,1.11],[-.27,1.16],[-.47,1.16]],.10,'#895837',0,0,-.035);
  ring(b,-.02,.48,.061,.14,.021,P.brass,18);
  const bell=keep(b,.60,1.405,.064);
  const dome=ball(bell,0,.042,0,.071,P.brass,1); dome.scale.set(1,.68,.86);
  box(bell,0,.011,0,.132,.023,.091,P.dark);
  const striker=keep(bell,-.076,.017,.007);
  beam(striker,[0,0,0],[-.048,.067,0],.009,P.dark,5);
  ball(striker,-.048,.068,0,.019,P.bone,1);
  const chimes=keep(bell,0,.074,0); chimes.visible=false;
  for(const [x,y] of [[-.085,.081],[0,.13],[.085,.081]]) beam(chimes,[x*.4,y*.55,0],[x,y,0],.011,'#edce77',4);
  return {wheels,bell,chimes,striker};
}
const hip = [-.35,1.11], upper=.46, lower=.45;
export function testPaper(g) {
  const paper=keep(g);
  paper.name='騎士膝頭的試水紙';
  card(paper,0,-.144,0,.216,.281,'#fff0d2',.016,.012);
  const patch=keep(paper,0,-.004,.020);
  poly(patch,[[-.089,.10],[-.044,.082],[.006,.106],[.081,.079],[.088,-.082],[.026,-.118],[-.024,-.089],[-.070,-.100],[-.092,-.033]],.008,'#3c8196');
  poly(patch,[[-.070,.067],[-.014,.083],[.056,.022],[.034,-.084],[-.015,-.056],[-.050,-.068]],.006,'#35687c',0,0,.009);
  box(paper,0,.125,.040,.086,.035,.010,'#b58b63');
  patch.visible=false;
  return {paper,patch};
}
function pedalLeg(rider, z, rear) {
  const thigh=keep(rider,hip[0],hip[1],z), shin=keep(rider,0,0,z-.004), shoe=keep(rider,0,0,z+.005);
  const color=rear?'#99866d':P.trouser;
  poly(thigh,[[-.075,.025],[.084,.027],[.068,-upper],[-.063,-upper-.012]],.05,color);
  poly(shin,[[-.067,.024],[.063,.030],[.040,-lower],[-.046,-lower]],.047,color);
  poly(shoe,[[-.061,-.012],[-.048,.058],[.045,.079],[.080,.04],[.170,.013],[.177,-.018]],.06,P.ink);
  return {thigh,shin,shoe};
}
export function cycle(legs, angle) {
  legs.forEach((leg,i)=>{
    const a=angle+i*Math.PI;
    const x=-.02+.185*Math.cos(a), y=.48+.185*Math.sin(a);
    const dx=x-hip[0],dy=y-hip[1],length=Math.hypot(dx,dy);
    const along=(upper*upper-lower*lower+length*length)/(2*length);
    const bend=Math.sqrt(Math.max(0,upper*upper-along*along));
    const kx=hip[0]+(dx*along-dy*bend)/length,ky=hip[1]+(dy*along+dx*bend)/length;
    leg.thigh.rotation.z=Math.atan2(kx-hip[0],hip[1]-ky);
    leg.shin.position.x=kx;leg.shin.position.y=ky;leg.shin.rotation.z=Math.atan2(x-kx,ky-y);
    leg.shoe.position.x=x;leg.shoe.position.y=y;
  });
}
export function helmet(g, x, y, z, size=1) {
  const h=group(g);h.position.set(x,y,z);h.scale.setScalar(size);
  poly(h,[[-.19,0],[-.194,.101],[-.128,.206],[-.023,.242],[.12,.209],[.181,.138],[.190,.079],[.248,.055],[.153,.027],[-.121,.077]],.097,'#a8523e');
  poly(h,[[-.137,.153],[-.052,.209],[.023,.217],[-.019,.144],[-.113,.103]],.011,'#d48c65',0,0,.099);
  for(const x of [.037,.096]) beam(h,[x,.168,.106],[x+.024,.143,.106],.012,P.ink,4);
}
export function commuter(g) {
  const rider=keep(g), legs=[pedalLeg(rider,-.11,true),pedalLeg(rider,.11,false)];
  const sample=testPaper(legs[1].thigh);sample.paper.position.set(0,-upper+.065,.081);
  // Her own short slicker ends at the hip. The yellow lap panel later covers the exposed test strip.
  const shortCoat=group(rider);shortCoat.name='小岑原本的短雨衣';
  poly(shortCoat,[[-.525,1.105],[-.478,1.31],[-.34,1.555],[-.15,1.74],[.017,1.705],[.091,1.52],[.120,1.39],[.026,1.305],[-.105,1.125],[-.207,1.095],[-.308,1.14],[-.438,1.075]],.115,'#587d88',0,0,-.008);
  poly(shortCoat,[[-.52,1.111],[-.358,1.502],[-.288,1.529],[-.315,1.203],[-.445,1.087]],.013,'#3f626f',0,0,.110);
  poly(shortCoat,[[-.502,1.154],[-.364,1.183],[-.254,1.15],[-.11,1.179],[-.124,1.147],[-.256,1.122],[-.368,1.151],[-.505,1.125]],.009,'#bbccb9',0,0,.134);
  poly(shortCoat,[[-.36,1.505],[-.285,1.675],[-.186,1.776],[-.10,1.786],[-.101,1.691],[-.178,1.613],[-.272,1.564]],.031,'#8ca5a3',0,0,.125);
  poly(shortCoat,[[-.264,1.583],[-.205,1.7],[-.127,1.743],[-.16,1.667]],.007,'#486d77',0,0,.159);
  poly(rider,[[-.015,1.59],[.082,1.62],[.15,1.43],[.34,1.34],[.55,1.37],[.59,1.32],[.34,1.24],[.067,1.333]],.078,'#72899c',0,0,.115);
  poly(rider,[[.53,1.37],[.64,1.39],[.69,1.35],[.66,1.30],[.55,1.30]],.05,'#966e53',0,0,.14);
  poly(rider,[[-.157,1.69],[-.054,1.86],[.052,1.87],[.107,1.73],[.027,1.63]],.09,'#957358');
  const head=keep(rider,.065,1.74,.01);
  const face=buildOtterPortrait(head).head;
  face.position.set(-.034,.046,.049);
  face.scale.set(.84,.84,.85);
  // The rain test and the later visit share her whisker pads, head pattern and rust-red helmet.
  poly(head,[[-.099,.179],[-.067,.183],[.046,.052],[.083,.051],[.067,.031],[.041,.031]],.009,P.ink,0,0,.154);
  helmet(head,-.029,.278,.029,1.11);
  const worn=keep(rider,0,0,.26);
  poly(worn,[[-.47,1.10],[-.50,1.29],[-.36,1.53],[-.16,1.76],[.018,1.72],[.125,1.51],[.49,1.35],[.50,1.26],[.19,1.28],[.019,1.40],[-.09,1.20],[-.19,1.095]],.046,P.coat);
  poly(worn,[[-.17,1.72],[-.19,1.87],[-.116,1.95],[-.057,1.86],[.052,1.75],[-.01,1.66]],.047,P.light);
  swallow(worn,-.055,1.54,.053,.21);
  // One real paper hinge lifts the hem after the shower so the reader can inspect the knee.
  const hem=keep(worn,-.24,1.33,.054);
  poly(hem,[[-.214,-.13],[-.11,.04],[.16,.15],[.407,.050],[.829,-.180],[.926,-.542],[.75,-.693],[.581,-.62],[.517,-.413],[.075,-.340],[-.191,-.37]],.041,P.coat);
  poly(hem,[[.16,.124],[.39,.041],[.682,-.16],[.85,-.49],[.731,-.58],[.56,-.336]],.009,P.light,0,0,.044);
  poly(hem,[[.073,-.236],[.579,-.311],[.663,-.517],[.86,-.466],[.876,-.514],[.647,-.58],[.542,-.372],[.058,-.291]],.010,P.reflect,0,0,.056);
  beam(hem,[.16,.13,.052],[.54,-.30,.052],.009,'#b77734',4);
  swallow(hem,.57,-.186,.066,.22);
  worn.visible=false;
  cycle(legs,.45);
  return {rider,legs,worn,hem,head,sample};
}

export function rainRig(g) {
  // Low wet platform with parallel trainer rollers, plus one pipe feeding the spray bar.
  box(g,0,.038,.03,2.88,.076,1.25,P.dark);
  box(g,0,.087,.03,2.81,.035,1.19,'#859a94');
  for(let i=0;i<14;i++) box(g,-1.28+i*.197,.110,.046,.14,.012,1.05,i%3?'#97aaa1':'#aab9ab');
  for(const x of [-.81,-.60,.62,.82]) beam(g,[x,.133,-.16],[x,.133,.16],.067,P.ink,12);
  for(const x of [-1.26,1.28]) {
    box(g,x,.155,-.47,.27,.113,.26,P.teal);
    beam(g,[x,.16,-.47],[x,2.47,-.47],.050,P.teal,8);
    beam(g,[x,1.99,-.47],[x*.70,2.44,-.47],.026,P.brass,6);
    ball(g,x,2.48,-.47,.077,P.brass,1);
  }
  beam(g,[-1.29,2.47,-.47],[1.31,2.47,-.47],.06,P.teal,8);
  for(const x of [-.74,.04,.81]) {
    beam(g,[x,2.47,-.48],[x,2.47,.06],.030,P.brass,6);
    beam(g,[x-.25,2.42,.054],[x+.25,2.42,.054],.030,P.dark,6);
  }
  const valve=keep(g,-1.26,.90,-.36);
  ring(valve,0,0,.05,.144,.023,'#ad684b',16);
  for(const a of [0,2.095,4.189]) beam(valve,[0,0,.052],[.138*Math.cos(a),.138*Math.sin(a),.052],.014,P.brass,5);
  disc(valve,0,0,.064,.045,P.brass,.045,10);
  const shower=keep(g),streaks=[];
  for(let col=0;col<10;col++) {
    const x=-.97+col*.216, z=col%3===0?.16:-.14;
    for(let row=0;row<3;row++) {
      const dash=keep(shower,x,0,z);
      beam(dash,[0,0,0],[.018,.17,0],.010,col%2?'#7cb7c6':'#aacfd5',4);
      streaks.push({dash,x,offset:row/3+((col*11)%17)/55});
    }
  }
  const runoffs=keep(g,0,0,.345);
  for(const [x,y] of [[.605,1.03],[.679,.85],[.713,.68]]) {
    const drop=ball(runoffs,x,y,0,.036,'#82bed1',1);drop.scale.set(.65,1.39,.73);
  }
  shower.visible=runoffs.visible=false;
  return {valve,shower,streaks,runoffs};
}

export function orderForm(g) {
  // A single requested item, marked with the same garment and swallow seal as the sample.
  const slip=keep(g); card(slip,0,0,0,.92,.90,'#f7e5c2',.045,.04);
  for(let i=0;i<7;i++) box(slip,-.38+i*.126,.837,.052,.056,.016,.011,'#a5825d');
  const icon=hangingCape(slip);icon.position.set(0,.51,.058);icon.scale.setScalar(.42);
  box(slip,0,.162,.058,.61,.020,.015,P.teal);
  words(slip,'燕尾長擺',0,.084,.062,.101,{color:P.dark,weight:850});
  slip.visible=false; return slip;
}
