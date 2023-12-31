# Depurando aplicaciones de Node

Depurar aplicaciones de Node es más difícil que depurar aplicaciones de JavaScript en el navegador donde se suele imprimir en la consola para ver que todo esté funcionando bien.

## Visual Studio Code
El depurador de Visual Studio Code puede ser útil en algunas situaciones. Se puede lanzar una aplicación en modo depuración de la siguiente manera: `Run > Start Debugging` o usando la tecla `F5`.

![[Pasted image 20230912215003.png]]

Para esto la aplicación no debe de estarse ejecutando en otra consola, sino el puerto estará ya en uso.

> Las nuevas versiones de VS Code pueden decir `Debug` en lugar de `Run`, además, se debe configurar `launch.json` para iniciar la depuración. Esto se puede hacer escogiendo `Add configuration...` en el menú y seleccionando `Run "npm start" in a debug terminal`.

Abajo se puede observar una captura de pantalla de un código en ejecución que ha sido pausado en medio de guardar una nota:

![[Pasted image 20230912215517.png]]

La ejecución se detuvo en el *break-point* (punto de interrupción) en la línea 69. En la consola se puede observar el valor de la variable `note`. Mientras que en la ventana superior izquierda se puede observar cosas relacionadas al estado de la aplicación.

Las flechas en lo alto de la pantalla pueden ser usadas para controlar el flujo del depurador.

## Chrome dev tools

Es posible depurar en la consola de desarrollador de Chrome al iniciar la aplicación con el comando:

```bash
node --inspect index.js
```

Se puede acceder al depurador al hacer click en el icono verde (el logo de Node) que aparece en la consola de desarrollador de Chrome:

![[Pasted image 20230912220116.png]]

Esta funciona de la misma manera que lo hace con las aplicaciones de React. La pestaña *Sources* puede ser usada para configurar los break-points donde la ejecución del código se detendrá.

![[Pasted image 20230912220235.png]]

Igualmente, todos los mensajes de `console.log` en la aplicación aparecerán en el depurador en la pestaña *Console*, donde también se puede inspeccionar el valor de las variables y ejecutar código de JavaScript propio.

![[Pasted image 20230912220422.png]]

## Cuestiona todo

Cuando una aplicación no funciona se debe primero se debe pensar en por qué el problema sucede. Es común que el problema se encuentre en lugares donde uno nunca se lo espera, lo que provoca que pasen minutos, horas o incluso días antes de poder solucionarlo.

La clave es ser sistemático. Ya que el problema puede existir en cualquier lado, **se debe cuestionar todo**, y eliminar las posibilidades una por una. El imprimir en la consola y usar Postman o depuradores puede ayudar.

