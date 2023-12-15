import { FormEvent, useState } from "react";
import accountService from "../services/account";
import Logger from "../utils/logger";
import { useUser, useUserUpdate } from "../context/userContext";
import { useCreateNotification } from "../context/notificationContext";
import { isUser } from "../utils/checkType";
import { AxiosError } from "axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useUser();
  const dispatchUser = useUserUpdate();
  const createNotification = useCreateNotification();

  if (!dispatchUser) throw new ReferenceError("dispatchUser is not assigned");
  if (!createNotification)
    throw new ReferenceError("createNotification is not assigned");

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
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  ) : (
    <form onSubmit={handleLogin}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
