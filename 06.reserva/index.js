'use strict';

let mesas = JSON.parse(localStorage.getItem("mesas")) || [];
let mesaEnEdicion = null;

function actualizarLocalStorage() {
  localStorage.setItem("mesas", JSON.stringify(mesas));
}

function generarIdMesa() {
  if (!Array.isArray(mesas) || mesas.length === 0) return "mesa 1";
  return "mesa " + (mesas.length + 1);
}

function reindexMesas() {
  mesas.forEach((m, i) => m.id = "mesa " + (i + 1));
}

function pintarMesa(mesa) {
  const imgs = {
    1: "https://i.pinimg.com/originals/8f/97/06/8f9706e41f937ea944da9aba1170f7bb.jpg",
    2: "https://www.ikea.com/cl/es/images/products/vedbo-mesa-de-comedor-blanco__0815092_pe772753_s5.jpg?f=xxs",
    3: "https://www.ikea.com/nl/nl/images/products/vedbo-vedbo-tafel-met-6-stoelen-wit-berken__0809383_pe771026_s5.jpg?f=xxs",
    4: "https://mueblesfest.com/wp-content/uploads/2021/01/comedor_8_personas.jpg",
    5: "https://www.trademdesign.com.ar/wp-content/uploads/2023/02/WhatsApp-Image-2023-02-19-at-04.57.06-e1676796479297.jpeg"
  };

  const mesitas = document.getElementById("mesas");
  if (!mesitas) return;

  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta");
  tarjeta.setAttribute("data-id", mesa.id);

  const titulo = document.createElement("h1");
  titulo.classList.add("titulo2");
  titulo.textContent = mesa.id;
  tarjeta.appendChild(titulo);

  const img = document.createElement("img");
  switch (mesa.capacidad) {
    case "2": img.src = imgs[1]; break;
    case "3":
    case "4": img.src = imgs[2]; break;
    case "5":
    case "6": img.src = imgs[3]; break;
    case "7":
    case "8": img.src = imgs[4]; break;
    default: img.src = imgs[5]; break;
  }
  img.alt = mesa.id;
  img.classList.add("imgTarjeta");
  tarjeta.appendChild(img);

  const capacidad = document.createElement("p");
  capacidad.classList.add("texto");
  capacidad.textContent = "Capacidad: " + mesa.capacidad + " personas";
  tarjeta.appendChild(capacidad);

  const ubicacion = document.createElement("p");
  ubicacion.classList.add("texto");
  ubicacion.textContent = "Ubicación: " + mesa.ubicacion;
  tarjeta.appendChild(ubicacion);

  const estado = document.createElement("p");
  estado.classList.add("texto");
  switch (mesa.estado) {
    case "1":
      estado.textContent = "Estado: Disponible";
      tarjeta.style.backgroundColor = "#37ac10";
      break;
    case "2":
      estado.textContent = "Estado: Ocupada";
      tarjeta.style.backgroundColor = "#9d2121";
      break;
    case "3":
      estado.textContent = "Estado: Deshabilitada";
      tarjeta.style.backgroundColor = "#1c1c1c";
      break;
  }
  tarjeta.appendChild(estado);

  const boton1 = document.createElement("button");
  boton1.classList.add("btn", "btn-outline-warning", "me-2");
  boton1.textContent = "Editar";

  const boton2 = document.createElement("button");
  boton2.classList.add("btn", "btn-outline-danger");
  boton2.textContent = "Eliminar";

  const botones = document.createElement("div");
  botones.classList.add("botones");
  botones.appendChild(boton1);
  botones.appendChild(boton2);
  tarjeta.appendChild(botones);

  mesitas.appendChild(tarjeta);

  boton1.addEventListener("click", () => abrirEditarMesa(mesa.id));
  boton2.addEventListener("click", () => eliminarMesa(mesa.id));
}

function abrirEditarMesa(idMesa) {
  mesaEnEdicion = idMesa;
  const mesa = mesas.find(m => m.id === idMesa);
  if (!mesa) return;

  document.getElementById("id").value = mesa.id;
  document.getElementById("capacidad").value = mesa.capacidad;
  document.getElementById("ubicacion").value = mesa.ubicacion;
  document.getElementById("estado").value = mesa.estado;
  mesa.bloqueos = mesa.bloqueos || [];

  // 🔸 Bloquear el cambio de estado si hay una reserva activa en este momento
  const ahora = new Date().getTime();
  const estadoSelect = document.getElementById("estado");
  let reservaActiva = false;

  if (Array.isArray(mesa.bloqueos)) {
    for (const bloque of mesa.bloqueos) {
      const inicio = new Date(bloque.inicio).getTime();
      const fin = new Date(bloque.fin).getTime();
      if (ahora >= inicio && ahora < fin) {
        reservaActiva = true;
        break;
      }
    }
  }

  if (reservaActiva) {
    estadoSelect.value = "2"; // Ocupada
    estadoSelect.disabled = true;
  } else {
    estadoSelect.disabled = false;
  }

  const btnSave = document.getElementById("save");
  if (btnSave) btnSave.textContent = "Editar";

  const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
  modal.show();
}

