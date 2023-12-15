import Blog from "../models/blog";
import User from "../models/user";
import bcrypt from "bcrypt";

type NewUserData = {
  username: string;
  name: string;
  password: string;
};

type NewBlogData = {
  title: string;
  url: string;
  likes?: number;
};

type Blog = {
  title: string;
  url: string;
  likes: number;
  user: string;
};

type User = {
  username: string;
  name: string;
  blogs: string[];
};

const initialUsers: NewUserData[] = [
  {
    username: "root",
    name: "R. Oliver",
    password: "QW2UOk83XdZ79B4jWlXl",
  },
  {
    username: "Nora May",
    name: "Noma",
    password: "lhGDNEYU",
  },
  {
    username: "Jerry Hill",
    name: "Jerry the Hill",
    password: "cJPRKqCDxZZ71R",
  },
];

const initialBlogs: (NewBlogData & { user: string })[] = [
  {
    title: "Internet and the industry",
    url: "http://ohiwi.pn/tub",
    likes: 12,
    user: "root",
  },
  {
    title: "Malcolm in the middle",
    url: "http://muvo.pt/poiho",
    likes: 0,
    user: "root",
  },
  {
    title: "Typescript in a nutshell",
    url: "http://lokfaw.mr/va",
    likes: 25,
    user: "Jerry Hill",
  },
  {
    title: "C++ and C",
    url: "http://dar.no/kecozij",
    likes: 345,
    user: "Jerry Hill",
  },
  {
    title: "The advanced AI of the future",
    url: "http://ek.th/suk",
    likes: 98,
    user: "Jerry Hill",
  },
];

const setInitialUsers = async () => {
  await User.deleteMany({});

  const users: Array<Omit<NewUserData, "password"> & { passwordHash: string }> =
    [];
  for (let user of initialUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const hashedUser = {
      username: user.username,
      name: user.name,
      passwordHash,
    };

    users.push(hashedUser);
  }

  const userPromises = users.map((user) => new User(user));

  await Promise.all(userPromises.map((user) => user.save()));
};

const setInitialBlogs = async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogs) {
    const response = await User.findOne({ username: blog.user });
    const { id } = response?.toJSON() as { id: string };

    const blogItem = new Blog({
      title: blog.title,
      likes: blog.likes,
      url: blog.url,
      user: {
        username: blog.user,
        name: initialUsers.find((user) => user.username === blog.user)?.name,
        id,
      },
    });

    const savedBlog = await blogItem.save();

    const user = await User.findById(id);

    if (user) {
      user.blogs = user.blogs.concat({
        title: savedBlog.title,
        url: savedBlog.url,
        id: savedBlog.id,
      });
      await user.save();
    }
  }
};

const getBlogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const getUsersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const isBlog = (object: any): object is Blog => {
  return object.title && object.url && object.likes && object.user;
};

const isUser = (object: any): object is User => {
  return object.username && object.name && object.blogs;
};

export {
  initialUsers,
  initialBlogs,
  setInitialUsers,
  setInitialBlogs,
  getBlogsInDB,
  getUsersInDB,
  isBlog,
  isUser,
};
