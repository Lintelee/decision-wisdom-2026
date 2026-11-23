// One score follows the reader across the binding. Only physical sounds follow the object.
const sceneFoley = [
  ['wing-flit','gull','bamboo'],
  ['cup','pour','paper','gull','wing-flit','ticket-punch','clip'],
  ['shutter','paper','clip','film-reel','wing-flit','gull'],
  ['field','drum','cloth','sparrow','wood-knock','paper'],
  ['rain-drop','rain-chain','tin-tap','wheel','cloth','paper','clip'],
  ['oil','cloth','paper','clip','wing-flit','wood-creak'],
  ['brush','handprint','paper','cloth','wing-flit','rear-step','wood-creak','sparrow'],
  ['pour','lid','cup','clock-chime','tea-leaves','wood-creak','paper'],
  ['fizz','bamboo','tin-tap','dinner-gong','coin','wheel','lid','paper','cup','clip','rain-drop','wood-creak'],
  ['drum','front-step','rear-step','cloth','wood-knock','temple-gong','sparrow'],
  ['melon','scale-spring','coin','wood-knock','paper','cloth','wheel','ice-clink'],
  ['dye','cloth','clip','wood-knock','wing-flit','sparrow'],
  ['cord','paste-brush','paper','wing-flit','cloth','clip','wood-knock'],
  ['cord','cup'],
];
const effects = new Set(sceneFoley.flat());
const handPlayed = new Set(['wood-knock','brush','bamboo','tea-leaves','wing-flit','drum','handprint','front-step','rear-step','ticket-punch']);
const strokes = [1, .975, 1.025, .99];
const mix = { gull:.34, sparrow:.49, 'wing-flit':.72, 'clock-chime':.72, 'tin-tap':.75, 'rain-chain':.82, 'temple-gong':.80, 'dinner-gong':.85, 'ice-clink':.81 };

