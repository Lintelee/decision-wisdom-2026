// Stage details stay on their own glue tabs or on the object that carries them.
// The lights use the moving physical prop as their target, including during a drag.
import { T, keep, tri, quad, poly, box, cyl, disc, beam, ball, ring, tab } from './paper.js';

const TAU = Math.PI * 2;
const prop = (S, id) => S.props.find((item) => item.id === id)?.node;
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

function piece(S, name, x, z, draw) {
  return S.plant(x, z, (g) => {
    g.name = name;
    draw(g);
  });
}

const smooth = x => { x = clamp(x); return x*x*(3-2*x); };
function handMotion(S, node, id, label, sound, duration) {
  const motion = { u:1, visit:0, still:false };
  S.discovery(node, { id, label, sound, duration,
    draw(u, visit, still) { Object.assign(motion,{u,visit,still}); },
    reset() { motion.visit=0; motion.u=1; }
  });
  return motion;
}
// A latch keeps its new position until touched again, including with reduced motion.
function latch({u,visit,still}) {
  if (!visit) return 0;
  const travel = still ? Number(u >= .16) : smooth(u);
  return visit % 2 ? travel : 1-travel;
}

// The two facets meet at a raised score line. Silver and ochre facets remain legible
// in the software paper renderer as well as under the real scene light.
function crease(g, a, b, ridge, tip, front, shade) {
  tri(g, a, ridge, tip, front);
  tri(g, ridge, b, tip, shade);
}

function hoopedLine(g, pts, thickness, ink) {
  for (let i = 1; i < pts.length; i++) beam(g, pts[i - 1], pts[i], thickness, ink, 5);
}

function paperGull(g, size) {
  const bird = keep(g);
  bird.scale.setScalar(size);
  const back = [0, 0.088, 0.07],
    belly = [0, -0.085, 0.055];
  for (const side of [-1, 1]) {
    const flank = [side * 0.083, -0.005, -0.06];
    tri(bird, [0, 0.005, -0.25], flank, back, '#d3cfb6');
    tri(bird, back, flank, [0, 0.072, 0.235], '#fbf1cf');
    tri(bird, [0, 0.072, 0.235], flank, belly, '#e4d6ab');
    tri(bird, [0, 0.005, -0.25], belly, flank, '#a99f83');
    crease(
      bird,
      [0, 0.026, -0.14],
      [side * 0.025, -0.01, -0.11],
      [side * 0.05, 0.024, -0.23],
      [side * 0.1, 0.032, -0.33],
      '#eee4c5',
      '#b9ae91'
    );
  }
  crease(bird, [-0.023, 0.056, 0.2], [0.023, 0.056, 0.2], [0, 0.083, 0.24], [0, 0.045, 0.32], '#d4a059', '#977349');
  const wings = [-1, 1].map((side) => {
    const joint = keep(bird, side * 0.037, 0.025, -0.008);
    const leading = [side * 0.31, 0.092, 0.09],
      trailing = [side * 0.27, 0.059, -0.096];
    const fold = [side * 0.29, 0.105, 0.004];
    crease(joint, [0, 0, 0.09], [0, -0.02, -0.13], fold, leading, '#f7f0d4', '#d8cfaf');
    quad(joint, [0, -0.02, -0.13], trailing, fold, leading, '#d0c9ab');
    crease(
      joint,
      leading,
      trailing,
      [side * 0.45, 0.099, -0.031],
      [side * 0.61, 0.052, -0.126],
      '#edead5',
      '#889392'
    );
    tri(joint, [side * 0.47, 0.08, -0.042], [side * 0.45, 0.077, -0.082], [side * 0.61, 0.053, -0.126], '#626e70');
    return joint;
  });
  return { bird, wings };
}

function harbor(S, track) {
  // The near bird skims in front of the ferry mast; its partner returns behind the pier.
  let pair;
  [
    [-1.65, -0.63, 1.02, 0],
    [0.95, -2.32, 0.67, 2.35]
  ].forEach(([x, z, size, offset], i) => {
    piece(S, i ? '遠岸折翼海鷗' : '貼著船舷飛的海鷗', x, z, (g) => {
      const { bird, wings } = paperGull(g, size);
      if (!i) {
        S.pad(bird,.24);
        pair = handMotion(S, bird, 'gull-bank', '領飛的紙海鷗', n => n%2 ? 'wing-flit' : 'gull', 1.7);
      }
      track((t) => {
        const a = t * (i ? 0.28 : 0.39) + offset, flap = t*4.1 + offset;
        const delay = i ? .19 : 0;
        const response = clamp((pair.u-delay)/(1-delay));
        const bank = pair.still ? Number(response>.1 && response<.9)*.58 : Math.sin(Math.PI*response);
        const lift = pair.visit ? bank : 0;
        const rx = i ? 1.46 : 2.04,
          rz = i ? 0.54 : 0.99;
        bird.position.set(
          Math.sin(a)*rx + (i ? -.96 : .66)*lift,
          (i ? 2.39 : 2.92) + Math.sin(a*2)*.16 + (i ? .56 : .39)*lift,
          Math.cos(a)*rz + (i ? .36 : -.24)*lift
        );
        bird.rotation.y = Math.atan2(Math.cos(a) * rx, -Math.sin(a) * rz);
        bird.rotation.z = 0.23 * Math.sin(a) + 0.34 * lift;
        const beat = 0.12 + 0.24 * Math.pow(0.5 + 0.5 * Math.cos(a * 2.3), 2);
        wings.forEach((wing, n) => {
          const stroke = pair.still ? .35 : .52*Math.cos(4*Math.PI*response);
          wing.rotation.z = (n ? 1 : -1) * (.11 + Math.sin(flap)*beat + lift*stroke);
        });
      });
    });
  });
  const tower = prop(S, 'harbour-lens');
  const lens = tower?.children.find((part) => part.userData.keep && part.isGroup);
  const shafts = lens?.children.find((part) => part.userData.keep && part.isGroup);
  if (lens && shafts) {
    // This is the harbour's existing clockwork Fresnel. Its cut-paper rays and the
    // physical light rotate about the same axle when the reader winds the tower.
    const swivel = keep(lens),
      aim = keep(swivel, 3.86, -0.49, 0);
    const search = flood(swivel, aim, '引航燈掃過的船舷', '#ffdb90', [0.225, 0.005, 0], 3.55, 6.1, 0.23);
    track((t) => {
      swivel.rotation.y = shafts.visible ? 0 : -0.49 - 0.35 * Math.sin(t * 0.55);
      search.intensity = shafts.visible ? 8.4 : 3.55;
    });
    const hull = S.spread.group.getObjectByName('啟程港・晨班渡輪');
    illuminatePaper(S, track, search, [hull]);
  }
}

