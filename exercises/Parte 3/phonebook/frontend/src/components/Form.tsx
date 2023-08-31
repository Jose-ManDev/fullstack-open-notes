import { FormEvent, ReactNode } from "react";

type FormSubmit = {
  className: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
};

export default function Form({
  className,
  handleSubmit,
  children,
}: FormSubmit) {
  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
