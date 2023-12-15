import { createContext, useContext, Dispatch } from "react";

type DispatchUser = Dispatch<
  { type: "LOGIN"; payload: User } | { type: "LOGOUT" }
>;

const UserContext = createContext<User | null>(null);
const UserUpdateContext = createContext<DispatchUser | null>(null);

function useUser() {
  return useContext(UserContext);
}

function useUserUpdate() {
  return useContext(UserUpdateContext);
}

export { UserContext, UserUpdateContext, useUser, useUserUpdate };
