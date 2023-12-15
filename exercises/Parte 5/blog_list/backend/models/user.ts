import { Model, Schema, model, ObjectId } from "mongoose";

interface UserInterface extends Model<UserSchema> {
  isUsernameInUse: (username: string) => boolean;
}

type Blog = {
  title: string;
  url: string;
  id: ObjectId | string;
};

const blogSchema = new Schema<Blog>(
  {
    title: String,
    url: String,
    id: { type: Schema.Types.ObjectId, ref: "Blog" },
  },
  { _id: false }
);

const userSchema = new Schema<UserSchema>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
    },
    name: String,
    passwordHash: String,
    blogs: [blogSchema],
  },
  {
    statics: {
      async isUsernameInUse(username: string) {
        const user = await this.findOne({ username: username });
        return user;
      },
    },
  }
);

userSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    returnedObject.blogs = returnedObject.blogs.map((blog: Blog) => {
      blog.id = blog.id.toString();
      return blog;
    });
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User: UserInterface = model<UserSchema, UserInterface>(
  "User",
  userSchema
);

export default User;
