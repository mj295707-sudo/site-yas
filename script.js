/* =====================================================================
   script.js
   Controla 3 coisas nesse site:
   1) As estrelinhas do fundo (desenhadas no <canvas id="star-field">)
   2) Os corações que flutuam sobem a tela sozinhos, de tempos em tempos
   3) As interações: clique no botão 💜 e clique na seta de rolar
===================================================================== */

/* ---------------------------------------------------------------------
   1) ESTRELINHAS DE FUNDO
   Desenha pontinhos brilhantes espalhados pela tela, que piscam
   devagar. É tudo feito em canvas para não pesar o navegador mesmo
   com muitas estrelas.
--------------------------------------------------------------------- */
(function estrelas() {
  const canvas = document.getElementById('star-field');
  const ctx = canvas.getContext('2d');

  let estrelasLista = [];

  // QUANTIDADE DE ESTRELAS: mude o número abaixo para ter mais ou menos estrelas
  const QUANTIDADE_ESTRELAS = 90;

  function redimensionar() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }

  function criarEstrelas() {
    estrelasLista = [];
    for (let i = 0; i < QUANTIDADE_ESTRELAS; i++) {
      estrelasLista.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        raio: Math.random() * 1.4 + 0.3,
        fase: Math.random() * Math.PI * 2,
        velocidadePisca: Math.random() * 0.015 + 0.005,
      });
    }
  }

  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const estrela of estrelasLista) {
      estrela.fase += estrela.velocidadePisca;
      const brilho = (Math.sin(estrela.fase) + 1) / 2; // varia entre 0 e 1
      ctx.beginPath();
      ctx.arc(estrela.x, estrela.y, estrela.raio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233, 213, 255, ${0.25 + brilho * 0.6})`;
      ctx.fill();
    }
    requestAnimationFrame(desenhar);
  }

  window.addEventListener('resize', () => {
    redimensionar();
    criarEstrelas();
  });

  redimensionar();
  criarEstrelas();
  desenhar();
})();

/* ---------------------------------------------------------------------
   2) CORAÇÕES FLUTUANTES AUTOMÁTICOS
   A cada intervalo de tempo, nasce um coraçãozinho roxo na parte de
   baixo da tela e ele sobe devagar até sumir no topo.
--------------------------------------------------------------------- */
const heartsContainer = document.getElementById('hearts-container');

// SÍMBOLOS USADOS: pode trocar por outros emojis/caracteres se quiser
const SIMBOLOS_CORACAO = ['♥', '💜'];

function criarCoracaoFlutuante() {
  const coracao = document.createElement('span');
  coracao.className = 'floating-heart';
  coracao.textContent =
    SIMBOLOS_CORACAO[Math.floor(Math.random() * SIMBOLOS_CORACAO.length)];

  // posição horizontal aleatória
  coracao.style.left = `${Math.random() * 100}%`;

  // tamanho aleatório (TAMANHO DOS CORAÇÕES: mude o intervalo abaixo)
  const tamanho = Math.random() * 1.4 + 0.9; // entre 0.9rem e 2.3rem
  coracao.style.fontSize = `${tamanho}rem`;

  // duração aleatória em cima da velocidade base definida no CSS
  const duracaoBase = parseFloat(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--velocidade-coracoes')
  ) || 14;
  const duracao = duracaoBase + Math.random() * 6 - 3;
  coracao.style.animationDuration = `${duracao}s`;

  // leve desvio lateral enquanto sobe, pra não subir tudo reto
  coracao.style.setProperty('--deriva', `${(Math.random() - 0.5) * 120}px`);

  heartsContainer.appendChild(coracao);

  // remove o coração do HTML depois que a animação termina, pra não acumular
  setTimeout(() => coracao.remove(), duracao * 1000 + 500);
}

// INTERVALO ENTRE CORAÇÕES: mude o "1800" (em milissegundos) para mais rápido/lento
setInterval(criarCoracaoFlutuante, 1800);

// cria alguns corações logo de cara, sem esperar o primeiro intervalo
for (let i = 0; i < 4; i++) {
  setTimeout(criarCoracaoFlutuante, i * 450);
}

/* ---------------------------------------------------------------------
   3) INTERAÇÕES
--------------------------------------------------------------------- */

// Seta de "rolar para baixo" leva até a seção da foto
document.getElementById('scroll-hint').addEventListener('click', () => {
  document.getElementById('foto').scrollIntoView({ behavior: 'smooth' });
});

// Botão 💜 — ao clicar, espalha uma explosão de corações pela tela
const botaoAmor = document.getElementById('love-button');
const contadorTexto = document.getElementById('button-counter');

const MENSAGENS_CLIQUE = [
  'te amo, Yas 💜',
  'só isso mesmo 💜',
  'mais um pouquinho de carinho 💜',
  'clica quantas vezes quiser 💜',
];

let cliques = 0;

botaoAmor.addEventListener('click', () => {
  cliques++;

  // QUANTIDADE DE CORAÇÕES NA EXPLOSÃO: mude o número abaixo
  const QUANTIDADE_EXPLOSAO = 18;

  for (let i = 0; i < QUANTIDADE_EXPLOSAO; i++) {
    setTimeout(criarCoracaoFlutuante, i * 40);
  }

  contadorTexto.textContent =
    MENSAGENS_CLIQUE[(cliques - 1) % MENSAGENS_CLIQUE.length];
});
