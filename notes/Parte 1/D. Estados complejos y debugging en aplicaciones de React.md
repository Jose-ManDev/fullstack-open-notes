# Estados complejos

En los ejemplos anteriores el estado de la aplicación a sido simple, pero hay ocasiones donde la aplicación necesita estados más complejos como objetos o arrays.

La forma más simple de resolver este problema es usar la función `useState()` múltiples veces para así tener al estado original separado en diferentes piezas.

```jsx
const App = () => {
	const [left, setLeft] = useState(0);
	const [right, setRight] = useState(0);

	return (
		<div>
			{left}
			<button onClick={() => setLeft(left + 1)}>
				Left
			</button>
			{right}
			<button onClick={() => setRight(right + 1)}>
				Right
			</button>
		</div>
	);
}
```

De esta forma el componente tiene acceso tanto a `left` y `right` como estados y es capaz de cambiar su valor. Sin embargo, dado que un estado puede ser de cualquier tipo, también podemos guardar los valores de `left` y `right` en un solo objeto:

```jsx
{
	left: 0,
	right: 0
}
```

Para ello nuestra aplicación se debe ver de la siguiente manera:

```jsx
const App = () => {
	const [clicks, setClicks] = useState({
		left: 0,
		right: 0
	});

	const handleLeftClick = () => {
		const newClicks = {
			left: clicks.left + 1,
			right: clicks.right
		};
		setClicks(newClicks);
	}

	const handleRightClick = () => {
		const newClicks = {
			left: clicks.left,
			right: clicks.right + 1
		};
		setClicks(newClicks);
	}

	return (
		<div>
			{clicks.left}
			<button onClick={handleLeftClick}>
				Left
			</button>
			{clicks.right}
			<button onClick={handleRightClick}>
				Right
			</button>
		</div>
	);
}
```

Ahora el componente tiene un único estado e event handlers que se encarguen de cambiar el estado de la aplicación cuando sea necesario.

Haciendo uso de la desestructuración podemos hacer que los event handler sean más legibles:

```jsx
const handleLeftClick = () => {
	setClicks({
		...clicks,
		left: clicks.left + 1
	});
};
```

Si bien existe una forma directa de sumar 1 en JavaScript con el operador `++`, esto no es recomendable en React, ya que el operador `++` cambia directamente el estado, lo que puede llevar a comportamientos indeseados en la aplicación.

# Controlando arrays

Podemos agregar a la aplicación un array que recuerde todos los clicks que han sucedido en la aplicación

```jsx
const App = () => {
	const [clicks, setClicks] = useState({
		left: 0,
		right: 0
	});
	const [allClicks, setAllClicks] = useState([]);

	const handleLeftClick = () => {
		setAllClicks(allClicks.concat("L"));
		setClicks({...clicks, left: clicks.left + 1});
	};
	const handleRightClick = () => {
		setAllClicks(allClicks.concat("R"));
		setClicks({...clicks, right: clicks.right + 1});
	};

	return (
		<div>
			{clicks.left}
			<button onClick={handleLeftClick}>
				Left
			</button>
			{clicks.right}
			<button onClick={handleRightClick}>
				Right
			</button>
			<p>
				{allClicks.join(" ")}
			</p>
		</div>
	);
}
```

De esta forma todos los clicks son guardados en una pieza de estado separada que se inicializa como un array vacío.

# Actualizar un estado asíncrono

Actualicemos la aplicación para que también guarde la cantidad de veces que un botón ha sido presionado en el estado `total` cuyo valor se tendrá que actualizar cada que un botón sea presionado:

```jsx
const App = () => {
	const [clicks, setClicks] = useState({
		left: 0,
		right: 0
	});
	const [allClicks, setAllClicks] = useState([]);
	const [total, setTotal] = useState(0);

	const handleLeftClick = () => {
		setAllClicks(allClicks.concat("L"));
		setClicks({...clicks, left: clicks.left + 1});
		setTotal(clicks.left + clicks.right);
	};
	const handleRightClick = () => {
		setAllClicks(allClicks.concat("R"));
		setClicks({...clicks, right: clicks.right + 1});
		setTotal(clicks.left + clicks.right);
	};

	return (
		<div>
			{clicks.left}
			<button onClick={handleLeftClick}>
				Left
			</button>
			{clicks.right}
			<button onClick={handleRightClick}>
				Right
			</button>
			<p>
				{allClicks.join(" ")}
			</p>
			<p>
				{total}
			</p>
		</div>
	);
}
```

Cuando ejecutamos este código podemos notar que el valor de `total` es siempre menor en uno al total de veces que se han presionado los botones por alguna razón.

![[Pasted image 20230625185745.png]]

Podemos agregar `console.log()` para darnos una idea de por qué pasa eso.

