interface UserSchema {
  username: string;
  name: string;
  passwordHash: string;
  blogs: Array<{
    title: string;
    url: string;
    id: string;
  }>;
}

type NewUserData = {
  username: string;
  name: string;
  password: string;
};

type UserQueryResponse = {
  username: string;
  name: string;
  id: string;
};

type UserLogin = {
  username: string;
  password: string;
};

type UserToken = {
  id: string;
  username: string;
};
