
# 0.4: Diagrama para la creación de notas nuevas

Crea un diagrama como el visto en el capítulo para la creación de una nota nueva en la página https://studies.cs.helsinki.fi/exampleapp/notes

*Solución:*

```mermaid
sequenceDiagram

participant Browser
participant Server

Browser ->> Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
activate Server
Server -->> Browser: Status Code 302 RELOAD
deactivate Server

Note right of Browser: Browser starts reloading  webpage
Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/notes
activate Server
Server -->> Browser: HTML Document
deactivate Server

Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
activate Server
Server -->> Browser: CSS File
deactivate Server

Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
activate Server
Server -->> Browser: JS File
deactivate Server

Note right of Browser: The browser starts executing the JS fie that fetches JSON file from server

Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
activate Server
Server -->> Browser: JSON File
deactivate Server

Note right of Browser: The browser executes the callback function that renders the notes
```

# 0.5 Diagrama de una SPA

Crea un diagrama mostrando la situación cuando el usuario va a la versión SPA de la aplicación de notas en [https://studies.cs.helsinki.fi/exampleapp/spa](https://studies.cs.helsinki.fi/exampleapp/spa).

```mermaid
sequenceDiagram

participant Browser
participant Server

Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/spa
activate Server
Server -->> Browser: HTML Document
deactivate Server

Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
activate Server
Server -->> Browser: CSS File
deactivate Server

Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
activate Server
Server -->> Browser: JS File
deactivate Server

Note right of Browser: The browser starts executing the JS fie that fetches JSON file from server

Browser ->> Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
activate Server
Server -->> Browser: JSON File
deactivate Server

Note right of Browser: The browser executes the callback function that renders the notes
```

# 0.6 Diagrama de una nueva nota en una SPA

Crea un diagrama mostrando la situación donde el usuario crea una nueva nota usando la versión SPA de la aplicación.

*Solución:*

```mermaid
sequenceDiagram

participant Browser
participant Server

Browser ->> Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
activate Server
Server -->> Browser: Status code 201 CREATED
deactivate Server
```

