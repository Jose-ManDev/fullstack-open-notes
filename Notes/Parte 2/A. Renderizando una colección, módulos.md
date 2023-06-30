# Renderizando colecciones

Comencemos con el siguiente código:

```jsx
const App = ({ notes }) => {
	return (
		<div>
			<h1>
				<ul>
					<li>{notes[0].content}</li>
					<li>{notes[1].content}</li>
					<li>{notes[2].content}</li>
				</ul>
			</h1>
		</div>
	);
}

export default App;
```

Y las notas son las siguientes:

```js
const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
];
```

Cada nota contiene texto en `content` y un valor booleano para indicar si ha sido categorizada como importante o no, igualmente contiene una `id` única.

El ejemplo anterior solo puede funcionar si el array `notes` contiene tres notas, sin embargo, en caso de que hayan más o menos provocará errores. Para evitar eso se hace uso del método `map()`

```jsx
notes.map(note => <li>{note.content}</li>)
```

Esto produce un array de elementos `<li>`.

```jsx
[
  <li>HTML is easy</li>,
  <li>Browser can execute only JavaScript</li>,
  <li>GET and POST are the most important methods of HTTP protocol</li>,
]
```

Que puede ser colocado dentro de un elemento `<ul>`:

```jsx
const App = ({ notes }) => {
	return (
		<div>
			<h1>
				<ul>
					{notes.map(note => <li>{note.content}</li>)}
				</ul>
			</h1>
		</div>
	);
}

export default App;
```

# El atributo `key`

Si bien la aplicación funciona aparece un error en la consola:

![[Pasted image 20230627211229.png]]

Como el error nos menciona, los elementos generados por el método `map()` deben tener una clave única en el atributo `key`. Así que hay que agregarlas:

```jsx
const App = ({ notes }) => {
	return (
		<div>
			<h1>
				<ul>
					{notes.map(note => <li key={note.id}>{note.content}</li>)}
				</ul>
			</h1>
		</div>
	);
}

export default App;
```

Con esto el error queda solucionado.

React usa el atributo `key` para determinar como debe de actualizarlos cuando el componente es re-renderizado.

# Anti-patrón: Índices de un array como claves

Podemos hacer desaparecer el mensaje de error de la consola si usamos el índice del elemento en el array como clave, esto se puede lograr al usar un segundo argumento para la función que se le pasa a `map()`.

```jsx
notes.map((note, index) => { ... });
```

Sin embargo, esto no es buena idea, ya que la clave tiene que ser un valor específico del elemento que no cambie. Dado que los índices de un array pueden cambiar al agregar o eliminar elementos es mejor no usarlos como claves.

# Refactorizando módulos

Podemos refactorizar el componente al crear uno nuevo que se encargue solo de mostrar la nota:

```jsx
const App = ({ notes }) => {
	return (
		<div>
			<h1>
				<ul>
					{notes.map(note => <Note key={note.id} note={note} />)}
				</ul>
			</h1>
		</div>
	);
}

const Note = ({ note }) => {
	return <li>{note.content}</li>
}

export default App;
```

Observa que el atributo `key` ahora se encuentra en el componente `<Note />` y no en el elemento `<li>` dentro de este.

Por último, es buena idea separa el componente `<Note />` en un archivo diferente e importarlo dentro de *App.jsx*:

```jsx
import Note from "./components/Note";

const App = ({ notes }) => {
	return (
		<div>
			<h1>
				<ul>
					{notes.map(note => <Note key={note.id} note={note} />)}
				</ul>
			</h1>
		</div>
	);
}

export default App;
```


