import { MouseEventHandler } from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  children: string;
};

export default function Button({
  type = "button",
  handleClick,
  children,
}: ButtonProps) {
  return (
    <button type={type} onClick={handleClick}>
      {children}
    </button>
  );
}
