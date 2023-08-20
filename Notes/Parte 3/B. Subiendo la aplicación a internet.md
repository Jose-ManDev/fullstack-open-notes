Ahora es momento de conectar el frontend con el backend, ya que la URL ha cambiado ligeramente es momento de cambiarla:

```tsx
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/notes";

const getAll = () => {
	const request = axios.get(BASE_URL);
	return request.then(response => response.data);
};

// ...
```

Sin embargo, al enviar la petición GET se nos muestra un error en la consola:

![[Pasted image 20230715215941.png]]

# Same origin policy y CORS

El problema radica en algo llamado `same origin policy`. Una URL es definida por la combinación del protocolo (esquema o scheme), nombre del host (hostname) y puerto.

```
http://example.com:80/index.html

protocol: http
host: example.com
port: 80
```

Cuando se visita un sitio web el navegador web envía una petición al servidor donde la página se aloja, la respuesta enviada por el servidor es un archivo HTML que puede contener una o más referencias a activos/recursos alojados ya sea en el mismo servidor que la página web o en un sitio web diferente.

Cuando el navegador ve una referencia a una URL en el archivo HTML envía una petición, si la petición es enviada usando la URL del que fue obtenido el archivo HTML el navegador procesará la respuesta sin ningún problema. Sin embargo, si el recurso es obtenido usando una URL que no comparte el mismo origen (scheme, host, puerto) que el HTML fuente el navegador revisa el header de la respuesta `Access-Control-Allow-origin`. Si contiene `*` o la URL de la fuente del HTML el navegador procesará la respuesta, de no ser así el navegador se rehusará a procesarla y lanzará un error.

La **política de mismo origen** (`same-origin policy`) es un mecanismo de seguridad que fue implementado en los navegadores con la intención de prevenir el secuestro de sesión entre otras vulnerabilidades de seguridad.

