'use strict';

// Inicializar reservas global
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

// Inicializar datepicker y timepicker
$('#datepicker').datepicker({
  minDate: new Date(),
  uiLibrary: 'bootstrap5'
});

$('#timepicker').timepicker({
  uiLibrary: 'bootstrap5',
  format: 'HH:MM', // 🔹 como en tu código original
  minTime: '08:00',
  maxTime: '20:00'
});

// Generar ID de reserva (como en tu código original)
function generarIdReserva() {
  return "ID-" + Date.now();
}

//funcion auxiliar
// Parsear fecha dd/mm/yyyy (o dd-mm-yyyy) + hora "HH:MM" -> Date fiable
function parseFechaHora(fechaStr, horaStr) {
  if (!fechaStr) return new Date(NaN);

  const parts = fechaStr.split('/');
  if (parts.length !== 3) return new Date(NaN);

  const m = parseInt(parts[0], 10); // mes primero
  const d = parseInt(parts[1], 10); // luego día
  const y = parseInt(parts[2], 10); // año

  const match = (horaStr || '').match(/^(\d{1,2}):(\d{2})$/);
  const hh = match ? parseInt(match[1], 10) : 0;
  const mm = match ? parseInt(match[2], 10) : 0;

  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

// Al abrir el modal, generar ID
// Al abrir el modal de crear reserva
const modalAgregar = document.getElementById("exampleModal");
if (modalAgregar) {
  modalAgregar.addEventListener("show.bs.modal", () => {
    const btnGuardar = document.getElementById("save2");

    // Si ya está en modo edición, salimos (no sobreescribimos campos)
    if (btnGuardar && btnGuardar.textContent === "Editar") return;

    // Modo NUEVA reserva (poner ID, forzar estado pendiente y bloquear select)
    const inputId = document.getElementById("id");
    inputId.value = generarIdReserva();
    inputId.readOnly = true;

    const estadoSelect = document.getElementById("estado");
    if (estadoSelect) {
      estadoSelect.value = "1"; // pendiente
      estadoSelect.disabled = true;
    }

    btnGuardar.textContent = "Guardar";
    btnGuardar.onclick = null;
  });

  // Al cerrar siempre limpiar y volver a la configuración por defecto (nuevo)
  modalAgregar.addEventListener("hidden.bs.modal", () => {
    const btnGuardar = document.getElementById("save2");
    document.getElementById("reservaForm").reset();
    $('#datepicker').val('');
    $('#timepicker').val('');
    const selectMesa = document.getElementById("mesaDisponible");
    if (selectMesa) selectMesa.selectedIndex = 0;

    if (btnGuardar) { btnGuardar.textContent = "Guardar"; btnGuardar.onclick = null; }

    const estadoSelect = document.getElementById("estado");
    if (estadoSelect) { estadoSelect.value = "1"; estadoSelect.disabled = true; }
  });
}


// Verificar si una mesa está bloqueada en ese horario
function estaBloqueada(mesa, fechaStr, horaStr) {
  const momento = parseFechaHora(fechaStr, horaStr).getTime();
  return (mesa.bloqueos || []).some(b => {
    const inicio = new Date(b.inicio).getTime();
    const fin = new Date(b.fin).getTime();
    return momento >= inicio && momento < fin;
  });
}

// Cambiar estado de mesa (blindado a string)
function cambiarEstadoMesa(id, nuevoEstado) {
  const mesas = JSON.parse(localStorage.getItem("mesas")) || [];
  const mesa = mesas.find(m => m.id === id);
  if (mesa) {
    mesa.estado = String(nuevoEstado); // 🔹 siempre string
    localStorage.setItem("mesas", JSON.stringify(mesas));
    console.log(`Mesa ${id} actualizada a estado ${nuevoEstado}`);
  }
}

// Guardar reserva
document.getElementById('save2').addEventListener('click', () => {
  const usuario = document.getElementById('usuario').value.trim();
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const fechaStr = $('#datepicker').val().trim();
  const horaStr = $('#timepicker').val().trim();
  const ocasion = document.getElementById('ocasion').value;
  const notas = document.getElementById('notas').value.trim();
  const estado = document.getElementById('estado').value;
  const id = document.getElementById('id').value;
  const mesaId = document.getElementById("mesaDisponible").value;

  // Validaciones
  if (!usuario || !cantidad || !fechaStr || !horaStr || !ocasion || !notas || !estado || !mesaId) {
    return Swal.fire({ title: 'Faltan datos', text: 'Completa todos los campos', icon: 'warning' });
  }

  if (usuario.length < 2 || /\d/.test(usuario)) {
    return Swal.fire({ title: 'Nombre inválido', text: 'No debe contener números o ser tan corto', icon: 'error' });
  }

  if (isNaN(cantidad) || cantidad < 2 || cantidad > 20) {
    return Swal.fire({ title: 'Cantidad inválida', text: 'Entre 2 y 20 personas', icon: 'error' });
  }

  const inicio = parseFechaHora(fechaStr, horaStr);
  if (isNaN(inicio.getTime())) {
    return Swal.fire({ title: 'Fecha inválida', text: 'No se pudo interpretar la fecha', icon: 'error' });
  }

  // 🔹 2 horas de duración para el bloqueo
  const fin = new Date(inicio.getTime() + 2 * 60 * 60 * 1000);

  const ahora = new Date();

  // 🔹 compara en milisegundos para evitar errores
  if (inicio.getTime() <= ahora.getTime()) {
    return Swal.fire({ title: 'Fecha inválida', text: 'No puedes reservar en el pasado', icon: 'error' });
  }

  // 🔸 Validar reserva demasiado próxima (solo posteriores)
  const reservasPosteriores = reservas.filter(r =>
    r.mesaId === mesaId && r.fecha === fechaStr
  );

  for (const r of reservasPosteriores) {
    const otraHora = parseFechaHora(r.fecha, r.hora);
    const diferencia = (otraHora.getTime() - inicio.getTime()) / (60 * 60 * 1000);
    if (diferencia > 0 && diferencia <= 1) {
      return Swal.fire({
        title: 'Reserva demasiado próxima',
        text: 'Hay una reserva demasiado próxima en esta mesa.',
        icon: 'warning'
      });
    }
  }

  const match = horaStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    const [, hora, minuto] = match;
    const horaNum = parseInt(hora, 10);
    const minNum = parseInt(minuto, 10);
    if (horaNum < 8 || (horaNum === 20 && minNum > 0) || horaNum > 20) {
      return Swal.fire({ title: 'Hora inválida', text: 'Solo entre 08:00 y 20:00', icon: 'error' });
    }
  }

  const mesas = JSON.parse(localStorage.getItem("mesas")) || [];
  const mesa = mesas.find(m => m.id === mesaId);

  if (!mesa || estaBloqueada(mesa, fechaStr, horaStr)) {
    return Swal.fire({ title: 'Horario ocupado', text: 'La mesa ya está reservada', icon: 'error' });
  }

  // Guardar reserva
  const reserva = { id, usuario, cantidad, fecha: fechaStr, hora: horaStr, ocasion, notas, estado, mesaId };
  reservas.push(reserva);
  localStorage.setItem('reservas', JSON.stringify(reservas));

  // Bloquear mesa
  mesa.bloqueos = mesa.bloqueos || [];
  mesa.bloqueos.push({ inicio: inicio.toISOString(), fin: fin.toISOString() });
  localStorage.setItem("mesas", JSON.stringify(mesas));
  console.log("Bloqueo agregado a mesa:", mesa.id, mesa.bloqueos);

  // Programar estado
  programarCambiosEstado(mesaId, inicio, fin);

  Swal.fire({ title: 'Reserva guardada', text: '¡Registrada exitosamente!', icon: 'success' });
  bootstrap.Modal.getInstance(document.getElementById('exampleModal')).hide();
  document.getElementById('reservaForm').reset();
  $('#datepicker').val('');
  $('#timepicker').val('');

  mostrarReservasPorFecha(fechaStr);
});

