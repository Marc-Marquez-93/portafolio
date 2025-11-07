// Latido constante
gsap.to("#btjugar", {
  scale: 1.1,
  duration: 0.6,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut"
});

// Efecto de clic al presionar
document.querySelector("#btjugar a").addEventListener("click", (e) => {
  e.preventDefault(); // Evita navegación inmediata

  // Hundimiento tipo teclado
  gsap.to("#btjugar", {
    scale: 0.9,
    duration: 0.1,
    ease: "power1.in"
  });

  // Transición de pantalla tipo guerra
  gsap.to("body", {
    x: "-100vw",
    duration: 1,
    ease: "power4.inOut",
    onComplete: () => {
      window.location.href = "./menu.html";
    }
  });
});


// ANIMACION DEL TEXTO 

gsap.from(".contenido h1", {
  scale: 0,
  opacity: 0,
  duration: 0.8,
  ease: "back.out(2)"
});

const texto = "Este videojuego trata de batallas, elije un personaje y lucha contra el enemigo, no te dejes vencer, o acaso perdedor? estas preparado para ser ganador? los mapas están hechos para demostrarlo";

let index = 0;

function escribirTexto() {
  if (index < texto.length) {
    document.getElementById("texto").textContent += texto.charAt(index);
    index++;
    setTimeout(escribirTexto, 30); // velocidad de escritura
  }
}

window.addEventListener("DOMContentLoaded", () => {
  escribirTexto();
});
