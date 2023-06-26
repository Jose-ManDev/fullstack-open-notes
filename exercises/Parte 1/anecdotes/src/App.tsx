import { useState } from "react";
import anecdotes from "./utils/anecdotes";
import { randInt } from "./utils/randomGenerator";
import Button from "./components/Button";

function App() {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <blockquote>{anecdotes[selected]}</blockquote>
      <Button handleClick={() => setSelected(randInt(anecdotes.length))}>
        Next Anecdote
      </Button>
    </div>
  );
}

export default App;
