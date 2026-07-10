/* ================================================================
   CAMPANHA DE ARRECADAÇÃO — APRENDIZES SEST SENAT
   Configurar todos os dados da campanha aqui embaixo, no objeto
   CONFIG. Não precisa editar o index.html pra isso.
   ================================================================ */

const CONFIG = {
  nomeAsilo: 'Lar dos Idosos Perseverança', 

  // objetivo da campanha
  objetivo: 'Estamos arrecadando itens de inverno, produtos de higiene, alimentos e materiais recicláveis para proporcionar mais conforto, cuidado e qualidade de vida aos idosos.', 

  // Data e local da entrega
  dataEntregaTexto: '24 de Julho de 2026',       
  dataEntregaISO: '2026-07-24T14:00:00',        // para o cronômetro. Formato: AAAA-MM-DDTHH:MM:SS
  localEntrega: '[endereço do asilo]', 

  // Chave PIX para quem quiser doar em dinheiro
  pixKey: '78.177.763/0001-08',

  // Link CSV da planilha do Google Sheet
  sheetCsvUrl: 'COLAR-O-LINK-DA-PLANILHA-AQUI',
  
// Fotos do carrossel/galeria //

fotosCarrossel: [
 {src: 'img/fotoscarrossel/figure1.jpg', alt:'', legenda:''},
 {src: 'img/fotoscarrossel/figure2.jpg', alt:'', legenda:''},
 {src: 'img/fotoscarrossel/figure3.jpg', alt:'', legenda:''},
 {src: 'img/fotoscarrossel/figure4.jpg', alt:'', legenda:''},
 {src: 'img/fotoscarrossel/figure5.jpg', alt:'', legenda:''},
 {src: 'img/fotoscarrossel/figure6.jpg', alt:'', legenda:''},
 {src: 'img/fotoscarrossel/figure7.jpg', alt:'', legenda:''},
 {src: 'img/fotoscarrossel/figure8.jpg', alt:'', legenda:''},
],

  // Pontos físicos de coleta — A VERIFICAR!
  pontosDeColeta: [
    { nome: 'SEST SENAT PARANAGUÁ', endereco: 'Endereço completo', horario: '08:00 às 18:00' },
    { nome: 'Ponto 2', endereco: 'Endereço completo', horario: 'Em análise' },
  ],

  // Itens organizados por categoria
  categoriasItens: [
    {
      categoria: 'Higiene Pessoal',
      icone: '🧼',
      itens: ['Sabonete em barra', 'Sabonete líquido', 'Shampoo', 'Condicionador', 'Desodorante aerosol', 'Talco', 'Hidratante', 'Escova de dentes', 'Creme dental'],
    },
    {
      categoria: 'Alimentos',
      icone: '🍚',
      itens: ['Açúcar', 'Feijão', 'Macarrão'],
    },
    {
      categoria: 'Recicláveis Solidários',
      icone: '♻️',
      itens: ['Tampinhas de garrafa', 'Lacre de alumínio (latinhas)', 'Óleo de cozinha novo ou usado'],
    },
    {
      categoria: 'Itens de Inverno',
      icone: '🧣',
      itens: ['Agasalhos', 'Calças', 'Meias', 'Blusas', 'Toucas', 'Cobertores', 'Mantas', 'Luvas'],
    }
  ],
};

/* ================================================================
   
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  preencherTextos();
  renderizarItens();
  renderizarPontosDeColeta();
  renderizarCarrossel();
  iniciarCronometro();
  carregarProgressoDaPlanilha();
  configurarMenuMobile();
  configurarBotaoCopiarPix();
  configurarBotaoCompartilhar();
  configurarRevelacaoAoRolar();
});

/* ---------- Preenche os textos da página a partir do CONFIG ---------- */
function preencherTextos() {
  document.title = `Campanha de Arrecadação • ${CONFIG.nomeAsilo}`;

  const asiloDestaque = document.getElementById('asiloDestaque');
  if (asiloDestaque) {
    asiloDestaque.innerHTML = `Em prol do <strong>${escapeHTML(CONFIG.nomeAsilo)}</strong>`;
  }

  setTextoPorId('objetivoTexto', CONFIG.objetivo);
  setTextoPorId('deliveryDateText', CONFIG.dataEntregaTexto);
  setTextoPorId('infoData', CONFIG.dataEntregaTexto);
  setTextoPorId('infoLocal', CONFIG.localEntrega);
  setTextoPorId('infoInstituicao', CONFIG.nomeAsilo);
  setTextoPorId('pixKey', CONFIG.pixKey);
}

