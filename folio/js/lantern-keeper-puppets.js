// The lantern keepers share their physical die cuts with the private portrait studio.
import { T, tri } from './paper.js';
import { puppetPaper } from './puppet-paper.js';

const {at,folded,ink,line,pip,eyes}=puppetPaper;
const paper='#ecdbb8', charcoal='#3e3835';
const points=path=>typeof path==='string' ? path.split(' ').map(p=>p.split(',').map(Number)) : path;
const mirror=(path,side)=>points(path).map(([x,y])=>[x*side,y]);

function patch(g,path,color,shade,z=0,edge=.54,crease=[0,.08]) {
  folded(g,path,color,z,{shade,edge,crease,depth:1.25});
}

// Head, back and tail use a coloured folded gusset. Only the thin lip shows the paper core.
function shell(g,path,color,shade,z=0,depth=7,crease=[0,.08]) {
  const front=points(path), n=front.length;
  const center=front.reduce(([x,y],[a,b])=>[x+a/n,y+b/n],[0,0]);
  const back=front.map(([x,y])=>[center[0]+(x-center[0])*.80,center[1]+(y-center[1])*.83]);
  const a=front.map(([x,y])=>[x/100,y/100,(z-.73)/100]), b=back.map(([x,y])=>[x/100,y/100,(z-depth)/100]);
  for(let i=0;i<n;i++){
    const j=(i+1)%n;tri(g,a[j],a[i],b[i],shade);tri(g,b[i],b[j],a[j],shade);
  }
  ink(g,back,shade,z-depth-.2,.3);
  folded(g,front,color,z,{shade,crease,edge:.86,depth:.82});
}

function eyePaper(head,x,y,rx,ry,col=paper) {
  const ring=pip(head,x,y,7.12,rx,col,14);ring.scale.z=ry/rx;
}

const handStock={
  dog:{shaft:'#b2865d',back:'#96714f',mitt:'#ac8059',rim:'#8b694d',finger:'#c2986d'},
  pangolin:{shaft:'#9f8569',back:'#806e5e',mitt:'#bba084',rim:'#8b7563',finger:'#e8ce9e'},
  glider:{shaft:'#b27655',back:'#8b5747',mitt:'#96674e',rim:'#805944',finger:'#d6ab84'},
  moorhen:{shaft:'#566469',back:'#414e52',mitt:'#58676a',rim:'#435154',finger:'#8a9891'},
  gecko:{shaft:'#a19680',back:'#857d6b',mitt:'#b8ac91',rim:'#8c816f',finger:'#d1bf9e'}
};

