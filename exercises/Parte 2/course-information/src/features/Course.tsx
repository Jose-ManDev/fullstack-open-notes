import Header from "../components/Header";

type CourseProps = {
  course: Course;
};

export default function Course({ course }: CourseProps) {
  return (
    <div>
      <Header>{course.name}</Header>
      <Content content={course.parts} />
    </div>
  );
}

type ContentProps = {
  content: Array<Part>;
};

function Content({ content }: ContentProps) {
  return (
    <table>
      <tbody>
        {content.map((item) => (
          <Part key={item.id} part={item} />
        ))}
      </tbody>
      <Total parts={content} />
    </table>
  );
}

type PartProps = {
  part: Part;
};

function Part({ part }: PartProps) {
  return (
    <tr>
      <td>{part.name}</td>
      <td>{part.exercises}</td>
    </tr>
  );
}

type TotalProps = {
  parts: Array<Part>;
};

function Total({ parts }: TotalProps) {
  const getTotal = (sum: number, current: Part) => sum + current.exercises;
  return (
    <tfoot>
      <tr>
        <th>
          <span>Total of exercises</span>
        </th>
        <td>{parts.reduce(getTotal, 0)}</td>
      </tr>
    </tfoot>
  );
}
