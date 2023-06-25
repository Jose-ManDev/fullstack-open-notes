import Header from "./components/Header";
import Content from "./components/Content";
import Total from "./components/Total";

type Part = {
  name: string;
  exercises: number;
};

function App() {
  const course = "Half Stack application development";
  const part1: Part = {
    name: "Fundamentals of React",
    exercises: 10,
  };

  const part2: Part = {
    name: "Using props to pass data",
    exercises: 7,
  };

  const part3: Part = {
    name: "State of a component",
    exercises: 14,
  };

  const parts = [part1, part2, part3];

  return (
    <div>
      <Header course={course} />

      <Content parts={parts} />

      <Total exercises={[part1.exercises, part2.exercises, part3.exercises]} />
    </div>
  );
}

export default App;
