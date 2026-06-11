export default function Forca({ erros, maxErros }) {
  const partes = [];
  const proporcao = erros / maxErros;
  const mostrar = (limite) => proporcao >= limite;

  return (
    <svg viewBox="0 0 200 240" className="forca-svg" aria-label={`${erros} de ${maxErros} erros`}>
      <line x1="10" y1="230" x2="150" y2="230" stroke="#6b4226" strokeWidth="8" strokeLinecap="round" />
      <line x1="40" y1="230" x2="40" y2="20" stroke="#8b5a2b" strokeWidth="8" strokeLinecap="round" />
      <line x1="40" y1="20" x2="130" y2="20" stroke="#8b5a2b" strokeWidth="8" strokeLinecap="round" />
      <line x1="130" y1="20" x2="130" y2="45" stroke="#8b5a2b" strokeWidth="6" strokeLinecap="round" />

      {mostrar(1 / maxErros) && (
        <g className="parte parte-cabeca">
          <circle cx="130" cy="65" r="20" fill="#ffd9a8" stroke="#5a3a1a" strokeWidth="3" />
          <circle cx="124" cy="62" r="2.2" fill="#2b2b2b" />
          <circle cx="136" cy="62" r="2.2" fill="#2b2b2b" />
          {erros < maxErros ? (
            <path d="M122 72 Q130 78 138 72" stroke="#2b2b2b" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M122 75 Q130 70 138 75" stroke="#2b2b2b" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
        </g>
      )}
      {mostrar(2 / maxErros) && (
        <line className="parte" x1="130" y1="85" x2="130" y2="150" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" />
      )}
      {mostrar(3 / maxErros) && (
        <line className="parte" x1="130" y1="100" x2="105" y2="125" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
      )}
      {mostrar(4 / maxErros) && (
        <line className="parte" x1="130" y1="100" x2="155" y2="125" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
      )}
      {mostrar(5 / maxErros) && (
        <line className="parte" x1="130" y1="150" x2="115" y2="190" stroke="#1e40af" strokeWidth="6" strokeLinecap="round" />
      )}
      {mostrar(6 / maxErros) && (
        <line className="parte" x1="130" y1="150" x2="145" y2="190" stroke="#1e40af" strokeWidth="6" strokeLinecap="round" />
      )}
      {mostrar(7 / maxErros) && (
        <circle className="parte" cx="115" cy="195" r="5" fill="#222" />
      )}
      {mostrar(8 / maxErros) && (
        <circle className="parte" cx="145" cy="195" r="5" fill="#222" />
      )}
    </svg>
  );
}
