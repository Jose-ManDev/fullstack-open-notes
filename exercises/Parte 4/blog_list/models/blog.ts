import { Schema, model } from "mongoose";

const blogSchema = new Schema<BlogSchema>({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    username: String,
    name: String,
    id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
});

blogSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    returnedObject.user = {
      username: returnedObject.username,
      name: returnedObject.name,
      id: returnedObject.user.id.toString(),
    };
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = model("Blog", blogSchema);

export default Blog;