// Programar estado de mesas de forma persistente
function programarCambiosEstado(mesaId, inicio, fin) {
  const ahora = Date.now();
  const tiempoHastaInicio = inicio.getTime() - ahora;
  const tiempoHastaFin = fin.getTime() - ahora;

  if (tiempoHastaInicio > 0) {
    setTimeout(() => cambiarEstadoMesa(mesaId, "2"), tiempoHastaInicio); // Ocupada
  } else if (tiempoHastaFin > 0) {
    cambiarEstadoMesa(mesaId, "2");
  }

  if (tiempoHastaFin > 0) {
    setTimeout(() => cambiarEstadoMesa(mesaId, "1"), tiempoHastaFin); // Disponible
  }
}

// Reprogramar reservas activas (y limpiar pasadas)
function reprogramarReservas() {
  const ahora = new Date();

  // 🔹 limpiar reservas pasadas
  reservas = reservas.filter(r => {
    const inicio = parseFechaHora(r.fecha, r.hora);
    const fin = new Date(inicio.getTime() + 2 * 60 * 60 * 1000);
    return fin > ahora;
  });

  localStorage.setItem("reservas", JSON.stringify(reservas));

  // reprogramar las que quedaron
  reservas.forEach(r => {
    const inicio = parseFechaHora(r.fecha, r.hora);
    const fin = new Date(inicio.getTime() + 2 * 60 * 60 * 1000);
    programarCambiosEstado(r.mesaId, inicio, fin);
  });
}
reprogramarReservas();

