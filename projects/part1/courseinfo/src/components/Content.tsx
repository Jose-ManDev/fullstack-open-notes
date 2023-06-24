type CourseContent = {
  partName: string;
  exercises: number;
};

type ContentProps = { courses: CourseContent[] };

const Content = ({ courses }: ContentProps) => {
  return (
    <>
      {courses.map((course) => (
        <p>
          {course.partName} {course.exercises}
        </p>
      ))}
    </>
  );
};

export default Content;