Cuando un bug sucede, *la peor de las estrategias posibles* es seguir escribiendo código. Esto garantiza que el código tendrá más bugs en el futuro y depurarlos será incluso más difícil. El principio [stop and fix](https://leanscape.io/principles-of-lean-13-jidoka/) de Toyota Production Systems es muy efectivo en este tipo de situaciones.

# MongoDB

Para almacenar y guardar notas indefinidamente se necesita una base de datos. Si bien se suelen usar bases de datos relacionales, en este caso se usará MongoDB, una [base de datos de documentos](https://en.wikipedia.org/wiki/Document-oriented_database).

Las bases de datos de documentos difieren de las bases de datos relacionales en el cómo organizan los datos además de los lenguajes de consulta que soportan. Las bases de datos de documentos suelen ser clasificadas bajo el término de [NoSQL](https://en.wikipedia.org/wiki/NoSQL).

Tras crear el cluster dentro de MongoDB Atlas se este nos generará una dirección como la siguiente:

```
mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority
```

Si bien se puede usar la base de datos directamente con la librería de JavaScript oficial de MongoDB en este caso se usará [Mongoose](http://mongoosejs.com/index.html), que ofrece una API de alto nivel.

Mongoose se puede describir como un *mapeador de documentos de objetos* (ODM, object document mapper) que permite guardar objectos de JavaScript como objetos de Mongo de forma fácil.

Para instalarlo solo debemos ejecutar el siguiente comando:

```bash
npm install mongoose
```

Comencemos por crear una aplicación simple en el archivo *mongo.js*:

```ts
const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("Give password as document");
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}$@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
	content: "HTML is easy",
	important: true,
});

note.save().then(result => {
	console.log("Note saved!");
	mongoose.connection.close();
});
```

El código asume que la contraseña se ha pasado como un argumento como un parámetro de la línea de parámetros. Se accede a ese parámetro de la siguiente forma:

```ts
const password = process.argv[2];
```

Cuando el código es ejecutado usando el comando `node mongo.js <password>`, Mongo agregará un nuevo documento a la base de datos.

Se puede ver el estado actual de la base de datos en MongoDB usando la opción *Browse collections* en la pestaña Database.

![[Pasted image 20230913190053.png]]

Como nos indica la página, podemos ver que se ha agregado un documento igual a la nota que se ha creado dentro de la colección *notes* en la base de datos:

![[Pasted image 20230913190826.png]]

# Schema

Tras establecer la conexión con la base de datos se define el [esquema](http://mongoosejs.com/docs/guide.html) (schema) para la nota y el [modelo](http://mongoosejs.com/docs/models.html) coincidente:

```ts
const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);
```

Primero se define el schema de una nota y se guarda en la variable `noteSchema`. El schema le dice a Mongoose como se deben guardar los objectos de nota en la base de dato.

En la definición del modelo `Note`, el primer parámetro es el nombre en singular del modelo, ya que el nombre de la colección será plural en minúsculas, *notes*, ya que la convención de Mongoose es nombrar automáticamente las colecciones en plural cuando el schema se refiera ellas en singular.

Las bases de datos de documentos como MongoDB son *schemaless*, esto es, la base de datos en sí misma no se preocupa de la estructura de los datos almacenados en ella. Es posible guardar documentos con campos completamente diferentes en la misma colección.

La idea detrás de MongoDB es que a los datos almacenados en la base de datos se les de un *schema al nivel de la aplicación* que defina la forma de los documentos almacenados en cualquier colección dada.

# Creando y guardando objetos

A continuación, la aplicación crea un nuevo objeto de nota con la ayuda del modelo *Note*:

```ts
const note = new Note({
	content: "HTML is easy",
	important: false,
});
```

Los modelos son las llamadas *funciones constructoras* que crean nuevos objetos de JavaScript basándose en los parámetros dados. Dados que los objetos son creados con la función constructora del modelo tienen todas las propiedades del modelo que incluyen métodos para guardar el objeto en la base de datos.

Para guardar el objeto en la base de datos se debe llamar el método `save`, al cual se le puede pasar un event handler con el método `then`:

```ts
note.save().then(result => {
	console.log("Note saved!");
	mongoose.connection.close();
});
```

Cuando el objeto es guardado en la base de datos, el event handler pasado a `then` es llamado. Este event handler cierra la conexión a la base de datos con el comando `mongoose.connection.close()`. Si la conexión no es cerrada el programa jamás terminará su ejecución.

El resultado de la operación de guardado se encuentra en el parámetro `result` del event handler, el resultado no suele ser interesante cuando se está guardando algo en la base de datos, pero en caso de querer verse se puede imprimir usando `console.log()`.

# Recuperando objetos desde la base de datos

El código para crear nuevas notas se cambiará por el siguiente:

```ts
Note.find({}).then(result => {
	result.forEach(note => {
		console.log(note);
	});

	mongoose.connection.close();
});
```

Esto hace que cuando la aplicación sea ejecutada imprima todas las notas guardadas en la base de datos:

![[Pasted image 20230916234411.png]]

Los objetos son obtenidos desde la base de datos al usar el método [`find`](https://mongoosejs.com/docs/api/model.html#model_Model-find) del modelo `Note`. El parámetro del método  `find` es un objeto que expresa las condiciones de búsqueda. Dado que se le ha pasado un objeto vacío `{}` se obtienen todas las notas guardadas en la colección `notes`.

Las condiciones de búsqueda se adhieren a la [sintaxis](https://docs.mongodb.com/manual/reference/operator/) de consultas de búsqueda de MongoDB. Este es un ejemplo de como restringir la búsqueda a solo las notas importantes:

```ts
Note.find({ important: true }).then(result => {
	// ...
});
```

# Conectando el back-end con la base de datos

Para comenzar se puede copiar las definiciones de Mongoose al archivo *index.js*:

```ts
const mongoose = require("mongoose");

const url = `mongodb+srv://fullstack:${password}$@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean
});

const Note = mongoose.model("Note", noteSchema);
```

Se puede cambiar el handler para obtener todas las notas de la siguiente manera:

```ts
app.get("/api/notes", (request, response) => {
	Note.find({}).then(notes => {
		response.json(notes);
	});
});
```

Se puede verificar que funcione al visitar la URL en el navegador:

![[Pasted image 20230927001126.png]]

Se puede ver que la aplicación funciona casi perfectamente, ya que el front-end asume que todos los objetos tienen una propiedad *id* única, además, no es necesario regresar el campo de versión `__v` al front-end.

Una forma de modificar los objetos que enviamos al front-end es modificando el método `toJSON` del esquema, el cual es usado en todas las instancias de los modelos creados por el esquema.

Para modificar el método se necesita cambiar las opciones de configuración del esquema, estas pueden ser cambiadas usando el método `set` del esquema:

```ts
noteSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});
```

Se puede encontrar más información en los siguientes enlaces:

| Tema                | Link                                                            |
| ------------------- | --------------------------------------------------------------- |
| Opciones de Schema  | https://mongoosejs.com/docs/guide.html#options                  |
| Método `toJSON`     | https://mongoosejs.com/docs/guide.html#toJSON                   |
| Método `toObject`   | https://mongoosejs.com/docs/api.html#document_Document-toObject |
| Función `transform` | https://mongoosejs.com/docs/api/document.html#transform         | 

Aún cuando la propiedad `_id` luce como una string, en realidad es un objeto. El método `toJSON` que se ha definido lo transforma en un string solo para estar seguros. Si no se hace esto se pueden producir más problemas después a la hora de escribir tests. Al cambiar el objeto que se envía al front-end usando el método `set` no es necesario hacer cambios al handler.

# Configurando la base de datos en su propio módulo

Antes de refactorizar todo el código del back-end para usar la base de datos se debe extraer todo el código específico de Mongoose en su propio módulo. Para esto se crea un nuevo directorio llamado *models* y se añade un archivo llamado *note.ts*:

```ts
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log("Connecting to", url);

mongoose.connect(url)
	.then(result => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.log("Error connecting to MongoDB:", error.message);
	});

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean
});

noteSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model("Note", noteSchema);
```

Definir módulos en Node es ligeramente diferente a definir módulos ES6.

La interfaz pública es definida al dar un valor a la variable `module.exports`. Se fija su valor para ser el modelo  `Note`, las otras cosas definidas dentro del módulo, como las variables `mongoose` y `url` no serán accesibles o visibles para los usuarios del módulo. Se puede importar el módulo usando:

```ts
const Note = require("./models/note");
```

De esta forma la variable `Note` será asignada al mismo objeto que el módulo define. De igual forma, la forma en que la conexión es realizada ha cambiado ligeramente:

```ts
const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose.connect(url)
	.then(result => {
		console.log("Connected to MongoDB");
	})
	.catch(error => {
		console.log("Error connecting to MongoDB", error.message);
	});
```

No es una buena idea el codificar la dirección de la base de datos en el código, por lo que en lugar de hacerlo la dirección de la base de datos es pasada a través de la variable de entorno `MONGODB_URI`.

El método para establecer la conexión tiene ahora métodos para lidiar con intentos de conexión exitosos y fallidos. En ambos casos las funciones solo imprimen un mensaje en la consola mostrando el estado del intento:

![[Pasted image 20230927154634.png]]

Existen varias formas de definir el valor de una variable de entorno. Una de ellas es definir esta cuando la aplicación es iniciada:

```bash
MONGODB_URI=address_here npm run dev
```

Otra forma más sofisticada es usar la librería [dotenv](https://github.com/motdotla/dotenv#readme) que se puede instalar con el comando:

```bash
npm install dotenv
```

Para usar esta librería se crea un archivo *.env* en la raíz del proyecto. Dentro de esta se definen las variables de entorno que pueden lucir de la siguiente manera:

```bash
MONGODB_URI="mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority"
PORT=3001
```

De esta forma se puede incluso codificar la variable `PORT`. El archivo *.env* debe ser ignorado con el fin de evitar publicar alguna información confidencial en línea, para ello se puede modificar el archivo *.gitignore* agregando este a la lista:

![[Pasted image 20230927155307.png]]

Para usar las variables de entorno dentro del archivo *.env* se usa la expresión `require("dotenv").config()` y se pueden referenciar como se haría con cualquier otra variable de entorno:

```ts
require("dotenv").config();

const express = require("express");
const app = express();
const Note = require("./models/note");

