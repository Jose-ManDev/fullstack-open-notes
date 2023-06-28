import { ReactNode } from "react";

type HeaderProps = {
  children: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return <h2>{children}</h2>;
}
