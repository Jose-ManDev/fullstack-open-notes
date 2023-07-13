import { ChangeEvent, FormEvent } from "react";
import Form from "./Form";
import Input from "./Input";
import Button from "./Button";

type SearchBarProps = {
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearch: (e: FormEvent<HTMLFormElement>) => void;
};

export default function SearchBar({
  value,
  handleChange,
  handleSearch,
}: SearchBarProps) {
  return (
    <Form handleSubmit={handleSearch}>
      <Input
        label={"Filter shown with"}
        value={value}
        handleChange={handleChange}
      />
      <Button type="submit">Search</Button>
    </Form>
  );
}