// Actualizar mesas disponibles (blindado con bloqueos)
function actualizarMesasDisponibles() {
  const mesas = JSON.parse(localStorage.getItem("mesas")) || [];
  const cantidadRaw = document.getElementById("cantidad").value;
  const cantidad = cantidadRaw ? parseInt(cantidadRaw, 10) : 0;
  const fecha = $('#datepicker').val().trim();
  const hora = $('#timepicker').val().trim();

  const selectMesa = document.getElementById("mesaDisponible");
  selectMesa.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = "Selecciona una mesa disponible";
  selectMesa.appendChild(placeholder);

  const disponibles = mesas.filter(m =>
    m.estado === "1" &&
    parseInt(m.capacidad) >= cantidad &&
    !estaBloqueada(m, fecha, hora)
  );

  disponibles.forEach(mesa => {
    const option = document.createElement("option");
    option.value = mesa.id;
    option.textContent = `${mesa.id} - Capacidad: ${mesa.capacidad}`;
    selectMesa.appendChild(option);
  });
}

// Listeners para actualizar el select dinámico
["cantidad", "datepicker", "timepicker"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("change", actualizarMesasDisponibles);
});

//lista de imagenes para las ocasiones

const ocasiones = [
  { id: 1, nombre: 'ninguna', url: 'https://as1.ftcdn.net/v2/jpg/07/39/16/68/1000_F_739166890_E3D5vlyqUWe8ZvIKeIQKbSaZculMZNp0.jpg' },
  { id: 2, nombre: 'cumpleaños', url: 'https://media-bitfinanzas-com.s3.amazonaws.com/wp-content/uploads/2021/01/Cumple-BTC-4-2.jpg' },
  { id: 3, nombre: 'aniversario', url: 'https://www.shutterstock.com/image-vector/old-couple-dance-vector-illustration-600nw-2301216983.jpg' },
  { id: 4, nombre: 'reunion de negocios', url: 'https://i.pinimg.com/736x/c1/34/5a/c1345ac2d7ffdfcc127bbda02aa58e6e.jpg' },
  { id: 5, nombre: 'matrimonio', url: 'https://media.admagazine.com/photos/641239e4d3f4fe9a251b2477/1:1/w_1999,h_1999,c_limit/destinos-para-bodas.jpg' },
  { id: 6, nombre: 'bautismo', url: 'https://i.pinimg.com/736x/9b/97/6c/9b976c9bfc511d229abc7e0a14fe10e4.jpg' },
  { id: 7, nombre: 'primera comunion', url: 'https://catequesisdegalicia.org/wp-content/uploads/2023/06/Fano-Corpus-883x1024.jpg' },
  { id: 8, nombre: 'graduacion', url: 'https://st2.depositphotos.com/3940783/48973/v/450/depositphotos_489736002-stock-illustration-vector-graduation-cute-little-boy.jpg' },
  { id: 9, nombre: 'confirmacion', url: 'https://www.shutterstock.com/image-vector/holy-spirit-dove-illustration-vector-600nw-2441037513.jpg' }
]

