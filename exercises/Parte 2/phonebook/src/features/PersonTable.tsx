type PersonListProps = {
  persons: Person[];
};

export default function PersonTable({ persons }: PersonListProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {persons.map((person) => (
          <Person key={person.id} person={person} />
        ))}
      </tbody>
    </table>
  );
}

type PersonProps = {
  person: Person;
};

function Person({ person }: PersonProps) {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.phone}</td>
    </tr>
  );
}
