import { createContext, useContext } from "react";

const PersonRequestsContext = createContext<PersonRequests>({
  addPerson: () => undefined,
  updatePerson: () => undefined,
  deletePerson: () => undefined,
});

function usePersonRequestsContext() {
  return useContext(PersonRequestsContext);
}

export { PersonRequestsContext, usePersonRequestsContext };
