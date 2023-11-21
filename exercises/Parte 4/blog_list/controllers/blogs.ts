import { Router, response } from "express";
import { Blog, BlogInterface } from "../models/blog";

const blogsRouter = Router();

blogsRouter.get("/", async (_, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (body.title && body.url) {
    const blog: BlogInterface = {
      ...body,
      likes: body.likes || 0,
    };

    const newBlog = await new Blog(blog).save();
    response.status(201).json(newBlog);
  }

  response.status(400).end();
});

export default blogsRouter;
