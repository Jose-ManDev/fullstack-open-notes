import { FormEvent, useState } from "react";
import accountService from "../services/account";
import Logger from "../utils/logger";
import { useUser, useUserUpdate } from "../context/userContext";
import { useCreateNotification } from "../context/notificationContext";
import { isUser } from "../utils/checkType";
import { AxiosError } from "axios";
import Button from "../components/Button";
import Input from "../components/Input";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useUser();
  const dispatchUser = useUserUpdate();
  const createNotification = useCreateNotification();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const loggedUser = await accountService.login({ username, password });

      if (!isUser(loggedUser))
        throw new TypeError("server response is not a user");

      dispatchUser({ type: "LOGIN", payload: loggedUser });
      createNotification.success(`Logged as ${loggedUser.name}`);

      setUsername("");
      setPassword("");
    } catch (exception) {
      if (exception instanceof AxiosError) {
        Logger.error(exception.message);
        if (exception.response?.status === 401) {
          createNotification.error("Wrong password or username");
        } else {
          createNotification.error(exception.message);
        }
      }
    }
  };

  const handleLogout = () => {
    dispatchUser({ type: "LOGOUT" });
    createNotification.success("Logged out");
  };

  return user ? (
    <div>
      Logged as {user.name}
      <Button type="button" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  ) : (
    <form onSubmit={handleLogin}>
      <Input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      >
        Username
      </Input>
      <Input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      >
        Password
      </Input>
      <Button type="submit">Log in</Button>
    </form>
  );
};

export default LoginForm;
