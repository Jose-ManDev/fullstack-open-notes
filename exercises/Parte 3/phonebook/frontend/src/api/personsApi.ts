import axios from "axios";

export enum ACTIONS {
  GET_ALL = "GET_ALL",
  GET_PERSON = "GET_PERSON",
  ADD_PERSON = "ADD_PERSON",
  UPDATE_PERSON = "UPDATE_PERSON",
  DELETE_PERSON = "DELETE_PERSON",
  SET_ERROR = "SET_ERROR",
}

export type PersonAction =
  | {
      type: ACTIONS.GET_ALL;
      payload: { persons: Person[] };
    }
  | {
      type: ACTIONS.GET_PERSON;
      payload: { person: Person };
    }
  | {
      type: ACTIONS.ADD_PERSON;
      payload: { person: Person };
    }
  | {
      type: ACTIONS.UPDATE_PERSON;
      payload: { person: Person };
    }
  | {
      type: ACTIONS.DELETE_PERSON;
      payload: { id: number };
    };

type DispatchPerson = (action: PersonAction) => void;

const BASE_URL = "/api/persons";

export default class PersonsApi {
  static async getAllPersons(dispatch: DispatchPerson) {
    const request = await axios.get<Person[]>(BASE_URL);
    dispatch({
      type: ACTIONS.GET_ALL,
      payload: { persons: request.data },
    });

    return request.data;
  }

  static async addPerson(
    newPerson: Omit<Person, "id">,
    dispatch: DispatchPerson
  ) {
    const request = await axios.post<Person>(BASE_URL, newPerson);
    dispatch({
      type: ACTIONS.ADD_PERSON,
      payload: { person: request.data },
    });

    return request.data;
  }

  static async updatePerson(
    id: number,
    updatedPerson: Person,
    dispatch: DispatchPerson
  ) {
    const request = await axios.put<Person>(`${BASE_URL}/${id}`, updatedPerson);
    dispatch({
      type: ACTIONS.UPDATE_PERSON,
      payload: { person: request.data },
    });

    return request.data;
  }

  static async deletePerson(id: number, dispatch: DispatchPerson) {
    const request = await axios.delete(`${BASE_URL}/${id}`);
    dispatch({
      type: ACTIONS.DELETE_PERSON,
      payload: { id },
    });

    return request.data;
  }
}
