// The physical sets in the street book. The new story hinges are mounted onto these models.
import { keep, box, beam, disc, poly, quad } from '../paper.js';
import { streetFigure } from '../cast-prints.js';

const library = () => window.AtlasHarborStock;
const quay = () => window.BreakfastQuay.stock;
const paper = () => window.PaperKit;
const standsCast = ['hare','badger','squirrel','bear','otter','owl'];

function mount(S, node, x, z, size = 1, y = 0) {
  S.plant(x, z, (leaf) => { leaf.add(node); }, { s: size, y });
  return node;
}

function tradeSign(parent, old, text, width, height, colors) {
  const K = paper();
  const sign = K.label(text, width, height, colors);
  sign.position.copy(old.position); sign.quaternion.copy(old.quaternion);
  parent.add(sign); old.removeFromParent();
  return sign;
}

export function quayStock(S, morning) {
  const Q = quay();
  const place = (node, x, z, y = 0) => {
    const leaf = S.plant(x * 1.31, z * 1.52, (g) => { g.add(node); }, { y: y * 1.20 });
    leaf.art.scale.set(1.31, 1.34, 1.52);
  };
  for (const side of [-1, 1]) {
    Q.shoreline({ place }, side);
    Q.hills({ place }, side);
  }
  Q.servingPier({place(node){mount(S,node,morning?2.01:-2.19,morning?-.17:-1.10,1.26,.035);}});
  if (!morning) return;
  const sky = Q.dawn({ place });
  const glints=[];
  S.plant(-1.1,-.73,g=>{
    for(let i=0;i<4;i++){
      const strip=keep(g,.12*Math.sin(i*2),.05,-.40+i*.17);
      quad(strip,[-.23,0,-.019],[.14,0,-.027],[.26,0,.019],[-.12,0,.031],i%2?'#dfb173':'#f5d9a0');
      strip.visible=false;glints.push(strip);
    }
  });
  S.pad(sky.sunrise,.32,[0,1.26,0]);
  S.discovery(sky.sunrise,{id:'sun',label:'晨光在港池的倒影',duration:1.7,aim:[0,1.26,0],
    draw(u,visit){
      const reach=S.T.MathUtils.smoothstep(u,0,.69),lift=visit%2?reach:1-reach;
      sky.sunrise.position.y=.21*lift;
      glints.forEach((strip,i)=>{const lit=S.T.MathUtils.smoothstep(lift,i*.14,i*.14+.48);strip.visible=lit>.02;strip.scale.x=lit*(.9+.23*i);});
    }});
  sky.gantry.name = '啟程港・晨班吊車';
  const fish = Q.harbourMullet({ place });
  let splash = 0;
  S.curio(fish.pool,{id:'mullet',label:'海面下的烏魚',quiet:true,tap:() => {splash=1; S.sound('rain-drop');}});
  S.tick((t,dt)=>{if(splash>0){splash=Math.max(0,splash-dt*.7); fish.set(Math.sin(Math.PI*(1-splash)));}});
  S.on('reset',()=>{splash=0;fish.set(0);});
}

export function ferryHull(ferry) {
  const original = quay().boat({ place:()=>{} });
  // The real rigging and hull are one printed piece. Keep the smoke detached for the horn.
  ferry.add(original.hull,original.wash);
  original.hull.scale.setScalar(1.98); original.hull.name='啟程港・晨班渡輪';
  original.wash.scale.setScalar(1.86);
  original.puffs.forEach(cloud=>ferry.add(cloud));
  return original.puffs;
}

export function originalGull(parent) {
  const {wings} = library().gull();
  const bird=wings[0].parent;
  parent.add(bird); bird.position.set(0,0,0); bird.scale.setScalar(.78);
  return wings;
}

