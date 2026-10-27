async function obtenerProductos(){
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if(!response.ok){
            throw new Error('Error al obtener los productos');
        }

        const productos = await response.json();

        return productos;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

function mostrarCatalogo(){
    obtenerProductos().then(productos => {
        cargarProductos(productos, "catalogo-container");
    });
}

function mostrarOfertas(){
    obtenerProductos().then(productos => {
        let ofertas = [];
        for(let i = 1; i <= 7; i += 3){
            ofertas.push(productos[i-1]);
        }
        cargarProductos(ofertas, "ofertas-container");
    });
}

function mostrarCarrusel() {
    obtenerProductos().then(productos => {
        const carrusel = [];
        const usados = new Set();

        while (carrusel.length < 5 && usados.size < productos.length) {
            const indice = Math.floor(Math.random() * productos.length);
            if (!usados.has(indice)) {
                usados.add(indice);
                carrusel.push(productos[indice]);
            }
        }

        // Mostrar los productos seleccionados
        cargarProductos(carrusel, "carrusel-container");
    });
}

function mostrarDetalles(producto){
    const modal = document.getElementById("miModal");
    const modalBody = document.getElementById("modal-body");
    const spanClose = document.querySelector(".close");

    spanClose.onclick = () => {
        modal.style.display = "none";
    };

    modalBody.innerHTML = `
        <p><strong>ID:</strong> ${producto.id}</p>
        <p><strong>Título:</strong> ${producto.title}</p>
        <p><strong>Precio:</strong> $${producto.price.toFixed(2)}</p>
        <p><strong>Descripción:</strong> ${producto.description}</p>
        <p><strong>Categoría:</strong> ${producto.category}</p>
        <img src="${producto.image}" alt="${producto.title}" width="150">
    `;
    modal.style.display = "block";
}

function crearDivProducto(producto) {
    const div = document.createElement("div");
    div.classList.add("producto");

    const h3 = document.createElement("h3");
    h3.textContent = producto.title;

    const spanPrice = document.createElement("span");
    spanPrice.textContent = `Precio: $${producto.price.toFixed(2)}`;

    const img = document.createElement("img");
    img.src = producto.image;
    img.alt = producto.title;

    const botonDetalles = document.createElement("button");
    botonDetalles.textContent = "Ver detalles";

    botonDetalles.addEventListener("click", () => {
        mostrarDetalles(producto);
    });

    div.appendChild(h3);
    div.appendChild(spanPrice);
    div.appendChild(img);
    div.appendChild(botonDetalles);

    return div;
}

function cargarProductos(productos, contenedorID){
    const contenedor = document.getElementById(contenedorID);

    productos.forEach(producto => {
        const div = crearDivProducto(producto);
        contenedor.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarCatalogo();
    mostrarOfertas();
    mostrarCarrusel();
});
