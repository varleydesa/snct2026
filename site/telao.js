// Tela do telão: QR code e ranking ao vivo.
(() => {
  const $ = (id) => document.getElementById(id);

  // Link do jogo, a partir do endereço desta página
  const url = new URL("index.html", location.href).href;
  $("link").textContent = url;
  new QRCode($("qr"), { text: url, width: 260, height: 260 });

  const configurado = window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.projectId !== "COLE_AQUI";
  if (!configurado) {
    $("status-telao").textContent = "Configure o Firebase em config.js para ver o ranking.";
    return;
  }

  firebase.initializeApp(window.FIREBASE_CONFIG);
  const db = firebase.firestore();

  db.collection("ranking")
    .orderBy("pontos", "desc")
    .limit(10)
    .onSnapshot(
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
          const n = document.createElement("span");
          n.className = "nome";
          n.textContent = d.apelido; // textContent evita injeção de HTML
          const p = document.createElement("span");
          p.className = "pts";
          p.textContent = `${d.pontos} pts`;
          li.append(n, p);
          if (pos <= 3) li.classList.add("pod" + pos);
          lista.appendChild(li);
        });
        $("status-telao").textContent = "";
      },
      () => ($("status-telao").textContent = "Erro ao carregar o ranking.")
    );
})();
