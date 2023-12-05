import supertest from "supertest";
import { beforeEach, test, expect, describe } from "@jest/globals";
import app from "../app";
import { setInitialBlogs, setInitialUsers } from "./utils";

const api = supertest(app);

beforeEach(async () => {
  await setInitialUsers();
  await setInitialBlogs();
});

describe("getting all users should", () => {
  test("returns three users", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const users = response.body;

    expect(users).toHaveLength(3);
  });
});

describe("posting a user should", () => {
  beforeEach(async () => {
    await setInitialUsers();
  });

  test("allow you to create a new user if name is different", async () => {
    const user = {
      username: "Donald Snyder",
      name: "D. Snyder",
      password: "avFIFfHtWKS9RTbO",
    };

    await api
      .post("/api/users")
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("send an error if user has the same username", async () => {
    const user = {
      username: "root",
      name: "S. Myers",
      password: "rIP3hjlypjStC",
    };

    await api
      .post("/api/users")
      .send(user)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("send and error if username or password has less than three characters", async () => {
    let user = {
      username: "Xi",
      name: "Xi Chang",
      password: "#wegW$RTFv243",
    };

    await api.post("/api/users").send(user).expect(400);

    user = {
      username: "Arthur Pedragon",
      name: "Pencilgon",
      password: "c4",
    };

    await api.post("/api/users").send(user).expect(400);
  });
});