function grippingPalm(g,kind,side,digits) {
  const h=handStock[kind];
  if(kind==='moorhen'){
    patch(g,mirror('-4,-2 -4,3 -1,6 2,6 3,4 1,2 5,3 6,2 4,.2 1,0 3,-2 2,-3 -1,-2 -3,-4',side),h.mitt,h.rim,1,.41);
    ink(g,mirror('-3,1.5 -1,3 2.8,2.5 3.2,1.1 1.5,0 -.6,.2 -2,-.8',side),h.finger,5.55);
  }else if(kind==='gecko'){
    patch(g,mirror('-4,-5 -5,-2 -4,2 -2,4 0,4 2,3 3,1 3,-2 1,-4 -1,-6',side),h.mitt,h.rim,1.4,.4);
    for(const [x,y,ex,ey] of [[-2,2,-4.5,5.6],[.05,2.3,1.3,6],[1.7,.7,4.6,3.6],[1.3,-1.2,5.15,.35]]){
      line(g,x*side,y,ex*side,ey,5.25,.84,h.mitt);pip(g,ex*side,ey,5.75,1.42,h.finger,8);
    }
    line(g,-2.4*side,.25,.9*side,-.8,5.65,.79,h.finger);
  }else if(kind==='pangolin'){
    patch(g,mirror('-4,-4 -5,0 -4,4 -1.5,5 1,4.5 3,3 4,.6 2,-2 -1,-3.4',side),h.mitt,h.rim,1.6,.41);
    for(const [x,y] of [[-2.0,2.65],[.25,1.2],[1.4,-1.15]]) {
      const hinge=at(g,x*side,y,0);
      const stock=at(hinge,-x*side,-y,0);
      patch(stock,mirror([[x,y],[x+2.2,y+.3],[x+3.6,y-.8],[x+4,y-3.05],[x+2.6,y-2.15],[x+1,y-1.1]],side),h.finger,'#c9ae85',5.1,.16);
      digits.push(hinge);
    }
  }else{
    patch(g,mirror('-4,-4.8 -5,-1 -4.3,2.5 -2.3,4.5 .3,4.3 2.6,2.9 3.7,.4 2.9,-2 1.3,-4 -1,-4.6',side),h.mitt,h.rim,1.6,.45);
    patch(g,mirror('-3.5,2.5 -1.8,3.2 1.4,2.6 2.3,1.1 1.2,.25 -.7,.75 -2.1,.15 -3.8,.8',side),h.finger,h.mitt,5.20,.19);
    ink(g,mirror('-2.9,-1 -.6,-.4 1.6,-1.2 1.6,-2.1 -.4,-1.6 -2.6,-1.8',side),h.finger,5.68);
  }
  return at(g,0,.26,4.6);
}

// Each forearm and upper arm is a separately cut length. The cords use the pin
// within the palm, so a change to a shoulder angle carries the rope endpoint too.
function reachingArm(g,kind,side,shoulderAt,bend,wrist) {
  const h=handStock[kind];
  const angle=(u,v)=>Math.atan2(v[0]-u[0],u[1]-v[1]);
  const span=(u,v)=>Math.hypot(v[0]-u[0],v[1]-u[1]);
  const upper=span(shoulderAt,bend),lower=span(bend,wrist);
  const shoulder=at(g,...shoulderAt),elbow=at(shoulder,0,-upper,1.2);
  const a=angle(shoulderAt,bend),b=angle(bend,wrist);
  shoulder.rotation.z=a;elbow.rotation.z=b-a;
  const width={dog:4.6,pangolin:5.8,glider:4.5,moorhen:5.9,gecko:3.9}[kind];
  function segment(node,L,forearm){
    const w=width*(forearm?.78:1);
    const path=[[-w*.70,2.5],[w*.41,3.3],[w,1],[w*1.14,-L*.36],[w*.60,-L-.5],[-w*.50,-L-1],[-w*.92,-L*.78],[-w,-L*.31]];
    if(kind==='moorhen'){
      path.splice(5,0,[w*.08,-L-3.8],[-w*.23,-L-1.7],[-w*.57,-L-3.5]);
      patch(node,path,h.shaft,h.back,1,.55);
      ink(node,[[-w*.72,-L*.14],[-w*.06,-L*.36],[w*.66,-L*.25],[w*.54,-L*.45],[-w*.21,-L*.68],[-w*.14,-L*.54],[-w*.67,-L*.61]],forearm?'#728184':'#68797d',3.35);
    }else if(kind==='pangolin'&&!forearm){
      patch(node,path,h.shaft,h.back,1,.63);
      patch(node,[[-w*.95,-1],[w*.35,1.5],[w*.87,-1.8],[w*.49,-L*.48],[-w*.27,-L*.61],[-w*.92,-L*.42]],'#ac9071','#90775e',3.0,.31);
    }else{
      patch(node,path,h.shaft,h.back,1,.55);
      if(kind==='gecko')ink(node,[[-w*.65,-L*.41],[-w*.18,-L*.36],[w*.34,-L*.50],[w*.47,-L*.69],[-w*.13,-L*.61]],'#c1b399',3.45);
      if(kind==='dog'&&!forearm)ink(node,[[-w*.83,1],[w*.5,2],[w*.94,-2.6],[w*.75,-5.2],[-w*.67,-5.6],[-w*.90,-3.7]],'#50637a',3.45);
    }
  }
  segment(shoulder,upper,false);segment(elbow,lower,true);
  const palm=at(elbow,0,-lower,2.9);
  palm.rotation.z=-b+side*.08;
  const digits=[],grip=grippingPalm(palm,kind,side,digits);
  grip.name=(side<0?'左':'右')+'前爪的握點';
  return {arm:shoulder,elbow,wrist:palm,grip,digits,side};
}

