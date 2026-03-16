import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

/** Middleware that checks for a valid JWT with role === 'admin' */
export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        const token = authHeader.split(" ")[1];
        const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: string };

        if (decoded.role !== "admin") {
            res.status(403).json({ message: "Access denied — admin only" });
            return;
        }

        (req as any).user = decoded;
        next();
    } catch (error) {
        console.error("Admin auth error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
