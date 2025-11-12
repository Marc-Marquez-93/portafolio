// =====================================================
// ✅ MENU.JS FINAL — Funcional y limpio
// =====================================================

let armamento = [];

fetch('./armamento.json')
  .then(response => {
    if (!response.ok) throw new Error('Error al cargar el JSON');
    return response.json();
  })
  .then(data => {
    armamento = [...data.armas, ...data.bombas, ...data.granadas];
    console.log("✅ Armamento cargado correctamente:", armamento);
  })
  .catch(error => console.error("❌ Error:", error));

window.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");

  // =====================================================
  // 🔹 ANIMACIÓN INICIAL DEL MENÚ
  // =====================================================
  gsap.from(menu, {
    x: "100vw",
    duration: 1,
    ease: "power4.out",
    onComplete: () => {
      gsap.to(menu, {
        x: "+=1",
        y: "+=1",
        repeat: -1,
        yoyo: true,
        duration: 0.1,
        ease: "sine.inOut"
      });
    }
  });

  // =====================================================
  // 🔹 BARRA SUPERIOR (HUD)
  // =====================================================
  const barra = document.createElement("div");
  barra.classList.add("barra-superior");
  barra.innerHTML = `
    <div class="barra-logo">WARZONE OPS</div>
    <div class="barra-opciones">
      <span>⚙️</span>
      <span>🔊</span>
      <span>❓</span>
    </div>
  `;
  document.body.appendChild(barra);
  gsap.from(".barra-superior", { y: -100, duration: 1, ease: "power3.out" });

  // =====================================================
  // 🔹 TÍTULO Y DESCRIPCIÓN
  // =====================================================
  const titulo = document.createElement("h1");
  titulo.id = "tituloJuego";
titulo.classList.add("tituloJuego")
  titulo.textContent = "WARZONE OPS";
  document.body.appendChild(titulo);

  const descripcion = document.createElement("div");
  descripcion.classList.add("descripcion-juego");
  descripcion.innerHTML = `
    <h2>Operación “Storm Front”</h2>
    <p>Selecciona tu arsenal y prepárate para el combate. 
    Domina el territorio, asciende de rango y demuestra tu poder en el campo de batalla.</p>
  `;
  document.body.appendChild(descripcion);

  gsap.from("#tituloJuego", { opacity: 0, y: -40, scale: 0.8, duration: 1.3, ease: "back.out(1.7)" });
  gsap.from(".descripcion-juego", { opacity: 0, y: 30, duration: 1.5, ease: "power2.out" });

  // =====================================================
  // 🔹 BOTONES PRINCIPALES
  // =====================================================
  const contBotones = document.createElement("div");
  contBotones.classList.add("botones-menu");

  const btnArmas = document.createElement("button");
  btnArmas.textContent = "Armas";

  const btnBombas = document.createElement("button");
  btnBombas.textContent = "Bombas";

  const btnGranadas = document.createElement("button");
  btnGranadas.textContent = "Granadas";

  contBotones.append(btnArmas, btnBombas, btnGranadas);
  menu.appendChild(contBotones);

  gsap.utils.toArray(".botones-menu button").forEach((btn, i) => {
    gsap.to(btn, { y: "+=5", repeat: -1, yoyo: true, duration: 1.5 + i * 0.3, ease: "sine.inOut" });
  });

  // =====================================================
  // 🔹 PERFIL DE USUARIO
  // =====================================================
  const perfil = document.createElement("div");
  perfil.classList.add("perfil-jugador");
  perfil.innerHTML = `
    <img src="https://i.pinimg.com/736x/ee/9a/34/ee9a346df1608a443047762a724a5644.jpg" alt="avatar" class="avatar-jugador" />
    <div>
      <h3>Capitán Miguel</h3>
      <p>Rango: Élite</p>
    </div>
  `;
  document.body.appendChild(perfil);
  gsap.from(".perfil-jugador", { opacity: 0, y: 40, duration: 1, delay: 0.5 });

  // =====================================================
  // 🔹 TABLAS LATERALES
  // =====================================================
  const eventos = [
    { nombre: "🔥 Doble XP", progreso: 65 },
    { nombre: "🎯 Torneo “Precision Strike”", progreso: 40 },
    { nombre: "🪖 Misión de clan semanal", progreso: 85 }
  ];

  const modos = [
    { nombre: "⚔️ Batalla por equipos", progreso: 100 },
    { nombre: "💣 Desactivación táctica", progreso: 75 },
    { nombre: "🚁 Invasión aérea", progreso: 55 }
  ];

  const tablaIzq = crearTablaLateral("Eventos Activos", eventos, "izq");
  const tablaDer = crearTablaLateral("Modos de Juego", modos, "der");
  document.body.append(tablaIzq, tablaDer);

  gsap.from([".tabla-lateral.izq", ".tabla-lateral.der"], { opacity: 0, y: 50, duration: 1.3, stagger: 0.3, ease: "power2.out" });

  function crearTablaLateral(titulo, data, lado) {
    const cont = document.createElement("div");
    cont.classList.add("tabla-lateral", lado);
    const header = document.createElement("h3");
    header.textContent = titulo;
    cont.appendChild(header);
    data.forEach(ev => {
      const evento = document.createElement("div");
      evento.classList.add("evento");
      evento.innerHTML = `
        <span>${ev.nombre}</span>
        <div class="progreso-barra">
          <div class="progreso" style="width: ${ev.progreso}%;"></div>
        </div>
        <span class="progreso-texto">${ev.progreso}%</span>
      `;
      cont.appendChild(evento);
    });
    return cont;
  }

  // =====================================================
  // 🔹 BOTÓN "Seleccionar"
  // =====================================================
  const btnSeleccionar = document.getElementById("btnSeleccionar");
  if (btnSeleccionar) {
    btnSeleccionar.style.display = "none";
    btnSeleccionar.style.opacity = 0;
    btnSeleccionar.style.pointerEvents = "none";

    btnSeleccionar.addEventListener("click", () => {
      gsap.to(menu, {
        scale: 1.2,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => (window.location.href = "vehiculos.html")
      });

      gsap.to(btnSeleccionar, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          btnSeleccionar.style.display = "none";
          btnSeleccionar.style.pointerEvents = "none";
        }
      });
    });
  }

  // =====================================================
  // 🔹 FUNCIÓN PARA OCULTAR DECORACIONES
  // =====================================================
  function ocultarDecoraciones() {
    const selectors = [
      ".barra-superior",
      ".descripcion-juego",
      ".panel-lateral",
      ".decor",
      ".hud-overlay",
      ".luz",
      ".npc",
      ".tituloJuego"
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.closest && el.closest("#menu")) return;
        gsap.to(el, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => (el.style.display = "none")
        });
      });
    });

    // const contBot = document.querySelector(".botones-menu");
    // if (contBot) gsap.to(contBot, { opacity: 0, y: 30, duration: 0.6, onComplete: () => (contBot.style.display = "none") });

    // Avatar visible pero sin texto
    const perfil = document.querySelector(".perfil-jugador");
    if (perfil) {
      const avatarImg = perfil.querySelector(".avatar-jugador");
      if (avatarImg) {
        gsap.to(perfil, { width: "80px", height: "80px", duration: 0.6 });
        perfil.querySelectorAll("h3, p").forEach(t =>
          gsap.to(t, { opacity: 0, duration: 0.4, onComplete: () => (t.style.display = "none") })
        );
      }
    }
  }

  // =====================================================
  // 🔹 EVENTOS DE CATEGORÍA
  // =====================================================
  btnArmas.addEventListener("click", () => {
    mostrarCategoria("arma", btnSeleccionar);
    gsap.delayedCall(0.28, ocultarDecoraciones);
  });

  btnBombas.addEventListener("click", () => {
    mostrarCategoria("bomba", btnSeleccionar);
    gsap.delayedCall(0.28, ocultarDecoraciones);
  });

  btnGranadas.addEventListener("click", () => {
    mostrarCategoria("granada", btnSeleccionar);
    gsap.delayedCall(0.28, ocultarDecoraciones);
  });
});

