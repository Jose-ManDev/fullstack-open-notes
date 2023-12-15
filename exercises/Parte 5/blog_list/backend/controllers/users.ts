import { Router } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { TypedRequestBody } from "../types/express";
import { isNewUser } from "../utils/checkTypes";

const userRouter = Router();

userRouter.get("/", async (_, response) => {
  const users = await User.find({});
  response.json(users);
});

userRouter.post(
  "/",
  async (request: TypedRequestBody<NewUserData>, response, next) => {
    try {
      const body = request.body;

      if (!isNewUser(body)) {
        return response
          .status(400)
          .send({ error: "request should have username and password" });
      }

      const isUsernameInUse = await User.isUsernameInUse(body.username);

      if (isUsernameInUse) {
        return response
          .status(400)
          .send({ error: "username should be unique" });
      }

      if (body.username.length < 3 || body.password.length < 3) {
        return response.status(400).send({
          error: "username and password should have at least 3 characters",
        });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(body.password, saltRounds);

      const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
      });

      const savedUser = await user.save();
      response.status(201).json(savedUser);
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
