Comencemos con el siguiente ejemplo:

```tsx
const Hello = (props) => {
return(
	<div>
		<p>
			Hello, {props.name}, you are {props.age} years old
		</p>
	</div>
);
}

const App = () => {
	const name = "Peter";
	const age = 15;

	return (
		<div>
			<h1>Greetings</h1>
			<Hello name="Mary Jane" age={10 + 4} />
			<Hello name={name} age={age} />
		</div>
	)
}
```

# Helper functions

Se pueden agregar funciones dentro de los componentes que son llamadas cuando el componente se renderiza, estas funciones son llamadas helper functions. En este caso se usa una función para calcular la fecha de nacimiento de una persona sin necesidad de pasar la edad como un prop, ya que la función tiene acceso directo a los props del componente.

```jsx
const Hello = (props) => {
	const bornYear = () => {
		const currentYear = new Date().getFullYear();
		return currentYear - props.age;
	}
	
	return (
		<div>
			<p>
				Hello, {props.name} you are {props.age} years old
			</p>
			<p>
				So you were probably born in {bornYear()}
			</p>
		</div>
	);
}
```

# Desestructuración

En JavaScript tanto los array como los objetos se pueden desestructurar en sus valores al asignarlos a una variable. Dado que `props` es un objeto podemos hacer lo mismo y así no tener que usar `props.age` cada que queramos acceder a la propiedad `age` de `props`.

```jsx
const Hello = ({ name, age }) => {
	const bornYear = () => {
		const currentYear = new Date().getFullYear();
		return currentYear - age;
	}
	
	return (
		<div>
			<p>
				Hello, {name} you are {age} years old
			</p>
			<p>
				So you were probably born in {bornYear()}
			</p>
		</div>
	);
}
```

De esta forma ahora podemos acceder a las propiedades individuales del objeto `props` sin tener que acceder a este cada vez que queremos obtenerlas.

# Re - renderizado de páginas

Hasta el momento la apariencia de las páginas se ha mantenido igual después del renderizado inicial. Sin embargo, si queremos crear una página que reaccione a las acciones del usuario, como un contador, es necesario que la página cambie con dichas acciones. Empecemos con el siguiente código:

```jsx
const App = ({ counter }) => {
	return (
		<div>counter</div>
	);
}

export default App;
```

Y nuestro archivo *main.jsx* como:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

let counter = 1;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App counter={counter} />
  </React.StrictMode>
);
```

De esta forma el componente `<App />` recibe el valor de `counter` como un prop. Sin embargo, si nosotros cambiamos el valor de `counter` no pasará nada. Para que el componente se re-renderice necesitamos llamar el método `render()`.

```jsx
let counter = 1;
const refresh = () => {
	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	  <React.StrictMode>
	    <App counter={counter} />
	  </React.StrictMode>
	);
}

refresh();
counter += 1;
refresh();
counter += 1;
refresh();
```

De esta forma el componente se re-renderiza tres veces mostrando 1, 2, y por último, 3. Para hacer menos repetitivo el código se puede usar `setInterval()` que incrementará el valor de `counter` en 1 y re-renderizará la página cada segundo.

```jsx
setInterval(() => {
	refresh();
	counter += 1;
}, 1000)
```

Si bien esto parece simple, en realidad no es la forma correcta de re-renderizar un componente. Para ello se hace uso de los componentes con estado.

# Componentes con estado

Hasta el momento los componentes que se han hecho han sido simples en el sentido de que no contienen valores que puedan cambiar durante el ciclo de vida del componente, estos valores son los llamados **estados**.

Para agregar un estado a los componentes se hace uso del hook de estado de React `useState()`. Así podemos regresar *main.jsx* a su versión original y en cambio solo cambiar *App.jsx*

```jsx
import { useState } from "react";

const App = () => {
	const [counter, setCounter] = useState(0);

	setTimeout(() => setCounter(counter + 1), 1000);

	return (
		<div>
			{counter}
		</div>
	);
}
```

La función `useState()` debe ser importada desde React

```jsx
import { useState } from "react";
```

Recibe como parámetro el valor inicial del estado y devuelve un array con dos miembros.

```jsx
const [counter, setCounter] = useState(0);
```

El primer miembro representa el valor actual del estado, mientras que el segundo es una función que debe ser usada para modificar el estado. De esta forma `setTimeout()` cambia el valor de `counter` cada segundo, lo que provoca un re-renderizado del componente.

# Control de eventos

Podemos cambiar el componente para que el valor de `counter` cambie cuando se presione un botón. Esto es posible porque los diferentes elementos de una página web pueden producir una variedad de eventos a la hora de ser activados.

Para hacer que el cambio suceda al presionar un botón se puede hacer uso de los eventos de mouse, donde el click es el más común de ellos. Así el componente queda de la siguiente forma:

```jsx
const App = () => {
	const [counter, setCounter] = useState(0);

	const handleClick = () => {
		setCounter(counter + 1);
	};

	return (
		<div>
			<p>{counter}</p>
			<button onClick={handleClick}>
				Plus
			</button>
		</div>
	);
}
```

De esta forma, cada que el botón sea presionado se llamará a la función `handleClick()`, lo que cambiará el valor de `counter` y provocará un re-renderizado del componente.

El event handler también puede ser definido dentro del valor asignado al atributo `onClick` de la siguiente forma:

```jsx

