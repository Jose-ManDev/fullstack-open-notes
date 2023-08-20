import { ChangeEvent, HTMLInputTypeAttribute } from "react";

type InputStyles = {
  container?: string;
  label?: string;
  input?: string;
};

type InputProps = {
  name: string;
  label?: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  styles?: InputStyles;
  value: string | number | undefined;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  name,
  label = "",
  required = false,
  type = "text",
  placeholder = "",
  styles,
  value,
  handleChange,
}: InputProps) {
  const defaultStyles = {
    container: "flex flex-col",
    label: "my-1 font-medium tracking-wide",
    input:
      "outline-0 px-2 py-px tracking-wide border-b border-b-gray-300 focus:border-b-cyan-500 transition-colors",
  };

  return (
    <div
      className={styles?.container ? styles.container : defaultStyles.container}
    >
      {label ? (
        <label
          htmlFor={name}
          className={styles?.label ? styles.label : defaultStyles.label}
        >
          {label}
        </label>
      ) : (
        ""
      )}
      <input
        className={styles?.input ? styles.input : defaultStyles.input}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
