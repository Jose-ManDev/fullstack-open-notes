import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input(props: InputProps) {
  const { children, ...defaultProps } = props;
  if (children)
    return (
      <label htmlFor={props.id}>
        {children}
        <input {...defaultProps} />
      </label>
    );
  return <input {...defaultProps} />;
}

export default Input;
