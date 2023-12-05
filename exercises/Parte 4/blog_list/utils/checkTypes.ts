import { isNull, isUndefined } from "lodash";

function isNewBlog(object: any): object is NewBlogData {
  if (isNull(object) || isUndefined(object)) return false;
  return object.title && object.url;
}

function isNewUser(object: any): object is NewUserData {
  if (isNull(object) || isUndefined(object)) return false;
  return object.username && object.password;
}

function isBlog(object: any): object is BlogQueryResponse {
  if (isNull(object) || isUndefined(object)) return false;
  return object.title && object.url && object.id && object.user;
}

function isUser(object: any): object is UserQueryResponse {
  if (isNull(object) || isUndefined(object)) return false;
  return object.username && object.name && object.id;
}

export { isNewBlog, isNewUser, isBlog, isUser };
