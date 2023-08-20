import { useState, ChangeEvent, FormEvent } from "react";
import Form from "./Form";
import Input from "./Input";
import Button from "./Button";

type SearchBarProps = {
  name: string;
  handleSearch: (s: string) => void;
};

export default function SearchBar({ name, handleSearch }: SearchBarProps) {
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
    <Form
      className="sticky z-40 top-0 flex items-end mb-4 bg-white"
      handleSubmit={handleSubmit}
    >
      <Input
        styles={{ container: "grow flex flex-col" }}
        name={name}
        value={searchTerm}
        placeholder="Search..."
        handleChange={handleChange}
      />
      <Button styles="p-0 w-6 h-6 text-gray-500" type="submit">
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
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </Button>
    </Form>
  );
}
