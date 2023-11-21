import { Schema, model } from "mongoose";

interface BlogInterface {
  title: string;
  author: string;
  url: string;
  likes: number;
}

const blogSchema = new Schema<BlogInterface>({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = model("Blog", blogSchema);

export { Blog, BlogInterface };
