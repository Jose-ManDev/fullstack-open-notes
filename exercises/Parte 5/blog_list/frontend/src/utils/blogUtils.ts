function sortByLikes(blog: Blog, nextBlog: Blog) {
  if (blog.likes === nextBlog.likes) return 0;
  if (blog.likes < nextBlog.likes) return 1;
  return -1;
}

export default sortByLikes;