// ...

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
```

Es importante que *dotenv* se importe antes que el modelo de `Note` sea importado, esto asegura que las variables de entorno de *.env* estén disponibles de forma global antes de que el código de otros módulos sea importado.

# Nota importante para los usuarios de Fly.io

Dado que Fly.io no usa GitHub el archivo *.env* será subido a los servidores cuando la aplicación sea lanzada, debido a esto las variables de entorno definidas en este estarán disponibles ahí.

Para evitar esto se puede crear un archivo *.dockerignore* con el siguiente contenido:

```.gitignore
.env
```

Y fijar el valor de la variable de entorno usando el siguiente comando:

```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

Dado que el puerto también se define usando el archivo *.env*, es necesario ignorar este archivo, sino la aplicación iniciará en el puerto equivocado.

Cuando se usa Render, la URL de la base de datos es dada al definir una propiedad de entorno en el panel:

![[Pasted image 20230927163613.png]]

# Usando la base de datos en los handlers de rutas

Lo siguiente es cambiar el resto de las rutas del back-end para usar la base de datos. Se puede crear una nueva nota de la siguiente manera:

```ts
app.post("/api/notes", (request, response) => {
	const body = request.body;
	
	if (body.content === undefined) {
		return response.status(400).json({ error: "content missing" });
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
	});

	note.save().then(savedNote => {
		response.json(savedNote);
	});
});
```

Los objetos `note` son creados usando la función constructora `Note`. La respuesta es enviada dentro de una función callback de la operación `save`. Esto asegura que la respuesta sea enviada solo si la operación ha sido un éxito.

El parámetro `savedNote` en la función callback es la nota recién creada y guardada. Los datos enviados de regreso en la respuesta están formateados automáticamente con el método `toJSON`:

```ts
response.json(savedNote);
```

