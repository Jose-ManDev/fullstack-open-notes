import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./utils/config";
import blogsRouter from "./controllers/blogs";

mongoose.set("strictQuery", false);

mongoose.connect(config.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

export default app;
