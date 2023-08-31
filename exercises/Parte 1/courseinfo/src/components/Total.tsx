type TotalProps = {
  parts: Array<{ exercises: number }>;
};

function Total({ parts }: TotalProps) {
  const total = parts.reduce(
    (accumulator, current) => accumulator + current.exercises,
    0
  );
  return <p>Number of exercises {total}</p>;
}

export default Total;
