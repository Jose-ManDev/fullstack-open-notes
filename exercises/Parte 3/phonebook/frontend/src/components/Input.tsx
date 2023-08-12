import { ChangeEvent, HTMLInputTypeAttribute } from "react";

type InputProps = {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  value: string | number | undefined;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  name,
  label,
  required = false,
  type = "text",
  value,
  handleChange,
}: InputProps) {
  const styles = {
    container: "flex flex-col mb-3",
    label: "my-1 font-medium tracking-wide",
    input:
      "outline-0 px-2 py-px tracking-wide border-b border-b-gray-300 focus:border-b-cyan-500 transition-colors",
  };

  return (
    <div className={styles.container}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        className={styles.input}
        type={type}
        required={required}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
