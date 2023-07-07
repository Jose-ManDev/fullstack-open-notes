import axios from "axios";

const BASE_URL = "http://localhost:3000/persons";

const getAll = () => {
  const request = axios.get<Person[]>(BASE_URL);
  return request.then((response) => response.data);
};

const create = (newPerson: Omit<Person, "id">) => {
  const request = axios.post<Person>(BASE_URL, newPerson);
  return request.then((response) => response.data);
};

const update = (id: number, updatedPerson: Person) => {
  const request = axios.put<Person>(`${BASE_URL}/${id}`, updatedPerson);
  return request.then((response) => response.data);
};

export default { getAll, create, update };