function setTextoPorId(id, texto) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = texto;
}

/* Monta os cartões de itens da campanha */
function renderizarItens() {
  const grade = document.getElementById('itemsGrid');
  if (!grade) return;

  grade.innerHTML = CONFIG.categoriasItens.map(categoria => `
    <div class="item-card">
      <span class="item-card-icone" aria-hidden="true">${categoria.icone}</span>
      <h3>${escapeHTML(categoria.categoria)}</h3>
      <ul>
        ${categoria.itens.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/* Monta os cartões de pontos de coleta */
function renderizarPontosDeColeta() {
  const grade = document.getElementById('pointsGrid');
  if (!grade) return;

  grade.innerHTML = CONFIG.pontosDeColeta.map(ponto => {
    // Cria o link de busca combinando o nome do lugar + endereço para o Maps achar sem erro
    const termoBusca = encodeURIComponent(`${ponto.nome}, ${ponto.endereco}`);
    const urlMaps = `https://www.google.com/maps/search/?api=1&query=${termoBusca}`;

    return `
      <div class="point-card">
        <span class="point-card-icone" aria-hidden="true">📍</span>
        <h3>${escapeHTML(ponto.nome)}</h3>
        <p>
          <a href="${urlMaps}" target="_blank" rel="noopener noreferrer" class="link-maps">
            ${escapeHTML(ponto.endereco)} ↗
          </a>
        </p>
        <p class="point-card-horario">${escapeHTML(ponto.horario)}</p>
      </div>
    `;
  }).join('');
}

//Carrossel de fotos//

function renderizarCarrossel() {
  const carrossel = document.getElementById('carrossel');
  const trilho = document.getElementById('carrosselTrilho');
  const indicadoresContainer = document.getElementById('carrosselIndicadores');
  const botaoAnterior = document.getElementById('carrosselAnterior');
  const botaoProxima = document.getElementById('carrosselProxima');
  if (!carrossel || !trilho || !indicadoresContainer) return;
 
  const fotos = CONFIG.fotosCarrossel || [];
 
  if (!fotos.length) {
    carrossel.innerHTML = '<p class="carrossel-vazio">Em breve, fotos da campanha por aqui.</p>';
    return;
  }
 
  trilho.innerHTML = fotos.map(foto => `
    <div class="carrossel-slide">
     <img src="${foto.src}" alt="${escapeHTML(foto.alt || '')}">
      ${foto.legenda ? `<p class="carrossel-legenda">${escapeHTML(foto.legenda)}</p>` : ''}
    </div>
  `).join('');
 
  indicadoresContainer.innerHTML = fotos.map((_, indice) => `
    <button class="carrossel-indicador${indice === 0 ? ' ativo' : ''}" type="button" aria-label="Ir para a foto ${indice + 1}" data-indice="${indice}"></button>
  `).join('');
 
  const indicadores = indicadoresContainer.querySelectorAll('.carrossel-indicador');
  const prefereReduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  let indiceAtual = 0;
  let autoplayId = null;
 
  function irParaSlide(indice) {
    indiceAtual = (indice + fotos.length) % fotos.length;
    trilho.style.transform = `translateX(-${indiceAtual * 100}%)`;
    indicadores.forEach((ponto, i) => ponto.classList.toggle('ativo', i === indiceAtual));
  }
 
  function proximoSlide() { irParaSlide(indiceAtual + 1); }
  function slideAnterior() { irParaSlide(indiceAtual - 1); }
 
  function iniciarAutoplay() {
    if (prefereReduzirMovimento || fotos.length < 2 || document.hidden) return;
    autoplayId = setInterval(proximoSlide, 8000);
  }
 
  function pararAutoplay() {
    if (autoplayId) { clearInterval(autoplayId); autoplayId = null; }
  }
 
  function reiniciarAutoplay() {
    pararAutoplay();
    iniciarAutoplay();
  }
 
  if (botaoProxima) botaoProxima.addEventListener('click', () => { proximoSlide(); reiniciarAutoplay(); });
  if (botaoAnterior) botaoAnterior.addEventListener('click', () => { slideAnterior(); reiniciarAutoplay(); });
 
  indicadores.forEach(ponto => {
    ponto.addEventListener('click', () => {
      irParaSlide(Number(ponto.dataset.indice));
      reiniciarAutoplay();
    });
  });
 
  carrossel.setAttribute('tabindex', '0');
  carrossel.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowRight') { proximoSlide(); reiniciarAutoplay(); }
    if (evento.key === 'ArrowLeft') { slideAnterior(); reiniciarAutoplay(); }
  });
 
  let toqueInicialX = 0;
  trilho.addEventListener('touchstart', (evento) => {
    toqueInicialX = evento.touches[0].clientX;
    pararAutoplay();
  }, { passive: true });
 
  trilho.addEventListener('touchend', (evento) => {
    const deltaX = evento.changedTouches[0].clientX - toqueInicialX;
    if (Math.abs(deltaX) > 40) {
      deltaX < 0 ? proximoSlide() : slideAnterior();
    }
    reiniciarAutoplay();
  }, { passive: true });
 
  carrossel.addEventListener('mouseenter', pararAutoplay);
  carrossel.addEventListener('mouseleave', iniciarAutoplay);
  carrossel.addEventListener('focusin', pararAutoplay);
  carrossel.addEventListener('focusout', iniciarAutoplay);
 
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pararAutoplay(); else iniciarAutoplay();
  });
 
  iniciarAutoplay();
}