```jsx
const handleLeftClick = () => {
	setAllClicks(allClicks.concat("L"));
	console.log("left before", clicks.left);
	setClicks({...clicks, left: clicks.left + 1});
	console.log("left after", clicks.left);
	setTotal(clicks.left + clicks.right);
};
```

La consola nos muestra el problema

![[Pasted image 20230625190200.png]]

Aunque se ha cambiado el valor de `left` al llamar `setClicks()` el valor anterior se mantiene a pesar de la actualización, por lo que al llamar `setTotal()` se produce este error. La razón de dicho error es que la actualización del estado en React sucede de forma asíncrona, no inmediata, es decir, sucede en un punto antes de que el componente se renderice otra vez.

Podemos resolver este problema de la siguiente forma:

```jsx
const handleLeftClick = () => {
	setAllClicks(allClicks.concat("L"));
	setClicks({...clicks, left: clicks.left + 1});
	setTotal(clicks.left + clicks.right + 1);
};
```

# Renderizado condicional

Podemos modificar el componente para que renderice el historial de clicks en un nuevo componente `<History />`:

```jsx
const History = ({ allClicks }) => {
	if (allClicks.length === 0) {
		return (
			<div>
				The app is used by pressing the button
			</div>
		);
	}

	return (
		<div>
			Button press history: {allClicks.join(" ")}
		</div>
	);
};

export default App() {
	// ...

	return (
		<div>
			{clicks.left}
			<button onClick={handleLeftClick}>
				Left
			</button>
			{clicks.right}
			<button onClick={handleRightClick}>
				Right
			</button>
			<History allClicks={allClicks} />
			<p>
				{total}
			</p>
		</div>
}
```

De esta forma el comportamiento del componente depende de si se han presionado los botones o no. Si no se ha presionado ningún botón significa que el array `allClicks` está vacío y por lo tanto se renderizará

```jsx
<div>
	The app is used by pressing the button
</div>
```

En cambio, si se ha presionado al menos una vez un botón se renderizará el historial de los botones presionados:

```jsx
<div>
	Button press history: {allClicks.join(" ")}
</div>
```

Cuando un componente renderiza elementos diferentes dependiendo del estado de la aplicación se llama *renderizado condicional*.

Por último podemos refactorizar aún más el componente `<App />` usando el componente `<Button />` que se creó anteriormente:

```jsx
export default App() {
	const [clicks, setClicks] = useState({
		left: 0,
		right: 0
	});
	const [allClicks, setAllClicks] = useState([]);

	const handleLeftClick = () => {
		setAllClicks(allClicks.concat("L"));
		setClicks({...clicks, left: clicks.left + 1});
	};
	const handleRightClick = () => {
		setAllClicks(allClicks.concat("R"));
		setClicks({...clicks, right: clicks.right + 1});
	};

	return (
		<div>
			{clicks.left}
			<Button handleClick={handleLeftButton} text={"Left"} />
			<Button handleClick={handleRightButton} text={"Right"} />
			{clicks.right}
			<History allClicks={allClicks} />
		</div>
	);
}
```

# Reglas de los hooks

Hay ciertas limitaciones y reglas que seguir a la hora de trabajar con los hooks en una aplicación para hacerlo correctamente.

La función `useState()` **no debe ser llamada dentro de un loop**, una expresión condicional o ningún lugar que no sea sea una función definiendo un componente. Esto debe ser así para asegurar que los hooks siempre son llamados en el mismo orden ya que de no serlo la aplicación se puede comportar de formar errática.

# Una función que regresa funciones

Una forma de definir los event handlers es usando *una función que regresa una función*. Esto nos permite llamar a una función dentro de un event handler.

```jsx
const App = () => {
	const [value, setValue] = useState(10);

	const hello = () => {
		const handler = () => console.log("Hello, world");

		return handler;
	};

	return (
		<div>
			{value}
			<button onClick={hello()}>button</button>
		</div>
	)
}
```

El código funciona correctamente, pues el atributo `onClick` recibe la función que regresa la función `hello()` al ser llamada.

# Pasando event handlers a componentes hijos

Tomemos el siguiente componente:

```jsx
const Button = ({ handleClick, text }) => {
	return (
		<button onClick={handleClick}>
			{text}
		</button>
	);
};
```

El componente recibe un event handler desde el prop `handleClick` que luego es pasado al atributo `onClick`, es decir, es posible pasar funciones como props.

# No se deben definir componentes dentro de un componente

Si bien podemos definir componentes dentro de otros componentes:

```jsx
const App = () => {
	const Hello = () => <div>Hello, world</div>;

	return (
		<div>
			This is a component
			<Hello />
		</div>
	);
}
```

Esto no debe hacerse ya que el método no provee ningún beneficio, y peor aún, causa más problemas. Lo peor de esto es que React toma a los componentes dentro de otro componente como un nuevo componente en cada renderizado, esto hace imposible que se pueda optimizar.

Lo mejor es mover al componente `<Hello />` fuera del componente `<App />`.