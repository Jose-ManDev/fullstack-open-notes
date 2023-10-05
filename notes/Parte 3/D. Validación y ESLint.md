Usualmente existen ciertas restricciones que se quieren aplicar a los datos guardados dentro de la base de datos de la aplicación. Por ejemplo, la aplicación no debe de aceptar notas que no poseen o poseen una propiedad `content` vacía. Para esto sea realiza la validación de la nota en el route handler:

```ts
app.post("/api/notes", (request, response) => {
	const body = request.body;
	if (body.content === undefined) {
		return response.status(404).json({ error: "content missing" });
	}
});
```

Si la nota no tiene la propiedad `content` se responde a la petición con el código de estado *400 bad request*.

Otra forma inteligente de validar el formato de los datos antes de enviarlos a la base de datos es utilizar la funcionalidad de [validación](https://mongoosejs.com/docs/validation.html) disponible en Mongoose.

Para esto se especifican las reglas de validación para cada campo del esquema:

```ts
const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minLength: 5,
		required: true
	},
	important: Boolean
});
```

De esta forma el campo `content` ahora require ser de al menos cinco caracteres de longitud y está configurado como requerido. Ya que no se han agregado restricciones a la definición de `important` su definición no ha cambiado en el esquema.

Si intentamos almacenar un objeto en la base de datos que rompa alguna de las restricciones la operación lanzará un error. Por esto de debe cambiar el handler de tal forma que  pase los potenciales errores de la creación de una nota al error handler middleware.

```ts
app.post("/api/notes", (request, response, next) => {
	const body = request.body;

	const note = new Note({
		content: body.content,
		important: body.important || false
	});

	note.save()
		.then(saveNote => {
			response.json(savedNote)
		})
		.catch(error => next(error));
});
```

También se debe expandir el error handler para lidiar con estos errores de validación:

```ts
const errorHandler = (error, request, response, next) => {
	console.error(error);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformed id"});
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};
```

Esto hace que cuando la validación de un objeto falla se envíe el siguiente mensaje de error:

![[Pasted image 20231002211439.png]]

Sin embargo, esto muestra un nuevo problema, las validaciones no son hechas por defecto al editar una nota. Esto se debe a que las validaciones no son realizadas por defecto cuando se ejecuta `findOneAndUpdate`. Esto se puede solucionar fácilmente:

```ts
app.put("/api/notes", (request, response, next) => {
	const { content, important } = request.body;

	Note.findOneAndUpdate({
		request.params.id,
		{ content, important },
		{ 
			new: true,
			runValidators: true,
			context: "query"
		}
	})
		.then(updatedNote => {
			response.json(updatedNote));
		})
		.catch(error => next(error));
});
```

# Lanzando el back-end de la base de datos a producción

La aplicación debe funcionar tanto en Fly.io como en Render, para esto no es necesario generar una nueva copia del front-end pues los cambios realizados se han hecho solo al back-end.

Dado que las variables de entorno definidas en *.dotenv* solo serán usadas cuando el back-end no esté en producción. Para producción tenemos que configurar la URL de la base de datos en el servicio que esté alojando la aplicación.

En Fly.io esto es hecho fácilmente usando `fly secrets set`:

```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

Cuando la aplicación es desarrollada es más que posible que algo falle, por ejemplo, que al ser la primera vez que la aplicación sea lanzada con la base de datos no se muestre ninguna nota:

![[Pasted image 20231004141107.png]]

Al observar la consola del navegador podemos ver que la búsqueda de las notas falló pues la solicitud estuvo por un largo tiempo como `pending` hasta que falló con el código de estado 502.

Al observar el registro del servidor el problema se hace obvio:

![[Pasted image 20231004141521.png]]

La URL de la base de datos es `undefined`, por lo que se debió olvidar de usar el comando `fly secrets set MONGODB_URI`.

Al usar Render, la URL de la base de datos se debe definir como una propiedad del por el mismo desarrollador en el panel:

![[Pasted image 20231004141721.png]]

El panel de Render muestra los registros del servidor:

![[Pasted image 20231004141743.png]]
