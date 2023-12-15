import { FormEvent, useState } from "react";
import blogService from "../services/blogs";
import { useCreateNotification } from "../context/notificationContext";

type BlogFormProps = {
  onCreate: (blog: Blog) => void;
};

function BlogForm({ onCreate }: BlogFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const createNotification = useCreateNotification();

  if (!createNotification)
    throw new ReferenceError("createNotification is not assigned");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    blogService
      .create({ title, url })
      .then((blog) => {
        onCreate(blog);
        createNotification.success(`A new blog "${title}" was added`);
      })
      .catch((error) => {
        if (error instanceof Error) {
          createNotification.error(error.message);
        }
      })
      .finally(() => {
        setTitle("");
        setUrl("");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title: </label>
      <input
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="url">URL:</label>
      <input
        type="text"
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button type="submit">Create</button>
    </form>
  );
}

export default BlogForm;
