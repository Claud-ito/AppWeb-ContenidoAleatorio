"use strict";

/**
 * Explorador de contenido aleatorio.
 * Cada API tiene su propia función async y su estado independiente.
 */
const URLS_APIS = {
  citas: "https://dummyjson.com/quotes/random",
  perros: "https://dog.ceo/api/breeds/image/random",
  gatos: "https://cataas.com/cat?json=true",
  datos: "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
};

const secciones = {
  citas: obtenerElementos("citas"),
  perros: obtenerElementos("perros"),
  gatos: obtenerElementos("gatos"),
  datos: obtenerElementos("datos")
};

/** Referencias exclusivamente a los elementos de una tarjeta. */
function obtenerElementos(nombre) {
  return {
    tarjeta: document.getElementById(`seccion-${nombre}`),
    boton: document.getElementById(`boton-${nombre}`),
    estado: document.getElementById(`estado-${nombre}`),
    error: document.getElementById(`error-${nombre}`),
    contenido: document.getElementById(`contenido-${nombre}`)
  };
}

/** Activa el indicador de carga y bloquea solo el botón correspondiente. */
function iniciarCarga(seccion) {
  seccion.tarjeta.setAttribute("aria-busy", "true");
  seccion.boton.disabled = true;
  seccion.estado.hidden = false;
  seccion.contenido.hidden = true;
  seccion.error.hidden = true;
  seccion.error.textContent = "";
}

function mostrarContenido(seccion) {
  seccion.estado.hidden = true;
  seccion.error.hidden = true;
  seccion.contenido.hidden = false;
}

function mostrarError(seccion, mensaje) {
  seccion.estado.hidden = true;
  seccion.contenido.hidden = true;
  seccion.error.textContent = mensaje;
  seccion.error.hidden = false;
}

/** Se ejecuta siempre, incluso si fetch o la imagen fallan. */
function finalizarCarga(seccion) {
  seccion.boton.disabled = false;
  seccion.tarjeta.setAttribute("aria-busy", "false");
}

/**
 * Obtiene un JSON mediante GET. fetch no rechaza automáticamente respuestas
 * HTTP 404/500, por eso es indispensable verificar response.ok.
 */
async function solicitarJson(url) {
  let respuesta;

  try {
    respuesta = await fetch(url, { method: "GET", cache: "no-store" });
  } catch (error) {
    throw new Error("No fue posible conectarse. Revisa tu conexión a Internet.");
  }

  if (!respuesta.ok) {
    throw new Error(`El servicio respondió con HTTP ${respuesta.status}.`);
  }

  try {
    return await respuesta.json();
  } catch (error) {
    throw new Error("El servicio no devolvió un JSON válido.");
  }
}

/** Evita intentar cargar URLs vacías o con protocolos inseguros. */
function comprobarUrlImagen(valor, origen = undefined) {
  if (typeof valor !== "string" || !valor.trim()) {
    throw new Error("El servicio no proporcionó una dirección de imagen.");
  }

  let url;
  try {
    url = new URL(valor, origen);
  } catch (error) {
    throw new Error("La dirección de imagen recibida no es válida.");
  }

  if (url.protocol !== "https:") {
    throw new Error("La imagen no está disponible mediante HTTPS.");
  }
  return url.href;
}

/**
 * Las imágenes requieren manejar onload/onerror además del JSON.
 * Esperar la carga permite mantener visible «Cargando…» hasta tener la foto.
 */
function esperarImagen(url) {
  return new Promise((resolver, rechazar) => {
    const imagenTemporal = new Image();
    const limite = setTimeout(() => {
      limpiar();
      imagenTemporal.src = "";
      rechazar(new Error("La imagen tardó demasiado en cargar."));
    }, 20000);

    function limpiar() {
      clearTimeout(limite);
      imagenTemporal.onload = null;
      imagenTemporal.onerror = null;
    }

    imagenTemporal.onload = () => {
      limpiar();
      resolver();
    };
    imagenTemporal.onerror = () => {
      limpiar();
      rechazar(new Error("No se pudo cargar la imagen recibida."));
    };
    imagenTemporal.src = url;
  });
}

