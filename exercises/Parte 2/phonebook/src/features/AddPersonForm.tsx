import { FormEvent, ChangeEvent } from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";

type AddPersonFormProps = {
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function AddPersonForm({
  value,
  handleChange,
  handleSubmit,
}: AddPersonFormProps) {
  return (
    <Form handleSubmit={handleSubmit}>
      <Input label="Name:" value={value} handleChange={handleChange} />
      <Button type="submit">Add</Button>
    </Form>
  );
}
