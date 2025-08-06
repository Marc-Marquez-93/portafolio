document.addEventListener("DOMContentLoaded", () => {
  const lugar = JSON.parse(localStorage.getItem("lugarSeleccionado"));
  if (!lugar) {
    document.getElementById("contenido").textContent = "No se encontró información del lugar.";
    return;
  }

  const cont = document.getElementById("contenido");
  cont.id = "cont"

  const titulo = document.createElement("h1");
  titulo.textContent = lugar.nombre;
  titulo.classList.add("titulo");
  cont.appendChild(titulo);

  const imagen = document.createElement("img");
  imagen.src = lugar.url_imagen;
  imagen.alt = lugar.nombre;
  imagen.classList.add("imagen");
  cont.appendChild(imagen);

  const descripcion = document.createElement("p");
  descripcion.textContent = `Bienvenido a ${lugar.ciudad}, ${lugar.pais}, donde se encuentra ${lugar.descripcion} Conócela más.`;
  descripcion.classList.add("descripcion");
  cont.appendChild(descripcion);

  const mapita = document.createElement("h1");
  mapita.textContent = "Mapa"
  mapita.classList.add("titulo");
  cont.appendChild(mapita);

  const mapa = document.createElement("iframe");
  mapa.classList.add("mapa");

  const lat = lugar.coordenadas.latitud;
  const lon = lugar.coordenadas.longitud;

  mapa.loading = "lazy";
  mapa.referrerPolicy = "no-referrer-when-downgrade";
  mapa.src = `https://www.google.com/maps?q=${lat},${lon}&hl=es&z=14&output=embed`;
  cont.appendChild(mapa);

  const datos = document.createElement("ul");
  datos.classList.add("datos")
  datos.innerHTML = "<h3 class='h3t'>Datos interesantes:</h3>";
  lugar.datosInteresantes.forEach(dato => {
    const li = document.createElement("li");
    li.classList.add("li")
    li.textContent = `${dato.titulo}: ${dato.valor}`;
    datos.appendChild(li);
  });
  cont.appendChild(datos);

  const actividades = document.createElement("ul");
  actividades.classList.add("datos");
  actividades.innerHTML = "<h3 class='h3t'>Actividades recomendadas:</h3>";
  lugar.actividadesRecomendadas.forEach(act => {
    const li = document.createElement("li");
    li.classList.add("li");
    li.textContent = act;
    actividades.appendChild(li);
  });
  cont.appendChild(actividades);

  const categoria = document.createElement("p");
  categoria.classList.add("categoria");
  categoria.innerHTML = `<strong class='titulo'>Categoría:</strong> <br><br>${lugar.categoria.nombre}`;
  cont.appendChild(categoria);

  const color1 = lugar.categoria.colorPrimario;
  const color2 = lugar.categoria.colorSecundario;

  document.body.style.background = `linear-gradient(to bottom right, ${color1}, ${color2})`;
});
