import { MouseEventHandler, ReactNode } from "react";
import { classNames } from "../utils/classUtils";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  primary?: boolean;
  isDisabled?: boolean;
  styles?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

export default function Button({
  type = "button",
  primary = false,
  isDisabled = false,
  handleClick,
  styles,
  children,
}: ButtonProps) {
  const defaultStyles = {
    base: "rounded-sm max-w-1/2 min-w-max px-2 py-1 font-medium tracking-wider uppercase hover:brightness-90 transition-all",
    primary: "bg-gray-200 hover:bg-gray-300",
    isDisabled: "opacity-40",
  };

  const className = classNames(
    defaultStyles.base,
    primary && defaultStyles.primary,
    isDisabled && defaultStyles.isDisabled,
    styles || false
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
