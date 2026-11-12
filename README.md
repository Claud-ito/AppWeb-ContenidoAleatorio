# Explorador de contenido aleatorio

**Materia:** Programación Web III  
**Modalidad:** Trabajo individual  
**Autor:** Said Montaño Condori  
**Año:** 2026

## 1. Descripción y objetivo

Página web responsiva que consulta **cuatro APIs públicas** y muestra citas, fotografías de perros, fotografías de gatos y datos curiosos. El contenido aparece al abrir la página y puede actualizarse individualmente mediante botones, **sin recargar todo el documento**.

El propósito académico es practicar peticiones HTTP GET con `fetch`, interpretación de JSON, `async/await`, cambios al DOM y manejo de errores de red, HTTP y carga de imágenes.

## 2. Tecnologías utilizadas

- HTML5: estructura semántica de las cuatro secciones.
- CSS3: estilos en un archivo independiente, diseño adaptable y `object-fit: cover` para imágenes uniformes sin deformación.
- JavaScript: solicitudes a las APIs con `fetch` y `async/await`, sin dependencias de terceros.
- Git: historial de cambios organizado en commits sobre la rama `main`.

**No utiliza** ASP.NET Core, bases de datos, registro de usuarios, servidor de backend ni paquetes de npm.

## 3. Estructura del proyecto

```text
ExploradorContenidoAleatorio/
├── index.html         # Página con las cuatro tarjetas
├── css/
│   └── styles.css     # Estilos y diseño responsivo
├── js/
│   └── app.js         # Consultas a las APIs y manejo de la interfaz
├── .gitignore
└── README.md          # Documentación y preguntas de reflexión
```

## 4. Instrucciones para ejecutar

### Opción A: Visual Studio Code con Live Server

1. Extraer el ZIP del proyecto.
2. Abrir la carpeta `ExploradorContenidoAleatorio` en Visual Studio Code.
3. Si ya se dispone de la extensión **Live Server**, hacer clic derecho en `index.html` y elegir **Open with Live Server**.
4. Se abrirá el navegador. Mantener la conexión a Internet activa para consultar las cuatro APIs.

### Opción B: Servidor local con Python (sin extensiones)

Abrir una terminal en la carpeta raíz del proyecto y ejecutar en Windows:

```powershell
py -m http.server 5500
```

Si `py` no está disponible, puede intentarse `python -m http.server 5500`. Después, abrir:

```text
http://localhost:5500
```

Para detener el servidor, presionar `Ctrl + C` en la terminal.

> El proyecto solo necesita un servidor de archivos estáticos. No requiere base de datos ni instalar paquetes. Evitar abrirlo como `file://`, pues algunas APIs pueden aplicar restricciones de origen (CORS).

## 5. APIs y endpoints utilizados

Todas las solicitudes usan el método **GET**.

| Sección | API | Endpoint | Campos utilizados |
|---|---|---|---|
| Citas | DummyJSON | `https://dummyjson.com/quotes/random` | `quote`, `author` |
| Perros | Dog CEO | `https://dog.ceo/api/breeds/image/random` | `message`, `status` |
| Gatos | CATAAS | `https://cataas.com/cat?json=true` | `url` o `id` / `_id` |
| Datos curiosos | Useless Facts | `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en` | `text` |

**Particularidad de CATAAS:** `https://cataas.com/cat?json=true` devuelve datos JSON con el identificador y normalmente la URL de la imagen. El código usa `url` cuando está disponible; si no, forma `https://cataas.com/cat/{id}`. En cambio, `https://cataas.com/cat` sin el parámetro `json=true` devuelve una imagen directamente, no un documento JSON.

## 6. Comportamiento esperado

1. Al abrir la página se lanzan cuatro solicitudes independientes.
2. Mientras una sección espera información se ve **«Cargando…»** y solo su botón permanece deshabilitado.
3. Cuando llega la respuesta, se comprueba `response.ok`, se procesa el JSON y se muestra el resultado.
4. Para perros y gatos, también se espera a que se cargue correctamente la fotografía. Las dos secciones usan `object-fit: cover` para evitar deformaciones.
5. Cada clic genera una nueva petición `fetch` con `cache: "no-store"`, sin actualizar las otras tarjetas.
6. Si una API falla (sin conexión, error HTTP, datos inválidos o imagen inaccesible), **solo esa tarjeta** muestra un mensaje comprensible, y su botón vuelve a habilitarse para reintentar.
7. Los resultados son aleatorios y pueden repetirse. Los textos de las APIs se muestran tal como llegan; no se traducen.

