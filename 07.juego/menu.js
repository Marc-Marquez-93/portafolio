// menu.js completo (reemplaza tu archivo por este)
let armamento = [];

fetch('./armamento.json')
  .then(response => {
    if (!response.ok) throw new Error('Error al cargar el JSON');
    return response.json();
  })
  .then(data => {
    armamento = [
      ...data.armas,
      ...data.bombas,
      ...data.granadas
    ];
    console.log("✅ Armamento cargado correctamente:", armamento);
  })
  .catch(error => console.error("❌ Error:", error));

window.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");

  // animación inicial del menú (entrada + vibración)
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

  // contenedor de botones (Armas / Bombas / Granadas)
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

  // botón "Seleccionar" ya está en el HTML; lo buscamos y lo ocultamos ahora
  const btnSeleccionar = document.getElementById("btnSeleccionar");
  if (btnSeleccionar) {
    // oculto al inicio para que exista en el DOM pero no se vea ni reciba clicks
    btnSeleccionar.style.display = "none";
    btnSeleccionar.style.opacity = 0;
    btnSeleccionar.style.pointerEvents = "none";
  }

  // evento del botón seleccionar (está listo aunque esté oculto)
  if (btnSeleccionar) {
    btnSeleccionar.addEventListener("click", () => {
      gsap.to(menu, {
        scale: 1.2,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          window.location.href = "vehiculos.html";
        }
      });

      gsap.to(btnSeleccionar, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // opcional: mantener oculto
          btnSeleccionar.style.display = "none";
          btnSeleccionar.style.pointerEvents = "none";
        }
      });
    });
  }

  // eventos de categoría -> pasamos btnSeleccionar para que mostrarCategoria lo muestre
  btnArmas.addEventListener("click", () => mostrarCategoria("arma", btnSeleccionar));
  btnBombas.addEventListener("click", () => mostrarCategoria("bomba", btnSeleccionar));
  btnGranadas.addEventListener("click", () => mostrarCategoria("granada", btnSeleccionar));
});


// Crear una card individual
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
  card.appendChild(info);
  card.appendChild(imagenDiv);

  return card;
}


// Mostrar cards con animación tipo carrusel (no circular)
// recibe btnSeleccionar para poder mostrarlo cuando el usuario seleccione categoría
function mostrarCategoria(tipo, btnSeleccionar) {
  const menu = document.getElementById("menu");
  const contBotones = document.querySelector(".botones-menu");

  // Quitar cards anteriores
  document.querySelectorAll(".card-arma").forEach(c => c.remove());

  // Filtrar por tipo
  const seleccion = armamento.filter(obj => obj.id.startsWith(tipo));
  if (seleccion.length === 0) return;

  // Crear y agregar cards
  const cards = seleccion.map(crearCard);
  cards.forEach(card => {
    menu.appendChild(card);
    card.style.position = "absolute";
    card.style.top = "50%";
    card.style.left = "50%";
    card.style.transform = "translate(-50%, -50%)";
  });

  // Animar subida de botones
  gsap.to(contBotones, {
    top: "10%",
    scale: 0.9,
    duration: 0.7,
    ease: "power2.out"
  });

  // Mostrar el botón Seleccionar si estaba oculto (AHORA SÍ se muestra tras elegir categoría)
  if (btnSeleccionar && btnSeleccionar.style.display === "none") {
    btnSeleccionar.style.display = "block";
    btnSeleccionar.style.pointerEvents = "auto";
    gsap.fromTo(btnSeleccionar,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
    );
  }

  let currentIndex = 0;
  actualizarCarrusel();

  // Eventos de clic en cards
  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      currentIndex = index;
      actualizarCarrusel();
    });
  });

  // Actualizar la posición visual del carrusel
  function actualizarCarrusel() {
    cards.forEach((card, i) => {
      let x = 0, scale = 1, opacity = 1, z = 3, width = "400px", height = "300px";

      if (i < currentIndex - 1 || i > currentIndex + 1) {
        opacity = 0;
        z = 0;
      } else if (i === currentIndex) {
        // Card principal (centro)
        x = 0;
        scale = 1;
        width = "400px";
        height = "300px";
        z = 3;
      } else if (i === currentIndex - 1) {
        // Card izquierda
        x = -350;
        scale = 0.85;
        opacity = 0.7;
        width = "310px";
        height = "250px";
        z = 2;
      } else if (i === currentIndex + 1) {
        // Card derecha
        x = 350;
        scale = 0.85;
        opacity = 0.7;
        width = "310px";
        height = "250px";
        z = 2;
      }

      gsap.to(card, {
        x,
        scale,
        opacity,
        width,
        height,
        zIndex: z,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }
}
