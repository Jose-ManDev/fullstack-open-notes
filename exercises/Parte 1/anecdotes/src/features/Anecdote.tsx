import { MouseEventHandler } from "react";
import Button from "../components/Button";

type votes = Record<number, number>;

type AnecdoteDisplayProps = {
  anecdote: { content: string; id: number };
  votes: votes;
  handleNext: MouseEventHandler<HTMLButtonElement>;
  handleVote: MouseEventHandler<HTMLButtonElement>;
};

function AnecdoteDisplay({
  anecdote,
  votes,
  handleNext,
  handleVote,
}: AnecdoteDisplayProps) {
  return (
    <div>
      <Anecdote content={anecdote.content} votes={votes[anecdote.id]} />

      <Button handleClick={handleVote}>Vote</Button>
      <Button handleClick={handleNext}>Next anecdote</Button>
    </div>
  );
}

type AnecdoteProps = {
  content: string;
  votes: number;
};

function Anecdote({ content, votes }: AnecdoteProps) {
  return (
    <>
      <blockquote>{content}</blockquote>
      <div>Has {votes}</div>
    </>
  );
}

export { Anecdote, AnecdoteDisplay };
