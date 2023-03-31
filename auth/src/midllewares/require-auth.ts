import { Request, Response, NextFunction } from "express";
import { NotAUthorizedError } from "../errors/notAuthorizedError";


export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) throw new NotAUthorizedError();

  next();
}