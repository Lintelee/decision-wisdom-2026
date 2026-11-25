// Sounds the edition has no recording for. Each one is drawn once into a buffer; after that it is played,
// mixed and stopped exactly like a recorded foley, so a string of firecrackers still counts as one voice.
let seed = 7;
const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const hiss = new WeakMap();
function noise(c) {
  if (!hiss.has(c)) {
    const buffer = c.createBuffer(1, c.sampleRate, c.sampleRate), data = buffer.getChannelData(0);
    let state = 7;
    for (let i = 0; i < data.length; i++) data[i] = (state = (state * 16807) % 2147483647) / 2147483647 * 2 - 1;
    hiss.set(c, buffer);
  }
  return hiss.get(c);
}
function shape(gain, t, attack, peak, decay) {
  gain.gain.setValueAtTime(.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + attack);
  gain.gain.exponentialRampToValueAtTime(.0001, t + attack + decay);
}
function tone(c, out, t, { f, f2 = f, bend = .1, type = 'sine', a = .005, d = .3, peak = .3 }) {
  const osc = c.createOscillator(), gain = c.createGain();
  osc.type = type; osc.frequency.setValueAtTime(f, t);
  if (f2 !== f) osc.frequency.exponentialRampToValueAtTime(f2, t + bend);
  shape(gain, t, a, peak, d);
  osc.connect(gain); gain.connect(out); osc.start(t); osc.stop(t + a + d + .05);
}
function burst(c, out, t, { f = 2000, q = 1, kind = 'bandpass', a = .002, d = .05, peak = .5 }) {
  const source = c.createBufferSource(), filter = c.createBiquadFilter(), gain = c.createGain();
  source.buffer = noise(c); source.loop = true;
  filter.type = kind; filter.frequency.value = f; filter.Q.value = q;
  shape(gain, t, a, peak, d);
  source.connect(filter); filter.connect(gain); gain.connect(out);
  source.start(t, random() * .5); source.stop(t + a + d + .05);
}
// A struck metal tube: the note and two quieter, shorter overtones.
function strike(c, out, t, f) {
  tone(c, out, t, { f, d: 2.4, peak: .22, a: .003 });
  tone(c, out, t, { f: f * 2.76, d: 1.4, peak: .08, a: .003 });
  tone(c, out, t, { f: f * 5.4, d: .6, peak: .03, a: .003 });
}

export const drawnFoley = {
  'tube-chime': { seconds: 3.4, seed: 7, draw(c, out, t) { [[880, 0], [1175, .3], [1319, .7]].forEach(([f, at]) => strike(c, out, t + at, f)); } },
  // A long string going off: sixteen cracks, each a sharp snap over a low thump, unevenly spaced.
  firecrackers: { seconds: 2, seed: 11, draw(c, out, t) {
    let at = 0;
    for (let i = 0; i < 16; i++) {
      burst(c, out, t + at, { f: 1800 + random() * 1600, q: .8, d: .06, peak: .7 });
      burst(c, out, t + at, { f: 300, kind: 'lowpass', d: .04, peak: .5 });
      at += .045 + random() * .07;
    }
  } },
  drip: { seconds: .8, seed: 7, draw(c, out, t) {
    [0, .35].forEach((at, i) => {
      tone(c, out, t + at, { f: i ? 620 : 520, f2: i ? 1500 : 1300, bend: .06, d: .12, peak: .4, a: .004 });
      burst(c, out, t + at, { f: 3000, q: 2, d: .015, peak: .08 });
    });
  } },
  twitter: { seconds: 1, seed: 31, draw(c, out, t) {
    let at = 0;
    for (let i = 0; i < 9; i++) {
      const f = 3500 + random() * 2500;
      tone(c, out, t + at, { f, f2: f * (.7 + random() * .6), bend: .04, d: .045, peak: .2, a: .003 });
      at += .055 + random() * .03;
    }
  } },
  meow: { seconds: .9, seed: 7, draw(c, out, t) {
    const osc = c.createOscillator(), mouth = c.createBiquadFilter(), nose = c.createBiquadFilter(), gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, t); osc.frequency.linearRampToValueAtTime(760, t + .15); osc.frequency.linearRampToValueAtTime(430, t + .62);
    mouth.type = nose.type = 'bandpass'; mouth.Q.value = 4; nose.Q.value = 6;
    mouth.frequency.setValueAtTime(800, t); mouth.frequency.linearRampToValueAtTime(1200, t + .2); mouth.frequency.linearRampToValueAtTime(600, t + .62);
    nose.frequency.setValueAtTime(2600, t); nose.frequency.linearRampToValueAtTime(1800, t + .3); nose.frequency.linearRampToValueAtTime(1200, t + .62);
    gain.gain.setValueAtTime(.0001, t); gain.gain.exponentialRampToValueAtTime(.9, t + .06);
    gain.gain.setValueAtTime(.9, t + .4); gain.gain.exponentialRampToValueAtTime(.0001, t + .7);
    osc.connect(mouth); osc.connect(nose); mouth.connect(gain); nose.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + .75);
  } },
  bark: { seconds: .7, seed: 7, draw(c, out, t) {
    [0, .28].forEach(at => {
      const osc = c.createOscillator(), muffle = c.createBiquadFilter(), gain = c.createGain();
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(420, t + at); osc.frequency.exponentialRampToValueAtTime(230, t + at + .12);
      muffle.type = 'lowpass'; muffle.frequency.value = 1800;
      shape(gain, t + at, .008, .6, .14);
      osc.connect(muffle); muffle.connect(gain); gain.connect(out); osc.start(t + at); osc.stop(t + at + .22);
      burst(c, out, t + at, { f: 900, q: 1.2, d: .1, peak: .35 });
    });
  } },
};

/** Draws one of the sounds above into a buffer at the page's sample rate; null when the browser cannot. */
export function drawFoley(name, sampleRate) {
  const Offline = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext, voice = drawnFoley[name];
  if (!Offline || !voice) return Promise.resolve(null);
  return new Promise((done, fail) => {
    const c = new Offline(1, Math.ceil(voice.seconds * sampleRate), sampleRate);
    seed = voice.seed;
    voice.draw(c, c.destination, .005);
    c.oncomplete = event => done(event.renderedBuffer);
    c.startRendering()?.catch?.(fail);
  });
}
