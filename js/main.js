class Producto {
  constructor(nombre, categoria, precio, cantidad) {
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.cantidad = cantidad;
  }
}

let stock = [
  new Producto("clavos", "Construcción y albañilería", 500, 10),
  new Producto("taladro", "Herramientas", 10000, 5),
  new Producto("tornillo", "Construcción y albañilería", 2.99, 0),
  new Producto("pegamento", "Mantenimiento", 5000, 8),
  new Producto("pintura", "Pinturería", 15000, 5),
  new Producto("martillo", "Herramientas", 20000, 3),
];

function mostrarMensaje(mensaje, tipo = "exito") {
  const feedback = document.getElementById("feedback");
  feedback.textContent = mensaje;
  feedback.className = tipo;
  setTimeout(() => {
    feedback.textContent = "";
    feedback.className = "";
  }, 2500);
}

function mostrarError(mensaje) {
  mostrarMensaje(mensaje, "error");
}

function renderizarProductos(lista = stock) {
  const contenedorItems = document.getElementById("contenedor-items");
  const productosHTML = lista.map(
    (item) => `
      <div class="producto-card">
        <img src="img/ferreti2.jpg" alt="${item.nombre}" class="imagen-producto">
        <h3>${item.nombre}</h3>
        <p class="precio-stock">$${item.precio} — ${item.cantidad} en stock</p>
        <button class="btn-eliminar" data-nombre="${item.nombre}">Eliminar</button>
      </div>
    `
  );
  contenedorItems.innerHTML = productosHTML.join("");
}

const inputBuscar = document.getElementById("input-buscar");
const contenedorItems = document.getElementById("contenedor-items");
const btnAgregar = document.getElementById("btn-agregar");

btnAgregar.addEventListener("click", () => {
  const inputNombre = document.getElementById("input-nombre");
  const inputPrecio = document.getElementById("input-precio");

  const nombreProducto = inputNombre.value;
  const precioProducto = inputPrecio.value;
  const precioNumerico = parseFloat(precioProducto);

  if (nombreProducto === "" || isNaN(precioNumerico) || precioNumerico <= 0) {
    mostrarError("Por favor, ingrese un nombre válido y un precio mayor a 0.");
    return;
  }

  const nuevoProducto = new Producto(nombreProducto, "Herramientas", precioNumerico, 0);
  stock.push(nuevoProducto);

  inputNombre.value = "";
  inputPrecio.value = "";

  renderizarProductos();
});

contenedorItems.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("btn-eliminar")) {
    const nombre = evento.target.dataset.nombre;
    stock = stock.filter((item) => item.nombre !== nombre);
    mostrarMensaje(`"${nombre}" eliminado.`);
    renderizarProductos();
  }
});

inputBuscar.addEventListener("keyup", () => {
  const texto = inputBuscar.value.toLowerCase();
  const filtrados = stock.filter((item) =>
    item.nombre.toLowerCase().includes(texto)
  );
  renderizarProductos(filtrados);
});

renderizarProductos();

  
