import { Response, Request, NextFunction } from "express";
import Jwt from "jsonwebtoken";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const authuser = req.headers.authorization
    if (!authuser) {
      return res.status(401).json(`token is not provide !`)
    }

    const token = authuser.split(" ")[1];
    const decoded = Jwt.verify(token, process.env.JWT_SECRET as string);

    (req as any).user = decoded
    next();

  } catch (error) {
    console.log(`user is not authorized: ${error}`)
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
