Al crear notas en la aplicación, es natural querer guardarlas en un lugar donde no se puedan perder, un servidor.

# REST

En la terminología REST, los objetos de datos individuales son llamados *recursos* (resources). Cada recurso tiene una dirección única asociada a él, su URL. De esta forma, en JSON server podemos encontrar una nota individual en `/notes/:id`, donde `id` es el id del recurso, mientras tanto, la URL `/notes` apunta a la colección que contiene todas las notas.

Los recursos son obtenidos del servidor a partir de las solicitudes HTTP GET. De hecho, una solicitud HTTP GET a `/notes/3` regresará la nota que tiene como id el número 3. Una solicitud HTTP GET a `/notes` regresará la lista con todas las notas.

Para crear un nuevo recurso para guardar una nota se usan las solicitudes HTTP POST a la URL `/notes` de acuerdo a las convenciones de JSON server. Los datos que se desean guardar son enviados en el *cuerpo* de la solicitud.

Ya que JSON server requiere que todos los datos sean enviados en formato JSON los datos deben de ser correctamente formateados y la solicitud debe contener el encabezado `Content-Type` con el valor `application/json`.

# Mandando datos al servidor

Hagamos los siguientes cambios al event handler para crear una nota:

```jsx
addNote = event => {
	event.preventDefault();
	const noteObject = {
		content: newNote,
		important: Math.random() < 0.5,
	};

	axios.post("http://localhost:3001/notes", noteObject)
	.then(response => {
		console.log(response);
	});
}
```

Esta vez se ha creado un objeto `noteObject` sin una propiedad `id`, esto es así porque normalmente es mejor que el servidor genera el id de los recursos.

El objeto es enviado al servidor usando el método de axios `post()`. El event handler registrado muestra la respuesta que es enviada de regreso desde el servidor:

![[Pasted image 20230704161319.png]]

La nota recién creada es devuelta en el valor de la propiedad `data` del objeto `response`.

A veces es necesario revisar las solicitudes HTTP en la pestaña *Network* de las herramientas de desarrollador, donde se pueden ver los encabezados de la solicitud POST:

![[Pasted image 20230704161606.png]]

En la pestaña *Payload* se pueden observar los datos enviados en la solicitud:

![[Pasted image 20230704161650.png]]

Y en la pestaña *Response* los datos que el servidor ha respondido:

![[Pasted image 20230704161713.png]]

La nueva nota aún no ha sido renderizada ya que no se ha actualizado el estado del componente `<App />` cuando se creó la nueva nota. Podemos resolverlo de la siguiente manera:

```jsx
addNote = event => {
	event.preventDefault();
	const noteObject = {
		content: newNote,
		important: Math.random() < 0.5,
	};

	axios.post("http://localhost:3001/notes", noteObject)
	.then(response => {
		setNotes(notes.concat(response.data));
		setNewNote("");
	});
}
```

De esta forma la nota es agregada en el servidor backend y tras la respuesta es agregada a la aplicación usando `setNotes()` y el campo para crear una nueva nota es reseteado.

La asincronía de las respuestas que regresa el servidor nos obligan a adoptar nuevas estrategias de debugging, así como a entender los principios del entorno de JavaScript y React.

# Cambiando la importancia de las notas

Ahora se agregará un botón a cada nota que permita cambiar su importancia. Para ello se debe de cambiar al componente `<Note />`:

```jsx
const Note = ({ note, toggleImportance }) => {
	const label = note.important ?
		"Make not important" :
		"Make important";

	return (
		<li>
			{note.content}
			<button onClick={toggleImportance}>
				{label}
			</button>
		</li>
	)
}
```

Ahora se debe definir un valor para `toggleImportance` en el componente `<App />` que será pasado al componente `<Note />`:

```jsx
const toggleImportance = (id) => {
	const note = notes.find(note => note.id === id);
	const changedNote = { ...note, important: !note.important };

	setNotes(notes.map(note => note.id !== id ? note : changedNote));
}
```

Sin embargo, falta conectarlo al servidor, para eso se debe hacer lo siguiente:

```jsx
const toggleImportance = (id) => {
	const url = `http://localhost:3000/notes/${id}`;
	const note = notes.find(note => note.id === id);
	const changedNote = { ...note, important: !note.important };

	axios.put(url, changedNote).then(response => {
		setNotes(notes.map(note => note.id !== id ? note : changedNote));
	});
}
```

La primera línea se utiliza para definir la URL para cada nota en base a su id. El método `find()` se utiliza para encontrar la nota que se va a modificar y asignarla a una variable. Después se crea un objeto que es exactamente la copia de la nota encontrada pero con el valor de importancia cambiado.

Por último, se envía una solicitud HTTP PUT a la URL de la nota con los datos que queremos que tenga y en caso de que la solicitud sea aceptada se actualiza `notes` agregando la nota que regresa el servidor.

# Extrayendo la comunicación con el servidor en otro módulo

El colocar las funciones que se encargan de la comunicación en el componente `<App />` hace que se vea algo amontonado. Para evitar esto y seguir el [principio de responsabilidad única](https://en.wikipedia.org/wiki/Single_responsibility_principle), es una buena idea extraer esta funcionalidad en su propio módulo.

```jsx
import axios from "axios";

