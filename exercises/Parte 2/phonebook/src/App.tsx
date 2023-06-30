import { FormEvent, useState } from "react";
import AddPersonForm from "./features/AddPersonForm";
import PersonList from "./features/PersonList";

function App() {
  const [persons, setPersons] = useState<Person[]>([
    { id: 0, name: "Josh Atkinz" },
  ]);
  const [newName, setNewName] = useState("");

  const filterByName = (person: Person) => person.name === newName;

  const isPersonOnList = () => persons.filter(filterByName).length === 0;

  const addPerson = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPersonOnList()) {
      setPersons(persons.concat({ id: persons.length, name: newName }));
      setNewName("");
    } else {
      alert(`${newName} already exists`);
    }
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
