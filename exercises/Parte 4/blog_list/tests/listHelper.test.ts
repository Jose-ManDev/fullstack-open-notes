import {
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes,
} from "../utils/listHelper";
import { test, expect, describe } from "@jest/globals";

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

describe("Dummy function", () => {
  test("should return 1", () => {
    const result = dummy(blogs);

    expect(result).toBe(1);
  });
});

describe("totalLikes", () => {
  test("should return 0 with empty array", () => {
    expect(totalLikes([])).toBe(0);
  });

  test("should return total likes of blogs", () => {
    expect(totalLikes(blogs)).toBe(36);
  });
});

describe("favoriteBlog", () => {
  test("should return undefined with empty list", () => {
    expect(favoriteBlog([])).toBe(undefined);
  });

  test("should return blog with most likes", () => {
    expect(favoriteBlog(blogs)).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    });
  });
});

describe("mostBlogs", () => {
  test("should return undefined with an empty array", () => {
    expect(mostBlogs([])).toBeUndefined();
  });

  test("should return the author who has the largest amount of blogs", () => {
    expect(mostBlogs(blogs)).toEqual({ author: "Robert C. Martin", blogs: 3 });
  });
});

describe("mostLikes", () => {
  test("should return undefined with an empty array", () => {
    expect(mostLikes([])).toBeUndefined();
  });

  test("should return the authow who hast the most likes", () => {
    expect(mostLikes(blogs)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
