import { useState, ChangeEvent, FormEvent } from "react";
import Form from "./Form";
import Input from "./Input";
import Button from "./Button";

type SearchBarProps = {
  name: string;
  label: string;
  handleSearch: (s: string) => void;
};

export default function SearchBar({
  name,
  label,
  handleSearch,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchTerm);
    setSearchTerm("");
  };
  return (
    <Form handleSubmit={handleSubmit}>
      <Input
        name={name}
        label={label}
        value={searchTerm}
        handleChange={handleChange}
      />
      <Button type="submit">Search</Button>
    </Form>
  );
}
