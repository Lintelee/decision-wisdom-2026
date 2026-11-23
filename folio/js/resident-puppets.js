// The patterns use hundredths of a scene unit, measured up from a paper hinge.
// The same knife edge and folded stock are used for a leading role and a passer-by.
import { puppetPaper as cutters } from './puppet-paper.js';
import { buildKeeperResident } from './lantern-keeper-puppets.js';
export { puppetPaper } from './puppet-paper.js';
import { lampPatterns } from './lamp-rig.js';
import { leadPatterns } from './lead-puppets.js';
import { isSupportingResident, buildSupportingResident, makeOtterHead } from './support-puppets.js';
import { buildTempleResident } from './temple-puppets.js';
import { buildTempleDog } from './temple-dog.js';

const {at}=cutters;
const animals={
  leopard:{name:'街報記者小照',cloth:'#475e53'},
  magpie:{name:'染坊對色師小靛',cloth:'#485d83'},
  frog:{name:'雨衣改衣師點點',cloth:'#af6147'},
  civet:{name:'採買人阿梅姨',cloth:'#935f69'},
  lamp:{name:'巡燈員一眨'},
  dog:{name:'臺灣犬陣頭師兄'},
  pangolin:{name:'穿山甲師傅・竹燈骨師傅'},
  glider:{name:'白面鼯鼠'},
  bear:{name:'臺灣黑熊',cloth:'#596c7d'},
  buffalo:{name:'作東的水牛伯',cloth:'#88483f'},
  macaque:{name:'臺灣獼猴獅頭手',cloth:'#b05d43'},
  barbet:{name:'五色鳥鼓手',cloth:'#435d78'},
  otter:{name:'水獺',cloth:'#628074'},
  owl:{name:'角鴞',cloth:'#52697a'},
  hare:{name:'野兔',cloth:'#879c8c'},
  squirrel:{name:'赤腹松鼠',cloth:'#a07561'},
  badger:{name:'鼬獾',cloth:'#67717d'}
};
export const hasResident=key=>Object.hasOwn(animals,key);
export const residentName=key=>animals[key].name;
const lead=leadPatterns(cutters);
const { lampPattern, lightingTechnician }=lampPatterns(cutters);
export { lampPattern };

export function buildOtterPortrait(parent) {
  return makeOtterHead(parent,cutters);
}
export function buildResident(g,key,short,coat=animals[key].cloth,trousers) {
  if(key==='dog')return buildTempleDog(g);
  if(key==='pangolin'||key==='glider')return buildKeeperResident(g,key);
  if(key==='lamp')return lightingTechnician(g,short);
  if(key==='macaque'||key==='barbet')return buildTempleResident(g,key,short,cutters);
  if(isSupportingResident(key))return buildSupportingResident(g,key,short,coat,trousers,cutters);
  const head=at(g,0,short?60.5:79,1.0);
  const features=lead.face(head,key);
  const base=lead.tail(g,key,short),legs=[lead.leg(g,key,-1,short),lead.leg(g,key,1,short)];
  lead.outfit(g,key,short);
  const left=lead.arm(g,key,-1,short),right=lead.arm(g,key,1,short);
  const fan=key==='magpie'?lead.fan(right.elbow):null;
  const rest={leopard:[.42,-.44],magpie:[-.19,.64],frog:[-.32,.58],civet:[-.34,.39]}[key];
  return {head,...features,armL:left.joint,armR:right.joint,tail:base,legs,elbows:[left.elbow,right.elbow],fan,rest};
}
export function poseResident(p,t,step,quiet) {
  const r=p.rig,sway=quiet?0:Math.sin(t*1.7);
  if(r.tail)r.tail.rotation.z=sway*.037+step*.047;
  if(r.fan)r.fan.rotation.z=sway*.029+(p.mood==='cheer'?.15:0);
  if(r.poseClaws) {
    r.armL.rotation.x=r.armL.rotation.y=r.armR.rotation.x=r.armR.rotation.y=0;
    r.poseClaws();
  }
  r.legs.forEach((l,i)=>{l.rotation.z=step*(i?-.15:.15);});
  r.elbows.forEach((j,i)=>{
    const bend=(i?1:-1)*(.035+(i&&p.waveT>0?.18:0)+(p.mood==='doubt'?.055:0));
    j.rotation.set(0,0,(r.elbowRest?.[i] || 0)+bend);
  });
  r.spreadMembranes?.();
}
