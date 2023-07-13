En esta parte se comenzará a armar un backend usando para ello NodeJS, un entorno de JavaScript. A diferencia de los navegadores, donde el código debe ser transpilado usando *Babel* u otros servicios debido a que no siempre soportan las últimas funcionalidades, esto no es así con el backend, ya que las nuevas versiones de Node soportan la enorme mayoría de las nuevas características de JavaScript.

Para comenzar un nuevo proyecto vamos al directorio donde queremos guardarlo y lo creamos usando el comando `npm init`. Tras esto se responderán una serie de preguntas y el nuevo proyecto será generado con un archivo `package.json` que contiene información del proyecto.

```json
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}
```

Este archivo define que el punto de entrada del proyecto es el archivo `index.js`.

Podemos hacer algunos cambios al objeto `scripts`:

```json
{
	// ...
	"scripts": {
		"start": "node index.js",
		"test": "echo 'Error: no test specified' && exit 1"
	},
	// ...

}
```

Podemos ahora crear la primera versión de la aplicación al agregar código al archivo `index.js`:

```js
console.log("Hello, world");
```

Para correr el programa con Node solo debemos de escribir lo siguiente en la línea de comandos:

```bash
node index.js
```

O podemos correrlo con un script de npm:

```bash
npm start
```

Este script funciona porque fue definido previamente en el archivo *package.json*.

Por último, *package.json* define otro script de forma predeterminada, `npm test`. Dado que el proyecto aún no tiene una librería de testing el comando solo ejecutará el siguiente comando en la consola:

```bash
echo "Error: no test specified" && exit 1
```

# Servidor web simple

Podemos crear un servidor web al agregar el siguiente código al archivo *index.js*:

```js
const http = require("http");

const app = http.createServer((request, response) => {
	response.writeHead(200, { "Content-Type": "text/plain" });
	response.end("Hello, world");
});

const PORT = 3000;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```

Podemos abrir la aplicación al abrir http://localhost:3000:

![[Pasted image 20230710183235.png]]

El servidor funciona de la misma forma sin importar la parte final de la URL. De hecho, si vamos a http://localhost:3000/foo/bar veremos exactamente lo mismo.

Veamos la primera parte de la aplicación:

```js
const http = require("http");
```

En la primera línea la aplicación importa un módulo de servidor web nativo de Node. Esto es técnicamente lo mismo que se hace en React pero con una sintaxis algo diferente:

```js
import http from "http";
```

Esto es porque el código en el navegador usa módulos ES6  donde se definen usando la palabra clave `export` y se importan usando `import`.

Sin embargo, NodeJS usa los llamados módulos CommonJS. La razón de esto es que el ecosistema de Node ha tenido necesidad de los módulos desde mucho antes de que fueran soportados en la especificación del lenguaje. Si bien Node soporta ahora los módulos ES6, dado que el soporte aún no es perfecto la comunidad se ha quedado con los módulos CommonJS.

La siguiente parte del código es la siguiente:

```js
const app = http.createServer((request, response) => {
	response.writeHead(200, { "Content-Type": "text/plain" });
	response.end("Hello, world");
});

```

El código usa el método `createServer()` del módulo `http` para crear un nuevo servidor web. Un event handler es registrado en el servidor que es llamado cada vez que una solicitud HTTP sea realizada a la dirección http://localhost:3000.

Esta solicitud es respondida con el código de estado 200, el header `Content-Type` configurado en `text/plain` y el contenido del sitio es `Hello, world`.

La última línea vincula el servidor asignado a la variable `app` a escuchar las solicitudes HTTP enviadas al puerto 3000.

```js
const PORT = 3000;
app.listen(PORT);
```

El propósito principal de este servidor será ofrecer datos crudos en formato JSON al frontend. Por esta razón haremos que el servidor regrese una lista de notas en formato JSON:

```js
const http = require("http");

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const app = http.createServer((request, response) => {
	response.writeHead(200, { "Content-Type": "application/json" });
	response.end(JSON.stringify(notes));
});

const PORT = 3000;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```

Ahora el header `Content-Type` informa al destinatario que los datos están en formato JSON. Las notas son transformadas en JSON usando `JSON.stringify()`.

Así, cuando se abre el navegador las notas son mostradas en formato JSON.

# Express

Si bien es posible crear el servidor usando directamente el servidor HTTP de Node, es algo difícil de hacer en especial cuando la aplicación crece.

