
Existen varias formas de agregar estilos a una aplicación de React. Primero, debemos agregar el CSS a la aplicación como en la vieja escuela, en un solo archivo sin usar ningún preprocesador.

Para ello de debe crear un archivo *index.css* en el directorio *src* e importarlo en el archivo *index.jsx*:

```jsx
import "./index.css";
```

Agreguemos la siguiente regla al archivo *index.css*:

```css
h1 {
	color: green;
}
```

Las reglas de CSS se conforman de *selectores* y *declaraciones*. El selector define a qué elementos se debe de aplicar la regla. En este ejemplo el selector es `h1`, que se empareja con las etiquetas de encabezado `<h1>` de nuestra aplicación. La declaración configura la propiedad `color` con el valor `green`.

Una regla de CSS puede contener una cantidad arbitraria de propiedades. Por ejemplo, en la misma regla podemos hacer al texto en cursivas al definir el estado de fuente como *itálica*:

```css
h1 {
	color: green;
	font-style: italic;
}
```

Existen varias formas de encontrar elementos usando [diferentes tipos de selectores CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

Si, por ejemplo, queremos apuntar a cada una de las notas con un estilo podemos usar el selector `li` ya que todas las notas están en una etiqueta `<li>`:

```css
li {
	color: grey;
	padding-top: 3px;
	font-size: 15px;
}
```

Usar los tipos de elementos para definir reglas se CSS es algo problemático, pues si la aplicación contiene otras etiquetas `<li>` el mismo estilo se aplicará a todas ellas. Para evitar esto se hace uso de los selectores de clase.

En HTML las clases son definidas dentro del atributo `class`:

```html
<li class="note">some text...</li>
```

En cambio, en React debemos de usar el atributo `className`, ya que la palabra `class` está reservada para las clases de JavaScript:

```jsx
const Note = ({ note, toggleImportance }) => {
	const label = note.important
		? "Make not important"
		: "Make important";

	return (
		<li className="note">{note.content}</li>
		<button onClick={toggleImportance}>
			{label}
		</button>
	);
}
```

Los selectores de clase están definidos con la sintaxis `.classname`:

```css
.note {
	color: grey;
	padding-top: 5px;
	font-size: 15px;
}
```

Si ahora se agrega otro elemento `<li>` a la aplicación, estos no se verán afectados por la regla de estilo de arriba.

# Mensaje de error mejorado

Anteriormente se implementó un mensaje de error usando `alert()` que se mostraba cuando el usuario trataba de cambiar la importancia de una nota ya eliminada. Implementémosla como su propio componente en React:

```jsx
const Notification = ({ message }) => {
	if (message === null) {
		return null;
	}

	return (
		<div className="error">
			{message}
		</div>
	)
};
```

Si el valor del mensaje es `null`, entonces la notificación no es renderizada en pantalla, en cualquier otro caso, el mensaje es renderizado dentro de un elemento `<div>`.

Agreguemos ahora una nueva pieza de estado llamada `errorMessage` al componente `<App />`:

```jsx
const App = () => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState("");
	const [showAll, setShowAll] = useState(true);
	const [errorMessage, setErrorMessage] = useState("Some error happened...");

	// ...

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			
			// ...
		</div>
	)
}
```

Es momento de agregar un estilo para el mensaje de error:

```css
.error {
	color: red;
	background: lightgrey;
	font-size: 20px;
	border-style: solid;
	border-radius: 5px;
	padding: 10px;
	margin-bottom: 10px;
}
```

Ahora podemos agregar la lógica para mostrar el mensaje de error, para ello debemos de cambiar la función `toggleImportance()` de la siguiente manera:

```jsx
const toggleImportance = id => {
	const note = notes.find(n => n.id === id);
	const changedNote = { ...note, important: !note.important };

	noteApi.update(id, changedNote)
	.then(returnedNote => {
		setNotes(notes.map(note => note.id !== id ? note : returnedNote));
	})
	.catch(error => {
		setErrorMessage(`Note "${note.content}" was already removed from server`);
		setTimeout(() => setErrorMessage(null), 5000);
		setNotes(notes.filter(note => note.id !== id));
	});
}
```

Cuando un error ocurre se agrega un mensaje de error descriptivo al estado `errorMessage`. Al mismo tiempo se agrega un timer que hará que el mensaje desaparezca tras cinco segundos. El resultado es el siguiente:

![[Pasted image 20230709012056.png]]

# Estilos en línea

En React también es posible escribir estilos en línea, de esta forma cualquier componente o elemento puede tener propiedades CSS a través de un objeto de estilo en el atributo `style`.

Las reglas de CSS están definidas de una forma ligeramente diferente en JavaScript. Si queremos poner el siguiente estilo:

```css
{
	color: green;
	font-style: italic;
	font-size: 16px;
}
```

En un objeto de estilo en línea lucirá así:

```jsx
{
	color: "green";
	fontStyle: "italic";
	fontSize: 16
}
```

Cada propiedad de CSS es definida como una propiedad separada de un objeto de JavaScript. Valores numéricos para los pixeles pueden ser definidos como enteros y las propiedades en lugar de usar guiones (kebab case) están escritas en camelCase.

Ahora agregaremos un "bloque inferior" a la aplicación creando un componente `<Footer />` y definiendo los siguientes estilos en línea:

```jsx
const Footer = () => {
	const footerStyle = {
		color: "green",
		fontStyle: "italic",
		fontSize: 16
	};

	return (
		<footer style={footerStyle}>
			<br/>
			<em>Note app, Deparment of Computer Science, University of Helsinki 2023</em>
		</footer>
	);
}
```

Y lo agregamos a `<App />`:

```jsx
const App = () => {
	// ...

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			
			// ...
			
			<Footer />
		</div>
	);
}
```

Al igual que en HTML los estilos en línea en JavaScript tienen ciertas limitaciones, de hecho, las pseudo-clases no se pueden usar.

Tradicionalmente se considera una buena práctica separar los estilos (CSS) del contenido (HTML) y la funcionalidad (JavaScript). De acuerdo a esta vieja escuela del pensamiento, la menta es escribir el CSS, HTML y JavaScript en sus propios archivos separados, por lo que los estilos en línea irían en contra de las buenas prácticas.

Sin embargo, la filosofía de React es completamente opuesta. Dado que la separación del CSS, HTML y JavaScript no suele escalar bien en aplicaciones grandes, React basa la división de la aplicación sobre la línea de sus entidades lógicas funcionales.

Las unidades estructurales que hacen las entidades funcionales de una aplicación son los componentes de React. Un componente de React define el HTML para estructura el contenido, las funciones de JavaScript para determinar la funcionalidad y el estilo del componente en el mismo lugar. Esto se hace para crear componentes individuales que sean lo más independientes y reusables posible.