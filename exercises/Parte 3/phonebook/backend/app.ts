import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person";
import db from "mongoose";


const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("./dist"));
app.use(
  morgan(function (tokens, req, res) {
    if (req.method === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        JSON.stringify(req.body),
      ].join(" ");
    } else {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
      ].join(" ");
    }
  })
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(note => {
    response.json(note);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end();
  })
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.phone) {
    return response.status(400).json({
      error: "name or number are missing",
    });
  }

  const person = new Person({
    name: body.name,
    phone: body.phone,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  })
});

app.listen(PORT, () => {
  console.log(
    `[\x1b[36m server\x1b[0m ]: Server is running at\x1b[32m http://localhost:${PORT} \x1b[0m`
  );
});