Para evitar esto, se han elaborado muchas librerías que ofrecen una interfaz más amigable que la del módulo HTTP. Estas librerías buscan proporcionar una mejor abstracción a los casos generales que normalmente se requieren al construir un servidor backend. Por lejos, la más popular de estos es Express.

Para instalar Express es necesario ejecutar el siguiente comando:

```sh
npm install express
```

También se puede usar la aplicación Express generator:

```sh
npx express-generator
```

Esto agregará la dependencia a *package.json*:

```json
{
	// ...
	"dependencies": {
		"express": "^4.18.2"
	}
	// ...
}
```

El código fuente de la dependencia se instala en la carpeta *node_modules* localizada en la raíz del proyecto. Además, aparte de Express se pueden ver un gran número de dependencias en el directorio:

![[Pasted image 20230712001301.png]]

Estas son las dependencias de la librería de Express y las dependencias de las dependencias. Estas son llamadas **dependencias transitivas** del proyecto.

Se puede ver que la versión instalada en el proyecto es la 4.18.2. El caret en frente del número de la versión significa que si las dependencias del proyecto son actualizadas o cuando sean actualizadas la versión de Express instalada será al menos la versión 4.18.2.

Se pueden actualizar las dependencias del proyecto con el siguiente comando:

```sh
npm update
```

De igual manera, si comenzamos a trabajar en el proyecto en otra computadora podemos instalar las dependencias del proyecto definidas en *package.json* actualizadas corriendo el siguiente comando en la raíz del proyecto:

```sh
npm install
```

# Web y Express

Regresemos a la aplicación y hagamos los siguientes cambios:

```ts
const express = require("express");

const app = express();

let notes = [
	// ...
];

app.get("/", (request, response) => {
	response.send("<h1>Hello, world</h1>");
});

app.get("/api/notes", (request, response) => {
	response.json(notes);
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
```

La aplicación no cambia mucho. Al principio se importa `express` que es una función que es usada para crear una aplicación de Express guardada en la variable `app`:

```ts
const express = require("express");

const app = express();
```

Después se definen dos rutas en la aplicación. La primera define un event handler que es usado para manejar la solicitud HTTP GET a la raíz de la aplicación:

```ts
app.get("/", (request, response) => {
	response.send("<h1>Hello, world</h1>");
});
```

La función event handler acepta dos parámetros. El primer parámetro, `request`, contiene toda la información de la solicitud HTTP, y el segundo, `response`, es usado para definir como se debe responder la solicitud.

En el código la solicitud es respondida usando el método `send()` del objeto `response`. Llamar este método hace que el servidor responda la solicitud enviando una respuesta que contiene el string `<h1>Hello, world</h1>` que fue pasada al método `send()`. Dado que el parámetro es un string, Express automáticamente configura el valor del header `Content-Type` a `text/html`. El código de estado predeterminado de la respuesta es 200.

La segunda ruta define un event handler que maneja las solicitudes HTTP GET hechas a la ruta de notas de la aplicación:

```ts
app.get("/api/notes", (request, response) => {
	response.json(notes);
});
```

La solicitud es respondida  con el método `json()` del objeto `response`. Llamar este método enviará el array `notes` que fue pasado como un string con formato JSON. Express automáticamente configura el header `Content-Type` con el valor `application/json`.

![[Pasted image 20230712191249.png]]

Al contrario que en el método anterior, no es necesario transformar los datos usando `JSON.stringify()`, ya que Express lo hace automáticamente.

# Nodemon

Hasta el momento se debe reiniciar el servidor cada que se hacen cambios en el código, para evitar esto se hace uso de nodemon.

> Nodemon revisará los archivos en el directorio en el que nodemon se inició y, si algún archivo cambia, nodemon automáticamente reiniciará la aplicación de Node.

Para instalar nodemon como una *dependencia de desarrollo* se ejecuta el siguiente comando:

```sh
npm install -D nodemon
```

Esto cambia el código de *package.json*:

```json
{
	// ...
	"dependencies": {
		"express": "^4.18.2"
	},
	"devDependencies": {
		"nodemon": "^2.0.20"
	}
	// ...
}
```

Para iniciar fácilmente nodemon podemos crear un script dentro de *package.json*:

```json
{
	// ...
	"scripts": {
		"start": "node index.js",
		"dev": "nodemon index.js",
		"test": "echo 'Error: no test specified' && exit 1"
	}
	// ...
}
```

Podemos iniciar el servidor en modo desarrollo con el comando:

```sh
npm run dev
```

