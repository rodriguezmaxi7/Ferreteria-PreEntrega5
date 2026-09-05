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

console.log("--- Stock disponible al inicio ---");
for (const item of stock) {
  console.log(`${item.nombre}: ${item.cantidad} unidades`);
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

const mostrarError = (mensaje) => {
  console.error(mensaje);
};

let producto = "";
while (producto !== "salir") {
  const nombresProductos = obtenerNombresProductos();
  producto = prompt(
    `Ingrese el nombre del producto que desea comprar (${nombresProductos.join(", ")}) o escriba 'salir' para finalizar:`,
  );

  if (producto === "salir") {
    console.log("Gracias por su compra. ¡Hasta luego!");
    alert("Gracias por su compra. ¡Hasta luego!");
    break;
  }

  if (producto === "agregar") {
    const nombreNuevo = prompt("Ingrese el nombre del nuevo producto:");
    const categoriaNueva = prompt("Ingrese la categoría del nuevo producto:");
    const precioNuevo = parseFloat(prompt("Ingrese el precio del nuevo producto:"));
    const cantidadNueva = parseInt(prompt("Ingrese la cantidad del nuevo producto:"));
    agregarProductoNuevo(nombreNuevo, categoriaNueva, precioNuevo, cantidadNueva);
    continue;
  }

  if (comprarProducto(producto)) {
    console.log(
      `¡Compra exitosa! Quedan ${buscarProducto(producto).cantidad} unidades de ${producto}.`,
    );
  } else if (nombresProductos.includes(producto)) {
    eliminarProductoAgotado(producto);
    mostrarError(`Lo sentimos, no hay stock disponible para ${producto}.`);
  } else {
    mostrarError("Producto no válido. Por favor, ingrese un producto válido.");
  } 
}


console.log("--- Stock final ---");
for (const item of stock) {
  console.log(`${item.nombre}: ${item.cantidad} unidades`);
}

console.log("--- Productos con stock bajo (menos de 5) ---");
console.log(productosConStockBajo());

console.log(`--- Ganancia total esperada: $${gananciaTotalEsperada()} ---`);