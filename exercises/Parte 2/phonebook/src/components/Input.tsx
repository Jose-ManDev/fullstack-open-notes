import { ChangeEvent, HTMLInputTypeAttribute } from "react";

type InputProps = {
  label: string;
  type?: HTMLInputTypeAttribute;
  value: string | number | undefined;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  label,
  type = "text",
  value,
  handleChange,
}: InputProps) {
  return (
    <label>
      {label}
      <input type={type} value={value} onChange={handleChange} />
    </label>
  );
}