<button onClick={() => setCounter(counter + 1)}>
	Plus
</button>
```

Podemos también agregar un botón para resetear el valor de `counter`:

```jsx
const App = () => {
	const [counter, setCounter] = useState(0);

	return (
		<div>
			<p>{counter}</p>
			<button onClick={() => setCounter(counter + 1)}>
				Plus
			</button>
			<button onClick={() => setCounter(0)}>
				Reset
			</button>
		</div>
	);
}
```

# Los event handlers son funciones

Cuando definimos los event handlers para los botones lo hicimos envolviendo la función `setCounter()` dentro de funciones flecha.

```jsx
<button onClick={() => setCounter(counter + 1)}>
	Plus
</button>
```

Si intentamos pasar directamente `setCounter()` romperemos la aplicación

```jsx
<button onClick={setCounter(counter + 1)}>
	Plus
</button>
```

![[Pasted image 20230625001015.png]]

Esto sucede porque un event handler debe de ser una función o la referencia a una función y cuando pasamos directamente `setCounter(counter + 1)` no estamos pasando la función `setCounter()` sino que estamos llamando a la función `setCounter()`. Esto provoca que cuando el componente se renderice llame a la función `setCounter()` cambiando el valor de `counter` a 1, lo que provoca un re-renderizado del componente. Esto a su vez provoca que `setCounter()` se llame de nuevo, lo que cambia el valor de `counter` a 2 y provoca un nuevo renderizado. Este ciclo se repetirá hasta que React considere que han sucedido muchos renderizados en poco tiempo.

Cuando envolvemos `setCounter()` dentro de una función, permitimos que dicha función sea llamada solo cuando se presione el botón, pues deja de ser una llamada de función.

# Pasando un estado a los componentes hijos

Es importante el escribir componentes que sean pequeños y reusables a través de la aplicación incluso entre proyectos. Es por ello, que es mejor dividir la aplicación en tres componentes más pequeños: uno para mostrar el valor del contador y dos para los botones.

A la hora de pasar datos a componentes una buena práctica es el "levantar el estado" en la jerarquía de componentes. Esto es, cuando varios componentes necesitan usar el mismo estado es mejor llevar dicho estado al componente ancestro común más cercano.

Por lo tanto, hay que dejar el estado en el componente `<App />` y transferirlo al resto de los componentes.

```jsx
const Display = ({ counter }) =>(
	<div>{counter}</div>
);

const Button = ({ text, handleClick }) => (
	<button onClick={handleClick}>{text}</button>
);
```

Así podemos hacer que el componente `<App />` se vea de la siguiente manera:

```jsx
const App = () => {
	const [counter, setCounter] = useState(0);

	const increaseByOne = () => setCounter(counter + 1);
	const decreaseByOne = () => setCounter(counter - 1);
	const resetCounter = () => setCounter(0);

	return (
		<div>
			<Display counter={counter} />
			<Button handleClick={increaseByOne} text="Increase" />
			<Button handleClick={decreaseByOne} text="Decrease" />
			<Button handleClick={resetCounter} text="Reset" />
		</div>
	);
}
```

Dado que ahora tenemos un componente `<Button />` fácil de reutilizar, esto nos permite implementar una nueva funcionalidad de forma simple y limpia.

# Los cambios del estado causan re-renderización

Cuando la aplicación comienza el código en `<App />` es ejecutado. Este código usa el hook `useState()` para crear un componente con estado y darle a `counter` dicho valor. Este componente contiene al componente `<Display />` y tres componentes `<Button />`, donde los componentes `<Button />` son usados para cambiar el valor del estado.

Cuando uno de los botones es presionado el event handler de este se ejecuta, esto produce un cambio en el estado del componente `<App />` usando la función `setCounter()`, lo que provoca un re-renderizado del componente.

Esto provoca un re-renderizado de los componentes. `<Display />` recibe el nuevo valor de `counter` como un prop y los botones reciben un event handler que puede ser usado para cambiar el estado del componente.