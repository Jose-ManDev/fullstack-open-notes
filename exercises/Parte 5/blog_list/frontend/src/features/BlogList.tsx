import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import BlogForm from "./BlogForm";
import blogService from "../services/blogs";
import List from "../components/List";
import Togglable from "../components/Togglable";
import Button from "../components/Button";

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

  const handleLike = (id: string, blog: Blog) => {
    blogService.like(id, blog).then((updatedBlog) => {
      setBlogs(
        blogs.map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
      );
    });
  };

  return (
    <div>
      {user ? (
        <Togglable buttonLabel="Create new note">
          <BlogForm onCreate={handleCreate} />
        </Togglable>
      ) : null}
      <List
        listType="ul"
        list={blogs}
        mapList={(blog) => (
          <Blog key={blog.id} blog={blog} onLike={handleLike} />
        )}
      >
        Blogs
      </List>
    </div>
  );
}

const Blog = ({
  blog,
  onLike,
}: {
  blog: Blog;
  onLike: (id: string, blog: Blog) => void;
}) => {
  return (
    <li>
      {blog.title} {blog.author}
      <Togglable buttonLabel="show details">
        <ul>
          <li>{blog.url}</li>
          <li>
            {blog.likes}{" "}
            <Button onClick={() => onLike(blog.id, blog)}>like</Button>
          </li>
          <li>{blog.user.name}</li>
        </ul>
      </Togglable>
    </li>
  );
};

export default BlogList;