A diferencia de los comandos `start` y `test` debemos agregar `run`, ya que este no es un script nativo de Node.

# REST

Ahora se extenderá el servidor de tal forma que provea la misma RESTful HTTP API de json-server. Representational State Transfer, o REST, fue introducido en el 2000 en una [disertación](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) de Roy Fielding. REST es un estilo de arquitectura para crear aplicaciones web escalables.

Como se dijo antes, cada recurso debe tener una URL asociada que sea la dirección única del recurso. Una convención para crear direcciones únicas es combinar el nombre del tipo de recurso con el identificador único del recurso. Supongamos que la URL del servicio es www.example.com/api. Si definimos el tipo del recurso como `notes`, entonces la dirección del recurso nota con el identificador 10 tiene la URL única www.example.com/api/notes/10 y la URL de la colección de notas es www.example.com/api/notes.

Se pueden ejecutar diferentes tipos de operaciones en los recursos. Esta operación depende del *verbo* HTTP:

| URL      | Verbo  | Funcionalidad                                                             |
| -------- | ------ | ------------------------------------------------------------------------- |
| notes/10 | GET    | Obtiene un solo recurso                                                   |
| notes    | GET    | Obtiene todos los recursos en la colección                                |
| notes    | POST   | Crea un nuevo recurso basándose en los datos de la solicitud              |
| notes/10 | DELETE | Remueve el recurso identificado                                           |
| notes/10 | PUT    | Remplaza el recurso identificado con los datos de la solicitud            |
| notes/10 | PATCH  | Remplaza una parte del recurso identificado con los datos de la solicitud | 

De esta manera es como se define lo que REST llama una interfaz uniforme que significa una manera consistente de definir interfaces que hagan posible la cooperación entre sistemas.

