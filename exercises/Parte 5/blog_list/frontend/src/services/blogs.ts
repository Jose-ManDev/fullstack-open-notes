import axios from "axios";

const NODE_ENV = process.env.NODE_ENV;
const baseUrl =
  NODE_ENV !== "development" ? "/api/blogs" : "http://localhost:3003/api/blogs";

let userToken = "";

const setToken = (token: string) => {
  userToken = token;
};

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};

const create = async (newBlog: NewBlog) => {
  const config = {
    headers: { Authorization: `Bearer ${userToken}` },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const like = async (id: string, blog: Blog) => {
  const config = {
    headers: { Authorization: `Bearer ${userToken}` },
  };

  const likedBlog = {
    ...blog,
    likes: blog.likes + 1,
  };

  const response = await axios.put(`${baseUrl}/${id}`, likedBlog, config);
  return response.data;
};

export default { setToken, getAll, create, like };
