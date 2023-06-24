type CourseContent = {
  partName: string;
  exercises: number;
};

type TotalProps = { courses: CourseContent[] };

const Total = ({courses}: TotalProps) => {
  let total: number = courses.reduce();
}