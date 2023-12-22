# Mostrar el formulario de inicio de sesión cuando es apropiado

Lo siguiente es modificar la aplicación de tal forma que el formulario de inicio de sesión no se muestre de forma predeterminada:

![[Pasted image 20231215202141.png]]

De esta forma el formulario solo aparece cuando el usuario presiona el botón de *log in*:

![[Pasted image 20231215202206.png]]

El usuario igualmente puede cerrar el formulario al presionar el botón *cancel*.

El componente se vería de la siguiente manera:

```tsx
const LoginForm = ({
	handleSubmit,
	handleUsernameChange,
	handlePasswordChange,
	username,
	password
}) => {
	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div>
					Username:
					<input
						value={username}
						onChange={handleUsernameChange}
					/>
				</div>
				<div>
					Password:
					<input
						value={password}
						onChange={handlePasswordChange}
					/>
				</div>
				<button type="submit">
					Login
				</button>
			</form>
		</div>
	);
};
```

El estado de todas las funciones relacionadas está definido fuera del componente y es pasado al componente mediante los props.

Esta forma de pasar los props se llama desestructuración y es donde se asignan variables a cada uno de los props, lo que evita escribir:

```tsx
<form onSubmit={props.handleSubmit}>
	// ...
</form>
```

Donde `props` es el objeto que se pasa como parámetro.

Una forma de implementar la funcionalidad de ocular el formulario es de la siguiente manera:

```tsx
const App = () => {
	const [loginVisible, setLoginVisible] = useState(false);

	// ...

	const loginForm = () => {
		const hideWhenVisible = { display: loginVisible ? "none" : "" };
		const showWhenVisible = { display: loginVisible ? "" : "none" };

		return (
			<div>
				<div style={hideWhenVisible}>
					<button onClick={() => setLoginVisible(true)}>
						Log in
					</button>
				</div>
				<div style={showWhenVisible}>
					<LoginForm
						username={username}
						password={password}
						handleUsernameChange={
							({ target }) => setUsername(target.value)
						}
						handlePasswordChange={
							({ target }) => setPassword(target.value)
						}
						handleSubmit={handleLogin}
					/>
					<button onClick={() => setLoginVisible(false)}>
						Cancel
					</button>
				</div>
			</div>
		);
	}
}
```

De esta forma ahora existe el booleano `loginVisible` para decidir si el componente `<loginForm />` se muestra.

La visibilidad del componente se define dando al componente un estilo en línea donde el valor de la propiedad `display` es `none` si no se quiere que se muestre el componente:

```tsx
const hideWhenVisible = { display: loginVisible ? "none" : "" };
const showWhenVisible = { display: loginVisible ? "" : "none" };
```

# Los componentes `children`

El código usado para manejar la visibilidad de un componente se puede considerar su propia entidad, por lo cual es buena idea extraer la funcionalidad en un componente separado.

La meta es implementar un componente `<Togglable />` que pueda ser usado de la siguiente manera:

```tsx
<Togglable buttonLabel="login">
	<LoginForm
		username={username}
		password={password}
		// ...
	/>
</Togglable>
```

La forma en que el componente es usado es diferente al resto pues tiene tags de inicio y final que encierran al componente `<LoginForm />`. En la terminología de React se dice que `<LoginForm />` es el componente hijo (child component) de `<Togglable />`.

Se pueden agregar cuantos componentes se quieran dentro de `<Togglable />`:

```tsx
<Togglable buttonLabel="reveal">
	<p>This line is hidden</p>
	<p>This line is also hidden</p>
</Togglable>
```

El código del  componente `<Togglable />` es el siguiente:

```tsx
const Togglable = ({ buttonLabbel, children }) => {
	const [visible, setVisible] = useState(false);

	const hiddenWhenVisible = { display: visible ? "none" : " "};
	const showWhenVisible = { display: visible ? "" : "none" };

	const toggleVisibility = () => {
		setVisible(!visible);
	};

	return (
		<div>
			<div style={hiddenWhenVisible}>
				<button onClick={toggleVisibility}>
					{ buttonLabbel }
				</button>
			</div>
			<div style={showWhenVisible}>
				{ children }
				<button onClick={toggleVisibility}>
					Cancel
				</button>
			</div>
		</div>
	)
};
```

En el código se puede ver un prop [`children`](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children), el cual es usado para referir los componentes hijos del componente. Los componentes hijos son elementos de React que se pueden definir entre las tags de inicio y fin de un componente, en este caso estos se renderizan con el mismo componente.

Al contrario de los props normales, `children` se agrega automáticamente por React y siempre existe, si un componente se define con una tag cerrada (`< />`) el valor de `children` es un array vacío.

El componente `<Togglable />` es reusable y se puede usar para agregar la funcionalidad de ocultar o mostrar al formulario para crear nuevas notas.

Para hacer esto se debe primero extraer el formulario para crear nuevas notas:

```tsx
const NoteForm = ({ onSubmit, handleChange, value }) => {
	return(
		<div>
			<h2>Create a new note</h2>
			<form onSubmit={onSubmit}>
				<input
					value={value}
					onChange={handleChange}
				/>
				<button type="submit">
					Save
				</button>
			</form>
		</div>
	);
};
```

