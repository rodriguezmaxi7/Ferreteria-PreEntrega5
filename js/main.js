
class Producto {
    constructor(nombre, categoria, precio, cantidad) {
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.cantidad = cantidad;
    }
    vender(cantidadVendida) {
       if (cantidadVendida > this.cantidad) {
        console.log("No hay stock disponible")
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
    new Producto("martillo", "Herramientas", 20000, 3)
   
];



let nombresProductos = ["clavos", "taladro", "tornillo", "pegamento", "pintura", "martillo"];
console.log("--- Stock disponible al inicio ---");
for (const item of stock) {
    console.log(`${item.nombre}: ${item.cantidad} unidades`);
}
function buscarProducto(nombre) {
    const indice = nombresProductos.indexOf(nombre);
    if (indice === -1) {
        return null;
    }
    return stock[indice];
}
function hayStockDisponible(producto) {
    const item = buscarProducto(producto);
    if (item === null) {
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
    nombresProductos.push(nombre); 
    console.log(`Se agregó "${nombre}" al final del stock.`);
}
function quitarUltimoProducto() {
    const eliminado = stock.pop();
    nombresProductos.pop();
    console.log(`Se eliminó "${eliminado.nombre}" (el último del stock).`);
}
function agregarProductoUrgente(nombre, categoria, precio, cantidad) {
    stock.unshift( new Producto (nombre, categoria, precio, cantidad) );
    nombresProductos.unshift(nombre);
    console.log(`Se agregó "${nombre}" como producto urgente, al principio del stock.`);
}

function quitarPrimerProducto() {
    const eliminado = stock.shift();
    nombresProductos.shift();
    console.log(`Se eliminó "${eliminado.nombre}" (el primero del stock).`);
}

const mostrarError = (mensaje) => {
    console.error(mensaje);
};
let producto = "";
while (producto !== "salir") {
    producto = prompt(`Ingrese el nombre del producto que desea comprar (${nombresProductos.join(", ")}) o escriba 'salir' para finalizar:`);

    if (producto === "salir") {
        console.log("Gracias por su compra. ¡Hasta luego!");
        alert("Gracias por su compra. ¡Hasta luego!");
        break;
    }

    if (comprarProducto(producto)) {
        console.log(`¡Compra exitosa! Quedan ${buscarProducto(producto).cantidad} unidades de ${producto}.`);
    } else if (nombresProductos.includes(producto)) {
        mostrarError(`Lo sentimos, no hay stock disponible para ${producto}.`);
    } else {
        mostrarError("Producto no válido. Por favor, ingrese un producto válido.");
    }
}
console.log("--- Stock final ---");
for (const item of stock) {
    console.log(`${item.nombre}: ${item.cantidad} unidades`);
}