import { useState } from "react";
import anecdotes from "../utils/anecdotes";
import { randInt } from "../utils/randomGenerator";
import Button from "../components/Button";

type votes = Record<number, number>;

export default function Anecdote() {
  const [selected, setSelected] = useState(0);

  const initialVotes = anecdotes.reduce((dict, _, index) => {
    return { ...dict, [index]: 0 };
  }, {});

  const [votes, setVotes] = useState<votes>(initialVotes);

  const getNextAnecdote = () => {
    let next = 0;

    do {
      next = randInt(anecdotes.length);

      if (next !== selected) return next;
    } while (next === selected);

    return next;
  };

  const handleVote = (anecdoteId: number) =>
    setVotes({ ...votes, [anecdoteId]: votes[anecdoteId] + 1 });

  const handleNext = () => setSelected(getNextAnecdote());

  return (
    <div>
      <blockquote>{anecdotes[selected]}</blockquote>
      <div>Has {votes[selected]}</div>

      <Button handleClick={() => handleVote(selected)}>Vote</Button>
      <Button handleClick={handleNext}>Next anecdote</Button>
    </div>
  );
}
