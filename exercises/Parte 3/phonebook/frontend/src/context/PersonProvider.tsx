import { ReactNode, useEffect, useReducer } from "react";
import PersonsApi, { PersonAction, ACTIONS } from "../api/personsApi";
import { Filter, Sort } from "../utils/arrayUtils";
import { useNotificationContext } from "./NotificationProvider";
import { isInstanceOfError } from "../utils/errorUtils";
import { PersonContext } from "./PersonContext";
import { PersonRequestsContext } from "./PersonRequestsContext";
import { isAxiosError } from "axios";

function personsReducer(state: Person[], action: PersonAction): Person[] {
  switch (action.type) {
    case ACTIONS.GET_ALL: {
      return action.payload.persons.sort(Sort.byName);
    }
    case ACTIONS.ADD_PERSON: {
      return state.concat(action.payload.person).sort(Sort.byName);
    }
    case ACTIONS.UPDATE_PERSON: {
      return state
        .map((person) =>
          person.id !== action.payload.person.id
            ? person
            : action.payload.person
        )
        .sort(Sort.byName);
    }
    case ACTIONS.DELETE_PERSON: {
      return state.filter((person) => person.id !== action.payload.id);
    }
    default: {
      return state;
    }
  }
}

type PersonProviderProps = {
  children: ReactNode;
};

export function PersonProvider({ children }: PersonProviderProps) {
  const [persons, dispatchPersons] = useReducer(personsReducer, []);

  const createNotification = useNotificationContext();

  useEffect(() => {
    PersonsApi.getAllPersons(dispatchPersons);
  }, []);

  const checkIfPersonExists = (name: string) => {
    const matches = persons.filter(Filter.byName(name));

    return matches.length > 0;
  };

  const addPerson = (newPerson: Omit<Person, "id">) => {
    if (checkIfPersonExists(newPerson.name)) {
      return createNotification({
        type: "warning",
        message: `${newPerson.name} already exists in the phonebook`,
      });
    }

    PersonsApi.addPerson(newPerson, dispatchPersons)
      .then((person) => {
        createNotification({
          type: "success",
          message: `${person.name} was added to the phonebook`,
        });
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          switch (error.response?.status) {
            case 400: {
              createNotification({
                type: "error",
                message:
                  "Validation error, name must have at least three characters or phone number is not valid",
              });
              break;
            }
            default: {
              createNotification({
                type: "error",
                message: error.message,
              });
            }
          }
        } else {
          createNotification({ type: "error", message: "Unknown error" });
        }
      });
  };

  const updatePerson = (id: number, updatedPerson: Person) => {
    PersonsApi.updatePerson(id, updatedPerson, dispatchPersons)
      .then((person) => {
        createNotification({
          type: "success",
          message: `${person.name} was added successfully`,
        });
      })
      .catch((error) => {
        if (isInstanceOfError(error)) {
          createNotification({
            type: "error",
            message: error.message,
          });
        }
      });
  };

  const deletePerson = (id: number) => {
    PersonsApi.deletePerson(id, dispatchPersons)
      .then(() => {
        createNotification({
          type: "success",
          message: "The deletion was successful",
        });
      })
      .catch((error) => {
        if (isInstanceOfError(error)) {
          createNotification({
            type: "error",
            message: error.message,
          });
        }
      });
  };

  return (
    <PersonContext.Provider value={persons}>
      <PersonRequestsContext.Provider
        value={{ addPerson, updatePerson, deletePerson }}
      >
        {children}
      </PersonRequestsContext.Provider>
    </PersonContext.Provider>
  );
}
