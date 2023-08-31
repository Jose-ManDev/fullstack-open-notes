type Course = {
  id: number;
  name: string;
  parts: Array<Part>;
};

type Part = {
  name: string;
  exercises: number;
  id: number;
};
