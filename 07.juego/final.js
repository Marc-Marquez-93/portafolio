// Espera a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");

  // 🔹 Crea video de fondo
  const video = document.createElement("video");
  video.src = "./salida.mp4"; // coloca aquí tu video
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.style.position = "fixed";
  video.style.top = "0";
  video.style.left = "0";
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";
  video.style.zIndex = "-1";
  video.style.opacity = "0.4";
  document.body.appendChild(video);

  // 🔹 Contenedor del texto y título
  const contTexto = document.createElement("div");
  contTexto.classList.add("briefing");
  contTexto.style.position = "absolute";
  contTexto.style.top = "20%";
  contTexto.style.left = "50%";
  contTexto.style.transform = "translateX(-50%)";
  contTexto.style.textAlign = "center";
  contTexto.style.color = "white";
  contTexto.style.width = "80%";
  contTexto.style.fontFamily = "Orbitron, sans-serif";

  const titulo = document.createElement("h1");
  titulo.textContent = "MISIÓN: TORMENTA DE ACERO";
  titulo.style.fontSize = "2.5rem";
  titulo.style.color = "#00a2ff";
  titulo.style.textShadow = "0 0 10px #00a2ff";
  contTexto.appendChild(titulo);

  const parrafo = document.createElement("p");
  parrafo.id = "texto";
  parrafo.style.fontSize = "1.2rem";
  parrafo.style.lineHeight = "1.5";
  parrafo.style.color = "#ffffffcc";
  parrafo.style.maxWidth = "800px";
  parrafo.style.margin = "20px auto 0";
  contTexto.appendChild(parrafo);

  document.body.appendChild(contTexto);

  // 🔹 Botón de continuar
  const btn = document.createElement("button");
  btn.id = "btnComenzar";
  btn.textContent = "Comenzar misión";
  btn.style.position = "absolute";
  btn.style.bottom = "8%";
  btn.style.right = "8%";
  btn.style.background = "transparent";
  btn.style.border = "2px solid #00a2ff";
  btn.style.color = "#00a2ff";
  btn.style.fontSize = "1.3rem";
  btn.style.padding = "10px 25px";
  btn.style.borderRadius = "8px";
  btn.style.cursor = "pointer";
  btn.style.transition = "all 0.3s ease";
  btn.style.opacity = "0";
  document.body.appendChild(btn);

  btn.addEventListener("mouseenter", () => {
    gsap.to(btn, { backgroundColor: "#00a2ff", color: "black", scale: 1.1, duration: 0.3 });
  });
  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { backgroundColor: "transparent", color: "#00a2ff", scale: 1, duration: 0.3 });
  });

  // 🔹 Vibración suave del "menu" (como las otras pantallas)
  gsap.to(menu, {
    x: "+=1",
    y: "+=1",
    repeat: -1,
    yoyo: true,
    duration: 0.1,
    ease: "sine.inOut"
  });

  // 🔹 Efecto de entrada del texto
  const texto = "Tu escuadrón ha completado la selección de equipo. La misión final está por comenzar. Prepárate para enfrentarte al enemigo y demostrar tu poder en el campo de batalla.";
  let i = 0;

  function escribirTexto() {
    if (i < texto.length) {
      parrafo.textContent += texto.charAt(i);
      i++;
      setTimeout(escribirTexto, 30);
    } else {
      // cuando termine de escribir, aparece el botón
      gsap.to(btn, { opacity: 1, duration: 1, delay: 0.5 });
    }
  }

  gsap.from(titulo, {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: "elastic.out(1, 0.5)"
  });

  gsap.from(parrafo, { opacity: 0, duration: 1, delay: 0.5 });

  escribirTexto();

  // 🔹 Animación del botón (latido)
  gsap.to(btn, {
    scale: 1.05,
    duration: 0.7,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    delay: 2
  });

  // 🔹 Transición de salida cuando se hace clic
  btn.addEventListener("click", () => {
    gsap.to("body", {
      opacity: 0,
      duration: 1.2,
      ease: "power4.inOut",

    });
  });
});
