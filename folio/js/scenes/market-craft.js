// Hand-operated pieces in the market and model workshop. A half-open fold can
// reverse immediately; the same cut paper returns to its printed place on replay.
import { T, C, keep, box, disc, poly } from '../paper.js';

export function foldTravel(value, from, to) {
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}

// Two creases follow the lip of the vessel to the real cup, even when the
// spout and the cup belong to different hinges.
export function paperStream(parent, ink, highlight, width = .023) {
  const ribbon = keep(parent);
  const strips = [1, .72].map(taper => {
    const strip = keep(ribbon);
    const w = width * taper;
    poly(strip, [[-.60*w,0],[.60*w,0],[.36*w,1],[-.34*w,1]], .005, ink);
    poly(strip, [[-.52*w,0],[-.09*w,0],[.09*w,1],[-.27*w,1]], .002, highlight, 0, 0, .005);
    return strip;
  });
  ribbon.visible = false;
  const up = new T.Vector3(0, 1, 0);
  const elbow = new T.Vector3(), vector = new T.Vector3();
  return {
    hide() { ribbon.visible = false; },
    pour(from, to, fullness = 1) {
      ribbon.visible = fullness > .01;
      if (!ribbon.visible) return;
      elbow.copy(from).lerp(to, .53);
      elbow.y = from.y * .70 + to.y * .30;
      for (let i = 0; i < 2; i++) {
        const start = i ? elbow : from, end = i ? to : elbow, strip = strips[i];
        vector.subVectors(end, start);
        const length = vector.length();
        strip.position.copy(start);
        strip.scale.set(fullness, length, 1);
        if (length > .0001) strip.quaternion.setFromUnitVectors(up, vector.divideScalar(length));
      }
    },
  };
}

export function steamCurl(parent) {
  const shape=[[-.016,0],[-.044,.071],[-.014,.137],[.041,.191],[.052,.234],[.022,.291],[-.013,.32],[.008,.298],[.022,.248],[.008,.213],[-.050,.155],[-.072,.092],[-.054,.038]];
  poly(parent,shape,.012,'#ecdfbf');
  poly(parent,[[-.048,.068],[-.035,.117],[.025,.183],[.047,.227],[.032,.171],[-.011,.120]],.005,'#c7bda3',0,0,.013);
}

export function storyCaption(state, opening, decision, diary) {
  if (state.phase === 'intro' || state.phase === 'ready') return opening;
  if (state.phase === 'touch' && !state.busy) return decision;
  if (state.phase === 'done') return '今天學到：' + diary;
  return '';
}

export function paperMechanism(S, node, options, pose) {
  const { id, label, duration = .85, sound = 'tick', measure } = options;
  const travel = { value: 0 };
  let open = false;
  let drawn = -1;
  function draw() {
    if (drawn === travel.value) return;
    drawn = travel.value;
    pose(drawn);
  }
  function reset() {
    open = false;
    travel.value = 0;
    drawn = -1;
    draw();
  }
  reset();
  S.on('reset', reset);
  S.tick(draw);
  S.curio(node, {
    id, label, quiet: true,
    tap() {
      open = !open;
      measure?.(open);
      S.sound(sound);
      const to = Number(open);
      if (S.stage.still.matches) {
        travel.value = to;
        draw();
      } else {
        S.to(travel, { value: to }, duration, 'inOut');
      }
    },
  });
}

// A four-petal Taiwanese cement tile printed in two inks on a square of paper.
export function flowerTile(g, x, y, z, size, field, ink) {
  box(g, x, y, z, size, size, .034, field);
  const at = z + .018;
  const leaf = [[0, .04], [-.12, .23], [0, .44], [.12, .23]].map(([a,b]) => [a * size, b * size]);
  for (let i = 0; i < 4; i++) poly(g, leaf, .006, ink, x, y, at).rotation.z = Math.PI * i / 2;
  disc(g, x, y, at + .008, size * .072, C.gold, .012, 8);
}