function proofs(S, track) {
  // A drying pair in the studio yard: the same little hat above two different faces.
  piece(S, '相館的晾相繩', 3.72, -0.96, (g) => {
    const knots = [
      [-0.75, 1.62, -0.035],
      [0, 1.5, 0.02],
      [0.75, 1.62, -0.035]
    ];
    for (const p of [knots[0], knots[2]]) {
      beam(g, [p[0], 0, p[2]], [p[0], p[1] + 0.12, p[2]], 0.028, '#907452');
      tab(g, 0.23);
    }
    hoopedLine(g, knots, 0.012, '#7c6d54');
    const pair = keep(g,0,1.55,.045);
    const sheets = [-1, 1].map((side, i) => {
      const k = keep(pair, side * 0.34, 0, 0);
      const edge = [
        [-0.21, 0],
        [0.205, 0],
        [0.2, -0.51],
        [-0.2, -0.48]
      ];
      poly(k, edge, 0.017, '#e4d4b4');
      poly(
        k,
        [
          [-0.176, -0.044],
          [0.17, -0.044],
          [0.16, -0.394],
          [-0.17, -0.386]
        ],
        0.006,
        i ? '#82948f' : '#a69e88',
        0,
        0,
        0.018
      );
      poly(
        k,
        [
          [-0.14, -0.37],
          [-0.11, -0.29],
          [-0.044, -0.23],
          [0.055, -0.23],
          [0.11, -0.28],
          [0.14, -0.37]
        ],
        0.006,
        '#626e65',
        0,
        0,
        0.025
      );
      disc(k, 0, -0.207, 0.03, i ? 0.062 : 0.079, '#d3b493', 0.008, 10);
      poly(
        k,
        [
          [-0.094, -0.16],
          [-0.061, -0.15],
          [-0.047, -0.119],
          [0.043, -0.119],
          [0.069, -0.155],
          [0.103, -0.16],
          [0.09, -0.17],
          [-0.095, -0.17]
        ],
        0.009,
        '#cead69',
        0,
        0,
        0.04
      );
      box(k, -0.01, 0.006, 0.055, 0.038, 0.09, 0.044, '#be965f').rotation.z = -0.07 * side;
      const negative = keep(k,0,0,-.018);
      negative.rotation.y = Math.PI;
      box(negative,0,-.23,0,.37,.43,.013,'#39494a');
      disc(negative,0,-.18,.014,.068,'#dcd8b3',.008,10);
      poly(negative,[[-.13,-.36],[-.08,-.26],[.065,-.235],[.14,-.36]],.008,'#d2cfac',0,0,.014);
      for(const x of [-.156,.156]) for(let n=0;n<4;n++) box(negative,x,-.072-n*.096,.019,.022,.036,.008,'#eadab7');
      S.pad(k,.21,[0,-.22,0]);
      return k;
    });
    const turn = handMotion(S,pair,'proof-breeze','相繩上的正片與底片','paper',.72);
    track((t) => {
      sheets.forEach((s, i) => {
        const old=Number(turn.visit>0 && (turn.visit-1)%3===i+1), next=Number(turn.visit%3===i+1);
        const spin=turn.still ? Number(turn.u>.13) : smooth(turn.u);
        s.rotation.y=Math.PI*(old+(next-old)*spin)*(i?1:-1);
        s.rotation.x = -.12 - .095*Math.sin(t*1.14+i*.86);
        s.rotation.z = Math.sin(t * 0.71 + i) * 0.039;
      });
    });
  });
  const flash = prop(S, 'flash'),
    glow = flash?.children.find((c) => c.userData.raw);
  if (flash && glow) {
    const bulb = new T.PointLight('#fff0d3', 0, 5, 1.45);
    bulb.name = '閃光燈照亮相館';
    bulb.position.set(0, 0.36, 0.23);
    flash.add(bulb);
    track(() => {
      bulb.intensity = glow.visible ? 7 : 0;
    });
  }
}

