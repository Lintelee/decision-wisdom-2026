// Use the original paper dies for a crowd or a block print. Copies share one
// body mesh and three hinges per species, so a packed stand costs four draws per seat.
import { group, keep, seal } from './paper.js';
import { buildResident } from './resident-puppets.js';

const masters = new Map();
function masterFor(species) {
  if (masters.has(species)) return masters.get(species);
  const working = group(), rig = buildResident(working,species,false);
  const joints = [rig.head,rig.armL,rig.armR];
  joints.forEach(joint => working.attach(joint));
  working.traverse(piece => { piece.userData.keep = false; });
  [rig.armL.rotation.z,rig.armR.rotation.z] = rig.rest;
  joints.forEach((joint,i) => {
    joint.userData.keep = true;
    joint.name = ['頭','左肩','右肩'][i];
  });
  seal(working);
  const master = keep(null);
  master.name = '街坊紙樣・' + species;
  master.add(working.children.find(part => part.userData.sealed));
  for (const joint of joints) {
    const hinge = joint.clone(false);
    hinge.add(joint.children.find(part => part.userData.sealed));
    master.add(hinge);
  }
  masters.set(species,master);
  return master;
}
export function streetFigure(species) {
  return masterFor(species).clone();
}
export function printedHead(species) {
  const head = masterFor(species).getObjectByName('頭').clone();
  head.position.set(0,0,0);
  return head;
}
