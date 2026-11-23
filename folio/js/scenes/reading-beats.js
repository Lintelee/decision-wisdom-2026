// One motion with a soft start, peak and return inside a repeating tableau.
export function pulse(phase, start, end) {
  if (phase <= start || phase >= end) return 0;
  return Math.sin(Math.PI * (phase - start) / (end - start)) ** 2;
}

// A story stays on each reading beat until the reader acts.
export function storyPanel(state, { opening, start, checkpoint, action, ending, actionId = 'touch' }) {
  if (state.phase === 'done') {
    return { playing: false, caption: ending, buttons: [] };
  }
  if (state.phase === 'ready') {
    return { playing: false, caption: opening, buttons: [{ id: 'go', label: start, primary: true }] };
  }
  if ((state.phase === 'touch' || state.phase === 'serve') && !state.busy) {
    return { playing: false, caption: checkpoint, buttons: [{ id: actionId, label: action, primary: true }] };
  }
  return { playing: true, caption: '', buttons: [] };
}
