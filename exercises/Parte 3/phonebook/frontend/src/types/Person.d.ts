type Person = {
  id: number;
  name: string;
  phone: string;
};

type PersonRequests = {
  addPerson: (person: Omit<Person, "id">) => void;
  updatePerson: (id: number, updatedPerson: Person) => void;
  deletePerson: (id: number) => void;
};
