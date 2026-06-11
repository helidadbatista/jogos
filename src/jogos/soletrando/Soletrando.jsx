import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuSoletrando from './MenuSoletrando.jsx';
import JogoSoletrando from './JogoSoletrando.jsx';
import FimSoletrando from './FimSoletrando.jsx';

const MULT_IDADE = { '4-6': 1, '7-9': 2, '10-12': 3 };
const MULT_DIF = { facil: 1, medio: 2, dificil: 3 };

function pontosSoletrando(acertos, idade, dificuldade) {
  const m = (MULT_IDADE[idade] ?? 1) * (MULT_DIF[dificuldade] ?? 1);
  return acertos * 10 * m;
}

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
        <button className="botao-principal" onClick={() => navigate('/')}>← Voltar ao Hub</button>
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
            const ganhos = pontosSoletrando(r.acertos, idade, dificuldade);
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