export function teaStall(g) {
  const K=paper();
  const {stall,sign,owner,batch,lid,steam} = quay().market({place:()=>{}},{teaCounter:true});
  owner.person.removeFromParent(); owner.arm.removeFromParent();
  batch.tray.removeFromParent(); sign.removeFromParent(); lid.removeFromParent();
  // A side-handled clay teapot sits behind the cup's clear path to the ferry.
  const pot = K.group();
  const clay='#98573f', clayLight='#af7352', fired='#734939';
  K.at(pot,K.cyl(.14,.154,.045,12,fired),0,.024,0);
  K.at(pot,K.cyl(.25,.14,.145,14,clay),0,.106,0);
  K.at(pot,K.cyl(.22,.25,.107,14,clayLight),0,.232,0);
  K.at(pot,K.cyl(.136,.22,.065,14,clay),0,.316,0);
  K.at(pot,K.cyl(.159,.16,.021,16,fired),0,.349,0);
  K.at(pot,K.cyl(.074,.156,.054,14,clayLight),0,.382,0);
  K.at(pot,K.cyl(.044,.034,.042,12,fired),0,.430,0);
  K.at(pot,K.cyl(.03,.045,.026,12,clayLight),0,.460,0);
  const spout=[[.123,.111],[.24,.117],[.335,.170],[.419,.286],[.493,.389],[.531,.415],
    [.514,.449],[.455,.435],[.387,.345],[.308,.265],[.217,.233],[.139,.230]];
  K.at(pot,K.cut(spout,.076,clayLight,fired),0,0,.012);
  K.at(pot,K.cut([[.451,.435],[.520,.449],[.531,.433],[.461,.418]],.040,fired),0,0,.018);
  const handle=[[-.18,.271],[-.28,.326],[-.368,.297],[-.406,.223],[-.389,.139],[-.327,.085],[-.201,.101]];
  for(let j=1;j<handle.length;j++) pot.add(K.rod([...handle[j-1],.013],[...handle[j],.013],.029,clay));
  const leaf=K.cut([[-.096,.169],[-.045,.224],[.031,.237],[.002,.186],[-.063,.158]],.009,'#d5ab79');
  K.at(pot,leaf,0,0,.242);
  pot.name='側把紫砂茶壺';
  pot.scale.setScalar(1.08);
  K.at(stall,K.assembled(pot,'folio-handmade-yixing'),-.66,.918,.076,-.12);
  steam.forEach((curl,i)=>{curl.position.x=-.17+i*.035;curl.position.z=.111;});
  // The question and the price stay in the book. Only the stall's trade is lettered on the sign.
  const board=K.label('港 口 試 茶',.70,.225,{paper:'#445554',ink:'#f0ddbb'});
  K.at(stall,board,.73,2.078,.551); stall.name='啟程港・試茶攤';
  g.add(stall);
  return steam;
}

