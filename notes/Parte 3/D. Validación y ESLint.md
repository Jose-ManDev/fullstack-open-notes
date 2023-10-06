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

# Lint

Antes de la siguiente parte, se debe hablar de una herramienta muy importante llamada [lint](https://en.wikipedia.org/wiki/Lint_(software)). Wikipedia dice lo siguiente de lint:

> Generalmente, un lint o linter es cualquier herramienta que detecta y marca errores en los lenguajes de programación, incluyendo los errores de estilo. El término "lint-like behavior"  es aplicado a veces al proceso de marcar usos sospechosos de un lenguaje. Las herramientas "lint-like" generalmente realizan un análisis sintáctico del código fuente.

En lenguajes compilados de tipado estático como Java, los IDEs como NetBeans pueden indicar errores de código, incluso aquellos que son algo más que errores de compilación, aunque se pueden usar herramientas para realizar un [análisis estático](https://en.wikipedia.org/wiki/Static_program_analysis) como [analizar el estilo](https://checkstyle.sourceforge.io/) para expandir las capacidades del IDE para también indicar problemas relacionados al estilo como la indentación.

En el universo de JavaScript, la herramienta más utilizada para el análisis estático de código es (linting) es ESLint.

Para instalar ESLint como una dependencia de desarrollo en el proyecto del back-end se puede ejecutar el siguiente comando:

```sh
npm install eslint --save-dev
```

Tras esto podemos iniciar la configuración predeterminada de ESLint con el comando:

```sh
npx eslint --init
```

Tras responder a unas cuantas preguntas la configuración será guardada en el archivo *.eslintrc.js* y se verá más o menos así:

```ts
module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,

        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}
```

Podemos cambiar aquí las reglas, por ejemplo, cambiar la indentación de cuatro espacios a solo dos:

```ts
"indent": [
	"error",
	2
]
```

Para inspeccionar y validar un archivo como *index.js* se puede usar el siguiente comando:

```sh
npx eslint index.js
```

También es recomendable el crear un comando especial para el linting:

```json
{
	// ...
	"scripts": {
		"start": "node index.js",
		"dev": "nodemon index.js",
		// ...
		"lint": "eslint ."
	},
	// ...
}
```

Ahora se puede usar el comando `npm run lint` para revisar cada archivo del proyecto.

Con la configuración actual ESLint revisará cada archivo, incluyendo los archivos dentro de *build*, dado que esto no es necesario se puede evitar esto al crear un archivo *.eslintignore* y agregar la siguiente línea:

```txt
build
```

Esto provoca que ESLint ignore el directorio *build* completo.

Al usar ESLint este nos mostrará los errores del código en la consola:

![[Pasted image 20231005180443.png]]

Existe una mejor forma de ejecutar un linter que la línea de comandos, esta es configurar *eslint-plugin* en el editor que corra un linter continuamente. Al usar estos plugins se podrán ver los errores de código inmediatamente.

En el caso de VS Code el plugin de ESLint subrayará en rojo los errores de estilo y nos dará una pequeña descripción de ellos:

![[Pasted image 20231005180705.png]]

Esto hace muy fácil poder ver los errores y corregirlos.

ESLint tiene una gran cantidad de reglas que son fáciles de usar y cambiar al editar el archivo *.eslintrc.js*.

Por ejemplo, podemos agregar la regla `eqeqeq` que nos advierte si la igualdad de dos expresiones es analizada de cualquier forma que no sea con el operador de triple igualdad (`===`):

```ts
{
	// ...
	'rules': {
		// ...
		'eqeqeq': 'error',
	},
}
```

Existen muchas otras reglas, como evitar los espacios al final de una línea (`no-trailing-spaces`), que siempre haya un espacio antes y después de las llaves (`object-curly-spacing`), o la consistencia de espacios entre los parámetros de una función flecha (`arrow-spacing`):

```ts
{
	// ...
	'rules': {
		// ...
		'eqeqeq': 'error',
		'no-trailing-spaces': 'error',
		'object-curly-spacing': [
			'error', 'always'
		],
		'arrow-spacing': [
			'error', { 'before': true, 'after': true}
		]
	},
}
```

Para deshabilitar una regla  se puede cambiar su valor a 0 en el archivo de configuración. Por ejemplo, se desactivará la regla `no-console`:

```ts
{
	// ...
	'rules': {
		// ...
		'no-console': 0,
	}
}
```

Cuando se realicen cambios a la configuración del linter es recomendable volver a ejecutar el linter, esto verificará que el archivo de configuración tenga un formato válido, ya que de haber algo mal en este archivo el plugin de lint se puede comportar de forma errática.