function groundPaw(g,x,y,z,col,shade,foot,side,slim=false) {
  const leg=at(g,x,y,z),w=slim?3.5:5.5;
  patch(leg,mirror([[-w,1],[-w*.57,3.4],[w*.57,3.4],[w,0],[w*.75,-y*.55],[w*.42,-y*.85],[-w*.69,-y*.87],[-w*.90,-y*.48]],side),col,shade,0,.62);
  patch(leg,mirror([[-w*.63,-y+7.1],[w*.48,-y+7.0],[w*.80,-y+4.0],[w*1.7,-y+2.7],[w*1.86,-y+1.0],[w*1.56,-y+.13],[-w*.62,-y+.13],[-w*.92,-y+1.55]],side),foot,shade,1.4,.51);
  return leg;
}

function looseScale(g,x,y,w,h,color,shade,z,tilt=0) {
  const path=[[-.90,.20],[-.45,.52],[.21,.61],[.82,.46],[1,.07],[.67,-.31],[.02,-.70],[-.56,-.42],[-.87,-.10]];
  const c=Math.cos(tilt),s=Math.sin(tilt);
  const contour=path.map(([a,b])=>[x+a*w*c-b*h*s,y+a*w*s+b*h*c]);
  patch(g,contour,color,shade,z,.34,[x,.04]);
}

