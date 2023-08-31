import { FormEvent, ChangeEvent } from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";

type AddPersonFormProps = {
  nameValue: string;
  phoneValue: string;
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function AddPersonForm({
  nameValue,
  phoneValue,
  handleNameChange,
  handlePhoneChange,
  handleSubmit,
}: AddPersonFormProps) {
  return (
    <Form handleSubmit={handleSubmit}>
      <Input label="Name:" value={nameValue} handleChange={handleNameChange} />
      <Input
        label="Phone:"
        value={phoneValue}
        handleChange={handlePhoneChange}
      />
      <Button type="submit">Add</Button>
    </Form>
  );
}
