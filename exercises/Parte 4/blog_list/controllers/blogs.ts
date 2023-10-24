import { Router, response } from "express";
import Blog from "../models/blog";

const blogsRouter = Router();

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(204).json(result);
  });
});

export default blogsRouter;
