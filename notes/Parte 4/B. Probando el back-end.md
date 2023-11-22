Lo siguiente es comenzar a escribir pruebas para el back-end, dado que este no contiene lógica muy complicada no es necesario escribir [tests unitarios](https://en.wikipedia.org/wiki/Unit_testing) para este, la única funcionalidad potencial que se puede probar es el método `toJSON` que se usa para darle formato a las notas.

En algunas ocasiones puede ser beneficioso el implementar algunas pruebas al back-end al imitar una base de datos en lugar de usar una base de datos real. Una librería que puede ser usada para esto es [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server).

Dado que la aplicación es relativamente simple se puede probar la aplicación entera usando su REST API, por lo que la base de datos también está incluida. 

Este tipo de pruebas donde varios componentes del sistema son probados en conjunto son llamadas pruebas de integración o [integration testing](https://en.wikipedia.org/wiki/Integration_testing).

# Entorno de pruebas
Anteriormente se mencionó que el modo de producción (production mode) es cuando el servidor está corriendo en Fly.io o Render. Una de las convenciones de Node es definir el modo en que se ejecuta la aplicación usando la variable de entorno `NODE_ENV`.

En la aplicación actual solo se deben cargar las variables de entorno dentro de *.env* si la aplicación no está en modo de producción, de hecho, es una práctica común el definir modos separados para el desarrollo y el testing.

Para ello se deben editar los scripts en *package.json*, de tal forma que `NODE_ENV` obtenga el valor que necesita según el comando a utilizar:

```json
{
	// ...
	"scripts": {
		"start": "NODE_ENV=production node index.js",
		"dev": "NODE_ENV=development nodemon index.js",
		// ...
		"test": "NODE_ENV=test jest --verbose --runInBand"
	},
	// ...
}
```

Se ha agregado la opción `--runInBand` al script que ejecuta las pruebas. Esto evita que las pruebas sean ejecutadas en paralelo por Jest.

Se ha especificado el modo de la aplicación como `development` en el script `npm run dev` que usa nodemon, mientras que en el script `npm start` se ha definido el modo como `production`.

El único problema en la forma en que se han definido las variables es que esto no funciona en Windows, para corregir esto se puede usar el paquete [cross-env](https://www.npmjs.com/package/cross-env) como una dependencia de desarrollo con el comando:

```sh
npm install -D cross-env
```

Lo siguiente es lograr la compatibilidad entre plataformas usando la librería en los scripts:

```json
{
	// ...
	"scripts": {
		"start": "cross-env NODE_ENV=production node index.js",
		"dev": "cross-env NODE_ENV=development nodemon index.js",
		// ...
		"test": "cross-env NODE_ENV=test jest --verbose --runInBand"
	},
	// ...
}
```

Es importante recordar que si la aplicación se sube a Fly.io o Render el poner cross-env como una dependencia de desarrollo va a producir un error, por lo que es necesario agregarla como una dependencia de producción con el siguiente comando:

```sh
npm install cross-env
```

Ahora es posible modificar la aplicación para que se comporte de forma diferente según el modo en que se ejecuta, por ejemplo, se puede usar una base de datos distinta cuando se ejecutan las pruebas.

Se puede crear una base de datos separada para las pruebas en MongoDB, esto no es una solución óptima cuando muchas personas están trabajando en la aplicación pues la ejecución de las pruebas suele requerir una sola instancia de la base de datos que no está siendo usada para las pruebas que están corriendo en aquel momento.

Es más fácil el ejecutar las pruebas en una base de datos instalada y corriendo en la máquina local del desarrollador, es decir, la solución más óptima es correr todas las pruebas en una base de datos separada. Esto es simple de lograr usando [Mongo en la memoria](https://docs.mongodb.com/manual/core/inmemory/) o usando contenedores de [Docker](https://www.docker.com/).

Para usar MongoDB como la base de datos de prueba se deben realizar algunos cambios al módulo que define la aplicación:

```ts
require("dotenv").config();

const PORT = process.env.PORT;

const MONGODB_URI = process.env.NODE_ENV === "test"
	? process.env.TEST_MONGODB_URI
	: process.env.MONGODB_URI;

module.exports = {
	MONGODB_URI,
	PORT
};
```

El archivo *.env* tiene dos variables separadas para guardar las direcciones de las bases de datos de desarrollo y pruebas.

El módulo `config` que se implementó es parecido al paquete [node-config](https://github.com/lorenwest/node-config). El escribir nuestra propia implementación es justificable porque la aplicación es simple y ayuda a aprender nuevas cosas.

# `supertest`

Lo siguiente es usar el paquete [supertest](https://github.com/visionmedia/supertest) para escribir las pruebas para probar la API. Para instalarlo como una dependencia de desarrollo se debe usar el siguiente comando:

```sh
npm install -D supertest
```

Ahora se deben escribir las primeras pruebas en el archivo *tests/node_api.test.ts*:

```ts
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("notes are returned as json", async () => {
	await api
		.get("/api/notes")
		.expect(200)
		.expect("Content-Type", /application\/json/)
});

afterAll(async () => {
	await mongoose.connection.close();
});
```

La prueba importa la aplicación de Express y la envuelve en la función `supertest` en algo llamado objeto [super-agente](https://github.com/visionmedia/superagent). Este objeto es asignado a la variable `api` y las pruebas pueden usarla para hacer peticiones HTTP al back-end.

En este caso la prueba hace una petición HTTP GET a la URL `/api/notes` y verifica que haya sido respondida con el código de estado 200 y que el header `Content-Type` sea `application/json`.

El valor deseado es definido mediante una [expresión regular](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) o regex. Las regex empiezan y terminan con una diagonal (`/`), como el valor deseado también tiene una diagonal debe ser precedido con el símbolo `\` para que no sea interpretado como el final de la expresión regular.

Si bien la prueba puede escribirse usando solo strings en vez de expresiones regulares:

```ts
.expect("Content-Type", "application/json");
```

Esto nos obliga a que el valor del header tenga que ser exactamente igual al string que se ha pasado, en cambio, para la regex es aceptable que el header *contenga* el string en cuestión. Esto es, el header `application/json; charset=utf-8` pasará la prueba con la regex, pero no la prueba que use el string.

La prueba contiene otros detalles como el uso de `async/await` debido a que una petición a la API es una *operación asíncrona*. Una vez todas las pruebas han sido realizadas se debe cerrar la conexión con la base de datos usada por Mongoose. Esto se puede hacer con el método `afterAll`:

```ts
afterAll(async () => {
	await mongoose.connection.close();
});
```

Al ejecutar las pruebas puede salir el siguiente error:

![[Pasted image 20231027173924.png]]

Esto se debe a un error de Jest. Una manera de arreglar esto es agregar el archivo *teardown.ts* al directorio raíz de las pruebas con el siguiente contenido:

```ts
module.exports = () => {
	process.exit(0);
};
```

Y extender la definición de Jest en *package.json*:

```json
{
	// ...
	"jest": {
		"testEnvironment": "node",
		"globalTeardown": "./test/teardown.ts"
	}
}
```

Otro error que puede suceder es que la prueba tome más tiempo que el predeterminado por Jest de 5000 ms. Para resolver este problema se puede agregar un tercer parámetro a la función `test`:

```ts
test("notes are returned as json", async () => {
	await api
		.get("/api/notes")
		.expect(200)
		.expect("Content-Type", /application\/json/);
}, 100000);
```

Este parámetro configura el tiempo límite en 100,000 ms, lo que asegura que la prueba no falle por falta de tiempo.

Por último, dado que la aplicación fue extraída en su propio módulo y el rol de *index.ts* es ejecutar la aplicación y escuchar en el puerto especificado, las pruebas que ejecuten la aplicación desde el archivo *app.ts* no escucharán en ninguno de los puertos. De hecho, según la documentación de supertest:

> Si el servidor no está escuchando en el momento por conexiones es ligado a un puerto efímero, por lo que no es necesario mantener un seguimiento de los puertos.

Es decir, supertest se encarga de que la aplicación sea probada en el puerto que usa internamente.

Por último se agregarán dos notas a la base de datos usando el programa de *mongo.js*, para ello hay que escribir otras pruebas:

```ts
test("there are two notes", async () => {
	const response = await api.get("/api/notes");

	expect(response.body).toHaveLength(2);
});

test("the first note is about HTTP methods", async () => {
	const response = await api.get("/api/notes");

	expect(response.body[0]).toBe("HTML is easy");
});
```

Las dos pruebas guardan la respuesta a la solicitud en la variable `response` y a diferencia de las pruebas anteriores que usaron los métodos provistos por supertest esta vez se inspeccionaron los datos guardados en la propiedad `response.body` y se verificó el formato y el contenido con los métodos provistos por Jest.

Con estos ejemplos se puede notar el beneficio de usar la sintaxis `async/await`. Normalmente se tendrían que usar funciones callback para acceder los datos regresados por las promesas, pero con la nueva sintaxis se puede hacer algo más cómodo:

```ts
const response = await api.get("/api/notes");

expect(response.body).toHaveLength(2);
```

El middleware que devuelve información acerca de las peticiones HTTP está obstruyendo la ejecución de la prueba. Se debe de modificar el logger de tal forma que no imprima en la consola durante el modo test:

```ts
const info = (...params) => {
	if (process.env.NODE_ENV !== "test") {
		console.log(...params);
	};
};

const error = (...params) => {
	if (process.env.NODE_ENV !== "test") {
		console.log(...params);
	};
};
```

# Inicializando la base de datos antes de las pruebas

Si bien las pruebas parecen funcionar está el problema de que estas dependen del estado de la base de datos que en este momento tiene dos elementos.  Para hacer a las pruebas más robustas se debe de reiniciar la base de datos y generar los datos de pruebas necesarios de una forma controlada antes de cada prueba.

Las pruebas ya están haciendo uso de la función [`afterAll`](https://jestjs.io/docs/api#afterallfn-timeout) de Jest para cerrar la conexión con la base de datos después de terminar la ejecución de las pruebas. Jest ofrece muchas otras [funciones](https://jestjs.io/docs/setup-teardown) que pueden ser usadas para ejecutar operaciones antes de cualquier prueba o tras haber ejecutado todas ellas.

Se debe de inicializar la base de datos antes de cada prueba con la función [`beforeEach`](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout):

```ts
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Note = require("../models/note");

const initialNotes: Note = [
	{
		content: "HTML is easy",
		important: false
	},
	{
		content: "Browser can execute only JavaScript",
		important: true
	}
];

beforeEach(async () => {
	await Note.deleteMany({});

	let noteObject = new Note(initialNote[0]);
	await noteObject.save();
	noteObject = new Note(initialNote[1]);
	await noteObject.save();
});
```

La base de datos es limpiada justo al principio y tras esto se guardan las dos notas dentro del array `initialNotes` en la base de datos. Al hacer esto se asegura que la base de datos sea la misma antes de que cada prueba sea ejecutada.

Es necesario también hacer los siguientes cambios a las últimas dos pruebas:

```ts
test("all notes are returned", async () => {
	const response = await api.get("/api/notes");
	expect(response.body).toHaveLength(iniitalNotes.length);
});

test("a specific note is within the returned notes", async () => {
	const response = await api.get("/api/notes");
	const contents = response.body.map(r => r.content);
	expect(contents).toContain(
		"Browser can execute only JavaScript"
	);
});
```

El método [`toContain`](https://jestjs.io/docs/expect#tocontainitem) es usado para revisar que la nota dada como parámetro esté en la lista regresada por la API.

# Ejecutando las pruebas una por una

El comando `npm test` ejecuta todas las pruebas de la aplicación. Cuando se escriben pruebas suele ser buena idea ejecutar solo uno o dos pruebas, Jest ofrece varias formas de lograr esto, una de las cuales es el método [`only`](https://jestjs.io/docs/en/api#testonlyname-fn-timeout), aunque si las pruebas están escritas en varios archivos este método no es de mucha ayuda.

Otra opción es especificar las pruebas que se deben ejecutar como parámetros del comando `npm test`. El siguiente comando solo ejecuta las pruebas encontradas en el archivo *note_api.test.js*:

```sh
npm test -- test/note_api.test.js
```

La opción `-t` se puede usar para ejecutar las pruebas con un nombre específico:

```sh
npm test -- -t "a specific note is within the returned notes"
```

El parámetro provisto se puede referir al nombre de una prueba o al bloque que la describe. El parámetro también puede contener solo una parte del nombre, por lo que el siguiente comando solo ejecutará las pruebas que contienen *notes* dentro de su nombre:

```sh
npm test -- -t "notes"
```

# `async/await`

La sintaxis `async/await` fue introducida en ES7 para hacer posible el uso de las funciones asíncronas que regresan una promesa de tal forma que hace que el código parezca síncrono.

Como ejemplo, la búsqueda de las notas dentro de la base de datos se ve de la siguiente manera con promesas:

```ts
Note.find({}).(notes => {
	console.log("Operation returned the following notes", notes);
});
```

El método `Note.find({})` regresa una promesa con la que se puede acceder a el resultado de la operación al registrar un callback con el método `then`.

Todo el código que se quiere ejecutar después de que la operación termine se escribe dentro de la función callback. Si se quieren realizar varias funciones asíncronas en secuencia se puede llegar al llamado [infierno callback (callback hell)](http://callbackhell.com/).

Al [encadenar promesas](https://javascript.info/promise-chaining) se puede mantener la situación bajo control y evitar el callback hell al crear una cadena de métodos `then`:

```ts
Note.find({})
	.then(notes => {
		return notes[0].deleteOne();
	})
	.then(response => {
		console.log("the first note is removed");
	});
```

La cadena de métodos `then` está bien, sin embargo, se puede hacer mejor.

Las [funciones generadoras](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) introducidas en ES6 proveen una forma inteligente de escribir código asíncrono de tal forma que luzca como código síncrono aunque no suele ser muy utilizada.

Las keywords `async` y `await` introducidas en ES7 proveen la misma funcionalidad que los generadores pero de una forma entendible y con una sintaxis limpia.

Podemos obtener todas las notas en la base de datos utilizando el operador [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) de la siguiente forma:

```ts
const notes = await Note.find({});

console.log("operation returned the following notes", notes);
```

El código luce exactamente como código síncrono. La ejecución del código se detiene en `const notes = await Note.find({});` y espera hasta que la promesa sea completada y entonces continua con la ejecución del código en la siguiente línea. Cuando la ejecución continua el resultado de la operación que retornó la promesa es asignado a la variable `notes`.

Para usar el operador `await` en las operaciones asíncronas se debe de regresar una promesa, lo cual no suele ser un problema porque las funciones asíncronas que usan callbacks se pueden envolver fácilmente dentro de promesas.

Las keyword `await` no puede ser usada en donde sea, esto solo es posible dentro de funciones [`async`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

Esto significa que para que el ejemplo anterior funcione se debe hacer uso de una async function:

```ts
const main = async () => {
	const notes = await Node.find({});
	console.log("operation returned the following notes", notes);

	const response = await notes[0].deleteOne();
	console.log("the first note is removed");
};
```

# `async/await` en el back-end

Dado que todas las operaciones asíncronas están hechas dentro de una función es buena idea cambiar todos los route handler usando async functions.

La ruta para obtener todas las notas se puede cambiar de la siguiente manera:

```ts
notesRouter.get("/", async (request, response) => {
	const notes = await Node.find({});
	response.json(notes);
});
```

Se puede verificar que la refactorización fue exitosa al probar el endpoint en el navegador y corriendo las pruebas de antes.

# Más pruebas y refactorizando el back-end

Cuando el código se refactoriza siempre hay un riesgo de [regresión](https://en.wikipedia.org/wiki/Regression_testing), es decir, que una funcionalidad ya existente deje de funcionar. Para refactorizar el resto del código es buena idea escribir algunas pruebas para cada ruta de la API.

Primero hay que iniciar con la operación para agregar una nota nueva a la base de datos. Para ello se crea una prueba que agregue una nota y que verifique que el número de notas regresadas por la API se incremente y que la nueva nota exista:

```ts
test("a valid note can be added", async () => {
	const newNote = {
		content: "async/await simplifies making async calls",
		important: true,
	};

	await api
		.post("/api/notes")
		.send(newNote)
		.expect(201)
		.expect("Content-Type", /application\/json/);

	const response = await api.get("/api/notes");
	const contents = response.body.map(r => r.content);

	expect(response.body).toHaveLength(initialNotes.length + 1);
	expect(contents).toContain(
		"async/await simplifies making async calls"
	);
});
```

La prueba fallará porque estamos regresando el código de estado *200 OK* en lugar del código *201 CREATED*:

```ts
notesRouter.post("/", (request, response, next) => {
	const body = request.body;

	const note = new Note({
		content: body.content,
		important: body.important || false
	});

	note.save()
		.then(savedNote => {
			response.status(201).json(savedNote);
		})
		.catch(error => next(error));
});
```

Igualmente hay que crear una prueba para verificar que una nota sin contenido no será guardada en la base de datos:

```ts
test("note without content is not added", async () => {
	const newNote = {
		important: true
	};

	await api
		.post("/api/notes")
		.send(newNote)
		.expect(400)

	const response = await api.get("/api/notes");

	expect(response.body).toHaveLength(initialNotes.length);
});
```

Las dos pruebas revisan que el estado de la base de datos después de la operación al obtener las notes de la aplicación:

```ts
const response = await api.get("/api/notes");
```

El mismo paso se repetirá en otras pruebas más adelante por lo cual es una gran idea extraer estos pasos en funciones de ayuda. Para ello hay que agregar la función en un nuevo archivo llamado *test/test_helper.ts* dentro del mismo directorio de los archivos de pruebas:

```ts
const Note = require("../models/note");

const initialNotes = [
	// ...
];

const nonExistingId = async () => {
	const note = new Note({ content: "willremovethissoon" });
	await note.save();
	await note.deleteOne();

	return note._id.toString();
};

const notesInDb = async () => {
	const notes = await Note.find({});
	return notes.map(note => note.toJSON());
};

module.exports = { initialNotes, nonExistingId, notesInDb };
```

El módulo define la función `notesInDb` que puede ser usada para revisar las notas almacenadas en la base de datos. El array `initialNotes` contiene el estado inicial de la base de datos, mientras que la función `nonExistingId` puede ser usada para crear un id de objeto que no pertenece a ninguna objeto de nota en la base de datos.

Las pruebas ahora pueden usar estas funciones y cambiar de la siguiente manera:

```ts
const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Note = require("../models/note");

beforeEach(async () => {
	await Note.deleteMany({});

	let noteObject = new Note(helper.initialNotes[0]);
	await noteObject.save();

	noteObject = new Note(helper.initialNotes[1]);
	await noteObject.save();
});

test("notes are returned as json", async () => {
	await api
		.get("/api/notes")
		.expect(200)
		.expect("Content-Type", /application\/json/);
});

test ("all notes are returned", async () => {
	const resonse = api.get("/api/notes");
	expect(response.body).toHaveLength(helper.initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
	const response = await api.get("/api/notes");
	const contents = response.body.map(r => r.content);

	expect(contents).toContain(
		"Browser can execute only JavaScript"
	);
});

test("a valid note can be added", async () => {
	const newNote = {
		content: "async/await simplifies making async calls",
		important: true
	};

	await api
		.post("/api/notes")
		.send(newNote)
		.expect(201)
		.expect("Content-Type", /application\/json/);

	const notesAtEnd = await helper.notesInDb();
	expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

	const contents = notesAtEnd.map(n => n.content);
	expect(contents).toContain(
		"async/await simplifies making async calls"
	);
});

test("note without content is not added", async () => {
	const newNote = {
		important: true
	};

	await api
		.post("/api/notes")
		.send(newNote)
		.expect(400)

	const notesAtEnd = helper.notesInDb();

	expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
});

afterAll(async () => {
	await mongoose.connection.close();
});
```

El código usando promesas funciona y las pruebas han sido pasadas, por lo que es hora de refactorizar el código para usar `async/await`. Para la ruta que se encarga de agregar una nueva nota hacemos los siguientes cambios:

```ts
notesRouter.post("/", async (request, response, next) => {
	const body = request.body;

	const note = new Note({
		content: body.content,
		important: body.important || false
	});

	const savedNote = await note.save();
	response.status(201).json(savedNote);
});
```

# Manejo de errores con `async/await`

Si existe un error mientras manejamos una petición POST se nos mostrará en la consola:

![[Pasted image 20231117164806.png]]

Esto nos indica que no hemos manejado el rechazo de una promesa y, por lo tanto, nunca se recibió una respuesta.

Cuando se usa la sintaxis `async/await` se recomienda manejar los errores usando el mecanismo `try/catch`:

```ts
notesRouter("/", async (request, response, next) => {
	const body = request.body;

	const note = {
		content: body.content,
		important: body.important || false
	};

	try {
		const savedNote = await note.save();
		response.status(201).json(savedNote);
	} catch (exception) {
		next(exception);
	}
});
```

El bloque `catch` solamente llama a la función `next`, la que pasa el manejo de la solicitud al middle-ware que maneja los errores.

Tras hacer el cambio todas las pruebas volverán a funcionar. Lo siguiente es crear pruebas para obtener y eliminar una sola nota:

```ts
test("a specific note can be viewed", async () => {
	const notesAtStart = await helper.notesInDb();

	const noteToView = notesAtStart[0];

	const resultNote = await api
		.get(`/api/notes${notesToView.id}`)
		.expect(200)
		.expect("Content-Type", /application\/json/);

	expect(resultNote.body).toEqual(noteToView);
});

test("a note can be deleted", async () => {
	const notesAtStart = await helper.notesInDb();
	const noteToDelete = notesAtStart[0];

	await api
		.delete(`/api/notes/${noteToDelete.id}`)
		.expect(204);

	const notesAtEnd = await helper.notesInDb();

	expect(notesAtEnd).toHaveLength(
		helper.initialNotes.length - 1
	);

	const contents = notesAtEnd.map(r => r.content);

	expect(content).not.toContain(noteToDelete.content);
});
```

Las dos pruebas comparten una estructura similar. En la fase inicial ambas piden una nota a la base de datos, tras lo cual se llama a la operación que está siendo probada. Por último, la prueba verifica que la salida de la operación sea la que se espera.

Las pruebas son exitosas y ahora es posible refactorizar las rutas probadas para que usen `async/await`:

```ts
notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  } catch(exception) {
    next(exception);
  }
});

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch(exception) {
    next(exception);
  }
});
```

# Eliminando `try/catch`

Si bien `async/await` hace que el código sea más claro el precio a pagar es tener que usar `try/catch` para manejar las excepciones, por lo que todos los route handler usarán la misma estructura:

```ts
try {
	// do async operations here
} catch (exception) {
	next(exception);
}
```

Por lo que es común preguntarse si existe alguna forma de eliminar estos bloques. Esto se puede hacer mediante la librería [express-async-errors](https://github.com/davidbanham/express-async-errors) que se puede instalar de la siguiente manera:

```sh
npm install express-async-errors
```

Para usar esta librería se debe de importar antes que las rutas:

```ts
const config = require('./utils/config')
const express = require('express')

require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// ...

module.exports = app
```

La librería nos permite eliminar todos los bloques `try/catch`, por lo que en lugar del siguiente código:

```ts
notesRouter.delete("/:id", async (request, response, next) => {
	try {
		await Note.findByIdAndDelete(request.params.id);
		respose.status(204).end();
	} catch (exception) {
		next(exception);
	}
})
```

Quedaría código como el siguiente:

```ts
notesRouter.delete("/:id", async (request, response) => {
	await Note.findByIdAndDelete(request.params.id);
	response.status(204).end();
});
```

Gracias a la librería no es necesario usar `next(exception)` pues esta se encarga de manejar los errores bajo el radar. Si una excepción ocurre en una ruta `async` la ejecución se pasa automáticamente a el middleware que maneja los errores.

# Optimizando la función `beforeEach`

Esta vez hay que revisar la función `beforeEach` que configura cada prueba:

```ts
beforeEach(async () => {
	await Note.deleteMany({});

	let noteObject = new Note(helper.initialNotes[0]);
	await noteObject.save();

	noteObject = new Note(helper.initialNotes[1]);
	await noteObject.save();
});
```

La función guarda las primeras dos notas de `helper.initialNotes` en la base de datos usando dos operaciones separadas. Si bien la solución es correcta, existe una mejor forma de realizar esta operación, esto es, guardar varias notas a la vez:

```ts
beforeEach(async () => {
	await Note.deleteMany({});
	console.log("cleared");

	helper.initialNotes.forEach(async note => {
		let noteObject = new Note(note);
		await noteObject.save();
		console.log("note saved");
	});

	console.log("done");
});
```

De esta forma se usa la función dentro de `.forEach()` para cada nota del array, sin embargo, las pruebas no funcionan. Esto se debe a que el método los comandos `await` no se encuentran en el contexto de `beforeEach` sino dentro del método `.forEach()`, así `beforeEach` no espera a que terminen.

Dado que la ejecución de las pruebas inicia inmediatamente después de que `beforeEach` termina su ejecución la ejecución de las pruebas inicia antes de que la base de datos haya sido inicializada.

Una forma de resolver esto es esperar a que todas las funciones asíncronas se terminen usando el método `Promise.all()`:

```ts
beforeEach(async () => {
	await Note.deleteMany({});

	const notes = helper.initialNotes
		.map(note => new Note(note));

	const promiseArray = notes.map(note => note.save());
	await Promise.all(promiseArray);
});
```

La variable  `note` contiene un array con objetos de Mongoose que se crearon usando el constructor `Note` para cada nota de `helper.initialNotes` y la siguiente línea crea un array de promesas usando el método `save` para cada elemento del array `notes`. En otras palabras, es un array de promesas para guardar cada nota en la base de datos.

El método [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) puede ser usado para transformar un array de promesas en una sola promesa que será *completada* (fulfilled) una vez que cada promesa en el array pasado como parámetro sea resuelta.

La última línea del código espera hasta que cada promesa se termine, lo que significa que la base de datos ha sido configurada.

> El método `Promise.all` permite tener disponibles los resultados devueltos por cada promesa.
> En este ejemplo `const results = await Promise.all(promiseArray)` la variable `results` contiene un array con los resultados de cada promesa y aparecerán en el mismo orden que las promesas del array.
