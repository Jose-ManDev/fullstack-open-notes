# Estructura del proyecto

Antes de moverse al testing es necesario modificar la estructura del proyecto para adherirse a las mejores prácticas de Node.js. Una vez realizados los cambios el proyecto debe verse de la siguiente manera:

```txt
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
```

Si bien hasta el momento se ha usado `console.log` y `console.error` para imprimir diferente información en la consola, esto no es una buena práctica. Para ello es mejor separar todas las impresiones de la consola a su propio módulo en *utils/logger.ts*:

```ts
const info = (...params) => {
	console.log(...params);
};

const error = (...params) => {
	console.error(...params);
};

export default { info, error }
```

El logger tiene dos funciones, `info` para imprimir mensajes normales del registro y `error` para imprimir todos los mensajes de error.

El extraer el registro en su propio módulo es una buena idea en más de una forma. Si queremos comenzar a escribir registros en un archivo o enviarlos a un servicio externo de registro como [graylog](https://www.graylog.org/) o [papertrail](https://papertrailapp.com/) solo tenemos que hacer cambios en un único lugar.

El contenido de *index.ts* usado para iniciar la aplicación se simplifica como sigue:

```ts
const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`);
});
```

El archivo *index.ts* solo importa la aplicación real del archivo *app.ts* y entonces la ejecuta. La función `info` del módulo logger es usada por la consola para mostrar que la aplicación está corriendo.

Ahora la aplicación de Express y el código del servidor web están separados siguiendo las [buenas prácticas](https://dev.to/nermineslimane/always-separate-app-and-server-files--1nc7). Una de las ventajas de este método es que ahora se puede probar la aplicación al nivel de llamadas HTTP API sin tener que hacer las llamadas realmente a través de la red, esto hace la ejecución de las pruebas más rápido.

El manejo de las variables de entorno también se extrae en un archivo separado, *utils/config.ts*:

```ts
require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

export { MONGODB_URI, PORT };
```

De esta forma las otras partes de la aplicación pueden acceder a las variables de entorno al importar el módulo:

```ts
const config = require("./utils/config");

logger.info(`Server running on port ${config.PORT}`);
```

Los route handlers también se han movido a su propio módulo dedicado. Los event handlers de las rutas son llamado comúnmente *controladores* y, por esta razón, se ha creado un directorio aparte para ellos. Todas las rutas relacionadas a las notas ahora se encuentran en el archivo *notes.ts* dentro del directorio *controllers*. El contenido de este archivo es el siguiente:

```ts
const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", (request, response) => {
	Note.find({}).then(notes => {
		response.json(notes);
	});
});

