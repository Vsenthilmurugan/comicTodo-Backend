import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import HttpError from "../models/http-error";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
      if (!token) {
        return new Error("Authentication failed!");
      }
      const decodedToken = jwt.verify(token, "secretkey");
      next();
    } catch (err) {
      const error = new HttpError("Authentication failed!", 401);
      return next(error);
    }
  } else {
    return next(new HttpError("Authentication failed!", 401));
  }
};
