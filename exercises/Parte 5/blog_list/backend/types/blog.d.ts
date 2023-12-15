interface BlogSchema {
  title: string;
  author: string;
  url: string;
  likes: number;
  user: {
    username: string;
    name: string;
    id: string;
  };
}

type NewBlogData = {
  title: string;
  url: string;
  likes?: number;
};

type BlogQueryResponse = {
  title: string;
  url: string;
  likes: number;
  id: string;
  user: {
    username: string;
    name: string;
    id: string;
  };
};