function eliminarMesa(idMesa) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      mesas = mesas.filter(m => m.id !== idMesa);
      reindexMesas();
      actualizarLocalStorage();
      const cont = document.getElementById("mesas");
      if (cont) {
        cont.innerHTML = "";
        mesas.forEach(m => pintarMesa(m));
      }
      mesaEnEdicion = null;
      const btnSave = document.getElementById("save");
      if (btnSave) btnSave.textContent = "Guardar";

      Swal.fire({
        title: "Eliminado!",
        text: "La mesa ha sido eliminada.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

const form = document.getElementById('mesaForm');
const btnSave = document.getElementById("save");

if (btnSave) {
  btnSave.addEventListener("click", () => {
    const capacidad = document.getElementById("capacidad").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const estado = document.getElementById("estado").value;

    if (!capacidad) {
      Swal.fire({
        title: "Falta la capacidad",
        text: "Por favor ingresa cuántas personas puede atender la mesa.",
        icon: "warning"
      });
      return;
    }

    if (!ubicacion) {
      Swal.fire({
        title: "Falta la ubicación",
        text: "Por favor ingresa la ubicación de la mesa (por ejemplo: Terraza o Interior).",
        icon: "warning"
      });
      return;
    }

    if (!estado) {
      Swal.fire({
        title: "Falta el estado",
        text: "Selecciona si la mesa está disponible, ocupada o deshabilitada.",
        icon: "warning"
      });
      return;
    }

    const capacidadNum = parseInt(capacidad);
    if (isNaN(capacidadNum) || capacidadNum < 2 || capacidadNum > 20) {
      Swal.fire({
        title: "Datos inválidos",
        text: "La capacidad debe estar entre 2 y 20 personas",
        icon: "error"
      });
      return;
    }

    if (ubicacion.length < 2) {
      Swal.fire({
        title: "Ubicación inválida",
        text: "La ubicación debe tener al menos 2 caracteres",
        icon: "error"
      });
      return;
    }

    if (mesaEnEdicion) {
      const mesa = mesas.find(m => m.id === mesaEnEdicion);
      if (mesa) {
        mesa.capacidad = capacidad;
        mesa.ubicacion = ubicacion;
        mesa.estado = estado;
        actualizarLocalStorage();
        document.getElementById("mesas").innerHTML = "";
        mesas.forEach(m => pintarMesa(m));

        mesaEnEdicion = null;
        btnSave.textContent = "Guardar";
      }
    } else {
      const nuevaMesa = {
        id: document.getElementById("id").value,
        capacidad,
        ubicacion,
        estado,
        bloqueos: [] // ← nuevo campo
      };
      mesas.push(nuevaMesa);
      actualizarLocalStorage();
      pintarMesa(nuevaMesa);
      console.log("Mesa guardada:", nuevaMesa);
    }

    Swal.fire({
      title: "Mesa guardada",
      text: "¡La mesa fue registrada exitosamente!",
      icon: "success"
    }).then(() => {
      const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
      modal.hide(); // ✅ cerrar modal solo después del SweetAlert
    });

    document.getElementById("capacidad").value = "";
    document.getElementById("ubicacion").value = "";
    document.getElementById("estado").selectedIndex = 0;
    form.classList.remove('was-validated');
  });
}

const modalAgregar = document.getElementById("exampleModal");
if (modalAgregar) {
  modalAgregar.addEventListener("show.bs.modal", () => {
    if (!mesaEnEdicion) {
      const inputId = document.getElementById("id");
      if (inputId) {
        inputId.value = generarIdMesa();
        inputId.readOnly = true;
      }
      const btn = document.getElementById("save");
      if (btn) btn.textContent = "Guardar";
    }
  });
}

// 🕒 Actualizar reloj y recargar mesas cada minuto
function actualizarReloj() {
  const relojDiv = document.getElementById("reloj");
  const ahora = new Date();

  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  };

  relojDiv.textContent = ahora.toLocaleString("es-CO", opciones);
}

// 🔁 Recargar las mesas en tiempo real
function recargarMesas() {
  const cont = document.getElementById("mesas");
  if (!cont) return;
  cont.innerHTML = "";

  // Revisar estado de mesas según bloqueos y hora actual
  const ahora = new Date().getTime();
  mesas.forEach(mesa => {
    let ocupada = false;
    if (Array.isArray(mesa.bloqueos)) {
      for (const bloque of mesa.bloqueos) {
        const inicio = new Date(bloque.inicio).getTime();
        const fin = new Date(bloque.fin).getTime();
        if (ahora >= inicio && ahora < fin) {
          ocupada = true;
          break;
        }
      }
    }
    mesa.estado = ocupada ? "2" : "1"; // 2=ocupada, 1=disponible
  });

  localStorage.setItem("mesas", JSON.stringify(mesas));
  mesas.forEach(m => pintarMesa(m));
}

// 🔂 Ejecutar reloj y refrescar cada minuto
setInterval(() => {
  actualizarReloj();
  recargarMesas();
  actualizarReservasAutomaticamente();
}, 60000); // cada 60 segundos

// Llamar al cargar la página
actualizarReloj();
recargarMesas();

// 🔄 Escuchar cambios en localStorage desde otras pestañas o scripts
window.addEventListener("storage", (event) => {
  if (event.key === "mesas") {
    // Esperar un momento para asegurar que los datos ya se guardaron
    setTimeout(() => {
      location.reload(); // 🔥 Recargar la página automáticamente
    }, 2000);
  }
});
