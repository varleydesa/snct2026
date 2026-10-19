// Tela do telão: QR code, último a jogar e ranking ao vivo.
(() => {
  const $ = (id) => document.getElementById(id);

  // Link do jogo, a partir do endereço desta página
  // Endereço da pasta do site, sem o nome do arquivo (ex.: https://seu-site.netlify.app/)
  const url = location.href.replace(/telao\.html(\?.*)?(#.*)?$/, "");
  $("link").textContent = url;
  new QRCode($("qr"), { text: url, width: 260, height: 260 });

  const configurado = window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.projectId !== "COLE_AQUI";
  if (!configurado) {
    $("status-telao").textContent = "Configure o Firebase em config.js para ver o ranking.";
    return;
  }

  firebase.initializeApp(window.FIREBASE_CONFIG);
  const db = firebase.firestore();
  const col = db.collection("ranking");

  let ultimoId = null;   // id do último a jogar exibido
  let destacado = null;  // id que deve piscar no ranking

  // ----- Último a jogar -----
  col.orderBy("criadoEm", "desc").limit(1).onSnapshot((snap) => {
    if (snap.empty) return;
    const doc = snap.docs[0];
    const d = doc.data();
    if (!d.criadoEm) return; // ainda sendo gravado pelo servidor
    if (doc.id === ultimoId) return;
    ultimoId = doc.id;
    mostrarUltimo(d);
    destacar(doc.id);
  });

  function mostrarUltimo(d) {
    $("ultimo-nome").textContent = d.apelido;
    $("ultimo-pts").textContent = `${d.pontos} pts`;

    const cont = $("ultimo-acertos");
    cont.innerHTML = "";
    (d.acertos || []).forEach((ok) => {
      const m = document.createElement("span");
      m.className = ok ? "marca certa" : "marca errada";
      m.textContent = ok ? "✓" : "✗";
      cont.appendChild(m);
    });

    // Posição: quantas pessoas têm mais pontos, mais 1 (empates dividem a posição)
    $("ultimo-pos").textContent = "Calculando posição...";
    col.where("pontos", ">", d.pontos).count().get()
      .then((r) => ($("ultimo-pos").textContent = `${r.data().count + 1}º lugar`))
      .catch(() => ($("ultimo-pos").textContent = ""));

    $("ultimo").classList.remove("oculto");
  }

  function destacar(id) {
    destacado = id;
    setTimeout(() => {
      destacado = null;
      document.querySelectorAll(".lista li.novo").forEach((li) => li.classList.remove("novo"));
    }, 6000);
  }

  // ----- Ranking (top 10) -----
  col.orderBy("pontos", "desc").limit(10).onSnapshot(
    (snap) => {
      const lista = $("lista");
      lista.innerHTML = "";
      if (snap.empty) {
        const li = document.createElement("li");
        li.className = "vazio";
        li.textContent = "Ninguém jogou ainda. Escaneie o QR code!";
        lista.appendChild(li);
        return;
      }
      let pos = 0;
      snap.forEach((doc) => {
        pos++;
        const d = doc.data();
        const li = document.createElement("li");
        const ps = document.createElement("span");
        ps.className = "posicao";
        ps.textContent = `${pos}º`;
        const n = document.createElement("span");
        n.className = "nome";
        n.textContent = d.apelido; // textContent evita injeção de HTML
        const p = document.createElement("span");
        p.className = "pts";
        p.textContent = `${d.pontos} pts`;
        li.append(ps, n, p);
        if (pos <= 3) li.classList.add("pod" + pos);
        if (doc.id === destacado) li.classList.add("novo");
        lista.appendChild(li);
      });
      $("status-telao").textContent = "";
    },
    () => ($("status-telao").textContent = "Erro ao carregar o ranking.")
  );
})();
