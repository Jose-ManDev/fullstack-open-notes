import { FormEvent, useEffect, useState } from "react";
import AddPersonForm from "./features/AddPersonForm";
import PersonTable from "./features/PersonTable";
import SearchBar from "./components/SearchBar";
import axios from "axios";

function App() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [search, setSearch] = useState("");
  const [filteredPersons, setFilteredPersons] = useState(persons);

  const filterByName = (person: Person) =>
    person.name.toLowerCase() === newName.toLowerCase();
  const searchByName = (person: Person) =>
    person.name.toLowerCase().includes(search.toLowerCase());

  const isPersonOnList = () => persons.some(filterByName);

  const addPerson = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPersonOnList()) {
      setPersons(
        persons.concat({ id: persons.length, name: newName, phone: newPhone })
      );
      setFilteredPersons(
        persons.concat({ id: persons.length, name: newName, phone: newPhone })
      );
      setNewName("");
      setNewPhone("");
    } else {
      alert(`${newName} already exists`);
    }
  };

  const searchPerson = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilteredPersons(persons.filter(searchByName));
    setSearch("");
  };

  useEffect(() => {
    axios.get("http://localhost:3000/persons").then((response) => {
      setPersons(response.data);
      setFilteredPersons(response.data);
    });
  }, []);

  console.log(persons);

  return (
    <div>
      <h1>Phonebook</h1>
      <SearchBar
        value={search}
        handleChange={(e) => setSearch(e.target.value)}
        handleSearch={searchPerson}
      />
      <h2>Add a new</h2>
      <AddPersonForm
        nameValue={newName}
        phoneValue={newPhone}
        handleNameChange={(e) => setNewName(e.target.value)}
        handlePhoneChange={(e) => setNewPhone(e.target.value)}
        handleSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <PersonTable persons={filteredPersons} />
    </div>
  );
}

export default App;
