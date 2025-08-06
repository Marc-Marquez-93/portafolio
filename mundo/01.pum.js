document.addEventListener("DOMContentLoaded", async () => {
    let base = await axios.get("./lugares.json");
    console.log(base);

    base.data.forEach((lug) => {
        let num1 = document.createElement("div");
        num1.classList.add("num1");

        let izq = document.createElement("div");
        izq.classList.add("izq");
        let der = document.createElement("div");
        der.classList.add("der");

        let img = document.createElement("img");
        img.src = lug.url_imagen;
        img.alt = lug.nombre;
        img.classList.add("img");
        img.loading = "lazy";
        let nombre = document.createElement("p");
        nombre.textContent = lug.nombre;
        nombre.classList.add("texto");
        let ciudad = document.createElement("p");
        ciudad.textContent = lug.ciudad;
        ciudad.classList.add("texto2");
        let pais = document.createElement("p");
        pais.textContent = lug.pais;
        pais.classList.add("texto2");

        izq.appendChild(img);
        der.appendChild(nombre);
        der.appendChild(ciudad);
        der.appendChild(pais);

        num1.appendChild(izq);
        num1.appendChild(der);

        document.getElementById("dad").appendChild(num1);

        num1.addEventListener("click", () => {
            localStorage.setItem("lugarSeleccionado", JSON.stringify(lug));
            window.open("lugar.html", "_blank");
        });

    });
});
