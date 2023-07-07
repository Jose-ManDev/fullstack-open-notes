La forma más fácil de crear una página web con React es usando una herramienta llamada [create-react-app](https://github.com/facebook/create-react-app) que se puede instalar usando *npm*. Igualmente se puede usar una nueva herramienta llamada [Vite](https://vitejs.dev/).

Para crear una nueva aplicación llamada `part1` se debe ejecutar el siguiente comando en la consola:

```bash
npm create vite@latest
npm install
```

Y se puede correr la aplicación con el siguiente comando

```bash
npm run dev
```

La configuración predeterminada corre en el puerto 3000 del localhost con la dirección http://localhost:3000/.

Si se abre el navegador en esta dirección se verá algo como esto:

![[Pasted image 20230429205426.png]]

El código de la aplicación se encuentra en la carpeta *src*, donde en el archivo *main.tsx* podemos ver algo como esto:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

El archivo *App.tsx* se ve de la siguiente forma

```tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)  

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}  

export default App
```

Los archivos *App.css*, *index.css* y *react.svg* pueden ser eliminados ya que no se necesitan en la aplicación.

# Componentes

El archivo *App.tsx* define un [[https://react.dev/learn/your-first-component|componente de React]] llamado *App*. El comando final del archivo *main.tsx* renderiza su contenido dentro de un elemento `<div>` con un id `root` definido en el archivo en la ruta *../index.html*.

```tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

De forma predeterminada el archivo *index.html* no contiene nada de HTML que sea visible en el navegador:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Si bien puedes agregarle contenido lo más normal es que todo lo que se desee renderizar sea definido como componentes de React. Cambiemos el código del componente *App* al siguiente y analicémoslo:

```tsx
const App = () => (
	<div>
		<p>Hello, World!</p>
	</div>
);
```

Como se puede ver, el componente renderizará una etiqueta `<div>` que envuelve una etiqueta `<p>` conteniendo el texto `Hello, World!`.

Técnicamente el componente se define como una función de JavaScript que no recibe parámetros y que es asignada a la variable `App`. En este caso la función regresa el código HTML dentro de los paréntesis.

Al igual que todo código de JavaScript, el componente puede tener dentro el código de JavaScript que queramos, así que podemos modificarlo de la siguiente manera:

```tsx
const App = () => {
	console.log('Hello from component');
	return (
		<div>
			<p>Hello, World!</p>
		</div>
	);
}

export default App;
```

Y en la consola veremos lo siguiente:

![[Pasted image 20230429211714.png]]

Es posible incluso el renderizar contenido dinámico dentro del componente. Si modificamos el componente como sigue:

```tsx
const App = () => {
	const now = new Date();
	const a = 10;
	const b = 20;

	console.log(now, a + b);

	return (
		<div>
			<p>Hello world, it is {now.toString()}</p>
			<p>
				{a} plus {b} is {a + b}
			</p>
		</div>
	);
}
```

El código dentro de las llaves `{}` es evaluado y el resultado de esta evaluación es embebido dentro del código HTML producido por el componente dándonos la vista:

![[Pasted image 20230429212331.png]]

Igualmente se puede ver que algo se imprime en la consola:

![[Pasted image 20230429212457.png]]

# JSX

La estructura de los componentes de React está escrita en su mayoría en [[https://react.dev/learn/writing-markup-with-jsx|JSX]]. Si bien JSX luce como el código HTML, en realidad es una nueva forma de escribir código de JavaScript, de hecho, cuando el código se compila lo hace a código de JavaScript. Tras compilar la aplicación se ve así:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Hello world, it is ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' plus ', b, ' is ', a + b
    )
  );
}
```

La compilación es realizada por Vite en las aplicaciones creadas con Vite y por Babel en las aplicaciones creadas con create-react-app.

También es posible escribir código en JavaScript o TypeScript puro sin usar JSX o TSX pero sería un desperdicio de tiempo y esfuerzo.

En la práctica, JSX y TSX  son como el código HTML, con la diferencia de que estos permiten embeber contenido dinámico al escribir código de JavaScript entre llaves.

JSX es "XML-like", lo que significa que todas las etiquetas deben de ser cerradas. Por ejemplo, para crear una nueva línea en HTML se puede escribir de la siguiente manera:

```html
<br>
```

Pero en JSX, la etiqueta debe de ser cerrada

```tsx
<br/>
```

# Múltiples componentes

Modifiquemos el archivo *App.tsx* de la siguiente manera

```tsx
const Hello = () => {
	return (
		<div>
			<p>Hello world</p>
		</div>
	);
}

const App = () => {
	return (
		<div>
			<h1>Greetings</h1>
			<Hello />
		</div>
	);
}
```

Hemos definido un nuevo componente llamado *Hello* y lo hemos usado dentro del componente *App*. Igualmente, un componente puede ser usado múltiples veces:

```tsx
const App = () => {
	return (
		<div>
			<h1>Greetings</h1>
			<Hello />
			<Hello />
			<Hello />
		</div>
	);
}
```

Escribir componentes con React es fácil y al combinarlos podemos crear aplicaciones aún más complejas y que sigan siendo mantenibles. De hecho, la filosofía principal de React son las aplicaciones compuestas de muchos componentes especializados reutilizables.

Otra convención fuerte de React es la idea del *componente raíz* llamado *App* en lo más alto del árbol de componentes de la aplicación.

# Props: Pasando datos a los componentes

Es posible pasar datos a los componentes usando los llamados [props](https://react.dev/learn/passing-props-to-a-component). Modifiquemos el componente *Hello* de la siguiente manera:

```tsx
type HelloProps = {
	name: string;
}

const Hello = (props: HelloProps) => {
	return (
		<div>
			<p>Hello, {props.name}</p>
		</div>
	);
}
```

Ahora la función que define al componente tiene un parámetro *props*. Como un argumento, el parámetro recibe un objeto que tiene un campo para todos los "accesorios" que el usuario del componente defina.

Los props son definidos de la siguiente manera:

```tsx
const App = () => {
	return (
		<div>
			<h1>Greetings</h1>
			<Hello name="George"/>
			<Hello name="Daisy" />
		</div>
	);
}
```

Puede haber un número arbitrario de props y sus valores pueden ser strings "hard-coded" o el resultado de expresiones de JavaScript. Si el valor de un prop es obtenido usando JavaScript debe estar envuelto en llaves.

Podemos modificar el código para que el componente *Hello* use dos props:

```tsx
type HelloProps = {
	name: string;
	age: number;
}

const Hello = (props: HelloProps) => {
	console.log(props);
	return (
		<div>
			<p>Hello, {props.name}. You are {props.age} years old</p>
		</div>
	);
}

const App = () => {
	const name="Peter";
	const age = 10;
	return (
		<div>
			<h1>Greetings</h1>
			<Hello name="Maya" age={26 +10} />
			<Hello name={name} age={age} />
		</div>
	);
}
```

Los props enviados por el componente *App* son los valores de las variables.

![[Pasted image 20230429231756.png]]

Igualmente el componente *Hello* imprime en la consola el valor del objeto props:

![[Pasted image 20230429231826.png]]

# No renderices objetos

Considera una aplicación que imprime los nombres y edades de tus amigos en la pantalla:

```tsx
type Friend = {
	name: string;
	age: number;
}

const App = () => {
	const friends: Friends[] = [
		{name: "Peter", age: 4},
		{name: "Maya", age: 10}
	];

	return (
		<div>
			<p>{friends[0]}</p>
			<p>{friends[1]}</p>
		</div>
	);
}

export default App;
```

Si refrescamos el navegador veremos que en pantalla se nos muestra un mensaje de error:

![[Pasted image 20230430235358.png]]

Si observamos la consola veremos que se nos muestra un mensaje de error:

![[Pasted image 20230430235621.png]]

El causante de este problema está en el mensaje de error: *los Objetos no son válidos para ser hijos de un componente de React*. Esto es, la aplicación trata de renderizar los objetos y falla.

En React, las cosas individuales entre llaves deben ser valores primitivos, tales como los números o las strings.

Se puede solucionar de la siguiente manera:

```tsx
const App = () => {
  const friends: Friend[] = [
    { name: "Peter", age: 4 },
    { name: "Maya", age: 10 },
  ];

  return (
    <div>
      <p>
        {friends[0].name} {friends[0].age}
      </p>
      <p>
        {friends[1].name} {friends[1].age}
      </p>
    </div>
  );
};
```

Lo que permite que la página sea renderizada correctamente:

![[Pasted image 20230501000126.png]]

React también permite que las array sean renderizadas, por lo que el siguiente código funcionará correctamente siempre y cuando el array tenga valores primitivos.

```tsx
const App = () => {
  const friends: string[] = ["Peter", "Maya"];
  
  return (
    <div>
      <p>{friends}</p>
    </div>
  );
};
```

Aunque el resultado podría no ser el que queremos:

![[Pasted image 20230501000450.png]]

