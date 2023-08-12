import { MouseEventHandler, ReactNode } from "react";
import { classNames } from "../utils/classUtils";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  primary?: boolean;
  isDisabled?: boolean;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

export default function Button({
  type = "button",
  primary = false,
  isDisabled = false,
  handleClick,
  children,
}: ButtonProps) {
  const styles = {
    base: "max-w-1/2 min-w-max px-2 py-1 grow font-medium tracking-wider uppercase hover:bg-slate-100 transition-colors",
    primary: "bg-gray-200 hover:bg-gray-300",
    isDisabled: "opacity-40",
  };

  const className = classNames(
    styles.base,
    primary && styles.primary,
    isDisabled && styles.isDisabled
  );
  return (
    <button
      className={className}
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
