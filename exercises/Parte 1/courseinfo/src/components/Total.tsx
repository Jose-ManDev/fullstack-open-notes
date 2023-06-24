type TotalProps = {
  exercises: number[];
};

function Total({ exercises }: TotalProps) {
  const total = exercises.reduce(
    (accumulator, current) => accumulator + current,
    0
  );
  return <p>Number of exercises {total}</p>;
}

export default Total;
