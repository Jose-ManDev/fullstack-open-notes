import { NextFunction, Request, Response } from "express";
import { TypedRequestBody } from "../types/express";
import jwt, { JwtPayload } from "jsonwebtoken";

const tokenExtractor = (
  request: TypedRequestBody<any>,
  response: Response,
  next: NextFunction
) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.replace("Bearer ", "");
    request.token = token;
  }

  next();
};

const userExtractor = (
  request: TypedRequestBody<any>,
  response: Response,
  next: NextFunction
) => {
  if (!request.token) return next();

  const decodedToken = jwt.verify(
    request.token,
    process.env.SECRET || ""
  ) as JwtPayload;

  request.user = decodedToken;
  next();
};

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "malformed id" });
    case "ValidationError":
      return response.status(400).json({ error: error.message });
    case "JsonWebToken":
      return response.status(401).json({ error: error.message });
  }

  next(error);
};

export { tokenExtractor, userExtractor, unknownEndpoint, errorHandler };
