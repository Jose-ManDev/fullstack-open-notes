type PersonListProps = {
  persons: Person[];
};

export default function PersonList({ persons }: PersonListProps) {
  return (
    <ul>
      {persons.map((person) => (
        <Person key={person.id} person={person} />
      ))}
    </ul>
  );
}

type PersonProps = {
  person: Person;
};

function Person({ person }: PersonProps) {
  return <li>{person.name}</li>;
}
