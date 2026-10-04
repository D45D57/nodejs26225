const BASE_URL = "https://talento-nodejs-26225.free.beeceptor.com/api";

const args = process.argv.slice(2);

const [recurso, id] = (args[1] || "").split("/");

function mostrarAyuda() {
  console.log("Comandos disponibles:");
  console.log("  npm run start GET products");
  console.log("  npm run start GET products/<productId>");
  console.log("  npm run start POST products <title> <price> <category> [id]");
  console.log("  npm run start DELETE products/<productId>");
}

async function obtenerProductos() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log(`Error ${response.status}: no se pudo obtener la lista`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function obtenerProductoPorId(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log(`Error ${response.status}: no se encontro el producto con id ${id}`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function crearProducto(producto) {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Producto creado:", data);
      console.log("Id del producto creado:", data.id);
    } else {
      console.log(`Error ${response.status}: no se pudo crear el producto`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function eliminarProducto(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const data = await response.text();
      console.log(`Producto ${id} eliminado.`);
      console.log("Respuesta de la API:", data || "(sin contenido)");
    } else {
      console.log(`Error ${response.status}: no se pudo eliminar el producto con id ${id}`);
    }
  } catch (error) {
    console.log(error);
  }
}

switch (args[0]) {

  case "GET":
    if (recurso === "products" && id) {
    
      const producto = await obtenerProductoPorId(id);
      if (producto) {
        console.log(producto);
      }
    } else if (recurso === "products") {
    
      const productos = await obtenerProductos();
      if (productos) {
        console.log(productos);
      }
    } else {
      console.log("Comando incorrecto para GET.");
      mostrarAyuda();
    }
    break;

  case "POST":

    if (recurso === "products" && args[2] && args[3] && args[4]) {
      if (isNaN(Number(args[3]))) {
        console.log("El precio debe ser un numero.");
      } else {
        const producto = {
          title: args[2],
          price: Number(args[3]),
          category: args[4],
        };
    
        if (args[5]) {
          producto.id = args[5];
        }
        await crearProducto(producto);
      }
    } else {
      console.log("Comando incompleto o incorrecto para POST.");
      mostrarAyuda();
    }
    break;

  case "DELETE":
    if (recurso === "products" && id) {
      await eliminarProducto(id);
    } else {
      console.log("Comando incompleto o incorrecto para DELETE.");
      mostrarAyuda();
    }
    break;

  default:
    console.log("Comando incorrecto. Usá GET, POST o DELETE (en mayusculas).");
    mostrarAyuda();
}