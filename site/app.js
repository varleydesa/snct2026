// Lógica do jogador: entrada, perguntas, pontuação e envio ao ranking.
(() => {
  const Q = window.QUIZ;
  const $ = (id) => document.getElementById(id);

  let apelido = "";
  let idx = 0;
  let pontos = 0;
  let streak = 0;
  let tempoRest = 0;
  let timer = null;
  let respondida = false;
  let enviado = false;

  // Firebase é opcional: sem configuração, o jogo roda e só não envia ao ranking
  const configurado = window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.projectId !== "COLE_AQUI";
  const db = configurado ? (firebase.initializeApp(window.FIREBASE_CONFIG), firebase.firestore()) : null;

  function mostrar(id) {
    document.querySelectorAll(".tela").forEach((t) => t.classList.remove("ativa"));
    $(id).classList.add("ativa");
  }

  // Início
  $("btn-comecar").addEventListener("click", () => {
    apelido = $("apelido").value.trim();
    if (!apelido) {
      $("erro-inicio").textContent = "Digite um apelido para começar.";
      return;
    }
    $("erro-inicio").textContent = "";
    idx = 0; pontos = 0; streak = 0; enviado = false;
    mostrar("tela-quiz");
    perguntar();
  });

  // Pergunta
  function perguntar() {
    respondida = false;
    const p = Q.perguntas[idx];
    $("contador").textContent = `${idx + 1}/${Q.perguntas.length}`;
    $("total").textContent = `${pontos} pts`;
    $("ganho").textContent = "";
    $("pergunta").textContent = p.texto;
    $("transicao").classList.add("oculto");
    $("opcoes").classList.remove("oculto");

    const cont = $("opcoes");
    cont.innerHTML = "";
    p.opcoes.forEach((texto, i) => {
      const b = document.createElement("button");
      b.className = "opcao";
      b.textContent = texto;
      b.addEventListener("click", () => responder(i));
      cont.appendChild(b);
    });

    iniciarTempo();
  }

  function iniciarTempo() {
    tempoRest = Q.tempoPorPergunta;
    atualizarBarra();
    clearInterval(timer);
    timer = setInterval(() => {
      tempoRest = Math.max(0, tempoRest - 0.1);
      atualizarBarra();
      if (tempoRest <= 0) responder(-1);
    }, 100);
  }

  function atualizarBarra() {
    const pct = (tempoRest / Q.tempoPorPergunta) * 100;
    $("barra-tempo").style.width = pct + "%";
    $("barra-tempo").classList.toggle("alerta", tempoRest <= 3);
  }

  // Resposta e pontuação
  function responder(escolha) {
    if (respondida) return;
    respondida = true;
    clearInterval(timer);

    const p = Q.perguntas[idx];
    const botoes = document.querySelectorAll(".opcao");
    botoes.forEach((b) => (b.disabled = true));
    botoes[p.correta].classList.add("certa");

    let ganho = 0;
    if (escolha === p.correta) {
      botoes[escolha].classList.add("certa");
      streak++;
      // Bônus de rapidez: até 50 pontos
      const bonus = Math.round(50 * (tempoRest / Q.tempoPorPergunta));
      // Multiplicador por sequência: a partir do 2º acerto seguido, cresce até 2x
      const mult = streak >= 2 ? Math.min(1 + 0.5 * (streak - 1), 2) : 1;
      ganho = Math.round((100 + bonus) * mult);
      pontos += ganho;
    } else {
      streak = 0;
      if (escolha >= 0) botoes[escolha].classList.add("errada");
    }

    $("ganho").textContent = ganho > 0 ? `+${ganho}` : "";
    $("total").textContent = `${pontos} pts`;

    // Transição com a curiosidade
    setTimeout(() => {
      $("opcoes").classList.add("oculto");
      $("curiosidade").textContent = p.curiosidade;
      $("transicao").classList.remove("oculto");
    }, 700);

    setTimeout(() => {
      idx++;
      if (idx < Q.perguntas.length) perguntar();
      else fim();
    }, 700 + Q.transicaoSeg * 1000);
  }

  // Fim
  function fim() {
    mostrar("tela-fim");
    $("pontuacao-final").textContent = pontos;
    $("titulo-final").textContent = titulo(pontos);
    renderFichas();
    enviarRanking();
  }

  function titulo(p) {
    if (p >= 900) return "Engenheira da NASA";
    if (p >= 500) return "Matemática de mão cheia";
    return "Calculadora em formação";
  }

  function renderFichas() {
    const cont = $("fichas");
    cont.innerHTML = "";
    Q.fichas.forEach((f) => {
      const card = document.createElement("article");
      card.className = "ficha";
      const h = document.createElement("h4");
      h.textContent = f.nome;
      const a = document.createElement("p");
      a.className = "anos";
      a.textContent = f.anos;
      const t = document.createElement("p");
      t.textContent = f.texto;
      card.append(h, a, t);
      cont.appendChild(card);
    });
  }

  function enviarRanking() {
    if (enviado) return;
    enviado = true;
    if (!db) {
      $("status-envio").textContent = "Ranking desativado nesta versão.";
      return;
    }
    $("status-envio").textContent = "Enviando sua pontuação...";
    db.collection("ranking")
      .add({
        apelido: apelido,
        pontos: pontos,
        criadoEm: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => ($("status-envio").textContent = "Pontuação enviada ao ranking!"))
      .catch(() => ($("status-envio").textContent = "Não foi possível enviar. Avise a equipe."));
  }
})();