function pintarReserva(reserva) {
  const cont = document.getElementById("reservas");
  if (!cont) return;

  const tarjeta = document.createElement("div");
  tarjeta.classList.add("reserva-card");
  tarjeta.setAttribute("data-id", reserva.id);

  // 🔹 Imagen (izquierda)
  const imagenCont = document.createElement("div");
  imagenCont.classList.add("reserva-imagen");

  const img = document.createElement("img");
  const oc = ocasiones.find(o => o.id == reserva.ocasion);
  img.src = oc?.url || ocasiones[0].url;
  img.classList.add("imgTarjeta");
  imagenCont.appendChild(img);

  // 🔹 Contenedor derecho (datos + botones)
  const derechaCont = document.createElement("div");
  derechaCont.classList.add("reserva-derecha");

  // Sección morada: datos
  const datosCont = document.createElement("div");
  datosCont.classList.add("reserva-datos");

  const estados = { "1": "Pendiente", "2": "Confirmada", "3": "Cancelada", "4": "Finalizada", "5": "No show" };

  const campos = [
    `${reserva.id}`,
    `Cliente: ${reserva.usuario}`,
    `Personas: ${reserva.cantidad}`,
    `Hora: ${reserva.hora}`,
    `Estado: ${estados[reserva.estado] || reserva.estado}`,
    `Mesa: ${reserva.mesaId}`,
    `Ocasión: ${oc?.nombre || "Ninguna"}`
  ];

  campos.forEach(texto => {
    const el = document.createElement("div");
    el.textContent = texto;
    el.classList.add("reserva-item");
    datosCont.appendChild(el);
  });

  // Sección blanca: botones
  const botonesCont = document.createElement("div");
  botonesCont.classList.add("reserva-botones");

  const btnPagar = document.createElement("button");
  btnPagar.className = "btn btn-success btn-sm";
  btnPagar.textContent = "Pagar";
  btnPagar.addEventListener("click", () => pagarReserva(reserva.id));

  const btnEditar = document.createElement("button");
  btnEditar.className = "btn btn-warning btn-sm";
  btnEditar.textContent = "Editar";
  btnEditar.addEventListener("click", () => abrirModalEdicion(reserva));

  const btnEliminar = document.createElement("button");
  btnEliminar.className = "btn btn-danger btn-sm";
  btnEliminar.textContent = "Eliminar";
  btnEliminar.addEventListener("click", () => eliminarReserva(reserva.id));

  // 🔹 Ocultar botones si la reserva está cancelada, finalizada o no show
  if (["3", "4", "5"].includes(reserva.estado)) {
    btnPagar.style.display = "none";
    btnEditar.style.display = "none";
  }

  botonesCont.append(btnPagar, btnEditar, btnEliminar);

  // 🔹 Meter datos arriba y botones abajo en el contenedor derecho
  derechaCont.append(datosCont, botonesCont);

  // 🔹 Ensamblar todo: imagen a la izquierda, derecha con datos+botones
  tarjeta.append(imagenCont, derechaCont);
  cont.appendChild(tarjeta);
}

function mostrarReservasPorFecha(fecha) {
  const cont = document.getElementById("reservas");
  cont.innerHTML = "";
  cont.classList.add("reservas-grid");

  const filtradas = reservas.filter(r => r.fecha === fecha);

  if (!filtradas.length) {
    const mensaje = document.createElement("p");
    mensaje.classList.add("mensaje-reservas-vacio"); // 🔹 clase para estilizar
    mensaje.textContent = "No hay reservas en el día seleccionado.";
    cont.appendChild(mensaje);
    return;
  }

  filtradas.forEach(r => pintarReserva(r));
}