function windsock(S, track) {
  piece(S, '標槍場的風向袋', 3.18, 0.12, (g) => {
    tab(g, 0.31);
    beam(g, [0, 0, 0], [0, 1.81, 0], 0.025, '#897650');
    cyl(g, 0, 0.078, 0, 0.104, 0.143, 0.147, '#a19a76', 7);
    const swivel = keep(g, 0, 1.71, 0),
      sock = keep(swivel, 0.036, 0, 0);
    ring(sock, 0, 0, 0, 0.143, 0.014, '#d9b56b', 12).rotation.y = Math.PI / 2;
    const rings = [
      [0, 0.147, 0],
      [0.18, 0.136, -0.025],
      [0.38, 0.12, -0.065],
      [0.58, 0.085, -0.113],
      [0.78, 0.055, -0.19]
    ];
    for (let j = 0; j < rings.length - 1; j++) {
      const at = (part, k) => {
        const [x, r, y] = rings[part],
          a = (k * TAU) / 8;
        return [x, y + Math.cos(a) * r, Math.sin(a) * r];
      };
      for (let k = 0; k < 8; k++)
        quad(
          sock,
          at(j, k),
          at(j + 1, k),
          at(j + 1, k + 1),
          at(j, k + 1),
          j % 2 ? (k < 3 ? '#f1deac' : '#c0b488') : k < 3 ? '#c87553' : '#a35943'
        );
    }
    S.pad(sock,.25,[.37,0,0]);
    const wind = handMotion(S,swivel,'wind-direction','風向袋的轉軸','cloth',1.05);
    track((t) => {
      const reverse=latch(wind);
      const puff=wind.visit && !wind.still ? Math.sin(Math.PI*wind.u) : 0;
      swivel.rotation.y = .24*Math.sin(t*.74)-.42 + reverse*Math.PI*.84;
      sock.scale.x=1+.36*puff; sock.scale.y=1+.20*puff;
      sock.rotation.z = -.03 + .068*Math.sin(t*1.63) + .25*puff;
      sock.rotation.x = Math.sin(t * 2.1) * 0.08;
    });
  });
}

function rainchain(S, track) {
  piece(S, '試雨棚簷的鍊桶', 4.3, 0.36, (g) => {
    const postX = 0.36;
    tab(g, 0.45);
    cyl(g, postX, 0.93, -0.09, 0.028, 0.039, 1.86, '#647d76', 7);
    beam(g, [postX, 1.75, -0.09], [0, 1.75, 0.045], 0.031, '#74877d');
    for (let k = 0; k < 7; k++) {
      const y = 1.6 - k * 0.166;
      const r = ring(g, 0, y, 0.044, 0.059, 0.009, '#947c58', 10);
      r.rotation.y = k % 2 ? 0.98 : -0.33;
      if (k % 2 === 0) cyl(g, 0, y - 0.04, 0.044, 0.064, 0.029, 0.092, '#ac9670', 7);
    }
    const water = '#91bdb4';
    const tray=keep(g,0,.021,.044);
    cyl(tray,0,.044,0,.255,.205,.085,'#9c8260',12);
    const surface=keep(tray,0,.078,0);
    cyl(surface,0,0,0,.221,.205,.012,'#84aaa5',12);
    ring(tray,0,.088,0,.247,.014,'#d8b889',14).rotation.x=Math.PI/2;
    const leaf=keep(surface,.085,.018,.015);
    crease(leaf,[-.065,0,.034],[-.065,0,-.035],[-.035,.019,0],[.069,.001,-.004],'#c9974e','#e1b571');
    const rings = [0, 1].map(() => {
      const k = keep(surface, 0, .012, 0);
      ring(k, 0, 0, 0, 0.173, 0.009, '#dce4cf', 18).rotation.x = Math.PI / 2;
      return k;
    });
    const drops = [0, 1, 2].map(() => {
      const d = keep(g, 0, 0, 0.044);
      poly(
        d,
        [
          [0, 0.051],
          [0.021, 0.003],
          [0.014, -0.021],
          [-0.009, -0.028],
          [-0.026, -0.004]
        ],
        0.013,
        water
      );
      return d;
    });
    S.pad(tray,.27);
    const rain=handMotion(S,g,'rain-chain','集雨鏈下的接水盤','rain-chain',1.14);
    track((t) => {
      const run=rain.visit && rain.u<1;
      drops.forEach((d, i) => {
        let u = run ? clamp((rain.u-i*.13)/.48) : (t*.87+i/3)%1;
        if (run && rain.still) u = rain.u < .44 ? .23+i*.21 : 1;
        d.position.y = run ? 1.55-1.43*u*u : .69-.57*u*u;
        d.visible=!run || (u>0 && u<1);
        d.scale.y = 1 + u * 0.67;
      });
      rings.forEach((r, i) => {
        const u = run ? clamp((rain.u-.46-i*.10)/.38) : (t*1.31+i*.5)%1;
        r.scale.set(0.32 + u, (1 - u) * 0.68, 0.32 + u);
        r.visible = u>0 && u<.96;
      });
      const trail = !rain.visit?0:(rain.visit-1+smooth((rain.u-.4)/.48))*.97;
      leaf.position.set(.103*Math.cos(trail),.018,.072*Math.sin(trail));
      leaf.rotation.y=-trail;
    });
  });
}