export function cameraWorkshop(S,g) {
  const K=paper(), H=library(), studio=H.workshop();
  tradeSign(studio.b,studio.fascia,'港 邊 照 相',1.19,.285,{paper:'#d9c193',ink:'#374d45'});
  studio.bag.removeFromParent(); studio.pocket.removeFromParent();
  studio.hinges[0].rotation.y = -.87; studio.hinges[1].rotation.y = .87;
  studio.b.scale.set(1.04,.83,.83);
  studio.b.name='港邊照相・原木相館'; g.add(studio.b);
  const camera=H.filmStation();
  camera.station.name='相館的雙輪放映機';
  camera.station.scale.setScalar(.79);
  mount(S,camera.station,-4.22,-.16);
  // The little daylight viewer carries its own folding screen and two short reels from the quay.
  for(const reel of camera.reels) reel.userData.keep=true;
  const viewer=keep(camera.station,1.24,.97,.18);
  box(viewer,0,.045,0,1.08,.085,.19,'#8b6e4e');
  const screen=keep(viewer,0,.075,.01);
  box(screen,0,.39,0,1.06,.78,.037,'#5e6355');
  box(screen,0,.39,.024,.956,.662,.018,'#eddaad');
  for(const x of [-.43,.43]) for(let i=0;i<5;i++) box(screen,x,.14+i*.118,.044,.034,.047,.011,'#9e8c6d');
  const ferry=keep(screen,-.10,.34,.050);
  poly(ferry,[[-.22,.017],[.24,.017],[.14,-.074],[-.14,-.074]],.011,'#426c6b');
  box(ferry,-.022,.05,0,.20,.077,.031,'#7d9380');box(ferry,-.068,.122,0,.05,.082,.035,'#a2634b');
  const gull=keep(screen,.04,.47,.052);
  poly(gull,[[-.255,.06],[-.105,.026],[-.014,-.034],[.111,.06],[.241,.09],[.103,.003],[0,-.094],[-.132,-.018]],.011,'#525b5c');
  for(let i=0;i<3;i++) box(screen,(i%2?-.16:.05),.145+i*.045,.044,.22+.086*i,.016,.005,'#8eada0');
  const light=keep(viewer,-.49,.29,-.075);
  poly(light,[[-.04,.16],[-.45,.04],[-.07,-.11]],.012,'#e4bf7a');
  viewer.visible=false;
  S.discovery(camera.station,{id:'studio-projector',label:'輪播港景的雙輪放映機',aim:[0,1.24,.15],duration:1.88,sound:'film-reel',
    draw(u,visit,still){
      const reveal=S.T.MathUtils.smoothstep(u,0,.30), film=S.T.MathUtils.smoothstep(u,.24,.94);
      viewer.visible=true; screen.rotation.x=-(1-reveal)*1.44; light.visible=reveal>.65;
      camera.reels.forEach((reel,i)=>{reel.rotation.z=(still ? .35 : Math.PI*2)*(visit-1+film)*(i?1.08:1);});
      ferry.visible=visit%2===1;gull.visible=!ferry.visible;
      ferry.position.x=-.13+film*.24;ferry.rotation.z=Math.sin(film*Math.PI*2)*.08;
      gull.position.x=-.12+film*.26;gull.position.y=.37+.12*Math.sin(Math.PI*film);
    }});
  // The characteristic brass lens and leather bellows advertise the camera house on its gable.
  const optic=keep(g,-.65,1.345,.66);
  const bellows=K.cut([[-.405,0],[-.36,.37],[-.28,.41],[.38,.41],[.415,.065],[.36,0]],.13,'#405359','#8f8471');
  K.at(optic,bellows,0,0,0);
  for(let i=0;i<4;i++) K.at(optic,K.box(.39,.023,.016,'#68766e'),.14,.094+i*.071,.082);
  const shell = K.cyl(.20,.23,.14,24,'#a48350'); shell.rotation.x=Math.PI/2; optic.add(shell); shell.position.set(-.12,.21,.12);
  const lens=K.cyl(.145,.145,.023,24,'#345460'); lens.rotation.x=Math.PI/2;optic.add(lens); lens.position.set(-.12,.21,.202);
  const dot=K.cyl(.035,.035,.012,12,'#d8cfaa');dot.rotation.x=Math.PI/2;optic.add(dot);dot.position.set(-.165,.255,.221);
  return optic;
}

export function fishingBoat(g) {
  const boat=library().harborBoat((_,i)=>streetFigure(['otter','owl','badger'][i])).boat;
  boat.scale.setScalar(.86); boat.name='照相館碼頭・繫泊船'; g.add(boat);
}

export function paperCloud(parent,width,height,ink) {
  const cloud=paper().cloud(width);
  cloud.scale.y=height/2.35;
  if (ink) {
    cloud.traverse(mesh=>{
      if (!mesh.isMesh) return;
      const tinted=mesh.material.clone();
      tinted.color.set(ink); mesh.material=tinted;
    });
  }
  parent.add(cloud);
  return cloud;
}

