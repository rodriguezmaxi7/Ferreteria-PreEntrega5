const cargando = document.getElementById("cargando");

async function obtenerProductos() {
  cargando.hidden = false;

  try {
    const response = await fetch("./data.json");

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  } finally {
    cargando.hidden = true;
  }
}

class Producto {
  constructor(id, nombre, categoria, precio, cantidad) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.cantidad = cantidad;
  }
}

let stock = JSON.parse(localStorage.getItem("stockFerreteria")) ?? [];
let proximoId = 1;

function guardarStockEnLocalStorage() {
  try {
    localStorage.setItem("stockFerreteria", JSON.stringify(stock));
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);

    if (error.name === "QuotaExceededError") {
      mostrarError("No se pudo guardar el stock: se ha superado la cuota de almacenamiento.");
    } else {
      mostrarError("Ocurrió un error al guardar el stock en localStorage.");
    }
  }
}

function mostrarMensaje(mensaje, tipo = "exito") {
  if (tipo === "error") {
    Swal.fire({
      icon: "error",
      title: "Atención",
      text: mensaje,
      confirmButtonColor: "#d33",
      confirmButtonText: "Entendido",
    });
    return;
  }

  Toastify({
    text: mensaje,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
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
    ? agregarProducto(categoriaProducto, inputNombre, inputPrecio, inputCategoria)
    : mostrarError(
        "Por favor, ingrese un nombre válido, un precio mayor a 0 y una categoría."
      );
});

function agregarProducto(categoria, inputNombre, inputPrecio, inputCategoria) {
  const nuevoProducto = new Producto(
    proximoId++,
    inputNombre.value.trim(),
    categoria,
    parseFloat(inputPrecio.value),
    0
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

async function iniciar() {
  const hayGuardado = localStorage.getItem("stockFerreteria") !== null;
  const productosAPI = await obtenerProductos();

  if (productosAPI.length === 0) {
    mostrarError("No se pudo cargar el catálogo desde data.json.");
  } else if (!hayGuardado) {
    stock = productosAPI.map(
      (p) => new Producto(p.id, p.nombre, p.categoria, p.precio, p.stock)
    );
    guardarStockEnLocalStorage();
    mostrarMensaje("Productos cargados con éxito.");
  } else {
    mostrarMensaje("Catálogo cargado desde tu stock guardado.");
  }

  proximoId = stock.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;
  renderizarProductos();
}

iniciar();