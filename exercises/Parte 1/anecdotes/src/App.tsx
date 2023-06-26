import { useState } from "react";
import { AnecdoteDisplay, Anecdote } from "./features/Anecdote";
import anecdotes from "./utils/anecdotes";
import { randInt } from "./utils/randomGenerator";

type Votes = Record<number, number>;

function App() {
  const [selected, setSelected] = useState(0);

  const initialVotes = anecdotes.reduce((dict, _, index) => {
    return { ...dict, [index]: 0 };
  }, {});

  const [votes, setVotes] = useState<Votes>(initialVotes);

  const getNextAnecdote = () => {
    let next = 0;

    do {
      next = randInt(anecdotes.length);

      if (next !== selected) return next;
    } while (next === selected);

    return next;
  };

  const getMostVoted = () => {
    let mostVoted = 0;
    for (const key of Object.keys(votes)) {
      if (votes[Number(key)] > votes[mostVoted]) mostVoted = Number(key);
    }

    return mostVoted;
  };

  const handleNext = () => setSelected(getNextAnecdote());
  const handleVote = () =>
    setVotes({ ...votes, [selected]: votes[selected] + 1 });

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <AnecdoteDisplay
        anecdote={{ content: anecdotes[selected], id: selected }}
        votes={votes}
        handleNext={handleNext}
        handleVote={handleVote}
      />

      <h2>Anecdote with most votes</h2>
      <Anecdote
        content={anecdotes[getMostVoted()]}
        votes={votes[getMostVoted()]}
      />
    </div>
  );
}

export default App;