function pangolin(g) {
  const hide='#aa9276',shadow='#86735f',scale='#a48a68',scaleShade='#826d56',sage='#506b59';
  const tail=at(g,10,34,-5);tail.name='覆著大片甲瓦的錐形長尾';
  shell(tail,'-10,10 -2,17 9,17 18,12 27,3 39,-8 48,-13 59,-16 65,-17 61,-20 50,-21 36,-19 23,-15 12,-9 3,-3 -6,-2',scale,scaleShade,0,8,[12,.06]);
  for(const [x,y,w,h,r] of [[8,8,10,11,-.3],[20,0,9,10,-.42],[31,-7,8,8,-.43],[41,-12,7,6,-.32],[50,-15,5,4,-.20],[57,-17,3.3,3,-.2]])
    looseScale(tail,x,y,w,h,'#b49974','#8e795d',2.7,r);
  const body=at(g);
  shell(body,'-26,47 -26,59 -22,70 -15,78 -6,84 5,86 15,82 23,75 29,63 31,48 27,38 19,31 12,24 1,19 -10,20 -17,26 -21,35',hide,shadow,.75,12,[4,.10]);
  for(const [r,row] of [[[15,40,10,10],[23,49,9,11],[21,59,10,11]],[[8,46,10.5,11],[12,58,10.8,11.3],[14,71,10.1,9.3]],[[0,53,9.65,10.5],[-1,65,10,10.6],[2,77,10.5,9.6]],[[-12,61,9,10.3],[-11,73,9.3,9.4]]].entries())
    for(const [x,y,w,h] of row)looseScale(body,x,y,w,h,r%2?'#ae9675':'#b79e7a',scaleShade,3.05+r*.31,-.20);
  patch(body,'-17,60 -14,69 -11,68 -8,57 -3,53 3,53 6,47 8,27 5,22 -11,22 -17,26 -20,39 -20,50',sage,'#405844',5.7,.59,[-8,.05]);
  ink(body,'-17,40 -5,39 5,41 5.5,37 -6,35 -17,36','#8d9574',8.13);
  for(const [x,top] of [[-10,48],[-7,52]]){
    line(body,x,37,x+1,top,8.45,.68,'#cbb58a');
  }
  const head=at(g,-14,62.7,3.1);
  shell(head,'-38,10 -34,15 -26,18 -19,22 -16,28 -9,34 0,37 9,36 15,31 20,26 22,19 17,13 13,7 8,3 -2,1 -13,3 -24,4 -34,5 -40,7',
    hide,shadow,2,8.4,[-8,.14]);
  looseScale(head,6,32,9,7.2,'#b39c7b','#938066',3.85,-.14);
  looseScale(head,13,26,7.15,6.7,'#ad9571','#8b775d',4.00,-.26);
  patch(head,'-37,11 -31,13 -22,14 -13,16 -5,16 3,13 9,13 13,15 11,9 3,6 -8,5 -18,6 -29,7 -36,7.3',
    '#d1b18b','#bb9978',4.7,.26,[-14,.04]);
  ink(head,'-40,9 -37,11.15 -33.7,10.8 -33.0,9.4 -36.0,7.4 -39.0,7.4',charcoal,7.44);
  ink(head,'-32,7.8 -24,8.7 -18,9.5 -12.5,11.5 -15.5,9.3 -23.8,7.7 -30.3,7.1','#80654e',7.45);
  eyePaper(head,-10.3,22.0,4.25,3.9,'#ebd6ad');
  ink(head,'-15.3,25.3 -12.7,27.0 -8.8,27.1 -6.8,26.0 -10.0,26.4 -13.5,25.7',scaleShade,7.48);
  const legs=[groundPaw(g,-12,28,-1.1,hide,shadow,'#766c59',-1),groundPaw(g,10,28.5,1.0,hide,shadow,'#766c59',1)];
  const arms=[reachingArm(g,'pangolin',-1,[-17.0,55.5,3.65],[-37.0,51.6],[-56.0,62.4]),reachingArm(g,'pangolin',1,[11.7,59,4.7],[26.6,64.1],[31.3,82.0])];
  return {head,eyes:eyes(head,[[-11.9,22.3,2.66]],22.1),mouth:at(head,-29.9,8.8,8.2),tail,arms,legs};
}

