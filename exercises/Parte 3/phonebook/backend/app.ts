import { Request, Response } from "express";
import { persons } from "./public/persons";
import { log } from "console";

const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/api/persons", (request: Request, response: Response) => {
  response.json(persons);
});

app.listen(PORT, () => {
  console.log(
    `[\x1b[36m server\x1b[0m ]: Server is running at\x1b[32m http://localhost:${PORT} \x1b[0m`
  );
});
