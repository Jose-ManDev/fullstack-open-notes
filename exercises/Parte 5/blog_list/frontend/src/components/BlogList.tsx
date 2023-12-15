import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import BlogForm from "./BlogForm";
import blogService from "../services/blogs";

function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const user = useUser();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs);
    });
  }, []);

  const handleCreate = (blog: Blog) => {
    setBlogs(blogs.concat(blog));
  };

  return (
    <div>
      {user ? <BlogForm onCreate={handleCreate} /> : null}
      <ul>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </ul>
    </div>
  );
}

const Blog = ({ blog }: { blog: Blog }) => {
  return (
    <li>
      {blog.title} {blog.user.name}
    </li>
  );
};

export default BlogList;