function glider(g) {
  const russet='#a4664e',shade='#805341',fur='#bc8a66',face='#ecdbb6';
  const tail=at(g,7,27,-6);tail.name='白面鼯鼠的寬扁平衡尾';
  shell(tail,'-7,7 0,14 13,17 23,23 28,33 29,47 27,55 32,52 39,44 44,33 43,22 39,14 31,7 21,2 11,-1 -3,-2',
    '#aa7055',shade,0,8.5,[25,.06]);
  ink(tail,'7,9 20,12 29,19 34,29 34,39 32,46 37,40 39,29 36,20 28,12 16,7',fur,2.65);
  const membranes=[[-12,18],[12,18]].map(([x,y])=>{
    const hinge=at(g,x,y,-1.7);
    return {hinge,stock:at(hinge,-x,-y,0)};
  });
  // Wrist to ankle on each side. The sloping belly of each membrane stays
  // visible between the raised, sleeved arm and the body, like a cloth sail.
  patch(membranes[0].stock,'-41,81 -31,76 -23,70 -14,66 -9,56 -9,39 -12,18 -17,23 -24,31 -29,42 -33,55 -37,69',
    '#b77b60','#965d4d',.4,.60,[-26,.10]);
  ink(membranes[0].stock,'-32,71 -26,54 -20,38 -14,25 -18,37 -22,49 -25,58','#cf9a74',2.64);
  patch(membranes[1].stock,'12,18 9,37 8,60 12,66 17,72 23,81 30,96 29,79 25,61 23,48 19,34 17,24',
    '#b07258','#8f5547',.45,.66,[18,-.06]);
  ink(membranes[1].stock,'29,87 25,66 22,51 16,31 19,49 23,67','#cb906f',2.63);
  const body=at(g);
  shell(body,'-15,63 -12,76 -5,82 5,82 13,74 17,63 16,49 18,38 13,27 4,22 -6,22 -14,28 -19,39 -18,50',russet,shade,.7,9,[0,.08]);
  patch(body,'-9,68 -4,75 4,76 9,67 10,54 7,40 2,34 -4,35 -9,41 -12,53',
    '#dcbd95','#c8a47d',3.15,.38,[1,.10]);
  patch(body,'-12,73 -7,75 -4,71 -4,63 2,53 4,46 1,43 -4,47 -12,53 -16,59 -16,66',
    '#846b67','#695b5b',4.4,.41,[-8,.06]);
  patch(body,'9,71 13,71 16,63 16,55 12,50 10,45 7,44 5,47 9,58',
    '#846b67','#695b5b',4.4,.41,[10,.04]);
  ink(body,'-9,69 -6,70 -3,63 5,53 11,48 10,45 6,47 -1,55 -7,62','#c9aa78',6.65);
  ink(body,'10,68 12,67 10,61 5,54 -2,47 -4,48 2,55 7,62','#ceb484',6.67);
  const head=at(g,-4,72,2.3);
  patch(head,'-23,28 -27,33 -28,41 -25,47 -21,48 -16,42 -14,36',russet,shade,.65,.69);
  patch(head,'7,34 8,43 13,51 18,53 22,50 23,45 21,36 17,30',russet,shade,.72,.69);
  shell(head,'-29,17 -28,26 -23,34 -14,38 -7,42 2,44 12,41 20,34 24,26 22,18 25,12 20,12 16,7 11,8 6,2 -2,1 -12,2 -24,6 -29,11 -32,13',fur,shade,2,8.6,[-3,.05]);
  patch(head,'-30,17 -26,26 -21,32 -14,33 -8,33 -2,37 7,38 14,35 17,29 18,23 16,18 21,14 15,14 12,10 8,11 4,5 -2,3 -12,4 -22,7 -26,11 -30,12',
    face,'#d6c4a1',3.3,.34,[0,.04]);
  ink(head,'8,39 13,43 16,48 19,49 19,43 15,37','#c99a80',4.77);
  eyePaper(head,-20.2,23.2,4.7,5.0,'#b68c65');eyePaper(head,-1.2,24.2,7.05,7.40,'#be9065');
  ink(head,'-9,29.9 -5.7,33.3 -.3,34.3 4.9,32.0 6.4,30.1 2.5,31.7 -.4,31.9 -5,30.9','#946c54',7.54);
  ink(head,'-29.6,15.5 -27.2,17.2 -22.4,17.0 -19.5,15.5 -21.6,13.2 -25,12.6 -27.9,13.2','#755449',7.8);
  ink(head,'-24.6,11.3 -22,10.5 -16.6,10.7 -12.4,12.5 -14,10.2 -19.4,9.0 -23.4,9.5','#96715a',7.81);
  const legs=[groundPaw(g,-10.1,26,-1.35,russet,shade,'#845e4d',-1,true),groundPaw(g,8.3,25.5,1.0,russet,shade,'#845e4d',1,true)];
  const arms=[reachingArm(g,'glider',-1,[-13.3,66,3.6],[-28.3,67.6],[-40.7,81.7]),reachingArm(g,'glider',1,[13.0,68.0,4.4],[22.5,78.0],[30.1,96.6])];
  return {head,eyes:eyes(head,[[-21.2,23.2,3.65],[-3,24.4,5.2]],24),mouth:at(head,-19,10.5,8.4),tail,arms,legs,membranes};
}

export { patch, shell, eyePaper, groundPaw, reachingArm, mirror, pangolin, glider };

