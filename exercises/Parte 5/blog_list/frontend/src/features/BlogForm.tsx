import { FormEvent, useState } from "react";
import blogService from "../services/blogs";
import { useCreateNotification } from "../context/notificationContext";
import Input from "../components/Input";
import Button from "../components/Button";

type BlogFormProps = {
  onCreate: (blog: Blog) => void;
};

function BlogForm({ onCreate }: BlogFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [author, setAuthor] = useState("");

  const createNotification = useCreateNotification();

  if (!createNotification)
    throw new ReferenceError("createNotification is not assigned");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    blogService
      .create({ title, url, author })
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
      <Input
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      >
        Title
      </Input>
      <Input
        type="text"
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      >
        URL
      </Input>
      <Input
        type="text"
        required
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      >
        Author
      </Input>
      <Button type="submit">Create</Button>
    </form>
  );
}

export default BlogForm;
