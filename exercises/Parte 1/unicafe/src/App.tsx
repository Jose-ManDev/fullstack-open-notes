import { ReactNode, useState } from "react";
import FeedbackForm from "./features/FeedbackForm";
import Button from "./components/Button";
import Display from "./components/Display";

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

  const statsValue = {
    good: 1,
    neutral: 0,
    bad: -1,
  };

  const getTotal = () => stats.good + stats.neutral + stats.bad;
  const getAverage = () =>
    (stats.good * statsValue.good +
      stats.neutral * statsValue.neutral +
      stats.bad * statsValue.bad) /
      getTotal() || 0;
  const getPositive = () => (stats.good / getTotal()) * 100 || 0;

  const statsArray: Array<{ label: string; value: ReactNode }> = [
    { label: "Good", value: stats.good },
    { label: "Neutral", value: stats.neutral },
    { label: "Bad", value: stats.bad },
    { label: "Total", value: getTotal() },
    { label: "Average", value: getAverage().toFixed(2) },
    { label: "Positive", value: `${getPositive().toFixed(2)} %` },
  ];

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

      <Display title="Statistics" data={statsArray} />
    </div>
  );
}

export default App;
