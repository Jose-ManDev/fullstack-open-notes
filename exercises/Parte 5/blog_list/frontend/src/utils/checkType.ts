import { isObject } from "lodash";

function isUser(object: unknown): object is User {
  if (!isObject(object)) return false;
  return "token" in object && "username" in object && "name" in object;
}

export { isUser };
