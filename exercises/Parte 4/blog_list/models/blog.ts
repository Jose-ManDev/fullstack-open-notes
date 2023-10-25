import { Schema, model } from "mongoose";

const blogSchema = new Schema<Blog>({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = model("Blog", blogSchema);

export default Blog;