// referencias (asegúrate de que estos IDs existen en tu HTML)
const filtroEstado = document.getElementById("filtroEstado");
const textoFiltro = document.getElementById("textoFiltro");
let ultimaFechaFiltrada = null;

// click en "filtrar" -> guardar la fecha y mostrar reservas
document.getElementById("filtrar").addEventListener("click", () => {
  const fechaFiltro = $('#datepicker2').val().trim();
  if (!fechaFiltro) {
    Swal.fire("Selecciona una fecha para filtrar");
    return;
  }

  // Guardamos la fecha para que el select de estado pueda usarla
  ultimaFechaFiltrada = fechaFiltro;

  // Mostramos las reservas de la fecha
  mostrarReservasPorFecha(fechaFiltro);

  // Reiniciamos el select y el texto informativo
  if (filtroEstado) {
    filtroEstado.value = "";      // mostrar "Todos"
    filtroEstado.disabled = false;
  }
  if (textoFiltro) {
    textoFiltro.textContent = "Filtra por"; // texto base
  }
});

// Cambio en el select de estado -> filtrar por fecha + estado guardado
if (filtroEstado) {
  filtroEstado.addEventListener("change", (e) => {
    const estadoSeleccionado = e.target.value;
    const fecha = ultimaFechaFiltrada;
    if (!fecha) return; // si no hay fecha seleccionada no hacemos nada

    const estadosMap = {
      "1": "Pendiente",
      "2": "Confirmada",
      "3": "Cancelada",
      "4": "Finalizada",
      "5": "No show"
    };

    const cont = document.getElementById("reservas");
    cont.innerHTML = "";

    if (estadoSeleccionado) {
      // actualizar texto
      if (textoFiltro) textoFiltro.textContent = `Filtra por ${estadosMap[estadoSeleccionado]} 🔎`;

      // filtrar y mostrar
      const filtradas = reservas.filter(r => r.fecha === fecha && r.estado === estadoSeleccionado);
      if (!filtradas.length) {
        cont.innerHTML = "<p class='mensaje-reservas-vacio text-center mt-3'>No hay reservas con ese estado para esta fecha.</p>";
      } else {
        filtradas.forEach(r => pintarReserva(r));
      }
    } else {
      // "Todos"
      if (textoFiltro) textoFiltro.textContent = "Filtra por";
      mostrarReservasPorFecha(fecha);
    }
  });
}

// función auxiliar (opcional) para mostrar una lista ya filtrada
// (no es estrictamente necesaria si usan el código anterior, la dejo por si quieres llamar a esta función desde otra parte)
function mostrarReservasFiltradas(lista) {
  const cont = document.getElementById("reservas");
  cont.innerHTML = "";
  if (!lista || lista.length === 0) {
    cont.innerHTML = "<p class='mensaje-reservas-vacio text-center mt-3'>No hay reservas para esta selección.</p>";
    return;
  }
  lista.forEach(r => pintarReserva(r));
}

// 🔹 al cargar la página, mostrar reservas de hoy y setear filtro
document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Inicializar el datepicker con la fecha actual
  $('#datepicker2').datepicker({
    uiLibrary: 'bootstrap5',
    value: formatearFecha(new Date())
  });

  // 🔹 Mostrar reservas del día actual
  const hoy = formatearFecha(new Date());
  mostrarReservasPorFecha(hoy);

});

