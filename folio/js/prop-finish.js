// Patterns for the objects the reader handles. These joins sit on the original
// moving pieces. They merge into the same coloured paper stocks as the puppets.
import { cyl, poly, quad, slab, tri, raincoatPaper } from './paper.js';

const BONE='#f4e2b9', EDGE='#e6cda0', KRAFT='#bc9366', TEAL='#4f7772', INK='#514840';

function facet(g, points, color, z, depth=.009) {
  return poly(g,points,depth,color,0,0,z);
}
function rim(g, outer, inner, y, color, start=0, end=Math.PI*2, n=16, squash=1) {
  const point=(r,a)=>[r*Math.cos(a),y,squash*r*Math.sin(a)];
  for(let i=0;i<n;i++){
    const a=start+(end-start)*i/n,b=start+(end-start)*(i+1)/n;
    quad(g,point(outer,a),point(outer,b),point(inner,b),point(inner,a),color);
  }
}
function sleeve(g, upperRadius, lowerRadius, high, low, ink, fold, sides=12) {
  const at=(r,y,a)=>[r*Math.cos(a),y,r*Math.sin(a)];
  for(let i=0;i<sides;i++){
    const a=i*Math.PI*2/sides,b=(i+1)*Math.PI*2/sides;
    const topA=at(upperRadius,high,a),topB=at(upperRadius,high,b);
    const bottomA=at(lowerRadius,low,a),bottomB=at(lowerRadius,low,b);
    tri(g,topA,bottomA,topB,ink);
    tri(g,bottomA,bottomB,topB,i===Math.floor(sides/4)?fold:ink);
  }
}
// A split impression leaves the paper of the wall showing between palm creases.
export function printPalm(g, color, scale) {
  g.name='留在牆上的手印';
  const outline=[[-.061,-.057],[-.036,-.084],[.021,-.085],[.059,-.065],[.074,-.027],
    [.091,.076],[.096,.134],[.086,.150],[.073,.145],[.058,.083],[.050,.082],[.057,.170],
    [.052,.193],[.039,.202],[.028,.191],[.020,.091],[.012,.093],[.008,.193],[-.003,.213],
    [-.018,.214],[-.027,.199],[-.029,.097],[-.037,.091],[-.043,.167],[-.055,.182],
    [-.069,.178],[-.074,.162],[-.063,.077],[-.069,.053],[-.110,.080],[-.129,.077],
    [-.137,.063],[-.128,.046],[-.083,.007]];
  const scaled=points=>points.map(([x,y])=>[x*scale,y*scale]);
  facet(g,scaled(outline),color,.003,.007);
  facet(g,scaled([[-.059,.025],[-.015,-.008],[.014,-.019],[-.014,0]]),'#eddfb9',.011,.002);
  facet(g,scaled([[.057,.037],[.051,.007],[.035,-.025],[.045,-.018]]),'#eddfb9',.011,.002);
}

