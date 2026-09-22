class Producto {
  constructor(id, nombre, categoria, precio, cantidad) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.cantidad = cantidad;
  }
}

const stockInicial = [
  new Producto(1, "clavos", "Construcción y albañilería", 500, 10),
  new Producto(2, "taladro", "Herramientas", 10000, 5),
  new Producto(3, "tornillo", "Construcción y albañilería", 2.99, 0),
  new Producto(4, "pegamento", "Mantenimiento", 5000, 8),
  new Producto(5, "pintura", "Pinturería", 15000, 5),
  new Producto(6, "martillo", "Herramientas", 20000, 3),
];

let stock = JSON.parse(localStorage.getItem("stockFerreteria")) ?? stockInicial;

let proximoId =
  stock.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;

function guardarStockEnLocalStorage() {
  localStorage.setItem("stockFerreteria", JSON.stringify(stock));
}

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

  const productosHTML = lista.map((item) => {
    const { id, nombre, precio, cantidad } = item;

    return `
      <div class="producto-card">
        <img src="img/ferreti2.jpg" alt="${nombre}" class="imagen-producto">
        <h3>${nombre}</h3>
        <p class="precio-stock">$${precio} — ${cantidad} en stock</p>
        <button class="btn-eliminar" data-id="${id}">Eliminar</button>
      </div>
    `;
  });

  contenedorItems.innerHTML = productosHTML.join("");
}

const inputBuscar = document.getElementById("input-buscar");
const contenedorItems = document.getElementById("contenedor-items");
const btnAgregar = document.getElementById("btn-agregar");

btnAgregar.addEventListener("click", () => {
  const inputNombre = document.getElementById("input-nombre");
  const inputPrecio = document.getElementById("input-precio");
  const inputCategoria = document.getElementById("input-categoria");

  const nombreProducto = inputNombre.value.trim();
  const precioNumerico = parseFloat(inputPrecio.value);
  const categoriaProducto = inputCategoria?.value ?? "";

  const esValido =
    nombreProducto !== "" &&
    !isNaN(precioNumerico) &&
    precioNumerico > 0 &&
    categoriaProducto !== "";

  esValido
    ? agregarProducto(
        categoriaProducto,
        inputNombre,
        inputPrecio,
        inputCategoria,
      )
    : mostrarError(
        "Por favor, ingrese un nombre válido, un precio mayor a 0 y una categoría.",
      );
});

function agregarProducto(categoria, inputNombre, inputPrecio, inputCategoria) {
  const nuevoProducto = new Producto(
    proximoId++,
    inputNombre.value.trim(),
    categoria,
    parseFloat(inputPrecio.value),
    0,
  );
  stock.push(nuevoProducto);

  guardarStockEnLocalStorage();
  renderizarProductos();

  inputNombre.value = "";
  inputPrecio.value = "";
  inputCategoria.value = "";
  mostrarMensaje("Producto agregado correctamente.");
}

contenedorItems.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("btn-eliminar")) {
    const id = parseInt(evento.target.dataset.id);

    stock = stock.filter((item) => item.id !== id);
    guardarStockEnLocalStorage();

    mostrarMensaje(`Producto con ID ${id} eliminado.`);
    renderizarProductos();
  }
});

inputBuscar.addEventListener("keyup", () => {
  const texto = inputBuscar.value.toLowerCase().trim();

  const filtrados = texto
    ? stock.filter((item) => item.nombre.toLowerCase().includes(texto))
    : stock;

  renderizarProductos(filtrados);
});

renderizarProductos();
