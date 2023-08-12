import { FormEvent, ReactNode } from "react";

type FormSubmit = {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
};

export default function Form({ handleSubmit, children }: FormSubmit) {
  return (
    <form className="my-2" onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
