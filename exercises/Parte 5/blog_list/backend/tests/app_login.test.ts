import supertest from "supertest";
import { beforeEach, test, expect, describe } from "@jest/globals";
import app from "../app";
import { setInitialUsers } from "./utils";

const api = supertest(app);

beforeEach(async () => {
  await setInitialUsers();
});

describe("login should", () => {
  test("send a user information with a successful login", async () => {
    const user = {
      username: "root",
      password: "QW2UOk83XdZ79B4jWlXl",
    };

    const response = await api
      .post("/login")
      .send(user)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("username", "root");
    expect(response.body).toHaveProperty("name", "R. Oliver");
  }, 10000);

  test("send an error if user information is wrong", async () => {
    const user = {
      username: "root",
      password: "QW2UOk83XdZ79B4jWXl",
    };

    await api.post("/login").send(user).expect(401);
  });
});
