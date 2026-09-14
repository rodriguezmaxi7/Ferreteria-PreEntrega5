class Producto {
  constructor(nombre, categoria, precio, cantidad) {
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.cantidad = cantidad;
  }
  vender(cantidadVendida) {
    if (cantidadVendida > this.cantidad) {
      console.log("No hay stock disponible");
    } else {
      this.cantidad = this.cantidad - cantidadVendida;
    }
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

function obtenerNombresProductos() {
  return stock.map((item) => item.nombre);
}

function buscarProducto(nombre) {
  return stock.find((item) => item.nombre === nombre);
}

function hayStockDisponible(producto) {
  const item = buscarProducto(producto);
  if (item === undefined) {
    return false;
  }
  return item.cantidad > 0;
}

function comprarProducto(producto) {
  if (hayStockDisponible(producto)) {
    const item = buscarProducto(producto);
    item.vender(1);
    return true;
  }
  return false;
}

function agregarProductoNuevo(nombre, categoria, precio, cantidad) {
  stock.push(new Producto(nombre, categoria, precio, cantidad));
  console.log(`Se agregó "${nombre}" al stock.`);
}

function productosConStockBajo(limite = 5) {
  return stock.filter((item) => item.cantidad > 0 && item.cantidad < limite);
}

function eliminarProductoAgotado(nombre) {
  const producto = buscarProducto(nombre);
  if (producto === undefined) {
    console.log(`No se encontró "${nombre}" en el stock.`);
    return false;
  }
  if (producto.cantidad > 0) {
    console.log(`"${nombre}" todavía tiene stock, no se puede eliminar.`);
    return false;
  }
  stock = stock.filter((item) => item.nombre !== nombre);
  console.log(`Se eliminó "${nombre}" del stock por estar agotado.`);
  return true;
}

function gananciaTotalEsperada() {
  return stock.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
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
  const productosHTML = lista.map(
    (item) => `
      <div class="producto-card">
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

  console.log("Producto:", nombreProducto);
  console.log("Precio:", precioProducto);
  console.log("Precio numérico:", precioNumerico);

  if (nombreProducto === "" || isNaN(precioNumerico) || precioNumerico <= 0) {
    mostrarError("Por favor, ingrese un nombre válido y un precio mayor a 0.");
    return;
  }
  
  const nuevoProducto = new Producto(nombreProducto, "Herramientas", precioNumerico,  0);
  stock.push(nuevoProducto);
  console.log(`Se agregó "${nombreProducto}" al stock con precio ${precioNumerico}.`);
  
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

  
