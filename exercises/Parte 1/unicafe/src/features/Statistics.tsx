import { ReactNode } from "react";
import Display from "../components/Display";

type StatisticsProps = {
  stats: {
    good: number;
    neutral: number;
    bad: number;
  };
};

export default function Statistics({ stats }: StatisticsProps) {
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

  return <Display title="Statistics" data={statsArray} />;
}
