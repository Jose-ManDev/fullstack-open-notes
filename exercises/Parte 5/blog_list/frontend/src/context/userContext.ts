import { createContext, useContext, Dispatch } from "react";

type DispatchUser = Dispatch<
  { type: "LOGIN"; payload: User } | { type: "LOGOUT" }
>;

const UserContext = createContext<User | null>(null);
const UserUpdateContext = createContext<DispatchUser | null>(null);

function useUser() {
  const userContext = useContext(UserContext);

  return userContext;
}

function useUserUpdate() {
  const userUpdateContext = useContext(UserUpdateContext);

  if (!userUpdateContext)
    throw new ReferenceError(
      "useUserUpdate should be used within the scope of a UserProvider component"
    );
  return userUpdateContext;
}

export { UserContext, UserUpdateContext, useUser, useUserUpdate };