function fryer(S, track) {
  const wok = prop(S, 'wok');
  if (!wok) return;
  const fan = keep(wok, -0.455, 0.045, -0.055);
  fan.name = '灶邊的竹編扇';
  beam(fan, [0, 0, 0], [0, -0.388, 0.035], 0.021, '#76664a');
  const points = [
    [-0.026, -0.34],
    [-0.116, -0.292],
    [-0.191, -0.206],
    [-0.171, -0.094],
    [-0.073, -0.046],
    [0.058, -0.046],
    [0.158, -0.111],
    [0.187, -0.208],
    [0.116, -0.288],
    [0.024, -0.344]
  ];
  poly(fan, points, 0.023, '#d3af73', 0, 0.037, 0.025);
  for (let k = -2; k <= 2; k++) {
    const x = k * 0.056;
    beam(fan, [0, -0.289, 0.054], [x, -0.177 + Math.abs(k) * 0.003, 0.058], 0.005, '#947646', 4);
    beam(
      fan,
      [x, -0.177 + Math.abs(k) * 0.003, 0.058],
      [x * 1.11, -0.046 - Math.abs(k) * 0.034, 0.056],
      0.005,
      '#947646',
      4
    );
  }
  const slick = keep(wok, 0, 0.203, 0);
  slick.name = '鍋沿上的油光';
  for (const [r, a] of [
    [0.27, 0.3],
    [0.235, 2.72],
    [0.21, 4.18]
  ]) {
    const p = [];
    for (let i = 0; i < 5; i++) {
      const th = a + i * 0.14;
      p.push([r * Math.cos(th), 0.002, r * Math.sin(th)]);
    }
    hoopedLine(slick, p, 0.006, '#f9d88e');
  }
  const fire = new T.PointLight('#ff9e44', 0.7, 1.55, 1.2);
  fire.name = '爐口的反光';
  fire.position.set(0.09, 0.1, 0.21);
  wok.add(fire);
  const ember=keep(wok,.06,.025,.23);
  for(const [x,h] of [[-.11,.11],[0,.17],[.09,.09]]) {
    crease(ember,[x-.05,0,0],[x+.05,0,0],[x,.035,.025],[x+.037,h,0],'#dc8a43','#f2b257');
  }
  const fanStroke=handMotion(S,fan,'stove-fan','灶邊的竹編扇','cloth',1.12);
  track((t) => {
    const stroke = fanStroke.still ? .49 : .65*Math.sin(TAU*fanStroke.u*(fanStroke.visit%2 ? 2 : 3));
    const f = fanStroke.visit && fanStroke.u<1 ? (fanStroke.still ? .65 : Math.sin(Math.PI*fanStroke.u)) : 0;
    fan.rotation.z = -.5+.11*Math.sin(t*1.2)+f*stroke;
    fan.rotation.x = 0.14 + 0.06 * Math.cos(t * 0.66);
    slick.rotation.y = 0.16 * Math.sin(t * 1.02);
    fire.intensity = .51+.09*Math.sin(t*4.12)+f*2.2;
    ember.visible=f>.04; ember.scale.y=.7+f*1.1;
  });
}

function courtyard(S, track) {
  // The branch overhangs the outer wall. The same sun that lights the paper portrait
  // casts moving cut-leaf shadows down its face.
  piece(S, '手印牆旁的桑枝', -4.82, -1.03, (g) => {
    const stem = '#8e7552';
    const arm = keep(g, 0, 1.56, 0);
    hoopedLine(
      g,
      [
        [-0.02, 0.02, 0],
        [-0.07, 0.68, -0.01],
        [0, 1.56, 0]
      ],
      0.038,
      stem
    );
    hoopedLine(
      arm,
      [
        [0, 0, 0],
        [0.045, 0.22, -0.02],
        [0.23, 0.38, -0.06],
        [0.53, 0.53, -0.12],
        [0.81, 0.56, -0.17]
      ],
      0.026,
      stem
    );
    const leaves = [];
    [
      [0.06, 0.19, -0.01, -1],
      [0.16, 0.32, -0.05, 1],
      [0.27, 0.42, -0.07, -1],
      [0.4, 0.48, -0.1, 1],
      [0.54, 0.53, -0.12, -1],
      [0.66, 0.55, -0.15, 1],
      [0.78, 0.56, -0.17, -1]
    ].forEach(([x, y, z, side], i) => {
      const k = keep(arm, x, y, z),
        l = 0.25 + (i % 3) * 0.034;
      const tip = [side * l, -0.08, 0.055];
      crease(
        k,
        [side * 0.09, 0.026, 0.02],
        [side * 0.1, -0.085, 0.035],
        [side * 0.12, -0.024, 0.077],
        tip,
        i % 2 ? '#829470' : '#92a078',
        i % 2 ? '#677c60' : '#718465'
      );
      tri(k, [0, 0, 0], [side * 0.09, 0.026, 0.02], [side * 0.12, -0.024, 0.077], '#a2a782');
      tri(k, [0, 0, 0], [side * 0.12, -0.024, 0.077], [side * 0.1, -0.085, 0.035], '#7e8d65');
      leaves.push(k);
    });
    const beetle=keep(arm,.43,.52,.005);
    beetle.name='桑葉背面的七星瓢蟲';
    const shell=ball(beetle,0,.029,0,.082,'#be5544',0);shell.scale.set(1.08,.57,.87);
    beam(beetle,[-.061,.055,0],[.060,.055,0],.006,'#514139',4);
    ball(beetle,.073,.026,0,.031,'#53463a',0);
    for(const x of [-.032,.018])for(const z of [-.032,.032])ball(beetle,x,.058,z,.012,'#463e3a',0);
    S.pad(arm,.23,[.45,.48,-.06]);
    const turn=handMotion(S,arm,'mulberry-leaf','手印牆邊的桑葉','paper',1.45);
    track((t) => {
      const tilt=latch(turn);
      arm.rotation.z = .025*Math.sin(t*.68)-tilt*.13;
      leaves.forEach((l, i) => {
        l.rotation.x=.1*Math.sin(t*1.32+i*.71)+(i===3?-1.85*tilt:0);
        l.rotation.z = 0.086 * Math.sin(t * 1.05 + i * 0.59);
      });
      beetle.visible=tilt>.10;
      beetle.position.set(.40+.16*tilt,.48+.085*tilt,-.045+.11*tilt);
      beetle.rotation.z=tilt*.39;
    });
  });
}

function liquidCatch(parent, x, y, z, r) {
  const k = keep(parent, x, y, z),
    points = [];
  for (let n = 0; n < 7; n++) {
    const a = 0.19 + n * 0.235;
    points.push([Math.cos(a) * r, 0, Math.sin(a) * r]);
  }
  hoopedLine(k, points, r * 0.057, '#fff0c7');
  return k;
}