// 🔹 formatear fecha en dd/mm/yyyy (igual que datepicker)
function formatearFecha(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

document.getElementById("filtrar").addEventListener("click", () => {
  const fechaFiltro = $('#datepicker2').val().trim();
  if (!fechaFiltro) {
    Swal.fire("Selecciona una fecha para filtrar");
    return;
  }
  mostrarReservasPorFecha(fechaFiltro);
});

// editar reserva 
function abrirModalEdicion(reserva) {
  const form = document.getElementById("reservaForm");
  if (!form) return;

  // Rellenar campos
  document.getElementById("id").value = reserva.id;
  document.getElementById("usuario").value = reserva.usuario;
  document.getElementById("cantidad").value = reserva.cantidad;
  $('#datepicker').val(reserva.fecha);
  $('#timepicker').val(reserva.hora);
  document.getElementById("ocasion").value = reserva.ocasion;
  document.getElementById("notas").value = reserva.notas;
  document.getElementById("estado").value = reserva.estado;

  // 🔹 al editar, habilitar estado
  document.getElementById("estado").disabled = false;

  // 🔹 configurar la mesa
  const selectMesa = document.getElementById("mesaDisponible");
  selectMesa.innerHTML = "";

  // Agregar opción fija con la mesa actual, aunque esté bloqueada
  const optionActual = document.createElement("option");
  optionActual.value = reserva.mesaId;
  optionActual.textContent = `${reserva.mesaId} (actual)`;
  optionActual.selected = true;
  selectMesa.appendChild(optionActual);

  // 🔹 deshabilitar para evitar cambio
  selectMesa.disabled = true;

  // Configurar botón
  const btnGuardar = document.getElementById("save2");
  btnGuardar.textContent = "Editar";
  btnGuardar.onclick = () => guardarEdicion(reserva.id);

  const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
  modal.show();
}

// Guardar edición
function guardarEdicion(idOriginal) {
  const index = reservas.findIndex(r => r.id === idOriginal);
  if (index === -1) return;

  // --- Traer la reserva original desde el inicio (evita usarla antes de definirla)
  const oldReserva = reservas[index];

  // datos nuevos
  const usuario = document.getElementById('usuario').value.trim();
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const fechaStr = $('#datepicker').val().trim();
  const horaStr = $('#timepicker').val().trim();
  const ocasion = document.getElementById('ocasion').value;
  const notas = document.getElementById('notas').value.trim();
  const estado = document.getElementById('estado').value;
  const mesaId = document.getElementById("mesaDisponible").value;

  // 🔹 Validaciones idénticas a las del guardado normal
  if (!usuario || !cantidad || !fechaStr || !horaStr || !ocasion || !notas || !estado || !mesaId) {
    return Swal.fire({ title: 'Faltan datos', text: 'Completa todos los campos', icon: 'warning' });
  }

  if (usuario.length < 2 || /\d/.test(usuario)) {
    return Swal.fire({ title: 'Nombre inválido', text: 'Nombre muy corto o contiene números', icon: 'error' });
  }

  if (isNaN(cantidad) || cantidad < 2 || cantidad > 20) {
    return Swal.fire({ title: 'Cantidad inválida', text: 'Entre 2 y 20 personas', icon: 'error' });
  }

  const inicio = parseFechaHora(fechaStr, horaStr);
  if (isNaN(inicio.getTime())) {
    return Swal.fire({ title: 'Fecha inválida', text: 'No se pudo interpretar la fecha', icon: 'error' });
  }

  // --- Inicio original (tiempo en ms) - usado para impedir mover la reserva hacia atrás
  const oldInicioDate = parseFechaHora(oldReserva.fecha, oldReserva.hora);
  const oldInicioMs = oldInicioDate.getTime();

  // 🔹 Bloquear si intenta mover la hora hacia atrás (antes del inicio original)
  if (inicio.getTime() < oldInicioMs) {
    return Swal.fire({
      title: 'Hora inválida',
      text: 'No puedes asignar una hora anterior a la de la reserva original.',
      icon: 'error'
    });
  }

  // 🔸 Validar reserva demasiado próxima (solo posteriores, ignorando la misma)
  const reservasPosteriores = reservas.filter(r =>
    r.id !== idOriginal && r.mesaId === mesaId && r.fecha === fechaStr
  );

  for (const r of reservasPosteriores) {
    const otraHora = parseFechaHora(r.fecha, r.hora);
    const diferencia = (otraHora.getTime() - inicio.getTime()) / (60 * 60 * 1000);
    if (diferencia > 0 && diferencia <= 1) {
      return Swal.fire({
        title: 'Reserva demasiado próxima',
        text: 'Hay una reserva demasiado próxima en esta mesa.',
        icon: 'warning'
      });
    }
  }

  // Validar rango horario (08:00 - 20:00)
  const match = horaStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    const [, hora, minuto] = match;
    const horaNum = parseInt(hora, 10);
    const minNum = parseInt(minuto, 10);
    if (horaNum < 8 || (horaNum === 20 && minNum > 0) || horaNum > 20) {
      return Swal.fire({ title: 'Hora inválida', text: 'Solo entre 08:00 y 20:00', icon: 'error' });
    }
  }

  // datos antiguos (para limpiar bloqueo previo)
  const mesas = JSON.parse(localStorage.getItem("mesas")) || [];

  const mesa = mesas.find(m => m.id === mesaId);
  if (!mesa) {
    return Swal.fire({ title: 'Mesa no encontrada', text: 'Selecciona una mesa válida', icon: 'error' });
  }

  // 🔹 validar bloqueo excepto si pertenece a esta misma reserva
  const momento = inicio.getTime();
  const oldFinMs = oldInicioMs + 2 * 60 * 60 * 1000;
  const tieneOtroBloqueo = (mesa.bloqueos || []).some(b => {
    const bi = new Date(b.inicio).getTime();
    const bf = new Date(b.fin).getTime();
    const coincide = momento >= bi && momento < bf;

    // Si coincide pero pertenece a la misma reserva (oldReserva), lo ignoramos
    const mismoBloqueo = bi === oldInicioMs && bf === oldFinMs && mesa.id === oldReserva.mesaId;
    return coincide && !mismoBloqueo;
  });

  if (tieneOtroBloqueo) {
    return Swal.fire({
      title: 'Horario ocupado',
      text: 'La mesa ya está reservada en ese horario',
      icon: 'error'
    });
  }

  // --- Limpiar bloqueo previo en la mesa antigua (si aplica)
  if (oldReserva && oldReserva.mesaId) {
    const oldMesa = mesas.find(m => m.id === oldReserva.mesaId);
    if (oldMesa) {
      const oldInicioNum = parseFechaHora(oldReserva.fecha, oldReserva.hora).getTime();
      const oldFinNum = oldInicioNum + 2 * 60 * 60 * 1000;
      oldMesa.bloqueos = (oldMesa.bloqueos || []).filter(b => {
        const bi = new Date(b.inicio).getTime();
        const bf = new Date(b.fin).getTime();
        return !(bi === oldInicioNum && bf === oldFinNum);
      });
      if ((oldMesa.bloqueos || []).length === 0) oldMesa.estado = "1";
    }
  }

  // actualizar reserva en array
  reservas[index] = { id: idOriginal, usuario, cantidad, fecha: fechaStr, hora: horaStr, ocasion, notas, estado, mesaId };
  localStorage.setItem("reservas", JSON.stringify(reservas));

  // 🔹 Si la reserva fue finalizada, cancelada o marcada como no show → liberar bloqueo
  if (mesaId && ["3", "4", "5"].includes(estado)) {
    const newMesa = mesas.find(m => m.id === mesaId);
    if (newMesa) {
      const rInicio = parseFechaHora(fechaStr, horaStr).getTime();
      const rFin = rInicio + 2 * 60 * 60 * 1000;
      newMesa.bloqueos = (newMesa.bloqueos || []).filter(b => {
        const bi = new Date(b.inicio).getTime();
        const bf = new Date(b.fin).getTime();
        return !(bi === rInicio && bf === rFin);
      });
      newMesa.estado = "1"; // liberar mesa
    }
  }
  // agregar bloqueo en la nueva mesa (solo si sigue activa)
  else if (mesaId && (estado === "1" || estado === "2")) {
    const newMesa = mesas.find(m => m.id === mesaId);
    if (newMesa) {
      const rInicioDate = parseFechaHora(fechaStr, horaStr);
      const rFinDate = new Date(rInicioDate.getTime() + 2 * 60 * 60 * 1000);
      newMesa.bloqueos = newMesa.bloqueos || [];

      // ✅ fix duplicados: eliminar bloqueos previos del mismo rango antes de agregar
      newMesa.bloqueos = newMesa.bloqueos.filter(b => {
        const bi = new Date(b.inicio).getTime();
        const bf = new Date(b.fin).getTime();
        return !(bi === rInicioDate.getTime() && bf === rFinDate.getTime());
      });

      newMesa.bloqueos.push({ inicio: rInicioDate.toISOString(), fin: rFinDate.toISOString() });
      newMesa.estado = "2";
      programarCambiosEstado(mesaId, rInicioDate, rFinDate);
    }
  }

  localStorage.setItem("mesas", JSON.stringify(mesas));

  Swal.fire("Reserva actualizada", 'Su reserva ha sido actualizada correctamente', 'success');
  bootstrap.Modal.getInstance(document.getElementById("exampleModal")).hide();
  document.getElementById("reservaForm").reset();
  $('#datepicker').val('');
  $('#timepicker').val('');
  mostrarReservasPorFecha(fechaStr);
}

