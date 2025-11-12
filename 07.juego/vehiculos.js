// =====================================================
// ✅ VEHICULOS.JS FINAL — Con el estilo completo del menú principal
// =====================================================

let vehiculos = [];

// =====================================================
// 🔹 CARGA DE DATOS DESDE vehiculos.json
// =====================================================
fetch('./vehiculos.json')
  .then(response => {
    if (!response.ok) throw new Error('Error al cargar el JSON');
    return response.json();
  })
  .then(data => {
    vehiculos = [...data.tanques, ...data.helicopteros, ...data.drones];
    console.log("✅ Vehículos cargados correctamente:", vehiculos);
  })
  .catch(error => console.error("❌ Error:", error));

// =====================================================
// 🔹 INICIO DE INTERFAZ Y ANIMACIONES
// =====================================================
window.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");

  // ANIMACIÓN DE ENTRADA
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
        duration: 0.15,
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
  titulo.classList.add("tituloJuego");
  titulo.textContent = "WARZONE OPS: VEHÍCULOS";
  document.body.appendChild(titulo);

  const descripcion = document.createElement("div");
  descripcion.classList.add("descripcion-juego");
  descripcion.innerHTML = `
    <h2>Operación “Steel Thunder”</h2>
    <p>Selecciona tu vehículo táctico y domina el campo de batalla. 
    Tanques, helicópteros o drones: cada unidad tiene su propósito y poder.</p>
  `;
  document.body.appendChild(descripcion);

  gsap.from("#tituloJuego", { opacity: 0, y: -40, scale: 0.8, duration: 1.3, ease: "back.out(1.7)" });
  gsap.from(".descripcion-juego", { opacity: 0, y: 30, duration: 1.5, ease: "power2.out" });

  // =====================================================
  // 🔹 PERFIL DE USUARIO
  // =====================================================
  const perfil = document.createElement("div");
  perfil.classList.add("perfil-jugador");
  perfil.innerHTML = `
    <img src="https://i.pinimg.com/736x/ee/9a/34/ee9a346df1608a443047762a724a5644.jpg" alt="avatar" class="avatar-jugador" />
    <div>
      <h3>Capitán Miguel</h3>
      <p>Rango: Comandante</p>
    </div>
  `;
  document.body.appendChild(perfil);
  gsap.from(".perfil-jugador", { opacity: 0, y: 40, duration: 1, delay: 0.5 });

  // =====================================================
  // 🔹 TABLAS LATERALES (EVENTOS Y MISIONES)
  // =====================================================
  const eventos = [
    { nombre: "🚀 Despliegue aéreo", progreso: 60 },
    { nombre: "🪖 Patrulla táctica", progreso: 80 },
    { nombre: "🔥 Misiones blindadas", progreso: 45 }
  ];

  const modos = [
    { nombre: "⚔️ Conquista territorial", progreso: 100 },
    { nombre: "💣 Defensa estratégica", progreso: 75 },
    { nombre: "🚁 Dominio aéreo", progreso: 55 }
  ];

  const tablaIzq = crearTablaLateral("Operaciones Activas", eventos, "izq");
  const tablaDer = crearTablaLateral("Modos de Combate", modos, "der");
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
  // 🔹 BOTONES PRINCIPALES
  // =====================================================
  const contBotones = document.createElement("div");
  contBotones.classList.add("botones-menu");

  const btnTanques = document.createElement("button");
  btnTanques.textContent = "Tanques";

  const btnHelis = document.createElement("button");
  btnHelis.textContent = "Helicópteros";

  const btnDrones = document.createElement("button");
  btnDrones.textContent = "Drones";

  contBotones.append(btnTanques, btnHelis, btnDrones);
  menu.appendChild(contBotones);

  gsap.utils.toArray(".botones-menu button").forEach((btn, i) => {
    gsap.to(btn, { y: "+=5", repeat: -1, yoyo: true, duration: 1.5 + i * 0.3, ease: "sine.inOut" });
  });

  // =====================================================
  // 🔹 BOTÓN "Seleccionar"
  // =====================================================
  const btnSeleccionar = document.createElement("button");
  btnSeleccionar.id = "btnSeleccionar";
  btnSeleccionar.textContent = "Seleccionar";
  btnSeleccionar.classList.add("btn-seleccionar");
  btnSeleccionar.style.display = "none";
  document.body.appendChild(btnSeleccionar);

  btnSeleccionar.addEventListener("click", () => {
    gsap.to(menu, {
      scale: 1.2,
      opacity: 0,
      filter: "blur(10px)",
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => (window.location.href = "final.html")
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

  // =====================================================
  // 🔹 FUNCIÓN: ocultar título, descripción y barra superior
  // =====================================================
  let encabezadoOculto = false;
  function ocultarEncabezado() {
    if (encabezadoOculto) return; // evita repetir la animación
    encabezadoOculto = true;

    const elementos = [
      titulo, // referencia directa
      descripcion, // referencia directa
      barra // referencia directa
    ].filter(Boolean);

    elementos.forEach(el => {
      gsap.to(el, {
        opacity: 0,
        y: -30,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          // ocultar del flujo una vez termine la animación
          if (el && el.style) el.style.display = "none";
        }
      });
    });
  }

  // =====================================================
  // 🔹 EVENTOS DE CATEGORÍA (ahora llaman a ocultarEncabezado primero)
  // =====================================================
  btnTanques.addEventListener("click", () => {
    ocultarEncabezado();
    mostrarCategoria("tanque", btnSeleccionar);
  });
  btnHelis.addEventListener("click", () => {
    ocultarEncabezado();
    mostrarCategoria("helicoptero", btnSeleccionar);
  });
  btnDrones.addEventListener("click", () => {
    ocultarEncabezado();
    mostrarCategoria("drone", btnSeleccionar);
  });
});

// =====================================================
// 🔹 FUNCIONES DE CARDS DE VEHÍCULOS
// =====================================================
function crearCard(item) {
  const card = document.createElement("div");
  card.classList.add("card-vehiculo");

  const imagenDiv = document.createElement("div");
  imagenDiv.classList.add("imagen-vehiculo");

  const imagen = document.createElement("img");
  imagen.src = item.imagen;
  imagen.alt = item.nombre;
  imagenDiv.appendChild(imagen);

  const info = document.createElement("div");
  info.classList.add("info-vehiculo");
  info.innerHTML = `
    <h2>${item.nombre}</h2>
    <p><strong>Rol:</strong> ${item.rol}</p>
    <p>${item.descripcion}</p>
  `;

  card.append(imagenDiv, info);
  return card;
}

function mostrarCategoria(tipo, btnSeleccionar) {
  const menu = document.getElementById("menu");
  const contBotones = document.querySelector(".botones-menu");

  document.querySelectorAll(".card-vehiculo").forEach(c => c.remove());

  const seleccion = vehiculos.filter(obj => obj.id.startsWith(tipo));
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
      let x = 0, scale = 1, opacity = 1, z = 3, width = "400px", height = "350px";

      if (i < currentIndex - 1 || i > currentIndex + 1) {
        opacity = 0;
        z = 0;
      } else if (i === currentIndex - 1) {
        x = -350; scale = 0.85; opacity = 0.7; width = "310px"; height = "280px"; z = 2;
      } else if (i === currentIndex + 1) {
        x = 350; scale = 0.85; opacity = 0.7; width = "310px"; height = "280px"; z = 2;
      }
      gsap.to(card, { x, scale, opacity, width, height, zIndex: z, duration: 0.8, ease: "power2.out" });
    });
  }
}
