/* One original delivery, one adjustment and an observable result. Both renderers use the same clock. */
(() => {
  'use strict';
  const unit = (v) => Math.max(0, Math.min(1, v));
  function ease(v) {
    const t = unit(v);
    return t * t * (3 - 2 * t);
  }
  const between = (v, a, b) => ease((v - a) / (b - a));
  const wetness = (height) => unit(1 - height / 0.78);
  const edition = 3;
  const pose = {
    support: 0,
    travel: 0,
    tilt: 0,
    bump: 0,
    spin: 0,
    spill: 0,
    first: 0,
    trial: 0,
    trialNo: 1,
    stain: 0,
    carry: true,
    carriedStain: 0,
    transfer: 0,
    delivery: 'first',
    copy: 0,
    load: 1,
    impact: 0,
    paper: '',
    inspect: 0,
    flight: 0,
    birdBeat: 0,
    rain: 0,
    bellBeat: 0,
    motion: true,
    phase: 'closed',
    beat: '',
    response: 0,
    whistle: 0,
    ripple: 0,
    greeting: '',
    greet: 0,
  };
  function create({ record, onFrame, onState, onTrial, onCheckpoint, onSound }) {
    // Keep earned stamps across editions. The new first trip starts in the reader's hands.
    const thisEdition = record?.edition === edition;
    const previousHeights =
      thisEdition && Array.isArray(record.heights)
        ? record.heights
        : thisEdition && Number.isFinite(record.height)
          ? [record.height]
          : [];
    const heights = previousHeights.filter(Number.isFinite).map(unit);
    let tested = heights.length > 0;
    let height = tested ? heights.at(-1) : 0,
      stamped = record?.stamped === true,
      seen = tested || (record?.edition === edition && record.step === 'spilled');
    let active = false,
      phase = 'closed',
      beat = '',
      ride = null,
      held = false;
    let clock = 0,
      previous = 0,
      frame = 0,
      openTime = 0;
    const effects = new Map();
    function state() {
      return {
        phase,
        beat,
        tested,
        seen,
        stamped,
        height,
        target: ride?.height ?? height,
        trips: seen ? heights.length + 1 : 0,
        paper: pose.paper,
      };
    }
    function update(next, moment = '') {
      if (phase === next && beat === moment) return;
      pose.phase = phase = next;
      pose.beat = beat = moment;
      onState(state());
    }
    function resting() {
      Object.assign(pose, {
        support: height,
        travel: Number(seen),
        tilt: 0,
        bump: 0,
        spin: seen ? -3.4 : 0,
        spill: 0,
        impact: 0,
        load: 1,
        first: Number(seen),
        trial: Number(tested),
        trialNo: heights.length + 1,
        stain: wetness(height),
        carry: !seen,
        carriedStain: 0,
        delivery: tested ? 'trial' : 'first',
        response: !seen ? 0 : tested && wetness(height) === 0 ? 1 : -1,
        transfer: 0,
        copy: Number(tested && wetness(height) === 0),
      });
    }
    function settle() {
      const submitted = ride.kind === 'trial';
      if (submitted) {
        tested = true;
        height = ride.height;
        heights.push(height);
        stamped ||= wetness(height) === 0;
        onTrial({ height, heights: heights.slice(), stamped, edition, dry: wetness(height) === 0 });
      } else if (ride.kind === 'intro') {
        onCheckpoint?.({ step: 'spilled', stamped, edition });
      }
      seen = true;
      ride = null;
      resting();
      update(tested ? 'landed' : 'ready');
    }
    function renderRide() {
      const first = ride.kind === 'intro' || ride.kind === 'firstReplay';
      const age = clock - ride.start,
        lead = first ? 1100 : 1080;
      const p = unit((age - lead) / (first ? 2880 : 2480));
      // The front wheel reaches the same crack at about 65% of the horizontal trip. Hold it there for the spill.
      const travel =
        age < lead
          ? first
            ? 0
            : ride.from * (1 - between(age, 490, lead))
          : 0.65 * between(p, 0, 0.31) + 0.35 * between(p, 0.45, 0.72);
      const jolt = unit((p - 0.28) / 0.28),
        wet = wetness(ride.height);
      const splash = unit((p - 0.33) / 0.245),
        handoff = between(p, 0.62, 0.87);
      Object.assign(pose, {
        support: first ? 0 : ride.oldHeight + (ride.height - ride.oldHeight) * between(age, 0, 520),
        load: first ? between(age, 100, 800) : 1,
        travel,
        spin: -travel * 3.4,
        bump: Math.sin(Math.PI * unit((p - 0.275) / 0.16)) * 0.135,
        impact: Math.sin(Math.PI * unit((p - 0.28) / 0.26)),
        tilt: -Math.sin(jolt * Math.PI * 2.8) * (1 - jolt) ** 1.6 * (0.1 + wet * 1.48),
        spill: wet > 0.015 && splash < 1 ? splash : 0,
        first: first ? Number(handoff >= 1) : 1,
        trial: Number(!first && handoff >= 1),
        stain: wet,
        carry: handoff < 1,
        carriedStain: wet * between(p, 0.415, 0.57),
        transfer: handoff,
        delivery: first ? 'first' : 'trial',
        response: (wet ? -1 : 1) * between(p, 0.55, 0.79),
        copy: !first && !wet ? between(p, 0.76, 0.99) : 0,
      });
      const moment =
        age < lead ? (first ? 'load' : 'fold') : p < 0.28 ? 'road' : p < 0.64 ? 'impact' : 'proof';
      update(first ? 'opening' : 'riding', moment);
      if (p >= 1) settle();
    }
    function animate(now) {
      frame = 0;
      if (!active) return;
      const dt = previous ? Math.max(0, now - previous) : 0;
      previous = now;
      clock += dt;
      if (pose.paper) {
        if (ride) ride.start += dt;
        pose.inspect = between(clock - openTime, 0, 210);
      } else if (ride) renderRide();
      for (const [key, start] of effects) {
        const t = unit((clock - start) / (key === 'bird' ? 990 : 810));
        if (key === 'bird') {
          pose.flight = Math.sin(t * Math.PI);
          pose.birdBeat = t;
        }
        if (key === 'bell') pose.bellBeat = Math.sin(t * Math.PI);
        if (key === 'awning') pose.rain = t < 1 ? t : 0;
        if (key === 'water') pose.ripple = t === 1 ? 0 : Math.sin(t * Math.PI);
        if (key === 'ferry') pose.whistle = t === 1 ? 0 : Math.sin(t * Math.PI);
        if (key === 'greet') {
          pose.greet = Math.sin(t * Math.PI);
          if (t === 1) pose.greeting = '';
        }
        if (t === 1) effects.delete(key);
      }
      onFrame(pose);
      if ((ride && !pose.paper) || effects.size || (pose.paper && pose.inspect < 1)) schedule();
      else previous = 0;
    }
    function schedule() {
      if (active && !frame) frame = requestAnimationFrame(animate);
    }
    function start(kind, amount) {
      held = false;
      pose.trialNo = kind === 'trial' ? heights.length + 2 : kind === 'trialReplay' ? heights.length + 1 : 1;
      ride = { kind, height: amount, start: clock, from: pose.travel, oldHeight: pose.support };
      if (pose.motion) {
        renderRide();
        schedule();
      } else {
        update(kind === 'intro' || kind === 'firstReplay' ? 'opening' : 'riding');
        settle();
      }
      onFrame(pose);
    }
    function inspect(key) {
      if (!active || (key === 'first' && !pose.first) || (key === 'trial' && !pose.trial)) return;
      pose.paper = key;
      pose.inspect = key ? (pose.motion ? 0.12 : 1) : 0;
      openTime = clock;
      // A receipt may remain open for minutes. Resume at the very frame the reader left behind.
      previous = 0;
      onState(state());
      onFrame(pose);
      if (pose.motion) schedule();
    }
    function activate(value) {
      if (value === active) return;
      if (!value && pose.paper) inspect('');
      active = value;
      previous = 0;
      if (!active) {
        cancelAnimationFrame(frame);
        frame = 0;
        if (held) cancel();
        return;
      }
      if (phase === 'closed') {
        resting();
        update(tested ? 'landed' : seen ? 'ready' : 'invited');
        if (!seen && pose.motion) ambient('bird');
      }
      onFrame(pose);
      if (ride || effects.size) schedule();
    }
    function begin() {
      if (active && !ride && phase !== 'invited') {
        if (pose.paper) inspect('');
        held = true;
      }
    }
    function preview(value) {
      if (!active || ride || phase === 'invited') return;
      begin();
      pose.support = unit(value);
      pose.tilt = 0;
      pose.spill = 0;
      update('folding');
      onFrame(pose);
    }
    function send(value) {
      if (!active || ride || !Number.isFinite(value)) return;
      if (pose.paper) inspect('');
      const target = unit(value);
      held = false;
      onSound('page');
      if (phase === 'invited') start('intro', 0);
      else start('trial', target);
    }
    function tap() {
      send(1);
    }
    function replay(which) {
      if (!active || ride || !seen || (which === 'trial' && !tested)) return;
      if (pose.paper) inspect('');
      start(which === 'trial' ? 'trialReplay' : 'firstReplay', which === 'trial' ? height : 0);
    }
    function restart() {
      if (!active || ride) return;
      if (pose.paper) inspect('');
      held = tested = seen = false;
      heights.length = 0;
      height = 0;
      resting();
      onCheckpoint?.({ step: 'invited', stamped, edition });
      update('invited');
      onFrame(pose);
    }
    function cancel() {
      if (!held) return;
      held = false;
      if (ride) return;
      resting();
      update(tested ? 'landed' : 'ready');
      onFrame(pose);
    }
    function ambient(name) {
      if (!active) return;
      if (name === 'bell' || name === 'ferry') onSound(name);
      const greeting = name === 'customer' || name === 'vendor';
      if (greeting) pose.greeting = name;
      if (pose.motion) {
        effects.set(greeting ? 'greet' : name, clock);
        if (name === 'bell') effects.set('bird', clock);
        schedule();
      } else {
        if (name === 'bird' || name === 'bell') pose.flight = pose.flight > 0 ? 0 : 0.7;
        if (name === 'awning') pose.rain = pose.rain > 0 ? 0 : 0.68;
        if (name === 'water') pose.ripple = pose.ripple > 0 ? 0 : 0.92;
        if (name === 'ferry') pose.whistle = pose.whistle > 0 ? 0 : 0.85;
        if (greeting) pose.greet = 1;
        onFrame(pose);
      }
    }
    function motion(value) {
      pose.motion = value;
      if (!value) {
        if (ride) settle();
        effects.clear();
        Object.assign(pose, {
          flight: 0,
          birdBeat: 0,
          rain: 0,
          bellBeat: 0,
          whistle: 0,
          ripple: 0,
          greeting: '',
          greet: 0,
          inspect: pose.paper ? 1 : 0,
        });
        onFrame(pose);
      }
    }
    resting();
    onState(state());
    function deliveries() {
      return seen ? [0, ...heights].map(wetness) : [];
    }
    return {
      activate,
      begin,
      preview,
      send,
      tap,
      replay,
      restart,
      inspect,
      cancel,
      ambient,
      motion,
      state,
      deliveries,
    };
  }
  window.BreakfastStory = { pose, create };
})();
