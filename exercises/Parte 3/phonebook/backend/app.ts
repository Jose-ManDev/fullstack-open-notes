import { Request, Response } from "express";
import { initialPersons } from "./public/persons";
import { log } from "console";

const dotenv = require("dotenv");
const express = require("express");
let persons: Person[] = initialPersons;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/api/persons", (request: Request, response: Response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request: Request, response: Response) => {
  const ID = Number(request.params.id);
  const person = persons.find((person) => person.id === ID);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end("Person not found");
  }
});

app.get("/info", (request: Request, response: Response) => {
  response.send(
    `<div><p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date()}</p></div>`
  );
});

app.delete("/api/persons/:id", (request: Request, response: Response) => {
  const ID = Number(request.params.id);
  persons = persons.filter((person) => person.id !== ID);

  response.status(204).end();
});

app.listen(PORT, () => {
  console.log(
    `[\x1b[36m server\x1b[0m ]: Server is running at\x1b[32m http://localhost:${PORT} \x1b[0m`
  );
});
