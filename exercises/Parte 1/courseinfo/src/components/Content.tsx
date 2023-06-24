type ContentProps = { parts: Array<PartPromps> };

function Content({ parts }: ContentProps) {
  return (
    <div>
      <Part partName={parts[0].partName} exercises={parts[0].exercises} />
      <Part partName={parts[1].partName} exercises={parts[1].exercises} />
      <Part partName={parts[2].partName} exercises={parts[2].exercises} />
    </div>
  );
}

type PartPromps = {
  partName: string;
  exercises: number;
};

function Part({ partName, exercises }: PartPromps) {
  return (
    <p>
      {partName} {exercises}
    </p>
  );
}

export default Content;
