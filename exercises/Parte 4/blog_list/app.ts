import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./utils/config";
import blogsRouter from "./controllers/blogs";
import userRouter from "./controllers/users";
import {
  errorHandler,
  tokenExtractor,
  unknownEndpoint,
  userExtractor,
} from "./utils/middleware";
import loginRouter from "./controllers/login";

mongoose.set("strictQuery", false);

mongoose.connect(config.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

app.use("/api/blogs", userExtractor, blogsRouter);
app.use("/api/users", userRouter);
app.use("/login", loginRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
