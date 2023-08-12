import { FormEvent, ChangeEvent, useState } from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";
import { usePersonRequestsContext } from "../context/PersonRequestsContext";

export default function AddPersonForm() {
  const [personName, setPersonName] = useState("");
  const [personPhone, setPersonPhone] = useState("");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPersonName(e.target.value);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPersonPhone(e.target.value);
  };

  const { addPerson } = usePersonRequestsContext();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPerson({ name: personName, phone: personPhone });
    setPersonName("");
    setPersonPhone("");
  };
  return (
    <Form handleSubmit={handleSubmit}>
      <Input
        name="name"
        label="Name:"
        required
        value={personName}
        handleChange={handleNameChange}
      />
      <Input
        name="phone"
        label="Phone:"
        required
        value={personPhone}
        handleChange={handlePhoneChange}
      />
      <div className="flex justify-center">
        <Button type="submit" primary>
          Add
        </Button>
      </div>
    </Form>
  );
}