Esta forma de interpretar REST corresponde al [segundo nivel de madurez RESTful](https://martinfowler.com/articles/richardsonMaturityModel.html) en el modelo de madurez Richardson. De acuerdo a la definición propuesta por Roy Fielding no se ha definido una API RESTful, de hecho, la mayoría de las RESTful API en el mundo no se siguen los criterios originales de Fielding.

# Obteniendo un único recurso

Lo siguiente es ampliar la aplicación de tal forma que ofrezca una interfaz para operar sobre una nota individual, lo primero es crear una ruta para obtener un solo recurso.

Esta dirección única será de la forma *notes/10*, donde el número al final se refiere  al id de la nota.

Podemos definir parámetros para las rutas en Express usando la sintaxis de dos puntos:

```ts
app.get("/api/notes/:id", (request, response) => {
	const id = request.params.id;
	const note = notes.find(note => note.id === id);
	
	response.json(note);
});
```

Ahora `app.get("/api/notes/:id")` manejará todas las peticiones HTTP GET que son de la forma */api/notes/ALGO* donde ALGO es un string arbitrario.

Se puede acceder al parámetro `id` en la ruta de la solicitud a través del objeto `request`:

```ts
const id = request.params.id;
```

Si vamos a la ruta http://localhost/api/notes/1 veremos que no funciona, ya que el navegador muestra una página vacía. La razón de esto es que `id` es del tipo `string`, mientras que `note.id` es del tipo `number`. Al usar el operador `===` nos manda `false` ya que `id` y `note.id` no son del mismo tipo.

Para arreglar esto debemos de convertir `id` al tipo `number`:

```ts
app.get("/api/notes/:id", (request, response) => {
	const id = Number(request.params.id);
	const note = notes.find(note => note.id === id);
	
	response.json(note);
});
```

Esto nos permite ahora sí adquirir el recurso:

![[Pasted image 20230712210841.png]]

Sin embargo, existe otro problema. Si buscamos una nota con un id que no existe el servidor responde con el código de estado 200 (`OK`), lo que indica que la solicitud fue exitosa a pesar de no serlo.

Para evitar esto necesitamos que el servidor responda con el código de estado 404 (`NOT FOUND`) para indicar que el recurso no fue encontrado:

```ts
app.get("/api/notes/:id", (request, response) => {
	const id = Number(request.params.id);
	const note = notes.find(note => note.id === id);
	
	if (note) {
		response.json(note);
	} else {
		response.status(404).end();
	}
});
```

Cuando no se encuentra la nota buscada el valor de `note` es `undefined`, un valor falsy, por lo que se ejecuta `response.status(404).end()` enviando el código de estado 404. La aplicación no regresa nada al usuario como lo hacen normalmente las páginas web. Esto es así porque las API RESTful son interfaces que están destinadas al uso en programación y el código de error es todo lo que se necesita.

Aún así, si es necesario dar una idea de la razón del error es posible hacerlo al [sobrescribir el mensaje predeterminado NOT FOUND](https://stackoverflow.com/questions/14154337/how-to-send-a-custom-http-status-message-in-node-express/36507614#36507614).

# Eliminando recursos

Lo siguiente es crear una ruta para eliminar recursos. La eliminación de recursos debe suceder en una petición HTTP DELETE a la URL del recurso:

```ts
app.delete("/api/notes/:id", (request, response) => {
	const id = Number(request.params.id);
	notes = notes.filter(note => note.id !== id);
	
	response.status(204).end();
});
```

Si la eliminación de un recurso es exitosa se envía el código de estado 204 (`NO CONTENT`) sin ningún dato como respuesta.

No existe un consenso sobre qué código de estado se debe de enviar a una petición DELETE si el recurso no existe, ya que las únicas dos opciones son 204 y 404.

# Postman

Para probar el servidor se pueden usar muchas herramientas como la herramienta de consola [curl](https://curl.haxx.se/). Sin embargo, aquí se usará Postman.

![[Pasted image 20230712233458.png]]

Para usar Postman solo se debe definir la URL y seleccionar el tipo correcto de petición, en este caso DELETE.

El servidor backend parece responder correctamente. Si se realiza una petición HTTP GET a http://localhost:3000/api/notes se podrá ver que la nota con el id de 2 ya no existe dentro de la lista, lo que indica que la eliminación fue exitosa.

Dado que las notas solo están guardadas en la memoria, la lista de notas regresará a su estado original una vez que se reinicie el servidor.

# Recibiendo datos

Lo siguiente es hacer posible que se agreguen nuevas notas al servidor. Para ello se debe hacer uso de una petición HTTP POST a la URL http://localhost:3000/api/notes enviando toda la información necesaria en el cuerpo de la petición en formato JSON.

Para acceder a los datos de forma fácil se debe hacer uso del json-parser de Express que se usa con el comando `app.use(express.json())`:

```ts
const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/notes", (request, response) => {
	const note = request.body;
	response.json();
});
```

De esta forma la función event handler puede acceder a los datos de `body` en el objeto `request`.

Sin json-parser la propiedad `body` no estaría definida. json-parser funciona de tal forma que toma los datos JSON de la petición y los transforma en un objeto de JavaScript que agrega a la propiedad `body` del objeto `request` antes de que el handler de la ruta sea llamado.

Es importante recordar que a la hora de enviar datos a un servidor el header `Content-Type` esté configurado correctamente.

Ahora hay que hacer que el servidor regrese la nota que se ha agregado al servidor con la respuesta:

```ts
const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/notes", (request, response) => {
	const maxId = notes.lenght > 0
		? Math.max(...notes.map(n => n.id))
		: 0;
	
	const note = request.body;
	note.id = maxId + 1;
	
	notes.concat(note);
	
	response.json(note);
});
```

Dado que se necesita un id única para cada nota esta se genera buscando el mayor id dentro del array y sumándole 1. Este método no es recomendado pero puede servir para probar el servidor.

El método actual sigue teniendo un problema, esto es que puede ser utilizado para agregar objetos con propiedades arbitrarias. Podemos mejorarlo definiendo que la propiedad `content` no debe estar vacía y se le dará un valor de falso a la propiedad `important` por defecto. Todas las demás propiedades serán descartadas:

```ts
const generateId = () => {
	const maxId = notes.lenght > 0
		? Math.max(...notes.map(n => n.id))
		: 0;
	
	return maxId + 1;
};

app.post("/api/notes", (request, response) => {
	const body = request.body;
	
	if (!body.content) {
		return response.status(400).json({
			error: "content missing"
		});
	}
		
	const note = {
		content: body.content,
		important: body.important || false,
		id: generateId()
	};
	
	notes.concat(note);
	
	response.json(note);
});
```

En este caso el nuevo método revisa si los datos de la petición tienen la propiedad `content` y el servidor responderá con el código de estados 400 (`BAD REQUEST`) si este falta:

```ts
if (!body.content) {
	return response.status(400).json({
		error: "content missing"
	});
}
```

Además, si la nota no tiene una propiedad `important` se le pondrá por defecto el valor `false`:

```ts
important: body.important || false
```

# Acerca de los tipos de peticiones HTTP