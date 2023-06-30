import { FormEvent, useState } from "react";
import AddPersonForm from "./features/AddPersonForm";
import PersonTable from "./features/PersonTable";

function App() {
  const [persons, setPersons] = useState<Person[]>([
    { id: 0, name: "Josh Atkinz", phone: "235-345-23-42" },
  ]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState<string>("");

  const filterByName = (person: Person) => person.name === newName;

  const isPersonOnList = () => persons.filter(filterByName).length === 0;

  const addPerson = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPersonOnList()) {
      setPersons(
        persons.concat({ id: persons.length, name: newName, phone: newPhone })
      );
      setNewName("");
      setNewPhone("");
    } else {
      alert(`${newName} already exists`);
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <AddPersonForm
        nameValue={newName}
        phoneValue={newPhone}
        handleNameChange={(e) => setNewName(e.target.value)}
        handlePhoneChange={(e) => setNewPhone(e.target.value)}
        handleSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <PersonTable persons={persons} />
    </div>
  );
}

export default App;