Lo siguiente es poner el componente dentro de `<Togglable />`:

```tsx
<Togglable>
	<NoteForm
		onSubmit={addNote}
		value={newNote}
		handleChange={handleNoteChange}
	/>
</Togglable>
```

# Estado del formulario

El estado de la aplicación se encuentra actualmente en el componente `<App />`, sin embargo, la documentación de React dice lo siguiente:

> A veces uno quiere que los estados de dos componentes cambien juntos. Para hacerlo se debe remover el estado de ambos, moverlos al componente padre más cercano y pasarlo a estos mediante los props. Esto se conoce como *levantar el estado* y es una de las prácticas más comunes que se realizan al escribir código de React.

Si se piensa acerca del estado de los formularios, por ejemplo el contenido de una nueva nota antes de ser creada, el componente `<App />` no tiene nada que hacer con este, por lo cual se puede mover el estado de los formularios a los componentes correspondientes.

El componente para crear nuevas notas se vería de la siguiente manera:

```tsx
const NoteForm = ({ createNote }) => {
	const [newNote, setNewNote] = useState("");

	const addNote = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		createNote({
			content: newNote,
			important: true,
		});

		setNewNote("");
	};

	return (
		// ...
	);
};
```

Ahora el atributo de estado `newNote` y el event handler responsable se ha movido del componente `<App />` al componente responsable de crear nuevas notas, la única propiedad restante es la función `createNote` que es llamada cuando una nueva nota es creada.

El componente `<App />` también se ha simplificado. Además, la función `newNote` ahora recibe la nueva nota como parámetro, pues ya no tiene acceso al estado del componente.

```tsx
const App = () => {
	// ...
	const addNote = (noteObject) => {
		noteService
			.create(noteObject)
			.then(returnedNote => {
				setNotes(notes.concat(returnedNote));
			});
	};

	// ...
	const noteForm = () => (
		<Togglable buttonLabel="new note">
			<NoteForm createNote={addNote} />
		</Togglable>
	);
	// ...
};
```

# Referencias a componentes con `ref`

Tras crear una nueva nota tiene sentido ocultar el formulario para crear una nueva nota, sin embargo, actualmente permanece visible. Más aún, existe un pequeño problema al ocultar el formulario, su visibilidad es controlada por el estado del componente `<Togglable />` así que ¿cómo se puede acceder a este desde fuera del componente?

Existen varias formas de implementarlo, una de ellas es usar el mecanismo [ref](https://react.dev/learn/referencing-values-with-refs) de React, el cual ofrece una referencia del componente.

Para ello debemos hacer los siguientes cambios:

```tsx
import { useState, useEffect, useRef } from "react";

const App = () => {
	const noteFormRef = useRef();

	const noteForm = () => (
		<Togglable buttonLabel="new note" ref={noteFormRef}>
			<NoteForm createNote={addNote} />
		</Togglable>
	)
};
```

El hook [`useRef`](https://react.dev/reference/react/useRef) es usado para crear una referencia que es asignada al componente `<Toggleble />` que contiene el formulario de creación de notas. Este hook asegura que la misma referencia se mantiene a través de las renderizaciones de los componentes.

Igualmente se deben realizar las siguientes modificaciones al componente `<Togglable />`:

```tsx
import { useState, fordwardRef, useImperativehandle } from "react";

const Togglable = forwardRef((props, refs) => {
	// ...
	const toggleVisibility = () => {
		setVisibility(!visible);
	};

	useImperativeHandle(refs, () => {
		return {
			toggleVisibility
		}
	});

	return (
		// ...
	);
});
```

La función que crea el componente está envuelta dentro de una llamada a la función [`forwardRef`](https://react.dev/reference/react/forwardRef), de esta manera el componente puede acceder a la referencia que es asignada a este.

El componente también usa el hook [`useImperativeHandle`](https://react.dev/reference/react/useImperativeHandle) para hacer que la función `toggleVisibility` esté disponible fuera del componente.

Ahora se puede ocultar el formulario al llamar `noteFormRef.current.toggleVisibility` tras crear una nota nueva:

```tsx
const App = () => {
	// ...
	const addNote = (noteObject) => {
		noteFormRef.current.toggleVisibility();
		noteService
			.create(noteObject)
			.then(returnedNote => {
				setNotes(notes.concat(returnedNote));
			});
	};
	// ...
};
```

La función `useImperativeHandle` es un hook de React usado para definir funciones dentro de un componente que pueden ser invocadas fuera del componente.

Este truco funciona para cambiar el estado del componente pero no se ve muy bien. Se puede lograr el mismo efecto con un código más limpio usando algo de los componentes de clase del "viejo React", este es uno de los pocos casos donde el uso de hooks no lleva a un código más limpio que los componentes de clase.

Existen además de este otros [casos de uso](https://react.dev/learn/manipulating-the-dom-with-refs) de las referencias aparte de acceder a componentes de React.

# propTypes

