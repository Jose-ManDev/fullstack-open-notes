import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import BlogForm from "./BlogForm";
import blogService from "../services/blogs";
import List from "../components/List";
import Togglable from "../components/Togglable";
import Button from "../components/Button";
import sortByLikes from "../utils/blogUtils";

function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const user = useUser();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs.sort(sortByLikes));
    });
  }, []);

  const handleCreate = (blog: Blog) => {
    setBlogs(blogs.concat(blog).sort(sortByLikes));
  };

  const handleLike = (id: string, blog: Blog) => {
    blogService.like(id, blog).then((updatedBlog) => {
      setBlogs(
        blogs
          .map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
          .sort(sortByLikes)
      );
    });
  };

  const handleRemove = (id: string, blog: Blog) => {
    if (window.confirm(`Remove blog ${blog.title} from ${blog.author}?`)) {
      blogService.remove(id).finally(() => {
        setBlogs(blogs.filter((blog) => blog.id !== id));
      });
    }
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
          <Blog
            key={blog.id}
            blog={blog}
            onLike={handleLike}
            onRemove={handleRemove}
          />
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
  onRemove,
}: {
  blog: Blog;
  onLike: (id: string, blog: Blog) => void;
  onRemove: (id: string, blog: Blog) => void;
}) => {
  const user = useUser();

  const isUserOwned = blog.user.name === user?.name;
  return (
    <li>
      {blog.title} {blog.author}
      {isUserOwned && (
        <Button onClick={() => onRemove(blog.id, blog)}>Delete</Button>
      )}
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