notesRouter.get("/:id", (request, response, next) => {
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

notesRouter.post("/", (request, response, next) => {
	const body = request.body;
	const note = new Note({
		content: body.content,
		important: body.important || false;
	});

	note.save()
		.then(savedNote => {
			response.json(savedNote);
		})
		.catch(error => next());
});

notesRouter.delete("/:id", (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

notesRouter.put("/:id", (request, response, next) => {
	const body = request.body;
	const note = {
		content: body.content,
		important: body.important
	};

	Note.findByIdAndUpdate(request.params.id, note, { new: true })
		.then(updatedNote => {
			response.json(updatedNote);
		})
		.catch(error => next(error));
});

export default notesRouter;
```

Esto es casi igual a lo que se tenía en el archivo *index.ts* con una excepción, se creó al inicio un objeto [router](http://expressjs.com/en/api.html#router):

```ts
const notesRouter = require("express").Router();
```

El módulo exporta el router para que esté disponible para todos los consumidores del módulo.

Todas las rutas son definidas en el objeto router de la misma forma que se hizo antes en el objeto que representa a toda la aplicación. Es importante igualmente notar que las rutas se han acortado, en la versión previa se tenía:

```ts
app.delete("/api/notes/:id", (request, response, next) => {
	// ...
});
```

Mientras que en la versión actual se tiene:

```ts
notesRouter.delete("/:id", (request, response, next) => {
	// ...
});
```

Esto es debido al objeto router. Según Express:

> Un objeto router es una instancia aislada de un middleware y sus rutas. Se puede pensar en ello como una "mini aplicación" que solo es capaz de realizar funciones de middleware y enrutamiento. Cada aplicación de Express tiene un router de la aplicación incorporado.

El router es un middleware que puede ser usado para definir "rutas relacionadas" en un solo lugar, el cual está comúnmente puesto en su propio módulo.

El archivo *app.ts* que crea la aplicación toma este router y lo usa de la siguiente manera:

```ts
const notesRouter = require("./controllers/notes");

app.use("/api/notes", notesRouter);
```

De esta forma el router que se ha definido es utilizado si la URL de la petición empieza con */api/notes*. Por esta razón el objeto `notesRouter` debe definir las URL como rutas relativas, es decir, la ruta vacía `/` o solo el parámetro `/:id`.

Tras hacer estos cambios el archivo *app.ts* se ve de la siguiente forma:

```ts
const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("Connecting to", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info("Connected to MongoDB");
	})
	.catch(error => {
		logger.error("Error connecting to MongoDB", error.message);
	});

app.use(cors);
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
```

El archivo usa diferentes middleware, uno de estos es `notesRouter`. Se puede notar que también se han movido los middleware personalizados a su propio módulo dentro de *utils/middleware.ts*:

```ts
const logger = require("./logger");

const requestLogger = (request, response, next) => {
	logger.info("Method: ", request.method);
	logger.info("Path: ", request.path);
	logger.info("Body: ", request.body);
	logger.info("---");
	next();
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint"});
};

const errorHandler = (error, request, response, next) => {
	logger.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformed id"});
	}

	if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

module.export = {
	requestLogger,
	unkwnownEndpoint,
	errorHandler
};
```

La responsabilidad de establecer la conexión  con la base de datos se ha puesto en el módulo *app.ts*. El archivo *note.ts* dentro del directorio *models* solo define el esquema de Mongoose para las notas:

```ts
const mogoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
		minlength: 5
	},
	important: Boolean
});

noteSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model("Note", noteSchema);
```

En aplicaciones pequeñas la estructura no importa mucho, sin embargo, una vez que la aplicación comienza a crecer en tamaño se tiene que establecer una estructura y separar las diferentes responsabilidades de la aplicación en módulos separados, esto hará que desarrollar la aplicación sea más fácil.

No existe una estructura de directorios específica o una convención para nombras archivos al usar Express, en cambio, Ruby on Rails sí require una estructura específica.

# Nota sobre los exports

En esta parte se han usado dos tipos de export. El primero es usado en el archivo *logger.ts* donde se pone lo siguiente:

```ts
// ...
module.exports = {
	info, error
}
```

El archivo exporta un *objeto* que tiene dos campos, de los cuales ambos son funciones. Las funciones pueden usarse en dos maneras diferentes, la primera es importar el objeto completo y referirse a las funciones usando la notación de punto:

```ts
const logger = require("./utils/logger");

logger.info("message");
logger.error("error message");
```

La otra opción es destructurar las funciones en sus propias variables en la importación:

```ts
const { info, error } = require("./utils/logger");

info("message");
error("error message");
```

La segunda forma de exportar es preferible cuando sola una pequeña cantidad de las funciones exportadas son usadas en el archivo. Esta se ve en el archivo *notes.ts*:

```ts
// ...
module.exports = notesRouter
```

En este caso solo existe una cosa que exportar, por lo que la única forma de usarla es la siguiente:

```ts
const notesRouter = require("./controllers/notes");

app.use("/api/notes", notesRouter);
```

Ahora la exportación se asigna a una variable y es usada como tal.

# Probando aplicaciones de Node