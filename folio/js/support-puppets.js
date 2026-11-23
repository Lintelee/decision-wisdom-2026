// Paper patterns for the six neighbours. Every character has its own torso,
// shoulder/hip positions, footfall, face and equipment. All wrists stay long
// enough to receive the shop's cups, instruments and cloth samples.
import { tri } from './paper.js';
import { banquetHost } from './banquet-host.js';

const CREAM='#eddbb7', INK='#352f31', GOLD='#c49b57';
const residents=new Set(['otter','squirrel','badger','hare','owl','bear','buffalo']);
export const isSupportingResident=key=>residents.has(key);
const points=path=>typeof path==='string'?path.trim().split(/\s+/).map(p=>p.split(',').map(Number)):path;
const mirror=(path,side)=>points(path).map(([x,y])=>[x*side,y]);

function art(h) {
  const {at,folded,ink,line,pip,eyes}=h;
  // A tapered carton behind the front pattern gives heads and bellies volume
  // under a side view without turning their outlines into flat rectangular walls.
  function carved(g,path,colour,shade,z=0,{depth=5,rim=1.05,crease=[0,.10],shift=0}={}) {
    const v=points(path);
    const cx=v.reduce((sum,p)=>sum+p[0],0)/v.length,cy=v.reduce((sum,p)=>sum+p[1],0)/v.length;
    const back=v.map(([x,y])=>[cx+(x-cx)*.77-shift,cy+(y-cy)*.82]);
    const front=v.map(([x,y])=>[x/100,y/100,(z-.74)/100]);
    const base=back.map(([x,y])=>[x/100,y/100,(z-depth)/100]);
    for(let i=0;i<v.length;i++){
      const j=(i+1)%v.length;
      tri(g,front[j],front[i],base[i],shade);tri(g,base[i],base[j],front[j],shade);
    }
    ink(g,back,shade,z-depth-.28,.3);
    folded(g,v,colour,z,{shade,edge:rim,depth:.86,crease});
  }
  function eyeWhite(g,x,y,rx,ry,colour=CREAM){
    ink(g,[[-1,-.08],[-.9,.50],[-.42,.91],[.19,.93],[.70,.62],[1,.12],[.87,-.46],[.36,-.72],[-.3,-.74],[-.78,-.51]].map(([a,b])=>[x+rx*a,y+ry*b]),colour,6.7,.45);
  }
  function snout(g,p,tint=INK) {ink(g,p,tint,10.2,.72);}
  function paper(g,path,colour,shade,z=1,rim=.95) {folded(g,path,colour,z,{shade,depth:2.55,edge:rim});}
  function stem(g,x,y,x1,y1,z,w,colour){line(g,x,y,x1,y1,z,w,colour);}
  const badge=(g,x,y,z,r,colour=GOLD)=>pip(g,x,y,z,r,colour,9);
  return {at,ink,eyes,paper,carved,eyeWhite,snout,stem,badge};
}
function otterFace(head,a) {
  const {at,carved,ink,eyeWhite,snout,stem,eyes}=a;
  const fur='#9f7352',shade='#795844',pale='#e5c99e';
  carved(head,'-22,10 -26,17 -25,25 -21,30 -21,34 -18,37 -14,37 -10,34 -2,35 6,34 10,35.5 13,34.8 14.2,32.1 17.5,29 21,23 26,20.4 30,19 32.8,17 33.5,13.3 31,10.2 23.5,8.5 17,5 9,1 2,-1 -8,0 -16,3',fur,shade,2,{depth:8.8,rim:1.25,shift:2,crease:[4,.12]});
  ink(head,'-20,32 -18,35 -15,35 -12,33 -15,30',shade,5.2);
  carved(head,'-17,12 -10,15 -2,15 4,12 11,14 19,18 27,17 31.4,15.7 32,12.7 29,10 20,8.1 11,4.2 1,1 -11,5',pale,'#d2b68d',6.1,{depth:2.3,rim:.34,crease:[12,.03]});
  ink(head,'2,13.6 6,16.9 13,18.3 18.4,18 23.4,15.5 24.4,12.6 22.4,10.8 18.2,9.5 13,9.8 8.6,11.5 4.4,11.7','#eddbb6',8.55,.40);
  ink(head,'23,16.8 27.8,17.1 31.2,15.8 31.5,13.2 29.3,11.5 26.2,10.5 22.7,10.9 22.9,12.9','#e6cfa8',8.75,.36);
  eyeWhite(head,-1.1,22.2,4.1,3.1);eyeWhite(head,16.0,23.0,2.6,2.25);
  ink(head,'-7,27 -2,29 3,28 4,27 -1,27.8 -6,26',shade,6.3);
  snout(head,'20.5,18.4 23.5,19.5 28.3,19.0 30.3,17.3 29.6,15.4 26.5,13.6 23.5,14.4 21.3,16.2');
  for(const pts of [[11,13.7,-1.7,16],[10.8,12.9,-3,12.8],[11.3,11.5,-.6,9.1],[28.2,12.4,32.2,13.2]])stem(head,...pts,9.55,.32,shade);
  for(const [x,y] of [[13.8,14.3],[15.6,12.7],[11.4,13.0]])a.badge(head,x,y,9.65,.36,shade);
  const eye=eyes(head,[[.4,22.8,2.65],[16.7,23.2,1.7]],22.5);
  return {head,eyes:eye,mouth:at(head,24,8.3,9.9)};
}
export function makeOtterHead(parent,helpers) {
  return otterFace(helpers.at(parent),art(helpers));
}
function otter(g,a,coat,trousers) {
  const {at,carved,ink,paper,eyeWhite,snout,stem,badge,eyes}=a;
  const fur='#9f7352',shade='#795844',pale='#e5c99e';
  const tail=at(g,-10,23,-3.5);
  carved(tail,'6,8 -1,13 -8,12 -16,7 -24,1 -38,-4 -49,-6 -41,-9 -30,-10 -15,-8 2,-2',fur,shade,0,{depth:7,rim:.90,crease:[-15,-.25]});
  ink(tail,'-6,8 -14,5 -24,-1 -37,-4 -29,-4 -16,0 -6,5', '#b4916d',2.5);
  const torso=at(g,0,0,-.5);
  carved(torso,'-18,27 -22,33 -21,43 -17,56 -9,66 2,74 10,75 17,70 21,59 19,47 14,36 8,25 -2,19 -13,20',fur,shade,.3,{depth:9,crease:[-2,-.12]});
  ink(torso,'1,69 12,70 17,64 17,57 11,48 4,43 -6,45 -6,53',pale,3.0);
  paper(torso,'-18,55 -9,67 -2,72 2,70 -2,62 -5,55 -4,40 -8,33 -18,34 -20,41',coat,'#50685e',3.7,.70);
  paper(torso,'12,68 16,67 20,58 16,47 9,39 4,35 4,41 9,51 14,62',coat,'#50685e',3.8,.6);
  paper(torso,'-9,68 0,73 12,73 17,70 10,66 3,66 -5,62 -12,61 -8,65', '#ad5b45','#98503e',6.1,.48);
  // Tasting spoon carried in the little sea-green vest.
  paper(torso,'-18,44 -10,46 -9,39 -14,36 -18,38','#769484','#607c71',5,.4);
  stem(torso,-14,44,-9.5,51.9,6,.65,GOLD);badge(torso,-8.9,53.2,6.3,1.65,GOLD);
  const {head,eyes:eye,mouth}=otterFace(at(g,8,68,2.5),a);
  const legs=[],arms=[],elbows=[];
  for(const side of [-1,1]){
    const leg=at(g,side<0?-12.5:6,26,side<0?-1.7:1.1);
    paper(leg,mirror('-5,3 3,5 7,-1 6,-10 1,-17 -2,-21 -6,-20 -5,-13 -7,-6',side),trousers||fur,shade,0,.8);
    paper(leg,mirror('-4,-16 1,-16 5,-20 12,-22 13,-24 8,-25 3,-24 -1,-25 -5,-24 -8,-24 -8,-21',side),shade,'#675041',1,.7);
    for(const x of [2.8,5.8])stem(leg,x*side,-22.4,(x+1.2)*side,-24.1,3.5,.24,pale);
    legs.push(leg);
    const shoulder=at(g,side<0?-10.5:17,side<0?66:63,3.8),elbow=at(shoulder,0,-15.9,1.6);
    paper(shoulder,'-3.4,3 2,3.7 5.2,.2 4.8,-8.8 2.4,-17 -3.1,-16.5 -5.6,-10 -5.4,-4',fur,shade,1,.74);
    ink(shoulder,'-5.2,-2.6 -3.2,2.4 1.5,3.0 4.8,.5 4.7,-5.6 1,-5 -3.6,-6.3',coat,3.45);
    paper(elbow,'-3.1,1 3,1.5 4.7,-6 4,-10 6.1,-12 6.9,-14 5.8,-16.5 3.5,-18.4 1.1,-18 -1,-18.1 -3.8,-16.3 -5.1,-13.5 -4,-8',fur,shade,1,.68);
    ink(elbow,'-3.4,-13.7 .2,-12.9 3.6,-14.1 4.7,-16.2 3.4,-17.3 1.1,-17.2 -1.2,-17.4 -3.3,-16',pale,3.65);
    arms.push(shoulder);elbows.push(elbow);
  }
  return {head,eyes:eye,mouth,tail,legs,elbows,armL:arms[0],armR:arms[1],rest:[-.33,-.18]};
}
function squirrel(g,a,coat,trousers) {
  const {at,carved,ink,paper,eyeWhite,snout,stem,badge,eyes}=a;
  const fur='#ad683e',dark='#794c3a',belly='#d77c45',cream='#e4be8c';
  const tail=at(g,7,22,-6);
  carved(tail,'-4,2 4,-1 15,-2 26,2 35,9 42,18 48,31 51,46 49,58 44,69 36,76 25,80 18,79 13,75 12,69 15,62 21,59 28,58 32,54 34,47 32,38 28,33 25,31 27,38 23,36 18,30 15,24 8,20 -3,15',fur,dark,0,{depth:9,rim:1.2,crease:[31,-.05]});
  ink(tail,'14,67 17,73 24,77 32,76 41,71 46,64 47,58 42,65 35,70 26,72 20,69','#c88958',3.15);
  ink(tail,'20,7 32,14 42,26 47,39 47,49 44,53 43,42 38,29 30,19', '#d9a16a',3.2);
  const torso=at(g,0,0,0);
  carved(torso,'-19,24 -22,30 -22,43 -18,54 -13,62 -12,70 -4,75 6,76 13,73 16,63 15,55 21,43 25,33 22,25 16,19 4,16 -10,17',fur,dark,.5,{depth:9,crease:[-3,.05]});
  carved(torso,'-17,51 -13,62 -7,67 0,66 7,60 12,48 13,36 9,26 2,22 -7,22 -15,28 -18,39',belly,'#bf6b43',3.1,{depth:3,rim:.32,crease:[-1,.08]});
  // A market runner wears only a short bolero and a receipt belt, showing the red belly.
  paper(torso,'-16,62 -10,68 -7,70 -4,67 -8,60 -13,54 -15,49 -20,51',coat,'#875b48',4.6,.6);
  paper(torso,'4,69 11,73 15,68 16,58 19,52 15,47 10,48 10,58 5,62',coat,'#875b48',4.6,.6);
  ink(torso,'-17,30 -8,28 2,27 12,29 18,34 18,31 12,26 3,24 -7,24 -15,27',dark,5.5);
  const ticket=at(torso,10,27,6);ticket.rotation.z=-.16;
  paper(ticket,'-4,4 3,4 4.6,1.8 4,-4 -2,-5 -4,-3','#bf9458','#a67c4e',0,.45);
  ink(ticket,'-2.5,4 -1.6,8.5 2.6,8.1 2,4',CREAM,1.8);
  stem(ticket,-1.4,6.2,1.5,6.1,3.3,.24,dark);
  const head=at(g,-10,66,2.5);
  carved(head,'-29,11 -25,16 -20,20 -17,27 -13,31 -11,44 -8,39 -4,45 -3,36 1,33 7,34 15,44 18,46 17,38 20,39 17,29 19,22 20,15 16,7 8,2 -3,-1 -12,1 -20,4 -27,5 -31,8',fur,dark,2,{depth:7,shift:-1.5,rim:1.2,crease:[1,.17]});
  ink(head,'-10,39 -8,34 -7,31 -4,34 -6,38','#653e35',5.2);ink(head,'12,34 16,40 15,34 13,31','#653e35',5.2);
  carved(head,'-29,10 -21,10 -14,13 -6,13 0,10 9,9 17,13 15,7 7,3 -4,1 -14,3 -24,5',cream,'#d0a475',6.1,{depth:2.6,rim:.29,crease:[-8,.05]});
  eyeWhite(head,-12.2,22.1,3.6,3.6);eyeWhite(head,2.3,22,4.8,4.1);
  snout(head,'-31,10.8 -27.4,11.7 -24.6,10.6 -25.6,8.7 -28.4,7.9');
  ink(head,'-22,6.8 -17,6.0 -13,7 -16,5.25 -19,5.45',dark,9.1);
  const eye=eyes(head,[[-13.0,22.3,2.05],[1.1,22.5,2.75]],22.8);
  const legs=[],arms=[],elbows=[];
  for(const side of [-1,1]){
    const leg=at(g,side<0?-10:10,27,side<0?-.6:2.1);
    carved(leg,mirror('-4,2 5,4 12,0 14,-7 13,-13 6,-18 -1,-18 -7,-16 -9,-10 -8,-4',side),trousers||fur,dark,0,{depth:5,rim:.65});
    paper(leg,'-5,-16 .7,-16 3,-20 .8,-23 -4,-24 -11,-25 -16,-24.4 -15,-22 -9,-19',dark,'#654738',2,.72);
    legs.push(leg);
    const shoulder=at(g,side<0?-16:10.5,side<0?62:66,4.2),elbow=at(shoulder,0,-16.1,1.05);
    paper(shoulder,'-4.1,2 2.2,3.3 5,-.7 5.4,-8 2.8,-16.5 -3.6,-16.5 -5.2,-11 -5,-2',coat,'#845842',0,.63);
    paper(elbow,'-2.9,1.8 3,2.3 4.5,-5.8 2.8,-10 6,-12.8 6.1,-16 3,-17.9 -.7,-17.0 -4,-15 -4.7,-11.1',fur,dark,1,.64);
    badge(shoulder,1.1,-6,2.3,.8,GOLD);
    arms.push(shoulder);elbows.push(elbow);
  }
  return {head,eyes:eye,mouth:at(head,-19,6.8,9.5),tail,legs,elbows,armL:arms[0],armR:arms[1],rest:[.76,-.63]};
}
function badger(g,a,coat,trousers) {
  const {at,carved,ink,paper,eyeWhite,snout,stem,badge,eyes}=a;
  const fur='#736c61',shade='#514e49',light='#e3d8bb',sienna='#a08a6d';
  const tail=at(g,-19,22,-4.8);
  carved(tail,'5,7 1,12 -10,11 -18,8 -27,6 -34,5 -39,2 -34,.5 -30,-1 -23,-1 -11,0 -2,2',fur,shade,0,{depth:4.7,rim:.75,crease:[-12,0]});
  ink(tail,'-30,6 -36,5 -39,2 -33,.6 -28,.5 -24,1.9 -28,2.7 -26,4',light,2.7);
  const torso=at(g);
  // A low back and forward-reaching shoulders follow the animal's ground-sniffing gait.
  carved(torso,'-26,25 -26,36 -20,46 -12,55 3,62 17,64 22,60 20,48 17,39 12,29 1,23 -14,20',fur,shade,0,{depth:8.4,crease:[-6,.16]});
  ink(torso,'-22,39 -13,51 1,58 13,61 12,58 -2,55 -12,48 -19,41',light,3);
  paper(torso,'-22,37 -18,45 -8,53 3,57 14,59 18,54 17,45 11,34 1,28 -13,25 -22,28',coat,'#515e62',3.4,.74);
  ink(torso,'-20,33 -6,32 6,37 14,44 12,39 5,33 -7,28 -19,29','#778283',5.9);
  const swatch=at(torso,-12,32,5.7);swatch.rotation.z=.14;
  paper(swatch,'-4,3.8 4.4,3.8 4,-4.2 -4.2,-4.2','#485e79','#3d4f66',0,.43);
  for(const x of [-2.4,.1,2.2])stem(swatch,x,-2.5,x+.4,-1.5,2.6,.29,CREAM);
  paper(torso,'6,59 13,62 19,59.8 16,56 11,54 7,51 2,51 5.6,54', '#be9555','#a37a46',6.2,.45);
  const head=at(g,12,59,1.9);
  carved(head,'-24,13 -24,20 -20,27 -22,31 -20,35 -15,37 -10,36 -7,32 0,32 9,29 15,25 21,18 28,13 38,10 42,8 42,5 35,3 27,3.5 17,2 7,-1 -2,-2 -10,0 -18,4 -22,9',fur,shade,2,{depth:7.0,shift:3,rim:1.2,crease:[2,.12]});
  ink(head,'-20.1,31 -17.8,34.3 -14.6,34.7 -11.7,32.5 -13.8,30 -17,29.4',sienna,5.2);
  ink(head,'-20.9,31.2 -20.3,34.7 -16.5,36.4 -14.5,36.2 -18.1,34.2 -19.3,31.8',light,5.35);
  // A single dorsal blaze runs down the long nose. Neither eye is enclosed by a mask.
  ink(head,'-12,28 -3,31 3,31 10,28 18,22 24,16 31,12 38,10 39.8,8.5 36.7,8.6 25,13 18,17 12,23 5,26.4 -1,27.2 -8,26.4',light,6.0);
  carved(head,'-20,9 -12,12 -3,10 1,7.3 11,8.1 20,9 27,9.7 36,8.0 39,6.3 34,4.7 26,5 17,3 6,0 -3,0 -14,3.3','#b5a38a','#998a75',6.2,{depth:2.1,rim:.27,crease:[12,.04]});
  ink(head,'-14,14 -6,17.4 -.9,18.2 2.6,17.7 -3,15 -9,13.6',light,6.45);
  eyeWhite(head,.3,22.0,3.55,2.55,'#d1bc91');eyeWhite(head,13.2,20.9,2.4,1.88,'#d1bc91');
  snout(head,'35.8,10.6 40.2,10 43.4,8 43.6,6.1 40.2,5.2 36.6,6.6');
  for(const k of [[18.6,7.5,14.7,9.3],[20.2,6.8,15.4,6.6]])stem(head,...k,9.4,.29,shade);
  const eye=eyes(head,[[1.2,22.3,2.08],[13.8,21.2,1.44]],22);
  const legs=[],arms=[],elbows=[];
  for(const side of [-1,1]){
    const leg=at(g,side<0?-14:8,26,side<0?-1.8:1.3);
    paper(leg,mirror('-6,3 3,3 7,-1 7,-9 3,-16 1.3,-21 -3.3,-21 -6,-17 -6,-10',side),trousers||shade,shade,0,.72);
    paper(leg,'-4.5,-18 1,-18 6.7,-21 10,-23 9,-24.3 3,-24.5 -3,-24.5 -6,-22.7',shade,'#554e46',2,.64);
    for(const x of [3,5.6,8])stem(leg,x,-22.4,x+1.1,-24.1,4.3,.31,light);
    legs.push(leg);
    const shoulder=at(g,side<0?-6.4:17.2,side<0?56.3:57.8,3.5),elbow=at(shoulder,0,-15.6,1.35);
    paper(shoulder,'-5.3,2.0 .9,3.5 5,1.3 5.8,-8 2.6,-16 -3.9,-16.5 -6,-11',coat,'#515e62',1,.73);
    ink(shoulder,'-5,-13 3.5,-12.2 3,-15.6 -4.2,-16','#959a87',3.55);
    paper(elbow,'-3.4,2 2.9,2.1 4,-6.6 3.8,-10.7 6.5,-13.8 6.1,-17.3 4.3,-18.8 2.7,-17.1 .4,-18.7 -1.3,-17 -3.6,-17.5 -5,-13.9 -4,-8',fur,shade,1,.67);
    stem(elbow,3.2,-14.1,5.0,-17.3,3.6,.30,light);
    arms.push(shoulder);elbows.push(elbow);
  }
  return {head,eyes:eye,mouth:at(head,33,4.8,9.7),tail,legs,elbows,armL:arms[0],armR:arms[1],rest:[.25,.57]};
}
function hare(g,a,coat,trousers) {
  const {at,carved,ink,paper,eyeWhite,snout,stem,badge,eyes}=a;
  const fur='#ba9076',shade='#927260',pale='#f0d8ac',ear='#b77e6f',teal='#536e69';
  const tail=at(g,-17.5,26.8,-3);
  carved(tail,'5,7 2,13 -4,16 -11,14 -15,10 -15,5 -12,.7 -5,-1 1,1',pale,'#cbbba0',0,{depth:5,rim:.80});
  const torso=at(g);
  carved(torso,'-18,25 -18,36 -12,47 -7,56 -4,67 -4,76 1,80 10,81 16,77 18,66 14,50 13,39 17,30 13,21 0,18 -12,19',fur,shade,0,{depth:7.2,crease:[2,-.03]});
  ink(torso,'0,74 7,78 13,75 13,66 8,58 4,54 -2,56 -1,63',pale,3.1);
  paper(torso,'-10,56 -5,64 -.3,66 .9,62 -4,56 -1,48 7,47 11,60 15,67 17,65 16,56 12,45 12,35 7,28 -.5,26 -13,31 -14,41',coat,teal,3.5,.69);
  paper(torso,'-1,56 4.5,56 5,50 2,47.5 -.8,50', '#69817a','#556e68',5.8,.35);
  badge(torso,-4,59.8,6.7,.83,GOLD);badge(torso,11.8,59.5,6.7,.83,GOLD);
  // A little gusseted chalk bag hangs below the bib, leaving the hips free to spring.
  ink(torso,'-3,70 -1,70 10,45 7.7,44 2,57','#956447',6.1);
  const pouch=at(torso,10,39,7);pouch.rotation.z=-.17;
  paper(pouch,'-5,4 5,4 5,-4 1,-6 -5,-4','#b78a59','#957248',0,.55);
  ink(pouch,'-4.8,4.3 5,4.1 3.2,1.1 -2.5,.2',pale,2.1);
  ink(pouch,'-1.4,4 .2,9.7 1.1,10.4 1.8,9.5 .8,4.1',CREAM,2);
  const head=at(g,3,73,2.6);
  const farEar=at(head,-7,29.8,-1.7);
  carved(farEar,'-5,1 -9,7 -13,15 -18,21 -24,23 -31,21 -33,22.4 -31,26 -23,30 -17,30.5 -12,28 -6,23 0,15 3,7 2.6,2',fur,shade,0,{depth:4,rim:1.05,crease:[-7,.15]});
  ink(farEar,'-4.5,6.8 -10.7,16 -16.6,23.1 -22,25.5 -29,24.3 -23.7,27.3 -17.9,27.5 -12,24.2 -6,17 -3.1,11',ear,2.8);
  const nearEar=at(head,7,31,.30);
  carved(nearEar,'-3.7,0 -3,11 -2,22 1.5,33 6.2,42.4 9,45 12.2,44 13.1,39 12.3,31 8.8,19 4.6,6.7 3.0,.5',fur,shade,1,{depth:4.9,rim:1.05,crease:[3,.03]});
  ink(nearEar,'-.8,6 .6,18.5 3,28.5 8.7,40.4 10.1,39 8.3,29.8 4.2,16.3 1.5,9.1',ear,3.65);
  carved(head,'-20,11 -22,19 -19,27 -14,32 -7,35 2,36 12,34 18,30 20,23 24,18 28,16 29,13 25,9 19,7 14,3 8,-.4 -.2,-.9 -12,2 -17,6',fur,shade,2,{depth:7,rim:1.2,shift:1,crease:[5,.06]});
  carved(head,'-17,10 -11,13 -5,13 1,10 8,11 18,15 25,16 27,13 23,10 17,8 10,4 1,2 -10,4',pale,'#d6bb98',5.9,{depth:2.4,rim:.32,crease:[8,.02]});
  eyeWhite(head,-4.4,22.8,4.2,4.85);eyeWhite(head,14,23.2,2.9,3.2);
  snout(head,'20.7,17.7 24.1,18.1 27,16.8 26.4,14.9 23.7,13.9 21.8,15.3','#955f59');
  stem(head,9.5,11,2,12.1,9.35,.31,shade);stem(head,9,9.4,0,8.8,9.4,.29,shade);
  const eye=eyes(head,[[-3.2,23.4,2.6],[15,23.7,1.8]],23);
  const legs=[],arms=[],elbows=[];
  for(const side of [-1,1]){
    const leg=at(g,side<0?-11:8,34,side<0?-1.9:1.1);
    const sign=side<0?-1:1;
    carved(leg,mirror('-4,0 1,5 7.5,5 12,2 15,-4 15,-9 12,-15 6,-20 -1,-22 -7,-19 -9,-13 -8,-7',sign),trousers||fur,shade,0,{depth:6,rim:.80,crease:[0,.14]});
    paper(leg,mirror('-1,-17 4,-17 3,-23 -1,-29 -2,-31 -6,-30 -5,-25',sign),fur,shade,.8,.6);
    paper(leg,mirror('-4,-26 -.6,-26 5,-28 13,-29 18,-31.5 18.5,-33 12,-33.5 -3,-33 -6.2,-32 -6.3,-29',sign),'#cea88a','#ac886e',2,.63);
    ink(leg,mirror('9,-29.7 14,-30.7 17.4,-32.1 12,-32.7 8,-32.4 6.7,-31',sign),pale,4.1);
    stem(leg,13*sign,-31,15.3*sign,-32.6,4.3,.27,shade);
    legs.push(leg);
    const shoulder=at(g,side<0?-6.8:14,side<0?69:71,3.7),elbow=at(shoulder,0,-16,1.2);
    paper(shoulder,'-3.5,2 1.4,3 4.5,1 4.6,-7 2.8,-16.2 -2.8,-16.5 -4.8,-11',coat,teal,.3,.65);
    paper(elbow,'-2.8,2 2.7,2 4.2,-7.5 3.6,-11 6,-13.2 6,-16.6 3.3,-18 0,-17.9 -3.5,-16 -4.3,-13.2',fur,shade,1,.64);
    ink(elbow,'-3.5,-12.2 -.1,-11.5 3.9,-12.8 5.2,-15.3 3.4,-17.1 .4,-17.2 -2.2,-15.7',pale,3.5);
    arms.push(shoulder);elbows.push(elbow);
  }
  return {head,eyes:eye,mouth:at(head,19.0,11.3,9.8),tail,legs,elbows,armL:arms[0],armR:arms[1],rest:[-.44,.40]};
}
function owl(g,a,coat,trousers) {
  const {at,carved,ink,paper,eyeWhite,snout,stem,badge,eyes}=a;
  const fur='#a68159',shade='#715741',tawny='#bf996d',pale='#e8cea1';
  const body=at(g);
  carved(body,'-25,31 -26,40 -22,52 -17,61 -9,66 3,68 16,64 23,57 27,47 29,35 26,25 17,18 4,14 -11,15 -20,20',tawny,fur,0,{depth:10,rim:1.15,crease:[1,-.08]});
  ink(body,'-15,48 -9,55 3,57 13,53 19,45 20,37 17,29 8,23 -2,21 -12,26 -16,35',pale,3.0);
  for(const [x,y,scale] of [[-3,44,1],[8,40,.72],[-9,35,.70],[1,33,.70]]){
    ink(body,[[-3,1],[.2,-.6],[3.1,1.35],[1.45,-1.6],[-.25,-2.25],[-2.1,-1]].map(([dx,dy])=>[x+dx*scale,y+dy*scale]),fur,4.1);
  }
  // The registrar's ledger rides on a diagonal sling tucked through the feathers.
  ink(body,'-17,59 -14,60 17,30 16,27 -1,42',coat,4.6);
  const ledger=at(body,11,27,6.3);ledger.rotation.z=-.17;
  paper(ledger,'-6,6 6,6 7,4.2 6.7,-4.3 4.6,-5.8 -6,-5.8','#5e7073','#4c5c60',0,.55);
  ink(ledger,'-5.4,4.4 3.9,4.4 5.5,3.3 5.3,-3.6 -5.4,-3.5',CREAM,2.2);
  ink(ledger,'-4.4,3.1 3.2,3.4 3.2,-1.9 -4.4,-2.9',coat,2.9);
  stem(ledger,-3.7,2.3,-3.7,-2,3.7,.28,GOLD);
  const head=at(g,0,55,2);
  // Broad facial discs and outward-set tufts make the head nearly as wide as the folded wings.
  carved(head,'-31,14 -31,23 -28,30 -32,42 -31,46 -22,40 -16,37 -8,39 .7,40 10,38 16,37 24,42 30,46 30,41 27,30 31,22 31,15 27,8 20,3 11,-.2 0,-2 -13,-.4 -23,4 -28,8',fur,shade,2,{depth:9.2,rim:1.4,crease:[4,.02]});
  for(const side of [-1,1]){
    paper(head,mirror('2,25 8,30.5 17,31.3 23.5,28.7 27,23.4 26.4,17 22,11 16,7.4 8,8.1 2.3,13 -0.3,20',side),pale,'#d3b385',4.4,.68);
    ink(head,mirror('4,23 9,28.9 16,30.2 22,28.6 24.3,26.4 17,28.1 10.8,26.7 6,23',side),tawny,6.8);
    ink(head,mirror('1.4,25.3 5,30.3 13.1,32.6 20.2,34.2 28,39.5 24.1,33.3 17.2,30.3 9.8,29 4.3,25.5',side),shade,7.0);
    eyeWhite(head,side*12.7,20.0,5.2,5.7,'#cc9d56');
  }
  carved(head,'-.7,21.2 2.1,21.6 4.6,20.1 4.0,16.3 1.8,12.8 -.4,14.6 -2,19.0',GOLD,'#a77b3e',8.4,{depth:3.2,rim:.33,crease:[1.3,0]});
  const eye=eyes(head,[[-12.4,20.5,3.35],[13.0,20.7,3.15]],21);
  const legs=[],arms=[],elbows=[];
  for(const side of [-1,1]){
    const leg=at(g,side*10.0,20,0.2);
    carved(leg,'-4.5,2 -2,5 3,4.8 5.5,2 5,-3.6 3.2,-7.3 -2.2,-7.3 -4.9,-4',trousers||fur,shade,0,{depth:3,rim:.6});
    paper(leg,mirror('-1.8,-6.2 2,-6.3 2.2,-14.6 8.4,-17 9.1,-18.5 6.0,-17.8 2.1,-16.9 .3,-17 -.2,-19.2 -1.2,-19.7 -1.4,-17.1 -4,-17.8 -5,-19 -5.4,-18.6 -4.2,-16.4 -1.1,-15.1',side),GOLD,'#a67842',1,.42);
    legs.push(leg);
    const shoulder=at(g,side*21.5,57.7,3.45),elbow=at(shoulder,0,-15.8,1.1);
    carved(shoulder,mirror('-5,1 -2,6 3.3,6.6 8,3.5 11.5,-2 12,-9 10.1,-15.3 7.4,-20.3 4,-18.3 1.7,-20 -3,-15 -5.4,-8',side),fur,shade,0,{depth:4.3,rim:.84,crease:[0,.14]});
    paper(shoulder,mirror('-3.2,1.5 1.8,3.7 6.8,1.3 9.4,-3.7 8.2,-8.5 6,-11.8 4.7,-8.4 2.0,-10.9 -.9,-8.5 -2.4,-5',side),tawny,fur,3.0,.40);
    paper(elbow,mirror('-3.8,4.7 3.8,6.6 8.9,4.8 10,-1.5 8.4,-9.3 4.6,-17 2.8,-15.1 -.6,-19.2 -1.7,-15.6 -4.2,-17 -5.1,-11.1 -5.3,-3.1',side),fur,shade,.6,.77);
    ink(elbow,mirror('-3.6,-5.2 .3,-6.1 6.9,-3.2 6.0,-6 1,-9.4 -3.9,-8',side),pale,3.4);
    arms.push(shoulder);elbows.push(elbow);
  }
  return {head,eyes:eye,mouth:at(head,1.8,15.3,10),legs,elbows,armL:arms[0],armR:arms[1],rest:[.09,-.07]};
}
function bear(g,a,coat,trousers) {
  const {at,carved,ink,paper,eyeWhite,snout,stem,badge,eyes}=a;
  const fur='#47494a',deep='#363b3e',pale='#e9d7b1',muzzle='#a4957c';
  const body=at(g);
  carved(body,'-26,33 -27,45 -25,60 -30,67 -30,73 -23,78 -15,80 -8,85 6,88 16,83 26,80 32,74 32,66 27,57 27,43 23,31 16,24 4,21 -12,22 -21,26',fur,deep,0,{depth:12,rim:1.30,crease:[2,-.07]});
  // The Taiwanese black bear's cream crescent stays above its waist apron.
  carved(body,'-21,69 -13,67 -4,61 3,56 10,61 20,67 23,66 18,60 10,54 4,50 .7,50 -6,55 -16,62',pale,'#d2c09d',3.3,{depth:2.3,rim:.28,crease:[3,0]});
  paper(body,'-23,43 -11,40 6,40.5 23,44.6 24,40.6 21,26 14,23 3,25 -6,23 -18,24.6 -21,28',coat,'#4f6063',3.6,.80);
  ink(body,'-22.5,42.8 -11,40 6,40.4 23,44.4 23,41.6 6,37.7 -11,37.5 -22.2,39.6',GOLD,6.25);
  const towel=at(body,-12.0,38,7);towel.rotation.z=-.10;
  paper(towel,'-5,1.5 4,2.4 5,-8.8 3,-8.2 1,-10 -.4,-9 -2.6,-10 -5,-8.9',pale,'#d3c2a2',0,.39);
  for(const y of [-4.8,-6.1])stem(towel,-4.2,y,4.1,y+.25,2.6,.29,'#9b7352');
  const head=at(g,2,76.8,2.4);
  carved(head,'-24,12 -24,23 -21,29 -24.5,31.8 -25,36 -22,40.2 -17.7,41 -13.2,38.7 -11.5,35.8 -3,38.1 7,38 13,36.3 15.2,39.8 19,41.7 23.2,41.3 26.3,38.6 27.0,35.2 25.3,31.7 22.5,30.1 26.2,24 27.3,15 23.6,8.4 15.8,3.4 6.4,.4 -4.2,-1 -13,1.7 -20.8,5.6',fur,deep,2,{depth:9.6,rim:1.28,crease:[5,.11]});
  ink(head,'-23,35 -21.1,37.9 -18.3,38.8 -15.6,36.4 -17.4,34.3 -20.6,33.5','#797266',5.2);
  ink(head,'17.2,37.5 19.1,39 22.4,38.7 24,36.8 22.8,34.4 19.7,35','#797266',5.2);
  carved(head,'-7.5,13.2 -4.8,17.9 1.5,20.2 8,19.5 14.4,16.8 18.4,13.1 18.1,9 13.4,6.1 5.3,5.3 -1.4,6.5 -6,9.3',muzzle,'#91826c',6.6,{depth:4.6,rim:.47,crease:[6,0]});
  eyeWhite(head,-9.4,23.2,3.3,2.35,'#c9b48c');eyeWhite(head,13.1,24.8,2.58,1.99,'#c9b48c');
  ink(head,'-14.1,27 -11.2,28.6 -6.9,28.2 -5.1,26.8 -10.7,27.1','#91846d',6.2);
  ink(head,'10.1,28.7 12.8,29.9 16.3,29.5 17.9,28.5 14,28.6','#91846d',6.2);
  snout(head,'.4,17.8 4.1,19.1 9.1,18.8 12.4,17 12.0,14.5 9.2,12.7 5.4,12.4 1.2,14.7');
  stem(head,6.7,12.7,6.9,10.3,10.8,.37,INK);stem(head,7,10.3,9.9,10.1,10.8,.31,INK);
  const eye=eyes(head,[[-8.3,23.5,2.05],[13.7,25,1.65]],23.8);
  const legs=[],arms=[],elbows=[];
  for(const side of [-1,1]){
    const leg=at(g,side*13.8,31.4,side<0?-1.6:1.4);
    carved(leg,mirror('-8,1 -5,4 3,4.5 7,1.2 8,-8 6.2,-17 4.5,-22 -5.4,-23 -8,-18 -8.4,-10',side),trousers||fur,deep,0,{depth:6,rim:.80,crease:[2,0]});
    carved(leg,mirror('-6,-19.3 3.9,-19 8.2,-22 12.9,-25 14,-28 11.5,-29.9 3,-30.6 -6.8,-29.9 -9,-27 -8.8,-22.8',side),deep,'#333637',1.8,{depth:4,rim:.78});
    for(const x of [5,8.4,11.3])stem(leg,x*side,-25,(x+.9)*side,-27.8,4.1,.42,'#847b68');
    legs.push(leg);
    const shoulder=at(g,side*25.5,70.8,3.6),elbow=at(shoulder,0,-16,1.50);
    carved(shoulder,mirror('-6.4,2 -5.3,6 0,9 6,8.4 10.1,4.2 11,-3.7 9.4,-10.1 6.1,-17 0,-18.2 -5.5,-14.6 -7.5,-7',side),fur,deep,0,{depth:6,rim:.9,crease:[1,0]});
    paper(shoulder,mirror('-6.1,-10.7 8.4,-10 6.5,-14.5 -.2,-16.3 -5.6,-14.3',side),coat,'#4f6063',3.0,.46);
    carved(elbow,mirror('-5.5,3 3.1,3.5 6.8,1 7.3,-6.4 6.2,-10.9 8,-13.4 7,-17.3 3.3,-20.8 -3,-21 -7.3,-18.5 -8.6,-14.6 -7,-9',side),fur,deep,1.3,{depth:5,rim:.80,crease:[.2,0]});
    for(const x of [-3.8,0,3.4])stem(elbow,x*side,-16.6,(x+.4)*side,-19.3,4.0,.31,'#94856e');
    arms.push(shoulder);elbows.push(elbow);
  }
  return {head,eyes:eye,mouth:at(head,7.5,10.2,10.6),legs,elbows,armL:arms[0],armR:arms[1],rest:[-.24,.25]};
}
const patterns={otter,squirrel,badger,hare,owl,bear,buffalo:banquetHost};
export function buildSupportingResident(parent,key,short,coat,trousers,helpers) {
  const g=helpers.at(parent);
  if(short)g.scale.setScalar(.865);
  return patterns[key](g,art(helpers),coat,trousers);
}
