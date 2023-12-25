import { Request, Router } from "express";
import Blog from "../models/blog";
import { TypedRequestBody } from "../types/express";
import { isBlog, isNewBlog, isUser } from "../utils/checkTypes";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";

const getIdFrom = (token: string | null): string => {
  if (token === null) return "";

  const decodedToken = jwt.verify(
    token,
    process.env.SECRET || ""
  ) as JwtPayload;

  return decodedToken.id;
};

const blogsRouter = Router();

blogsRouter.get("/", async (_, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post(
  "/",
  async (request: TypedRequestBody<NewBlogData>, response) => {
    const body = request.body;

    const userData = request.user;

    if (!userData || !userData.id)
      return response.status(401).json({ error: "invalid id" });

    const user = await User.findById(userData.id);

    if (isNewBlog(body) && isUser(user)) {
      const blog = {
        title: body.title,
        url: body.url,
        author: body.author,
        likes: body.likes || 0,
        user: {
          username: user.username,
          name: user.name,
          id: user.id,
        },
      };

      const newBlog = await new Blog(blog).save();

      user.blogs = user.blogs.concat({
        title: newBlog.title,
        url: newBlog.url,
        id: newBlog.id,
      });
      await user.save();
      return response.status(201).json(newBlog);
    }

    response.status(400).end();
  }
);

blogsRouter.delete("/:id", async (request: TypedRequestBody<any>, response) => {
  const id = request.params.id;

  const userData = request.user;

  const blog = await Blog.findById(id);

  if (!isBlog(blog)) return response.status(204).end();

  if (!userData || blog.user.id.toString() !== userData.id)
    return response.status(401).json({ error: "invalid user id" });

  await blog.deleteOne();

  const user = await User.findById(userData.id);
  if (isUser(user)) {
    user.blogs = user.blogs.filter((blog) => blog.id !== id);

    await user.save();
  }

  response.status(204).end();
});

blogsRouter.put(
  "/:id",
  async (request: TypedRequestBody<NewBlogData>, response) => {
    const id = request.params.id;
    const body = request.body;

    const userData = request.user;

    const blog = await Blog.findById(id);

    if (!userData || !isBlog(blog))
      return response.status(400).json({ error: "invalid blog id" });

    if (blog?.user.id.toString() !== userData.id)
      return response.status(401).json({ error: "invalid user id" });

    if (isNewBlog(body)) {
      const blog = {
        ...body,
        likes: body.likes || 0,
      };

      const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
        new: true,
      });

      const user = await User.findById(userData.id);
      if (isUser(user) && isBlog(updatedBlog)) {
        user.blogs = user.blogs.map((blog) =>
          blog.id !== id
            ? blog
            : {
                title: updatedBlog?.title,
                url: updatedBlog?.url,
                id: updatedBlog?.id,
              }
        );

        await user.save();
      }

      return response.json(updatedBlog);
    }

    response.status(400).end();
  }
);

export default blogsRouter;
