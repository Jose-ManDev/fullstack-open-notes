type ContentProps = {
  part: string;
  exercises: number;
};

function Content({ part, exercises }: ContentProps) {
  return (
    <p>
      {part} {exercises}
    </p>
  );
}

export default Content;