// eliminar reserva 

function eliminarReserva(idEliminar) {
  const reservaEliminada = reservas.find(r => r.id === idEliminar);
  if (!reservaEliminada) return;

  Swal.fire({
    title: '¿Eliminar reserva?',
    text: `Vas a eliminar la reserva de ${reservaEliminada.usuario}. ¿Seguro?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const mesas = JSON.parse(localStorage.getItem("mesas")) || [];
      const mesa = mesas.find(m => m.id === reservaEliminada.mesaId);
      if (mesa) {
        const rInicio = parseFechaHora(reservaEliminada.fecha, reservaEliminada.hora).getTime();
        const rFin = rInicio + 2 * 60 * 60 * 1000;
        mesa.bloqueos = (mesa.bloqueos || []).filter(b => {
          const bi = new Date(b.inicio).getTime();
          const bf = new Date(b.fin).getTime();
          return !(bi === rInicio && bf === rFin);
        });
        if ((mesa.bloqueos || []).length === 0) mesa.estado = "1";
        localStorage.setItem("mesas", JSON.stringify(mesas));
      }

      // Quitar reserva
      reservas = reservas.filter(r => r.id !== idEliminar);
      localStorage.setItem("reservas", JSON.stringify(reservas));

      Swal.fire("Eliminada", "La reserva fue eliminada correctamente.", "success");
      mostrarReservasPorFecha(reservaEliminada.fecha);
    }
  });
}

// 🔹 Función pagar reserva
function pagarReserva(idReserva) {
  const reserva = reservas.find(r => r.id === idReserva);
  if (!reserva) return;

  reserva.estado = "4"; // Finalizada
  localStorage.setItem("reservas", JSON.stringify(reservas));

  const mesas = JSON.parse(localStorage.getItem("mesas")) || [];
  const mesa = mesas.find(m => m.id === reserva.mesaId);
  if (mesa) {
    mesa.estado = "1";
    mesa.bloqueos = (mesa.bloqueos || []).filter(b => {
      const inicio = new Date(b.inicio).getTime();
      const fin = new Date(b.fin).getTime();
      const rInicio = parseFechaHora(reserva.fecha, reserva.hora).getTime();
      const rFin = rInicio + 2 * 60 * 60 * 1000;
      return !(inicio === rInicio && fin === rFin);
    });
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }

  Swal.fire("Reserva finalizada", "La reserva fue finalizada y la mesa liberada.", "success");
  mostrarReservasPorFecha(reserva.fecha);
}









// // Reinicio total: borrar reservas y bloqueos
// document.getElementById("clearReservas").addEventListener("click", () => {
//   Swal.fire({
//     title: '¿Estás seguro?',
//     text: "Esto eliminará todas las reservas y desbloqueará las mesas",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonText: 'Sí, reiniciar',
//     cancelButtonText: 'Cancelar'
//   }).then((result) => {
//     if (result.isConfirmed) {
//       localStorage.removeItem('reservas');
//       reservas = [];

//       const mesas = JSON.parse(localStorage.getItem("mesas")) || [];
//       mesas.forEach(m => { m.bloqueos = []; m.estado = "1"; }); // 🔹 limpio todo
//       localStorage.setItem("mesas", JSON.stringify(mesas));

//       Swal.fire('¡Reinicio completo!', 'Todas las reservas y bloqueos fueron eliminados.', 'success');
//       document.getElementById("reservas").innerHTML = "";
//     }
//   });
// });