/* Cronômetro até o dia da entrega */
function iniciarCronometro() {
  atualizarCronometro();
  setInterval(atualizarCronometro, 1000);
}

function atualizarCronometro() {
  const painel = document.getElementById('countdown');
  if (!painel) return;

  const alvo = new Date(CONFIG.dataEntregaISO).getTime();

  if (isNaN(alvo)) {
    painel.innerHTML = '<p style="color:#fff;opacity:.85;font-size:.9rem;">Configurem a data de entrega em CONFIG.dataEntregaISO (script.js)</p>';
    return;
  }

  const diferenca = alvo - Date.now();

  if (diferenca <= 0) {
    painel.innerHTML = '<p style="color:#fff;font-weight:600;">O grande dia da entrega chegou! 🎉</p>';
    return;
  }

  const dias = Math.floor(diferenca / 86400000);
  const horas = Math.floor((diferenca % 86400000) / 3600000);
  const minutos = Math.floor((diferenca % 3600000) / 60000);
  const segundos = Math.floor((diferenca % 60000) / 1000);

  atualizarNumero('days', dias);
  atualizarNumero('hours', horas);
  atualizarNumero('minutes', minutos);
  atualizarNumero('seconds', segundos);
}

function atualizarNumero(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = String(valor).padStart(2, '0');
}

