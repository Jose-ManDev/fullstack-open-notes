import { createContext, useContext } from "react";

const PersonContext = createContext<Person[]>([]);

function usePersonContext() {
  return useContext(PersonContext);
}

export { PersonContext, usePersonContext };