Para permitir de forma legítima las peticiones de origen cruzado o cross-origin (peticiones de URLs que no comparten el mismo origen) la W3C llegó con un mecanismo llamado [**CORS**](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (Cross-Origin Resource Sharing):

> El intercambio de recursos cruzado, por sus siglas en inglés, **CORS** es un mecanismo que permite a recursos restringidos en un página web ser solicitados a otro servidor fuera del dominio donde el primer recurso fue obtenido.
> 
> Una página web puede embeber libremente imágenes, hojas de estilo, scripts, iframes y videos de cross-origin. Ciertas solicitudes de "cross-domain" (generalmente peticiones de Ajax) están prohibidas por defecto por la misma same-origin security policy.

El problema es que por defecto el código de JavaScript de una aplicación que corre en el navegador solo se puede comunicar con el servidor en el mismo origen. Debido a esto, el servidor localhost en el puerto 3000 y el frontend en otro puerto no tienen el mismo origen.

La same-origin policy y CORS no son específicos de React o Node, sino que son principios universales para la operación segura de aplicaciones web.

Para permitir las peticiones de otros orígenes se usa el middleware de Node `cors`. Para ello hay que instalarlo:

```sh
npm install cors
```

Y usar el middleware en el código:

```ts
const cors = require("cors");

app.use(cors());
```

Y con esto el frontend vuelve a servir.

# La aplicación al internet

Ahora que el stack está listo es el momento de subir la aplicación a internet. Para ello existen gran cantidad de servicios que pueden ser usados para alojar una aplicación en internet. Servicios amigables a los desarrolladores como PaaS (Platform as Service) toman la responsabilidad de instalar el entorno de ejecución (Node.js, etc.) y pueden proveer otros servicios como bases de datos.

Dos de los servicios que tienen un plan gratuito aunque limitado son [Fly.io](https://fly.io/) y [Render](https://render.com/), aunque existen otros servicios como:

- [Cyclic](https://www.cyclic.sh/)
- [Replit](https://replit.com/)
- [CodeSandBox](https://codesandbox.io/)

Tanto en Fly.io y Render se necesitan hacer algunos cambios a la definición del puerto que la aplicación usa hasta el fondo de *index.js*:

```ts
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
```

De esta forma se usa el puerto definido en la [variable de entorno](https://en.wikipedia.org/wiki/Environment_variable) `PORT` o el puerto 3000 si la variable no está definida.

# Fly.io

Fly.io da por defecto dos máquinas virtuales que se pueden usar para correr dos aplicaciones al mismo tiempo. Para comenzar a utilizarlo se necesita instalar el ejecutable `flyctl` y tras esto crear una cuenta de Fly.io.

Para autentificarse mediante la línea de comandos se ejecuta el siguiente comando:

```sh
fly auth login
```

Y para inicializar una app se debe de correr el siguiente comando en el directorio de la aplicación:

```sh
fly launch
```

Lo siguiente es darle a la aplicación un nombre o dejar que Fly.io le de uno, escoger la región donde la app correrá y no crear una base de datos ya que no es necesaria. Cuando pregunte si se quiere desplegar la aplicación se debe responder que no, pues aún quedan algunos ajustes que hacer.

Fly.io crea un archivo *fly.toml* en la raíz del proyecto donde la app está configurada. Para que la aplicación corra se debe de agregar el puerto en la parte `[env]` de las configuraciones:

```toml
[env]
	PORT = "8080"

[experimental]
	auto_rollback = true

[[services]]
	http_checks = []
	internal_port = 8080
	processes = ["app"]

```

En algunos casos el archivo generado tendrá la siguiente configuración:

```toml
internal_port = 3000
```

Lo que puede causar un error al momento de desplegar la aplicación y que la volvería inaccesible, para evitar esto se debe cambiar `internal_port` a 8080.

Por último, para desplegar la aplicación se realiza el siguiente comando:

```sh
fly deploy
```

Si todo va bien se puede abrir la aplicación en el navegador con el siguiente comando:

```sh
fly open
```

Una vez que la aplicación ha sido configurada se puede actualizar cuando sea necesario usando el comando:

```sh
fly deploy
```

Un comando importante es `fly logs`. Este nos muestra los registros del servidor.

# Build de producción del frontend

Hasta el momento se ha usado el *modo de desarrollo*. En este modo la aplicación está configurada para dar mensajes claros de error, renderizar los cambios en cuanto el código cambia y otras cosas.

Sin embargo, cuando la aplicación es desplegada debe crear una build de producción o una versión de la aplicación que esté optimizada para producción. Esta build se puede crear mediante el comando:

```sh
npm run build
```

Este comando crea una carpeta llamada *build* que contiene el único archivo HTML de la aplicación, *index.html* y contiene una carpeta de nombre *static*.  Dentro de esta carpeta se encuentra el código de JavaScript de la aplicación minificado. Este código, guardado en un solo archivo, representa en un solo archivo todo el código de JavaScript y React que hayamos escrito así como el de todas las dependencias de la aplicación.

El código minificado no es legible y luce parecido a esto:

```js
!function(e){function r(r){for(var n,f,i=r[0],l=r[1],a=r[2],c=0,s=[];c<i.length;c++)f=i[c],o[f]&&s.push(o[f][0]),o[f]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(p&&p(r);s.length;)s.shift()();return u.push.apply(u,a||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,i=1;i<t.length;i++){var l=t[i];0!==o[l]&&(n=!1)}n&&(u.splice(r--,1),e=f(f.s=t[0]))}return e}var n={},o={2:0},u=[];function f(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,f),t.l=!0,t.exports}f.m=e,f.c=n,f.d=function(e,r,t){f.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},f.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})
```

# Enviando archivos estáticos desde el servidor

Una forma de desplegar el frontend es copiar la build de producción en la raíz del repositorio del backend y configurar el backend para mostrar la página principal del frontend como su página principal. Esto se puede hacer con el siguiente comando en Linux

```sh
cp -r build ../backend
```

En Windows se puede hacer de la siguiente manera:

```ps1
copy build ../backend
```

Para que Express pueda mostrar contenido estático debemos hacer uso del middleware nativo *static*:

```ts
app.use(express.static("build"));
```

De esta forma cada que Express reciba una petición HTTP GET revisará primero si el directorio *build* contiene un archivo correspondiente a la dirección de la petición. Si el archivo es encontrado lo devolverá.

Ahora peticiones HTTP GET  a las direcciones www.serveraddress.com/index.html o www.serveraddress.com/ mostrarán el frontend de la aplicación, además, peticiones como www.serveraddress.com/api/notes serán manejadas por el código del backend.

Debido a esto tanto el frontend como el backend se encuentran en la misma dirección, por lo que podemos declarar `BASE_URL` como una URL relativa:

```ts
import axios from "axios";

const BASE_URL = "/api/notes";

const getAll = () => {
	const request = axios.get(BASE_URL);
	return request.then(response => response.data);
};
```

Tras el cambio se debe crear una nueva build de producción y copiarla en la raíz del repositorio del backend. Ahora se puede usar la aplicación desde la dirección del backend como toda single-page app: http://localhost:3000.

![[Pasted image 20230718210948.png]]

El archivo que nos devuelve contienes las instrucciones para obtener las hojas de estilo de CSS y las dos etiquetas `<script/>` que le dan instrucciones al navegador de obtener el código de JavaScript de la aplicación. El código de React obtiene las notas desde el servidor y las renderiza en la pantalla.

La estructura de la aplicación es como sigue:

![[Pasted image 20230718211555.png]]

# La aplicación completa en internet

Una vez que se haya confirmado de que la aplicación funciona correctamente es momento de pasar la build de producción del frontend a el repositorio del backend y enviar el código a GitHub de nuevo.

Si se está usando Render con solo enviarlo a GitHub será suficiente, pero en el  caso de Fly.io se debe usar el comando

```sh
fly deploy
```

La aplicación funciona correctamente, sin embargo, no tiene una base de datos, por lo que si el servidor se cae o se reinicia los datos almacenados desaparecerán.

La configuración se ve de la siguiente manera:

![[Pasted image 20230729180804.png]]

# Optimización de la implementación del frontend

Para crear una nueva build de producción sin trabajo extra es necesario agregar npm-scripts al *package.json* del repositorio backend:

## Script para Fly.io

El script se verá de la siguiente manera:

```json
{
  "scripts": {
    // ...
    "build:ui": "rm -rf build && cd ../part2-notes/ && npm run build && cp -r build ../notes-backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",    
    "logs:prod": "fly logs"
  }
}
```

El script `npm run buil:ui` crea la build del frontend y la copia a la versión de producción en el repositorio del backend. `npm run deploy` libera el backend actual a Fly.io.

El script `npm run deploy:full` combina estos dos scripts. Igualmente hay un script `npm run logs:prod` para mostrar los logs de Fly.io.

## Script para Render

En Render el script se verá de la siguiente manera:

```json
{
  "scripts": {
    //...
    "build:ui": "rm -rf build && cd ../frontend && npm run build && cp -r build ../backend",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push"
  }
}
```

# Proxy

Los cambios en el frontend han provocado que ya no funcione en el modo de desarrollo (cuando se inicia con `npm start`), ya que la conexión con el backend ya no funciona.

Esto se debe a que se ha cambiado la dirección del backend usando una URL relativa:

```ts
const BASE_URL = "/api/notes";
```

Dado que en el modo de desarrollo en frontend está en un puerto diferente al del backend (http://localhost:3000) las solicitudes van hacia ese puerto en vez del puerto 3000 del backend.

Si el proyecto se ha creado con create-react-app se puede resolver fácilmente agregando el campo  `proxy` dentro de *package.json*:

```json
{
  "dependencies": {
    // ...
  },
  "scripts": {
    // ...
  },
  "proxy": "http://localhost:3001"
}
```

