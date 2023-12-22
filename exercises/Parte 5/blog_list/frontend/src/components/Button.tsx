import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

function Button(props: ButtonProps) {
  return <button {...props}>{props.children}</button>;
}

export default Button;
