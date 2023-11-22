import supertest from "supertest";
import { beforeEach, test, expect, describe } from "@jest/globals";
import app from "../app";
import { Blog } from "../models/blog";
import { getBlogsInDB, initialBlogs } from "./utils";

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogs = initialBlogs.map((blog) => new Blog(blog));

  await Promise.all(blogs.map((blog) => blog.save()));
});

describe("fetching all blogs", () => {
  test("should return blogs as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("should return three blogs", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(3);
  });

  test("should not return blogs with an _id property", async () => {
    const response = await api.get("/api/blogs");

    const blogs = response.body;

    if (Array.isArray(blogs)) {
      blogs.forEach((blog) => expect(blog).not.toHaveProperty("_id"));
    }
  });
});

describe("posting a blog", () => {
  test("should add a valid blog", async () => {
    const blog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    };

    await api
      .post("/api/blogs")
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

    await api.post("/api/blogs").send(blog).expect(400);

    blog = {
      author: "Steven Strogatz",
      title:
        "Infinite Powers: How Calculus Reveals the Secrets of the Universe",
    };

    await api.post("/api/blogs").send(blog).expect(400);

    blog = {
      author: "James Stewart",
      url: "https://www.stewartcalculus.com/_update/19/home.html",
    };

    await api.post("/api/blogs").send(blog).expect(400);
  });
});

describe("deleting a blog", () => {
  test("should delete a blog with a valid id", async () => {
    const blog = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    const response = await api.post("/api/blogs").send(blog).expect(201);
    const newBlog = response.body;

    let blogs = await getBlogsInDB();
    expect(blogs).toHaveLength(initialBlogs.length + 1);

    const id = newBlog.id;
    await api.delete(`/api/blogs/${id}`).expect(204);

    blogs = await getBlogsInDB();
    expect(blogs).toHaveLength(initialBlogs.length);
  });
});

describe("updating a blog", () => {
  test("should return a blog with updated fields", async () => {
    let blog = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    let response = await api.post("/api/blogs").send(blog).expect(201);
    const id = response.body.id;

    blog = {
      title: "TDD harms architecture and more",
      author: "Robert Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    response = await api.put(`/api/blogs/${id}`).send(blog).expect(200);
    const updatedBlog = response.body;

    expect(updatedBlog).toHaveProperty("id", id);
    expect(updatedBlog).toHaveProperty(
      "title",
      "TDD harms architecture and more"
    );
    expect(updatedBlog).toHaveProperty("author", "Robert Martin");
  });

  test("should not accept an invalid update", async () => {
    let blog: any = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    let response = await api.post("/api/blogs").send(blog).expect(201);
    const id = response.body.id;

    blog = {
      author: "Robert Martin",
    };

    await api.put(`/api/blogs/${id}`).send(blog).expect(400);
  });
});