## 7. Guía para comprobar el funcionamiento y obtener capturas

### Captura 1 — Cuatro tarjetas funcionando

1. Con Internet activo, abrir la página desde Live Server o `http://localhost:5500`.
2. Esperar a que aparezcan la cita, el perro, el gato y el dato curioso.
3. Presionar uno o dos botones y verificar que cambia únicamente el contenido de esa tarjeta.
4. Procurar mostrar las cuatro tarjetas en pantalla; se puede reducir un poco el zoom del navegador con `Ctrl` + `-`.
5. Guardar la **primera captura**. En Windows 11 se puede utilizar `Win` + `Shift` + `S`.

### Captura 2 — Mensaje de error controlado (simulación por desconexión)

1. **No cerrar ni actualizar** la página que ya tiene las cuatro tarjetas funcionando.
2. Abrir las herramientas del navegador con `F12`.
3. Ir a la pestaña **Network** (Red).
4. En la lista de limitación de red que suele indicar **No throttling**, elegir **Offline** (Sin conexión).
5. Regresar a la página y hacer clic, por ejemplo, en **«Obtener otra cita»**.
6. Observar que la sección de citas muestra un error como «No se pudo obtener la cita. No fue posible conectarse… Pulsa el botón para reintentar». Las otras tres tarjetas deben conservar su contenido anterior.
7. Confirmar que el botón de citas **vuelve a estar habilitado**. Si hace falta, cerrar las herramientas con `F12` (la simulación sigue activa mientras las herramientas mantengan la configuración) y guardar la **segunda captura**, donde se vea el mensaje de error y las otras secciones.
8. Para recuperarse, volver a **Network → Online / No throttling**, presionar otra vez **«Obtener otra cita»** y comprobar que aparece contenido nuevo.

**Alternativa:** si no aparece la opción **Offline**, desconectar temporalmente el Wi-Fi mientras la página está abierta y pulsar el botón de una tarjeta. Después, volver a conectar.

**Importante:** no recargar toda la página mientras se simula la desconexión, porque se perdería el contenido de las cuatro tarjetas. El error debe producirse al consultar otra vez una sección.

### Comprobaciones adicionales sugeridas

- Pulsar dos botones distintos y comprobar que la carga de uno no bloquea al otro.
- Confirmar que el botón de la tarjeta en carga está deshabilitado y luego se habilita.
- Repetir la prueba de red en la sección de perros o gatos para ver su error controlado.
- Reducir el ancho del navegador o abrirlo en un teléfono: las tarjetas deben adaptarse y apilarse verticalmente.

## 8. Preguntas de reflexión

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

## 9. Entrega y publicación

Los artefactos a presentar son:

- **ZIP del código fuente** (sin directorios de compilación ni dependencias).
- **Enlace al repositorio de GitHub** (publicación realizada por el estudiante).
- **README.md** con autor, ejecución y las cinco respuestas (este archivo).
- **Dos capturas**, una de funcionamiento y otra de error controlado.

El código está organizado en commits locales sobre **`main`**, sin ramas adicionales. Para publicar desde la carpeta del **repositorio con historial**:

```powershell
git branch --show-current
git log --oneline
# Crear un repositorio vacío en GitHub y copiar su URL:
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

**Identidad de Git:** los tres commits de este repositorio están atribuidos a **Said Montaño Condori** con el correo privado `293652270+Claud-ito@users.noreply.github.com` de GitHub. La configuración local de Git también usa estos datos para los próximos commits. Este correo permite mantener privado el correo personal al publicar el repositorio. Para que GitHub vincule los commits al perfil, el correo `noreply` debe corresponder a la cuenta que los publica.

---

**Referencias:** [Documentación DummyJSON](https://dummyjson.com/docs/quotes) · [Documentación Dog CEO](https://dog.ceo/dog-api/documentation/random) · [CATAAS](https://cataas.com/) · [Useless Facts](https://uselessfacts.jsph.pl/)
