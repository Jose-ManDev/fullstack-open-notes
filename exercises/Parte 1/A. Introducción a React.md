# 1.1 Información del curso

Usa *Vite* para inicializar una nueva aplicación. Modifica *App.tsx* para que sea como sigue:

```tsx
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App;
```

Y remueve los archivos extra.
Ya que la aplicación está en un solo componente refactoriza el código para que sean tres: *Header*, *Content* y *Total*. Todos los datos deben de mantenerse en el componente *App* que pasará los datos necesarios a cada componente usando *props*.