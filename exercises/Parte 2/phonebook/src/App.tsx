import { FormEvent, useState } from "react";
import AddPersonForm from "./features/AddPersonForm";
import PersonList from "./features/PersonList";

function App() {
  const [persons, setPersons] = useState<Person[]>([
    { id: 0, name: "Josh Atkinz" },
  ]);
  const [newName, setNewName] = useState("");

  const addPerson = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPersons(persons.concat({ id: persons.length, name: newName }));
    setNewName("");
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <AddPersonForm
        value={newName}
        handleChange={(e) => setNewName(e.target.value)}
        handleSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <PersonList persons={persons} />
    </div>
  );
}

export default App;
