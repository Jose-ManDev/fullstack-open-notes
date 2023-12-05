import supertest from "supertest";
import { beforeEach, test, expect, describe, beforeAll } from "@jest/globals";
import app from "../app";
import {
  initialUsers,
  getBlogsInDB,
  initialBlogs,
  setInitialBlogs,
  setInitialUsers,
} from "./utils";

const login = async (username: string, password: string) => {
  const response = await api.post("/login").send({
    username,
    password,
  });

  return response.body as { token: string; username: string; name: string };
};

const api = supertest(app);

beforeAll(async () => {
  await setInitialUsers();
});

beforeEach(async () => {
  await setInitialBlogs();
});

describe("fetching all blogs", () => {
  test("should return five blogs as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(5);
  });

  test("should return blogs without an _id property", async () => {
    const response = await api.get("/api/blogs");

    const blogs = response.body;

    if (Array.isArray(blogs)) {
      blogs.forEach((blog) => expect(blog).not.toHaveProperty("_id"));
    }
  });
});

describe("posting a blog should", () => {
  let credentials: { token: string; username: string; name: string };
  beforeAll(async () => {
    const user = await login(
      initialUsers[0].username,
      initialUsers[0].password
    );
    credentials = user;
  });

  test("add a valid blog", async () => {
    const blog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await getBlogsInDB();
    expect(blogs).toHaveLength(initialBlogs.length + 1);
  });

  test("should add 0 likes if likes property is missing", async () => {
    const blog = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    const response = await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const addedBlog = response.body;
    expect(addedBlog).toHaveProperty("likes", 0);
  });

  test("should answer with 400 BAD REQUEST if title or url properties are missing from request data", async () => {
    let blog: any = {
      author: "Grant Sanderson",
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(400);

    blog = {
      author: "Steven Strogatz",
      title:
        "Infinite Powers: How Calculus Reveals the Secrets of the Universe",
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(400);

    blog = {
      author: "James Stewart",
      url: "https://www.stewartcalculus.com/_update/19/home.html",
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(400);
  });
});

describe("deleting a blog should", () => {
  let credentials: { token: string; username: string; name: string };
  beforeAll(async () => {
    const user = await login(
      initialUsers[0].username,
      initialUsers[0].password
    );
    credentials = user;
  });

  test("delete a blog with a valid id", async () => {
    const blog = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    const response = await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(201);
    const newBlog = response.body;

    const id = newBlog.id;
    await api
      .delete(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${credentials.token}` })
      .expect(204);

    const blogs = await getBlogsInDB();
    expect(blogs).toHaveLength(initialBlogs.length);
  });

  test("respond with 401 UNAUTHORIZED if user is not the creator of the blog", async () => {
    const blog = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    const response = await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(201);
    const newBlog = response.body;

    const user = await login(
      initialUsers[2].username,
      initialUsers[2].password
    );

    const id = newBlog.id;
    await api
      .delete(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${user.token}` })
      .expect(401);
  });
});

describe("updating a blog should", () => {
  let credentials: { token: string; username: string; name: string };
  beforeAll(async () => {
    const user = await login(
      initialUsers[0].username,
      initialUsers[0].password
    );
    credentials = user;
  });

  test("return a blog with updated fields", async () => {
    let blog = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    let response = await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(201);
    const id = response.body.id;

    blog = {
      title: "TDD harms architecture and more",
      author: "Robert Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    response = await api
      .put(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(200);
    const updatedBlog = response.body;

    expect(updatedBlog).toHaveProperty("id", id);
    expect(updatedBlog).toHaveProperty(
      "title",
      "TDD harms architecture and more"
    );
    expect(updatedBlog).toHaveProperty("author", "Robert Martin");
  });

  test("not accept an invalid update", async () => {
    let blog: any = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    let response = await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(201);
    const id = response.body.id;

    blog = {
      author: "Robert Martin",
    };

    await api
      .put(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(400);
  });

  test("not accept update if user is not the creator of the blog", async () => {
    let blog = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    let response = await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${credentials.token}` })
      .send(blog)
      .expect(201);
    const id = response.body.id;

    blog = {
      title: "TDD harms architecture and more",
      author: "Robert Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    const user = await login(
      initialUsers[2].username,
      initialUsers[2].password
    );

    await api
      .put(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${user.token}` })
      .send(blog)
      .expect(401);
  });
});
