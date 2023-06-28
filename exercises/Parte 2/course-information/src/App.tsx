import Course from "./features/Course";
import courses from "./utils/courses";

function App() {
  return (
    <div>
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  );
}

export default App;
