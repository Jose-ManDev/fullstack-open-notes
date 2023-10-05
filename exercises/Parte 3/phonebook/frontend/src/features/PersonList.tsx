import { useState } from "react";
import Button from "../components/Button";
import { usePersonContext } from "../context/PersonContext";
import { usePersonRequestsContext } from "../context/PersonRequestsContext";
import SearchBar from "../components/SearchBar";
import { Filter } from "../utils/arrayUtils";

export default function PersonList() {
  const persons = usePersonContext();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };
  return (
    <div className="relative h-full overflow-y-scroll md:col-span-2 place-self-stretch">
      <SearchBar name="search_person" handleSearch={handleSearch} />
      <ul>
        {persons.filter(Filter.byString(searchTerm)).map((person) => (
          <Person key={person.id} person={person} />
        ))}
      </ul>
    </div>
  );
}

type PersonProps = {
  person: Person;
};

function Person({ person }: PersonProps) {
  const { deletePerson } = usePersonRequestsContext();

  return (
    <div className="bg-white flex justify-between p-2 rounded-sm drop-shadow-md mb-1 transition-all">
      <div className="flex flex-col basis-4/5">
        <span className="font-semibold tracking-wider text-xl">
          {person.name}
        </span>
        <span className="text-slate-500">{person.phone}</span>
      </div>
      <div className="text-gray-500">
        <Button styles="w-6 h-6" handleClick={() => deletePerson(person.id)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 hover:scale-110 transition-transform"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
