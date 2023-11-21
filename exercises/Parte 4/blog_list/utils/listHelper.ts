import { Dictionary, countBy, maxBy, toPairs } from "lodash";
import { reduce } from "lodash/";
import { BlogInterface } from "../models/blog";

const dummy = (blogs: BlogInterface[]) => {
  return 1;
};

const totalLikes = (blogs: BlogInterface[]) => {
  const sumLikes = (sum: number, blog: BlogInterface) => sum + blog.likes;
  return blogs.reduce(sumLikes, 0);
};

const favoriteBlog = (blogs: BlogInterface[]) => {
  if (blogs.length === 0) return;

  const getFavorite = (favorite: BlogInterface, currentBlog: BlogInterface) =>
    favorite.likes > currentBlog.likes ? favorite : currentBlog;

  return blogs.reduce(getFavorite);
};

const mostBlogs = (blogs: BlogInterface[]) => {
  if (blogs.length === 0) return;
  const authors = countBy(blogs, (blog: BlogInterface) => blog.author);
  const authorsArray = toPairs(authors);

  const mostBlogsAuthor = maxBy(
    authorsArray,
    (author: [string, number]) => author[1]
  );

  if (mostBlogsAuthor)
    return { author: mostBlogsAuthor[0], blogs: mostBlogsAuthor[1] };
};

const mostLikes = (blogs: BlogInterface[]) => {
  if (blogs.length === 0) return;

  const authors = reduce(
    blogs,
    (authors: Dictionary<number>, current) => {
      authors[current.author] ??= 0;
      authors[current.author] += current.likes;

      return authors;
    },
    {}
  );

  const authorsArray = toPairs(authors);
  const mostLikedAuthor = maxBy(
    authorsArray,
    (author: [string, number]) => author[1]
  );

  if (mostLikedAuthor)
    return {
      author: mostLikedAuthor[0],
      likes: mostLikedAuthor[1],
    };
};

export { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
