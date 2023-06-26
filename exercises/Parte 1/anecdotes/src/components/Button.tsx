import { MouseEventHandler } from "react";

type ButtonProps = {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  children: string;
};

export default function Button({ handleClick, children }: ButtonProps) {
  return <button onClick={handleClick}>{children}</button>;
}