function teaCounter(S, track) {
  const tray = prop(S, 'tray');
  if (tray) for (const x of [-0.1, 0.1]) liquidCatch(tray, x, 0.148, 0, 0.035);
  // Tea is weighed in the foreground while the paper neighbourhood waits behind it.
  piece(S, '試茶的竹茶荷', 0.58, 2.16, (g) => {
    tab(g, 0.62);
    box(g, 0, 0.101, 0, 0.77, 0.195, 0.49, '#a09079');
    box(g, 0, 0.216, 0, 0.83, 0.049, 0.55, '#c4ac86');
    const scoop = keep(g, 0, 0.252, 0);
    scoop.rotation.y = -0.49;
    quad(
      scoop,
      [-0.32, 0.028, -0.057],
      [0.24, 0.005, -0.068],
      [0.27, 0.016, 0.044],
      [-0.29, 0.017, 0.059],
      '#d1b783'
    );
    quad(
      scoop,
      [-0.32, 0.028, -0.057],
      [-0.31, 0.094, -0.132],
      [0.21, 0.062, -0.13],
      [0.24, 0.005, -0.068],
      '#dbc799'
    );
    quad(scoop, [-0.29, 0.017, 0.059], [0.27, 0.016, 0.044], [0.235, 0.065, 0.119], [-0.3, 0.082, 0.127], '#b69a6c');
    beam(scoop, [-0.32, 0.057, 0], [-0.45, 0.067, 0], 0.025, '#967a53');
    const leaves = [];
    for (let i = 0; i < 7; i++) {
      const k = keep(scoop, -0.12 + 0.044 * i, 0.041 + (i % 2) * 0.012, -0.023 + (i % 3) * 0.022);
      k.rotation.y = i * 2.18;
      crease(
        k,
        [0, 0, 0],
        [0.005, 0.001, 0.035],
        [0.043, 0.021, 0.014],
        [0.105, 0.004, 0.022],
        i % 2 ? '#686a44' : '#788256',
        '#485d42'
      );
      leaves.push(k);
    }
    const cup=keep(g,.34,.249,.16);
    cyl(cup,0,.055,0,.135,.088,.10,'#a0b6a9',10);
    cyl(cup,0,.11,0,.133,.134,.013,'#d3d5b6',10);
    ring(cup,0,.121,0,.128,.009,'#e9d7ae',12).rotation.x=Math.PI/2;
    const homes=leaves.map(k=>k.position.clone()), a=new T.Vector3(), b=new T.Vector3();
    leaves.forEach(k=>g.add(k));
    const pour=handMotion(S,scoop,'tea-scoop','竹茶荷與盛葉的小盞','tea-leaves',1.26);
    S.curio(cup,{id:'leaf-cup',label:'接茶葉的小瓷盞',tap:()=>S.props.find(p=>p.id==='tea-scoop').tap()});
    track((t) => {
      const pouring=Boolean(pour.visit%2), lift=pour.visit && !pour.still ? Math.sin(Math.PI*pour.u) : 0;
      scoop.rotation.z=.018*Math.sin(t*.91)-(pouring ? .42 : 0)*lift;
      cup.rotation.z=(pouring?0:.62)*lift;
      scoop.position.y=.252+(pouring ? .21 : 0)*lift;
      cup.position.y=.249+(pouring?0:.22)*lift;
      scoop.updateMatrix(); cup.updateMatrix();
      leaves.forEach((k,i)=>{
        const p=pour.still?Number(pour.u>.18):smooth((pour.u-.09-i*.035)/.54);
        const travel=!pour.visit?0:pouring?p:1-p;
        a.copy(homes[i]).applyMatrix4(scoop.matrix);
        b.set((i%3-1)*.038,.124+(i%2)*.015,(Math.floor(i/3)-1)*.029).applyMatrix4(cup.matrix);
        k.position.lerpVectors(a,b,travel);
        k.position.y+=.17*Math.sin(Math.PI*travel);
        k.rotation.z=lift*.27*Math.sin(i+3*travel);
      });
    });
  });
}

function flood(parent, target, name, color, position, power, distance, angle, shadows = true) {
  const light = new T.SpotLight(color, power, distance, angle, 0.68, 1.35);
  light.name = name;
  light.position.set(...position);
  light.target = target;
  light.castShadow = shadows;
  if (shadows) {
    light.shadow.mapSize.set(256, 256);
    light.shadow.bias = -0.00065;
    light.shadow.normalBias = 0.012;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = distance;
  }
  parent.add(light);
  return light;
}

// The canvas renderer draws the same folded triangles but has no Three light pass.
// Tint only the facets actually inside the lamp's cone. Geometry and ink for the
// illuminated objects are kept separate, so neighbouring paper stays its printed colour.
function illuminatePaper(S, track, light, receivers) {
  if (!S.stage.renderer.software) return;
  let surfaces,
    lastPaint = -Infinity;
  const source = new T.Vector3(),
    target = new T.Vector3(),
    centre = new T.Vector3();
  const start = new T.Vector3(),
    direction = new T.Vector3(),
    scale = new T.Vector3();
  const outer = Math.cos(light.angle),
    inner = Math.cos(light.angle * (1 - light.penumbra));
  const ink = [light.color.r, light.color.g, light.color.b];
  track(() => {
    if (!S.active || performance.now() - lastPaint < 95) return;
    lastPaint = performance.now();
    if (!surfaces) {
      surfaces = [];
      for (const receiver of receivers.filter(Boolean))
        receiver.traverse((mesh) => {
          if (!mesh.isMesh || mesh.userData.pad || !mesh.geometry.attributes.color) return;
          // The cut-paper library shares its printed hull geometry among the town's
          // boats. Give this one its own triangle colours before painting its sides.
          if (!mesh.userData.sealed) {
            const stock = mesh.geometry;
            mesh.geometry = stock.index ? stock.toNonIndexed() : stock.clone();
          }
          const { position, color } = mesh.geometry.attributes;
          surfaces.push({ mesh, position: position.array, colors: color.array, base: color.array.slice() });
        });
    }
    light.getWorldPosition(source);
    light.target.getWorldPosition(target);
    for (const { mesh, position, colors, base } of surfaces) {
      let visible = true;
      for (let p = mesh; p; p = p.parent)
        if (!p.visible) {
          visible = false;
          break;
        }
      if (!visible) continue;
      mesh.worldToLocal(start.copy(source));
      mesh.worldToLocal(direction.copy(target)).sub(start).normalize();
      mesh.getWorldScale(scale);
      const size = Math.max(0.05, Math.abs(scale.x * scale.y * scale.z) ** (1 / 3));
      for (let j = 0; j < position.length; j += 9) {
        centre
          .set(
            (position[j] + position[j + 3] + position[j + 6]) / 3,
            (position[j + 1] + position[j + 4] + position[j + 7]) / 3,
            (position[j + 2] + position[j + 5] + position[j + 8]) / 3
          )
          .sub(start);
        const localLength = centre.length(),
          distance = localLength * size;
        const cosine = centre.dot(direction) / Math.max(0.0001, localLength);
        const edge = clamp((cosine - outer) / (inner - outer));
        const intensity =
          distance < light.distance
            ? clamp((light.intensity * 0.31 * edge) / (0.8 + distance * distance), 0, 0.62)
            : 0;
        for (let n = 0; n < 9; n++) colors[j + n] = base[j + n] + (1 - base[j + n]) * ink[n % 3] * intensity;
      }
    }
  });
}

