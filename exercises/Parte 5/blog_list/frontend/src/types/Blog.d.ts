type Blog = {
  title: string;
  url: string;
  author: string;
  likes: number;
  id: string;
  user: {
    username: string;
    name: string;
    id: string;
  };
};

type NewBlog = {
  title: string;
  url: string;
  author: string;
};
