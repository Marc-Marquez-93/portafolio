// Inicializar reservas global
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

// Inicializar datepicker y timepicker
$('#datepicker').datepicker({
  minDate: new Date(),
  uiLibrary: 'bootstrap5'
});

$('#timepicker').timepicker({
  uiLibrary: 'bootstrap5',
  format: 'HH:MM', 
  minTime: '08:00',
  maxTime: '20:00'
});

// Función para generar ID
function generarIdReserva() {
  return "Número: " + (reservas.length + 1);
}

// Cuando se abre el modal, se genera y muestra el ID en el input
const modalAgregar = document.getElementById("exampleModal");
if (modalAgregar) {
  modalAgregar.addEventListener("show.bs.modal", () => {
    const inputId = document.getElementById("id");
    inputId.value = generarIdReserva();
    inputId.readOnly = true;
  });
}

// Guardar reserva
document.getElementById('save2').addEventListener('click', () => {
  const usuario = document.getElementById('usuario').value.trim();
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const fechaStr = $('#datepicker').val();
  const horaStr = $('#timepicker').val();
  const ocasion = document.getElementById('ocasion').value;
  const notas = document.getElementById('notas').value.trim();
  const estado = document.getElementById('estado').value;
  const id = document.getElementById('id').value; // ID ya generado

  // Validaciones
  if (!usuario || !cantidad || !fechaStr || !horaStr || !ocasion || !notas || !estado) {
    Swal.fire({
      title: 'Faltan datos',
      text: 'Por favor completa todos los campos obligatorios',
      icon: 'warning'
    });
    return;
  }

  if (usuario.length < 2 || /\d/.test(usuario)) {
    Swal.fire({
      title: 'Datos inválidos',
      text: 'El nombre no puede contener números ni estar vacío',
      icon: 'error'
    });
    return;
  }

  if (isNaN(cantidad) || cantidad < 2 || cantidad > 20) {
    Swal.fire({
      title: 'Cantidad inválida',
      text: 'El número de personas debe estar entre 2 y 20',
      icon: 'error'
    });
    return;
  }

  const fechaHoraStr = `${fechaStr} ${horaStr}`;
  const fechaHoraReserva = new Date(fechaHoraStr);
  const ahora = new Date();

  if (fechaHoraReserva < ahora) {
    Swal.fire({
      title: 'Fecha u hora inválida',
      text: 'No puedes hacer una reserva en el pasado',
      icon: 'error'
    });
    return;
  }

 // Validación de rango de hora (08:00 - 20:00)
if (horaStr) {
  const match = horaStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    const [, hora, minuto] = match;
    const horaNum = parseInt(hora, 10);
    const minNum = parseInt(minuto, 10);

    if (horaNum < 8 || (horaNum === 20 && minNum > 0) || horaNum > 20) {
      Swal.fire({
        title: 'Hora inválida',
        text: 'Solo se permiten reservas entre las 08:00 AM y las 08:00 PM',
        icon: 'error'
      });
      return; // 🚨 Detiene el guardado
    }
  }
}

  // Guardar reserva
  const reserva = { id, usuario, cantidad, fecha: fechaStr, hora: horaStr, ocasion, notas, estado };
  reservas.push(reserva);
  localStorage.setItem('reservas', JSON.stringify(reservas));

  Swal.fire({
    title: 'Reserva guardada',
    text: `¡Tu reserva fue registrada exitosamente!`,
    icon: 'success'
  });

  const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
  modal.hide();

  // Resetear formulario
  document.getElementById('reservaForm').reset();
  $('#datepicker').val('');
  $('#timepicker').val('');
});




//boton de reinicio

document.getElementById("clearReservas").addEventListener("click", () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esto eliminará todas las reservas guardadas",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, borrar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('reservas');
      reservas = [];
      Swal.fire('¡Borrado!', 'Se eliminaron todas las reservas.', 'success');
      document.getElementById("reservas").innerHTML = ""; // limpiar vista
    }
  });
});


  