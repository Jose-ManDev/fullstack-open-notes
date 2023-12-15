import { ReactNode, useReducer, useEffect } from "react";
import { UserContext, UserUpdateContext } from "../context/userContext";
import { isUser } from "../utils/checkType";
import blogService from "../services/blogs";

type UserProviderProps = {
  children: ReactNode;
};

type Actions =
  | {
      type: "LOGIN";
      payload: User;
    }
  | { type: "LOGOUT" };

const userReducer = (state: User | null, action: Actions) => {
  switch (action.type) {
    case "LOGIN": {
      window.localStorage.setItem("loggedUser", JSON.stringify(action.payload));
      blogService.setToken(action.payload.token);
      return action.payload;
    }
    case "LOGOUT": {
      window.localStorage.removeItem("loggedUser");
      return null;
    }
    default:
      return null;
  }
};

function UserProvider({ children }: UserProviderProps) {
  const [user, dispatchUser] = useReducer(userReducer, null);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (!loggedUser) return;

    const loggedUserJSON = JSON.parse(loggedUser);

    if (!isUser(loggedUserJSON)) return;

    dispatchUser({ type: "LOGIN", payload: loggedUserJSON });
  }, []);

  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={dispatchUser}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}

export default UserProvider;
