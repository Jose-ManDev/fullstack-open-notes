import { Model, Schema, model, ObjectId } from "mongoose";

interface UserInterface extends Model<UserSchema> {
  isUsernameInUse: (username: string) => boolean;
}

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
    blogs: [
      {
        title: String,
        url: String,
        id: { type: Schema.Types.ObjectId, ref: "Blog" },
      },
    ],
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
    returnedObject.blogs = returnedObject.blogs.map((blog: ObjectId) =>
      blog.toString()
    );
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
