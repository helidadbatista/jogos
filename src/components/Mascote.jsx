export default function Mascote({ estado = 'feliz' }) {
  const emojiPorEstado = {
    feliz: '🐱',
    pensando: '😺',
    festa: '😸',
    triste: '😿',
  };
  const falaPorEstado = {
    feliz: 'Vamos lá! Você consegue!',
    pensando: 'Hummm, pensa direitinho...',
    festa: 'Uhuuul! Você acertou!',
    triste: 'Quase! Vamos tentar de novo?',
  };
  return (
    <div className={`mascote mascote-${estado}`}>
      <div className="mascote-emoji" aria-hidden>{emojiPorEstado[estado]}</div>
      <div className="balao">{falaPorEstado[estado]}</div>
    </div>
  );
}
