import { NextFunction, Request, Response } from "express";
const secretKey = process.env.SECRET_KEY;
export const checkAdminHeader = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const headerKey = res.getHeader("oauth2");
  if (!headerKey || headerKey !== secretKey)
    return res.status(403).send({ error: "Header key is missing/not correct" });
  next();
};
