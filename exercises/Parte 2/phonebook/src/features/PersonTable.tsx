import Button from "../components/Button";

type PersonListProps = {
  persons: Person[];
  handleRemove: (id: number) => void;
};

export default function PersonTable({
  persons,
  handleRemove,
}: PersonListProps) {
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
          <Person key={person.id} person={person} handleRemove={handleRemove} />
        ))}
      </tbody>
    </table>
  );
}

type PersonProps = {
  person: Person;
  handleRemove: (id: number) => void;
};

function Person({ person, handleRemove }: PersonProps) {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.phone}</td>
      <td>
        <Button handleClick={() => handleRemove(person.id)}>Remove</Button>
      </td>
    </tr>
  );
}
