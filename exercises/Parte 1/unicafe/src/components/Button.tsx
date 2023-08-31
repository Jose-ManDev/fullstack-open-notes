import { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

export default function Button({ handleClick, children }: ButtonProps) {
  return <button onClick={handleClick}>{children}</button>;
}
