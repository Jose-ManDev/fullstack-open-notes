import { ReactNode, useState } from "react";
import Button from "./Button";

type TogglableProps = {
  isShown?: boolean;
  buttonLabel: string;
  children: ReactNode;
};

function Togglable({ isShown, buttonLabel, children }: TogglableProps) {
  const [visible, setVisible] = useState(isShown);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "inline-block" : "none" };

  const toggleVisibility = () => setVisible(!visible);

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <Button onClick={toggleVisibility}>Hide</Button>
      </div>
    </div>
  );
}

export default Togglable;