/* Progresso da arrecadação, lido da planilha do Google Sheets */
async function carregarProgressoDaPlanilha() {
  const grade = document.getElementById('progressGrid');
  const status = document.getElementById('lastUpdated');
  if (!grade || !status) return;

  if (!CONFIG.sheetCsvUrl || CONFIG.sheetCsvUrl.includes('COLE_AQUI')) {
    status.textContent = 'Configurem o link da planilha em CONFIG.sheetCsvUrl (veja o passo a passo no README.md) para exibir o progresso aqui.';
    return;
  }

  try {
    const separador = CONFIG.sheetCsvUrl.includes('?') ? '&' : '?';
    const resposta = await fetch(`${CONFIG.sheetCsvUrl}${separador}cachebust=${Date.now()}`);
    if (!resposta.ok) throw new Error('Não foi possível acessar a planilha.');

    const textoCSV = await resposta.text();
    const linhas = interpretarCSV(textoCSV).filter(linha => linha.length && linha[0]);
    const [, ...dados] = linhas; // a primeira linha é o cabeçalho (Item, Meta, Arrecadado)

    if (!dados.length) {
      status.textContent = 'A planilha ainda não tem itens cadastrados.';
      grade.innerHTML = '';
      return;
    }

    grade.innerHTML = dados.map(linha => {
      const [nome, meta, arrecadado] = linha;
      const metaNumero = parseFloat(meta) || 0;
      const arrecadadoNumero = parseFloat(arrecadado) || 0;
      const percentual = metaNumero > 0 ? Math.min(100, Math.round((arrecadadoNumero / metaNumero) * 100)) : null;

      return `
        <div class="progress-card">
          <div class="progress-card-header">
            <span class="progress-item-nome">${escapeHTML(nome || '')}</span>
            <span class="progress-item-numero">${arrecadadoNumero}${metaNumero > 0 ? ' / ' + metaNumero : ''}</span>
          </div>
          ${percentual !== null ? `
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width:${percentual}%"></div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    status.textContent = `Atualizado em ${new Date().toLocaleString('pt-BR')}`;
  } catch (erro) {
    console.error('Erro ao carregar planilha:', erro);
    status.textContent = 'Não foi possível carregar os dados agora. Tentem novamente em instantes.';
  }
}

/* Interpretador simples de CSV (lida com campos entre aspas) */
function interpretarCSV(texto) {
  return texto
    .trim()
    .split('\n')
    .map(linhaTexto => {
      const valores = [];
      let atual = '';
      let dentroDeAspas = false;

      for (let i = 0; i < linhaTexto.length; i++) {
        const caractere = linhaTexto[i];
        if (caractere === '"') {
          dentroDeAspas = !dentroDeAspas;
        } else if (caractere === ',' && !dentroDeAspas) {
          valores.push(atual.trim());
          atual = '';
        } else {
          atual += caractere;
        }
      }
      valores.push(atual.trim());
      return valores;
    });
}

/* Evita que texto vindo da planilha ou do CONFIG quebre o HTML da página */
function escapeHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto == null ? '' : String(texto);
  return div.innerHTML;
}

/* Menu mobile */
function configurarMenuMobile() {
  const botao = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!botao || !nav) return;

  botao.addEventListener('click', () => {
    const aberto = nav.classList.toggle('nav-aberto');
    botao.setAttribute('aria-expanded', String(aberto));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-aberto');
      botao.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 960) {
      nav.classList.remove('nav-aberto');
      botao.setAttribute('aria-expanded', 'false');
    }
  });
}

/* Botão de copiar a chave PIX — Versão Otimizada para Mobile */
function configurarBotaoCopiarPix() {
  const botao = document.getElementById('copyPixBtn');
  if (!botao) return;

  botao.addEventListener('click', async (evento) => {
    evento.preventDefault();
    
    const textoOriginal = botao.textContent;
    const chaveApenasNumeros = String(CONFIG.pixKey).replace(/[^0-9]/g, '');

    try {
      await navigator.clipboard.writeText(chaveApenasNumeros);
      botao.textContent = 'Copiado ✓';
    } catch (erro) {
      botao.textContent = 'Erro ao copiar';
    }
    
    setTimeout(() => { botao.textContent = textoOriginal; }, 2000);
  });
}

/* Botão de compartilhar no WhatsApp */
function configurarBotaoCompartilhar() {
  const botao = document.getElementById('shareBtn');
  if (!botao) return;

  botao.addEventListener('click', () => {
    const mensagem = `Ajude a campanha de arrecadação dos Aprendizes SEST SENAT para ${CONFIG.nomeAsilo}! Confira: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
  });
}

/* rolagem suave da pagina */
function configurarRevelacaoAoRolar() {
  const secoes = document.querySelectorAll('.reveal');
  if (!secoes.length) return;

  if (!('IntersectionObserver' in window)) {
    secoes.forEach(secao => secao.classList.add('visivel'));
    return;
  }

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        obs.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  secoes.forEach(secao => observador.observe(secao));
}