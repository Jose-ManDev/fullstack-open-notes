# Manejando el inicio de sesión

Para manejar el inicio de sesión se debe de agregar un formulario para el inicio de sesión en la página:

```tsx
const App = () => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState("");
	const [showAll, setShowAll] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		noteService
			.getAll()
			.then(initialNotes => {
				setNotes(initialNotes);
			});
	}, []);

	// ...

	const handleLogin = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("loggin with", username, password);
	};

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						type="text"
						value={username}
						name="username"
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password
					<input
						type="text"
						value={password}
						name="password"
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type="submit">Login</button>
			</form>
			{ // ... }
		</div>
	)
}
```

![[Pasted image 20231208163741.png]]

El formulario funciona creando dos estados para el *nombre de usuario* y la *contraseña* anotados en el formulario, los campos del formulario contienen event handlers que sincronizan los cambios en el campo con el estado de `<App />`. El método `handleLogin` que se encarga de manejar los datos del formulario aún falta por implementarse.

Para iniciar sesión se debe de enviar una solicitud HTTP POST a la dirección del servidor *api/login*, para esto es buena idea separar el código responsable de la petición en su propio módulo en *service/login.ts*.

```ts
import axios from "axios";

const baseUrl = "/api/login";

const login = async credentials => {
	const response = await axios.post(baseUrl, credentials);
	return response.data;
}

export default { login };
```

El método para manejar el inicio de sesión puede ser el siguiente:

```tsx
const App = () => {
	// ...
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);

	const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
		event.PreventDefault();
		
		try {
			const user = await loginService.login({ username, password });
			setUser(user);
			setUsername("");
			setPassword("");
		} catch (exception) {
			setErrorMessage("Wrong credentials");
			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
		}
	};

	// ...
};
```

Si el inicio de sesión es exitoso, los campos del formulario se limpian y la respuesta del servidor (incluyendo el token y los detalles del usuario) son guardados en el estado `user` de la aplicación. Si el inicio de sesión falla o el ejecutar la función `login` resulta en un error el usuario es notificado.

El usuario no es notificado de un inicio de sesión exitoso, por lo que es mejor editar la aplicación para que solo muestre el formulario de inicio de sesión si el usuario no ha iniciado sesión, es decir, si `user === null`, de igual forma, el formulario para agregar nuevas notas solo debe ser mostrado si el usuario ha iniciado sesión.

Para ello podemos agregar dos funciones de ayuda:

```tsx
const App = () => {
	// ...

	const loginForm = () => {
		// ...
	};

	const noteForm = () => {
		// ...
	};

	return (
		// ...
	);
};
```

Y renderizarlas condicionalmente:

```tsx
const App = () => {
	// ...

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />

			{user === null && loginForm()}
			{user !== null && noteForm()}
			// ...
		</div>
	);
};
```

Otra forma de escribir el renderizado condicional es usando el operador condicional:

```tsx
{ user === null ? loginForm() : noteForm() }
```

# Creando notas nuevas

En la parte anterior se guardo el resultado del inicio de sesión en el estado de la aplicación `user`, es decir, dentro de este se encuentra el *token* que regresó el servidor. Para poder agregar nuevas notas es necesario enviar este token al servidor dentro del header Authorization de la solicitud HTTP, para hacerlo se debe cambiar el módulo de la siguiente forma:

```ts
import axios from "axios";

const baseUrl = "/api/notes";

let token = null;

const setToken = newToken => {
	token = `Bearer ${newToken}`;
};

const getAll = () => {
	const request = axios.get(baseUrl);
	return request.then(response => response.data);
};

const create = async newObject => {
	const config = {
		headers: { Authorization: token }
	};

	const response = await axios.post(baseUrl, newObject, config);
	return response.data;
};

const update = async (id, newObject) => {
	const config = {
		headers: { Authorization: token }
	};

	const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
	return response.data;
};

export default { getAll, create, update, setToken };
```

De esta forma el módulo noteService contiene una variable privada `token` de la cual se puede cambiar su valor mediante la función `setToken` que es exportada con el módulo. Por último las funciones `create` y `update` configuran el header *Authorization* que es dado como tercer parámetro a los métodos `post` y `put` de axios.

También se debe de cambiar el event handler responsable del inicio de sesión para que configure el token cuando se de un inicio de sesión exitoso:

```ts
const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
	event.preventDefault();
	try {
		const user = await loginService.login({
			username, password
		});

		noteService.setToken(user.token);
		// ...
	} catch (exception) {
		// ...
	}
};
```

De esta forma ahora se pueden agregar y modificar notas nuevamente.

# Guardando el token dentro del almacenamiento local (local storage)

La aplicación tiene un problema, si la página se recarga la sesión del usuario desaparece. Este problema se puede resolver fácilmente al guardar los detalles de la sesión dentro del [almacenamiento local](https://developer.mozilla.org/en-US/docs/Web/API/Storage). El almacenamiento local es una base de datos de [clave-valor](https://en.wikipedia.org/wiki/Key-**value_database**) en el navegador.

Para usar el almacenamiento local a un *valor* se le debe asignar una  *clave* dentro de la base de datos usando el método [`setItem`](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem), por ejemplo:

```ts
window.localStorage.setItem("name", "Tuomas Holopainen");
```

Esto guarda la string dada como segundo parámetro como el valor de la clave `name`.

El valor guardado se puede obtener usando el método [`getItem`](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem):

```ts
window.localStorage.getItem("name");
```

Y se puede eliminar usando el método [`removeItem`](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem).

Los valores dentro del almacenamiento local son persistentes incluso cuando la página es recargada, además de que es específico al origen, por lo que cada página web tiene su propio almacenamiento.

Lo siguiente es extender la aplicación para que guarde los detalles de la sesión del usuario, esto se hace mediante el uso de [DOMstrings](https://docs.w3cub.com/dom/domstring), por lo que no se pueden guardar objetos de JavaScript como tales. Para guardar valores en el almacenamiento local estos deben ser pasados a JSON primero con el método `JSON.stringify`. De igual manera, cuando se quiere leer el almacenamiento local se debe usar el método `JSON.parse` para obtener el objeto original.

Los cambios al método de inicio de sesión son los siguientes:

```ts
const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
	event.preventDefault();
	try {
		const user = await loginService.login({
			username, password
		});

		window.localStorage.setItem(
			"loggedUser", JSON.stringify(user);
		);


		noteService.setToken(user.token);
		setUser(user);
		// ...
	} catch (exception) {
		// ...
	}
};
```

Ahora los detalles del inicio de sesión están guardados dentro del almacenamiento local y pueden ser vistos usando la consola:

![[Pasted image 20231209220024.png]]

Lo siguiente es modificar la aplicación para que cuando se entre a la página la aplicación revise si existe algún usuario que haya iniciado sesión y si existe los detalles sean guardados dentro del estado de la aplicación y *noteService*.

Esto se puede hacer mediante el uso de un [effect hook](https://react.dev/reference/react/useEffect):

```ts
const App = () => {
	// ...
	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedUser");

		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			noteService.setToken(user.token);
		}
	}, []);
	// ...
};
```

De esta forma el usuario permanecerá con la sesión iniciada para siempre. Para evitar esto se debe de agregar una funcionalidad para *cerrar sesión* que remueva los detalles del usuario del almacenamiento local.