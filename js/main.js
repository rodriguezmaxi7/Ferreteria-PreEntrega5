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
  try {
    localStorage.setItem("stockFerreteria", JSON.stringify(stock));
    console.log("Stock guardado correctamente");
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);

    if (error.name === "QuotaExceededError") {
      mostrarError("No se pudo guardar el stock: se ha superado la cuota de almacenamiento.");
    } else {
      mostrarError("Ocurrió un error al guardar el stock en localStorage.");
    }
  } finally {
    console.log("Intento de guardar stock en localStorage finalizado.");
  }
}

function mostrarMensaje(mensaje, tipo = "exito") {
  if (tipo === "error") {
    Swal.fire({
      icon: "error",
      title: "Atención",
      text: mensaje,
      confirmButtonColor: "#d33",
      confirmButtonText: "Entendido"
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
    }
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

setTimeout(() => {
  mostrarMensaje("Oferta especial: ¡10% de descuento en todos los productos por tiempo limitado!", "exito");
}, 5000);


async function iniciar() {
  const productosAPI = await obtenerProductos();
  if (!localStorage.getItem("stockFerreteria") && productosAPI.length > 0) {
    stock = productosAPI.map(
      (p) => new Producto(p.id, p.nombre, p.categoria, p.categoria || "General", p.precio, p.stock ?? p.cantidad ?? 0)
    );
    guardarStockEnLocalStorage();
  }

  if (productosAPI.length > 0) {
    mostrarMensaje("Productos cargados desde la API.", "exito");
  } else {
    mostrarMensaje("No se pudieron cargar productos desde la API. Se utilizará el stock local.", "error");
  }
 
 proximoId = stock.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;

 renderizarProductos();
}

iniciar();