const BASE_URL = "http://localhost:3000/notes";

const getAll = () => {
	return axios.get(BASE_URL);
}

const create = newObject => {
	return axios.post(BASE_URL, newObject);
}

const update = (id, newObject) => {
	return axios.put(`${BASE_URL}/${id}`,newObject);
}

export default {getAll, create, update};
```

El módulo regresa un objeto que contiene las tres funciones para comunicarse con el servidor. Las funciones regresan directamente las promesas que regresan los métodos de axios.

Para usar estas funciones solo se deben de importar:

```jsx
import notesApi from "./api/notes";

const App = () => {
	// ...
}
```

Las funciones del módulo pueden ser usadas directamente de la siguiente manera:

```jsx
const App = () => {
	//...
	
	useEffect(() => {
		noteApi
		.getAll()
		.then(response => {
			setNotes(response.data);
		});
	}, []);
	
	const toggleImportanceOf = id => {
		const note = notes.find(n => n.id === id);
		const changedNote = {...note, important: !note.important};
	
		noteApi
		.update(id, changedNote)
		.then(response => {
			setNotes(notes.map(note => note.id !== id ? note : response.data))
		});
	}
	
	const addNote = (event) => {
		event.preventDefault();
		const noteObject = {
			content: newNote,
			important: Math.random() > 0.5;
		};
	
		noteApi
		.create(noteObject)
		.then(response => {
			setNotes(notes.concat(response.data));
			setNewNote("");
		})
	}

	//...
}

export default App;
```

Podemos ir un paso más adelante y hacer que cuando el componente `<App />` use las funciones en lugar de recibir toda la respuesta reciba solo la parte que necesita, las notas y así pasar de la implementación anterior a esta:

```jsx
noteApi
.getAll()
.then(initialNotes => {
	setNotes(initialNotes);
})
```

Para ello debemos cambiar el código como sigue:

```jsx
const getAll = () => {
	const request = axios.get(BASE_URL);
	return request.then(response => response.data);
}

const create = newObject => {
	const request = axios.post(BASE_URL, newObject);
	return request.then(response => response.data);
}

const update = (id, newObject) => {
	const request = axios.put(`${BASE_URL}/${id}`,newObject);
	return request.then(response => response.data);
}
```

De esta forma no regresamos la promesa que originalmente regresa axios, sino que regresamos una promesa que solo nos devuelve los datos con los que respondió el servidor.

# Promesas y errores

Puede ocurrir que, si nuestra aplicación permite eliminar notas, el usuario trate de cambiar la importancia de una nota que ya ha sido eliminada del sistema. Podemos simular esto haciendo que `getAll()` regrese una nota que no existe en el servidor:

```jsx
const getAll = () => {
	const request = axios.get(BASE_URL);
	const nonExistingNote = {
		id: 10000,
		content: "This note is not in the server",
		important: true
	};

	return request.then(response => response.data.concat(noExistingNote));
}
```

Cuando se intenta cambiar la importancia de esta nota se puede observar el siguiente error en la consola, el cual nos dice que el servidor respondió a nuestra solicitud HTTP PUT con el código de estado 404 *not found*.

![[Pasted image 20230707120822.png]]

La aplicación debe ser capaz de manejar este tipo de errores para que los usuarios no sean capaces de decir que un error ha ocurrido a menos que abran la consola.

De la misma forma que una solicitud exitosa se maneja con el método `then()` usando una callback function, una función rechazada se maneja usando el método `catch()` de la siguiente manera:

```jsx
axios.get("http://example.com/probably_will_fail")
.then(response => {
	console.log("Success!");
})
.catch(error => {
	console.log("Fail!");
});
```

Cuando la solicitud falla, el event handler registrado en el método `catch()` es llamado. El método `catch()` es usado comúnmente colocándolo al fondo de una cadena de promesas, esto es así porque el método `catch()` una vez que una de las promesas de la cadena lanza un error y es rechazada:

```jsx
axios.put(`${BASE_URL}/${id}`, newObject)
.then(response => response.data)
.then(changedNote => {
	// ...
})
.catch(error => {
	console.log("Fail");
});
```

Podemos usar esto en el componente `<App />`:

```jsx
const toggleImportanceOf = id => {
	const note = notes.find(note => note.id === id);
	const changedNote = { ...note, important: !note.important };
	
	noteApi.update(id, changedNote)
	.then(returnedNote => {
		setNotes(notes.map(note => note.id !== id ? note: returnedNote));
	})
	.catch(error => {
		alert(`The note ${note.content} was already deleted from server`);
		setNotes(notes.filter(note => note.id !== id));
	});
}
```

De esta forma, al tratar de eliminar una nota que ya no existe una alerta es mostrada al usuario y la nota es eliminada del estado usando el método `filter()`.