import { Request } from "express";

export interface TypedRequestBody<T> extends Request {
  token?: string;
  user?: Record<string, any>;
  body: T;
}
