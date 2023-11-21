import { Blog, BlogInterface } from "../models/blog";

const initialBlogs: BlogInterface[] = [
  {
    author: "Marguerite Owen",
    likes: 36,
    title: "Internet and the industry",
    url: "http://aloogmum.ws/paftibfus",
  },
  {
    author: "Danny Wagner",
    likes: 12,
    title: "Malcolm in the middle",
    url: "http://ipdup.tf/ecijewkem",
  },
  {
    author: "Harry Carr",
    likes: 15,
    title: "Typescript in a nutshell",
    url: "http://pupinvi.ro/pijnug",
  },
];

const getBlogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

export { initialBlogs, getBlogsInDB };
