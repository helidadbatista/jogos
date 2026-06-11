let vozCache = null;

function escolherVoz() {
  if (vozCache) return vozCache;
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const vozes = window.speechSynthesis.getVoices();
  vozCache =
    vozes.find((v) => v.lang === 'pt-BR') ||
    vozes.find((v) => v.lang?.startsWith('pt')) ||
    vozes[0] ||
    null;
  return vozCache;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    vozCache = null;
    escolherVoz();
  };
}

export function falar(texto, { rate = 0.85, pitch = 1 } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'pt-BR';
  u.rate = rate;
  u.pitch = pitch;
  const voz = escolherVoz();
  if (voz) u.voice = voz;
  window.speechSynthesis.speak(u);
  return true;
}

export function falarLetraPorLetra(palavra) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const voz = escolherVoz();
  const letras = palavra.replace(/\s+/g, ' ').split('');
  letras.forEach((l, i) => {
    const u = new SpeechSynthesisUtterance(l === ' ' ? 'espaço' : l);
    u.lang = 'pt-BR';
    u.rate = 0.7;
    if (voz) u.voice = voz;
    window.speechSynthesis.speak(u);
  });
  return true;
}

export function ttsDisponivel() {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
}
