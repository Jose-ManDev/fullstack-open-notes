import { useState } from "react";

function useToggle(initialState: boolean): [boolean, () => void] {
  const [state, setState] = useState(initialState);

  const toggleState = () => setState((prevState) => !prevState);

  return [state, toggleState];
}

export { useToggle };
