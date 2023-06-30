Expandamos el ejemplo anterior permitiendo a los usuarios el crear nuevas notas. Para que la página se actualize cuando agreguemos nuevas notas es necesario guardar `notes` dentro de un estado en el componente `<App />`:

```jsx
import Note from "./components/Note"

const App = ({ defaultNotes }) => {
	const [notes, setNotes] = useState(defaultNotes);

	return (
		<div>
			<h1>Notes</h1>
			<ul>
				{notes.map(note => <Note key={note.id} note={note} />)}
			</ul>
		</div>
	);
}

export default App;
```

El componente usa `useState()` para inicializar un estado que guarda un array de notas que es pasada a través de los props. Si queremos iniciar con una lista vacía podemos darle el valor de un array vacío y omitir el parámetro `defaultNotes` en los props.

```jsx
const [notes, setNotes] = useState([]);
```

Para agregar notas a `notes` es necesario usar un formulario HTML que será usado para agregar nuevas notas:

```jsx
const App = ({ defaultNotes }) => {
	const [notes, setNotes] = useState(defaultNotes);

	const addNote = (event) => {
		event.preventDefault();
		console.log("Button clicked", event.target);
	}

	return (
		<div>
			<h1>Notes</h1>
			<ul>
				{notes.map(note => <Note key={note.id} note={note} />)}
			</ul>

			<form onSubmit={addNote}>
				<input />
				<button type="submit">
					Save
				</button>
			</form>
		</div>
	);
}
```

El parámetro `event` es el evento que activa la llamada de la handler function:
El event handler llama inmediatamente a `event.preventDefault()`, lo que previene la acción por defecto al enviar enviar un formulario. Esta acción predeterminada hará, entre otras cosas, recargar la página.

El `target` del evento se muestra en la consola:

![[Pasted image 20230630005043.png]]

En este caso `target` se refiere al formulario que se ha definido en el componente.

# Componentes controlados

Existen varias maneras de obtener el valor de un elemento `<input />`, una de estas es usar componentes controlados.

Para ello agregaremos un estado llamado `newNote` para guardar el los datos escritos por el usuario en `<input />`. Para ello se pondrá como el *valor* de `<input />`:

```jsx
const App = ({ defaultNotes }) => {
	const [notes, setNotes] = useState(defaultNotes);
	const [newNote, setNewNote] = useState("A new note...");

	const addNote = (event) => {
		event.preventDefault();
		console.log("Button clicked", event.target);
	}

	return (
		<div>
			<h1>Notes</h1>
			<ul>
				{notes.map(note => <Note key={note.id} note={note} />)}
			</ul>

			<form onSubmit={addNote}>
				<input value={newNote} />
				<button type="submit">
					Save
				</button>
			</form>
		</div>
	);
}
```

El texto puesto en `newNote` aparecerá como el valor del input, sin embargo, no se puede editar. Si observamos la consola veremos un error que nos indica lo que está mal.

![[Pasted image 20230630014831.png]]

Como hemos asignado un estado como el atributo `value` ahora el componente `<App />` controla el comportamiento de `<input />`. Para habilitar la edición del elemento tenemos que registrar un event handler que sincronice los cambios hechos al elemento con el estado:

```jsx
const App = ({ defaultNotes }) => {
	const [notes, setNotes] = useState(defaultNotes);
	const [newNote, setNewNote] = useState("A new note...");

	const addNote = (event) => {
		event.preventDefault();
		console.log("Button clicked", event.target);
	}

	const handleNoteChange = (event) => {
		console.log(event.target.value);
		setNewNote(event.target.value);
	}

	return (
		<div>
			<h1>Notes</h1>
			<ul>
				{notes.map(note => <Note key={note.id} note={note} />)}
			</ul>

			<form onSubmit={addNote}>
				<input value={newNote} onChange={handleNoteChange} />
				<button type="submit">
					Save
				</button>
			</form>
		</div>
	);
}
```

Ahora que hay un event handler en el atributo `onChange` este será llamado cada que el valor del elemento `<input />` cambie. La propiedad `target` del objeto `event` marca al input, por lo que `target.value` representa el valor del elemento `<input />`. Esta vez no es necesario llamar a `event.preventDefault()`, ya que no existe un comportamiento predeterminado para el cambio de un input.

Ahora podemos ver en la consola como el valor de `<input />` conforme escribimos:

![[Pasted image 20230630015643.png]]

Ya que ahora tenemos un `<input />` para crear el contenido de las notas podemos agregar una función para crear nuevas notas:

```jsx
const addNote = (event) => {
	event.preventDefault();
	const noteObject = {
		content: newNote,
		important: Math.random() < 0.5,
		id: notes.length,
	}

	setNotes(notes.concat(noteObject));
	setNewNote("");
}
```

Ahora podemos agregar notas al presionar el botón o la tecla "Enter":

![[Pasted image 20230630020254.png]]

# Filtrando los elementos mostrados

Agreguemos una funcionalidad que nos permita ver solo las notas que son importantes. Para ello hay que agregar un estado que recuerde que notas deben ser mostradas:

```jsx
const App = ({ defaultNotes }) => {
	const [notes, setNotes] = useState(defaultNotes);
	const [newNote, setNewNote] = useState("A new note...");
	const [showAll, setShowAll] = useState(true);

	// ...
}
```

Ahora agreguemos una variable en la que se guarden aquellas notas que deben ser mostradas ya que los elementos en la lista dependen del estado de la aplicación.

```jsx
const App = ({ defaultNotes }) => {
	const [notes, setNotes] = useState(defaultNotes);
	const [newNote, setNewNote] = useState("A new note...");
	const [showAll, setShowAll] = useState(true);

	// ...

	const notesToShow = showAll ?
		notes :
		notes.filter(note => note.important);

	return (
		<div>
			<h1>Notes</h1>
			<ul>
				{notesToShow.map(note => <Note key={note.id} note={note} />)}
			</ul>

			<form onSubmit={addNote}>
				<input value={newNote} onChange={handleNoteChange} />
				<button type="submit">
					Save
				</button>
			</form>
		</div>
	);
}
```

De esta forma filtramos el contenido de `notes` en base a la importancia asignada a la nota.

También agreguemos una funcionalidad para cambiar el valor de `showAll` desde la interfaz:

```jsx
const App = ({ defaultNotes }) => {
	const [notes, setNotes] = useState(defaultNotes);
	const [newNote, setNewNote] = useState("A new note...");
	const [showAll, setShowAll] = useState(true);

	// ...

	const notesToShow = showAll ?
		notes :
		notes.filter(note => note.important);

	return (
		<div>
			<h1>Notes</h1>
			<div>
				<button onClick={() => setShowAll(!showAll)}>
					Show {showAll ? "important" : "all"}
				</button>
			</div>
			<ul>
				{notesToShow.map(note => <Note key={note.id} note={note} />)}
			</ul>

			<form onSubmit={addNote}>
				<input value={newNote} onChange={handleNoteChange} />
				<button type="submit">
					Save
				</button>
			</form>
		</div>
	);
}
```

De esta forma podemos decidir si mostrar todas las notas o solo las importantes, además, el texto del botón cambia en función de lo que estamos mostrando y nos permite cambiar las notas que mostramos.