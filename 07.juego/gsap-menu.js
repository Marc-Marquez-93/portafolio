// ENTRADA DEL MENÚ + TEMBLOR
window.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");

  if (menu) {
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
  }

  iniciarThreeJS();
});

// THREE.JS: ESCENA + PERSONAJE + ARMA
let scene, camera, renderer, loader, personaje, armaActual, mixer;
let armaIndex = 0;

const armas = [
  {
    nombre: "AK-47",
    daño: 75,
    cadencia: "Media",
    precision: "Alta",
    modelo: "ak47.glb"
  },
  {
    nombre: "M4A1",
    daño: 65,
    cadencia: "Alta",
    precision: "Media",
    modelo: "m4a1.glb"
  }
];

function iniciarThreeJS() {
  const canvas = document.getElementById("three-canvas");

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  loader = new THREE.GLTFLoader();

  loader.load("personaje.glb", (gltf) => {
    personaje = gltf.scene;
    scene.add(personaje);

    mixer = new THREE.AnimationMixer(personaje);
    const idle = gltf.animations.find(a => a.name === "Idle");
    if (idle) mixer.clipAction(idle).play();

    cargarArma(armas[armaIndex].modelo);
    actualizarCard(armas[armaIndex]);
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.016);
  renderer.render(scene, camera);
}

function cargarArma(armaPath) {
  if (armaActual) personaje.remove(armaActual);

  loader.load(armaPath, (gltf) => {
    armaActual = gltf.scene;
    armaActual.position.set(0.5, 1.2, 0); // Ajusta según el modelo
    personaje.add(armaActual);
  });
}

// ACTUALIZAR CARD CON GSAP
function actualizarCard(datos) {
  const card = document.getElementById("card-arma");
  gsap.to(card, {
    x: -200,
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      card.innerHTML = `
        <h2>${datos.nombre}</h2>
        <p>Daño: ${datos.daño}<br>Cadencia: ${datos.cadencia}<br>Precisión: ${datos.precision}</p>
      `;
      gsap.fromTo(card, { x: 200, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 });
    }
  });
}

// FLECHAS DE NAVEGACIÓN
document.getElementById("flecha-der").addEventListener("click", () => {
  armaIndex = (armaIndex + 1) % armas.length;
  cargarArma(armas[armaIndex].modelo);
  actualizarCard(armas[armaIndex]);
});

document.getElementById("flecha-izq").addEventListener("click", () => {
  armaIndex = (armaIndex - 1 + armas.length) % armas.length;
  cargarArma(armas[armaIndex].modelo);
  actualizarCard(armas[armaIndex]);
});
