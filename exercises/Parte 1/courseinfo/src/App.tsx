import Header from "./components/Header";
import Content from "./components/Content";
import Total from "./components/Total";

function App() {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  const parts = [
    { partName: part1, exercises: exercises1 },
    { partName: part2, exercises: exercises2 },
    { partName: part3, exercises: exercises3 },
  ];

  return (
    <div>
      <Header course={course} />

      <Content parts={parts} />

      <Total exercises={[exercises1, exercises2, exercises3]} />
    </div>
  );
}

export default App;
