// 🔹 Datos de vehículos desde un archivo JSON
let vehiculos = [];

fetch('./vehiculos.json')
  .then(response => {
    if (!response.ok) throw new Error('Error al cargar el JSON');
    return response.json();
  })
  .then(data => {
    vehiculos = [
      ...data.tanques,
      ...data.helicopteros,
      ...data.drones
    ];
    console.log("✅ Vehículos cargados correctamente:", vehiculos);
  })
  .catch(error => console.error("❌ Error:", error));


// 🔹 ANIMACIÓN DE ENTRADA DEL MENÚ + TEMBLOR SUAVE
window.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");

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

  // 🔹 Crear contenedor de botones
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

  // 🔹 Botón "Seleccionar" (oculto al inicio)
  const btnSeleccionar = document.createElement("button");
  btnSeleccionar.id = "btnSeleccionar";
  btnSeleccionar.textContent = "Seleccionar";
  btnSeleccionar.classList.add("btn-seleccionar");
  btnSeleccionar.style.display = "none";
  document.body.appendChild(btnSeleccionar);

  // Eventos de categoría
  btnTanques.addEventListener("click", () => mostrarCategoria("tanque"));
  btnHelis.addEventListener("click", () => mostrarCategoria("helicoptero"));
  btnDrones.addEventListener("click", () => mostrarCategoria("drone"));

  // 🔹 Animación botón seleccionar al hacer clic
  btnSeleccionar.addEventListener("click", () => {
    gsap.to(menu, {
      scale: 1.2,
      opacity: 0,
      filter: "blur(10px)",
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        window.location.href = "final.html"; // siguiente paso o pantalla
      }
    });

    gsap.to(btnSeleccionar, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: "power2.out"
    });
  });
});


// 🔹 Crear una card individual (imagen arriba + info abajo)
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

  card.appendChild(imagenDiv);
  card.appendChild(info);

  return card;
}


// 🔹 Mostrar cards con animación tipo carrusel
function mostrarCategoria(tipo) {
  const menu = document.getElementById("menu");
  const contBotones = document.querySelector(".botones-menu");
  const btnSeleccionar = document.getElementById("btnSeleccionar");

  // Mostrar botón seleccionar solo una vez
  if (btnSeleccionar.style.display === "none") {
    gsap.fromTo(btnSeleccionar, 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
    );
    btnSeleccionar.style.display = "block";
  }

  // Quitar cards anteriores
  document.querySelectorAll(".card-vehiculo").forEach(c => c.remove());

  // Filtrar por tipo
  const seleccion = vehiculos.filter(obj => obj.id.startsWith(tipo));
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

  // Subir los botones principales
  gsap.to(contBotones, {
    top: "10%",
    scale: 0.9,
    duration: 0.7,
    ease: "power2.out"
  });

  let currentIndex = 0;
  actualizarCarrusel();

  // Clicks en cards
  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      currentIndex = index;
      actualizarCarrusel();
    });
  });

  // Carrusel animado con GSAP
  function actualizarCarrusel() {
    cards.forEach((card, i) => {
      let x = 0, scale = 1, opacity = 1, z = 3, width = "400px", height = "350px";

      if (i < currentIndex - 1 || i > currentIndex + 1) {
        opacity = 0;
        z = 0;
      } else if (i === currentIndex) {
        x = 0;
        scale = 1;
        z = 3;
        width = "400px";
        height = "350px";
      } else if (i === currentIndex - 1) {
        x = -350;
        scale = 0.85;
        opacity = 0.7;
        width = "310px";
        height = "280px";
        z = 2;
      } else if (i === currentIndex + 1) {
        x = 350;
        scale = 0.85;
        opacity = 0.7;
        width = "310px";
        height = "280px";
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