function tastingCup(g) {
  // The sleeve overlaps itself, with a thumb-sized triangular flap.
  sleeve(g,.125,.112,.203,.097,TEAL,'#88a495');
  rim(g,.145,.122,.307,BONE,0,Math.PI*2,12);
}
function tastingSlip(g) {
  facet(g,[[-.199,-.011],[.197,-.011],[.200,.305],[.16,.322],[-.198,.318]],EDGE,-.016,.013);
  facet(g,[[.117,.300],[.184,.299],[.183,.226]],'#cdb68c',.016);
  facet(g,[[.119,.300],[.181,.297],[.152,.269]],BONE,.024);
}
function photo(g) {
  facet(g,[[-.303,-.356],[-.299,.311],[.302,.314],[.306,-.360],[.142,-.357],[-.053,-.366]],BONE,-.013,.012);
  for(const s of [-1,1]) {
    const top=s<0?.304:-.335;
    facet(g,[[s*.296,top],[s*.153,top],[s*.293,top+s*.126]],'#a08362',.066);
    facet(g,[[s*.292,top],[s*.190,top],[s*.292,top+s*.092]],'#d9bb88',.077);
  }
}
function javelin(g) {
  // Both faces comprise one folded strip. A wide red paper grip reads from the book view.
  facet(g,[[-.91,-.019],[-.83,-.047],[.68,-.034],[.84,0],[.70,.023],[-.82,.046]],BONE,-.010,.014);
  facet(g,[[-.88,-.011],[.73,-.008],[.67,-.031],[-.82,-.033]],'#b6a58b',.018,.007);
  facet(g,[[-.222,.043],[.091,.042],[.089,-.037],[-.219,-.044]],'#ad523f',.031);
  for(const x of [-.156,-.026])facet(g,[[x-.023,-.040],[x+.015,-.038],[x+.045,.039],[x+.011,.04]],'#dfab76',.042,.005);
}
function raincoat(g) {
  const edge=[[-.184,.51],[-.386,.410],[-.581,.044],[-.424,-.101],[-.324,-.015],
    [-.451,-.555],[-.278,-.679],[-.005,-.615],[.250,-.678],[.449,-.571],[.342,-.017],
    [.427,-.104],[.574,.020],[.389,.408],[.175,.506]];
  facet(g,edge,BONE,-.020,.016);
  // A raised flap sheds water over the pocket mouth.
  facet(g,[[-.276,-.178],[-.107,-.159],[-.121,-.248],[-.258,-.264]],raincoatPaper.shade,.087);
  facet(g,[[-.278,-.167],[-.106,-.149],[-.149,-.205],[-.259,-.220]],raincoatPaper.light,.100);
}
function tofuPan(g) {
  rim(g,.367,.340,.207,EDGE);
  // On a small wok two tabs are easier to see than two thin wire circles.
  for(const side of [-1,1]){
    const tab=[ [.29,.143],[.37,.237],[.48,.230],[.50,.155],[.46,.118],[.333,.106] ];
    const scale=(pts)=>pts.map(([x,y])=>[side*x,y]);
    facet(g,scale(tab),BONE,-.010,.034);
    facet(g,scale([[.32,.148],[.382,.212],[.460,.207],[.478,.152],[.449,.133],[.36,.125]]),INK,.026,.015);
    facet(g,scale([[.366,.156],[.395,.186],[.444,.185],[.448,.161]]),'#aa8862',.044,.005);
  }
}
function paintBrush(g) {
  facet(g,[[-.036,.006],[-.042,.389],[-.064,.545],[.048,.557],[.034,.302],[.033,.017],[.012,-.010]],BONE,-.024,.016);
  facet(g,[[-.040,.551],[-.083,.604],[-.084,.757],[-.103,.850],[-.067,.830],[-.040,.858],
    [-.005,.832],[.028,.861],[.086,.840],[.087,.610],[.054,.555]],'#d6b788',-.025,.014);
  facet(g,[[-.084,.746],[.082,.756],[.084,.838],[.027,.859],[-.010,.834],[-.039,.858],[-.065,.829],[-.095,.846]],'#ba604b',.040);
  facet(g,[[.027,.749],[.058,.751],[.057,.831],[.029,.855]],'#d98d6e',.050);
}
function teaTray(g) {
  const shape=[[-.315,-.11],[-.254,-.146],[.255,-.146],[.316,-.080],[.309,.073],[.249,.147],[-.245,.147],[-.315,.082]];
  slab(g,shape,.026,KRAFT,-.004);
  slab(g,shape.map(([x,z])=>[x*.92,z*.82]),.009,BONE,.024);
  const cups=g.children.filter(c=>c.userData.keep&&!c.userData.pad);
  cups.forEach((cup,i)=>{
    const tint=i?'#547f76':'#ba715d';
    cyl(cup,0,.076,0,.076,.055,.127,BONE,10);
    cyl(cup,0,.144,0,.071,.071,.012,i?'#9d9465':'#a66f4e',10);
    rim(cup,.078,.069,.151,BONE,0,Math.PI*2,10);
    sleeve(cup,.074,.065,.111,.047,tint,i?'#819f88':'#d99b7e',10);
  });
}
function littleTeapot(g) {
  facet(g,[[.067,.069],[.118,.079],[.191,.158],[.220,.159],[.223,.183],[.165,.185],[.104,.133],[.061,.124]],EDGE,-.018,.023);
  facet(g,[[.102,.083],[.153,.126],[.175,.165],[.195,.165],[.155,.108]],'#bb9865',.013);
}
function servingWheel(g) {
  // A turned-over paper lip gives the fingers a place to catch the rotating platter.
  for(const angle of [.12,Math.PI+.12]){
    rim(g,.763,.707,.048,BONE,angle,angle+1.70,8);
    rim(g,.763,.739,.055,'#b69b82',angle+.10,angle+.49,3);
  }
  const nose=[[.48,.51],[.65,.42],[.78,.50],[.69,.628],[.57,.636]];
  slab(g,nose,.021,EDGE,.047);
  slab(g,[[.558,.530],[.644,.479],[.724,.512],[.675,.585]],.012,'#ad624d',.067);
  slab(g,[[.644,.479],[.724,.512],[.686,.528]],.006,'#d39971',.080);
  // The inside already carries the forty dishes. The reverse has a coloured
  // binding and, at quarters, a fish-shaped printer's mark when the menu turns.
  const leaves=g.children.map(child=>child.userData.lean).filter(Boolean);
  leaves.forEach((leaf,i)=>{
    facet(leaf,[[-.082,.217],[.081,.217],[.081,.235],[-.082,.235]],'#ab614e',-.021,.006);
    if(i%10)return;
    facet(leaf,[[-.058,.130],[-.029,.152],[.017,.153],[.043,.133],[.066,.151],
      [.065,.103],[.042,.121],[.017,.104],[-.028,.105]],TEAL,-.024,.006);
  });
}
function lionHem(g) {
  const y=g.name==='獅布前幅'?.35:.28;
  facet(g,[[-.363,.038],[-.155,.065],[.036,.026],[.196,.078],[.379,.060],
    [.325,-.004],[.145,-.032],[.034,-.112],[-.069,-.035],[-.248,-.013]].map(([x,h])=>[x,h+y]),BONE,.349,.014);
  facet(g,[[.032,-.098],[.104,.025],[.196,.066],[.146,-.020]].map(([x,h])=>[x,h+y]),'#c39a65',.366);
}
function watermelonPlug(g) {
  facet(g,[[-.149,.089],[.147,.084],[.002,-.159]],BONE,-.003,.015);
  facet(g,[[.118,.067],[.143,.080],[.002,-.148],[.019,-.094]],'#a7ad78',.020);
  // A red side facet appears only as the customer pulls the wedge out.
  quad(g,[.12,.070,-.073],[0,-.128,-.073],[.002,-.130,.005],[.12,.073,.005],'#c16b5b');
}
function indigo(g) {
  const {width:w,length:h}=g.userData.loom,x=w/2,y=-h;
  facet(g,[[-x-.012,.004],[-x-.016,y+.037],[-x*.6,y+.011],[x*.31,y-.023],[x+.013,y+.021],
    [x+.016,-.049],[x,.013]],BONE,-.025,.013);
  // The turned selvage shows the unprinted reverse even after the dye climbs the cloth.
  facet(g,[[x-.159,y+.013],[x+.005,y+.235],[x+.019,y+.034],[x-.034,y-.013]],'#c7bba5',.053);
  facet(g,[[x-.154,y+.016],[x+.004,y+.235],[x-.035,y+.043]],BONE,.064);
}
function lantern(g) {
  // Wrap tissue over two bamboo ribs. Leave the centre of each lit face clear for the wishes.
  const b=.42,t=.56,h=1.60,peak=h+.20;
  for(const s of [-1,1]){
    const a=[s*b,0,b+.009],c=[s*t,h,t+.009];
    quad(g,a,[s*(b-.036),0,b+.012],[s*(t-.043),h,t+.011],c,'#ead0a2');
  }
  tri(g,[-t,h,t],[0,peak+.006,0],[-t+.173,h,t+.006],'#efd6a8');
  tri(g,[-t+.10,h,t+.011],[-t+.174,h,t+.011],[0,peak+.014,0],'#c9ac8e');
  // The lower concertina fold appears at one corner, clear of the pasted wishes.
  const front=(x,y)=>[x,y,b+(t-b)*y/h+.014];
  tri(g,front(-b+.043,.02),front(-.18,.028),front(-.39,.50),'#c5aa84');
  tri(g,front(-.281,.028),front(-.18,.028),front(-.39,.50),'#e0c59a');
}
function wishPaper(g) {
  facet(g,[[-.184,-.014],[-.183,.261],[-.15,.277],[.177,.272],[.190,.015],[.157,-.010]],EDGE,-.015,.011);
  facet(g,[[.091,.258],[.171,.258],[.170,.181]],'#c8ad87',.016);
  facet(g,[[.094,.258],[.171,.259],[.137,.226]],BONE,.026);
}
// Props like the javelin and the lantern move independently of their input handles.
// Named art below is attached to the visible hinge; invisible hit targets keep their original size.
const byName={
  '遞到手中的試飲杯':tastingCup, '相館的相紙':photo, '擲遠的紙標槍':javelin,
  '模擬市場的試味茶壺':littleTeapot, '獅布前幅':lionHem, '獅布後幅':lionHem,
  '工房的展示布':indigo, '起飛的天燈紙囊':lantern,
};
const byScene={
  1:{slip:tastingSlip}, 4:{poncho:raincoat}, 5:{wok:tofuPan}, 6:{brush:paintBrush},
  7:{tray:teaTray}, 8:{tt:servingWheel}, 10:{plug:watermelonPlug}, 12:{wish:wishPaper},
};
export function finishFolioProps(S) {
  const pieces=[];
  S.spread.group.traverse(node=>{if(Object.hasOwn(byName,node.name))pieces.push(node);});
  for(const node of pieces)byName[node.name](node);
  const treatments=byScene[S.index];
  if(treatments)for(const item of S.props)treatments[item.id]?.(item.node);
}