function banquet(S, track) {
  // A scalloped tin shade hangs from the dining shelter. A swinging bulb changes which
  // porcelain rims catch its light as the guests turn the serving board underneath.
  const table = prop(S, 'tt') || prop(S, 'sticks');
  if (!table) return;
  piece(S, '辦桌的花邊吊燈', 4.08, -0.91, (g) => {
    tab(g, 0.35);
    beam(g, [0, 0, 0], [0, 2.45, 0], 0.032, '#987e57');
    beam(g, [0, 2.36, 0], [-0.66, 2.36, 0.25], 0.033, '#9b815f');
    const hanger = keep(g, -0.62, 2.36, 0.24);
    beam(hanger, [0, 0, 0], [0, -0.3, 0], 0.012, '#665d50');
    const shade = keep(hanger, 0, -0.37, 0);
    cyl(shade, 0, 0.06, 0, 0.062, 0.097, 0.09, '#766e5a', 8);
    for (let i = 0; i < 10; i++) {
      const v = (r, y, j) => [r * Math.sin((j * TAU) / 10), y, r * Math.cos((j * TAU) / 10)];
      quad(
        shade,
        v(0.07, 0.05, i),
        v(0.07, 0.05, i + 1),
        v(0.237, -0.105, i + 1),
        v(0.237, -0.105, i),
        i % 2 ? '#ae7660' : '#c78768'
      );
      tri(shade, v(0.237, -0.105, i), v(0.237, -0.105, i + 1), v(0.254, -0.142, i + 0.5), '#bc9671');
    }
    ball(shade, 0, -0.08, 0, 0.099, '#ffdfa0', 1);
    const aim = keep(g, -1.15, 0.64, 0.88);
    const light = flood(shade, aim, '吊燈落在桌面上的光', '#ffd48a', [0, -0.16, 0], 5.0, 3.9, 0.57);
    const swing=handMotion(S,shade,'supper-lamp','辦桌的花邊吊燈','tin-tap',1.6);
    track((t) => {
      const f=swing.visit && swing.u<1 ? swing.still ? .31 : .51*Math.exp(-2*swing.u)*Math.sin(TAU*1.8*swing.u) : 0;
      hanger.rotation.z=.035*Math.sin(t*1.65)+f*(swing.visit%2?1:-1);
      hanger.rotation.x = 0.032 * Math.cos(t * 1.37);
      light.intensity=5+Math.abs(f)*8;
      aim.position.x = -1.15 + hanger.rotation.z * 3.65;
      aim.position.z = 0.88 - hanger.rotation.x * 2.05;
    });
    illuminatePaper(S, track, light, [table]);
  });
}

function lionFloor(S, track) {
  const cloth = prop(S, 'lion');
  if (!cloth) return;
  // The rhythm is read on the ground, beside the two performers' feet. Ready-loop
  // timing mirrors their first attempted jump; it stops as soon as the story starts.
  piece(S, '高凳前的兩道鞋印', 0.83, 0.79, (g) => {
    const marks = [-0.47, 0.5].map((x, n) => {
      const scuff = keep(g, x, 0.03, 0.18);
      for (let j = 0; j < 3; j++) {
        const at = [0.13 * j - 0.17, 0.001 + j * 0.001, 0.09 + j * 0.026];
        poly(
          scuff,
          [
            [-0.095, 0],
            [-0.015, 0.025],
            [0.069, 0.008],
            [0.11, -0.006],
            [0.021, 0],
            [-0.051, -0.012]
          ],
          0.006,
          j === 1 ? '#b39273' : '#d5b58d',
          ...at
        ).rotation.x = -Math.PI / 2;
      }
      const dust = keep(g, x, 0, 0.17);
      for (let j = 0; j < 3; j++) {
        const m = ball(dust, (j - 1) * 0.06, (j % 2) * 0.02, 0.03 * j, 0.016 + j * 0.004, '#d6ba93', 0);
        m.scale.set(1.45, 0.66, 1);
      }
      return { scuff, dust, n };
    });
    let attempt = 0;
    track((_, dt) => {
      const opening = S.view().buttons?.[0]?.id === 'go';
      attempt = opening ? (attempt + dt) % 3.8 : 0;
      marks.forEach(({ dust, n }) => {
        const phase = attempt / 3.8 - (n ? 0.67 : 0.59),
          p = clamp(phase / 0.16);
        dust.visible = opening && p > 0 && p < 1;
        if (dust.visible) {
          dust.position.y = 0.03 + 0.13 * Math.sin(Math.PI * p);
          dust.position.x = (n ? 0.5 : -0.47) + p * 0.16;
          dust.scale.setScalar(1 - p * 0.78);
        }
      });
    });
  });
}

