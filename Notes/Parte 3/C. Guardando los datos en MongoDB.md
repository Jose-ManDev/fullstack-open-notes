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