// =====================================================
// 🔹 FUNCIONES DE CARDS
// =====================================================
function crearCard(item) {
  const card = document.createElement("div");
  card.classList.add("card-arma");

  const info = document.createElement("div");
  info.classList.add("info-arma");
  info.innerHTML = `
    <h2>${item.nombre}</h2>
    <p>Daño: <span>${item.daño ?? "N/A"}</span></p>
    <p>Cadencia: <span>${item.cadencia ?? item.tipo ?? "N/A"}</span></p>
    <p>Precisión: <span>${item.precision ?? item.efecto ?? "N/A"}</span></p>
  `;

  const imagenDiv = document.createElement("div");
  imagenDiv.classList.add("imagen-arma");
  const imagen = document.createElement("img");
  imagen.src = item.imagen || "";
  imagen.alt = item.nombre || "";
  imagenDiv.appendChild(imagen);

  card.append(info, imagenDiv);
  return card;
}

function mostrarCategoria(tipo, btnSeleccionar) {
  const menu = document.getElementById("menu");
  const contBotones = document.querySelector(".botones-menu");

  document.querySelectorAll(".card-arma").forEach(c => c.remove());

  const seleccion = armamento.filter(obj => obj.id.startsWith(tipo));
  if (seleccion.length === 0) return;

  const cards = seleccion.map(crearCard);
  cards.forEach(card => {
    menu.appendChild(card);
    card.style.position = "absolute";
    card.style.top = "50%";
    card.style.left = "50%";
    card.style.transform = "translate(-50%, -50%)";
  });

  gsap.to(contBotones, { top: "10%", scale: 0.9, duration: 0.7, ease: "power2.out" });

  if (btnSeleccionar && btnSeleccionar.style.display === "none") {
    btnSeleccionar.style.display = "block";
    btnSeleccionar.style.pointerEvents = "auto";
    gsap.fromTo(btnSeleccionar, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" });
  }

  let currentIndex = 0;
  actualizarCarrusel();

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      currentIndex = index;
      actualizarCarrusel();
    });
  });

  function actualizarCarrusel() {
    cards.forEach((card, i) => {
      let x = 0, scale = 1, opacity = 1, z = 3, width = "400px", height = "300px";
      if (i < currentIndex - 1 || i > currentIndex + 1) {
        opacity = 0;
        z = 0;
      } else if (i === currentIndex - 1) {
        x = -350; scale = 0.85; opacity = 0.7; width = "310px"; height = "250px"; z = 2;
      } else if (i === currentIndex + 1) {
        x = 350; scale = 0.85; opacity = 0.7; width = "310px"; height = "250px"; z = 2;
      }
      gsap.to(card, { x, scale, opacity, width, height, zIndex: z, duration: 0.8, ease: "power2.out" });
    });
  }
}
