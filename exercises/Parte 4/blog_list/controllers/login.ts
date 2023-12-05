import { Router } from "express";
import User from "../models/user";
import { TypedRequestBody } from "../types/express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginRouter = Router();

loginRouter.post(
  "/",
  async (request: TypedRequestBody<UserLogin>, response) => {
    const body = request.body;

    const { username, password } = body;

    const user = await User.findOne({ username });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        username,
        id: user.id,
      },
      process.env.SECRET || ""
    );

    response.status(200).send({ token, username, name: user.name });
  }
);

export default loginRouter;
