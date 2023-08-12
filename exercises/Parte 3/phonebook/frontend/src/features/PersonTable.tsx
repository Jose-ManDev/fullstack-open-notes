import { useState, useEffect, FormEvent } from "react";
import Button from "../components/Button";
import { usePersonContext } from "../context/PersonContext";
import { usePersonRequestsContext } from "../context/PersonRequestsContext";
import SearchBar from "../components/SearchBar";
import { Filter } from "../utils/arrayUtils";

export default function PersonTable() {
  const persons = usePersonContext();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };
  return (
    <div>
      <SearchBar
        name="search_person"
        label="Search"
        handleSearch={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {persons.filter(Filter.byString(searchTerm)).map((person) => (
            <Person key={person.id} person={person} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type PersonProps = {
  person: Person;
};

function Person({ person }: PersonProps) {
  const { updatePerson, deletePerson } = usePersonRequestsContext();

  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.phone}</td>
      <td>
        <Button handleClick={() => deletePerson(person.id)}>Remove</Button>
      </td>
    </tr>
  );
}