export function paperSun(parent,height,radius) {
  const {sunrise}=quay().dawn({place:()=>{}});
  const pivot=keep(parent,0,height,0);
  const s=radius/.36;sunrise.scale.setScalar(s);sunrise.position.y=-1.26*s;
  pivot.add(sunrise);return pivot;
}

export function terrain(S,kind) {
  const K=paper(), H=library();
  const field=kind==='field';
  const adapter={place(node,x,z,y=0){mount(S,node,x*1.27,z*1.37,1.20,y);}};
  H.landscape(adapter,field?['#a6af86','#789779']:['#9fa9a1','#839a86'],-.24);
  for(const [x,z,h,form,seed] of field?
    [[-5.12,-2.07,1.13,'cypress',41],[3.66,-2.88,1.67,'round',17],[5.17,-1.49,1.02,'cypress',18]]:
    [[-4.90,-2.2,1.72,'round',29],[4.77,-2.7,1.83,'cypress',36],[2.25,-2.78,1.18,'round',13]]) {
    mount(S,K.tree(form,h,seed),x,z);
  }
  for (const [x,z,h] of field?[[-4.75,.14,.39],[4.70,.74,.32]]:[[-4.89,-.94,.49],[4.77,-.91,.52]]) {
    mount(S,H.reedBed(h,!field),x,z);
  }
}

export function fieldStand(g) {
  const K=paper(), H=library(), stand=H.bleachers((_,__,seat) => {
    const person = streetFigure(standsCast[seat % standsCast.length]);
    person.scale.setScalar(.41);
    return person;
  }), score=stand.score;
  // Reuse the home stand for an individual event. Its old team scores give way to the competitor's bib.
  score.children.filter(p=>p.material?.transparent && p.material.map).forEach(label=>label.removeFromParent());
  K.at(score,K.label('田 徑 運 動 場',1.49,.23,{paper:'#366553',ink:'#fcf0cd'}),0,.485,.064);
  K.at(score,K.label('標 槍  ·  105 歲 選 手',1.54,.24,{paper:'#366553',ink:'#f4d59b'}),0,.205,.064);
  stand.b.scale.set(1.12,.94,1.01); stand.b.name='運動場・原木紙雕看台';
  g.add(stand.b);
  return stand;
}
export function stadiumDrum(g) {
  const result=library().paradeDrum();
  g.add(result.drum); result.drum.scale.setScalar(.83); return result;
}

export function rainShop(g) {
  const K=paper(), H=library(), arcade=H.platform();
  tradeSign(arcade.b,arcade.fascia,'修 傘 · 奉 茶',1.23,.32,{paper:'#405e51',ink:'#f1dfb8'});
  arcade.chairGrip.position.x=-.83;
  // The former u-shaped depot counters become the umbrella repairer's covered counter.
  for(const x of [-.49,.25,.82]) {
    K.at(arcade.b,K.box(.519,.71,.09,'#748b78'),x,.74,-.29);
    for(const dx of [-.18,0,.18]) K.at(arcade.b,K.box(.027,.7,.024,'#b8996b'),x+dx,.74,-.229);
  }
  const umbrella1=H.umbrella('#ae573f');umbrella1.rotation.z=-.23;umbrella1.scale.setScalar(.8);K.at(arcade.b,umbrella1,-.78,.30,.05);
  const umbrella2=H.umbrella('#557b78');umbrella2.rotation.z=.19;umbrella2.scale.setScalar(.72);K.at(arcade.b,umbrella2,.79,.30,-.07);
  const counter=K.cut([[-.59,.26],[.62,.26],[.62,.75],[.55,.80],[-.52,.78],[-.60,.72]],.20,'#9a7255','#d2b28b');
  K.at(arcade.b,counter,.02,0,.35);
  K.at(arcade.b,K.box(1.34,.061,.49,'#d3b58b'),.03,.815,.39);
  arcade.b.name='雨傘屋・拱廊茶檯'; arcade.b.scale.set(.74,.64,.78);g.add(arcade.b);
  return arcade.b;
}
