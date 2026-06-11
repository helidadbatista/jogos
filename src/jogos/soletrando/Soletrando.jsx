import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuSoletrando from './MenuSoletrando.jsx';
import JogoSoletrando from './JogoSoletrando.jsx';
import FimSoletrando from './FimSoletrando.jsx';
import { calcularPontosSoletrando } from '../../core/scoring.js';

export default function Soletrando({ idade, onGanharPontos }) {
  const navigate = useNavigate();
  const [tela, setTela] = useState('menu');
  const [dificuldade, setDificuldade] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [reiniciarKey, setReiniciarKey] = useState(0);

  if (!idade) {
    return (
      <div className="tela">
        <h1 className="titulo">Defina a idade primeiro</h1>
        <button className="botao-principal" onClick={() => navigate('/')}>← Voltar ao Início</button>
      </div>
    );
  }

  return (
    <>
      {tela === 'menu' && (
        <MenuSoletrando
          dificuldade={dificuldade}
          setDificuldade={setDificuldade}
          onJogar={() => { setReiniciarKey((k) => k + 1); setTela('jogo'); }}
        />
      )}
      {tela === 'jogo' && (
        <JogoSoletrando
          key={reiniciarKey}
          idade={idade}
          dificuldade={dificuldade}
          onVoltar={() => setTela('menu')}
          onFim={(r) => {
            const ganhos = calcularPontosSoletrando(r.acertos);
            if (ganhos) onGanharPontos(ganhos);
            setResultado({ ...r, pontos: ganhos });
            setTela('fim');
          }}
        />
      )}
      {tela === 'fim' && (
        <FimSoletrando
          acertos={resultado?.acertos ?? 0}
          total={resultado?.total ?? 0}
          acertosLista={resultado?.acertosLista}
          pontos={resultado?.pontos ?? 0}
          onNovaRodada={() => { setReiniciarKey((k) => k + 1); setTela('jogo'); }}
          onTrocarContexto={() => setTela('menu')}
          onInicio={() => navigate('/')}
        />
      )}
    </>
  );
}
