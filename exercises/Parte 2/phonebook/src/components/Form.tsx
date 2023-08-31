import { FormEvent, ReactNode } from "react";

type FormSubmit = {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
};

export default function Form({ handleSubmit, children }: FormSubmit) {
  return <form onSubmit={handleSubmit}>{children}</form>;
}
