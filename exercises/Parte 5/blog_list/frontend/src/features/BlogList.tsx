import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import BlogForm from "./BlogForm";
import blogService from "../services/blogs";
import List from "../components/List";
import Togglable from "../components/Togglable";

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
      {user ? (
        <Togglable buttonLabel="Create new note">
          <BlogForm onCreate={handleCreate} />
        </Togglable>
      ) : null}
      <List
        listType="ul"
        list={blogs}
        mapList={(blog) => <Blog key={blog.id} blog={blog} />}
      >
        Blogs
      </List>
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
