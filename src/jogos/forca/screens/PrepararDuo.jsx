import { useState } from 'react';
import { sons } from '../../../core/sounds.js';

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z ]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^ +/, '');
}

function contarLetras(texto) {
  return texto.replace(/ /g, '').length;
}

export default function PrepararDuo({ onPronto, onVoltar, jogadorAtual = 1 }) {
  const [palavra, setPalavra] = useState('');
  const [dica, setDica] = useState('');
  const [mostrar, setMostrar] = useState(false);

  const palavraNorm = normalizar(palavra);
  const letras = contarLetras(palavraNorm);
  const valido = letras >= 3 && letras <= 14;

  function handleSubmit(e) {
    e.preventDefault();
    if (!valido) return;
    sons.clique();
    onPronto({ palavra: palavraNorm.trim(), dica: dica.trim() });
  }

  return (
    <div className="tela tela-duo-preparar">
      <button className="botao-voltar" onClick={() => { sons.clique(); onVoltar(); }}>← Voltar</button>
      <h1 className="titulo">👤 Jogador {jogadorAtual}</h1>
      <p className="subtitulo">Pense numa palavra para o seu amigo descobrir!</p>

      <form className="form-duo" onSubmit={handleSubmit}>
        <label className="campo">
          <span className="rotulo">Palavra secreta</span>
          <div className="campo-com-olho">
            <input
              type={mostrar ? 'text' : 'password'}
              value={palavra}
              onChange={(e) => setPalavra(e.target.value)}
              placeholder="Ex: BOLO DE CHOCOLATE"
              autoFocus
              maxLength={30}
              className="input-grande"
              aria-label="palavra secreta"
            />
            <button
              type="button"
              className="botao-olho"
              onClick={() => setMostrar((v) => !v)}
              aria-label={mostrar ? 'esconder' : 'mostrar'}
              title={mostrar ? 'Esconder' : 'Mostrar'}
            >
              {mostrar ? '🙈' : '👁️'}
            </button>
          </div>
          <small className="ajuda">
            Aceita letras e espaços. Acentos viram letras normais.
            {palavra && (
              <> &nbsp;|&nbsp; <strong>{letras}</strong> letras {!valido && '(precisa entre 3 e 14)'}</>
            )}
          </small>
        </label>

        <label className="campo">
          <span className="rotulo">Dica (opcional)</span>
          <input
            type="text"
            value={dica}
            onChange={(e) => setDica(e.target.value)}
            placeholder="Ex: Doce de aniversário"
            maxLength={80}
            className="input-grande"
          />
        </label>

        <button type="submit" className="botao-principal" disabled={!valido}>
          Pronto, passar para o Jogador 2 ➜
        </button>
      </form>
    </div>
  );
}
