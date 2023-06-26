import { ReactNode, useState } from "react";
import FeedbackForm from "./features/FeedbackForm";
import Button from "./components/Button";
import Statistics from "./features/Statistics";

type Statistics = {
  good: number;
  neutral: number;
  bad: number;
};

function App() {
  const [stats, setStats] = useState<Statistics>({
    good: 0,
    neutral: 0,
    bad: 0,
  });

  const handleGoodFeedback = () => setStats({ ...stats, good: stats.good + 1 });
  const handleNeutralFeedback = () =>
    setStats({ ...stats, neutral: stats.neutral + 1 });
  const handleBadFeedback = () => setStats({ ...stats, bad: stats.bad + 1 });

  return (
    <div>
      <FeedbackForm>
        <Button handleClick={handleGoodFeedback}>Good</Button>
        <Button handleClick={handleNeutralFeedback}>Neutral</Button>
        <Button handleClick={handleBadFeedback}>Bad</Button>
      </FeedbackForm>

      <Statistics stats={stats} />
    </div>
  );
}

export default App;
