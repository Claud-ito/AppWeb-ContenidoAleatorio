# Explorador de contenido aleatorio

**Materia:** Programación Web III  
**Modalidad:** Trabajo individual  
**Autor:** Said Montaño Condori  
**Año:** 2026


## 1. Instrucciones para ejecutar

1. Extraer el ZIP del proyecto.
2. Abrir la carpeta `ExploradorContenidoAleatorio` en Visual Studio Code.
3. Si ya se dispone de la extensión **Live Server**, hacer clic derecho en `index.html` y elegir **Open with Live Server**.
4. Se abrirá el navegador. Mantener la conexión a Internet activa para consultar las cuatro APIs.

## 2. Preguntas de reflexión

### 1. ¿Qué es un endpoint y cuál utilizaste para cada API?

Un **endpoint** es una dirección específica de un servicio web a la que el cliente envía una petición para obtener o modificar un recurso. En esta práctica utilizamos endpoints de consulta (`GET`):

- DummyJSON: `https://dummyjson.com/quotes/random`, para obtener una cita y su autor.
- Dog CEO: `https://dog.ceo/api/breeds/image/random`, para obtener la dirección de una foto aleatoria de perro.
- CATAAS: `https://cataas.com/cat?json=true`, para obtener información sobre una imagen de gato.
- Useless Facts: `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en`, para obtener un dato curioso en inglés.

Cada endpoint representa una operación concreta del proveedor. Aunque todos utilizan HTTP GET, el contenido devuelto y su estructura cambian según la API.

### 2. ¿Qué diferencia existe entre recibir JSON y recibir directamente una imagen?

**JSON** es un formato de texto estructurado que contiene datos, por ejemplo `{ "quote": "...", "author": "..." }` o `{ "url": "https://..." }`. JavaScript lo interpreta para encontrar los campos necesarios. Cuando la respuesta es una **imagen directamente**, el cuerpo HTTP contiene los bytes de la fotografía (JPEG, PNG, etc.), no propiedades que puedan leerse como JSON.

Por eso, en este proyecto solicitamos a CATAAS el formato JSON con `?json=true`, leemos la URL o el identificador y después asignamos la dirección de la foto al elemento `<img>`. Sería incorrecto aplicar `response.json()` a `https://cataas.com/cat` sin ese parámetro.

### 3. ¿Qué función cumplen `await` y `response.json()`?

`await` **espera el resultado de una operación asíncrona**, como `fetch(url)`, antes de continuar con la siguiente instrucción de esa misma función `async`. No bloquea toda la página: el navegador puede seguir respondiendo a otros eventos y solicitudes. La función `response.json()` lee e interpreta el cuerpo de la respuesta HTTP para convertir el JSON en un valor utilizable en JavaScript (por ejemplo, un objeto). Como también es asíncrona, usamos `await response.json()`.

```javascript
const response = await fetch("https://dummyjson.com/quotes/random");
if (!response.ok) throw new Error("Error HTTP");
const data = await response.json();
console.log(data.quote, data.author);
```

### 4. ¿Por qué se debe verificar `response.ok` además de utilizar `try/catch`?

Porque **`fetch` normalmente no rechaza la promesa por una respuesta HTTP de error**, como 404 o 500: en esos casos puede devolver una respuesta normal con `ok === false`. `try/catch` sirve para capturar errores que sí se lanzan, como problemas de red, un JSON inválido o errores que provocamos manualmente con `throw`. Verificar `response.ok` detecta expresamente los estados HTTP fallidos y permite lanzar un error que luego se muestra de forma controlada.

### 5. ¿Cómo lograste actualizar una sección sin recargar toda la página?

Cada tarjeta tiene identificadores propios en el HTML y una función JavaScript independiente: `cargarCita`, `cargarPerro`, `cargarGato` y `cargarDatoCurioso`. Al hacer clic, su botón ejecuta únicamente la función de esa tarjeta, que consulta la API y modifica **solo los elementos correspondientes del DOM**, mediante `textContent` (texto) o `src` (imagen). No se utiliza `location.reload()` ni se vuelve a solicitar el archivo HTML. Las funciones también controlan individualmente los estados de carga, error y habilitación del botón; por eso una sección puede fallar sin bloquear a las demás.

