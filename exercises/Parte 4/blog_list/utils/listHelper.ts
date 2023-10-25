import { Dictionary, countBy, maxBy, toPairs } from "lodash";
import { reduce } from "lodash/";

const dummy = (blogs: Blog[]) => {
  return 1;
};

const totalLikes = (blogs: Blog[]) => {
  const sumLikes = (sum: number, blog: Blog) => sum + blog.likes;
  return blogs.reduce(sumLikes, 0);
};

const favoriteBlog = (blogs: Blog[]) => {
  if (blogs.length === 0) return;

  const getFavorite = (favorite: Blog, currentBlog: Blog) =>
    favorite.likes > currentBlog.likes ? favorite : currentBlog;

  return blogs.reduce(getFavorite);
};

const mostBlogs = (blogs: Blog[]) => {
  if (blogs.length === 0) return;
  const authors = countBy(blogs, (blog: Blog) => blog.author);
  const authorsArray = toPairs(authors);

  const mostBlogsAuthor = maxBy(
    authorsArray,
    (author: [string, number]) => author[1]
  );

  if (mostBlogsAuthor)
    return { author: mostBlogsAuthor[0], blogs: mostBlogsAuthor[1] };
};

const mostLikes = (blogs: Blog[]) => {
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
