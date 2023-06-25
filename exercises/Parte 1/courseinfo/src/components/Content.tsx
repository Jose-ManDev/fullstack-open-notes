type ContentProps = { parts: Array<PartPromps> };

function Content({ parts }: ContentProps) {
  return (
    <div>
      <Part name={parts[0].name} exercises={parts[0].exercises} />
      <Part name={parts[1].name} exercises={parts[1].exercises} />
      <Part name={parts[2].name} exercises={parts[2].exercises} />
    </div>
  );
}

type PartPromps = {
  name: string;
  exercises: number;
};

function Part({ name, exercises }: PartPromps) {
  return (
    <p>
      {name} {exercises}
    </p>
  );
}

export default Content;