function fruitStall(S, track) {
  const wedge = prop(S, 'plug');
  if (!wedge) return;
  // The wet seed marks are attached to the newly exposed side of the very slice
  // the reader pulls. Its green skin keeps these marks hidden until it comes out.
  for (const [x, y] of [
    [-0.07, 0.027],
    [0.051, 0.042],
    [-0.005, -0.061]
  ]) {
    poly(
      wedge,
      [
        [-0.012, 0],
        [0.011, 0.004],
        [0.016, 0.011],
        [-0.003, 0.012]
      ],
      0.002,
      '#efae8c',
      x,
      y,
      -0.092
    );
  }
  const flesh = keep(wedge.parent, 0, -0.003, 0.173);
  flesh.name = '瓜肉切面的汁光';
  flesh.visible = false;
  for (const [x, y] of [
    [-0.063, 0.031],
    [0.07, 0.04],
    [0.012, -0.057]
  ]) {
    poly(
      flesh,
      [
        [-0.016, 0],
        [0.016, 0.006],
        [0.022, 0.013],
        [-0.006, 0.011]
      ],
      0.002,
      '#f9c19f',
      x,
      y,
      0
    );
  }
  piece(S, '瓜攤的斜照工作燈', 2.75, 0.04, (g) => {
    tab(g, 0.25);
    beam(g, [0.2, 0, -0.06], [0.2, 1.74, -0.06], 0.031, '#726c56');
    beam(g, [0.2, 1.7, -0.06], [-0.19, 1.85, 0.19], 0.029, '#82745d');
    const shade = keep(g, -0.19, 1.84, 0.19);
    shade.rotation.z = -0.36;
    cyl(shade, 0, -0.072, 0, 0.087, 0.18, 0.155, '#78877c', 10);
    cyl(shade, 0, -0.153, 0, 0.148, 0.148, 0.012, '#efcf8f', 10);
    const receiver = keep(wedge.parent, 0, 0.01, 0.19);
    const light = flood(shade, receiver, '瓜皮與切面的側光', '#ffd396', [0, -0.19, 0.045], 2.1, 4, 0.34);
    track((t) => {
      const out = clamp((wedge.position.y + 0.01) / 0.44);
      flesh.visible = out > 0.15;
      light.intensity = 2.1 + out * 1.05;
      shade.rotation.x = 0.021 * Math.sin(t * 1.22);
      // A small reflected fleck on the visible juice never grows beyond the flesh.
      flesh.scale.x = 0.96 + 0.04 * Math.sin(t * 0.88);
    });
    illuminatePaper(S, track, light, [wedge.parent]);
  });
}

function yarn(S, track) {
  piece(S, '染坊的兩絞經線', 3.99, 1.69, (g) => {
    tab(g, 0.63);
    beam(g, [-0.42, 0, 0], [-0.42, 1.23, 0], 0.03, '#9b825d');
    beam(g, [0.42, 0, 0], [0.42, 1.23, 0], 0.03, '#9b825d');
    beam(g, [-0.48, 1.16, 0], [0.48, 1.16, 0], 0.038, '#b59a74');
    const rack=keep(g,0,1.14,.013), strands=[];
    const hanks = [-0.2, 0.22].map((x, i) => {
      const k = keep(rack,x,0,0);
      const hues = i ? ['#d8bf99', '#e1cbab', '#beaa8d'] : ['#526787', '#5e7695', '#414e6e'];
      for (let n = 0; n < 6; n++) {
        const p = [],
          dx = (n - 2.5) * 0.017;
        for (let j = 0; j <= 18; j++) {
          const a = (j * TAU) / 18;
          p.push([
            dx + (0.076 + n * 0.003) * Math.sin(a),
            -0.29 + 0.31 * Math.cos(a),
            0.035 * Math.sin(2 * a + n * 0.21)
          ]);
        }
        const thread=keep(k);
        hoopedLine(thread,p,.008,hues[n%3]);
        strands.push([thread,n,i]);
      }
      const band = box(k, 0, -0.29, 0.005, 0.19, 0.06, 0.086, i ? '#9a7859' : '#bdd1cf');
      band.rotation.z = 0.14;
      return k;
    });
    const open=handMotion(S,rack,'indigo-yarn','一絞藍線與一絞素線','cloth',.95);
    track((t) => {
      const folded=latch(open);
      for(const [thread,n,i] of strands)thread.rotation.z=folded*(n-2.5)*.17*(i?-1:1);
      hanks.forEach((h, i) => {
        h.rotation.y=.16*Math.sin(t*.97+i*.65)+folded*(i ? .41 : -.41);
        h.rotation.z=.046*Math.sin(t*1.19+i);
      });
    });
  });
}

