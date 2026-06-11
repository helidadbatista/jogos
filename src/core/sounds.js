let ctx = null;
let muted = false;

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function tone(freq, duration, type = 'sine', startGain = 0.25, when = 0) {
  const c = getCtx();
  if (!c || muted) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(startGain, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function slide(fromFreq, toFreq, duration, type = 'sawtooth', startGain = 0.2) {
  const c = getCtx();
  if (!c || muted) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(fromFreq, t0);
  osc.frequency.exponentialRampToValueAtTime(toFreq, t0 + duration);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(startGain, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const sons = {
  acerto() {
    tone(880, 0.12, 'triangle', 0.3, 0);
    tone(1320, 0.18, 'triangle', 0.25, 0.08);
  },
  erro() {
    slide(220, 110, 0.25, 'sawtooth', 0.22);
  },
  clique() {
    tone(660, 0.05, 'square', 0.15, 0);
  },
  vitoria() {
    const notas = [523, 659, 784, 1047];
    notas.forEach((n, i) => tone(n, 0.18, 'triangle', 0.3, i * 0.12));
    tone(1568, 0.4, 'triangle', 0.25, notas.length * 0.12);
  },
  derrota() {
    const notas = [392, 330, 262, 196];
    notas.forEach((n, i) => tone(n, 0.25, 'sawtooth', 0.22, i * 0.18));
  },
  dica() {
    tone(988, 0.1, 'sine', 0.2, 0);
    tone(1319, 0.15, 'sine', 0.2, 0.08);
  },
};
