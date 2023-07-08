import { FormEvent, useEffect, useState } from "react";
import AddPersonForm from "./features/AddPersonForm";
import PersonTable from "./features/PersonTable";
import SearchBar from "./components/SearchBar";
import PersonApi from "./api/personsApi";
import personsApi from "./api/personsApi";

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
  const searchById = (id: number, person: Person) => person.id === id;

  const isPersonOnList = () => persons.some(filterByName);

  const addPerson = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPersonOnList()) {
      const newPerson = {
        name: newName,
        phone: newPhone,
      };
      PersonApi.create(newPerson).then((returnedPerson) => {
        const newPersons = persons.concat(returnedPerson);
        setPersons(newPersons);
        setFilteredPersons(newPersons);
      });
    } else {
      const personToUpdate = persons.find(filterByName) as Person;
      const userConfirm = window.confirm(
        `${personToUpdate?.name} is already in the phonebook, replace the old number with a new one?`
      );

      if (userConfirm) {
        const updatedPerson = { ...personToUpdate, phone: newPhone };
        PersonApi.update(personToUpdate?.id, updatedPerson).then(
          (returnedPerson) => {
            const newPersons = persons.map((person) =>
              person.id !== personToUpdate.id ? person : returnedPerson
            );
            setPersons(newPersons);
            setFilteredPersons(newPersons);
          }
        );
      }
    }

    setNewName("");
    setNewPhone("");
  };

  const removePerson = (id: number) => {
    const person = persons.find((person) => searchById(id, person));
    const userConfirm = window.confirm(`Delete ${person?.name}`);

    if (userConfirm) {
      personsApi.remove(id).then(() => {
        const newPersons = persons.filter((person) => person.id !== id);
        setPersons(newPersons);
        setFilteredPersons(newPersons);
      });
    }
  };

  const searchPerson = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilteredPersons(persons.filter(searchByName));
    setSearch("");
  };

  useEffect(() => {
    PersonApi.getAll().then((initialPersons) => {
      setPersons(initialPersons);
      setFilteredPersons(initialPersons);
    });
  }, []);

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
      <PersonTable persons={filteredPersons} handleRemove={removePerson} />
    </div>
  );
}

export default App;
