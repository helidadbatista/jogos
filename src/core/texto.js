export function semAcento(texto) {
  return (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function normalizar(texto) {
  return semAcento(texto).toUpperCase();
}