export function makeSound() {
  let ctx = null, master = null, foley = null, bed = null, current = null, track = null, offset = 0;
  let enabled = true, unlocked = false, generation = 0, sceneEpoch = 0, resuming = null;
  let musicLevel = .53, effectsLevel = .69, voicePan = 0, boundToPage = false;
  const buffers = new Map(), lastHit = new Map(), hitCount = new Map(), voices = new Set();

  function hold(gain) {
    const now = ctx.currentTime;
    if (gain.cancelAndHoldAtTime) gain.cancelAndHoldAtTime(now);
    else {
      const previous = gain.value;
      gain.cancelScheduledValues(now);
      gain.setValueAtTime(previous, now);
    }
    return now;
  }
  function gainTo(gain, value, time) {
    const now = hold(gain);
    gain.linearRampToValueAtTime(value, now + time);
  }
  function load(path) {
    if (!buffers.has(path)) {
      const pending = fetch(new URL('../audio/' + path + '.mp3', import.meta.url))
        .then(response => {
          if (!response.ok) throw Error('audio unavailable');
          return response.arrayBuffer();
        })
        .then(bytes => ctx.decodeAudioData(bytes))
        .catch(() => { buffers.delete(path); return null; });
      buffers.set(path, pending);
    }
    return buffers.get(path);
  }
  const audible = () => enabled && unlocked && !document.hidden && ctx?.state === 'running';
  const musicGain = () => musicLevel * (current === null ? .53 : .90);
  async function warmScene() {
    if (!audible()) return;
    const scene = current, names = scene===null ? ['paper'] : (sceneFoley[scene] || []);
    for (let i = 0; i < names.length && scene === current && audible(); i += 3) {
      await Promise.all(names.slice(i, i+3).map(name => load('foley/' + name)));
    }
  }
  function stopTrack() {
    if (!track) return;
    const { source, volume, started, from } = track;
    offset = (from + ctx.currentTime - started) % source.buffer.duration;
    track = null;
    gainTo(volume.gain, 0, .06);
    source.stop(ctx.currentTime + .065);
  }
  async function sync() {
    const ticket = ++generation;
    if (master) gainTo(master.gain, audible() ? .79 : 0, .04);
    if (!audible()) { stopTrack(); return; }
    if (track) { gainTo(track.volume.gain, musicGain(), .32); return; }
    const buffer = await load('music/paper-waltz');
    if (!buffer || ticket !== generation || !audible()) return;
    const source = ctx.createBufferSource(), volume = ctx.createGain();
    source.buffer = buffer; source.loop = true; volume.gain.value = 0;
    source.connect(volume); volume.connect(bed);
    source.onended = () => { source.disconnect(); volume.disconnect(); };
    const from = offset % buffer.duration, started = ctx.currentTime;
    source.start(started, from);
    track = { source, volume, from, started };
    gainTo(volume.gain, musicGain(), .48);
  }
  function unlock() {
    if (!enabled) return;
    try {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.gain.value = 0;
        const limiter = ctx.createDynamicsCompressor();
        limiter.threshold.value = -9; limiter.knee.value = 8; limiter.ratio.value = 3;
        master.connect(limiter); limiter.connect(ctx.destination);
        bed = ctx.createGain(); bed.connect(master);
        foley = ctx.createGain(); foley.gain.value = effectsLevel * .62; foley.connect(master);
        ctx.addEventListener('statechange', () => { sync(); if (audible()) warmScene(); });
      }
      const first = !unlocked;
      unlocked = true;
      if (ctx.state !== 'running' && !resuming) {
        resuming = ctx.resume().then(() => { sync(); warmScene(); }).catch(() => {}).finally(() => { resuming = null; });
      } else if (first) { sync(); warmScene(); }
    } catch { /* No audio output device. The paper mechanisms also read silently. */ }
  }
  function leaveRoom(all = false) {
    sceneEpoch++; lastHit.clear();
    for (const voice of voices) if (all || voice.bound) voice.stop();
  }
  function makeSpace() {
    if (!track || !effectsLevel) return;
    const gain = bed.gain, now = hold(gain);
    gain.linearRampToValueAtTime(.76, now + .045);
    gain.setValueAtTime(.76, now + .22);
    gain.linearRampToValueAtTime(1, now + .64);
  }
  function connectVoice(source, gain, pan, filter = null, bound = true) {
    const panner = pan && ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) { panner.pan.value = pan; gain.connect(panner); panner.connect(foley); }
    else gain.connect(foley);
    if (filter) { source.connect(filter); filter.connect(gain); }
    else source.connect(gain);
    const voice = { bound, stop() {
      if (!voices.delete(voice)) return;
      gainTo(gain.gain, 0, .025);
      try { source.stop(ctx.currentTime + .03); } catch { /* Already ended. */ }
    } };
    if (voices.size >= 12) voices.values().next().value.stop();
    voices.add(voice);
    source.onended = () => {
      voices.delete(voice);
      source.disconnect(); filter?.disconnect(); gain.disconnect(); panner?.disconnect();
    };
  }
  function envelope(peak,decay,at){
    const gain=ctx.createGain();
    gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(peak,at+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,at+decay);
    return gain;
  }
  function note(hz,to,duration,level,delay=0,type='sine'){
    const at=ctx.currentTime+delay,osc=ctx.createOscillator(),gain=envelope(level*2,duration,at);
    osc.type=type;osc.frequency.setValueAtTime(hz,at);osc.frequency.exponentialRampToValueAtTime(to,at+duration);
    connectVoice(osc,gain,voicePan,null,boundToPage);
    osc.start(at);osc.stop(at+duration+.015);
  }
  function rustle(hz,duration,level){
    const n=Math.ceil(ctx.sampleRate*duration),buf=ctx.createBuffer(1,n,ctx.sampleRate),v=buf.getChannelData(0);
    for(let i=0;i<n;i++)v[i]=(Math.random()*2-1)*(.6+.4*Math.sin(i*.004)**2);
    const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=envelope(level*2,duration,ctx.currentTime);
    src.buffer=buf;filter.type='bandpass';filter.frequency.value=hz;filter.Q.value=.75;
    connectVoice(src,gain,voicePan,filter,boundToPage);src.start();
  }
  const generic={
    turn:()=>{rustle(1600,.31,.054);rustle(3200,.15,.022);},rise:()=>rustle(940,.40,.035),
    pop:()=>note(490,650,.11,.034,0,'triangle'),tap:()=>note(315,240,.065,.024),
    tick:()=>note(766,578,.064,.021,0,'triangle'),soft:()=>note(245,177,.17,.031),
    stamp:()=>{note(140,56,.20,.13);rustle(540,.10,.044);},whoosh:()=>rustle(1200,.32,.04),
    mist:()=>rustle(3900,.17,.05),
    pencil:()=>rustle(1750,.48,.036),
    'ferry-horn':()=>{note(190,177,.59,.045,0,'triangle');note(284,268,.56,.018);},
    'field-horn':()=>{note(485,515,.13,.035,0,'triangle');note(515,515,.27,.040,.14,'triangle');},
    'cycle-bell':()=>{note(1208,1198,.42,.031);note(2150,2110,.18,.014);},
    'cover-set':()=>{note(122,74,.12,.058);rustle(770,.13,.025);},
    done:()=>[440,550,660].forEach((f,i)=>note(f,f,.23,.024,i*.095)),
  };
  async function sample(name,pan,ticket){
    const requested=ctx.currentTime,buffer=await load('foley/'+name);
    if(!buffer||ticket!==sceneEpoch||!audible()||!effectsLevel||ctx.currentTime-requested>.75)return;
    const source=ctx.createBufferSource(),gain=ctx.createGain();
    source.buffer=buffer;gain.gain.value=mix[name]??1;
    if(handPlayed.has(name)){
      const n=hitCount.get(name)||0;source.playbackRate.value=strokes[n%strokes.length];hitCount.set(name,n+1);
    }
    connectVoice(source,gain,pan); makeSpace(); source.start();
  }
  function play(name,scene,pan=0){
    if (!enabled || !unlocked || document.hidden || !effectsLevel || (scene!==undefined&&scene!==current)) return;
    const ticket=sceneEpoch;
    if(!audible()){
      if(resuming){
        const when=performance.now();
        resuming.then(()=>{if(ticket===sceneEpoch&&audible()&&performance.now()-when<350)play(name,scene,pan);});
      }
      return;
    }
    const now=ctx.currentTime;
    if(now-(lastHit.get(name)??-1)<.055)return;
    lastHit.set(name,now);
    if(effects.has(name))sample(name,pan,ticket);
    else if(generic[name]){
      voicePan=pan; boundToPage=scene!==undefined;
      if(!['tap','soft','tick','pop'].includes(name))makeSpace();
      generic[name]();
      voicePan=0;
    }
  }
  document.addEventListener('pointerdown', unlock, { capture: true, passive: true });
  document.addEventListener('keydown', unlock, { capture: true });
  document.addEventListener('visibilitychange', () => { if(document.hidden)leaveRoom(true); sync(); if(!document.hidden)warmScene(); });
  return {
    play,
    setScene(scene) {
      if (current === scene) return;
      leaveRoom(); current = scene;
      if (track) gainTo(track.volume.gain, musicGain(), .45);
      warmScene();
    },
    get on() { return enabled; },
    set on(value) { enabled = Boolean(value); if(!enabled)leaveRoom(true); sync(); if(enabled)warmScene(); },
    get musicLevel() { return musicLevel; },
    set musicLevel(value) {
      if (!Number.isFinite(value)) return;
      musicLevel = Math.min(1, Math.max(0, value));
      if (track) gainTo(track.volume.gain, musicGain(), .08);
    },
    get effectsLevel() { return effectsLevel; },
    set effectsLevel(value) {
      if (!Number.isFinite(value)) return;
      effectsLevel = Math.min(1, Math.max(0, value));
      if (foley) gainTo(foley.gain, effectsLevel * .62, .06);
    },
    unlock,
    get scene() { return current; }
  };
}