/** 1. DummyJSON: muestra la cita y el autor. */
async function cargarCita() {
  const seccion = secciones.citas;
  iniciarCarga(seccion);

  try {
    const datos = await solicitarJson(URLS_APIS.citas);
    if (typeof datos.quote !== "string" || !datos.quote.trim() ||
        typeof datos.author !== "string" || !datos.author.trim()) {
      throw new Error("La respuesta no contiene una cita y un autor válidos.");
    }

    document.getElementById("texto-cita").textContent = datos.quote;
    document.getElementById("autor-cita").textContent = datos.author;
    mostrarContenido(seccion);
  } catch (error) {
    mostrarError(seccion, `No se pudo obtener la cita. ${error.message} Pulsa el botón para reintentar.`);
  } finally {
    finalizarCarga(seccion);
  }
}

/** 2. Dog CEO: la propiedad message contiene la URL de la imagen. */
async function cargarPerro() {
  const seccion = secciones.perros;
  iniciarCarga(seccion);

  try {
    const datos = await solicitarJson(URLS_APIS.perros);
    if (datos.status !== "success") {
      throw new Error("El servicio de perros no confirmó una respuesta correcta.");
    }

    const url = comprobarUrlImagen(datos.message);
    await esperarImagen(url);
    document.getElementById("imagen-perro").src = url;
    mostrarContenido(seccion);
  } catch (error) {
    mostrarError(seccion, `No se pudo mostrar el perro. ${error.message} Pulsa el botón para reintentar.`);
  } finally {
    finalizarCarga(seccion);
  }
}

/**
 * 3. CATAAS: /cat?json=true entrega información JSON, no una imagen.
 * Se utiliza url si existe; alternativamente se construye /cat/{id}.
 */
async function cargarGato() {
  const seccion = secciones.gatos;
  iniciarCarga(seccion);

  try {
    const datos = await solicitarJson(URLS_APIS.gatos);
    const identificador = datos.id || datos._id;
    const ruta = datos.url || (identificador
      ? `https://cataas.com/cat/${encodeURIComponent(identificador)}`
      : null);
    const url = comprobarUrlImagen(ruta, "https://cataas.com");

    await esperarImagen(url);
    document.getElementById("imagen-gato").src = url;
    mostrarContenido(seccion);
  } catch (error) {
    mostrarError(seccion, `No se pudo mostrar el gato. ${error.message} Pulsa el botón para reintentar.`);
  } finally {
    finalizarCarga(seccion);
  }
}

/** 4. Useless Facts: muestra el texto que llega en el campo text. */
async function cargarDatoCurioso() {
  const seccion = secciones.datos;
  iniciarCarga(seccion);

  try {
    const datos = await solicitarJson(URLS_APIS.datos);
    if (typeof datos.text !== "string" || !datos.text.trim()) {
      throw new Error("La respuesta no contiene un dato curioso válido.");
    }

    document.getElementById("texto-dato").textContent = datos.text;
    mostrarContenido(seccion);
  } catch (error) {
    mostrarError(seccion, `No se pudo obtener el dato curioso. ${error.message} Pulsa el botón para reintentar.`);
  } finally {
    finalizarCarga(seccion);
  }
}

/** Cada botón controla únicamente su tarjeta. */
secciones.citas.boton.addEventListener("click", cargarCita);
secciones.perros.boton.addEventListener("click", cargarPerro);
secciones.gatos.boton.addEventListener("click", cargarGato);
secciones.datos.boton.addEventListener("click", cargarDatoCurioso);

// Las cuatro solicitudes comienzan de forma independiente al abrir la página.
// Un error en una API no interrumpe ni bloquea las otras tres.
cargarCita();
cargarPerro();
cargarGato();
cargarDatoCurioso();