function lanternYard(S, track) {
  const candle = prop(S, 'flame'),
    lift = prop(S, 'lift'), wish=prop(S,'wish');
  if (candle) {
    const orbit = keep(candle, 0, 0.25, 0);
    orbit.name = '繞著案燭的紙蛾';
    const wings = [-1, 1].map((side) => {
      const k = keep(orbit);
      crease(
        k,
        [0, 0, 0.038],
        [0, 0, -0.039],
        [side * 0.085, 0.046, 0.009],
        [side * 0.138, 0.037, -0.03],
        '#eddab4',
        '#cfbc9c'
      );
      tri(k, [0, 0, -0.02], [side * 0.085, 0.023, -0.012], [side * 0.064, 0.012, -0.072], '#b69c81');
      return k;
    });
    beam(orbit, [0, 0, -0.052], [0, 0, 0.054], 0.009, '#8b6c52');
    const glow = new T.PointLight('#ffc67f', 0.49, 1.58, 1.25);
    glow.name = '案燭照亮未寫完的願望紙';
    glow.position.set(0, 0.16, 0.015);
    candle.add(glow);
    S.pad(orbit,.105);
    const land=handMotion(S,orbit,'lantern-moth','繞著燭火的紙蛾','wing-flit',1.02);
    const perch = new T.Vector3();
    track((t) => {
      const a = t * 1.64, rest=latch(land);
      orbit.position.set(Math.sin(a) * 0.31, 0.25 + 0.095 * Math.sin(a * 2.05), Math.cos(a) * 0.13);
      if(wish && rest){
        perch.set(.072,-.04,.025); wish.localToWorld(perch); candle.worldToLocal(perch);
        orbit.position.lerp(perch,rest);
        orbit.position.y+=.13*Math.sin(Math.PI*rest);
      }
      orbit.rotation.y=a*(1-rest)+.62*rest;
      orbit.rotation.z=.18*Math.sin(a)*(1-rest);
      wings.forEach((w, n) => {
        w.rotation.z=(n?1:-1)*((.3+.33*Math.sin(t*6.2))*(1-rest)+.84*rest);
      });
      glow.intensity = 0.49 + 0.06 * Math.sin(t * 4.13);
    });
  }
  if (lift) {
    // The stage's lantern includes its own dim-to-lit halo tied to its flame. Sampling
    // that authored intensity makes the new local light follow the same ignition cue.
    let halo;
    lift.traverse((o) => {
      if (!halo && o.isSprite && o.material?.map && o.material.blending === T.AdditiveBlending) halo = o;
    });
    const light = new T.PointLight('#ffb65b', 0, 4.25, 1.35);
    light.name = '隨天燈上升的燭光';
    light.position.set(0, 0.03, 0);
    // Above the lift sits a bobbing carrier; attach to that same body when available.
    (halo?.parent || lift).add(light);
    track((t) => {
      const warm = halo?.visible ? clamp(halo.material.opacity / 0.62) : 0;
      light.intensity = warm * (2.45 + 0.12 * Math.sin(t * 4.37));
    });
  }
}

function workLantern(S,track) {
  if(S.index!==1&&S.index!==9)return;
  const lamp=S.cast.find(actor=>actor.rig.workLantern)?.rig.workLantern;
  if(!lamp)return;
  const cupPage=S.index===1;
  const aim=new T.Object3D();
  aim.name=cupPage?'竹燈照到的茶面':'竹燈照到的鞋尖';
  const light=flood(lamp.source,aim,cupPage?'穿山甲竹燈的杯沿光':'臺灣犬工作燈的腳步光',
    '#ffcf8b',[0,0,0],cupPage?2.35:3.9,8.6,cupPage?.32:.24);
  const cups=cupPage?[0,1,2].map(i=>prop(S,'cup'+i)):[];
  const workCup=cupPage?prop(S,'work-cup'):null;
  const vessels=workCup?[workCup,...cups]:cups;
  const tea=vessels.map(c=>liquidCatch(c,0,.317,0,.088));
  const footMarks=S.cast.map(actor=>actor.rig.stepMark).filter(Boolean);
  const lion=cupPage?null:prop(S,'lion').parent;
  const receivers=cupPage?vessels:[...footMarks.map(mark=>mark.parent),prop(S,'lion'),prop(S,'plank')];
  const a=new T.Vector3(),b=new T.Vector3(),from=new T.Vector3(),to=new T.Vector3(),direction=new T.Vector3(),scale=new T.Vector3();
  if(lion)lion.add(aim);
  track(t=>{
    if(cupPage){
      const inspecting=workCup.visible && (workCup.userData.inHand || lamp.boost>0);
      const drinking=inspecting ? workCup : cups.find(c=>c.visible&&c.scale.x>.12)||workCup;
      if(aim.parent!==drinking)drinking.add(aim);
      aim.position.set(0,.311,0);
      tea.forEach((stroke,i)=>{
        stroke.visible=vessels[i]===drinking;
        stroke.rotation.y=.42*Math.sin(t*.77+i);
      });
      light.intensity=2.35+(lamp.boost||0)*1.2;
    }else{
      // The two shoe tips share the lion's gluing tab. They carry the light even
      // during the open-page rehearsal and the final leap onto the actual bench.
      lion.worldToLocal(footMarks[0].getWorldPosition(a));
      lion.worldToLocal(footMarks[1].getWorldPosition(b));
      const beat=S.stage.still.matches?0:.5+.5*Math.tanh(2.45*Math.sin(t*1.48));
      aim.position.copy(a).lerp(b,beat);
    }
    // A paper shade diffuses light through its nearest pane. Put the optical
    // origin just outside that pane, aimed from the actual hand-held lantern.
    lamp.source.getWorldPosition(from);aim.getWorldPosition(to);
    const distance=direction.subVectors(to,from).length();
    lamp.source.getWorldScale(scale);
    if(distance>.00001)from.addScaledVector(direction,Math.min(distance*.47,.143*Math.abs(scale.x))/distance);
    light.position.copy(lamp.source.worldToLocal(from));
  });
  illuminatePaper(S,track,light,receivers);
}

const scenes = [
  null,
  harbor,
  proofs,
  windsock,
  rainchain,
  fryer,
  courtyard,
  teaCounter,
  banquet,
  lionFloor,
  fruitStall,
  yarn,
  lanternYard
];

export function addAtmosphere(S) {
  const scene = scenes[S.index];
  if (!scene) return;
  const tracks = [];
  const track = (draw) => tracks.push(draw);
  scene(S, track);
  workLantern(S, track);
  let time = 0;
  // Set the first poses before sealing so the pop-up has a composed silhouette even
  // while this page is the still-closed, incoming side of a mouse-driven turn.
  const reset = () => {
    time = 0;
    tracks.forEach((draw) => draw(0, 0));
  };
  reset();
  S.on('reset', reset);
  S.tick((_, dt) => {
    const step = S.stage.still.matches ? 0 : dt;
    time += step;
    for (const draw of tracks) draw(time, step);
  });
}