Al usar el método de Mongoose [`findById`](https://mongoosejs.com/docs/api/model.html#model_Model-findById) para buscar una sola nota se puede cambiar el handler de la siguiente manera:

```ts
app.get("/api/notes/:id", (request, response) => {
	Note.findById(request.params.id).then(note => {
		response.json(note);
	});
});
```

# Manejo de errores

Si queremos visitar la URL de una nota que no existe, la respuesta será `null`. Para cambiar este comportamiento solo se debe agregar un bloque que se encargue de que el servidor responda con un error 404 cuando el elemento buscado no exista, además, se agregará un bloque `catch` que se encargue de los casos donde la promesa regresada por `finById` sea rechazada:

```ts
app.get("/api/notes/:id", (request, response) => {
	Note.findById(request.params.id)
		.then(note => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch(error => {
			console.log(error);
			response.status(500).end();
		});
});
```

Cuando ninguna nota corresponde con la información buscada, `note` es `null`, por lo que el bloque `else` es ejecutado y el servidor responde con el código de estado *404 not found*. Si la promesa regresada por `findById` es rechazada, la respuesta tendrá el código de estado *500 internal server error*. La consola mostrará más información al respecto.

Existe un último error que se debe de manejar, este es, cuando la id no coincide con el formato de identificadores de MongoDB. Si hacemos una solicitud a la URL `/api/notes/someInvalidId` se nos mostrará el siguiente mensaje:

```
Method: GET
Path:   /api/notes/someInvalidId
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "someInvalidId" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
```

Al usar una id con mal formato la promesa será rechazada, lo que provocará que el bloque `catch` sea ejecutando informando que este es un error interno del servidor. Para evitar esto se puede realizar la siguiente modificación:

```ts
app.get("/api/notes/:id", (request, response) => {
	Note.findById(request.params.id)
		.then(note => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch(error => {
			console.log(error);
			response.status(400).send({ error: "malformed id" });
		});
});
```

De esta forma si la petición es rechazada debido a un formato inválido de id se ejecutará el código dentro del bloque catch y lanzará el código de estado *400 Bad Request*, que es el correcto para este tipo de situaciones:

> La solicitud podría no ser entendida por el servidor debido a una sintaxis mal formulada. El cliente NO DEBERÍA repetir la solicitud sin modificaciones.

También se agregó información para aclarar la causa del error.

Cuando se trabaja con promesas es casi siempre una buena idea el agregar un manejo de errores y excepciones, de otra forma, uno se la pasará lidiando con bug extraños. También es buena idea imprimir el objeto que causó el error en la consola:

```ts
.catch(error => {
	console.log(error);
	// ...
});
```

Ya que la razón por la que el error handler sea llamado puede ser una completamente diferente a la esperada, es necesario imprimir el mensaje en la consola. De esta forma uno se puede librar de muchas horas de frustrantes sesiones de depuración.

# Moviendo el manejo de errores a un middleware

Hasta el momento el código que se encarga de manejar los errores está escrito con el resto del código. Si bien esto puede ser una solución razonable algunas veces, hay muchos casos donde es necesario implementar todo el manejo de errores en un solo lugar. Esto es especialmente útil si se quieren reportar todos los datos relacionados a los errores a un sistema de seguimiento de errores externo como Sentry.

Para ello se cambiará el handler de la ruta `/api/notes/:id` tal que pase el error a la función `next`. La siguiente función es pasada al handler como un tercer parámetro:

```ts
app.get("/api/notes/:id", (request, response, next) => {
	Note.findById(request.params.id)
		.then(note => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch(error => next(error));
});
```

El error es pasado ala función `next` como un parámetro. Si `next` es llamada sin un parámetro la ejecución se moverá a la siguiente ruta o middleware. Si la función `next` es llamada con un parámetro, la ejecución continuará al *error handler middleware*.

Los [error handlers](https://expressjs.com/en/guide/error-handling.html) de Express son middlewares que son definidos como una función que acepta cuatro parámetros. El error handler luce de la siguiente manera:

```ts
const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformed id" });
	}

	next(error);
};

app.use(errorHandler);
```

El error handler revisa si el error es una excepción *CastError*, en cuyo caso sabemos que fue producido por una id de objeto inválida de MongoDB, por lo que el servidor enviará una respuesta al navegador con el objeto de respuesta pasado como un parámetro. En todos los demás errores el middleware pase el error al error handler predeterminado de Express.

Es importante ver que el error handler middleware debe ser el último middleware que sea cargado.

# El orden de carga de los middlewares

El orden de ejecución de los middleware es el mismo que el orden en que son cargados en Express con la función `app.use()`. Por esta razón es importante el ser cuidadosos al definir un middleware. El orden correcto es el siguiente:

```ts
app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);

app.post("/api/notes", (request, response) => {
	const body = request.body;
	// ...
});

// Maneja las peticiones con una ruta desconocida
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unkwnown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	// ...
};

	// Maneja las peticiones que resultan en errores
app.use(errorHandler);
```

El middleware json-parser debe estar entre los primeros middlewares cargados en Express, si el orden fuese como así:

```ts
app.use(requestLogger); // request.body es undefined

app.post("/api/notes", (request, response) => {
	const body = request.body; // request.body es undefined
	// ...
});

app.use(express.json());
```

Los datos JSON enviados con la petición HTTP no estarían disponibles para el logger middleware o el POST route handler, ya que `request.body` sería `undefined` en este punto.

Es importante también que el middleware que se encarga de manejar las rutas no soportadas esté al lado del último middleware cargado en Express, justo antes del que se encarga de manejar los errores.

# Otras operaciones

Lo siguiente es agregar a la base de datos una funcionalidad para eliminar notas usando la base de datos. Esto se puede lograr al usar el método [`finByIdAndDelete`](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndRemove):

```ts
app.delete("/api/notes/:id", (request, response, next) => {
	Note.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end();
		})
		.catch(error => next(error));
});
```

En los dos casos donde se elimine con "éxito" un recurso el servidor responderá con el código de estado *204 no content*, estos dos casos son: eliminar una nota que existe y eliminar una nota que no existe. El parámetro del callback `result` puede ser usado para saber si un recurso fue eliminado realmente y podemos usar esta información para regresar códigos de estado diferentes para ambos casos si pensamos que es necesario.

El caso de cambiar la importancia de una nota puede ser hecho mediante el método `findByIdAndUpdate`:

```ts
app.put("/api/notes/:id", (request, response) => {
	const body = request.body;

	const note = {
		content: body.content,
		important: body.important;
	};

	Note.findByIdAndUpdate(request.params.id, note, { new: true })
		.then(updatedNote => {
			response.json(updatedNote);
		})
		.catch(error => next(error));
});
```

En el código de arriba también se permite editar el contenido de la nota.

Como se puede ver, el método `findByIdAndUpdate` recibe un objeto regular de JavaScript, no uno creado con el constructor de la función `Note`.

Por defecto, el método `findByIdAndUpdate` recibe en el parámetro `updatedNote` de su event handler el documento original [SIN MODIFICACIONES](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate). Al agregar  el parámetro opcional `{ new: true }` se permite que el método sea llamado con el documento modificado en lugar del original.