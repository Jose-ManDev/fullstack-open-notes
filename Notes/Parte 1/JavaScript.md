# Variables

En JavaScript existen varias formas de declarar variables:

```javascript
const x = 1;
let y = 4;

console.log(x, y); //-> 1, 5

y += 10;
console.log(x, y); //-> 1, 15

y = "something";
console.log(x, y); //-> 1, "something"

x = 2; //-> TypeError: Assignment to constant variable.
 
```

La palabra clave `const` define una constante, es decir, un valor que no puede cambiar. Por otro lado, `let` define una variable cuyo valor no solo puede cambiar, sino también su tipo. En el ejemplo se ve como la variable `y` que en un principio guarda un número termina guardando un data de tipo string.

Es posible también el definir variables usando la palabra clave `var`, la cual durante mucho tiempo fue la única forma de crear variables en JavaScript, pero esto cambio en la versión ES6, donde se agregó `const` y `let`.

# Arrays

Los arrays o arreglos son una estructura de datos ordenados que también posee JavaScript, estos son unos ejemplos de su uso.


```javascript
const array = [1, 2, 3];

t.push(4);

console.log(t.length); //-> 4
console.log(t[1]); //-> 2

t.forEach(value => {
	console.log(value); //-> 1, 2, 3, 4
});
```

Como se puede ver, el contenido de un array puede ser modificado incluso cuando está definida con la palabra `const`. Esto de debe a que los array son objetos y, por lo tanto, la variable siempre apunta al mismo objeto.

Los array al ser objetos también tienen propiedades útiles como `length` o métodos como `forEach()`	y `concat()`. `forEach()` es un método que, como su nombre lo dice, ejecuta una función para cada miembro del array. Mientras que `concat()` es un método que sigue el paradigma de la programación funcional. Esto es, en lugar de directamente concatenar a un array un valor, este crea un nuevo array con el valora ya agregado.

```javascript
const array = [1, 2, 3];

const array2 = array.concat(4);

console.log(array); //-> [1, 2, 3]
console.log(array2); //-> [1, 2, 3, 4]
```

Existen otros métodos igualmente útiles como `map()`, el cual ejecuta una función para cada miembro del array y devuelve un array con los resultados de dicha ejecución.

```javascript
const array = [1, 2, 3];

const array2 = array.map(item => item * 2);

console.log(array); //-> [1, 2, 3]
console.log(array2); //-> [2, 4, 6]
```

Los array en JavaScript soportan la desestructuración, esto es, es posible darle un nombre a cada miembro del array tomando en cuenta su posición:

```javascript
const array = [1, 2, 3, 4, 5, 6];
const [first, second, third, ...rest] = array;

console.log(first, second, third); //-> 1, 2, 3
console.log(rest); //-> [4, 5, 6]
```

# Objetos

Existen varias formas de definir objetos en JavaScript. Una de ellas son los objetos literales, los cuales son objetos en los que se enlistan sus propiedades entre llaves `{}`.

```javascript
const object1 = {
	name: "Arthur Pendragon",
	age: 25,
	education: null
};

const object2 = {
	name: "Fullstack Web Development",
	level: "intermediate",
	size: 5
};

const object3 = {
	name: {
		first: "Charles",
		last: "Darwin"
	},
	grades: [1, 2, 3, 4];
	deparment: "biology"
};
```

Los valores de las propiedades pueden ser de cualquier tipo (incluso otros objetos) y pueden ser referenciadas usando la notación de punto o usando corchetes `[]`.

```javascript
console.log(object1.name); //-> "Arthur Pendragon"

const ageField = "age";
console.log(object1[ageField]); //-> 25
console.log(object1["education"]); //-> null
```

Incluso se pueden agregar propiedades de la misma forma

```javascript
object1.country = "Britain";
object1["fiancee"] = "Guinevere";
```

# Funciones

De igual forma existen varias formas de crear funciones en JavaScript, la más simple de ellas son las funciones flecha.

```javascript
const sum = (number1, number2) => {
	console.log(number1, number2);
	
	return number1 + number2;
};

const result = sum(2, 4); //-> 2, 4

console.log(result); //-> 6
```

Si la función tiene un solo parámetro se puede prescindir de los paréntesis.

```javascript
const square = p => {
	console.log(p);

	return p * p;
};
```

Si la función solo tiene una sola expresión dentro de ella igualmente se puede prescindir de las llaves y la función regresará el resultado de esa última expresión.

```javascript
const square = p => p * p;

console.log(square(3)); //-> 9
```

Las funciones flecha son muy útiles para usar funciones anónimas dentro de otras funciones de JavaScript, como los métodos de las array. Una función anónima es simplemente una función que no tiene nombre.

```javascript
const array = [1, 2, 3];

const arraySquared = array.map(p => p * p);
```

Si queremos darle nombre a la función igualmente podemos hacerlo

```javascript
const square = p => p * p;

const array = [1, 2, 3];

const arraySquared = array.map(square);
```

Existe otra forma de crear funciones, esta es la declaración con la palabra clave `function`.

```javascript
function product(a, b) {
return a * b;
}

const result = product(4, 6);

console.log(result); //-> 24
```

Igualmente se pueden crear funciones anónimas o asignarlas a una variable

```javascript
const array = [1, 2, 3];

const arraySquared = array.map(function(item) {
	return item * item;
});

const square = function(a) {
	return a * a;
}
```