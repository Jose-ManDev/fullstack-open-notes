import axios from "axios";

const NODE_ENV = process.env.NODE_ENV;
const baseUrl =
  NODE_ENV !== "development" ? "/login" : "http://localhost:3003/login";

type Credentials = {
  username: string;
  password: string;
};

const login = async (credentials: Credentials) => {
  const request = await axios.post(baseUrl, credentials);

  return request.data;
};

export default { login };