// The wrist pins remain at their cut positions. Ropes and the brush meet the little
// pocket between the fingertips, even after the shoulder and elbow have been posed.
export function keeperRig(pattern) {
  const {arms,membranes}=pattern;
  const rest=arms.map(({arm})=>arm.rotation.z);
  const elbowRest=arms.map(({elbow})=>elbow.rotation.z);
  const wristRest=arms.map(({wrist})=>wrist.rotation.z);
  const grips=arms.map(({grip})=>grip);
  const local=new T.Vector3();
  const clamp=T.MathUtils.clamp;
  const membraneBinds=membranes?.map(({hinge},i)=>{
    const wrist=arms[i].wrist;
    hinge.parent.worldToLocal(wrist.getWorldPosition(local));
    return [local.x-hinge.position.x,local.y-hinge.position.y];
  });

  function poseClaws(tension=0,opening=0) {
    arms.forEach(({arm,elbow,wrist,side,digits},i)=>{
      const open=Array.isArray(opening)?opening[i]:opening;
      if(tension>0) {
        arm.rotation.z=T.MathUtils.lerp(arm.rotation.z,rest[i]+side*.14,tension);
        elbow.rotation.z=T.MathUtils.lerp(elbow.rotation.z,elbowRest[i]+side*.14,tension);
      }
      wrist.rotation.z=wristRest[i]+side*(open*.52-tension*.10);
      digits.forEach((digit,j)=>{digit.rotation.z=side*open*(.27+j*.29);});
    });
  }
  function aimGrip(i,target,wristAngle=0) {
    const {arm,elbow,wrist,grip}=arms[i];
    const dx=target.x-arm.position.x,dz=target.z-arm.position.z;
    const offsetZ=elbow.position.z+wrist.position.z+grip.position.z;
    const reachX=(dx<0?-1:1)*Math.sqrt(Math.max(.000001,dx*dx+dz*dz-offsetZ*offsetZ));
    const yaw=Math.atan2(offsetZ,reachX)-Math.atan2(dz,dx);
    const x=reachX-grip.position.x*Math.cos(wristAngle)+grip.position.y*Math.sin(wristAngle);
    const y=target.y-arm.position.y-grip.position.x*Math.sin(wristAngle)-grip.position.y*Math.cos(wristAngle);
    const upper=-elbow.position.y,fore=-wrist.position.y;
    const cosine=clamp((x*x+y*y-upper*upper-fore*fore)/(2*upper*fore),-.99999,.99999);
    const bend=(i?1:-1)*Math.acos(cosine);
    const angle=Math.atan2(x,-y)-Math.atan2(fore*Math.sin(bend),upper+fore*Math.cos(bend));
    arm.rotation.set(0,yaw,angle,'YXZ');
    elbow.rotation.set(0,0,bend);
    wrist.rotation.z=wristAngle-angle-bend;
  }
  function spreadMembranes() {
    if(!membranes)return;
    membranes.forEach(({hinge},i)=>{
      hinge.parent.worldToLocal(arms[i].wrist.getWorldPosition(local));
      const dx=local.x-hinge.position.x,dy=local.y-hinge.position.y;
      const [bx,by]=membraneBinds[i];
      hinge.rotation.z=Math.atan2(dy,dx)-Math.atan2(by,bx);
      hinge.scale.setScalar(clamp(Math.hypot(dx,dy)/Math.hypot(bx,by),.29,1.13));
    });
  }
  return {...pattern,armL:arms[0].arm,armR:arms[1].arm,elbows:arms.map(a=>a.elbow),
    grips,rest,elbowRest,headYaw:-.08,poseClaws,aimGrip,spreadMembranes};
}

export function buildKeeperResident(g,key) {
  const rig=keeperRig(key==='pangolin'?pangolin(g):glider(g));
  if(key==='pangolin') {
    rig.stitchRail=at(g,-6,37.8,9.32);
    rig.stitchRail.name='墨綠圍裙的收工線腳';
    rig.stitchRail.scale.setScalar(.63);
  }
  return rig;
}
